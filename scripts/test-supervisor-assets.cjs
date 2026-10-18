/* Registro visual de supervisores reservados, sem efeitos no motor de manutenção. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'phaser-play/assets/characters/supervisors');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.library,'future-supervisors');
assert.equal(manifest.status,'registered-not-integrated');
assert.deepEqual(manifest.characters.map(c=>c.id),['major','duarte']);
assert.deepEqual(manifest.characters.map(c=>c.displayName),['Major','Duarte']);
assert.deepEqual(manifest.grid,{columns:2,rows:2,width:1160,height:1244,frameWidth:580,frameHeight:622,indexOrder:'row-major',groundOffsetPx:12});
for(const c of manifest.characters){
 assert.equal(c.role,'supervisor');
 assert.equal(c.activeRoster,false);
 assert.equal(c.availableForHire,false);
 assert.equal(c.spriteSheet.file,c.id+'-4poses.webp');
 assert.equal(c.original.file,c.id+'-original.png');
 assert.equal(c.processing.connectedObjects,4);
 assert.equal(c.processing.footMarginPx,12);
 assert.ok(c.processing.sourceImageUnmodified);
 for(const entry of [c.spriteSheet,c.original]){
  const blob=fs.readFileSync(path.join(dir,entry.file));
  assert.equal(blob.length,entry.bytes,entry.file+' bytes');
  assert.equal(crypto.createHash('sha256').update(blob).digest('hex'),entry.sha256,entry.file+' hash');
 }
 const bytes=fs.readFileSync(path.join(dir,c.spriteSheet.file));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.toString('ascii',12,16),'VP8L'); // lossless with alpha
 assert.equal(bytes[20],0x2f,'VP8L header');
 const b=bytes.subarray(21,25);
 const width=1+(b[0]|((b[1]&0x3f)<<8));
 const height=1+((b[1]>>6)|(b[2]<<2)|((b[3]&0x0f)<<10));
 assert.deepEqual([width,height],[1160,1244]);
 assert.ok(b[3]&0x10,'pixel alpha supported');
 const png=fs.readFileSync(path.join(dir,c.original.file));
 assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(png.readUInt32BE(16),c.original.width);
 assert.equal(png.readUInt32BE(20),c.original.height);
 assert.equal(c.spriteSheet.frames.length,4);
 for(const [i,frame] of c.spriteSheet.frames.entries()){
  assert.equal(frame.index,i);
  assert.equal(frame.row,Math.floor(i/2));
  assert.equal(frame.column,i%2);
  assert.match(frame.pose,/^[a-z]+(?:_[a-z]+)*$/);
  const [left,top,right,bottom]=frame.frameOpaqueBounds;
  assert.ok(left>0&&right<580&&top>=0&&bottom<=610,'sprite entirely inside own cell');
  assert.ok(frame.marginBottomPx>=12&&frame.marginBottomPx<=18,'no floating or clipped feet');
 }
}
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const engine=fs.readFileSync(path.join(root,'engine.js'),'utf8');
assert.ok(!game.includes('worker_major')&&!game.includes('worker_duarte'),'no sprite loading in game scene');
assert.ok(!engine.includes("sprite:'major'")&&!engine.includes("sprite:'duarte'"),'not in initial roster/recruit pool');
const fresh=E.create(data,()=>0.42);
assert.deepEqual(fresh.team.map(m=>m.name),['Pedro','Geovane','Junior']);
const gallery=fs.readFileSync(path.join(dir,'index.html'),'utf8');
assert.ok(gallery.includes("fetch('./manifest.json'"));
assert.ok(gallery.includes('background-size:200% 200%'));
assert.ok(fs.readFileSync(path.join(dir,'README.md'),'utf8').includes('Major'));
console.log('OK: Major e Duarte, 2 PNG originais, 2 WebP sem perdas, 8 poses e nenhuma alteração operacional.');
