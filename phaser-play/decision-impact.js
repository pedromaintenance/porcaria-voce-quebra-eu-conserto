/* P.O.R.C.A.R.I.A. v0.9.11 — impacto de decisões PCM.
 * Consulta pura; NÃO desconta caixa nem aplica indisponibilidade real.
 * Os valores monetários e turnos são regras declaradas do jogo, não taxas da mina/OEM.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_DECISION_IMPACT=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='8.0.0';
 const SHIFT_HOURS=12;
 const VIRTUAL_LOSS_PER_HOUR=Object.freeze({1:35,2:75,3:150});
 const round=n=>Math.round((Number(n)||0)*10)/10;
 const nonneg=n=>Math.max(0,Number(n)||0);
 const priority=n=>Math.min(3,Math.max(1,Number(n)||1));
 function quote(item,quantity=1,tick=0){
  if(!item||!Number.isFinite(item.unit)||!Number.isFinite(item.lead))return null;
  const qty=Number(quantity);
  if(!Number.isInteger(qty)||qty<1||qty>15)return null;
  const lead=Math.max(0,Number(item.lead));
  const normalTurns=lead*2,urgentTurns=Math.max(1,Math.ceil(lead/2));
  const normal={cost:Math.round(item.unit)*qty,turnsMin:normalTurns,turnsMax:normalTurns+1};
  const urgent={cost:Math.round(item.unit*1.65)*qty,turnsMin:urgentTurns,turnsMax:urgentTurns+1};
  const asEta=(o)=>({...o,etaEarliest:tick+o.turnsMin,etaLatest:tick+o.turnsMax});
  return {qty,normal:asEta(normal),urgent:asEta(urgent),premium:urgent.cost-normal.cost,
   probabilityExtraTurn:0.18,deliveryRule:'Pedidos chegam ao final do turno. Prazos estimados sujeitos a atrasos logísticos.'};
 }
 function orderExposure(j,state){
  const start=Number.isFinite(Number(j.tickOpen))?Number(j.tickOpen):state.tick;
  const turns=j.finishedTick!=null?nonneg(j.finishedTick-start):nonneg(state.tick-start);
  const hours=j.finishedTick!=null&&Number.isFinite(j.elapsedHours)?nonneg(j.elapsedHours):turns*SHIFT_HOURS;
  const pr=priority(j.priority);
  return {id:j.id,modelId:j.modelId,priority:pr,closed:j.finishedTick!=null,
   downtimeHours:round(hours),costOpportunity:Math.round(hours*VIRTUAL_LOSS_PER_HOUR[pr]),
   materialWaitShifts:nonneg(j.materialWaitShifts),toolWaitShifts:nonneg(j.toolWaitShifts),
   diagnosisQueueShifts:nonneg(j.diagnosisQueueShifts),reworkHours:nonneg(j.reworkHours),
   plannerErrors:nonneg(j.plannerDiagnosis?.errorCount),
   note:'Espera por material e ferramenta pode ocorrer no mesmo turno; não somar as duas para calcular indisponibilidade.'};
 }
 function procurementFor(j,sc,state,data){
  if(!sc||j.stage<6||j.materialUsed||!data.items[sc.material])return null;
  const code=sc.material,onHand=nonneg(state.stock?.[code]);
  const active=(state.jobs||[]).filter(x=>x.stage>=6&&!x.materialUsed&&x.scene&&data.scenarios.some(s=>s.id===x.scene&&s.material===code));
  const due=active.length;
  const outstanding=(state.orders||[]).filter(x=>x.item===code&&x.eta>=state.tick).map(x=>({
   id:x.id,quantity:nonneg(x.qty),eta:x.eta,turnsRemaining:nonneg(x.eta-state.tick),deliveryAtEndOfTurn:true,fast:!!x.fast
  }));
  const incoming=outstanding.reduce((v,x)=>v+x.quantity,0);
  const missing=Math.max(0,due-onHand-incoming);
  const quoteOne=quote(data.items[code],1,state.tick);
  return {item:code,description:data.items[code].name,onHand,demandDiagnosed:due,
   inbound:outstanding,shortfall:missing,comparison:quoteOne,
   couldReserveNow:onHand>0,
   warning:outstanding.length?'Pedido em trânsito não libera o reparo antes do recebimento ao final do turno.':'Ainda não há pedido confirmado para este material.'};
 }
 function compute(state,data){
  if(!state||!data||!Array.isArray(state.jobs)||!Array.isArray(data.scenarios))throw new Error('Estado inválido no impacto PCM');
  const byScene=new Map(data.scenarios.map(s=>[s.id,s]));
  const active=state.jobs.map(j=>{
   const sc=byScene.get(j.scene),exposure=orderExposure(j,state);
   return {...exposure,stage:j.stage,status:j.status,assigned:!!j.assigned,
    material:sc?.material||null,tool:sc?.tool||null,procurement:procurementFor(j,sc,state,data)};
  });
  const closed=(state.done||[]).map(j=>orderExposure(j,state));
  const purchaseHistory=Array.isArray(state.purchaseHistory)?state.purchaseHistory:[];
  const inTransit=state.orders||[];
  const all=active.concat(closed);
  const sum=field=>all.reduce((n,j)=>n+nonneg(j[field]),0);
  const heldFunds=Object.entries(state.stock||{}).reduce((n,[id,qty])=>n+nonneg(qty)*nonneg(data.items?.[id]?.unit),0);
  return {version:VERSION,tick:state.tick,active,closed,
   metrics:{activeDowntimeHours:round(active.reduce((s,x)=>s+x.downtimeHours,0)),
    recordedDowntimeHours:round(sum('downtimeHours')),
    virtualOpportunityCost:Math.round(sum('costOpportunity')),
    materialWaitShifts:sum('materialWaitShifts'),toolWaitShifts:sum('toolWaitShifts'),
    diagnosisQueueShifts:sum('diagnosisQueueShifts'),reworkHours:round(sum('reworkHours')),
    evaluatedPlannerErrors:sum('plannerErrors'),
    purchaseTotal:Math.round(purchaseHistory.reduce((n,x)=>n+nonneg(x.paid),0)),
    purchaseCount:purchaseHistory.length,openPurchases:inTransit.length,
    indicativeInventoryValue:Math.round(heldFunds)},
   lossRates:{...VIRTUAL_LOSS_PER_HOUR},
   warning:'Custo de oportunidade e valor de estoque são estimativas de referência, NÃO descontos do caixa. Indicadores de espera se sobrepõem e não são somáveis. O tempo parado por OS não corresponde à disponibilidade física da frota.'};
 }
 return {VERSION,SHIFT_HOURS,VIRTUAL_LOSS_PER_HOUR,quote,orderExposure,procurementFor,compute};
});
