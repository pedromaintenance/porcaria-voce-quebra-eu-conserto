/* PORCARIA — Ciclo 17: capacidade operacional e metas por modelo.
 * Comparações somente com horas planejadas gravadas no turno (sem projeção retroativa).
 * Não há tonelagem, produção vendida ou equivalência entre categorias de equipamentos.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PRODUCTION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='17.0.0',WINDOWS=[7,14,30],TARGETS=[60,75,85,95],DEFAULT_TARGET=85;
 const positive=n=>Number.isFinite(Number(n))?Math.max(0,Number(n)):0;
 const round=n=>Math.round(n*10)/10;
 function target(state,modelId){
  const n=Number(state?.productionTargets?.[modelId]);
  return TARGETS.includes(n)?n:DEFAULT_TARGET;
 }
 function setTarget(state,data,modelId,value,audit=()=>{}){
  if(!(data?.models||[]).some(x=>x.id===modelId))return 'Modelo não encontrado na frota.';
  const n=Number(value);
  if(!TARGETS.includes(n))return 'Meta inválida. Selecione 60, 75, 85 ou 95%.';
  if(!state.productionTargets)state.productionTargets={};
  const before=target(state,modelId);
  if(before===n)return null;
  state.productionTargets[modelId]=n;
  audit('production_target_changed',{modelId,previousPct:before,targetPct:n,
   classification:'meta_de_entrega_de_jornada'});
  return null;
 }
 function compute(state,data,{days=14}={}){
  if(!state||!Array.isArray(data?.models))throw Error('Dados inválidos para desempenho operacional.');
  const span=WINDOWS.includes(Number(days))?Number(days):14;
  const current=Number(state.tick)||0,from=Math.max(0,current-span*2);
  const rows=(state.fleetTelemetry?.samples||[]).filter(s=>s.tick>=from&&s.tick<current);
  const models=new Map(data.models.map(m=>[m.id,{modelId:m.id,title:m.title,category:m.category,
   targetPct:target(state,m.id),operating:0,planned:0,cmLoss:0,pmLoss:0,
   assetTurns:0,activeAssets:new Set()}]));
  const assets=new Map();
  let eligible=0,unmeasured=0;
  const timeline=[];
  for(const sample of rows){
   let planned=0,actual=0,cm=0,pm=0;
   if(!Array.isArray(sample.perAsset)){unmeasured+=data.models.length*6;continue;}
   for(const r of sample.perAsset){
    const id=String(r.asset||''),modelId=id.split('·')[0];
    const group=models.get(modelId);
    if(!group)continue;
    const duty=Number(r.dutyHours);
    // Old saves have hour readings, but no snapshotted duty at the time: don't backfill.
    if(!Number.isFinite(duty)||![0,4,8,12].includes(duty)){unmeasured++;continue;}
    const op=positive(r.operating),corrective=positive(r.corrective),
      preventive=positive(r.preventive);
    const delivered=Math.min(duty,op);
    const shortfall=Math.max(0,round(duty-delivered));
    // Lost scheduled operating hours are bounded by the same turn's maintenance;
    // no double attribution to preventive and corrective.
    const cmPart=Math.min(shortfall,corrective);
    const pmPart=Math.min(Math.max(0,shortfall-cmPart),preventive);
    const key=id;
    if(!assets.has(key))assets.set(key,{asset:id,modelId,title:group.title,
     planned:0,operating:0,correctiveLoss:0,preventiveLoss:0,turns:0});
    const a=assets.get(key);
    a.planned+=duty;a.operating+=delivered;
    a.correctiveLoss+=cmPart;a.preventiveLoss+=pmPart;a.turns++;
    group.operating+=delivered;group.planned+=duty;
    group.cmLoss+=cmPart;group.pmLoss+=pmPart;
    group.assetTurns++;group.activeAssets.add(id);
    planned+=duty;actual+=delivered;cm+=cmPart;pm+=pmPart;eligible++;
   }
   timeline.push({tick:sample.tick,planned:round(planned),operating:round(actual),
    correctiveLoss:round(cm),preventiveLoss:round(pm)});
  }
  const mappedModels=[...models.values()].map(g=>{
   const compliance=g.planned?round(100*g.operating/g.planned):null;
   return {modelId:g.modelId,title:g.title,category:g.category,
    targetPct:g.targetPct,operating:round(g.operating),planned:round(g.planned),
    gap:round(Math.max(0,g.planned-g.operating)),
    correctiveLoss:round(g.cmLoss),preventiveLoss:round(g.pmLoss),
    assetTurns:g.assetTurns,activeAssets:g.activeAssets.size,
    attainmentPct:compliance,withinTarget:compliance===null?null:compliance>=g.targetPct};
  });
  const detail=[...assets.values()].map(a=>({
   ...a,planned:round(a.planned),operating:round(a.operating),
   correctiveLoss:round(a.correctiveLoss),preventiveLoss:round(a.preventiveLoss),
   gap:round(Math.max(0,a.planned-a.operating)),
   attainmentPct:a.planned?round(a.operating/a.planned*100):null
  })).sort((a,b)=>a.modelId.localeCompare(b.modelId)||a.asset.localeCompare(b.asset));
  const sum=k=>round(mappedModels.reduce((s,m)=>s+m[k],0));
  const totalPlanned=sum('planned'),totalActual=sum('operating'),
   correctiveLoss=sum('correctiveLoss'),preventiveLoss=sum('preventiveLoss');
  return {version:VERSION,days:span,fromTick:from,throughTick:current,
   metrics:{plannedHours:totalPlanned,operatingHours:totalActual,
    shortfallHours:round(Math.max(0,totalPlanned-totalActual)),
    correctiveLossHours:correctiveLoss,preventiveLossHours:preventiveLoss,
    attainmentPct:totalPlanned?round(totalActual/totalPlanned*100):null,
    modelGoalsMet:mappedModels.filter(m=>m.withinTarget===true).length,
    modelsEvaluated:mappedModels.filter(m=>m.withinTarget!==null).length},
   models:mappedModels,assets:detail,timeline,
   coverage:{eligibleAssetTurns:eligible,missingDutySnapshots:unmeasured,
    requestedShifts:span*2,sampledShifts:rows.length,
    fullWindow:rows.length===span*2&&timeline.length===span*2,
    historyAtCapacity:(state.fleetTelemetry?.samples||[]).length>=120},
   note:'Horas de operação efetivamente cumpridas em relação à jornada programada. '
    +'Turnos anteriores sem registro da jornada não entram no cálculo. '
    +'A diferença é capacidade de operação não cumprida; não corresponde a tonelagem, '
    +'indisponibilidade física comprovada ou receita. Horas de perda atribuídas à '
    +'manutenção não ultrapassam a diferença da jornada. Metas são definidas pelo PCM.'};
 }
 return {VERSION,WINDOWS,TARGETS,DEFAULT_TARGET,setTarget,target,compute};
});