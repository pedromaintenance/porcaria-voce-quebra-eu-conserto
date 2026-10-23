/* PORCARIA v0.9.21 — Ciclo 18 | Comparador de decisões PCM.
 * Hipóteses simples, sem execução, saves ou resultados futuros inventados.
 * Para testar disponibilidade de recursos, usa o MESMO validador do motor numa
 * cópia descartável do estado. A decisão só é registrada ao confirmar na tela.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PCM_OPTIONS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='18.0.0';
 const clone=s=>JSON.parse(JSON.stringify(s));
 const n=v=>Math.max(0,Number(v)||0);
 const round=v=>Math.round(v*10)/10;
 function find(s,orderId){
  const c=(s.jobs||[]).find(o=>o.id===orderId);
  if(c)return {type:'corrective',job:c};
  const p=(s.preventiveOrders||[]).find(o=>o.id===orderId&&o.status!=='completed');
  if(p)return {type:'preventive',job:p};
  return null;
 }
 function orders(s){
  return [...(s.jobs||[]).filter(o=>!o.assigned).map(o=>({id:o.id,type:'corrective',asset:o.asset,
   title:o.title,status:o.stage>=6?'Diagnóstico concluído':'Investigação '+o.stage+'/6'})),
    ...(s.preventiveOrders||[]).filter(o=>o.status==='open').map(o=>({id:o.id,type:'preventive',
    asset:o.asset,title:o.title,status:'Aberta'}))];
 }
 function calculate(s,d,E,{orderId,mechanicId,bay}={}){
  if(!s||!Array.isArray(d?.models)||!E?.scheduleJob||!E?.assignPreventiveOrder)
   throw Error('Planejamento PCM indisponível.');
  const found=find(s,orderId),person=(s.team||[]).find(m=>m.id===mechanicId);
  const b=Number(bay);
  if(!found)return {available:false,reason:'Selecione uma OS aberta para comparar as alternativas.',options:[]};
  const j=found.job,model=(d.models||[]).find(x=>x.id===j.modelId);
  const duty=Number(s.fleetTelemetry?.dutyHours?.[j.asset]??8),hours=Number.isFinite(duty)?Math.min(12,Math.max(0,duty)):8;
  const isPM=found.type==='preventive',repair=Math.max(0,Number(j.repairRemaining)||0);
  function trial(action){
   if(!person)return 'Selecione um profissional da equipe.';
   if(!Number.isInteger(b)||b<0||b>=s.bays)return 'Selecione um box válido.';
   const copy=clone(s); // Sem mudança no save real, caixa, turno ou histórico do jogador.
   if(isPM){
    if(action==='now')return E.assignPreventiveOrder(copy,d,orderId,mechanicId,b);
    return null;
   }
   return E.scheduleJob(copy,d,orderId,mechanicId,b,s.tick+(action==='next'?1:0));
  }
  const nowBlock=trial('now'),nextBlock=trial('next');
  const options=[
   {id:'now',title:'Programar neste turno',available:!nowBlock,reason:nowBlock||null,
    action:isPM?'assign_pm':'schedule_cm',
    tick:s.tick,assignedHours:isPM?repair:null,
    estimatedOperatingGap:isPM?round(Math.max(0,hours-(12-Math.min(12,repair)))):null,
    exposureHours:isPM?0:12,
    note:isPM?'Execução depende do avanço do turno; gasto previsto de R$ '+n(j.cost).toLocaleString('pt-BR')+
     ' ao concluir. Diva acompanha o mecânico.':'Reserva turno/box; alocação manual e investigação continuam obrigatórias. '
      +'OS aberta permanece indisponível até eventual conclusão.'},
   {id:'next',title:'Programar no turno seguinte',available:isPM?false:!nextBlock,
    reason:isPM?'OS preventiva só admite alocação no turno atual. Não há reserva futura automática.':nextBlock||null,
    action:isPM?null:'schedule_cm',tick:s.tick+1,
    assignedHours:null,estimatedOperatingGap:null,
    exposureHours:isPM?0:24,
    note:isPM?'A postergação não tem execução agendada. O vencimento continua na carteira.':
     'A reserva futura não movimenta o equipamento e não garante a disponibilidade de recursos no próximo turno.'},
   {id:'hold',title:'Manter na carteira',available:true,reason:null,
    action:null,tick:null,assignedHours:null,estimatedOperatingGap:null,
    exposureHours:isPM?0:12,
    note:isPM?'Sem apropriação de recursos nem confirmação de manutenção. Condição e vencimento permanecem em aberto.':
     'Sem nova reserva. A OS corretiva mantém a exposição ao turno em aberto; não há previsão de retorno.'}
  ];
  return {version:VERSION,available:true,type:found.type,orderId,asset:j.asset,
   model:model?.title||j.modelId,mechanic:person?.name||null,bay:b,
   currentTick:s.tick,operatingDutyHours:hours,remainingEffort:repair,
   options,note:'Comparação de recursos e exposição administrativa, não previsão de falha, MTTR nem horas recuperadas. '
    +'A preventiva usa duração nominal somente para destacar eventual conflito com a jornada; '
    +'diagnóstico, produtividade, faltas e novas ocorrências podem mudar o resultado. '
    +'Nenhuma alternativa é gravada até a confirmação.'};
 }
 return {VERSION,orders,calculate};
});