/* PORCARIA — monitoramento por condição, laboratório e decisão 100% fictícios. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.PORCARIA_MONITORING=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const CATALOG=typeof require==='function'?require('./condition-catalog.js'):globalThis.PORCARIA_CONDITION_CATALOG;
 const PROTOCOLS=Object.freeze({
  baseline:{label:'777E · Formulação do lubrificante sob revisão',modelId:'EQ01',
   escalationScenario:'INC041',baseline:'Perfil químico diferente após reposição declarada; nenhuma falha mecânica confirmada.',
   results:['estavel','estavel','estavel']},
  sample:{label:'D9 · Partículas sob suspeita de amostragem',modelId:'EQ07',
   escalationScenario:'INC042',baseline:'Partículas isoladas em coleta simulada; representatividade ainda não verificada.',
   results:['inconclusivo','agravamento']},
  differential:{label:'966 · Tendência de contaminação no diferencial',modelId:'EQ08',
   escalationScenario:'INC092',baseline:'Particulado em uma análise fictícia sem confirmação da via de entrada.',
   results:['agravamento']}
 });
 const REASONS=Object.freeze({
  baseline:'Mudança declarada de formulação ainda precisa de referência comparável.',
  sample:'Amostra isolada sem confirmação de representatividade e sem outro sintoma no exercício.',
  trend:'Controlar tendência qualitativa e antecipar intervenção se houver agravamento.'
 });
 const INTERVALS=[2,4];
 function init(s,I){I.normalized(s);return s;}
 function get(s,id){return (s.notifications||[]).find(n=>n.id===id&&n.monitorOnly);}
 function protocol(id){return CATALOG?.get(id)||PROTOCOLS[id]||null}
 /* Uma ocorrência chega pela fonte de condição; não é nota de inspeção e não cria OS.
  * Recebimento automático a cada dois turnos, rotacionando os cinco domínios.
  * Todas as decisões posteriores permanecem manuais.
  */
 function receive(s,d,I,opts={}){
  init(s,I);
  if(!opts.initial&&s.tick%2!==0)return {ok:true,received:[]};
  if(s.monitoringLastFeedTick===s.tick)return {ok:true,received:[]};
  const active=(s.notifications||[]).filter(n=>n.monitorOnly&&['aguarda_revisao_pcm','monitorando'].includes(n.status));
  if(active.length>=8)return {ok:true,received:[],reason:'carteira_cheia'};
  const order=Object.keys(CATALOG.CATEGORIES),start=(Number(s.monitoringFeedCursor)||0)%order.length;
  const seen=Array.isArray(s.monitoringFeedSeen)?s.monitoringFeedSeen:[];
  const busy=new Set((s.jobs||[]).map(j=>j.asset));
  for(const n of s.notifications||[])if(n.asset&&['aguarda_revisao_pcm','aprovada_pcm','devolvida','monitorando'].includes(n.status))busy.add(n.asset);
  for(const i of s.inspections||[])if(i.tick===s.tick&&i.asset)busy.add(i.asset);
  for(let step=0;step<order.length;step++){
   const category=order[(start+step)%order.length];
   const pool=CATALOG.byCategory(category).filter(p=>d.models.some(m=>m.id===p.modelId)
    &&(!p.escalationScenario||d.scenarios.some(sc=>sc.id===p.escalationScenario&&sc.modelId===p.modelId)));
   const unseen=pool.filter(p=>!seen.includes(p.id));
   const candidates=[...unseen,...pool.filter(p=>seen.includes(p.id))];
   for(const p of candidates){
    const asset=Array.from({length:6},(_,i)=>p.modelId+'·'+String(i+1).padStart(2,'0')).find(a=>!busy.has(a));
    if(!asset)continue;
    const id='NM'+String(s.nextNotification++).padStart(4,'0');
    const n={id,inspectionId:null,asset,modelId:p.modelId,openedTick:s.tick,
     origin:'monitoramento_de_condicao',description:p.baseline,reportedIndication:p.baseline,
     priority:p.triage==='avaliacao_prioritaria'?'alta':category==='faults'||category==='fps'?'media':'baixa',status:'aguarda_revisao_pcm',
     sourceScenario:null,workOrderId:null,monitorOnly:true,monitorProtocol:p.id,monitorCategory:category,
     monitorCatalogVersion:CATALOG.VERSION,
     monitoring:{status:'proposta',baseline:p.baseline,reason:null,interval:null,nextTick:null,samples:[],decisions:[]}};
    s.notifications.push(n);
    s.monitoringFeedSeen=[...seen.filter(id=>id!==p.id),p.id].slice(-CATALOG.ENTRIES.length);
    s.monitoringFeedCursor=(start+step+1)%order.length;
    s.monitoringLastFeedTick=s.tick;
    return {ok:true,received:[n]};
   }
  }
  return {ok:true,received:[],reason:'sem_ativo_disponivel'};
 }
 function status(n){return n?.monitoring?.status||'nao_iniciado'}
 function open(s,d,I,protocol){
  init(s,I);
  const p=PROTOCOLS[protocol];
  if(!p)return {error:'Protocolo de monitoramento não cadastrado.'};
  if(s.monitoringOpenTick!==s.tick){s.monitoringOpenTick=s.tick;s.monitoringOpenCount=0}
  if(s.monitoringOpenCount>=2)return {error:'Limite de dois estudos de monitoramento por turno.'};
  if(!d.scenarios.some(c=>c.id===p.escalationScenario&&c.modelId===p.modelId))return {error:'Cenário de investigação não encontrado.'};
  const used=new Set((s.jobs||[]).map(j=>j.asset));
  for(const n of s.notifications)if(n.asset&&!['arquivada_pcm','encerrada_monitoramento','escalonada_monitoramento','convertida_os'].includes(n.status))used.add(n.asset);
  for(const x of s.inspections)if(x.tick===s.tick)used.add(x.asset);
  const asset=Array.from({length:6},(_,i)=>p.modelId+'·'+String(i+1).padStart(2,'0')).find(a=>!used.has(a));
  if(!asset)return {error:'Nenhum equipamento didático livre nesta frota.'};
  const i={id:'IN'+String(s.nextInspection++).padStart(4,'0'),asset,modelId:p.modelId,
   tick:s.tick,day:s.day,shift:s.shift,status:'finding',scene:null,ordinal:0,
   simulationOnly:true,inspectedTick:s.tick,observed:'Condição recebida: '+p.baseline,
   observationSource:'monitoramento_didatico',kind:'monitoring_practice'};
  s.inspections.push(i);
  const notified=I.notify(s,i.id,null,'baixa');
  if(notified.error){s.inspections.pop();s.nextInspection--;return notified}
  const n=notified.notification;
  n.monitorOnly=true;n.monitorProtocol=protocol;n.monitoring={status:'proposta',baseline:p.baseline,
   reason:null,interval:null,nextTick:null,samples:[],decisions:[]};
  s.monitoringOpenCount++;
  return {ok:true,inspection:i,notification:n};
 }
 function decide(s,id,reason,interval){
  const n=get(s,id);
  if(!n||n.status!=='aguarda_revisao_pcm'||status(n)!=='proposta')return {error:'A decisão exige notificação de monitoramento em revisão.'};
  if(!Object.hasOwn(REASONS,reason))return {error:'Justificativa de monitoramento inválida.'};
  if(protocol(n.monitorProtocol)?.triage==='avaliacao_prioritaria')return {error:'Condição prioritária: encaminhe para avaliação PCM antes de programar nova amostra.'};
  const days=Number(interval);
  if(!INTERVALS.includes(days))return {error:'Selecione dois ou quatro turnos simulados.'};
  if((s.jobs||[]).some(j=>j.asset===n.asset))return {error:'Este ativo já possui OS aberta.'};
  n.status='monitorando';n.monitoring.status='programado';n.monitoring.reason=reason;
  n.monitoring.interval=days;n.monitoring.nextTick=s.tick+days;
  n.monitoring.decisions.push({tick:s.tick,action:'monitorar',reason:REASONS[reason],nextTick:n.monitoring.nextTick});
  return {ok:true,notification:n};
 }
 const OUTCOMES={
  estavel:{label:'ESTÁVEL',meaning:'Acompanhamento mantém o perfil anterior, sem agravamento identificado no resultado.'},
  inconclusivo:{label:'INCONCLUSIVA',meaning:'Resultado insuficiente para estabelecer tendência. Necessária nova coleta.'},
  agravamento:{label:'AGRAVAMENTO',meaning:'Nova evidência de agravamento. Avaliação técnica e decisão de intervenção necessárias.'}
 };
 function collect(s,id){
  const n=get(s,id),m=n?.monitoring;
  if(!n||n.status!=='monitorando'||m.status!=='programado')return {error:'Não existe recoleta programada para esta notificação.'};
  if(!Number.isSafeInteger(m.nextTick)||s.tick<m.nextTick)return {error:'Recoleta ainda não venceu. Turno programado: '+m.nextTick+'.'};
  const p=protocol(n.monitorProtocol);
  if(!p)return {error:'Registro de condição não encontrado no catálogo.'};
  const requiredTool=p.followupTool===undefined?'COLETA':p.followupTool;
  if(requiredTool&&!s.tools?.[requiredTool])return {error:'Instrumento requerido para verificação: '+requiredTool+'.'};
  const cost=p.followupCost===undefined?40:p.followupCost; // Balanceamento do jogo.
  if(!Number.isFinite(s.cash)||s.cash<cost)return {error:'Saldo fictício insuficiente para recoleta.'};
  const round=m.samples.length;
  const lateTurns=Math.max(0,s.tick-m.nextTick);
  const delayEscalation=p.category==='undercarriage'&&p.delayRisk==='alto'
   &&Number.isSafeInteger(p.delayThresholdTurns)&&lateTurns>=p.delayThresholdTurns;
  const planned=p.results[Math.min(round,p.results.length-1)];
  const key=delayEscalation?'agravamento':planned;
  const desc=OUTCOMES[key];
  const entry={tick:s.tick,round:round+1,trend:key,label:desc.label,reading:desc.meaning,cost,
   source:p.category||'oil',oemValidated:false,catalogId:n.monitorProtocol,
   lateTurns,delayEscalation,delayExplanation:delayEscalation?(p.riskOnDelay||'Postergação simulada de condição crítica.'):null};
  s.cash-=cost;
  m.samples.push(entry);
  m.nextTick=null;
  m.status=key==='agravamento'?'requer_avaliacao':'aguarda_decisao';
  m.decisions.push({tick:s.tick,action:p.category==='undercarriage'?'verificacao_rodante':'recoleta',result:key,lateTurns,delayEscalation});
  return {ok:true,notification:n,sample:entry};
 }
 function continueWatch(s,id,interval){
  const n=get(s,id),m=n?.monitoring;
  if(!n||n.status!=='monitorando'||m.status!=='aguarda_decisao')return {error:'Não há resultado elegível para continuidade.'};
  if(!INTERVALS.includes(Number(interval)))return {error:'Intervalo inválido.'};
  m.status='programado';m.interval=Number(interval);m.nextTick=s.tick+m.interval;
  m.decisions.push({tick:s.tick,action:'continuar',nextTick:m.nextTick});
  return {ok:true,notification:n};
 }
 function close(s,id){
  const n=get(s,id),m=n?.monitoring;
  if(!n||n.status!=='monitorando'||m.status!=='aguarda_decisao')return {error:'Não é possível encerrar antes da decisão após recoleta.'};
  if(m.samples.length<2||m.samples.slice(-2).some(x=>x.trend!=='estavel'))
   return {error:'Para encerrar o exercício são exigidas duas recoletas estáveis consecutivas.'};
  n.status='encerrada_monitoramento';m.status='encerrado';m.nextTick=null;
  m.decisions.push({tick:s.tick,action:'encerrar',reason:'Duas recoletas fictícias estáveis; sem OS.'});
  return {ok:true,notification:n};
 }
 function escalate(s,d,I,id){
  init(s,I);
  const n=get(s,id),m=n?.monitoring;
  const p=protocol(n?.monitorProtocol);
  const urgent=n?.status==='aguarda_revisao_pcm'&&m?.status==='proposta'&&p?.triage==='avaliacao_prioritaria';
  if(!n||!urgent&&!(n.status==='monitorando'&&['programado','aguarda_decisao','requer_avaliacao'].includes(m?.status)))
   return {error:'Monitoramento não elegível para escalonamento.'};
  if(n.escalationNotificationId)return {error:'Já existe notificação escalonada.'};
  if(!p)return {error:'Registro de condição não encontrado.'};
  const sc=d.scenarios.find(x=>x.id===p.escalationScenario&&x.modelId===n.modelId);
  if(!sc&&p.escalationScenario)return {error:'Cenário de investigação não encontrado; nenhuma notificação alterada.'};
  if((s.jobs||[]).some(j=>j.asset===n.asset))return {error:'Ativo já possui OS aberta.'};
  const last=m.samples[m.samples.length-1];
  const result=last?'Última recoleta fictícia: '+last.label+'.':'Escalonado sem nova recoleta por decisão conservadora.';
  const description=('Avaliar condição em '+n.asset+'. '+n.description+' '+result+' Confirmar causas conforme procedimento OEM.').slice(0,600);
  const newId='NM'+String(s.nextNotification++).padStart(4,'0');
  const escalation={id:newId,inspectionId:n.inspectionId,asset:n.asset,modelId:n.modelId,openedTick:s.tick,
   origin:'monitoramento_de_condicao_simulado',description,reportedIndication:description,
   priority:last?.trend==='agravamento'||n.priority==='alta'?'alta':'media',status:'aguarda_revisao_pcm',
   sourceScenario:sc?.id||null,requiresScenarioMapping:!sc,
   evidenceType:'tendencia_qualitativa_simulada',workOrderId:null,
   previousMonitorId:n.id};
  s.notifications.push(escalation);
  n.status='escalonada_monitoramento';n.escalationNotificationId=newId;
  m.status='escalonado';m.nextTick=null;
  m.decisions.push({tick:s.tick,action:'escalonar_pcm',notificationId:newId,reason:result,urgent});
  return {ok:true,notification:n,escalation};
 }
 function summary(s){
  const notes=(s.notifications||[]).filter(n=>n.monitorOnly);
  return {total:notes.length,active:notes.filter(n=>n.status==='monitorando').length,
   due:notes.filter(n=>n.status==='monitorando'&&n.monitoring?.status==='programado'&&s.tick>=n.monitoring.nextTick).length,
   attention:notes.filter(n=>n.status==='monitorando'&&n.monitoring?.status==='requer_avaliacao').length,
   closed:notes.filter(n=>n.status==='encerrada_monitoramento').length,
   escalated:notes.filter(n=>n.status==='escalonada_monitoramento').length};
 }
 return {PROTOCOLS,CATALOG,REASONS,INTERVALS,OUTCOMES,receive,open,decide,collect,continueWatch,close,escalate,summary};
});