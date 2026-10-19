/* v0.8.20: Junior titular e sprite de campo diferente do retrato em Equipe. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),dir=path.join(root,'phaser-play/assets/characters/junior');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const E=require(path.join(root,'engine.js')),data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const fresh=E.create(data,()=>0.42);
assert.deepEqual(fresh.team.map(x=>x.name),['Pedro','Geovane','Junior']);
const junior=fresh.team[2];assert.equal(junior.id,'M3');
assert.equal(junior.role,'geral');assert.equal(junior.specialty,'Especialista');
assert.equal(junior.sprite,'junior');assert.equal(junior.trainingSprite,'junior-training');
const snap=JSON.stringify(fresh);E.normalizeRoster(fresh);assert.equal(JSON.stringify(fresh),snap);
const legacy=E.create(data,()=>0.4),j=legacy.jobs[0];
legacy.team=[
 {id:'M1',name:'Costa',sprite:'costa',role:'eletrica',skill:87,mental:80,physical:80,morale:80,assigned:null},
 {id:'M2',name:'Pedro',sprite:'pedro',role:'geral',skill:87,mental:80,physical:80,morale:80,assigned:null},
 {id:'M3',name:'Geovane',sprite:'geovane',role:'geral',skill:87,mental:80,physical:80,morale:80,assigned:null},
 {id:'M7',name:'Mecânico',sprite:null,role:'rodante',skill:87,mental:80,physical:80,morale:80,assigned:j.id}
];
legacy.nextPerson=8;j.assigned='M7';j.bay=0;
E.normalizeRoster(legacy);
assert.equal(legacy.team.length,4);assert.equal(j.assigned,'M7');
assert.ok(!legacy.team.find(x=>x.name==='Junior'),'não inserir Junior automaticamente em save legado');
assert.equal(manifest.characterId,'junior');assert.equal(manifest.field.purpose,'oficina-OS');
assert.equal(manifest.grid.footMarginPx,12);
assert.ok(manifest.processing.includes('sem invasão de quadros'));
assert.ok(manifest.processing.includes('290×311'));
assert.ok(manifest.training.purpose.includes('treinamento'));
for(const key of ['field','training']){
 const item=manifest[key],bytes=fs.readFileSync(path.join(dir,item.file));
 assert.equal(bytes.length,item.bytes);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.toString('ascii',12,16),'VP8X','cabeçalho WebP estendido para largura, altura e alfa');
 assert.ok((bytes[20]&16)!==0,'alpha');assert.equal(1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16),1160);
 assert.equal(1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16),1244);
 assert.equal(item.frames.length,4);
}
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(game.includes("junior:'./assets/characters/junior/junior-work-4poses.webp'"));
assert.ok(game.includes("const TEAM_PORTRAITS=Object.freeze({junior:'./assets/characters/junior/junior-training-4poses.webp'})"));
assert.ok(html.includes('game.js?v=0.8.27'));
assert.ok(sw.includes('porcaria-vqec-20261018-v106'));
for(const key of ['field','training'])assert.ok(sw.includes(manifest[key].file));
console.log('OK: Junior na equipe inicial, duas identidades visuais e migração segura.');
