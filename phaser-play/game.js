/* P.O.R.C.A.R.I.A. Phaser vertical slice v0.9.0 · motor de simulacao v1.1 */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const E=window.PORCARIA_ENGINE;
const I=window.PORCARIA_INSPECTION;
const IV=window.PORCARIA_INSPECTION_VIEW;
const STAGES=['Sistema','Grupo','Subgrupo','Componente','Dano','Causa'];
const SAVE='porcaria.phaser.prototype.v01';
const ASSETS={
 truck:'./assets/equipment/cat777e_v3.webp',
 shovel:'./assets/equipment/cat6030.png',
 excavator:'./assets/equipment/cat395.png?v=20261019-3px',
 drill:'./assets/equipment/sandvik_di650i_v0828.webp', // DI650i: arte original do usuário, WebP VP8L lossless com alfa.
 dr410i:'./assets/equipment/sandvik_dr410i_v2.webp', // imagem DR410i fornecida pelo jogador.
 dozer:'./assets/equipment/catd9-dozer-v0819.webp',
 loader:'./assets/equipment/cat966-loader-v0819.webp',
 grader:'./assets/equipment/cat16-grader-v0819.webp',

 // Trabalhadores oficiais são carregados como sprite sheets independentes.
 // As imagens antigas de Lia e Rafael permanecem no Git como arquivo histórico,
 // mas não são solicitadas pela oficina Phaser.
};
const MACHINES={EQ01:'truck',EQ02:'shovel',EQ03:'excavator',EQ04:'excavator',EQ05:'dr410i',EQ06:'drill',EQ07:'dozer',EQ08:'loader',EQ09:'grader'};
const WORKER_SHEETS=Object.freeze({
 barbosa:'./assets/characters/barbosa-4poses.webp',
 garcia:'./assets/characters/garcia-4poses.webp',
 braga:'./assets/characters/braga-4poses.webp',
 almeida:'./assets/characters/almeida-4poses.webp',
 sousa:'./assets/characters/sousa-4poses.webp',
 pereira:'./assets/characters/pereira-4poses.webp',
 costa:'./assets/characters/costa-4poses.webp',
 silva:'./assets/characters/silva-4poses.webp',
 santos:'./assets/characters/santos-4poses.webp',
 moura:'./assets/characters/moura-4poses.webp',
 pedro:'./assets/characters/pedro-v0829-4poses.png',
 geovane:'./assets/characters/geovane-4poses.webp',
 acassio:'./assets/characters/acassio-4poses.png',
 junior:'./assets/characters/junior/junior-work-4poses.webp'
});
// Uniforme de treinamento não é carregado como sprite da oficina.
const TEAM_PORTRAITS=Object.freeze({junior:'./assets/characters/junior/junior-training-4poses.webp'});
const WORKER_FRAME={width:580,height:622,poses:4};
const WORKER_RENDER_FRAME={width:290,height:311}; // amostragem intermediária independente por pose
const WORKER_DISPLAY={width:66,height:80}; // 22% maior, mantendo âncora inferior e boxes
const WORKER_POSES={blocked:[0],diagnose:[0,2,1,2],repair:[0,3,2,3]};
let MODEL_PRESENTATION={};
let BACKGROUND_PROFILES=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>Math.round(n).toLocaleString('pt-BR');
let data,state,selected,scene;
let trainingUI={tab:'internal',trainerId:null,learnerId:null,group:null,key:null,offerPeople:{}}; // Somente estado visual.
let orderReturnPanel='workshop',preferredBay=null,quickFeedback=null; // Navegação temporária, nunca salva na campanha.
let renderProfile={scale:1,width:1080,height:450,centerX:859,centerY:270};
const FILTER={queue:'all',query:'',store:'all',stockQuery:''};
let toastTimeout;
let planningHorizon='turn';
let stockReturnJobId=null; // Contexto de navegação, não faz parte do save.
let completedOrderId=null;
let completedSearch=''; // Estado transitório de interface, nunca no save.

const SCENE_REFERENCE={crop:{x:320,y:130,width:1350,height:563},sourceWidth:1976,sourceHeight:796,worldX:319,worldY:45,width:1080,height:450};
const CUSTOM_BACKGROUND_KEY='porcaria.phaser.customBackdrop.official20261016';
const NIGHT_BACKGROUND_KEY='porcaria.phaser.nightBackdrop.20261016';
const CUSTOM_TRUCK_KEY='porcaria.phaser.customTruck.20261017.v0810';
let truckPreviewURL=null;
let BAY_LAYOUT=[0,1,2].map(i=>({id:i,hitWorld:{x:324+i*355,y:155,width:337,height:323},spriteWorld:{x:490+i*355,y:395},workerWorld:[{x:376+i*355,y:442},{x:605+i*355,y:439}]}));
function sceneDB(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(Error('IndexedDB indisponível'));return}
  const req=indexedDB.open('porcaria-workshop-background',1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('scene'))req.result.createObjectStore('scene')};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('Falha no IndexedDB'));
 });
}
async function sceneStore(op,blob,key='background'){
 const db=await sceneDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('scene',op==='read'?'readonly':'readwrite');
  const req=op==='read'?tx.objectStore('scene').get(key):op==='save'?tx.objectStore('scene').put(blob,key):tx.objectStore('scene').delete(key);
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('Falha ao salvar cenário'));
  tx.oncomplete=()=>db.close();tx.onerror=()=>db.close();
 });
}
async function imageFromBlob(blob){
 const url=URL.createObjectURL(blob);
 try{
  const img=new Image();img.decoding='async';
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Imagem inválida'));img.src=url});
  return img;
 }finally{URL.revokeObjectURL(url)}
}
async function useBackground(blob){
 const img=await imageFromBlob(blob);
 if(!scene)return;
 scene.customBackdrop=true;
 scene.setBackdrop(img,'fullFrame');
}

function updateTruckStatus(){
 const el=$('truckAssetState');
 if(el)el.textContent=scene?.textures?.exists('truckCustom')?'777E: sprite de teste ativo':'777E: pixel art oficial v3 · calços na roda traseira';
}
function clearTruckPreview(){
 if(truckPreviewURL){URL.revokeObjectURL(truckPreviewURL);truckPreviewURL=null}
 const thumb=$('truckAssetThumb');if(thumb){thumb.removeAttribute('src');thumb.hidden=true}
}
async function useTruckSprite(blob){
 const img=await imageFromBlob(blob);
 const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
 if(w<100||h<100||w>4096||h>4096)throw Error('Use imagem de 100 a 4096 px.');
 if(!scene?.textures)throw Error('A oficina ainda está carregando.');
 for(const key of ['trim_truckCustom','truckCustom'])if(scene.textures.exists(key))scene.textures.remove(key);
 scene.textures.addImage('truckCustom',img).setFilter(Phaser.Textures.FilterMode.LINEAR);
 scene.refresh();
 clearTruckPreview();
 truckPreviewURL=URL.createObjectURL(blob);
 const thumb=$('truckAssetThumb');if(thumb){thumb.src=truckPreviewURL;thumb.hidden=false}
 updateTruckStatus();
}
function restoreTruckSprite(){
 if(scene?.textures)for(const key of ['trim_truckCustom','truckCustom'])if(scene.textures.exists(key))scene.textures.remove(key);
 if(scene)scene.refresh();
 clearTruckPreview();updateTruckStatus();
}
function updateSceneStatus(){
 const status=$('sceneState');if(!status||!state)return;
 const night=state.shift===1;
 let label;
 if(scene?.customBackdrop)label='Imagem personalizada para os dois turnos';
 else if(night&&scene?.nightBackdropImage)label='Noite: imagem personalizada deste navegador';
 else if(night&&scene?.textures?.exists('repoNightWorkshopBG'))label='Noite: cenário oficial HQ do repositório';
 else if(night)label='Noite: cenário diurno escurecido (alternativa)';
 else if(scene?.textures?.exists('repoDayWorkshopBG'))label='Dia: oficina original completa 1976×796';
 else label='Dia: oficina recortada (fallback AVIF)';
 status.textContent=label;
}

