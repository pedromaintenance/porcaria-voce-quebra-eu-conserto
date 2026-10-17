/* P.O.R.C.A.R.I.A. 0.8.8 — diagnóstico didático, somente leitura e sem spoilers.
 * Todas as evidências da fase atual são orientações metodológicas, NÃO respostas.
 * Lições e verificação específicas do cenário aparecem APENAS após as 6 confirmações.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_DIAGNOSTIC=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const LABELS=Object.freeze(['Sistema','Grupo','Subgrupo','Componente','Dano','Causa']);
 const TITLES={confirmed:'Confirmado',rejected:'Hipótese incorreta',inconclusive:'Tentativa inconclusiva',evidence:'Evidência solicitada'};
 const COACH=Object.freeze([
  {question:'Qual sistema funcional pode explicar o sintoma relatado?',
   guidance:'Relacione a manifestação do operador à função do equipamento. Compare sistemas possíveis antes de escolher.',
   evidence:'Localize a região relatada, identifique quando o sintoma aparece e compare manifestações de sistemas diferentes. Registre o que realmente observou.',
   learning:'Delimitar o sistema reduz a área de investigação; não comprova sozinho qual componente falhou.'},
  {question:'Qual grupo dentro do sistema merece investigação?',
   guidance:'Trace o caminho funcional entre o sistema identificado, seus grupos e o relato. Evite saltar diretamente para a peça.',
   evidence:'Consulte o arranjo funcional do sistema e identifique interfaces, conexões e condições de operação de cada grupo candidato.',
   learning:'O grupo orienta a inspeção, mas ainda não prova dano nem causa raiz.'},
  {question:'Em qual subgrupo o mecanismo de falha pode estar localizado?',
   guidance:'Procure discriminar os subconjuntos por função e por sinais observáveis, não apenas pela proximidade física.',
   evidence:'Planeje uma verificação que diferencie subgrupos possíveis; documente a área exata e a condição do teste.',
   learning:'A localização por subgrupo organiza a investigação; precisa ser seguida de inspeção do componente.'},
  {question:'Qual componente é compatível com os sinais disponíveis?',
   guidance:'Compare funções, interfaces, histórico e indícios. Não condene uma peça apenas por associação com o sintoma.',
   evidence:'Faça inspeção segura de condição, integridade, fixação, folgas e vazamentos quando aplicável. Confirme por teste adequado antes de substituir.',
   learning:'Identificar componente suspeito não determina automaticamente o dano nem a causa.'},
  {question:'Qual modo de dano descreve a alteração encontrada?',
   guidance:'Separe descrição objetiva de condição (dano) da explicação de por que ela ocorreu (causa).',
   evidence:'Registre condição observável, extensão e sinais associados; compare a descrição do dano com os critérios do catálogo.',
   learning:'O dano caracteriza o estado observado. O mecanismo causal depende de investigação adicional.'},
  {question:'Qual causa é sustentada pelos indícios coletados?',
   guidance:'Não confunda efeito, mecanismo e causa raiz. Uma condição de óleo, ruído ou vazamento isolado não prova a origem.',
   evidence:'Busque evidências independentes, histórico de manutenção, condições operacionais e um teste discriminante antes de concluir a causa.',
   learning:'A causa selecionada no exercício é uma hipótese do cenário; no campo, confirmação exige evidência suficiente.'}
 ]);
 const label=(j,idx,code)=>j.options?.[idx]?.find(o=>o.id===code)?.label||String(code||'Valor confirmado sem descrição');
 function compute(state,data,j){
  if(!state||!data||!j||!Array.isArray(data.scenarios))throw Error('Dados inválidos do diagnóstico');
  const stage=Math.min(6,Math.max(0,Math.trunc(Number(j.stage)||0)));
  const scenario=data.scenarios.find(s=>s.id===j.scene);
  const answers=scenario?[...scenario.path,scenario.component,scenario.damage,scenario.cause]:[];
  const known=Array.isArray(j.diagnosticLog)?j.diagnosticLog.filter(e=>Number.isInteger(e?.stage)&&e.stage>=0&&e.stage<6&&Object.prototype.hasOwnProperty.call(TITLES,e.outcome)):[];
  const confirmedStage=new Map(known.filter(e=>e.outcome==='confirmed'&&e.stage<stage).map(e=>[e.stage,e]));
  const legacy=[];
  const steps=LABELS.map((name,i)=>{
   if(i>=stage)return {index:i,label:name,status:i===stage?'current':'pending',result:null,source:null,mechanicName:null,explanation:null};
   let event=confirmedStage.get(i);
   if(!event){event={tick:null,stage:i,outcome:'confirmed',source:'unknown',mechanicName:null,
      value:label(j,i,answers[i]),legacy:true};legacy.push(event)}
   let explanation=COACH[i].learning;
   // Critérios provenientes do catálogo são expostos somente depois da confirmação.
   if(i===4||i===5){
    const catalog=i===4?data.catalog?.damages:data.catalog?.causes;
    const entry=Array.isArray(catalog)?catalog.find(x=>x.pt===answers[i]):null;
    if(entry?.criteria)explanation+=' Critério de catálogo: '+entry.criteria;
   }
   return {index:i,label:name,status:'confirmed',result:event.value||label(j,i,answers[i]),
    source:event.source,mechanicName:event.mechanicName||null,explanation};
  });
  // Saves anteriores à 0.8.8 podem conter a resposta correta registrada na "evidência".
  // Jamais renderizar a carga bruta desses eventos, mesmo que importada por arquivo.
  const log=[...legacy,...known].map(e=>({
   tick:Number.isInteger(e.tick)?e.tick:null,stage:e.stage,stageLabel:LABELS[e.stage],
   kind:e.outcome,title:TITLES[e.outcome],
   source:e.source==='player'?'player':e.source==='mechanic'?'mechanic':'unknown',
   mechanicName:e.mechanicName||null,
   value:e.outcome==='evidence'?'Solicitação de inspeção orientativa registrada':String(e.value||''),
   legacy:!!e.legacy
  }));
  const confirmations=steps.filter(e=>e.status==='confirmed');
  const byPlayer=confirmations.filter(e=>e.source==='player');
  const byMechanic=confirmations.filter(e=>e.source==='mechanic');
  const byUnknown=confirmations.filter(e=>e.source==='unknown');
  const hasHint=!!j.hints?.[stage]&&stage<6;
  const currentGuidance=stage<6?{question:COACH[stage].question,guidance:COACH[stage].guidance,
   evidence:hasHint?COACH[stage].evidence:null}:null;
  const caseStudy=stage===6&&scenario?{
   verification:String(scenario.verification||'Não há procedimento descrito para este cenário.'),
   lesson:String(scenario.lesson||'Não há lição técnica descrita para este cenário.'),
   provenance:'Dados didáticos de game-data.json; não significam que este teste foi executado na oficina real.'
  }:null;
  return {
   stage,progress:Math.round(stage/6*100),complete:stage===6,
   currentIndex:stage===6?null:stage,currentLabel:stage===6?'Diagnóstico concluído':LABELS[stage],
   steps,log,confirmed:confirmations,player:byPlayer,mechanic:byMechanic,unknown:byUnknown,
   hasHint,clue:hasHint?COACH[stage].evidence:'',currentGuidance,caseStudy,
   wrongCount:Math.max(0,Number(j.wrong)||0),
   assignedMechanic:state.team?.find(m=>m.id===j.assigned)?.name||null,
   methodology:'Etapas confirmadas pelo jogador e pelo mecânico são distintas. Evidências orientam como investigar, sem dar respostas. Critérios de dano e causa são exibidos somente após confirmação; verificação e lição do caso são mostradas após a etapa 6. Histórico anterior pode não registrar a autoria.'
  };
 }
 return {compute,LABELS};
});