/* v0.8.27 — competência conjugada e aprendizagem sem ganhar acima de 90 por prática. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const E=require(path.join(root,'engine.js'));
const C=E.COMPETENCY;
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const catalog=E.SKILL_CATALOG;
assert.equal(data.models.length,9);
assert.equal(data.scenarios.length,29);
for(const sc of data.scenarios){
 const keys=C.resolve(sc);
 for(const group of E.SKILL_GROUPS){
  assert.ok(catalog[group].some(x=>x.id===keys[group]),sc.id+'/'+group+'/'+keys[group]);
 }
}
const pedro=E.create(data,()=>.42).team.find(m=>m.sprite==='pedro');
const geovane=E.create(data,()=>.42).team.find(m=>m.sprite==='geovane');
const jnr=E.create(data,()=>.42).team.find(m=>m.sprite==='junior');
const scenario=data.scenarios.find(c=>c.id==='INC001');
const normal=C.evaluate(pedro,scenario);
assert.equal(normal.keys.systems,'final_drives');
assert.equal(normal.keys.disciplines,'tribology');
assert.equal(normal.keys.machines,'EQ01');
assert.equal(normal.proficiency,.4*20+.35*20+.25*30);
assert.ok(C.evaluate(geovane,scenario).proficiency>C.evaluate(pedro,scenario).proficiency);
assert.ok(C.diagnosisChance(geovane,scenario)>C.diagnosisChance(pedro,scenario));
assert.ok(C.repairSpeed(geovane,scenario)>C.repairSpeed(pedro,scenario));
const high={...pedro,role:'outra',mental:99,morale:99,competencies:E.baselineSkills('geovane')};
const low={...pedro,role:'outra',mental:99,morale:99,competencies:JSON.parse(JSON.stringify(pedro.competencies))};
for(const g of E.SKILL_GROUPS)for(const key of Object.keys(low.competencies[g]))low.competencies[g][key]=0;
assert.equal(C.evaluate(low,scenario).proficiency,0);
assert.equal(C.diagnosisChance(low,scenario),.25);
assert.equal(C.repairSpeed(low,scenario),.75);
for(const g of E.SKILL_GROUPS)for(const key of Object.keys(high.competencies[g]))high.competencies[g][key]=100;
assert.equal(C.repairSpeed(high,scenario),1.4);
assert.ok(C.diagnosisChance(high,scenario)<=.98);
const up=JSON.parse(JSON.stringify(low));
for(const [g,k] of Object.entries(C.resolve(scenario)))up.competencies[g][k]=89;
const result=C.practice(up,scenario,()=>0);
assert.equal(result.length,3);
for(const [g,k] of Object.entries(C.resolve(scenario)))assert.equal(up.competencies[g][k],90,'prática não passa do limite de 90');
assert.equal(C.practice(up,scenario,()=>0).length,0,'90 já é teto da prática');
for(const [g,k] of Object.entries(C.resolve(scenario)))up.competencies[g][k]=97;
assert.equal(C.practice(up,scenario,()=>0).length,0,'prática não desenvolve especialista acima de 90');
const wait=C.practice(low,scenario,()=>.999);
assert.equal(wait.length,0,'chance de prática permanece probabilística');
// Testes integrados: diagnóstico assistido gera no máximo uma tentativa de prática por
// habilidade dentro de um turno, embora sejam possíveis várias respostas manuais.
const assisted=E.create(data,()=>.42),jo=assisted.jobs[0],sc=E.scenario(data,jo.scene),me=assisted.team[0];
assisted.tools[sc.tool]=true;assisted.player.actionsLeft=3;assisted.player.mental=100;
assert.equal(E.attach(assisted,jo.id,me.id,0,true),null);
const keys=C.resolve(sc);
const start=Object.fromEntries(E.SKILL_GROUPS.map(g=>[g,me.competencies[g][keys[g]]]));
const code=[...sc.path,sc.component,sc.damage,sc.cause][0];
assert.equal(E.answer(assisted,data,jo.id,code,()=>0).ok,true);
const once=Object.fromEntries(E.SKILL_GROUPS.map(g=>[g,me.competencies[g][keys[g]]]));
assert.ok(Object.keys(once).every(g=>once[g]>=start[g]));
assert.equal(me.practiceTick,assisted.tick);
assert.equal(me.practiceKeys.length,3);
assert.equal(E.answer(assisted,data,jo.id,[...sc.path,sc.component,sc.damage,sc.cause][1],()=>0).ok,true);
for(const g of E.SKILL_GROUPS)assert.equal(me.competencies[g][keys[g]],once[g],'sem exploração de cliques por turno');
assert.ok(assisted.training.history.every(h=>h.kind!=='practice'||h.jobId===jo.id),'aprendizado rastreável por OS');
function repairWith(score){
 const state=E.create(data,()=>.42),job=state.jobs[0],sc=E.scenario(data,job.scene),m=state.team[0];
 for(const g of E.SKILL_GROUPS)for(const k of Object.keys(m.competencies[g]))m.competencies[g][k]=score;
 m.mental=90;m.physical=90;m.morale=90;m.role='geral';
 job.stage=6;job.diagRemaining=0;job.repairRemaining=60;job.repairTarget=60;
 state.tools[sc.tool]=true;state.stock[sc.material]=5;
 assert.equal(E.attach(state,job.id,m.id,0,false),null);
 E.advance(state,data,()=>.6);
 return {remaining:job.repairRemaining,worked:job.worked,available:state.metrics.hours};
}
const slow=repairWith(0),fast=repairWith(100);
assert.ok(fast.remaining<slow.remaining,'alto conhecimento acelera efetivamente o reparo');
assert.ok(fast.worked<=10.5&&slow.worked<=10.5,'limite de HH úteis não é alterado');
assert.equal(fast.available,42,'disponibilidade nominal com 4 integrantes: 4 × 10,5 HH');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const ui=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const plan=fs.readFileSync(path.join(root,'phaser-play/planning.js'),'utf8');
assert.ok(html.indexOf('competency.js?v=0.8.27')<html.indexOf('engine.js'),'motor carrega mapa antes da simulação');
assert.ok(html.includes('game.js?v=0.8.32'));
assert.ok(sw.includes('porcaria-vqec-20261019-v111'));
assert.ok(sw.includes("'./competency.js'"));
assert.ok(plan.includes('COMPETENCY.evaluate(m,sc)'));
assert.ok(ui.includes('proficiência '));
console.log('OK: 29 cenários, três competências, precisão, HH de reparo, aprendizagem até 90 e anti-exploit por turno.');
