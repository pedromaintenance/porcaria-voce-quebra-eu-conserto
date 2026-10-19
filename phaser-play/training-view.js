/* P.O.R.C.A.R.I.A. v0.8.30 — pasta administrativa da Bia (visual consultivo). */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_TRAINING_VIEW=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const groups={disciplines:'Disciplinas',systems:'Sistemas',machines:'Máquinas'};
 const label=(catalog,g,k)=>catalog[g]?.find(x=>x.id===k)?.label||k;
 const money=n=>Number(n||0).toLocaleString('pt-BR',{maximumFractionDigits:0});
 function render(s,E,chosen={}){
  const T=E.TRAINING,t=T.normal(s);
  const tabs=[
   {id:'internal',label:'CAPACITAÇÃO',atlas:'coaching',icon:'📎'},
   {id:'external',label:'OFERTAS',atlas:'field',icon:'🎫'},
   {id:'mandatory',label:'NORMATIVOS',atlas:'inspection',icon:'📌'},
   {id:'history',label:'HISTÓRICO',atlas:'feedback',icon:'🗂️'}
  ];
  const tab=tabs.some(x=>x.id===chosen.tab)?chosen.tab:'internal';
  const activeTab=tabs.find(x=>x.id===tab);
  const free=s.team.filter(m=>!T.reason(s,m)),booked=s.team.filter(m=>T.active(s,m));
  const group=groups[chosen.group]?chosen.group:'disciplines',skills=E.SKILL_CATALOG[group];
  const key=skills.some(x=>x.id===chosen.key)?chosen.key:skills[0].id;
  const trainerId=free.some(x=>x.id===chosen.trainerId)?chosen.trainerId:(free[0]?.id||'');
  const learnerId=free.some(x=>x.id===chosen.learnerId)?chosen.learnerId:(free.find(x=>x.id!==trainerId)?.id||'');
  const select=(id,items,v,attr='')=>'<select id="'+id+'" '+attr+' aria-label="'+(id==='trainingTeacher'?'Treinador':id==='trainingLearner'?'Aprendiz':id==='trainingGroup'?'Área do conhecimento':'Habilidade alvo')+'">'+items.map(([value,text])=>
   '<option value="'+esc(value)+'"'+(value===v?' selected':'')+'>'+esc(text)+'</option>').join('')+'</select>';
  const employees=free.map(m=>[m.id,m.name+' · '+m.id]);
  const evaluation=T.inspectInternal(s,trainerId,learnerId,group,key,E.SKILL_CATALOG);
  const decimal=v=>Number(v||0).toLocaleString('pt-BR',{maximumFractionDigits:2,minimumFractionDigits:0});
  const internalNote=evaluation.error?'<div class="trainingIssue">'+esc(evaluation.error)+'</div>':
   '<div class="trainingEstimate"><b>'+esc(evaluation.trainer.name)+' '+evaluation.T+'/100</b> → <b>'+esc(evaluation.learner.name)+' '+evaluation.A+'/100</b>'+
   '<span>Diferença '+evaluation.gap+' · <strong>ganho garantido: +'+decimal(evaluation.earned)+' crédito</strong> ('+
   '+'+evaluation.points+' ponto(s) agora; saldo final '+decimal(evaluation.remainder)+') · teto '+evaluation.cap+'</span></div>';
  const internal='<section class="trainingSticky trainingGreen"><h3>📎 TREINAMENTO INTERNO</h3>'+
    '<p>Dois mecânicos livres estudam uma habilidade durante 12h. Ganho garantido, sem sorteio; notas inteiras com saldo fracionário acumulado. Sem custo financeiro; ambos ficam fora das OS neste turno.</p>'+
    '<div class="trainingControls"><label>Instrutor'+select('trainingTeacher',employees,trainerId)+'</label>'+
    '<label>Aprendiz'+select('trainingLearner',employees,learnerId)+'</label>'+
    '<label>Categoria'+select('trainingGroup',Object.entries(groups),group)+'</label>'+
    '<label>Habilidade'+select('trainingSkill',skills.map(x=>[x.id,x.label]),key)+'</label></div>'+
    internalNote+'<button class="act" data-training-action="internal"'+(evaluation.error?' disabled':'')+'>RESERVAR 12H · GRATUITO</button></section>';
  const offers=t.offers.map(o=>{
   const participants=free.filter(m=>Number(m.competencies?.[o.group]?.[o.key]||0)<(o.premium?100:97));
   const selectedId=chosen.offerPeople?.[o.id];
   const selected=participants.find(m=>m.id===selectedId)||participants[0];
   const projection=selected?T.projected(selected,o.group,o.key,100,o.premium?100:97):null;
   return '<div class="trainingOffer"><b>'+esc(o.premium?'⭐ ESPECIALIZAÇÃO PREMIUM':'🎟️ CURSO EXTERNO')+'</b>'+
    '<strong>'+esc(label(E.SKILL_CATALOG,o.group,o.key))+'</strong>'+
    '<span>Professor 100 · '+(o.premium?'teto 100':'teto 97')+' · 12 horas · até o turno '+o.untilTick+'</span>'+
    (projection?'<div class="trainingEstimate">Ganho garantido: +'+decimal(projection.earned)+' crédito (+'+projection.points+' ponto(s) agora; saldo '+decimal(projection.remainder)+')</div>':'')+
    '<div class="trainingOfferEnroll">'+select('trainingPerson-'+esc(o.id),participants.map(m=>[m.id,m.name+' · atual '+m.competencies[o.group][o.key]]),selected?.id||'')+
    '<button class="act" data-training-action="external" data-offer="'+esc(o.id)+'"'+(!participants.length||s.cash<o.cost?' disabled':'')+'>INSCRIÇÃO · R$ '+money(o.cost)+'</button></div></div>';
  }).join('');
  const external='<section class="trainingSticky trainingYellow"><h3>🎫 CURSOS EXTERNOS</h3>'+
   '<p>Bia administra inscrições pagas e com ganho garantido. O instrutor equivale a 100 na habilidade; são 12h fora da operação. Oferta ocasional.</p>'+
   (offers||'<div class="trainingBlank">Nenhuma oferta disponível agora. Bia avisará quando receber novas vagas.</div>')+'</section>';
  const norm=s.team.filter(m=>Number.isFinite(m.normativeUntil)&&m.normativeUntil>s.tick).map(m=>
   '<div class="trainingNorm"><b>'+esc(m.name)+'</b><span>'+esc(m.normativeReason||'Treinamento normativo obrigatório')+'</span>'+
   '<small>'+Math.max(0,m.normativeUntil-s.tick)+' turno(s) para liberação</small></div>').join('');
  const mandatory='<section class="trainingSticky trainingPink"><h3>📌 SEGURANÇA DO TRABALHO</h3>'+
   '<p>Integração dos recém-contratados: dois turnos obrigatórios, antes da primeira OS. Exigências periódicas também bloqueiam a alocação temporariamente.</p>'+
   (norm||'<div class="trainingBlank">Não há pendências normativas abertas.</div>')+'</section>';
  const history=t.history.slice(0,24).map(h=>{
   const name=s.team.find(m=>m.id===h.personId)?.name||h.personId||'Colaborador';
   const desc=h.kind==='internal'?'Interno':h.kind==='external'?'Externo':h.kind==='onboarding'?'Integração normativa':h.kind==='practice'?'Prática em OS':'Normativo periódico';
   const title=h.kind==='practice'?'Prática na OS '+esc(h.jobId||'')+' · '+esc(label(E.SKILL_CATALOG,h.group,h.key)):h.key?label(E.SKILL_CATALOG,h.group,h.key):'Treinamento obrigatório';
   return '<li><strong>'+esc(name)+' · '+esc(desc)+'</strong><span>'+esc(title)+' · turno '+h.tick+
    (h.before!==null&&h.before!==undefined?' · '+h.before+' → '+h.after:'')+
    (Number.isFinite(h.earned)?' · +'+decimal(h.earned)+' crédito (saldo '+decimal(h.creditAfter)+')':'')+
    (h.cost?' · R$ '+money(h.cost):'')+'</span></li>';
  }).join('');
  const current=t.assignments.map(a=>{
   const person=s.team.find(m=>m.id===a.learnerId)?.name||a.learnerId;
   return '<div class="trainingAssignment"><b>'+esc(person)+'</b><span>'+esc(a.kind==='internal'?'Interno com '+(s.team.find(m=>m.id===a.trainerId)?.name||a.trainerId):'Externo')+
    ' · '+esc(label(E.SKILL_CATALOG,a.group,a.key))+' · conclusão após avançar turno</span></div>';
  }).join('');
  const historyPanel='<section class="trainingLedger trainingActiveSection"><h3>🗂️ REGISTROS ORGANIZADOS</h3><h4>EM ANDAMENTO</h4>'+
   (current||'<p>Nenhuma turma programada neste turno.</p>')+'<h4>FICHAS CONCLUÍDAS</h4>'+
   (history?'<ol>'+history+'</ol>':'<p>Os resultados aparecem aqui ao concluir as 12 horas.</p>')+'</section>';
  const sections={internal,external,mandatory,history:historyPanel};
  const newestNotice=t.notices[0]?.text||'Pasta atualizada. Escolha uma aba e eu organizo os registros.';
  const noteText=esc(newestNotice);
  const navigation=tabs.map(x=>
   '<button type="button" id="trainingTab-'+x.id+'" class="trainingFolderTab trainingTab-'+x.id+(x.id===tab?' is-selected':'')+'"'+
   ' data-training-tab="'+x.id+'" role="tab" aria-controls="trainingTabContent"'+
   ' aria-selected="'+(x.id===tab?'true':'false')+'" tabindex="'+(x.id===tab?'0':'-1')+'">'+x.icon+' '+x.label+'</button>'
  ).join('');
  return '<div class="trainingFolder trainingFolder--single">'+
   '<div class="trainingWorkspace">'+
   '<aside class="trainingBiaAside" aria-label="Bia, analista administrativa">'+
   '<div class="trainingBiaStage trainingBiaStage--'+activeTab.atlas+'">'+
   '<span class="trainingBiaPortrait" role="img" aria-label="Bia em poses animadas, Analista Administrativa do Setor de Treinamentos"></span></div>'+
   '<div class="trainingBiaCaption"><strong>BIA</strong><span>Analista Administrativa<br>Setor de Treinamentos</span></div>'+
   '<div class="trainingBiaSpeech"><small>📝 RECADO DA BIA</small><p>'+noteText+'</p></div>'+
   '</aside>'+
   '<div class="trainingDesk"><header class="trainingDeskHead"><small>📚 PASTA DE DESENVOLVIMENTO · OFICINA</small>'+
   '<h2>SETOR DE TREINAMENTOS</h2>'+
   '<p><strong>Bia é a Analista Administrativa do Setor de Treinamentos.</strong> Ela organiza inscrições, registros e avisos da Segurança do Trabalho. Os instrutores são mecânicos ou profissionais externos.</p></header>'+
   '<div class="trainingFolderTabs" role="tablist" aria-label="Áreas do setor de Treinamentos">'+navigation+'</div>'+
   '<div class="trainingMeta">Turno '+s.tick+' · '+free.length+' disponível(is) · '+booked.length+' em capacitação/normativo · Caixa R$ '+money(s.cash)+'</div>'+
   '<div id="trainingTabContent" role="tabpanel" aria-labelledby="trainingTab-'+tab+'" class="trainingTabContent" data-training-active="'+tab+'">'+
   sections[tab]+'</div>'+
   '<p class="trainingDisclaimer">Treinamentos e exigências normativas são fictícios para fins de jogo; não equivalem a certificações, NRs ou autorizações profissionais reais.</p>'+
   '</div></div></div>';
 }
 return Object.freeze({render});
});