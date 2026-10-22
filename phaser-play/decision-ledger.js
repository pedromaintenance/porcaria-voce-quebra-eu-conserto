/* P.O.R.C.A.R.I.A. — histórico de decisões PCM/supervisor, ciclo 9.
 * Consulta pura: só descreve fatos do jogo; não supõe contrafactuais ou causalidade OEM.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_DECISION_LEDGER=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='9.0.0',SHIFT_HOURS=12,MAX_VISIBLE=30;
 const typeLabels=Object.freeze({
  allocation:'Alocação',purchase:'Compra',receipt:'Recebimento',
  pcm_review:'Revisão PCM',pcm_conversion:'OS criada',planner_evaluation:'Diagnóstico avaliado',completion:'OS concluída',
  schedule_created:'Programação confirmada',schedule_cancelled:'Programação cancelada',schedule_fulfilled:'Reserva cumprida',schedule_missed:'Programação não realizada',
  preventive_authorized:'Preventiva autorizada',preventive_cancelled:'Preventiva cancelada',preventive_completed:'Preventiva executada',fleet_duty_changed:'Jornada virtual ajustada'
 });
 const safe=n=>Math.max(0,Number(n)||0),round=n=>Math.round(n*10)/10;
 function typeGroup(e){
  if(['purchase','receipt'].includes(e.type))return 'supply';
  if(['pcm_review','pcm_conversion','planner_evaluation','schedule_created','schedule_cancelled','schedule_fulfilled','schedule_missed','preventive_authorized','preventive_cancelled','preventive_completed','fleet_duty_changed'].includes(e.type))return 'pcm';
  return 'execution';
 }
 function compute(state,data,{filter='all',limit=MAX_VISIBLE}={}){
  if(!state||!Array.isArray(state.jobs)||!data||!Array.isArray(data.scenarios))throw Error('Estado inválido para histórico de decisões');
  const events=Array.isArray(state.decisionHistory)?state.decisionHistory:[];
  const purchases=Array.isArray(state.purchaseHistory)?state.purchaseHistory:[];
  const closed=Array.isArray(state.done)?state.done:[];
  const valid=['all','supply','pcm','execution'];
  const group=valid.includes(filter)?filter:'all';
  const max=Math.max(1,Math.min(MAX_VISIBLE,Number(limit)||MAX_VISIBLE));
  const timeline=events.filter(e=>group==='all'||typeGroup(e)===group)
   .slice().sort((a,b)=>Number(b.seq||0)-Number(a.seq||0)).slice(0,max)
   .map(e=>({...e,label:typeLabels[e.type]||'Decisão',group:typeGroup(e)}));
  const evaluated=events.filter(e=>e.type==='planner_evaluation');
  const errorsDetected=evaluated.reduce((n,e)=>n+safe(e.errors),0);
  const closedWithPlan=closed.filter(j=>j.approvedScope?.estimatedHH!=null);
  const plans=closedWithPlan.slice(0,12).map(j=>({
   orderId:j.id,modelId:j.modelId,asset:j.asset,plannedHH:safe(j.approvedScope.estimatedHH),
   workedHH:round(safe(j.worked)),effortDifferenceHH:round(safe(j.worked)-safe(j.approvedScope.estimatedHH)),
   downtimeHours:round(j.elapsedHours!=null?safe(j.elapsedHours):safe((j.finishedTick||0)-(j.tickOpen||0))*SHIFT_HOURS),
   reworkHours:round(safe(j.reworkHours)),plannerErrors:safe(j.plannerDiagnosis?.errorCount),
   firstTime:!!j.firstTime,completionTick:j.finishedTick,notificationId:j.notificationId||null
  }));
  const planned=closedWithPlan.length;
  const plansWorked=plans.reduce((n,j)=>n+j.workedHH,0);
  const plansEstimate=plans.reduce((n,j)=>n+j.plannedHH,0);
  const receiptConfirmed=purchases.filter(p=>p.receivedTick!=null).length;
  const early=purchases.filter(p=>p.demandAtPurchase===0).length;
  const urgent=purchases.filter(p=>p.fast).length;
  const purchasesPaid=purchases.reduce((n,p)=>n+safe(p.paid),0);
  const closedRework=closed.reduce((n,j)=>n+safe(j.reworkHours),0);
  const closedWithPlannerError=closed.filter(j=>safe(j.plannerDiagnosis?.errorCount)>0);
  const plannerLinkedRework=closedWithPlannerError.reduce((n,j)=>n+safe(j.reworkHours),0);
  return {
   version:VERSION,filter:group,timeline,plans,retention:{maxEvents:400,maxPurchases:200,maxClosed:200},
   metrics:{
    recordedEvents:events.length,
    allocations:events.filter(e=>e.type==='allocation').length,
    pcmReviews:events.filter(e=>e.type==='pcm_review').length,
    createdOrders:events.filter(e=>e.type==='pcm_conversion').length,
    evaluatedPlans:evaluated.length,detectedDivergences:errorsDetected,
    noDetectedDivergences:evaluated.filter(e=>Number(e.errors)===0).length,
    purchases:purchases.length,earlyWithoutDiagnosedDemand:early,
    urgentPurchases:urgent,receipts:receiptConfirmed,purchaseTotal:Math.round(purchasesPaid),
    completed:closed.length,firstTimeClosed:closed.filter(j=>j.firstTime).length,
    recordedReworkHours:round(closedRework),
    reworkOnOrdersWithPlannerError:round(plannerLinkedRework),
    closedWithApprovedPlan:planned,visiblePlannedHH:round(plansEstimate),
    visibleWorkedHH:round(plansWorked)
   },
   caveat:'Apenas eventos registrados a partir desta versão; compras e OS anteriores podem existir sem trilha de decisão. O histórico armazena até 400 eventos, 200 compras e 200 OS. Valores de referência da oficina.',
   interpretation:'Compras sem demanda diagnosticada podem ser estoque estratégico. Divergência PCM é comparação com diagnóstico de referência, sem comprovação automática de erro de campo. Retrabalho em OS com divergências não é integralmente causado por elas. HH previstas e HH registradas não são horas de indisponibilidade. Não há cálculo de retrabalho evitado ou produção recuperada sem contrafactual.'
  };
 }
 return {VERSION,typeLabels,typeGroup,compute};
});
