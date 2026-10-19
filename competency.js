/* P.O.R.C.A.R.I.A. v0.8.27 — conjugação de habilidades por OS e ganho por prática. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_COMPETENCY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const random=rng=>clamp(Number(rng())||0,0,.999999);
 // Apenas os sistemas presentes nos cenários de game-data.json.
 // Nenhuma consulta à causa verdadeira do cenário: não antecipar respostas.
 function resolve(scenario){
  const [sys='',group='',sub='']=scenario?.path||[];
  const category=scenario?.category||'geral';
  let system='structures'; // fallback conservador de catálogo
  if(sys==='DRTR')system=sub.startsWith('FID')?'final_drives':'transmission';
  else if(['ENSY','ENS1','ENS2'].includes(sys))system=group==='COSY'?'cooling':group==='FUSY'?'fuel':sub==='IKSY'?'air_intake':'engines';
  else if(sys==='SWAS')system='rotary_drives';
  else if(sys==='UNCR')system='undercarriage';
  else if(sys==='HYSY')system=group==='STSY'?'steering':sub==='HYPU'?'pumps':'hydraulic_circuit';
  else if(sys==='IMAT')system=category==='solda'?'structures':sub.startsWith('CYL')?'hydraulic_cylinders':'fps';
  else if(sys==='PRSY')system='hydraulic_circuit';
  else if(sys==='AISY')system=sub==='ECSY'?'embedded_electronics':'compressors';
  else if(sys==='MAST')system='drilling';
  else if(sys==='STSY')system='steering';
  else if(sys==='FRBO')system='structures';
  else if(sys==='OPCB')system='air_conditioning';
  else if(sys==='BOOM')system='fps';
  else system='structures'; // fallback conservador: não cria categoria inexistente.
  let discipline='maintenance_mechanics';
  if(category==='hidraulica')discipline='hydraulics';
  else if(category==='eletrica')discipline='electronics';
  else if(category==='solda')discipline='welding';
  else if(category==='perfuracao')discipline=system==='embedded_electronics'?'electronics':'fluid_mechanics';
  else if(category==='motor')discipline=system==='cooling'?'thermodynamics':'maintenance_mechanics';
  else if(category==='rodante')discipline=system==='final_drives'?'tribology':'maintenance_mechanics';
  return Object.freeze({disciplines:discipline,systems:system,machines:scenario?.modelId||''});
 }
 function evaluate(mechanic,scenario){
  const keys=resolve(scenario);
  const c=mechanic?.competencies||{};
  const D=clamp(Number(c.disciplines?.[keys.disciplines]??20),0,100);
  const S=clamp(Number(c.systems?.[keys.systems]??20),0,100);
  const M=clamp(Number(c.machines?.[keys.machines]??20),0,100);
  return Object.freeze({keys,discipline:D,system:S,machine:M,
   proficiency:Math.round((.40*D+.35*S+.25*M)*100)/100});
 }
 function diagnosisChance(mechanic,scenario){
  const P=evaluate(mechanic,scenario).proficiency;
  const roleMatch=mechanic?.role===scenario?.category?.toLowerCase() ? .08:0;
  const fatigue=mechanic?.mental<20 ? .30 : 0;
  const lowMorale=mechanic?.morale<25 ? .20 : 0;
  return clamp(.25+.006*P+roleMatch-fatigue-lowMorale,.20,.98);
 }
 function repairSpeed(mechanic,scenario){
  return clamp(.75+.007*evaluate(mechanic,scenario).proficiency,.75,1.40);
 }
 function practice(mechanic,scenario,rng=Math.random,allowedGroups=null){
  const keys=resolve(scenario),gains=[];
  const competency=mechanic?.competencies;
  if(!competency)return gains;
  for(const [group,key] of Object.entries(keys)){
   if(allowedGroups && !allowedGroups.includes(group))continue;
   if(!key||!competency[group]||!Number.isFinite(competency[group][key]))continue;
   const before=competency[group][key];
   if(before>=90)continue;
   const p=clamp(.30-.003*before,.03,.30);
   if(random(rng)>=p)continue;
   // Raro ganho duplo em nível menor; nunca ultrapassar 90 por serviço.
   const rare=before<=65&&random(rng)<.08;
   const after=Math.min(90,before+(rare?2:1));
   competency[group][key]=after;
   gains.push({group,key,before,after,gain:after-before,probability:p});
  }
  return gains;
 }
 return Object.freeze({resolve,evaluate,diagnosisChance,repairSpeed,practice});
});