/* Sessão 7: 100 missões e consequências reais de backlog no motor de jogo. */
'use strict';
const assert=require('node:assert/strict');
const D=require('../game-data.json');
const E=require('../engine.js');
const mapping={
 INC096:['INC041','EQ01','Rolamento'],
 INC097:['INC042','EQ07','Engrenagem'],
 INC098:['INC058','EQ03','Bomba, Hidráulica'],
 INC099:['INC076','EQ06','Compressor, Ar'],
 INC100:['INC094','EQ09','Pneu']
};
assert.equal(D.scenarios.length,124,'95 missões originais + 5 encadeadas');
assert.equal(new Set(D.scenarios.map(c=>c.id)).size,124);
assert.equal(D.paths.length,403,'nenhum caminho SAP novo');
assert.deepEqual(D.scenarios.slice(0,95).map(s=>s.id),
  Array.from({length:95},(_,i)=>'INC'+String(i+1).padStart(3,'0')),
  '95 missões anteriores preservadas');
const paths=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
for(const [id,[precursor,model,part]] of Object.entries(mapping)){
 const sc=D.scenarios.find(x=>x.id===id),older=D.scenarios.find(x=>x.id===precursor);
 assert.ok(sc&&older);
 assert.equal(sc.modelId,model);
 assert.equal(sc.modelId,older.modelId,'mesmo modelo no encadeamento');
 assert.equal(sc.component,part);
 assert.equal(sc.progression.precedingScenario,precursor);
 assert.equal(sc.progression.thresholdIdleShifts,3);
 assert.equal(sc.progression.thresholdIdleWithPlannerErrors,2);
 assert.equal(sc.progression.minPlannerErrors,2);
 assert.equal(sc.progression.trigger,'after_delayed_completion');
 assert.equal(sc.progression.realConsequenceVerified,false);
 assert.equal(sc.progression.releasePolicy,'restrito_ao_instrutor_ate_conclusao');
 assert.ok(sc.progression.mechanism&&sc.progression.alternatives.length>=2);
 assert.equal(sc.fmeaSource.repository,'pedromaintenance/fmea-database-mining');
 assert.equal(sc.fmeaSource.status,'encadeamento_autoral_a_partir_de_referencia_didatica');
 assert.equal(sc.simulation.nature,'ficcao_didatica');
 assert.equal(sc.simulation.oemValidated,false);
 assert.equal(sc.sourcePartMatch,false);
 assert.ok(paths.has([sc.modelId,...sc.path].join('|')));
 assert.ok(D.items[sc.material]&&D.tools[sc.tool]);
 assert.equal(sc.estimatedCost,D.items[sc.material].unit);
 for(const seed of [1,42,2026,420100]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6);
  [...sc.path,sc.component,sc.damage,sc.cause].forEach((good,i)=>{
   assert.equal(opts[i].length,4,id+' etapa '+i);
   assert.equal(new Set(opts[i].map(x=>x.id)).size,4);
   assert.ok(opts[i].some(x=>x.id===good));
  });
 }
}
assert.ok(D.catalog.parts.includes('Compressor, Ar'));
assert.ok(D.items.COMA&&D.items.COMA.initial===0);

function scenarioGame(id){
 const original=D.scenarios.find(x=>x.id===id);
 const s=E.create(D,()=>.42);
 s.jobs=[];for(const m of s.team)m.assigned=null;
 const used=E.spawn(s,{...D,scenarios:[original]},1,()=>.42);
 assert.equal(used,1);
 const j=s.jobs[0],m=s.team[0];
 assert.equal(j.scene,id);
 assert.equal(E.attach(s,j.id,m.id,0,false),null);
 j.stage=6;j.status='apto';j.repairRemaining=0.01;j.materialUsed=true;
 s.tools[original.tool]=true;
 return {s,j,m};
}
for(const [follow,[precursor]] of Object.entries(mapping)){
 const noDelay=scenarioGame(precursor);
 E.advance(noDelay.s,D,()=>.5);
 assert.equal(noDelay.s.jobs.filter(j=>j.scene===follow).length,0,precursor+' sem atraso não encadeia');

 const delayed=scenarioGame(precursor);
 delayed.j.idleShifts=3;
 E.advance(delayed.s,D,()=>.5);
 assert.equal(delayed.s.jobs.length,1,'apenas a OS secundária permanece');
 const next=delayed.s.jobs[0];
 assert.equal(next.scene,follow,'incidente secundário correto');
 assert.equal(next.asset,delayed.j.asset,'mesmo ativo');
 assert.equal(next.chainOrigin.orderId,delayed.j.id,'rastreio da OS origem');
 assert.equal(next.chainOrigin.idleShifts,3);
 assert.equal(next.chainOrigin.trigger,'delay');
 assert.equal(next.stage,0);
 assert.ok(delayed.s.done.some(x=>x.id===delayed.j.id),'precursor concluído no histórico');

 const pct=scenarioGame(precursor);
 pct.j.idleShifts=2;
 pct.j.plannerDiagnosis={codes:['INVALID','INVALID','INVALID','INVALID','INVALID','INVALID'],evaluated:false};
 E.advance(pct.s,D,()=>.5);
 assert.equal(pct.s.jobs.length,1,'erros PCM + atraso reduzido disparam');
 assert.equal(pct.s.jobs[0].scene,follow);
 assert.equal(pct.s.jobs[0].chainOrigin.trigger,'delay_and_pcm_rework');
 assert.ok(pct.s.done[0].plannerDiagnosis.errorCount>=2,'erros preservados na OS encerrada');
}
const forbidden=E.create(D,()=>.5);
for(const m of forbidden.team)m.assigned=null;
forbidden.jobs=[];
const sequelOnly={...D,scenarios:[D.scenarios.find(x=>x.id==='INC096')]};
assert.equal(E.spawn(forbidden,sequelOnly,3,()=>.2),0,'sequelas proibidas no sorteio normal');
assert.equal(forbidden.jobs.length,0);
const legacy=scenarioGame('INC041');
delete legacy.j.idleShifts;
E.advance(legacy.s,D,()=>.5);
assert.equal(legacy.s.jobs.length,0,'saves antigos sem campo de atraso continuam válidos');
console.log('OK: 100 missões, 5 cadeias funcionais mesmo ativo, sem disparo precoce, erro PCM, sorteio e saves legados.');
