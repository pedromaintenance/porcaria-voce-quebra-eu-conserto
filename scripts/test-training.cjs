/* v0.8.26 — regressão de cursos, disponibilidade, migração e UI da Bia. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const E=require(path.join(root,'engine.js'));
const T=E.TRAINING,View=require(path.join(root,'phaser-play/training-view.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const s=E.create(data,()=>.42);
assert.equal(s.training.version,2);
assert.equal(s.training.assignments.length,0);
assert.equal(T.TRAINING_HOURS,12);
const saved=JSON.stringify(s);E.normalizeRoster(s);
assert.equal(JSON.stringify(s),saved,'campanha nova normaliza sem alterações');
assert.ok(!s.team.some(m=>m.name==='Bia'),'Bia não é trabalhadora');
assert.ok(View.render(s,E).includes('Analista Administrativa do Setor de Treinamentos.'));
assert.ok(View.render(s,E).includes('trainingBiaPortrait'));
assert.ok(View.render(s,E).includes('data-training-action="internal"'));

// Contratações novas ficam exatamente 2 turnos indisponíveis.
s.cash=100000;s.player.mental=100;
assert.equal(E.hire(s,'costa',()=>.42),null);
const costa=s.team.find(m=>m.sprite==='costa');
assert.equal(costa.normativeUntil,s.tick+2);
assert.equal(T.active(s,costa),true);
assert.ok(E.attach(s,s.jobs[0].id,costa.id,0,true),'não pode alocar recém-contratado');
assert.ok(E.rest(s,costa.id),'não pode descansar durante integração');
assert.ok(T.internal(s,'M2',costa.id,'disciplines','electrical',E.SKILL_CATALOG),'não pode treinar antes da integração');
assert.ok(s.training.notices.some(n=>n.kind==='onboarding'));
E.advance(s,data,()=>.42);
assert.equal(s.tick,1);
assert.equal(costa.normativeUntil,2);
assert.equal(T.active(s,costa),true);
E.advance(s,data,()=>.42);
assert.equal(s.tick,2);
assert.equal(T.active(s,costa),false);
assert.equal(costa.normativeUntil,null);
assert.ok(s.training.history.some(h=>h.kind==='onboarding'&&h.personId===costa.id));

// Reservar instrutor e aprendiz, com diferença > 30.
const pedro=s.team.find(m=>m.sprite==='pedro'),geovane=s.team.find(m=>m.sprite==='geovane');
const before=pedro.competencies.disciplines.lubrication;
assert.equal(before,40);
const eval1=T.inspectInternal(s,geovane.id,pedro.id,'disciplines','lubrication',E.SKILL_CATALOG);
assert.equal(eval1.gap,40);
assert.equal(eval1.cap,78);
assert.equal(eval1.points,2);
assert.ok(Math.abs(eval1.earned-2.333333)<.00001);
assert.equal(eval1.remainder,.333333);
assert.equal(T.internal(s,geovane.id,pedro.id,'disciplines','lubrication',E.SKILL_CATALOG),null);
assert.ok(T.active(s,geovane)&&T.active(s,pedro));
assert.ok(E.attach(s,s.jobs[0].id,pedro.id,0,true));
assert.ok(E.rest(s,geovane.id));
assert.ok(T.internal(s,costa.id,pedro.id,'disciplines','electrical',E.SKILL_CATALOG));
const cash=s.cash;
E.advance(s,data,()=>.15);
assert.equal(s.cash<=cash,true,'folha operacional pode debitar; aula interna não custa matrícula');
assert.equal(pedro.competencies.disciplines.lubrication,42);
assert.equal(pedro.trainingProgress['disciplines:lubrication'],.333333);
assert.equal(T.active(s,pedro),false);
assert.ok(s.training.history.some(h=>h.kind==='internal'&&h.gain===2&&h.earned>2.33&&h.cost===0));
assert.equal(s.training.assignments.length,0);

// Diferença insuficiente, custo externo, treinamento acima de 90.
assert.ok(T.internal(s,pedro.id,geovane.id,'disciplines','lubrication',E.SKILL_CATALOG));
const current=s.tick;
const ext={id:'ETEST',group:'disciplines',key:'lubrication',title:'Lubrificação',
 cost:850,premium:true,untilTick:current+2};
s.training.offers=[ext];s.cash=2000;
pedro.competencies.disciplines.lubrication=91;
pedro.trainingProgress['disciplines:lubrication']=.65; // crédito anterior preservado entre aulas.
assert.equal(T.external(s,pedro.id,'ETEST',E.SKILL_CATALOG),null);
assert.equal(s.cash,1150);
assert.equal(s.training.offers.some(o=>o.id==='ETEST'),false);
assert.ok(E.attach(s,s.jobs[0].id,pedro.id,0,true));
E.advance(s,data,()=>.15);
assert.equal(pedro.competencies.disciplines.lubrication,92,'crédito garantido desenvolve acima de 90');
assert.equal(pedro.trainingProgress['disciplines:lubrication'],.15);
assert.equal(T.active(s,pedro),false);
assert.ok(s.training.history.some(h=>h.kind==='external'&&h.cost===850));
// Tentativa com teto não pode reservar recursos ou debitar caixa.
s.training.offers=[{id:'LIMIT',group:'disciplines',key:'lubrication',title:'Lubrificação',cost:700,premium:false,untilTick:s.tick+2}];
pedro.competencies.disciplines.lubrication=97;const moneyBefore=s.cash;
assert.ok(T.external(s,pedro.id,'LIMIT',E.SKILL_CATALOG));
assert.equal(s.cash,moneyBefore);
s.training.offers=[];


const about=(A,Tlevel)=>T.projected({competencies:{disciplines:{lubrication:A}}},'disciplines','lubrication',Tlevel,Math.min(95,Tlevel-2),A);
assert.equal(about(30,100).earned,5,'100→30: +5 após 12 horas');
assert.equal(about(40,100).earned,3.5,'100→40: +3,5');
assert.equal(about(50,100).earned,2,'100→50: +2');
assert.equal(about(60,100).earned,1,'100→60: +1');
assert.equal(about(70,100).earned,.5,'100→70: +0,5');
assert.equal(about(80,100).earned,.5,'100→80: +0,5');
assert.equal(about(40,80).earned,2.333333,'80→40: fração proporcional');
assert.ok(about(90,100).earned===.5,'interno pode ultrapassar 90 com instrutor 100');
assert.equal(T.baseGain(30),5);assert.equal(T.baseGain(40),3.5);
assert.equal(T.baseGain(50),2);assert.equal(T.baseGain(60),1);assert.equal(T.baseGain(70),.5);
// Quando ganho é 0,5, duas turmas convertem exatamente 1 ponto, sem sorteio.
const senior={id:'T100',name:'Senior',competencies:{disciplines:{lubrication:100}}};
const novice={id:'T070',name:'Aprendiz',competencies:{disciplines:{lubrication:70}}};
const micro={tick:0,team:[senior,novice],training:null,orders:[]};
assert.equal(T.internal(micro,'T100','T070','disciplines','lubrication',E.SKILL_CATALOG),null);
micro.tick=1;T.afterShift(micro,E.SKILL_CATALOG,()=>.99);
assert.equal(novice.competencies.disciplines.lubrication,70);
assert.equal(T.creditOf(novice,'disciplines','lubrication'),.5);
assert.equal(T.internal(micro,'T100','T070','disciplines','lubrication',E.SKILL_CATALOG),null);
micro.tick=2;T.afterShift(micro,E.SKILL_CATALOG,()=>.99);
assert.equal(novice.competencies.disciplines.lubrication,71);
assert.equal(T.creditOf(novice,'disciplines','lubrication'),0);
assert.ok(micro.training.history.every(h=>h.kind==='internal'&&h.success),'treino não falha nem no primeiro .5');

// Saves anteriores não ganham bloqueio retroativo.
const legacy=E.create(data,()=>.44);legacy.team[0].competencies.disciplines.lubrication=55;
delete legacy.training;for(const m of legacy.team){delete m.normativeUntil;delete m.normativeReason}
const oldJobs=JSON.stringify(legacy.jobs),oldMoney=legacy.cash,oldSkill=legacy.team.map(m=>m.skill);
E.normalizeRoster(legacy);
assert.deepEqual(legacy.team.map(m=>m.skill),oldSkill);
assert.equal(JSON.stringify(legacy.jobs),oldJobs);
assert.equal(legacy.cash,oldMoney);
assert.equal(legacy.team[0].competencies.disciplines.lubrication,55);
assert.ok(legacy.team.every(m=>!T.active(legacy,m)),'não forçar normativa a colaboradores existentes');
assert.ok(legacy.team.every(m=>!m.trainingProgress),'salvos legados não recebem saldos inventados');
const migrated=JSON.stringify(legacy);E.normalizeRoster(legacy);assert.equal(JSON.stringify(legacy),migrated);
assert.equal(E.validate(legacy),true);
const ui=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const plan=fs.readFileSync(path.join(root,'phaser-play/planning.js'),'utf8');
const ready=fs.readFileSync(path.join(root,'phaser-play/readiness.js'),'utf8');
assert.ok(ui.includes('function drawTraining(preserveDom=true)'),'formulário e aba preservados nos redraws');
assert.ok(ui.includes('data-training-action'));
assert.ok(ui.includes('E.TRAINING.active(state'));
assert.ok(html.includes('data-open-panel="training"')&&html.includes('id="trainingPanel"'));
assert.ok(html.includes('training.js?v=0.8.28')&&html.includes('training-view.js?v=0.8.30'));
assert.ok(html.includes('game.js?v=0.8.31')&&html.includes('trainingSticky'));
assert.ok(plan.includes('normativeUntil>state.tick'));
assert.ok(ready.includes('m.training'));
assert.ok(sw.includes('porcaria-vqec-20261019-v110'));
assert.ok(sw.includes("'./training.js'")&&sw.includes("'./phaser-play/training-view.js'"));
console.log('OK: treinamento garantido 12h, curva reduzida, crédito fracionário, cursos pagos, normativos e saves.');
