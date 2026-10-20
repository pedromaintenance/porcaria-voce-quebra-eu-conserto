/* Sessão 2: regressão das dez missões de elétrica/eletrônica. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json');
const E=require('../engine.js');
const expected={
 INC046:['EQ01','ELEC-CF-01-1','Conector, Elétrica'],
 INC047:['EQ01','ELEC-CF-01-2','Chicote Elétrico'],
 INC048:['EQ01','ELEC-CF-01-3','Sensor, Tensão'],
 INC049:['EQ08','ELEC-CF-02-2','Chicote Elétrico'],
 INC050:['EQ03','ELEC-CF-08-1','Bobina, Solenoide'],
 INC051:['EQ03','ELEC-CF-08-2','Chicote Elétrico'],
 INC052:['EQ09','ELEC-CF-09-3','Sensor, Pressão'],
 INC053:['EQ05','ELEC-CF-13-1','Resistor, Terminação'],
 INC054:['EQ06','ELEC-CF-13-3','Conector, Elétrica'],
 INC055:['EQ02','ELEC-CF-23-2','Chicote Elétrico']
};
assert.equal(D.scenarios.length,65,'45 anteriores + 10 elétricos + 10 hidráulicos');
assert.equal(new Set(D.scenarios.map(s=>s.id)).size,65);
const paths=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
const original=D.scenarios.slice(0,45).map(s=>s.id);
assert.deepEqual(original,Array.from({length:45},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'não remover nem reordenar missões anteriores');
for(const [id,[model,source,part]] of Object.entries(expected)){
 const sc=D.scenarios.find(x=>x.id===id);assert.ok(sc,'cenário '+id);
 assert.equal(sc.modelId,model);
 assert.equal(sc.fmeaSource.recordId,source);
 assert.equal(sc.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(sc.fmeaSource.layer,'electronic/diagnostic-records.json');
 assert.equal(sc.fmeaSource.status,'caso_didatico_nao_curado_sem_OEM_ou_SAP');
 assert.equal(sc.sourcePartMatch,false);
 assert.equal(sc.simulation.nature,'ficcao_didatica');
 assert.equal(sc.simulation.oemValidated,false);
 assert.equal(sc.simulation.evidence,'inspecoes_e_medicoes_propostas_nao_executadas');
 assert.ok(sc.electronicTraining.exampleCode);
 assert.equal(sc.electronicTraining.codeApplicableToModel,false,'não afirmar MID/CID/FMI de modelo específico');
 assert.equal(sc.electronicTraining.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.equal(sc.component,part);
 assert.ok(paths.has([sc.modelId,...sc.path].join('|')),id+' tem árvore');
 assert.ok(D.catalog.parts.includes(sc.component));
 assert.ok(D.catalog.damages.some(x=>x.pt===sc.damage));
 assert.ok(D.catalog.causes.some(x=>x.pt===sc.cause));
 assert.ok(D.items[sc.material]&&D.tools[sc.tool],id+' recursos');
 assert.equal(sc.estimatedCost,D.items[sc.material].unit);
 assert.ok(sc.hours>0&&sc.diagHours>0&&[1,2,3].includes(sc.priority));
 assert.ok(sc.operator.length>60&&sc.verification.length>90&&sc.lesson.length>90);
 assert.ok(!sc.operator.includes(sc.electronicTraining.exampleCode),'código de fonte não exposto como confirmado');
 for(const seed of [1,17,821,55555,910000]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6,id+'/etapas');
  [...sc.path,sc.component,sc.damage,sc.cause].forEach((correct,i)=>{
   assert.equal(opts[i].length,4,id+'/etapa'+i+' alternativas');
   assert.equal(new Set(opts[i].map(x=>x.id)).size,4,id+'/etapa'+i+' sem duplicatas');
   assert.ok(opts[i].some(x=>x.id===correct),id+'/etapa'+i+' gabarito acessível');
  });
 }
}
const newPaths=D.paths.filter(p=>p.origin==='trilha_didatica_simulada' && p.group!=='FISY');
assert.equal(newPaths.length,5,'caminhos elétricos novos, sem atribuição SAP');
for(const p of newPaths)assert.equal(p.sapValidated,false);
for(const item of ['CHIC','SENT','SENP','SOLN','CANR'])assert.ok(D.items[item]&&D.items[item].unit>0);
for(const tool of ['CAN','OSCI'])assert.ok(D.tools[tool]&&D.tools[tool].cost>0);
const s=E.create(D,()=>0.5);
assert.equal(s.jobs.length,3);
assert.equal(s.stock.CHIC,3);
assert.equal(s.tools.CAN,false,'analisador exige compra');
console.log('OK: 10 missões elétricas/eletrônicas, 55 no total, 6x4 hipóteses, 5 caminhos didáticos, economia e proveniência.');
