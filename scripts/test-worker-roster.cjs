/* P.O.R.C.A.R.I.A. v0.8.16 — equipe de seis, Costa e novos atlas. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const names=['Costa','Pedro','Geovane','Silva','Santos','Moura','Junior'];
const sprites=['costa','pedro','geovane','silva','santos','moura','junior'];
const fresh=E.create(data,()=>0.42);
assert.deepEqual(fresh.team.map(m=>m.name),names,'six approved members available in a new campaign');
assert.deepEqual(fresh.team.map(m=>m.sprite),sprites,'each employee uses matching art');
assert.deepEqual(fresh.team.map(m=>m.id),['M1','M2','M3','M4','M5','M6','M7']);
assert.equal(fresh.nextPerson,8);
assert.equal(fresh.team[6].specialty,'Especialista');
assert.equal(fresh.team[6].trainingSprite,'junior-training');
assert.equal(fresh.team[0].role,'eletrica','Costa retains electrician specialization');
assert.equal(fresh.team[1].specialty,'Brigadista');
assert.equal(fresh.team[2].specialty,'Instrutor');
for(const m of fresh.team.slice(3,6))assert.equal(m.specialty,'Mecânico');
const snap=JSON.stringify(fresh);
E.normalizeRoster(fresh);
assert.equal(JSON.stringify(fresh),snap,'normalization of a new save is idempotent');
const money=fresh.cash;
assert.equal(E.hire(fresh,()=>0.4),null,'hiring remains possible');
assert.equal(fresh.team.length,8);
assert.deepEqual({name:fresh.team[7].name,sprite:fresh.team[7].sprite,id:fresh.team[7].id},{name:'Mecânico',sprite:null,id:'M8'});
assert.equal(fresh.cash,money-1050);
assert.ok(E.validate(fresh));
const old=E.create(data,()=>0.42);
old.team=old.team.slice(0,3);
old.team[0].name='Isaias';old.team[0].sprite='isaias';old.team[0].skill=91;
old.team[1].skill=88;
old.nextPerson=4;
const first=E.normalizeRoster(old);
assert.deepEqual(first.team.map(x=>x.name),names,'legacy save migrates with Costa plus three newcomers');
assert.equal(first.team[0].skill,91,'existing skill preserved');
assert.equal(first.team[1].skill,88,'progress in another legacy member preserved');
assert.equal(first.nextPerson,8);
const saved=JSON.stringify(first);E.normalizeRoster(first);assert.equal(JSON.stringify(first),saved,'migration stable after first pass');
// Previously hired M4 must never be converted to Silva by its numeric ID.
const hiredSave=E.create(data,()=>0.42);
hiredSave.team=hiredSave.team.slice(0,3);
hiredSave.team.push({id:'M4',name:'Mecânico',role:'rodante',specialty:'Mecânico',sprite:null,avatar:'🔧',
 skill:77,mental:90,physical:84,morale:80,assigned:null,restAt:null});
hiredSave.nextPerson=5;
E.normalizeRoster(hiredSave);
const existing=hiredSave.team.find(m=>m.id==='M4');
assert.equal(existing.name,'Mecânico');assert.equal(existing.sprite,null);
assert.equal(existing.role,'rodante','existing contracted specialty preserved');
assert.equal(existing.skill,77);
assert.deepEqual(hiredSave.team.slice(4).map(m=>m.name),['Silva','Santos','Moura','Junior']);
assert.deepEqual(hiredSave.team.slice(4).map(m=>m.id),['M5','M6','M7','M8']);
assert.equal(hiredSave.nextPerson,9);
const assigned=E.create(data,()=>0.42);assigned.team=assigned.team.slice(0,3);
const job=assigned.jobs[0];
assigned.team.push({id:'M4',name:'Nico',role:'motor',avatar:'🧑',assigned:job.id,skill:70,mental:80,physical:80,morale:80});
job.assigned='M4';job.bay=0;assigned.nextPerson=5;
E.normalizeRoster(assigned);
assert.equal(assigned.team.find(m=>m.id==='M4').name,'Mecânico','busy legacy worker preserved');
assert.equal(assigned.team.find(m=>m.id==='M4').assigned,job.id);
assert.equal(job.assigned,'M4');
assert.equal(assigned.team.length,8);
const base=path.join(root,'phaser-play/assets/characters');
const official={
 costa:[171914,'32b708ae3c33555e26602730644f6848daa49bbd168a51aa6b1e31de9a4edcd2'],
 pedro:[165916,'4942108bc9e3d4ab40a086acdcd702cd0ea684f298b2c7c8a242a44b684488ea'],
 geovane:[175328,'229f8caddeb6fc332972c94841342424f74da65dcd37479bd51a3524c888470a'],
 silva:[287544,'26f68b092d14bfb940a7e44577b1d117d14571b27bd69fc0a248124102c849eb'],
 santos:[281232,'48105f1036d2b9693531abb349954f251e1c2d31c4a599e8cdd7ad9c0d5f89ce'],
 moura:[313970,'eba522ff337b6838cd4e2f5f77043c7e410bf32a425d2dd243a143f9b64fd99d'],
 junior:[202152,'a4777757f79ae25f595b5736fb112cc102455452e95969b2a3b64c653303a229']
};
for(const [name,[size,hash]] of Object.entries(official)){
 const b=fs.readFileSync(path.join(base,name==='junior'?'junior/junior-work-4poses.webp':name+'-4poses.webp'));
 assert.equal(b.length,size,name+' integral');
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),hash,name+' approved asset');
 assert.equal(b.toString('ascii',0,4),'RIFF');
 assert.equal(b.toString('ascii',8,12),'WEBP');
 assert.equal(b.toString('ascii',12,16),'VP8X');
 const w=1+b[24]+(b[25]<<8)+(b[26]<<16),h=1+b[27]+(b[28]<<8)+(b[29]<<16);
 assert.deepEqual([w,h],[1160,1244]);
}
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const name of sprites){
 assert.ok(game.includes(name+':\'./assets/characters/'+(name==='junior'?'junior/junior-work-4poses.webp':name+'-4poses.webp')+'\''),'game loading '+name);
 assert.ok(sw.includes(name==='junior'?'junior-work-4poses.webp':name+'-4poses.webp'),'PWA loading '+name);
}
assert.ok(!game.includes("isaias:'"),'outdated worker texture key no longer loaded');
assert.ok(game.includes('const assigned=state.team.find(m=>m.id===j.assigned)'));
assert.ok(game.includes('this.worker(w.x,w.y,assigned'));
assert.ok(game.includes("return label;"),'generic workers stay without sprite');
assert.ok(game.includes('state=E.normalizeRoster(candidate)'));
assert.ok(game.includes('E.normalizeRoster(state)'));
assert.ok(html.includes('game.js?v=0.8.19'));
assert.ok(sw.includes('porcaria-vqec-20261018-v099'));
console.log('OK: 6 approved workers, Costa rename, ID-safe old saves, generic hiring, 6 valid atlases and Phaser/PWA.');
