/* Verificação didática das quatro ocorrências originadas dos roteiros FMEA. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const expected={
 INC030:{source:'PB-EXC-PUMP-01',model:'EQ03',path:['HYSY','DRPU','HYPU'],component:'Vedação',damage:'Vazando',cause:'Falha de vedação'},
 INC031:{source:'PB-SHOVEL-COOL-01',model:'EQ02',path:['ENS1','COSY','RADI'],component:'Radiador',damage:'Entupido ou restringido',cause:'Material estranho'},
 INC032:{source:'PB-DOZER-TRACK-01',model:'EQ07',path:['UNCR','TRF1','IDL1'],component:'Rolamento',damage:'Gripado',cause:'Lubrificação insuficiente'},
 INC033:{source:'PB-TRUCK-FINAL-01',model:'EQ01',path:['DRTR','AXAS','FID2'],component:'Engrenagem',damage:'Desgastado',cause:'Lubrificação insuficiente'}
};
assert.equal(D.scenarios.length,95,'29 originais + 4 FMEA anteriores + 12 adicionais + 10 elétricos + 10 hidráulicos + 10 diesel + 10 perfuratrizes + 10 transmissão/rodante');
assert.equal(new Set(D.scenarios.map(x=>x.id)).size,95,'IDs únicos');
const pathSet=new Set(D.paths.map(x=>[x.modelId,x.system,x.group,x.subgroup].join('|')));
const parts=new Set(D.catalog.parts), damages=new Set(D.catalog.damages.map(x=>x.pt)), causes=new Set(D.catalog.causes.map(x=>x.pt));
for(const [id,expect] of Object.entries(expected)){
 const sc=D.scenarios.find(x=>x.id===id);assert.ok(sc,'caso existente '+id);
 assert.equal(sc.modelId,expect.model);
 assert.deepEqual(sc.path,expect.path);
 assert.equal(sc.component,expect.component);
 assert.equal(sc.damage,expect.damage);
 assert.equal(sc.cause,expect.cause);
 assert.equal(sc.fmeaSource.recordId,expect.source);
 assert.equal(sc.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(sc.fmeaSource.status,'roteiro_didatico_pendente_revisao_OEM');
 assert.equal(sc.sourcePartMatch,false,'sem vínculo SAP de parte homologado');
 assert.ok(pathSet.has([sc.modelId,...sc.path].join('|')),'caminho cadastrado');
 assert.ok(parts.has(sc.component)&&damages.has(sc.damage)&&causes.has(sc.cause),'catálogos válidos');
 assert.ok(D.items[sc.material]&&D.tools[sc.tool],'estoque e ferramenta cadastrados');
 assert.equal(sc.estimatedCost,D.items[sc.material].unit,'custo virtual baseado no estoque atual');
 for(let seed=1;seed<=4;seed++){
  const options=E.options(D,sc,seed*333);
  assert.equal(options.length,6);
  for(const [idx,good] of [...sc.path,sc.component,sc.damage,sc.cause].entries()){
   assert.equal(options[idx].length,4);
   assert.ok(options[idx].some(o=>o.id===good),'opção correta selecionável em '+id+'/'+idx);
  }
 }
}
const s=E.create(D,()=>0.5);
assert.ok(s.jobs.length===3,'campanha inicial preservada');
const originalIds=[...D.scenarios.slice(0,29).map(x=>x.id)];
assert.deepEqual(originalIds,Array.from({length:29},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'29 cenários originais preservados');
console.log('OK: 4 casos FMEA anteriores preservados, 95 cenários, códigos, gabaritos, opções e sorteio válidos.');
