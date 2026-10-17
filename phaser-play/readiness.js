/* P.O.R.C.A.R.I.A. — Quadro de prontidão da oficina v0.8.5.
 * Diagnóstico consultivo, determinístico, sem alterar o save.
 * Limiares são regras de jogo, NÃO critérios de saúde ocupacional.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_READINESS=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const HH_PER_MECHANIC=10.5;
 const ENERGY_CRITICAL=25,ENERGY_ATTENTION=45;
 const MORALE_CRITICAL=25,MORALE_ATTENTION=40;
 const PRIORITY={critical:0,blocked:1,attention:2,information:3};
 const formatName=(obj,id)=>obj?.name||id||'Não identificado';
 const num=n=>Number.isFinite(Number(n))?Number(n):0;
 function compute(state,data){
  if(!state||!Array.isArray(state.jobs)||!Array.isArray(state.team)||!data||
   !Array.isArray(data.scenarios)||!Array.isArray(data.models))
   throw new Error('Estado inválido para quadro de prontidão');
  const count=Number.isInteger(state.bays)&&state.bays>0?state.bays:3;
  const tick=Number(state.tick)||0;
  const crewById=new Map(state.team.map(m=>[m.id,m]));
  const scenarioById=new Map(data.scenarios.map(c=>[c.id,c]));
  const modelById=new Map(data.models.map(m=>[m.id,m]));
  const jobsAssigned=state.jobs.filter(j=>j.assigned&&Number.isInteger(j.bay)&&j.bay>=0&&j.bay<count);
  const assignedByBay=new Map(jobsAssigned.map(j=>[j.bay,j]));
  const busyById=new Map(jobsAssigned.map(j=>[j.assigned,j]));
  const crew=state.team.map(m=>{
   const job=busyById.get(m.id),resting=m.restAt===tick;
   const mental=num(m.mental),physical=num(m.physical),morale=num(m.morale);
   const health=Math.min(mental,physical);
   const critical=health<ENERGY_CRITICAL||morale<MORALE_CRITICAL;
   const attention=health<ENERGY_ATTENTION||morale<MORALE_ATTENTION;
   return {id:m.id,name:m.name,role:m.role,mental,physical,morale,
    busy:!!job,jobId:job?.id||null,resting,
    status:critical?'critical':attention?'attention':'ok',
    reason:health<ENERGY_CRITICAL?'Energia física/mental crítica':
     morale<MORALE_CRITICAL?'Moral crítica':
     health<ENERGY_ATTENTION?'Energia física/mental em atenção':
     morale<MORALE_ATTENTION?'Moral em atenção':'Sem alerta de energia/moral',
    // Não disponibilizar descanso com profissional alocado; o motor exige liberar primeiro.
    canRest:!job&&!resting};
  });
  const scenarios=(data.scenarios||[]);
  const bays=Array.from({length:count},(_,id)=>{
   const j=assignedByBay.get(id);
   if(!j)return {id,kind:'free',label:'LIVRE',jobId:null,model:null,mechanic:null,blocker:null,stockItem:null,stages:null};
   const c=scenarioById.get(j.scene);
   const mech=crewById.get(j.assigned);
   let kind='diagnosis',blocker=null,stockItem=null;
   if(!c){kind='unknown';blocker='Dados do serviço não encontrados'}
   else if(!state.tools?.[c.tool]){kind='tool';stockItem=c.tool;blocker='Ferramenta: '+formatName(data.tools?.[c.tool],c.tool)}
   else if(j.stage>=6&&!j.materialUsed&&!(num(state.stock?.[c.material])>0)){
    kind='material';stockItem=c.material;blocker='Peça: '+formatName(data.items?.[c.material],c.material)
   }else if(j.stage>=6)kind='repair';
   const label={diagnosis:'DIAGNÓSTICO',repair:'REPARO',tool:'FALTA FERRAMENTA',
    material:'AGUARDANDO PEÇA',unknown:'REVISAR SERVIÇO'}[kind];
   return {id,kind,label,jobId:j.id,model:modelById.get(j.modelId)?.title||j.modelId,
    mechanic:mech?.name||'Sem mecânico registrado',blocker,stockItem,
    stages:Math.min(6,Math.max(0,num(j.stage))),
    mechanicCritical:!!mech&&(Math.min(num(mech.mental),num(mech.physical))<ENERGY_CRITICAL||
      num(mech.morale)<MORALE_CRITICAL)};
  });
  const validWorkers=crew.filter(m=>!m.resting);
  const freeWorkers=crew.filter(m=>!m.busy&&!m.resting);
  const freeBays=bays.filter(b=>b.kind==='free').length;
  const activeBays=bays.filter(b=>b.kind==='diagnosis'||b.kind==='repair').length;
  const blockedBays=bays.filter(b=>b.kind==='material'||b.kind==='tool'||b.kind==='unknown').length;
  const warnings=[];
  const push=(id,level,title,detail,action=null)=>{
   warnings.push({id,level,title,detail,action});
  };
  for(const m of crew){
   if(m.status==='critical'){
    push('crew-'+m.id,'critical',m.name+' · '+m.reason,
      m.busy?'Profissional alocado na '+m.jobId+'. Avalie substituição ou liberação antes do próximo turno.':
       m.resting?'Descanso já programado neste turno.':'Profissional disponível; avalie programação de descanso.',
      {kind:'team',label:'ABRIR EQUIPE'});
   }else if(m.status==='attention'&&!m.resting){
    push('crew-'+m.id,'attention',m.name+' · '+m.reason,
      m.busy?'Em serviço na '+m.jobId+'. Reavalie carga de trabalho.':'Disponível para replanejamento ou descanso.',
      {kind:'team',label:'ABRIR EQUIPE'});
   }
  }
  for(const b of bays){
   if(b.kind==='material'||b.kind==='tool'){
    const inTransit=b.kind==='material'?(state.orders||[]).filter(o=>o.item===b.stockItem)
     .reduce((total,o)=>total+num(o.qty),0):0;
    const transitNote=inTransit>0?' · '+inTransit+' un. em trânsito (sem liberação antecipada).':'';
    push('box-'+b.id,'blocked','BOX '+(b.id+1)+' · '+b.label,
      b.jobId+' · '+b.blocker+transitNote,{kind:'store',item:b.stockItem,label:'VER INSUMO'});
   }else if(b.kind==='unknown'){
    push('box-'+b.id,'blocked','BOX '+(b.id+1)+' · REVISAR OS',
      b.jobId+' está vinculada a serviço desconhecido.',{kind:'job',jobId:b.jobId,label:'ABRIR OS'});
   }
  }
  for(const j of state.jobs.filter(j=>j.priority===3&&!j.assigned)){
   push('critical-'+j.id,'attention','OS CRÍTICA SEM ALOCAÇÃO · '+j.id,
    (modelById.get(j.modelId)?.title||j.modelId)+' · '+Math.max(0,(tick-num(j.tickOpen))*12)+' h desde abertura.',
    {kind:'job',jobId:j.id,label:'ABRIR OS'});
  }
  warnings.sort((a,b)=>(PRIORITY[a.level]??9)-(PRIORITY[b.level]??9)||a.id.localeCompare(b.id));
  return {tick,day:state.day,shift:state.shift?'B':'A',
   hourPerMechanic:HH_PER_MECHANIC,crew,bays,warnings,
   metrics:{
    crewTotal:crew.length,availableCrew:validWorkers.length,resting:crew.filter(m=>m.resting).length,
    busy:crew.filter(m=>m.busy).length,freeCrew:freeWorkers.length,
    atRisk:crew.filter(m=>m.status!=='ok').length,criticalCrew:crew.filter(m=>m.status==='critical').length,
    nominalCrewHH:validWorkers.length*HH_PER_MECHANIC,
    boxLimitedHH:Math.min(count,validWorkers.length)*HH_PER_MECHANIC,
    staffedWorkingHH:activeBays*HH_PER_MECHANIC,
    additionalHH:Math.min(freeBays,freeWorkers.length)*HH_PER_MECHANIC,
    freeBays,activeBays,blockedBays,
    unassignedCritical:state.jobs.filter(j=>j.priority===3&&!j.assigned).length
   },
   methodology:'Capacidade = 10,5 HH por mecânico disponível; teto simultâneo limitado a '+count+
    ' boxes. HH são oportunidades nominais, não previsão de reparo. Os alertas usam energia <25 (crítico) e <45 (atenção), moral <25/<40: regras fictícias de balanceamento. Não são diagnóstico médico ou regra de segurança real.',
   doesNotMutate:true};
 }
 return {compute,HH_PER_MECHANIC,ENERGY_CRITICAL,ENERGY_ATTENTION,MORALE_CRITICAL,MORALE_ATTENTION};
});
