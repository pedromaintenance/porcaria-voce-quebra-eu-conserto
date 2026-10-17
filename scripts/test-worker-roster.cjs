/* P.O.R.C.A.R.I.A. 0.8.14 — equipe oficial, sprites 2x2 e contratado sem arte. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const s=E.create(data,()=>0.42);
assert.deepEqual(s.team.map(m=>m.name),['Isaias','Pedro','Geovane'],'somente os três personagens iniciais');
assert.deepEqual(s.team.map(m=>m.specialty),['Eletricista','Brigadista','Instrutor']);
assert.deepEqual(s.team.map(m=>m.sprite),['isaias','pedro','geovane']);
assert.equal(s.team[0].role,'eletrica');
assert.equal(s.team[1].role,'geral');
assert.equal(s.team[2].role,'geral');
assert.equal(s.nextPerson,4);
const before=s.cash;
assert.equal(E.hire(s,()=>0.4),null,'contratação genérica funciona');
assert.equal(s.team.length,4);const hired=s.team[3];
assert.equal(hired.name,'Mecânico');assert.equal(hired.sprite,null);
assert.equal(hired.id,'M4');
assert.equal(before-s.cash,1050);
assert.equal(E.validate(s),true,'mesmo esquema de save anterior');
const after=JSON.stringify(s);E.normalizeRoster(s);
assert.equal(JSON.stringify(s),after,'migração já normalizada é idempotente');
const archived=JSON.parse(JSON.stringify(s));
for(let i=0;i<3;i++){archived.team[i].name=['Lia','Davi','Rita'][i];delete archived.team[i].sprite;delete archived.team[i].specialty}
archived.team[3].name='Nico';delete archived.team[3].sprite;
archived.team[0].skill=91;
const migrated=E.normalizeRoster(archived);
assert.deepEqual(migrated.team.map(m=>m.name),['Isaias','Pedro','Geovane'],'legado ocioso de quatro reduz a três');
assert.equal(migrated.team[0].skill,91,'habilidade pré-existente preservada');
assert.equal(migrated.nextPerson,5,'IDs antigos não reutilizados');
const oldJob=migrated.jobs[0];
const oldM4={id:'M4',name:'Nico',avatar:'🧑🏽‍🏭',role:'rodante',skill:61,mental:88,physical:77,morale:80,assigned:oldJob.id,restAt:null};
migrated.team.push(oldM4);oldJob.assigned='M4';oldJob.bay=0;
E.normalizeRoster(migrated);
assert.equal(migrated.team.length,4,'quarto funcionário designado mantém OS válida');
assert.equal(migrated.team[3].name,'Mecânico');
assert.equal(migrated.team[3].sprite,null);
assert.equal(migrated.team[3].assigned,oldJob.id);
assert.equal(oldJob.assigned,'M4','OS antiga não perde responsável');
const samples={
 isaias:{length:171914,sha:'32b708ae3c33555e26602730644f6848daa49bbd168a51aa6b1e31de9a4edcd2'},
 pedro:{length:165916,sha:'4942108bc9e3d4ab40a086acdcd702cd0ea684f298b2c7c8a242a44b684488ea'},
 geovane:{length:175328,sha:'229f8caddeb6fc332972c94841342424f74da65dcd37479bd51a3524c888470a'}
};
for(const [name,meta] of Object.entries(samples)){
 const f=path.join(root,'phaser-play','assets','characters',name+'-4poses.webp');
 const b=fs.readFileSync(f);
 assert.equal(b.length,meta.length,name+' comprimento integral');
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),meta.sha,name+' hash oficial');
 assert.equal(b.toString('ascii',0,4),'RIFF');
 assert.equal(b.toString('ascii',8,12),'WEBP');
 assert.equal(b.toString('ascii',12,16),'VP8X');
 const width=1+b[24]+(b[25]<<8)+(b[26]<<16);
 const height=1+b[27]+(b[28]<<8)+(b[29]<<16);
 assert.deepEqual([width,height],[1160,1244],'atlas 2×2 com quadros 580×622');
}
const game=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(game.includes('this.load.spritesheet(\'worker_\'+name,url'));
assert.ok(game.includes('frameWidth:WORKER_FRAME.width,frameHeight:WORKER_FRAME.height'));
assert.ok(game.includes('this.add.sprite(x,y,texture,poses[0])'));
assert.ok(game.includes('actor.sprite.setFrame(actor.frames[actor.index])'));
assert.ok(game.includes('const assigned=state.team.find(m=>m.id===j.assigned)'),'box usa profissional realmente alocado');
assert.ok(game.includes('this.worker(w.x,w.y,assigned'),'sem duplicar personagens pelo slot');
assert.ok(!game.includes('worker_lia_idle')&&!game.includes('worker_rafael_idle'),'sprites antigos não usados');
assert.ok(game.includes("return label;"),'Mecânico sem sprite tem etiqueta textual');
assert.ok(game.includes('E.normalizeRoster(state)'),'campanhas existentes migradas');
assert.ok(game.includes('state=E.normalizeRoster(candidate)'),'save importado é migrado');
assert.ok(html.includes('teamPortrait')&&html.includes('game.js?v=0.8.14'));
assert.ok(sw.includes('porcaria-vqec-20261017-v094'));
for(const name of Object.keys(samples))assert.ok(sw.includes(name+'-4poses.webp'));
console.log('OK: equipe 3 nomes, novos Mecânicos sem sprite, saves compatíveis, sprites WebP íntegros e render por OS.');
