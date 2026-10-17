/* Regressão geométrica da oficina: cenários já recortados versus imagens completas. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const math=require(path.join(root,'phaser-play','layout-math.js'));
const script=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
assert.equal(map.version,'0.8.3');
assert.equal(map.backgroundProfiles.cropped.mode,'preCropped');
assert.equal(map.backgroundProfiles.cropped.bays,'base');
assert.equal(map.backgroundProfiles.fullFrame.mode,'fullFrame');
assert.equal(map.backgroundProfiles.fullFrame.bays.length,3);
assert.deepEqual(map.bays.map(x=>x.spriteWorld.x),[427,842,1218],'cenário oficial recortado preserva calibração anterior');
const full=map.backgroundProfiles.fullFrame.bays;
const source=map.backgroundProfiles.fullFrame.sourceReference;
assert.equal(source.width,1976);
assert.equal(source.height,796);
assert.deepEqual(full.map(x=>x.spriteWorld.x),[568,852,1104],'bases dos sprites foram recalibradas dentro de cada envelope lateral');
assert.deepEqual(full.map(x=>x.placementWorld.groundY),[408,408,408],'linha vermelha de apoio: todos os boxes no mesmo plano');
assert.deepEqual(full.map(x=>x.progressWorld.y),[441,441,441],'HUDs de diagnóstico posicionados na faixa azul inferior');
assert.deepEqual(full.map(x=>x.footerWorld.y),[470,470,470],'rodapé da OS abaixo do HUD de progresso');
assert.deepEqual(full.map(x=>x.placementWorld.x),[450,738,1003],'limites verdes esquerda convertidos da imagem para mundo Phaser');
assert.deepEqual(full.map(x=>x.placementWorld.width),[228,228,202],'larguras verdes calibradas sem usar seus tetos');
for(const [label,bays] of [['cropped',map.bays],['fullFrame',full]]){
 assert.equal(bays.length,3);
 for(let i=0;i<3;i++){
  const b=bays[i],hit=b.hitWorld;
  assert.ok(hit.x>=map.viewport.worldScrollX);
  assert.ok(hit.y>=map.viewport.worldScrollY);
  assert.ok(hit.x+hit.width<=map.viewport.worldScrollX+map.viewport.width);
  assert.ok(hit.y+hit.height<=map.viewport.worldScrollY+map.viewport.height);
  assert.ok(b.progressWorld.x>=hit.x&&b.progressWorld.x+b.progressWorld.width<=hit.x+hit.width,'progress is inside physical bay');
  assert.equal(b.spriteWorld.y,b.spriteWorld.groundY,'machine on floor');
  assert.ok(b.placementWorld&&b.placementWorld.width>0,'placementWorld separado de hitWorld');
  assert.equal(b.spriteWorld.groundY,b.placementWorld.groundY,'linha do piso governa o sprite');
  assert.ok(b.workerWorld.every(w=>w.y===b.spriteWorld.groundY),'workers on same floor');
  assert.ok(b.workerWorld[0].x<b.spriteWorld.x&&b.workerWorld[1].x>b.spriteWorld.x,'worker flanks unchanged');
  for(let k=i+1;k<3;k++){
   const other=bays[k].hitWorld;
   assert.ok(hit.x+hit.width<=other.x||other.x+other.width<=hit.x,label+' bays must not overlap pointer zones');
  }
 }
}
for(const bay of full){
 // Diagnostic card is 48 world px tall: p.y-31 ... p.y+17.
 const diag=bay.progressWorld,foot=bay.footerWorld,place=bay.placementWorld,sign=bay.signageWorld;
 assert.ok(diag.y-31>sign.y+sign.height+8,'diagnostic HUD never obscures BOX identification');
 assert.ok(diag.y-31>place.groundY,'blue diagnosis strip starts below red contact line');
 assert.ok(diag.y+17<foot.y,'lower OS badge starts after diagnosis HUD');
 assert.ok(foot.y>place.groundY&&foot.y<map.viewport.worldScrollY+map.viewport.height,'footer inside viewport');
 assert.ok(diag.x>=place.x&&diag.x+diag.width<=place.x+place.width,'diagnostic width respects green side limits');
 assert.ok(foot.x>=map.viewport.worldScrollX&&foot.x+foot.width<=map.viewport.worldScrollX+map.viewport.width,'footer within viewport');
 for(const [modelId,dimensions] of Object.entries({
  EQ01:[650,560],EQ02:[540,540],EQ03:[540,500],EQ04:[540,500],EQ05:[1086,1448],EQ06:[1086,1448]
 })){
  const pres=map.modelPresentation[modelId];
  const sz=math.equipmentSize(dimensions[0],dimensions[1],bay.spriteWorld.scale,pres,bay);
  const p=math.placeMachineInBay(bay.spriteWorld.x,sz.width,bay,pres,3);
  assert.ok(sz.width>0&&sz.height>0,modelId+' positive');
  assert.ok(p.fullyFits&&p.contained,modelId+' must fit inside full scene BOX '+(bay.id+1));
  assert.ok(p.x-sz.width/2>=bay.placementWorld.x+2,modelId+' left stays within its placement envelope');
  assert.ok(p.x+sz.width/2<=bay.placementWorld.x+bay.placementWorld.width-2,modelId+' right stays within placement envelope');
  assert.ok(sz.height<=bay.placementWorld.groundY-bay.placementWorld.topY-14,'altura visual usa topo técnico, ignorando o topo do retângulo verde');
  assert.ok(p.footprintX>=bay.placementWorld.x&&p.footprintX<=bay.placementWorld.x+bay.placementWorld.width,'wheel/track anchor fits in green envelope');
 }
 for(const worker of bay.workerWorld){
  const x=math.placeWorkerInBay(worker.x,bay,54,2);
  assert.ok(x-27>=bay.placementWorld.x&&x+27<=bay.placementWorld.x+bay.placementWorld.width,'workers remain inside placement, not wide clickable zone');
 }
}
assert.ok(script.includes('applyBayProfile(profile)'),'switch bay geometry with backdrop');
assert.ok(script.includes('this.bayZones?.forEach(z=>z.destroy())'),'retire old pointer zones before rebuilding');
assert.ok(script.includes('this.bayZones=this.createBayZones()'),'recreate correct clickable zone');
assert.ok(script.includes('const activeBays=this.activeBayLayout||BAY_LAYOUT'),'render with active profile');
assert.ok(script.includes('activeBays.forEach('),'machines, mechanics and progress all share same profile');
assert.ok(script.includes("key==='repoWorkshopBG'?'cropped':'fullFrame'"),'both official day/night use fullFrame, cropped legacy fallback only');
assert.ok(script.includes("scene.setBackdrop(img,'fullFrame')"),'manual full images use complete-image geometry');
assert.ok(script.includes('ctx.drawImage(img,0,0,width,height,0,0,canvas.width,canvas.height)'),'background displayed without legacy hardcoded crop');
assert.ok(!script.includes('if(aspect>2.42'),'remove fragile aspect-ratio decision');
assert.ok(html.includes('game.js?v=0.8.14'),'new JS invalidates cache');
assert.ok(html.includes('layout-math.js?v=0.8.2'),'new geometry module invalidates cache');
assert.ok(script.includes('const footer=b.footerWorld'),'footer layout comes from its own geometry');
assert.ok(script.includes("const ground=placementWorld?.groundY"),'contact shadow uses raised floor');
assert.ok(html.includes('--bay-left:' )===false,'positioning CSS variables are emitted by runtime, not hardcoded per box');
assert.ok(html.includes('var(--bay-left'),'footer CSS uses per-profile geometry variables');
console.log('OK: bottom diagnostic strip, red contact line, green lateral envelopes and independent footers.');
