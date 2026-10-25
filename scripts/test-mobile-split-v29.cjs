/* Ciclo 29 — split mobile 30/70 exclusivo para Inspeção e PCM. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const GUIDE=require('../phaser-play/mobile-panel-guide.js');
const html=fs.readFileSync('phaser-play/index.html','utf8');
const css=fs.readFileSync('phaser-play/mobile-split-v29.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const js=fs.readFileSync('phaser-play/game.js','utf8');
assert.match(html,/mobile-split-v29\.css\?v=0\.9\.31-c29/);
assert.match(html,/mobile-panel-guide\.js\?v=0\.9\.27-c24&layout=0\.9\.31-c29/);
assert.ok(sw.includes("'./phaser-play/mobile-split-v29.css'")&&sw.includes('split0931'));
assert.match(css,/grid-template-columns:clamp\(96px,29%,204px\) minmax\(0,1fr\)/);
assert.match(css,/grid-column:1;\s*grid-row:2;/);
assert.match(css,/grid-column:2;\s*grid-row:2;/);
assert.match(css,/overflow-y:auto/);
assert.match(css,/mobile-guide-link\[aria-current="location"\]/);
assert.ok(css.includes('html.mobile-play'),'desktop não afetado');
assert.ok(js.includes('PANEL_GUIDE?.render?.(name)'),'guia usa abertura original');
const cssScope=css.replace(/\/\*[\s\S]*?\*\//g,'');
assert.ok(!cssScope.includes('localStorage'),'estilo não altera save');
const classes=new Set();
const shell={classList:{toggle(name,enabled){if(enabled)classes.add(name);else classes.delete(name);}}};
const buttons=[0,1,2,3].map(i=>({dataset:{guideIndex:String(i)},attrs:{},
 setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},focus(){this.focused=true;}}));
const bar={hidden:true,innerHTML:'',events:{},
 addEventListener(ev,fn){this.events[ev]=fn;},
 querySelectorAll(){return buttons;}};
const scroller={scrollTop:20,getBoundingClientRect:()=>({top:100}),scrollTo(v){this.last=v;}};
const targets={'.fieldSchedule':{getBoundingClientRect:()=>({top:150})},
 '.inspectionMetrics':{getBoundingClientRect:()=>({top:330})},
 '.inspectionList':{getBoundingClientRect:()=>({top:520})},
 '#planning .planningTabs, #planning .planningIntro, #planning':{getBoundingClientRect:()=>({top:140})},
 '#planningNotifications .pcmInbox':{getBoundingClientRect:()=>({top:300})},
 '#planningNotifications .inspectionNotification':{getBoundingClientRect:()=>({top:450})}};
const active={querySelector(selector){return targets[selector]||null;}};
const doc={getElementById:id=>id==='mobilePanelGuide'?bar:null,
 querySelector(sel){return sel==='#menuOverlay .modalContent'?scroller:
 sel==='#menuOverlay .modalShell'?shell:
 sel==='[data-panel].is-open'?active:null;}};
const win={PORCARIA_MOBILE:{isMobile:()=>true},matchMedia:()=>({matches:false})};
const ui=GUIDE.init(doc,win);
ui.render('inspection');
assert.ok(classes.has('mobile-split-guide'));
assert.ok(bar.innerHTML.includes('Início')&&bar.innerHTML.includes('Programar'));
assert.ok(bar.innerHTML.includes('Ronda')&&bar.innerHTML.includes('Indicadores'));
assert.equal(bar.hidden,false);
assert.ok(bar.innerHTML.includes('aria-current="location"'),'primeira seção marcada');
bar.events.click({target:{closest:()=>buttons[2]}});
assert.equal(scroller.last.top,250,'Indicadores rola somente conteúdo');
assert.equal(buttons[2].attrs['aria-current'],'location');
assert.equal(buttons[2].focused,true);
ui.render('planning');
assert.ok(classes.has('mobile-split-guide'),'PCM em duas colunas');
assert.ok(bar.innerHTML.includes('Notas PCM'));
ui.render('monitoring');
assert.ok(!classes.has('mobile-split-guide'),'monitoramento preservado');
ui.render('inspection');
ui.clear();
assert.ok(!classes.has('mobile-split-guide'),'fechamento restaura layout');
assert.equal(bar.hidden,true);
assert.equal(GUIDE.init(doc,{PORCARIA_MOBILE:{isMobile:()=>false}}).enabled,false);
console.log('OK Ciclo 29: split exclusivo Inspeção/PCM, scroll independente, foco, mobile e PWA.');
