'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const H=require('../phaser-play/assembly-hold.js');
const html=fs.readFileSync('phaser-play/assembly-workbench.html','utf8');
function nearly(a,b){ assert(Math.abs(a-b)<.00001,'Esperado '+b+', recebido '+a); }
{
  const trace=[],done=[];
  const hold=H.create({durationMs:2000,rewindMs:350,
    onProgress:(id,p,phase)=>trace.push({id,p,phase}),
    onComplete:id=>done.push(id)});
  assert(hold.start('removeBolt:g1',0));
  nearly(hold.tick(1000).progress,.5);
  assert.equal(hold.release(1000),false);
  assert.equal(hold.state().phase,'rewinding');
  nearly(hold.tick(1175).progress,.25);
  assert.equal(hold.tick(1350).phase,'idle');
  assert.deepEqual(done,[],'um toque curto não remove peça nem fixador');
  assert(hold.start('removeBolt:g1',2000));
  nearly(hold.tick(3000).progress,.5);
  assert.equal(hold.tick(4000).phase,'complete');
  assert.deepEqual(done,['removeBolt:g1'],'um hold contínuo completa exatamente uma vez');
  hold.tick(6000); hold.release(6001);
  assert.equal(done.length,1,'não duplica conclusão após soltar');
}
{
  const done=[];const hold=H.create({onComplete:id=>done.push(id)});
  hold.start('removePart:guard',100);
  assert.equal(hold.release(2099),false,'soltar antes de 2s deve abortar');
  hold.tick(2500);
  assert.equal(done.length,0,'não concluir após retrocesso');
  hold.start('removePart:guard',2700);
  assert.equal(hold.release(4700),true,'soltar exatamente em 2s pode concluir');
  assert.deepEqual(done,['removePart:guard']);
}
{
  const done=[];const hold=H.create({onComplete:id=>done.push(id)});
  hold.start('removePart:guard',0);
  assert.equal(hold.start('removeBolt:g2',900),false,'não trocar de ação enquanto pressiona');
  assert.equal(hold.cancel(2000),true,'perder foco nunca conclui uma tarefa');
  hold.tick(2400); assert.deepEqual(done,[]);
  hold.start('installPart:bushing',3000);
  hold.tick(5000);
  assert.deepEqual(done,['installPart:bushing']);
}
{
  const hold=H.create();
  assert.throws(()=>H.create({durationMs:0}),/inválidas/);
  assert.equal(hold.start('',0),false);
  hold.start('inspect',0);
  hold.reset();
  assert.equal(hold.tick(3000).phase,'idle');
}
assert(html.includes('assembly-hold.js?v='),'controlador de hold deve carregar no laboratório');
assert(html.includes('durationMs:DURATION')&&html.includes('const DURATION=2000'),'tempo fixo de 2 segundos');
assert(html.includes("addEventListener('pointerdown'")&&html.includes("addEventListener('pointerup'"),'segurar mouse ou touch');
assert(html.includes("addEventListener('pointercancel'")&&html.includes("addEventListener('keyup'"),'cancelamento e teclado');
assert(html.includes("addEventListener('visibilitychange'"),'perder foco do navegador deve cancelar');
assert(html.includes('translateY(')&&html.includes('rotate('),'animação de parafuso e deslocamento de peça');
assert(!html.includes("document.addEventListener('click',e=>"),'clique simples nunca deve mutar a montagem');
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
assert.equal(inline.length,1);
for(const src of inline)new vm.Script(src);
console.log('OK Ciclo 42 hold: 2s, soltura, retrocesso, reset, cancelamento, sem duplo commit.');
