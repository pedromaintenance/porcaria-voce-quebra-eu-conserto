/* Sprint 31 · 5 campanhas de 21 dias, ciclo estendido e continuidade do save. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
const D=require('../game-data.json');
const I=require('../phaser-play/inspection.js');
const M=require('../phaser-play/monitoring.js');
const seeds=[1,42,2026,314159,20261026];
const failures=[];
const invariant=(ok,message,state,seed)=>{if(!ok)failures.push({
 seed,tick:state.tick,day:state.day,shift:state.shift,message});};
function check(s,seed){
 invariant(E.validate(s),'save inválido',s,seed);
 invariant(s.day>=1&&[0,1].includes(s.shift),'dia/turno inválido',s,seed);
 invariant(new Set(s.jobs.map(j=>j.id)).size===s.jobs.length,'OS abertas duplicadas',s,seed);
 invariant(!s.done.some(j=>s.jobs.some(x=>x.id===j.id)),'OS simultaneamente aberta e concluída',s,seed);
 invariant(s.jobs.every(j=>E.radioEligible(D.scenarios.find(sc=>sc.id===j.scene))||
  j.chainOrigin||j.notificationId||j.source==='falha_funcional_inspecao'),
  'OS espontânea com fonte laboratorial/inativa',s,seed);
 const assignments=s.jobs.filter(j=>j.assigned);
 const bays=assignments.map(j=>j.bay),people=assignments.map(j=>j.assigned);
 invariant(new Set(bays).size===bays.length,'duas OS no mesmo box',s,seed);
 invariant(new Set(people).size===people.length,'duas OS com mesmo profissional',s,seed);
 invariant(Object.values(s.stock).every(n=>Number.isFinite(n)&&n>=0),'saldo de material inválido',s,seed);
 invariant(['number'].includes(typeof s.cash)&&Number.isFinite(s.cash),'caixa não numérico',s,seed);
 invariant(s.team.every(m=>Number.isFinite(m.physical)&&Number.isFinite(m.mental)&&
  m.physical>=0&&m.physical<=100&&m.mental>=0&&m.mental<=100),'energia inválida',s,seed);
 invariant(s.kpi.length<=80,'histórico KPI excedeu retenção',s,seed);
 invariant(s.day<21||s.closed,'Dia 21 sem encerramento de ciclo',s,seed);
 invariant(s.bays===3,'quantidade de boxes mudou',s,seed);
}
function run(seed,turns){
 const rng=E.mulberry32(seed);
 let s=E.create(D,rng),first=JSON.stringify(s);
 I.normalized(s);
 M.receive(s,D,I,{initial:true});
 check(s,seed);
 for(let t=0;t<turns;t++){
  const before=s.tick;E.advance(s,D,rng);M.receive(s,D,I);
  invariant(s.tick===before+1,'relógio do motor não avançou 1 turno',s,seed);
  check(s,seed);
  if(t===12||t===40){
   const out=JSON.stringify(s),copy=JSON.parse(out);
   invariant(E.validate(copy),'roundtrip JSON corrompeu campanha',s,seed);
   invariant(JSON.stringify(copy)===out,'roundtrip JSON não idempotente',s,seed);
   // Emula recarga do aplicativo sem regenerar retrospectivamente eventos.
   E.normalizeRoster(copy);E.ANOMALY.normalize(copy,D);
   E.initFleet(copy,D);E.generatePreventiveOrders(copy,D);
   E.localizeDiagnosticOptions(copy,D);I.normalized(copy);
   const count=copy.jobs.length+copy.done.length;
   M.receive(copy,D,I,{initial:true});
   invariant(copy.jobs.length+copy.done.length===count,'recarga duplicou OS',s,seed);
   s=copy;
  }
 }
 invariant(s.closed&&s.day>=21,'marco final ausente',s,seed);
 return {seed,turns,day:s.day,completed:s.done.length,open:s.jobs.length,notifications:s.notifications.length};
}
for(const seed of seeds)run(seed,42);
const long=run(777,60);
if(failures.length)throw Error('Invariantes da campanha: '+JSON.stringify(failures.slice(0,15),null,2));
console.log('OK S31-02: 5 campanhas × 42 + 1 × 60 turnos; saves, recarga, fontes e invariantes. '+JSON.stringify(long));
