/* P.O.R.C.A.R.I.A. — Visão semanal PCM v0.7.9.
 * Projeção de CAPACIDADE BRUTA e fatos conhecidos; não simula nem altera o jogo.
 * Não prevê diagnósticos, produtividade, novas ocorrências ou liberação de boxes.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_WEEKLY=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const SHIFTS=14;
 const SHIFT_HOURS=12;
 const EFFECTIVE_HOURS=10.5;
 function calculate(state,data){
  if(!state||!data||!Array.isArray(state.jobs)||!Array.isArray(state.team)||!Array.isArray(state.orders))
   throw new Error('Estado inválido para quadro semanal');
  const bays=Number.isInteger(state.bays)&&state.bays>0?state.bays:3;
  const totalCrew=state.team.length;
  const capacitySlots=Math.min(bays,totalCrew);
  const restingNow=state.team.filter(m=>m.restAt===state.tick).length;
  // Descanso já solicitado impede alocação neste turno. Não extrapolar essa ausência para o futuro.
  const currentSlots=Math.min(bays,Math.max(0,totalCrew-restingNow));
  const ticks=Array.from({length:SHIFTS},(_,offset)=>{
   const currentTick=state.tick+offset;
   const phase=(state.shift+offset)%2;
   const day=state.day+Math.floor((state.shift+offset)/2);
   const shift=phase===0?'A':'B';
   const slots=offset===0?currentSlots:capacitySlots;
   const receipts=state.orders.filter(o=>Number.isFinite(o.eta)&&o.eta===currentTick+1)
    .map(o=>({id:o.id,item:o.item,qty:o.qty,name:data.items[o.item]?.name||o.item}));
   return {
    tick:currentTick,day,shift,slots,grossHH:slots*EFFECTIVE_HOURS,
    receipts,receiptCount:receipts.length,
    payrollAtEnd:phase===1?(totalCrew*220+180):0,
    current:offset===0
   };
  });
  const capacityHH=ticks.reduce((n,t)=>n+t.grossHH,0);
  const repairs=state.jobs.reduce((n,j)=>n+Math.max(0,Number(j.repairRemaining)||0),0);
  const stages=state.jobs.reduce((n,j)=>n+(j.stage<6?6-Math.max(0,j.stage):0),0);
  const awaitingDiagnosis=state.jobs.filter(j=>j.stage<6).length;
  const diagnosed=state.jobs.filter(j=>j.stage>=6).length;
  const critical=state.jobs.filter(j=>j.priority===3).length;
  const assigned=state.jobs.filter(j=>j.assigned).length;
  const awaitingParts=state.jobs.filter(j=>{
   if(j.stage<6||j.materialUsed)return false;
   const c=data.scenarios.find(s=>s.id===j.scene);
   return !!c&&!(Number(state.stock[c.material])>0);
  }).length;
  const toolBlocked=state.jobs.filter(j=>{
   const c=data.scenarios.find(s=>s.id===j.scene);
   return !!c&&!state.tools[c.tool];
  }).length;
  const demand=new Map();
  for(const j of state.jobs.filter(j=>j.stage>=6&&!j.materialUsed)){
   const sc=data.scenarios.find(s=>s.id===j.scene);
   if(!sc)continue;
   const k=sc.material;
   if(!demand.has(k))demand.set(k,{id:k,name:data.items[k]?.name||k,jobs:[],demand:0});
   const entry=demand.get(k);entry.jobs.push(j.id);entry.demand++;
  }
  const materials=[...demand.values()].map(e=>{
   const onHand=Math.max(0,Number(state.stock[e.id])||0);
   const incoming=state.orders.filter(o=>o.item===e.id&&Number.isFinite(o.eta)&&o.eta<=state.tick+SHIFTS)
    .sort((a,b)=>a.eta-b.eta).map(o=>({id:o.id,qty:o.qty,eta:o.eta,
      turnsRemaining:Math.max(0,o.eta-state.tick)}));
   const ordered=incoming.reduce((a,o)=>a+Math.max(0,Number(o.qty)||0),0);
   return {...e,onHand,incoming,ordered,
    gapNow:Math.max(0,e.demand-onHand),
    gapAfterKnownReceipts:Math.max(0,e.demand-onHand-ordered)};
  }).sort((a,b)=>b.gapNow-a.gapNow||a.name.localeCompare(b.name));
  const received=ticks.flatMap(t=>t.receipts);
  return {
   horizonShifts:SHIFTS,horizonHours:SHIFTS*SHIFT_HOURS,
   teamCount:totalCrew,bays,capacitySlots,restingNow,
   capacityHH,assigned,unassigned:state.jobs.length-assigned,
   backlog:state.jobs.length,critical,diagnosed,awaitingDiagnosis,
   pendingDiagnosticStages:stages,repairEquivalentHours:Math.round(repairs*10)/10,
   awaitingParts,toolBlocked,ticks,materials,
   receipts:received,receiptCount:received.length,
   fixedWageReference:ticks.reduce((sum,t)=>sum+t.payrollAtEnd,0),
   assumptions:[
    'HH úteis disponíveis = 10,5 h × min(boxes, mecânicos no quadro) por turno (12h menos DDS 0,5h e refeição 1h); descansos atuais são descontados apenas do primeiro turno.',
    'Horas remanescentes de reparo são unidades de esforço do simulador, não HH confirmadas de execução. Diagnósticos são mostrados em etapas, separadamente.',
    'Não foram previstos novos chamados, saídas, contratações, decisões de compra, produtividade, conclusão de OS ou liberação futura dos boxes.',
    'Pedidos com ETA são recebidos AO FINAL do turno correspondente; recebimento não garante atendimento de todas as OS que disputam o mesmo item.',
    'Materiais são relacionados somente para diagnósticos concluídos; mostrar peças antes do diagnóstico revelaria a falha do jogo.',
    'Custos de folha são referências fixas, assumindo quadro atual sem alterações. Não são previsão de caixa.'
   ]
  };
 }
 return {calculate,SHIFTS,SHIFT_HOURS,EFFECTIVE_HOURS};
});
