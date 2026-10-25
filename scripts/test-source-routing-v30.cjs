/* P.O.R.C.A.R.I.A. — Ciclo 30: motivos PCM e rotas de diagnóstico. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js');
const I=require('../phaser-play/inspection.js'),M=require('../phaser-play/monitoring.js');
const V=require('../phaser-play/inspection-view.js'),S=require('../phaser-play/sector-views.js');
const cat=M.CATALOG,scene=id=>D.scenarios.find(sc=>sc.id===id);
const oils=D.scenarios.filter(sc=>sc.fmeaSource?.layer==='oil/diagnostic-records.json');
assert.ok(oils.length>=10,'cenários importados do laboratório presentes');
assert.ok(oils.every(sc=>I.isOilScenario(sc)&&!I.inspectionEligible(sc)),'todos os laudos fora da inspeção');
assert.equal(I.inspectionEligible(scene('INC050')),true,'alerta eletrônico ativo na inspeção');
assert.equal(I.activeFault(scene('INC050')).codeState,'ativo');
assert.equal(I.inspectionEligible(scene('INC046')),false,'registros sem estado ativo excluídos');
assert.equal(I.inspectionEligible(scene('INC041')),false,'laudo de óleo não é achado de campo');
const s=E.create(D,()=>0.42);I.normalized(s);
const plan=I.plan(s,D);
assert.ok(plan.length>0&&plan.every(x=>I.inspectionEligible(scene(x.scene))),'ronda automática só seleciona fontes compatíveis');
const legacy={id:'IN9999',tick:s.tick,scene:'INC041',status:'pending',asset:'EQ01·06',modelId:'EQ01',ordinal:0};
s.inspections.push(legacy);
assert.ok(I.inspect(s,D,legacy.id).error,'save legado não permite executar laudo como ronda');
assert.equal(legacy.status,'pending','não modificar inspeção legada');
const n={id:'NM9998',inspectionId:plan[0].id,asset:plan[0].asset,modelId:plan[0].modelId,
 origin:'inspecao_sensitiva_simulada',openedTick:s.tick,status:'aguarda_revisao_pcm',
 sourceScenario:plan[0].scene,description:'Observação de anomalia durante inspeção.',priority:'media'};
s.notifications.push(n);
assert.ok(I.review(s,n.id,'return',{reason:''}).error,'seleção vazia não vale');
assert.equal(I.review(s,n.id,'return',{reason:'insuficiente'}).status,'devolvida');
assert.equal(n.reviewReason,I.RETURN_REASONS.insuficiente,'texto do menu vira justificativa');
assert.equal(n.reviewHistory.at(-1).reason,I.RETURN_REASONS.insuficiente,'auditoria mantém justificativa');
n.status='aguarda_revisao_pcm';
assert.equal(I.review(s,n.id,'archive',{reason:'duplicada'}).status,'arquivada_pcm');
assert.equal(n.reviewReason,I.ARCHIVE_REASONS.duplicada);
const registered=cat.byCategory('faults').find(p=>p.codeState==='registrado');
const active=cat.byCategory('faults').find(p=>p.codeState==='ativo'&&p.escalationScenario==='INC050');
assert.ok(registered&&active);
s.notifications.push({id:'NM9980',monitorOnly:true,monitorCategory:'faults',
 monitorProtocol:registered.id,asset:'EQ03·01',openedTick:s.tick,status:'monitorando',monitoring:{status:'programado',samples:[]}});
s.inspections.push({id:'IN9977',scene:'INC050',asset:'EQ03·04',modelId:'EQ03',
 tick:s.tick,inspectedTick:s.tick,status:'finding',kind:'field_selected',observed:'Aviso eletrônico ativo durante inspeção.'});
s.jobs.push({id:'OS9990',scene:'INC050',asset:'EQ03·02',modelId:'EQ03',source:'radio',tickOpen:s.tick,priority:2,report:'Aviso ativo no rádio.'});
const h=S.faultHistory(s,D,I,cat);
assert.ok(h.some(x=>x.source==='Monitoramento'&&x.state==='registrado'),'histórico de evento registrado visível');
assert.ok(h.some(x=>x.source==='Inspeção'&&x.state==='ativo'),'alerta ativo detectado em campo');
assert.ok(h.some(x=>x.source==='Rádio / OS'&&x.state==='ativo'),'alerta ativo vindo do rádio');
assert.ok(h.every(x=>x.code===null||typeof x.code==='string'),'não fabricar identificação OEM');
const legacyOil={id:'NM9979',status:'aguarda_revisao_pcm',origin:'inspecao_sensitiva_simulada',sourceScenario:'INC041',
 inspectionId:'IN9975',openedTick:s.tick,asset:'EQ01·05',modelId:'EQ01',description:'Laudo de óleo antigo no save.',priority:'baixa'};
s.notifications.push(legacyOil);
const field=S.inspections(s,D,I,E);
assert.ok(!field.includes('Laudo de óleo antigo no save.'),'laudo ausente na tela de inspeção');
assert.ok(!field.includes('HISTÓRICO DE CÓDIGOS DE FALHA'),'histórico não aparece na inspeção');
const pcm=S.planning(s,D,I,E,V);
assert.ok(pcm.includes('HISTÓRICO DE CÓDIGOS DE FALHA'),'PCM mostra histórico eletrônico');
assert.ok(!pcm.includes('Laudo de óleo antigo no save.'),'laudo legado não entra na carteira PCM');
const monitor=S.monitoring(s,D,M,V,I,E,'oil');
assert.ok(monitor.includes('Laudo de óleo antigo no save.'),'legado continua consultável no monitoramento');
const faults=S.monitoring(s,D,M,V,I,E,'faults');
assert.ok(faults.includes('REGISTRADO / HISTÓRICO'),'monitoramento mostra registro não ativo');
assert.ok(!V.render(s,D,I,E,null,M).includes('Laudo de óleo antigo no save.'),'visão antiga não vaza laudo');
const js=fs.readFileSync('phaser-play/game.js','utf8');
assert.ok(js.includes('ALERTA ATIVO')&&js.includes('CÓDIGO DE FALHA ATIVO'),'rádio mostra alertas ativos');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(sw.includes('source0932'),'PWA versionado');
console.log('OK Ciclo 30: motivo selecionado, óleo só no Monitoramento, inspeção de códigos ativos, histórico no PCM e monitoramento, rádio.');
