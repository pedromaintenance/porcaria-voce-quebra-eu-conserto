/* PORCARIA — Preventiva x corretiva / Ciclo 12.
 * Regras DIDÁTICAS calibráveis, não probabilidades de falha OEM.
 * Serviço preventivo é autorizado pelo jogador; não é OS corretiva automática.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_PREVENTIVE=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='12.0.0';
 const PACKAGES=Object.freeze({
  inspection:Object.freeze({label:'Inspeção preventiva',hours:2,cost:120,reduction:0.25,duration:4}),
  service:Object.freeze({label:'Serviço preventivo',hours:4,cost:360,reduction:0.45,duration:8})
 });
 const MAX_HISTORY=150;
 const jobs=s=>Array.isArray(s.preventiveJobs)?s.preventiveJobs:[];
 const effects=s=>Array.isArray(s.preventiveEffects)?s.preventiveEffects:[];
 const active=s=>jobs(s).filter(x=>x.status==='planned'&&x.tick===s.tick);
 const modelFor=(d,id)=>d.models.find(m=>m.id===id);
 const assetModel=asset=>/^(EQ0[1-9])·(0[1-6])$/.exec(String(asset||''))?.[1]||null;
 const inTraining=(s,id)=>(s.training?.assignments||[]).some(a=>a.untilTick>s.tick&&(a.learnerId===id||a.trainerId===id));
 function risk(s,asset,tick=s.tick){
  const latest=effects(s).filter(x=>x.asset===asset&&x.expiresTick>tick)
   .sort((a,b)=>b.appliedTick-a.appliedTick)[0];
  return latest?{reduction:latest.reduction,expiresTick:latest.expiresTick,packageId:latest.packageId}
   :{reduction:0,expiresTick:null,packageId:null};
 }
 function book(s,d,asset,mechanicId,bay,packageId,audit=()=>{}){
  const p=PACKAGES[packageId],mid=assetModel(asset);
  const m=s.team?.find(x=>x.id===mechanicId);
  const b=Number(bay);
  if(!p)return 'Selecione um pacote preventivo válido.';
  if(!mid||!modelFor(d,mid))return 'Ativo não pertence à frota simulada.';
  if(!m)return 'Profissional não encontrado.';
  if(!Number.isInteger(b)||b<0||b>=(s.bays||3))return 'Box inválido.';
  if((s.jobs||[]).some(x=>x.asset===asset))return 'Ativo possui OS corretiva em aberto.';
  if((s.notifications||[]).some(n=>n.asset===asset&&n.monitorOnly&&['aguarda_revisao_pcm','monitorando'].includes(n.status)))
   return 'Ativo sob monitoramento especial; conclua a avaliação antes da preventiva.';
  if(m.assigned||m.restAt===s.tick||m.normativeUntil>s.tick||inTraining(s,m.id))
   return 'Profissional indisponível neste turno.';
  if((s.jobs||[]).some(j=>j.bay===b))return 'Box ocupado por uma OS corretiva.';
  if((s.scheduleEntries||[]).some(x=>x.status==='planned'&&x.tick===s.tick&&(x.mechanicId===m.id||x.bay===b)))
   return 'Recurso reservado por programação PCM deste turno.';
  if(active(s).some(x=>x.mechanicId===m.id||x.bay===b||x.asset===asset))
   return 'Conflito: profissional, box ou ativo já reservado para preventiva.';
  const inspected=s.inspectionLabor?.tick===s.tick?Number(s.inspectionLabor.byEmployee?.[m.id])||0:0;
  if(inspected+p.hours>10.5)return 'HH do turno comprometidas com inspeções programadas.';
  if(!(Number(s.cash)>=p.cost))return 'Caixa insuficiente para autorizar a preventiva.';
  if(!Array.isArray(s.preventiveJobs))s.preventiveJobs=[];
  const n=Math.max(1,Number(s.nextPreventive)||1);
  const row={id:'PV'+String(n).padStart(5,'0'),tick:s.tick,asset,modelId:mid,
   mechanicId:m.id,bay:b,packageId,hours:p.hours,cost:p.cost,status:'planned'};
  s.preventiveJobs.push(row);
  s.preventiveJobs=s.preventiveJobs.slice(-MAX_HISTORY);
  s.nextPreventive=n+1;
  s.cash-=p.cost;
  audit('preventive_authorized',{preventiveId:row.id,asset,modelId:mid,mechanicId:m.id,
   bay:b,packageId,hours:p.hours,cost:p.cost,classification:'custo_ficticio_autorizado'});
  return null;
 }
 function cancel(s,id,audit=()=>{}){
  const row=active(s).find(x=>x.id===id);
  if(!row)return 'Reserva preventiva ativa não encontrada.';
  row.status='cancelled';row.closedTick=s.tick;
  s.cash+=row.cost;
  audit('preventive_cancelled',{preventiveId:row.id,asset:row.asset,refunded:row.cost});
  return null;
 }
 function allocationBlock(s,mid,bay){
  return active(s).some(x=>x.mechanicId===mid||x.bay===bay)
   ?'Profissional ou box reservado para preventiva neste turno. Cancele a reserva primeiro.'
   :null;
 }
 function settle(s,consumeHours=()=>{},audit=()=>{}){
  let hh=0;
  if(!Array.isArray(s.preventiveEffects))s.preventiveEffects=[];
  if(!s.preventiveMetrics)s.preventiveMetrics={executed:0,cost:0,hours:0,screenedRandomCandidates:0};
  for(const row of active(s)){
   const p=PACKAGES[row.packageId],m=s.team.find(x=>x.id===row.mechanicId);
   if(!p||!m||m.assigned||m.restAt===s.tick){
    row.status='cancelled';row.closedTick=s.tick;s.cash+=row.cost;
    audit('preventive_cancelled',{preventiveId:row.id,asset:row.asset,refunded:row.cost,
     reason:'recurso_indisponivel_no_turno'});
    continue;
   }
   row.status='completed';row.closedTick=s.tick;
   const expiresTick=s.tick+p.duration+1; // A proteção vale nos próximos p.duration turnos.
   s.preventiveEffects=s.preventiveEffects.filter(x=>x.asset!==row.asset&&x.expiresTick>s.tick);
   s.preventiveEffects.push({asset:row.asset,packageId:row.packageId,
    reduction:p.reduction,appliedTick:s.tick,expiresTick});
   s.preventiveEffects=s.preventiveEffects.slice(-80);
   s.preventiveMetrics.executed++;
   s.preventiveMetrics.cost+=row.cost;
   s.preventiveMetrics.hours+=p.hours;
   hh+=p.hours;
   consumeHours(m,p.hours);
   audit('preventive_completed',{preventiveId:row.id,asset:row.asset,packageId:row.packageId,
    hours:p.hours,cost:row.cost,reduction:p.reduction,expiresTick,
    classification:'probabilidade_didatica_sem_garantia'});
  }
  return hh;
 }
 function screenRandomCandidate(s,asset,rng=Math.random){
  const coverage=risk(s,asset),chance=Math.max(0,Math.min(1,coverage.reduction));
  if(!chance)return false;
  if(Number(rng())>=chance)return false;
  if(!s.preventiveMetrics)s.preventiveMetrics={executed:0,cost:0,hours:0,screenedRandomCandidates:0};
  s.preventiveMetrics.screenedRandomCandidates++;
  return true;
 }
 function compute(s,d){
  if(!s||!Array.isArray(s.team)||!Array.isArray(d?.models))throw Error('Dados inválidos para preventiva.');
  const all=Array.from(d.models,model=>Array.from({length:6},(_,i)=>{
   const asset=model.id+'·'+String(i+1).padStart(2,'0'),cover=risk(s,asset);
   const blocked=(s.jobs||[]).some(x=>x.asset===asset);
   return {asset,model:model.title||model.name||model.id,blocked,
    covered:cover.reduction>0,reduction:cover.reduction,expiresTick:cover.expiresTick};
  })).flat();
  const rows=jobs(s).slice(-35).reverse().map(row=>({...row,
   mechanic:s.team.find(m=>m.id===row.mechanicId)?.name||row.mechanicId,
   label:PACKAGES[row.packageId]?.label||row.packageId}));
  const metrics=s.preventiveMetrics||{};
  return {version:VERSION,assets:all,rows,planned:active(s).length,
   completed:Number(metrics.executed)||0,spent:Number(metrics.cost)||0,
   hours:Number(metrics.hours)||0,screened:Number(metrics.screenedRandomCandidates)||0,
   note:'Probabilidades, custos, prazos e efeitos são parâmetros fictícios do jogo, não taxas de falha OEM. O contador de sorteios barrados não é falha comprovadamente evitada. Preventiva exige box, HH e profissional e não apaga OS abertas.'};
 }
 return {VERSION,PACKAGES,risk,book,cancel,allocationBlock,settle,screenRandomCandidate,compute};
});