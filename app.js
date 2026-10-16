/* P.O.R.C.A.R.I.A. v1.1 — apresentação e interação PWA. */
'use strict';
const K='porcaria.vqec.v1.1';
const E=window.PORCARIA_ENGINE;
const STAGES=['Sistema','Grupo','Subgrupo','Componente (parte objeto)','Dano (perda)','Causa'];
let DATA,STATE;
const UI={view:'yard',selected:null,dbModel:'EQ01',chooseMech:null,chooseBay:0,assist:true,modalAction:null};
const el=id=>document.getElementById(id);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');
const bar=(name,v,cls)=>`<div class="meter-label"><span>${name}</span><b>${Math.round(v)}/100</b></div><div class="bar ${cls||''}"><span style="width:${Math.max(0,Math.min(100,v))}%"></span></div>`;
const pri=n=>n===3?'Crítica':n===2?'Alta':'Moderada';
const statusName={fila:'Aguardando diagnóstico',diagnostico:'Em diagnóstico',apto:'Diagnóstico confirmado',material:'Aguardando material',ferramenta:'Sem ferramental',reparo:'Em reparo'};
// Arte provisoria de producao: somente PNGs existentes no inventario; fallback em emoji.
const SPRITES={
 EQ01:'equipamentos/historico/caminhao_pixel_art_original.png',
 EQ02:'equipamentos/cat6030_frontshovel_estudo.png',
 EQ03:'equipamentos/cat395.png',
 EQ05:'equipamentos/sandvik_dr410i_torre_erguida.png',
 EQ06:'equipamentos/sandvik_dr410i_torre_abaixada.png'
};
const spriteFor=id=>SPRITES[id]?'./phaser/assets-review/assets/'+SPRITES[id]:null;
const machineArt=(id,cl='')=>{const src=spriteFor(id);return src?
 `<span class="machine-art ${cl}"><img src="${src}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="fallback-art" hidden>${emojiFor(id)}</span></span>`:
 `<span class="machine-art ${cl}"><span class="fallback-art">${emojiFor(id)}</span></span>`};
const emojiFor=id=>({EQ01:'🚚',EQ02:'🏗️',EQ03:'🚜',EQ04:'🚜',EQ05:'⛏️',EQ06:'⛏️',EQ07:'🚜',EQ08:'🚜',EQ09:'🚜'})[id]||'🚜';
function stageHint(j,c,path){
 const base=[
  `Isolamento funcional simulado: a anomalia está associada ao sistema ${path?.systemName||c.path[0]}.`,
  `Inspeção setorial simulada: o ponto de perda de desempenho foi localizado no grupo ${path?.groupName||c.path[1]}.`,
  `Inspeção de subconjunto: a função que apresenta a anomalia é ${path?.subgroupName||c.path[2]}.`,
  `Inspeção física dirigida: o indício principal está no componente ${c.component}.`,
  `Medição/observação: a condição de dano identificada é ${c.damage}.`,
  `Resultado do teste: ${c.verification}`
 ]; return base[j.stage]||'';
}
const rank=x=>x>=900?'Lenda da Corretiva':x>=490?'Mestre de Oficina':x>=170?'Planejador de Crise':'Chefe de Turno';
const save=()=>{try{localStorage.setItem(K,JSON.stringify(STATE));}catch(e){console.warn('Save',e);}};
const err=e=>e?openModal('Atenção',`<p>${esc(e)}</p>`):null;

async function boot(){
 try{
  const res=await fetch('./game-data.json');if(!res.ok)throw Error('HTTP '+res.status);
  DATA=await res.json();
  try{const raw=localStorage.getItem(K);if(raw){const imported=JSON.parse(raw);if(E.validate(imported))STATE=imported}}catch(e){}
  if(!STATE)STATE=E.create(DATA);
  UI.selected=STATE.jobs[0]?.id||null;
  UI.dbModel=DATA.models[0].id;
  connect();render();
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(console.warn);
 }catch(e){el('queue').innerHTML=`<div class="notice bad">Não foi possível carregar o jogo: ${esc(e.message)}. Abra por um servidor HTTP/HTTPS (GitHub Pages), não por file://.</div>`;console.error(e)}
}

