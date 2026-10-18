/* P.O.R.C.A.R.I.A. v0.8.20 — CAT D9, CAT 966, CAT 16: assets oficiais e 3 boxes. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const dir=path.join(root,'phaser-play/assets/equipment');
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play/scene-map.json'),'utf8'));
const math=require(path.join(root,'phaser-play/layout-math.js'));
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const models=[
 {id:'EQ07',key:'dozer',file:'catd9-dozer-v0819.webp',sha:'ca914d9882d5b6f7f8548a17152b3170dfa0906f2dc527446785d54255dbc952',bytes:273480,label:'CAT D9'},
 {id:'EQ08',key:'loader',file:'cat966-loader-v0819.webp',sha:'044b425baf37f4836482c5b9cd28824f30b638b0504cde40b27117116d4de700',bytes:231356,label:'CAT 966'},
 {id:'EQ09',key:'grader',file:'cat16-grader-v0819.webp',sha:'dd520eeca708c389235fd2c4707bfd42e99dff567fd79c5d4ecc2d56bb3c35de',bytes:245206,label:'CAT 16'}
];
assert.ok(game.includes("EQ07:'dozer',EQ08:'loader',EQ09:'grader'"),'três equipamentos mapeados explicitamente');
for(const item of models){
 const b=fs.readFileSync(path.join(dir,item.file));
 assert.equal(b.length,item.bytes,item.file+' completo');
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),item.sha,item.file+' hash de produção');
 assert.equal(b.toString('ascii',0,4),'RIFF',item.file);
 assert.equal(b.toString('ascii',8,12),'WEBP',item.file);
 assert.equal(b.toString('ascii',12,16),'VP8X',item.file);
 assert.ok((b[20]&0x10)!==0,item.file+' alpha mantido');
 const width=1+b[24]+(b[25]<<8)+(b[26]<<16),height=1+b[27]+(b[28]<<8)+(b[29]<<16);
 assert.deepEqual([width,height],[1448,1086],item.file+' enquadramento original');
 assert.ok(game.includes(item.key+":'./assets/equipment/"+item.file+"'"),item.id+' carrega a textura certa');
 assert.ok(sw.includes("'./phaser-play/assets/equipment/"+item.file+"'"),item.id+' tem precache PWA');
 const pres=map.modelPresentation[item.id];
 assert.equal(pres.label,item.label);
 assert.equal(pres.texturePath,'assets/equipment/'+item.file);
 assert.equal(pres.publishedAssetSHA256,item.sha);
 assert.deepEqual(pres.sourcePixelSize,{width:1448,height:1086});
 assert.equal(pres.renderFilter,'NEAREST','pixel-art sem suavização');
 for(const bay of map.backgroundProfiles.fullFrame.bays){
   const sz=math.equipmentSize(width,height,bay.spriteWorld.scale,pres,bay);
   const pos=math.placeMachineInBay(bay.spriteWorld.x,sz.width,bay,pres,3);
   assert.ok(sz.width>0&&sz.height>0,item.id+' visível');
   assert.ok(sz.width<=bay.placementWorld.width-6,item.id+' cabe lateralmente no BOX '+(bay.id+1));
   assert.ok(sz.height<=bay.placementWorld.groundY-bay.placementWorld.topY-14,item.id+' cabe verticalmente');
   assert.ok(pos.fullyFits&&pos.contained,item.id+' centralizado no BOX '+(bay.id+1));
   assert.ok(pos.footprintX>=bay.placementWorld.x&&pos.footprintX<=bay.placementWorld.x+bay.placementWorld.width,item.id+' ponto de apoio dentro do box');
 }
}
assert.ok(game.includes('this.trimmedEquipment(key)'),'recorta somente margens transparentes para assentar os pneus/esteiras');
assert.ok(game.includes('const node=this.add.image(visibleX,Math.round(y),renderKey).setOrigin(.5,1)'),'todos assentados pelo piso');
assert.ok(game.includes("const normalKey=MACHINES[modelId]"),'mesmo mecanismo de seleção, sem alterar OS');
assert.ok(game.includes("if(modelId==='EQ07')"),'fallback histórico do trator preservado');
assert.ok(game.includes("EQ05:'dr410i',EQ06:'drill'"),'perfuratrizes intactas');
assert.ok(game.includes("EQ01:'truck',EQ02:'shovel',EQ03:'excavator',EQ04:'excavator'"),'máquinas anteriores intactas');
assert.ok(html.includes('game.js?v=0.8.20'),'versão carregada');
assert.ok(sw.includes('porcaria-vqec-20261018-v100'),'PWA atualizado');
console.log('OK: EQ07 D9, EQ08 966, EQ09 16 — hashes, alpha, dimensões, geometria 3 BOX, mapping, fallback e PWA.');
