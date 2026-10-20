/* Apresentação Phaser do setor de inspeção. Não altera regras ou gabaritos. */
(function(root,factory){
 const V=factory();if(typeof module!=='undefined'&&module.exports)module.exports=V;
 root.PORCARIA_INSPECTION_VIEW=V;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function renderPCM(n,model,d,I,E,s){
  const statuses={aguarda_revisao_pcm:'AGUARDA REVISÃO',devolvida:'DEVOLVIDA',aprovada_pcm:'PLANEJAMENTO APROVADO',arquivada_pcm:'ARQUIVADA',convertida_os:'OS GERADA'};
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
  let actions='';
  if(n.status==='aguarda_revisao_pcm'){
   const hypotheses=I.hypotheses(s,d,E,n.id);
   const options=hypotheses?.map((arr,i)=>'<label class="pcmHypothesis">'+esc(I.STAGES[i])
    +select('pcm-diagnosis-'+i+'-'+id,arr.map(x=>[x.id,x.label]),i===5?'NÃO DEFINIR A CAUSA':'SELECIONE UMA HIPÓTESE')
    +'</label>').join('')||'<p>Hipóteses indisponíveis para esta notificação.</p>';
   actions='<div class="pcmReviewArea"><h4>HIPÓTESES DO PLANEJADOR · SEM GABARITO</h4>'
    +'<p class="muted">As escolhas são encaminhadas à equipe. Não haverá indicação de acerto ou erro nesta tela. A causa pode permanecer sem definição.</p>'
    +'<div class="pcmHypothesisSections"><h5>LOCAL DE INSTALAÇÃO</h5><div class="pcmHypothesisGrid">'+options+'</div></div>'
    +'<div class="pcmScopeRow"><label>Estratégia de serviço '+select('pcm-action-'+id,Object.entries(I.ACTIONS))+'</label>'
    +'<label>Disciplina '+select('pcm-trade-'+id,Object.entries(I.TRADES))+'</label>'
    +'<label>HH previstas '+select('pcm-hh-'+id,[0.5,1,2,3,4,5,6,8,10,12,16,20,24,40].map(v=>[String(v),v+' HH']))+'</label></div>'
    +'<div class="pcmActions"><button class="act" data-notification-action="approve" data-notification-id="'+id+'">✓ ENVIAR PLANEJAMENTO</button>'
    +'<button class="act secondary" data-notification-action="return" data-notification-id="'+id+'">↩ DEVOLVER</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR</button></div>'
    +reasonChoices(I.RETURN_REASONS)+buy+'</div>';
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
  return '<article class="inspectionNotification">'+header+details+actions+hist+'</article>';
 }

 function render(s,d,I,E){
  I.normalized(s);
  const summary=I.summary(s),current=s.inspections.filter(x=>x.tick===s.tick);
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
  const statusWeight={aguarda_revisao_pcm:0,devolvida:1,aprovada_pcm:2,convertida_os:3,arquivada_pcm:4};
  const rows=s.notifications.slice().sort((a,b)=>(statusWeight[a.status]??5)-(statusWeight[b.status]??5)||b.openedTick-a.openedTick)
   .slice(0,25).map(n=>renderPCM(n,modelName,d,I,E,s)).join('');
  return '<p class="inspectionIntro"><strong>INSPEÇÃO → HIPÓTESES PCM → EXECUÇÃO MECÂNICA.</strong> Observações simuladas sem medições OEM e sem conclusão causal.</p>'
   +'<div class="inspectionMetrics"><div><small>PROGRAMADAS</small><strong>'+current.length+'</strong></div><div><small>A REALIZAR</small><strong>'+summary.pending+'</strong></div>'
   +'<div><small>NOTAS EM REVISÃO</small><strong>'+summary.awaiting+'</strong></div><div><small>ESCOPO APROVADO</small><strong>'+summary.approved+'</strong></div></div>'
   +'<h3 class="resourceSection">RONDA DO TURNO · DIA '+s.day+' / '+(s.shift?'B':'A')+'</h3>'
   +'<p class="muted">Até três máquinas sem OS ativa por turno. HH e custos ainda não são simulados. Nenhum gabarito é exposto.</p>'
   +'<div class="inspectionList">'+[...current,...recent].map(card).join('')+'</div>'
   +'<h3 class="resourceSection">MESA PCM · NOTIFICAÇÕES · '+s.notifications.length+'</h3>'
   +(rows||'<p class="muted">Nenhuma notificação aberta.</p>')
   +'<p class="inspectionFuture">Revisão e conversão de OS disponíveis. Programação detalhada, reserva de materiais e dimensionamento de equipe permanecem no menu Planejamento PCM.</p>';
 }
 return {render};
});