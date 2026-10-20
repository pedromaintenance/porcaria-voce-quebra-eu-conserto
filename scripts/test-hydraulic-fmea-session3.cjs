/* P.O.R.C.A.R.I.A. — Sessão 3: hidráulica e contaminação (ficção didática). */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const expected={
 INC056:['EQ03','PB-EXC-PUMP-01','Mangueira'],
 INC057:['EQ03','PB-EXC-PUMP-01','Conexão, Mangueira'],
 INC058:['EQ03','PB-EXC-PUMP-01','Filtro, Hidráulico'],
 INC059:['EQ08','PB-LOADER-CYL-01','Vedação'],
 INC060:['EQ08',null,'Bomba, Hidráulica'],
 INC061:['EQ02','OIL-CASE-043','Válvula, Hidráulica'],
 INC062:['EQ02',null,'Trocador de Calor'],
 INC063:['EQ05',null,'Filtro, Hidráulico'],
 INC064:['EQ06','PB-DRILL-DR410-FEED-01','Motor, Hidráulico'],
 INC065:['EQ01','OIL-CASE-046','Bomba, Hidráulica']
};
assert.equal(D.scenarios.length,100,'55 anteriores + 10 hidráulicos + 10 diesel + 10 perfuratrizes + 10 rodante + 5 progressivas');
assert.equal(new Set(D.scenarios.map(x=>x.id)).size,100,'IDs únicos');
assert.deepEqual(D.scenarios.slice(0,55).map(x=>x.id),Array.from({length:55},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'55 missões anteriores preservadas');
const catalogPaths=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
assert.equal(D.paths.length,387);
const newHydraulicPaths=D.paths.filter(p=>p.origin==='trilha_didatica_simulada' && p.group==='FISY');
assert.equal(newHydraulicPaths.length,2);
for(const p of newHydraulicPaths)assert.equal(p.sapValidated,false);
for(const [id,[model,source,component]] of Object.entries(expected)){
 const c=D.scenarios.find(s=>s.id===id);
 assert.ok(c,id+' presente');
 assert.equal(c.modelId,model,id+' máquina');
 assert.equal(c.category,'hidraulica');
 assert.equal(c.component,component);
 assert.equal(c.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(c.fmeaSource.recordId,source);
 assert.equal(c.fmeaSource.layer,source?.startsWith('PB-')?'diagnostic/playbooks.v1.json':source?.startsWith('OIL-')?'oil/diagnostic-records.json':'elaboracao_autoral');
 assert.equal(c.fmeaSource.status,'cenario_didatico_nao_homologado_OEM');
 assert.equal(c.sourcePartMatch,false,'sem vínculo SAP/OEM confirmado');
 assert.equal(c.simulation.nature,'ficcao_didatica');
 assert.equal(c.simulation.oemValidated,false);
 assert.equal(c.simulation.applicabilityValidated,false);
 assert.equal(c.simulation.evidence,'verificacoes_propostas_sem_execucao');
 assert.equal(c.hydraulicTraining.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.ok(c.hydraulicTraining.mechanism&&c.hydraulicTraining.alternatives.length>=2);
 assert.ok(catalogPaths.has([c.modelId,...c.path].join('|')),id+' caminho válido');
 assert.ok(D.catalog.parts.includes(c.component)&&D.catalog.damages.some(x=>x.pt===c.damage)&&D.catalog.causes.some(x=>x.pt===c.cause),id+' vocabulário');
 assert.ok(D.items[c.material]&&D.tools[c.tool],id+' recursos cadastrados');
 assert.equal(c.estimatedCost,D.items[c.material].unit,id+' custo virtual');
 assert.ok(c.priority>=1&&c.priority<=3&&c.hours>0&&c.diagHours>0);
 assert.ok(c.operator.length>80&&c.verification.length>100&&c.lesson.length>100,id+' qualidade textual');
 for(const seed of [1,17,333,7777,99991]){
  const options=E.options(D,c,seed);
  assert.equal(options.length,6,id+' seis classificações');
  [...c.path,c.component,c.damage,c.cause].forEach((correct,index)=>{
   assert.equal(options[index].length,4,id+'/etapa'+index+' quatro alternativas');
   assert.equal(new Set(options[index].map(o=>o.id)).size,4,id+'/etapa'+index+' sem duplicidade');
   assert.ok(options[index].some(o=>o.id===correct),id+'/etapa'+index+' resposta presente');
  });
 }
}
for(const id of ['FILH','BOMH','VALH','MOTH'])assert.ok(D.items[id]&&D.items[id].unit>0);
for(const id of ['VACU','PDIF'])assert.ok(D.tools[id]&&D.tools[id].cost>0);
const state=E.create(D,()=>0.5);
assert.equal(state.jobs.length,3,'campanha padrão preservada');
assert.equal(state.stock.FILH,3);
assert.equal(state.stock.BOMH,0,'bomba exige aprovisionamento');
assert.equal(state.tools.VACU,false,'instrumento exige compra');
const onlyCase={...D,scenarios:[D.scenarios.find(x=>x.id==='INC058')]};
const encounter=E.create(onlyCase,()=>0.42);
assert.ok(encounter.jobs.every(x=>x.scene==='INC058'),'novas missões entram no sorteio');
console.log('OK: 10 casos hidráulicos e contaminação, 65 missões, 6x4 opções, peças/ferramentas e limites OEM.');
