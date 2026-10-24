/* P.O.R.C.A.R.I.A. — experiência de celular v0.9.26 / Ciclo 23.
 * Browser não autoriza fullscreen sem gesto. PWA instalado aplica o manifesto.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_MOBILE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const MOBILE_UA=/Android|iPhone|iPad|iPod|Mobile/i;
 function isMobile(win){
  if(!win)return false;
  return MOBILE_UA.test(win.navigator?.userAgent||'')||
   !!win.matchMedia?.('(pointer: coarse) and (max-width: 1100px)').matches;
 }
 function isInstalled(win){
  return !!win.matchMedia?.('(display-mode: standalone)').matches||
   !!win.matchMedia?.('(display-mode: fullscreen)').matches||
   !!win.navigator?.standalone;
 }
 function isLandscape(win){return Number(win?.innerWidth)>Number(win?.innerHeight);}
 function isTap(pointer){
  if(!pointer)return false;
  const x=Number(pointer.x),y=Number(pointer.y),
   dx=Number(pointer.downX),dy=Number(pointer.downY);
  if([x,y,dx,dy].some(n=>!Number.isFinite(n)))return false;
  return Math.hypot(x-dx,y-dy)<14;
 }
 // O módulo não altera o motor/saves: apenas navegação, viewport e instalação.
 let controller=null;
 function panelOpened(){controller?.panelOpened?.();}
 function panelClosed(){controller?.panelClosed?.();}
 function registerClosePanel(callback){controller?.registerClosePanel?.(callback);}
 function isSectorMenuOpen(){return !!controller?.isSectorMenuOpen?.();}
 function init(win){
  if(!isMobile(win)||!win?.document)return {enabled:false};
  const doc=win.document,byId=id=>doc.getElementById(id);
  doc.documentElement.classList.add('mobile-play');
  const notice=byId('mobileNotice'),install=byId('mobileInstall'),
   fullscreen=byId('mobileFullscreen'),rotate=byId('mobileRotate'),
   sectors=byId('mobileSectors'),nav=doc.querySelector?.('.primary-nav');
  let deferred=null,installedNow=false,menuActive=false,panelActive=false,historyGuard=false,fromBack=false,closePanelOnBack=null;
  function updateViewport(){
   const header=doc.querySelector?.('.top');
   const top=Number(header?.getBoundingClientRect?.().height)||100;
   const view=Number(win.visualViewport?.height)||Number(win.innerHeight)||600;
   doc.documentElement.style?.setProperty?.('--mobile-stage-height',Math.max(120,Math.floor(view-top-8))+'px');
  }
  function holdHistory(){
   if(historyGuard||typeof win.history?.pushState!=='function')return;
   try{win.history.pushState({porcariaMobileUI:true},'',win.location?.href||'');historyGuard=true;}
   catch(err){/* Proteção opcional: continua sem histórico em navegadores restritos. */}
  }
  function releaseHistory(){
   if(historyGuard&&!menuActive&&!panelActive){
    historyGuard=false;
    if(!fromBack)win.history?.back?.();
   }
  }
  function setSectors(open,{forPanel=false}={}){
   menuActive=!!open;
   doc.documentElement.classList.toggle('mobile-sectors-open',menuActive);
   sectors?.setAttribute('aria-expanded',String(menuActive));
   if(nav)nav.setAttribute('aria-hidden',String(!menuActive));
   if(menuActive)holdHistory();
   else if(!forPanel)releaseHistory();
  }
  const panelOpened=()=>{
   if(menuActive)setSectors(false,{forPanel:true});
   panelActive=true;holdHistory();
  };
  const panelClosed=()=>{panelActive=false;releaseHistory();};
  const registerClosePanel=fn=>{closePanelOnBack=typeof fn==='function'?fn:null;};
  win.addEventListener('popstate',()=>{
   if(!historyGuard)return;
   historyGuard=false;fromBack=true;
   if(menuActive)setSectors(false,{forPanel:true});
   if(panelActive){
    panelActive=false;
    closePanelOnBack?.();
   }
   fromBack=false;
  });
  sectors?.addEventListener('click',()=>setSectors(!menuActive));
  doc.addEventListener?.('click',ev=>{
   if(!menuActive||ev.target?.closest?.('#mobileSectors'))return;
   const destination=ev.target?.closest?.('.primary-nav [data-open-panel]');
   if(destination){setSectors(false,{forPanel:true});return;}
   if(ev.target?.closest?.('.primary-nav')){setSectors(false);return;}
   setSectors(false);
  });
  doc.addEventListener?.('keydown',ev=>{
   if(ev.key==='Escape'&&menuActive){setSectors(false);sectors?.focus?.();}
  });
  function tell(message){
   if(!notice)return;
   notice.hidden=false;
   notice.textContent=message;
  }
  notice?.addEventListener?.('click',()=>{notice.hidden=true;});
  function update(){
   if(sectors)sectors.hidden=false;
   const installed=isInstalled(win)||installedNow;
   if(install)install.hidden=installed;
   if(fullscreen){
    fullscreen.hidden=installed&&!!win.matchMedia?.('(display-mode: fullscreen)').matches&&!doc.fullscreenElement;
    fullscreen.textContent=doc.fullscreenElement?'↙ SAIR DA TELA CHEIA':'⛶ TELA CHEIA';
    fullscreen.setAttribute('aria-pressed',String(!!doc.fullscreenElement));
   }
   if(rotate)rotate.hidden=isLandscape(win);
   updateViewport();
  }
  const onInstallPrompt=ev=>{
   ev.preventDefault();
   deferred=ev;
   update();
  };
  win.addEventListener('beforeinstallprompt',onInstallPrompt);
  win.addEventListener('appinstalled',()=>{deferred=null;installedNow=true;update();tell('Instalação concluída! Abra o ícone P.O.R.C.A.R.I.A. na tela inicial.');});
  install?.addEventListener('click',async()=>{
   if(!deferred){
    tell('No Chrome: abra ⋮ → Adicionar à tela inicial → Instalar. Depois inicie pelo ícone para ocultar a barra do navegador.');
    return;
   }
   const prompt=deferred;deferred=null;
   try{
    // Chrome: prompt() abre a janela; userChoice informa se o jogador aceitou.
    const result=await prompt.prompt();
    const response=prompt.userChoice?await prompt.userChoice:result;
    if(response?.outcome==='accepted')tell('Instalação solicitada. Abra pelo ícone na tela inicial para jogar sem a barra de endereço.');
    else tell('Instalação cancelada. Você pode instalar pelo menu ⋮ do Chrome.');
   }catch(err){tell('Não foi possível abrir a instalação. Use o menu ⋮ do Chrome → Adicionar à tela inicial.');}
   update();
  });
  fullscreen?.addEventListener('click',async()=>{
   if(doc.fullscreenElement){
    try{await doc.exitFullscreen();}catch(err){tell('Não foi possível sair da tela cheia. Use o comando Voltar do sistema.');}
    update();return;
   }
   if(typeof doc.documentElement.requestFullscreen!=='function'){
    tell('Este navegador não permite tela cheia via botão. Instale o jogo no Chrome e abra pelo ícone.');
    return;
   }
   try{
    // Requer gesto direto; requestFullscreen chamado antes de qualquer await.
    await doc.documentElement.requestFullscreen({navigationUI:'hide'});
    if(typeof win.screen?.orientation?.lock==='function'){
     try{await win.screen.orientation.lock('landscape');}
     catch(err){if(!isLandscape(win))tell('Tela cheia ativada. Gire o celular para jogar na horizontal.');}
    }else if(!isLandscape(win))tell('Tela cheia ativada. Gire o celular para jogar na horizontal.');
   }catch(err){
    tell('O navegador impediu a tela cheia. Instale o PWA e abra pelo ícone, ou use os controles do Chrome.');
   }
   update();
  });
  doc.addEventListener('fullscreenchange',update);
  if(win.visualViewport?.addEventListener)win.visualViewport.addEventListener('resize',updateViewport);
  win.addEventListener('resize',update);
  win.addEventListener('orientationchange',update);
  update();
  if(nav)nav.setAttribute('aria-hidden','true');
  controller={enabled:true,update,updateViewport,panelOpened,panelClosed,registerClosePanel,
   isSectorMenuOpen:()=>menuActive,setSectors};
  return controller;
 }
 return {isMobile,isInstalled,isLandscape,isTap,init,panelOpened,panelClosed,registerClosePanel,isSectorMenuOpen};
});
