/* Sem teto de mecânicos ou de tentativas de diagnóstico assistido por turno. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const s=E.create(data,()=>.42);
assert.equal(s.player.actionsLeft,undefined,'novas campanhas não guardam cota de ações');
assert.equal(E.MAX_TEAM,undefined,'não existe número máximo de mecânicos');
const j=s.jobs[0],c=E.scenario(data,j.scene);
s.tools[c.tool]=true;
assert.equal(E.attach(s,j.id,s.team[0].id,0,true),null);
const beforeTick=s.tick;
for(let n=0;n<18;n++){
 const result=E.answer(s,data,j.id,'INVALIDO_'+n,()=>.9);
 assert.equal(result.error,undefined,'tentativa '+n+' não bloqueada');
 assert.equal(result.ok,false);
}
assert.equal(s.tick,beforeTick,'18 tentativas sem avanço de turno');
assert.equal(j.stage,0,'erros não pulam etapas');
assert.equal(j.wrong,18);
for(let n=0;n<6;n++){
 const correct=[...c.path,c.component,c.damage,c.cause][n];
 const result=E.answer(s,data,j.id,correct,()=>.9);
 assert.equal(result.ok,true,'seis acertos adicionais no mesmo turno');
}
assert.equal(j.stage,6);
const old=E.create(data,()=>.42);old.player.actionsLeft=0;
const j2=old.jobs[0],c2=E.scenario(data,j2.scene);
old.tools[c2.tool]=true;
assert.equal(E.attach(old,j2.id,old.team[0].id,0,true),null);
E.normalizeRoster(old);
assert.equal(E.answer(old,data,j2.id,c2.path[0],()=>.9).ok,true,'save antigo esgotado também joga sem teto');
assert.equal(old.player.actionsLeft,0,'migração não altera outras informações antigas');
assert.deepEqual(E.availableRecruits(s).at(-1).sprite,'generic');
for(const p of E.RECRUIT_POOL){
 s.player.mental=100;s.cash+=1050;
 assert.equal(E.hire(s,p.sprite,()=>.43),null,'nomeado '+p.name);
}
assert.equal(s.team.length,14);
assert.deepEqual(E.availableRecruits(s).map(p=>p.sprite),['generic']);
const initialJobs=JSON.stringify(s.jobs);
for(let i=0;i<25;i++){
 s.player.mental=100;s.cash+=1050;
 assert.equal(E.hire(s,'generic',()=>.43),null,'mecânico avulso '+i);
 const m=s.team.at(-1);
 assert.equal(m.name,'Mecânico '+m.id);
 assert.equal(m.sprite,null);
 assert.deepEqual(m.competencies,E.baselineSkills(m.name),'perfil individual reprodutível');
}
assert.equal(s.team.length,39,'nenhum limite em 14 ou 20 contratados');
assert.equal(new Set(s.team.map(m=>m.id)).size,39,'nenhum ID repetido');
assert.equal(E.availableRecruits(s).length,1,'contratação genérica continua disponível');
assert.equal(JSON.stringify(s.jobs),initialJobs,'OS intactas após contratações');
const snapshot=JSON.stringify(s);E.normalizeRoster(s);
assert.equal(JSON.stringify(s),snapshot,'normalização idempotente com 39 pessoas');
const ui=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
assert.ok(ui.includes("data-person=\"\\${esc(m.sprite)}\"")||ui.includes("data-person=\"${esc(m.sprite)}\""),'UI oferece contratação avulsa');
assert.ok(!ui.includes("E.MAX_TEAM"),'UI não bloqueia lotação');
console.log('OK: 24 tentativas por turno, save legado e 39 mecânicos sem lotação máxima.');
