/* P.O.R.C.A.R.I.A. 0.8.7 — relatório de diagnóstico (somente leitura).
 * Respostas ainda pendentes não são incluídas no relatório.
 * Saves anteriores recebem histórico confirmado de autoria não rastreável.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_DIAGNOSTIC=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const LABELS=Object.freeze(['Sistema','Grupo','Subgrupo','Componente','Dano','Causa']);
 const TITLES={confirmed:'Confirmado',rejected:'Hipótese incorreta',inconclusive:'Tentativa inconclusiva',evidence:'Evidência coletada'};
 function compute(state,data,j){
  if(!state||!data||!j||!Array.isArray(data.scenarios))throw Error('Dados inválidos do diagnóstico');
  const stage=Math.min(6,Math.max(0,Math.trunc(Number(j.stage)||0)));
  const scenario=data.scenarios.find(s=>s.id===j.scene);
  const answers=scenario?[...scenario.path,scenario.component,scenario.damage,scenario.cause]:[];
  const known=Array.isArray(j.diagnosticLog)?j.diagnosticLog.filter(e=>Number.isInteger(e?.stage)&&e.stage>=0&&e.stage<6&&TITLES[e.outcome]):[];
  const confirmedStage=new Map(known.filter(e=>e.outcome==='confirmed'&&e.stage<stage).map(e=>[e.stage,e]));
  const valueFor=(idx)=>j.options?.[idx]?.find(o=>o.id===answers[idx])?.label||String(answers[idx]||'Valor confirmado sem descrição');
  const legacy=[];
  const steps=LABELS.map((label,i)=>{
   if(i>=stage)return {index:i,label,status:i===stage?'current':'pending',result:null,source:null,mechanicName:null};
   let event=confirmedStage.get(i);
   if(!event){event={tick:null,stage:i,outcome:'confirmed',source:'unknown',mechanicName:null,
     value:valueFor(i),legacy:true};legacy.push(event)}
   return {index:i,label,status:'confirmed',result:event.value||valueFor(i),
     source:event.source,mechanicName:event.mechanicName||null};
  });
  // Entradas históricas não inventam qual profissional participou de saves antigos.
  const log=[...legacy,...known].map(e=>({
   tick:Number.isInteger(e.tick)?e.tick:null,stage:e.stage,
   stageLabel:LABELS[e.stage],kind:e.outcome,title:TITLES[e.outcome],
   source:e.source==='player'?'player':e.source==='mechanic'?'mechanic':'unknown',
   mechanicName:e.mechanicName||null,value:String(e.value||''),legacy:!!e.legacy
  }));
  const confirmations=steps.filter(e=>e.status==='confirmed');
  const byPlayer=confirmations.filter(e=>e.source==='player');
  const byMechanic=confirmations.filter(e=>e.source==='mechanic');
  const byUnknown=confirmations.filter(e=>e.source==='unknown');
  // A dica só é exposta SE tiver sido solicitada, nunca por antecipação.
  const hasHint=!!j.hints?.[stage]&&stage<6;
  const clue=hasHint&&scenario
   ?(stage<3?scenario.path[stage]:[scenario.component,scenario.damage,scenario.verification][stage-3])||scenario.verification||''
   :'';
  return {
   stage,progress:Math.round(stage/6*100),complete:stage===6,
   currentIndex:stage===6?null:stage,currentLabel:stage===6?'Diagnóstico concluído':LABELS[stage],
   steps,log,confirmed:confirmations,player:byPlayer,mechanic:byMechanic,unknown:byUnknown,
   hasHint,clue:String(clue),wrongCount:Math.max(0,Number(j.wrong)||0),
   assignedMechanic:state.team?.find(m=>m.id===j.assigned)?.name||null,
   methodology:'Acertos: etapas confirmadas pelo jogador. Descobertas: etapas concluídas pelo mecânico no avanço de turno. Atribuição desconhecida em saves antigos. Hipóteses rejeitadas e tentativas inconclusivas não avançam a investigação.'
  };
 }
 return {compute,LABELS};
});