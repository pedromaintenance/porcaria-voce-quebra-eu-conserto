/* Regressão SAP 1412 Mobile: traduções PT nas hipóteses e migração dos saves. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const d=require('../game-data.json');
assert.equal(d.paths.length,387);
assert.equal(d.models.length,9);
const sample=d.paths.find(p=>p.modelId==='EQ01'&&p.system==='DRTR'&&p.group==='AXAS'&&p.subgroup==='FID1');
assert.ok(sample);
assert.deepEqual([sample.systemName,sample.groupName,sample.subgroupName],['Transmissão','Conj Eixo;Posição 2','Comando Final;Posição 1']);
assert.equal(d.paths.find(p=>p.modelId==='EQ01'&&p.system==='ENSY').systemName,'Sist Motor');
assert.equal(d.models.find(m=>m.id==='EQ03').category,'Escavadeira');
for(const sc of d.scenarios){
 const opts=E.options(d,sc,123);
 const paths=d.paths.filter(p=>p.modelId===sc.modelId);
 const sameSys=paths.filter(p=>p.system===sc.path[0]);
 const sameGroup=sameSys.filter(p=>p.group===sc.path[1]);
 const settings=[
  ['system','systemName',paths],
  ['group','groupName',sameSys.length?sameSys:paths],
  ['subgroup','subgroupName',sameGroup.length?sameGroup:paths]
 ];
 for(let i=0;i<3;i++){
  const [idField,labelField,subset]=settings[i],labels=new Map();
  for(const p of [...subset,...paths])if(!labels.has(p[idField]))labels.set(p[idField],p[labelField]);
  for(const opt of opts[i])assert.equal(opt.label,labels.get(opt.id),sc.id+' stage '+i+' / '+opt.id);
 }
}
const save=E.create(d,()=>.42);
const sc=d.scenarios.find(s=>s.id==='INC001');
const j=save.jobs[0];
j.scene=sc.id;j.modelId=sc.modelId;j.stage=2;j.options=E.options(d,sc,1337);
j.options[0].find(o=>o.id==='DRTR').label='Drive Train';
j.options[1].find(o=>o.id==='AXAS').label='Axle Assy;Position 2';
j.options[2].find(o=>o.id==='FID1').label='Final Drive;Position 1';
j.diagnosticLog=[
 {stage:0,outcome:'confirmed',value:'Drive Train',source:'player',tick:0},
 {stage:1,outcome:'confirmed',value:'Axle Assy;Position 2',source:'player',tick:0},
 {stage:2,outcome:'rejected',value:'Final Drive;Position 1',source:'player',tick:0},
 {stage:2,outcome:'evidence',value:'Não reescrever evidências',source:'player',tick:0}
];
const ids=j.options.map(arr=>arr.map(o=>o.id)),before={stage:j.stage,scene:j.scene,wrong:j.wrong,tick:save.tick,
 cash:save.cash,history:save.done.length,team:save.team.map(m=>m.id)};
assert.equal(E.localizeDiagnosticOptions(save,d),save);
assert.deepEqual(j.options.map(arr=>arr.map(o=>o.id)),ids,'IDs e ordem das opções intactos');
assert.deepEqual([j.options[0].find(o=>o.id==='DRTR').label,j.options[1].find(o=>o.id==='AXAS').label,j.options[2].find(o=>o.id==='FID1').label],
 ['Transmissão','Conj Eixo;Posição 2','Comando Final;Posição 1']);
assert.deepEqual(j.diagnosticLog.map(x=>x.value),['Transmissão','Conj Eixo;Posição 2','Comando Final;Posição 1','Não reescrever evidências']);
assert.deepEqual({stage:j.stage,scene:j.scene,wrong:j.wrong,tick:save.tick,cash:save.cash,history:save.done.length,team:save.team.map(m=>m.id)},before,'progressão intacta');
const snapshot=JSON.stringify(save);E.localizeDiagnosticOptions(save,d);
assert.equal(JSON.stringify(save),snapshot,'migração idempotente');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.equal((game.match(/E\.localizeDiagnosticOptions\(/g)||[]).length,2,'início e importação Phaser');
assert.equal((app.match(/E\.localizeDiagnosticOptions\(/g)||[]).length,2,'início e importação clássica');
assert.ok(html.includes('game.js?v=0.9.4-pt1412'));
assert.ok(html.includes('engine.js?v=0.9.2'));
assert.ok(sw.includes('porcaria-vqec-20261019-v111-sap-v1-bia2-pt1412'));
console.log('OK: 387 caminhos PT (16 didáticos), hipóteses de 100 cenários, saves antigos, cache e progresso.');
