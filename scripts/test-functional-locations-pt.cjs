/* Regressão dos Locais de Instalação 1412 Mobile: PT oficial e preservação dos saves. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js'), D=require('../game-data.json');
assert.equal(D.paths.length,371);assert.equal(D.models.length,9);
const first=D.paths.find(p=>p.modelId==='EQ01'&&p.system==='DRTR'&&p.group==='AXAS'&&p.subgroup==='BRA1');
assert.ok(first);
assert.deepEqual([first.systemName,first.groupName,first.subgroupName],
 ['Transmissão','Conj Eixo;Posição 2','Freio;Posição 1']);
assert.ok(D.models.some(x=>x.id==='EQ03'&&x.category==='Escavadeira'));
const s=E.create(D,()=>.31),j=s.jobs[0];
const beforeIds=j.options.slice(0,3).map(x=>x.map(v=>v.id));
const beforeLater=JSON.stringify(j.options.slice(3));
const beforeJobs=JSON.stringify(s.jobs.map(x=>({id:x.id,scene:x.scene,stage:x.stage,wrong:x.wrong})));
const sc=E.scenario(D,j.scene);
const path=D.paths.filter(p=>p.modelId===sc.modelId);
for(let i=0;i<3;i++)for(const o of j.options[i])o.label='LEGACY_EN_LABEL';
assert.equal(E.localizeDiagnosticOptions(s,D),s);
assert.deepEqual(j.options.slice(0,3).map(x=>x.map(v=>v.id)),beforeIds);
assert.equal(JSON.stringify(j.options.slice(3)),beforeLater);
assert.equal(JSON.stringify(s.jobs.map(x=>({id:x.id,scene:x.scene,stage:x.stage,wrong:x.wrong}))),beforeJobs);
assert.ok(j.options.slice(0,3).every(a=>a.every(o=>o.label!=='LEGACY_EN_LABEL')),'labels PT recuperados');
const after=JSON.stringify(s);
E.localizeDiagnosticOptions(s,D);
assert.equal(JSON.stringify(s),after,'migração idempotente');
console.log('OK: 371 locais e 9 categorias; opções de saves antigos atualizadas sem alterar IDs ou progressão.');
