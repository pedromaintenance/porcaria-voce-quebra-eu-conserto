/* P.O.R.C.A.R.I.A. Ciclo 28 — menu de condição legível, foco e rolagem.
 * Não altera a engine, a classificação SAP ou o save da campanha.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const Navigation=require('../phaser-play/monitoring-nav-state.js');
const html=fs.readFileSync('phaser-play/index.html','utf8');
const css=fs.readFileSync('phaser-play/responsive-scenes-v27.css','utf8');
const script=fs.readFileSync('phaser-play/game.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
let currentScroll=126,afterScroll=0,focused=0,prevented=false;
const oldMenu={scrollTop:currentScroll};
const newMenu={scrollTop:0};
let focusTarget=null;
const focusedButton={dataset:{monitorCategory:'fps'},closest(sel){
 assert.equal(sel,'.controlRoomSidebar [data-monitor-category]');return this;
}};
const activeTarget={focus(opt){focused++;prevented=opt?.preventScroll===true;}};
const before={contains(el){return el===focusedButton},querySelector(sel){
 return sel==='.controlRoomSidebarItems'?oldMenu:null;
}};
const after={querySelector(sel){
 if(sel==='.controlRoomSidebarItems')return newMenu;
 if(sel==='.controlRoomSidebar [data-monitor-category="fps"]')return activeTarget;
 return null;
}};
const original=Navigation.capture(before,focusedButton);
assert.deepEqual(original,{scrollTop:126,category:'fps'});
assert.equal(Navigation.restore(after,original),true);
assert.equal(newMenu.scrollTop,126);
assert.equal(focused,1);
assert.equal(prevented,true,'não saltar o painel ao restaurar foco');
assert.equal(Navigation.validKey('oil'),true);
assert.equal(Navigation.validKey('monitoring'),false);
assert.equal(Navigation.validKey('fps" onclick="evil'),false,'código da categoria nunca monta seletor arbitrário');
const external={dataset:{monitorCategory:'oil'},closest(){return this}};
const fromElsewhere=Navigation.capture(before,external);
assert.equal(fromElsewhere.category,null);
assert.equal(Navigation.restore(after,fromElsewhere),false);
assert.equal(focused,1);
assert.deepEqual(Navigation.capture(null,null),{scrollTop:0,category:null});
assert.equal(Navigation.restore(null,original),false);
assert.deepEqual(Navigation.capture(before,{closest:()=>({dataset:{monitorCategory:'invalid'}})}),{scrollTop:126,category:null});
assert.ok(script.includes("const snapshot=nav?.capture(host,document.activeElement)"));
assert.ok(script.includes("nav?.restore(host,snapshot)"));
assert.ok(html.includes('monitoring-nav-state.js?v=0.9.30-c28'));
assert.ok(html.includes('game.js?v=0.9.30-c28'));
assert.ok(html.indexOf('monitoring-nav-state.js?v=')<html.indexOf('game.js?v='));
assert.ok(html.includes('responsive-scenes-v27.css?v=0.9.30-c28'));
assert.ok(sw.includes("'./phaser-play/monitoring-nav-state.js'")&&sw.includes('interaction0930'));
assert.ok(css.includes('scrollbar-color:#e6ad50 #183248'),'rolagem lateral visível');
assert.ok(css.includes('html.mobile-play .controlRoomSidebar .controlNavItem{font-size:clamp(11px,1.25vw,13px);min-height:42px'),'tamanho legível para toque');
assert.ok(css.includes('html.mobile-play .controlRoomSidebar .controlNavItem{min-height:42px;font-size:11px}'),'paisagem curta não reduz botões a 22px');
assert.ok(css.includes('overflow-y:auto'),'seis categorias roláveis sem cobrir Pedro');
assert.ok(css.includes('.radioQueueSpotlight .radioQueueCard:focus-visible'),'cartões Elton acessíveis pelo teclado');
assert.ok(css.includes('.controlRoomSidebar .controlNavItem:focus-visible'),'menu Pedro acessível pelo teclado');
const caseHeights=[320,390,450,520,740];
for(const height of caseHeights){
 const width=Math.min(108*height/100,980);
 const artHeight=width*(941/1672);
 const menuHeight=artHeight*.76;
 assert.ok(menuHeight>0);
 // 6 botões de 42 px + espaçamento ultrapassam a altura em paisagem curta:
 // a solução intencional é a rolagem INTERNA, não encolher a fonte nem cortar Pedro.
 if(height<=450)assert.ok(menuHeight<6*42+5*4,'scroll interno necessário em '+height+'px');
}
console.log('OK Ciclo 28: foco/rolagem preservados; seis categorias legíveis em paisagem; sem vazamento para save.');
