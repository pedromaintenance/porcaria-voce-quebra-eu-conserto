/* Bia v0.8.15: asset-only training prototype. No training gameplay is active. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const base=path.join(root,'phaser-play/assets/characters/bia');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
const E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.characterId,'bia');
assert.equal(manifest.activeRoster,false,'Bia não pertence à equipe inicial');
assert.equal(manifest.status,'reserved-for-future-training-ui');
assert.equal(manifest.atlases.length,4);
assert.deepEqual(manifest.sheetGrid,{columns:2,rows:2,width:1160,height:1244,frameWidth:580,frameHeight:622,indexOrder:'row-major; 0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right',groundOffsetPx:12});
const expected=new Map([
 ['feedback',{sha:'0fc4202e7093374536e1714f34167c1847764db0bc0a40c7f49c3586df021e4e',size:248788}],
 ['inspection',{sha:'69100bdf99c0b1cbecdddbceb64f8ca4f0d8109602e3a5dd89fc6414811f1009',size:247284}],
 ['field',{sha:'f9af54e86ef4223a8566fe9cbfb7742c84cdce9f826b62f292c5afae85d26a99',size:224604}],
 ['coaching',{sha:'e420ea6b416d0f2a5037a95dc3068faf91dd7f4480377a8e515a14b596389b85',size:240912}]
]);
let count=0;
for(const atlas of manifest.atlases){
 const exp=expected.get(atlas.id);assert.ok(exp,'coleção cadastrada');
 assert.equal(atlas.file,'bia-'+atlas.id+'-4poses.webp');
 const bytes=fs.readFileSync(path.join(base,atlas.file));
 assert.equal(bytes.length,exp.size,atlas.id+' arquivo completo');
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 assert.equal(hash,exp.sha);assert.equal(hash,atlas.sha256);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.toString('ascii',12,16),'VP8X');
 assert.ok((bytes[20]&0x10)!==0,'WEBP alpha exigido');
 assert.equal(1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16),1160);
 assert.equal(1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16),1244);
 assert.equal(atlas.frames.length,4);
 assert.equal(new Set(atlas.frames.map(f=>f.pose)).size,4,'IDs de poses distintos');
 atlas.frames.forEach((frame,index)=>{
  assert.equal(frame.index,index);
  assert.equal(frame.row,Math.trunc(index/2));
  assert.equal(frame.column,index%2);
  assert.match(frame.pose,/^[a-z]+(?:_[a-z]+)*$/);
  count++;
 });
}
assert.equal(count,16,'16 quadros acessíveis por metadado');
// Derivado do MESMO atlas field: corrige o topo do capacete sem apagar o original.
const repaired=manifest.derivedAtlases?.find(x=>x.id==='field-repaired');
assert.ok(repaired,'sprite sheet corrigido registrado no manifesto');
assert.equal(repaired.sourceAtlas,'bia-field-4poses.webp');
assert.equal(repaired.file,'bia-field-repaired-4poses.webp');
assert.deepEqual(repaired.dimensions,{width:1160,height:1244,frameWidth:580,frameHeight:622});
const repairedBytes=fs.readFileSync(path.join(base,repaired.file));
assert.equal(repairedBytes.length,786602);
assert.equal(crypto.createHash('sha256').update(repairedBytes).digest('hex'),'0df565e155bea199facfd3c6a0032c2afba7cfcba59ad9d057c282cff877c538');
assert.equal(repaired.sha256,'0df565e155bea199facfd3c6a0032c2afba7cfcba59ad9d057c282cff877c538');
assert.equal(repairedBytes.toString('ascii',0,4),'RIFF');
assert.equal(repairedBytes.toString('ascii',8,12),'WEBP');
// Pillow exporta lossless WebP com chunk VP8L, diferente dos VP8X lossy originais.
assert.equal(repairedBytes.toString('ascii',12,16),'VP8L','WebP lossless preserva a arte original');
assert.equal(repairedBytes[20],0x2f,'assinatura do bitstream VP8L');
const width=1+repairedBytes[21]+((repairedBytes[22]&0x3f)<<8);
const height=1+(repairedBytes[22]>>6)+(repairedBytes[23]<<2)+((repairedBytes[24]&0x0f)<<10);
assert.equal(width,1160);assert.equal(height,1244);
assert.ok((repairedBytes[24]&0x10)!==0,'canal alfa VP8L presente');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(sw.includes('./phaser-play/assets/characters/bia/bia-field-repaired-4poses.webp'),'PWA guarda sprite corrigido');

const preview=fs.readFileSync(path.join(base,'index.html'),'utf8');
const design=fs.readFileSync(path.join(root,'phaser-play','TRAINING_DESIGN.md'),'utf8');
const game=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
assert.ok(preview.includes("fetch('./manifest.json'"));
assert.ok(preview.includes('background-size:200% 200%'));
assert.ok(preview.includes('personagem')||preview.includes('sprites'));
assert.ok(!game.includes('bia-')&&!game.includes('WORKER_SHEETS.bia'),'sem preload de Bia durante as partidas');
assert.ok(!E.create(data,()=>0.42).team.some(m=>m.name==='Bia'),'Bia não contratável');
assert.equal(data.models.length,9);
for(const code of ['EQ01','EQ02','EQ03','EQ04','EQ05','EQ06','EQ07','EQ08','EQ09'])assert.ok(data.models.some(m=>m.id===code));
for(const term of ['diagnóstico','reparo','Geovane','gestão','material','segurança','migração','não implementado'])assert.ok(design.toLowerCase().includes(term.toLowerCase()),'documentação: '+term);
console.log('OK: Bia 16 poses, 4 atlas WebP alpha íntegros, preview e projeto técnico sem impacto na equipe/engine.');
