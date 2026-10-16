/* Testes de regressão sem dependências: node scripts/smoke-phaser.cjs */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const engine=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const state=engine.create(data,()=>0.42);
assert.ok(engine.validate(state),'save inicial válido');
assert.equal(state.jobs.length,3,'iniciar com três OS');
assert.equal(state.team.length,4,'iniciar com quatro profissionais');
assert.equal(map.bays.length,3,'mapeamento contém três boxes');
const zones=map.bays.map(b=>b.hitWorld);
assert.ok(zones.every(z=>z.width>0&&z.height>0),'zonas clicáveis válidas');
assert.ok(zones.every((z,i)=>zones.every((other,j)=>i===j||z.x+z.width<=other.x||other.x+other.width<=z.x)),'boxes não se sobrepõem');
// O asset oficial precisa existir na revisão em execução, não apenas no HTML.
const crypto=require('node:crypto');
const background=path.join(root,'phaser-play',map.background.file.replace(/^\.\//,''));
assert.ok(fs.existsSync(background),'fundo oficial versionado existe');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(background)).digest('hex'),map.background.checksumSHA256,'fundo oficial íntegro');
const crop=map.background.sourceCrop;
assert.ok(crop.x>=0&&crop.y>=0&&crop.x+crop.width<=map.background.sourceWidth&&crop.y+crop.height<=map.background.sourceHeight,'recorte da oficina está dentro da imagem original');
const left=map.viewport.worldScrollX,top=map.viewport.worldScrollY;
for(const bay of map.bays){
 const z=bay.hitWorld;
 assert.ok(z.x>=left&&z.x+z.width<=left+map.viewport.width,'box visível horizontalmente');
 assert.ok(z.y>=top&&z.y+z.height<=top+map.viewport.height,'box visível verticalmente');
 assert.ok(bay.spriteWorld.x>=z.x&&bay.spriteWorld.x<=z.x+z.width,'máquina centralizada no próprio box');
 assert.ok(bay.spriteWorld.y>=z.y&&bay.spriteWorld.y<=z.y+z.height,'máquina sobre piso do box');
 for(const worker of bay.workerWorld){
  assert.ok(worker.x>=z.x&&worker.x<=z.x+z.width&&worker.y>=z.y&&worker.y<=z.y+z.height,'mecânico dentro da área do box');
 }
 assert.ok(bay.progressWorld.x>=z.x&&bay.progressWorld.x+bay.progressWorld.width<=z.x+z.width,'barra de progresso dentro do box');
}
const first=state.jobs[0],person=state.team[0];
assert.equal(engine.attach(state,first.id,person.id,0,true),null,'alocar OS');
assert.equal(first.bay,0,'OS no box 1');
assert.equal(person.assigned,first.id,'mecânico ocupado');
assert.ok(engine.attach(state,state.jobs[1].id,person.id,1,true),'impedir dupla alocação');
assert.equal(engine.release(state,first.id),null,'liberar box');
assert.equal(first.bay,null,'box liberado');
assert.equal(person.assigned,null,'mecânico liberado');
assert.equal(engine.rest(state,person.id),null,'descanso programado');
assert.ok(engine.attach(state,first.id,person.id,0,true),'impedir alocação durante descanso');
const before=state.tick;
const result=engine.advance(state,data,()=>0.42);
assert.equal(state.tick,before+1,'turno avança');
assert.ok(Number.isFinite(result.hours),'horas calculadas');
assert.ok(engine.validate(JSON.parse(JSON.stringify(state))),'save serializado íntegro');
console.log('OK: fundo oficial, geometria, alocação, bloqueios, equipe, turnos e save.');
