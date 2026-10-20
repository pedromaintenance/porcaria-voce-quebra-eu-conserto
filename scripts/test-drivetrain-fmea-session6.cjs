/* PORCARIA — Sessão 6: material rodante, transmissão e desgaste. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const expected={
 INC086:['EQ01','PB-TRUCK-FINAL-01','Rolamento'],
 INC087:['EQ01','PB-TRUCK-FINAL-01','Engrenagem'],
 INC088:['EQ01','OIL-CASE-038','Engrenagem'],
 INC089:['EQ02','OIL-CASE-029','Engrenagem'],
 INC090:['EQ07','PB-DOZER-TRACK-01','Rolamento'],
 INC091:['EQ07','PB-DOZER-TRACK-01','Roda-Guia'],
 INC092:['EQ08','OIL-CASE-067','Vedação'],
 INC093:['EQ09','OIL-CASE-069','Engrenagem'],
 INC094:['EQ09','PB-GRADER-TIRE-01','Pneu'],
 INC095:['EQ05',null,'Vedação']
};
assert.equal(D.scenarios.length,100,'85 anteriores + 10 rodante/transmissão + 5 progressivas');
assert.equal(new Set(D.scenarios.map(s=>s.id)).size,100,'IDs distintos');
assert.deepEqual(D.scenarios.slice(0,85).map(x=>x.id),Array.from({length:85},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'85 missões anteriores sem remoção ou reordenação');
assert.equal(D.paths.length,387,'384 caminhos anteriores + 3 didáticos');
const added=D.paths.filter(p=>p.origin==='trilha_didatica_simulada'&&['TRGE','REDG','GUID'].includes(p.subgroup));
assert.equal(added.length,3,'três caminhos funcionais didáticos novos');
for(const p of added)assert.equal(p.sapValidated,false);
const paths=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
for(const [id,[model,source,part]] of Object.entries(expected)){
 const s=D.scenarios.find(s=>s.id===id);
 assert.ok(s,id+' existe');
 assert.equal(s.modelId,model,id+' modelo');
 assert.equal(s.category,'rodante');
 assert.equal(s.component,part);
 assert.equal(s.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(s.fmeaSource.recordId,source);
 assert.equal(s.fmeaSource.layer,source?.startsWith('PB-')?'diagnostic/playbooks.v1.json':source?.startsWith('OIL-')?'oil/diagnostic-records.json':'elaboracao_autoral');
 assert.equal(s.fmeaSource.status,'hipotese_didatica_sem_validacao_OEM');
 assert.equal(s.sourcePartMatch,false);
 assert.equal(s.simulation.nature,'ficcao_didatica');
 assert.equal(s.simulation.oemValidated,false);
 assert.equal(s.simulation.applicabilityValidated,false);
 assert.equal(s.simulation.evidence,'ensaios_e_inspecoes_propostos_nao_executados');
 assert.equal(s.drivetrainTraining.realDefectConfirmed,false);
 assert.equal(s.drivetrainTraining.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.ok(s.drivetrainTraining.mechanism&&s.drivetrainTraining.alternatives.length>=2&&s.drivetrainTraining.safetyNote.length>40);
 assert.ok(paths.has([s.modelId,...s.path].join('|')),id+' local válido');
 assert.ok(D.catalog.parts.includes(s.component)&&D.catalog.damages.some(x=>x.pt===s.damage)&&D.catalog.causes.some(x=>x.pt===s.cause),id+' catálogo');
 assert.ok(D.items[s.material]&&D.tools[s.tool],id+' recursos de jogo');
 assert.equal(s.estimatedCost,D.items[s.material].unit);
 assert.ok([1,2,3].includes(s.priority)&&s.hours>0&&s.diagHours>0);
 assert.ok(s.operator.length>90&&s.verification.length>110&&s.lesson.length>100,id+' texto técnico');
 for(const seed of [1,85,222,2026,888888]){
  const opts=E.options(D,s,seed);
  assert.equal(opts.length,6,id+' seis etapas');
  [...s.path,s.component,s.damage,s.cause].forEach((correct,stage)=>{
   assert.equal(opts[stage].length,4,id+' quatro escolhas etapa '+stage);
   assert.equal(new Set(opts[stage].map(x=>x.id)).size,4,id+' sem repetições etapa '+stage);
   assert.ok(opts[stage].some(x=>x.id===correct),id+' gabarito selecionável etapa '+stage);
  });
 }
}
assert.ok(D.catalog.parts.includes('Roda-Guia'));
assert.ok(D.items.RGUA&&D.items.RGUA.unit>0);
for(const tool of ['CTSM','COMP'])assert.ok(D.tools[tool]&&D.tools[tool].cost>0);
const initial=E.create(D,()=>.5);
assert.equal(initial.jobs.length,3);
assert.equal(initial.stock.RGUA,0,'roda-guia exige compra');
assert.equal(initial.tools.CTSM,false,'medição dimensional exige compra');
for(const id of ['INC086','INC089','INC094']){
 const caseOnly={...D,scenarios:[D.scenarios.find(x=>x.id===id)]};
 const state=E.create(caseOnly,()=>.5);
 assert.ok(state.jobs.length===3&&state.jobs.every(j=>j.scene===id),id+' sorteio do jogo');
}
const pair=[D.scenarios.find(s=>s.id==='INC086'),D.scenarios.find(s=>s.id==='INC087')];
assert.notEqual(pair[0].component,pair[1].component,'comando final exige diferenciar rolamento/engrenagem');
console.log('OK: 10 missões de rodante/transmissão, 100 totais, 6x4 escolhas, 387 caminhos, origem e recursos.');