function connect(){
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
  UI.view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===UI.view));
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+UI.view));render();
 }));
 el('nextShift').addEventListener('click',()=>{
  const occupied=STATE.jobs.filter(j=>j.assigned).length;
  const msg=`<p>Avançar <b>8 horas de oficina</b>? ${occupied} ordem(ns) com equipe serão processadas. Compras podem chegar, mecânicos vão gastar energia e o backlog vai envelhecer.</p>`;
  openModal('Passar o turno',msg,()=>{const r=E.advance(STATE,DATA);UI.selected=E.job(STATE,UI.selected)?.id||STATE.jobs[0]?.id||null;save();render(); if(STATE.closed&&STATE.day===21&&STATE.shift===0)openModal('Campanha concluída!',`<p>Você alcançou o ciclo de 20 dias! Consulte a sala de indicadores. A oficina permanece em modo livre para continuar treinando.</p>`);});
 });
 el('saveBtn').addEventListener('click',exportSave);el('exportBtn').addEventListener('click',exportSave);
 el('importFile').addEventListener('change',ev=>{
  const file=ev.target.files?.[0];if(!file)return;
  file.text().then(t=>{const obj=JSON.parse(t);if(!E.validate(obj))throw Error('Este JSON não pertence à v1.1.');STATE=obj;UI.selected=STATE.jobs[0]?.id||null;save();render();openModal('Save restaurado','<p>Carreira carregada com sucesso.</p>');}).catch(e=>err(e.message));ev.target.value='';
 });
 el('resetBtn').addEventListener('click',()=>openModal('Reiniciar campanha','<p>O reset apaga o progresso local. Recomendo exportar o save JSON antes de começar outra oficina.</p><button class="button" id="downloadBeforeReset">⇩ Exportar backup agora</button>',()=>{STATE=E.create(DATA);UI.selected=STATE.jobs[0]?.id;save();render();},'Apagar e começar',()=>el('downloadBeforeReset')?.addEventListener('click',exportSave)));
 el('hireButton').addEventListener('click',()=>openModal('Contratar mecânico','<p>Integração: <b>R$1.050</b> e <b>18 de energia mental</b> da chefia. O profissional entra no quadro e passa a gerar custo diário de pessoal.</p>',()=>act(E.hire(STATE))));
 el('modalCancel').addEventListener('click',closeModal);
 el('modalOk').addEventListener('click',()=>{const fn=UI.modalAction;closeModal();if(fn)fn()});
 document.addEventListener('click',evt=>{
  const b=evt.target.closest('[data-action]');if(!b)return;
  const type=b.dataset.action,id=b.dataset.id;
  if(type==='select'){UI.selected=id;render();return}
  if(type==='assign'){
   const mid=el('assignMech')?.value,bay=Number(el('assignBay')?.value),help=!!el('assignHelp')?.checked;
   const e=E.attach(STATE,id,mid,bay,help);act(e);return;
  }
  if(type==='release'){act(E.release(STATE,id));return}
  if(type==='answer'){
   const j=E.job(STATE,id);const choice=j?.options[j.stage]?.[Number(b.dataset.index)];if(!choice)return;
   const result=E.answer(STATE,DATA,id,choice.id);if(result.error){err(result.error);return} save();render();
   el('quizFeedback').innerHTML=result.ok?'<div class="notice success">✅ Boa! A dupla recuperou energia. Avance até a causa.</div>':`<div class="notice bad">⚠️ Não é esse. Reveja o relato, os níveis já confirmados e as evidências. (-energia e +retrabalho)</div>`;
   return;
  }
  if(type==='hint'){act(E.hint(STATE,DATA,id));return}
  if(type==='buytool'){act(E.buyTool(STATE,DATA,id));return}
  if(type==='order'){const q=Number(b.dataset.qty)||1,fast=b.dataset.fast==='true';act(E.orderMaterial(STATE,DATA,id,q,fast));return}
  if(type==='motivate'){act(E.motivate(STATE,id));return}
  if(type==='rest'){act(E.rest(STATE,id));return}
 });
 document.addEventListener('change',ev=>{
  if(ev.target.id==='dbModelSelect'){UI.dbModel=ev.target.value;renderKnowledge()}
 });
}
function act(e){if(e)err(e);else{save();render();}}
function openModal(title,html,fn=null,confirmText='Confirmar',after=null){el('modalTitle').textContent=title;el('modalText').innerHTML=html;
 UI.modalAction=fn;el('modalOk').style.display=fn?'':'none';el('modalOk').textContent=confirmText;el('modal').showModal();if(after)after();}
