/* Ciclo 26 — posições físicas reais da 1412, sem reclassificação inventada. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js');
const FL=require('../phaser-play/data/sap-functional-locations.json');
const audit=require('../phaser-play/data/sap-scenario-mapping-audit.json');
const sap=new Map(FL.functionalLocations.map(x=>[x.id,x]));
const route=p=>[p.modelId,p.system,p.group,p.subgroup].join('|');
assert.equal(D.sapInstalledPaths.length,371,'triplas físicas distintas');
assert.equal(D.sapInstalledPaths.reduce((n,x)=>n+x.functionalLocations.length,0),442);
assert.equal(D.sapPaths.length,245,'camada de tipos de objeto prévia preservada');
assert.equal(D.catalog.parts.length,683);
assert.equal(audit.cases.length,124);
assert.equal(D.sapReference.counts.physicalPaths,371);
assert.equal(D.sapReference.counts.physicalRecords,442);
const provenance=new Map(D.sapInstalledPaths.map(p=>[route(p),p]));
for(const p of D.sapInstalledPaths){
 assert.equal(p.sourceStatus,'Completed');
 assert.ok(p.functionalLocations.length>0);
 assert.ok(p.assets.length>0);
 for(const id of p.functionalLocations){
  const leaf=sap.get(id);assert.ok(leaf,'instalação existe '+id);
  const group=sap.get(leaf.parent),system=sap.get(group?.parent);
  assert.ok(group&&system);
  const codes=id.split('-').slice(-3);
  assert.deepEqual(codes,[p.system,p.group,p.subgroup],'não confundir posição física com tipo de objeto');
  assert.deepEqual([system.descriptionPt,group.descriptionPt,leaf.descriptionPt],
   [p.systemName,p.groupName,p.subgroupName]);
  assert.equal(leaf.objectType,p.subgroupObjectType);
 }
}
const promoted=['INC002','INC009','INC033','INC035','INC036','INC040','INC042','INC044','INC045','INC062','INC071','INC087','INC090','INC094','INC097','INC100'];
let eligible=0,physicalMatch=0,pendingFl=0,pendingPart=0;
for(const sc of D.scenarios){
 const a=audit.cases.find(z=>z.id===sc.id);
 assert.ok(a);
 const path=provenance.get([sc.modelId,...sc.path].join('|'));
 if(path)physicalMatch++;
 if(E.sapEligible(D,sc)){
  eligible++;
  assert.equal(a.classification,'liberado');
  assert.ok(path,sc.id+' deve ter FL real');
  assert.ok(a.sourceFL.some(x=>path.functionalLocations.includes(x)));
  assert.equal(sc.sapPartMapping.status!=='provisorio',true);
  for(const seed of [1,21,2026]){
   const choices=E.options(D,sc,seed);
   assert.equal(choices.length,6);
   const answers=[...sc.path,sc.component,sc.damage,sc.cause];
   choices.forEach((list,i)=>{
    assert.equal(list.length,4,sc.id+' etapa '+i);
    assert.equal(new Set(list.map(x=>x.id)).size,4,sc.id+' sem repetição');
    assert.ok(list.some(x=>x.id===answers[i]),sc.id+' hipótese '+i);
    if(i<3)for(const candidate of list){
     const same=D.sapInstalledPaths.filter(p=>p.modelId===sc.modelId);
     assert.ok(same.some(p=>p[['system','group','subgroup'][i]]===candidate.id),sc.id+' alternativa localização cadastrada');
    }
   });
  }
 }else{
  if(!path)pendingFl++;
  else pendingPart++;
 }
}
assert.equal(physicalMatch,81);
assert.equal(eligible,79);
assert.equal(pendingFl,43);
assert.equal(pendingPart,2);
assert.equal(audit.counts.active,79);
assert.equal(audit.counts.pending,45);
for(const id of promoted){
 const sc=D.scenarios.find(x=>x.id===id);
 assert.equal(E.sapEligible(D,sc),true,'cenário recuperado '+id);
 assert.equal(sc.sapPathMapping.match,'codigo_literal_fl');
 assert.ok(sc.sapPathMapping.functionalLocations.length>=1);
}
for(const id of ['INC103','INC115','INC122','INC123']){
 const sc=D.scenarios.find(x=>x.id===id);
 assert.equal(E.sapEligible(D,sc),false,'FPS sem subgrupo literal deve continuar pendente');
}
const f2=D.scenarios.find(x=>x.id==='INC002');
assert.equal(f2.path[2],'FID2');
assert.equal(f2.sapPathMapping.objectTypeCode,'FIDR');
assert.ok(f2.sapPathMapping.functionalLocations.some(x=>x.endsWith('-FID2')));
const sc=D.scenarios.find(x=>x.id==='INC001');
const s=E.create(D,()=>.44),j=s.jobs[0];
j.scene=sc.id;j.modelId=sc.modelId;j.options=E.options(D,sc,753);j.stage=3;
const oldCode=sc.sapPathMapping.canonicalPath[2];
assert.notEqual(oldCode,sc.path[2]);
const option=j.options[2].find(x=>x.id===sc.path[2]);
option.id=oldCode;option.label='Final Drive;Position 1';
j.plannerDiagnosis={codes:[...sc.sapPathMapping.canonicalPath,sc.component,sc.damage,sc.cause],evaluated:false};
j.diagnosticLog=[{stage:2,outcome:'confirmed',value:'Final Drive;Position 1'}];
const before=JSON.stringify([s.cash,s.tick,s.done.length,j.stage,s.jobs.length]);
E.localizeDiagnosticOptions(s,D);
assert.ok(j.options[2].some(x=>x.id===sc.path[2]));
assert.ok(j.diagnosticLog[0].value==='Comando Final;Posição 1');
assert.equal(j.plannerDiagnosis.codes[2],sc.path[2]);
assert.equal(j.sapClassificationBlocked,false);
assert.equal(JSON.stringify([s.cash,s.tick,s.done.length,j.stage,s.jobs.length]),before);
const once=JSON.stringify(j);E.localizeDiagnosticOptions(s,D);
assert.equal(JSON.stringify(j),once,'migração idempotente');
console.log('OK Ciclo 26: 371 caminhos reais, 442 instalações, 16 cenários recuperados, 79 liberados, 45 pendentes, save preservado.');
