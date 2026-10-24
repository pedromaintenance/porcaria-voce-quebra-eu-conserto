/* P.O.R.C.A.R.I.A. — experiência de celular v0.9.25 / Ciclo 22.
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
 function init(win){
  if(!isMobile(win)||!win?.document)return {enabled:false};
  const doc=win.document,byId=id=>doc.getElementById(id);
  doc.documentElement.classList.add('mobile-play');
  const notice=byId('mobileNotice'),install=byId('mobileInstall'),
   fullscreen=byId('mobileFullscreen'),rotate=byId('mobileRotate');
  let deferred=null;
  function tell(message){
   if(!notice)return;
   notice.hidden=false;
   notice.textContent=message;
  }
  function update(){
   const installed=isInstalled(win);
   if(install)install.hidden=installed;
   if(fullscreen){
    fullscreen.hidden=false;
    fullscreen.textContent=doc.fullscreenElement?'↙ SAIR DA TELA CHEIA':'⛶ TELA CHEIA';
    fullscreen.setAttribute('aria-pressed',String(!!doc.fullscreenElement));
   }
   if(rotate)rotate.hidden=isLandscape(win);
  }
  const onInstallPrompt=ev=>{
   ev.preventDefault();
   deferred=ev;
   update();
  };
  win.addEventListener('beforeinstallprompt',onInstallPrompt);
  win.addEventListener('appinstalled',()=>{deferred=null;update();tell('Instalação concluída! Abra o ícone P.O.R.C.A.R.I.A. na tela inicial.');});
  install?.addEventListener('click',async()=>{
   if(!deferred){
    tell('No Chrome: abra ⋮ → Adicionar à tela inicial → Instalar. Depois inicie pelo ícone para ocultar a barra do navegador.');
    return;
   }
   const prompt=deferred;deferred=null;
   try{
    const response=await prompt.prompt();
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
  win.addEventListener('resize',update);
  win.addEventListener('orientationchange',update);
  update();
  return {enabled:true,update};
 }
 return {isMobile,isInstalled,isLandscape,isTap,init};
});
