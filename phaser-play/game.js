/* P.O.R.C.A.R.I.A. Phaser vertical slice v0.7.3 · motor de simulacao v1.1 */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const E=window.PORCARIA_ENGINE;
const STAGES=['Sistema','Grupo','Subgrupo','Componente','Dano','Causa'];
const SAVE='porcaria.phaser.prototype.v01';
const ASSETS={
 truck:'./assets/equipment/cat777e.png',
 shovel:'./assets/equipment/cat6030.png',
 excavator:'./assets/equipment/cat395.png',
 drill:'./assets/equipment/sandvik_dr410i.png',
 worker_lia_idle:'./assets/characters/mec_lia/idle.png',
 worker_lia_inspect:'./assets/characters/mec_lia/inspect.png',
 worker_lia_point:'./assets/characters/mec_lia/point.png',
 worker_lia_clipboard:'./assets/characters/mec_lia/clipboard.png',
 worker_rafael_idle:'./assets/characters/mec_rafael/idle.png',
 worker_rafael_inspect:'./assets/characters/mec_rafael/inspect.png',
 worker_rafael_point:'./assets/characters/mec_rafael/point.png',
 worker_rafael_clipboard:'./assets/characters/mec_rafael/clipboard.png'
};
const MACHINES={EQ01:'truck',EQ02:'shovel',EQ03:'excavator',EQ04:'excavator',EQ05:'drill',EQ06:'drill'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>Math.round(n).toLocaleString('pt-BR');
let data,state,selected,scene;
const FILTER={queue:'all',query:'',store:'all',stockQuery:''};
let toastTimeout;

const SCENE_REFERENCE={crop:{x:320,y:130,width:1350,height:563},sourceWidth:1976,sourceHeight:796,worldX:319,worldY:45,width:1080,height:450};
const CUSTOM_BACKGROUND_KEY='porcaria.phaser.customBackdrop.official20261016';
let BAY_LAYOUT=[0,1,2].map(i=>({id:i,hitWorld:{x:324+i*355,y:155,width:337,height:323},spriteWorld:{x:490+i*355,y:395},workerWorld:[{x:376+i*355,y:442},{x:605+i*355,y:439}]}));
function sceneDB(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(Error('IndexedDB indisponível'));return}
  const req=indexedDB.open('porcaria-workshop-background',1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('scene'))req.result.createObjectStore('scene')};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('Falha no IndexedDB'));
 });
}
async function sceneStore(op,blob){
 const db=await sceneDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('scene',op==='read'?'readonly':'readwrite');
  const req=op==='read'?tx.objectStore('scene').get('background'):op==='save'?tx.objectStore('scene').put(blob,'background'):tx.objectStore('scene').delete('background');
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
 scene.setBackdrop(img);
}

