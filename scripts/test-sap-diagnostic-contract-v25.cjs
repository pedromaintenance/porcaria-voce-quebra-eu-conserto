/* Contrato imutável dos seis níveis diagnósticos SAP — 2026-10-24.
 * Regressão sem alterar caminhos, vocabulário, hipóteses ou saves.
 * O código aceita extensões didáticas legadas SOMENTE para compatibilidade;
 * a auditoria as identifica e impede seu crescimento sem revisão explícita.
 */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json');
const E=require('../engine.js');
const canon=k=>k==='paths'?D.paths:D.catalog[k];
const fnv32=s=>{
 let hash=2166136261;
 for(let i=0;i<s.length;i++)hash=Math.imul(hash^s.charCodeAt(i),16777619);
 return (hash>>>0).toString(16).padStart(8,'0');
};
const LOCKED={
 paths:'e9b414c8',parts:'cd1506c8',damages:'d7c3ccb7',causes:'f131601e'
};
// A referência não é atualizada para ajustar um caso OEM: o caso é que deve ser mapeado.
for(const [kind,fingerprint] of Object.entries(LOCKED)){
 assert.equal(fnv32(JSON.stringify(canon(kind))),fingerprint,
  'Lista-base '+kind+' foi alterada. Revisar expressamente a alteração da fonte antes do merge.');
}
assert.equal(D.paths.length,403);
assert.equal(D.catalog.parts.length,43);
assert.equal(D.catalog.damages.length,66);
assert.equal(D.catalog.causes.length,81);
assert.equal(D.scenarios.length,124);
const originalPaths=D.paths.filter(p=>p.sapValidated!==false);
const pedagogicalPaths=D.paths.filter(p=>p.sapValidated===false);
assert.equal(originalPaths.length,371,'371 registros prévios à extensão didática');
assert.equal(pedagogicalPaths.length,32,'32 caminhos didáticos identificados, não devem crescer');
const legacyIds=[];
for(const sc of D.scenarios){
 assert.equal(E.validateDiagnosticReference(D,sc),true,'rota FMEA reconhecida: '+sc.id);
 const route=D.paths.find(p=>p.modelId===sc.modelId&&p.system===sc.path[0]&&
  p.group===sc.path[1]&&p.subgroup===sc.path[2]);
 assert.ok(route,sc.id+' deve apontar para tripla existente no mesmo equipamento');
 if(route.sapValidated===false)legacyIds.push(sc.id);
 // Verificar os seis valores do caso e todos os distratores por cinco sementes.
 const choices=[...sc.path,sc.component,sc.damage,sc.cause];
 const local=D.paths.filter(p=>p.modelId===sc.modelId);
 const sameSys=local.filter(p=>p.system===sc.path[0]);
 const sameGroup=sameSys.filter(p=>p.group===sc.path[1]);
 const lookup=(pool,key,name)=>{
  const map=new Map();
  for(const p of [...pool,...local])if(p[key]&&!map.has(p[key]))map.set(p[key],p[name]);
  return map;
 };
 const references=[
  lookup(local,'system','systemName'),
  lookup(sameSys.length?sameSys:local,'group','groupName'),
  lookup(sameGroup.length?sameGroup:local,'subgroup','subgroupName'),
  new Map(D.catalog.parts.map(x=>[x,x])),
  new Map(D.catalog.damages.map(x=>[x.pt,x.pt])),
  new Map(D.catalog.causes.map(x=>[x.pt,x.pt]))
 ];
 assert.equal(choices.length,6);
 for(const seed of [1,31,123,4242,45678]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6,sc.id);
  opts.forEach((arr,i)=>{
   assert.equal(arr.length,4,sc.id+' etapa '+i);
   assert.ok(arr.some(x=>x.id===choices[i]),sc.id+' gabarito ausente etapa '+i);
   assert.equal(new Set(arr.map(x=>x.id)).size,4,sc.id+' opções duplicadas etapa '+i);
   for(const {id,label} of arr){
    assert.ok(references[i].has(id),sc.id+' alternativa não SAP '+i+' '+id);
    assert.equal(label,references[i].get(id),sc.id+' nome divergente '+i+' '+id);
   }
  });
 }
}
assert.equal(legacyIds.length,43,'43 cenários apontam para as 32 trilhas didáticas legadas');
const LOCKED_LEGACY=[...legacyIds].sort().join('|');
const knownIds=[
 'INC046','INC047','INC048','INC049','INC050','INC051','INC052','INC055',
 'INC058','INC063','INC066','INC067','INC072','INC075','INC076','INC077',
 'INC088','INC089','INC091',
 ...Array.from({length:24},(_,i)=>'INC'+String(i+101).padStart(3,'0'))
].sort().join('|');
assert.equal(LOCKED_LEGACY,knownIds,
 'Exceções didáticas mudaram. Mapear cada caso para a lista oficial antes de permitir novas.');
assert.equal(D.catalog.parts.includes('Retentor FPS'),true,
 'Retentor FPS é o rótulo atual de catálogo; não substituir por tradução OEM');
assert.equal(D.catalog.parts.includes('Trava do Fixador'),false,
 'Tradução OEM não deve ser injetada como opção SAP');
const baseline=JSON.stringify(D);
const example=D.scenarios.find(s=>s.id==='INC103');
const wrong=JSON.parse(JSON.stringify(example));
wrong.component='Trava do Fixador';
assert.throws(()=>E.options(D,wrong,1),/Componente fora da referência/);
wrong.component=example.component;wrong.damage='Danificado OEM';
assert.throws(()=>E.options(D,wrong,1),/Dano fora da referência/);
wrong.damage=example.damage;wrong.cause='Causa OEM arbitrária';
assert.throws(()=>E.options(D,wrong,1),/Causa fora da referência/);
wrong.cause=example.cause;wrong.path=['IMAT','BUCK','RETAINER_NEW'];
assert.throws(()=>E.options(D,wrong,1),/Sistema \/ Grupo \/ Subgrupo fora da referência/);
assert.equal(JSON.stringify(D),baseline,'nem catálogo nem cenários são alterados pela validação');
console.log('OK SAP: 6 níveis, 124 cenários, 403 caminhos, listas imutáveis, 43 exceções didáticas sinalizadas.');
