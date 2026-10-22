/* PORCARIA — Indicadores de Manutenção, Ciclo 13 (v0.9.16).
 * Consulta pura: distinguir HH (esforço), horas corridas (exposição), custos fictícios
 * registrados, e dados NÃO mensurados (MTBF e disponibilidade real).
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_RELIABILITY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='13.0.0',VALID_DAYS=[7,14,30],TICKS_PER_DAY=2,SHIFT_HOURS=12;
 const number=n=>Number.isFinite(Number(n))?Math.max(0,Number(n)):0;
 const round=n=>Math.round(n*10)/10;
 const total=(arr,key)=>round(arr.reduce((n,row)=>n+number(typeof key==='function'?key(row):row[key]),0));
 function inWindow(tick,state,days){
  const t=Number(tick),now=number(state.tick);
  return Number.isFinite(t)&&t<=now&&t>now-days*TICKS_PER_DAY;
 }
 function compute(state,data,{days=14}={}){
  if(!state||!Array.isArray(state.jobs)||!Array.isArray(state.done)||!Array.isArray(data?.models))
   throw Error('Estado inválido para indicadores de manutenção.');
  const windowDays=VALID_DAYS.includes(Number(days))?Number(days):14;
  const closed=state.done.filter(j=>inWindow(j.finishedTick,state,windowDays));
  const pm=(Array.isArray(state.preventiveJobs)?state.preventiveJobs:[])
   .filter(j=>j.status==='completed'&&inWindow(number(j.closedTick)+1,state,windowDays));
  const approved=(Array.isArray(state.preventiveJobs)?state.preventiveJobs:[])
   .filter(j=>j.status==='planned');
  const orders=(Array.isArray(state.purchaseHistory)?state.purchaseHistory:[])
   .filter(j=>inWindow(j.orderedTick,state,windowDays));
  const finish=closed.filter(j=>j.firstTime===true||j.firstTime===false);
  const correctiveHH=total(closed,'worked');
  const correctiveLaborCost=total(closed,'costLabor');
  const pmHH=total(pm,'hours'),pmCost=total(pm,'cost');
  const commitmentCost=total(approved,'cost');
  const materialValuation=total(closed,j=>j.materialUsed?j.materialCost:0);
  const purchasesCash=total(orders,'paid');
  const downtimeClosed=total(closed,j=>j.elapsedHours!=null?j.elapsedHours:
   (number(j.finishedTick)-number(j.tickOpen))*SHIFT_HOURS);
  const avgLead=closed.length?round(downtimeClosed/closed.length):null;
  const avgEffort=closed.length?round(correctiveHH/closed.length):null;
  const backlog=state.jobs.length,critical=state.jobs.filter(j=>j.priority===3).length;
  const openExposure=total(state.jobs,j=>number(state.tick-j.tickOpen)*SHIFT_HOURS);
  const waits={materialShifts:total(closed,'materialWaitShifts'),toolShifts:total(closed,'toolWaitShifts'),
   diagnosisQueueShifts:total(closed,'diagnosisQueueShifts')};
  const reworkHH=total(closed,'reworkHours');
  const all=state.done.concat(state.jobs);
  const byAsset=new Map();
  for(const j of all){
   if(!j.asset)continue;
   if(!byAsset.has(j.asset))byAsset.set(j.asset,[]);
   byAsset.get(j.asset).push(j);
  }
  const repeated=[];
  const models=new Map(data.models.map(m=>[m.id,m.title||m.name||m.id]));
  for(const [asset,history] of byAsset){
   const rows=history.slice().sort((a,b)=>number(a.tickOpen)-number(b.tickOpen)
     ||String(a.id).localeCompare(String(b.id)));
   let lastClosed=null,repeatCount=0,sameScenario=0,mostRecent=null;
   for(const j of rows){
    if(lastClosed&&number(j.tickOpen)>=number(lastClosed.finishedTick)&&inWindow(j.tickOpen,state,windowDays)){
     repeatCount++;
     if(j.scene===lastClosed.scene)sameScenario++;
     mostRecent=j;
    }
    if(j.finishedTick!=null&&(!lastClosed||number(j.finishedTick)>=number(lastClosed.finishedTick)))
     lastClosed=j;
   }
   if(repeatCount)repeated.push({asset,model:models.get(rows[0]?.modelId)||rows[0]?.modelId||'Equipamento',
    repeatCount,sameScenario,lastOrderId:mostRecent?.id||null,
    distinction:'Reabertura no mesmo ativo após conclusão anterior; não demonstra mesma causa física.'});
  }
  repeated.sort((a,b)=>b.repeatCount-a.repeatCount||a.asset.localeCompare(b.asset));
  const startTick=Math.max(0,number(state.tick)-windowDays*TICKS_PER_DAY);
  const trend=Array.from({length:windowDays},(_,index)=>{
   const low=startTick+index*TICKS_PER_DAY,high=low+TICKS_PER_DAY;
   const isTick=t=>Number(t)>low&&Number(t)<=high;
   const cs=closed.filter(j=>isTick(j.finishedTick));
   const ps=pm.filter(j=>isTick(number(j.closedTick)+1));
   return {index:index+1,fromTick:low,toTick:high,
    correctiveOrders:cs.length,correctiveHH:total(cs,'worked'),
    preventiveOrders:ps.length,preventiveHH:total(ps,'hours')};
  });
  const hhTotal=round(correctiveHH+pmHH);
  const resourceShare=hhTotal?round(pmHH/hhTotal*100):null;
  return {version:VERSION,days:windowDays,tick:state.tick,
   metrics:{
    correctiveOrders:closed.length,preventiveServices:pm.length,backlog,critical,
    correctiveHH,preventiveHH:pmHH,resourceSharePreventivePct:resourceShare,
    correctiveLaborCost,preventiveCost:pmCost,preventiveCommittedCost:commitmentCost,
    materialConsumedValuation:materialValuation,purchasesCash,
    closedLeadHours:downtimeClosed,meanClosedLeadHours:avgLead,meanCorrectiveEffortHH:avgEffort,
    activeOrderExposureHours:openExposure,reworkHH,
    firstPassCount:finish.filter(j=>j.firstTime===true).length,
    firstPassEvaluated:finish.length,
    firstPassPct:finish.length?round(finish.filter(j=>j.firstTime===true).length/finish.length*100):null,
    recurrenceEvents:repeated.reduce((n,x)=>n+x.repeatCount,0),
    recurringAssets:repeated.length,...waits
   },
   trend,repeated:repeated.slice(0,12),
   coverage:{closedRetained:state.done.length,closedRetentionLimit:200,
    preventiveRetained:Array.isArray(state.preventiveJobs)?state.preventiveJobs.length:0,
    preventiveRetentionLimit:150,limitedClosed:state.done.length>=200,
    limitedPreventive:(state.preventiveJobs||[]).length>=150},
   notes:[
    'HH são esforços de serviço; exposição e prazo de OS são horas corridas. Não somar horas corridas de várias OS como indisponibilidade de frota.',
    'Custo de mão de obra corretiva é contabilizado na OS (costLabor), NÃO debitado necessariamente do caixa. Valor de material consumido é indicativo; compras são fluxo de caixa separado. Não somar essas parcelas como custo total sem conciliação.',
    'Custo preventivo executado é valor fictício debitado na autorização; compromisso pendente é apresentado separadamente. Cancelamentos reembolsados não contam como executados.',
    'Reincidência é nova OS no mesmo ativo após conclusão anterior no histórico retido; mesma causa não está confirmada. Não é taxa de falha.',
    'MTBF e disponibilidade FÍSICOS, falhas evitadas e economia contrafactual não podem ser calculados sem horímetro OEM/horas operadas reais, estados comprovados de produção e contrafactual validado. Há apenas um painel separado de telemetria VIRTUAL a partir do ciclo 14.',
    'Janela móvel avalia eventos disponíveis no save (máximo de 200 OS concluídas e 150 registros de preventiva), não a frota real. Esperas por peça, ferramenta e diagnóstico podem coincidir e não são somáveis.'
   ]};
 }
 return {VERSION,VALID_DAYS,compute};
});