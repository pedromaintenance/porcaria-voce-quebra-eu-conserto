/* P.O.R.C.A.R.I.A. — Ciclo 21 / v0.9.24: progressão por turno de achados. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../engine.js'),I=require('../phaser-play/inspection.js');
const P=require('../phaser-play/anomaly-progression.js');
const D=require('../game-data.json');
const make=()=>E.create(D,()=>0.46);
function note(s,priority='alta'){
 I.normalized(s);
 const x=I.plan(s,D)[0];assert.ok(x);
 assert.equal(I.inspect(s,D,x.id).status,'finding');
 const n=I.notify(s,x.id,'Indício de degradação identificado na inspeção do equipamento.',priority);
 assert.equal(n.ok,true);
 return n.notification;
}
const original=make(),first=note(original),caseId=first.sourceScenario;
assert.equal(P.VERSION,'21.0.0');
assert.equal(P.eligible(first,D),true);
assert.equal(first.anomalyProgression.phase,'observado');
assert.equal(first.anomalyProgression.startTick,0);
assert.equal(P.display(first,original,D).elapsed,0);
const thresholds=P.policy(first,D);
assert.ok(thresholds.aggravatedAt<thresholds.criticalAt);
assert.ok(thresholds.criticalAt<thresholds.failureAt);
const previousCash=original.cash;
const firstOrderCount=original.jobs.length;
for(let i=0;i<thresholds.failureAt;i++){
 E.advance(original,D,()=>0.46);
 const elapsed=original.tick;
 const expected=P.phaseAt?P.phaseAt(elapsed,thresholds):
  elapsed>=thresholds.failureAt?'falha_funcional':elapsed>=thresholds.criticalAt?'critico':
  elapsed>=thresholds.aggravatedAt?'agravado':'observado';
 assert.equal(first.anomalyProgression.phase,expected);
}
assert.equal(first.status,'convertida_os','falha gera corretiva pelo rádio e fila');
assert.ok(first.workOrderId);
const order=original.jobs.find(x=>x.id===first.workOrderId);
assert.ok(order);
assert.equal(order.scene,caseId,'cenário preservado, sem inventar diagnóstico');
assert.equal(order.asset,first.asset,'falha no mesmo TAG');
assert.equal(order.priority,3);
assert.equal(order.source,'falha_funcional_inspecao');
assert.equal(order.notificationId,first.id);
assert.equal(order.progressionOrigin.failureTick,original.tick);
assert.equal(order.assigned,null,'a corretiva não aloca mecânico automaticamente');
assert.ok(original.jobs.length>=firstOrderCount);
assert.equal(first.anomalyProgression.history.filter(h=>h.cause==='os_emergencial_criada').length,1);
assert.equal(original.decisionHistory.filter(x=>x.type==='anomaly_emergency_cost'&&x.notificationId===first.id).length,1);
assert.equal(first.anomalyProgression.failureCostApplied,true);
assert.ok(original.cash<=previousCash-180,'custo de mobilização foi aplicado');
assert.ok(original.fleetTelemetry.assets[first.asset].failures.some(x=>x.orderId===order.id&&x.origin==='progression'));
const before=JSON.stringify(first.anomalyProgression.history);
E.advance(original,D,()=>0.46);
assert.equal(JSON.stringify(first.anomalyProgression.history),before,'nenhuma OS ou transição duplicada');
assert.equal(original.jobs.filter(x=>x.notificationId===first.id).length,1);
// Arquivamento justificado encerra risco e preserva histórico.
const archived=make(),an=note(archived);
assert.equal(I.review(archived,an.id,'archive',{reason:'Condição não confirmada no registro; evidência insuficiente para prosseguir.'}).ok,true);
const aSnapshot=JSON.stringify(archived.jobs);
for(let i=0;i<P.policy(an,D).failureAt+2;i++)E.advance(archived,D,()=>0.42);
assert.equal(an.anomalyProgression.phase,'observado');
assert.equal(an.anomalyProgression.closingReason,'arquivada_pcm');
assert.equal(an.workOrderId,null);
assert.equal(archived.jobs.some(x=>x.notificationId===an.id),false);
// Save antigo com nota aberta não acumula penalidade ou falha retroativa.
const legacy=make(),ln=note(legacy,'media'),id=ln.id;
legacy.tick=12;legacy.day=7;legacy.shift=0;
delete ln.anomalyProgression;
const legacyJobs=JSON.stringify(legacy.jobs);
P.normalize(legacy,D);
assert.equal(ln.anomalyProgression.importedLegacy,true);
assert.equal(ln.anomalyProgression.startTick,12);
assert.equal(ln.anomalyProgression.phase,'observado');
assert.equal(JSON.stringify(legacy.jobs),legacyJobs);
assert.equal(P.display(ln,legacy,D).elapsed,0);
assert.equal(P.normalize(legacy,D).notifications.find(x=>x.id===id).anomalyProgression.startTick,12);
assert.equal(E.validate(JSON.parse(JSON.stringify(legacy))),true);
// Conflitos e carteira cheia geram pendência, sem duplicar OS ou debitar duas vezes.
const waiting=make(),wn=note(waiting,'alta');
const wp=P.policy(wn,D);waiting.tick=wp.failureAt;waiting.day=1+Math.floor(waiting.tick/2);
let invoked=0;
const auditLog=[];
P.advance(waiting,D,{openFailure:()=>{invoked++;return {error:'ocupado'}},
 audit:(type,fields)=>auditLog.push({type,...fields})});
assert.equal(invoked,1);
assert.equal(wn.anomalyProgression.pendingFailure,true);
assert.equal(wn.workOrderId,null);
assert.equal(auditLog.filter(x=>x.type==='anomaly_emergency_cost').length,1);
P.advance(waiting,D,{openFailure:()=>{invoked++;return {error:'ocupado'}},
 audit:(type,fields)=>auditLog.push({type,...fields})});
assert.equal(auditLog.filter(x=>x.type==='anomaly_emergency_cost').length,1);
assert.equal(invoked,2,'falha pendente tenta novamente sem nova penalidade');
// Acompanhamentos sem falha confirmada NÃO entram neste motor.
const monitorOnly={...wn,id:'NM9998',monitorOnly:true,anomalyProgression:undefined};
waiting.notifications.push(monitorOnly);
const count=waiting.notifications.length;
P.normalize(waiting,D);assert.equal(waiting.notifications.length,count);
assert.equal(monitorOnly.anomalyProgression,undefined);
// UI e documentação de carregamento.
const html=fs.readFileSync('phaser-play/index.html','utf8');
const ui=fs.readFileSync('phaser-play/inspection-view.js','utf8');
const sector=fs.readFileSync('phaser-play/sector-views.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(html.includes('anomaly-progression.js?v=0.9.24-c21'));
assert.ok(html.includes('game.js?v='),'PWA mantém cache versionado independentemente dos ciclos posteriores');
assert.ok(ui.includes('EVOLUÇÃO DO ACHADO')&&ui.includes('pcmProgression'));
assert.ok(sector.includes('ANORMALIDADES EM EVOLUÇÃO'));
assert.ok(sw.includes('anomalies0924'));
console.log('OK Ciclo 21: progressão por prioridade, falha e OS, custo único, monitoramento isolado, arquivamento, conflitos e saves.');
