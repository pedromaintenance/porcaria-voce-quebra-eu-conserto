/* PORCARIA Ciclo 19 — agendamento de OS preventiva sem execução antecipada. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js'),
 W=require('../phaser-play/weekly-schedule.js'),
 PM=require('../phaser-play/preventive-orders.js'),
 OPT=require('../phaser-play/pcm-options.js');
const make=()=>E.create(D,()=>0.45);
const take=s=>s.preventiveOrders.find(p=>p.status==='open');
assert.equal(W.VERSION,'19.0.0');
assert.equal(OPT.VERSION,'19.0.0');
const s=make(),p=take(s),m=s.team[0],due=s.preventiveDue[p.asset],cash=s.cash;
assert.ok(p&&p.createdAutomatically);
const clean=JSON.stringify(s);
const candidates=OPT.calculate(s,D,E,{orderId:p.id,mechanicId:m.id,bay:0});
assert.equal(candidates.available,true);
assert.equal(candidates.options.find(x=>x.id==='next').available,true);
assert.equal(candidates.options.find(x=>x.id==='next').action,'schedule_pm');
assert.equal(JSON.stringify(s),clean,'consulta imutável');
assert.equal(E.schedulePreventiveOrder(s,D,p.id,m.id,0,s.tick+1),null);
const row=s.scheduleEntries.find(r=>r.orderId===p.id&&r.status==='planned');
assert.ok(row);
assert.equal(row.kind,'preventive');
assert.equal(row.tick,1);
assert.equal(s.cash,cash,'nenhum débito na reserva');
assert.equal(m.assigned,null,'equipe não foi alocada antecipadamente');
assert.equal(p.status,'open');
assert.equal(s.preventiveDue[p.asset],due);
assert.equal(E.schedulePreventiveOrder(s,D,p.id,m.id,0,1).includes('já programada'),true);
assert.equal(E.assignPreventiveOrder(s,D,p.id,m.id,0).includes('futura'),true,'antecipação exige cancelar');
const c=s.jobs[0],scenario=E.scenario(D,c.scene);s.tools[scenario.tool]=true;
const blocked=E.scheduleJob(s,D,c.id,m.id,0,1);
assert.ok(blocked&&blocked.includes('Conflito'),'conflito com OS corretiva detectado na mesma janela');
assert.equal(W.compute(s,D).pending,1);
E.advance(s,D,()=>0.99);
assert.equal(s.tick,1);
assert.equal(row.status,'planned','reserva futura permanece válida no início do turno');
assert.equal(p.status,'open','agendar não executa automaticamente');
assert.equal(m.assigned,null);
const sched=W.compute(s,D),today=sched.rows.find(r=>r.id===row.id);
assert.equal(today.kind,'preventive');
assert.equal(today.canStart,true,'reserva pode ser iniciada manualmente');
assert.equal(E.assignPreventiveOrder(s,D,p.id,m.id,0),null);
assert.equal(row.status,'fulfilled');
assert.equal(p.status,'in_progress');
assert.equal(m.assigned,p.id);
assert.ok(s.decisionHistory.some(x=>x.type==='schedule_fulfilled'&&x.orderId===p.id));
E.advance(s,D,()=>0.99);
assert.equal(p.status,'completed');
assert.equal(s.cash,cash-p.cost,'custo debitado apenas no turno de execução');
assert.equal(s.preventiveJobs.filter(x=>x.orderId===p.id&&x.status==='completed').length,1);
assert.equal(E.validate(JSON.parse(JSON.stringify(s))),true);
// Reserva que vence sem alocação deve ficar não realizada, mantendo a OS na carteira.
const late=make(),lp=take(late),lm=late.team[0];
assert.equal(E.schedulePreventiveOrder(late,D,lp.id,lm.id,0,late.tick+1),null);
const failed=late.scheduleEntries.find(r=>r.orderId===lp.id);
E.advance(late,D,()=>0.99);
assert.equal(failed.status,'planned');
E.advance(late,D,()=>0.99);
assert.equal(failed.status,'missed');
assert.equal(lp.status,'open');
assert.equal(lm.assigned,null);
assert.ok(late.decisionHistory.some(x=>x.type==='schedule_missed'&&x.orderId===lp.id));
// Cancelamento libera recurso e permite nova programação.
const cancel=make(),cp=take(cancel);
assert.equal(E.schedulePreventiveOrder(cancel,D,cp.id,cancel.team[0].id,0,cancel.tick+2),null);
const rid=cancel.scheduleEntries[0].id;
assert.equal(E.cancelSchedule(cancel,rid),null);
assert.equal(cancel.scheduleEntries[0].status,'cancelled');
assert.equal(cp.status,'open');
assert.equal(E.schedulePreventiveOrder(cancel,D,cp.id,cancel.team[1].id,1,cancel.tick+3),null);
// Validações conservam compatibilidade com OS/agenda de campanhas antigas.
const legacy=make();delete legacy.scheduleEntries;delete legacy.nextSchedule;
W.compute(legacy,D);
assert.equal(E.validate(legacy),true);
const empty=make(),ep=take(empty);empty.cash=0;
assert.equal(E.schedulePreventiveOrder(empty,D,ep.id,empty.team[0].id,0,empty.tick+1),null,
 'calendário futuro não movimenta caixa e revalida no início');
E.advance(empty,D,()=>0.99);
assert.equal(W.compute(empty,D).rows.find(x=>x.orderId===ep.id).canStart,false);
const oldSchedule=make(),oc=oldSchedule.jobs[0],sc=E.scenario(D,oc.scene);
oldSchedule.tools[sc.tool]=true;
assert.equal(E.scheduleJob(oldSchedule,D,oc.id,oldSchedule.team[0].id,0,oldSchedule.tick+1),null);
assert.equal(oldSchedule.scheduleEntries[0].kind,undefined,'calendário CM legado intacto');
const ui=fs.readFileSync('phaser-play/game.js','utf8'),
 html=fs.readFileSync('phaser-play/index.html','utf8'),
 sw=fs.readFileSync('sw.js','utf8');
assert.ok(ui.includes('E.schedulePreventiveOrder('));
assert.ok(ui.includes("booking.kind==='preventive'"));
assert.ok(ui.includes("opt.action==='schedule_pm'"));
assert.ok(sw.includes('preventive0922')&&sw.includes("'./phaser-play/weekly-schedule.js'"));
assert.ok(html.includes('game.js?v=0.9.22-c19'));
console.log('OK Ciclo 19: PM futura, agenda compartilhada, execução manual, atraso, cancelamento, custo e saves.');
