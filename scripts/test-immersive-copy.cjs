/* Regressão de imersão: notificações, laudos e saves antigos sem rótulos meta. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const COPY=require('../phaser-play/immersive-copy.js');
globalThis.PORCARIA_IMMERSIVE_COPY=COPY;
const M=require('../phaser-play/monitoring.js');
const V=require('../phaser-play/inspection-view.js');
const source='Particulado em uma análise fictícia sem confirmação da via de entrada.';
const expected='Particulado identificado na análise de óleo; via de entrada ainda não confirmada.';
assert.equal(COPY.clean(source),expected);
assert.equal(M.PROTOCOLS.differential.baseline,expected);
assert.ok(!/fictíci|simulad/i.test(M.PROTOCOLS.sample.baseline));
const legacy={id:'NM0003',inspectionId:null,asset:'EQ08·01',modelId:'EQ08',
 priority:'media',status:'aguarda_revisao_pcm',monitorOnly:true,monitorProtocol:'differential',
 description:'Avaliar condição em EQ08·01. '+source+' Escalonado sem nova recoleta por decisão conservadora.',
 reportedIndication:'Avaliar condição em EQ08·01. '+source+' Escalonado sem nova recoleta por decisão conservadora.',
 monitoring:{status:'proposta',baseline:source,samples:[],decisions:[]}};
const untouched=JSON.stringify(legacy);
const html=V.renderPCM(legacy,()=> 'CAT 966',{items:{},tools:{}},null,null,{tick:0},null,M);
assert.ok(html.includes('NM0003 · CAT 966 · EQ08·01'));
assert.ok(html.includes(expected),'mensagem convertida também no save antigo');
assert.ok(!/análise fictícia|coleta simulada|fictíci|simulad[ao]|didátic[ao]/i.test(html),'interface sem rótulo externo');
assert.equal(JSON.stringify(legacy),untouched,'apresentação não altera histórico do save');
assert.equal(COPY.clean('O laudo simulado contém dados fictícios.'),'O laudo contém dados.');
assert.equal(COPY.clean('O gabarito fictício considera o rolamento danificado.'),
 'a avaliação técnica considera o rolamento danificado.');
const files={
 game:fs.readFileSync('phaser-play/game.js','utf8'),
 view:fs.readFileSync('phaser-play/inspection-view.js','utf8'),
 monitoring:fs.readFileSync('phaser-play/monitoring.js','utf8'),
 sw:fs.readFileSync('sw.js','utf8')
};
assert.ok(files.game.includes("await import('./immersive-copy.js?v=0.9.18-copy1')"));
assert.ok(files.view.includes('PORCARIA_IMMERSIVE_COPY?.clean(v)'));
assert.ok(files.monitoring.includes('COPY.clean(n.description)'));
assert.ok(files.sw.includes("immersive-copy.js"));
assert.ok(!files.monitoring.includes('Particulado em uma análise fictícia'));
console.log('OK: NM0003, redacao operacional, save antigo, renderizacao e cache PWA.');
