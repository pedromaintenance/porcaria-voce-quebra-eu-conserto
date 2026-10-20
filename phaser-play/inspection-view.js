/* Apresentação Phaser do setor de inspeção. Não altera regras ou gabaritos. */
(function(root,factory){
 const V=factory();if(typeof module!=='undefined'&&module.exports)module.exports=V;
 root.PORCARIA_INSPECTION_VIEW=V;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function renderEvidence(n,d,T,s){
  if(!T)return '';
  const tests=T.available(s,d,n.id);
  if(!tests.length)return '';
  const outcomes={observado:'INDÍCIO OBSERVADO',nao_observado:'NÃO OBSERVADO',
   convergente:'LEITURAS COERENTES',divergente:'LEITURAS DIVERGENTES',inconclusivo:'INCONCLUSIVO'};
  const reports=(n.evidenceTests||[]).map(x=>'<li><strong>'+esc(x.label)+' · '+esc(outcomes[x.outcome]||'OBSERVAÇÃO')
   +'</strong><p>'+esc(x.result)+'</p><small>'+esc(x.limits)+' · resultado SIMULADO · turno '+Number(x.tick)+'</small></li>').join('');
  const controls=n.status==='aguarda_revisao_pcm'?tests.map(x=>'<div class="pcmTestAction"><div><strong>'+esc(x.label)+'</strong>'
   +'<small>'+esc(x.toolName)+' · custo fictício R$ '+Number(x.cost)+'</small></div>'
   +'<button class="act secondary" type="button" data-evidence-test="'+esc(x.id)+'" data-notification-id="'+esc(n.id)+'" '
   +(x.completed||!x.available?'disabled':'')+'>'+esc(x.completed?'REGISTRADO':x.available?'EXECUTAR TESTE':'FALTA FERRAMENTA')+'</button></div>').join(''):'';
  return '<section class="pcmEvidence"><h4>🔬 BANCADA DE EVIDÊNCIAS · FICÇÃO DIDÁTICA</h4>'
   +'<p>Os resultados são qualitativos e criados para o jogo. Execute os testes antes de escolher hipóteses. Não representam medições ou limites OEM.</p>'
   +(controls?'<div class="pcmTestList">'+controls+'</div>':'')
   +(reports?'<div class="pcmEvidenceReport"><strong>RESULTADOS REGISTRADOS</strong><ul>'+reports+'</ul></div>'
     :'<p class="muted">Nenhum resultado registrado. Comprar uma ferramenta não executa automaticamente o teste.</p>')
   +'</section>';
 }
 function monitorWidget(n,s,M){
  if(!M)return '';
  const m=n.monitoring||{},state=m.status||'proposta';
  const select=(id,choices)=>'<select id="'+id+'">'+choices.map(([v,label])=>'<option value="'+esc(v)+'">'+esc(label)+'</option>').join('')+'</select>';
  const period=id=>'<label>Intervalo da recoleta (turnos simulados) '+select(id,[[2,'2 turnos'],[4,'4 turnos']])+'</label>';
  const actions=(buttons)=>'<div class="pcmActions">'+buttons+'</div>';
  const btn=(kind,label,disabled=false)=>'<button type="button" class="act'+(kind==='escalate'?' secondary':'')+'" data-monitor-action="'+kind+'" data-monitor-note="'+esc(n.id)+'" '+(disabled?'disabled':'')+'>'+label+'</button>';
  let controls='';
  if(n.status==='aguarda_revisao_pcm'){
   controls='<p>Não abrir OS neste momento: registrar justificativa e programar recoleta. A decisão é válida apenas para este exercício fictício.</p>'
    +'<label>Justificativa '+select('monitor-reason-'+esc(n.id),Object.entries(M.REASONS))+'</label>'
    +period('monitor-interval-'+esc(n.id))
    +actions(btn('decide','INICIAR MONITORAMENTO SEM OS'));
  }else if(n.status==='monitorando'){
   const due=state==='programado'&&s.tick>=m.nextTick;
   if(state==='programado')controls='<p><strong>Próxima recoleta: turno '+Number(m.nextTick)+
    '</strong> · atual '+Number(s.tick)+(due?' · VENCIDA':' · A PROGRAMAR')+'</p>'
    +actions(btn('collect','🔬 REALIZAR RECOLETA',!due)+btn('escalate','ESCALONAR AO PCM'));
   if(state==='aguarda_decisao')controls='<p>Analise a tendência. A estabilidade não garante integridade do equipamento real.</p>'
    +period('monitor-interval-'+esc(n.id))
    +actions(btn('continue','PROGRAMAR PRÓXIMA RECOLETA')
      +btn('close','ENCERRAR SEM OS',!(m.samples?.length>=2&&m.samples.slice(-2).every(x=>x.trend==='estavel')))
      +btn('escalate','ESCALONAR AO PCM'));
   if(state==='requer_avaliacao')controls='<p class="inspectionAttention">AGRAVAMENTO: não continuar monitorando sem avaliação. Acompanhar a abertura manual de notificação para intervenção.</p>'
    +actions(btn('escalate','ESCALONAR AO PCM'));
  }else if(n.status==='encerrada_monitoramento'){
   controls='<p>✓ Monitoramento didático encerrado sem OS após duas recoletas estáveis consecutivas.</p>';
  }else if(n.status==='escalonada_monitoramento'){
   controls='<p>⚠ Monitoramento convertido em nova notificação <strong>'+esc(n.escalationNotificationId||'')+
    '</strong>. Revisão PCM pendente; nenhuma OS foi criada automaticamente.</p>';
  }
  const history=(m.samples||[]).map(x=>'<li>Turno '+Number(x.tick)+' · <strong>'+esc(x.label)+'</strong>'
   +'<p>'+esc(x.reading)+'</p><small>Recoleta simulada, sem medição OEM.</small></li>').join('');
  return '<section class="pcmMonitoringCard"><h4>📈 MONITORAMENTO DE CONDIÇÃO · TREINAMENTO</h4>'
   +'<p><strong>Observação inicial:</strong> '+esc(m.baseline||'')+'</p>'
   +'<p>Resultados qualitativos criados para o jogo; nenhum prazo é critério real de liberação de máquina.</p>'
   +controls+(history?'<details open><summary>Histórico de recoletas ('+(m.samples||[]).length+')</summary><ol>'+history+'</ol></details>':'')
   +'</section>';
 }
 function renderPCM(n,model,d,I,E,s,T,M){
  const statuses={aguarda_revisao_pcm:'AGUARDA REVISÃO',devolvida:'DEVOLVIDA',aprovada_pcm:'PLANEJAMENTO APROVADO',arquivada_pcm:'ARQUIVADA',convertida_os:'OS GERADA',monitorando:'EM MONITORAMENTO',encerrada_monitoramento:'ENCERRADO SEM OS',escalonada_monitoramento:'ESCALONADO AO PCM'};
  const id=esc(n.id),status=esc(statuses[n.status]||'STATUS DESCONHECIDO');
  const header='<header class="inspectionNotificationHead"><strong>'+id+' · '+esc(model(n.modelId))+' · '+esc(n.asset)+'</strong><span class="inspectionBadge">'+status+'</span></header>';
  const field=esc(n.reportedIndication||n.description||'Nenhuma evidência de campo disponível.');
  const details='<div class="inspectionObservation"><strong>ENCONTRADO NA INSPEÇÃO</strong><p>'+field+'</p></div>'
   +'<small>Prioridade: '+esc(n.priority.toUpperCase())+' · Inspeção '+esc(n.inspectionId)+' · cenário de treinamento, sem medição real</small>';
  const hist=Array.isArray(n.reviewHistory)&&n.reviewHistory.length
   ?'<details class="inspectionAudit"><summary>Histórico de decisões · '+n.reviewHistory.length+'</summary><ol>'
     +n.reviewHistory.slice(-8).map(h=>'<li>Turno '+Number(h.tick||0)+' · '+esc(h.action)+' · '+esc(h.reason)+'</li>').join('')+'</ol></details>':'';
  const select=(inputId,options,empty)=>'<select id="'+inputId+'">'+(empty?'<option value="">'+esc(empty)+'</option>':'')
   +options.map(([code,label])=>'<option value="'+esc(code)+'">'+esc(label)+'</option>').join('')+'</select>';
  const reasonChoices=items=>'<label>Motivo da decisão '+select('pcm-reason-'+id,Object.entries(items),'SELECIONE O MOTIVO')+'</label>';
  const buy='<div class="pcmResourceBox"><h4>APROVISIONAMENTO · ESCOLHA DO PLANEJADOR</h4>'
   +'<p class="muted">Os itens não são recomendações automáticas. Escolher e comprar não revela o diagnóstico correto.</p>'
   +'<div class="pcmScopeRow"><label>Material '+select('pcm-item-'+id,Object.entries(d.items).map(([code,v])=>[code,code+' · '+v.name+' · R$ '+v.unit]),'SELECIONE UMA PEÇA')+'</label>'
   +'<label>Quantidade '+select('pcm-qty-'+id,[1,2,3,4,5].map(v=>[String(v),String(v)]))+'</label></div>'
   +'<div class="pcmActions"><button class="act secondary" data-pcm-buy="material" data-notification-id="'+id+'">📦 SOLICITAR MATERIAL</button></div>'
   +'<div class="pcmScopeRow"><label>Ferramenta '+select('pcm-tool-'+id,Object.entries(d.tools).map(([code,v])=>[code,code+' · '+v.name+' · R$ '+v.cost]),'SELECIONE O FERRAMENTAL')+'</label>'
   +'<label>Prazo da compra '+select('pcm-speed-'+id,[['normal','Normal'],['rush','Urgente']])+'</label></div>'
   +'<div class="pcmActions"><button class="act secondary" data-pcm-buy="tool" data-notification-id="'+id+'">🛠 COMPRAR FERRAMENTA</button></div></div>';
  if(n.monitorOnly)return '<article class="inspectionNotification">'+header+details+monitorWidget(n,s,M)+hist+'</article>';
  let actions='';
  if(n.status==='aguarda_revisao_pcm'){
   const hypotheses=I.hypotheses(s,d,E,n.id);
   const options=hypotheses?.map((arr,i)=>'<label class="pcmHypothesis">'+esc(I.STAGES[i])
    +select('pcm-diagnosis-'+i+'-'+id,arr.map(x=>[x.id,x.label]),i===5?'NÃO DEFINIR A CAUSA':'SELECIONE UMA HIPÓTESE')
    +'</label>')||[];
   actions='<div class="pcmReviewArea"><h4>HIPÓTESES DO PLANEJADOR · SEM GABARITO</h4>'
    +'<p class="muted">As escolhas são encaminhadas à equipe. Não haverá indicação de acerto ou erro nesta tela. A causa pode permanecer sem definição.</p>'
    +'<div class="pcmHypothesisSections"><h5>LOCAL DE INSTALAÇÃO</h5><div class="pcmHypothesisGrid">'+options.slice(0,3).join('')+'</div>'
    +'<h5>MODO DE FALHA</h5><div class="pcmHypothesisGrid">'+options.slice(3).join('')+'</div></div>'
    +'<div class="pcmScopeRow"><label>Estratégia de serviço '+select('pcm-action-'+id,Object.entries(I.ACTIONS))+'</label>'
    +'<label>Disciplina '+select('pcm-trade-'+id,Object.entries(I.TRADES))+'</label>'
    +'<label>HH previstas '+select('pcm-hh-'+id,[0.5,1,2,3,4,5,6,8,10,12,16,20,24,40].map(v=>[String(v),v+' HH']))+'</label></div>'
    +'<div class="pcmActions"><button class="act" data-notification-action="approve" data-notification-id="'+id+'">✓ ENVIAR PLANEJAMENTO</button>'
    +'<button class="act secondary" data-notification-action="return" data-notification-id="'+id+'">↩ DEVOLVER</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR</button></div>'
    +reasonChoices({...I.RETURN_REASONS,...I.ARCHIVE_REASONS})+buy+'</div>';
  }else if(n.status==='devolvida'){
   actions='<div class="pcmReviewArea"><p class="inspectionAttention">Motivo: '+esc(n.reviewReason||'Complementação solicitada')+'</p>'
    +'<label>Prioridade '+select('pcm-priority-'+id,['baixa','media','alta'].map(v=>[v,v.toUpperCase()]))+'</label>'
    +'<div class="pcmActions"><button class="act" data-notification-action="resubmit" data-notification-id="'+id+'">REENVIAR ACHADO</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR</button></div>'
    +reasonChoices(I.ARCHIVE_REASONS)+'</div>';
  }else if(n.status==='aprovada_pcm'){
   actions='<div class="pcmApprovedScope"><strong>HIPÓTESES ENCAMINHADAS · SEM AVALIAÇÃO</strong><p>'+esc(n.planningScope?.description||'')+'</p>'
    +'<small>'+esc(n.planningScope?.tradeLabel||'')+' · '+Number(n.planningScope?.estimatedHH||0)+' HH planejadas; equipe ainda não alocada.</small></div>'
    +'<div class="pcmActions"><button class="act" data-notification-action="convert" data-notification-id="'+id+'">GERAR OS PARA O MECÂNICO</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR</button></div>'
    +reasonChoices(I.ARCHIVE_REASONS)+buy;
  }else if(n.status==='convertida_os'){
   actions='<p class="inspectionLinked">✓ '+esc(n.workOrderId||'')+' criada. O plano será avaliado quando o mecânico iniciar o serviço.</p>';
  }else if(n.status==='arquivada_pcm'){
   actions='<p class="inspectionAttention">Motivo do arquivamento: '+esc(n.reviewReason||'')+'</p>';
  }
  return '<article class="inspectionNotification">'+header+details+renderEvidence(n,d,T,s)+actions+hist+'</article>';
 }

 function render(s,d,I,E,T,M){
  I.normalized(s);
  const summary=I.summary(s),monitorSummary=M?M.summary(s):null,current=s.inspections.filter(x=>x.tick===s.tick);
  const recent=s.inspections.filter(x=>x.tick!==s.tick&&['finding','notified'].includes(x.status)).slice(-8).reverse();
  const modelName=id=>d.models.find(m=>m.id===id)?.title||id;
  const card=x=>{
   const labels={pending:'A INSPECIONAR',expired:'VENCIDA',finding:'INDÍCIO OBSERVADO',notified:'NOTIFICAÇÃO GERADA',clear:'SEM ANORMALIDADE'};
   const title='<div class="inspectionTitle"><strong>'+esc(modelName(x.modelId))+' · '+esc(x.asset)+'</strong>'
    +'<span class="inspectionBadge '+(['finding','notified'].includes(x.status)?'inspectionFinding':x.status==='clear'?'inspectionClear':'')+'">'+esc(labels[x.status]||x.status)+'</span></div>';
   let actions='';
   if(x.status==='pending'&&x.tick===s.tick)
    actions='<button type="button" class="act" data-inspection-action="inspect" data-inspection-id="'+esc(x.id)+'">🔎 REALIZAR INSPEÇÃO</button>';
   if(x.status==='finding'){
    actions='<p class="muted">O registro será criado automaticamente a partir do achado observado. Nenhuma descrição manual é necessária.</p>'
     +'<div class="inspectionNotifyActions"><label>Prioridade <select id="inspection-priority-'+esc(x.id)+'">'
     +'<option value="media">Média</option><option value="baixa">Baixa</option><option value="alta">Alta</option></select></label>'
     +'<button class="act" type="button" data-inspection-action="notify" data-inspection-id="'+esc(x.id)+'">📋 ABRIR NOTIFICAÇÃO</button></div>';
   }
   return '<article class="inspectionCard">'+title+'<small class="muted">'+esc(x.id)+' · D'+x.day+' / '+(x.shift?'B':'A')+' · inspeção fictícia</small>'
    +(x.observed?'<p class="inspectionObservation">'+esc(x.observed)+'</p>':'<p class="muted">Condição desconhecida até a inspeção sensitiva.</p>')
    +(x.notificationId?'<p class="inspectionLinked">📋 '+esc(x.notificationId)+' · revisão PCM pendente · não é OS</p>':'')
    +actions+'</article>';
  };
  const statusWeight={monitorando:0,aguarda_revisao_pcm:1,devolvida:2,aprovada_pcm:3,escalonada_monitoramento:4,convertida_os:5,encerrada_monitoramento:6,arquivada_pcm:7};
  const rows=s.notifications.slice().sort((a,b)=>(statusWeight[a.status]??5)-(statusWeight[b.status]??5)||b.openedTick-a.openedTick)
   .slice(0,25).map(n=>renderPCM(n,modelName,d,I,E,s,T,M)).join('');
  const monitoring=M?'<section class="pcmMonitoringPractice"><h3>📈 CARTEIRA · MONITORAMENTO POR CONDIÇÃO</h3>'
   +'<p>Crie um caso qualitativo de monitoramento, justifique por que ainda não abrir OS e compare recoletas futuras. A decisão fictícia não é autorização de operação real.</p>'
   +Object.entries(M.PROTOCOLS).map(([id,p])=>'<button class="act secondary" type="button" data-monitor-start="'+esc(id)+'">'+esc(p.label)+'</button>').join(' ')
   +'</section>':'';
  const practice=T?'<section class="pcmEvidencePractice"><h3>🔬 TREINO DE DIAGNÓSTICO COM TESTES</h3>'
   +'<p>Escolha o sintoma. A falha é uma de duas variantes didáticas ocultas e muda no próximo exercício. Até dois exercícios por turno, sem criar OS automaticamente.</p>'
   +Object.entries(T.FAMILIES).map(([id,x])=>'<button type="button" class="act secondary" data-evidence-practice="'+esc(id)+'">'+esc(x.label)+'</button>').join(' ')
   +'</section>':'';
  return '<p class="inspectionIntro"><strong>INSPEÇÃO → HIPÓTESES PCM → EXECUÇÃO MECÂNICA.</strong> Observações simuladas sem medições OEM e sem conclusão causal.</p>'
   +practice+monitoring
   +(monitorSummary?'<div class="inspectionMetrics"><div><small>MONITORAMENTOS ATIVOS</small><strong>'+monitorSummary.active+'</strong></div><div><small>RECOLETAS VENCIDAS</small><strong>'+monitorSummary.due+'</strong></div><div><small>AGRAVAMENTOS</small><strong>'+monitorSummary.attention+'</strong></div><div><small>ENCERRADOS SEM OS</small><strong>'+monitorSummary.closed+'</strong></div></div>':'')
   +'<div class="inspectionMetrics"><div><small>PROGRAMADAS</small><strong>'+current.length+'</strong></div><div><small>A REALIZAR</small><strong>'+summary.pending+'</strong></div>'
   +'<div><small>NOTAS EM REVISÃO</small><strong>'+summary.awaiting+'</strong></div><div><small>ESCOPO APROVADO</small><strong>'+summary.approved+'</strong></div></div>'
   +'<h3 class="resourceSection">RONDA DO TURNO · DIA '+s.day+' / '+(s.shift?'B':'A')+'</h3>'
   +'<p class="muted">Até três máquinas sem OS ativa por turno. HH e custos ainda não são simulados. Nenhum gabarito é exposto.</p>'
   +'<div class="inspectionList">'+[...current,...recent].map(card).join('')+'</div>'
   +'<h3 class="resourceSection">MESA PCM · NOTIFICAÇÕES · '+s.notifications.length+'</h3>'
   +(rows||'<p class="muted">Nenhuma notificação aberta.</p>')
   +'<p class="inspectionFuture">Revisão e conversão de OS disponíveis. Programação detalhada, reserva de materiais e dimensionamento de equipe permanecem no menu Planejamento PCM.</p>';
 }
 return {render,renderPCM,monitorWidget};
});