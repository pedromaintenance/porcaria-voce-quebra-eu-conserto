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
  const placement=bay?.placementWorld||bay?.hitWorld;
  const bayWidth=Math.max(40,(placement?.width||300)-6);
  const ground=bay?.placementWorld?.groundY??bay?.spriteWorld?.groundY??448;
  const top=bay?.placementWorld?.topY??bay?.hitWorld?.y??130;
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
 // Honor a small new requested translation even when the previous version was already
 // clamped to the camera edge. Prevents a nominal offset from having no visible effect.
 // requestedX is the UPDATED world position; deltaX is the increment since previous layout.
 function calibratedCenter(requestedX,renderWidth,viewport,deltaX=0,padding=8){
  const delta=Number(deltaX)||0;
  const previous=visibleCenter(Number(requestedX)-delta,renderWidth,viewport,padding);
  return visibleCenter(previous+delta,renderWidth,viewport,padding);
 }
 // A full-frame photograph requires its own physical bay footprint boundaries.
 // An equipment's track/wheel support-point can be offset from its artwork center.
 function placeMachineInBay(anchorX,renderWidth,bay,presentation={},padding=5){
  const region=bay?.placementWorld||bay?.hitWorld;
  if(!region||!(region.width>0))throw new Error('Invalid bay geometry');
  const width=Math.max(1,Number(renderWidth)||1);
  const supportRatio=Math.min(.85,Math.max(.15,Number(presentation.footprintAnchorX)||.5));
  const ideal=Number(anchorX)+(0.5-supportRatio)*width;
  const min=region.x+width/2+padding;
  const max=region.x+region.width-width/2-padding;
  const x=Math.round(min>max?region.x+region.width/2:Math.min(max,Math.max(min,ideal)));
  return {x,anchorX:Number(anchorX),footprintX:x+(supportRatio-.5)*width,footprintRatio:supportRatio,
   width,fullyFits:min<=max,contained:x-width/2>=region.x-padding&&x+width/2<=region.x+region.width+padding};
 }
 function placeWorkerInBay(requestedX,bay,displayWidth=54,padding=2){
  const region=bay?.placementWorld||bay?.hitWorld;
  if(!region||!(region.width>0))throw new Error('Invalid worker bay');
  const half=Math.max(1,Number(displayWidth)||54)/2;
  const min=region.x+half+padding,max=region.x+region.width-half-padding;
  return Math.round(Math.min(max,Math.max(min,Number(requestedX))));
 }
 return {equipmentSize,visibleCenter,calibratedCenter,placeMachineInBay,placeWorkerInBay};
});
