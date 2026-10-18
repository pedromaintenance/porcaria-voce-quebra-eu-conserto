/* P.O.R.C.A.R.I.A. v1.3 — turno de 12h, 10,5 HH úteis e meta de produtividade. */
(function(root,factory){
  const E=factory(); if(typeof module!=='undefined'&&module.exports)module.exports=E; root.PORCARIA_ENGINE=E;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const ROLES=[
    ['Hidráulica','hidraulica'],['Motores','motor'],['Elétrica','eletrica'],
    ['Rodante','rodante'],['Perfuratrizes','perfuracao'],['Soldagem','solda'],['Multidisciplinar','geral']
  ];
  // Identidades oficiais do jogo; contratações futuras são genéricas até receberem arte.
  const INITIAL_TEAM=Object.freeze([
    {name:'Costa',avatar:'⚡',role:'eletrica',specialty:'Eletricista',sprite:'costa'},
    {name:'Pedro',avatar:'🧯',role:'geral',specialty:'Brigadista',sprite:'pedro'},
    {name:'Geovane',avatar:'📋',role:'geral',specialty:'Instrutor',sprite:'geovane'},
    {name:'Silva',avatar:'🔨',role:'geral',specialty:'Mecânico',sprite:'silva'},
    {name:'Santos',avatar:'🔧',role:'geral',specialty:'Mecânico',sprite:'santos'},
    {name:'Moura',avatar:'🛠️',role:'geral',specialty:'Mecânico',sprite:'moura'}
  ]);
  const clamp=(v,l=0,h=100)=>Math.min(h,Math.max(l,Math.round(v*10)/10));
  const SHIFT_HOURS=12, DDS_HOURS=0.5, MEAL_HOURS=1;
  const EFFECTIVE_HOURS=SHIFT_HOURS-DDS_HOURS-MEAL_HOURS;
  const DEFAULT_PRODUCTIVITY_TARGET=60;
  function productivityProfile(value){
    const raw=Number(value);
    const target=Number.isFinite(raw)?Math.min(100,Math.max(20,raw)):DEFAULT_PRODUCTIVITY_TARGET;
    const above=Math.max(0,(target-60)/40),below=Math.max(0,(60-target)/40);
    // Curva de pressão simulada, não representa fisiologia humana nem uma norma técnica.
    const fatigueMultiplier=1+4*Math.expm1(3*above)/Math.expm1(3);
    return {target,
      speed:target>=60?1+0.20*above:1-0.25*below,
      fatigueMultiplier,
      moraleLossPerHour:1.25*below*below};
  }
  function setProductivityTarget(s,target){
    const n=Number(target);
    if(!Number.isFinite(n)||n<20||n>100)return 'A meta deve estar entre 20 e 100.';
    s.productivityTarget=Math.round(n);
    msg(s,'Meta de produtividade ajustada para '+s.productivityTarget+'/100.');
    return null;
  }
  function applyWorkPressure(s,m,hours,profile){
    const hh=Math.min(EFFECTIVE_HOURS,Math.max(0,Number(hours)||0));
    if(!hh)return;
    mentalCost(s,m,hh*0.35*profile.fatigueMultiplier);
    physicalCost(s,m,hh*0.80*profile.fatigueMultiplier);
    if(profile.moraleLossPerHour)m.morale=clamp(m.morale-hh*profile.moraleLossPerHour);
  }
  const rnd=(rng=Math.random)=>rng();
  const one=(a,rng)=>a[Math.floor(rnd(rng)*a.length)];
  const mix=(a,rng)=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rnd(rng)*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const msg=(s,t,kind='info')=>{s.logs.unshift({day:s.day,shift:s.shift,text:t,kind});s.logs=s.logs.slice(0,65)};
  const model=(d,id)=>d.models.find(x=>x.id===id);
  const scenario=(d,id)=>d.scenarios.find(x=>x.id===id);
  const employee=(s,id)=>s.team.find(x=>x.id===id);
  const job=(s,id)=>s.jobs.find(x=>x.id===id);
  const timeLabel=(s)=>`Dia ${s.day} • ${s.shift===0?'Turno A (dia)':'Turno B (noite)'} · 12h`;
  function newMechanic(s,rng,identity=null){
    const profile=identity||{name:'Mecânico',avatar:'🔧',role:one(ROLES,rng)[1],specialty:'Mecânico',sprite:null};
    const m={id:`M${s.nextPerson++}`,name:profile.name,avatar:profile.avatar,role:profile.role,
      specialty:profile.specialty,sprite:profile.sprite,
      skill:Math.round(54+rnd(rng)*35),mental:Math.round(72+rnd(rng)*25),
      physical:Math.round(70+rnd(rng)*27),morale:Math.round(74+rnd(rng)*20),
      assigned:null,restAt:null,completed:0,tenure:0};return m;
  }
  function normalizeRoster(s){
    // Migração da v0.8.16: não sobrescrever contratações genéricas antigas.
    // Só M1–M3 são identidades históricas reservadas; os três novos recebem
    // IDs novos se M4/M5/... já pertencem a Mecânicos contratados.
    if(!s||!Array.isArray(s.team))return s;
    const jobs=Array.isArray(s.jobs)?s.jobs:[];
    // O quarto profissional inicial legado (Nico) pode ser descartado se ocioso,
    // mas uma OS atribuída a ele deve ser preservada.
    s.team=s.team.filter(m=>m.id!=='M4'||m.name!=='Nico'
      ||!!m.assigned||jobs.some(j=>j.assigned===m.id));
    let maxId=0;
    const canonical=new Map(INITIAL_TEAM.slice(0,3).map((identity,i)=>['M'+(i+1),identity]));
    const newProfiles=INITIAL_TEAM.slice(3);
    for(const m of s.team){
      const match=typeof m.id==='string'&&/^M[0-9]+$/.test(m.id)?Number(m.id.slice(1)):0;
      maxId=Math.max(maxId,match);
      const initial=canonical.get(m.id);
      // Reconciliar nomes anteriores sem perder experiência, status nem OS.
      const defined=initial||newProfiles.find(p=>m.sprite===p.sprite||m.name===p.name);
      if(defined){
        m.name=defined.name;m.avatar=defined.avatar;m.specialty=defined.specialty;
        m.role=defined.role;m.sprite=defined.sprite;
      }else{
        m.name='Mecânico';m.avatar='🔧';m.specialty='Mecânico';m.sprite=null;
        // Não sobrescrever m.role: a especialidade sorteada pelo contrato importa.
      }
    }
    s.nextPerson=Math.max(1,Number.isInteger(s.nextPerson)?s.nextPerson:1,maxId+1);
    const present=new Set(s.team.map(m=>m.sprite).filter(Boolean));
    // Determinístico para evitar alterações aleatórias entre imports do mesmo save.
    const rng=mulberry32((0x08160000+s.nextPerson+s.team.length*37)>>>0);
    for(const profile of newProfiles){
      if(!present.has(profile.sprite)){
        s.team.push(newMechanic(s,rng,profile));
        present.add(profile.sprite);
      }
    }
    return s;
  }
  function options(d,sc,seed){
    const rng=mulberry32(seed);
    const path=d.paths.filter(p=>p.modelId===sc.modelId);
    const sameSys=path.filter(p=>p.system===sc.path[0]);
    const sameGroup=sameSys.filter(p=>p.group===sc.path[1]);
    const names={
      0:{good:sc.path[0],props:['system','systemName'],pool:path},
      1:{good:sc.path[1],props:['group','groupName'],pool:sameSys.length?sameSys:path},
      2:{good:sc.path[2],props:['subgroup','subgroupName'],pool:sameGroup.length?sameGroup:path}
    };
    const stages=[];
    for(let i=0;i<3;i++){
      const def=names[i];const map=new Map();
      for(const r of [...def.pool,...path]){const code=r[def.props[0]],label=r[def.props[1]];if(code&&!map.has(code))map.set(code,label)}
      const good=map.get(def.good)||def.good;
      const pool=[...map].filter(([c])=>c!==def.good).map(([id,label])=>({id,label}));
      stages.push(mix([{id:def.good,label:good},...mix(pool,rng).slice(0,3)],rng));
    }
    function list(good,arr,max){return mix([{id:good,label:good},...mix([...new Set(arr)].filter(x=>x!==good),rng).slice(0,max-1).map(x=>({id:x,label:x}))],rng)}
    const parts=d.catalog.parts;stages.push(list(sc.component,parts,4));
    const dm=d.catalog.damages.find(x=>x.pt===sc.damage);
    stages.push(list(sc.damage,d.catalog.damages.filter(x=>x.groupPt===dm?.groupPt).map(x=>x.pt),4));
    const ca=d.catalog.causes.find(x=>x.pt===sc.cause);
    stages.push(list(sc.cause,d.catalog.causes.filter(x=>x.groupPt===ca?.groupPt).map(x=>x.pt),4));
    return stages;
  }
  function mulberry32(seed){return ()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
  function create(data,rng=Math.random){
    const s={version:'1.1.0',day:1,shift:0,tick:0,cash:15800,reputation:86,xp:0,productivityTarget:DEFAULT_PRODUCTIVITY_TARGET,
      player:{mental:86,physical:84,actionsLeft:3},
      team:[],jobs:[],done:[],orders:[],stock:{},tools:{},nextJob:1,nextPerson:1,nextPO:1,
      logs:[],kpi:[],lastUtilization:0,metrics:{hours:0,productive:0,wages:0,outsourced:0,incidents:0,safety:0},
      bays:3,closed:false};
    for(const [id,v] of Object.entries(data.items))s.stock[id]=v.initial;
    for(const [id,v] of Object.entries(data.tools))s.tools[id]=v.initial;
    INITIAL_TEAM.forEach(profile=>s.team.push(newMechanic(s,rng,profile)));
    spawn(s,data,3,rng);
    msg(s,'Oficina aberta! Separe os boxes, inspecione a fila e não condene uma peça sem diagnóstico.','ok');
    return s;
  }
  function spawn(s,d,n,rng=Math.random){
    let made=0;
    const existing=new Set(s.jobs.map(j=>j.asset));
    for(let i=0;i<n;i++){
      const pool=d.scenarios.filter(c=>{
        const m=model(d,c.modelId);if(!m)return false;
        return [...Array(6)].some((_,x)=>!existing.has(`${c.modelId}·${String(x+1).padStart(2,'0')}`));
      });
      if(!pool.length)break;
      const c=one(pool,rng),m=model(d,c.modelId);
      const fleet=Array.from({length:6},(_,k)=>`${c.modelId}·${String(k+1).padStart(2,'0')}`);
      const asset=one(fleet.filter(x=>!existing.has(x)),rng);existing.add(asset);
      const severity=c.priority;
      const j={id:`OS${String(s.nextJob++).padStart(4,'0')}`,scene:c.id,asset,modelId:c.modelId,
        title:c.title,report:c.operator,dayOpen:s.day,tickOpen:s.tick,priority:severity,
        status:'fila',assigned:null,bay:null,help:false,stage:0,hints:{},diagnosticLog:[],
        diagTarget:c.diagHours*2,diagRemaining:c.diagHours*2,
        repairTarget:c.hours,repairRemaining:c.hours,
        options:options(d,c,Math.floor(rnd(rng)*2**30)),wrong:0,rework:false,
        materialUsed:false,worked:0,toolWait:0,blockedShifts:0,notes:[],scheduleShift:null,
        costLabor:0,reworkHours:0};
      s.jobs.push(j);made++;
    }
    if(made)msg(s,`${made} ocorrência(s) chegaram com relatos dos operadores.`);
    return made;
  }
  function attach(s,id,mid,bay,help){
    const j=job(s,id),m=employee(s,mid);
    if(!j||!m)return 'Serviço ou mecânico não encontrado.';
    if(m.assigned && m.assigned!==id)return 'Esse mecânico já está alocado.';
    if(m.restAt===s.tick)return 'Esse mecânico está descansando neste turno.';
    if(j.assigned && j.assigned!==mid)return 'A ordem já está atribuída. Libere a equipe antes de alterar.';
    if(j.bay!==null && j.bay!==bay)return 'A OS já ocupa outro box.';
    if(!Number.isInteger(bay)||bay<0||bay>=s.bays)return 'Box inválido.';
    if(s.jobs.some(a=>a.id!==id && a.bay===bay))return 'Esse box está ocupado.';
    j.assigned=mid;j.bay=bay;j.help=!!help;m.assigned=id;j.scheduleShift ??= s.tick;
    j.status=j.stage<6?'diagnostico':'apto';
    msg(s,`${m.name} assumiu ${id} no box ${bay+1}${help?' com apoio da chefia':''}.`,'ok');return null;
  }
  function release(s,id){
    const j=job(s,id);if(!j)return 'OS não encontrada.';
    if(j.assigned){const m=employee(s,j.assigned);if(m)m.assigned=null}
    j.assigned=null;j.bay=null;j.help=false;j.status=j.stage<6?'fila': 'apto';
    msg(s,`Equipe e box liberados da ${id}. A investigação permanece registrada.`);return null;
  }
  function mentalCost(s,mech,cost){mech.mental=clamp(mech.mental-cost);if(mech.mental<25)mech.morale=clamp(mech.morale-4)}
  function physicalCost(s,mech,cost){mech.physical=clamp(mech.physical-cost);if(mech.physical<25)mech.morale=clamp(mech.morale-4)}
  // Registro exclusivamente de fatos observados pelo jogador/mecânico.
  // A etapa ainda em análise NUNCA recebe a resposta correta antecipadamente.
  function diagnosticEvent(s,j,stage,outcome,source,m,value){
    if(!Array.isArray(j.diagnosticLog))j.diagnosticLog=[];
    const evidence={tick:s.tick,stage,outcome,source,mechanicId:m?.id||null,
      mechanicName:m?.name||null,value:String(value||'')};
    j.diagnosticLog.push(evidence);
    return evidence;
  }
  function diagnosticLabel(j,stage,code){
    return j.options?.[stage]?.find(option=>option.id===code)?.label||String(code||'');
  }
  function answer(s,d,id,chosen){
    const j=job(s,id);if(!j||!j.assigned||!j.help)return {error:'O diagnóstico assistido exige mecânico e box alocados.'};
    if(j.stage>=6)return {error:'Diagnóstico já concluído.'};
    if(!haveTool(s,scenario(d,j.scene)))return {error:'É necessário comprar o ferramental para confirmar a etapa do diagnóstico.'};
    if(s.player.actionsLeft<=0)return {error:'Sua capacidade de apoio acabou neste turno. Avance o turno.'};
    const m=employee(s,j.assigned), sc=scenario(d,j.scene);
    if(!m)return {error:'Mecânico indisponível.'};
    s.player.actionsLeft--;
    const currentStage=j.stage;
    const correct=[...sc.path,sc.component,sc.damage,sc.cause][currentStage];
    const ok=chosen===correct;
    if(ok){
      diagnosticEvent(s,j,currentStage,'confirmed','player',m,diagnosticLabel(j,currentStage,chosen));
      j.stage++; j.diagRemaining=clamp(j.diagRemaining-1,0,10000);
      m.mental=clamp(m.mental+4);m.physical=clamp(m.physical+3);m.morale=clamp(m.morale+2);
      s.player.mental=clamp(s.player.mental+3);s.player.physical=clamp(s.player.physical+2);
      msg(s,`Boa investigação na ${id}: etapa ${j.stage}/6 confirmada. Dupla recuperou energia.`,'ok');
      if(j.stage===6){j.status='apto';j.diagRemaining=0;msg(s,`${id}: diagnóstico confirmado. Providencie peças e ferramentas para a corretiva.`,'ok')}
    }else{
      diagnosticEvent(s,j,currentStage,'rejected','player',m,diagnosticLabel(j,currentStage,chosen));
      j.wrong++;j.diagRemaining+=0.5;j.reworkHours+=0.5;
      m.mental=clamp(m.mental-8);m.physical=clamp(m.physical-3);m.morale=clamp(m.morale-5);
      s.player.mental=clamp(s.player.mental-9);s.player.physical=clamp(s.player.physical-3);
      s.cash=Math.max(0,s.cash-25);
      msg(s,`${id}: hipótese incorreta; retrabalho, desgaste e R$25 de custo adicional.`,'bad');
    }
    return {ok,correct};
  }
  function hint(s,d,id){
    const j=job(s,id);if(!j||!j.assigned||!j.help)return 'Para solicitar uma evidência, acompanhe a OS com um mecânico.';
    if(j.stage>=6)return 'Diagnóstico já está concluído.';
    if(!haveTool(s,scenario(d,j.scene)))return 'A inspeção exige o ferramental indicado.';
    if(j.hints?.[j.stage])return 'A evidência desta etapa já foi solicitada.';
    if(s.player.mental<4)return 'O gestor não tem energia mental suficiente para coordenar o teste.';
    const m=employee(s,j.assigned);if(!m)return 'Mecânico não encontrado.';
    j.hints=j.hints||{};j.hints[j.stage]=true;j.diagRemaining+=0.4;
    // A inspeção registra somente a solicitação, nunca a resposta correta.
    // O quadro didático oferece procedimento orientativo sem revelar a hipótese.
    const stage=j.stage;
    diagnosticEvent(s,j,stage,'evidence','player',m,'Inspeção orientativa solicitada');
    s.player.mental=clamp(s.player.mental-4);m.mental=clamp(m.mental-1);
    msg(s,`Inspeção adicional na ${id}: −4 mental da chefia, +0,4h de investigação.`);
    return null;
  }
  function buyTool(s,d,id){
    const t=d.tools[id];if(!t)return 'Ferramenta não encontrada.';
    if(s.tools[id])return 'Já há uma ferramenta dessas na oficina.';
    if(s.cash<t.cost)return 'Caixa insuficiente.';
    s.cash-=t.cost;s.tools[id]=true;msg(s,`Ferramenta adquirida: ${t.name} (-R$${t.cost}).`,'ok');return null;
  }
  function orderMaterial(s,d,id,qty=1,fast=false,rng=Math.random){
    const it=d.items[id];qty=Number(qty);
    if(!it||!Number.isInteger(qty)||qty<1||qty>15)return 'Pedido inválido.';
    const unit=Math.round(it.unit*(fast?1.65:1));const cost=unit*qty;
    if(s.cash<cost)return 'Caixa insuficiente para essa compra.';
    s.cash-=cost;
    const lead=fast?Math.max(1,Math.ceil(it.lead/2)):it.lead*2;
    const delay= rnd(rng)<0.18?1:0;
    const po={id:`PC${String(s.nextPO++).padStart(3,'0')}`,item:id,qty,paid:cost,eta:s.tick+lead+delay,fast};s.orders.push(po);
    msg(s,`Pedido ${po.id}: ${qty} × ${it.name}; previsão turno +${lead+delay} (${fast?'urgente':'normal'}).`,'info');return null;
  }
  function motivate(s,id){const m=employee(s,id);if(!m)return 'Mecânico inexistente.';
    if(s.player.mental<12)return 'Energia mental insuficiente para orientar a equipe.';
    s.player.mental=clamp(s.player.mental-12);m.morale=clamp(m.morale+20);m.mental=clamp(m.mental+4);
    msg(s,`Conversa com ${m.name}: motivação e clareza recuperadas.`, 'ok');return null;
  }
  function rest(s,id){const m=employee(s,id);if(!m)return 'Mecânico inexistente.';
    if(m.assigned)return 'Libere a OS antes de conceder descanso.';
    if(m.restAt===s.tick)return 'Descanso já programado neste turno.';
    m.restAt=s.tick;msg(s,`${m.name} foi liberado para descanso neste turno.`);return null;
  }
  function hire(s,rng=Math.random){if(s.team.length>=9)return 'Lotação máxima de 9 mecânicos.';
    if(s.cash<1050)return 'São necessários R$1.050 para integração e contratação.';
    if(s.player.mental<18)return 'Contratação exige 18 de energia mental.';
    s.cash-=1050;s.player.mental=clamp(s.player.mental-18);
    const m=newMechanic(s,rng);s.team.push(m);msg(s,`${m.name} chegou! Especialidade: ${m.role}. (-R$1.050, -18 mental)`,'ok');return null;
  }
  function isMaterialReady(s,c){return (s.stock[c.material]||0)>0}
  function haveTool(s,c){return !!s.tools[c.tool]}
  function enterRepair(s,j,d){
    if(j.stage<6)return false;
    const c=scenario(d,j.scene);
    if(!haveTool(s,c)){j.status='ferramenta';j.toolWait++;return false}
    if(!j.materialUsed){
      if(!isMaterialReady(s,c)){j.status='material';j.blockedShifts++;return false}
      s.stock[c.material]--;j.materialUsed=true;msg(s,`${j.id}: ${d.items[c.material].name} reservado e baixado do estoque.`,'ok');
    }
    j.status='reparo';return true;
  }
  function complete(s,j,d,m){
    const c=scenario(d,j.scene);
    j.status='concluida';j.finishedTick=s.tick+1;
    const elapsed=(j.finishedTick-j.tickOpen)*SHIFT_HOURS;
    const firstTime=j.wrong===0 && !j.rework;
    const base= c.priority===3?2350:c.priority===2?1480:920;
    const income=Math.round(base*(firstTime?1:0.82));s.cash+=income;
    s.xp+=firstTime?55:28;s.reputation=clamp(s.reputation+(firstTime?2:1));m.morale=clamp(m.morale+8);m.completed++;
    s.metrics.incidents++;
    s.done.unshift({...j,elapsedHours:elapsed,revenue:income,firstTime,materialCost:d.items[c.material].unit});s.done=s.done.slice(0,200);
    s.jobs=s.jobs.filter(x=>x.id!==j.id);
    m.assigned=null;
    msg(s,`${j.id} concluída: ${c.title}. ${elapsed} h corridas, receita fictícia R$${income}.`,'ok');
  }
  function advance(s,d,rng=Math.random){
    let hours=0;let completed=0;let blocks=0;
    const pressure=productivityProfile(s.productivityTarget);
    const availableCrew=s.team.filter(m=>m.restAt!==s.tick).length;
    const operating=[...s.jobs];
    for(const j of operating){
      if(!j.assigned)continue;
      const m=employee(s,j.assigned), c=scenario(d,j.scene);
      if(!m){j.assigned=null;j.bay=null;continue}
      if(!haveTool(s,c)){j.status='ferramenta';j.toolWait++;blocks++;continue}
      if(j.stage<6){
        j.status='diagnostico';
        const baseAttempts=j.help?1:Math.max(1,Math.min(3,1+Math.floor((m.skill-48)/23)));
        const n=j.help?1:Math.max(1,Math.min(6,Math.round(baseAttempts*pressure.speed)));
        let spent=0;
        for(let k=0;k<n && j.stage<6;k++){
          const successChance=clamp(0.66+(m.skill-50)/170+(m.role===c.category?0.15:0)-(m.mental<20?0.3:0)-(m.morale<25?0.2:0),0.23,0.97);
          const ok=rnd(rng)<successChance;
          if(ok){
            const stage=j.stage,answer=[...c.path,c.component,c.damage,c.cause][stage];
            diagnosticEvent(s,j,stage,'confirmed','mechanic',m,diagnosticLabel(j,stage,answer));
            j.stage++;j.diagRemaining=clamp(j.diagRemaining-1,0,10000);
          }else{
            diagnosticEvent(s,j,j.stage,'inconclusive','mechanic',m,'Hipótese não confirmada durante o turno');
            j.wrong++;j.rework=true;j.reworkHours++;j.diagRemaining+=1;mentalCost(s,m,4);m.morale=clamp(m.morale-3);
          }
          spent+=1;
        }
        applyWorkPressure(s,m,spent,pressure);
        if(j.help){s.player.mental=clamp(s.player.mental-3);s.player.physical=clamp(s.player.physical-1);}
        j.worked+=spent;j.costLabor+=spent*24;hours+=spent;
        if(j.stage>=6){j.diagRemaining=0;j.status='apto';msg(s,`${j.id}: diagnóstico fechou. Peças e ferramental devem estar disponíveis.`,'ok')}
        continue;
      }
      if(!enterRepair(s,j,d)){blocks++;continue}
      const special=m.role===c.category?1.18:m.role==='geral'?1.02:0.9;
      const fatigue=m.physical<25||m.mental<20?0.62:1;
      const help=j.help?1.28:1;
      const throughput=special*fatigue*help*pressure.speed;
      const prod=EFFECTIVE_HOURS*throughput;
      const remaining=j.repairRemaining;const used=Math.min(remaining,prod);
      const workedHH=Math.min(EFFECTIVE_HOURS,used/Math.max(0.01,throughput));
      j.repairRemaining=Math.max(0,Math.round((remaining-used)*10)/10);
      j.worked+=workedHH;j.costLabor+=workedHH*42;hours+=workedHH;
      applyWorkPressure(s,m,workedHH,pressure);
      if(j.help){s.player.physical=clamp(s.player.physical-4);s.player.mental=clamp(s.player.mental-1.5);}
      if(j.repairRemaining<=0.01){complete(s,j,d,m);completed++}
    }
    // Rest is taken during the shift just completed.
    for(const m of s.team){
      if(m.restAt===s.tick){m.mental=clamp(m.mental+17);m.physical=clamp(m.physical+20);m.morale=clamp(m.morale+5);m.restAt=null}
      if(m.mental<24||m.physical<24)m.morale=clamp(m.morale-6);
    }
    const nominalHH=availableCrew*EFFECTIVE_HOURS;
    s.metrics.hours+=nominalHH;s.metrics.productive+=hours;
    s.lastUtilization=nominalHH?Math.min(100,Math.round(hours/nominalHH*100)):0;
    s.tick++;
    const received=s.orders.filter(o=>o.eta<=s.tick);
    for(const o of received){s.stock[o.item]=(s.stock[o.item]||0)+o.qty;msg(s,`Pedido ${o.id} recebido: ${o.qty} × ${d.items[o.item].name}.`,'ok')}
    s.orders=s.orders.filter(o=>o.eta>s.tick);
    for(const j of s.jobs)if(j.tickOpen<s.tick)j.blockedShifts += (j.status==='material' || j.status==='ferramenta')?1:0;
    if(s.shift===0){s.shift=1;s.player.mental=clamp(s.player.mental+5);s.player.physical=clamp(s.player.physical+4);}
    else{
      s.shift=0;s.day++;
      const wages=s.team.length*220+180; s.cash-=wages;s.metrics.wages+=wages;
      s.player.mental=clamp(s.player.mental+16);s.player.physical=clamp(s.player.physical+18);
      for(const m of [...s.team]){
        m.tenure++;m.mental=clamp(m.mental+17);m.physical=clamp(m.physical+20);
        if(m.mental>58&&m.physical>58)m.morale=clamp(m.morale+3);
        if(m.morale<20&&rnd(rng)<0.38){s.team=s.team.filter(x=>x.id!==m.id);
          for(const j of s.jobs){if(j.assigned===m.id){j.assigned=null;j.bay=null;j.help=false;j.status=j.stage>=6?'apto':'fila';}}
          msg(s,`${m.name} pediu demissão por exaustão e desmotivação!`,'bad');s.reputation=clamp(s.reputation-4);
        }
      }
      // overdue safety risk for critical jobs, not a substitute for formal risk analysis.
      const overdue=s.jobs.filter(j=>j.priority===3 && s.tick-j.tickOpen>5).length;
      if(overdue){const pen=Math.min(6,overdue);s.reputation=clamp(s.reputation-pen);msg(s,`${overdue} corretiva(s) críticas envelhecidas: reputação de entrega -${pen}.`,'bad')}
      const newcomers=Math.min(5,1+Math.floor((s.day-1)/6)+(rnd(rng)<0.35?1:0));
      const freeCapacity=Math.max(0,32-s.jobs.length);
      spawn(s,d,Math.min(newcomers,freeCapacity),rng);
      msg(s,`Fechamento: folha e estrutura R$${wages}. Mais ${Math.min(newcomers,freeCapacity)} novas ocorrências previstas.`, 'info');
      if(s.cash<0)msg(s,'Atenção financeira: caixa negativo. Planeje aquisições, produtividade e contratos antes de novos investimentos.','bad');
    }
    s.player.actionsLeft=3;
    const rec={tick:s.tick,day:s.day,shift:s.shift,cash:Math.round(s.cash),backlog:s.jobs.length,
      overdue:s.jobs.filter(j=>s.tick-j.tickOpen>4).length,completed:completed,utilization:s.lastUtilization,
      morale:Math.round(s.team.reduce((a,m)=>a+m.morale,0)/Math.max(s.team.length,1)),reputation:s.reputation};
    s.kpi.push(rec);s.kpi=s.kpi.slice(-80);
    if(s.day>=21&&!s.closed){s.closed=true;msg(s,'Dia 21: ciclo de gestão concluído. Você pode continuar livremente ou analisar os indicadores.','ok')}
    return {hours,completed,blocks};
  }
  function kpis(s){
    const completed=s.done.length;
    const mean=completed?Math.round(s.done.reduce((a,j)=>a+j.elapsedHours,0)/completed*10)/10:0;
    const fix=completed?Math.round(s.done.filter(j=>j.firstTime).length/completed*100):0;
    const critical=s.jobs.filter(j=>j.priority===3).length;
    const overdue=s.jobs.filter(j=>s.tick-j.tickOpen>4).length;
    const rate=s.metrics.hours?Math.min(100,Math.round(s.metrics.productive/s.metrics.hours*100)):0;
    return {done:completed,mttr:mean,firstTime:fix,backlog:s.jobs.length,critical,overdue,
      backlogAging:s.jobs.length?Math.round(s.jobs.reduce((a,j)=>a+s.tick-j.tickOpen,0)/s.jobs.length*SHIFT_HOURS):0,
      utilization:rate,workshopCash:Math.round(s.cash),reputation:s.reputation,turnover:Math.max(0,s.nextPerson-1-s.team.length),
      pendingMaterials:s.jobs.filter(j=>j.status==='material').length, pendingTools:s.jobs.filter(j=>j.status==='ferramenta').length};
  }
  function validate(s){return s&&s.version==='1.1.0'&&Number.isFinite(s.cash)&&Array.isArray(s.team)&&Array.isArray(s.jobs)&&Array.isArray(s.orders)&&s.player&&s.stock&&s.tools&&Array.isArray(s.done)}
  return {create,normalizeRoster,spawn,attach,release,answer,hint,buyTool,orderMaterial,motivate,rest,hire,advance,kpis,validate,
    SHIFT_HOURS,DDS_HOURS,MEAL_HOURS,EFFECTIVE_HOURS,DEFAULT_PRODUCTIVITY_TARGET,productivityProfile,setProductivityTarget,
    model,scenario,employee,job,options,one,mix,mulberry32,timeLabel};
});
