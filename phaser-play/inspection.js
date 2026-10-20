/* P.O.R.C.A.R.I.A. — inspeções sensitivas didáticas, sem criação automática de OS.
   A observação pode gerar uma notificação distinta, pendente de revisão pelo PCM. */
(function(root,factory){
 const I=factory();if(typeof module!=='undefined'&&module.exports)module.exports=I;
 root.PORCARIA_INSPECTION=I;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const LIMIT_PER_SHIFT=3;
 function normalized(s){
  if(!Array.isArray(s.inspections))s.inspections=[];
  if(!Array.isArray(s.notifications))s.notifications=[];
  if(!Number.isSafeInteger(s.nextInspection)||s.nextInspection<1)
   s.nextInspection=1+Math.max(0,...s.inspections.map(x=>Number(String(x.id||'').replace(/^IN/,''))||0));
  if(!Number.isSafeInteger(s.nextNotification)||s.nextNotification<1)
   s.nextNotification=1+Math.max(0,...s.notifications.map(x=>Number(String(x.id||'').replace(/^NM/,''))||0));
  return s;
 }
 function plan(s,d){
  normalized(s);
  if(s.inspectionRoundTick===s.tick)return s.inspections.filter(x=>x.tick===s.tick);
  // Um plano por turno. Registros não realizados de turnos anteriores são preservados como vencidos.
  for(const i of s.inspections)if(i.status==='pending'&&i.tick<s.tick)i.status='expired';
  const busy=new Set((s.jobs||[]).map(j=>j.asset));
  for(const n of s.notifications)if(n.monitorOnly&&['aguarda_revisao_pcm','monitorando'].includes(n.status))busy.add(n.asset);
  const inspected=new Set(s.inspections.filter(i=>s.tick-i.tick<4).map(i=>i.asset).filter(Boolean));
  const models=(d.models||[]).filter(m=>(d.scenarios||[]).some(c=>c.modelId===m.id));
  const rotation=models.length?s.tick%models.length:0;
  const rotated=[...models.slice(rotation),...models.slice(0,rotation)];
  const chosen=[];
  for(let k=0;k<rotated.length&&chosen.length<LIMIT_PER_SHIFT;k++){
   const m=rotated[k],cases=d.scenarios.filter(c=>c.modelId===m.id);
   // Priorizar patrimônios sem OS e nunca gerar inspeção sobre uma máquina fictícia com OS ativa.
   const fleet=Array.from({length:6},(_,v)=>m.id+'·'+String(v+1).padStart(2,'0'));
   const candidates=fleet.filter(id=>!busy.has(id)&&!inspected.has(id));
   if(!candidates.length)continue;
   const asset=candidates[(s.tick+k)%candidates.length];
   const sc=cases[(s.tick+k)%cases.length];
   const id='IN'+String(s.nextInspection++).padStart(4,'0');
   const ordinal=chosen.length;
   chosen.push({id,asset,modelId:m.id,tick:s.tick,day:s.day,shift:s.shift,
    status:'pending',scene:sc.id,ordinal,
    // Resultado didático sem leitura numérica inventada nem diagnóstico causal.
    simulationOnly:true,notificationId:null,inspectedTick:null,observed:null});
   inspected.add(asset);
  }
  s.inspections.push(...chosen);
  s.inspectionRoundTick=s.tick;
  return chosen;
 }
 const INSPECTION_HH=1.5;
 function schedule(s,d,asset,inspectorId){
  normalized(s);
  const chosen=String(asset||''),who=String(inspectorId||'');
  const match=/^(EQ\d{2})·0[1-6]$/.exec(chosen);
  if(!match||!d.models.some(m=>m.id===match[1]))return {error:'Selecione um equipamento válido da frota.'};
  const mech=(s.team||[]).find(m=>m.id===who);
  if(!mech)return {error:'Selecione um profissional da equipe.'};
  if(mech.assigned||mech.restAt===s.tick)return {error:'Este profissional está alocado ou em descanso.'};
  if(s.inspectionLabor?.tick!==s.tick)s.inspectionLabor={tick:s.tick,byEmployee:{}};
  const booked=s.inspectionLabor.byEmployee[who]||0;
  if(booked+INSPECTION_HH>10.5)return {error:'Capacidade de inspeção excedida: limite de 10,5 HH por profissional e turno.'};
  const E=root.PORCARIA_ENGINE;
  if(E?.TRAINING?.active?.(s,mech))return {error:'O profissional está em treinamento durante este turno.'};
  if((s.jobs||[]).some(j=>j.asset===chosen))return {error:'Equipamento indisponível: já possui OS aberta.'};
  if(s.notifications.some(n=>n.asset===chosen&&n.monitorOnly&&['monitorando','aguarda_revisao_pcm'].includes(n.status)))
   return {error:'O equipamento está sob monitoramento de condição.'};
  if(s.inspections.some(x=>x.asset===chosen&&x.tick===s.tick))return {error:'Já existe uma inspeção deste ativo neste turno.'};
  const list=d.scenarios.filter(sc=>sc.modelId===match[1]&&!sc.progression);
  if(!list.length)return {error:'Nenhum roteiro de inspeção disponível para o equipamento.'};
  const idx=(s.tick+s.nextInspection)%list.length,sc=list[idx];
  const rec={id:'IN'+String(s.nextInspection++).padStart(4,'0'),
   asset:chosen,modelId:match[1],tick:s.tick,day:s.day,shift:s.shift,
   status:'pending',scene:sc.id,ordinal:s.inspections.filter(x=>x.tick===s.tick).length,
   inspectorId:who,estimatedHH:INSPECTION_HH,simulationOnly:true,notificationId:null,
   inspectedTick:null,observed:null,kind:'field_selected'};
  s.inspections.push(rec);
  s.inspectionLabor.byEmployee[who]=Math.round((booked+INSPECTION_HH)*10)/10;
  return {ok:true,inspection:rec};
 }
 function inspectAndRoute(s,d,id){
  const result=inspect(s,d,id);
  if(result.error)return result;
  if(result.status==='finding'){
   const note=notify(s,id,null,'media');
   if(note.error)return {error:note.error};
   return {...result,notification:note.notification};
  }
  return result;
 }
 function inspect(s,d,id){
  normalized(s);
  const x=s.inspections.find(v=>v.id===id);
  if(!x)return {error:'Inspeção não encontrada.'};
  if(x.status!=='pending')return {error:'Esta inspeção já foi realizada ou venceu.'};
  if(x.tick!==s.tick)return {error:'A programação pertence a outro turno.'};
  const sc=d.scenarios.find(v=>v.id===x.scene);
  if(!sc)return {error:'Roteiro didático não encontrado.'};
  // Amostragem reprodutível e não clínica: aproximadamente uma em três inspeções sem achado.
  const anomaly=(s.tick+x.ordinal+1)%3!==0;
  x.status=anomaly?'finding':'clear';
  x.inspectedTick=s.tick;
  x.observed=anomaly
   ?'Indício observado no exercício: '+sc.operator
   :'Inspeção sensitiva simulada sem anormalidade aparente no roteiro deste turno.';
  x.observationSource='simulado_sem_medicao';
  return {ok:true,status:x.status,inspection:x};
 }
 function notify(s,id,description,priority){
  normalized(s);
  const x=s.inspections.find(v=>v.id===id);
  if(!x)return {error:'Inspeção não encontrada.'};
  if(x.status!=='finding'||x.notificationId)return {error:'É necessário um achado ainda não notificado.'};
  const text=String(description||x.observed||'').trim().replace(/\s+/g,' ');
  if(text.length<15||text.length>600)return {error:'Descreva o defeito observado em 15 a 600 caracteres.'};
  if(!['baixa','media','alta'].includes(priority))return {error:'Selecione a prioridade da notificação.'};
  const idNew='NM'+String(s.nextNotification++).padStart(4,'0');
  const n={id:idNew,inspectionId:id,asset:x.asset,modelId:x.modelId,openedTick:s.tick,
   origin:'inspecao_sensitiva_simulada',description:text,reportedIndication:x.observed,
   priority,status:'aguarda_revisao_pcm',sourceScenario:x.scene,
   evidenceType:'observacao_simulada',workOrderId:null};
  s.notifications.push(n);x.notificationId=idNew;x.status='notified';
  return {ok:true,notification:n};
 }
 // Etapas do fluxo técnico de revisão: nunca gerar OS ao aprovar uma nota.
 const TRADES=Object.freeze({mecanica:'Mecânica',hidraulica:'Hidráulica',eletrica:'Elétrica',eletronica:'Eletrônica',lubrificacao:'Lubrificação',estruturas:'Estruturas',instrumentacao:'Instrumentação'});
 const PRIORITIES=new Set(['baixa','media','alta']);
 const trim=(v,max)=>String(v??'').trim().replace(/\s+/g,' ').slice(0,max+1);
 function audit(n,s,action,reason){
  if(!Array.isArray(n.reviewHistory))n.reviewHistory=[];
  n.reviewHistory.push({tick:s.tick,action,reason:String(reason||''),origin:'revisao_pcm_jogo'});
  if(n.reviewHistory.length>100)n.reviewHistory=n.reviewHistory.slice(-100);
 }
 const STAGES=['Sistema','Grupo','Subgrupo','Componente','Dano','Causa'];
 const RETURN_REASONS=Object.freeze({
  insuficiente:'Indício insuficiente para caracterizar a demanda.',
  equipamento:'É necessário confirmar o equipamento ou sua localização.',
  observacao:'A inspeção precisa ser complementada com novas observações.'
 });
 const ARCHIVE_REASONS=Object.freeze({
  duplicada:'Demanda duplicada em outra ordem ou notificação.',
  nao_confirmada:'Condição não confirmada no exercício de inspeção.',
  sem_intervencao:'Não foi identificada necessidade de intervenção nesta simulação.'
 });
 const ACTIONS=Object.freeze({
  verificar:'Inspecionar e confirmar a condição reportada antes de intervir.',
  diagnosticar:'Realizar testes orientados para isolar a origem da anormalidade.',
  reparar:'Diagnosticar, corrigir e testar o funcionamento do conjunto.'
 });
 function hypotheses(s,d,E,id){
  normalized(s);
  const n=s.notifications.find(x=>x.id===id);
  if(!n||!d||!E||typeof E.options!=='function')return null;
  const sc=d.scenarios.find(x=>x.id===n.sourceScenario&&x.modelId===n.modelId);
  if(!sc)return null;
  // Seed reproduzível para não trocar opções enquanto o jogador seleciona hipóteses.
  let seed=2166136261;
  for(const ch of n.id+'|'+sc.id)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
  return E.options(d,sc,seed);
 }
 function diagnosisPayload(s,d,E,n,payload){
  const choices=payload.diagnosis;
  if(!Array.isArray(choices)||choices.length!==6)return {error:'Selecione Sistema, Grupo, Subgrupo, Componente e Dano. Causa pode ficar vazia.'};
  const options=hypotheses(s,d,E,n.id);
  if(!options||options.length!==6)return {error:'Catálogo de hipóteses indisponível.'};
  for(let i=0;i<6;i++){
   const value=choices[i]??'';
   if(i===5&&value==='')continue;
   if(!value||!options[i].some(x=>x.id===value))return {error:'Selecione uma opção cadastrada para '+STAGES[i]+'.'};
  }
  return {codes:choices.map(x=>String(x||'')),labels:choices.map((c,i)=>options[i].find(x=>x.id===c)?.label||'Não informada'),optionalCause:!choices[5]};
 }

 function review(s,id,decision,payload={},d=null,E=null){
  normalized(s);
  const n=s.notifications.find(x=>x.id===id);
  if(!n)return {error:'Notificação não encontrada.'};
  if(n.monitorOnly)return {error:'Este registro de condição só pode ser tratado pelo fluxo de monitoramento.'};
  if(n.status==='convertida_os')return {error:'Notificação convertida em OS: histórico imutável.'};
  const note=trim(payload.reason,500);
  if(decision==='return'||decision==='archive'){
   if(!['aguarda_revisao_pcm','devolvida','aprovada_pcm'].includes(n.status))return {error:'Status não permite revisão.'};
   if(note.length<15||note.length>500)return {error:'Informe justificativa técnica de 15 a 500 caracteres.'};
   n.status=decision==='return'?'devolvida':'arquivada_pcm';
   n.reviewReason=note;
   if(decision==='return')n.planningScope=null;
   n.reviewedTick=s.tick;
   audit(n,s,decision,note);
   return {ok:true,status:n.status,notification:n};
  }
  if(decision==='resubmit'){
   if(n.status!=='devolvida')return {error:'Somente notificações devolvidas admitem complementação.'};
   const description=trim(payload.description??n.description,600);
   if(description.length<15||description.length>600)return {error:'O relato complementado precisa ter entre 15 e 600 caracteres.'};
   if(!PRIORITIES.has(payload.priority))return {error:'Prioridade inválida.'};
   n.description=description;n.priority=payload.priority;n.status='aguarda_revisao_pcm';
   n.reviewReason=null;
   audit(n,s,'resubmit','Relato complementado e reenviado à revisão PCM.');
   return {ok:true,status:n.status,notification:n};
  }
  if(decision==='approve'){
   if(n.status!=='aguarda_revisao_pcm')return {error:'Aprovação exige uma notificação aguardando revisão.'};
   const proposed=Array.isArray(payload.diagnosis)?diagnosisPayload(s,d,E,n,payload):null;
   if(proposed?.error)return {error:proposed.error};
   const action=Object.hasOwn(ACTIONS,payload.action)?ACTIONS[payload.action]:null;
   const scope=proposed ? (action||ACTIONS.verificar) : trim(payload.scope,700);
   const trade=String(payload.trade||'');
   const hh=Number(payload.estimatedHH);
   if(Array.isArray(payload.diagnosis)&&!action)return {error:'Escolha a estratégia do serviço.'};
   if(scope.length<20||scope.length>700)return {error:'Delimite o serviço em 20 a 700 caracteres, sem antecipar causas não confirmadas.'};
   if(!Object.hasOwn(TRADES,trade))return {error:'Disciplina não cadastrada.'};
   if(!Number.isFinite(hh)||hh<0.5||hh>80||Math.round(hh*2)!==hh*2)
     return {error:'Estimativa HH inválida: de 0,5 a 80, em intervalos de meia hora.'};
   const selected=decision==='return'?RETURN_REASONS[payload.reason]:ARCHIVE_REASONS[payload.reason];
   const note=selected||trim(payload.reason,500);
   if(note.length>500)return {error:'Observação PCM limitada a 500 caracteres.'};
   n.planningScope={description:scope,trade,tradeLabel:TRADES[trade],estimatedHH:hh,planningNote:note,reviewedTick:s.tick};
   if(proposed)n.planningDiagnosis={codes:proposed.codes,labels:proposed.labels,optionalCause:proposed.optionalCause,evaluated:false};
   n.reviewedTick=s.tick;n.reviewReason=null;n.status='aprovada_pcm';
   audit(n,s,'approve','Escopo aprovado: '+TRADES[trade]+' · '+hh+' HH.');
   return {ok:true,status:n.status,notification:n};
  }
  return {error:'Decisão PCM desconhecida.'};
 }
 function convert(s,d,id){
  normalized(s);
  const n=s.notifications.find(x=>x.id===id);
  if(!n)return {error:'Notificação não encontrada.'};
  if(n.status!=='aprovada_pcm'||!n.planningScope||n.workOrderId)
   return {error:'Somente notificações aprovadas e ainda sem OS podem ser convertidas.'};
  if(s.notifications.some(x=>x.monitorOnly&&x.asset===n.asset&&['aguarda_revisao_pcm','monitorando'].includes(x.status)))
   return {error:'O equipamento possui monitoramento por condição pendente. Encerre ou escalone antes de criar OS.'};
  if((s.jobs||[]).some(j=>j.asset===n.asset))return {error:'Esse equipamento já possui OS ativa. Resolva a duplicidade antes de converter.'};
  if(!Array.isArray(s.jobs)||s.jobs.length>=32)return {error:'A carteira atingiu o limite interno de 32 OS. Conclua algum serviço antes de converter.'};
  const sc=d.scenarios.find(x=>x.id===n.sourceScenario&&x.modelId===n.modelId);
  if(!sc)return {error:'Roteiro de cenário incompatível com a notificação. Nenhuma OS foi criada.'};
  if(!d.models.some(x=>x.id===n.modelId)||!String(n.asset).startsWith(n.modelId+'·'))
   return {error:'Equipamento inválido para conversão.'};
  if(!Number.isSafeInteger(s.nextJob)||s.nextJob<1)return {error:'Sequência de ordens inválida.'};
  const mapping={baixa:1,media:2,alta:3};
  if(!mapping[n.priority])return {error:'Prioridade não reconhecida.'};
  // Mesmo contrato estrutural de E.spawn, com origem e escopo adicionais.
  const seq=s.nextJob,os='OS'+String(seq).padStart(4,'0');
  if([...s.jobs,...(s.done||[])].some(j=>j.id===os))return {error:'Identificador da OS já existe. Nenhum registro alterado.'};
  const candidate={
   id:os,scene:sc.id,asset:n.asset,modelId:n.modelId,title:sc.title,
   report:n.description,dayOpen:s.day,tickOpen:s.tick,priority:mapping[n.priority],
   status:'fila',assigned:null,bay:null,help:false,stage:0,hints:{},diagnosticLog:[],
   diagTarget:sc.diagHours*2,diagRemaining:sc.diagHours*2,repairTarget:sc.hours,repairRemaining:sc.hours,
   options:null,wrong:0,rework:false,materialUsed:false,worked:0,toolWait:0,blockedShifts:0,
   notes:[],scheduleShift:null,costLabor:0,reworkHours:0,
   source:'notificacao_inspecao',notificationId:n.id,inspectionId:n.inspectionId,
   approvedScope:{...n.planningScope},
   plannerDiagnosis:n.planningDiagnosis?{...n.planningDiagnosis,codes:[...n.planningDiagnosis.codes],labels:[...n.planningDiagnosis.labels]}:null
  };
  return {ok:true,orderDraft:candidate,notification:n};
 }
 function commitConversion(s,d,E,id){
  const checked=convert(s,d,id);
  if(checked.error)return checked;
  const draft=checked.orderDraft;
  const scenario=d.scenarios.find(x=>x.id===draft.scene);
  const Eoptions=E?.options;
  if(typeof Eoptions!=='function')return {error:'Motor de diagnóstico indisponível: conversão cancelada.'};
  const values=Eoptions(d,scenario,Math.floor(Math.random()*2**30));
  if(!Array.isArray(values)||values.length!==6)return {error:'Falha na montagem do diagnóstico; nenhuma OS criada.'};
  draft.options=values;
  s.jobs.push(draft);
  s.nextJob++;
  const n=checked.notification;
  n.workOrderId=draft.id;n.status='convertida_os';n.convertedTick=s.tick;
  audit(n,s,'convert','OS '+draft.id+' criada manualmente; programação e alocação pendentes.');
  return {ok:true,order:draft,notification:n};
 }

 function summary(s){
  normalized(s);
  return {pending:s.inspections.filter(x=>x.tick===s.tick&&x.status==='pending').length,
   findings:s.inspections.filter(x=>x.status==='finding').length,
   awaiting:s.notifications.filter(x=>x.status==='aguarda_revisao_pcm').length,
   returned:s.notifications.filter(x=>x.status==='devolvida').length,
   approved:s.notifications.filter(x=>x.status==='aprovada_pcm').length,
   converted:s.notifications.filter(x=>x.status==='convertida_os').length,
   total:s.inspections.length,notifications:s.notifications.length};
 }
 return {normalized,plan,schedule,inspect,inspectAndRoute,notify,review,convert,commitConversion,hypotheses,summary,TRADES,RETURN_REASONS,ARCHIVE_REASONS,ACTIONS,STAGES,LIMIT_PER_SHIFT,INSPECTION_HH};
});