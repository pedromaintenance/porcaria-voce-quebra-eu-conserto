/* PORCARIA — monitoramento por condição, laboratório e decisão 100% fictícios. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.PORCARIA_MONITORING=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
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
   simulationOnly:true,inspectedTick:s.tick,observed:'Registro de condição simulado: '+p.baseline,
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
  const days=Number(interval);
  if(!INTERVALS.includes(days))return {error:'Selecione dois ou quatro turnos simulados.'};
  if((s.jobs||[]).some(j=>j.asset===n.asset))return {error:'Este ativo já possui OS aberta.'};
  n.status='monitorando';n.monitoring.status='programado';n.monitoring.reason=reason;
  n.monitoring.interval=days;n.monitoring.nextTick=s.tick+days;
  n.monitoring.decisions.push({tick:s.tick,action:'monitorar',reason:REASONS[reason],nextTick:n.monitoring.nextTick});
  return {ok:true,notification:n};
 }
 const OUTCOMES={
  estavel:{label:'ESTÁVEL',meaning:'Repetição qualitativa sem agravamento detectável na simulação; não prova ausência de falha.'},
  inconclusivo:{label:'INCONCLUSIVA',meaning:'Coleta ou comparação sem qualidade suficiente para caracterizar tendência; nova coleta necessária.'},
  agravamento:{label:'AGRAVAMENTO',meaning:'Novo indício consistente de piora no exercício; avaliar intervenção antes de autorizar retorno.'}
 };
 function collect(s,id){
  const n=get(s,id),m=n?.monitoring;
  if(!n||n.status!=='monitorando'||m.status!=='programado')return {error:'Não existe recoleta programada para esta notificação.'};
  if(!Number.isSafeInteger(m.nextTick)||s.tick<m.nextTick)return {error:'Recoleta ainda não venceu. Turno programado: '+m.nextTick+'.'};
  if(!s.tools?.COLETA)return {error:'Kit de coleta e inspeção de fluidos indisponível.'};
  const cost=40; // Preço virtual do teste, não custo de laboratório real.
  if(!Number.isFinite(s.cash)||s.cash<cost)return {error:'Saldo fictício insuficiente para recoleta.'};
  const p=PROTOCOLS[n.monitorProtocol];
  if(!p)return {error:'Protocolo não encontrado.'};
  const round=m.samples.length;
  const key=p.results[Math.min(round,p.results.length-1)];
  const desc=OUTCOMES[key];
  const entry={tick:s.tick,round:round+1,trend:key,label:desc.label,reading:desc.meaning,cost,
   source:'coleta_e_comparacao_qualitativa_ficticia',oemValidated:false};
  s.cash-=cost;
  m.samples.push(entry);
  m.nextTick=null;
  m.status=key==='agravamento'?'requer_avaliacao':'aguarda_decisao';
  m.decisions.push({tick:s.tick,action:'recoleta',result:key});
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
  if(!n||n.status!=='monitorando'||!['programado','aguarda_decisao','requer_avaliacao'].includes(m?.status))
   return {error:'Monitoramento não elegível para escalonamento.'};
  if(n.escalationNotificationId)return {error:'Já existe notificação escalonada.'};
  const p=PROTOCOLS[n.monitorProtocol];
  const sc=d.scenarios.find(x=>x.id===p?.escalationScenario&&x.modelId===n.modelId);
  if(!sc)return {error:'Cenário de investigação não encontrado; nenhuma notificação alterada.'};
  if((s.jobs||[]).some(j=>j.asset===n.asset))return {error:'Ativo já possui OS aberta.'};
  const last=m.samples[m.samples.length-1];
  const result=last?'Última recoleta fictícia: '+last.label+'.':'Escalonado sem nova recoleta por decisão conservadora.';
  const description=('Avaliar condição em '+n.asset+'. '+n.description+' '+result+' Confirmar causas conforme procedimento OEM.').slice(0,600);
  const newId='NM'+String(s.nextNotification++).padStart(4,'0');
  const escalation={id:newId,inspectionId:n.inspectionId,asset:n.asset,modelId:n.modelId,openedTick:s.tick,
   origin:'monitoramento_de_condicao_simulado',description,reportedIndication:description,
   priority:last?.trend==='agravamento'?'alta':'media',status:'aguarda_revisao_pcm',
   sourceScenario:sc.id,evidenceType:'tendencia_qualitativa_simulada',workOrderId:null,
   previousMonitorId:n.id};
  s.notifications.push(escalation);
  n.status='escalonada_monitoramento';n.escalationNotificationId=newId;
  m.status='escalonado';m.nextTick=null;
  m.decisions.push({tick:s.tick,action:'escalonar_pcm',notificationId:newId,reason:result});
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
 return {PROTOCOLS,REASONS,INTERVALS,OUTCOMES,open,decide,collect,continueWatch,close,escalate,summary};
});