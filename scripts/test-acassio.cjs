/* Regressão: Acassio, Instrutor, 19/10/2026; atlas lossless 2×2 e competências explícitas. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const s=E.create(data,()=>.42);
assert.deepEqual(s.team.map(m=>m.name),['Pedro','Geovane','Junior','Acassio']);
assert.deepEqual(s.team.map(m=>m.id),['M1','M2','M3','M4']);
assert.equal(E.MAX_TEAM,undefined);assert.equal(s.nextPerson,5);
const m=s.team[3];assert.equal(m.role,'geral');assert.equal(m.specialty,'Instrutor');assert.equal(m.sprite,'acassio');
const c=m.competencies;
for(const {id} of E.SKILL_CATALOG.machines)
 assert.equal(c.machines[id],['EQ07','EQ08','EQ09'].includes(id)?87:91,id);
const systems={fps:49,engines:91,tires:2,hydraulic_cylinders:89,hoses:89,valves:91,
 embedded_electronics:93,brakes:91,suspension:91,fuel:93,air_intake:93,
 lubrication_system:88,hydraulic_circuit:94,electric_circuit:94,pumps:93,air_conditioning:87};
for(const {id} of E.SKILL_CATALOG.systems)
 assert.equal(c.systems[id],systems[id]??93,'sistema '+id);
for(const {id} of E.SKILL_CATALOG.disciplines)
 assert.equal(c.disciplines[id],['welding','machining'].includes(id)?0:91,'disciplina '+id);
assert.deepEqual(c,E.baselineSkills('acassio'));
const snap=JSON.stringify(s);E.normalizeRoster(s);assert.equal(JSON.stringify(s),snap);
const legacy=E.create(data,()=>.5);legacy.team.splice(3,1);legacy.nextPerson=5;
const oldJobs=JSON.stringify(legacy.jobs),oldIds=legacy.team.map(m=>m.id);
E.normalizeRoster(legacy);
assert.equal(JSON.stringify(legacy.jobs),oldJobs);
assert.deepEqual(legacy.team.map(m=>m.id),oldIds);
assert.ok(!legacy.team.some(m=>m.name==='Acassio'),'saves existentes sem inserção retroativa');
assert.equal(E.availableRecruits(s).length,11,'Acassio não é recrutável; existe contratação avulsa');
const file=path.join(root,'phaser-play/assets/characters/acassio-4poses.png');
assert.ok(fs.existsSync(file),'Asset pendente: publicar acassio-4poses.png no branch antes do merge');
const png=fs.readFileSync(file);
assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16),1160);assert.equal(png.readUInt32BE(20),1244);
assert.equal(png[25],6,'PNG RGBA');
assert.equal(crypto.createHash('sha256').update(png).digest('hex'),
 '3c269e024dada8e9cdd31463fbe1d336bd2b4be856b40e1141dcfbfc101dae08','hash do atlas oficial');
const ui=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(ui.includes("acassio:'./assets/characters/acassio-4poses.png'"));
assert.ok(sw.includes("./phaser-play/assets/characters/acassio-4poses.png"));
console.log('OK: Acassio instrutor M4; habilidades 9+25+22; atlas e saves válidos.');
