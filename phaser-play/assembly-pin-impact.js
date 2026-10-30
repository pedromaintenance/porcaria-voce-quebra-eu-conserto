/* PORCARIA — 42.4: impacto de pino em blueprint, lógica pura e determinística. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.PORCARIA_PIN_IMPACT=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const targets=Object.freeze([.32,.69,.46]);
 function progress(time){
  if(!Number.isFinite(time))return 0;
  return (Math.sin(time/460)+1)/2;
 }
 function target(round){return targets[round]??null;}
 function canStrike(assembly){
  return !!assembly && assembly.phase==='disassembly'
    && assembly.installed?.pin===true
    && assembly.installed?.leftRetainer===false
    && assembly.installed?.rightRetainer===false;
 }
 function status(assembly){
  const value=assembly?.pinImpact;
  if(!value)return {round:0,hits:0,finished:false};
  return {round:value.round,hits:value.hits,finished:value.round===3};
 }
 function isValid(assembly){
  const x=assembly?.pinImpact;
  return x===undefined||(x&&Number.isInteger(x.round)&&x.round>=0&&x.round<=3
   &&Number.isInteger(x.hits)&&x.hits>=0&&x.hits<=x.round);
 }
 function strike(assembly,time){
  if(!canStrike(assembly)||!isValid(assembly))return {ok:false,reason:'Pino bloqueado ou estado inválido.'};
  const current=status(assembly);
  if(current.finished)return {ok:false,reason:'Três golpes já registrados.'};
  const position=progress(time),distance=Math.abs(position-target(current.round));
  const precise=distance<=.07,partial=distance<=.16;
  const round=current.round+1,hits=current.hits+(precise?1:0);
  assembly.pinImpact={round,hits};
  return {ok:true,round,hits,precise,partial,position,target:target(round-1),finished:round===3};
 }
 return Object.freeze({targets,progress,target,canStrike,status,isValid,strike});
});
