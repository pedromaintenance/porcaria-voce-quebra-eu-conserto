/* v0.8.25 — habilidades por disciplina, sistema e máquina. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const E=require(path.join(__dirname,'..','engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'..','game-data.json'),'utf8'));
const G=E.SKILL_CATALOG;
const groups=['disciplines','systems','machines'];
assert.deepEqual(E.SKILL_GROUPS,groups);
assert.equal(G.disciplines.length,22);
assert.equal(G.systems.length,25);
assert.deepEqual(G.machines.map(x=>x.id),data.models.map(x=>x.id),'matriz deve abranger todos os 9 modelos da frota');
assert.deepEqual(G.machines.map(x=>x.label),data.models.map(x=>x.title));
for(const group of groups)assert.equal(new Set(G[group].map(i=>i.id)).size,G[group].length,'IDs de habilidades exclusivos em '+group);
assert.ok(G.disciplines.some(x=>x.id==='fluid_mechanics'));
assert.ok(G.disciplines.some(x=>x.id==='thermodynamics'));
for(const id of ['undercarriage','fps','engines','tires','hydraulic_cylinders','hoses','valves','embedded_electronics'])assert.ok(G.systems.some(x=>x.id===id));

const profiles={junior:E.baselineSkills('junior'),geovane:E.baselineSkills('geovane'),pedro:E.baselineSkills('pedro'),acassio:E.baselineSkills('acassio')};
for(const [id,p] of Object.entries(profiles)){
 assert.deepEqual(Object.keys(p),groups,'categorias '+id);
 for(const group of groups){
  assert.deepEqual(Object.keys(p[group]),G[group].map(x=>x.id),'todos os atributos '+id+'/'+group);
  for(const value of Object.values(p[group]))assert.ok(Number.isInteger(value)&&value>=0&&value<=100,'escala 0..100');
 }
}
assert.equal(profiles.junior.disciplines.lubrication,100);
for(const [group,values] of Object.entries(profiles.junior))
 for(const [key,value] of Object.entries(values))assert.equal(value,group==='machines'?70:group==='disciplines'&&key==='lubrication'?100:90);
for(const group of ['disciplines','systems'])
 for(const value of Object.values(profiles.geovane[group]))assert.equal(value,group==='disciplines'?80:90);
for(const [id,v] of Object.entries(profiles.geovane.machines))assert.equal(v,['EQ05','EQ06'].includes(id)?50:100,id);
assert.equal(profiles.pedro.disciplines.lubrication,40);
assert.equal(profiles.pedro.disciplines.materials_mechanics,40);
assert.equal(profiles.pedro.disciplines.electrical,30);
assert.equal(profiles.pedro.disciplines.electronics,40);
assert.equal(profiles.pedro.systems.fps,30);
assert.equal(profiles.pedro.systems.engines,30);
assert.equal(profiles.pedro.systems.tires,60);
assert.equal(profiles.pedro.machines.EQ01,30);
assert.equal(profiles.pedro.machines.EQ02,50);
assert.equal(profiles.pedro.machines.EQ05,40);
assert.equal(profiles.pedro.machines.EQ06,40);
assert.equal(profiles.pedro.machines.EQ03,20);
assert.equal(profiles.pedro.disciplines.thermodynamics,20);
assert.equal(profiles.pedro.systems.hoses,20);
for(const candidate of E.RECRUIT_POOL){
 const x=E.baselineSkills(candidate.sprite),again=E.baselineSkills(candidate.sprite);
 assert.deepEqual(x,again,'habilidades fixas por personagem em saves diferentes');
 for(const group of groups)
  for(const [key,v] of Object.entries(x[group])){
   assert.ok(v>=30&&v<=70,candidate.name+'/'+group+'/'+key+': 30..70');
   if(group==='machines'&&['EQ02','EQ05','EQ06'].includes(key))assert.ok(v<40,'6030/Sandvik <40');
  }
}
assert.notDeepEqual(E.baselineSkills('silva'),E.baselineSkills('santos'),'contratados com perfis distintos');
const state=E.create(data,()=>0.42);
assert.deepEqual(state.team.map(x=>x.name),['Pedro','Geovane','Junior','Acassio']);
for(const member of state.team)assert.deepEqual(member.competencies,E.baselineSkills(member.sprite));
const initial=JSON.stringify(state);
E.normalizeRoster(state);assert.equal(JSON.stringify(state),initial,'novo save idempotente');
const skillBefore=state.team.map(x=>x.skill);
state.cash=100000;state.player.mental=100;
assert.equal(E.hire(state,'costa',()=>0.1),null);
assert.deepEqual(state.team.at(-1).competencies,E.baselineSkills('costa'),'contratação salva perfil');
assert.deepEqual(state.team.slice(0,4).map(x=>x.skill),skillBefore,'skill global da simulação não foi modificado');
const old=E.create(data,()=>0.5);
delete old.team[0].competencies;
old.team[1].competencies={disciplines:{lubrication:73},systems:{tires:12},machines:{EQ05:99},unrecognized:5};
old.team[2].competencies.disciplines.lubrication=100;
const oldJobs=JSON.stringify(old.jobs),oldSkill=old.team.map(x=>x.skill);
const oldIds=old.team.map(x=>x.id);
E.normalizeRoster(old);
assert.equal(JSON.stringify(old.jobs),oldJobs,'nenhuma OS alterada');
assert.deepEqual(old.team.map(x=>x.id),oldIds,'IDs preservados');
assert.deepEqual(old.team.map(x=>x.skill),oldSkill,'skill global preservado');
assert.deepEqual(old.team[0].competencies,E.baselineSkills('pedro'),'migração de save legado');
assert.equal(old.team[1].competencies.disciplines.lubrication,73,'valor existente preservado');
assert.equal(old.team[1].competencies.systems.tires,12);
assert.equal(old.team[1].competencies.machines.EQ05,99);
assert.equal(old.team[1].competencies.disciplines.electrical,80,'lacunas preenchidas com padrão');
const after=JSON.stringify(old);E.normalizeRoster(old);assert.equal(JSON.stringify(old),after,'migração idempotente');
assert.ok(E.validate(old),'versão de save original continua válida');
const ui=fs.readFileSync(path.join(__dirname,'..','phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
assert.ok(ui.includes("function renderSkills(competencies)"));
assert.ok(ui.includes("E.baselineSkills(m.sprite)"));
assert.ok(ui.includes("E.skillsFor(m)"));
assert.ok(ui.includes("Índice geral histórico"));
assert.ok(html.includes('game.js?v=0.8.32'));
assert.ok(html.includes('.abilityGroups')&&html.includes('.abilityTrack'));
assert.ok(sw.includes('porcaria-vqec-20261019-v111'));
console.log('OK: habilidades 22+25+9; perfis Junior/Geovane/Pedro/Acassio; 10 recrutas; UI e saves retrocompatíveis.');
