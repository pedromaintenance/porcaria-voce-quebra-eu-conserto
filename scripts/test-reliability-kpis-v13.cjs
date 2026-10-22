/* PORCARIA v0.9.16 — KPI de manutenção: consistência e dados incompletos. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../engine.js'),D=require('../game-data.json');
const R=require('../phaser-play/reliability-kpis.js');
assert.equal(R.VERSION,'13.0.0');
assert.deepEqual(R.VALID_DAYS,[7,14,30]);
const state=E.create(D,()=>0.4);
let a=R.compute(state,D),initial=JSON.stringify(state);
assert.equal(a.days,14);
assert.equal(a.metrics.correctiveOrders,0);
assert.equal(a.metrics.preventiveServices,0);
assert.equal(a.metrics.firstPassPct,null);
assert.equal(a.metrics.meanClosedLeadHours,null);
assert.equal(a.metrics.resourceSharePreventivePct,null);
assert.equal(a.trend.length,14);
assert.deepEqual(a.repeated,[]);
assert.equal(JSON.stringify(state),initial,'consulta pura e legada');
state.tick=30;state.day=16;state.shift=0;
const mk=(id,asset,scene,tickOpen,finishedTick,worked,costLabor,extras={})=>
 ({id,asset,scene,modelId:'EQ01',tickOpen,finishedTick,worked,costLabor,
 elapsedHours:(finishedTick-tickOpen)*12,priority:2,materialCost:200,materialUsed:true,
 reworkHours:0,materialWaitShifts:0,toolWaitShifts:0,diagnosisQueueShifts:0,...extras});
state.done=[
 mk('OS9003','EQ01·01','INC001',21,26,6,252,{firstTime:false,reworkHours:2,materialWaitShifts:1}),
 mk('OS9002','EQ01·01','INC001',17,20,4,168,{firstTime:true,toolWaitShifts:1}),
 mk('OS9001','EQ01·01','INC001',8,14,9,378,{firstTime:true}),
 mk('OS9004','EQ01·02','INC002',26,28,3,126,{firstTime:undefined,materialUsed:false}),
 mk('OS8999','EQ02·01','INC003',1,5,7,294,{firstTime:true})
];
state.jobs=[mk('OS9010','EQ03·01','INC004',25,undefined,0,0,
 {finishedTick:undefined,elapsedHours:undefined,stage:0})];
state.preventiveJobs=[
 {id:'PV1',status:'completed',asset:'EQ01·03',hours:2,cost:120,closedTick:24},
 {id:'PV2',status:'completed',asset:'EQ03·02',hours:4,cost:360,closedTick:23},
 {id:'PV3',status:'cancelled',asset:'EQ02·02',hours:4,cost:360,closedTick:25},
 {id:'PV4',status:'planned',asset:'EQ01·04',hours:4,cost:360,tick:30},
 {id:'PV0',status:'completed',asset:'EQ02·03',hours:2,cost:120,closedTick:7}
];
state.purchaseHistory=[{id:'PC1',paid:700,orderedTick:24},{id:'PC0',paid:900,orderedTick:8}];
initial=JSON.stringify(state);
a=R.compute(state,D,{days:7});
assert.equal(a.days,7);
assert.equal(a.trend.length,7);
assert.equal(a.metrics.correctiveOrders,3,'apenas fechamentos dentro da janela');
assert.equal(a.metrics.correctiveHH,13);
assert.equal(a.metrics.correctiveLaborCost,546);
assert.equal(a.metrics.materialConsumedValuation,400,'não valorar material não aplicado');
assert.equal(a.metrics.preventiveServices,2);
assert.equal(a.metrics.preventiveHH,6);
assert.equal(a.metrics.preventiveCost,480);
assert.equal(a.metrics.preventiveCommittedCost,360,'reserva pendente isolada');
assert.equal(a.metrics.purchasesCash,700,'compras pagas em linha separada');
assert.equal(a.metrics.reworkHH,2);
assert.equal(a.metrics.firstPassEvaluated,2,'ignorar saves sem classificação');
assert.equal(a.metrics.firstPassCount,1);
assert.equal(a.metrics.firstPassPct,50);
assert.equal(a.metrics.closedLeadHours,120,'soma de horas corridas das OS encerradas');
assert.equal(a.metrics.meanClosedLeadHours,40);
assert.equal(a.metrics.meanCorrectiveEffortHH,4.3);
assert.equal(a.metrics.activeOrderExposureHours,60);
assert.equal(a.metrics.materialShifts,1);
assert.equal(a.metrics.toolShifts,1);
assert.equal(a.metrics.recurrenceEvents,2,'contar reincidências em ativo após OS encerrada');
assert.equal(a.metrics.recurringAssets,1);
assert.equal(a.repeated[0].asset,'EQ01·01');
assert.equal(a.repeated[0].sameScenario,2,'mesmo cenário didático não equivale a mesma causa física');
assert.equal(a.metrics.resourceSharePreventivePct,31.6);
assert.equal(a.trend.reduce((n,x)=>n+x.correctiveOrders,0),3);
assert.equal(a.trend.reduce((n,x)=>n+x.preventiveOrders,0),2);
assert.equal(JSON.stringify(state),initial,'repetição da consulta não altera save');
const thirty=R.compute(state,D,{days:30});
assert.equal(thirty.metrics.correctiveOrders,5);
assert.equal(thirty.metrics.preventiveServices,3);
assert.equal(R.compute(state,D,{days:15}).days,14,'filtro fora da lista volta ao padrão');
assert.ok(a.notes.some(x=>x.includes('MTBF')));
assert.ok(a.notes.some(x=>x.includes('não são somáveis')));
state.done=Array.from({length:200},(_,i)=>mk('OS'+i,'EQ01·'+String(i%6+1).padStart(2,'0'),'INC001',2,4,1,42));
state.preventiveJobs=Array.from({length:150},(_,i)=>({id:'PV'+i,asset:'EQ01·01',status:'completed',hours:2,cost:120,closedTick:1}));
const bounded=R.compute(state,D);
assert.equal(bounded.coverage.limitedClosed,true);
assert.equal(bounded.coverage.limitedPreventive,true);
assert.equal(E.validate(JSON.parse(JSON.stringify(state))),true);
const ui=fs.readFileSync('phaser-play/game.js','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.ok(ui.includes("await import('./reliability-kpis.js?v=0.9.16')"));
assert.ok(ui.includes('function drawReliability()'));
assert.ok(ui.includes('data-reliability-days')&&ui.includes('data-reliability-open'));
assert.ok(ui.includes('data-planning-horizon="kpis"'));
assert.ok(sw.includes('reliability0916')&&sw.includes("'./phaser-play/reliability-kpis.js'"));
console.log('OK ciclo 13: PM/CM, janela 7/14/30, custos, recorrência, exposição, saves e ausência de MTBF.');
