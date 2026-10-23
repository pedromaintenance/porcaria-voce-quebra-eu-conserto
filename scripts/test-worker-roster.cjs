/* Lotação aberta: cinco titulares, dez nomes únicos e mecânicos avulsos. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const names=['Costa','Silva','Santos','Moura','Barbosa','Garcia','Braga','Almeida','Sousa','Pereira'];
const keys=names.map(x=>x.toLowerCase());
const s=E.create(data,()=>0.42);
assert.deepEqual(s.team.map(m=>m.name),['Pedro','Geovane','Junior','Acassio','Nemuel']);
assert.deepEqual(s.team.map(m=>m.id),['M1','M2','M3','M4','M5']);
assert.equal(s.nextPerson,6);assert.equal(E.MAX_TEAM,undefined,'não há teto de lotação');
assert.deepEqual(E.availableRecruits(s).map(m=>m.name),[...names,'Mecânico avulso']);
assert.equal(s.team[2].trainingSprite,'junior-training');
const initial=JSON.stringify(s);E.normalizeRoster(s);assert.equal(JSON.stringify(s),initial);
assert.ok(E.hire(s,undefined,()=>0.4),'proíbe contratação sem seleção');
s.cash=100000;
for(const [i,key] of keys.entries()){
 s.player.mental=100;
 assert.equal(E.hire(s,key,()=>0.4),null,key+' foi contratado');
 const hired=s.team.at(-1);
 assert.deepEqual([hired.name,hired.sprite,hired.id],[names[i],key,'M'+(i+6)]);
 assert.ok(E.hire(s,key,()=>0.4),'não contratar o mesmo duas vezes');
}
assert.equal(s.team.length,15);assert.deepEqual(E.availableRecruits(s).map(m=>m.name),['Mecânico avulso']);
for(let i=0;i<15;i++){
 s.player.mental=100;
 assert.equal(E.hire(s,'generic',()=>0.4),null,'contratação avulsa sem teto');
 const m=s.team.at(-1);assert.equal(m.id,'M'+(16+i));assert.equal(m.name,'Mecânico '+m.id);assert.equal(m.sprite,null);
 assert.deepEqual(m.competencies,E.baselineSkills(m.name));
}
assert.equal(s.team.length,30);
assert.deepEqual(E.availableRecruits(s).map(m=>m.name),['Mecânico avulso']);
assert.ok(E.hire(s,'desconhecido',()=>0.4));assert.ok(E.validate(s));
const legacy=E.create(data,()=>0.4),j=legacy.jobs[0];
legacy.team=[
 {id:'M1',name:'Costa',sprite:'costa',role:'eletrica',skill:96,mental:80,physical:82,morale:80,assigned:j.id},
 {id:'M2',name:'Pedro',sprite:'pedro',role:'geral',skill:88,mental:80,physical:82,morale:80,assigned:null},
 {id:'M3',name:'Geovane',sprite:'geovane',role:'geral',skill:75,mental:80,physical:82,morale:80,assigned:null},
 {id:'M7',name:'Mecânico',sprite:null,role:'rodante',skill:77,mental:80,physical:82,morale:80,assigned:null}
];
legacy.nextPerson=8;j.assigned='M1';j.bay=0;
const beforeJobs=JSON.stringify(legacy.jobs);E.normalizeRoster(legacy);
assert.equal(JSON.stringify(legacy.jobs),beforeJobs,'nenhuma OS antiga perdida');
assert.equal(legacy.team.length,5,'migrar apenas Nemuel para saves antigos');
assert.equal(legacy.team[4].name,'Nemuel');
assert.equal(legacy.team[4].id,'M8','próximo ID livre preserva personagens existentes');
assert.equal(legacy.team[0].skill,96);
assert.equal(legacy.team[3].name,'Mecânico','contratado genérico legado preservado');
assert.equal(legacy.nextPerson,9);
const before=JSON.stringify(legacy);E.normalizeRoster(legacy);assert.equal(JSON.stringify(legacy),before);
legacy.cash=100000;legacy.player.mental=100;assert.equal(E.hire(legacy,'barbosa',()=>0.5),null);
assert.equal(legacy.team.at(-1).id,'M9','não reutilizar ID da campanha antiga');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const key of [...keys,'pedro','geovane','junior','acassio','nemuel']){
 assert.ok(game.includes(key+':\'./assets/characters/'),'sprite no Phaser: '+key);
 assert.ok(sw.includes(key==='junior'?'junior-work-4poses.webp':key==='pedro'?'pedro-v0829-4poses.png':key==='acassio'?'acassio-4poses.png':key==='nemuel'?'nemuel-inspetor-4poses.webp':key+'-4poses.webp'),'sprite no PWA: '+key);
}
assert.ok(game.includes('E.availableRecruits(state)'));
assert.ok(game.includes('E.hire(state,id)'));
assert.ok(html.includes('game.js?v='));
assert.ok(sw.includes('porcaria-vqec-20261019-v111'));
console.log('OK: contratação nominal, campanha inicial 5, contratações avulsas ilimitadas, saves preservados.');
