/* Apresentação Phaser do setor de inspeção. Não altera regras ou gabaritos. */
(function(root,factory){
 const V=factory();if(typeof module!=='undefined'&&module.exports)module.exports=V;
 root.PORCARIA_INSPECTION_VIEW=V;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  const rows=s.notifications.slice(-12).reverse().map(n=>
   '<div class="inspectionNotification"><strong>'+esc(n.id)+'</strong> · '+esc(modelName(n.modelId))+' · '+esc(n.asset)+' · '+esc(n.priority.toUpperCase())
   +'<p>'+esc(n.description)+'</p><small>Aguardando revisão PCM · Não gera OS automaticamente</small></div>').join('');
  return '<p class="inspectionIntro"><strong>INSPEÇÃO ≠ DIAGNÓSTICO ≠ ORDEM DE SERVIÇO.</strong> Observações simuladas sem medições OEM e sem conclusão causal.</p>'
   +'<div class="inspectionMetrics"><div><small>PROGRAMADAS</small><strong>'+current.length+'</strong></div><div><small>A REALIZAR</small><strong>'+summary.pending+'</strong></div>'
   +'<div><small>INDÍCIOS SEM NOTA</small><strong>'+summary.findings+'</strong></div><div><small>NOTAS EM REVISÃO</small><strong>'+summary.awaiting+'</strong></div></div>'
   +'<h3 class="resourceSection">RONDA DO TURNO · DIA '+s.day+' / '+(s.shift?'B':'A')+'</h3>'
   +'<p class="muted">Até três máquinas sem OS ativa por turno. HH e custos ainda não são simulados. Nenhum gabarito é exposto.</p>'
   +'<div class="inspectionList">'+[...current,...recent].map(card).join('')+'</div>'
   +'<h3 class="resourceSection">CARTEIRA DE NOTIFICAÇÕES · '+s.notifications.length+'</h3>'
   +(rows||'<p class="muted">Nenhuma notificação aberta.</p>')
   +'<p class="inspectionFuture">Próximo ciclo de PCM: revisar, devolver ou aprovar notificações; delimitar escopo antes de criar OS. Ainda não implementado.</p>';
 }
 return {render};
});