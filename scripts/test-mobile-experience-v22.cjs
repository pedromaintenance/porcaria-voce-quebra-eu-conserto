/* P.O.R.C.A.R.I.A. Ciclo 22 — PWA Android fullscreen, scroll e taps. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../phaser-play/mobile-experience.js');
const mobile=JSON.parse(fs.readFileSync('phaser-play/mobile.webmanifest','utf8'));
const desktop=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const html=fs.readFileSync('phaser-play/index.html','utf8');
const game=fs.readFileSync('phaser-play/game.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.notEqual(mobile.id,desktop.id,'mobile é instalável sem mudar desktop');
assert.equal(desktop.display,'standalone','desktop preserva PWA anterior');
assert.equal(mobile.display,'fullscreen');
assert.equal(mobile.orientation,'landscape');
assert.equal(mobile.start_url,'./?mobile=1');
assert.ok(mobile.icons.every(x=>x.src.startsWith('../icon-')));
assert.ok(sw.includes('mobile-experience.js')&&sw.includes('mobile.webmanifest'));
assert.ok(html.includes('id="appManifest"'));
assert.ok(html.includes('mobile.webmanifest')&&html.includes('mobile-experience.js?v='));
assert.ok(html.includes('viewport-fit=cover'));
assert.ok(html.includes('touch-action:pan-y!important'));
assert.ok(html.includes('.mobile-play .modalContent{touch-action:pan-y;'));
assert.ok(html.includes('id="mobileInstall"')&&html.includes('id="mobileFullscreen"'));
assert.ok(html.includes('id="mobileRotate"')&&html.includes('id="mobileNotice"'));
assert.ok(game.includes('input:{touch:{capture:!MOBILE?.isMobile(window)}}'));
assert.ok(game.includes("mobileTapEvent=MOBILE?.isMobile(window)?'pointerup':'pointerdown'"));
assert.ok(game.includes('isValidMobileTap(pointer)'));
assert.ok(game.includes("hit.on(mobileTapEvent"));
assert.ok(game.includes("machineNode.on(mobileTapEvent"));
assert.ok(game.includes("actor.on(mobileTapEvent"));
assert.equal(M.isMobile({navigator:{userAgent:'Mozilla Windows'},matchMedia:()=>({matches:false})}),false);
assert.equal(M.isMobile({navigator:{userAgent:'Android Chrome'}}),true);
assert.equal(M.isMobile({navigator:{userAgent:'Desktop'},matchMedia:()=>({matches:true})}),true);
assert.equal(M.isTap({x:50,y:50,downX:48,downY:47}),true);
assert.equal(M.isTap({x:50,y:50,downX:50,downY:11}),false);
assert.equal(M.isTap({x:5,y:4}),false);
function fakeWindow(){
 const listeners={},elements={},nodes={};
 for(const id of ['mobileInstall','mobileFullscreen','mobileRotate','mobileNotice']){
  elements[id]={hidden:true,listeners:{},setAttribute(k,v){this[k]=v;},
   addEventListener(k,fn){this.listeners[k]=fn;},
   click(){return this.listeners.click?.()}};
 }
 const htmlNode={classList:{contains:false,add(){this.contains=true;}},requestFullscreen(){
  nodes.document.fullscreenElement=htmlNode;
  listeners.fullscreenchange?.();
  return Promise.resolve();
 }};
 nodes.document={documentElement:htmlNode,fullscreenElement:null,getElementById:id=>elements[id],
  addEventListener:(k,fn)=>listeners[k]=fn,exitFullscreen(){
   nodes.document.fullscreenElement=null;listeners.fullscreenchange?.();return Promise.resolve();
  }};
 const w={document:nodes.document,navigator:{userAgent:'Android'},
  innerWidth:400,innerHeight:820,
  matchMedia:q=>({matches:false}),
  screen:{orientation:{lock:(v)=>{nodes.orientation=v;return Promise.resolve();}}},
  addEventListener:(k,fn)=>listeners[k]=fn};
 return {w,elements,listeners,nodes};
}
(async()=>{
 const x=fakeWindow(),ctrl=M.init(x.w);
 assert.equal(ctrl.enabled,true);
 assert.equal(x.elements.mobileFullscreen.hidden,false,'botão de fullscreen aparece');
 assert.equal(x.elements.mobileInstall.hidden,false,'botão de instalar aparece');
 assert.equal(x.elements.mobileRotate.hidden,false,'recomendação de giro aparece em retrato');
 assert.equal(x.nodes.document.documentElement.classList.contains,true);
 await x.elements.mobileFullscreen.click();
 assert.equal(x.nodes.document.fullscreenElement,x.nodes.document.documentElement);
 assert.equal(x.nodes.orientation,'landscape');
 assert.equal(x.elements.mobileFullscreen['aria-pressed'],'true');
 await x.elements.mobileFullscreen.click();
 assert.equal(x.nodes.document.fullscreenElement,null);
 const evt={preventDefault(){this.prevented=true;},prompt(){return Promise.resolve({outcome:'accepted'});}};
 x.listeners.beforeinstallprompt(evt);
 assert.equal(evt.prevented,true);
 await x.elements.mobileInstall.click();
 assert.ok(x.elements.mobileNotice.textContent.includes('Instalação solicitada'));
 x.w.innerWidth=880;x.w.innerHeight=392;
 x.listeners.resize();assert.equal(x.elements.mobileRotate.hidden,true);
 x.w.matchMedia=q=>({matches:q.includes('display-mode: fullscreen')});
 x.listeners.appinstalled();
 assert.equal(x.elements.mobileInstall.hidden,true);
 const desk={navigator:{userAgent:'Windows'},matchMedia:()=>({matches:false}),document:{}};
 assert.equal(M.init(desk).enabled,false,'interface desktop intacta');
 console.log('OK ciclo 22: manifests separados, orientação, fullscreen por gesto, instalação, scroll Phaser, navegação e desktop.');
})().catch(err=>{console.error(err);process.exitCode=1;});
