/* P.O.R.C.A.R.I.A. Ciclo 24 — teste de leitura e navegação técnica mobile. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const GUIDE=require('../phaser-play/mobile-panel-guide.js');
const html=fs.readFileSync('phaser-play/index.html','utf8');
const js=fs.readFileSync('phaser-play/game.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const data=JSON.parse(fs.readFileSync('game-data.json','utf8'));
assert.ok(GUIDE.MAP.planning.length>=2 && GUIDE.MAP.monitoring.length>=3);
assert.ok(GUIDE.MAP['full-detail'].length>=3);
assert.deepEqual(GUIDE.entries('monitoring',sel=>sel.includes('Catálogo')||sel.includes('controlRoomMobileMenu')).map(x=>x.label),['Início','Categorias']);
assert.deepEqual(GUIDE.entries('none',()=>true).map(x=>x.label),['Início']);
assert.equal(GUIDE.topFor({getBoundingClientRect:()=>({top:210})},{
 getBoundingClientRect:()=>({top:80}),scrollTop:100
}),220);
assert.equal(GUIDE.topFor(null,{}),0);
assert.ok(html.includes('id="mobilePanelGuide"'));
assert.ok(html.includes('mobile-panel-guide.js?v=0.9.27-c24'));
assert.ok(html.includes('game.js?v=0.9.27-c24'));
assert.ok(html.indexOf('mobile-panel-guide.js?v=')<html.indexOf('game.js?v='),'guia carregado antes do jogo');
assert.ok(sw.includes('mobile-panel-guide.js')&&sw.includes('technical0927'));
assert.ok(js.includes('PANEL_GUIDE?.render?.(name)'), 'cada abertura atualiza atalhos disponíveis');
assert.ok(js.includes('PANEL_GUIDE?.clear?.()'),'fechar modal limpa atalhos');
for(const [description,css] of Object.entries({
 'apenas mobile':'html.mobile-play .mobile-panel-guide:not([hidden]){display:flex}',
 'campos PCM':'html.mobile-play .pcmHypothesisGrid{grid-template-columns:repeat(2,minmax(0,1fr))}',
 'fontes legíveis':'html.mobile-play .pcmHypothesis select,html.mobile-play .fieldSchedule select,',
 'monitoramento mobile':'html.mobile-play .controlRoomSidebar{display:none!important}',
 'diagnóstico':'html.mobile-play .diagnosticGroups{grid-template-columns:1fr}',
 'leitura horizontal':'html.mobile-play .planningTabs{flex-wrap:nowrap;overflow-x:auto;',
 'notch seguro':'html.mobile-play #menuOverlay .modalContent{min-height:0;flex:1 1 auto;'
}))assert.ok(html.includes(css),description);
assert.ok(!js.includes("localStorage.setItem('porcaria.mobile.guide'"),'atalhos não gravam save');
// Guia usa os mesmos elementos técnicos sem clonar cartões nem criar botões de PCM.
const bar={hidden:true,innerHTML:'',events:{},addEventListener(k,fn){this.events[k]=fn;}};
const scroll={scrollTop:100,rect:{top:80},getBoundingClientRect(){return this.rect;},
 scrollTo({top,behavior}){this.position=top;this.behavior=behavior;}};
const monitoring={
 querySelector(selector){
  const map={
   '.controlRoomMobileMenu':{getBoundingClientRect:()=>({top:210})},
   '.controlRoomDashboard .inspectionMetrics':{getBoundingClientRect:()=>({top:260})},
   '.controlRoomOperations[aria-label="Carteira de condições recebidas"]':{getBoundingClientRect:()=>({top:510})},
   '.controlRoomOperations[aria-label="Catálogo de sintomas de condição"]':{getBoundingClientRect:()=>({top:900})}
  };
  return map[selector]||null;
 }
};
let focused=false;
const doc={
 getElementById:id=>id==='mobilePanelGuide'?bar:null,
 querySelector(selector){return selector==='#menuOverlay .modalContent'?scroll:
  selector==='[data-panel].is-open'?this.active:null;},
 active:monitoring
};
const win={PORCARIA_MOBILE:{isMobile:()=>true},matchMedia:()=>({matches:false})};
const ui=GUIDE.init(doc,win);
assert.equal(ui.enabled,true);
ui.render('monitoring');
assert.equal(bar.hidden,false);
assert.ok(bar.innerHTML.includes('Catálogo')&&bar.innerHTML.includes('Carteira'));
assert.equal((bar.innerHTML.match(/data-guide-index=/g)||[]).length,5);
bar.events.click({target:{closest:()=>({dataset:{guideIndex:'3'},focus(){focused=true;}})}});
assert.equal(scroll.position,520,'atalho rola dentro do modal, não na página do jogo');
assert.equal(scroll.behavior,'smooth');
assert.equal(focused,true);
ui.render('other');assert.equal(bar.hidden,true);
doc.active={querySelector:()=>null};
ui.render('planning');assert.equal(bar.hidden,true,'sem seção não mostra atalhos inoperantes');
ui.clear();assert.equal(bar.innerHTML,'');
assert.equal(GUIDE.init(doc,{PORCARIA_MOBILE:{isMobile:()=>false}}).enabled,false,'desktop não ativa navegação mobile');
assert.ok(data.models.length>0,'dados existentes continuam válidos');
console.log('OK Ciclo 24: painéis PCM, diagnóstico e monitoramento legíveis, atalhos internos, toque, desktop e save intactos.');