const PANEL_TITLES={queue:'📻 FILA DE ORDENS DE SERVIÇO',detail:'🔧 ORDEM DE SERVIÇO', 'full-detail':'🔧 DETALHES COMPLETOS DA OS',stats:'📊 INDICADORES E RECURSOS',planning:'🗓️ PLANEJAMENTO PCM',shift:'📋 BRIEFING DE TURNO',team:'👷 EQUIPE DA OFICINA',training:'📚 SETOR DE TREINAMENTOS',store:'📦 ALMOXARIFADO E FERRAMENTAL',help:'❔ CONTROLES DA OFICINA',management:'📋 GESTÃO DA OFICINA',inspection:'🔎 INSPEÇÕES E NOTIFICAÇÕES'};
function closeSceneMenu(){
 const menu=$('sceneMenu'),trigger=$('sceneMenuBtn');
 if(menu)menu.hidden=true;
 if(trigger)trigger.setAttribute('aria-expanded','false');
}
// Modal tem exclusividade de entrada; nunca permitir selecao de box atraves do overlay.
function modalOpen(){return !!$('menuOverlay')&&!$('menuOverlay').hidden}
function openPanel(name){
 const overlay=$('menuOverlay');if(!overlay)return;
 if(name==='shift')drawShiftBrief();
 if(name==='planning')drawPlanning();
 if(name==='training')drawTraining();
 if(name==='inspection'){I.plan(state,data);save();drawInspection();}
 if(scene?.input)scene.input.enabled=false;
 closeSceneMenu();
 overlay.hidden=false;
 overlay.classList.toggle('quick-order',name==='detail');
 overlay.classList.toggle('full-order',name==='full-detail');
 $('modalHeading').textContent=PANEL_TITLES[name]||'MENU DA OFICINA';
 document.querySelectorAll('[data-panel]').forEach(el=>el.classList.toggle('is-open',el.dataset.panel===name));
 document.querySelectorAll('.primary-nav [data-open-panel]').forEach(btn=>{const active=btn.dataset.openPanel===name;btn.classList.toggle('is-active',active);btn.setAttribute('aria-expanded',active?'true':'false')});
 document.body.style.overflow='hidden';
 $('closePanel')?.focus();
}
function closePanel(){
 const overlay=$('menuOverlay');if(overlay)overlay.hidden=true;
 document.querySelectorAll('.primary-nav [data-open-panel]').forEach(btn=>{btn.classList.remove('is-active');btn.setAttribute('aria-expanded','false')});
 document.body.style.overflow='';
 if(scene?.input)scene.input.enabled=true;
}
function closeOrder(){
 if(orderReturnPanel==='queue'){
  openPanel('queue');
  $('queueSearch')?.focus();
 }else closePanel();
}
function closeActivePanel(){
 const active=document.querySelector('[data-panel].is-open')?.dataset.panel;
 if(active==='detail'||active==='full-detail')closeOrder();
 else closePanel();
}
function openQueueForBay(bay){
 preferredBay=bay;
 FILTER.queue='waiting';FILTER.query='';
 $('queueFilter').value='waiting';$('queueSearch').value='';
 renderQueue();openPanel('queue');
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){console.warn('Save',e)}}
function action(error){if(error)notify(error);else{save();drawUI();if(scene)scene.refresh()}}
function notify(t){const area=$('toast');if(!area)return;area.textContent=t;area.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{area.hidden=true},4400)}
function job(){return E.job(state,selected)||state.jobs[0]}
function pick(id,from='workshop'){
 if(!E.job(state,id))return;
 orderReturnPanel=from==='queue'?'queue':'workshop';
 quickFeedback=null;
 selected=id;drawUI();if(scene)scene.refresh();openPanel('detail');
}
function showJob(id){const j=E.job(state,id);if(j)pick(j.id,'workshop')}
function focusStore(item,fromJob){
 const source=fromJob?E.job(state,fromJob):null;
 stockReturnJobId=source?.id||null;
 FILTER.store='all';$('storeFilter').value='all';
 FILTER.stockQuery=item&&(data.items[item]||data.tools[item])?item:'';
 $('storeSearch').value=FILTER.stockQuery;
 drawStore();openPanel('store');
}
function statusFor(j){
 if(!j)return {label:'LIVRE',css:'free'};
 if(j.status==='material')return {label:'AGUARDANDO PEÇA',css:'blocked'};
 if(j.status==='ferramenta')return {label:'FALTA FERRAMENTA',css:'blocked'};
 if(j.status==='reparo')return {label:'EM REPARO',css:'work'};
 if(j.stage>=6)return {label:'PRONTO PARA REPARO',css:'work'};
 return {label:'DIAGNÓSTICO '+j.stage+'/6',css:'work'};
}
function jobBlockers(j){
 const c=E.scenario(data,j.scene);
 const reasons=[];
 if(!j.assigned)reasons.push('Sem equipe/box');
 if(!state.tools[c.tool])reasons.push('Ferramenta indisponível');
 if(j.stage>=6&&!j.materialUsed&&!(state.stock[c.material]>0))reasons.push('Material indisponível');
 if(j.assigned){const m=E.employee(state,j.assigned);if(m&&(m.mental<25||m.physical<25))reasons.push('Equipe fatigada')}
 return reasons;
}
function drawShiftBrief(){
 const report=window.PORCARIA_SHIFT_BRIEF.compute(state,data);
 const ready=window.PORCARIA_READINESS.compute(state,data);
 const metric=(title,value,tone)=>'<div class="shiftMetric '+(tone||'')+'"><small>'+esc(title)+'</small><strong>'+esc(value)+'</strong></div>';
 let out='<p class="shiftBriefIntro">DIA '+report.day+' · TURNO '+report.shift+' → '+report.nextShift
   +' · Janela de 12 horas (10,5 HH úteis/mecânico). Revise bloqueios antes de comprometer a próxima escala.</p>';
 out+='<div class="shiftBriefMetrics">'
   +metric('Boxes ocupados',report.counts.assigned+'/'+report.bays.length)
   +metric('Diagnósticos',report.counts.diagnosis)
   +metric('Aptas ao reparo',report.counts.repair)
   +metric('Bloqueios',report.counts.blocked,report.counts.blocked?'critical':'')
   +'</div>';
 out+='<div class="shiftReadinessSummary"><strong>PRONTIDÃO DA EQUIPE</strong>'
   +'<span>'+ready.metrics.boxLimitedHH+' HH úteis nominais pelo limite de boxes · '+ready.metrics.atRisk+' profissional(is) em atenção · '+ready.metrics.criticalCrew+' em condição crítica de jogo</span>'
   +'<button class="act secondary" data-open-panel="management">VER PRONTIDÃO</button></div>';
 out+='<h3 class="resourceSection">STATUS DOS TRÊS BOXES</h3><div class="shiftBoxGrid">';
 out+=report.bays.map(b=>{
  if(b.kind==='free')return '<article class="shiftBox"><div class="shiftBoxTitle"><span>BOX '+(b.bay+1)+'</span><span class="shiftBoxStatus">LIVRE</span></div><p>Box disponível para nova alocação.</p><div class="shiftBoxActions"><button class="act secondary" data-open-panel="queue">ABRIR FILA</button></div></article>';
  const reason=b.kind==='tool'?'Ferramenta: '+b.toolName:b.kind==='material'?'Peça: '+b.materialName
    :b.kind==='diagnose'?b.stage+'/6 etapas de diagnóstico':'Diagnóstico concluído, sujeito à capacidade e à energia.';
  const tag=b.fatigued?'<small>⚠ Profissional com energia física ou mental reduzida.</small>':'';
  const store=b.neededMaterial||b.neededTool;
  return '<article class="shiftBox '+(b.kind==='tool'||b.kind==='material'?'blocked':b.kind==='repair'?'ready':'')+'">'
    +'<div class="shiftBoxTitle"><span>BOX '+(b.bay+1)+'</span><span class="shiftBoxStatus">'+esc(b.label)+'</span></div>'
    +'<p><strong>'+esc(b.model)+'</strong> · '+esc(b.id)+'</p>'
    +'<small>'+esc(b.assigned)+' · '+b.ageHours+'h na carteira</small>'
    +'<small>'+esc(reason)+'</small>'+tag
    +'<div class="shiftBoxActions"><button class="act secondary" data-pick="'+esc(b.id)+'">VER OS</button>'
    +(store?'<button class="act" data-shift-stock="'+esc(store)+'" data-return-job="'+esc(b.id)+'">ALMOXARIFADO</button>':'')
    +'</div></article>';
 }).join('');
 out+='</div><div class="shiftBriefWarnings">';
 out+='<section class="shiftBriefSection"><h3>Riscos de programação</h3>';
 const alerts=[];
 if(report.counts.blocked)alerts.push(report.counts.blocked+' box(es) com falta de material ou ferramental');
 if(report.fatigue.length)alerts.push(report.fatigue.length+' profissional(is) em fadiga (produção pode cair)');
 if(report.unattendedCritical.length)alerts.push(report.unattendedCritical.length+' OS crítica(s) sem equipe alocada');
 if(report.counts.free)alerts.push(report.counts.free+' box(es) livre(s) para programação');
 out+=alerts.length?'<ul>'+alerts.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul>'
   :'<p>Sem bloqueios críticos identificados nos boxes ocupados.</p>';
 if(report.unattendedCritical.length){
  out+='<p><strong>OS críticas aguardando:</strong></p>';
  out+=report.unattendedCritical.slice(0,3).map(j=>
   '<button class="act secondary" data-pick="'+esc(j.id)+'">'+esc(j.id)+' · '+esc(j.model)+' · '+j.ageHours+'h</button>'
  ).join(' ');
 }
 out+='</section>';
 out+='<section class="shiftBriefSection"><h3>Logística e custos conhecidos</h3>';
 if(report.deliveries.length){
  out+='<ul>'+report.deliveries.slice(0,6).map(o=>
   '<li>'+esc(o.id)+': '+esc(o.qty)+' × '+esc(o.name)+'</li>'
  ).join('')+'</ul>';
  if(report.deliveries.length>6)out+='<p>+'+(report.deliveries.length-6)+' pedido(s) adicionais com chegada prevista.</p>';
 }else out+='<p>Não há pedidos com ETA até o encerramento do próximo turno.</p>';
 if(report.payroll)out+='<p>Virada do dia: folha fixa estimada em <strong>R$ '+brl(report.payroll)+'</strong> (exclui custos variáveis).</p>';
 out+='<p>'+esc(report.deliveryNote)+'</p></section></div>';
 out+='<div class="shiftBriefFoot"><p>Os resultados de diagnóstico, reparo, falhas e custos variáveis continuam sujeitos ao motor da simulação. Este briefing não é uma previsão de OS concluídas.</p>'
   +'<div class="actions"><button class="act secondary" data-shift-action="cancel">VOLTAR À OFICINA</button>'
   +'<button class="act" data-shift-action="confirm" data-turn-tick="'+report.tick+'">▶ CONFIRMAR +12H</button></div></div>';
 $('shiftBrief').innerHTML=out;
}
function planningTabs(){
 return '<div class="planningTabs" role="group" aria-label="Horizonte de planejamento">'
  +'<button type="button" data-planning-horizon="turn" class="'+(planningHorizon==='turn'?'selected':'')+'" aria-pressed="'+(planningHorizon==='turn')+'">PRÓXIMO TURNO · 12H</button>'
  +'<button type="button" data-planning-horizon="week" class="'+(planningHorizon==='week'?'selected':'')+'" aria-pressed="'+(planningHorizon==='week')+'">JANELA SEMANAL · 14 TURNOS</button></div>';
}
function drawWeekly(){
 const w=window.PORCARIA_WEEKLY.calculate(state,data);
 const metric=(name,value)=>'<div class="planningMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong></div>';
 let out=planningTabs();
 out+='<p class="planningIntro">Janela deslizante de 14 turnos de 12h (168h corridas), a partir do turno atual. '
  +'É uma leitura de capacidade e dos recursos hoje conhecidos, <strong>não um cronograma de conclusão automática</strong>.</p>';
 out+='<div class="planningMetrics">'
  +metric('Capacidade nominal',w.capacityHH+' HH')
  +metric('Esforço de reparo',w.repairEquivalentHours.toLocaleString('pt-BR')+' h*')
  +metric('Diagnósticos abertos',w.awaitingDiagnosis+' OS')
  +metric('Etapas pendentes',w.pendingDiagnosticStages)
  +'</div>';
 out+='<div class="planningExplanation">* O valor de reparo são horas-equivalentes de esforço no motor. '
  +'Não inclui diagnóstico, retrabalho, produtividade, fadiga ou novas ocorrências; não deve ser subtraído diretamente das HH nominais.'
  +'<p>'+w.backlog+' OS abertas · '+w.critical+' críticas · '+w.assigned+' alocadas · '+w.unassigned+' aguardando. '
  +w.receiptCount+' pedido(s) com entrega prevista dentro da janela.</p></div>';
 out+='<h3 class="resourceSection">CAPACIDADE POR TURNO · 14 TURNOS</h3>';
 out+='<div class="weeklyScroll" role="region" aria-label="Capacidade e entregas por turno" tabindex="0"><div class="weeklySlots">';
 out+=w.ticks.map(t=>{
  const frac=w.capacitySlots?Math.min(100,100*t.slots/w.capacitySlots):0;
  return '<div class="weeklySlot'+(t.current?' isCurrent':'')+'" title="Dia '+t.day+' · Turno '+t.shift+' · '+t.grossHH+' HH">'
   +'<strong>D'+t.day+' · '+t.shift+'</strong>'
   +'<div class="weeklyTrack"><div style="height:'+frac+'%"></div></div>'
   +'<b>'+t.grossHH+' HH</b>'
   +(t.receiptCount?'<small class="weeklyDelivery" title="Pedidos recebidos ao final deste turno">📦 '+t.receiptCount+'</small>':'<small>—</small>')
   +(t.payrollAtEnd?'<small title="Referência de folha fixa na virada do dia">R$ '+brl(t.payrollAtEnd)+'</small>':'<small> </small>')
   +'</div>';
 }).join('');
 out+='</div></div>';
 out+='<div class="weeklyLegend"><span>▰ HH nominais por turno</span><span>📦 Entregas ao final do turno</span><span>R$ Folha fixa de referência</span></div>';
 out+='<h3 class="resourceSection">MATERIAIS DE DIAGNÓSTICOS CONCLUÍDOS</h3>';
 if(!w.materials.length){
  out+='<p class="planningIntro">Não há requisitos de peças confirmados por diagnósticos concluídos. Peças de OS ainda em diagnóstico não são reveladas.</p>';
 }else{
  out+='<div class="weeklyResources">';
  out+=w.materials.map(m=>{
   const status=m.gapNow?'blocked':'ready';
   const arrivals=m.incoming.length?m.incoming.map(o=>esc(o.id)+' ('+o.qty+' un. no fim do turno +'+o.turnsRemaining+')').join(' · '):'Sem pedidos conhecidos nesta janela';
   return '<article class="weeklyResource '+status+'"><div class="planningOrderHeader"><strong>'+esc(m.name)+'</strong>'
    +'<span class="planningTag '+status+'">'+(m.gapNow?'DÉFICIT ATUAL '+m.gapNow:'SALDO ATUAL SUFICIENTE')+'</span></div>'
    +'<p>Necessidade: '+m.demand+' · Em estoque: '+m.onHand+' · Pedidos na janela: '+m.ordered
    +' · OS: '+m.jobs.map(esc).join(', ')+'</p>'
    +'<small>'+arrivals+'</small>'
    +(m.gapAfterKnownReceipts?'<p class="planningNoResource">Déficit residual após recebimentos conhecidos: '+m.gapAfterKnownReceipts+'</p>':'')
    +'<div class="actions"><button class="act secondary" data-plan-stock="'+esc(m.id)+'">CONSULTAR PEÇA</button></div></article>';
  }).join('');
  out+='</div>';
 }
 out+='<div class="weeklyAssumptions"><strong>LIMITES DO PLANEJAMENTO</strong><ul>'
  +w.assumptions.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>'
  +'<div class="actions"><button class="act secondary" data-planning-horizon="turn">← VOLTAR ÀS SUGESTÕES DE OS</button>'
  +'<button class="act secondary" data-open-panel="shift">BRIEFING DO PRÓXIMO TURNO</button></div>';
 $('planning').innerHTML=out;
}
function drawPlanning(){
 if(planningHorizon==='week'){drawWeekly();return}
 const plan=window.PORCARIA_PLANNING.compute(state,data);
 const metric=(title,value)=>'<div class="planningMetric"><small>'+esc(title)+'</small><strong>'+esc(value)+'</strong></div>';
 let out=planningTabs()+'<p class="planningIntro">DIA '+plan.day+' · TURNO '+plan.shift+' · Compare as OS não alocadas e programe um serviço por vez. '
   +'A sugestão não substitui seu julgamento; a decisão fica registrada no motor da oficina.</p>';
 out+='<div class="planningMetrics">'
   +metric('OS aguardando',plan.countWaiting)
   +metric('Críticas sem equipe',plan.countCriticalWaiting)
   +metric('Mecânicos livres',plan.freeMechanics.length)
   +metric('HH brutas restantes',plan.remainingGrossHours+'h')+'</div>';
 out+='<div class="planningExplanation">'+esc(plan.method)+'<p>'+esc(plan.capacityNote)+'</p><p>'+esc(plan.etaNote)+'</p></div>';
 if(!plan.ranked.length){
  out+='<div class="planningOrder"><strong>Todas as OS estão alocadas ou a carteira está vazia.</strong><p>Verifique os bloqueios e o progresso no briefing de turno.</p><div class="actions"><button class="act secondary" data-open-panel="shift">ABRIR BRIEFING</button></div></div>';
 }else{
  out+='<h3 class="resourceSection">CARTEIRA PRIORIZADA · '+plan.ranked.length+' OS</h3><div class="planningList">';
  out+=plan.ranked.map((j,index)=>{
   const status=j.readiness;
   const score='<span class="planningScore" title="Índice heurístico de ordenação">ORDEM '+(index+1)+' · '+j.score+' pts</span>';
   let html='<article class="planningOrder '+(status.kind!=='ready'?'is-blocked':'')+'">'
    +'<div class="planningOrderHeader"><div><strong>'+esc(j.model)+' · '+esc(j.id)+'</strong><small>'+esc(j.report)+'</small></div>'+score+'</div>';
   html+='<div class="planningMeta">'
     +'<span class="planningTag '+(j.priority===3?'critical':'')+'">'+esc(j.priorityLabel)+'</span>'
     +'<span class="planningTag">'+j.ageHours+'h na carteira</span>'
     +'<span class="planningTag '+(status.kind==='ready'?'ready':'blocked')+'">'+esc(status.label)+'</span>'
     +'<span class="planningTag">'+esc(j.category)+'</span></div>';
   if(j.recommended){
    const m=j.mechanics.find(x=>x.id===j.recommended.mechanicId);
    html+='<p><strong>Sugestão:</strong> '+esc(j.recommended.mechanicName)
     +' · BOX '+(j.recommended.bay+1)
     +' · proficiência '+Math.round(m?.proficiency||0)
     +(j.recommended.roleMatch?' · especialidade compatível':m?.general?' · multidisciplinar':' · especialidade diferente')
     +(j.recommended.fatigued?' · ⚠ fadiga':'')+'</p>';
   }else{
    const reason=[j.blockers,...j.inbound.map(o=>o.id+' chega em '+o.turnsRemaining+' turno(s) (ao final)')].filter(Boolean).join(' · ');
    html+='<p class="planningNoResource">'+esc(reason||'Sem recurso de execução disponível para alocação assistida.')+'</p>';
   }
   html+='<div class="actions"><button class="act secondary" data-pick="'+esc(j.id)+'">VER / ALOCAR MANUALMENTE</button>';
   if(j.recommended)html+='<button class="act" data-plan-assign="'+esc(j.id)+'" data-plan-tick="'+plan.tick+'">✓ ALOCAR SUGESTÃO</button>';
   if(status.resource)html+='<button class="act secondary" data-plan-stock="'+esc(status.resource)+'">CONSULTAR RECURSO</button>';
   html+='</div></article>';
   return html;
  }).join('')+'</div>';
 }
 out+='<div class="actions"><button class="act secondary" data-open-panel="queue">📻 VOLTAR À FILA</button><button class="act secondary" data-open-panel="shift">📋 BRIEFING DO TURNO</button></div>';
 $('planning').innerHTML=out;
}
function drawBays(){
 // Independent bottom OS badges: footerWorld is not a machine anchor nor a click zone.
 const bays=scene?.activeBayLayout||BAY_LAYOUT;
 const camera=SCENE_REFERENCE;
 const xPct=x=>((x-camera.worldX)/camera.width*100).toFixed(4)+'%';
 const yPct=y=>((y-camera.worldY)/camera.height*100).toFixed(4)+'%';
 $('bayHUD').innerHTML=bays.map((b,i)=>{
  const j=state.jobs.find(x=>x.bay===i),st=statusFor(j);
  const footer=b.footerWorld||{x:camera.worldX+i*camera.width/3+4,width:camera.width/3-9,y:camera.worldY+camera.height-19};
  const style='--bay-left:'+xPct(footer.x)+';--bay-top:'+yPct(footer.y)+';--bay-width:'+(footer.width/camera.width*100).toFixed(4)+'%';
  return `<div class="bayBadge ${st.css}" style="${style}"><b>BOX ${i+1}</b><span>${j?esc(E.model(data,j.modelId)?.title)+' · '+esc(j.id):'Disponível'}</span><b>${st.label}</b></div>`;
 }).join('');
}
function drawInspection(){if($('inspectionPanel'))$('inspectionPanel').innerHTML=IV.render(state,data,I)}
function renderQueue(){
 $('queue').innerHTML=[...state.jobs].filter(j=>{
 const m=E.model(data,j.modelId),q=FILTER.query.toLowerCase();
 const matched=!q||[j.id,j.report,m?.title,j.asset].some(x=>String(x||'').toLowerCase().includes(q));
 return matched&&(FILTER.queue==='all'||FILTER.queue==='critical'&&j.priority===3||FILTER.queue==='waiting'&&!j.assigned||FILTER.queue==='assigned'&&!!j.assigned);
 }).sort((a,b)=>b.priority-a.priority||a.tickOpen-b.tickOpen).map(j=>{
 const m=E.model(data,j.modelId);
 const aged=(state.tick-j.tickOpen)*E.SHIFT_HOURS;
 const flags=jobBlockers(j);
 return `<button class="job ${j.id===selected?'active':''}" data-pick="${j.id}"><span class="severity">${j.priority===3?'CRÍTICA':j.priority===2?'ALTA':'MODERADA'}</span><strong>${esc(m?.title)} · ${esc(j.id)}</strong><small>${esc(j.report)}</small><small>${esc(j.status)} · ${j.stage}/6 etapas · ${Math.ceil(j.repairRemaining)}h reparo · ${aged}h na carteira</small>${flags.length?'<small class="queueWarning">⚠ '+esc(flags.join(' · '))+'</small>':''}</button>`;
 }).join('')||'<p class="muted">Nenhuma OS corresponde ao filtro.</p>';
}
function drawManagement(k){
 const pressure=E.productivityProfile(state.productivityTarget);
 const ready=window.PORCARIA_READINESS.compute(state,data);
 const renderReadyAlert=a=>'<article class="readinessAlert '+esc(a.level)+'"><div><strong>'+esc(a.title)+'</strong><p>'+esc(a.detail)+'</p></div>'
 +(a.action?.kind==='store'?'<button class="act secondary" data-plan-stock="'+esc(a.action.item)+'" data-return-job="'+esc(a.action.jobId||'')+'">'+esc(a.action.label)+'</button>'
 :a.action?.kind==='job'?'<button class="act secondary" data-readiness-job="'+esc(a.action.jobId)+'">'+esc(a.action.label)+'</button>'
 :a.action?.kind==='team'?'<button class="act secondary" data-open-panel="team">'+esc(a.action.label)+'</button>':'')
 +'</article>';
 const assigned=state.jobs.filter(j=>j.assigned);
 const blocked=assigned.filter(j=>j.status==='material'||j.status==='ferramenta').length;
 const available=state.team.filter(m=>!state.jobs.some(j=>j.assigned===m.id)&&!E.TRAINING.active(state,m)).length;
 const metrics=[
  ['Caixa','R$ '+brl(state.cash)],
   ['Notas de inspeção',I.summary(state).awaiting],
  ['Reputação',k.reputation+'/100'],
  ['OS na carteira',k.backlog],
  ['Em execução',assigned.length],
  ['Bloqueadas',blocked],
  ['Equipe livre',available],
  ['Utilização',k.utilization+'%'],
  ['Concluídas',k.done],
  ['Energia supervisor',Math.round(state.player.mental)+'/100']
 ];
 $('management').innerHTML='<p class="muted">Controle da oficina no mesmo ambiente Phaser. Dados e decisões vêm da campanha ativa.</p>'
   +'<div class="managementGrid">'+metrics.map(([name,value])=>'<div class="managementMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong></div>').join('')+'</div>'
   +'<div class="managementActions"><button class="act secondary" data-open-panel="inspection">🔎 INSPEÇÕES</button><button class="act secondary" data-open-panel="training">📚 TREINAMENTOS</button><button class="act" data-open-panel="planning">🗓️ PLANEJAR OS</button><button class="act secondary" data-open-panel="shift">📋 REVISAR PRÓXIMO TURNO</button><button class="act secondary" data-open-panel="queue">📻 ABRIR CARTEIRA</button><button class="act secondary" data-open-panel="team">👷 EQUIPE</button><button class="act secondary" data-open-panel="store">📦 ESTOQUE</button><button class="act secondary" data-open-panel="stats">📊 INDICADORES</button></div>'
   +'<section class="readinessBoard"><div class="readinessHeading"><h3>🛠️ PRONTIDÃO OPERACIONAL · TURNO '+ready.shift+'</h3><span>QUADRO CONSULTIVO</span></div>'
   +'<div class="readinessMetrics">'
     +'<div><small>HH DE EQUIPE DISPONÍVEIS</small><strong>'+ready.metrics.nominalCrewHH+' HH</strong><span>'+ready.metrics.availableCrew+' profissional(is) × 10,5 HH</span></div>'
     +'<div><small>TETO SIMULTÂNEO DA OFICINA</small><strong>'+ready.metrics.boxLimitedHH+' HH</strong><span>Máximo de '+ready.bays.length+' boxes</span></div>'
     +'<div><small>OPORTUNIDADE DE NOVAS OS</small><strong>'+ready.metrics.additionalHH+' HH</strong><span>'+ready.metrics.freeBays+' box(es) livre(s) · '+ready.metrics.freeCrew+' mecânico(s) livre(s)</span></div>'
     +'<div><small>ATENÇÃO À EQUIPE</small><strong>'+ready.metrics.atRisk+' / '+ready.metrics.crewTotal+'</strong><span>'+ready.metrics.criticalCrew+' crítico(s) · '+ready.metrics.resting+' em descanso</span></div>'
   +'</div>'
   +'<div class="readinessBays">'+ready.bays.map(b=>'<div class="readinessBay '+esc(b.kind)+'"><strong>BOX '+(b.id+1)+'</strong><span>'+esc(b.label)+'</span><small>'+esc(b.jobId?(b.model+' · '+b.jobId):'Disponível para alocação')+'</small></div>').join('')+'</div>'
   +'<div class="readinessAlertHeader"><h4>ALERTAS DE DECISÃO · '+ready.warnings.length+'</h4><small>Não executam ações automaticamente</small></div>'
   +(ready.warnings.length?'<div class="readinessAlerts">'+ready.warnings.slice(0,6).map(renderReadyAlert).join('')+'</div>'
    +(ready.warnings.length>6?'<div class="readinessAlerts" id="readinessMore" hidden>'+ready.warnings.slice(6).map(renderReadyAlert).join('')+'</div><button class="act secondary readinessExpand" data-readiness-expand aria-expanded="false" aria-controls="readinessMore">MOSTRAR MAIS '+(ready.warnings.length-6)+' ALERTA(S)</button>':'')
    :'<p class="readinessClear">Nenhuma condição de atenção detectada com os limiares atuais do jogo.</p>')
   +'<small class="readinessMethod">'+esc(ready.methodology)+'</small></section>'
   +'<section class="productivityControl"><h3>🎯 META DE PRODUTIVIDADE · '+pressure.target+'/100</h3>'
   +'<p>Estável em 60. Acima de 60, a energia mental e física é consumida exponencialmente por hora trabalhada; abaixo de 60, aumenta a perda de moral.</p>'
   +'<div class="metaRange"><span>20 · Moral ↓</span><input type="range" id="productivityTarget" min="20" max="100" step="5" value="'+pressure.target+'" aria-label="Meta de produtividade"><span>100 · Energia ↓</span></div>'
   +'<div id="productivityImpact" class="productivityImpact">Ritmo '+Math.round(pressure.speed*100)+'% · Fadiga '+pressure.fatigueMultiplier.toFixed(2)+'× · Moral −'+pressure.moraleLossPerHour.toFixed(2)+' pts/HH</div>'
   +'<small>Turnos de 12h: DDS 0,5h + almoço 1h = 10,5 HH úteis por mecânico. Balanceamento fictício, não modelo fisiológico.</small></section>'
   +'<h3 class="resourceSection">Últimos acontecimentos</h3>'
   +(state.logs.slice(0,6).map(l=>'<div class="managementRecent">D'+l.day+': '+esc(l.text)+'</div>').join('')||'<p class="muted">Nenhum evento registrado.</p>');
}
function drawCompletedOrders(){
 const host=$('closedOrders');if(!host)return;
 const R=window.PORCARIA_CLOSED_ORDERS;
 const result=R.compute(state,data,completedSearch,completedOrderId);
 if(!result.selected){
  if(completedOrderId)completedOrderId=null;
  host.innerHTML=R.renderList(result);return;
 }
 host.innerHTML=R.renderDetail(result)
  +'<div class="closedDiagnostic"><h3>INVESTIGAÇÃO PRESERVADA NO ENCERRAMENTO</h3>'
  +window.PORCARIA_DIAGNOSTIC_VIEW.render(window.PORCARIA_DIAGNOSTIC.compute(state,data,result.selected.raw),result.selected.id)
  +'</div>';
}
function drawUI(){
 if(!state||!data)return;
 updateSceneStatus();
 const k=E.kpis(state);
 drawManagement(k);
 if(document.querySelector('[data-panel="inspection"].is-open'))drawInspection();
 $('day').textContent='DIA '+state.day+' · '+(state.shift?'🌙 NOITE · B':'☀ DIA · A');
 $('cash').textContent='R$ '+brl(state.cash);$('team').textContent=state.team.length;
 $('backlog').textContent=k.backlog;$('energy').textContent=Math.round(state.player.mental)+'/100';
 drawBays();
 renderQueue();
 const j=job(), d=$('detailFull');
 if(!j){
  d.innerHTML='<p>Sem ordens de serviço abertas.</p>';$('detail').innerHTML=d.innerHTML;drawTeam();drawTraining();drawStore();
  $('stats').innerHTML='<p class="muted">Nenhuma OS aberta. Consulte as OS concluídas abaixo.</p>';
  drawCompletedOrders();
  $('logs').innerHTML=state.logs.slice(0,5).map(l=>`<div class="log">D${l.day}: ${esc(l.text)}</div>`).join('');
  return;
 }
 selected=j.id;
 const c=E.scenario(data,j.scene),m=E.model(data,j.modelId);
 const part=data.items[c.material],tool=data.tools[c.tool];
 const age=(state.tick-j.tickOpen)*E.SHIFT_HOURS;
 const inbound=state.orders.filter(p=>p.item===c.material).reduce((n,p)=>n+p.qty,0);
 const toolOK=!!state.tools[c.tool],stockOK=!!state.stock[c.material]||j.materialUsed;
 const resourceInfo=`<div class="readiness"><b>PRONTIDÃO PARA REPARO</b>
 <span class="${toolOK?'ready':'warning'}">${toolOK?'✓':'!'} Ferramental: ${esc(tool?.name||c.tool)}</span>
 <span class="${j.stage<6?'':stockOK?'ready':'warning'}">${j.stage<6?'🔎 Material a confirmar no diagnóstico':(stockOK?'✓':'!')+' Material: '+esc(part?.name||c.material)+' ('+(state.stock[c.material]||0)+' em estoque · '+inbound+' em trânsito)'}</span>
 <div class="actions"><button class="act secondary" data-do="stockTool">VER FERRAMENTAL</button>${j.stage>=6?'<button class="act secondary" data-do="stockPart">VER PEÇA CONFIRMADA</button>':''}</div></div>`;
 let out=`<div class="diagnosticOsTitle">${esc(m?.title)} · ${esc(j.id)}</div><p class="muted">Prioridade: ${j.priority===3?'Crítica':j.priority===2?'Alta':'Moderada'} · Tempo desde abertura: ${age}h · OS ${esc(j.id)}</p><p class="muted">${esc(j.report)}</p>`;
 const diagnosis=window.PORCARIA_DIAGNOSTIC.compute(state,data,j);
 out+=window.PORCARIA_DIAGNOSTIC_VIEW.render(diagnosis,j.id);
 out+='<div id="notice" style="display:none"></div>';
 if(!j.assigned){
  const busy=new Set(state.jobs.map(x=>x.assigned).filter(Boolean));
  const free=state.team.filter(x=>!busy.has(x.id)&&x.restAt!==state.tick&&!E.TRAINING.active(state,x));
  const bays=[0,1,2].filter(x=>!state.jobs.some(z=>z.bay===x));
  if(free.length&&bays.length){
   out+=`<p class="muted">Escolha um profissional e um box para iniciar.</p><div class="actions"><select id="mechanicFull">${free.map(x=>`<option value="${x.id}">${esc(x.name)} (${esc(x.id)}) · ${esc(x.specialty||x.role)}</option>`).join('')}</select><select id="bayFull">${bays.map(x=>`<option value="${x}">BOX ${x+1}</option>`).join('')}</select></div><div class="actions"><button class="act" data-do="assign">ALOCAR E INVESTIGAR</button></div>`;
  }else out+='<p class="muted">Sem mecânicos ou boxes livres. Libere um serviço ou avance o turno.</p>';
 }else{
  const mech=E.employee(state,j.assigned);
  out+=`<p class="muted">BOX ${j.bay+1} · ${esc(mech?.name)} · diagnóstico assistido</p>`;
  if(!state.tools[c.tool])out+=`<p class="status">⚠ Falta ferramenta: ${esc(data.tools[c.tool]?.name)}</p><button class="act" data-do="tool">ADQUIRIR FERRAMENTA · R$ ${brl(data.tools[c.tool]?.cost||0)}</button>`;
  if(j.stage<6){
   out+=`<h3 class="diagnosticAnswerHeading">SUA DECISÃO · ETAPA ${j.stage+1} — ${STAGES[j.stage]}</h3><div class="muted">Escolha a hipótese. O resultado aparecerá no quadro acima; erros geram retrabalho.</div>`;
   (j.options[j.stage]||[]).forEach(o=>out+=`<button class="answer" data-answer="${esc(o.id)}">${esc(o.label)}</button>`);
   out+='<button class="act secondary" data-do="hint">SOLICITAR EVIDÊNCIA</button>';
   // Evidência é exibida no quadro após a solicitação.
  }else{
   out+='<h3 style="font-size:15px;color:#89e198">DIAGNÓSTICO CONCLUÍDO</h3>';
   out+=`<p class="muted">Peça necessária: ${esc(data.items[c.material]?.name)} · estoque: ${state.stock[c.material]||0}</p>`;
   if(!(state.stock[c.material]>0)&&!j.materialUsed)out+=`<button class="act" data-do="order">COMPRAR PEÇA · R$ ${brl(data.items[c.material]?.unit||0)}</button>`;
   out+='<p class="muted">Avance turnos até completar o reparo. Estoque e energia limitam a execução.</p>';
  }
  out+='<div class="actions"><button class="act secondary" data-do="release">LIBERAR BOX</button></div>';
 }
 out+=resourceInfo;
 d.innerHTML=out;
 $('detail').innerHTML=window.PORCARIA_ORDER_QUICK.render({
  job:j,state,data,model:m,scenario:c,diagnostic:diagnosis,preferredBay,feedback:quickFeedback
 });
 $('stats').innerHTML=`<div class="status">OS concluídas: <b>${k.done}</b> · Críticas: <b>${k.critical}</b></div><div class="status">Reputação: <b>${k.reputation}/100</b> · Utilização: <b>${k.utilization}%</b></div><div class="status">Mecânicos disponíveis: <b>${state.team.filter(x=>!x.assigned).length}</b></div><div class="progress"><i style="width:${k.reputation}%"></i></div><div class="legend">⚒ Clique nos boxes da oficina para selecionar uma OS.</div>`;
 drawTeam();drawTraining();drawStore();drawCompletedOrders();
 $('logs').innerHTML=state.logs.slice(0,5).map(l=>`<div class="log">D${l.day}: ${esc(l.text)}</div>`).join('');
}

