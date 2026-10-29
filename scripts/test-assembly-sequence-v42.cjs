'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const M=require('../phaser-play/assembly-sequence.js');
const html=fs.readFileSync('phaser-play/assembly-workbench.html','utf8');
assert(M.isValid(M.create()));
assert(!/Caterpillar|SIS 2\.0|M0116841|i05439085|Disassembly and Assembly/.test(html),
  'não expor referências documentais na interface do jogador');
assert(html.includes('assembly-sequence.js')&&html.includes('data-action')&&html.includes('Peças na bancada'));

// Primeiro bloqueio: a proteção oculta e trava o acesso.
{
  const s=M.create(),actions=M.actions(s).map(a=>a.id);
  assert.deepEqual(actions,['removeBolt:g1','removeBolt:g2']);
  assert.equal(M.apply(s,'removePart:pin').ok,false);
  assert.equal(s.errors,1);
  assert.equal(s.installed.pin,true);
  assert.equal(s.actions,0);
}
{
  const s=M.create();
  const step=id=>assert.equal(M.apply(s,id).ok,true,'interação deveria estar liberada: '+id);
  // Desmontagem em ordem realista de objetos da cena; os dois lados podem ser preparados
  // em qualquer ordem, porém o pino fica bloqueado até retirar as duas travas.
  step('removeBolt:g1');step('removeBolt:g2');step('removePart:guard');
  assert(!M.actions(s).some(a=>a.id==='removePart:pin'));
  step('removeBolt:l1');step('removeBolt:l2');step('removePart:leftPad');
  step('removePart:leftRetainer');
  assert.equal(M.apply(s,'removePart:pin').ok,false);
  step('removeBolt:r1');step('removeBolt:r2');step('removePart:rightPad');
  step('removePart:rightRetainer');
  assert(M.actions(s).some(a=>a.id==='removePart:pin'));
  step('removePart:pin');step('removePart:bushing');
  assert.equal(s.phase,'inspection');assert.equal(M.progress(s),50);
  step('inspect');assert.equal(s.phase,'assembly');assert.equal(s.replacementReady,true);
  assert.deepEqual(M.actions(s).map(a=>a.id),['installPart:bushing']);
  assert.equal(M.apply(s,'installPart:guard').ok,false);
  step('installPart:bushing');step('installPart:pin');
  step('installPart:leftRetainer');step('installPart:rightRetainer');
  step('installPart:leftPad');
  assert(!M.actions(s).some(a=>a.id==='installPart:guard'),
   'proteção não pode voltar antes de concluir os apoios');
  step('installBolt:l1');step('installBolt:l2');
  step('installPart:rightPad');step('installBolt:r1');step('installBolt:r2');
  step('installPart:guard');step('installBolt:g1');step('installBolt:g2');
  assert.equal(s.phase,'complete');assert.equal(M.progress(s),100);
  assert.equal(M.actions(s).length,0);
  assert.deepEqual(s.inventory,[]);
  assert.equal(s.actions,31);
  assert.equal(s.errors,2); // intentionally blocked pin and premature guard install
  for(const p of M.parts)assert.equal(s.installed[p.id],true);
  for(const id of Object.keys(M.labels))assert.equal(s.fastened[id],true);
  const save=JSON.parse(JSON.stringify(s));
  assert(M.isValid(save),'protótipo pode recarregar estado completo');
}
console.log('OK Ciclo 42: fluxo de desmontagem/remontagem, fixadores, dependências e interface sem fontes.');
