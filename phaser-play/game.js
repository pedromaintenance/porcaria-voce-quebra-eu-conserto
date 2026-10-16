/* P.O.R.C.A.R.I.A. Phaser vertical slice v0.1 · motor de simulacao v1.1 */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const E=window.PORCARIA_ENGINE;
const STAGES=['Sistema','Grupo','Subgrupo','Componente','Dano','Causa'];
const SAVE='porcaria.phaser.prototype.v01';
const REPO='https://raw.githubusercontent.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/fix/assets-review-20261014/phaser/assets-review/assets/';
const ASSETS={
 truck:REPO+'equipamentos/historico/caminhao_pixel_art_original.png',
 shovel:REPO+'equipamentos/cat6030_frontshovel_estudo.png',
 excavator:REPO+'equipamentos/cat395.png',
 drill:REPO+'equipamentos/sandvik_dr410i_torre_erguida.png',
 worker:REPO+'personagens/elenco/mec_lia/idle.png'
};
const MACHINES={EQ01:'truck',EQ02:'shovel',EQ03:'excavator',EQ04:'excavator',EQ05:'drill',EQ06:'drill'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>Math.round(n).toLocaleString('pt-BR');
let data,state,selected,scene;
const FILTER={queue:'all',query:'',store:'all',stockQuery:''};
let toastTimeout;
const PANEL_TITLES={queue:'📻 FILA DE ORDENS DE SERVIÇO',detail:'🔧 ORDEM DE SERVIÇO ATUAL',stats:'📊 INDICADORES E RECURSOS',team:'👷 EQUIPE DA OFICINA',store:'📦 ALMOXARIFADO E FERRAMENTAL',help:'❔ CONTROLES DA OFICINA'};
function openPanel(name){const overlay=$('menuOverlay');if(!overlay)return;overlay.hidden=false;$('modalHeading').textContent=PANEL_TITLES[name]||'MENU DA OFICINA';document.querySelectorAll('[data-panel]').forEach(el=>el.classList.toggle('is-open',el.dataset.panel===name));document.body.style.overflow='hidden';$('closePanel')?.focus()}
function closePanel(){const overlay=$('menuOverlay');if(overlay)overlay.hidden=true;document.body.style.overflow='';}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){console.warn('Save',e)}}
function action(error){if(error)notify(error);else{save();drawUI();if(scene)scene.refresh()}}
function notify(t){const area=$('toast');if(!area)return;area.textContent=t;area.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{area.hidden=true},4400)}
function job(){return E.job(state,selected)||state.jobs[0]}
function pick(id){selected=id;drawUI();if(scene)scene.refresh();openPanel('detail')}
function statusFor(j){
 if(!j)return {label:'LIVRE',css:'free'};
 if(j.status==='material')return {label:'AGUARDANDO PEÇA',css:'blocked'};
 if(j.status==='ferramenta')return {label:'FALTA FERRAMENTA',css:'blocked'};
 if(j.status==='reparo')return {label:'EM REPARO',css:'work'};
 if(j.stage>=6)return {label:'PRONTO PARA REPARO',css:'work'};
 return {label:'DIAGNÓSTICO '+j.stage+'/6',css:'work'};
}
function drawBays(){
 $('bayHUD').innerHTML=[0,1,2].map(i=>{const j=state.jobs.find(x=>x.bay===i),st=statusFor(j);
 return `<div class="bayBadge ${st.css}"><b>BOX ${i+1}</b><span>${j?esc(E.model(data,j.modelId)?.title)+' · '+esc(j.id):'Disponível'}</span><b>${st.label}</b></div>`}).join('');
}
function drawUI(){
 if(!state||!data)return;
 const k=E.kpis(state);
 $('day').textContent='DIA '+state.day+' · TURNO '+(state.shift?'B':'A');
 $('cash').textContent='R$ '+brl(state.cash);$('team').textContent=state.team.length;
 $('backlog').textContent=k.backlog;$('energy').textContent=Math.round(state.player.mental)+'/100';
 drawBays();
 $('queue').innerHTML=[...state.jobs].filter(j=>{
 const m=E.model(data,j.modelId);
 const q=FILTER.query.toLowerCase();
 const matched=!q||[j.id,j.report,m?.title,j.asset].some(x=>String(x||'').toLowerCase().includes(q));
 return matched&&(FILTER.queue==='all'||FILTER.queue==='critical'&&j.priority===3||FILTER.queue==='waiting'&&!j.assigned||FILTER.queue==='assigned'&&!!j.assigned);
 }).sort((a,b)=>b.priority-a.priority||a.tickOpen-b.tickOpen).map(j=>{
 const m=E.model(data,j.modelId);
 return `<button class="job ${j.id===selected?'active':''}" data-pick="${j.id}"><span class="severity">${j.priority===3?'CRÍTICA':j.priority===2?'ALTA':'MODERADA'}</span><strong>${esc(m?.title)} · ${esc(j.id)}</strong><small>${esc(j.report)}</small><small>${esc(j.status)} · ${j.stage}/6 etapas · ${Math.ceil(j.repairRemaining)}h reparo</small></button>`;
 }).join('')||'<p class="muted">Nenhuma OS corresponde ao filtro.</p>';
 const j=job(), d=$('detail');
 if(!j){d.innerHTML='<p>Sem ordens de serviço abertas.</p>';drawTeam();drawStore();$('stats').innerHTML='<p class="muted">Nenhuma OS pendente.</p>';$('logs').innerHTML=state.logs.slice(0,5).map(l=>`<div class="log">D${l.day}: ${esc(l.text)}</div>`).join('');return}
 selected=j.id;
 const c=E.scenario(data,j.scene),m=E.model(data,j.modelId);
 let out=`<div style="font-size:20px;font-weight:900;color:#ffca6b">${esc(m?.title)} · ${esc(j.id)}</div><p class="muted">${esc(j.report)}</p><div class="progress"><i style="width:${Math.round(j.stage/6*100)}%"></i></div><p class="status">${j.stage}/6 etapas de diagnóstico · ${esc(j.status)}</p><div id="notice" style="display:none;background:#764b23;padding:9px;border-radius:8px;margin:8px 0"></div>`;
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
 document.querySelectorAll('[data-open-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.openPanel)));
 $('helpBtn').addEventListener('click',()=>openPanel('help'));
 $('queueSearch').addEventListener('input',ev=>{FILTER.query=ev.target.value;drawUI();$('queueSearch').value=FILTER.query});
 $('queueFilter').addEventListener('change',ev=>{FILTER.queue=ev.target.value;drawUI()});
 $('storeSearch').addEventListener('input',ev=>{FILTER.stockQuery=ev.target.value;drawStore()});
 $('storeFilter').addEventListener('change',ev=>{FILTER.store=ev.target.value;drawStore()});
 $('closePanel').addEventListener('click',closePanel);
 $('menuOverlay').addEventListener('click',ev=>{if(ev.target===$('menuOverlay'))closePanel()});
 document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'){closePanel();return}
 if(ev.altKey||ev.ctrlKey||ev.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const panels={'1':'queue','2':'detail','3':'team','4':'store','5':'stats'};
 if(panels[ev.key]){ev.preventDefault();openPanel(panels[ev.key])}
 });
 document.addEventListener('click',ev=>{
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
  const j=job();if(!j)return;const c=E.scenario(data,j.scene);
  if(b.dataset.do==='assign')action(E.attach(state,j.id,$('mechanic').value,Number($('bay').value),true));
  if(b.dataset.do==='release')action(E.release(state,j.id));
  if(b.dataset.do==='hint')action(E.hint(state,data,j.id));
  if(b.dataset.do==='tool')action(E.buyTool(state,data,c.tool));
  if(b.dataset.do==='order')action(E.orderMaterial(state,data,c.material,1,true));
 });
 $('advance').addEventListener('click',()=>{
  const active=state.jobs.filter(j=>j.assigned).length;
  const blocked=state.jobs.filter(j=>j.assigned&&['material','ferramenta'].includes(j.status)).length;
  const msg='Avançar 8 horas? '+active+' OS alocada(s) e '+blocked+' bloqueada(s). A equipe consumirá energia e poderão chegar peças ou novas ocorrências.';
  if(!confirm(msg))return;
  const oldDone=state.done.length;
  const result=E.advance(state,data);selected=E.job(state,selected)?.id||state.jobs[0]?.id;action(null);
  notify((state.done.length-oldDone)+' OS concluída(s), '+result.blocks+' bloqueio(s) neste turno.');
 });
 $('save').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='porcaria-phaser-save.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),700);
 });
 $('reset').addEventListener('click',()=>{if(!confirm('Reiniciar a campanha Phaser?'))return;state=E.create(data);selected=state.jobs[0]?.id;action(null)});
}
class Workshop extends Phaser.Scene{
 constructor(){super('Workshop');this.machineObjs=[]}
 preload(){
  Object.entries(ASSETS).forEach(([key,url])=>this.load.image(key,url));
  this.load.on('loaderror',f=>console.warn('Imagem opcional indisponivel:',f.key));
 }
 create(){
  scene=this;this.cameras.main.setBackgroundColor('#182838');
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
  this.bayZones=[0,1,2].map(i=>{const x=324+i*355;const hit=this.add.zone(x,155,337,323).setOrigin(0).setInteractive({useHandCursor:true});hit.on('pointerdown',()=>{const j=state.jobs.find(z=>z.bay===i);if(j)pick(j.id)});return hit});
  this.statusText=this.add.text(17,612,'', {fontFamily:'monospace',fontSize:'14px',color:'#f2e3bb',backgroundColor:'#102132cc',padding:{x:9,y:7}});
  this.time.addEvent({delay:2300,loop:true,callback:()=>{if(!this.machineObjs.length)return;this.tweens.add({targets:this.machineObjs.filter(x=>x.type==='Image'),y:'-=2',yoyo:true,duration:900,ease:'Sine.easeInOut'})}});
  this.refresh();
 }
 text(x,y,t,size,color,bold=false){return this.add.text(x,y,t,{fontFamily:'Arial, sans-serif',fontSize:size+'px',fontStyle:bold?'bold':'normal',color,stroke:'#112435',strokeThickness:4})}
 machine(x,y,modelId,scale=1){
   const key=MACHINES[modelId];
   if(key&&this.textures.exists(key)){
     const im=this.add.image(x,y,key).setOrigin(.5,1);const maxW=310*scale,maxH=220*scale;
     const t=this.textures.get(key).getSourceImage();const factor=Math.min(maxW/t.width,maxH/t.height);
     im.setScale(factor);
     this.machineObjs.push(im);
   }else{
     // Maquina vetorial de emergencia, adequada mesmo sem imagem externa.
     const g=this.add.graphics();const isTruck=modelId==='EQ01';g.fillStyle(0xf0a91e);
     g.fillRoundedRect(x-112*scale,y-98*scale,220*scale,80*scale,8*scale);
     if(isTruck){g.fillStyle(0xd48b10);g.fillPoints([{x:x-90*scale,y:y-125*scale},{x:x+80*scale,y:y-126*scale},{x:x+110*scale,y:y-95*scale},{x:x-85*scale,y:y-95*scale}],true)}
     else{g.fillStyle(0xefb735);g.fillRect(x+25*scale,y-135*scale,65*scale,54*scale)}
     g.fillStyle(0x17232d);[-67,64].forEach(dx=>{g.fillCircle(x+dx*scale,y-10*scale,32*scale);g.fillStyle(0x4a4c4e);g.fillCircle(x+dx*scale,y-10*scale,16*scale);g.fillStyle(0x17232d)});
     this.machineObjs.push(g);
   }
 }
 worker(x,y,n){
   if(this.textures.exists('worker')){
     const im=this.add.image(x,y,'worker').setOrigin(.5,1);const t=this.textures.get('worker').getSourceImage();im.setScale(Math.min(50/t.width,70/t.height));this.machineObjs.push(im);
   }else{
     const g=this.add.graphics();g.fillStyle(0x243b57);g.fillRoundedRect(x-11,y-43,22,34,4);g.fillStyle(0xf0b57a);g.fillCircle(x,y-51,11);g.fillStyle(0xf5b522);g.fillEllipse(x,y-61,25,12);g.fillStyle(0x192638);g.fillRect(x-11,y-9,9,15);g.fillRect(x+3,y-9,9,15);this.machineObjs.push(g);
   }
 }
 refresh(){
   this.machineObjs.forEach(x=>x.destroy());this.machineObjs=[];
   this.textObjects?.forEach(x=>x.destroy());this.textObjects=[];
   [0,1,2].forEach(i=>{
     const j=state.jobs.find(z=>z.bay===i),cx=490+i*355;
     if(j){
       this.machine(cx,395,j.modelId,.87);
       this.worker(cx-114,442,i);this.worker(cx+115,439,i+1);
       let label=this.text(cx-130,445,E.model(data,j.modelId)?.title+' · '+j.id,15,'#ffffff',true);
       label.setBackgroundColor('#0c2539').setPadding(5);this.textObjects.push(label);
     }else{
       let label=this.text(cx-70,320,'BOX DISPONÍVEL',15,'#d1dccd',true);label.setAlpha(.75);this.textObjects.push(label);
     }
   });
   this.statusText.setText('TURNO '+(state.shift?'B':'A')+'  |  '+state.jobs.filter(j=>j.assigned).length+' BOXES EM USO  |  '+state.done.length+' OS CONCLUÍDAS');
 }
}
async function boot(){
 try{
  const res=await fetch('../game-data.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
  data=await res.json();
  try{const raw=localStorage.getItem(SAVE);if(raw){const s=JSON.parse(raw);if(E.validate(s))state=s}}catch(e){console.warn(e)}
  if(!state)state=E.create(data);
  selected=state.jobs[0]?.id;events();drawUI();
  if(!window.Phaser)throw Error('Phaser CDN não carregou. Verifique conexão.');
  new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1080,height:450,backgroundColor:'#182838',render:{pixelArt:true,antialias:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},scene:[Workshop]});
 }catch(e){console.error(e);$('game').innerHTML='<div style="padding:60px;color:#ffc86a">Não foi possível iniciar a cena Phaser: '+esc(e.message)+'</div>'}
}
boot();
})();
