/* P.O.R.C.A.R.I.A. — geometric presentation of equipment. No DOM/Phaser dependency. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_LAYOUT=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 function equipmentSize(sourceWidth,sourceHeight,baseScale,presentation,bay){
  const w=Number(sourceWidth),h=Number(sourceHeight);
  if(!(w>0&&h>0))throw new Error('Invalid source dimensions');
  const base=Number(baseScale)>0?Number(baseScale):0.7;
  const multiplier=Math.max(0.25,Number(presentation?.scaleMultiplier)||1);
  const uncapped=Math.min(310*base/w,220*base/h)*multiplier;
  const bayWidth=Math.max(40,(bay?.hitWorld?.width||300)-8);
  const ground=bay?.spriteWorld?.groundY??448;
  const top=bay?.hitWorld?.y??130;
  const bayHeight=Math.max(40,ground-top-14);
  const maximumWidth=Math.min(bayWidth,Number(presentation?.maximumWidth)||bayWidth);
  const maximumHeight=Math.min(bayHeight,Number(presentation?.maximumHeight)||bayHeight);
  const factor=Math.min(uncapped,maximumWidth/w,maximumHeight/h);
  return {
   width:Math.max(1,Math.round(w*factor)),
   height:Math.max(1,Math.round(h*factor)),
   requestedMultiplier:multiplier,
   capped:factor<uncapped-0.0000001,
   fitFactor:factor
  };
 }
 // Keep rendered images inside the visible viewport, without mutating layout JSON or hit zones.
 function visibleCenter(requestedX,renderWidth,viewport,padding=8){
  const x=Number(requestedX),w=Math.max(0,Number(renderWidth)||0);
  const left=Number(viewport?.worldScrollX??viewport?.worldX??viewport?.left??0);
  const span=Number(viewport?.width)||1080;
  const pad=Math.max(0,Number(padding)||0);
  if(!Number.isFinite(x)||!Number.isFinite(left)||!(span>0))throw new Error('Invalid viewport placement');
  const half=w/2,minimum=left+half+pad,maximum=left+span-half-pad;
  return Math.round(minimum>maximum?left+span/2:Math.min(Math.max(x,minimum),maximum));
 }
 return {equipmentSize,visibleCenter};
});
