/* P.O.R.C.A.R.I.A. v0.8.26 — Setor de Treinamentos: lógica de turnos, sem DOM. */
(function(root,factory){
 const mod=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=mod;
 if(root)root.PORCARIA_TRAINING=mod;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const chance=(x,a,b)=>Math.max(a,Math.min(b,x));
 const rand=rng=>Math.min(.9999999,Math.max(0,Number(rng())||0));
 const validGroups=new Set(['disciplines','systems','machines']);
 const TRAINING_HOURS=12;
 const normal=(s)=>{
  if(!s.training||typeof s.training!=='object')s.training={};
  const t=s.training;
  t.version=1;
  for(const k of ['assignments','offers','history','notices'])if(!Array.isArray(t[k]))t[k]=[];
  if(!Number.isInteger(t.nextId)||t.nextId<1)t.nextId=1;
  if(!Number.isInteger(t.lastOfferTick))t.lastOfferTick=-1;
  if(!Number.isInteger(t.lastSafetyTick))t.lastSafetyTick=-1;
  return t;
 };
 const level=(m,group,key)=>Number(m?.competencies?.[group]?.[key]??0);
 const active=(s,m)=>!!m && (
  (Number.isFinite(m.normativeUntil)&&m.normativeUntil>s.tick) ||
  normal(s).assignments.some(a=>a.untilTick>s.tick&&(a.learnerId===m.id||a.trainerId===m.id))
 );
 const reason=(s,m)=>{
  if(!m)return 'Funcionário inexistente.';
  if(m.assigned)return 'Profissional alocado em OS.';
  if(m.restAt===s.tick)return 'Profissional em descanso no turno.';
  if(Number.isFinite(m.normativeUntil)&&m.normativeUntil>s.tick)return 'Treinamento normativo obrigatório em andamento.';
  if(active(s,m))return 'Profissional reservado para treinamento neste turno.';
  return null;
 };
 const qualification=(catalog,group,key)=>{
  if(!validGroups.has(group)||!catalog?.[group]?.some(x=>x.id===key))return 'Selecione uma habilidade válida.';
  return null;
 };
 function onboard(s,member){
  const t=normal(s);
  member.normativeUntil=s.tick+2;
  member.normativeReason='integração normativa obrigatória';
  const notice={id:'N'+t.nextId++,tick:s.tick,kind:'onboarding',personId:member.id,
   text:'Bia informa: '+member.name+' fará integração normativa por 2 turnos (24h) e ficará disponível no próximo dia.'};
  t.notices.unshift(notice);
  t.notices=t.notices.slice(0,40);
  return notice;
 }
 function inspectInternal(s,trainerId,learnerId,group,key,catalog){
  normal(s);
  const trainer=s.team.find(x=>x.id===trainerId),learner=s.team.find(x=>x.id===learnerId);
  if(!trainer||!learner)return {error:'Selecione treinador e aprendiz válidos.'};
  if(trainerId===learnerId)return {error:'O treinador e o aprendiz devem ser pessoas diferentes.'};
  const issue=qualification(catalog,group,key)||reason(s,trainer)||reason(s,learner);
  if(issue)return {error:issue};
  const T=level(trainer,group,key),A=level(learner,group,key),gap=T-A;
  const cap=Math.min(95,T-2);
  if(gap<5)return {error:'Treinador precisa superar o aprendiz em pelo menos 5 pontos.'};
  if(A>=cap)return {error:'O aprendiz já atingiu o teto ensinável por este treinador.'};
  return {trainer,learner,group,key,T,A,gap,cap,chance:chance(.2+.005*gap,.2,.7),
   potentialGain:gap>=30?2:1};
 }
 function internal(s,trainerId,learnerId,group,key,catalog){
  const info=inspectInternal(s,trainerId,learnerId,group,key,catalog);
  if(info.error)return info.error;
  const t=normal(s);
  t.assignments.push({id:'T'+t.nextId++,kind:'internal',startTick:s.tick,untilTick:s.tick+1,
   trainerId,learnerId,group,key,initial:info.A,teacherLevel:info.T,
   chance:info.chance,cap:info.cap,potentialGain:info.potentialGain,cost:0});
  return null;
 }
 function courseCost(group,key,premium=false){
  const high=group==='machines'&&['EQ02','EQ05','EQ06'].includes(key);
  return (high?1500:group==='machines'?1050:group==='systems'?850:600)*(premium?2:1);
 }
 function external(s,personId,offerId,catalog){
  const t=normal(s),member=s.team.find(x=>x.id===personId);
  if(!member)return 'Selecione um participante válido.';
  const issue=reason(s,member);if(issue)return issue;
  const offer=t.offers.find(o=>o.id===offerId);
  if(!offer||offer.untilTick<=s.tick)return 'Oferta indisponível ou expirada.';
  if(qualification(catalog,offer.group,offer.key))return 'O curso não possui habilidade válida.';
  const current=level(member,offer.group,offer.key),cap=offer.premium?100:97;
  if(current>=cap)return 'O participante já atingiu o limite desta capacitação.';
  if(s.cash<offer.cost)return 'Caixa insuficiente para a inscrição.';
  s.cash-=offer.cost;
  t.offers=t.offers.filter(o=>o.id!==offerId);
  t.assignments.push({id:'T'+t.nextId++,kind:'external',startTick:s.tick,untilTick:s.tick+1,
   trainerId:null,learnerId:personId,group:offer.group,key:offer.key,
   initial:current,teacherLevel:100,cap,chance:chance(.35+.005*(100-current),.35,.85),
   potentialGain:current<45?3:current<75?2:1,cost:offer.cost,premium:!!offer.premium});
  return null;
 }
 function afterShift(s,catalog,rng=Math.random,log=()=>{}){
  const t=normal(s),today=s.tick;
  const left=[];
  for(const a of t.assignments){
   if(a.untilTick>today){left.push(a);continue}
   const learner=s.team.find(m=>m.id===a.learnerId);
   const current=learner?level(learner,a.group,a.key):a.initial;
   const succeeded=!!learner&&rand(rng)<a.chance&&current<a.cap;
   const gain=succeeded?Math.max(0,Math.min(a.cap-current,a.potentialGain)):0;
   if(learner&&gain>0)learner.competencies[a.group][a.key]=current+gain;
   t.history.unshift({id:a.id,kind:a.kind,tick:today,personId:a.learnerId,
    trainerId:a.trainerId,group:a.group,key:a.key,before:current,after:current+gain,
    gain,cost:a.cost,premium:!!a.premium,success:gain>0,hours:TRAINING_HOURS});
   log((learner?.name||'Funcionário')+' concluiu treinamento '+(a.kind==='internal'?'interno':'externo')+
    ' de '+a.key+' ('+current+' → '+(current+gain)+').');
  }
  t.assignments=left;
  for(const m of s.team){
   if(Number.isFinite(m.normativeUntil)&&m.normativeUntil<=today){
    const kind=m.normativeReason==='integração normativa obrigatória'?'onboarding':'mandatory';
    t.history.unshift({id:'N'+t.nextId++,kind,tick:today,personId:m.id,
     trainerId:null,group:null,key:null,before:null,after:null,gain:0,cost:0,success:true,hours:kind==='onboarding'?24:12});
    m.normativeUntil=null;m.normativeReason=null;
    log('Bia registrou conclusão normativa de '+m.name+'. Profissional liberado para a oficina.');
   }
  }
  t.history=t.history.slice(0,180);
  t.offers=t.offers.filter(o=>o.untilTick>today);
  // Oferta e segurança são eventos de baixo volume, sem alterar a distribuição de falhas do motor.
  if(t.offers.length===0&&t.lastOfferTick!==today&&rand(rng)<.25){
   t.lastOfferTick=today;
   const groups=['disciplines','systems','machines'];const group=groups[Math.floor(rand(rng)*groups.length)];
   const list=catalog[group];const item=list[Math.floor(rand(rng)*list.length)];
   const premium=rand(rng)<.12;
   const id='E'+t.nextId++;
   t.offers.push({id,group,key:item.id,title:item.label,cost:courseCost(group,item.id,premium),
    premium,untilTick:today+3});
   t.notices.unshift({id:'N'+t.nextId++,tick:today,kind:'external',
    text:'Bia informa: '+(premium?'capacitação externa premium':'curso externo')+' em '+item.label+' disponível.'});
  }
  if(t.lastSafetyTick!==today&&rand(rng)<.10){
   t.lastSafetyTick=today;
   const candidates=s.team.filter(m=>!reason(s,m)&&m.normativeUntil==null);
   if(candidates.length){
    const m=candidates[Math.floor(rand(rng)*candidates.length)];
    m.normativeUntil=today+1;
    m.normativeReason='exigência da Segurança do Trabalho';
    t.notices.unshift({id:'N'+t.nextId++,tick:today,kind:'mandatory',personId:m.id,
     text:'Bia informa: Segurança do Trabalho exige atualização normativa de '+m.name+' por 1 turno.'});
    log('Segurança do Trabalho requisitou atualização normativa de '+m.name+'.');
   }
  }
  t.notices=t.notices.slice(0,40);
 }
 return Object.freeze({normal,active,reason,onboard,inspectInternal,internal,courseCost,external,afterShift,TRAINING_HOURS});
});