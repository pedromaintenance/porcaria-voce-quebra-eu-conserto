/* P.O.R.C.A.R.I.A. — Ciclo 41: aperto de fixadores, tempo e fadiga. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const E=require('../engine.js'),A=require('../phaser-play/repair-assist.js'),D=require('../game-data.json');
function make(id='INC001'){
 const s=E.create(D,()=>.42),j=s.jobs[0],c=D.scenarios.find(x=>x.id===id);
 assert.ok(c&&E.sapEligible(D,c),'cenário do piloto validado na base SAP: '+id);
 j.scene=c.id;j.title=c.title;j.modelId=c.modelId;j.asset=c.modelId+'·06';
 j.stage=6;j.diagRemaining=0;j.repairRemaining=220;j.repairTarget=220;
 s.stock[c.material]=20;s.tools[c.tool]=true;
 const m=s.team[0];m.physical=100;m.mental=100;m.morale=100;
 assert.equal(E.attach(s,j.id,m.id,0,false),null);
 return {s,j,m,c};
}
for(const id of ['INC001','INC025','INC086']){
 const {s,j}=make(id);
 assert.equal(A.availability(s,D,E,j.id,'bolt').available,true,'mecânica disponível '+id);
 assert.equal(A.availability(s,D,E,j.id,'hammer').supported,false,'não oferece pino em rolamento');
}
{
 const {s,j}=make();
 assert.equal(A.start(s,D,E,j.id,'bolt').ok,true);
 assert.equal(j.repairAssist.kind,'bolt');
 assert.ok(A.start(s,D,E,j.id,'bolt').error,'não duplicar tentativa');
 assert.ok(A.start(s,D,E,j.id,'hammer').error,'não trocar de atividade no mesmo turno');
 assert.ok(A.finish(s,E,j.id,5).error,'não aceitar mais de quatro acertos');
 assert.equal(A.finish(s,E,j.id,4).ok,true);
 assert.ok(A.finish(s,E,j.id,4).error,'concluir uma vez');
 assert.equal(A.bonus(j,s.tick,j.assigned).speed,.06);
 assert.equal(A.bonus(j,s.tick,j.assigned).fatigue,.12);
 assert.equal(A.bonus(j,s.tick+1,j.assigned),null);
 const copy=JSON.parse(JSON.stringify(s));
 assert.ok(E.validate(copy));
 assert.ok(A.start(copy,D,E,j.id,'bolt').error,'save não permite repetição');
 assert.equal(s.decisionHistory.filter(x=>x.type==='repair_assist_result').length,1);
}
{
 const base=make(),boost=make();
 A.start(boost.s,D,E,boost.j.id,'bolt');
 A.finish(boost.s,E,boost.j.id,4);
 E.advance(base.s,D,()=>0);
 E.advance(boost.s,D,()=>0);
 assert.equal(boost.j.repairAssist.status,'consumed');
 assert.equal(boost.m.physicalShift.workedHH,base.m.physicalShift.workedHH,'10,5 HH continuam contabilizadas');
 assert.ok(boost.j.repairRemaining<base.j.repairRemaining,'progresso de reparo maior');
 assert.ok(boost.m.physical>base.m.physical,'desgaste físico menor');
 assert.ok(boost.m.physical<100,'não gera energia do nada');
 assert.equal(boost.s.decisionHistory.filter(x=>x.type==='repair_assist_applied').length,1,'um consumo');
 assert.equal(A.availability(boost.s,D,E,boost.j.id,'bolt').available,true,'turno seguinte permite outra tentativa');
}
{
 const {s,j,c}=make();
 A.start(s,D,E,j.id,'bolt');
 assert.equal(A.finish(s,E,j.id,0).ok,true,'tentativa falha registrada');
 assert.equal(A.bonus(j,s.tick,j.assigned),null,'não cria benefício com 0 acertos');
 const legacy=make();
 assert.equal(legacy.j.repairAssist,undefined,'saves antigos não exigem migração');
 legacy.s.tools[legacy.c.tool]=false;
 assert.match(A.availability(legacy.s,D,E,legacy.j.id,'bolt').reason,/Ferramenta/);
 legacy.s.tools[legacy.c.tool]=true;legacy.s.stock[legacy.c.material]=0;
 assert.match(A.availability(legacy.s,D,E,legacy.j.id,'bolt').reason,/Material/);
}
const html=fs.readFileSync('phaser-play/index.html','utf8');
const game=fs.readFileSync('phaser-play/game.js','utf8');
const scene=fs.readFileSync('phaser-play/repair-minigames.js','utf8');
const quick=fs.readFileSync('phaser-play/order-quick.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(scene.includes('class BoltTightening')&&scene.includes('launchBolt')&&scene.includes('sequence=[0,3,1,2]'));
assert.ok(scene.includes('launchHammer'),'o piloto de pinos permanece disponível');
assert.ok(html.includes('repair-minigames.js?v=0.9.41-bolt'));
assert.ok(game.includes("MINIGAMES.launch(kind"),'mesmo modal aceita ambos minigames');
assert.ok(game.includes("data-repair-assist-kind"),'o botão encaminha o tipo correto');
assert.ok(quick.includes('APERTAR PARAFUSOS'),'OS rápida expõe novo botão');
assert.ok(sw.includes('bolt-v41'),'PWA atualizado');
console.log('OK Ciclo 41: quatro fixadores, save, compatibilidade com pinos, esforço, HH e bloqueios.');
