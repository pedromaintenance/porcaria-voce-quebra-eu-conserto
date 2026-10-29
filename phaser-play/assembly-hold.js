/* P.O.R.C.A.R.I.A. — Ciclo 42: pressionar e segurar para interagir.
 * Mecânica lúdica, sem efeitos na campanha principal.
 * Lógica pura independente de DOM: start, tick, release e cancel. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.PORCARIA_HOLD_ACTION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=value=>Math.min(1,Math.max(0,value));
  function create(options={}){
    const duration=options.durationMs??2000;
    const rewind=options.rewindMs??350;
    if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(rewind)||rewind<=0)
      throw Error('Durações inválidas.');
    const onProgress=typeof options.onProgress==='function'?options.onProgress:()=>{};
    const onComplete=typeof options.onComplete==='function'?options.onComplete:()=>{};
    let current=null;
    function emit(phase,progress){
      if(current)onProgress(current.id,clamp(progress),phase);
    }
    function tick(now){
      if(!current)return {phase:'idle',progress:0};
      if(current.phase==='holding'){
        const progress=clamp((now-current.since)/duration);
        emit('holding',progress);
        if(progress>=1){
          const id=current.id;current=null;
          onComplete(id);
          return {phase:'complete',progress:1,id};
        }
        return {phase:'holding',progress,id:current.id};
      }
      const progress=clamp(current.from*(1-(now-current.since)/rewind));
      emit('rewinding',progress);
      if(progress===0){const id=current.id;current=null;return {phase:'idle',progress:0,id};}
      return {phase:'rewinding',progress,id:current.id};
    }
    function start(id,now){
      if(typeof id!=='string'||!id||!Number.isFinite(now)||current?.phase==='holding')return false;
      // Retomar uma ação exige novo ciclo de 0; nunca conserva progresso anterior.
      if(current)emit('rewinding',0);
      current={id,since:now,phase:'holding',from:0};
      emit('holding',0);
      return true;
    }
    function release(now){
      if(!current||current.phase!=='holding')return false;
      const outcome=tick(now);
      if(outcome.phase==='complete')return true;
      current.phase='rewinding';current.from=outcome.progress;current.since=now;
      emit('rewinding',outcome.progress);
      return false;
    }
    function cancel(now){
      if(!current||current.phase!=='holding')return false;
      // Cancelamentos do navegador nunca podem concluir a ação.
      const progress=clamp((now-current.since)/duration);
      current.phase='rewinding';current.from=Math.min(progress,.999999);current.since=now;
      emit('rewinding',current.from);
      return true;
    }
    function reset(){
      if(current)emit('rewinding',0);
      current=null;
    }
    function state(){
      return current?{id:current.id,phase:current.phase}:{phase:'idle'};
    }
    return Object.freeze({start,tick,release,cancel,reset,state,durationMs:duration,rewindMs:rewind});
  }
  return Object.freeze({create});
});
