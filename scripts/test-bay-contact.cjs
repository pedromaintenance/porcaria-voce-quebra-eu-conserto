/* Regressão visual v0.8.12: composição de BOX 3 e contato das sombras em dia/noite. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const math=require(path.join(root,'phaser-play','layout-math.js'));
const game=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const profiles=[['dia-recortado',map.bays],['noite-quadro-completo',map.backgroundProfiles.fullFrame.bays]];
const baselines=[
 {machine:1223,workers:[1102,1345],groundY:448,placementX:987,calibration:0},
 {machine:1109,workers:[1027,1192],groundY:408,placementX:1008,calibration:0}
];
for(let pi=0;pi<profiles.length;pi++){
 const [name,bays]=profiles[pi],b=bays[2],old=baselines[pi];
 assert.deepEqual(bays.map(x=>x.id),[0,1,2],name+' mantém todos os boxes');
 assert.equal(b.spriteWorld.x,old.machine-5,name+' máquina -5');
 assert.deepEqual(b.workerWorld.map(x=>x.x),old.workers.map(x=>x-5),name+' os dois mecânicos -5');
 assert.equal(b.spriteWorld.y,old.groundY,name+' pé da máquina não muda');
 assert.equal(b.spriteWorld.groundY,old.groundY,name+' plano de solo permanece');
 assert.equal(b.placementWorld.groundY,old.groundY,name+' piso não muda');
 assert.ok(b.workerWorld.every(w=>w.y===old.groundY),name+' mecânicos continuam apoiados');
 // Hitboxes e indicadores não devem acompanhar o nudge.
 assert.deepEqual(b.hitWorld,pi===0?{x:980,y:130,width:285,height:356}:{x:996,y:125,width:251,height:359});
 assert.deepEqual(b.progressWorld,pi===0?{x:1006,y:217,width:225}:{x:1011,y:441,width:194});
 assert.deepEqual(b.footerWorld,pi===0?{x:1034,y:470,width:365}:{x:1035,y:470,width:350});
 assert.equal(b.placementWorld.x,old.placementX-(pi===0?0:5),name+' região de placement respeita perfil');
 if(pi===0){
  assert.equal(b.visualCalibrationX,-5,'a calibração compensa o clamp no quadro diurno recortado');
  for(const width of [54,160,230,260]){
   const before=math.calibratedCenter(old.machine,width,map.viewport,0,8);
   const after=math.calibratedCenter(b.spriteWorld.x,width,map.viewport,b.visualCalibrationX,8);
   assert.equal(after-before,-5,'sprite de '+width+'px deslocado de fato');
  }
  for(let wi=0;wi<2;wi++){
   const prev=math.calibratedCenter(old.workers[wi],54,map.viewport,0,8);
   const next=math.calibratedCenter(b.workerWorld[wi].x,54,map.viewport,b.visualCalibrationX,8);
   assert.equal(next-prev,-5,'mecânico '+wi+' acompanha BOX 3');
  }
 }else{
  const previous={...b,spriteWorld:{...b.spriteWorld,x:old.machine},
    placementWorld:{...b.placementWorld,x:old.placementX}};
  // O envelope anterior é transladado, portanto até sprites limitados pela borda se movem.
  for(const [modelId,dimensions] of Object.entries({
   EQ01:[1100,781],EQ02:[540,540],EQ03:[540,500],EQ04:[540,500],EQ05:[1086,1448],EQ06:[1086,1448]})){
   const pres=map.modelPresentation[modelId];
   const sz=math.equipmentSize(dimensions[0],dimensions[1],b.spriteWorld.scale,pres,b);
   const xOld=math.placeMachineInBay(old.machine,sz.width,previous,pres,3).x;
   const p=math.placeMachineInBay(b.spriteWorld.x,sz.width,b,pres,3);
   assert.equal(p.x-xOld,-5,'máquina '+modelId+' efetivamente deslocada no quadro completo');
   assert.ok(p.contained,'máquina '+modelId+' permanece no envelope físico');
  }
  for(let wi=0;wi<2;wi++){
   const oldX=math.placeWorkerInBay(old.workers[wi],previous,54,2);
   const newX=math.placeWorkerInBay(b.workerWorld[wi].x,b,54,2);
   assert.equal(newX-oldX,-5,'mecânico '+wi+' efetivamente deslocado no quadro completo');
  }
 }
}
// Plano do dia e da noite compartilha o mesmo algoritmo de sombra e seu ponto X vem da máquina já clampada.
assert.ok(game.includes('const ground=placementWorld?.groundY??spriteWorld.groundY??(workerWorld[0].y-2)'));
assert.ok(game.includes('const shadowMainY=ground-3'));
assert.ok(game.includes('const shadowSoftY=ground-1'));
assert.ok(game.includes('shadow.fillEllipse(machineX,shadowMainY,'));
assert.ok(game.includes('shadow.fillEllipse(machineX,shadowSoftY,'));
assert.ok(!game.includes('shadow.fillEllipse(machineX,ground+2,'));
assert.ok(game.includes("const machineX=machineNode?.type==='Image'?machineNode.x:"));
assert.ok(game.includes('const activeBays=this.activeBayLayout||BAY_LAYOUT'));
assert.ok(game.includes("this.setBackdrop(img,key==='repoWorkshopBG'?'cropped':'fullFrame')"),'o dia e a noite usam fullFrame, mantendo fallback cropped');
assert.deepEqual(map.bays.slice(0,2).map(b=>b.spriteWorld.x),[427,842]);
assert.deepEqual(map.backgroundProfiles.fullFrame.bays.slice(0,2).map(b=>b.spriteWorld.x),[568,852]);
assert.ok(html.includes('game.js?v=0.9.4'),'script versionado');
assert.ok(sw.includes('porcaria-vqec-20261019-v111'),'cache PWA invalidado');
console.log('OK: BOX 3 -5 px real nos perfis de dia e noite, HUD/hitboxes intactos e sombras 3/1 px acima.');
