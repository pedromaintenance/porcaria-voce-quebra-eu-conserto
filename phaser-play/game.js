/* P.O.R.C.A.R.I.A. Phaser vertical slice v0.9.0 · motor de simulacao v1.1 */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const E=window.PORCARIA_ENGINE;
const I=window.PORCARIA_INSPECTION;
const IV=window.PORCARIA_INSPECTION_VIEW;
const S=window.PORCARIA_SECTORS;
const T=window.PORCARIA_EVIDENCE;
const M=window.PORCARIA_MONITORING;
const MOBILE=window.PORCARIA_MOBILE;
const PANEL_GUIDE=window.PORCARIA_PANEL_GUIDE?.init(document,window);
const mobileTapEvent=MOBILE?.isMobile(window)?'pointerup':'pointerdown';
const isValidMobileTap=pointer=>mobileTapEvent!=='pointerup'||MOBILE.isTap(pointer);
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
 nemuel:'./assets/characters/nemuel-inspetor-4poses-v2.png',
 junior:'./assets/characters/junior/junior-work-4poses.webp',
 diva:'./assets/characters/diva-4poses.webp'
});
// Uniforme de treinamento não é carregado como sprite da oficina.
const TEAM_PORTRAITS=Object.freeze({junior:'./assets/characters/junior/junior-training-4poses.webp'});
const WORKER_FRAME={width:580,height:622,poses:4};
const WORKER_RENDER_FRAME={width:290,height:311}; // amostragem intermediária independente por pose
const WORKER_DISPLAY={width:66,height:80}; // 22% maior, mantendo âncora inferior e boxes
const WORKER_POSES={blocked:[0],diagnose:[0,2,1,2],repair:[0,3,2,3]};
let MODEL_PRESENTATION={};
let BACKGROUND_PROFILES=null;
const esc=s=>String((typeof globalThis!=='undefined'&&globalThis.PORCARIA_IMMERSIVE_COPY?.clean(s))??s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>Math.round(n).toLocaleString('pt-BR');
let data,state,selected,scene;
let trainingUI={tab:'internal',trainerId:null,learnerId:null,group:null,key:null,offerPeople:{}}; // Somente estado visual.
let orderReturnPanel='workshop',preferredBay=null,quickFeedback=null; // Navegação temporária, nunca salva na campanha.
let renderProfile={scale:1,width:1080,height:450,centerX:859,centerY:270};
const FILTER={queue:'all',query:'',store:'all',stockQuery:''};
let toastTimeout;
let planningHorizon='turn';
let reliabilityDays=14; // Janela de indicadores, estado só visual.
let productionDays=14,productionModel='EQ01'; // Painel de entrega operacional.
let pcmScenarioOrder='',pcmScenarioMechanic='',pcmScenarioBay=0; // Comparador sem mutação de save.
let fleetModelFilter='EQ01'; // Filtro visual por modelo.
let decisionHistoryFilter='all'; // Controle de visualização; não altera save.
let lessonFilter='all',lessonSelectedOrderId=null; // Navegação temporária.
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

let monitorCategory='overview';
const PANEL_TITLES={queue:'📻 FILA DE ORDENS DE SERVIÇO',detail:'🔧 ORDEM DE SERVIÇO', 'full-detail':'🔧 DETALHES COMPLETOS DA OS',stats:'📊 INDICADORES E RECURSOS',planning:'🗓️ PLANEJAMENTO PCM',shift:'📋 BRIEFING DE TURNO',team:'👷 EQUIPE DA OFICINA',training:'📚 SETOR DE TREINAMENTOS',store:'📦 ALMOXARIFADO E FERRAMENTAL',help:'❔ CONTROLES DA OFICINA',management:'📋 GESTÃO DA OFICINA',inspection:'🔎 INSPEÇÕES DE CAMPO',monitoring:'📈 SALA DE CONTROLE · MONITORAMENTO'};
function closeSceneMenu(){
 const menu=$('sceneMenu'),trigger=$('sceneMenuBtn');
 if(menu)menu.hidden=true;
 if(trigger)trigger.setAttribute('aria-expanded','false');
}
// Modal tem exclusividade de entrada; nunca permitir selecao de box atraves do overlay.
function modalOpen(){return (!!$('menuOverlay')&&!$('menuOverlay').hidden)||!!MOBILE?.isSectorMenuOpen?.()}
function openPanel(name){
 const overlay=$('menuOverlay');if(!overlay)return;
 if(name==='shift')drawShiftBrief();
 if(name==='planning')drawPlanning();
 if(name==='monitoring')drawMonitoring();
 if(name==='training')drawTraining();
 if(name==='inspection')drawInspection();
 if(scene?.input)scene.input.enabled=false;
 closeSceneMenu();
 overlay.hidden=false;
 MOBILE?.panelOpened?.();
 overlay.classList.toggle('quick-order',name==='detail');
 overlay.classList.toggle('full-order',name==='full-detail');
 $('modalHeading').textContent=PANEL_TITLES[name]||'MENU DA OFICINA';
 document.querySelectorAll('[data-panel]').forEach(el=>el.classList.toggle('is-open',el.dataset.panel===name));
 document.querySelectorAll('.primary-nav [data-open-panel]').forEach(btn=>{const active=btn.dataset.openPanel===name;btn.classList.toggle('is-active',active);btn.setAttribute('aria-expanded',active?'true':'false')});
 document.body.style.overflow='hidden';
 PANEL_GUIDE?.render?.(name);
 $('closePanel')?.focus();
}
function closePanel(){
 const overlay=$('menuOverlay');if(overlay)overlay.hidden=true;
 PANEL_GUIDE?.clear?.();
 MOBILE?.panelClosed?.();
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
 const monitoring=M.summary(state);
 const metric=(title,value,tone)=>'<div class="shiftMetric '+(tone||'')+'"><small>'+esc(title)+'</small><strong>'+esc(value)+'</strong></div>';
 let out='<p class="shiftBriefIntro">DIA '+report.day+' · TURNO '+report.shift+' → '+report.nextShift
   +' · Janela de 12 horas (10,5 HH úteis/mecânico). Revise bloqueios antes de comprometer a próxima escala.</p>';
 out+='<div class="shiftBriefMetrics">'
   +metric('Boxes ocupados',report.counts.assigned+'/'+report.bays.length)
   +metric('Diagnósticos',report.counts.diagnosis)
   +metric('Aptas ao reparo',report.counts.repair)
   +metric('Bloqueios',report.counts.blocked,report.counts.blocked?'critical':'')
   +'</div>';
 if(monitoring.active||monitoring.due||monitoring.attention)out+='<div class="shiftReadinessSummary"><strong>📈 MONITORAMENTO POR CONDIÇÃO</strong><span>'+monitoring.active+' ativo(s) · '+monitoring.due+' recoleta(s) vencida(s) · '+monitoring.attention+' agravamento(s) para decisão</span><button class="act secondary" data-open-panel="monitoring">ABRIR CARTEIRA DE MONITORAMENTO</button></div>';
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
 out+='<div class="shiftBriefFoot"><p>O resultado depende da execução das ordens. Esta programação não garante a conclusão das OS.</p>'
   +'<div class="actions"><button class="act secondary" data-shift-action="cancel">VOLTAR À OFICINA</button>'
   +'<button class="act" data-shift-action="confirm" data-turn-tick="'+report.tick+'">▶ CONFIRMAR +12H</button></div></div>';
 $('shiftBrief').innerHTML=out;
}
function planningTabs(){
 return '<div class="planningTabs" role="group" aria-label="Horizonte de planejamento">'
  +'<button type="button" data-planning-horizon="turn" class="'+(planningHorizon==='turn'?'selected':'')+'" aria-pressed="'+(planningHorizon==='turn')+'">PRÓXIMO TURNO · 12H</button>'
  +'<button type="button" data-planning-horizon="week" class="'+(planningHorizon==='week'?'selected':'')+'" aria-pressed="'+(planningHorizon==='week')+'">JANELA SEMANAL · 14 TURNOS</button>'
  +'<button type="button" data-planning-horizon="alternatives" class="'+(planningHorizon==='alternatives'?'selected':'')+'" aria-pressed="'+(planningHorizon==='alternatives')+'">COMPARAR DECISÕES</button>'
  +'<button type="button" data-planning-horizon="schedule" class="'+(planningHorizon==='schedule'?'selected':'')+'" aria-pressed="'+(planningHorizon==='schedule')+'">PROGRAMAR · 14 TURNOS</button>'
  +'<button type="button" data-planning-horizon="preventive" class="'+(planningHorizon==='preventive'?'selected':'')+'" aria-pressed="'+(planningHorizon==='preventive')+'">PREVENTIVA × CORRETIVA</button>'
  +'<button type="button" data-planning-horizon="production" class="'+(planningHorizon==='production'?'selected':'')+'" aria-pressed="'+(planningHorizon==='production')+'">DESEMPENHO DA FROTA</button>'
  +'<button type="button" data-planning-horizon="kpis" class="'+(planningHorizon==='kpis'?'selected':'')+'" aria-pressed="'+(planningHorizon==='kpis')+'">KPIs DA MANUTENÇÃO</button>'
  +'<button type="button" data-planning-horizon="history" class="'+(planningHorizon==='history'?'selected':'')+'" aria-pressed="'+(planningHorizon==='history')+'">HISTÓRICO DE DECISÕES</button>'
  +'<button type="button" data-planning-horizon="lessons" class="'+(planningHorizon==='lessons'?'selected':'')+'" aria-pressed="'+(planningHorizon==='lessons')+'">LIÇÕES APRENDIDAS</button></div>';
}


function drawPCMAlternatives(){
 const PCM=window.PORCARIA_PCM_OPTIONS;
 const open=PCM.orders(state),staff=state.team||[];
 const opts=(rows,value,key,label)=>rows.map(r=>'<option value="'+esc(r[key])+'"'
    +(String(r[key])===String(value)?' selected':'')+'>'+esc(label(r))+'</option>').join('');
 if(!open.some(j=>j.id===pcmScenarioOrder))pcmScenarioOrder=open[0]?.id||'';
 if(!staff.some(m=>m.id===pcmScenarioMechanic))pcmScenarioMechanic=staff[0]?.id||'';
 if(!Number.isInteger(pcmScenarioBay)||pcmScenarioBay<0||pcmScenarioBay>=state.bays)pcmScenarioBay=0;
 let out=planningTabs()+'<p class="planningIntro">ANÁLISE DE ALTERNATIVAS PCM · Compare a programação antes de assumir um compromisso. '
  +'A consulta não altera dinheiro, horímetros, OS ou o histórico de decisões.</p>';
 if(!open.length){$('planning').innerHTML=out+'<p class="muted">Sem OS disponíveis para análise. '
   +'Abra uma notificação ou aguarde o vencimento das preventivas.</p>';return}
 out+='<section class="scheduleForm"><h3>RECURSOS PARA COMPARAÇÃO</h3><div class="scheduleFields">'
  +'<label>Ordem de serviço<select id="pcmScenarioOrder">'
  +opts(open,pcmScenarioOrder,'id',x=>x.id+' · '+x.asset+' · '+x.title)+'</select></label>'
  +'<label>Profissional<select id="pcmScenarioMechanic">'
  +opts(staff,pcmScenarioMechanic,'id',x=>x.name+' · '+x.specialty)+'</select></label>'
  +'<label>Box<select id="pcmScenarioBay">'
  +Array.from({length:state.bays},(_,i)=>'<option value="'+i+'"'+(i===pcmScenarioBay?' selected':'')+'>BOX '+(i+1)+'</option>').join('')
  +'</select></label></div></section>';
 const report=PCM.calculate(state,data,E,{orderId:pcmScenarioOrder,mechanicId:pcmScenarioMechanic,bay:pcmScenarioBay});
 if(!report.available){$('planning').innerHTML=out+'<p class="planningNoResource">'+esc(report.reason)+'</p>';return}
 const n=x=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:1});
 out+='<div class="planningMetrics">'
  +'<div class="planningMetric"><small>OS analisada</small><strong>'+esc(report.orderId)+'</strong></div>'
  +'<div class="planningMetric"><small>Equipamento</small><strong>'+esc(report.asset)+'</strong></div>'
  +'<div class="planningMetric"><small>Jornada do ativo</small><strong>'+n(report.operatingDutyHours)+' h</strong></div>'
  +'<div class="planningMetric"><small>Esforço restante</small><strong>'+n(report.remainingEffort)+' HH</strong></div></div>';
 out+='<h3 class="resourceSection">ALTERNATIVAS DE PROGRAMAÇÃO</h3><div class="pcmScenarioCards">';
 for(const opt of report.options){
  out+='<article class="planningOrder pcmScenarioCard">'
   +'<div class="planningOrderHeader"><strong>'+esc(opt.title)+'</strong>'
   +'<span class="planningTag">'+(opt.available?'DISPONÍVEL':'IMPEDIMENTO')+'</span></div>'
   +'<p>'+esc(opt.note)+'</p>';
  if(report.type==='corrective'&&opt.exposureHours)out+='<p>Exposição condicional se a OS permanecer aberta: <b>'
   +n(opt.exposureHours)+' h corridas</b> até o fim da referência considerada; não representa previsão de conclusão.</p>';
  if(opt.estimatedOperatingGap!==null)out+='<p>Conflito estimado com a jornada: <b>'
   +n(opt.estimatedOperatingGap)+' hora(s)-ativo</b>, apenas se o serviço for concluído neste turno.</p>';
  if(!opt.action)out+='<p class="planningExplanation">Nenhuma alteração será aplicada.</p>';
  if(!opt.available)out+='<p class="planningNoResource">Impedimento: '+esc(opt.reason)+'</p>';
  if(opt.available&&opt.action)out+='<button type="button" class="act" data-pcm-confirm-option="'+opt.id
   +'" data-pcm-confirm-order="'+esc(report.orderId)+'">'
   +(opt.action==='assign_pm'?'ALOCAR PREVENTIVA COM DIVA':'CONFIRMAR RESERVA PCM')+'</button>';
  out+='</article>';
 }
 out+='</div><p class="planningExplanation">'+esc(report.note)+'</p>';
 $('planning').innerHTML=out;
}

