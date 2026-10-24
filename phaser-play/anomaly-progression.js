/* P.O.R.C.A.R.I.A. v0.9.24 — Ciclo 21: progressão de achados de inspeção.
 * Tempos são parâmetros de gameplay, NÃO dados OEM nem previsão mecânica real.
 * O módulo preserva separação entre indício, hipótese PCM e falha funcional.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_ANOMALY_PROGRESSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='21.0.0';
 const PHASES=Object.freeze(['observado','agravado','critico','falha_funcional']);
 const LABELS=Object.freeze({
  observado:'OBSERVADO',agravado:'AGRAVADO',critico:'CRÍTICO',
  falha_funcional:'FALHA FUNCIONAL',resolvido:'TRATADO',arquivado:'ARQUIVADO'
 });
 const ACTIVE=new Set(['aguarda_revisao_pcm','devolvida','aprovada_pcm','convertida_os']);
 const NUMERIC=Object.freeze({baixa:0,media:1,alta:2});
 const clamp=(n,l,h)=>Math.max(l,Math.min(h,n));
 function eligible(n,d){
  return !!n&&!n.monitorOnly&&typeof n.id==='string'&&typeof n.asset==='string'&&
   !!d?.scenarios?.some(c=>c.id===n.sourceScenario&&c.modelId===n.modelId);
 }
 function policy(n,d){
  const sc=d?.scenarios?.find(x=>x.id===n.sourceScenario&&x.modelId===n.modelId);
  // Varia conforme a prioridade registrada e o mecanismo/família do cenário.
  const category=String(sc?.category||'').toLowerCase();
  const delta=/motor|hidraul|freio|dire[cç]|compress/.test(category)?-1:
   /rodante|pneu|fps/.test(category)?1:0;
  const base={alta:[2,4,6],media:[3,6,9],baixa:[4,8,12]}[n.priority]||[3,6,9];
  const shift=clamp(delta,-1,1);
  return {category:category||'sem_classificacao',priority:n.priority||'media',
   aggravatedAt:Math.max(1,base[0]+shift),
   criticalAt:Math.max(2,base[1]+shift),
   failureAt:Math.max(3,base[2]+shift),
   rule:'parametro_balanceamento_21'};
 }
 function create(n,tick){
  return {version:VERSION,startTick:tick,phase:'observado',
   changedTick:tick,history:[{tick,phase:'observado',cause:'indicio_registrado'}],
   failureCostApplied:false,pendingFailure:false,linkedOrderId:null,
   resolvedTick:null,closingReason:null};
 }
 function normalize(s,d){
  if(!s||typeof s!=='object')return s;
  if(!Array.isArray(s.notifications))s.notifications=[];
  for(const n of s.notifications){
   if(!eligible(n,d))continue;
   // Em saves legados não inferir deterioração retroativa; iniciar a partir da importação.
   if(!n.anomalyProgression||!PHASES.includes(n.anomalyProgression.phase)){
    n.anomalyProgression=create(n,Number.isInteger(s.tick)?s.tick:0);
    n.anomalyProgression.importedLegacy=true;
   }
   if(!Array.isArray(n.anomalyProgression.history))n.anomalyProgression.history=[];
  }
  return s;
 }
 function phaseAt(elapsed,p){
  if(elapsed>=p.failureAt)return 'falha_funcional';
  if(elapsed>=p.criticalAt)return 'critico';
  if(elapsed>=p.aggravatedAt)return 'agravado';
  return 'observado';
 }
 function summary(s){
  const all=(s.notifications||[]).filter(n=>n.anomalyProgression);
  const open=all.filter(n=>ACTIVE.has(n.status));
  const phase=n=>n.anomalyProgression.phase;
  return {tracked:all.length,active:open.length,
   observed:open.filter(n=>phase(n)==='observado').length,
   aggravated:open.filter(n=>phase(n)==='agravado').length,
   critical:open.filter(n=>phase(n)==='critico').length,
   failures:open.filter(n=>phase(n)==='falha_funcional').length,
   unresolved:open.filter(n=>phase(n)!=='observado').length};
 }
 function display(n,s,d){
  const p=n?.anomalyProgression;
  if(!p)return null;
  const elapsed=Math.max(0,(Number(s.tick)||0)-(Number(p.startTick)||0));
  const rule=policy(n,d),next=PHASES.find(x=>({agravado:rule.aggravatedAt,critico:rule.criticalAt,falha_funcional:rule.failureAt})[x]>elapsed);
  const target={agravado:rule.aggravatedAt,critico:rule.criticalAt,falha_funcional:rule.failureAt}[next]||null;
  return {phase:p.phase,label:LABELS[p.phase]||LABELS.observado,elapsed,
   turnsUntilNext:target===null?null:Math.max(0,target-elapsed),
   nextLabel:next?LABELS[next]:null,pendingFailure:!!p.pendingFailure,
   history:p.history||[],resolvedTick:p.resolvedTick};
 }
 function advance(s,d,{openFailure=()=>null,audit=()=>{},log=()=>{}}={}){
  normalize(s,d);
  const events=[];
  for(const n of s.notifications){
   if(!eligible(n,d))continue;
   const p=n.anomalyProgression;
   if(!p)continue;
   if(n.status==='arquivada_pcm'||n.status==='encerrada_monitoramento'){
    if(p.closingReason!=='arquivada_pcm'){
     p.closingReason='arquivada_pcm';p.resolvedTick=s.tick;
     p.history.push({tick:s.tick,phase:p.phase,cause:'arquivamento_pcm'});
    }
    continue;
   }
   if(n.workOrderId&&(s.done||[]).some(j=>j.id===n.workOrderId)){
    if(p.closingReason!=='os_concluida'){
     p.closingReason='os_concluida';p.resolvedTick=s.tick;
     p.history.push({tick:s.tick,phase:p.phase,cause:'os_concluida'});
     audit('anomaly_resolved',{notificationId:n.id,orderId:n.workOrderId,asset:n.asset});
    }
    continue;
   }
   if(!ACTIVE.has(n.status))continue;
   const rule=policy(n,d),elapsed=Math.max(0,s.tick-p.startTick);
   const next=phaseAt(elapsed,rule);
   const from=PHASES.indexOf(p.phase),to=PHASES.indexOf(next);
   if(to>from){
    for(let i=from+1;i<=to;i++){
     const phase=PHASES[i];
     p.phase=phase;p.changedTick=s.tick;
     p.history.push({tick:s.tick,phase,cause:'postergacao',elapsed,rule:rule.rule});
     p.history=p.history.slice(-20);
     const event={notificationId:n.id,asset:n.asset,phase,elapsed,
      priority:n.priority,category:rule.category,rule:rule.rule};
     audit('anomaly_progression',event);
     events.push(event);
     if(phase==='agravado')log('Condição agravada: '+n.asset+' · nota '+n.id+'.','bad');
     if(phase==='critico')log('Risco crítico: '+n.asset+' · nota '+n.id+' sem tratamento.','bad');
     if(phase==='falha_funcional'){
      log('Falha funcional: '+n.asset+' · nota '+n.id+'.','bad');
      if(!p.failureCostApplied){
       // Custo extraordinário de mobilização didático, não valor de peça ou serviço.
       s.cash-=180;p.failureCostApplied=true;
       audit('anomaly_emergency_cost',{notificationId:n.id,asset:n.asset,
        amount:180,classification:'mobilizacao_virtual_nao_oem'});
      }
     }
    }
   }
   if(p.phase==='falha_funcional'&&!n.workOrderId){
    const result=openFailure(n);
    if(result?.order){
     n.workOrderId=result.order.id;n.status='convertida_os';n.convertedTick=s.tick;
     p.pendingFailure=false;p.linkedOrderId=result.order.id;
     p.history.push({tick:s.tick,phase:'falha_funcional',cause:'os_emergencial_criada',orderId:result.order.id});
     audit('anomaly_failure_order',{notificationId:n.id,orderId:result.order.id,
      asset:n.asset,classification:'falha_funcional_didatica'});
     log('Rádio: corretiva '+result.order.id+' aberta para '+n.asset+'.','bad');
    }else p.pendingFailure=true;
   }
  }
  return {events,summary:summary(s)};
 }
 return {VERSION,PHASES,LABELS,eligible,policy,create,normalize,summary,display,advance};
});
