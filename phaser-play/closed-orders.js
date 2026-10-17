/* P.O.R.C.A.R.I.A. v0.8.11 — consulta imutável de OS concluídas. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_CLOSED_ORDERS=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number.isFinite(Number(n))?Math.round(Number(n)).toLocaleString('pt-BR'):'—';
 const safeNum=n=>Number.isFinite(Number(n))?Math.max(0,Number(n)):null;
 function compute(state,data,query='',selectedId=null,limit=24){
  if(!state||!Array.isArray(state.done)||!data||!Array.isArray(data.scenarios)||!Array.isArray(data.models))throw Error('Arquivo de histórico inválido');
  const all=state.done;
  const term=String(query??'').trim().toLocaleLowerCase('pt-BR');
  const entries=all.map(j=>{
   const scenario=data.scenarios.find(x=>x.id===j.scene)||null;
   const model=data.models.find(x=>x.id===j.modelId)||null;
   return {
    id:String(j.id||''),scene:j.scene,raw:j,
    title:model?.title||j.modelId||'Modelo desconhecido',
    caseTitle:scenario?.title||'Caso sem identificação',
    report:String(j.report||scenario?.operator||''),
    stage:Math.max(0,Math.min(6,Math.trunc(Number(j.stage)||0))),
    priority:j.priority,
    finishedTick:Number.isInteger(j.finishedTick)?j.finishedTick:null,
    elapsedHours:safeNum(j.elapsedHours),
    laborHours:safeNum(j.worked),
    laborCost:safeNum(j.costLabor),
    materialCost:safeNum(j.materialCost),
    revenue:safeNum(j.revenue),
    wrong:safeNum(j.wrong),
    reworkHours:safeNum(j.reworkHours),
    blockedShifts:safeNum(j.blockedShifts),
    toolWait:safeNum(j.toolWait),
    firstTime:typeof j.firstTime==='boolean'?j.firstTime:null,
    diagnosticCount:Array.isArray(j.diagnosticLog)?j.diagnosticLog.length:null
   };
  });
  const filtered=term?entries.filter(x=>[x.id,x.title,x.caseTitle,x.report].some(s=>String(s).toLocaleLowerCase('pt-BR').includes(term))):entries;
  const selected=selectedId?entries.find(x=>x.id===selectedId)||null:null;
  return {total:entries.length,matched:filtered.length,rows:filtered.slice(0,Math.max(1,Math.min(100,Math.trunc(limit)||24))),selected,
   limited:filtered.length>Math.max(1,Math.min(100,Math.trunc(limit)||24)),
   source:'Resultados registrados em state.done; máximo de 200 OS mantidas pelo motor. Receita e custos apresentados separadamente, sem deduzir margem ou lucro.'};
 }
 function renderList(r){
  return '<div class="closedLedgerInfo"><strong>'+r.matched+'</strong> de '+r.total+' OS concluídas no histórico disponível'
   +(r.limited?' · exibindo as primeiras '+r.rows.length:'')+'</div>'
   +(r.rows.length?'<div class="closedLedgerRows">'+r.rows.map(j=>
    '<button type="button" class="closedLedgerItem" data-closed-order="'+esc(j.id)+'">'
    +'<span class="closedLedgerHeader"><strong>'+esc(j.title)+' · '+esc(j.id)+'</strong>'
    +'<small>'+esc(j.firstTime===true?'✓ Sem retrabalho registrado':j.firstTime===false?'◷ Houve erro ou retrabalho':'Classificação sem registro')+'</small></span>'
    +'<span>'+esc(j.caseTitle)+'</span>'
    +'<small>Tempo decorrido: '+(j.elapsedHours===null?'—':fmt(j.elapsedHours)+' h')+
    ' · Mão de obra: '+(j.laborHours===null?'—':fmt(j.laborHours)+' HH')+
    ' · Receita simulada: '+(j.revenue===null?'—':'R$ '+fmt(j.revenue))+'</small>'
    +'</button>').join('')+'</div>'
    :'<p class="muted">Nenhuma OS concluída corresponde à busca. Ajuste o filtro ou avance os turnos até concluir serviços.</p>');
 }
 function renderDetail(r){
  const j=r.selected;if(!j)return '<p class="muted">OS concluída não encontrada. Volte à lista.</p>';
  const metric=(name,value,units)=>'<div class="closedMetric"><small>'+name+'</small><strong>'+value+'</strong>'+(units?'<span>'+units+'</span>':'')+'</div>';
  return '<button type="button" class="act secondary" data-closed-back>← VOLTAR AO HISTÓRICO</button>'
   +'<section class="closedDossier"><div class="closedDossierHeader"><small>DOSSIÊ TÉCNICO · ORDEM ENCERRADA</small>'
   +'<h3>'+esc(j.title)+' · '+esc(j.id)+'</h3><p>'+esc(j.caseTitle)+'</p><p>'+esc(j.report)+'</p>'
   +'<small>Encerramento no turno '+(j.finishedTick===null?'não registrado':j.finishedTick)+
   ' · Diagnóstico '+j.stage+'/6 · '+(j.firstTime===true?'Sem retrabalho registrado':j.firstTime===false?'Com erro ou retrabalho registrado':'Classificação não registrada')+'</small></div>'
   +'<div class="closedMetrics">'
   +metric('Tempo decorrido',j.elapsedHours===null?'—':fmt(j.elapsedHours),'horas corridas')
   +metric('Esforço contabilizado',j.laborHours===null?'—':fmt(j.laborHours),'HH do serviço')
   +metric('Custo de mão de obra',j.laborCost===null?'—':'R$ '+fmt(j.laborCost),'simulação')
   +metric('Material consumido',j.materialCost===null?'—':'R$ '+fmt(j.materialCost),'valor unitário registrado')
   +metric('Receita registrada',j.revenue===null?'—':'R$ '+fmt(j.revenue),'simulação')
   +metric('Retrabalho',j.reworkHours===null?'—':fmt(j.reworkHours),'horas contabilizadas')
   +metric('Bloqueios por material',j.blockedShifts===null?'—':fmt(j.blockedShifts),'turnos')
   +metric('Bloqueios por ferramenta',j.toolWait===null?'—':fmt(j.toolWait),'turnos')
   +'</div><p class="closedSourceNote">'+esc(r.source)+'</p></section>';
 }
 return {compute,renderList,renderDetail};
});