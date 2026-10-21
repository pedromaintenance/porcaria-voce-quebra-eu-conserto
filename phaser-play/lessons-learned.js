/* PORCARIA — Lições Aprendidas v10. Registros do jogo, sem validar causa raiz real.
 * Consulta sem mutações; reflexões escritas pelo jogador ficam no motor/save.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_LESSONS_LEARNED=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='10.0.0';
 const TAGS=Object.freeze({diagnostico:'Diagnóstico',planejamento:'Planejamento',
  materiais:'Materiais',execucao:'Execução',seguranca:'Segurança'});
 const nonneg=n=>Math.max(0,Number(n)||0);
 const round=n=>Math.round(nonneg(n)*10)/10;
 function evidence(j){
  const log=Array.isArray(j.diagnosticLog)?j.diagnosticLog:[];
  const counts={confirmed:0,rejected:0,inconclusive:0,evidence:0};
  for(const item of log)if(Object.hasOwn(counts,item.outcome||item.type||item.status)){counts[item.outcome||item.type||item.status]++}
  return counts;
 }
 function outcome(j){
  if(j.firstTime===true)return 'Concluída sem erro ou retrabalho segundo critérios do jogo.';
  if(nonneg(j.reworkHours)>0)return 'Houve retrabalho contabilizado; sua causa não pode ser isolada apenas pelo total.';
  if(j.firstTime===false)return 'Conclusão não classificada como primeira execução sem erro.';
  return 'O save não registra classificação de primeira execução.';
 }
 function compute(state,data,{filter='all',limit=60}={}){
  if(!state||!Array.isArray(state.done)||!data||!Array.isArray(data.scenarios))throw Error('Dados inválidos para Lições Aprendidas');
  const scenarios=new Map(data.scenarios.map(s=>[s.id,s]));
  const notes=Array.isArray(state.lessonNotes)?state.lessonNotes:[];
  const noteMap=new Map(notes.map(n=>[n.orderId,n]));
  const source=state.done.map(j=>{
   const sc=scenarios.get(j.scene),note=noteMap.get(j.id)||null;
   const prior=(state.decisionHistory||[]).filter(e=>e.orderId===j.id||e.notificationId&&e.notificationId===j.notificationId);
   const purchases=(state.purchaseHistory||[]).filter(p=>p.demandAtPurchase>0&&sc&&p.item===sc.material&&p.orderedTick>=j.tickOpen&&p.orderedTick<=(j.finishedTick??state.tick));
   const diagnostics=evidence(j);
   return {
    orderId:j.id,scene:j.scene,modelId:j.modelId,asset:j.asset,
    report:String(j.report||sc?.operator||''),caseTitle:String(sc?.title||j.title||'Cenário sem referência'),
    route:sc?{component:sc.component,damage:sc.damage,cause:sc.cause,
      verification:sc.verification,origin:sc.fmeaSource?.status||'gabarito_didatico'}:null,
    diagnosisCount:diagnostics,
    plannerErrors:nonneg(j.plannerDiagnosis?.errorCount),
    wrongSelections:nonneg(j.wrong),
    laborHH:round(j.worked),plannedHH:j.approvedScope?.estimatedHH!=null?round(j.approvedScope.estimatedHH):null,
    reworkHH:round(j.reworkHours),downtimeHours:round(j.elapsedHours),
    materialWaitShifts:nonneg(j.materialWaitShifts),toolWaitShifts:nonneg(j.toolWaitShifts),
    classification:outcome(j),firstTime:j.firstTime===true,
    decisions:prior.map(e=>({type:e.type,tick:e.tick,id:e.id})),
    purchases:purchases.map(p=>({id:p.id,fast:!!p.fast,paid:p.paid,eta:p.eta,receivedTick:p.receivedTick})),
    reflection:note?{tag:note.tag,text:note.text,updatedTick:note.updatedTick,revision:note.revision}:null,
    finishedTick:j.finishedTick
   };
  });
  const allowed=['all','pending','reviewed'];
  const mode=allowed.includes(filter)?filter:'all';
  const rows=source.filter(x=>mode==='all'||(mode==='reviewed')===!!x.reflection).slice(0,Math.max(1,Math.min(100,Number(limit)||60)));
  return {version:VERSION,filter:mode,total:source.length,
   withReflection:source.filter(x=>!!x.reflection).length,withoutReflection:source.filter(x=>!x.reflection).length,
   reviewed:source.filter(x=>!!x.reflection),rows,
   note:'Casos e diagnósticos são simulações didáticas. O gabarito não é causa raiz OEM confirmada; eventos de compra não são atribuídos causalmente a atrasos. Registros antigos podem não ter evidências ou reflexões.'};
 }
 function similarForActive(state,job){
  const related=(state.done||[]).filter(x=>x.scene===job.scene&&x.id!==job.id);
  if(!related.length)return {count:0,unlocked:false,reflections:[]};
  if(Number(job.stage??0)<6)return {count:related.length,unlocked:false,reflections:[]};
  const notes=Array.isArray(state.lessonNotes)?state.lessonNotes:[];
  const ids=new Set(related.map(x=>x.id));
  const selected=notes.filter(n=>ids.has(n.orderId)).slice(-3).reverse();
  return {count:related.length,unlocked:true,
   reflections:selected.map(n=>({orderId:n.orderId,tag:n.tag,text:n.text}))};
 }
 return {VERSION,TAGS,evidence,outcome,compute,similarForActive};
});
