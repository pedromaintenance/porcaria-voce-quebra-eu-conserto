/* P.O.R.C.A.R.I.A. — PCM 0.9.36: bulk inspections, prediagnosis and unplanned penalties. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const E=require('../engine.js'),I=require('../phaser-play/inspection.js');
const V=require('../phaser-play/inspection-view.js'),S=require('../phaser-play/sector-views.js');
const D=require('../game-data.json');
function session(){const s=E.create(D,()=>.42);I.normalized(s);const rec=I.plan(s,D);assert.ok(rec.length);return {s,rec};}
{
 const {s,rec}=session(),before=s.jobs.length;
 const field=S.inspections(s,D,I,E);
 assert.ok(field.includes('data-inspection-action="all"'),'comando de execução em lote visível');
 const result=I.inspectAllScheduled(s,D);
 assert.equal(result.completed,rec.length);
 assert.equal(result.clear+result.notified,result.completed);
 assert.ok(result.notified>0,'achados enviados automaticamente ao PCM');
 assert.equal(s.jobs.length,before,'lote não cria OS');
 assert.equal(I.inspectAllScheduled(s,D).completed,0,'duplo clique não repete a inspeção');
 assert.equal(s.notifications.filter(n=>n.inspectionId).length,result.notified);
 assert.equal(E.validate(s),true);
}
function note(){
 const {s,rec}=session();
 const done=I.inspectAndRoute(s,D,rec[0].id);
 assert.ok(done.notification,'primeira inspeção encontra anomalia e notifica');
 return {s,n:done.notification};
}
{
 const {s,n}=note();const choices=I.hypotheses(s,D,E,n.id);
 assert.equal(choices.length,6);
 const diagnosis=choices.map((arr,i)=>i===5?'':arr[0].id);
 const approval=I.review(s,n.id,'approve',{diagnosis,action:'verificar',trade:'mecanica',estimatedHH:2},D,E);
 assert.equal(approval.ok,true,'Causa opcional');
 assert.equal(n.planningDiagnosis.optionalCause,true);
 n.plannedResources={material:Object.keys(D.items)[0],qty:2,tool:Object.keys(D.tools)[0]};
 const converted=I.commitConversion(s,D,E,n.id);
 assert.equal(converted.ok,true);
 assert.equal(converted.order.unplannedDiagnosis,false,'não penalizar por Causa indefinida');
 assert.deepEqual(converted.order.plannedResources,n.plannedResources);
 const free=s.team.find(m=>!m.assigned);
 const before={mental:free.mental,physical:free.physical,morale:free.morale};
 assert.equal(E.attach(s,converted.order.id,free.id,0,false),null);
 assert.deepEqual({mental:free.mental,physical:free.physical,morale:free.morale},before);
}
{
 const {s,n}=note();
 const response=I.review(s,n.id,'approve',{action:'verificar',trade:'mecanica',estimatedHH:1.5},D,E);
 assert.equal(response.ok,true,'aprovação sem nenhum nível de pré-diagnóstico');
 assert.equal(n.planningWithoutDiagnosis,true);
 assert.equal(n.planningDiagnosis,null);
 const converted=I.commitConversion(s,D,E,n.id);
 assert.equal(converted.ok,true,'a OS pode existir sem pré-diagnóstico');
 const order=converted.order;
 assert.equal(order.unplannedDiagnosis,true);
 const free=s.team.find(m=>!m.assigned),before=[free.mental,free.physical,free.morale];
 assert.equal(E.attach(s,order.id,free.id,0,false),null);
 assert.deepEqual([free.mental,free.physical,free.morale],before.map((v,i)=>Math.max(0,v-[12,10,10][i])));
 assert.equal(order.noPrediagnosisPenaltyApplied,true);
 assert.equal(s.decisionHistory.filter(x=>x.type==='pcm_no_prediagnosis_impact').length,1);
 assert.equal(E.release(s,order.id),null);
 assert.equal(E.attach(s,order.id,free.id,0,false),null);
 assert.deepEqual([free.mental,free.physical,free.morale],before.map((v,i)=>Math.max(0,v-[12,10,10][i])),'penalização única');
 const clone=JSON.parse(JSON.stringify(s));assert.equal(E.validate(clone),true);
 assert.equal(clone.jobs.find(j=>j.id===order.id).noPrediagnosisPenaltyApplied,true,'persiste no save');
}
{
 const {s,n}=note();
 n.pcmDraft={diagnosis:['S','G','SB','P','D',''],action:'reparar',trade:'mecanica',estimatedHH:'4'};
 const html=V.renderPCM(n,id=>id,D,I,E,s);
 assert.ok(html.includes('pcmReviewColumns'),'colunas do PCM');
 assert.ok(html.includes('data-notification-id="'+n.id+'"'),'metadados do formulário');
 assert.ok(html.includes('value="reparar" selected'),'recupera seleção do rascunho');
 assert.ok(html.includes('data-notification-action="approve"'));
}
const game=fs.readFileSync('phaser-play/game.js','utf8');
const html=fs.readFileSync('phaser-play/index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(game.includes('capturePCMDraft(id)'),'compra guarda rascunho');
assert.ok(game.includes('showPCMDecisionDialog(id,warnings)'),'popup customizado antes de OS incompleta');
assert.ok(game.includes('setupPCMDecisionDialog()'),'listeners do popup registrados');
assert.ok(!game.includes("window.confirm('CONFIRMAR GERAÇÃO DE OS?"),'nunca usar diálogo nativo na geração da OS');
assert.ok(html.includes('id="pcmConfirmOverlay"')&&html.includes('role="dialog" aria-modal="true"'),'modal acessível do PCM');
assert.ok(html.includes('id="pcmConfirmProceed"')&&html.includes('id="pcmConfirmCancel"'),'ações explícitas');
assert.ok(game.includes('closePCMDecisionDialog()'),'cancelamento preserva OS e formulário');
assert.ok(game.includes('finishPCMConversion(pending.id)'),'confirmar executa apenas após autorização');
assert.ok(game.includes('I.inspectAllScheduled(state,data)'),'botão vinculado à operação');
assert.ok(html.includes('grid-template-columns:minmax(0,3fr) minmax(0,7fr)'));
assert.ok(sw.includes('pcm-inspection-v36'),'cache renovado');
console.log('OK PCM 0.9.36: inspeções em lote, layout 30/70, rascunho, Causa opcional, penalidade única e OS sem pré.');
