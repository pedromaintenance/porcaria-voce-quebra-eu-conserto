/* PORCARIA 0.9.14 / Ciclo 11 — agenda vinculante por turno.
 * Sem execução, compra ou previsão de conclusão automáticas.
 */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_WEEKLY_SCHEDULE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='19.0.0',HORIZON=14;
 const positive=n=>Math.max(0,Number(n)||0);
 const planned=s=>(Array.isArray(s.scheduleEntries)?s.scheduleEntries:[]).filter(r=>r.status==='planned');
 const scenario=(d,j)=>d.scenarios.find(x=>x.id===j?.scene);
 const job=(s,id)=>s.jobs.find(x=>x.id===id);
 const pmOrder=(s,id)=>(s.preventiveOrders||[]).find(x=>x.id===id&&x.status!=='completed');
 const member=(s,id)=>s.team.find(x=>x.id===id);
 function materialBalance(s,d,j,tick,excludeId=null){
  const sc=scenario(d,j);if(!sc||j.stage<6||j.materialUsed)return null;
  const incoming=(s.orders||[]).filter(o=>o.item===sc.material&&Number(o.eta)<=tick)
   .reduce((n,o)=>n+positive(o.qty),0);
  const committed=planned(s).filter(r=>r.id!==excludeId&&r.tick<=tick)
   .filter(r=>{const other=job(s,r.orderId);return other&&other.stage>=6&&!other.materialUsed&&scenario(d,other)?.material===sc.material;}).length;
  return positive(s.stock[sc.material])+incoming-committed;
 }
 function book(s,d,orderId,mechanicId,bay,tick,audit=()=>{}){
  const j=job(s,orderId),m=member(s,mechanicId),t=Number(tick),b=Number(bay);
  if(!j||!m)return 'OS ou profissional não encontrado.';
  if(j.assigned)return 'OS já alocada: libere-a antes de programar.';
  if(!Number.isInteger(t)||t<s.tick||t>=s.tick+HORIZON)return 'Selecione um turno na janela de 14 turnos.';
  if(!Number.isInteger(b)||b<0||b>=s.bays)return 'Box inválido.';
  if(planned(s).some(r=>r.orderId===orderId))return 'OS já programada: cancele para remarcar.';
  if(planned(s).some(r=>r.tick===t&&(r.bay===b||r.mechanicId===m.id)))
   return 'Conflito: box ou profissional reservado nesse turno.';
  if(m.restAt===t||m.normativeUntil>t)return 'Profissional indisponível por descanso/integração.';
  const physical=globalThis.PORCARIA_ENGINE?.physicalBlock?.(s,m,t);
  if(physical)return physical;
  if((s.training?.assignments||[]).some(a=>a.untilTick>t&&(a.learnerId===m.id||a.trainerId===m.id)))
   return 'Profissional reservado para treinamento.';
  if(t===s.tick&&(m.assigned||s.jobs.some(x=>x.bay===b)||
   (s.preventiveOrders||[]).some(x=>x.status==='in_progress'&&(x.bay===b||x.assigned===m.id))))
   return 'Profissional ou box ocupado no turno atual.';
  if(t===s.tick&&s.inspectionLabor?.tick===t&&positive(s.inspectionLabor.byEmployee?.[m.id])>=10.5)
   return 'Profissional sem HH disponíveis para este turno.';
  const sc=scenario(d,j);
  if(!sc)return 'Cenário não encontrado.';
  if(!s.tools[sc.tool])return 'Ferramenta indisponível: providencie antes da reserva.';
  const balance=materialBalance(s,d,j,t);
  if(balance!==null&&balance<1)return 'Peça diagnosticada sem saldo estimado; o ETA não antecipa o recebimento.';
  if(!Array.isArray(s.scheduleEntries))s.scheduleEntries=[];
  const n=Math.max(1,Number(s.nextSchedule)||1);
  const r={id:'SCH'+String(n).padStart(5,'0'),orderId,mechanicId:m.id,bay:b,tick:t,status:'planned',createdTick:s.tick};
  s.scheduleEntries.push(r);s.scheduleEntries=s.scheduleEntries.slice(-200);s.nextSchedule=n+1;
  audit('schedule_created',{scheduleId:r.id,orderId,mechanicId:m.id,bay:b,scheduledTick:t});
  return null;
 }
 function bookPreventive(s,d,orderId,mechanicId,bay,tick,audit=()=>{}){
  const j=pmOrder(s,orderId),m=member(s,mechanicId),t=Number(tick),b=Number(bay);
  if(!j||j.status!=='open')return 'OS preventiva indisponível para programação.';
  if(!m)return 'Profissional não encontrado.';
  if(!Number.isInteger(t)||t<s.tick||t>=s.tick+HORIZON)
   return 'Selecione um turno na janela de 14 turnos.';
  if(!Number.isInteger(b)||b<0||b>=s.bays)return 'Box inválido.';
  if(planned(s).some(r=>r.orderId===orderId))
   return 'OS já programada: cancele a reserva para remarcar.';
  if(planned(s).some(r=>r.tick===t&&(r.bay===b||r.mechanicId===m.id)))
   return 'Conflito: box ou profissional reservado nesse turno.';
  if((s.jobs||[]).some(o=>o.asset===j.asset))
   return 'Ativo com OS corretiva aberta. Revise o conflito de manutenção.';
  if(m.restAt===t||m.normativeUntil>t)return 'Profissional indisponível por descanso/integração.';
  const physical=globalThis.PORCARIA_ENGINE?.physicalBlock?.(s,m,t);
  if(physical)return physical;
  if((s.training?.assignments||[]).some(a=>a.untilTick>t&&(a.learnerId===m.id||a.trainerId===m.id)))
   return 'Profissional reservado para treinamento.';
  if(t===s.tick&&(m.assigned||(s.jobs||[]).some(x=>x.bay===b)||
   (s.preventiveOrders||[]).some(x=>x.status==='in_progress'&&(x.bay===b||x.assigned===m.id))))
   return 'Profissional ou box ocupado no turno atual.';
  if(t===s.tick&&(s.preventiveJobs||[]).some(x=>x.status==='planned'&&x.tick===t&&
    (x.bay===b||x.mechanicId===m.id)))return 'Recurso reservado em preventiva legada.';
  if(t===s.tick&&s.inspectionLabor?.tick===t&&
    positive(s.inspectionLabor.byEmployee?.[m.id])>=10.5)
   return 'Profissional sem HH disponíveis para este turno.';
  // Programar não debita caixa. Saldo será revalidado na alocação real.
  if(!Array.isArray(s.scheduleEntries))s.scheduleEntries=[];
  const number=Math.max(1,Number(s.nextSchedule)||1);
  const r={id:'SCH'+String(number).padStart(5,'0'),kind:'preventive',orderId,
   mechanicId:m.id,bay:b,tick:t,status:'planned',createdTick:s.tick};
  s.scheduleEntries.push(r);s.scheduleEntries=s.scheduleEntries.slice(-200);s.nextSchedule=number+1;
  audit('schedule_created',{scheduleId:r.id,orderId,kind:'preventive',mechanicId:m.id,
   bay:b,scheduledTick:t});
  return null;
 }
 function cancel(s,id,audit=()=>{}){
  const r=planned(s).find(x=>x.id===id);
  if(!r)return 'Programação ativa não encontrada.';
  r.status='cancelled';r.closedTick=s.tick;
  audit('schedule_cancelled',{scheduleId:r.id,orderId:r.orderId,scheduledTick:r.tick});
  return null;
 }
 function allocationBlock(s,orderId,mechanicId,bay){
  const rows=planned(s).filter(r=>r.tick===s.tick);
  if(rows.some(r=>r.orderId===orderId&&(r.mechanicId!==mechanicId||r.bay!==bay)))
   return 'A OS tem reserva para outro profissional/box. Cancele antes de alterar.';
  if(rows.some(r=>r.orderId!==orderId&&(r.mechanicId===mechanicId||r.bay===bay)))
   return 'Box ou profissional reservado para outra OS. Cancele antes de usar.';
  return null;
 }
 function fulfill(s,orderId,mechanicId,bay,audit=()=>{}){
  const r=planned(s).find(x=>x.tick===s.tick&&x.orderId===orderId&&x.mechanicId===mechanicId&&x.bay===bay);
  if(!r)return;
  r.status='fulfilled';r.closedTick=s.tick;
  audit('schedule_fulfilled',{scheduleId:r.id,orderId,scheduledTick:r.tick});
 }
 function afterAdvance(s,audit=()=>{}){
  for(const r of planned(s).filter(r=>r.tick<s.tick)){
   r.status='missed';r.closedTick=s.tick;
   audit('schedule_missed',{scheduleId:r.id,orderId:r.orderId,scheduledTick:r.tick});
  }
 }
 function compute(s,d){
  if(!s||!Array.isArray(s.jobs)||!Array.isArray(s.team)||!Array.isArray(d?.scenarios))
   throw Error('Estado inválido para programação.');
  const raw=Array.isArray(s.scheduleEntries)?s.scheduleEntries:[],active=planned(s);
  const slots=Array.from({length:HORIZON},(_,offset)=>{
   const tick=s.tick+offset,r=active.filter(x=>x.tick===tick);
   return {tick,day:s.day+Math.floor((s.shift+offset)/2),shift:(s.shift+offset)%2?'B':'A',reserved:r.length,free:Math.max(0,s.bays-r.length)};
  });
  const rows=raw.slice(-40).reverse().map(r=>{
   const preventive=r.kind==='preventive';
   const j=preventive?pmOrder(s,r.orderId):job(s,r.orderId),
    m=member(s,r.mechanicId),sc=preventive?null:scenario(d,j);
   const balance=j?materialBalance(s,d,j,r.tick,r.id):null;
   const availability=!j?'OS ausente na carteira':
    preventive?(Number(s.cash)>=Number(j.cost)?'Custo sujeito à confirmação na alocação':
      'Caixa insuficiente no momento; reavaliar antes da execução'):
    j.stage<6?'Peça não revelada: diagnóstico incompleto':
    j.materialUsed?'Peça já aplicada':
    balance>=1?'Estoque previsto sujeito a consumo e recebimento':'Peça potencialmente indisponível';
   const blocked=!!(r.tick===s.tick&&
    (m?.assigned&&m.assigned!==r.orderId||
     s.jobs.some(x=>x.id!==r.orderId&&x.bay===r.bay)||
     (s.preventiveOrders||[]).some(x=>x.status==='in_progress'&&(x.bay===r.bay||x.assigned===r.mechanicId))||
     (preventive?(Number(s.cash)<Number(j?.cost)||j?.status!=='open'):!s.tools[sc?.tool])));
   return {...r,kind:preventive?'preventive':'corrective',
    mechanic:m?.name||r.mechanicId,asset:j?.asset||'OS não disponível',
    availability,blocked,remaining:j?.stage>=6?positive(j.repairRemaining):null,
    canStart:r.status==='planned'&&r.tick===s.tick&&!!j&&!j.assigned&&!blocked};
  });
  return {version:VERSION,slots,rows,pending:active.length,
   fulfilled:raw.filter(r=>r.status==='fulfilled').length,
   missed:raw.filter(r=>r.status==='missed').length,
   cancelled:raw.filter(r=>r.status==='cancelled').length,
   note:'Reserva é um compromisso de recurso por turno, não garantia de execução ou conclusão. Entregas só entram no início do turno seguinte ao recebimento. Diagnósticos futuros, indisponibilidade, produtividade e novas OS não são previstos.'};
 }
 return {VERSION,HORIZON,book,bookPreventive,cancel,allocationBlock,fulfill,afterAdvance,compute};
});