/* P.O.R.C.A.R.I.A. — relatório pré-turno, derivado do estado real do motor.
 * Não altera o save e não prevê resultados aleatórios do turno.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_SHIFT_BRIEF=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const STATUSES={
  idle:{label:'BOX LIVRE',kind:'free'},
  diagnose:{label:'EM DIAGNÓSTICO',kind:'active'},
  repair:{label:'APTO AO REPARO',kind:'ready'},
  tool:{label:'FALTA FERRAMENTA',kind:'blocked'},
  material:{label:'AGUARDANDO PEÇA',kind:'blocked'}
 };
 function compute(state,data){
  if(!state||!data||!Array.isArray(state.jobs))throw new Error('Estado de jogo inválido para briefing');
  const count=Number.isInteger(state.bays)?state.bays:3;
  const jobs=state.jobs.filter(j=>j.assigned&&Number.isInteger(j.bay)&&j.bay>=0&&j.bay<count);
  const crew=new Map(state.team.map(m=>[m.id,m]));
  const scenarios=new Map(data.scenarios.map(s=>[s.id,s]));
  const models=new Map(data.models.map(m=>[m.id,m]));
  const bays=Array.from({length:count},(_,bay)=>{
   const j=jobs.find(job=>job.bay===bay);
   if(!j)return {bay,kind:'free',label:STATUSES.idle.label};
   const sc=scenarios.get(j.scene),mech=crew.get(j.assigned);
   let kind='diagnose',neededMaterial=null,neededTool=null;
   if(sc&&!state.tools[sc.tool]){kind='tool';neededTool=sc.tool}
   else if(j.stage>=6&&!j.materialUsed&&sc&&!(Number(state.stock[sc.material])>0)){
    kind='material';neededMaterial=sc.material;
   }else if(j.stage>=6){kind='repair'}
   const fatigued=!!mech&&(mech.mental<25||mech.physical<25);
   return {
    bay,kind,label:STATUSES[kind].label,id:j.id,model:models.get(j.modelId)?.title||j.modelId,
    priority:j.priority,stage:j.stage,assigned:mech?.name||'Não localizado',
    ageHours:Math.max(0,(state.tick-j.tickOpen)*8),fatigued,
    neededMaterial,neededTool,
    materialName:neededMaterial?(data.items[neededMaterial]?.name||neededMaterial):null,
    toolName:neededTool?(data.tools[neededTool]?.name||neededTool):null
   };
  });
  const deliveries=(state.orders||[])
   .filter(o=>Number.isFinite(o.eta)&&o.eta<=state.tick+1)
   .map(o=>({id:o.id,item:o.item,qty:o.qty,
     name:data.items[o.item]?.name||o.item,
     overdue:o.eta<state.tick+1}))
   .sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  const fatigue=state.team.filter(m=>m.assigned&&(m.mental<25||m.physical<25))
   .map(m=>({name:m.name,id:m.id,mental:m.mental,physical:m.physical}));
  const unattendedCritical=state.jobs.filter(j=>j.priority===3&&!j.assigned)
   .map(j=>({id:j.id,model:models.get(j.modelId)?.title||j.modelId,
    ageHours:Math.max(0,(state.tick-j.tickOpen)*8)}))
   .sort((a,b)=>b.ageHours-a.ageHours);
  const counts={
   assigned:jobs.length,free:bays.filter(b=>b.kind==='free').length,
   diagnosis:bays.filter(b=>b.kind==='diagnose').length,
   repair:bays.filter(b=>b.kind==='repair').length,
   blocked:bays.filter(b=>b.kind==='tool'||b.kind==='material').length,
   tool:bays.filter(b=>b.kind==='tool').length,
   material:bays.filter(b=>b.kind==='material').length
  };
  const payroll=state.shift===1?(state.team.length*220+180):0;
  return {
   tick:state.tick,day:state.day,shift:state.shift?'B':'A',nextShift:state.shift?'A':'B',
   bays,counts,deliveries,fatigue,unattendedCritical,payroll,
   // Entregas são processadas APÓS o trabalho do turno pelo engine.advance.
   deliveryNote:'Pedidos previstos para este avanço entram no estoque ao fim do turno; não desbloqueiam reparos durante as 8 horas.',
   deterministic:false
  };
 }
 return {compute,STATUSES};
});
