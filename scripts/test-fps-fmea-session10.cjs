/* FPS FMEA v7 — casos GET, rastreabilidade e caminho até uma OS planejável. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../game-data.json'),E=require('../engine.js'),I=require('../phaser-play/inspection.js');
const M=require('../phaser-play/monitoring.js'),C=require('../phaser-play/condition-catalog.js');
const P=require('../phaser-play/planning.js'),V=require('../phaser-play/inspection-view.js');
const FPS=require('../phaser-play/fps-catalog-expansion.js');
assert.equal(D.scenarios.length,124);
assert.equal(D.paths.length,493);
assert.equal(FPS.ENTRIES.length,24);
assert.equal(C.byCategory('fps').length,24);
assert.equal(FPS.VERSION,'7.0.0');
assert.equal(C.VERSION,'7.0.0');
assert.deepEqual(D.scenarios.slice(0,100).map(x=>x.id),Array.from({length:100},(_,i)=>'INC'+String(i+1).padStart(3,'0')),'100 missões originais intactas');
assert.equal(new Set(D.scenarios.map(x=>x.id)).size,124);
assert.equal(new Set(D.paths.map(x=>[x.modelId,x.system,x.group,x.subgroup].join('|'))).size,D.paths.length,'não duplicar local');
assert.equal(D.paths.filter(x=>x.origin==='trilha_didatica_fps').length,16,'locais identificados como didáticos');
assert.ok(D.paths.filter(x=>x.origin==='trilha_didatica_fps').every(x=>x.sapValidated===false));
const materials=['FPTP','FPRT','FPAD','FPPR','FPBR','FPPL','FPSO','FPFX'];
const tools=['INSP','METR','TORQ','ENDP'];
for(const id of materials){assert.ok(D.items[id]&&D.items[id].unit>0&&/simulad|didátic|virtua/i.test(D.items[id].name),'material fictício '+id);}
for(const id of tools)assert.ok(D.tools[id]&&D.tools[id].cost>0,'instrumento do jogo '+id);
const keys=new Set(D.paths.map(p=>[p.modelId,p.system,p.group,p.subgroup].join('|')));
for(let i=0;i<24;i++){
 const p=FPS.ENTRIES[i],sc=D.scenarios.find(s=>s.id==='INC'+String(101+i)),full=C.get(p.id);
 assert.ok(sc,p.id+' tem missão');
 assert.equal(p.escalationScenario,sc.id);
 assert.equal(sc.modelId,p.modelId);
 assert.equal(sc.fpsMapping.protocol,p.id);
 assert.equal(sc.category,'fps');
 assert.deepEqual(sc.path.slice(0,1),['IMAT']);
 assert.ok(keys.has([sc.modelId,...sc.path].join('|')));
 assert.ok(D.catalog.parts.includes(sc.component));
 assert.ok(D.catalog.damages.some(x=>x.pt===sc.damage));
 assert.ok(D.catalog.causes.some(x=>x.pt===sc.cause));
 assert.ok(materials.includes(sc.material));
 assert.ok(tools.includes(sc.tool));
 assert.equal(sc.estimatedCost,D.items[sc.material].unit);
 assert.ok(sc.verification.length>=120&&sc.lesson.length>=150);
 assert.equal(sc.fmeaSource.status,'roteiro_fps_didatico_pendente_revisao_OEM');
 assert.equal(sc.simulation.oemValidated,false);
 assert.equal(sc.sourcePartMatch,false);
 assert.equal(sc.fpsMapping.partNumber,null);
 assert.equal(sc.fpsMapping.retirementLimit,null);
 assert.equal(sc.fpsMapping.torqueOEM,null);
 assert.ok(sc.fpsMapping.alternatives.length>=3);
 assert.ok([2,3].includes(sc.priority));
 assert.equal(full.escalationScenario,sc.id);
 for(const seed of [1,7,42]){
  const opts=E.options(D,sc,seed);
  assert.equal(opts.length,6);
  [...sc.path,sc.component,sc.damage,sc.cause].forEach((id,idx)=>{
   assert.equal(opts[idx].length,4,sc.id+' stage '+idx);
   assert.ok(opts[idx].some(x=>x.id===id),sc.id+' hipótese selecionável '+idx);
  });
 }
}
const create=()=>{const s=E.create(D,()=>.5);I.normalized(s);return s};
function receive(id){
 const s=create();s.monitoringFeedCursor=3;
 s.monitoringFeedSeen=C.byCategory('fps').filter(x=>x.id!==id).map(x=>x.id);
 const r=M.receive(s,D,I,{initial:true});
 assert.equal(r.received.length,1);
 assert.equal(r.received[0].monitorProtocol,id);
 return {s,n:r.received[0]};
}
for(const id of ['FPS006','FPS019','FPS028']){
 const {s,n}=receive(id),sc=D.scenarios.find(x=>x.id===C.get(id).escalationScenario);
 const original=s.jobs.length;
 assert.equal(n.workOrderId,null,'monitoramento recebido não é OS');
 const urgent=M.escalate(s,D,I,n.id);
 assert.equal(urgent.ok,true,id);
 const note=urgent.escalation;
 assert.equal(note.requiresScenarioMapping,false,'roteiro encontrado');
 assert.equal(note.sourceScenario,sc.id);
 assert.equal(s.jobs.length,original,'encaminhamento não cria OS');
 assert.ok(I.commitConversion(s,D,E,note.id).error,'sem aprovação PCM não converte');
 assert.ok(I.review(s,note.id,'approve',{
  scope:'Verificar condição GET com inspeção e documentação do conjunto instalado antes de definir reparos.',
  trade:'mecanica',estimatedHH:4
 },D,E).error,'FPS exige diagnóstico, não apenas texto livre');
 const hypotheses=I.hypotheses(s,D,E,note.id);
 assert.equal(hypotheses.length,6);
 const diagnosis=[...sc.path,sc.component,sc.damage,''];
 diagnosis.slice(0,5).forEach((code,j)=>assert.ok(hypotheses[j].some(x=>x.id===code)));
 const review=I.review(s,note.id,'approve',{diagnosis,action:'verificar',trade:'mecanica',estimatedHH:4,reason:'Avaliação didática registrada com causa ainda indefinida.'},D,E);
 assert.equal(review.ok,true,JSON.stringify(review));
 assert.equal(note.planningDiagnosis.optionalCause,true);
 assert.equal(s.jobs.length,original,'revisão não cria OS');
 const order=I.commitConversion(s,D,E,note.id);
 assert.equal(order.ok,true,JSON.stringify(order));
 assert.equal(s.jobs.length,original+1);
 assert.equal(order.order.scene,sc.id);
 assert.equal(order.order.notificationId,note.id);
 assert.equal(order.order.source,'notificacao_inspecao');
 assert.equal(order.order.plannerDiagnosis.optionalCause,true);
 assert.equal(order.order.stage,0);
 assert.equal(order.order.status,'fila');
 assert.equal(note.status,'convertida_os');
 assert.ok(P.compute(s,D).ranked.some(x=>x.id===order.order.id),'ordem chega ao planejamento');
 assert.ok(I.commitConversion(s,D,E,note.id).error,'sem duplicidade');
 assert.equal(E.validate(JSON.parse(JSON.stringify(s))),true);
 const copy=JSON.parse(JSON.stringify(s));I.normalized(copy);assert.ok(copy.jobs.some(x=>x.id===order.order.id),'save íntegro');
}
const historic=create();
const legacyNote={id:'NM0911',monitorOnly:true,monitorCategory:'fps',monitorProtocol:'FPS001',status:'aguarda_revisao_pcm',monitoring:{status:'proposta',samples:[]}};
assert.ok(V.monitorWidget(legacyNote,historic,M).includes('REGISTRO LEGADO'));
const html=fs.readFileSync('phaser-play/index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.ok(html.includes('fps-catalog-expansion.js?v=0.9.10'));
assert.ok(html.includes('condition-catalog.js?v=0.9.10'));
assert.ok(sw.includes('fmea0910'));
console.log('OK FPS FMEA: 24 missões novas, 403 locais, origem didática, revisão PCM, OS e planejamento.');
