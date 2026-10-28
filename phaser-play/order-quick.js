/* P.O.R.C.A.R.I.A. 0.8.25 — grupos de diagnóstico e referências SAP; lógica inalterada. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_ORDER_QUICK=api;
})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const esc=s=>String((typeof globalThis!=='undefined'&&globalThis.PORCARIA_IMMERSIVE_COPY?.clean(s))??s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>Number(n||0).toLocaleString('pt-BR',{maximumFractionDigits:0});
 function render({job:j,state,data,model,scenario,diagnostic:r,preferredBay=null,feedback=null,repairAssists=[]}){
  if(!j)return '<p class="orderEmpty">Nenhuma OS selecionada.</p>';
  const shell=['<article class="quickOrder">'];
  shell.push('<div class="quickIdentity"><strong>'+esc(model?.title||j.modelId)+' · '+esc(j.id)+'</strong><span>'+esc(j.assigned?'BOX '+(Number(j.bay)+1)+' · '+(state.team.find(m=>m.id===j.assigned)?.name||'Equipe'):'AGUARDANDO ALOCAÇÃO')+'</span></div>');
  shell.push('<div class="quickReport"><small>DESCRIÇÃO DA FALHA · OPERADOR / INSPETOR</small><p>'+esc(j.report||'Descrição não informada.')+'</p></div>');
  if(!j.assigned){
   const busy=new Set(state.jobs.map(x=>x.assigned).filter(Boolean));
   const free=state.team.filter(x=>!busy.has(x.id)&&x.restAt!==state.tick&&!(x.normativeUntil>state.tick)&&!(state.training?.assignments||[]).some(a=>a.untilTick>state.tick&&(a.learnerId===x.id||a.trainerId===x.id)));
   const bays=[0,1,2].filter(n=>!state.jobs.some(x=>x.bay===n));
   if(free.length&&bays.length){
    shell.push('<div class="quickAllocation"><label>Mecânico<select id="mechanic">'+free.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.name)+' ('+esc(m.id)+') · '+esc(m.specialty||m.role)+'</option>').join('')+'</select></label>');
    shell.push('<label>Box<select id="bay">'+bays.map(n=>'<option value="'+n+'"'+(n===preferredBay?' selected':'')+'>BOX '+(n+1)+'</option>').join('')+'</select></label></div>');
   }else shell.push('<p class="quickNotice">Sem mecânico ou box livre. Libere um serviço ou aguarde o próximo turno.</p>');
   shell.push('<div class="quickActions">'+(free.length&&bays.length?'<button class="act" data-do="assign">ALOCAR</button>':'')+
    '<button class="act secondary" data-order-details>DETALHES</button><button class="act secondary" data-order-close>FECHAR</button></div>');
   return shell.join('')+'</article>';
  }
  const steps=(r?.steps||[]).slice(0,6);
  const sapEquivalent=['M, Nível 6','M, Nível 7','M, Nível 8','Parte objeto','Perda','Causa'];
  const renderStep=(x,i)=>'<div class="quickStep '+esc(x.status)+'"><small>'+esc(x.label)+'</small>'
   +'<b>'+esc(x.status==='confirmed'?x.result:x.status==='current'?'EM ANÁLISE':'PENDENTE')+'</b>'
   +'<span class="quickSapRef" aria-label="Referência SAP: '+esc(sapEquivalent[i])+'">'
   +'<img src="./assets/ui/sap-flag.png" alt="" width="34" height="17">'
   +'<span class="quickSapText">'+esc(sapEquivalent[i])+'</span></span></div>';
  const group=(label,type,icon,offset)=>'<section class="quickStageGroup '+type+'" aria-label="'+esc(label)+'">'
   +'<h3 class="quickStageGroupTitle"><span aria-hidden="true">'+icon+'</span> '+esc(label)+'</h3>'
   +'<div class="quickSteps" role="group" aria-label="'+esc(label)+'">'
   +steps.slice(offset,offset+3).map((step,i)=>renderStep(step,offset+i)).join('')
   +'</div></section>';
  shell.push('<div class="quickProgress"><div class="quickSectionHeading"><strong>DIAGNÓSTICO</strong><span>'+Number(r?.stage||0)+'/6 ETAPAS</span></div>');
  shell.push('<div class="quickStageGroups" aria-label="Seis etapas do diagnóstico">'
   +group('LOCAL DE INSTALAÇÃO','location','📍',0)
   +group('MODO DE FALHA','failure','⚙',3)
   +'</div></div>');
  if(feedback?.jobId===j.id) shell.push('<p class="quickFeedback '+(feedback.ok?'ok':'wrong')+'" role="status">'+esc(feedback.text)+'</p>');
  if(r?.complete){
   const v=i=>esc(steps[i]?.result||'A confirmar');
   shell.push('<div class="quickFinding"><strong>✓ DIAGNÓSTICO CONCLUÍDO</strong><p><b>Componente:</b> '+v(3)+'</p><p><b>Dano:</b> '+v(4)+'</p><p><b>Causa:</b> '+v(5)+'</p></div>');
   if(scenario?.material){
    const part=data.items?.[scenario.material];
    const available=Number(state.stock?.[scenario.material]||0);
    const inbound=(state.orders||[]).filter(p=>p.item===scenario.material).reduce((sum,p)=>sum+Number(p.qty||0),0);
    shell.push('<div class="quickPart"><span>Peça: <b>'+esc(part?.name||scenario.material)+'</b> · '+available+' no estoque'+(inbound?' · '+inbound+' em trânsito':'')+'</span>'+
     (available<=0&&!j.materialUsed?'<button class="act" data-do="order">COMPRAR PEÇA · R$ '+money((part?.unit||0)*1.65)+'</button>':'')+'</div>');
   }
   for(const assist of repairAssists.filter(x=>x.supported)){
    const name=assist.kind==='bolt'?'🔧 APERTAR PARAFUSOS':'🔨 MARRETAR PINO';
    shell.push('<div class="repairAssistOffer"><strong>ASSISTÊNCIA MECÂNICA</strong>'
     +'<small>'+esc(assist.available?'Ajude o mecânico neste turno.':'Indisponível: '+assist.reason)+'</small>'
     +'<button class="act" type="button" data-repair-assist-start="'+esc(j.id)+'" data-repair-assist-kind="'+esc(assist.kind)+'" '+(assist.available?'':'disabled')+'>'+name+'</button></div>');
   }
  }else if(!state.tools?.[scenario?.tool]){
   const tool=data.tools?.[scenario?.tool];
   shell.push('<div class="quickMissingTool"><span>⚠ Ferramenta necessária para o diagnóstico: <b>'+esc(tool?.name||scenario?.tool||'Ferramenta')+'</b></span>'+
    '<button class="act" data-do="tool">COMPRAR FERRAMENTA · R$ '+money(tool?.cost)+'</button></div>');
  }else{
   shell.push('<div class="quickSectionHeading"><strong>HIPÓTESES · '+esc(r?.currentLabel||'Etapa')+'</strong><span>ESCOLHA UMA OPÇÃO</span></div>');
   shell.push('<div class="quickOptions">'+(j.options?.[j.stage]||[]).map(o=>
    '<button class="quickOption" data-answer="'+esc(o.id)+'">'+esc(o.label)+'</button>'
   ).join('')+'</div>');
   if(r?.currentGuidance?.evidence) shell.push('<p class="quickEvidence"><b>EVIDÊNCIA:</b> '+esc(r.currentGuidance.evidence)+'</p>');
   else shell.push('<button class="act secondary quickEvidenceButton" data-do="hint">SOLICITAR EVIDÊNCIA</button>');
  }
  shell.push('<div class="quickActions compactAssigned"><button class="act secondary" data-order-details>DETALHES</button></div>');
  return shell.join('')+'</article>';
 }
 return Object.freeze({render});
});
