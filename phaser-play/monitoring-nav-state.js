/* Ciclo 28: preservar contexto ao atualizar o conteúdo do monitoramento.
   Apenas interface; nunca altera dados, seleção de OS ou save. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_MONITOR_NAV=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const validKey=key=>typeof key==='string'&&/^(overview|oil|faults|undercarriage|fps|components)$/.test(key);
 function capture(host,activeElement){
  if(!host)return {scrollTop:0,category:null};
  const menu=host.querySelector('.controlRoomSidebarItems');
  const selected=activeElement?.closest?.('.controlRoomSidebar [data-monitor-category]');
  const category=selected&&host.contains(selected)?selected.dataset.monitorCategory:null;
  return {scrollTop:Math.max(0,Number(menu?.scrollTop)||0),category:validKey(category)?category:null};
 }
 function restore(host,state){
  if(!host||!state)return false;
  const menu=host.querySelector('.controlRoomSidebarItems');
  if(menu)menu.scrollTop=state.scrollTop||0;
  if(!validKey(state.category))return false;
  const selected=host.querySelector('.controlRoomSidebar [data-monitor-category="'+state.category+'"]');
  if(!selected)return false;
  selected.focus?.({preventScroll:true});
  return true;
 }
 return {capture,restore,validKey};
});
