/* Regressão: Nemuel não pode perder pés nem exibir botas duplicadas.
 * Os outros trabalhadores mantêm enquadramento e escala atuais.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const bytes=fs.readFileSync(path.join(root,'phaser-play/assets/characters/nemuel-inspetor-4poses.webp'));
const width=1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16);
const height=1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16);
assert.deepEqual([width,height],[1160,1244],'a imagem original fica preservada');
const original=[580,622],dest=[290,311];
const frames=[
 {x:0,y:0,w:580,h:646},
 {x:580,y:0,w:580,h:646},
 {x:0,y:710,w:580,h:534},
 {x:580,y:710,w:580,h:534}
];
assert.ok(frames[0].h>original[1],'pose em pé não perde os pés reais');
assert.ok(frames[0].h<660,'região de botas duplicadas inicia após recorte superior');
assert.ok(frames[1].h<660,'ambas poses superiores excluem os artefatos');
assert.equal(frames[2].y,710,'pose inferior preservada');
for(const [i,f] of frames.entries()){
 assert.ok(f.x>=0&&f.y>=0&&f.x+f.w<=width&&f.y+f.h<=height,'enquadramento fonte válido '+i);
 const nominalHeight=i<2?710:f.h;
 const scale=Math.min(dest[0]/f.w,dest[1]/nominalHeight);
 const w=Math.floor(f.w*scale),h=Math.floor(f.h*scale);
 assert.ok(w<=dest[0]&&h<=dest[1]&&w>0&&h>0,'pose no quadro '+i);
 const dx=(i%2)*dest[0]+Math.floor((dest[0]-w)/2);
 const dy=Math.floor(i/2)*dest[1]+(dest[1]-h);
 assert.ok(dx>=(i%2)*dest[0]&&dx+w<=(i%2+1)*dest[0]);
 assert.ok(dy>=Math.floor(i/2)*dest[1]&&dy+h<=(Math.floor(i/2)+1)*dest[1]);
}
const render=game.slice(game.indexOf(' workerRenderTexture(texture){'),game.indexOf(' worker(x,y,mechanic,'));
assert.ok(render.includes("if(texture==='worker_nemuel')"),'correção deve afetar apenas o Nemuel');
for(const f of frames){
 const literal=`{x:${f.x},y:${f.y},w:${f.w},h:${f.h}}`;
 assert.ok(render.includes(literal),'região fonte '+literal);
}
assert.ok(render.includes('const upperPoseNominalHeight=710'),'escala nominal protege tamanho original');
assert.ok(render.includes('const nominalHeight=i<2?upperPoseNominalHeight:p.h'),'exceção só para poses superiores');
assert.ok(render.includes('ctx.drawImage(src,p.x,p.y,p.w,p.h,dx,dy,w,h)'),'amostra apenas região válida');
assert.ok(render.includes('}else{'),'outros trabalhadores permanecem intactos');
assert.ok(render.includes('ctx.drawImage(src,(i%2)*WORKER_FRAME.width'),'caminho anterior permanece para os demais');
assert.ok(game.includes('const WORKER_DISPLAY={width:66,height:80}'),'mantém tamanho padronizado');
assert.ok(html.includes('game.js?v=0.9.34-nemuel-ghostfix'),'cache do script atualizado');
assert.ok(sw.includes('-nemuelcrop2'),'cache offline atualizado');
console.log('OK Nemuel: botas fantasmas excluídas das duas poses superiores, quatro frames preservados, escala nominal e demais personagens intactos.');
