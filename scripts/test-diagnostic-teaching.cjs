/* v0.8.8: prática diagnóstica contextual, não antecipação e retrocompatibilidade */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'..');
const E=require(path.join(base,'engine.js'));
const B=require(path.join(base,'phaser-play','diagnostic-board.js'));
const V=require(path.join(base,'phaser-play','diagnostic-view.js'));
const data=JSON.parse(fs.readFileSync(path.join(base,'game-data.json'),'utf8'));
const s=E.create(data,()=>0.42),j=s.jobs[0],sc=E.scenario(data,j.scene);
const m=s.team[0];
assert.equal(E.attach(s,j.id,m.id,0,true),null);
s.tools[sc.tool]=true;
const beforeHint=JSON.stringify(s);
const result=E.hint(s,data,j.id);
assert.equal(result,null);
assert.notEqual(JSON.stringify(s),beforeHint);
assert.equal(j.hints[0],true);
const hint=j.diagnosticLog.at(-1);
assert.equal(hint.outcome,'evidence');
assert.equal(hint.value,'Inspeção orientativa solicitada');
assert.notEqual(hint.value,sc.path[0], 'engine never logs answer when requesting evidence');
let report=B.compute(s,data,j);
assert.equal(report.stage,0);
assert.ok(report.hasHint);
assert.ok(report.currentGuidance.question);
assert.ok(report.currentGuidance.evidence);
assert.ok(report.clue.includes('Localize'));
assert.ok(report.steps.every(x=>x.result===null&&x.explanation===null));
assert.equal(report.caseStudy,null);
assert.ok(!JSON.stringify(report).includes(sc.lesson),'lesson must remain hidden until completion');
const html=V.render(report,j.id);
assert.ok(html.includes('QUESTÃO DA ETAPA ATUAL'));
assert.ok(html.includes('COMO INVESTIGAR'));
assert.ok(!html.includes('APRENDIZADO DO CASO'));
assert.ok(!html.includes(sc.verification),'verification remains secret until completion');
assert.ok(!html.includes(sc.lesson),'lesson remains secret until completion');

// Legacy save may persist correct answers in old evidence logs; the projection must scrub them.
const copied=structuredClone(j);
copied.diagnosticLog.push({stage:0,tick:0,outcome:'evidence',source:'player',value:'SEGREDO_EVIDENCIA_LEGADA'});
report=B.compute(s,data,copied);
assert.ok(report.log.some(x=>x.kind==='evidence'));
assert.ok(!JSON.stringify(report).includes('SEGREDO_EVIDENCIA_LEGADA'));
assert.ok(!V.render(report,j.id).includes('SEGREDO_EVIDENCIA_LEGADA'));

// All scenarios should respect the six-stage learning gate and have useful source content.
for(const scenario of data.scenarios){
 const mock={...j,scene:scenario.id,stage:5,hints:{5:true},diagnosticLog:[]};
 const projection=B.compute(s,data,mock);
 assert.equal(projection.currentLabel,'Causa');
 assert.equal(projection.caseStudy,null,scenario.id+' must not show source lesson before stage 6');
 assert.ok(!JSON.stringify(projection).includes(scenario.lesson||'___missing___'));
 assert.ok(!JSON.stringify(projection).includes(scenario.verification||'___missing___'));
 assert.ok(projection.currentGuidance.evidence);
 const done=B.compute(s,data,{...mock,stage:6});
 assert.equal(done.complete,true);
 assert.equal(done.currentGuidance,null);
 assert.equal(done.caseStudy.verification,scenario.verification);
 assert.equal(done.caseStudy.lesson,scenario.lesson);
 assert.ok(done.steps[4].explanation);
 assert.ok(done.steps[5].explanation);
 assert.ok(V.render(done,j.id).includes('APRENDIZADO DO CASO'));
}

// Success exposes criteria for damage/cause only when that stage is confirmed.
let prefix=B.compute(s,data,{...j,stage:4,hints:{}});
assert.equal(prefix.steps[4].explanation,null);
assert.equal(prefix.steps[5].explanation,null);
const afterDamage=B.compute(s,data,{...j,stage:5,hints:{}});
assert.ok(afterDamage.steps[4].explanation.includes('O dano caracteriza'));
assert.equal(afterDamage.steps[5].explanation,null);
assert.equal(afterDamage.caseStudy,null);
// Read-only, deterministic, XSS-safe:
const save=JSON.stringify(s);
assert.deepEqual(B.compute(s,data,j),B.compute(s,data,j));
assert.equal(JSON.stringify(s),save);
assert.ok(!V.render({...report,caseStudy:{verification:'<svg onload=alert(1)>',lesson:'...',provenance:'test'},complete:true},j.id).includes('<svg onload'));
assert.ok(V.render({...report,caseStudy:{verification:'<svg onload=alert(1)>',lesson:'...',provenance:'test'},complete:true},j.id).includes('&lt;svg onload'));

const page=fs.readFileSync(path.join(base,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(base,'sw.js'),'utf8');
assert.ok(page.includes('diagnostic-board.js?v=0.8.8'));
assert.ok(page.includes('diagnostic-view.js?v=0.8.8'));
assert.ok(page.includes('game.js?v=0.9.11'));
assert.ok(page.includes('.diagnosticCoach'));
assert.ok(page.includes('.diagnosticLearning'));
assert.ok(page.includes('.diagnosticCaseStudy'));
assert.ok(sw.includes('porcaria-vqec-20261019-v111'));
console.log('OK: orientação por etapa, evidência segura, legado higienizado, caso revelado apenas após 6/6 e sem alterações no save.');
