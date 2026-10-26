/* Sprint 31 · Fixtures de beta para importar na opção de Save JSON.
 * Arquivos didáticos reproduzíveis; NÃO carregados automaticamente pela campanha.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const D=require('../game-data.json'),E=require('../engine.js');
const I=require('../phaser-play/inspection.js'),M=require('../phaser-play/monitoring.js');
const dir=path.resolve('test-results/beta-s31');fs.mkdirSync(dir,{recursive:true});
const save=(id,s)=>{
 assert.ok(E.validate(s),'save com schema inválido '+id);
 assert.ok(Array.isArray(s.jobs)&&Array.isArray(s.team),'estrutura de save comprometida');
 fs.writeFileSync(path.join(dir,id+'.json'),JSON.stringify(s,null,2)+'\n');
 console.log(id+': Dia '+s.day+', turno '+s.shift+', '+s.jobs.length+' OS, '+(s.notifications||[]).length+' notas');
};
const fresh=()=>{const s=E.create(D,E.mulberry32(11));I.normalized(s);M.receive(s,D,I,{initial:true});return s;};
const availableAsset=(s,model)=>Array.from({length:6},(_,i)=>model+'·'+String(i+1).padStart(2,'0')).find(asset=>!s.jobs.some(j=>j.asset===asset)&&
 !(s.notifications||[]).some(n=>n.asset===asset&&n.monitorOnly&&['aguarda_revisao_pcm','monitorando'].includes(n.status)));
const s1=fresh();save('fresh_day1',s1);
const s2=fresh(),asset=availableAsset(s2,'EQ07');
assert.ok(asset,'necessário D9 disponível');
const planned=I.schedule(s2,D,asset,s2.team[0].id);
assert.ok(planned.ok,JSON.stringify(planned));
const visit=I.inspectAndRoute(s2,D,planned.inspection.id);
assert.ok(visit.ok&&visit.notification,'achado com notificação para PCM');
save('return_from_inspection',s2);
const s3=fresh();assert.ok(s3.notifications.some(n=>n.monitorOnly&&n.monitorCategory==='oil'),'óleo inicial');
save('oil_laboratory',s3);
const s4=fresh();
const registered=M.CATALOG.byCategory('faults').find(p=>p.codeState==='registrado');
const active=M.CATALOG.byCategory('faults').find(p=>p.codeState==='ativo');
assert.ok(registered&&active);
const used=new Set([...s4.jobs,...s4.notifications].map(x=>x.asset));
const assign=p=>Array.from({length:6},(_,i)=>p.modelId+'·'+String(i+1).padStart(2,'0')).find(x=>!used.has(x));
for(const [i,p] of [registered,active].entries()){
 const a=assign(p);assert.ok(a,'ativo eletrônico disponível');used.add(a);
 s4.notifications.push({id:'NMB'+String(i+1).padStart(4,'0'),inspectionId:null,asset:a,modelId:p.modelId,
  openedTick:s4.tick,origin:'monitoramento_de_condicao',description:p.baseline,reportedIndication:p.baseline,
  priority:'media',status:'aguarda_revisao_pcm',sourceScenario:null,monitorOnly:true,
  monitorCategory:'faults',monitorProtocol:p.id,monitoring:{status:'proposta',baseline:p.baseline,reason:null,interval:null,nextTick:null,samples:[],decisions:[]}});
}
save('active_vs_historic_faults',s4);
const s5=fresh(),j=s5.jobs[0],scenario=D.scenarios.find(x=>x.id===j.scene);
assert.equal(E.attach(s5,j.id,s5.team[0].id,0,false),null);
s5.stock[scenario.material]=0;s5.tools[scenario.tool]=false;
save('crew_material_conflict',s5);
const s6=fresh(),rng=E.mulberry32(13);
for(let i=0;i<24;i++){E.advance(s6,D,rng);M.receive(s6,D,I);}
assert.ok(s6.preventiveOrders.length||s6.preventiveJobs.length||s6.preventiveMetrics.executed>0,'preventiva apareceu por horímetro');
save('preventive_due',s6);
const s7=fresh(),rng7=E.mulberry32(17);
for(let i=0;i<38;i++){E.advance(s7,D,rng7);M.receive(s7,D,I);}
assert.equal(s7.day,20);
save('day20_day21',s7);
const s8=fresh();delete s8.inspectionLabor;delete s8.guideDismissed;delete s8.monitoringFeedSeen;
save('legacy_save',s8);
console.log('OK S31-07: oito fixtures de beta reproduzíveis, testadas pelo motor.');
