/* P.O.R.C.A.R.I.A. v0.8.7 — apresentação da investigação (DOM HTML seguro). */
(function(root,factory){
 const view=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=view;
 if(root)root.PORCARIA_DIAGNOSTIC_VIEW=view;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(r,jobId){
  const items=arr=>arr.map(x=>'<li><small>'+esc(x.label)+'</small><strong>'+esc(x.result)+'</strong>'
   +(x.mechanicName?'<em>Com '+esc(x.mechanicName)+'</em>':'')+'</li>').join('');
  const group=(name,arr,empty,css)=>'<section class="diagnosticGroup '+css+'"><h4>'+name+' <span>'+arr.length+'</span></h4>'
   +(arr.length?'<ul>'+items(arr)+'</ul>':'<p>'+empty+'</p>')+'</section>';
  const steps=r.steps.map(x=>'<div class="diagnosticStep '+esc(x.status)+'"><small>'
   +(x.status==='confirmed'?'✓ CONFIRMADO':x.status==='current'?'● AGORA':'○ PENDENTE')+' · '+(x.index+1)+'/6</small>'
   +'<strong>'+esc(x.label)+'</strong><span>'+esc(x.status==='confirmed'?x.result:x.status==='current'?'Investigando':'A investigar')+'</span></div>').join('');
  const events=r.log.slice(-20).reverse().map(e=>'<li class="'+esc(e.kind)+'"><small>'+esc(e.title)+' · '+esc(e.stageLabel)+'</small>'
   +'<strong>'+esc(e.value)+'</strong><span>'+esc(e.legacy?'Save antigo: origem não identificada':
     e.source==='player'?'Você'+(e.mechanicName?' com '+e.mechanicName:''):
     e.source==='mechanic'?'Mecânico '+(e.mechanicName||'não identificado'):'Origem não registrada')
   +(e.tick!==null?' · Turno '+e.tick:'')+'</span></li>').join('');
  return '<section class="diagnosticBoard" aria-labelledby="diagnosticTitle">'
   +'<div class="diagnosticHero"><div><small>INVESTIGAÇÃO · '+esc(jobId)+'</small><h3 id="diagnosticTitle">'
   +(r.complete?'✓ DIAGNÓSTICO CONCLUÍDO':'ETAPA '+(r.stage+1)+' DE 6 · '+esc(r.currentLabel).toUpperCase())+'</h3>'
   +'<p>'+(r.complete?'Seis fases confirmadas. Prepare o reparo.':'Fase atual: '+esc(r.currentLabel)+'. Confirme uma hipótese ou peça evidências para avançar.')+'</p></div>'
   +'<div class="diagnosticPercent"><b>'+r.progress+'%</b><small>'+r.stage+'/6 confirmadas</small></div></div>'
   +'<div class="diagnosticMeter" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuenow="'+r.stage+'" aria-valuemin="0" aria-valuemax="6"><i style="width:'+r.progress+'%"></i></div>'
   +'<div class="diagnosticSteps">'+steps+'</div>'
   +'<div class="diagnosticGroups">'
   +group('✓ VOCÊ CONFIRMOU',r.player,'Nenhum acerto confirmado por você ainda.','player')
   +group('🔧 MECÂNICO DESCOBRIU',r.mechanic,'Nenhuma descoberta autônoma até agora.','mechanic')
   +(r.unknown.length?group('◷ HISTÓRICO ANTERIOR',r.unknown,'','unknown'):'')+'</div>'
   +(r.hasHint?'<div class="diagnosticClue"><b>🔎 EVIDÊNCIA COLETADA · '+esc(r.currentLabel)+'</b><p>'+esc(r.clue)+'</p></div>':'')
   +'<details class="diagnosticJournal"><summary>REGISTRO DA INVESTIGAÇÃO · '+r.log.length+' EVENTO(S) ▾</summary>'
   +(events?'<ol>'+events+'</ol>':'<p>Sem registros. Os acertos e as tentativas aparecerão aqui.</p>')
   +'<small>'+esc(r.methodology)+'</small></details>'
   +'<div class="diagnosticFooter"><span>Confirmado: <b>'+r.stage+'/6</b></span><span>Não confirmado: <b>'+r.wrongCount+'</b></span>'
   +(r.assignedMechanic?'<span>Em campo: <b>'+esc(r.assignedMechanic)+'</b></span>':'')+'</div></section>';
 }
 return {render};
});