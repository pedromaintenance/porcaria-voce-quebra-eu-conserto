/* Ciclo 17 — desempenho operacional: jornada e meta, sem toneladas presumidas. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js'),F=require('../phaser-play/fleet-telemetry.js');
const P=require('../phaser-play/production-performance.js');
assert.equal(P.VERSION,'17.0.0');assert.deepEqual(P.TARGETS,[60,75,85,95]);
const s=E.create(D,()=>0.43);
assert.equal(E.validate(s),true);
let first=P.compute(s,D);
assert.equal(first.metrics.plannedHours,0);
assert.equal(first.metrics.attainmentPct,null);
assert.equal(first.coverage.eligibleAssetTurns,0);
const original=JSON.stringify(s);
assert.deepEqual(P.compute(s,D),first);
assert.equal(JSON.stringify(s),original,'consulta não altera save');
assert.ok(P.setTarget(s,D,'EQ99',75).includes('Modelo'));
assert.ok(P.setTarget(s,D,'EQ01',74).includes('Meta'));
assert.equal(P.setTarget(s,D,'EQ01',75,(t,fields)=>E.recordDecision(s,t,fields)),null);
assert.equal(s.productionTargets.EQ01,75);
assert.ok(s.decisionHistory.some(x=>x.type==='production_target_changed'&&x.modelId==='EQ01'));
const count=s.decisionHistory.length;
assert.equal(P.setTarget(s,D,'EQ01',75,(t,x)=>E.recordDecision(s,t,x)),null);
assert.equal(s.decisionHistory.length,count,'mesma meta não gera auditoria repetida');
const s0=E.create(D,()=>0.47);
const cashBefore=s0.cash;
E.advance(s0,D,()=>0.95);
const sample=s0.fleetTelemetry.samples[0];
assert.equal(sample.perAsset.length,54);
assert.ok(sample.perAsset.every(a=>[0,4,8,12].includes(a.dutyHours)));
assert.equal(sample.perAsset.reduce((n,x)=>n+x.dutyHours,0),54*8);
assert.equal(sample.perAsset.reduce((n,x)=>n+x.operating+x.standby+x.corrective+x.preventive,0),648);
let live=P.compute(s0,D,{days:7});
assert.equal(live.coverage.eligibleAssetTurns,54);
assert.equal(live.metrics.plannedHours,432);
assert.equal(live.metrics.operatingHours,sample.operating,'entrega soma horas de operação realmente registradas');
assert.ok(live.metrics.shortfallHours>=0&&live.metrics.shortfallHours<=432);
assert.equal(live.metrics.correctiveLossHours+live.metrics.preventiveLossHours<=live.metrics.shortfallHours,true);
assert.equal(live.models.length,9);
assert.equal(live.assets.length,54);
assert.equal(live.coverage.fullWindow,false);
assert.equal(s0.cash<=cashBefore,true);
const controlled={tick:3,productionTargets:{EQ01:75},fleetTelemetry:{samples:[
 {tick:0,perAsset:[
  {asset:'EQ01·01',dutyHours:8,operating:8,standby:4,corrective:0,preventive:0},
  {asset:'EQ01·02',dutyHours:8,operating:3,standby:4,corrective:5,preventive:0},
  {asset:'EQ02·01',dutyHours:0,operating:0,standby:12,corrective:0,preventive:0}
 ]},
 {tick:1,perAsset:[
  {asset:'EQ01·01',dutyHours:8,operating:6,standby:4,corrective:0,preventive:2},
  {asset:'EQ01·02',dutyHours:8,operating:8,standby:4,corrective:0,preventive:0}
 ]},
 {tick:2,perAsset:[{asset:'EQ01·01',operating:8,standby:4,corrective:0,preventive:0}]}
]}};
const raw=JSON.stringify(controlled);
const out=P.compute(controlled,D,{days:7});
assert.equal(out.metrics.plannedHours,32);
assert.equal(out.metrics.operatingHours,25);
assert.equal(out.metrics.shortfallHours,7);
assert.equal(out.metrics.correctiveLossHours,5);
assert.equal(out.metrics.preventiveLossHours,2);
assert.equal(out.metrics.attainmentPct,78.1);
assert.equal(out.models.find(x=>x.modelId==='EQ01').withinTarget,true);
assert.equal(out.models.find(x=>x.modelId==='EQ02').attainmentPct,null,'jornada zero não cria percentual artificial');
assert.equal(out.coverage.missingDutySnapshots,1);
assert.equal(out.coverage.eligibleAssetTurns,5);
assert.equal(out.assets.find(x=>x.asset==='EQ01·02').attainmentPct,68.8);
assert.equal(out.assets.find(x=>x.asset==='EQ01·01').attainmentPct,87.5);
assert.equal(JSON.stringify(controlled),raw,'indicadores imutáveis');
controlled.productionTargets.EQ01=85;
assert.equal(P.compute(controlled,D).models.find(x=>x.modelId==='EQ01').withinTarget,false);
assert.equal(P.compute(controlled,D,{days:8}).days,14,'janela inválida volta ao padrão');
// Compatibilidade: dados V15 não armazenavam jornada histórica. Não preencher com a atual.
const legacy=E.create(D,()=>0.5);
legacy.tick=2;legacy.day=2;legacy.shift=0;
legacy.fleetTelemetry.samples=[{tick:1,perAsset:[{asset:'EQ01·01',operating:8,standby:4,corrective:0,preventive:0}]}];
legacy.fleetTelemetry.dutyHours['EQ01·01']=12;
const oldResult=P.compute(legacy,D);
assert.equal(oldResult.metrics.plannedHours,0);
assert.equal(oldResult.coverage.missingDutySnapshots,1);
assert.equal(E.validate(legacy),true);
const ui=fs.readFileSync('phaser-play/game.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(ui.includes("await import('./production-performance.js?v=0.9.20')"));
assert.ok(ui.includes("function drawProduction()"));
assert.ok(ui.includes('data-planning-horizon="production"'));
assert.ok(ui.includes('data-production-target')&&ui.includes('data-production-days'));
assert.ok(sw.includes("'./phaser-play/production-performance.js'"));
console.log('OK Ciclo 17: metas, 54 registros, jornadas históricas, perdas, ranking, auditoria e saves legados.');
