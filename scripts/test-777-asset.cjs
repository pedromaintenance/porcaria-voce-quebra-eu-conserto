/* Regressão do sprite 777E: arquivo binário real, formato, transparência e posicionamento. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const asset=path.join(root,'phaser-play','assets','equipment','cat777e_v2.webp');
const oldAsset=path.join(root,'phaser-play','assets','equipment','cat777e.png');
const b=fs.readFileSync(asset);
assert.ok(b.length>0,'arquivo novo vazio');
assert.equal(b.length,339086,'tamanho do arquivo integrado corresponde ao otimizado');
assert.equal(crypto.createHash('sha256').update(b).digest('hex'),
 'c0c304a84f7dad6e26e046877470d609c74148717ea355a2cd0beae0d33be7fd','hash do novo sprite preservado');
assert.equal(b.toString('ascii',0,4),'RIFF','RIFF');
assert.equal(b.toString('ascii',8,12),'WEBP','formato webp');
assert.equal(b.toString('ascii',12,16),'VP8X','formato estendido webp');
assert.ok((b[20]&0x10)!==0,'canal alfa presente: transparência real');
const width=1+b[24]+(b[25]<<8)+(b[26]<<16);
const height=1+b[27]+(b[28]<<8)+(b[29]<<16);
assert.deepEqual([width,height],[1100,781],'dimensões do sprite otimizado');
assert.ok(fs.existsSync(oldAsset),'sprite antigo preservado como backup');
assert.ok(fs.existsSync(path.join(root,'phaser-play','assets','equipment','CAT777E_ASSET.md')),'manifesto versionado');
const game=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
assert.ok(game.includes("truck:'./assets/equipment/cat777e_v2.webp'"),'777E renderiza nova arte');
assert.ok(!game.includes("truck:'./assets/equipment/cat777e.png'"),'não usa arte antiga em runtime');
assert.ok(game.includes("modelId==='EQ01' ? Phaser.Textures.FilterMode.LINEAR : Phaser.Textures.FilterMode.NEAREST"),
 'novo 777E reduzido com filtro linear sem alterar demais sprites');
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const math=require(path.join(root,'phaser-play','layout-math.js'));
assert.equal(map.version,'0.8.3');
const model=map.modelPresentation.EQ01;
assert.equal(model.scaleMultiplier,1.10);
assert.equal(model.footprintAnchorX,0.54);
assert.equal(model.texturePath,'assets/equipment/cat777e_v2.webp');
assert.deepEqual(model.sourcePixelSize,{width,height});
for(const bay of map.backgroundProfiles.fullFrame.bays){
 const size=math.equipmentSize(width,height,bay.spriteWorld.scale,model,bay);
 const placed=math.placeMachineInBay(bay.spriteWorld.x,size.width,bay,model,3);
 assert.ok(placed.fullyFits&&placed.contained,'777E fits lateral placement zone of BOX '+(bay.id+1));
 assert.ok(placed.x-size.width/2>=bay.placementWorld.x,'left wheel cannot cross BOX '+(bay.id+1));
 assert.ok(placed.x+size.width/2<=bay.placementWorld.x+bay.placementWorld.width,'dump body cannot cross BOX '+(bay.id+1));
 assert.ok(size.height<=bay.placementWorld.groundY-bay.placementWorld.topY-14,'777E vertical room in BOX '+(bay.id+1));
 assert.ok(placed.footprintX>=bay.placementWorld.x&&placed.footprintX<=bay.placementWorld.x+bay.placementWorld.width,'footprint remains in box');
 assert.ok(size.width>100&&size.height>75,'sprite visible in workshop');
}
const html=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
assert.ok(html.includes('game.js?v=0.8.8'),'new rendering code bypasses old cached JS');
console.log('OK: WebP 777E hash, alpha, 1100×781, original retained, camera placement and new render path.');
