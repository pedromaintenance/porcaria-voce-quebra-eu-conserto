const assert=require('assert');
const D=require('./game-data.json'), E=require('./engine.js');
const rng=E.mulberry32(28948);
const s=E.create(D,rng);
assert.equal(D.scenarios.length,29);
assert.equal(D.models.length,9);
assert.equal(s.team.length,4);
assert.equal(s.jobs.length,3);
// Validate every scenario has technical codes and six selectable options.
for(const sc of D.scenarios){
 const opts=E.options(D,sc,9876);
 assert.equal(opts.length,6,'6 levels '+sc.title);
 const path=[...sc.path,sc.component,sc.damage,sc.cause];
 for(let i=0;i<6;i++)assert(opts[i].some(o=>o.id===path[i]),`missing option for ${sc.title}/${i}`);
}
// Append scenario with known and usable diagnostic tools.
let jb=s.jobs.find(j=>s.tools[D.tools[E.scenario(D,j.scene).tool]?.name])||s.jobs[0];
assert.equal(E.attach(s,jb.id,s.team[0].id,0,true),null);
const startCase=E.scenario(D,jb.scene);
if(!s.tools[startCase.tool]) assert.equal(E.buyTool(s,D,startCase.tool),null);
for(let i=0;i<6;i++){
 const sc=E.scenario(D,jb.scene);const correct=[...sc.path,sc.component,sc.damage,sc.cause][i];
 const a=E.answer(s,D,jb.id,correct);assert(a.ok);
}
assert.equal(jb.stage,6);
assert.equal(s.player.actionsLeft,undefined,'novo save sem cota de tentativas');
assert(E.answer(s,D,jb.id,'x').error,'diagnóstico concluído não aceita mais respostas');
let res=E.advance(s,D,rng);
assert(s.tick===1);
assert(s.player.actionsLeft===undefined);
// Cure the rest
while(jb.stage<6){
 const sc=E.scenario(D,jb.scene);const correct=[...sc.path,sc.component,sc.damage,sc.cause][jb.stage];
 const result=E.answer(s,D,jb.id,correct);
 if(result.error){E.advance(s,D,rng);continue}
 assert(result.ok);
}
// Material and tool shop; delivery with ticks.
const chosen=E.scenario(D,jb.scene);
if(!s.tools[chosen.tool])E.buyTool(s,D,chosen.tool);
if(!s.stock[chosen.material]){
 E.orderMaterial(s,D,chosen.material,1,true,rng);
 while(!s.stock[chosen.material])E.advance(s,D,rng);
}
for(let i=0;i<6&&E.job(s,jb.id);i++)E.advance(s,D,rng);
assert(!E.job(s,jb.id),'repair eventually completes');
assert(s.done.length>=1);
assert(s.done[0].elapsedHours>0);
assert(E.kpis(s).mttr>0);
for(let i=0;i<30;i++)E.advance(s,D,rng);
assert.equal(s.day,Math.floor(s.tick/2)+1,'calendário avança um dia a cada dois turnos');
assert(s.kpi.length>0);
assert(s.cash<10000000 && Number.isFinite(s.cash));
assert(E.validate(JSON.parse(JSON.stringify(s))));
console.log('OK: 29 missions, 6 levels, shifts, capacity, credit, materials, repair, KPI, persistence');
