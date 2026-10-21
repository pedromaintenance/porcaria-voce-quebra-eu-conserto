/* v0.8.29 — integridade do atlas de Pedro e ausência de regressões de gameplay. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'phaser-play/assets/characters');
const expected=[
 ['pedro-v0829-original.png',1254,1254,1647387,'cd9524e18bb2a2544595168633e1a11d9bf7abf314d24af596ec56f6c4f4fcdf'],
 ['pedro-v0829-4poses.png',1160,1244,1136848,'ba160e74d97ab8a469b26b524049f625f89ff08bf6997a6427efb79b4b637d44']
];
for(const [name,w,h,size,sha] of expected){
 const raw=fs.readFileSync(path.join(dir,name));
 assert.equal(raw.length,size,name+': bytes completos');
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),sha,name+': SHA-256');
 assert.equal(raw.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name+': assinatura PNG');
 assert.equal(raw.toString('ascii',12,16),'IHDR',name+': PNG IHDR');
 assert.equal(raw.readUInt32BE(16),w,name+': largura');
 assert.equal(raw.readUInt32BE(20),h,name+': altura');
 assert.equal(raw[25],6,name+': PNG RGBA (alpha transparente)');
}
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const road=fs.readFileSync(path.join(root,'phaser-play/ROADMAP.md'),'utf8');
const doc=fs.readFileSync(path.join(dir,'PEDRO_ASSET_0829.md'),'utf8');
assert.ok(game.includes("pedro:'./assets/characters/pedro-v0829-4poses.png'"),'Phaser usa novo Pedro');
assert.ok(!game.includes("pedro:'./assets/characters/pedro-4poses.webp'"),'arte antiga não está ativa');
assert.ok(game.includes("const WORKER_FRAME={width:580,height:622,poses:4}"),'frames legados');
assert.ok(game.includes("const WORKER_DISPLAY={width:66,height:80}"),'envelope do personagem inalterado');
assert.ok(game.includes("const WORKER_RENDER_FRAME={width:290,height:311}"),'prefiltragem de alta densidade');
assert.ok(sw.includes('porcaria-vqec-20261019-v111'),'cache novo');
assert.ok(sw.includes('./phaser-play/assets/characters/pedro-v0829-4poses.png'),'PWA inclui novo Pedro');
assert.ok(html.includes('game.js?v=0.9.13'),'bust de cache do Phaser');
assert.ok(road.includes('Entrega 0.8.29'),'roadmap documenta a entrega');
assert.ok(doc.includes('12 px'),'alinhamento vertical rastreável');
console.log('OK: Pedro RGBA 2x2, original preservado, atlas 1160x1244, PWA e gameplay inalterado.');
