/* PORCARIA 0.9.17 — Ciclo 14: telemetria operacional VIRTUAL da frota.
 * As 54 máquinas são presumidas em operação quando não há OS ou preventiva;
 * standby real, produção e horímetro OEM NÃO são observados.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_FLEET_TELEMETRY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='14.0.0',SHIFT_HOURS=12,MAX_SAMPLES=120,MAX_FAILURES=80;
 const HOURS_PER_TICK=SHIFT_HOURS;
 const assetIDs=d=>(d?.models||[]).flatMap(m=>Array.from({length:6},(_,i)=>m.id+'·'+String(i+1).padStart(2,'0')));
 const nonnegative=n=>Number.isFinite(Number(n))?Math.max(0,Number(n)):0;
 const round=n=>Math.round(n*10)/10;
 const emptyAsset=()=>({hourmeter:0,correctiveDown:0,preventiveDown:0,failures:[],lastState:'unobserved'});
 function normalize(s,d){
  if(!s||!Array.isArray(d?.models))throw Error('Frota inválida para telemetria.');
  if(!s.fleetTelemetry||!s.fleetTelemetry.assets){
   s.fleetTelemetry={version:VERSION,startedTick:s.tick,throughTick:s.tick,assets:{},samples:[]};
  }
  const f=s.fleetTelemetry;
  f.version=VERSION;
  if(!Array.isArray(f.samples))f.samples=[];
  if(!Number.isInteger(f.startedTick))f.startedTick=s.tick;
  if(!Number.isInteger(f.throughTick))f.throughTick=s.tick;
  for(const id of assetIDs(d))if(!f.assets[id])f.assets[id]=emptyAsset();
  return f;
 }
 function failure(s,d,order,origin){
  const f=normalize(s,d);
  const asset=f.assets[order?.asset];
  if(!asset||!['random','progression'].includes(origin))return null;
  if(asset.failures.some(x=>x.orderId===order.id))return null;
  const event={orderId:order.id,tick:s.tick,hourmeter:round(asset.hourmeter),origin};
  asset.failures.push(event);
  asset.failures=asset.failures.slice(-MAX_FAILURES);
  return event;
 }
 function projected(s,asset){
  if((s.jobs||[]).some(j=>j.asset===asset))return 'corrective';
  if((s.preventiveJobs||[]).some(j=>j.asset===asset&&j.tick===s.tick&&j.status==='planned'))
   return 'preventive';
  return 'operating_assumed';
 }
 function advance(s,d){
  const f=normalize(s,d);
  // Às vezes o mesmo save pode ser revalidado; jamais duplicar horas no mesmo turno.
  if(s.tick<f.throughTick)return {error:'Horímetro virtual à frente do relógio da campanha.'};
  if(s.tick!==f.throughTick)return {error:'Lacuna de turnos no horímetro virtual. Não extrapolar horas.'};
  const tick=s.tick,summary={tick,operating:0,corrective:0,preventive:0};
  for(const [id,asset] of Object.entries(f.assets)){
   const state=projected(s,id);
   let preventive=0,corrective=0,operating=0;
   if(state==='corrective')corrective=HOURS_PER_TICK;
   else if(state==='preventive'){
    preventive=Math.min(HOURS_PER_TICK,
     (s.preventiveJobs||[]).filter(r=>r.asset===id&&r.tick===tick&&r.status==='planned')
      .reduce((n,r)=>n+nonnegative(r.hours),0));
    operating=HOURS_PER_TICK-preventive;
   } else operating=HOURS_PER_TICK;
   asset.hourmeter=round(asset.hourmeter+operating);
   asset.correctiveDown=round(asset.correctiveDown+corrective);
   asset.preventiveDown=round(asset.preventiveDown+preventive);
   asset.lastState=state;
   summary.operating+=operating;summary.corrective+=corrective;summary.preventive+=preventive;
  }
  f.samples.push(summary);
  f.samples=f.samples.slice(-MAX_SAMPLES);
  f.throughTick=tick+1;
  return {...summary,total:summary.operating+summary.corrective+summary.preventive};
 }
 function compute(s,d,{days=14}={}){
  if(!s||!Array.isArray(d?.models))throw Error('Estado inválido para horímetros virtuais.');
  const ids=assetIDs(d),f=s.fleetTelemetry;
  const span=[7,14,30].includes(Number(days))?Number(days):14;
  const now=Number(s.tick)||0;
  if(!f||!f.assets)return {version:VERSION,available:false,
   startedTick:null,days:span,assets:[],metrics:{},coverage:{sampledTicks:0,requestedTicks:span*2,complete:false},
   message:'Telemetria não inicializada: iniciar medição no turno atual sem inventar passado.'};
  const start=Math.max(0,now-span*2);
  const rows=(f.samples||[]).filter(x=>x.tick>=start&&x.tick<now);
  const sum=k=>round(rows.reduce((n,row)=>n+nonnegative(row[k]),0));
  const operating=sum('operating'),cm=sum('corrective'),pm=sum('preventive');
  const measured=operating+cm+pm;
  const perAsset=ids.map(id=>{
   const m=d.models.find(x=>id.startsWith(x.id+'·'));
   const row=f.assets[id]||emptyAsset(),events=Array.isArray(row.failures)?row.failures:[];
   const seen=events.filter(e=>e.tick>=start&&e.tick<=now);
   const intervals=[];
   for(let i=1;i<events.length;i++)
    if(events[i].tick>=start&&events[i].tick<=now&&events[i].hourmeter>=events[i-1].hourmeter)
     intervals.push(events[i].hourmeter-events[i-1].hourmeter);
   const pairs=intervals.length;
   return {asset:id,model:m?.title||m?.name||m?.id||id,
    hourmeter:round(nonnegative(row.hourmeter)),correctiveDown:round(nonnegative(row.correctiveDown)),
    preventiveDown:round(nonnegative(row.preventiveDown)),
    currentState:projected(s,id),lastState:row.lastState,
    failures:seen.length,mtbfHours:pairs?round(intervals.reduce((a,b)=>a+b,0)/pairs):null,
    validIntervals:pairs};
  });
  const totalIntervals=perAsset.reduce((n,r)=>n+r.validIntervals,0);
  // Média ponderada pelos intervalos observados, não média simples dos MTBF de ativos.
  const mtbf=totalIntervals?round(perAsset.reduce((n,r)=>n+(r.mtbfHours||0)*r.validIntervals,0)/totalIntervals):null;
  const tickRange=new Set(rows.map(x=>x.tick));
  const firstExpected=Math.max(start,Number(f.startedTick));
  let complete=Number(f.throughTick)===now;
  for(let t=firstExpected;t<now;t++)if(!tickRange.has(t)){complete=false;break}
  if(f.startedTick>start)complete=false; // Não alegar janela completa em save migrado.
  const models=Array.from(d.models,m=>{
   const group=perAsset.filter(x=>x.asset.startsWith(m.id+'·'));
   return {modelId:m.id,name:m.title||m.name||m.id,
    hourmeter:round(group.reduce((n,x)=>n+x.hourmeter,0)),
    assets:group.length,failures:group.reduce((n,x)=>n+x.failures,0),
    correctiveDown:round(group.reduce((n,x)=>n+x.correctiveDown,0)),
    preventiveDown:round(group.reduce((n,x)=>n+x.preventiveDown,0))};
  });
  return {version:VERSION,available:true,days:span,startedTick:f.startedTick,throughTick:f.throughTick,
   assets:perAsset,models,
   metrics:{operatingHours:operating,correctiveDownHours:cm,preventiveDownHours:pm,
    theoreticalHours:measured,
    operationalAvailabilityPct:measured?round(operating/measured*100):null,
    maintenanceAvailabilityPct:measured?round((operating+pm)/measured*100):null,
    mtbfHours:mtbf,mtbfIntervals:totalIntervals,
    failureEvents:perAsset.reduce((n,r)=>n+r.failures,0),
    trackedAssets:ids.length},
   coverage:{sampledTicks:rows.length,requestedTicks:span*2,complete,historyTruncated:(f.samples||[]).length>=MAX_SAMPLES},
   message:'Valores EXCLUSIVAMENTE VIRTUAIS. Toda máquina sem OS é presumida operando 12 h/turno; preventivas consomem 2/4 h de parada e OS corretiva ocupa o turno inteiro. Não há standby real, horímetro OEM ou intervalos parciais de falha. MTBF virtual utiliza pares de ocorrências aleatórias/progressivas por ativo, não notificações manuais; é nulo sem dois eventos. Sem histórico retroativo nos saves antigos.'};
 }
 return {VERSION,SHIFT_HOURS,MAX_SAMPLES,assetIDs,normalize,failure,projected,advance,compute};
});