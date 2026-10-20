/* Apresentação Phaser do setor de inspeção. Não altera regras ou gabaritos. */
(function(root,factory){
 const V=factory();if(typeof module!=='undefined'&&module.exports)module.exports=V;
 root.PORCARIA_INSPECTION_VIEW=V;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function renderPCM(n,model){
  const statuses={aguarda_revisao_pcm:'AGUARDA REVISÃO',devolvida:'DEVOLVIDA AO EMISSOR',aprovada_pcm:'ESCOPO APROVADO',arquivada_pcm:'ARQUIVADA',convertida_os:'OS GERADA'};
  const id=esc(n.id);
  const status=esc(statuses[n.status]||'STATUS DESCONHECIDO');
  const header='<header class="inspectionNotificationHead"><strong>'+id+' · '+esc(model(n.modelId))+' · '+esc(n.asset)+'</strong>'
   +'<span class="inspectionBadge">'+status+'</span></header>';
  const details='<p><strong>Relato:</strong> '+esc(n.description)+'</p>'
   +'<small>Prioridade informada: '+esc(n.priority.toUpperCase())+' · Inspeção de origem: '+esc(n.inspectionId)
   +' · fonte: observação didática (sem laudo ou medição)</small>';
  const history=Array.isArray(n.reviewHistory)&&n.reviewHistory.length
   ?'<details class="inspectionAudit"><summary>Histórico de revisão · '+n.reviewHistory.length+' ação(ões)</summary><ol>'
     +n.reviewHistory.slice(-8).map(h=>'<li>Turno '+Number(h.tick||0)+' · '+esc(h.action)+' · '+esc(h.reason)+'</li>').join('')+'</ol></details>':'';
  const reviewNote='<label class="inspectionLabel" for="pcm-reason-'+id+'">Justificativa técnica (obrigatória para devolução/arquivamento)</label>'
   +'<textarea class="inspectionInput" id="pcm-reason-'+id+'" maxlength="500" rows="2" placeholder="O que falta verificar ou por que o serviço não será aberto?"></textarea>';
  let actions='';
  if(n.status==='aguarda_revisao_pcm'){
   const trades=[['mecanica','Mecânica'],['hidraulica','Hidráulica'],['eletrica','Elétrica'],['eletronica','Eletrônica'],['lubrificacao','Lubrificação'],['estruturas','Estruturas'],['instrumentacao','Instrumentação']];
   actions='<div class="pcmReviewArea"><h4>REVISÃO TÉCNICA · PCM</h4>'
    +'<label class="inspectionLabel" for="pcm-scope-'+id+'">Delimitação do serviço (não declarar causa como confirmada)</label>'
    +'<textarea class="inspectionInput" id="pcm-scope-'+id+'" rows="3" maxlength="700" placeholder="Inspecionar, testar e confirmar..."></textarea>'
    +'<div class="pcmScopeRow"><label>Disciplina<select id="pcm-trade-'+id+'">'+trades.map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select></label>'
    +'<label>HH estimadas<input id="pcm-hh-'+id+'" type="number" min="0.5" max="80" step="0.5" value="2"></label></div>'
    +reviewNote+'<div class="pcmActions">'
    +'<button class="act" data-notification-action="approve" data-notification-id="'+id+'">✓ APROVAR ESCOPO</button>'
    +'<button class="act secondary" data-notification-action="return" data-notification-id="'+id+'">↩ DEVOLVER</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR COM MOTIVO</button></div></div>';
  }else if(n.status==='devolvida'){
   actions='<div class="pcmReviewArea"><p class="inspectionAttention"><strong>Complementação solicitada:</strong> '+esc(n.reviewReason||'Não informada')+'</p>'
    +'<label class="inspectionLabel" for="pcm-description-'+id+'">Corrigir descrição da notificação</label>'
    +'<textarea class="inspectionInput" id="pcm-description-'+id+'" maxlength="600" rows="3">'+esc(n.description)+'</textarea>'
    +'<label>Prioridade<select id="pcm-priority-'+id+'">'
    +['baixa','media','alta'].map(p=>'<option value="'+p+'"'+(p===n.priority?' selected':'')+'>'+p.toUpperCase()+'</option>').join('')+'</select></label>'
    +'<div class="pcmActions"><button class="act" data-notification-action="resubmit" data-notification-id="'+id+'">REENVIAR À REVISÃO</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR COM MOTIVO</button></div>'
    +reviewNote+'</div>';
  }else if(n.status==='aprovada_pcm'){
   const p=n.planningScope||{};
   actions='<div class="pcmApprovedScope"><strong>ESCOPO APROVADO</strong><p>'+esc(p.description||'')+'</p>'
    +'<small>'+esc(p.tradeLabel||p.trade||'')+' · '+Number(p.estimatedHH||0)+' HH estimadas · '
    +'Ainda não programada, sem equipe, box ou materiais reservados.</small></div>'
    +'<div class="pcmActions"><button class="act" data-notification-action="convert" data-notification-id="'+id+'">GERAR OS PARA PLANEJAMENTO</button>'
    +'<button class="act secondary" data-notification-action="archive" data-notification-id="'+id+'">ARQUIVAR COM MOTIVO</button></div>'+reviewNote;
  }else if(n.status==='convertida_os'){
   actions='<p class="inspectionLinked">✓ Vinculada à OS '+esc(n.workOrderId||'')+'. Programação, equipe e box são definidos no PCM.</p>';
  }else if(n.status==='arquivada_pcm'){
   actions='<p class="inspectionAttention">Arquivada com justificativa: '+esc(n.reviewReason||'Não informada')+'</p>';
  }
  return '<article class="inspectionNotification">'+header+details+actions+history+'</article>';
 }

 function render(s,d,I){
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
    const description='Relato de inspeção: '+String(x.observed||'').replace(/^Indício observado no exercício: /,'');
    actions='<label class="inspectionLabel" for="inspection-note-'+esc(x.id)+'">Descreva o sintoma (15 a 600 caracteres)</label>'
     +'<textarea class="inspectionInput" id="inspection-note-'+esc(x.id)+'" rows="3" maxlength="600">'+esc(description)+'</textarea>'
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
   .slice(0,25).map(n=>renderPCM(n,modelName)).join('');
  return '<p class="inspectionIntro"><strong>INSPEÇÃO ≠ DIAGNÓSTICO ≠ ORDEM DE SERVIÇO.</strong> Observações simuladas sem medições OEM e sem conclusão causal.</p>'
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