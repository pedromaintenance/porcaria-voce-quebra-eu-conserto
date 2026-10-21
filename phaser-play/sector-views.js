/* Visões independentes: Campo, Planejamento e Sala de Controle.
   Não altera a fonte dos registros nem os gabaritos de manutenção. */
(function(root,factory){
 const S=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=S;
 root.PORCARIA_SECTORS=S;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const model=(d,id)=>d.models.find(m=>m.id===id)?.title||id;
 const CATEGORIES=Object.freeze({
  overview:{title:'Visão geral',icon:'▦',subtitle:'Situação da carteira e das fontes de condição'},
  oil:{title:'Análises de óleo',icon:'◉',subtitle:'Laudos, reanálises, tendências e recoletas'},
  faults:{title:'Códigos de falha',icon:'⌁',subtitle:'Alarmes de ECM e investigação eletrônica'},
  undercarriage:{title:'Material rodante',icon:'▤',subtitle:'Desgaste de rodante, pneus e comandos finais'},
  fps:{title:'FPS',icon:'◎',subtitle:'Sistemas e registros FPS'},
  components:{title:'Componentes',icon:'⚙',subtitle:'Histórico e condição de componentes reparáveis'}
 });
 const menuOrder=['overview','oil','faults','undercarriage','fps','components'];
 function isMonitor(n){return !!n.monitorOnly}
 function card(x,s,d){
  const label={pending:'PENDENTE',expired:'NÃO EXECUTADA',finding:'ACHADO',notified:'NOTIFICAÇÃO ABERTA',clear:'SEM ACHADO'};
  const head='<header class="fieldInspectionHeader"><strong>'+esc(model(d,x.modelId))+' · '+esc(x.asset)+'</strong><span class="inspectionBadge">'+(label[x.status]||esc(x.status))+'</span></header>';
  const assignee=x.inspectorId?s.team.find(m=>m.id===x.inspectorId)?.name:null;
  let actions='';
  if(x.status==='pending'&&x.tick===s.tick)
   actions='<button type="button" class="act" data-inspection-action="inspect" data-inspection-id="'+esc(x.id)+'">REALIZAR INSPEÇÃO</button>';
  if(x.status==='finding')
   actions='<div class="inspectionNotifyActions"><label>Prioridade <select id="inspection-priority-'+esc(x.id)+'"><option value="media">Média</option><option value="alta">Alta</option><option value="baixa">Baixa</option></select></label><button class="act" data-inspection-action="notify" data-inspection-id="'+esc(x.id)+'">ENVIAR AO PLANEJAMENTO</button></div>';
  return '<article class="inspectionCard">'+head
   +'<small>'+esc(x.id)+' · turno '+Number(x.tick)+(assignee?' · '+esc(assignee):'')+'</small>'
   +(x.observed?'<p class="inspectionObservation">'+esc(x.observed)+'</p>':'<p>Inspeção aguardando execução.</p>')
   +(x.notificationId?'<p class="inspectionLinked">NOTA '+esc(x.notificationId)+' → PLANEJAMENTO PCM</p>':'')
   +actions+'</article>';
 }
 function inspections(s,d,I,E){
  I.normalized(s);
  const today=s.inspections.filter(x=>x.tick===s.tick&&!['diagnostic_practice','monitoring_practice'].includes(x.kind));
  const past=s.inspections.filter(x=>x.tick!==s.tick&&['finding','notified'].includes(x.status)).slice(-7).reverse();
  const schedule=s.inspectionLabor?.tick===s.tick?s.inspectionLabor.byEmployee||{}:{};
  const available=(d.models||[]).flatMap(m=>Array.from({length:6},(_,i)=>{
   const asset=m.id+'·'+String(i+1).padStart(2,'0');
   return {asset,label:m.title+' · '+asset};
  })).filter(x=>!s.jobs.some(j=>j.asset===x.asset)
   &&!s.notifications.some(n=>n.asset===x.asset&&n.monitorOnly&&['monitorando','aguarda_revisao_pcm'].includes(n.status))
   &&!today.some(i=>i.asset===x.asset));
  const staff=s.team.filter(m=>!m.assigned&&m.restAt!==s.tick&&!(E.TRAINING?.active?.(s,m))
   &&(schedule[m.id]||0)+1.5<=10.5);
  const control='<section class="fieldSchedule"><h3>PROGRAMAR INSPEÇÃO NO EQUIPAMENTO</h3><p>Selecione um equipamento e o profissional responsável. Cada inspeção reserva 1,5 HH na escala do turno. O limite é a capacidade disponível da equipe.</p>'
   +'<div class="fieldScheduleInputs"><label>Equipamento / TAG<select id="fieldAsset">'+available.map(x=>'<option value="'+esc(x.asset)+'">'+esc(x.label)+'</option>').join('')+'</select></label>'
   +'<label>Profissional<select id="fieldInspector">'+staff.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.name)+' · '+(10.5-(schedule[m.id]||0)).toFixed(1)+' HH disponíveis</option>').join('')+'</select></label></div>'
   +'<button class="act" data-inspection-action="schedule" '+(!available.length||!staff.length?'disabled':'')+'>PROGRAMAR INSPEÇÃO</button>'
   +'<small>Há '+available.length+' equipamentos elegíveis e '+staff.length+' profissionais com capacidade para inspeção.</small></section>';
  return '<p class="inspectionIntro"><strong>INSPEÇÃO DE CAMPO</strong> · Avalie equipamentos, registre anormalidades e encaminhe achados ao PCM.</p>'
   +control+'<div class="inspectionMetrics"><div><small>PROGRAMADAS</small><strong>'+today.length+'</strong></div>'
   +'<div><small>AGUARDANDO EXECUÇÃO</small><strong>'+today.filter(i=>i.status==='pending').length+'</strong></div>'
   +'<div><small>ACHADOS ENVIADOS</small><strong>'+today.filter(i=>i.notificationId).length+'</strong></div>'
   +'<div><small>CONCLUÍDAS SEM ACHADO</small><strong>'+today.filter(i=>i.status==='clear').length+'</strong></div></div>'
   +'<h3 class="resourceSection">ROTA DE INSPEÇÃO · TURNO '+Number(s.tick)+'</h3>'
   +(today.length||past.length?'<div class="inspectionList">'+[...today,...past].map(x=>card(x,s,d)).join('')+'</div>'
      :'<p class="muted">Nenhuma inspeção programada. Escolha o equipamento para iniciar a ronda.</p>');
 }
 function planning(s,d,I,E,IV){
  I.normalized(s);
  const notes=s.notifications.filter(n=>!isMonitor(n));
  const awaiting=notes.filter(n=>n.status==='aguarda_revisao_pcm').length;
  const approved=notes.filter(n=>n.status==='aprovada_pcm').length;
  const modelName=id=>model(d,id);
  const ordered=notes.slice().sort((a,b)=>(a.status==='aguarda_revisao_pcm'?0:a.status==='aprovada_pcm'?1:2)
    -(b.status==='aguarda_revisao_pcm'?0:b.status==='aprovada_pcm'?1:2)||b.openedTick-a.openedTick);
  return '<section class="pcmInbox"><h3>📋 CARTEIRA DE NOTIFICAÇÕES · PRÉ-DIAGNÓSTICO</h3>'
   +'<p>Achados de campo e condições escalonadas chegam aqui. Revise a hipótese, delimite escopo, antecipe materiais e converta em OS apenas quando aprovar o planejamento.</p>'
   +'<div class="inspectionMetrics"><div><small>AGUARDANDO REVISÃO</small><strong>'+awaiting+'</strong></div>'
   +'<div><small>ESCOPO APROVADO</small><strong>'+approved+'</strong></div>'
   +'<div><small>TOTAL DE NOTAS</small><strong>'+notes.length+'</strong></div></div>'
   +(ordered.length?ordered.slice(0,28).map(n=>IV.renderPCM(n,modelName,d,I,E,s,null,null)).join('')
     :'<p class="muted">Nenhuma notificação pendente. Achados de Inspeções e condições escalonadas aparecem aqui.</p>')
   +'</section>';
 }
 function reports(d,category){
  if(category==='fps')return [];
  const match=category==='faults'
   ?sc=>sc.fmeaSource?.layer==='electronic/diagnostic-records.json'
   :category==='undercarriage'
   ?sc=>sc.category==='rodante'
   :category==='components'
   ?sc=>['hidraulica','motor','perfuracao'].includes(sc.category)
   :sc=>sc.fmeaSource?.layer==='oil/diagnostic-records.json';
  return d.scenarios.filter(sc=>!sc.progression&&match(sc)).slice(-5).reverse();
 }
 function monitoring(s,d,M,IV,I,E,category='overview'){
  I.normalized(s);
  const current=Object.hasOwn(CATEGORIES,category)?category:'overview',active=CATEGORIES[current],summary=M.summary(s);
  const monitorNotes=s.notifications.filter(n=>isMonitor(n));
  // O painel sólido cobre a coluna de botões pintada no cenário; há navegação acessível no celular.
  const controls=(mobile=false)=>Object.entries(CATEGORIES).map(([key,entry])=>
   '<button type="button" class="'+(mobile?'controlMobileNavItem':'controlNavItem')+(current===key?' is-current':'')+'"'
   +' data-monitor-category="'+key+'" aria-pressed="'+String(current===key)+'" aria-label="Abrir '+esc(entry.title)+'">'
   +'<span class="controlNavIcon" aria-hidden="true">'+esc(entry.icon)+'</span>'
   +'<span class="controlNavText">'+esc(entry.title)+'</span></button>').join('');
  const top='<section class="controlRoomStage" aria-label="Sala de Controle">'
   +'<img src="./assets/pedro-sala-controle.webp" alt="Pedro na sala de controle da mina diante dos painéis de monitoramento" loading="lazy">'
   +'<nav class="controlRoomSidebar" aria-label="Menu da sala de controle">'
   +'<div class="controlRoomSidebarTitle">MONITORAMENTO</div>'
   +'<div class="controlRoomSidebarItems">'+controls()+'</div></nav></section>'
   +'<nav class="controlRoomMobileMenu" aria-label="Menu de monitoramento no celular">'+controls(true)+'</nav>';
  const metrics='<div class="inspectionMetrics"><div><small>EM ACOMPANHAMENTO</small><strong>'+summary.active+'</strong></div>'
   +'<div><small>RECOLETAS VENCIDAS</small><strong>'+summary.due+'</strong></div>'
   +'<div><small>AGRAVAMENTOS</small><strong>'+summary.attention+'</strong></div>'
   +'<div><small>ENCERRADOS SEM OS</small><strong>'+summary.closed+'</strong></div></div>';
  const selected=current==='overview'?monitorNotes:monitorNotes.filter(n=>n.monitorCategory===current
   ||(!n.monitorCategory&&(current==='oil')));
  const pending=selected.filter(n=>n.status==='aguarda_revisao_pcm').length;
  const modelName=id=>model(d,id);
  const feed='<section class="controlRoomOperations" aria-label="Carteira de condições recebidas">'
   +'<h3>📥 SINAIS RECEBIDOS · '+selected.length+' REGISTROS</h3>'
   +'<p>Ocorrências chegam automaticamente ao avançar os turnos. Avalie cada registro, programe o acompanhamento ou encaminhe ao PCM. Nenhuma OS nasce automaticamente.</p>'
   +'<div class="inspectionMetrics"><div><small>AGUARDANDO TRIAGEM</small><strong>'+pending+'</strong></div>'
   +'<div><small>EM ACOMPANHAMENTO</small><strong>'+selected.filter(n=>n.status==='monitorando').length+'</strong></div></div>'
   +(selected.length?selected.slice().sort((a,b)=>b.openedTick-a.openedTick)
    .map(n=>IV.renderPCM(n,modelName,d,I,E,s,null,M)).join('')
     :'<p class="muted">Nenhuma condição recebida neste setor até o momento. Avance os turnos para alimentar a carteira.</p>')
   +'</section>';
  const categories=current==='overview'?Object.keys(M.CATALOG.CATEGORIES):[current];
  const catalog='<section class="controlRoomOperations" aria-label="Catálogo de sintomas de condição">'
   +'<h3>📚 CATÁLOGO DE SINTOMAS · '+categories.reduce((a,k)=>a+M.CATALOG.byCategory(k).length,0)+' ENTRADAS</h3>'
   +'<p>Modelos de ocorrência que podem chegar à carteira. Sintomas não são diagnósticos concluídos.</p>'
   +categories.map(k=>'<section class="monitorCatalogCategory"><h4>'+esc(M.CATALOG.CATEGORIES[k])+'</h4>'
     +'<div class="monitorCatalogList">'+M.CATALOG.byCategory(k).map(p=>
      '<article class="monitorCatalogEntry"><strong>'+esc(p.title)+'</strong>'
      +'<small>'+esc(modelName(p.modelId))+' · '+esc(p.id)+(p.compartment?' · '+esc(p.compartment):'')+'</small>'
      +'<p>'+esc(p.baseline)+'</p>'
      +(p.indicators?.length?'<p><strong>Indicadores:</strong> '+esc(p.indicators.join(', '))+'</p>':'')
      +(p.signalClass?'<p><strong>'+esc(p.signalClass==='evento'?'Evento operacional':'Diagnóstico eletrônico')+'</strong> · '
       +esc(({ativo:'ATIVO',registrado:'REGISTRADO',nao_confirmado:'ESTADO NÃO CONFIRMADO'}[p.codeState]||'SEM ESTADO'))
       +' · Código OEM: '+esc(p.codeVerified&&p.codeValue?p.codeValue:'NÃO INFORMADO')+'</p>':'')
      +(p.moduleContext?'<small>'+esc(p.moduleContext)+'</small>':'')
      +(p.componentGroup?'<p><strong>Componente:</strong> '+esc(p.componentGroup)+' · '+esc(p.assetZone)+'</p>':'')
      +(p.componentFamily?'<p><strong>Sistema:</strong> '+esc(p.componentFamily)+' · '+esc(p.assetZone)+'</p>':'')
      +(p.category==='fps'&&p.componentFamily?'<small>FPS / GET · inspeção visual · P/N e limite OEM pendentes</small>':'')
      +(p.componentFamily&&p.measurementMethod?'<small>Verificação: '+esc(p.measurementMethod.replaceAll('_',' '))+' · medição pendente</small>':'')
      +(p.measurementMethod?'<small>Critério: '+esc(p.measurementMethod==='cts'?'CTS (leitura pendente)':/pneu/.test(p.measurementMethod)?'Pneus (não CTS)':'Inspeção/condição (leitura pendente)')+'</small>':'')
      +(p.triage==='avaliacao_prioritaria'?'<small>AVALIAÇÃO PRIORITÁRIA</small>':'')
      +(p.triage==='revisar_baseline'?'<small>REVISAR LINHA DE BASE</small>':'')
      +'</article>').join('')+'</div></section>').join('')
   +'</section>';
  const content=feed+catalog;
  return top+'<section class="controlRoomDashboard"><div class="controlRoomHeading"><h3>'+esc(active.title)+'</h3><p>'+esc(active.subtitle)+'</p></div>'+metrics+content+'</section>';
 }
 return {CATEGORIES,inspections,planning,monitoring};
});