function drawSchedule(){
 const schedule=window.PORCARIA_WEEKLY_SCHEDULE.compute(state,data);
 const metric=(name,value)=>'<div class="planningMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong></div>';
 const booked=new Set(schedule.rows.filter(r=>r.status==='planned').map(r=>r.orderId));
 const freeOrders=[
  ...state.jobs.filter(j=>!j.assigned&&!booked.has(j.id)),
  ...(state.preventiveOrders||[]).filter(j=>j.status==='open'&&!booked.has(j.id))
 ];
 const option=(value,label)=>'<option value="'+esc(value)+'">'+esc(label)+'</option>';
 let out=planningTabs()
  +'<p class="planningIntro">PROGRAMAÇÃO PCM · 14 turnos. Reserve manualmente profissional e box. A reserva protege o turno contra conflitos, sem executar a OS ou prever sua conclusão.</p>'
  +'<div class="planningMetrics">'+metric('Reservas ativas',schedule.pending)
  +metric('Cumpridas',schedule.fulfilled)+metric('Não realizadas',schedule.missed)
  +metric('Canceladas',schedule.cancelled)+'</div>';
 out+='<div class="scheduleSlots">'+schedule.slots.map(t=>
   '<article class="scheduleSlot"><strong>D'+t.day+' · '+t.shift+'</strong><small>Turno '+t.tick+'</small>'
   +'<b>'+t.reserved+'/'+state.bays+' reservas</b><small>'+t.free+' box(es) livres no calendário</small></article>').join('')+'</div>';
 if(!freeOrders.length)out+='<p class="planningIntro">Nenhuma OS livre para nova reserva. Cancele uma programação para remarcar.</p>';
 else out+='<section class="scheduleForm"><h3>RESERVAR PROGRAMAÇÃO</h3><div class="scheduleFields">'
  +'<label>Ordem de serviço<select id="scheduleOrder">'
  +freeOrders.map(j=>option(j.id,j.id+' · '+j.asset+' · '+(j.kind==='preventive'
    ?'PREVENTIVA · '+j.title:j.stage>=6?'Diagnóstico completo':'Investigação '+j.stage+'/6'))).join('')+'</select></label>'
  +'<label>Profissional<select id="scheduleWorker">'
  +state.team.map(m=>option(m.id,m.name+' · '+m.specialty)).join('')+'</select></label>'
  +'<label>Box<select id="scheduleBay">'
  +Array.from({length:state.bays},(_,i)=>option(i,'BOX '+(i+1))).join('')+'</select></label>'
  +'<label>Turno<select id="scheduleTick">'
  +schedule.slots.map(t=>option(t.tick,'D'+t.day+' · '+t.shift+' · turno '+t.tick)).join('')+'</select></label></div>'
  +'<button type="button" class="act" data-schedule-book>REGISTRAR RESERVA</button>'
  +'<p class="planningExplanation">A reserva não movimenta ferramentas, peças ou equipe. A análise de material só ocorre após diagnóstico 6/6; a condição precisa ser confirmada no turno.</p></section>';
 out+='<h3 class="resourceSection">COMPROMISSOS E HISTÓRICO</h3>';
 if(!schedule.rows.length)out+='<p class="muted">Sem reservas registradas nesta campanha.</p>';
 else out+='<div class="scheduleHistory">'+schedule.rows.map(r=>{
  const label={planned:'PROGRAMADA',fulfilled:'EXECUTADA',missed:'NÃO REALIZADA',cancelled:'CANCELADA'}[r.status]||'REGISTRADA';
  return '<article class="planningOrder"><div class="planningOrderHeader"><strong>'
   +esc(r.orderId)+' · '+esc(r.asset)+(r.kind==='preventive'?' · PREVENTIVA / DIVA':'')
   +'</strong><span class="planningTag">'+label+'</span></div>'
   +'<p>Turno '+r.tick+' · '+esc(r.mechanic)+' · BOX '+(r.bay+1)+'</p>'
   +'<small>'+esc(r.availability)+(r.blocked?' · Há conflito operacional no turno atual':'')
   +(r.remaining!==null&&r.remaining>10.5?' · Reparo pode exigir mais de um turno':'')+'</small>'
   +(r.status==='planned'?'<div class="actions"><button type="button" class="act secondary" data-schedule-cancel="'+esc(r.id)+'">CANCELAR RESERVA</button>'
    +(r.canStart?'<button type="button" class="act" data-schedule-start="'+esc(r.id)+'">'
      +(r.kind==='preventive'?'INICIAR PREVENTIVA COM DIVA':'ALOCAR NO TURNO ATUAL')+'</button>':'')
    +'</div>':'')+'</article>';
 }).join('')+'</div>';
 out+='<p class="planningExplanation">'+esc(schedule.note)+'</p>';
 $('planning').innerHTML=out;
}

function drawPreventive(){
 const pm=window.PORCARIA_PREVENTIVE_ORDERS.compute(state,data);
 const metrics=(key,v)=>'<div class="planningMetric"><small>'+esc(key)+'</small><strong>'+esc(v)+'</strong></div>';
 const names=new Map(state.team.map(m=>[m.id,m.name]));
 const free=state.team.filter(m=>!m.assigned&&m.restAt!==state.tick&&!E.TRAINING.active(state,m)&&!E.physicalBlock(state,m));
 const usedBays=new Set(state.jobs.filter(j=>j.bay!==null).map(j=>j.bay));
 for(const r of pm.orders)if(r.bay!==null)usedBays.add(r.bay);
 let out=planningTabs()
  +'<p class="planningIntro">PCM PREVENTIVO · OS geradas por vencimento no horímetro de cada ativo. Atribua um mecânico e um box; o supervisor Diva acompanha a execução na oficina.</p>'
  +'<div class="planningMetrics">'+metrics('OS preventivas abertas',pm.open)
  +metrics('Em execução',pm.allocated)+metrics('OS concluídas no histórico',pm.completed)
  +metrics('Próximo ciclo por ativo','48 h')+'</div>'
  +'<div class="planningExplanation">Pacotes: inspeção 2 HH/R$120; serviço 4 HH/R$360. A OS é gerada no vencimento; custos são apropriados somente na conclusão do serviço.</div>'
  +'<h3 class="resourceSection">CARTEIRA DE OS PREVENTIVAS AUTOMÁTICAS</h3>';
 const pending=pm.orders.filter(r=>r.status!=='completed');
 const pmBookings=new Map((state.scheduleEntries||[]).filter(q=>q.status==='planned')
  .map(q=>[q.orderId,q]));
 if(!pending.length)out+='<p class="muted">Sem OS preventivas abertas neste turno. Novas OS são geradas automaticamente quando os horímetros atingirem o próximo vencimento.</p>';
 for(const r of pending){
  const mechanic=r.assigned?names.get(r.assigned)||r.assigned:'AGUARDANDO ALOCAÇÃO';
  out+='<article class="planningOrder"><div class="planningOrderHeader"><strong>'+esc(r.id)+' · '+esc(r.asset)+' · '+esc(r.title)+'</strong>'
   +'<span class="planningTag">'+(r.assigned?'EM EXECUÇÃO':'GERADA AUTOMATICAMENTE')+'</span></div>'
   +'<p>'+esc(r.model)+' · Gatilho: '+Number(r.dueHourmeter).toLocaleString('pt-BR')+' h'
   +' · Mecânico: '+esc(mechanic)+(r.assigned?' · BOX '+(r.bay+1)+' · Diva acompanha':'')+'</p>'
   +'<p>Esforço remanescente: '+Number(r.repairRemaining).toLocaleString('pt-BR')+' HH · Custo do serviço: R$ '+brl(r.cost)+'</p>';
  const booking=pmBookings.get(r.id);
  if(booking)out+='<p class="planningExplanation">RESERVA PCM · Turno '+booking.tick
   +' · '+esc(names.get(booking.mechanicId)||booking.mechanicId)
   +' · BOX '+(booking.bay+1)
   +(booking.tick===state.tick?' · Utilize o calendário para iniciar a OS.':' · Aguardando o turno programado.')+'</p>';
  if(r.assigned)out+='<button type="button" class="act secondary" data-pm-os-release="'+esc(r.id)+'">LIBERAR EQUIPE E BOX</button>';
  else if(booking)out+='<p class="planningExplanation">Para alterar a programação, cancele a reserva no calendário PCM.</p>';
  else if(free.length&&usedBays.size<state.bays){
   out+='<div class="scheduleFields"><label>Mecânico<select id="pmWorker-'+esc(r.id)+'">'
    +free.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.name)+'</option>').join('')+'</select></label>'
    +'<label>Box<select id="pmBay-'+esc(r.id)+'">'
    +Array.from({length:state.bays},(_,i)=>!usedBays.has(i)?'<option value="'+i+'">BOX '+(i+1)+'</option>':'').join('')
    +'</select></label></div><button type="button" class="act" data-pm-os-assign="'+esc(r.id)+'">ALOCAR MECÂNICO + DIVA</button>';
  }else out+='<p class="planningExplanation">Sem mecânico ou box livre. Libere algum recurso e reprograme.</p>';
  out+='</article>';
 }
 out+='<h3 class="resourceSection">OS PREVENTIVAS CONCLUÍDAS</h3>';
 const finished=pm.orders.filter(r=>r.status==='completed');
 out+=finished.length?'<div class="scheduleHistory">'+finished.slice(-12).reverse().map(r=>
  '<article class="planningOrder"><strong>'+esc(r.id)+' · '+esc(r.asset)+'</strong>'
  +'<p>'+esc(r.title)+' · '+Number(r.worked).toLocaleString('pt-BR')+' HH'
  +' · R$ '+brl(r.cost)+' · Supervisor: Diva · Turno de conclusão: '+r.finishedTick+'</p></article>').join('')+'</div>'
  :'<p class="muted">Nenhuma OS preventiva concluída.</p>';
 out+='<p class="planningExplanation">'+esc(pm.note)+'</p>';
 $('planning').innerHTML=out;
}


