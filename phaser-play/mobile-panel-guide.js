/* P.O.R.C.A.R.I.A. v0.9.31 — navegação lateral compacta de Inspeção e PCM.
 * Apresentação apenas. Não acessa nem modifica o save, decisões ou gabaritos.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PANEL_GUIDE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const MAP=Object.freeze({
  planning:[
   {label:'Programação',selector:'#planning .planningTabs, #planning .planningIntro, #planning'},
   {label:'Notas PCM',selector:'#planningNotifications .pcmInbox'},
   {label:'Risco',selector:'#planningNotifications .inspectionNotification'}
  ],
  monitoring:[
   {label:'Categorias',selector:'.controlRoomSidebar'},
   {label:'Indicadores',selector:'.controlRoomDashboard .inspectionMetrics'},
   {label:'Carteira',selector:'.controlRoomOperations[aria-label="Carteira de condições recebidas"]'},
   {label:'Catálogo',selector:'.controlRoomOperations[aria-label="Catálogo de sintomas de condição"]'}
  ],
  inspection:[
   {label:'Programar',selector:'.fieldSchedule'},
   {label:'Indicadores',selector:'.inspectionMetrics'},
   {label:'Ronda',selector:'.inspectionList'}
  ],
  detail:[
   {label:'OS',selector:'.quickOrder, #detail'},
   {label:'Diagnóstico',selector:'.diagnosticBoard, .quickStageGroup'}
  ],
  'full-detail':[
   {label:'OS',selector:'#detailFull'},
   {label:'Investigação',selector:'#detailFull .diagnosticBoard'},
   {label:'Etapas',selector:'#detailFull .diagnosticSteps'},
   {label:'Evidências',selector:'#detailFull .diagnosticJournal, #detailFull .diagnosticCoach'}
  ],
  team:[{label:'Equipe',selector:'#teamPanel'}],
  shift:[{label:'Prontidão',selector:'#shiftBrief'}]
 });
 const escapeHTML=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const entries=(panel,find)=>[
  {label:'Início',selector:null},
  ...(MAP[panel]||[]).filter(x=>!!find(x.selector))
 ];
 function topFor(target,container){
  if(!target)return 0;
  const t=target.getBoundingClientRect?.(),c=container.getBoundingClientRect?.();
  if(!t||!c)return 0;
  return Math.max(0,Math.round((Number(container.scrollTop)||0)+t.top-c.top-10));
 }
 function init(doc,win){
  if(!doc||!win)return {enabled:false};
  const bar=doc.getElementById('mobilePanelGuide');
  if(!bar||!win.PORCARIA_MOBILE?.isMobile?.(win))return {enabled:false};
  let current=null;
  const scroller=doc.querySelector('#menuOverlay .modalContent');
  const shell=doc.querySelector('#menuOverlay .modalShell');
  const splitPanels=new Set(['inspection','planning']);
  const setSplit=on=>shell?.classList?.toggle('mobile-split-guide',!!on);
  const active=()=>doc.querySelector('[data-panel].is-open');
  function render(panel){
   current=Object.hasOwn(MAP,panel)?panel:null;
   const container=active();
   if(!current||!container){setSplit(false);bar.hidden=true;bar.innerHTML='';return;}
   const items=entries(current,selector=>!!container.querySelector(selector));
   if(items.length<2){setSplit(false);bar.hidden=true;bar.innerHTML='';return;}
   setSplit(splitPanels.has(current));
   bar.innerHTML='<span class="mobile-guide-label">IR PARA</span>'
    +items.map((x,i)=>'<button type="button" class="mobile-guide-link" data-guide-index="'+i+'"'+(i===0?' aria-current="location"':'')+'>'
     +escapeHTML(x.label)+'</button>').join('');
   bar.hidden=false;
  }
  bar.addEventListener('click',ev=>{
   const btn=ev.target?.closest?.('[data-guide-index]');
   if(!btn||!scroller||!current)return;
   const idx=Number(btn.dataset.guideIndex);
   const content=active();
   const item=entries(current,selector=>!!content?.querySelector(selector))[idx];
   if(!item)return;
   const target=item.selector?content?.querySelector(item.selector):null;
   const top=topFor(target,scroller);
   const behavior=win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
   if(typeof scroller.scrollTo==='function')scroller.scrollTo({top,behavior});
   else scroller.scrollTop=top;
   bar.querySelectorAll?.('[data-guide-index]')?.forEach(link=>{
    if(link===btn)link.setAttribute?.('aria-current','location');
    else link.removeAttribute?.('aria-current');
   });
   btn.focus?.({preventScroll:true});
  });
  function clear(){current=null;setSplit(false);bar.hidden=true;bar.innerHTML='';}
  return {enabled:true,render,clear};
 }
 return {MAP,entries,topFor,init};
});
