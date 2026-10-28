/* Nemuel v2: bytes originais, coordenadas de quatro poses e compatibilidade.
 * Não substitui inspeção visual; protege o atlas irregular no Phaser/PWA.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const png=fs.readFileSync(path.join(root,'phaser-play/assets/characters/nemuel-inspetor-4poses-v2.png'));
assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','assinatura PNG');
const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
assert.deepEqual([width,height],[1211,1299],'tamanho original do atlas novo');
assert.equal(png[25],6,'PNG RGBA com transparência');
const sha=crypto.createHash('sha256').update(png).digest('hex');
assert.equal(sha,'5852691542117915492e8416d8a952b44bbe38dd2857912db6f55a3ec216b34a','pixels originais do produtor preservados');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(game.includes("nemuel:'./assets/characters/nemuel-inspetor-4poses-v2.png'"));
assert.ok(game.includes("name==='nemuel'?this.load.image('worker_'+name,url):this.load.spritesheet"),'carregar cartela irregular inteira');
assert.ok(game.includes("texture==='worker_nemuel'?src.width!==1211||src.height!==1299"),'não rejeitar as dimensões novas');
assert.ok(game.includes('const WORKER_RENDER_FRAME={width:290,height:311}'));
assert.ok(game.includes('const WORKER_DISPLAY={width:66,height:80}'));
const frames=[
 {x:130,y:0,w:440,h:649},
 {x:660,y:0,w:450,h:649},
 {x:125,y:649,w:440,h:650},
 {x:630,y:710,w:540,h:589}
];
for(const [i,p] of frames.entries()){
 assert.ok(p.x>=0&&p.y>=0&&p.x+p.w<=width&&p.y+p.h<=height,'quadro '+i+' dentro da cartela');
 const w=Math.floor(p.w*Math.min(290/p.w,311/p.h));
 const h=Math.floor(p.h*Math.min(290/p.w,311/p.h));
 assert.ok(w>0&&w<=290&&h>0&&h<=311,'quadro '+i+' cabe no frame de destino');
 assert.ok(game.includes('{x:'+p.x+',y:'+p.y+',w:'+p.w+',h:'+p.h+'}'),'coordenadas do quadro '+i);
}
const render=game.slice(game.indexOf(' workerRenderTexture(texture){'),game.indexOf(' worker(x,y,mechanic,'));
assert.ok(render.includes("if(texture==='worker_nemuel')"),'aplicar apenas ao Nemuel');
assert.ok(render.includes('ctx.drawImage(src,p.x,p.y,p.w,p.h,dx,dy,w,h)'),'pré-filtragem por pose');
assert.ok(render.includes('ctx.drawImage(src,(i%2)*WORKER_FRAME.width'),'caminho antigo preservado para os demais');
assert.ok(render.includes('sheet.add(i,0'),'quatro quadros registrados no Phaser');
assert.match(html,/game\.js\?v=0\.9\.\d+[-a-z\d]*/,'script do jogo permanece versionado no navegador');
assert.ok(sw.includes("'./phaser-play/assets/characters/nemuel-inspetor-4poses-v2.png'"),'PNG novo no precache offline');
assert.ok(sw.includes('-atlasv2'),'cache PWA invalidado');
console.log('OK Nemuel v2: PNG SHA256 exato, quatro poses sem recorte e Phaser/PWA íntegros.');
