/* Bancada PCM: verificações fictícias, sem ensaios físicos nem validação OEM. */
(function(root,factory){
 const T=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=T;
 root.PORCARIA_EVIDENCE=T;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const FAMILIES=Object.freeze({
  fuel:{label:'CAT 777E · Perda de potência e combustível',modelId:'EQ01',cases:['INC066','INC067']},
  air:{label:'DI650i · Baixa pressão de ar',modelId:'EQ06',cases:['INC076','INC077']},
  final:{label:'CAT 777E · Ruído no comando final',modelId:'EQ01',cases:['INC086','INC087']}
 });
 function available(s,d,id){
  const n=s.notifications?.find(x=>x.id===id);
  const sc=d.scenarios.find(x=>x.id===n?.sourceScenario&&x.modelId===n?.modelId);
  const used=new Set((n?.evidenceTests||[]).map(x=>x.testId));
  return (sc?.diagnosticTests||[]).map(t=>({
   id:t.id,label:t.label,tool:t.tool,toolName:d.tools[t.tool]?.name||t.tool,
   cost:t.cashCost,available:!!s.tools?.[t.tool],completed:used.has(t.id)
  }));
 }
 function run(s,d,I,id,testId){
  I.normalized(s);
  const n=s.notifications.find(x=>x.id===id);
  if(!n)return {error:'Notificação não encontrada.'};
  if(n.status!=='aguarda_revisao_pcm')return {error:'Teste indisponível após decisão PCM.'};
  const sc=d.scenarios.find(x=>x.id===n.sourceScenario&&x.modelId===n.modelId);
  const t=sc?.diagnosticTests?.find(x=>x.id===testId);
  if(!t||t.simulationOnly!==true)return {error:'Teste didático não cadastrado.'};
  if(!d.tools[t.tool]||!s.tools?.[t.tool])return {error:'Ferramenta necessária: '+(d.tools[t.tool]?.name||t.tool)+'.'};
  if(!Array.isArray(n.evidenceTests))n.evidenceTests=[];
  if(n.evidenceTests.some(x=>x.testId===t.id))return {error:'Este teste já foi realizado.'};
  if(n.evidenceTests.length>=3)return {error:'Limite de três verificações por notificação.'};
  if(!Number.isSafeInteger(t.cashCost)||t.cashCost<0||s.cash<t.cashCost)return {error:'Caixa insuficiente para o teste virtual.'};
  s.cash-=t.cashCost;
  const evidence={testId:t.id,label:t.label,tool:t.tool,outcome:t.outcome,
   result:t.result,limits:t.limits,tick:s.tick,cost:t.cashCost,
   source:'resultado_ficticio_sem_medicao_OEM'};
  n.evidenceTests.push(evidence);
  if(!Array.isArray(n.reviewHistory))n.reviewHistory=[];
  n.reviewHistory.push({tick:s.tick,action:'evidence_test',reason:'Teste didático '+t.label,origin:'simulador'});
  return {ok:true,evidence,notification:n};
 }
 return {FAMILIES,available,run};
});