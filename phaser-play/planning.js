/* P.O.R.C.A.R.I.A. — Planejamento PCM (simulado) v0.7.8.
 * Consultas puras: a pontuação é uma heurística de jogo, não um algoritmo de RCM/OEM.
 * Nenhum acesso DOM/Phaser e nenhuma mutação de estado ou do save.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PLANNING=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const priorityLabel={3:'CRÍTICA',2:'ALTA',1:'MODERADA'};
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function readiness(j,sc,state){
  if(!sc)return {kind:'unknown',label:'CENÁRIO DESCONHECIDO',reason:'Sem dados de falha',resource:null};
  if(!state.tools[sc.tool])return {kind:'tool',label:'FALTA FERRAMENTA',reason:'Ferramental: '+sc.tool,resource:sc.tool};
  if(j.stage>=6&&!j.materialUsed&&!(Number(state.stock[sc.material])>0))
   return {kind:'material',label:'FALTA PEÇA',reason:'Material: '+sc.material,resource:sc.material};
  return {kind:'ready',label:j.stage>=6?'APTO AO REPARO':'APTO AO DIAGNÓSTICO',reason:'Sem bloqueio de insumos conhecido',resource:null};
 }
 function candidateScore(m,sc){
  const roleMatch=!!sc&&m.role===sc.category;
  const general=m.role==='geral';
  const health=Math.min(Number(m.mental)||0,Number(m.physical)||0);
  const fatigued=health<25;
  const score=(roleMatch?55:general?22:0)
   +Math.max(0,Number(m.skill)||0)*0.5
   +clamp(health,0,100)*0.25
   - (fatigued?45:0);
  return {score:Math.round(score*10)/10,roleMatch,general,fatigued};
 }
 function compute(state,data){
  if(!state||!data||!Array.isArray(state.jobs)||!Array.isArray(state.team))throw new Error('Estado inválido para planejamento');
  const count=Number.isInteger(state.bays)?state.bays:3;
  const usedBays=new Set(state.jobs.filter(j=>j.assigned&&Number.isInteger(j.bay)).map(j=>j.bay));
  const busy=new Set(state.jobs.map(j=>j.assigned).filter(Boolean));
  const freeBays=Array.from({length:count},(_,i)=>i).filter(i=>!usedBays.has(i));
  const freeMechanics=state.team.filter(m=>!busy.has(m.id)&&m.assigned==null&&m.restAt!==state.tick&&!(m.normativeUntil>state.tick)&&!(state.training?.assignments||[]).some(a=>a.untilTick>state.tick&&(a.learnerId===m.id||a.trainerId===m.id)));
  const scenes=new Map(data.scenarios.map(s=>[s.id,s]));
  const models=new Map(data.models.map(m=>[m.id,m]));
  const orders=new Map();
  for(const o of (state.orders||[])){
   if(!orders.has(o.item))orders.set(o.item,[]);
   orders.get(o.item).push({id:o.id,qty:o.qty,eta:o.eta,turnsRemaining:Math.max(0,o.eta-state.tick)});
  }
  const ranked=state.jobs.filter(j=>!j.assigned).map(j=>{
   const sc=scenes.get(j.scene),r=readiness(j,sc,state);
   const agedHours=Math.max(0,(state.tick-j.tickOpen)*12);
   const priority=clamp(Number(j.priority)||1,1,3);
   const agePoints=Math.min(90,Math.floor(agedHours/8)*3);
   const readyBonus=r.kind==='ready'?22:0;
   const blockedPenalty=r.kind!=='ready'?-26:0;
   const points=priority*100+agePoints+readyBonus+blockedPenalty;
   const mechanics=freeMechanics.map(m=>({
    id:m.id,name:m.name,role:m.role,mental:m.mental,physical:m.physical,skill:m.skill,
    ...candidateScore(m,sc)
   })).sort((a,b)=>b.score-a.score||String(a.id).localeCompare(String(b.id)));
   const recommended=freeBays.length&&mechanics.length&&r.kind==='ready'
    ?{mechanicId:mechanics[0].id,mechanicName:mechanics[0].name,bay:freeBays[0],roleMatch:mechanics[0].roleMatch,fatigued:mechanics[0].fatigued}
    :null;
   return {
    id:j.id,model:models.get(j.modelId)?.title||j.modelId,report:j.report,
    priority,priorityLabel:priorityLabel[priority],ageHours:agedHours,score:points,
    stage:j.stage,category:sc?.category||'indefinida',
    readiness:r,inbound:r.resource?orders.get(r.resource)||[]:[],
    mechanics,freeBays:[...freeBays],recommended,
    blockers:(!freeBays.length?'Sem box livre; ':'')+(!freeMechanics.length?'Sem mecânico disponível; ':'')+(r.kind!=='ready'?r.label:'')
   };
  }).sort((a,b)=>b.score-a.score||b.ageHours-a.ageHours||a.id.localeCompare(b.id));
  return {
   tick:state.tick,day:state.day,shift:state.shift?'B':'A',
   countJobs:state.jobs.length,countAssigned:state.jobs.filter(j=>j.assigned).length,
   countWaiting:ranked.length,countCriticalWaiting:ranked.filter(j=>j.priority===3).length,
   freeMechanics:freeMechanics.map(m=>({id:m.id,name:m.name,role:m.role,skill:m.skill,mental:m.mental,physical:m.physical})),
   freeBays,remainingStarts:Math.min(freeBays.length,freeMechanics.length),
   remainingGrossHours:Math.min(freeBays.length,freeMechanics.length)*10.5,
   ranked,
   method:'Pontuação heurística: criticidade ×100 +3 por turno de espera (máximo 90), +22 se insumos liberados ou −26 se bloqueados. Não equivale a risco técnico quantitativo.',
   capacityNote:'HH úteis disponíveis no próximo turno (10,5 HH × menor número entre boxes e mecânicos livres), descontando DDS e almoço. Não incluem produtividade, fadiga ou trabalho já alocado. O motor define as horas efetivas.',
   etaNote:'Pedidos são recebidos ao final do turno pelo motor; ETA não significa disponibilidade de peça durante esse turno.'
  };
 }
 return {compute,readiness,candidateScore};
});
