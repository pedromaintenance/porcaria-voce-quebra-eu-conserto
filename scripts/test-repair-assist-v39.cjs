'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const E=require('../engine.js'),A=require('../phaser-play/repair-assist.js'),D=require('../game-data.json');
function setup(){
 const s=E.create(D,()=>.42),j=s.jobs[0],sc=D.scenarios.find(x=>x.id==='INC040');
 assert.ok(sc&&E.sapEligible(D,sc),'cenário pino D9 mapeado no SAP');
 j.scene=sc.id;j.modelId=sc.modelId;j.asset='EQ07·06';
 j.stage=6;j.diagRemaining=0;j.repairTarget=220;j.repairRemaining=220;
 const m=s.team[0];m.physical=100;m.mental=100;
 s.stock[sc.material]=10;s.tools[sc.tool]=true;
 assert.equal(E.attach(s,j.id,m.id,0,false),null);
 return {s,j,m,sc};
}
{
 const {s,j,sc}=setup();
 assert.equal(A.availability(s,D,E,j.id).available,true);
 assert.equal(A.availability(s,D,E,j.id,'bolt').supported,false);
 assert.equal(A.start(s,D,E,j.id).ok,true);
 assert.ok(A.start(s,D,E,j.id).error,'uma tentativa por turno');
 assert.ok(A.finish(s,E,j.id,4).error,'pontuação inválida');
 const snap=JSON.parse(JSON.stringify(s));
 assert.ok(E.validate(snap),'save legado válido');
 assert.ok(A.start(snap,D,E,j.id).error,'reload não reseta tentativa');
 assert.equal(A.finish(s,E,j.id,3).ok,true);
 assert.ok(A.finish(s,E,j.id,3).error,'resultado consumido uma vez');
 assert.equal(A.bonus(j,s.tick,j.assigned).speed,.12);
 assert.equal(A.bonus(j,s.tick+1,j.assigned),null);
 assert.equal(s.stock[sc.material],10,'sem consumo antecipado de peça');
}
{
 const base=setup(),boost=setup();
 assert.equal(A.start(boost.s,D,E,boost.j.id).ok,true);
 assert.equal(A.finish(boost.s,E,boost.j.id,3).ok,true);
 E.advance(base.s,D,()=>0);
 E.advance(boost.s,D,()=>0);
 assert.equal(boost.j.repairAssist.status,'consumed');
 assert.equal(boost.m.physicalShift.workedHH,base.m.physicalShift.workedHH,'HH conservadas');
 assert.ok(boost.j.repairRemaining<base.j.repairRemaining,'maior progresso por HH');
 assert.ok(boost.m.physical>base.m.physical&&boost.m.physical<100,'desgaste menor sem regeneração');
 assert.equal(A.bonus(boost.j,boost.s.tick,boost.m.id),null);
 assert.equal(A.availability(boost.s,D,E,boost.j.id).available,true,'próximo turno habilitado');
}
{
 const {s,j,sc}=setup();
 assert.equal(A.start(s,D,E,j.id).ok,true);
 E.advance(s,D,()=>0);
 assert.equal(A.bonus(j,s.tick,s.team[0].id),null,'abandono não concede bônus');
 const blocked=setup();
 blocked.s.tools[sc.tool]=false;
 assert.match(A.availability(blocked.s,D,E,blocked.j.id).reason,/Ferramenta/);
 assert.ok(A.start(blocked.s,D,E,blocked.j.id).error);
 assert.equal(blocked.s.repairAssistTurn,undefined);
 blocked.s.tools[sc.tool]=true;blocked.s.stock[sc.material]=0;
 assert.match(A.availability(blocked.s,D,E,blocked.j.id).reason,/Material/);
}
{
 const {s,j}=setup();
 assert.equal(A.start(s,D,E,j.id).ok,true);
 assert.equal(A.finish(s,E,j.id,0).ok,true);
 assert.equal(A.bonus(j,s.tick,j.assigned),null,'sem recompensa por falha');
}
const html=fs.readFileSync('phaser-play/index.html','utf8');
const game=fs.readFileSync('phaser-play/game.js','utf8');
const quick=fs.readFileSync('phaser-play/order-quick.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(html.includes('id="repairAssistOverlay"')&&html.includes('repair-minigames.js?v='));
assert.ok(game.includes('startRepairAssist(')&&game.includes('REPAIR.start(state,data,E,id'));
assert.ok(quick.includes('data-repair-assist-start'));
assert.ok(sw.includes("'./phaser-play/repair-assist.js'"));
console.log('OK Ciclo 39/40: elegibilidade, idempotência, cache, HH, fadiga e avanço de reparo.');
