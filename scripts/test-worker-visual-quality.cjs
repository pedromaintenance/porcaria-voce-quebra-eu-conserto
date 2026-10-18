/* Regressão de qualidade e deslocamento do trabalhador BOX 2. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play/scene-map.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'phaser-play/assets/characters/recruits-0820.json'),'utf8'));
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
assert.equal(manifest.quality,'WebP lossless');
assert.equal(manifest.workerRenderFilter,'LINEAR');
assert.equal(Object.keys(manifest.assets).length,6);
for(const [kind,bays] of [['recortado',map.bays],['diurno/noturno',map.backgroundProfiles.fullFrame.bays]]){
 assert.deepEqual(bays.map(b=>b.workerOffsetX),[0,-5,0],kind+' deve mover só Box 2');
 assert.equal(bays[1].workerWorld[0].x+(bays[1].workerOffsetX||0),kind==='recortado'?714:753);
 for(const b of bays)assert.equal(b.workerOffsetX,b.id===1?-5:0);
}
const start=game.indexOf(' worker(x,y,mechanic,'),end=game.indexOf(' refresh(){',start);
assert.ok(start>=0&&end>start);
const worker=game.slice(start,end);
assert.ok(worker.includes('x+=Number(bay?.workerOffsetX)||0'));
assert.ok(worker.includes('this.textures.get(texture).setFilter(Phaser.Textures.FilterMode.LINEAR)'));
assert.ok(!worker.includes('Phaser.Textures.FilterMode.NEAREST'));
assert.ok(worker.includes('actor.setScale(Math.min(54/WORKER_FRAME.width,64/WORKER_FRAME.height))'));
const machines=game.slice(game.indexOf(' machine(x,y,modelId,'),start);
assert.ok(!machines.includes('workerOffsetX'));
console.log('OK: WebP lossless, filtro LINEAR, -5 px somente mecânicos BOX 2 em ambos os perfis.');