const PANEL_TITLES={queue:'📻 FILA DE ORDENS DE SERVIÇO',detail:'🔧 ORDEM DE SERVIÇO ATUAL',stats:'📊 INDICADORES E RECURSOS',team:'👷 EQUIPE DA OFICINA',store:'📦 ALMOXARIFADO E FERRAMENTAL',help:'❔ CONTROLES DA OFICINA',management:'📋 GESTÃO DA OFICINA'};
function closeSceneMenu(){
 const menu=$('sceneMenu'),trigger=$('sceneMenuBtn');
 if(menu)menu.hidden=true;
 if(trigger)trigger.setAttribute('aria-expanded','false');
}
// Modal tem exclusividade de entrada; nunca permitir selecao de box atraves do overlay.
function modalOpen(){return !!$('menuOverlay')&&!$('menuOverlay').hidden}
function openPanel(name){
 const overlay=$('menuOverlay');if(!overlay)return;
 if(scene?.input)scene.input.enabled=false;
 closeSceneMenu();
 overlay.hidden=false;
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
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){console.warn('Save',e)}}
function action(error){if(error)notify(error);else{save();drawUI();if(scene)scene.refresh()}}
function notify(t){const area=$('toast');if(!area)return;area.textContent=t;area.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{area.hidden=true},4400)}
function job(){return E.job(state,selected)||state.jobs[0]}
function pick(id){selected=id;drawUI();if(scene)scene.refresh();openPanel('detail')}
function showJob(id){const j=E.job(state,id);if(j)pick(j.id)}
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
function shiftPreview(){
 const jobs=state.jobs.filter(j=>j.assigned);
 const blocked=jobs.filter(j=>jobBlockers(j).some(r=>r==='Ferramenta indisponível'||r==='Material indisponível'));
 const diagnostic=jobs.filter(j=>j.stage<6&&!jobBlockers(j).includes('Ferramenta indisponível'));
 const repair=jobs.filter(j=>j.stage>=6&&!blocked.includes(j));
 const low=state.team.filter(m=>m.assigned&&(m.mental<25||m.physical<25));
 const orders=state.orders.filter(p=>p.eta<=state.tick+1);
 return {jobs,blocked,diagnostic,repair,low,orders};
}
function drawBays(){
 $('bayHUD').innerHTML=[0,1,2].map(i=>{const j=state.jobs.find(x=>x.bay===i),st=statusFor(j);
 return `<div class="bayBadge ${st.css}"><b>BOX ${i+1}</b><span>${j?esc(E.model(data,j.modelId)?.title)+' · '+esc(j.id):'Disponível'}</span><b>${st.label}</b></div>`}).join('');
}
function renderQueue(){
 $('queue').innerHTML=[...state.jobs].filter(j=>{
 const m=E.model(data,j.modelId),q=FILTER.query.toLowerCase();
 const matched=!q||[j.id,j.report,m?.title,j.asset].some(x=>String(x||'').toLowerCase().includes(q));
 return matched&&(FILTER.queue==='all'||FILTER.queue==='critical'&&j.priority===3||FILTER.queue==='waiting'&&!j.assigned||FILTER.queue==='assigned'&&!!j.assigned);
 }).sort((a,b)=>b.priority-a.priority||a.tickOpen-b.tickOpen).map(j=>{
 const m=E.model(data,j.modelId);
 const aged=(state.tick-j.tickOpen)*8;
 const flags=jobBlockers(j);
 return `<button class="job ${j.id===selected?'active':''}" data-pick="${j.id}"><span class="severity">${j.priority===3?'CRÍTICA':j.priority===2?'ALTA':'MODERADA'}</span><strong>${esc(m?.title)} · ${esc(j.id)}</strong><small>${esc(j.report)}</small><small>${esc(j.status)} · ${j.stage}/6 etapas · ${Math.ceil(j.repairRemaining)}h reparo · ${aged}h na carteira</small>${flags.length?'<small class="queueWarning">⚠ '+esc(flags.join(' · '))+'</small>':''}</button>`;
 }).join('')||'<p class="muted">Nenhuma OS corresponde ao filtro.</p>';
}
function drawManagement(k){
 const assigned=state.jobs.filter(j=>j.assigned);
 const blocked=assigned.filter(j=>j.status==='material'||j.status==='ferramenta').length;
 const available=state.team.filter(m=>!state.jobs.some(j=>j.assigned===m.id)).length;
 const metrics=[
  ['Caixa','R$ '+brl(state.cash)],
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
   +'<div class="managementActions"><button class="act" data-open-panel="queue">📻 ABRIR CARTEIRA</button><button class="act secondary" data-open-panel="team">👷 EQUIPE</button><button class="act secondary" data-open-panel="store">📦 ESTOQUE</button><button class="act secondary" data-open-panel="stats">📊 INDICADORES</button></div>'
   +'<h3 class="resourceSection">Últimos acontecimentos</h3>'
   +(state.logs.slice(0,6).map(l=>'<div class="managementRecent">D'+l.day+': '+esc(l.text)+'</div>').join('')||'<p class="muted">Nenhum evento registrado.</p>');
}
function drawUI(){
 if(!state||!data)return;
 const k=E.kpis(state);
 drawManagement(k);
 $('day').textContent='DIA '+state.day+' · TURNO '+(state.shift?'B':'A');
 $('cash').textContent='R$ '+brl(state.cash);$('team').textContent=state.team.length;
 $('backlog').textContent=k.backlog;$('energy').textContent=Math.round(state.player.mental)+'/100';
 drawBays();
 renderQueue();
 const j=job(), d=$('detail');
 if(!j){d.innerHTML='<p>Sem ordens de serviço abertas.</p>';drawTeam();drawStore();$('stats').innerHTML='<p class="muted">Nenhuma OS pendente.</p>';$('logs').innerHTML=state.logs.slice(0,5).map(l=>`<div class="log">D${l.day}: ${esc(l.text)}</div>`).join('');return}
 selected=j.id;
 const c=E.scenario(data,j.scene),m=E.model(data,j.modelId);
 const part=data.items[c.material],tool=data.tools[c.tool];
 const age=(state.tick-j.tickOpen)*8;
 const inbound=state.orders.filter(p=>p.item===c.material).reduce((n,p)=>n+p.qty,0);
 const toolOK=!!state.tools[c.tool],stockOK=!!state.stock[c.material]||j.materialUsed;
 const resourceInfo=`<div class="readiness"><b>PRONTIDÃO PARA REPARO</b><span class="${toolOK?'ready':'warning'}">${toolOK?'✓':'!'} Ferramental: ${esc(tool?.name||c.tool)}</span><span class="${stockOK?'ready':'warning'}">${stockOK?'✓':'!'} Material: ${esc(part?.name||c.material)} (${state.stock[c.material]||0} em estoque · ${inbound} em trânsito)</span><button class="act secondary" data-do="openStore">ABRIR ALMOXARIFADO</button></div>`;
 let out=`<div style="font-size:20px;font-weight:900;color:#ffca6b">${esc(m?.title)} · ${esc(j.id)}</div><p class="muted">Prioridade: ${j.priority===3?'Crítica':j.priority===2?'Alta':'Moderada'} · Tempo desde abertura: ${age}h · OS ${esc(j.id)}</p><p class="muted">${esc(j.report)}</p><div class="progress"><i style="width:${Math.round(j.stage/6*100)}%"></i></div><p class="status">${j.stage}/6 etapas de diagnóstico · ${esc(j.status)}</p><div id="notice" style="display:none;background:#764b23;padding:9px;border-radius:8px;margin:8px 0"></div>`;
 if(!j.assigned){
  const busy=new Set(state.jobs.map(x=>x.assigned).filter(Boolean));
  const free=state.team.filter(x=>!busy.has(x.id)&&x.restAt!==state.tick);
  const bays=[0,1,2].filter(x=>!state.jobs.some(z=>z.bay===x));
  if(free.length&&bays.length){
   out+=`<p class="muted">Escolha um profissional e um box para iniciar.</p><div class="actions"><select id="mechanic">${free.map(x=>`<option value="${x.id}">${esc(x.name)} · ${esc(x.role)}</option>`).join('')}</select><select id="bay">${bays.map(x=>`<option value="${x}">BOX ${x+1}</option>`).join('')}</select></div><div class="actions"><button class="act" data-do="assign">ALOCAR E INVESTIGAR</button></div>`;
  }else out+='<p class="muted">Sem mecânicos ou boxes livres. Libere um serviço ou avance o turno.</p>';
 }else{
  const mech=E.employee(state,j.assigned);
  out+=`<p class="muted">BOX ${j.bay+1} · ${esc(mech?.name)} · diagnóstico assistido</p>`;
  if(!state.tools[c.tool])out+=`<p class="status">⚠ Falta ferramenta: ${esc(data.tools[c.tool]?.name)}</p><button class="act" data-do="tool">ADQUIRIR FERRAMENTA · R$ ${brl(data.tools[c.tool]?.cost||0)}</button>`;
  if(j.stage<6){
   out+=`<h3 style="font-size:14px;color:#ffca6b">ETAPA ${j.stage+1} — ${STAGES[j.stage]}</h3><div class="muted">Selecione a hipótese mais provável; erros geram retrabalho.</div>`;
   (j.options[j.stage]||[]).forEach(o=>out+=`<button class="answer" data-answer="${esc(o.id)}">${esc(o.label)}</button>`);
   out+='<button class="act secondary" data-do="hint">SOLICITAR EVIDÊNCIA</button>';
   if(j.hints[j.stage])out+=`<p class="status">Indício: ${esc((j.stage<3?c.path[j.stage]:[c.component,c.damage,c.verification][j.stage-3])||c.verification)}</p>`;
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
 $('stats').innerHTML=`<div class="status">OS concluídas: <b>${k.done}</b> · Críticas: <b>${k.critical}</b></div><div class="status">Reputação: <b>${k.reputation}/100</b> · Utilização: <b>${k.utilization}%</b></div><div class="status">Mecânicos disponíveis: <b>${state.team.filter(x=>!x.assigned).length}</b></div><div class="progress"><i style="width:${k.reputation}%"></i></div><div class="legend">⚒ Clique nos boxes da oficina para selecionar uma OS.</div>`;
 drawTeam();drawStore();
 $('logs').innerHTML=state.logs.slice(0,5).map(l=>`<div class="log">D${l.day}: ${esc(l.text)}</div>`).join('');
}

function energyMeter(label,value){
 return `<div class="resourceMeter"><span>${label}</span><div class="progress"><i style="width:${Math.max(0,Math.min(100,value))}%"></i></div><b>${Math.round(value)}</b></div>`;
}
function drawTeam(){
 const busy=new Set(state.jobs.map(j=>j.assigned).filter(Boolean));
 $('teamPanel').innerHTML=`<p class="muted">Gerencie a energia física, mental e o moral dos profissionais. Contratações custam R$ 1.050 e 18 de energia mental do supervisor.</p><div class="actions"><button class="act" data-team-action="hire">+ CONTRATAR MECÂNICO</button></div><div class="resourceGrid">`+state.team.map(m=>{
 const current=state.jobs.find(j=>j.assigned===m.id);
 const resting=m.restAt===state.tick;
 return `<article class="resourceCard"><h3>${esc(m.avatar)} ${esc(m.name)} · ${esc(m.role)}</h3><p class="muted">${current?'Em serviço: '+esc(current.id)+' · Box '+(current.bay+1):resting?'Descanso programado neste turno':'Disponível'} · Habilidade ${Math.round(m.skill)}</p>${energyMeter('Mental',m.mental)}${energyMeter('Física',m.physical)}${energyMeter('Moral',m.morale)}<div class="actions"><button class="act secondary" data-team-action="motivate" data-person="${esc(m.id)}">MOTIVAR</button><button class="act secondary" data-team-action="rest" data-person="${esc(m.id)}" ${current||resting?'disabled':''}>DESCANSAR</button></div></article>`;
 }).join('')+'</div>';
}
function drawStore(){
 const q=FILTER.stockQuery.toLowerCase();
 const materials=Object.entries(data.items).filter(([id,it])=>FILTER.store!=='tools'&&(!q||(id+' '+it.name).toLowerCase().includes(q))&&(FILTER.store!=='shortage'||!(state.stock[id]>0)));
 const tools=Object.entries(data.tools).filter(([id,it])=>(FILTER.store!=='shortage'||!state.tools[id])&&(!q||(id+' '+it.name).toLowerCase().includes(q)));
 const inTransit=state.orders||[];
 $('storePanel').innerHTML=`<p class="muted">Caixa: R$ ${brl(state.cash)}. Compra normal tem prazo maior; pedido urgente custa 65% a mais. Recebimento ocorre ao avançar turnos.</p>
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
 $('sceneMenuBtn').addEventListener('click',ev=>{
  ev.stopPropagation();
  const menu=$('sceneMenu'),opening=menu.hidden;
  closeSceneMenu();
  if(opening){menu.hidden=false;$('sceneMenuBtn').setAttribute('aria-expanded','true')}
 });
 $('queueSearch').addEventListener('input',ev=>{FILTER.query=ev.target.value;renderQueue()});
 $('queueFilter').addEventListener('change',ev=>{FILTER.queue=ev.target.value;renderQueue()});
 $('storeSearch').addEventListener('input',ev=>{FILTER.stockQuery=ev.target.value;drawStore()});
 $('storeFilter').addEventListener('change',ev=>{FILTER.store=ev.target.value;drawStore()});
 $('closePanel').addEventListener('click',closePanel);
 $('menuOverlay').addEventListener('click',ev=>{if(ev.target===$('menuOverlay'))closePanel()});
 document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'){
  if(!$('sceneMenu').hidden){closeSceneMenu();$('sceneMenuBtn').focus();return}
  closePanel();return;
 }
 if(ev.altKey||ev.ctrlKey||ev.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const panels={'0':'management','1':'queue','2':'detail','3':'team','4':'store','5':'stats'};
 if(panels[ev.key]){ev.preventDefault();openPanel(panels[ev.key])}
 });
 document.addEventListener('click',ev=>{
  if(!ev.target.closest('.scene-tools'))closeSceneMenu();
  const submenu=ev.target.closest('[data-open-panel]');
  if(submenu){openPanel(submenu.dataset.openPanel);return}
  const p=ev.target.closest('[data-pick]');if(p){pick(p.dataset.pick);return}
  const ans=ev.target.closest('[data-answer]');if(ans){
   const result=E.answer(state,data,selected,ans.dataset.answer);
   if(result.error){notify(result.error);return}
   action(null);if(!result.ok)notify('Hipótese incorreta: custo e retrabalho adicionados.');
   return;
  }
  const tm=ev.target.closest('[data-team-action]');
  if(tm){const id=tm.dataset.person;const mode=tm.dataset.teamAction;action(mode==='hire'?E.hire(state):mode==='rest'?E.rest(state,id):E.motivate(state,id));return}
  const st=ev.target.closest('[data-store-action]');
  if(st){const id=st.dataset.item,mode=st.dataset.storeAction;if(mode==='tool')action(E.buyTool(state,data,id));else{const qty=Number($('qty-'+id)?.value||1);action(E.orderMaterial(state,data,id,qty,mode==='rush'))}return}
  const b=ev.target.closest('[data-do]');if(!b)return;
  if(b.dataset.do==='openStore'){openPanel('store');$('storeSearch').value='';FILTER.stockQuery='';drawStore();return}
  const j=job();if(!j)return;const c=E.scenario(data,j.scene);
  if(b.dataset.do==='assign')action(E.attach(state,j.id,$('mechanic').value,Number($('bay').value),true));
  if(b.dataset.do==='release')action(E.release(state,j.id));
  if(b.dataset.do==='hint')action(E.hint(state,data,j.id));
  if(b.dataset.do==='tool')action(E.buyTool(state,data,c.tool));
  if(b.dataset.do==='order')action(E.orderMaterial(state,data,c.material,1,true));
 });
 $('advance').addEventListener('click',()=>{
  const preview=shiftPreview();
  const msg=[
    'AVANÇAR 8 HORAS?',
    '',
    'Ordens alocadas: '+preview.jobs.length,
    'Em diagnóstico: '+preview.diagnostic.length,
    'Aptas ao reparo: '+preview.repair.length,
    'Bloqueadas por peça/ferramenta: '+preview.blocked.length,
    'Profissionais com energia baixa: '+preview.low.length,
    'Pedidos com chegada prevista: '+preview.orders.length,
    '',
    'Os resultados reais dependem da simulação de trabalho, falhas e logística. Confirmar?'
  ].join(String.fromCharCode(10));
  if(!confirm(msg))return;
  const oldDone=state.done.length;
  const result=E.advance(state,data);selected=E.job(state,selected)?.id||state.jobs[0]?.id;action(null);
  notify((state.done.length-oldDone)+' OS concluída(s), '+result.blocks+' bloqueio(s) neste turno.');
 });
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
   state=candidate;selected=state.jobs[0]?.id||null;
   action(null);notify('Save importado com sucesso.');
  }catch(error){notify('Falha ao importar: '+error.message)}
 });
  $('bgPicker').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];ev.target.value='';closeSceneMenu();if(!file)return;
  try{
   if(file.size>12_000_000)throw Error('Imagem acima de 12 MB');
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Formato não suportado');
   await useBackground(file);await sceneStore('save',file);localStorage.setItem(CUSTOM_BACKGROUND_KEY,'1');
   notify('Cenário carregado. Para os sprites funcionarem sem duplicação, utilize uma imagem de fundo sem máquinas.');
  }catch(err){notify('Não foi possível carregar: '+err.message)}
 });
 $('bgReset').addEventListener('click',async()=>{closeSceneMenu();localStorage.removeItem(CUSTOM_BACKGROUND_KEY);try{await sceneStore('delete')}catch(err){console.warn(err)}if(scene){const tex=scene.textures.exists('repoWorkshopBG')?scene.textures.get('repoWorkshopBG'):null;scene.setBackdrop(tex?.getSourceImage()||null)}notify('Cenário oficial restaurado.')});
  $('reset').addEventListener('click',()=>{if(!confirm('Reiniciar a campanha Phaser?'))return;state=E.create(data);selected=state.jobs[0]?.id;action(null)});
}
class Workshop extends Phaser.Scene{
 constructor(){super('Workshop');this.machineObjs=[];this.workerSprites=[]}
 preload(){
  Object.entries(ASSETS).forEach(([key,url])=>this.load.image(key,url));
  this.load.image('repoWorkshopBG','./assets/oficina-base.avif?v=0.7.0');
  this.load.on('loaderror',f=>console.warn('Imagem opcional indisponivel:',f.key));
 }
 create(){
  scene=this;this.cameras.main.setBackgroundColor('#182838');
  if(modalOpen())this.input.enabled=false;
  // Enquadramento solicitado: camera recorta o mundo, sem redimensionar sprites nem as zonas de clique.
  this.cameras.main.setScroll(319,45);
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
  this.bayZones=BAY_LAYOUT.map(({id,hitWorld})=>{
   const hit=this.add.zone(hitWorld.x,hitWorld.y,hitWorld.width,hitWorld.height).setOrigin(0).setInteractive({useHandCursor:true});
   hit.on('pointerdown',()=>{if(modalOpen())return;const j=state.jobs.find(z=>z.bay===id);if(j)pick(j.id)});
   return hit;
  });
  this.statusText=this.add.text(17,612,'', {fontFamily:'monospace',fontSize:'14px',color:'#f2e3bb',backgroundColor:'#102132cc',padding:{x:9,y:7}});
  // Somente personagens mudam de pose; equipamentos e suas sombras nunca são animados.
  this.time.addEvent({delay:560,loop:true,callback:()=>{
   if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   for(const actor of this.workerSprites){
    if(!actor.sprite.active||actor.frames.length<2)continue;
    actor.index=(actor.index+1)%actor.frames.length;
    actor.sprite.setTexture(actor.frames[actor.index]);
   }
  }});
  this.backgroundDecor=this.children.list.filter(o=>o!==this.statusText&&!this.bayZones.includes(o));
  this.refresh();
  if(this.textures.exists('repoWorkshopBG'))this.setBackdrop(this.textures.get('repoWorkshopBG').getSourceImage());
  if(localStorage.getItem(CUSTOM_BACKGROUND_KEY)==='1')sceneStore('read').then(blob=>{if(blob)return useBackground(blob)}).catch(console.warn);
 }
 setBackdrop(img){
  if(this.backdrop){this.backdrop.destroy();this.backdrop=null}
  if(this.backgroundDecor)this.backgroundDecor.forEach(o=>o.setVisible(!img));
  if(!img){this.refresh();return}
  const crop=SCENE_REFERENCE.crop;
  const canvas=document.createElement('canvas');canvas.width=SCENE_REFERENCE.width;canvas.height=SCENE_REFERENCE.height;
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Canvas 2D indisponível');
  ctx.imageSmoothingEnabled=true;
  const width=img.naturalWidth||img.width,height=img.naturalHeight||img.height;
  const aspect=width/height;
  // O fundo oficial mantém a geometria 1976 x 796, mesmo quando é servido como AVIF otimizado.
  if(aspect>2.42&&aspect<2.55){
   const sx=width/SCENE_REFERENCE.sourceWidth,sy=height/SCENE_REFERENCE.sourceHeight;
   ctx.drawImage(img,crop.x*sx,crop.y*sy,crop.width*sx,crop.height*sy,0,0,canvas.width,canvas.height);
  }else if(aspect>2.1){
   // Fundos já recortados pelo jogador.
   ctx.drawImage(img,0,0,width,height,0,0,canvas.width,canvas.height);
  }else{
   // Compatibilidade com screenshots completos da interface anterior.
   const sx=width/1672,sy=height/941;
   ctx.drawImage(img,359*sx,246*sy,1045*sx,407*sy,0,0,canvas.width,canvas.height);
  }
  if(this.textures.exists('dynamicWorkshopBG'))this.textures.remove('dynamicWorkshopBG');
  this.textures.addCanvas('dynamicWorkshopBG',canvas).setFilter(Phaser.Textures.FilterMode.LINEAR);
  this.backdrop=this.add.image(SCENE_REFERENCE.worldX,SCENE_REFERENCE.worldY,'dynamicWorkshopBG').setOrigin(0).setDepth(-1);
  this.refresh();
 }
 text(x,y,t,size,color,bold=false){return this.add.text(x,y,t,{fontFamily:'Arial, sans-serif',fontSize:size+'px',fontStyle:bold?'bold':'normal',color,stroke:'#112435',strokeThickness:4})}
 machine(x,y,modelId,scale=1){
   const key=MACHINES[modelId];
   if(key&&this.textures.exists(key)){
     this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
     const im=this.add.image(x,y,key).setOrigin(.5,1);const maxW=310*scale,maxH=220*scale;
     const t=this.textures.get(key).getSourceImage();const factor=Math.min(maxW/t.width,maxH/t.height);
     im.setScale(factor);
     this.machineObjs.push(im);
   }else{
     // Trator de esteiras: silhueta industrial própria enquanto não existe PNG aprovado do D9.
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
 worker(x,y,slot,{facing='right',mode='diagnose'}={}){
  // Poses reais do catálogo: idle/inspect/point/clipboard, sem caminhar nem saltar.
  const person=slot%2===0?'lia':'rafael';
  const poses=mode==='blocked'?['idle']:mode==='repair'?['idle','inspect','clipboard','inspect']:['idle','inspect','point','inspect'];
  const keys=poses.map(p=>'worker_'+person+'_'+p).filter(k=>this.textures.exists(k));
  if(keys.length){
   for(const key of new Set(keys))this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
   const im=this.add.image(x,y,keys[0]).setOrigin(.5,1);
   const src=this.textures.get(keys[0]).getSourceImage();
   im.setScale(Math.min(54/src.width,64/src.height));
   // Esquerda do equipamento olha para a direita; direita olha para a esquerda.
   im.setFlipX(facing==='left');
   this.workerSprites.push({sprite:im,frames:keys,index:0});
   return im;
  }
  // Fallback quando houver falha de rede/asset: mecânico parado no piso.
  const g=this.add.graphics();
  g.fillStyle(0x172d43);g.fillRoundedRect(x-13,y-39,26,31,3);
  g.fillStyle(0xf0b57a);g.fillCircle(x,y-48,11);
  g.fillStyle(0xe7ac26);g.fillEllipse(x,y-60,28,12);
  g.fillStyle(0x172d43);g.fillRect(x-11,y-8,9,9);g.fillRect(x+3,y-8,9,9);
  g.lineStyle(4,0xf0b57a);g.lineBetween(x+(facing==='right'?9:-9),y-33,x+(facing==='right'?21:-21),y-22);
  this.machineObjs.push(g);
  return g;
 }

 refresh(){
   if(this.selectedOutline){this.selectedOutline.destroy();this.selectedOutline=null}
   const focus=state.jobs.find(z=>z.id===selected&&z.bay!==null);
   if(focus){
     const bounds=BAY_LAYOUT[focus.bay].hitWorld;
     const outline=this.add.graphics();
     outline.lineStyle(3,0xffc94b,0.9);
     outline.strokeRoundedRect(bounds.x+3,bounds.y+3,bounds.width-6,bounds.height-6,6);
     this.selectedOutline=outline;
   }
   this.machineObjs.forEach(x=>x.destroy());this.machineObjs=[];
   this.workerSprites.forEach(a=>a.sprite.destroy());this.workerSprites=[];
   this.textObjects?.forEach(x=>x.destroy());this.textObjects=[];
   this.progressObjects?.forEach(x=>x.destroy());this.progressObjects=[];
   BAY_LAYOUT.forEach(({id:i,spriteWorld,workerWorld,labelWorld,progressWorld})=>{
     const j=state.jobs.find(z=>z.bay===i),cx=spriteWorld.x;
     if(j){
       // Sombra de contato independente para assentar visualmente as rodas/esteiras no piso.
       const ground=spriteWorld.groundY??(workerWorld[0].y-2);
       const shadow=this.add.graphics();
       shadow.fillStyle(0x04090b,0.31);
       shadow.fillEllipse(cx,ground,Math.min(205,(progressWorld?.width||225)*0.87),22);
       shadow.fillStyle(0x02070a,0.13);
       shadow.fillEllipse(cx,ground+3,245,30);
       this.machineObjs.push(shadow);
       this.machine(cx,spriteWorld.y,j.modelId,spriteWorld.scale||.72);
       const mode=j.status==='material'||j.status==='ferramenta'?'blocked':j.stage>=6?'repair':'diagnose';
       workerWorld.forEach((w,idx)=>this.worker(w.x,w.y,i*2+idx,{facing:w.facing|| (idx?'left':'right'),mode}));
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
       let label=this.text(cx-68,(labelWorld?.y??430),'BOX DISPONÍVEL',12,'#d1dccd',true);label.setAlpha(.75);this.textObjects.push(label);
     }
   });
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
    if(map.background?.sourceCrop)SCENE_REFERENCE.crop=map.background.sourceCrop;
    if(map.background?.sourceWidth)SCENE_REFERENCE.sourceWidth=map.background.sourceWidth;
    if(map.background?.sourceHeight)SCENE_REFERENCE.sourceHeight=map.background.sourceHeight;
   }
  }catch(error){console.warn('Mapeamento opcional:',error)}
  try{const raw=localStorage.getItem(SAVE);if(raw){const s=JSON.parse(raw);if(E.validate(s))state=s}}catch(e){console.warn(e)}
  if(!state)state=E.create(data);
  selected=state.jobs[0]?.id;events();drawUI();
  if(!window.Phaser)throw Error('Phaser CDN não carregou. Verifique conexão.');
  new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1080,height:450,backgroundColor:'#182838',render:{pixelArt:false,antialias:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},scene:[Workshop]});
 }catch(e){console.error(e);$('game').innerHTML='<div style="padding:60px;color:#ffc86a">Não foi possível iniciar a cena Phaser: '+esc(e.message)+'</div>'}
}
boot();
})();
