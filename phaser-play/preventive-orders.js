/* PORCARIA v0.9.19 — OSs PREVENTIVAS AUTOMÁTICAS POR HORÍMETRO VIRTUAL.
 * Numeração OS compartilhada, carteira separada de falhas FMEA.
 * Diva é supervisor presente na execução, não segundo mecânico nem HH adicionais.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PREVENTIVE_ORDERS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='16.0.0',INTERVAL=48,MAX_OPEN=18,MAX_HISTORY=180,HH_PER_SHIFT=10.5;
 const PACKAGES={inspection:{label:'Inspeção preventiva',hours:2,cost:120,reduction:.25,duration:4},
  service:{label:'Serviço preventivo',hours:4,cost:360,reduction:.45,duration:8}};
 const allIds=d=>(d.models||[]).flatMap(m=>Array.from({length:6},(_,n)=>m.id+'·'+String(n+1).padStart(2,'0')));
 const active=s=>(s.preventiveOrders||[]).filter(r=>r.status==='open'||r.status==='in_progress');
 const initialDue=index=>([0,18,36].includes(index)?0:24+(index*7)%48);
 function normalize(s,d){
  if(!Array.isArray(s.preventiveOrders))s.preventiveOrders=[];
  if(!s.preventiveDue||typeof s.preventiveDue!=='object')s.preventiveDue={};
  const legacy=!!(s.tick>0||s.fleetTelemetry?.startedTick>0);
  const ids=allIds(d);
  for(let i=0;i<ids.length;i++){
   const id=ids[i];
   if(!Number.isFinite(s.preventiveDue[id])){
    const hm=Number(s.fleetTelemetry?.assets?.[id]?.hourmeter)||0;
    s.preventiveDue[id]=hm+(legacy?24:initialDue(i));
   }
  }
  return s.preventiveOrders;
 }
 function generate(s,d,audit=()=>{}){
  normalize(s,d);
  let opened=0;const busy=new Set((s.jobs||[]).map(j=>j.asset));
  for(const r of active(s))busy.add(r.asset);
  for(const r of s.preventiveJobs||[])if(r.status==='planned')busy.add(r.asset);
  let openCount=active(s).length;
  for(const id of allIds(d)){
   if(openCount>=MAX_OPEN||busy.has(id))continue;
   const hm=Number(s.fleetTelemetry?.assets?.[id]?.hourmeter)||0;
   if(hm<s.preventiveDue[id])continue;
   const ix=s.preventiveOrders.filter(x=>x.asset===id).length;
   const packageId=ix%3===2?'service':'inspection',p=PACKAGES[packageId];
   const modelId=id.split('·')[0];
   const order={id:'OS'+String(s.nextJob++).padStart(4,'0'),kind:'preventive',
    asset:id,modelId,packageId,title:p.label,report:'Geração automática por horímetro virtual',
    tickOpen:s.tick,dayOpen:s.day,dueHourmeter:s.preventiveDue[id],generatedHourmeter:hm,
    status:'open',assigned:null,bay:null,stage:6,repairTarget:p.hours,repairRemaining:p.hours,
    hours:p.hours,cost:p.cost,worked:0,createdAutomatically:true,supervisor:'Diva'};
   s.preventiveOrders.push(order);busy.add(id);opened++;openCount++;
   audit('preventive_os_generated',{orderId:order.id,asset:id,dueHourmeter:order.dueHourmeter,
    currentHourmeter:hm,packageId,classification:'automatica_horimetro_virtual'});
  }
  // Preserve active OS; trim only older completed entries.
  const older=s.preventiveOrders.filter(r=>r.status==='completed').slice(-MAX_HISTORY);
  s.preventiveOrders=[...active(s),...older].sort((a,b)=>(a.tickOpen-b.tickOpen)||a.id.localeCompare(b.id));
  return opened;
 }
 function assign(s,d,id,mechanicId,bay,audit=()=>{}){
  const r=active(s).find(x=>x.id===id),m=s.team.find(x=>x.id===mechanicId),b=Number(bay);
  if(!r)return 'OS preventiva aberta não encontrada.';
  if(r.assigned)return 'Esta OS já está com um mecânico. Libere antes de realocar.';
  if(!m)return 'Mecânico não encontrado.';
  if(!Number.isInteger(b)||b<0||b>=s.bays)return 'Box inválido.';
  if((s.jobs||[]).some(j=>j.asset===r.asset))return 'Equipamento com OS corretiva aberta: preventiva bloqueada.';
  if(m.assigned||m.restAt===s.tick||globalThis.PORCARIA_ENGINE?.physicalBlock?.(s,m)||m.normativeUntil>s.tick||
   (s.training?.assignments||[]).some(a=>a.untilTick>s.tick&&(a.learnerId===m.id||a.trainerId===m.id)))
   return 'Mecânico indisponível neste turno.';
  if(s.inspectionLabor?.tick===s.tick&&Number(s.inspectionLabor.byEmployee?.[m.id]||0)>=10.5)
   return 'Mecânico já consumiu capacidade em inspeções.';
  if(s.jobs.some(j=>j.bay===b)||active(s).some(j=>j.bay===b))
   return 'Box ocupado por outra OS.';
  const calendar=(s.scheduleEntries||[]).filter(q=>q.status==='planned'&&q.tick===s.tick);
  if(calendar.some(q=>q.orderId===id&&(q.bay!==b||q.mechanicId!==m.id)))
   return 'A OS possui outro mecânico/box reservado. Revise a programação PCM.';
  if(calendar.some(q=>q.orderId!==id&&(q.bay===b||q.mechanicId===m.id)))
   return 'Recurso reservado na programação PCM.';
  if((s.preventiveJobs||[]).some(q=>q.status==='planned'&&q.tick===s.tick&&
   (q.bay===b||q.mechanicId===m.id)))return 'Recurso reservado em uma preventiva legada.';
  if(Number(s.cash)<r.cost)return 'Caixa insuficiente para execução da OS preventiva.';
  r.assigned=m.id;r.bay=b;r.status='in_progress';r.scheduleShift=s.tick;
  m.assigned=r.id;
  audit('preventive_os_assigned',{orderId:r.id,asset:r.asset,mechanicId:m.id,bay:b,supervisor:'Diva'});
  return null;
 }
 function release(s,id,audit=()=>{}){
  const r=active(s).find(x=>x.id===id&&x.assigned);
  if(!r)return 'OS preventiva sem equipe alocada.';
  const m=s.team.find(x=>x.id===r.assigned);
  if(m?.assigned===id)m.assigned=null;
  r.assigned=null;r.bay=null;r.status='open';
  audit('preventive_os_released',{orderId:r.id,asset:r.asset});
  return null;
 }
 function settle(s,pressure=()=>{},audit=()=>{},capacity=()=>HH_PER_SHIFT){
  normalize(s,{models:[]}); // Never synthesizes assets here; only ensures arrays.
  let total=0,completed=0;
  if(!Array.isArray(s.preventiveEffects))s.preventiveEffects=[];
  if(!Array.isArray(s.preventiveJobs))s.preventiveJobs=[];
  if(!s.preventiveMetrics)s.preventiveMetrics={executed:0,cost:0,hours:0,screenedRandomCandidates:0};
  for(const r of active(s).filter(x=>x.assigned)){
   const m=s.team.find(x=>x.id===r.assigned);
   if(!m||m.restAt===s.tick)continue;
   if(globalThis.PORCARIA_ENGINE?.physicalBlock?.(s,m))continue;
   if(Number(s.cash)<r.cost)continue; // Sem fundos: não executar trabalho sem apropriação.
   const reserved=s.inspectionLabor?.tick===s.tick?Number(s.inspectionLabor.byEmployee?.[m.id]||0):0;
   const possible=Math.max(0,Math.min(HH_PER_SHIFT-reserved,capacity(m)));
   const work=Math.min(possible,Number(r.repairRemaining)||0);
   if(work<=0)continue;
   r.repairRemaining=Math.max(0,Math.round((r.repairRemaining-work)*10)/10);
   r.worked+=work;r.lastWorkTick=s.tick;r.lastWorkHours=work;
   pressure(m,work);total+=work;
   if(r.repairRemaining>0)continue;
   const p=PACKAGES[r.packageId];
   s.cash-=r.cost;r.status='completed';r.finishedTick=s.tick+1;r.closedTick=s.tick;
   r.supervisor='Diva';completed++;
   if(m.assigned===r.id)m.assigned=null;
   r.assigned=null;r.bay=null;
   s.preventiveDue[r.asset]=(Number(s.fleetTelemetry?.assets?.[r.asset]?.hourmeter)||0)+INTERVAL;
   s.preventiveEffects=s.preventiveEffects.filter(x=>x.asset!==r.asset&&x.expiresTick>s.tick);
   s.preventiveEffects.push({asset:r.asset,packageId:r.packageId,reduction:p.reduction,
    appliedTick:s.tick,expiresTick:s.tick+p.duration+1});
   s.preventiveEffects=s.preventiveEffects.slice(-80);
   s.preventiveJobs.push({id:r.id,orderId:r.id,asset:r.asset,modelId:r.modelId,mechanicId:m.id,
    packageId:r.packageId,supervisor:'Diva',hours:r.worked,cost:r.cost,status:'completed',
    closedTick:s.tick,tick:r.tickOpen,source:'automatic_preventive_os'});
   s.preventiveJobs=s.preventiveJobs.slice(-150);
   s.preventiveMetrics.executed++;s.preventiveMetrics.cost+=r.cost;
   s.preventiveMetrics.hours+=r.worked;
   audit('preventive_os_completed',{orderId:r.id,asset:r.asset,mechanicId:m.id,
    supervisor:'Diva',cost:r.cost,worked:r.worked,packageId:r.packageId,
    classification:'preventiva_executada_na_os'});
  }
  return {hours:total,completed};
 }
 // Chamado DEPOIS do registro do turno: próxima preventiva vence após 48 h de OPERAÇÃO.
 function afterTelemetry(s){
  for(const r of s.preventiveOrders||[])if(r.status==='completed'&&r.closedTick===s.tick){
   const hm=Number(s.fleetTelemetry?.assets?.[r.asset]?.hourmeter)||0;
   s.preventiveDue[r.asset]=hm+INTERVAL;
  }
 }
 function compute(s,d){
  const orders=Array.isArray(s.preventiveOrders)?s.preventiveOrders:[];
  const due=s.preventiveDue||{};
  const assetName=new Map((d.models||[]).map(m=>[m.id,m.title||m.name||m.id]));
  return {version:VERSION,open:orders.filter(r=>r.status!=='completed').length,
   allocated:orders.filter(r=>r.status==='in_progress').length,
   completed:orders.filter(r=>r.status==='completed').length,
   orders:orders.slice().sort((a,b)=>(a.status==='completed')-(b.status==='completed')||
     a.tickOpen-b.tickOpen).slice(0,45).map(r=>({...r,
    model:assetName.get(r.modelId)||r.modelId,
    mechanic:s.team.find(x=>x.id===r.assigned)?.name||null})),
   nextDue:due,
   note:'A carteira gera OS preventivas automaticamente pelo horímetro de cada ativo. Aloque um mecânico e um box para executar. Diva acompanha os serviços no box, sem consumir HH da equipe. Próxima intervenção: 48 h de operação após a conclusão.'};
 }
 return {VERSION,INTERVAL,PACKAGES,normalize,generate,assign,release,settle,afterTelemetry,compute};
});