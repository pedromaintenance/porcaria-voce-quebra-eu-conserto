/* P.O.R.C.A.R.I.A. — Ciclo 23: menu de setores, Android Voltar e instalação real. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const M=require('../phaser-play/mobile-experience.js');
const html=fs.readFileSync('phaser-play/index.html','utf8');
const game=fs.readFileSync('phaser-play/game.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('phaser-play/mobile.webmanifest','utf8'));
assert.equal(manifest.display,'fullscreen');
assert.equal(manifest.orientation,'landscape');
assert.ok(html.includes('id="mobileSectors"'));
assert.ok(html.includes('id="primaryNav"'));
assert.ok(html.includes('aria-controls="primaryNav"'));
assert.ok(html.includes('mobile-sectors-open .primary-nav{display:grid'));
assert.ok(html.includes('--mobile-stage-height'));
assert.ok(html.includes('mobile-experience.js?v=0.9.26-c23'));
assert.ok(html.includes('game.js?v=0.9.26-c23'));
assert.ok(game.includes('MOBILE?.panelOpened?.()'));
assert.ok(game.includes('MOBILE?.panelClosed?.()'));
assert.ok(game.includes('MOBILE?.registerClosePanel?.(closePanel)'));
assert.ok(game.includes('MOBILE?.isSectorMenuOpen?.()'));
assert.ok(sw.includes('navigation0926'));
function fake(){
 const listeners={},documentListeners={},nodes={},ui={};
 const add=(k,fn)=>{listeners[k]=fn};
 const node=(id)=>({hidden:id!=='mobileSectors'?true:true,attributes:{},listeners:{},
   setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},
   click(){return this.listeners.click?.()},focus(){}});
 for(const id of ['mobileInstall','mobileFullscreen','mobileRotate','mobileNotice','mobileSectors'])ui[id]=node(id);
 const classes=new Set(),styles={};
 const root={classList:{add:v=>classes.add(v),toggle:(v,b)=>b?classes.add(v):classes.delete(v)},
   style:{setProperty:(k,v)=>{styles[k]=v;}}};
 const nav={attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
 const header={getBoundingClientRect:()=>({height:98})};
 const document={documentElement:root,fullscreenElement:null,getElementById:id=>ui[id],
   querySelector:sel=>sel==='.primary-nav'?nav:sel==='.top'?header:null,
   addEventListener:(k,fn)=>{documentListeners[k]=fn}};
 const historyCalls={pushed:0,back:0};
 const win={document,navigator:{userAgent:'Android Chrome'},location:{href:'https://example.com/game/'},
  innerWidth:900,innerHeight:420,history:{
   pushState(state,title,url){historyCalls.pushed++;historyCalls.url=url;},
   back(){historyCalls.back++;documentListeners?.popstate?.();listeners.popstate?.();}
  },matchMedia:q=>({matches:false}),screen:{},
  addEventListener:add};
 return {win,ui,nav,classes,styles,historyCalls,listeners,documentListeners};
}
(async()=>{
 const f=fake(),ctx=M.init(f.win);
 assert.equal(ctx.enabled,true);
 assert.equal(f.ui.mobileSectors.hidden,false);
 assert.equal(f.nav.attributes['aria-hidden'],'true');
 assert.equal(f.styles['--mobile-stage-height'],'314px','altura da oficina considera cabeçalho real');
 // Menu aberto consome exatamente um nível de histórico.
 f.ui.mobileSectors.click();
 assert.equal(ctx.isSectorMenuOpen(),true);
 assert.ok(f.classes.has('mobile-sectors-open'));
 assert.equal(f.ui.mobileSectors.attributes['aria-expanded'],'true');
 assert.equal(f.nav.attributes['aria-hidden'],'false');
 assert.equal(f.historyCalls.pushed,1);
 f.ui.mobileSectors.click();
 assert.equal(ctx.isSectorMenuOpen(),false);
 assert.equal(f.historyCalls.back,1);
 // A troca de setor mantém a proteção do botão Voltar e não cria outra entrada.
 f.ui.mobileSectors.click();
 let opened=false;
 const sector={closest:selector=>selector.includes('[data-open-panel]')?{dataset:{openPanel:'planning'}}:null};
 f.documentListeners.click({target:sector});
 assert.equal(ctx.isSectorMenuOpen(),false);
 ctx.panelOpened();opened=true;
 assert.equal(f.historyCalls.pushed,2,'menu → modal usa a mesma entrada de histórico');
 ctx.panelOpened();
 assert.equal(f.historyCalls.pushed,2,'troca entre painéis não empilha histórico');
 let closed=0;
 ctx.registerClosePanel(()=>{closed++;ctx.panelClosed()});
 f.listeners.popstate();
 assert.equal(closed,1,'Voltar fecha o painel uma vez');
 assert.equal(f.historyCalls.back,1,'o fechamento por Voltar não dispara novo back');
 assert.equal(f.classes.has('mobile-sectors-open'),false);
 // Fechar pelo X devolve o nível sem sair da página.
 ctx.panelOpened();
 assert.equal(f.historyCalls.pushed,3);
 ctx.panelClosed();
 assert.equal(f.historyCalls.back,2);
 // Back quando o menu está aberto apenas recolhe o menu.
 f.ui.mobileSectors.click();
 assert.equal(ctx.isSectorMenuOpen(),true);
 f.listeners.popstate();
 assert.equal(ctx.isSectorMenuOpen(),false);
 assert.equal(closed,1);
 // Instalação moderna: prompt() pode retornar undefined, userChoice é a fonte.
 const promptEvent={preventDefault(){this.prevented=true;},prompt(){this.opened=true;return Promise.resolve();},
   userChoice:Promise.resolve({outcome:'accepted'})};
 f.listeners.beforeinstallprompt(promptEvent);
 await f.ui.mobileInstall.click();
 assert.equal(promptEvent.prevented,true);
 assert.equal(promptEvent.opened,true);
 assert.match(f.ui.mobileNotice.textContent,/Instalação solicitada/);
 // Mudança de dimensão deve recalcular a altura útil.
 f.win.innerHeight=800;
 f.listeners.resize();
 assert.equal(f.styles['--mobile-stage-height'],'694px');
 // PWA já fullscreen não apresenta botão supérfluo de fullscreen.
 f.listeners.appinstalled();
 assert.equal(f.ui.mobileInstall.hidden,true,'instalação finalizada oculta o botão no navegador normal');
 assert.equal(f.ui.mobileFullscreen.hidden,false,'navegador continua oferecendo fullscreen se ainda não instalado em execução');
 f.win.matchMedia=q=>({matches:q.includes('display-mode: fullscreen')});
 f.listeners.resize();
 assert.equal(f.ui.mobileFullscreen.hidden,true);
 // Em desktop não existe menu setorial nem histórico extra.
 const desktop={navigator:{userAgent:'Windows'},matchMedia:()=>({matches:false}),document:{}};
 assert.equal(M.init(desktop).enabled,false);
 console.log('OK Ciclo 23: cabeçalho compacto, setores, histórico Android, userChoice, viewport e desktop.');
})().catch(err=>{console.error(err);process.exitCode=1;});
