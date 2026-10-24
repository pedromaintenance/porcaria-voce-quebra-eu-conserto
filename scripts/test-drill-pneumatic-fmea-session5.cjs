/* PORCARIA — sessão 5: dez missões de perfuratrizes e pneumática. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json');
const E=require('../engine.js');
const expected={
 INC076:['EQ06','PB-DRILL-DI650-COMP-01','Filtro, Ar'],
 INC077:['EQ06','PB-DRILL-DI650-COMP-01','Mangueira'],
 INC078:['EQ06',null,'Trocador de Calor'],
 INC079:['EQ06','PB-DRILL-DI650-COMP-01','Vedação Junta O-ring'],
 INC080:['EQ06','PB-DRILL-DR410-FEED-01','Corrente'],
 INC081:['EQ05','PB-DRILL-DI650-COMP-01','Válvula, Pneumática'],
 INC082:['EQ05','PB-DRILL-DI650-COMP-01','Mangueira'],
 INC083:['EQ05','PB-DRILL-DR410-FEED-01','Vedação'],
 INC084:['EQ05',null,'Motor, Hidráulico'],
 INC085:['EQ05',null,'Rolamento']
};
assert.equal(D.scenarios.length,124,'75 anteriores + 10 perfuratrizes + 10 rodante + 5 progressivas');
assert.equal(new Set(D.scenarios.map(s=>s.id)).size,124,'IDs únicos');
assert.deepEqual(D.scenarios.slice(0,75).map(x=>x.id),Array.from({length:75},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'missões anteriores preservadas');
assert.equal(D.paths.length,493,'382 caminhos anteriores + dois de perfuratrizes + três de rodante');
const added=D.paths.filter(p=>p.origin==='trilha_didatica_simulada'&&p.modelId==='EQ06'&&p.system==='AISY'&&p.group==='COMR'&&['INFL','HSVV'].includes(p.subgroup));
assert.equal(added.length,2,'filtração/admissão e linha do compressor DI650i');
for(const p of added)assert.equal(p.sapValidated,false);
const allPaths=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
for(const [id,[model,source,part]] of Object.entries(expected)){
 const sc=D.scenarios.find(s=>s.id===id);
 assert.ok(sc,id+' presente');
 assert.equal(sc.modelId,model,id+' modelo');
 assert.equal(sc.category,'perfuracao');
 assert.equal(sc.sapPartMapping.previousLabel,part);
 assert.equal(sc.fmeaSource.recordId,source);
 assert.equal(sc.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(sc.fmeaSource.layer,source?'diagnostic/playbooks.v1.json':'elaboracao_autoral');
 assert.equal(sc.fmeaSource.status,'hipotese_didatica_sem_confirmacao_OEM');
 assert.equal(sc.sourcePartMatch,false);
 assert.equal(sc.simulation.nature,'ficcao_didatica');
 assert.equal(sc.simulation.oemValidated,false);
 assert.equal(sc.simulation.applicabilityValidated,false);
 assert.equal(sc.simulation.evidence,'testes_propostos_sem_execucao');
 assert.equal(sc.drillTraining.architectureConfirmed,false);
 assert.equal(sc.drillTraining.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.ok(sc.drillTraining.safetyNote.length>40&&sc.drillTraining.alternatives.length>=3);
 assert.ok(sc.drillTraining.mechanism);
 assert.ok(sc.operator.length>=85&&sc.verification.length>=115&&sc.lesson.length>=110);
 assert.ok(allPaths.has([sc.modelId,...sc.path].join('|')),id+' caminho funcional');
 assert.ok(D.catalog.parts.includes(sc.component),'componente disponível');
 assert.ok(D.catalog.damages.some(x=>x.pt===sc.damage),'dano disponível');
 assert.ok(D.catalog.causes.some(x=>x.pt===sc.cause),'causa disponível');
 assert.ok(D.items[sc.material]&&D.tools[sc.tool],'materiais e ferramentas');
 assert.equal(sc.estimatedCost,D.items[sc.material].unit);
 assert.ok(sc.hours>0&&sc.diagHours>0&&[1,2,3].includes(sc.priority));
 for(const seed of [1,5,100,1337,424242]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6,id+' etapas');
  [...sc.path,sc.component,sc.damage,sc.cause].forEach((correct,stage)=>{
   assert.equal(opts[stage].length,4,id+' quatro escolhas '+stage);
   assert.equal(new Set(opts[stage].map(x=>x.id)).size,4,id+' alternativas distintas '+stage);
   assert.ok(opts[stage].some(o=>o.id===correct),id+' gabarito visível '+stage);
  });
 }
}
for(const k of ['VALP','AIRT'])assert.ok(D.items[k]&&D.items[k].unit>0);
assert.ok(D.tools.PNEU&&D.tools.PNEU.cost>0);
const initial=E.create(D,()=>0.5);
assert.equal(initial.jobs.length,3);
assert.equal(initial.stock.VALP,0,'válvula deve ser aprovisionada');
assert.equal(initial.stock.AIRT,2);
assert.equal(initial.tools.PNEU,false,'kit exige aquisição');
const di=D.scenarios.find(s=>s.id==='INC076'),dr=D.scenarios.find(s=>s.id==='INC083');
for(const c of [di,dr]){
 const sample=E.create({...D,scenarios:[c]},()=>0.5);
 if(E.sapEligible(D,c)){
  assert.equal(sample.jobs.length,3,'classificação SAP válida pode ser sorteada');
  assert.ok(sample.jobs.every(j=>j.scene===c.id),'missão entra no sorteio '+c.id);
 }else{
  assert.equal(sample.jobs.length,0,'missão sem local SAP não deve entrar no sorteio '+c.id);
 }
}
console.log('OK: sessão 5, 10 missões perfuratriz/pneumática; 100 cenários, 6x4 classificações, estoque, segurança e proveniência.');
