/* P.O.R.C.A.R.I.A. — Sessão 4: motores diesel, análise de óleo e arrefecimento. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const expected={
 INC066:['EQ01','PB-TRUCK-FUEL-01','Filtro, Combustível'],
 INC067:['EQ01','PB-TRUCK-FUEL-01','Sensor, Pressão'],
 INC068:['EQ02','OIL-CASE-049','Filtro, Óleo'],
 INC069:['EQ03','OIL-CASE-052','Filtro, Óleo'],
 INC070:['EQ04',null,'Filtro, Ar'],
 INC071:['EQ02','PB-SHOVEL-COOL-01','Radiador'],
 INC072:['EQ01','OIL-CASE-061','Líquido, Arrefecimento'],
 INC073:['EQ07',null,'Motor, Hidráulico'],
 INC074:['EQ08',null,'Mangueira'],
 INC075:['EQ09','ELEC-CF-19-1','Respiro, Cárter']
};
assert.equal(D.scenarios.length,100,'65 existentes + 10 diesel + 10 perfuratrizes + 10 rodante + 5 progressivas');
assert.equal(new Set(D.scenarios.map(s=>s.id)).size,100,'identificadores únicos');
assert.deepEqual(D.scenarios.slice(0,65).map(x=>x.id),Array.from({length:65},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'65 cenários preexistentes preservados');
assert.equal(D.paths.length,387);
const recent=D.paths.filter(p=>p.origin==='trilha_didatica_simulada'&&['FILF','SENF','CLFL','CCBR'].includes(p.subgroup));
assert.equal(recent.length,4,'quatro trilhas novas de motor');
for(const path of recent)assert.equal(path.sapValidated,false,'não afirmar caminho SAP homologado');
const locs=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
for(const [id,[model,source,part]] of Object.entries(expected)){
 const sc=D.scenarios.find(x=>x.id===id);assert.ok(sc,id+' existe');
 assert.equal(sc.category,'motor',id+' categoria');
 assert.equal(sc.modelId,model,id+' equipamento');
 assert.equal(sc.component,part,id+' componente');
 assert.equal(sc.fmeaSource.recordId,source,id+' fonte');
 assert.equal(sc.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(sc.fmeaSource.status,'roteiro_didatico_nao_homologado_OEM');
 assert.equal(sc.fmeaSource.layer,source?.startsWith('PB-')?'diagnostic/playbooks.v1.json':source?.startsWith('OIL-')?'oil/diagnostic-records.json':source?.startsWith('ELEC-')?'electronic/diagnostic-records.json':'elaboracao_autoral');
 assert.equal(sc.sourcePartMatch,false);
 assert.equal(sc.simulation.oemValidated,false);
 assert.equal(sc.simulation.applicabilityValidated,false);
 assert.equal(sc.simulation.evidence,'verificacoes_propostas_sem_execucao');
 assert.equal(sc.simulation.nature,'ficcao_didatica');
 assert.equal(sc.dieselTraining.labResultsReal,false);
 assert.equal(sc.dieselTraining.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.ok(sc.dieselTraining.mechanism&&sc.dieselTraining.alternatives.length>=2);
 assert.ok(locs.has([sc.modelId,...sc.path].join('|')),id+' caminho válido');
 assert.ok(D.catalog.parts.includes(sc.component));
 assert.ok(D.catalog.damages.some(x=>x.pt===sc.damage));
 assert.ok(D.catalog.causes.some(x=>x.pt===sc.cause));
 assert.ok(D.items[sc.material]&&D.tools[sc.tool],id+' recurso válido');
 assert.equal(sc.estimatedCost,D.items[sc.material].unit,id+' custo simulado');
 assert.ok([1,2,3].includes(sc.priority)&&sc.hours>0&&sc.diagHours>0,id+' dimensões de gameplay');
 assert.ok(sc.operator.length>75&&sc.verification.length>110&&sc.lesson.length>110,id+' roteiro pedagógico');
 for(const seed of [1,55,222,9876,424242]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6,id+' seis etapas');
  [...sc.path,sc.component,sc.damage,sc.cause].forEach((correct,i)=>{
   assert.equal(opts[i].length,4,id+' quatro alternativas etapa '+i);
   assert.equal(new Set(opts[i].map(x=>x.id)).size,4,id+' alternativas sem repetição '+i);
   assert.ok(opts[i].some(x=>x.id===correct),id+' gabarito alcançável '+i);
  });
 }
}
for(const id of ['FILC','OLMO','ARRF','RESC'])assert.ok(D.items[id]&&D.items[id].unit>0);
assert.ok(D.tools.REFR&&D.tools.REFR.cost>0);
const filterCases=['INC068','INC069'].map(id=>D.scenarios.find(x=>x.id===id));
for(const sc of filterCases){
 assert.equal(sc.material,'OLMO','filtro removido para inspeção não será reinstalado');
 assert.ok(sc.verification.includes('amostra')&&sc.verification.includes('filtro'),'amostragem e troca contempladas');
}
const fuelPair=['INC066','INC067'].map(id=>D.scenarios.find(x=>x.id===id));
assert.notEqual(fuelPair[0].component,fuelPair[1].component,'mesmo sintoma com causa diferente');
const state=E.create(D,()=>.42);
assert.equal(state.jobs.length,3);
assert.equal(state.stock.FILC,2,'estoque virtual inicial');
assert.equal(state.tools.REFR,false,'ferramenta precisa de compra');
const only={...D,scenarios:[D.scenarios.find(x=>x.id==='INC071')]};
const campaign=E.create(only,()=>.42);
assert.ok(campaign.jobs.every(j=>j.scene==='INC071'),'novos casos entram no sorteio');
console.log('OK: sessão 4, 10 missões diesel/óleo, 100 totais, 6x4 alternativas, 4 localizações didáticas e recursos.');