function energyMeter(label,value){
 return `<div class="resourceMeter"><span>${label}</span><div class="progress"><i style="width:${Math.max(0,Math.min(100,value))}%"></i></div><b>${Math.round(value)}</b></div>`;
}
function renderSkills(competencies){
 const sections=[
  ['disciplines','DISCIPLINAS E FÍSICA APLICADA'],
  ['systems','SISTEMAS E COMPONENTES'],
  ['machines','EQUIPAMENTOS']
 ];
 const avg=group=>{
  const values=E.SKILL_CATALOG[group].map(item=>Number(competencies[group]?.[item.id]||0));
  return Math.round(values.reduce((a,b)=>a+b,0)/Math.max(1,values.length));
 };
 return '<div class="abilitySummary" aria-label="Matriz de habilidades">'
  +sections.map(([key,label])=>{
   const value=avg(key);
   return '<span class="abilityMean"><small>'+esc(label)+'</small><strong>'+value+'/100</strong></span>';
  }).join('')
  +'</div><div class="abilityGroups">'+sections.map(([group,label])=>
   '<details class="abilityGroup"><summary>'+esc(label)+' <span>'+E.SKILL_CATALOG[group].length+' habilidades</span></summary>'
   +'<div class="abilityRows">'+E.SKILL_CATALOG[group].map(({id,label:skillName})=>{
    const v=Number(competencies[group]?.[id]||0);
    return '<div class="abilityRow"><span>'+esc(skillName)+'</span><div class="abilityTrack" role="progressbar" aria-label="'+esc(skillName)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+v+'"><i style="width:'+v+'%"></i></div><b>'+v+'</b></div>';
   }).join('')+'</div></details>'
  ).join('')+'</div>';
}
function rememberTrainingSelection(resetSkill=false){
 const v=id=>document.getElementById(id)?.value;
 const trainer=v('trainingTeacher'),learner=v('trainingLearner'),group=v('trainingGroup'),key=v('trainingSkill');
 if(trainer!==undefined)trainingUI.trainerId=trainer;
 if(learner!==undefined)trainingUI.learnerId=learner;
 if(group!==undefined)trainingUI.group=group;
 if(key!==undefined)trainingUI.key=resetSkill?null:key;
 else if(resetSkill)trainingUI.key=null;
 const chosen=[...document.querySelectorAll('#trainingPanel [id^="trainingPerson-"]')];
 for(const el of chosen)trainingUI.offerPeople[el.id.slice('trainingPerson-'.length)]=el.value;
 return trainingUI;
}
function drawTraining(preserveDom=true){
 const host=$('trainingPanel');if(!host)return;
 if(preserveDom)rememberTrainingSelection();
 host.innerHTML=window.PORCARIA_TRAINING_VIEW.render(state,E,trainingUI);
}
function drawTeam(){
 const candidates=E.availableRecruits(state);
 const affordable=state.cash>=1050&&state.player.mental>=18;
 const listing=candidates.map(m=>{
  const portrait=WORKER_SHEETS[m.sprite];
  const portraitTag=portrait?'<span class="teamPortrait" style="background-image:url('+esc(portrait)+')" aria-hidden="true"></span>':'<span class="teamPortrait placeholder" aria-hidden="true">🔧</span>';
  const abilities=m.sprite==='generic'?'<p class="muted">Proficiências individuais definidas na contratação.</p>':'<details class="abilitiesCard"><summary>📊 VER HABILIDADES</summary>'+renderSkills(E.baselineSkills(m.sprite))+'</details>';
  return `<article class="resourceCard"><div class="teamIdentity">${portraitTag}<div><h3>${esc(m.avatar)} ${esc(m.name)}</h3><p class="muted">${esc(m.specialty)} · Disciplina: ${esc(m.role)}</p></div></div>${abilities}<button class="act" data-team-action="hire" data-person="${esc(m.sprite)}" ${!affordable?'disabled':''}>CONTRATAR · R$ 1.050</button></article>`;
 }).join('');
 $('teamPanel').innerHTML=`<p class="muted">Campanha nova: Pedro, Geovane, Junior e Acassio. Contrate personagens únicos ou mecânicos avulsos sem limite fixo de equipe. Custo: R$ 1.050 e 18 de energia mental por contratação. Os três boxes continuam permitindo até três OS simultâneas.</p>
 <h3 class="resourceSection">CATÁLOGO DE CONTRATAÇÃO · ${candidates.length-1} nomeado(s) + mecânico avulso</h3>
 <div class="resourceGrid">${listing}</div>
 ${!affordable?'<p class="status">Verifique caixa e energia mental do supervisor.</p>':''}
 <h3 class="resourceSection">EQUIPE ATIVA · ${state.team.length} profissional(is)</h3>
 <div class="resourceGrid">`+state.team.map(m=>{
  const current=state.jobs.find(j=>j.assigned===m.id);
  const resting=m.restAt===state.tick;
  const training=E.TRAINING.active(state,m);
  const portraitUrl=m.sprite&&(TEAM_PORTRAITS[m.sprite]||WORKER_SHEETS[m.sprite]);
  const portrait=portraitUrl?'<span class="teamPortrait" style="background-image:url('+esc(portraitUrl)+')" aria-hidden="true"></span>':'<span class="teamPortrait placeholder" aria-label="Sem sprite">MEC.</span>';
  return `<article class="resourceCard"><div class="teamIdentity">${portrait}<div><h3>${esc(m.avatar||'')} ${esc(m.name)} · ${esc(m.specialty||'Mecânico')} <small>${esc(m.id)}</small></h3><p class="muted">Especialidade simulada: ${esc(m.role)}</p></div></div><p class="muted">${current?'Em serviço: '+esc(current.id)+' · Box '+(current.bay+1):resting?'Descanso programado neste turno':training?(m.normativeUntil>state.tick?'Treinamento normativo · '+(m.normativeUntil-state.tick)+' turno(s)':'Em capacitação neste turno'):'Disponível'} · Índice geral histórico ${Math.round(m.skill)}</p>${energyMeter('Mental',m.mental)}${energyMeter('Física',m.physical)}${energyMeter('Moral',m.morale)}<details class="abilitiesCard"><summary>📊 VER HABILIDADES</summary>${renderSkills(E.skillsFor(m))}</details><div class="actions"><button class="act secondary" data-team-action="motivate" data-person="${esc(m.id)}">MOTIVAR</button><button class="act secondary" data-team-action="rest" data-person="${esc(m.id)}" ${current||resting||training?'disabled':''}>DESCANSAR</button></div></article>`;
 }).join('')+'</div>';
}
function drawStore(){
 const q=FILTER.stockQuery.toLowerCase();
 const returning=stockReturnJobId?E.job(state,stockReturnJobId):null;
 if(stockReturnJobId&&!returning)stockReturnJobId=null;
 const returnBanner=returning?'<div class="stockReturn"><span>CONSULTA DA <strong>'+esc(returning.id)+'</strong> · Compras são sempre manuais</span><button class="act secondary" data-stock-return="'+esc(returning.id)+'">↩ VOLTAR À OS</button></div>':'';
 const materials=Object.entries(data.items).filter(([id,it])=>FILTER.store!=='tools'&&(!q||(id+' '+it.name).toLowerCase().includes(q))&&(FILTER.store!=='shortage'||!(state.stock[id]>0)));
 const tools=Object.entries(data.tools).filter(([id,it])=>(FILTER.store!=='shortage'||!state.tools[id])&&(!q||(id+' '+it.name).toLowerCase().includes(q)));
 const inTransit=state.orders||[];
 $('storePanel').innerHTML=returnBanner+`<p class="muted">Caixa: R$ ${brl(state.cash)}. Compra normal tem prazo maior; pedido urgente custa 65% a mais. Recebimento ocorre ao avançar turnos.</p>
 <h3 class="resourceSection">MATERIAIS · ${materials.length} ITENS</h3>`+
 materials.map(([id,item])=>{
 const transit=inTransit.filter(p=>p.item===id).reduce((sum,p)=>sum+p.qty,0);
 return `<div class="resourceRow"><div><strong>${esc(item.name)}</strong><br><small>Código ${esc(id)} · Saldo ${state.stock[id]||0} · Em trânsito ${transit} · Unitário R$ ${brl(item.unit)}</small></div><div class="actions"><select id="qty-${esc(id)}" aria-label="Quantidade de ${esc(item.name)}"><option value="1">1 un.</option><option value="2">2 un.</option><option value="3">3 un.</option><option value="5">5 un.</option><option value="10">10 un.</option></select><button class="act secondary" data-store-action="order" data-item="${esc(id)}">COMPRAR</button><button class="act" data-store-action="rush" data-item="${esc(id)}">URGENTE</button></div></div>`;
 }).join('')+
 `<h3 class="resourceSection">FERRAMENTAL · ${tools.length} ITENS</h3>`+
 tools.map(([id,tool])=>`<div class="resourceRow"><div><strong>${esc(tool.name)}</strong><br><small>${state.tools[id]?'✓ Disponível na oficina':'⚠ Indisponível'} · Valor R$ ${brl(tool.cost)}</small></div><button class="act secondary" data-store-action="tool" data-item="${esc(id)}" ${state.tools[id]?'disabled':''}>${state.tools[id]?'ADQUIRIDA':'ADQUIRIR'}</button></div>`).join('')+
 `<h3 class="resourceSection">PEDIDOS EM TRÂNSITO · ${inTransit.length}</h3>`+
 (inTransit.length?inTransit.map(p=>`<div class="resourceRow"><span><strong>${esc(p.id)}</strong> — ${esc(data.items[p.item]?.name||p.item)} · ${p.qty} un.</span><small>Previsão em ${Math.max(0,p.eta-state.tick)} turno(s) · ${p.fast?'Urgente':'Normal'}</small></div>`).join(''):'<p class="muted">Nenhum pedido aguardando recebimento.</p>');
}

