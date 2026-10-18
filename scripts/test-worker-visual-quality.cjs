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
const prefilterStart=game.indexOf(' workerRenderTexture(texture){');
const start=game.indexOf(' worker(x,y,mechanic,'),end=game.indexOf(' refresh(){',start);
assert.ok(prefilterStart>=0&&prefilterStart<start);
const prefilter=game.slice(prefilterStart,start);
assert.ok(prefilter.includes("texture+'_prefilter_v0821'"));
assert.ok(prefilter.includes("canvas.width=WORKER_RENDER_FRAME.width*2"));
assert.ok(prefilter.includes("canvas.height=WORKER_RENDER_FRAME.height*2"));
assert.ok(prefilter.includes("ctx.imageSmoothingQuality='high'"));
assert.ok(prefilter.includes("ctx.drawImage(src,(i%2)*WORKER_FRAME.width"));
assert.ok(prefilter.includes("sheet.add(i,0"));
assert.ok(game.includes("const WORKER_RENDER_FRAME={width:290,height:311}"));
assert.ok(start>=0&&end>start);
const worker=game.slice(start,end);
assert.ok(worker.includes('x+=Number(bay?.workerOffsetX)||0'));
assert.ok(worker.includes('const renderKey=this.workerRenderTexture(texture)'));
assert.ok(worker.includes('this.textures.get(renderKey).setFilter(Phaser.Textures.FilterMode.LINEAR)'));
assert.ok(!worker.includes('Phaser.Textures.FilterMode.NEAREST'));
assert.ok(worker.includes('actor.setScale(Math.min(54/frame.width,64/frame.height))'));
assert.ok(worker.includes("const frame=renderKey===texture?WORKER_FRAME:WORKER_RENDER_FRAME"));
const machines=game.slice(game.indexOf(' machine(x,y,modelId,'),start);
assert.ok(!machines.includes('workerOffsetX'));
console.log('OK: prefiltragem individual 2×/LINEAR, tamanho 54×64 preservado e BOX 2 −5 px.');
