/* Validação de novos casos FMEA: catálogo, seis hipóteses, proveniência, economia fictícia. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const expected={
  INC034:['EQ03','PB-EXC-HOSE-01'],INC035:['EQ02','PB-SHOVEL-MOTOR-OIL-01'],
  INC036:['EQ05','PB-DRILL-DR410-FEED-01'],INC037:['EQ06','PB-DRILL-DI650-COMP-01'],
  INC038:['EQ01','PB-TRUCK-FUEL-01'],INC039:['EQ09','PB-GRADER-TIRE-01'],
  INC040:['EQ07','PB-DOZER-TRACK-01'],INC041:['EQ01','OIL-CASE-001'],
  INC042:['EQ07','OIL-CASE-004'],INC043:['EQ01','OIL-CASE-070'],
  INC044:['EQ08',null],INC045:['EQ02','PB-SHOVEL-COOL-01']
};
assert.equal(D.scenarios.length,75);
assert.equal(new Set(D.scenarios.map(s=>s.id)).size,75,'IDs únicos');
const locs=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
const modelIds=new Set(D.models.map(m=>m.id));
for(const [id,[model,source]] of Object.entries(expected)){
  const c=D.scenarios.find(s=>s.id===id);
  assert.ok(c,id+' presente');
  assert.equal(c.modelId,model);
  assert.ok(modelIds.has(c.modelId));
  assert.equal(c.fmeaSource.recordId,source);
  assert.equal(c.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
  assert.equal(c.sourcePartMatch,false,'sem vínculo de peça OEM/SAP validado');
  assert.equal(c.simulation.nature,'ficcao_didatica');
  assert.equal(c.simulation.oemValidated,false);
  assert.equal(c.simulation.evidence,'testes_propostos_sem_execucao');
  assert.ok(locs.has([c.modelId,...c.path].join('|')),'local cadastrado '+id);
  assert.ok(D.catalog.parts.includes(c.component),'componente disponível '+id);
  assert.ok(D.catalog.damages.some(d=>d.pt===c.damage),'dano disponível '+id);
  assert.ok(D.catalog.causes.some(d=>d.pt===c.cause),'causa disponível '+id);
  assert.ok(D.items[c.material],'material disponível '+id);
  assert.ok(D.tools[c.tool],'ferramenta disponível '+id);
  assert.equal(c.estimatedCost,D.items[c.material].unit,'custo virtual '+id);
  assert.ok(c.operator.length>=40 && c.verification.length>=70 && c.lesson.length>=70,'roteiro didático completo '+id);
  assert.ok(c.hours>0 && c.diagHours>0 && [1,2,3].includes(c.priority));
  for(const seed of [1,33,4444,98765]){
    const opts=E.options(D,c,seed);
    assert.equal(opts.length,6,'seis campos '+id);
    [...c.path,c.component,c.damage,c.cause].forEach((v,i)=>{
      assert.equal(opts[i].length,4,'quatro alternativas '+id+'/'+i);
      assert.ok(opts[i].some(x=>x.id===v),'gabarito selecionável '+id+'/'+i);
      assert.equal(new Set(opts[i].map(x=>x.id)).size,4,'sem alternativas duplicadas '+id+'/'+i);
    });
  }
}
for(const code of ['FILO','PNEU'])assert.ok(D.items[code]&&D.items[code].unit>0);
for(const code of ['CALP','COLETA'])assert.ok(D.tools[code]&&D.tools[code].cost>0);
const initial=E.create(D,()=>0.5);
assert.equal(initial.jobs.length,3,'campanha começa com três OS');
assert.equal(initial.stock.FILO,2,'novo estoque inicial');
assert.equal(initial.stock.PNEU,0,'pneu exige aprovisionamento');
assert.equal(initial.tools.COLETA,true);
assert.equal(initial.tools.CALP,false);
console.log('OK: 12 novos casos didáticos FMEA, 75 totais; catálogos, opções, estoque e sorteio válidos.');
