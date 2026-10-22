/* PORCARIA v0.9.18 — Ciclo 15 | telemetria exclusivamente VIRTUAL.
 * 12 h por turno são divididas entre operação, standby e manutenção.
 * Zero telemetria OEM; horas de reparo ao fechar OS são proxy de liberação.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_FLEET_TELEMETRY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='15.0.0',SHIFT_HOURS=12,MAX_SAMPLES=120,MAX_FAILURES=80;
 const DUTY_CHOICES=Object.freeze([0,4,8,12]),NEW_DUTY=8,LEGACY_DUTY=12;
 const ids=d=>(d?.models||[]).flatMap(m=>Array.from({length:6},(_,i)=>m.id+'·'+String(i+1).padStart(2,'0')));
 const nonneg=n=>Number.isFinite(Number(n))?Math.max(0,Number(n)):0;
 const round=n=>Math.round(n*10)/10;
 const empty=()=>({hourmeter:0,correctiveDown:0,preventiveDown:0,standbyHours:0,failures:[],lastState:'unobserved'});
 function normalize(s,d){
  if(!s||!Array.isArray(d?.models))throw Error('Frota inválida para telemetria.');
  const newSave=!s.fleetTelemetry?.assets;
  if(newSave)s.fleetTelemetry={version:VERSION,startedTick:s.tick,throughTick:s.tick,
   policyStartedTick:s.tick,assets:{},dutyHours:{},samples:[]};
  const f=s.fleetTelemetry,wasOld=f.version!==VERSION;
  if(!Array.isArray(f.samples))f.samples=[];
  if(!Number.isInteger(f.startedTick))f.startedTick=s.tick;
  if(!Number.isInteger(f.throughTick))f.throughTick=s.tick;
  // Dados do ciclo anterior ficam no acumulado, sem inventar standby retroativo.
  if(!Number.isInteger(f.policyStartedTick))f.policyStartedTick=s.tick;
  if(!f.dutyHours||typeof f.dutyHours!=='object')f.dutyHours={};
  for(const id of ids(d)){
   if(!f.assets[id])f.assets[id]=empty();
   if(!Number.isFinite(f.assets[id].standbyHours))f.assets[id].standbyHours=0;
   if(!DUTY_CHOICES.includes(f.dutyHours[id]))f.dutyHours[id]=newSave?NEW_DUTY:LEGACY_DUTY;
  }
  if(wasOld&&!newSave)f.policyStartedTick=s.tick;
  f.version=VERSION;
  return f;
 }
 function setDuty(s,d,id,hours){
  const h=Number(hours);
  if(!ids(d).includes(id))return 'Ativo não encontrado na frota simulada.';
  if(!DUTY_CHOICES.includes(h))return 'Jornada deve ser 0, 4, 8 ou 12 h/turno.';
  const f=normalize(s,d);
  f.dutyHours[id]=h;
  return null;
 }
 function failure(s,d,order,origin){
  const f=normalize(s,d),asset=f.assets[order?.asset];
  if(!asset||!['random','progression'].includes(origin)||!order?.id)return null;
  if(asset.failures.some(x=>x.orderId===order.id))return null;
  const entry={orderId:order.id,tick:s.tick,hourmeter:round(asset.hourmeter),origin};
  asset.failures.push(entry);asset.failures=asset.failures.slice(-MAX_FAILURES);
  return entry;
 }
 function projected(s,asset){
  if((s.jobs||[]).some(j=>j.asset===asset))return 'corrective';
  if((s.preventiveOrders||[]).some(j=>j.asset===asset&&j.status==='in_progress'))
   return 'preventive';
  if((s.preventiveJobs||[]).some(j=>j.asset===asset&&j.tick===s.tick&&j.status==='planned'))
   return 'preventive';
  if((s.fleetTelemetry?.dutyHours?.[asset]??NEW_DUTY)===0)return 'standby';
  return 'operating_assumed';
 }
 function advance(s,d,{correctiveAssets,completedRepairHours={}}={}){
  const f=normalize(s,d),tick=s.tick;
  if(tick!==f.throughTick)return {error:'Horímetro duplicado ou lacuna de turno; nenhuma hora foi somada.'};
  const correction=new Set(Array.isArray(correctiveAssets)?correctiveAssets:
   (s.jobs||[]).map(x=>x.asset));
  const summary={tick,operating:0,standby:0,corrective:0,preventive:0};
  const perAsset=[];
  for(const id of ids(d)){
   const asset=f.assets[id],duty=f.dutyHours[id];
   const pm=(s.preventiveJobs||[]).filter(x=>x.asset===id&&x.tick===tick&&
    (x.status==='completed'||x.status==='planned'));
   const isCorrective=correction.has(id)||s.jobs?.some(x=>x.asset===id);
   const pmOrders=(s.preventiveOrders||[]).filter(r=>r.asset===id&&r.lastWorkTick===tick
     &&(r.status==='completed'||r.status==='in_progress'));
   let cm=0,preventive=0;
   if(isCorrective){
    // A OS só libera parte do turno quando foi CONCLUÍDA e não há nova OS para o ativo.
    const done=Number(completedRepairHours[id]);
    cm=Number.isFinite(done)&&done>=0&&!s.jobs.some(x=>x.asset===id)
     ?Math.min(SHIFT_HOURS,Math.max(0.5,round(done))):SHIFT_HOURS;
   }else if(pm.length||pmOrders.length){
    preventive=Math.min(SHIFT_HOURS,pm.reduce((n,p)=>n+nonneg(p.hours),0)+
      pmOrders.reduce((n,p)=>n+nonneg(p.lastWorkHours),0));
   }
   const available=round(Math.max(0,SHIFT_HOURS-cm-preventive));
   const op=round(Math.min(duty,available)),standby=round(available-op);
   const total=round(op+standby+cm+preventive);
   if(Math.abs(total-SHIFT_HOURS)>0.0001)return {error:'Balanço virtual não fecha 12 h para '+id};
   asset.hourmeter=round(nonneg(asset.hourmeter)+op);
   asset.correctiveDown=round(nonneg(asset.correctiveDown)+cm);
   asset.preventiveDown=round(nonneg(asset.preventiveDown)+preventive);
   asset.standbyHours=round(nonneg(asset.standbyHours)+standby);
   asset.lastState=cm?(cm===SHIFT_HOURS?'corrective':'corrective_partial'):
    preventive?'preventive':op?'operating_assumed':'standby';
   summary.operating+=op;summary.standby+=standby;
   summary.corrective+=cm;summary.preventive+=preventive;
   perAsset.push({asset:id,operating:op,standby,corrective:cm,preventive});
  }
  for(const k of ['operating','standby','corrective','preventive'])summary[k]=round(summary[k]);
  f.samples.push({...summary,perAsset});f.samples=f.samples.slice(-MAX_SAMPLES);
  f.throughTick=tick+1;
  return {...summary,total:round(summary.operating+summary.standby+summary.corrective+summary.preventive)};
 }
 function compute(s,d,{days=14}={}){
  if(!s||!Array.isArray(d?.models))throw Error('Estado inválido para horímetros virtuais.');
  const span=[7,14,30].includes(Number(days))?Number(days):14,now=Number(s.tick)||0;
  const f=s.fleetTelemetry,allIds=ids(d);
  if(!f?.assets)return {version:VERSION,available:false,days:span,assets:[],models:[],metrics:{},
   coverage:{sampledTicks:0,requestedTicks:span*2,complete:false},
   message:'Medição virtual não inicializada: inicie no turno atual; não há histórico retroativo.'};
  const start=Math.max(0,now-span*2),policyStart=Number.isInteger(f.policyStartedTick)?f.policyStartedTick:now;
  // NÃO incluir dados V14 em denominadores de utilização V15.
  const rows=(f.samples||[]).filter(x=>x.tick>=Math.max(start,policyStart)&&x.tick<now&&
   Number.isFinite(Number(x.standby))&&Array.isArray(x.perAsset));
  const sum=k=>round(rows.reduce((n,r)=>n+nonneg(r[k]),0));
  const op=sum('operating'),idle=sum('standby'),cm=sum('corrective'),pm=sum('preventive');
  const measured=round(op+idle+cm+pm),avail=round(op+idle);
  const assets=allIds.map(id=>{
   const r=f.assets[id]||empty(),ev=Array.isArray(r.failures)?r.failures:[];
   const seen=ev.filter(x=>x.tick>=Math.max(start,policyStart)&&x.tick<=now);
   const valid=[];
   for(let i=1;i<ev.length;i++)if(ev[i].tick>=Math.max(start,policyStart)&&
    ev[i].tick<=now&&ev[i-1].tick>=policyStart&&ev[i].hourmeter>=ev[i-1].hourmeter)
     valid.push(ev[i].hourmeter-ev[i-1].hourmeter);
   const intervals=valid.length;
   const mr=d.models.find(m=>id.startsWith(m.id+'·'));
   const state=projected(s,id);
   const sampleTotals={operating:0,standby:0,corrective:0,preventive:0};
   for(const row of rows){
    const measuredAsset=row.perAsset.find(x=>x.asset===id);
    if(measuredAsset)for(const k of Object.keys(sampleTotals))sampleTotals[k]+=nonneg(measuredAsset[k]);
   }
   for(const k of Object.keys(sampleTotals))sampleTotals[k]=round(sampleTotals[k]);
   const sumAsset=Object.values(sampleTotals).reduce((n,x)=>n+x,0);
   return {asset:id,model:mr?.title||mr?.name||mr?.id||id,
    hourmeter:round(nonneg(r.hourmeter)),standbyHours:round(nonneg(r.standbyHours)),
    correctiveDown:round(nonneg(r.correctiveDown)),preventiveDown:round(nonneg(r.preventiveDown)),
    currentState:state,lastState:r.lastState,dutyHours:f.dutyHours?.[id]??LEGACY_DUTY,
    operatingHoursWindow:sampleTotals.operating,standbyHoursWindow:sampleTotals.standby,
    correctiveDownWindow:sampleTotals.corrective,preventiveDownWindow:sampleTotals.preventive,
    availabilityPct:sumAsset?round((sampleTotals.operating+sampleTotals.standby)/sumAsset*100):null,
    utilizationPct:(sampleTotals.operating+sampleTotals.standby)?
     round(sampleTotals.operating/(sampleTotals.operating+sampleTotals.standby)*100):null,
    failures:seen.length,validIntervals:intervals,
    mtbfHours:intervals?round(valid.reduce((a,b)=>a+b,0)/intervals):null};
  });
  const countIntervals=assets.reduce((n,a)=>n+a.validIntervals,0);
  const mtbf=countIntervals?round(assets.reduce((n,a)=>n+(a.mtbfHours||0)*a.validIntervals,0)/countIntervals):null;
  const names=d.models.map(m=>{
   const subset=assets.filter(x=>x.asset.startsWith(m.id+'·'));
   return {modelId:m.id,name:m.title||m.name||m.id,assets:subset.length,
    hourmeter:round(subset.reduce((n,a)=>n+a.hourmeter,0)),
    failures:subset.reduce((n,a)=>n+a.failures,0),
    correctiveDown:round(subset.reduce((n,a)=>n+a.correctiveDown,0)),
    preventiveDown:round(subset.reduce((n,a)=>n+a.preventiveDown,0)),
    standbyHours:round(subset.reduce((n,a)=>n+a.standbyHours,0))};
  });
  const tickSet=new Set(rows.map(r=>r.tick));
  const full=rows.length===span*2&&Number(f.throughTick)===now&&policyStart<=start &&
   Array.from({length:span*2},(_,i)=>now-span*2+i).every(t=>tickSet.has(t));
  return {version:VERSION,available:true,startedTick:f.startedTick,policyStartedTick:policyStart,
   throughTick:f.throughTick,days:span,assets,models:names,
   metrics:{operatingHours:op,standbyHours:idle,correctiveDownHours:cm,preventiveDownHours:pm,
    theoreticalHours:measured,availableHours:avail,
    operationalAvailabilityPct:measured?round(avail/measured*100):null,
    effectiveUtilizationPct:avail?round(op/avail*100):null,
    occupancyPct:measured?round(op/measured*100):null,
    maintenanceAvailabilityPct:measured?round((avail+pm)/measured*100):null,
    mtbfHours:mtbf,mtbfIntervals:countIntervals,
    failureEvents:assets.reduce((n,x)=>n+x.failures,0),trackedAssets:allIds.length},
   coverage:{sampledTicks:rows.length,requestedTicks:span*2,complete:full,
    historyTruncated:(f.samples||[]).length>=MAX_SAMPLES,methodologyStartedTick:policyStart},
   message:'SIMULAÇÃO: jornada de 0/4/8/12h definida pelo jogador. Horas remanescentes em standby. OS aberta indisponibiliza o turno; OS concluída pode liberar parte dele usando HH de reparo como proxy, não timestamp de retorno. Disponibilidade = (operação + standby)/horas classificadas; utilização = operação/(operação + standby). Horímetro, MTBF, produtividade e paradas NÃO são dados reais de mina/OEM. Saves V14 mantêm seus acumulados, mas não são incluídos na janela de cálculo do método V15.'};
 }
 return {VERSION,SHIFT_HOURS,MAX_SAMPLES,DUTY_CHOICES,assetIDs:ids,
  normalize,setDuty,failure,projected,advance,compute};
});