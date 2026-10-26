/* Sprint 31 · campanha híbrida e contextualização por personagens existentes.
 * Direção aprova layout no PR antes de integrar. Não calcula nem inventa diagnósticos.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_CAMPAIGN_EXPERIENCE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const pct=n=>Math.round(Number(n)||0);
 const statuses=new Set(['aprovada_pcm','convertida_os','arquivada_pcm','devolvida']);
 function goals(s){
  const approved=(s.notifications||[]).filter(n=>n.origin==='inspecao_sensitiva_simulada'&&statuses.has(n.status));
  const preventive=(s.preventiveMetrics?.executed||0)>0||
   (s.preventiveOrders||[]).some(p=>['concluida','completed','done'].includes(p.status));
  return [
   {id:'repair',title:'Retornar um equipamento ao serviço',done:(s.done||[]).length>0,
    detail:'Conclua uma OS corretiva.'},
   {id:'field',title:'Tratar uma condição de campo no PCM',done:approved.length>0,
    detail:'Revise uma notificação recebida das Inspeções.'},
   {id:'preventive',title:'Executar uma manutenção preventiva',done:preventive,
    detail:'Apenas reserva não equivale a serviço concluído.'}
  ];
 }
 function summary(s){
  const done=goals(s),all=done.filter(x=>x.done).length;
  return {day:s.day,complete:s.day>=21||!!s.closed,goals:done,finished:all,
   kpis:{completed:(s.done||[]).length,open:(s.jobs||[]).length,
    cash:Number(s.cash)||0,reputation:pct(s.reputation),
    preventive:Number(s.preventiveMetrics?.executed)||0,
    labor:Number(s.metrics?.productive)||0,incidents:Number(s.metrics?.incidents)||0}};
 }
 function recent(s,filter){return (s||[]).filter(filter).sort((a,b)=>(b.openedTick??b.tick??0)-(a.openedTick??a.tick??0))[0];}
 function cue(s,sector){
  let event=null;
  if(sector==='queue'){
   const j=recent(s.jobs,j=>Number(j.priority)===3);
   event=j?{key:'radio:'+j.id,by:'Elton · Rádio',text:'Chamado crítico '+j.id+' aguardando decisão. Confira recurso, prioridade e segurança antes de liberar o serviço.'}:null;
  }else if(sector==='inspection'){
   const x=recent(s.inspections,x=>['finding','notified'].includes(x.status));
   event=x?{key:'inspection:'+x.id+':'+x.status,by:'Nemuel · Inspeções',text:x.status==='finding'?'Achado registrado em '+x.asset+'. Encaminhe ao PCM quando desejar revisar a demanda.':'Achado de '+x.asset+' encaminhado ao PCM. A investigação ainda não determinou a causa.'}:null;
  }else if(sector==='monitoring'){
   const n=recent(s.notifications,n=>n.monitorOnly&&['aguarda_revisao_pcm','monitorando','aprovada_pcm'].includes(n.status));
   event=n?{key:'monitoring:'+n.id+':'+n.status,by:'Pedro · Monitoramento',
     text:n.status==='monitorando'?'Acompanhamento em curso no ativo '+n.asset+'. Verifique o próximo registro antes de concluir tendência.':'Nova condição registrada para '+n.asset+'. Acompanhe o histórico e escolha uma tratativa.'}:null;
  }else if(sector==='training'){
   const offers=s.training?.offers||[];
   event=offers.length?{key:'training:'+offers[0].id,by:'Bia · Treinamentos',
    text:'Há capacitação disponível. Avalie a equipe livre e o custo de oportunidade antes de reservar vagas.'}:null;
  }else if(sector==='planning'){
   const n=recent(s.notifications,n=>n.status==='aguarda_revisao_pcm');
   event=n?{key:'planning:'+n.id,by:'Equipe PCM',text:'A notificação '+n.id+' aguarda revisão. Sua hipótese é preliminar; não é um diagnóstico de bancada.'}:null;
  }else if(sector==='management'){
   const p=(s.preventiveOrders||[]).find(p=>['open','scheduled','in_progress'].includes(p.status));
   event=p?{key:'preventive:'+p.id+':'+p.status,by:'Diva · Preventivas',
    text:'Há uma preventiva aguardando execução ou programação. Compare capacidade da oficina e disponibilidade operacional.'}:null;
  }
  if(!event&&Number(s.day)===1&&['queue','inspection','planning','monitoring','training','management'].includes(sector))
   event={key:'intro:'+sector,by:'Equipe de manutenção',text:'Escolha sua próxima decisão. Os indicadores mostram efeitos da campanha; nenhuma etapa é obrigatória.'};
  if(!event||(s.guideDismissed||[]).includes(event.key))return null;
  return event;
 }
 function dismiss(s,key){
  if(!key||typeof key!=='string')return false;
  if(!Array.isArray(s.guideDismissed))s.guideDismissed=[];
  if(!s.guideDismissed.includes(key))s.guideDismissed.push(key);
  s.guideDismissed=s.guideDismissed.slice(-150);
  return true;
 }
 function renderCue(s,sector){
  const v=cue(s,sector);if(!v)return '';
  return '<aside class="s31Character" role="note"><div><strong>'+esc(v.by)+'</strong><p>'+esc(v.text)+'</p></div>'
    +'<button type="button" aria-label="Dispensar orientação" data-campaign-dismiss="'+esc(v.key)+'">✕</button></aside>';
 }
 function renderGoals(s){
  const v=summary(s);
  return '<section class="s31Objectives" aria-label="Marcos opcionais da campanha">'
   +'<header><strong>MARCO DE GESTÃO · '+Math.min(20,pct(s.day))+'/20 DIAS</strong><span>'+v.finished+'/3 metas opcionais</span></header>'
   +'<p>Você pode cumprir em qualquer ordem ou ignorar as metas. Nenhuma delas restringe sua oficina.</p>'
   +'<ul>'+v.goals.map(x=>'<li class="'+(x.done?'is-done':'')+'"><b>'+(x.done?'✓':'○')+' '+esc(x.title)+'</b>'
   +'<small>'+esc(x.detail)+'</small></li>').join('')+'</ul>'
   +(v.complete?'<div class="s31Report"><strong>RELATÓRIO DO CICLO · DIA 21</strong>'
    +'<p>OS concluídas: '+v.kpis.completed+' · OS em aberto: '+v.kpis.open+' · Preventivas executadas: '+v.kpis.preventive+'</p>'
    +'<p>Caixa: R$ '+pct(v.kpis.cash).toLocaleString('pt-BR')+' · Reputação: '+v.kpis.reputation+'/100 · HH acumuladas: '+pct(v.kpis.labor)+'</p>'
    +'<small>O modo livre permanece disponível. Não há aprovação ou reprovação automática.</small></div>':'')
   +'</section>';
 }
 return {goals,summary,cue,dismiss,renderCue,renderGoals};
});
