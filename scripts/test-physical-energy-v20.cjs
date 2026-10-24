/* P.O.R.C.A.R.I.A. — Ciclo 20: energia física por HH, descanso e OS interrompidas. */
'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js'),D=require('../game-data.json');
const I=require('../phaser-play/inspection.js');
const PM=require('../phaser-play/preventive-orders.js');
const make=()=>E.create(D,()=>0.45);
function corrective(s,m=s.team[0]){
 const j=s.jobs[0],c=E.scenario(D,j.scene);
 j.stage=6;j.diagRemaining=0;j.repairRemaining=1000;j.repairTarget=1000;
 s.tools[c.tool]=true;s.stock[c.material]=100;
 assert.equal(E.attach(s,j.id,m.id,0,false),null);
 return j;
}
assert.equal(E.EFFECTIVE_HOURS,10.5);
const q=make(),qm=q.team[0];qm.physical=39;
assert.match(E.physicalBlock(q,qm),/40%/);
assert.match(E.attach(q,q.jobs[0].id,qm.id,0,false),/40%/);
qm.physical=100;assert.equal(E.physicalBlock(q,qm),null);
const j=corrective(q);
const before=j.worked;
E.advance(q,D,()=>0);
assert.equal(qm.physicalShift.baseLoss,40,'sorteio mínimo é 40 pontos');
assert.equal(qm.physicalShift.workedHH,10.5);
assert.equal(qm.physical,60,'turno cheio consome exatamente 40 pontos');
assert.equal(qm.fullWorkStreak,1);
assert.equal(j.worked-before,10.5,'respeita o máximo de HH por profissional');
E.advance(q,D,()=>0);
assert.equal(qm.physicalShift.baseLoss,40,'taxa pode ser novamente sorteada no turno seguinte');
assert.equal(qm.physical,20,'não existe regeneração automática na virada do dia');
assert.equal(qm.fullWorkStreak,2,'dois turnos integrais seguidos registrados');
const beforeThird=j.worked;
E.advance(q,D,()=>0);
assert.equal(j.worked,beforeThird,'terceiro turno integral consecutivo recusado');
assert.equal(j.assigned,null,'OS interrompida e box liberado');
assert.equal(j.lastInterruption.reason,'descanso_compulsorio');
assert.equal(qm.fullWorkStreak,0);
assert.equal(qm.physical,60,'12h sem trabalho recuperam 40 pontos');
// Consumo máximo é proporcional às HH, com exaustão e dois turnos posteriores de afastamento.
const x=make(),xm=x.team[0];xm.physical=40;
const xj=corrective(x);
E.advance(x,D,()=>0.999999);
assert.equal(xm.physicalShift.baseLoss,70);
assert.equal(xm.physicalShift.workedHH,6);
assert.equal(xm.physical,0,'HH disponíveis limitadas pela energia real');
assert.equal(xj.status,'interrompida');
assert.equal(xj.assigned,null);
assert.equal(xj.lastInterruption.reason,'exaustao_fisica');
assert.equal(xm.exhaustedUntilTick,3,'turnos 1 e 2 são afastamento');
assert.match(E.attach(x,xj.id,xm.id,0,false),/exaustão física/);
E.advance(x,D,()=>0.999999);
assert.equal(x.tick,2);
assert.match(E.attach(x,xj.id,xm.id,0,false),/exaustão física/);
E.advance(x,D,()=>0.999999);
assert.equal(x.tick,3);
assert.equal(xm.physical,100,'descanso consecutivo satura em 100');
assert.equal(E.attach(x,xj.id,xm.id,0,false),null,'pode voltar no turno 3');
// Uma única taxa no turno ao combinar inspeção e reparo.
const mixed=make(),mm=mixed.team[0];mm.physical=100;
const asset=D.models.flatMap(model=>Array.from({length:6},(_,i)=>model.id+'·'+String(i+1).padStart(2,'0')))
 .find(a=>!mixed.jobs.some(j=>j.asset===a)&&!mixed.preventiveOrders.some(p=>p.asset===a));
assert.ok(asset,'ativo livre para inspeção de campo');
const scheduled=I.schedule(mixed,D,asset,mm.id);
assert.equal(scheduled.ok,true);
assert.equal(I.inspectAndRoute(mixed,D,scheduled.inspection.id).ok,true);
const mj=corrective(mixed);
E.advance(mixed,D,()=>0.5);
assert.equal(mm.physicalShift.baseLoss,55);
assert.ok(Math.abs(mm.physicalShift.workedHH-10.5)<0.001,'inspeção + corretiva somam 10,5 HH');
assert.equal(mm.physical,45,'um único sorteio e nenhum débito físico duplicado');
assert.ok(mj.worked<=9+0.001,'reparo compartilha a janela com 1,5 HH de inspeção');
// Preventivas automáticas também respeitam energia e mantêm OS após exaustão.
const p=make(),pm=p.team[0],order=p.preventiveOrders[0];assert.ok(order);
pm.physical=39;assert.match(E.assignPreventiveOrder(p,D,order.id,pm.id,0),/indisponível/);
pm.physical=40;assert.equal(E.assignPreventiveOrder(p,D,order.id,pm.id,0),null);
order.repairRemaining=20;
const originalCash=p.cash;
E.advance(p,D,()=>0.999999);
assert.equal(pm.physical,0);
assert.equal(order.status,'open','parada preventiva preservada no backlog');
assert.equal(order.assigned,null);
assert.equal(order.lastInterruption.reason,'exaustao_fisica');
assert.equal(p.cash,originalCash,'não cobra como preventiva concluída');
assert.equal(p.preventiveJobs.filter(r=>r.orderId===order.id&&r.status==='completed').length,0);
// Reserva futura pode ser feita, mas a aptidão é revalidada no turno; bloqueio conhecido é recusado.
const book=make(),bm=book.team[0],bo=book.preventiveOrders[0];
bm.exhaustedUntilTick=3;
assert.match(E.schedulePreventiveOrder(book,D,bo.id,bm.id,0,1),/exaustão/);
assert.equal(E.schedulePreventiveOrder(book,D,bo.id,bm.id,0,3),null);
// Saves anteriores preservam identidade, energia e OS ao ganhar campos opcionais.
const legacy=make(),snapshotJobs=JSON.stringify(legacy.jobs);
for(const m of legacy.team){delete m.physicalShift;delete m.fullWorkStreak;delete m.lastFullWorkTick;delete m.exhaustedUntilTick;}
const oldEnergy=legacy.team.map(m=>m.physical);
E.normalizeRoster(legacy);
assert.deepEqual(legacy.team.map(m=>m.physical),oldEnergy);
assert.equal(JSON.stringify(legacy.jobs),snapshotJobs);
assert.equal(legacy.team.every(m=>m.exhaustedUntilTick===0&&m.fullWorkStreak===0),true);
assert.equal(E.validate(JSON.parse(JSON.stringify(legacy))),true);
console.log('OK Ciclo 20: 40–70 pontos/10,5 HH, inspeção+OS, descanso 12h, 40%, terceira jornada, exaustão e saves.');