function events(){
 $('helpBtn').addEventListener('click',()=>openPanel('help'));
 document.addEventListener('input',ev=>{
  if(ev.target?.id!=='productivityTarget')return;
  const p=E.productivityProfile(Number(ev.target.value));
  const impact=$('productivityImpact');
  if(impact)impact.textContent='Ritmo '+Math.round(p.speed*100)+'% · Fadiga '+p.fatigueMultiplier.toFixed(2)+'× · Moral −'+p.moraleLossPerHour.toFixed(2)+' pts/HH';
 });
 document.addEventListener('change',ev=>{
  if(['trainingTeacher','trainingLearner','trainingGroup','trainingSkill'].includes(ev.target?.id)||ev.target?.id?.startsWith('trainingPerson-')){
   rememberTrainingSelection(ev.target?.id==='trainingGroup');
   drawTraining(false);
   return;
  }
  if(ev.target?.id!=='productivityTarget')return;
  const err=E.setProductivityTarget(state,Number(ev.target.value));
  action(err);
  if(!err)notify('Meta de produtividade ajustada para '+state.productivityTarget+'/100.');
 });
 $('sceneMenuBtn').addEventListener('click',ev=>{
  ev.stopPropagation();
  const menu=$('sceneMenu'),opening=menu.hidden;
  closeSceneMenu();
  if(opening){menu.hidden=false;$('sceneMenuBtn').setAttribute('aria-expanded','true')}
 });
 $('bgPickBtn').addEventListener('click',()=>$('bgPicker').click());
 $('truckPickBtn').addEventListener('click',()=>$('truckPicker').click());
 $('bgNightBtn').addEventListener('click',()=>$('nightPicker').click());
 $('closedOrderSearch').addEventListener('input',ev=>{
   completedSearch=ev.target.value;
   completedOrderId=null;drawCompletedOrders();
 });
 $('queueSearch').addEventListener('input',ev=>{FILTER.query=ev.target.value;renderQueue()});
 $('queueFilter').addEventListener('change',ev=>{FILTER.queue=ev.target.value;renderQueue()});
 $('storeSearch').addEventListener('input',ev=>{FILTER.stockQuery=ev.target.value;drawStore()});
 $('storeFilter').addEventListener('change',ev=>{FILTER.store=ev.target.value;drawStore()});
 $('closePanel').addEventListener('click',closeActivePanel);
 $('menuOverlay').addEventListener('click',ev=>{if(ev.target===$('menuOverlay'))closeActivePanel()});
 document.addEventListener('keydown',ev=>{
 const trainingFocused=ev.target?.closest?.('[data-training-tab]');
 if(trainingFocused&&['ArrowRight','ArrowLeft','Home','End'].includes(ev.key)){
  ev.preventDefault();
  const tabs=['internal','external','mandatory','history'];
  const index=tabs.indexOf(trainingFocused.dataset.trainingTab);
  const next=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:
   (index+(ev.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
  rememberTrainingSelection();
  trainingUI.tab=tabs[next];
  drawTraining(false);
  $('trainingTab-'+trainingUI.tab)?.focus();
  return;
 }
 if(ev.key==='Escape'){
  if(!$('sceneMenu').hidden){closeSceneMenu();$('sceneMenuBtn').focus();return}
  closeActivePanel();return;
 }
 if(ev.altKey||ev.ctrlKey||ev.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const panels={'0':'management','1':'queue','2':'detail','3':'team','4':'store','5':'stats','6':'training'};
 if(panels[ev.key]){ev.preventDefault();if(panels[ev.key]==='detail'){orderReturnPanel='workshop';quickFeedback=null}if(panels[ev.key]==='queue')preferredBay=null;openPanel(panels[ev.key])}
 });
 document.addEventListener('click',ev=>{
  if(!ev.target.closest('.scene-tools'))closeSceneMenu();
  const trainingTab=ev.target.closest('[data-training-tab]');
  if(trainingTab){
   rememberTrainingSelection();
   trainingUI.tab=trainingTab.dataset.trainingTab;
   drawTraining(false);
   $('trainingTab-'+trainingUI.tab)?.focus();
   return;
  }
  const quickDetails=ev.target.closest('[data-order-details]');
  if(quickDetails){openPanel('full-detail');return}
  const quickBack=ev.target.closest('[data-order-back]');
  if(quickBack){openPanel('detail');return}
  const quickClose=ev.target.closest('[data-order-close]');
  if(quickClose){closeOrder();return}
  const submenu=ev.target.closest('[data-open-panel]');
  if(submenu){
   if(submenu.dataset.openPanel==='store'){stockReturnJobId=null;FILTER.stockQuery='';$('storeSearch').value='';drawStore()}
   if(submenu.dataset.openPanel==='detail'){orderReturnPanel='workshop';quickFeedback=null}
   if(submenu.dataset.openPanel==='queue')preferredBay=null;
   openPanel(submenu.dataset.openPanel);return;
  }
  const inspectionAction=ev.target.closest('[data-inspection-action]');
  if(inspectionAction){
   const id=inspectionAction.dataset.inspectionId,kind=inspectionAction.dataset.inspectionAction;
   const result=kind==='inspect'?I.inspect(state,data,id):
    kind==='notify'?I.notify(state,id,$('inspection-note-'+id)?.value,$('inspection-priority-'+id)?.value):{error:'Ação inválida.'};
   if(result.error){notify(result.error);return}
   save();drawUI();
   notify(kind==='inspect'?(result.status==='clear'?'Inspeção encerrada: sem indício aparente.':'Indício observado. Registre uma notificação se necessário.'):
      'Notificação '+result.notification.id+' criada para revisão PCM. Nenhuma OS foi aberta.');
   return;
  }
  const planHorizon=ev.target.closest('[data-planning-horizon]');
  if(planHorizon){
   planningHorizon=planHorizon.dataset.planningHorizon==='week'?'week':'turn';
   drawPlanning();return;
  }
  const planAssignment=ev.target.closest('[data-plan-assign]');
  if(planAssignment){
   if(Number(planAssignment.dataset.planTick)!==state.tick){
    drawPlanning();notify('O turno mudou. Revise a programação antes de alocar.');return;
   }
   const fresh=window.PORCARIA_PLANNING.compute(state,data);
   const suggestion=fresh.ranked.find(j=>j.id===planAssignment.dataset.planAssign)?.recommended;
   if(!suggestion){drawPlanning();notify('Esta alocação não está mais disponível. Confira os recursos.');return}
   // Engine validates double assignment, bay occupation, resting crew and job availability.
   const err=E.attach(state,planAssignment.dataset.planAssign,suggestion.mechanicId,suggestion.bay,true);
   action(err);
   if(!err){drawPlanning();notify('OS '+planAssignment.dataset.planAssign+' programada no BOX '+(suggestion.bay+1)+' com '+suggestion.mechanicName+'.')}
   return;
  }
  const planStock=ev.target.closest('[data-plan-stock]');
 if(planStock){focusStore(planStock.dataset.planStock,planStock.dataset.returnJob);return}
 const expand=ev.target.closest('[data-readiness-expand]');
 if(expand){
  const extra=$('readinessMore');if(!extra)return;
  extra.hidden=!extra.hidden;
  expand.setAttribute('aria-expanded',String(!extra.hidden));
  expand.textContent=extra.hidden?'MOSTRAR ALERTAS ADICIONAIS':'OCULTAR ALERTAS ADICIONAIS';
  return;
 }
 const shiftAction=ev.target.closest('[data-shift-action]');
  if(shiftAction){
   if(shiftAction.dataset.shiftAction==='cancel'){closePanel();$('advance').focus();return}
   if(shiftAction.dataset.shiftAction==='confirm'){
    if(Number(shiftAction.dataset.turnTick)!==state.tick){drawShiftBrief();notify('O turno mudou. Revise os dados atualizados antes de confirmar.');return}
    shiftAction.disabled=true;
    const beforeDone=state.done.length;
    const result=E.advance(state,data);
    selected=E.job(state,selected)?.id||state.jobs[0]?.id;
    closePanel();action(null);if(scene)scene.applyOfficialBackdrop();$('advance').focus();
    notify((state.done.length-beforeDone)+' OS concluída(s), '+result.blocks+' bloqueio(s) no turno.');
    return;
   }
  }
  const stockShortcut=ev.target.closest('[data-shift-stock]');
 if(stockShortcut){focusStore(stockShortcut.dataset.shiftStock,stockShortcut.dataset.returnJob);return}
 const readinessJob=ev.target.closest('[data-readiness-job]');
  if(readinessJob){const target=E.job(state,readinessJob.dataset.readinessJob);
   if(!target){notify('Esta OS já não está na carteira.');return}
   pick(target.id);return;
  }
  const storeBack=ev.target.closest('[data-stock-return]');
 if(storeBack){
  const origin=E.job(state,storeBack.dataset.stockReturn);
  if(!origin){stockReturnJobId=null;drawStore();notify('A OS de origem já saiu da carteira.');return}
  stockReturnJobId=null;pick(origin.id,orderReturnPanel);return;
 }
 const closedBack=ev.target.closest('[data-closed-back]');
 if(closedBack){completedOrderId=null;drawCompletedOrders();$('closedOrderSearch').focus();return}
 const closedPick=ev.target.closest('[data-closed-order]');
 if(closedPick){
  const completed=state.done.find(x=>x.id===closedPick.dataset.closedOrder);
  if(!completed){notify('OS já não está no histórico da campanha.');drawCompletedOrders();return}
  completedOrderId=completed.id;drawCompletedOrders();return;
 }
 const p=ev.target.closest('[data-pick]');if(p){pick(p.dataset.pick,p.closest('[data-panel="queue"]')?'queue':'workshop');return}
  const ans=ev.target.closest('[data-answer]');if(ans){
   const current=job(),stage=current?.stage||0;
   const label=current?.options?.[stage]?.find(o=>o.id===ans.dataset.answer)?.label||'Hipótese selecionada';
   const result=E.answer(state,data,selected,ans.dataset.answer);
   if(result.error){notify(result.error);return}
   quickFeedback={jobId:selected,ok:result.ok,text:(result.ok?'✓ Confirmado: ':'✕ Hipótese rejeitada: ')+label+
     (result.ok?' · etapa registrada.':' · haverá retrabalho e consumo de energia.')};
   action(null);if(!result.ok)notify('Hipótese incorreta: custo e retrabalho adicionados.');
   return;
  }
  const tr=ev.target.closest('[data-training-action]');
  if(tr){
   const T=E.TRAINING;
   let err;
   if(tr.dataset.trainingAction==='internal')
    err=T.internal(state,$('trainingTeacher')?.value,$('trainingLearner')?.value,$('trainingGroup')?.value,$('trainingSkill')?.value,E.SKILL_CATALOG);
   else if(tr.dataset.trainingAction==='external')
    err=T.external(state,$('trainingPerson-'+tr.dataset.offer)?.value,tr.dataset.offer,E.SKILL_CATALOG);
   else return;
   action(err);
   if(!err){drawTraining();notify('Bia registrou o treinamento. Avance o turno para concluir as 12 horas.')}
   return;
  }
  const tm=ev.target.closest('[data-team-action]');
  if(tm){const id=tm.dataset.person;const mode=tm.dataset.teamAction;action(mode==='hire'?E.hire(state,id):mode==='rest'?E.rest(state,id):E.motivate(state,id));return}
  const st=ev.target.closest('[data-store-action]');
  if(st){const id=st.dataset.item,mode=st.dataset.storeAction;if(mode==='tool')action(E.buyTool(state,data,id));else{const qty=Number($('qty-'+id)?.value||1);action(E.orderMaterial(state,data,id,qty,mode==='rush'))}return}
  const b=ev.target.closest('[data-do]');if(!b)return;
  if(['openStore','stockTool','stockPart'].includes(b.dataset.do)){
  const source=job(),sc=source&&E.scenario(data,source.scene);
  const item=b.dataset.do==='stockTool'?sc?.tool:b.dataset.do==='stockPart'&&source?.stage>=6?sc?.material:'';
  focusStore(item,source?.id);return;
 }
  const j=job();if(!j)return;const c=E.scenario(data,j.scene);
  if(b.dataset.do==='assign'){
   const full=!!b.closest('[data-panel="full-detail"]');
   const mechanic=$(full?'mechanicFull':'mechanic'),bay=$(full?'bayFull':'bay');
   if(mechanic&&bay)action(E.attach(state,j.id,mechanic.value,Number(bay.value),true));
 }
  if(b.dataset.do==='release')action(E.release(state,j.id));
  if(b.dataset.do==='hint')action(E.hint(state,data,j.id));
  if(b.dataset.do==='tool')action(E.buyTool(state,data,c.tool));
  if(b.dataset.do==='order')action(E.orderMaterial(state,data,c.material,1,true));
 });
 $('advance').addEventListener('click',()=>openPanel('shift'));
 $('save').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='porcaria-phaser-save.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),700);
 });
 $('importSave').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];ev.target.value='';if(!file)return;
  try{
   if(file.size>5_000_000)throw Error('O arquivo ultrapassa 5 MB.');
   const candidate=JSON.parse(await file.text());
   if(!E.validate(candidate))throw Error('Save incompatível com a simulação atual.');
   if(!confirm('Importar save e substituir o progresso desta oficina? Exporte o save atual antes de continuar.'))return;
   state=E.localizeDiagnosticOptions(E.normalizeRoster(candidate),data);I.normalized(state);state.productivityTarget=E.productivityProfile(state.productivityTarget).target;selected=state.jobs[0]?.id||null;
    completedOrderId=null;completedSearch='';$('closedOrderSearch').value='';
   action(null);notify('Save importado com sucesso.');
  }catch(error){notify('Falha ao importar: '+error.message)}
 });
  $('bgPicker').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];ev.target.value='';closeSceneMenu();if(!file)return;
  try{
   if(file.size>12_000_000)throw Error('Imagem acima de 12 MB');
   if(!['image/png','image/jpeg','image/webp','image/avif'].includes(file.type))throw Error('Formato não suportado');
   await useBackground(file);await sceneStore('save',file);localStorage.setItem(CUSTOM_BACKGROUND_KEY,'1');
   notify('Cenário carregado. Para os sprites funcionarem sem duplicação, utilize uma imagem de fundo sem máquinas.');
  }catch(err){notify('Não foi possível carregar: '+err.message)}
 });
 $('nightPicker').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];ev.target.value='';closeSceneMenu();if(!file)return;
  try{
   if(file.size>12_000_000)throw Error('Imagem acima de 12 MB');
   if(!['image/png','image/jpeg','image/webp','image/avif'].includes(file.type))throw Error('Formato não suportado');
   const img=await imageFromBlob(file);
   await sceneStore('save',file,'night');localStorage.setItem(NIGHT_BACKGROUND_KEY,'1');
   if(scene){scene.nightBackdropImage=img;if(state?.shift===1&&!scene.customBackdrop)scene.applyOfficialBackdrop()}
   updateSceneStatus();
   notify('Fundo noturno personalizado salvo. Ele substitui o cenário oficial apenas no Turno B.');
  }catch(err){notify('Falha no cenário noturno: '+err.message)}
 });
 $('bgNightReset').addEventListener('click',async()=>{
  closeSceneMenu();localStorage.removeItem(NIGHT_BACKGROUND_KEY);
  try{await sceneStore('delete',null,'night')}catch(err){console.warn(err)}
  if(scene){scene.nightBackdropImage=null;if(state?.shift===1&&!scene.customBackdrop)scene.applyOfficialBackdrop()}
  updateSceneStatus();notify('Fundo noturno personalizado removido: cenário oficial da noite restaurado.');
 });
 $('bgReset').addEventListener('click',async()=>{closeSceneMenu();localStorage.removeItem(CUSTOM_BACKGROUND_KEY);try{await sceneStore('delete')}catch(err){console.warn(err)}if(scene){scene.customBackdrop=false;scene.applyOfficialBackdrop()}updateSceneStatus();notify('Cenário automático dia/noite restaurado.')});
  $('truckPicker').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];ev.target.value='';closeSceneMenu();if(!file)return;
  try{
   if(file.size>5_000_000)throw Error('Imagem acima de 5 MB.');
   if(!['image/png','image/webp'].includes(file.type))throw Error('Formato aceito: PNG ou WebP.');
   await useTruckSprite(file);
   await sceneStore('save',file,'truckSprite');
   localStorage.setItem(CUSTOM_TRUCK_KEY,'1');
   notify('777E em teste neste navegador; o sprite oficial segue preservado.');
  }catch(err){notify('Falha ao testar 777E: '+err.message)}
 });
 $('truckReset').addEventListener('click',async()=>{
  closeSceneMenu();localStorage.removeItem(CUSTOM_TRUCK_KEY);
  try{await sceneStore('delete',null,'truckSprite')}catch(e){console.warn(e)}
  restoreTruckSprite();notify('777E original restaurado, sem alterar a campanha.');
 });
 $('reset').addEventListener('click',()=>{if(!confirm('Reiniciar a campanha Phaser?'))return;state=E.create(data);selected=state.jobs[0]?.id;completedOrderId=null;completedSearch='';$('closedOrderSearch').value='';action(null);if(scene)scene.applyOfficialBackdrop()});
}
class Workshop extends Phaser.Scene{
 constructor(){super('Workshop');this.machineObjs=[];this.workerSprites=[];this.activeProfile='cropped';this.activeBayLayout=BAY_LAYOUT;}
 preload(){
  Object.entries(ASSETS).forEach(([key,url])=>this.load.image(key,url));
  Object.entries(WORKER_SHEETS).forEach(([name,url])=>this.load.spritesheet('worker_'+name,url,{
   frameWidth:WORKER_FRAME.width,frameHeight:WORKER_FRAME.height
  }));
  // Preserva a versão recortada somente como fallback.
  this.load.image('repoWorkshopBG','./assets/oficina-base.avif?v=0.7.0');
  // Derivado do PNG original do usuário: composição integral, 1976×796.
  this.load.image('repoDayWorkshopBG','./assets/oficina-diurna-fullframe.avif?v=0.8.13');
  // Cenário noturno real disponível no Pages, verificado por hash no deploy.
  this.load.image('repoNightWorkshopBG','./assets/oficina-noturna-hq.avif?v=0.8.4');
  this.load.on('loaderror',f=>console.warn('Imagem opcional indisponivel:',f.key));
 }
 create(){
  scene=this;this.cameras.main.setBackgroundColor('#182838');
  if(modalOpen())this.input.enabled=false;
  // Canvas de 1×/2× e zoom correspondente: a camera SEMPRE mostra os mesmos
  // 1080×450 pixels logicos da oficina; Phaser traduz o input pela camera.
  this.cameras.main.setZoom(renderProfile.scale).centerOn(renderProfile.centerX,renderProfile.centerY);
  const g=this.add.graphics();const box=(x,y,w,h,fill,stroke)=>{g.fillStyle(fill);g.fillRect(x,y,w,h);if(stroke){g.lineStyle(2,stroke);g.strokeRect(x,y,w,h)}};
  // Camadas de oficina: fundo montanhoso, galpao, guindastes, pátio, ferramental.
  box(0,0,1440,650,0x293541);
  box(18,25,1404,375,0x55606a,0x0b1827);
  for(let x=20;x<1430;x+=60){g.lineStyle(1,0x78828a,.45);g.lineBetween(x,45,x,405)}
  for(let y=40;y<420;y+=42){g.lineStyle(1,0x78828a,.25);g.lineBetween(16,y,1423,y)}
  // Vista do pátio externo pela abertura lateral.
  box(20,92,263,278,0x8fb4c5,0x1a2632);
  g.fillStyle(0xd2a065);g.fillTriangle(20,220,137,121,284,219);g.fillStyle(0xb6804e);g.fillTriangle(20,285,183,165,284,285);
  box(20,275,264,95,0x9c7b53);
  for(let x=30;x<270;x+=18){g.lineStyle(2,0xd9ac70,.5);g.lineBetween(x,280,x+35,370)}
  // Piso e faixas industriais.
  box(0,396,1440,254,0x887e70);
  for(let y=412;y<650;y+=43){g.lineStyle(1,0x5a574e,.65);g.lineBetween(0,y,1440,y)}
  for(let x=0;x<1440;x+=110){g.lineStyle(1,0xb1a598,.4);g.lineBetween(x,396,x-35,650)}
  for(let i=0;i<3;i++){
   const x=324+i*355;box(x,142,337,316,0x283642,0x111c25);
   box(x+10,154,317,238,0x42515c);
   for(let j=0;j<6;j++){g.lineStyle(1,0x9aa5a1,.19);g.lineBetween(x+15,175+j*32,x+326,175+j*32)}
   box(x-7,142,13,318,0x172634);box(x+331,142,13,318,0x172634);
   box(x-10,128,356,36,0x102438,0xe2ab36);
   box(x+7,409,316,10,0xe5b43a);
   for(let n=0;n<12;n++){g.fillStyle(0x28313a);g.fillRect(x+9+n*26,410,13,9)}
  }
  // Estrutura de cobertura e vigas.
  box(0,22,1440,20,0x112232,0xd4a44d);
  for(let x=0;x<1440;x+=182){
   g.lineStyle(6,0x182735);g.lineBetween(x,24,x+185,117);
   g.lineStyle(5,0x182735);g.lineBetween(x+185,24,x,117);
  }
  box(0,113,1440,14,0x132535);
  // luminarias industriais.
  for(let x=98;x<1440;x+=232){
   box(x,120,5,30,0x131e28);box(x-40,148,85,10,0xffc862);
   g.fillStyle(0xf9be5c,.16);g.fillTriangle(x-85,325,x+85,325,x,156);
  }
  // Guindaste e talha.
  box(690,71,570,14,0xefb431,0x251b16);
  box(975,82,40,26,0x1a2f3d);box(994,102,3,192,0x1c2229);
  g.lineStyle(5,0xe6b337);g.lineBetween(995,292,984,311);g.lineBetween(984,311,1007,321);
  // Prateleiras almoxarifado à esquerda.
  box(20,403,272,184,0x1c3040,0xefa932);
  for(let y of [437,485,534,578])box(26,y,256,8,0xd59839);
  for(let x of [32,91,151,215])for(let y of [410,457,508,546]){box(x,y,41,26,(x+y)%3?0x7d563d:0x536a75,0x293038);box(x+5,y+7,21,3,0xc1a17b)}
  // Tambor de oleo e carrinhos.
  for(let x of [1073,1109,1145,1181]){box(x,545,29,54,x%2?0xa67e25:0x3d7590,0x172b39);box(x,545,29,6,0xc7a14f)}
  box(850,548,110,65,0xb03725,0x3b1e1d);
  for(let y of [559,575,591])box(858,y,95,12,0x862b21,0xd87050);
  // Placas fixas.
  this.text(38,377,'ALMOXARIFADO',20,'#ffe4ae',true);
  ['1  MECÂNICA','2  ELÉTRICA','3  HIDRÁULICA'].forEach((t,i)=>this.text(345+i*355,131,t,18,'#ffebc0',true));
  this.text(720,49,'OFICINA CENTRAL',30,'#ffca65',true);
  this.text(1057,618,'ABASTECIMENTO E LUBRIFICAÇÃO',16,'#e6e9de',true);
  // Marcacao de areas clicaveis persistentes.
  this.activeProfile='cropped';this.activeBayLayout=BAY_LAYOUT;
  this.bayZones=this.createBayZones();
  this.statusText=this.add.text(17,612,'', {fontFamily:'monospace',fontSize:'14px',color:'#f2e3bb',backgroundColor:'#102132cc',padding:{x:9,y:7}});
  // Somente personagens mudam de pose; equipamentos e suas sombras nunca são animados.
  this.time.addEvent({delay:560,loop:true,callback:()=>{
   if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   for(const actor of this.workerSprites){
    if(!actor.sprite.active||actor.frames.length<2)continue;
    actor.index=(actor.index+1)%actor.frames.length;
    actor.sprite.setFrame(actor.frames[actor.index]);
   }
  }});
  this.backgroundDecor=this.children.list.filter(o=>o!==this.statusText&&!this.bayZones.includes(o));
  this.refresh();
  this.customBackdrop=false;
  this.applyOfficialBackdrop();
  updateTruckStatus();
  if(localStorage.getItem(CUSTOM_TRUCK_KEY)==='1')sceneStore('read',null,'truckSprite').then(blob=>{
   if(blob)return useTruckSprite(blob);
   localStorage.removeItem(CUSTOM_TRUCK_KEY);updateTruckStatus();
  }).catch(err=>{console.warn('777E local:',err);updateTruckStatus()});
  if(localStorage.getItem(CUSTOM_BACKGROUND_KEY)==='1')sceneStore('read').then(blob=>{if(blob)return useBackground(blob)}).catch(console.warn);
  if(localStorage.getItem(NIGHT_BACKGROUND_KEY)==='1')sceneStore('read',null,'night').then(async blob=>{
   if(!blob)return;
   this.nightBackdropImage=await imageFromBlob(blob);
   if(state?.shift===1&&!this.customBackdrop)this.applyOfficialBackdrop();
  }).catch(console.warn);
 }
 createBayZones(){
  return this.activeBayLayout.map(({id,hitWorld})=>{
   const hit=this.add.zone(hitWorld.x,hitWorld.y,hitWorld.width,hitWorld.height)
    .setOrigin(0).setInteractive({useHandCursor:true});
   hit.on('pointerdown',()=>{if(modalOpen())return;const j=state.jobs.find(z=>z.bay===id);if(j)pick(j.id,'workshop');else openQueueForBay(id)});
   return hit;
  });
 }
 applyBayProfile(profile){
  const chosen=profile==='fullFrame'&&Array.isArray(BACKGROUND_PROFILES?.fullFrame?.bays)?'fullFrame':'cropped';
  if(chosen===this.activeProfile)return;
  this.bayZones?.forEach(z=>z.destroy());
  this.activeProfile=chosen;
  this.activeBayLayout=chosen==='fullFrame'?BACKGROUND_PROFILES.fullFrame.bays:BAY_LAYOUT;
  this.bayZones=this.createBayZones();
  drawBays();
 }
 applyOfficialBackdrop(){
  if(this.customBackdrop)return;
  const night=state?.shift===1;
  if(night&&this.nightBackdropImage){this.setBackdrop(this.nightBackdropImage,'fullFrame');return}
  const key=night&&this.textures.exists('repoNightWorkshopBG')?'repoNightWorkshopBG'
   :!night&&this.textures.exists('repoDayWorkshopBG')?'repoDayWorkshopBG':'repoWorkshopBG';
  const img=this.textures.exists(key)?this.textures.get(key).getSourceImage():null;
  // Os dois turnos compartilham geometria fullFrame; o perfil cropped é só fallback.
  this.setBackdrop(img,key==='repoWorkshopBG'?'cropped':'fullFrame');
  // Fallback apenas para navegadores sem suporte AVIF ou falha de carregamento.
  if(night&&key!=='repoNightWorkshopBG'&&this.backdrop)this.backdrop.setTint(0x7986a4);
  updateSceneStatus();
 }
 setBackdrop(img,profile='fullFrame'){
  // The photograph and its bays MUST change as a single scene geometry.
  this.applyBayProfile(profile);
  if(this.backdrop){this.backdrop.destroy();this.backdrop=null}
  if(this.backgroundDecor)this.backgroundDecor.forEach(o=>o.setVisible(!img));
  if(!img){this.refresh();updateSceneStatus();return}
  const crop=SCENE_REFERENCE.crop;
  const width=img.naturalWidth||img.width,height=img.naturalHeight||img.height;
  // Preserve the original 1350px workshop detail instead of discarding it into a 1080px canvas.
  const density=Math.min(2,Math.max(1,width/SCENE_REFERENCE.width));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round(SCENE_REFERENCE.width*density);
  canvas.height=Math.round(SCENE_REFERENCE.height*density);
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Canvas 2D indisponível');
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  // Os dois cenários oficiais são 1976×796 fullFrame. A versão 1350×563 é fallback.
  // Nunca recortar a imagem completa; isso deslocaria os três letreiros/boxes.
  ctx.drawImage(img,0,0,width,height,0,0,canvas.width,canvas.height);
  if(this.textures.exists('dynamicWorkshopBG'))this.textures.remove('dynamicWorkshopBG');
  this.textures.addCanvas('dynamicWorkshopBG',canvas).setFilter(Phaser.Textures.FilterMode.LINEAR);
  this.backdrop=this.add.image(SCENE_REFERENCE.worldX,SCENE_REFERENCE.worldY,'dynamicWorkshopBG').setOrigin(0).setDisplaySize(SCENE_REFERENCE.width,SCENE_REFERENCE.height).setDepth(-1);
  this.refresh();
  updateSceneStatus();
 }
 text(x,y,t,size,color,bold=false){return this.add.text(x,y,t,{fontFamily:'Arial, sans-serif',fontSize:size+'px',fontStyle:bold?'bold':'normal',color,stroke:'#112435',strokeThickness:4})}
 trimmedEquipment(key){
  const outKey='trim_'+key;
  if(this.textures.exists(outKey))return outKey;
  const src=this.textures.get(key).getSourceImage();
  if(!src?.width||!src?.height)return key;
  try{
   const source=document.createElement('canvas');source.width=src.width;source.height=src.height;
   const ctx=source.getContext('2d',{willReadFrequently:true});if(!ctx)return key;
   ctx.drawImage(src,0,0);
   const rgba=ctx.getImageData(0,0,src.width,src.height).data;
   let minX=src.width,minY=src.height,maxX=-1,maxY=-1;
   for(let y=0;y<src.height;y+=2)for(let x=0;x<src.width;x+=2){
    if(rgba[(y*src.width+x)*4+3]>15){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
   }
   if(maxX<0||maxY<0)return key;
   const left=Math.max(0,minX-3),top=Math.max(0,minY-3),right=Math.min(src.width,maxX+5),bottom=Math.min(src.height,maxY+5);
   if(left<=1&&top<=1&&right>=src.width-1&&bottom>=src.height-1)return key;
   const cropped=document.createElement('canvas');cropped.width=right-left;cropped.height=bottom-top;
   cropped.getContext('2d').drawImage(src,left,top,cropped.width,cropped.height,0,0,cropped.width,cropped.height);
   this.textures.addCanvas(outKey,cropped).setFilter(Phaser.Textures.FilterMode.NEAREST);
   return outKey;
  }catch(err){console.warn('Alpha crop skipped:',key,err);return key}
 }
 machine(x,y,modelId,scale=1,bay=null){
   const normalKey=MACHINES[modelId];
   const key=modelId==='EQ01'&&this.textures.exists('truckCustom')?'truckCustom':normalKey;
   if(key&&this.textures.exists(key)){
     const renderKey=this.trimmedEquipment(key),texture=this.textures.get(renderKey);
     texture.setFilter(modelId==='EQ01' ? Phaser.Textures.FilterMode.LINEAR : Phaser.Textures.FilterMode.NEAREST);
     const src=texture.getSourceImage();
     const plan=window.PORCARIA_LAYOUT.equipmentSize(src.width,src.height,scale,MODEL_PRESENTATION[modelId]||{},bay);
     // The requested offset is preserved in scene-map.json; clipping protection is visual only.
     const visibleX=this.activeProfile==='fullFrame'
      ?window.PORCARIA_LAYOUT.placeMachineInBay(x,plan.width,bay,MODEL_PRESENTATION[modelId]||{},3).x
      :window.PORCARIA_LAYOUT.calibratedCenter(x,plan.width,SCENE_REFERENCE,bay?.visualCalibrationX||0,8);
     const node=this.add.image(visibleX,Math.round(y),renderKey).setOrigin(.5,1);
     node.setDisplaySize(plan.width,plan.height);
     this.machineObjs.push(node);
     return node;
   }else{
     // Fallback machines obey the same viewport bounds as PNG sprites.
     x=this.activeProfile==='fullFrame'
      ?window.PORCARIA_LAYOUT.placeMachineInBay(x,220*scale,bay,MODEL_PRESENTATION[modelId]||{},3).x
      :window.PORCARIA_LAYOUT.calibratedCenter(x,220*scale,SCENE_REFERENCE,bay?.visualCalibrationX||0,8);
     this.lastFallbackMachineX=x;
     // Fallback legado do D9 usado apenas se a textura homologada falhar.
     if(modelId==='EQ07'){
      const g=this.add.graphics(),u=scale;
      g.fillStyle(0x26313a);g.fillRoundedRect(x-98*u,y-33*u,195*u,31*u,13*u);
      g.lineStyle(3*u,0x87908d);g.strokeRoundedRect(x-98*u,y-33*u,195*u,31*u,13*u);
      for(let k=0;k<8;k++){g.fillStyle(k%2?0x4a5454:0x657073);g.fillRect(x+(-82+k*21)*u,y-26*u,12*u,18*u)}
      for(const dx of [-70,-35,0,35,69]){g.fillStyle(0x191f25);g.fillCircle(x+dx*u,y-17*u,9*u);g.fillStyle(0x8e9796);g.fillCircle(x+dx*u,y-17*u,4*u)}
      g.fillStyle(0xf0b124);g.fillRoundedRect(x-87*u,y-85*u,140*u,58*u,5*u);
      g.fillStyle(0xda9118);g.fillRect(x-87*u,y-38*u,140*u,11*u);
      g.fillStyle(0xf1b42f);g.fillRoundedRect(x+7*u,y-149*u,78*u,71*u,5*u);
      g.fillStyle(0x243a46);g.fillRect(x+17*u,y-138*u,54*u,42*u);
      g.fillStyle(0x7d9ca2);g.fillRect(x+20*u,y-135*u,24*u,33*u);
      g.fillStyle(0x394a54);g.fillRect(x+49*u,y-135*u,18*u,33*u);
      g.fillStyle(0xf2bd37);g.fillRect(x+5*u,y-153*u,82*u,8*u);
      g.lineStyle(6*u,0x6b7475);g.lineBetween(x-83*u,y-44*u,x-117*u,y-63*u);
      g.fillStyle(0xd39b31);g.fillRoundedRect(x-132*u,y-95*u,29*u,92*u,4*u);
      g.fillStyle(0xffd16a);g.fillRect(x-131*u,y-93*u,4*u,79*u);
      g.fillStyle(0x21343f);g.fillRect(x-52*u,y-74*u,13*u,19*u);
      this.machineObjs.push(g);return;
     }
     // Fallback vetorial para modelos sem arte homologada.
     const g=this.add.graphics();const isTruck=modelId==='EQ01';g.fillStyle(0xf0a91e);
     g.fillRoundedRect(x-112*scale,y-98*scale,220*scale,80*scale,8*scale);
     if(isTruck){g.fillStyle(0xd48b10);g.fillPoints([{x:x-90*scale,y:y-125*scale},{x:x+80*scale,y:y-126*scale},{x:x+110*scale,y:y-95*scale},{x:x-85*scale,y:y-95*scale}],true)}
     else{g.fillStyle(0xefb735);g.fillRect(x+25*scale,y-135*scale,65*scale,54*scale)}
     g.fillStyle(0x17232d);[-67,64].forEach(dx=>{g.fillCircle(x+dx*scale,y-10*scale,32*scale);g.fillStyle(0x4a4c4e);g.fillCircle(x+dx*scale,y-10*scale,16*scale);g.fillStyle(0x17232d)});
     this.machineObjs.push(g);
   }
 }
 workerRenderTexture(texture){
  const renderKey=texture+'_prefilter_v0821';
  if(this.textures.exists(renderKey))return renderKey;
  const src=this.textures.get(texture).getSourceImage();
  if(!src||src.width!==WORKER_FRAME.width*2||src.height!==WORKER_FRAME.height*2)return texture;
  // Reduzir cada frame separadamente evita vazamento de pixels entre poses.
  // Canvas pré-filtra em alta qualidade antes da última redução feita pelo GPU.
  const canvas=document.createElement('canvas');
  canvas.width=WORKER_RENDER_FRAME.width*2;
  canvas.height=WORKER_RENDER_FRAME.height*2;
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return texture;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  for(let i=0;i<4;i++){
   ctx.drawImage(src,(i%2)*WORKER_FRAME.width,Math.floor(i/2)*WORKER_FRAME.height,
    WORKER_FRAME.width,WORKER_FRAME.height,
    (i%2)*WORKER_RENDER_FRAME.width,Math.floor(i/2)*WORKER_RENDER_FRAME.height,
    WORKER_RENDER_FRAME.width,WORKER_RENDER_FRAME.height);
  }
  const sheet=this.textures.addCanvas(renderKey,canvas);
  if(!sheet)return texture;
  for(let i=0;i<4;i++){
   sheet.add(i,0,(i%2)*WORKER_RENDER_FRAME.width,Math.floor(i/2)*WORKER_RENDER_FRAME.height,
    WORKER_RENDER_FRAME.width,WORKER_RENDER_FRAME.height);
  }
  sheet.setFilter(Phaser.Textures.FilterMode.LINEAR);
  return renderKey;
 }
 worker(x,y,mechanic,{facing='right',mode='diagnose',visualCalibrationX=0,bay=null}={}){
  x=this.activeProfile==='fullFrame'&&bay
   ?window.PORCARIA_LAYOUT.placeWorkerInBay(x,bay,WORKER_DISPLAY.width,2)
   :window.PORCARIA_LAYOUT.calibratedCenter(x,WORKER_DISPLAY.width,SCENE_REFERENCE,visualCalibrationX,8);
  x+=Number(bay?.workerOffsetX)||0; // Ajuste visual somente do mecânico no BOX 2.
  const person=mechanic?.sprite;
  const texture=person&&WORKER_SHEETS[person]?'worker_'+person:null;
  if(texture&&this.textures.exists(texture)){
   // Pré-filtra cada pose em 2× antes da minificação final, sem mexer no ponto de apoio.
   const renderKey=this.workerRenderTexture(texture);
   const frame=renderKey===texture?WORKER_FRAME:WORKER_RENDER_FRAME;
   this.textures.get(renderKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
   const poses=WORKER_POSES[mode]||WORKER_POSES.diagnose;
   const actor=this.add.sprite(x,y,renderKey,poses[0]).setOrigin(.5,1);
   actor.setScale(Math.min(WORKER_DISPLAY.width/frame.width,WORKER_DISPLAY.height/frame.height));
   actor.setFlipX(facing==='left');
   this.workerSprites.push({sprite:actor,frames:poses,index:0});
   return actor;
  }
  // Contratado genérico ou indisponibilidade de imagem: sem avatar/silhueta.
  // Identificação textual não é um sprite e não interfere nas ações da OS.
  const label=this.add.text(x,y-17,'MECÂNICO',{
   fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:'#fff1cd',
   backgroundColor:'#122e40cc',padding:{x:3,y:3}
  }).setOrigin(.5,1);
  this.machineObjs.push(label);
  return label;
 }
 refresh(){
   if(this.selectedOutline){this.selectedOutline.destroy();this.selectedOutline=null}
   const activeBays=this.activeBayLayout||BAY_LAYOUT;
   const focus=state.jobs.find(z=>z.id===selected&&z.bay!==null);
   if(focus){
     const bounds=activeBays[focus.bay].hitWorld;
     const outline=this.add.graphics();
     outline.lineStyle(3,0xffc94b,0.9);
     outline.strokeRoundedRect(bounds.x+3,bounds.y+3,bounds.width-6,bounds.height-6,6);
     this.selectedOutline=outline;
   }
   this.machineObjs.forEach(x=>x.destroy());this.machineObjs=[];
   this.workerSprites.forEach(a=>a.sprite.destroy());this.workerSprites=[];
   this.textObjects?.forEach(x=>x.destroy());this.textObjects=[];
   this.progressObjects?.forEach(x=>x.destroy());this.progressObjects=[];
   activeBays.forEach(({id:i,hitWorld,placementWorld,footerWorld,spriteWorld,workerWorld,labelWorld,progressWorld})=>{
     const j=state.jobs.find(z=>z.bay===i),cx=spriteWorld.x;
     if(j){
       const machineNode=this.machine(cx,spriteWorld.y,j.modelId,spriteWorld.scale||.72,activeBays[i]);
       // Track the actual (possibly edge-clamped) machine position, not its requested center.
       const machineX=machineNode?.type==='Image'?machineNode.x:this.lastFallbackMachineX??cx;
       const ground=placementWorld?.groundY??spriteWorld.groundY??(workerWorld[0].y-2);
       // Deslocar SOMENTE as sombras em ambos perfis: a linha de apoio,
       // pés dos mecânicos, rodas/esteiras e zona clicável não se movem no eixo Y.
       const shadowMainY=ground-3;
       const shadowSoftY=ground-1;
       const shadow=this.add.graphics().setDepth(-0.15);
       shadow.fillStyle(0x04090b,0.31);
       shadow.fillEllipse(machineX,shadowMainY,Math.min(196,(placementWorld?.width||progressWorld?.width||225)*0.84),18);
       shadow.fillStyle(0x02070a,0.13);
       shadow.fillEllipse(machineX,shadowSoftY,Math.min(223,(placementWorld?.width||245)*0.97),22);
       this.machineObjs.push(shadow);
       if(machineNode?.type==='Image'){
        machineNode.setInteractive({useHandCursor:true});
        machineNode.on('pointerdown',()=>{if(!modalOpen())pick(j.id)});
       }
       const mode=j.status==='material'||j.status==='ferramenta'?'blocked':j.stage>=6?'repair':'diagnose';
       // Uma OS possui UM profissional responsável; nunca duplicar rostos pelo slot.
       const assigned=state.team.find(m=>m.id===j.assigned);
       if(assigned){
        const w=workerWorld[0];
        const actor=this.worker(w.x,w.y,assigned,{facing:w.facing||'right',mode,
         visualCalibrationX:activeBays[i].visualCalibrationX||0,bay:activeBays[i]});
        if(actor?.type==='Sprite'){
         actor.setInteractive({useHandCursor:true});
         actor.on('pointerdown',()=>{if(!modalOpen())pick(j.id)});
        }
       }
       // O HUD inferior já mostra equipamento e OS: evitar um segundo rótulo sobre as rodas.
       // Progresso visual da OS; diagnóstico e reparo são fases distintas.
       if(progressWorld){
        const p=progressWorld;
        const diagnosing=j.stage<6;
        const blocked=j.status==='material'||j.status==='ferramenta';
        const pct=diagnosing?j.stage/6:Math.max(0,Math.min(1,1-j.repairRemaining/Math.max(0.1,j.repairTarget||1)));
        const color=blocked?0xeb7666:diagnosing?0x68c5e7:0xf6b544;
        const title=blocked?(j.status==='material'?'AGUARDANDO PEÇA':'FALTA FERRAMENTA'):diagnosing?'DIAGNÓSTICO':'REPARO';
        const bar=this.add.graphics();
        bar.fillStyle(0x091c2b,0.87);bar.fillRoundedRect(p.x-6,p.y-31,p.width+12,48,6);
        bar.lineStyle(1,color,0.9);bar.strokeRoundedRect(p.x-6,p.y-31,p.width+12,48,6);
        bar.fillStyle(0x344756,1);bar.fillRoundedRect(p.x,p.y-7,p.width,10,4);
        bar.fillStyle(color,1);bar.fillRoundedRect(p.x,p.y-7,Math.max(1,p.width*pct),10,4);
        this.progressObjects.push(bar);
        const caption=this.text(p.x,p.y-28,title+' · '+Math.round(pct*100)+'%',12,blocked?'#ffb0a1':'#f9e4ae',true);
        this.progressObjects.push(caption);
       }
     }else{
       let label=this.text(hitWorld.x+hitWorld.width/2-68,(labelWorld?.y??430),'BOX DISPONÍVEL',12,'#d1dccd',true);label.setAlpha(.75);this.textObjects.push(label);
     }
   });
   // Optional test template: ?debugBoxes=1 draws the same reference colors used by QA.
   // Red = support plane, green = horizontal asset envelope, blue = diagnostic HUD,
   // violet = independent OS footer; upper green edges intentionally NOT enforced.
   if(this.layoutGuides){this.layoutGuides.destroy();this.layoutGuides=null}
   if(new URLSearchParams(window.location.search).get('debugBoxes')==='1'){
    const guide=this.add.graphics().setDepth(101);
    activeBays.forEach(b=>{
     const place=b.placementWorld||b.hitWorld,ground=place.groundY??b.spriteWorld.groundY;
     guide.lineStyle(2,0x43d16e,0.94);
     guide.lineBetween(place.x,ground-140,place.x,ground);
     guide.lineBetween(place.x+place.width,ground-140,place.x+place.width,ground);
     guide.lineStyle(3,0xff4050,0.95);guide.lineBetween(place.x,ground,place.x+place.width,ground);
     if(b.progressWorld){const p=b.progressWorld;guide.lineStyle(2,0x558dff,0.94);guide.strokeRect(p.x-6,p.y-31,p.width+12,48)}
     if(b.footerWorld){const f=b.footerWorld;guide.lineStyle(2,0x9879ff,0.9);guide.strokeRect(f.x,f.y,f.width,17)}
    });
    this.layoutGuides=guide;
   }
   this.statusText.setText('TURNO '+(state.shift?'B':'A')+'  |  '+state.jobs.filter(j=>j.assigned).length+' BOXES EM USO  |  '+state.done.length+' OS CONCLUÍDAS');
 }
}
async function boot(){
 try{
  const res=await fetch('../game-data.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
  data=await res.json();
  try{
   const mapRes=await fetch('./scene-map.json',{cache:'no-store'});
   if(mapRes.ok){const map=await mapRes.json();
    if(Array.isArray(map.bays)&&map.bays.length===3&&map.bays.every(b=>b.hitWorld&&b.spriteWorld&&b.workerWorld))BAY_LAYOUT=map.bays;
    if(map.modelPresentation)MODEL_PRESENTATION=map.modelPresentation;
    if(map.backgroundProfiles)BACKGROUND_PROFILES=map.backgroundProfiles;
    if(map.background?.sourceCrop)SCENE_REFERENCE.crop=map.background.sourceCrop;
    if(map.background?.sourceWidth)SCENE_REFERENCE.sourceWidth=map.background.sourceWidth;
    if(map.background?.sourceHeight)SCENE_REFERENCE.sourceHeight=map.background.sourceHeight;
   }
  }catch(error){console.warn('Mapeamento opcional:',error)}
  try{const raw=localStorage.getItem(SAVE);if(raw){const s=JSON.parse(raw);if(E.validate(s))state=s}}catch(e){console.warn(e)}
  if(!state)state=E.create(data);
  E.normalizeRoster(state); // inclui campanhas antigas sem apagar OS nem contratações.
  E.localizeDiagnosticOptions(state,data); // traduz opções legadas sem alterar códigos.
   I.normalized(state); // saves antigos recebem uma carteira vazia.
  state.productivityTarget=E.productivityProfile(state.productivityTarget).target;
  selected=state.jobs[0]?.id;events();drawUI();
  if(!I||!IV||!window.Phaser||!window.PORCARIA_LAYOUT||!window.PORCARIA_PLANNING||!window.PORCARIA_WEEKLY||!window.PORCARIA_SHIFT_BRIEF||!window.PORCARIA_READINESS||!window.PORCARIA_DIAGNOSTIC||!window.PORCARIA_DIAGNOSTIC_VIEW||!window.PORCARIA_ORDER_QUICK||!window.PORCARIA_CLOSED_ORDERS)throw Error('Módulos do Phaser/PCM não carregaram. Verifique conexão.');
  if(!window.PORCARIA_RENDER_QUALITY)throw Error('Configuração de nitidez indisponível.');
  renderProfile=window.PORCARIA_RENDER_QUALITY.profile({
   viewportWidth:window.innerWidth,devicePixelRatio:window.devicePixelRatio,
   override:new URLSearchParams(window.location.search).get('quality'),sceneRef:SCENE_REFERENCE
  });
  new Phaser.Game({type:Phaser.AUTO,parent:'game',width:renderProfile.width,height:renderProfile.height,
   backgroundColor:'#182838',render:{pixelArt:false,antialias:true,antialiasGL:true,roundPixels:true},
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},scene:[Workshop]});
 }catch(e){console.error(e);$('game').innerHTML='<div style="padding:60px;color:#ffc86a">Não foi possível iniciar a cena Phaser: '+esc(e.message)+'</div>'}
}
boot();
})();