function drawProduction(){
 const r=window.PORCARIA_PRODUCTION.compute(state,data,{days:productionDays}),m=r.metrics;
 const fmt=x=>x==null?'—':Number(x).toLocaleString('pt-BR',{maximumFractionDigits:1});
 const metric=(label,value,note='')=>'<div class="planningMetric"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong>'
  +(note?'<small>'+esc(note)+'</small>':'')+'</div>';
 let out=planningTabs()+'<p class="planningIntro">CONTROLE OPERACIONAL DA FROTA · Jornada planejada × horas efetivamente operadas. '
  +'A manutenção pode reduzir o atendimento da jornada. Não confundir horas operadas com tonelagem produzida.</p>';
 out+='<div class="reliabilityFilters" role="group" aria-label="Período de desempenho">';
 for(const days of [7,14,30])out+='<button type="button" class="act '+(productionDays===days?'':'secondary')
  +'" data-production-days="'+days+'" aria-pressed="'+(productionDays===days)+'">ÚLTIMOS '+days+' DIAS</button>';
 out+='</div><div class="planningMetrics">'
  +metric('Jornada programada',fmt(m.plannedHours)+' h','Horas-ativo com programação registrada')
  +metric('Horas de operação cumpridas',fmt(m.operatingHours)+' h')
  +metric('Cumprimento da jornada',m.attainmentPct===null?'—':fmt(m.attainmentPct)+'%')
  +metric('Capacidade programada não cumprida',fmt(m.shortfallHours)+' h')
  +metric('Perda de jornada · corretiva',fmt(m.correctiveLossHours)+' h')
  +metric('Perda de jornada · preventiva',fmt(m.preventiveLossHours)+' h')
  +metric('Modelos dentro da meta',m.modelGoalsMet+'/'+m.modelsEvaluated)
  +'</div>';
 if(!r.coverage.fullWindow||r.coverage.missingDutySnapshots){
  out+='<p class="planningNoResource">Cobertura parcial: '+r.coverage.eligibleAssetTurns+' registros de equipamento/turno com jornada conhecida.'
   +(r.coverage.missingDutySnapshots?' '+r.coverage.missingDutySnapshots+' registros anteriores sem jornada armazenada foram excluídos.':'')
   +' Os percentuais representam somente o período efetivamente medido.</p>';
 }
 out+='<h3 class="resourceSection">CUMPRIMENTO DA JORNADA POR MODELO</h3>';
 out+='<div class="productionModelList">';
 for(const model of r.models){
  const pct=model.attainmentPct,vis=pct===null?0:Math.min(100,pct);
  out+='<article class="planningOrder productionModelRow">'
    +'<div class="planningOrderHeader"><strong>'+esc(model.title)+'</strong>'
    +'<span class="planningTag">'+(pct===null?'SEM BASE':pct>=model.targetPct?'META ATENDIDA':'ABAIXO DA META')+'</span></div>'
    +'<p>'+fmt(model.operating)+' / '+fmt(model.planned)+' h · '+(pct===null?'—':fmt(pct)+'%')+' de cumprimento</p>'
    +'<div class="productionTrack" role="img" aria-label="Jornada cumprida: '+fmt(pct)+' porcento">'
    +'<span style="width:'+vis+'%"></span></div>'
    +'<div class="productionModelFooter"><small>Corretiva: '+fmt(model.correctiveLoss)+' h · Preventiva: '+fmt(model.preventiveLoss)+' h</small>'
    +'<label>Meta <select data-production-target="'+esc(model.modelId)+'" aria-label="Meta de '+esc(model.title)+'">'
    +window.PORCARIA_PRODUCTION.TARGETS.map(x=>'<option value="'+x+'"'+(x===model.targetPct?' selected':'')+'>'+x+'%</option>').join('')
    +'</select></label></div></article>';
 }
 out+='</div>';
 if(!r.models.some(x=>x.modelId===productionModel))productionModel=r.models[0]?.modelId||'EQ01';
 out+='<h3 class="resourceSection">COMPARATIVO POR EQUIPAMENTO</h3>'
  +'<div class="fleetModelSelect"><label for="productionModelFilter">MODELO</label>'
  +'<select id="productionModelFilter" aria-label="Modelo para comparação operacional">'
  +r.models.map(x=>'<option value="'+esc(x.modelId)+'"'+(x.modelId===productionModel?' selected':'')+'>'
   +esc(x.title)+'</option>').join('')+'</select></div>';
 const selected=r.assets.filter(x=>x.modelId===productionModel)
  .sort((a,b)=>(b.attainmentPct??-1)-(a.attainmentPct??-1)||a.asset.localeCompare(b.asset));
 out+='<div class="fleetAssetList">';
 if(!selected.length)out+='<p class="muted">Sem turno registrado com jornada conhecida para este modelo.</p>';
 for(const a of selected){
  out+='<article class="planningOrder"><div class="planningOrderHeader"><strong>'+esc(a.asset)+'</strong>'
  +'<span class="planningTag">'+(a.attainmentPct===null?'SEM JORNADA':fmt(a.attainmentPct)+'%')+'</span></div>'
  +'<p>'+fmt(a.operating)+' / '+fmt(a.planned)+' h operadas / planejadas · Desvio '+fmt(a.gap)+' h</p>'
  +'<small>Perda por corretivas: '+fmt(a.correctiveLoss)+' h · Por preventivas: '+fmt(a.preventiveLoss)+' h</small></article>';
 }
 out+='</div>';
 out+='<p class="planningExplanation">As metas representam o percentual de horas de operação planejadas que devem ser cumpridas. '
  +'Horários sem jornada registrada não são reconstruídos. Mudanças de meta passam a valer na avaliação atual e ficam no histórico de decisões PCM.</p>';
 $('planning').innerHTML=out;
}
function drawReliability(){
 const report=window.PORCARIA_RELIABILITY.compute(state,data,{days:reliabilityDays}),m=report.metrics;
 const fleet=window.PORCARIA_FLEET_TELEMETRY.compute(state,data,{days:reliabilityDays});
 const num=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:1});
 const val=n=>n==null?'—':num(n);
 const metric=(name,value,note='')=>'<div class="planningMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong>'
  +(note?'<small>'+esc(note)+'</small>':'')+'</div>';
 let out=planningTabs()+'<p class="planningIntro">ENGENHARIA DE MANUTENÇÃO · Resultados observados na campanha. Custos, esforço (HH) e exposição em horas corridas são grandezas diferentes.</p>'
  +'<div class="reliabilityFilters" role="group" aria-label="Janela de indicadores">';
 for(const days of [7,14,30])out+='<button type="button" class="act '+(reliabilityDays===days?'':'secondary')+'" data-reliability-days="'+days+'" aria-pressed="'+(reliabilityDays===days)+'">ÚLTIMOS '+days+' DIAS</button>';
 out+='</div><div class="planningMetrics">'
  +metric('OS corretivas concluídas',m.correctiveOrders)
  +metric('Preventivas executadas',m.preventiveServices)
  +metric('HH corretivas (OS encerradas)',val(m.correctiveHH)+' HH')
  +metric('HH preventivas executadas',val(m.preventiveHH)+' HH')
  +metric('Participação preventiva',m.resourceSharePreventivePct===null?'—':val(m.resourceSharePreventivePct)+'%','Sobre HH executadas no período')
  +metric('Backlog atual',m.backlog+' OS','Críticas: '+m.critical)
  +metric('Primeira execução sem retrabalho',m.firstPassPct===null?'—':val(m.firstPassPct)+'%','Base: '+m.firstPassEvaluated+' OS classificadas')
  +metric('Reincidências observadas',m.recurrenceEvents,'Em '+m.recurringAssets+' ativo(s)')
  +'</div>';
 out+='<h3 class="resourceSection">ESFORÇO EXECUTADO POR DIA · SÉRIE DO SAVE</h3>';
 const max=Math.max(1,...report.trend.map(x=>Math.max(x.preventiveHH,x.correctiveHH)));
 out+='<div class="reliabilityGraph" role="img" aria-label="Comparação diária de horas de preventiva e corretiva na janela selecionada">';
 for(const t of report.trend){
  const pm=(t.preventiveHH/max*100).toFixed(2),cm=(t.correctiveHH/max*100).toFixed(2);
  out+='<div class="reliabilityColumn" title="Turnos '+t.fromTick+' a '+t.toTick+': '+val(t.preventiveHH)+' HH preventivas; '+val(t.correctiveHH)+' HH corretivas">'
   +'<div class="reliabilityBars"><span class="reliabilityBar pm" style="height:'+pm+'%"></span>'
   +'<span class="reliabilityBar cm" style="height:'+cm+'%"></span></div>'
   +'<small>'+t.index+'</small></div>';
 }
 out+='</div><p class="planningExplanation"><b>Legenda:</b> <span style="color:#8bd8b3">■ Preventiva</span> · <span style="color:#ffbb70">■ Corretiva</span>. '
  +'Apenas OS concluídas e preventivas executadas aparecem na série; sem projeções de HH pendentes.</p>';
 out+='<h3 class="resourceSection">CUSTOS REGISTRADOS · SEM DUPLA CONTAGEM</h3><div class="planningMetrics">'
  +metric('Preventiva executada (caixa)', 'R$ '+brl(m.preventiveCost))
  +metric('Preventiva autorizada pendente', 'R$ '+brl(m.preventiveCommittedCost))
  +metric('Mão de obra corretiva (contábil)', 'R$ '+brl(m.correctiveLaborCost))
  +metric('Material aplicado (valor indicativo)', 'R$ '+brl(m.materialConsumedValuation))
  +metric('Compras no período (caixa)', 'R$ '+brl(m.purchasesCash))
  +metric('Retrabalho em OS fechadas', val(m.reworkHH)+' HH')
  +'</div>';
 out+='<h3 class="resourceSection">PRAZO DAS OS E EXPOSIÇÃO</h3><div class="planningMetrics">'
  +metric('Prazo médio das OS encerradas',m.meanClosedLeadHours===null?'—':val(m.meanClosedLeadHours)+' h','Abertura até conclusão; não é MTTR físico')
  +metric('Esforço médio por OS',m.meanCorrectiveEffortHH===null?'—':val(m.meanCorrectiveEffortHH)+' HH')
  +metric('Exposição das OS em aberto',val(m.activeOrderExposureHours)+' h','Soma de horas corridas por OS; não da frota')
  +metric('Turnos aguardando peças',val(m.materialShifts))
  +metric('Turnos aguardando ferramentas',val(m.toolShifts))
  +metric('Turnos em fila de diagnóstico',val(m.diagnosisQueueShifts))
  +'</div>';
 out+=window.PORCARIA_FLEET_VIEW.render(fleet,fleetModelFilter);
 out+='<h3 class="resourceSection">REINCIDÊNCIA POR ATIVO · REGISTROS CONHECIDOS</h3>';
 if(!report.repeated.length)out+='<p class="planningIntro">Sem nova OS no mesmo ativo depois de uma conclusão anterior dentro da janela e do histórico disponível.</p>';
 else out+='<div class="scheduleHistory">'+report.repeated.map(r=>
   '<article class="planningOrder"><div class="planningOrderHeader"><strong>'+esc(r.asset)+' · '+esc(r.model)+'</strong>'
   +'<span class="planningTag">'+r.repeatCount+' ocorrência(s)</span></div><p>Mesmo histórico de ocorrência: '+r.sameScenario+' · Última OS: '+esc(r.lastOrderId||'—')+'</p>'
   +'<small>'+esc(r.distinction)+'</small></article>').join('')+'</div>';
 if(report.coverage.limitedClosed||report.coverage.limitedPreventive)
  out+='<p class="planningNoResource">Limite de retenção alcançado: históricos antigos podem não estar neste save. Indicadores descrevem somente o conjunto ainda preservado.</p>';
 out+='<div class="weeklyAssumptions"><strong>CRITÉRIOS E LIMITES DE ENGENHARIA</strong><ul>'
  +report.notes.map(note=>'<li>'+esc(note)+'</li>').join('')+'</ul></div>';
 out+='<div class="actions"><button type="button" class="act secondary" data-planning-horizon="history">HISTÓRICO AUDITÁVEL</button>'
  +'<button type="button" class="act secondary" data-planning-horizon="preventive">PLANEJAR PREVENTIVAS</button></div>';
 $('planning').innerHTML=out;
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
function drawDecisionHistory(){
 const report=window.PORCARIA_DECISION_LEDGER.compute(state,data,{filter:decisionHistoryFilter,limit:24});
 const m=report.metrics;
 const metric=(name,value)=>'<div class="planningMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong></div>';
 let out=planningTabs()+'<p class="planningIntro">Histórico de decisões do Supervisor e PCM por turno. Exibe decisões registradas e resultados observados, sem inferir causalidade não comprovada.</p>';
 out+='<div class="planningMetrics">'
  +metric('Eventos registrados',m.recordedEvents)
  +metric('Avaliações PCM',m.pcmReviews)
  +metric('Divergências detectadas',m.detectedDivergences)
  +metric('OS concluídas',m.completed)
  +metric('Compras',m.purchases)
  +metric('Compras sem demanda diagnosticada',m.earlyWithoutDiagnosedDemand)
  +metric('Compras urgentes',m.urgentPurchases)
  +metric('HH de retrabalho encerradas',m.recordedReworkHours+'h')
  +'</div>';
 out+='<section class="planningDecisionLedger"><h3>📑 INTERPRETAÇÃO RESPONSÁVEL</h3><p>'+esc(report.interpretation)+'</p><small>'+esc(report.caveat)+'</small></section>';
 out+='<h3 class="resourceSection">PLANO APROVADO × EXECUÇÃO REGISTRADA</h3>';
 if(!report.plans.length)out+='<p class="muted">Ainda não há OS concluídas com estimativa HH aprovada no PCM. A comparação aparecerá aqui quando houver dados.</p>';
 else out+='<div class="decisionHistoryGrid">'+report.plans.map(p=>
  '<article class="planningOrder"><strong>'+esc(p.orderId)+' · '+esc(p.modelId)+'</strong>'
  +'<p>Plano PCM: '+p.plannedHH+' HH · Esforço registrado: '+p.workedHH+' HH · Diferença: '+(p.effortDifferenceHH>0?'+':'')+p.effortDifferenceHH+' HH</p>'
  +'<p>Tempo de OS: '+p.downtimeHours+'h corridas · Retrabalho: '+p.reworkHours+' HH · Divergências PCM: '+p.plannerErrors+'</p>'
  +'<small>HH de esforço não equivalem a horas de parada. '+(p.firstTime?'Conclusão sem retrabalho registrado.':'Conclusão com ocorrências adicionais registradas.')+'</small></article>'
 ).join('')+'</div>';
 out+='<h3 class="resourceSection">LINHA DO TEMPO · DECISÕES</h3><div class="decisionHistoryFilters">';
 for(const [key,name] of [['all','TODOS'],['supply','COMPRAS'],['pcm','PCM'],['execution','EXECUÇÃO']]){
  out+='<button type="button" class="act '+(decisionHistoryFilter===key?'':'secondary')+'" data-decision-filter="'+key+'" aria-pressed="'+(decisionHistoryFilter===key)+'">'+name+'</button>';
 }
 out+='</div>';
 if(!report.timeline.length)out+='<p class="muted">Sem eventos nesta categoria. Saves anteriores continuam legíveis, mas suas decisões passadas não são reconstruídas artificialmente.</p>';
 else out+='<div class="decisionTimeline">'+report.timeline.map(e=>{
  const detail=e.type==='purchase'?' · '+esc(e.item)+' ×'+e.quantity+' · R$ '+brl(e.paid)+' · '+(e.fast?'urgente':'normal')+' · pedido '+esc(e.purchaseId)
   :e.type==='receipt'?' · '+esc(e.purchaseId)+' · '+esc(e.item)+' ×'+e.quantity
   :e.type==='allocation'?' · '+esc(e.orderId)+' · '+esc(e.mechanicName||e.mechanicId)+' · BOX '+(Number(e.bay)+1)
   :e.type==='pcm_review'?' · '+esc(e.notificationId)+' · '+e.estimatedHH+' HH estimadas'
   :e.type==='pcm_conversion'?' · '+esc(e.notificationId)+' → '+esc(e.orderId)
   :e.type==='planner_evaluation'?' · '+esc(e.orderId)+' · '+e.errors+' divergência(s) detectada(s)'
   :e.type==='completion'?' · '+esc(e.orderId)+' · '+e.downtimeHours+'h de OS · '+e.reworkHours+' HH retrabalho':'';
  return '<article class="decisionTimelineEvent"><span>TURNO '+esc(e.tick)+' · DIA '+esc(e.day)+'</span><strong>'+esc(e.label)+'</strong><p>'+detail+'</p></article>';
 }).join('')+'</div>';
 out+='<p class="planningExplanation">Compras e aprovações permanecem ações manuais. A linha do tempo não altera a campanha. A ausência de um evento antigo não indica que a ação nunca ocorreu.</p>';
 $('planning').innerHTML=out;
}
function drawLessons(){
 const report=window.PORCARIA_LESSONS_LEARNED.compute(state,data,{filter:lessonFilter,limit:60});
 const metric=(name,value)=>'<div class="planningMetric"><small>'+esc(name)+'</small><strong>'+esc(value)+'</strong></div>';
 let out=planningTabs()+'<p class="planningIntro">Lições aprendidas da oficina: sintomas, investigação, decisão, resultado e reflexão. As conclusões devem permanecer vinculadas às evidências e aos procedimentos aplicáveis.</p>';
 out+='<div class="planningMetrics">'
  +metric('OS concluídas no histórico',report.total)
  +metric('Lições registradas',report.withReflection)
  +metric('Aguardando reflexão',report.withoutReflection)+'</div>';
 out+='<div class="planningDecisionLedger"><h3>COMPROMISSO TÉCNICO</h3><p>'+esc(report.note)+'</p></div>';
 const related=(state.jobs||[]).map(j=>({job:j,previous:window.PORCARIA_LESSONS_LEARNED.similarForActive(state,j)})).filter(x=>x.previous.count>0);
 if(related.length){
  out+='<h3 class="resourceSection">EXPERIÊNCIAS EM OS ATIVAS</h3><div class="decisionHistoryGrid">';
  out+=related.slice(0,8).map(({job,previous})=>{
   let text='<article class="planningOrder"><strong>'+esc(job.id)+' · '+esc(job.modelId)+'</strong>'
    +'<p>'+previous.count+' caso(s) semelhante(s) concluído(s) nesta campanha.</p>';
   if(!previous.unlocked)text+='<small>Reflexões liberadas após concluir o diagnóstico (6/6). Nenhum gabarito antecipado.</small>';
   else if(!previous.reflections.length)text+='<small>Diagnóstico concluído. Ainda não existem reflexões escritas para casos semelhantes.</small>';
   else text+=previous.reflections.map(r=>'<p><strong>'+esc(window.PORCARIA_LESSONS_LEARNED.TAGS[r.tag]||r.tag)+':</strong> '+esc(r.text)+'</p>').join('');
   return text+'</article>';
  }).join('')+'</div>';
 }
 out+='<h3 class="resourceSection">DOSSIÊS DE OS CONCLUÍDAS</h3><div class="decisionHistoryFilters">';
 for(const [key,label] of [['all','TODOS'],['pending','SEM REFLEXÃO'],['reviewed','COM LIÇÃO']])
  out+='<button type="button" class="act '+(lessonFilter===key?'':'secondary')+'" data-lesson-filter="'+key+'" aria-pressed="'+(lessonFilter===key)+'">'+label+'</button>';
 out+='</div>';
 if(!report.rows.length)out+='<p class="muted">Ainda não há OS concluídas neste filtro. Avance a campanha e conclua serviços para registrar aprendizagens.</p>';
 else out+='<div class="decisionHistoryGrid">'+report.rows.map(j=>
   '<button type="button" class="lessonCard" data-lesson-open="'+esc(j.orderId)+'">'
   +'<strong>'+esc(j.orderId)+' · '+esc(j.modelId)+'</strong>'
   +'<span>'+esc(j.caseTitle)+'</span>'
   +'<small>'+j.downtimeHours+'h de OS · '+j.reworkHH+' HH retrabalho · '+j.plannerErrors+' divergência(s) PCM</small>'
   +'<small>'+(j.reflection?'✓ Lição registrada · '+esc(window.PORCARIA_LESSONS_LEARNED.TAGS[j.reflection.tag]||j.reflection.tag):'Pendente de reflexão')+'</small></button>'
  ).join('')+'</div>';
 const selected=window.PORCARIA_LESSONS_LEARNED.compute(state,data,{filter:'all'}).rows.find(x=>x.orderId===lessonSelectedOrderId);
 if(selected){
  out+='<section class="lessonDossier"><h3>ANÁLISE PÓS-INTERVENÇÃO · '+esc(selected.orderId)+'</h3>'
  +'<p><strong>Sintoma recebido:</strong> '+esc(selected.report)+'</p>'
  +'<p><strong>Resultado observado:</strong> '+esc(selected.classification)+'</p>'
  +'<p><strong>Indicadores:</strong> '+selected.downtimeHours+'h de OS · '+selected.laborHH+' HH trabalhadas · '+selected.reworkHH+' HH de retrabalho'
    +' · espera material '+selected.materialWaitShifts+' turno(s) · ferramenta '+selected.toolWaitShifts+' turno(s)</p>'
  +'<p><strong>Investigações registradas:</strong> '+selected.diagnosisCount.confirmed+' confirmações no diagnóstico de referência · '
   +selected.diagnosisCount.rejected+' hipóteses rejeitadas · '+selected.diagnosisCount.inconclusive+' inconclusivas · '
   +selected.diagnosisCount.evidence+' inspeções complementares solicitadas</p>';
  if(selected.route)out+='<p><strong>Hipótese de encerramento:</strong> '+esc(selected.route.component)+' · '+esc(selected.route.damage)
   +' · '+esc(selected.route.cause)+'</p>'
   +'<p><strong>Verificação prevista no roteiro:</strong> '+esc(selected.route.verification)+'</p>'
   +'<small>Esta hipótese é o gabarito da missão, não a causa raiz confirmada por análise real.</small>';
  out+='<div class="lessonEditor"><label for="lessonTag">Tema da aprendizagem</label>'
   +'<select id="lessonTag">';
  for(const [key,label] of Object.entries(window.PORCARIA_LESSONS_LEARNED.TAGS))
   out+='<option value="'+key+'"'+((selected.reflection?.tag||'diagnostico')===key?' selected':'')+'>'+esc(label)+'</option>';
  out+='</select><label for="lessonText">O que inspecionar, planejar ou conferir na próxima ocorrência?</label>'
   +'<textarea id="lessonText" rows="4" maxlength="300" placeholder="Registre uma ação verificável, sem tratar hipótese como certeza.">'+esc(selected.reflection?.text||'')+'</textarea>'
   +'<small>20 a 300 caracteres. Reflexão escrita pelo jogador e associada à OS concluída.</small>'
   +'<div class="actions"><button type="button" class="act" data-lesson-save="'+esc(selected.orderId)+'">SALVAR LIÇÃO</button>'
   +'<button type="button" class="act secondary" data-lesson-close>FECHAR DOSSIÊ</button></div></div></section>';
 }
 out+='<p class="planningExplanation">As reflexões não são transmitidas a sistemas SAP, não alteram automaticamente peças, OS, pontuação ou a equipe e não revelam o diagnóstico durante a investigação.</p>';
 $('planning').innerHTML=out;
}
function drawPlanning(){
 if($('planningNotifications'))$('planningNotifications').innerHTML=S.planning(state,data,I,E,IV);
 if(planningHorizon==='week'){drawWeekly();return}
 if(planningHorizon==='schedule'){drawSchedule();return}
 if(planningHorizon==='alternatives'){drawPCMAlternatives();return}
 if(planningHorizon==='preventive'){drawPreventive();return}
 if(planningHorizon==='kpis'){drawReliability();return}
 if(planningHorizon==='production'){drawProduction();return}
 if(planningHorizon==='history'){drawDecisionHistory();return}
 if(planningHorizon==='lessons'){drawLessons();return}
 const plan=window.PORCARIA_PLANNING.compute(state,data);
 const impact=window.PORCARIA_DECISION_IMPACT.compute(state,data);
 const metric=(title,value)=>'<div class="planningMetric"><small>'+esc(title)+'</small><strong>'+esc(value)+'</strong></div>';
 let out=planningTabs()+'<p class="planningIntro">DIA '+plan.day+' · TURNO '+plan.shift+' · Compare as OS não alocadas e programe um serviço por vez. '
   +'A sugestão não substitui seu julgamento; a decisão fica registrada no motor da oficina.</p>';
 out+='<div class="planningMetrics">'
   +metric('OS aguardando',plan.countWaiting)
   +metric('Críticas sem equipe',plan.countCriticalWaiting)
   +metric('Mecânicos livres',plan.freeMechanics.length)
   +metric('HH brutas restantes',plan.remainingGrossHours+'h')
   +metric('Horas paradas em OS abertas',impact.metrics.activeDowntimeHours+'h')
   +metric('Turnos sem peça',impact.metrics.materialWaitShifts)
   +metric('Turnos sem ferramenta',impact.metrics.toolWaitShifts)
   +metric('Retrabalho registrado',impact.metrics.reworkHours+'h')+'</div>';
 out+='<section class="planningDecisionLedger"><h3>📊 CUSTO DA DECISÃO · CRITÉRIOS DE PLANEJAMENTO</h3>'
   +'<p><strong>Oportunidade estimada acumulada:</strong> R$ '+brl(impact.metrics.virtualOpportunityCost)
   +' · <strong>Compras registradas:</strong> R$ '+brl(impact.metrics.purchaseTotal)
   +' · <strong>Pedidos em trânsito:</strong> '+impact.metrics.openPurchases+'</p>'
   +'<small>'+esc(impact.warning)+'</small></section>';
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
   const cost=impact.active.find(x=>x.id===j.id);
   if(cost){
    html+='<p class="planningExposure"><strong>Impacto acumulado:</strong> '
      +cost.downtimeHours+'h de OS aberta · '+cost.materialWaitShifts+' turno(s) sem peça · '
      +cost.toolWaitShifts+' sem ferramenta · '+cost.reworkHours+'h de retrabalho'
      +' · estimativa virtual R$ '+brl(cost.costOpportunity)+'</p>';
    const procurement=cost.procurement;
    if(procurement&&!procurement.couldReserveNow&&procurement.comparison){
     const q=procurement.comparison;
     html+='<div class="planningPurchaseComparison"><strong>DECISÃO DE COMPRA · '+esc(procurement.item)+'</strong>'
      +'<p>Saldo: '+procurement.onHand+' · demanda diagnosticada: '+procurement.demandDiagnosed
      +' · pedidos em trânsito: '+procurement.inbound.length+' · necessidade não coberta: '+procurement.shortfall+'</p>'
      +'<div class="planningPurchaseOptions">'
      +'<span>Normal: R$ '+brl(q.normal.cost)+' · '+q.normal.turnsMin+'–'+q.normal.turnsMax+' turnos</span>'
      +'<span>Urgente: R$ '+brl(q.urgent.cost)+' · '+q.urgent.turnsMin+'–'+q.urgent.turnsMax+' turnos</span></div>'
      +'<small>Urgência custa +R$ '+brl(q.premium)+' por unidade. '+esc(q.deliveryRule)+' '+esc(procurement.warning)+'</small></div>';
    }
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
function drawInspection(){if($('inspectionPanel'))$('inspectionPanel').innerHTML=S.inspections(state,data,I,E)}
function drawMonitoring(){
 const host=$('monitoringPanel');if(!host)return;
 const nav=window.PORCARIA_MONITOR_NAV;
 const snapshot=nav?.capture(host,document.activeElement);
 host.innerHTML=S.monitoring(state,data,M,IV,I,E,monitorCategory);
 nav?.restore(host,snapshot);
}
function renderQueue(){
 const calls=state.jobs||[];
 const radioSummary=$('radioQueueSummary');
 if(radioSummary){
  const counts=[
   {label:'CHAMADOS ATIVOS',n:calls.length},
   {label:'CRÍTICOS',n:calls.filter(j=>j.priority===3).length,critical:true},
   {label:'AGUARDANDO',n:calls.filter(j=>!j.assigned).length},
   {label:'ALOCADOS',n:calls.filter(j=>!!j.assigned).length}
  ];
  radioSummary.innerHTML=counts.map(c=>
   '<span class="radioDispatchCount'+(c.critical?' is-critical':'')+'">'+c.label
   +'<b>'+c.n+'</b></span>').join('');
 }
 // Um único conjunto filtrado alimenta a prévia ao lado do Elton e a fila completa.
 // Nenhuma OS adicional é criada; data-pick mantém a navegação existente.
 const visibleJobs=[...state.jobs].filter(j=>{
 const m=E.model(data,j.modelId),q=FILTER.query.toLowerCase();
 const matched=!q||[j.id,j.report,m?.title,j.asset].some(x=>String(x||'').toLowerCase().includes(q));
 return matched&&(FILTER.queue==='all'||FILTER.queue==='critical'&&j.priority===3||FILTER.queue==='waiting'&&!j.assigned||FILTER.queue==='assigned'&&!!j.assigned);
 }).sort((a,b)=>b.priority-a.priority||a.tickOpen-b.tickOpen);
 const spotlight=$('radioQueueSpotlight');
 if(spotlight)spotlight.innerHTML=visibleJobs.slice(0,3).map(j=>{
  const m=E.model(data,j.modelId);
  const severity=j.priority===3?'CRÍTICA':j.priority===2?'ALTA':'MODERADA';
  const fault=I.activeFault(data.scenarios.find(sc=>sc.id===j.scene));
  return '<button type="button" class="radioQueueCard'+(j.priority===3?' is-critical':'')
   +(j.id===selected?' is-active':'')+'" data-pick="'+esc(j.id)+'"'
   +' aria-label="Abrir '+esc(j.id)+' · '+esc(m?.title)+' · '+severity+'">'
   +'<em>'+severity+' · '+esc(j.id)+'</em>'
   +'<b>'+esc(m?.title)+'</b><small>'+esc(j.report)+'</small>'
   +(fault?'<small>⌁ ALERTA ATIVO · CÓDIGO OEM '+esc(fault.codeVerified&&fault.codeValue?fault.codeValue:'NÃO INFORMADO')+'</small>':'')+'</button>';
 }).join('')||'<div class="radioQueueEmpty">Nenhuma OS neste filtro.</div>';
 $('queue').innerHTML=visibleJobs.map(j=>{
 const m=E.model(data,j.modelId);
 const aged=(state.tick-j.tickOpen)*E.SHIFT_HOURS;
 const flags=jobBlockers(j);
 const fault=I.activeFault(data.scenarios.find(sc=>sc.id===j.scene));
 return `<button class="job ${j.id===selected?'active':''}" data-pick="${j.id}"><span class="severity">${j.priority===3?'CRÍTICA':j.priority===2?'ALTA':'MODERADA'}</span><strong>${esc(m?.title)} · ${esc(j.id)}</strong><small>${esc(j.report)}</small><small>${esc(j.status)} · ${j.stage}/6 etapas · ${Math.ceil(j.repairRemaining)}h reparo · ${aged}h na carteira</small>${fault?'<small>⌁ CÓDIGO DE FALHA ATIVO · OEM '+esc(fault.codeVerified&&fault.codeValue?fault.codeValue:'NÃO INFORMADO')+'</small>':''}${flags.length?'<small class="queueWarning">⚠ '+esc(flags.join(' · '))+'</small>':''}</button>`;
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
   +'<div class="managementActions"><button class="act secondary" data-open-panel="inspection">🔎 INSPEÇÕES</button><button class="act secondary" data-open-panel="training">📚 TREINAMENTOS</button><button class="act" data-open-panel="planning">🗓️ PLANEJAR OS</button><button class="act secondary" data-open-panel="shift">📋 REVISAR PRÓXIMO TURNO</button><button class="act secondary" data-open-panel="queue">📻 ABRIR CARTEIRA</button><button class="act secondary" data-open-panel="team">👷 EQUIPE</button><button class="act secondary" data-open-panel="store">📦 ESTOQUE</button><button class="act secondary" data-open-panel="stats">📊 INDICADORES</button><button class="act secondary" data-reliability-open>📈 KPIs PCM</button></div>'
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
    :'<p class="readinessClear">Nenhuma condição de atenção detectada com os limites de acompanhamento atuais.</p>')
   +'<small class="readinessMethod">'+esc(ready.methodology)+'</small></section>'
   +'<section class="productivityControl"><h3>🎯 META DE PRODUTIVIDADE · '+pressure.target+'/100</h3>'
   +'<p>Estável em 60. Acima de 60, a energia mental e física é consumida exponencialmente por hora trabalhada; abaixo de 60, aumenta a perda de moral.</p>'
   +'<div class="metaRange"><span>20 · Moral ↓</span><input type="range" id="productivityTarget" min="20" max="100" step="5" value="'+pressure.target+'" aria-label="Meta de produtividade"><span>100 · Energia ↓</span></div>'
   +'<div id="productivityImpact" class="productivityImpact">Ritmo '+Math.round(pressure.speed*100)+'% · Fadiga '+pressure.fatigueMultiplier.toFixed(2)+'× · Moral −'+pressure.moraleLossPerHour.toFixed(2)+' pts/HH</div>'
   +'<small>Turnos de 12h: DDS 0,5h + almoço 1h = 10,5 HH úteis por mecânico. Meta de referência interna para planejamento de capacidade.</small></section>'
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
 if(document.querySelector('[data-panel="monitoring"].is-open'))drawMonitoring();
 if(document.querySelector('[data-panel="planning"].is-open'))drawPlanning();
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
 if(!E.sapEligible(data,c))out+='<div class="inspectionAttention" role="status"><strong>⛔ CLASSIFICAÇÃO SAP PENDENTE</strong><p>Esta OS legada possui local de instalação ausente na 1412 ou equivalência de Parte objeto ainda provisória. As seis etapas permanecem bloqueadas até revisão. O histórico da campanha foi preservado; libere o box e continue com outros serviços.</p></div>';
 // A referência integral só é revelada quando os seis níveis foram concluídos.
 if(E.sapEligible(data,c)&&j.stage>=6){
  const source=c.sapPathMapping?.functionalLocations?.[0]||c.sapPathMapping?.functionalLocation||'';
  const type=c.sapPathMapping?.objectTypeCode||'';
  out+='<div class="inspectionAttention"><strong>✓ RASTREABILIDADE SAP — DIAGNÓSTICO CONCLUÍDO</strong>'
    +'<p>Local de instalação: <code>'+esc(source)+'</code> · Tipo objeto: <code>'+esc(type)+'</code></p>'
    +'<p>Parte objeto: <code>'+esc(c.sapPartCode)+'</code> · '+esc(c.component)+'</p></div>';
 }
 out+=window.PORCARIA_DIAGNOSTIC_VIEW.render(diagnosis,j.id);
 out+='<div id="notice" style="display:none"></div>';
 if(!j.assigned){
  const busy=new Set(state.jobs.map(x=>x.assigned).filter(Boolean));
  const free=state.team.filter(x=>!busy.has(x.id)&&x.restAt!==state.tick&&!E.TRAINING.active(state,x)&&!E.physicalBlock(state,x));
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
  const energyHold=E.physicalBlock(state,m);
  const forcedRecovery=(m.exhaustedUntilTick||0)>state.tick;
  const training=E.TRAINING.active(state,m);
  const portraitUrl=m.sprite&&(TEAM_PORTRAITS[m.sprite]||WORKER_SHEETS[m.sprite]);
  const portrait=portraitUrl?'<span class="teamPortrait" style="background-image:url('+esc(portraitUrl)+')" aria-hidden="true"></span>':'<span class="teamPortrait placeholder" aria-label="Sem sprite">MEC.</span>';
  return `<article class="resourceCard"><div class="teamIdentity">${portrait}<div><h3>${esc(m.avatar||'')} ${esc(m.name)} · ${esc(m.specialty||'Mecânico')} <small>${esc(m.id)}</small></h3><p class="muted">Disciplina: ${esc(m.role)}</p></div></div><p class="muted">${current?'Em serviço: '+esc(current.id)+' · Box '+(current.bay+1):forcedRecovery?'RECUPERAÇÃO COMPULSÓRIA · até o turno '+m.exhaustedUntilTick:resting?'Descanso programado neste turno':energyHold?esc(energyHold):training?(m.normativeUntil>state.tick?'Treinamento normativo · '+(m.normativeUntil-state.tick)+' turno(s)':'Em capacitação neste turno'):'Disponível'} · Índice geral histórico ${Math.round(m.skill)}</p>${energyMeter('Mental',m.mental)}${energyMeter('Física',m.physical)}<p class="muted">${m.physicalShift?.tick===state.tick?'Esforço: '+Number(m.physicalShift.workedHH).toFixed(1)+'/10,5 HH · taxa do turno '+m.physicalShift.baseLoss+' pts/10,5 HH':'Esforço do turno ainda não executado'} · ${m.fullWorkStreak||0} turno(s) integral(is) seguido(s)</p>${energyMeter('Moral',m.morale)}<details class="abilitiesCard"><summary>📊 VER HABILIDADES</summary>${renderSkills(E.skillsFor(m))}</details><div class="actions"><button class="act secondary" data-team-action="motivate" data-person="${esc(m.id)}">MOTIVAR</button><button class="act secondary" data-team-action="rest" data-person="${esc(m.id)}" ${current||resting||training||forcedRecovery?'disabled':''}>DESCANSAR</button></div></article>`;
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
 MOBILE?.registerClosePanel?.(closePanel);
 $('helpBtn').addEventListener('click',()=>openPanel('help'));
 document.addEventListener('input',ev=>{
  if(ev.target?.id!=='productivityTarget')return;
  const p=E.productivityProfile(Number(ev.target.value));
  const impact=$('productivityImpact');
  if(impact)impact.textContent='Ritmo '+Math.round(p.speed*100)+'% · Fadiga '+p.fatigueMultiplier.toFixed(2)+'× · Moral −'+p.moraleLossPerHour.toFixed(2)+' pts/HH';
 });
 document.addEventListener('change',ev=>{
  if(ev.target?.id==='pcmScenarioOrder'){pcmScenarioOrder=ev.target.value;drawPCMAlternatives();return}
  if(ev.target?.id==='pcmScenarioMechanic'){pcmScenarioMechanic=ev.target.value;drawPCMAlternatives();return}
  if(ev.target?.id==='pcmScenarioBay'){pcmScenarioBay=Number(ev.target.value);drawPCMAlternatives();return}
  if(ev.target?.id==='productionModelFilter'){
   productionModel=ev.target.value;drawProduction();return;
  }
  const productionTarget=ev.target?.closest?.('[data-production-target]');
  if(productionTarget){
   const err=window.PORCARIA_PRODUCTION.setTarget(state,data,
    productionTarget.dataset.productionTarget,Number(productionTarget.value),
    (type,fields)=>E.recordDecision(state,type,fields));
   if(err){notify(err);drawProduction();return}
   save();drawProduction();notify('Meta de cumprimento da jornada atualizada.');return;
  }
  if(ev.target?.id==='fleetModelFilter'){fleetModelFilter=ev.target.value;drawReliability();return}
  const dutyControl=ev.target?.closest?.('[data-fleet-duty]');
  if(dutyControl){
   const error=E.setFleetDuty(state,data,dutyControl.dataset.fleetDuty,Number(dutyControl.value));
   if(error){notify(error);drawReliability();return}
   save();drawReliability();
   notify('Jornada virtual de '+dutyControl.dataset.fleetDuty+' atualizada para '+dutyControl.value+' h/turno.');
   return;
  }
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
  const goReliability=ev.target.closest('[data-reliability-open]');
  if(goReliability){planningHorizon='kpis';openPanel('planning');return}
  const submenu=ev.target.closest('[data-open-panel]');
  if(submenu){
   if(submenu.dataset.openPanel==='store'){stockReturnJobId=null;FILTER.stockQuery='';$('storeSearch').value='';drawStore()}
   if(submenu.dataset.openPanel==='detail'){orderReturnPanel='workshop';quickFeedback=null}
   if(submenu.dataset.openPanel==='queue')preferredBay=null;
   openPanel(submenu.dataset.openPanel);return;
  }
  const evidencePractice=ev.target.closest('[data-evidence-practice]');
  if(evidencePractice){
   const result=T.practice(state,data,I,evidencePractice.dataset.evidencePractice);
   if(result.error){notify(result.error);return}
   save();drawUI();
   notify('Treinamento registrado: '+result.notification.id+'. Escolha um teste para investigar antes de planejar.');
   return;
  }
  const evidenceTest=ev.target.closest('[data-evidence-test]');
  if(evidenceTest){
   const result=T.run(state,data,I,evidenceTest.dataset.notificationId,evidenceTest.dataset.evidenceTest);
   if(result.error){notify(result.error);return}
   save();drawUI();
   notify('Resultado registrado na notificação: '+result.notification.id+'.');
   return;
  }
  const monitorCategoryButton=ev.target.closest('[data-monitor-category]');
  if(monitorCategoryButton){
   monitorCategory=monitorCategoryButton.dataset.monitorCategory;
   drawMonitoring();
   return;
  }
  const monitorAction=ev.target.closest('[data-monitor-action]');
  if(monitorAction){
   const id=monitorAction.dataset.monitorNote,kind=monitorAction.dataset.monitorAction;
   const interval=Number($('monitor-interval-'+id)?.value||2);
   const reason=$('monitor-reason-'+id)?.value;
   const result=kind==='decide'?M.decide(state,id,reason,interval):
    kind==='collect'?M.collect(state,id):
    kind==='continue'?M.continueWatch(state,id,interval):
    kind==='close'?M.close(state,id):
    kind==='escalate'?M.escalate(state,data,I,id):
    {error:'Ação de monitoramento não reconhecida.'};
   if(result.error){notify(result.error);return}
   save();drawUI();
   const notices={decide:'Monitoramento registrado, recoleta programada.',collect:'Nova verificação de condição registrada; avalie a tendência.',continue:'Próxima verificação programada.',close:'Controle encerrado sem OS.',escalate:'Nova notificação '+(result.escalation?.id||'')+' encaminhada para revisão PCM; nenhuma OS criada.'};
   notify(notices[kind]);
   return;
  }
  const inspectionAction=ev.target.closest('[data-inspection-action]');
  if(inspectionAction){
   const id=inspectionAction.dataset.inspectionId,kind=inspectionAction.dataset.inspectionAction;
   const result=kind==='schedule'?I.schedule(state,data,$('fieldAsset')?.value,$('fieldInspector')?.value):
    kind==='inspect'?I.inspectAndRoute(state,data,id):
    kind==='notify'?I.notify(state,id,null,$('inspection-priority-'+id)?.value):{error:'Ação inválida.'};
   if(result.error){notify(result.error);return}
   save();drawUI();
   if(kind==='schedule')notify('Inspeção '+result.inspection.id+' programada para '+result.inspection.asset+'.');
   else if(result.notification){
    notify('Nota '+result.notification.id+' encaminhada ao Planejamento PCM.');
    openPanel('planning');
   }else notify('Inspeção concluída: equipamento sem anormalidade registrada.');
   return;
  }
  const pcmBuy=ev.target.closest('[data-pcm-buy]');
  if(pcmBuy){
    const id=pcmBuy.dataset.notificationId,mode=pcmBuy.dataset.pcmBuy;
    const n=state.notifications.find(x=>x.id===id);
    if(!n||!['aguarda_revisao_pcm','aprovada_pcm'].includes(n.status)){notify('Notificação indisponível para aprovisionamento.');return}
    if(mode==='material'){
      const item=$('pcm-item-'+id)?.value,qty=Number($('pcm-qty-'+id)?.value||1),speed=$('pcm-speed-'+id)?.value==='rush';
      if(!item||!data.items[item]){notify('Escolha um material válido.');return}
      const error=E.orderMaterial(state,data,item,qty,speed);
      if(error){notify(error);return}
    }else if(mode==='tool'){
      const tool=$('pcm-tool-'+id)?.value;
      if(!tool||!data.tools[tool]){notify('Escolha uma ferramenta válida.');return}
      const error=E.buyTool(state,data,tool);
      if(error){notify(error);return}
    }else return;
    save();drawUI();notify('Solicitação registrada. A compra não confirma a hipótese técnica.');return;
  }
  const notificationAction=ev.target.closest('[data-notification-action]');
  if(notificationAction){
   const id=notificationAction.dataset.notificationId,decision=notificationAction.dataset.notificationAction;
   const payload={
      reason:$('pcm-reason-'+id)?.value,
      diagnosis:Array.from({length:6},(_,i)=>$('pcm-diagnosis-'+i+'-'+id)?.value||''),
      action:$('pcm-action-'+id)?.value,trade:$('pcm-trade-'+id)?.value,
      estimatedHH:$('pcm-hh-'+id)?.value,priority:$('pcm-priority-'+id)?.value
   };
   const result=decision==='convert'?I.commitConversion(state,data,E,id):I.review(state,id,decision,payload,data,E);
   if(result.error){notify(result.error);return}
   save();drawUI();
   if(decision==='convert')notify('OS '+result.order.id+' criada a partir da notificação '+id+'. Abra o Planejamento PCM para programar a equipe.');
   else notify('Notificação '+id+': '+({return:'devolvida para complementação',resubmit:'reenviada para revisão',archive:'arquivada',approve:'escopo aprovado'}[decision]||'atualizada')+'.');
   return;
  }
  const planHorizon=ev.target.closest('[data-planning-horizon]');
  if(planHorizon){
   planningHorizon=['turn','week','schedule','alternatives','preventive','kpis','production','history','lessons'].includes(planHorizon.dataset.planningHorizon)?planHorizon.dataset.planningHorizon:'turn';
   drawPlanning();return;
  }
  const confirmed=ev.target.closest('[data-pcm-confirm-option]');
  if(confirmed){
   const report=window.PORCARIA_PCM_OPTIONS.calculate(state,data,E,
    {orderId:pcmScenarioOrder,mechanicId:pcmScenarioMechanic,bay:pcmScenarioBay});
   const opt=report.options.find(x=>x.id===confirmed.dataset.pcmConfirmOption&&x.available&&x.action);
   if(!report.available||report.orderId!==confirmed.dataset.pcmConfirmOrder||!opt){
    drawPCMAlternatives();notify('As condições de programação mudaram. Revise as alternativas.');return;
   }
   const error=opt.action==='assign_pm'
    ?E.assignPreventiveOrder(state,data,report.orderId,pcmScenarioMechanic,pcmScenarioBay)
    :opt.action==='schedule_pm'
     ?E.schedulePreventiveOrder(state,data,report.orderId,pcmScenarioMechanic,pcmScenarioBay,opt.tick)
     :E.scheduleJob(state,data,report.orderId,pcmScenarioMechanic,pcmScenarioBay,opt.tick);
   if(error){drawPCMAlternatives();notify(error);return}
   save();drawUI();scene?.refresh();drawPCMAlternatives();
   notify(opt.action==='assign_pm'
    ?'OS preventiva alocada com o supervisor Diva.'
    :'Reserva PCM registrada. A alocação e o serviço continuam manuais.');
   return;
  }
  const pmAssign=ev.target.closest('[data-pm-os-assign]');
  if(pmAssign){
   const id=pmAssign.dataset.pmOsAssign;
   const error=E.assignPreventiveOrder(state,data,id,
    $('pmWorker-'+id)?.value,Number($('pmBay-'+id)?.value));
   if(error){notify(error);return}
   save();drawUI();scene?.refresh();drawPreventive();
   notify(id+' alocada: Diva acompanha o mecânico no box.');return;
  }
  const pmRelease=ev.target.closest('[data-pm-os-release]');
  if(pmRelease){
   const error=E.releasePreventiveOrder(state,pmRelease.dataset.pmOsRelease);
   if(error){notify(error);return}
   save();drawUI();scene?.refresh();drawPreventive();notify('Equipe liberada.');return;
  }
  const preventiveBook=ev.target.closest('[data-preventive-book]');
  if(preventiveBook){
   const error=E.bookPreventive(state,data,$('preventiveAsset')?.value,$('preventiveWorker')?.value,
    Number($('preventiveBay')?.value),$('preventivePackage')?.value);
   if(error){notify(error);return}
   save();drawUI();drawPreventive();notify('Preventiva autorizada. HH e recurso serão utilizados no turno.');return;
  }
  const preventiveCancel=ev.target.closest('[data-preventive-cancel]');
  if(preventiveCancel){
   const error=E.cancelPreventive(state,preventiveCancel.dataset.preventiveCancel);
   if(error){notify(error);return}
   save();drawUI();drawPreventive();notify('Preventiva cancelada; valor restituído ao caixa.');return;
  }
  const productionFilter=ev.target.closest('[data-production-days]');
  if(productionFilter){
   const d=Number(productionFilter.dataset.productionDays);
   if([7,14,30].includes(d)){productionDays=d;drawProduction()}
   return;
  }
  const reliabilityFilter=ev.target.closest('[data-reliability-days]');
  if(reliabilityFilter){
   const selectedDays=Number(reliabilityFilter.dataset.reliabilityDays);
   if([7,14,30].includes(selectedDays)){reliabilityDays=selectedDays;drawReliability()}
   return;
  }
  const scheduleBook=ev.target.closest('[data-schedule-book]');
  if(scheduleBook){
   const chosen=$('scheduleOrder')?.value;
   const preventive=(state.preventiveOrders||[]).some(p=>p.id===chosen&&p.status==='open');
   const error=preventive
    ?E.schedulePreventiveOrder(state,data,chosen,$('scheduleWorker')?.value,
      Number($('scheduleBay')?.value),Number($('scheduleTick')?.value))
    :E.scheduleJob(state,data,chosen,$('scheduleWorker')?.value,
      Number($('scheduleBay')?.value),Number($('scheduleTick')?.value));
   if(error){notify(error);return}
   save();drawSchedule();notify('Reserva confirmada. A OS não foi alocada automaticamente.');return;
  }
  const scheduleCancel=ev.target.closest('[data-schedule-cancel]');
  if(scheduleCancel){
   const error=E.cancelSchedule(state,scheduleCancel.dataset.scheduleCancel);
   if(error){notify(error);return}
   save();drawSchedule();notify('Programação cancelada.');return;
  }
  const scheduleStart=ev.target.closest('[data-schedule-start]');
  if(scheduleStart){
   const booking=(state.scheduleEntries||[]).find(r=>r.status==='planned'&&r.id===scheduleStart.dataset.scheduleStart);
   if(!booking||booking.tick!==state.tick){drawSchedule();notify('Reserva desatualizada. Revise o turno.');return}
   const error=booking.kind==='preventive'
    ?E.assignPreventiveOrder(state,data,booking.orderId,booking.mechanicId,booking.bay)
    :E.attach(state,booking.orderId,booking.mechanicId,booking.bay,true);
   if(error){drawSchedule();notify(error);return}
   save();drawUI();if(scene)scene.refresh();drawSchedule();
   notify('OS '+booking.orderId+' alocada manualmente no BOX '+(booking.bay+1)
     +(booking.kind==='preventive'?' com Diva.':'.'));return;
  }
  const decisionFilter=ev.target.closest('[data-decision-filter]');
  if(decisionFilter){
   const next=decisionFilter.dataset.decisionFilter;
   if(['all','supply','pcm','execution'].includes(next)){decisionHistoryFilter=next;drawDecisionHistory()}
   return;
  }
  const lessonFilterBtn=ev.target.closest('[data-lesson-filter]');
  if(lessonFilterBtn){
   if(['all','pending','reviewed'].includes(lessonFilterBtn.dataset.lessonFilter)){lessonFilter=lessonFilterBtn.dataset.lessonFilter;lessonSelectedOrderId=null;drawLessons()}
   return;
  }
  const lessonOpen=ev.target.closest('[data-lesson-open]');
  if(lessonOpen){lessonSelectedOrderId=lessonOpen.dataset.lessonOpen;drawLessons();return;}
  const lessonClose=ev.target.closest('[data-lesson-close]');
  if(lessonClose){lessonSelectedOrderId=null;drawLessons();return;}
  const lessonSave=ev.target.closest('[data-lesson-save]');
  if(lessonSave){
   const error=E.writeLesson(state,data,lessonSave.dataset.lessonSave,$('lessonTag')?.value,$('lessonText')?.value);
   if(error){notify(error);return;}
   drawLessons();notify('Lição registrada no diário desta campanha.');
   return;
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
    const inbound=M.receive(state,data,I);
    selected=E.job(state,selected)?.id||state.jobs[0]?.id;
    closePanel();action(null);if(scene)scene.applyOfficialBackdrop();$('advance').focus();
    notify((state.done.length-beforeDone)+' OS concluída(s), '+result.blocks+' bloqueio(s) no turno.'+(inbound.received?.length?' '+inbound.received.length+' nova condição recebida na sala de controle.':''));
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
   if(!E.validate(candidate))throw Error('Arquivo de campanha incompatível com esta versão.');
   if(!confirm('Importar save e substituir o progresso desta oficina? Exporte o save atual antes de continuar.'))return;
   state=E.localizeDiagnosticOptions(E.normalizeRoster(candidate),data);E.ANOMALY.normalize(state,data);I.normalized(state);state.productivityTarget=E.productivityProfile(state.productivityTarget).target;selected=state.jobs[0]?.id||null;
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
   frameWidth:name==='diva'?WORKER_RENDER_FRAME.width:WORKER_FRAME.width,
   frameHeight:name==='diva'?WORKER_RENDER_FRAME.height:WORKER_FRAME.height
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
   hit.on(mobileTapEvent,(pointer)=>{if(modalOpen()||!isValidMobileTap(pointer))return;const j=state.jobs.find(z=>z.bay===id);if(j)pick(j.id,'workshop');else openQueueForBay(id)});
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
  if(!src||(texture==='worker_nemuel'?src.width!==1211||src.height!==1299:src.width!==WORKER_FRAME.width*2||src.height!==WORKER_FRAME.height*2))return texture;
  // Reduzir cada frame separadamente evita vazamento de pixels entre poses.
  // Canvas pré-filtra em alta qualidade antes da última redução feita pelo GPU.
  const canvas=document.createElement('canvas');
  canvas.width=WORKER_RENDER_FRAME.width*2;
  canvas.height=WORKER_RENDER_FRAME.height*2;
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return texture;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  if(texture==='worker_nemuel'){
   // Atlas novo aprovado pelo produtor (1211 × 1299): cada pose possui
   // retângulo próprio, sem reutilizar recortes do atlas anterior.
   const frames=[
    {x:130,y:0,w:440,h:649},    // Esquadro
    {x:660,y:0,w:450,h:649},    // Joinha
    {x:125,y:649,w:440,h:650},  // Rádio
    {x:630,y:710,w:540,h:589}  // Medição agachado
   ];
   for(let i=0;i<frames.length;i++){
    const p=frames[i];
    const scale=Math.min(WORKER_RENDER_FRAME.width/p.w,WORKER_RENDER_FRAME.height/p.h);
    const w=Math.floor(p.w*scale),h=Math.floor(p.h*scale);
    const dx=(i%2)*WORKER_RENDER_FRAME.width+Math.floor((WORKER_RENDER_FRAME.width-w)/2);
    const dy=Math.floor(i/2)*WORKER_RENDER_FRAME.height+WORKER_RENDER_FRAME.height-h;
    ctx.drawImage(src,p.x,p.y,p.w,p.h,dx,dy,w,h);
   }
  }else{
  for(let i=0;i<4;i++){
   ctx.drawImage(src,(i%2)*WORKER_FRAME.width,Math.floor(i/2)*WORKER_FRAME.height,
    WORKER_FRAME.width,WORKER_FRAME.height,
    (i%2)*WORKER_RENDER_FRAME.width,Math.floor(i/2)*WORKER_RENDER_FRAME.height,
    WORKER_RENDER_FRAME.width,WORKER_RENDER_FRAME.height);
  }
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
   const frame=renderKey===texture?(person==='diva'?WORKER_RENDER_FRAME:WORKER_FRAME):WORKER_RENDER_FRAME;
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
     const j=state.jobs.find(z=>z.bay===i)||state.preventiveOrders?.find(z=>z.status==='in_progress'&&z.bay===i),cx=spriteWorld.x;
   const isPM=j?.kind==='preventive';
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
        machineNode.on(mobileTapEvent,(pointer)=>{if(modalOpen()||!isValidMobileTap(pointer))return;
          if(isPM){planningHorizon='preventive';openPanel('planning')}else pick(j.id)});
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
         actor.on(mobileTapEvent,(pointer)=>{if(modalOpen()||!isValidMobileTap(pointer))return;
          if(isPM){planningHorizon='preventive';openPanel('planning')}else pick(j.id)});
        }
       }
       if(isPM&&assigned){
        // Presença de supervisão visual sem segunda apropriação de HH.
        const support=workerWorld[1]||{x:workerWorld[0].x+90,y:workerWorld[0].y};
        const supervisor=this.worker(support.x,support.y,{sprite:'diva'},{
         facing:support.facing||'left',mode:'diagnose',
         visualCalibrationX:activeBays[i].visualCalibrationX||0,bay:activeBays[i]});
        if(supervisor?.setDepth)supervisor.setDepth(25);
       }
       // O HUD inferior já mostra equipamento e OS: evitar um segundo rótulo sobre as rodas.
       // Progresso visual da OS; diagnóstico e reparo são fases distintas.
       if(progressWorld){
        const p=progressWorld;
        const diagnosing=j.stage<6;
        const blocked=j.status==='material'||j.status==='ferramenta';
        const pct=diagnosing?j.stage/6:Math.max(0,Math.min(1,1-j.repairRemaining/Math.max(0.1,j.repairTarget||1)));
        const color=blocked?0xeb7666:diagnosing?0x68c5e7:0xf6b544;
        const title=isPM?'PREVENTIVA · DIVA':blocked?(j.status==='material'?'AGUARDANDO PEÇA':'FALTA FERRAMENTA'):diagnosing?'DIAGNÓSTICO':'REPARO';
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
   this.statusText.setText('TURNO '+(state.shift?'B':'A')+'  |  '+(state.jobs.filter(j=>j.assigned).length+
    (state.preventiveOrders||[]).filter(j=>j.status==='in_progress').length)+' BOXES EM USO  |  '+state.done.length+' OS CONCLUÍDAS');
 }
}
async function boot(){
 try{
  // O motor carrega antes da cena: ativa o módulo de agenda antes da primeira leitura.
  await import('./immersive-copy.js?v=0.9.18-copy1');
  await import('./weekly-schedule.js?v=0.9.14');
  await import('./preventive.js?v=0.9.15');
  await import('./preventive-orders.js?v=0.9.19');
  await import('./reliability-kpis.js?v=0.9.16');
  await import('./production-performance.js?v=0.9.20');
  await import('./pcm-options.js?v=0.9.21');
  await import('./fleet-telemetry.js?v=0.9.18');
  await import('./fleet-view.js?v=0.9.18');
  if(!document.getElementById('weeklyScheduleStyle')){
   const css=document.createElement('style');css.id='weeklyScheduleStyle';
   css.textContent='.scheduleSlots{display:grid;grid-template-columns:repeat(7,minmax(100px,1fr));gap:7px;margin:12px 0}'
    +'.scheduleSlot{display:grid;gap:6px;border:1px solid #4c7186;border-radius:8px;padding:10px;background:#102c3f}'
    +'.scheduleSlot strong{color:#eacb8e}.scheduleSlot b{color:#c3e5ca}.scheduleSlot small{color:#b9d1dd}'
    +'.scheduleForm{padding:15px;border:1px solid #4b7088;border-radius:9px;background:#102a3c;margin:15px 0}'
    +'.scheduleForm h3{color:#e8cf9a;margin:0}.scheduleFields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}'
    +'.scheduleFields label{display:grid;gap:5px;color:#dfedf4;font-size:12px}'
    +'.scheduleFields select{width:100%;min-width:0;padding:9px;background:#132e42;border:1px solid #65849a;color:#f3f7fa;border-radius:6px}'
    +'.scheduleHistory{display:grid;gap:9px}'
    +'@media(max-width:820px){.scheduleSlots{grid-template-columns:repeat(4,minmax(0,1fr))}}'
    +'@media(max-width:560px){.scheduleSlots{grid-template-columns:repeat(2,minmax(0,1fr))}.scheduleFields{grid-template-columns:1fr}}';
   css.textContent+='.reliabilityFilters{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 13px}'
    +'.reliabilityGraph{display:flex;align-items:flex-end;gap:4px;overflow-x:auto;min-height:154px;background:#102839;border:1px solid #3d6479;border-radius:9px;padding:12px 8px}'
    +'.reliabilityColumn{flex:1;min-width:18px;display:flex;align-items:center;flex-direction:column;gap:4px}'
    +'.reliabilityBars{display:flex;align-items:flex-end;justify-content:center;gap:2px;width:100%;height:115px;border-bottom:1px solid #4c697c}'
    +'.reliabilityBar{display:block;width:38%;max-width:19px;border-radius:3px 3px 0 0;min-height:0}'
    +'.reliabilityBar.pm{background:#75d7b2}.reliabilityBar.cm{background:#eeb36e}'
    +'.reliabilityColumn small{font-size:9px;color:#a9c8db}';
   css.textContent+='.fleetDutyControl{display:grid;gap:5px;padding:8px 0;font-size:11px;color:#d0e6f1}'
    +'.fleetDutyControl select{width:100%;background:#143147;color:#f2f7ff;border:1px solid #5c869e;border-radius:5px;padding:8px}'
    +'.fleetAvailability .standby{background:#7cabd9}';
   css.textContent+='.fleetAvailability{display:flex;width:100%;height:20px;overflow:hidden;border-radius:6px;border:1px solid #4a697c;margin:8px 0}'
    +'.fleetAvailability span{height:100%;display:block}.fleetAvailability .operational{background:#77d3a1}.fleetAvailability .preventive{background:#dcb768}.fleetAvailability .corrective{background:#e98f8f}'
    +'.fleetModelSelect{display:grid;grid-template-columns:auto minmax(130px,300px);gap:10px;align-items:center;margin:12px 0}'
    +'.fleetModelSelect select{background:#142c40;color:#f5f8f8;border:1px solid #668398;border-radius:6px;padding:9px}'
    +'.fleetAssetList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.fleetAssetMetrics{display:grid;gap:5px;font-size:11px;color:#cde0e9}'
    +'@media(max-width:650px){.fleetAssetList{grid-template-columns:1fr}.fleetModelSelect{grid-template-columns:1fr}}';
   css.textContent+='.productionModelList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}'
    +'.productionTrack{height:10px;border:1px solid #4b6a7e;border-radius:6px;background:#0c2131;overflow:hidden}'
    +'.productionTrack span{display:block;height:100%;background:#87cdaa}'
    +'.productionModelFooter{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;margin-top:8px}'
    +'.productionModelFooter label{display:flex;align-items:center;gap:8px;font-size:11px}'
    +'.productionModelFooter select{padding:5px;background:#132d40;color:#f5f8fa;border:1px solid #668398;border-radius:5px}'
    +'@media(max-width:650px){.productionModelList{grid-template-columns:1fr}}';
   css.textContent+='.pcmScenarioCards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0}'
    +'.pcmScenarioCard{display:flex;flex-direction:column;gap:8px;min-width:0}.pcmScenarioCard button{margin-top:auto}'
    +'@media(max-width:850px){.pcmScenarioCards{grid-template-columns:1fr}}';
   document.head.appendChild(css);
  }
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
  E.ANOMALY.normalize(state,data); // não retroage consequências em saves anteriores.
  E.initFleet(state,data); // Históricos legados iniciam agora sem horas retroativas.
  E.generatePreventiveOrders(state,data); // Abertura automática por horímetro.
  E.localizeDiagnosticOptions(state,data); // traduz opções legadas sem alterar códigos.
   I.normalized(state); // saves antigos recebem uma carteira vazia.
  state.productivityTarget=E.productivityProfile(state.productivityTarget).target;
  M.receive(state,data,I,{initial:true});
  save();
  selected=state.jobs[0]?.id;events();drawUI();
  if(!I||!IV||!S||!T||!M||!window.PORCARIA_PREVENTIVE||!window.PORCARIA_PREVENTIVE_ORDERS||!window.PORCARIA_RELIABILITY||!window.PORCARIA_PRODUCTION||!window.PORCARIA_PCM_OPTIONS||!window.PORCARIA_FLEET_TELEMETRY||!window.PORCARIA_FLEET_VIEW||!window.Phaser||!window.PORCARIA_LAYOUT||!window.PORCARIA_PLANNING||!window.PORCARIA_WEEKLY||!window.PORCARIA_WEEKLY_SCHEDULE||!window.PORCARIA_SHIFT_BRIEF||!window.PORCARIA_READINESS||!window.PORCARIA_DIAGNOSTIC||!window.PORCARIA_DIAGNOSTIC_VIEW||!window.PORCARIA_ORDER_QUICK||!window.PORCARIA_CLOSED_ORDERS)throw Error('Módulos do Phaser/PCM não carregaram. Verifique conexão.');
  if(!window.PORCARIA_RENDER_QUALITY)throw Error('Configuração de nitidez indisponível.');
  renderProfile=window.PORCARIA_RENDER_QUALITY.profile({
   viewportWidth:window.innerWidth,devicePixelRatio:window.devicePixelRatio,
   override:new URLSearchParams(window.location.search).get('quality'),sceneRef:SCENE_REFERENCE
  });
  new Phaser.Game({type:Phaser.AUTO,parent:'game',width:renderProfile.width,height:renderProfile.height,
   input:{touch:{capture:!MOBILE?.isMobile(window)}}, // permitir pan-y e swipe do navegador no mobile
   backgroundColor:'#182838',render:{pixelArt:false,antialias:true,antialiasGL:true,roundPixels:true},
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},scene:[Workshop]});
 }catch(e){console.error(e);$('game').innerHTML='<div style="padding:60px;color:#ffc86a">Não foi possível iniciar a cena Phaser: '+esc(e.message)+'</div>'}
}
boot();
})();
