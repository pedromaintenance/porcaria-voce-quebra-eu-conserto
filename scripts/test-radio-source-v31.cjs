/* Sprint 31 · integração por origem: rádio não é laboratório. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json');
const E=require('../engine.js');
const I=require('../phaser-play/inspection.js');
const M=require('../phaser-play/monitoring.js');
const {mulberry32}=E;
const layer=(name)=>D.scenarios.filter(x=>x.fmeaSource?.layer===name);
const oil=layer('oil/diagnostic-records.json'),electronic=layer('electronic/diagnostic-records.json');
assert.ok(oil.length>=10&&electronic.length>=5,'catálogos importados');
assert.ok(oil.every(x=>!E.radioEligible(x)),'nenhum laudo pode nascer no rádio');
assert.ok(oil.every(x=>!I.inspectionEligible(x)),'nenhum laudo nasce em inspeção');
assert.ok(electronic.some(x=>E.radioEligible(x)),'alertas ativos são elegíveis ao rádio');
assert.ok(electronic.some(x=>!E.radioEligible(x)),'códigos históricos ou sem confirmação são inelegíveis');
for(const x of electronic){
 const match=M.CATALOG.byCategory('faults').find(p=>p.modelId===x.modelId&&p.escalationScenario===x.id&&p.codeState==='ativo');
 assert.equal(E.radioEligible(x),!!match,`classificação eletrônica ${x.id}`);
}
const seeds=[11,42,77,2026,20261026,314159];
for(const seed of seeds){
 const rng=mulberry32(seed),s=E.create(D,rng);
 assert.equal(s.jobs.length,3,'três chamados iniciais');
 for(let turn=0;turn<42;turn++){
  for(const j of s.jobs){
   const sc=D.scenarios.find(x=>x.id===j.scene);
   if(j.source==='falha_funcional_inspecao'||j.chainOrigin||j.notificationId)continue;
   assert.ok(E.radioEligible(sc),`Rádio gerou ${j.scene} na semente ${seed}, turno ${turn}`);
  }
  E.advance(s,D,rng);
  M.receive(s,D,I);
 }
 assert.ok(E.validate(s),'save válido após 42 turnos');
}
console.log('OK S31-01: 6 campanhas × 42 turnos, óleo fora do Rádio/Inspeção, eletrônica ativa permitida.');
