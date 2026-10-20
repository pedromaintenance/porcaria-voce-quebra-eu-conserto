/* P.O.R.C.A.R.I.A. — inspeções sensitivas didáticas, sem criação automática de OS.
   A observação pode gerar uma notificação distinta, pendente de revisão pelo PCM. */
(function(root,factory){
 const I=factory();if(typeof module!=='undefined'&&module.exports)module.exports=I;
 root.PORCARIA_INSPECTION=I;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const LIMIT_PER_SHIFT=3;
 function normalized(s){
  if(!Array.isArray(s.inspections))s.inspections=[];
  if(!Array.isArray(s.notifications))s.notifications=[];
  if(!Number.isSafeInteger(s.nextInspection)||s.nextInspection<1)
   s.nextInspection=1+Math.max(0,...s.inspections.map(x=>Number(String(x.id||'').replace(/^IN/,''))||0));
  if(!Number.isSafeInteger(s.nextNotification)||s.nextNotification<1)
   s.nextNotification=1+Math.max(0,...s.notifications.map(x=>Number(String(x.id||'').replace(/^NM/,''))||0));
  return s;
 }
 function plan(s,d){
  normalized(s);
  if(s.inspectionRoundTick===s.tick)return s.inspections.filter(x=>x.tick===s.tick);
  // Um plano por turno. Registros não realizados de turnos anteriores são preservados como vencidos.
  for(const i of s.inspections)if(i.status==='pending'&&i.tick<s.tick)i.status='expired';
  const busy=new Set((s.jobs||[]).map(j=>j.asset));
  const inspected=new Set(s.inspections.map(i=>i.asset).filter(Boolean));
  const models=(d.models||[]).filter(m=>(d.scenarios||[]).some(c=>c.modelId===m.id));
  const rotation=models.length?s.tick%models.length:0;
  const rotated=[...models.slice(rotation),...models.slice(0,rotation)];
  const chosen=[];
  for(let k=0;k<rotated.length&&chosen.length<LIMIT_PER_SHIFT;k++){
   const m=rotated[k],cases=d.scenarios.filter(c=>c.modelId===m.id);
   // Priorizar patrimônios sem OS e nunca gerar inspeção sobre uma máquina fictícia com OS ativa.
   const fleet=Array.from({length:6},(_,v)=>m.id+'·'+String(v+1).padStart(2,'0'));
   const candidates=fleet.filter(id=>!busy.has(id)&&!inspected.has(id));
   if(!candidates.length)continue;
   const asset=candidates[(s.tick+k)%candidates.length];
   const sc=cases[(s.tick+k)%cases.length];
   const id='IN'+String(s.nextInspection++).padStart(4,'0');
   const ordinal=chosen.length;
   chosen.push({id,asset,modelId:m.id,tick:s.tick,day:s.day,shift:s.shift,
    status:'pending',scene:sc.id,ordinal,
    // Resultado didático sem leitura numérica inventada nem diagnóstico causal.
    simulationOnly:true,notificationId:null,inspectedTick:null,observed:null});
   inspected.add(asset);
  }
  s.inspections.push(...chosen);
  s.inspectionRoundTick=s.tick;
  return chosen;
 }
 function inspect(s,d,id){
  normalized(s);
  const x=s.inspections.find(v=>v.id===id);
  if(!x)return {error:'Inspeção não encontrada.'};
  if(x.status!=='pending')return {error:'Esta inspeção já foi realizada ou venceu.'};
  if(x.tick!==s.tick)return {error:'A programação pertence a outro turno.'};
  const sc=d.scenarios.find(v=>v.id===x.scene);
  if(!sc)return {error:'Roteiro didático não encontrado.'};
  // Amostragem reprodutível e não clínica: aproximadamente uma em quatro inspeções sem achado.
  const anomaly=(s.tick+x.ordinal+1)%4!==0;
  x.status=anomaly?'finding':'clear';
  x.inspectedTick=s.tick;
  x.observed=anomaly
   ?'Indício observado no exercício: '+sc.operator
   :'Inspeção sensitiva simulada sem anormalidade aparente no roteiro deste turno.';
  x.observationSource='simulado_sem_medicao';
  return {ok:true,status:x.status,inspection:x};
 }
 function notify(s,id,description,priority){
  normalized(s);
  const x=s.inspections.find(v=>v.id===id);
  if(!x)return {error:'Inspeção não encontrada.'};
  if(x.status!=='finding'||x.notificationId)return {error:'É necessário um achado ainda não notificado.'};
  const text=String(description||'').trim().replace(/\s+/g,' ');
  if(text.length<15||text.length>600)return {error:'Descreva o defeito observado em 15 a 600 caracteres.'};
  if(!['baixa','media','alta'].includes(priority))return {error:'Selecione a prioridade da notificação.'};
  const idNew='NM'+String(s.nextNotification++).padStart(4,'0');
  const n={id:idNew,inspectionId:id,asset:x.asset,modelId:x.modelId,openedTick:s.tick,
   origin:'inspecao_sensitiva_simulada',description:text,reportedIndication:x.observed,
   priority,status:'aguarda_revisao_pcm',sourceScenario:x.scene,
   evidenceType:'observacao_simulada',workOrderId:null};
  s.notifications.push(n);x.notificationId=idNew;x.status='notified';
  return {ok:true,notification:n};
 }
 function summary(s){
  normalized(s);
  return {pending:s.inspections.filter(x=>x.tick===s.tick&&x.status==='pending').length,
   findings:s.inspections.filter(x=>x.status==='finding').length,
   awaiting:s.notifications.filter(x=>x.status==='aguarda_revisao_pcm').length,
   total:s.inspections.length,notifications:s.notifications.length};
 }
 return {normalized,plan,inspect,notify,summary,LIMIT_PER_SHIFT};
});