function closeModal(){el('modal').close();UI.modalAction=null}
function exportSave(){save();const blob=new Blob([JSON.stringify(STATE,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`PORCARIA-OFICINA-DIA-${STATE.day}-TURNO-${STATE.shift===0?'A':'B'}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

function render(){
 if(!STATE||!DATA)return;
 renderHeader();renderScene();renderQueue();renderJob();renderLogs();
 if(UI.view==='people')renderTeam();
 if(UI.view==='store')renderStore();
 if(UI.view==='indicators')renderIndicators();
 if(UI.view==='knowledge')renderKnowledge();
 save();
}
function renderHeader(){
 const k=E.kpis(STATE);
 const d=[['Dia / turno',STATE.day+' / '+(STATE.shift===0?'A':'B')],['Caixa',brl(STATE.cash)],['Reputação',`${k.reputation}/100`],['Equipe',String(STATE.team.length)],['Backlog',String(k.backlog)],['XP / patente',`${STATE.xp} • ${rank(STATE.xp)}`]];
 el('headerStats').innerHTML=d.map(([n,v])=>`<div class="metric"><span>${n}</span><strong>${esc(v)}</strong></div>`).join('');
 el('shiftName').textContent=`📅 Dia ${STATE.day} · Turno ${STATE.shift===0?'A':'B'}`;
 el('pendingCount').textContent=STATE.jobs.length+' demandas';
}
function renderScene(){
 const fill=i=>{const j=STATE.jobs.find(x=>x.bay===i);if(!j)return `<div class="bay"><strong>BOX ${i+1} · LIVRE</strong><div class="toy">🧼</div><div class="tiny">Bancada limpa. Aguardando serviço.</div></div>`;
 const m=E.model(DATA,j.modelId);const mech=E.employee(STATE,j.assigned);
 return `<div class="bay occupied"><strong>BOX ${i+1} · ${esc(statusName[j.status]||j.status)}</strong><div class="toy">${machineArt(j.modelId)}</div><div class="tiny"><b>${esc(m?.title||'Máquina')}</b> · ${esc(j.id)}<br>${esc(mech?.name||'Sem mecânico')}<br><span class="chip">${j.stage}/6 diag · ${Math.ceil(j.repairRemaining)}h reparo</span></div></div>`;};
 el('scene').innerHTML=`<div class="yard-sign"><div class="emoji">🏠</div><div><strong>OFICINA DA PORCARIA</strong><div class="small">3 boxes · 2 turnos de 8h</div></div></div>${[0,1,2].map(fill).join('')}`;
}
function renderQueue(){
 const sorted=[...STATE.jobs].sort((a,b)=>b.priority-a.priority||a.tickOpen-b.tickOpen);
 el('queue').innerHTML=sorted.length?sorted.map(j=>{
  const m=E.model(DATA,j.modelId),age=STATE.tick-j.tickOpen;
  return `<button class="order ${UI.selected===j.id?'selected':''} ${j.priority===3?'urgent':''}" data-action="select" data-id="${j.id}"><div class="order-head"><b>${machineArt(j.modelId,"mini")} ${esc(j.id)} · ${esc(m.title)}</b><span class="pill p${j.priority}">${pri(j.priority)}</span></div><p>${esc(j.report)}</p><div class="tags"><span class="tag">🕒 ${age*8}h aguard./exec.</span><span class="tag">${esc(statusName[j.status]||j.status)}</span><span class="tag">⏳ ${Math.ceil(j.repairRemaining)}h serviço</span></div></button>`;
 }).join(''):'<div class="empty">🎉 Nenhuma OS aberta. Aproveite para cuidar da equipe e do estoque.</div>';
}
function renderJob(){
 const j=E.job(STATE,UI.selected)||STATE.jobs[0];
 if(!j){el('jobDetail').innerHTML='<div class="empty">Nenhuma OS selecionada.</div>';return}
 UI.selected=j.id;
 const c=E.scenario(DATA,j.scene),m=E.model(DATA,j.modelId),mech=E.employee(STATE,j.assigned);
 const compPath=DATA.paths.find(p=>p.modelId===j.modelId&&p.system===c.path[0]&&p.group===c.path[1]&&p.subgroup===c.path[2]);
 const elapsed=(STATE.tick-j.tickOpen)*8;
 const meta=`<div class="tags"><span class="tag">${esc(j.asset)}</span><span class="tag">${pri(j.priority)}</span><span class="tag">${elapsed}h na carteira</span><span class="tag">${esc(statusName[j.status]||j.status)}</span></div>`;
 let h=`<div class="job-title">${esc(c.title)}</div>${meta}<div class="notice"><b>📻 Relato do operador</b><p>${esc(j.report)}</p></div>`;
 if(j.stage>0){
 const known=[...c.path,c.component,c.damage,c.cause].slice(0,j.stage).map((x,i)=>`<span class="step done">✓ ${STAGES[i]}: ${esc(i<3?([compPath?.systemName,compPath?.groupName,compPath?.subgroupName][i]||x):x)}</span>`);
 h+=`<div class="steps">${known.join('')}</div>`;
 }
 if(!j.assigned){
  const busy=new Set(STATE.jobs.map(x=>x.assigned).filter(Boolean));
  const free=STATE.team.filter(x=>!busy.has(x.id)&&x.restAt!==STATE.tick);
  const bays=[0,1,2].filter(i=>!STATE.jobs.some(x=>x.bay===i));
  h+=`<div class="notice warn"><b>📋 Programação de corretiva</b><p>Selecione profissional e box. Cada mecânico só atende uma ordem por vez. Auxiliar diretamente libera o jogo de identificação nível a nível.</p></div>`;
  if(!free.length||!bays.length){h+=`<div class="empty">Sem ${!free.length?'mecânicos livres':'box disponível'}. Libere uma ordem, descanse ou contrate.</div>`}
  else{
    h+=`<label class="form-label">Mecânico</label><select id="assignMech">${free.map(x=>`<option value="${x.id}">${x.avatar} ${esc(x.name)} · ${x.role} · EN ${Math.round(x.mental)} / EF ${Math.round(x.physical)}</option>`).join('')}</select><label class="form-label">Box disponível</label><select id="assignBay">${bays.map(b=>`<option value="${b}">BOX ${b+1}</option>`).join('')}</select><div class="notice"><label><input type="checkbox" id="assignHelp" checked> 🤝 Vou junto e ajudarei no diagnóstico</label><p class="small">Ajudar consome sua capacidade de gestão, mas permite acertar os seis níveis e dividir o esforço físico.</p></div><div class="action-row"><button class="button primary" data-action="assign" data-id="${j.id}">Alocar equipe e box</button></div>`;
  }
 }else{
  h+=`<div class="notice"><b>${esc(mech?.avatar||'👩‍🔧')} ${esc(mech?.name||'Mecânico')}</b> · BOX ${j.bay+1} · ${j.help?'🤝 Assistido':'🧑‍🔧 Delegado'}<p class="small">Você pode liberar recursos sem apagar o diagnóstico já registrado. A OS retorna à fila.</p><button class="button" data-action="release" data-id="${j.id}">Liberar box e profissional</button></div>`;
  if(!STATE.tools[c.tool])h+=`<div class="notice bad">🔧 <b>Ferramenta ausente:</b> ${esc(DATA.tools[c.tool].name)}. Compre na aba Almoxarifado; o serviço não avança sem ela.</div>`;
  if(j.stage<6){
   h+=`<div class="steps">${STAGES.map((x,i)=>`<span class="step ${i<j.stage?'done':i===j.stage?'current':''}">${i<j.stage?'✓ ':''}${i+1}. ${x}</span>`).join('')}</div>`;
   if(j.help){
    const opts=j.options[j.stage];
    h+=`<div class="notice"><b>🧩 Nível ${j.stage+1}: ${STAGES[j.stage]}</b><p class="small">Você tem <b>${STATE.player.actionsLeft}</b> decisões assistidas por turno. Acertos devolvem energia à dupla; erros provocam retrabalho. Uma inspeção opcional traz evidência para reduzir a incerteza.</p><div class="action-row"><button class="button ghost" data-action="hint" data-id="${j.id}" ${j.hints?.[j.stage]?'disabled':''}>🔍 Solicitar evidência (−4 mental, +0,4h)</button></div>${j.hints?.[j.stage]?`<div class="notice success"><b>🧾 Evidência simulada:</b> ${esc(stageHint(j,c,compPath))}</div>`:''}</div><div class="answer-grid">${opts.map((o,i)=>`<button class="answer" data-action="answer" data-id="${j.id}" data-index="${i}" ${STATE.player.actionsLeft<=0||!STATE.tools[c.tool]?'disabled':''}>${esc(o.label)}${o.id!==o.label?`<div class="small">${esc(o.id)}</div>`:''}</button>`).join('')}</div><div id="quizFeedback" aria-live="polite"></div>`;
   }else h+=`<div class="notice warn">🧠 Diagnóstico delegado: <b>${j.stage}/6</b> níveis. Avance turnos para seu mecânico investigar; especialidade, fadiga e motivação afetam a chance de acerto.</div>`;
  }else{
    const it=DATA.items[c.material];const has=(STATE.stock[c.material]||0)>0;
    h+=`<div class="notice success"><b>✅ Diagnóstico registrado!</b><p>Parte objeto: <b>${esc(c.component)}</b><br>Dano: <b>${esc(c.damage)}</b><br>Causa: <b>${esc(c.cause)}</b></p><p class="small">${esc(c.verification)}</p></div><div class="notice ${has?'':'bad'}"><b>📦 Material:</b> ${esc(it.name)} · ${has?'Disponível para reservar':'Em falta; providencie compra'}.<br><b>🔧 Ferramental:</b> ${esc(DATA.tools[c.tool].name)} · ${STATE.tools[c.tool]?'disponível':'em falta'}.<br><b>⏱️ Reparo restante:</b> ${j.repairRemaining.toFixed(1)} h de esforço simulado.<p class="small">Reparo avança somente ao passar turnos, com peça/ferramenta e equipe alocadas.</p></div>`;
  }
 }
 h+=j.stage===6?`<div class="notice"><b>📋 Aprendizado do caso</b><p class="small">A criticidade, tempos e resultados foram simulados. ${esc(c.lesson)}</p></div>`:`<div class="notice"><b>📋 Orientação técnica</b><p class="small">Não confunda relato do operador com confirmação da causa raiz. Avance pela árvore com base no sintoma; a inspeção simulada e o gabarito aparecem somente após o diagnóstico.</p></div>`;
 el('jobDetail').innerHTML=h;
}
function renderLogs(){el('eventLog').innerHTML=STATE.logs.slice(0,9).map(x=>`<div class="event ${x.kind}"><b>Dia ${x.day} · ${x.shift===0?'A':'B'}</b> — ${esc(x.text)}</div>`).join('')}
function renderTeam(){
 el('managerView').innerHTML=`<div class="notice">Seu trabalho envolve diagnosticar junto, motivar profissionais, contratar e negociar prioridades. <b>A capacidade de gestão também é finita.</b></div>${bar('🧠 Energia mental',STATE.player.mental)}${bar('💪 Energia física',STATE.player.physical,'physical')}<div class="notice"><b>${STATE.player.actionsLeft}</b> ações de diagnóstico assistido restantes neste turno.<p class="small">Uma contratação custa R$1.050 e 18 mental. Conversar com um mecânico custa 12 mental. Ajudar nas correções consome esforço físico próprio.</p></div>`;
 el('teamView').innerHTML=STATE.team.map(m=>`<div class="mechanic"><div class="mechanic-head"><div class="mechanic-meta"><span class="portrait">${m.avatar}</span><div><b>${esc(m.name)}</b><div class="small">${esc(m.role)} · Habilidade ${m.skill}/100</div></div></div><span class="chip">${esc(m.assigned?'Na OS '+m.assigned:m.restAt===STATE.tick?'Descanso':'Disponível')}</span></div>${bar('🧠 Mental',m.mental)}${bar('💪 Física',m.physical,'physical')}${bar('💛 Motivação',m.morale,'morale')}<div class="action-row"><button class="button ghost" data-action="motivate" data-id="${m.id}">💬 Motivar (−12 mental)</button><button class="button" data-action="rest" data-id="${m.id}" ${m.assigned||m.restAt===STATE.tick?'disabled':''}>😴 Descansar</button></div></div>`).join('');
}
function renderStore(){
 const ord=(id)=>STATE.orders.filter(o=>o.item===id);
 el('stockView').innerHTML=Object.entries(DATA.items).map(([id,it])=>{
 const incoming=ord(id).map(o=>`${o.qty} un. / ${Math.max(0,o.eta-STATE.tick)} turno(s)`).join('; ');
 return `<div class="stockline"><div><b>${it.emoji} ${esc(it.name)}</b><div class="small">Saldo: <b>${STATE.stock[id]||0}</b> · R$${it.unit}/un · Prazo ${it.lead*2} turno(s)</div>${incoming?`<div class="small">🚛 A caminho: ${incoming}</div>`:''}</div><button class="button" data-action="order" data-id="${id}" data-qty="1">+1 padrão</button><button class="button ghost" data-action="order" data-id="${id}" data-fast="true" data-qty="1">⚡ Urgente</button></div>`;
 }).join('')+`<p class="small">Pedidos são pagos antecipadamente. Entrega urgente custa 65% a mais e reduz o prazo; há pequena chance simulada de atraso logístico. Estoque é baixado antes do reparo.</p>`;
 el('toolsView').innerHTML=Object.entries(DATA.tools).map(([id,t])=>`<div class="list-line"><div><b>${t.icon} ${esc(t.name)}</b><div class="small">${STATE.tools[id]?'Disponível':'Indisponível'} · Aquisição R$${t.cost}</div></div><button class="button ${STATE.tools[id]?'':'primary'}" data-action="buytool" data-id="${id}" ${STATE.tools[id]?'disabled':''}>${STATE.tools[id]?'✓ Possui':'Comprar'}</button></div>`).join('')+`<div class="notice"><b>Finanças de manutenção</b><p class="small">Receitas por ordem e custos de materiais, salários e ferramentas são fictícios. O jogo demonstra trade-offs, não representa orçamento real de um empreendimento.</p></div>`;
}
function svgChart(values,format){
 if(values.length<2)return '<div class="empty">Avance dois turnos para formar uma tendência.</div>';
 const w=480,h=200,pad=28,min=Math.min(...values),max=Math.max(...values),range=max-min||1;
 const points=values.map((v,i)=>`${pad+(i/(values.length-1))*(w-2*pad)},${h-pad-(v-min)/range*(h-2*pad)}`).join(' ');
 return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Tendência histórica"><line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#b5cabc"/><line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="#b5cabc"/><polyline fill="none" stroke="#5c9277" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" points="${points}"/>${values.map((v,i)=>`<circle cx="${pad+(i/(values.length-1))*(w-2*pad)}" cy="${h-pad-(v-min)/range*(h-2*pad)}" r="3" fill="#c99568"><title>Turno ${i+1}: ${format(v)}</title></circle>`).join('')}<text x="${pad+5}" y="${pad-7}" font-size="13" fill="#516653">Máximo: ${format(max)}</text><text x="${pad+5}" y="${h-7}" font-size="13" fill="#516653">Mínimo: ${format(min)}</text></svg></div>`;
}
function renderIndicators(){
 const k=E.kpis(STATE);
 const tiles=[['Ordens concluídas',k.done],['MTTR simulado',`${k.mttr} h`],['Reparo na 1ª vez',`${k.firstTime}%`],['Backlog atual',k.backlog],['Backlog crítico',k.critical],['Atrasadas (>32h)',k.overdue],['Uso mão de obra',`${k.utilization}%`],['Média idade backlog',`${k.backlogAging} h`],['Bloqueio por material',k.pendingMaterials],['Bloqueio por ferramenta',k.pendingTools],['Rotatividade',k.turnover],['Reputação',`${k.reputation}/100`]];
 el('kpiView').innerHTML=`<div class="kpis">${tiles.map(([n,v])=>`<div class="kpi"><b>${esc(v)}</b><span>${esc(n)}</span></div>`).join('')}</div><div class="notice"><b>Definições:</b> MTTR = tempo corrido, em horas simuladas, da entrada da OS à conclusão (inclui espera); não é tempo técnico de reparo. Utilização = horas atribuídas a serviço / horas disponíveis da equipe, acumuladas. Reparo na primeira vez = conclusão sem erro/retrabalho no minijogo ou diagnóstico delegado. Estes KPIs são didáticos.</div>`;
 const hist=STATE.kpi.slice(-26);
 el('backlogChart').innerHTML=svgChart(hist.map(x=>x.backlog),x=>String(x));
 el('cashChart').innerHTML=svgChart(hist.map(x=>x.cash),brl);
 el('completedTable').innerHTML=STATE.done.length?`<div style="overflow:auto"><table><thead><tr><th>OS</th><th>Equip.</th><th>Tempo</th><th>Reparo 1ª vez</th><th>Receita</th><th>Erros</th></tr></thead><tbody>${STATE.done.slice(0,20).map(j=>`<tr><td>${j.id}</td><td>${esc(E.model(DATA,j.modelId)?.title||'')}</td><td>${j.elapsedHours} h</td><td>${j.firstTime?'Sim':'Não'}</td><td>${brl(j.revenue)}</td><td>${j.wrong}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Ainda não há OS concluídas.</div>';
}
function renderKnowledge(){
 const chapters=[
 ['Lógica de diagnóstico','O relato do operador descreve o sintoma percebido. A árvore de localização é um caminho para classificar o objeto técnico, não prova da causa física. Testes e evidências devem sustentar dano e causa.'],
 ['Triagem e prioridade','A prioridade simulada considera risco de pessoas/ambiente, perda de função e impacto operacional. Segurança prevalece sobre custo, pressão de produção ou pontuação.'],
 ['Fluxo das OS','Entrada → diagnóstico → peça/ferramenta disponíveis → execução → retorno da função → encerramento. O jogo não permite concluir corretiva instantaneamente e registra o tempo parado.'],
 ['Programação de capacidade','Cada mecânico atende uma OS por vez; cada OS ocupa um box enquanto alocada. Liberar o box preserva a investigação e permite reprogramação.'],
 ['Planejamento de materiais','Compra padrão possui lead time; urgência tem prêmio e risco de atraso. A ordem não pode avançar para reparo sem reservar material, mas o diagnóstico pode ser feito antes.'],
 ['Proteção das pessoas','Energia mental/ física e motivação são mecanismos lúdicos. Sobrecarga eleva a chance de retrabalho e rotatividade; apoio e descanso ajudam a preservar capacidade.'],
 ['O que não é modelado','Não há cálculo estrutural, ajuste de torque, parâmetros OEM, autorização de liberação, estoque SAP real, custos financeiros reais nem resultados de inspeções reais.'],
 ['Indicadores','MTTR deste jogo é tempo desde a abertura até o encerramento em horas corridas; utilização e acerto na primeira passagem possuem definições próprias e não substituem KPIs corporativos.'],
 ['Cenários e fonte','A árvore de sistemas, grupos e subgrupos é derivada dos níveis 6, 7 e 8 da estrutura de locais de instalação enviada. Os componentes têm nomenclatura da lista Parte Objeto, e danos/causas dos respectivos catálogos. Os vínculos entre eles são casos roteirizados e simulados.']
 ];
 el('handbook').innerHTML=chapters.map(([n,t],i)=>`<details ${i===0?'open':''}><summary>${esc(n)}</summary><p class="small">${esc(t)}</p></details>`).join('');
 el('dbStats').innerHTML=`<div class="notice">${DATA.scenarios.length} casos técnicos roteirizados · ${DATA.models.length} modelos · ${DATA.paths.length} caminhos técnicos · ${DATA.catalog.parts.length} partes objeto nos roteiros · ${DATA.catalog.damages.length} danos · ${DATA.catalog.causes.length} causas.</div><p class="small">Os identificadores de locais de instalação originais, locais, empresas e números de ativo foram retirados do pacote público. Os casos são derivados didaticamente.</p>`;
 const m=E.model(DATA,UI.dbModel)||DATA.models[0];
 const paths=DATA.paths.filter(p=>p.modelId===m.id);
 const sys=[...new Set(paths.map(p=>p.system))];
 const display=sys.slice(0,14).map(code=>{
  const sub=paths.filter(p=>p.system===code);const gg=[...new Set(sub.map(x=>x.group))];
  return `<details><summary>${esc(sub[0]?.systemName||code)} · ${code} (${gg.length} grupos)</summary>${gg.map(g=>{const subs=sub.filter(x=>x.group===g);return `<div class="list-line"><b>${esc(subs[0]?.groupName||g)} (${g})</b><span class="small">${esc(subs.map(z=>z.subgroupName).slice(0,5).join(', '))}</span></div>`}).join('')}</details>`;
 }).join('');
 el('dbExplorer').innerHTML=`<label class="form-label">Modelo de equipamento</label><select id="dbModelSelect">${DATA.models.map(x=>`<option value="${x.id}" ${x.id===m.id?'selected':''}>${esc(x.title)}</option>`).join('')}</select><div>${display}</div>`;
}
boot();
