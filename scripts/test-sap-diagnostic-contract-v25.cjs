/* Contrato de 6 níveis: SAP 1412 + Catalog Profile completos, sem código fictício. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js');
const SRC=JSON.parse(fs.readFileSync('phaser-play/data/sap-catalog-profile.json','utf8'));
const FL=JSON.parse(fs.readFileSync('phaser-play/data/sap-functional-locations.json','utf8'));
assert.equal(SRC.parts.length,683);
assert.equal(FL.functionalLocations.length,2535);
assert.equal(SRC.objectTypes.length,987);
assert.equal(SRC.counts.assignments,31107);
assert.equal(SRC.damages.length,66);
assert.equal(SRC.causes.length,81);
assert.equal(D.catalog.parts.length,SRC.parts.length);
assert.deepEqual(D.catalog.parts,SRC.parts.map(p=>p.pt));
assert.deepEqual(D.sapPaths.map(p=>[p.modelId,p.system,p.group,p.subgroup]),
 SRC.playablePaths.map(p=>[p.modelId,p.system,p.group,p.subgroup]));
const partByCode=new Map(SRC.parts.map(p=>[p.code,p]));
assert.equal(partByCode.get('3263').pt,'Retentor');
assert.equal(partByCode.get('3263').en,'Retainer');
assert.equal(D.catalog.parts.includes('Retentor FPS'),false);
assert.equal(D.catalog.parts.includes('Retentor'),true);
assert.equal(new Set(SRC.parts.map(x=>x.code)).size,683);
assert.equal(new Set(SRC.parts.map(x=>x.pt)).size,683);
assert.equal(D.scenarios.length,124);
const matched=[],pending=[];
for(const sc of D.scenarios){
 assert.ok(D.catalog.parts.includes(sc.component),sc.id+' parte objeto fora SAP');
 assert.equal(partByCode.get(sc.sapPartCode)?.pt,sc.component,sc.id+' code/label');
 assert.ok(SRC.damages.some(x=>x.pt===sc.damage));
 assert.ok(SRC.causes.some(x=>x.pt===sc.cause));
 if(E.sapEligible(D,sc)){
  matched.push(sc.id);
  assert.equal(sc.sapPathMapping.status,'validado_na_planilha');
  assert.ok(D.sapPaths.some(p=>p.modelId===sc.modelId&&
   [p.system,p.group,p.subgroup].join('|')===sc.path.join('|')));
  for(const seed of [1,33,4444]){
   const opts=E.options(D,sc,seed);
   assert.equal(opts.length,6,sc.id);
   const answers=[...sc.path,sc.component,sc.damage,sc.cause];
   opts.forEach((arr,i)=>{
    assert.equal(arr.length,4,sc.id+' etapa '+i);
    assert.ok(arr.some(x=>x.id===answers[i]),sc.id+' gabarito '+i);
    assert.equal(new Set(arr.map(x=>x.id)).size,4,sc.id+' sem duplicação '+i);
    if(i===3)arr.forEach(x=>assert.ok(SRC.parts.some(p=>p.pt===x.id),'parte real '+x.id));
   });
  }
 }else pending.push(sc.id);
}
assert.ok(matched.length>=60,'min 60 missões verificadas');
assert.ok(pending.length>=50,'exceções sem equivalente explícitas');
assert.ok(pending.includes('INC103')&&pending.includes('INC115'),'retenção sem subgrupo SAP');
const game=E.create(D,()=>0.5);
assert.equal(game.jobs.length,3);
for(const job of game.jobs)assert.ok(E.sapEligible(D,E.scenario(D,job.scene)),'nova OS não pode usar rota não validada');
const old=JSON.stringify(D);
E.localizeDiagnosticOptions(game,D);
assert.equal(JSON.stringify(D),old,'nenhuma operação altera catálogo');
console.log('OK SAP pleno: 2535 FL, 683 objetos, 987 tipos, 31107 vínculos, 6 níveis, '+matched.length+' cenários elegíveis e '+pending.length+' para mapeamento.');
