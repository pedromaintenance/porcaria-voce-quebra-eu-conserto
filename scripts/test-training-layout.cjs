/* v0.8.30 — regressão visual/semântica: Bia grande, animada e uma aba por vez. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const E=require(path.join(root,'engine.js'));
const View=require(path.join(root,'phaser-play/training-view.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const s=E.create(data,()=>.42);
s.training.offers=[{id:'ECSS',group:'disciplines',key:'thermodynamics',
 title:'Termodinâmica',premium:false,cost:850,untilTick:s.tick+3}];
s.training.history=[{id:'X',kind:'internal',tick:s.tick-1,personId:s.team[0].id,
 trainerId:s.team[1].id,group:'disciplines',key:'lubrication',
 before:40,after:41,earned:1,creditAfter:0,cost:0}];
s.team[0].normativeUntil=s.tick+2;s.team[0].normativeReason='Integração normativa';
const tabs=[
 {id:'internal',atlas:'coaching',own:'TREINAMENTO INTERNO',absent:['CURSOS EXTERNOS','SEGURANÇA DO TRABALHO','REGISTROS ORGANIZADOS']},
 {id:'external',atlas:'field',own:'CURSOS EXTERNOS',absent:['TREINAMENTO INTERNO','SEGURANÇA DO TRABALHO','REGISTROS ORGANIZADOS']},
 {id:'mandatory',atlas:'inspection',own:'SEGURANÇA DO TRABALHO',absent:['TREINAMENTO INTERNO','CURSOS EXTERNOS','REGISTROS ORGANIZADOS']},
 {id:'history',atlas:'feedback',own:'REGISTROS ORGANIZADOS',absent:['TREINAMENTO INTERNO','CURSOS EXTERNOS','SEGURANÇA DO TRABALHO']}
];
for(const tab of tabs){
 const out=View.render(s,E,{tab:tab.id});
 assert.ok(out.includes('trainingBiaStage--'+tab.atlas),tab.id+' usa arte correta');
 assert.ok(out.includes('data-training-active="'+tab.id+'"'));
 assert.ok(out.includes('role="tabpanel" aria-labelledby="trainingTab-'+tab.id+'"'));
 assert.ok(out.includes('role="tablist"'));
 assert.equal((out.match(/data-training-tab="/g)||[]).length,4,'quatro abas navegáveis');
 assert.equal((out.match(/aria-selected="true"/g)||[]).length,1,'só uma aba selecionada');
 assert.equal((out.match(/class="trainingSticky /g)||[]).length+(out.match(/class="trainingLedger trainingActiveSection"/g)||[]).length,1,'um único corpo de conteúdo');
 assert.ok(out.includes(tab.own),tab.id+' mostra painel próprio');
 for(const other of tab.absent)assert.ok(!out.includes('<h3>'+other+'</h3>'),'não renderizar painel '+other+' ao abrir '+tab.id);
 assert.ok(out.includes('Analista Administrativa'));
}
assert.ok(View.render(s,E).includes('data-training-active="internal"'),'inicial abre Capacitação');
assert.ok(View.render(s,E,{tab:'invalid'}).includes('data-training-active="internal"'),'tab desconhecida usa default');
assert.ok(View.render(s,E,{tab:'external',offerPeople:{ECSS:s.team[1].id}}).includes('<option value="'+s.team[1].id+'" selected>'),
 'formulário externo preserva inscrição selecionada');
assert.ok(View.render(s,E,{tab:'internal',trainerId:s.team[1].id,learnerId:s.team[2].id,
 group:'systems',key:'tires'}).includes('value="tires" selected'),'formulário interno preserva habilidade');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(html.includes('training-view.js?v=0.8.30'));
assert.ok(html.includes('game.js?v='));
assert.ok(html.includes('.trainingWorkspace{display:grid;grid-template-columns:'));
assert.ok(html.includes('.trainingBiaPortrait{display:block;width:min(232px,100%);height:auto;aspect-ratio:580/622'),'retrato proporcional em telas estreitas');
assert.ok(html.includes('.trainingBiaStage{position:relative;display:flex;align-items:end;justify-content:center;width:100%;height:286px;isolation:isolate;overflow:visible}'),'palco não recorta poses');
assert.ok(html.includes('animation:trainingBiaPose 12s steps(1,end) infinite'),'4 poses trocam sem arrastar spritesheet, a cada 3 segundos');
assert.ok(html.includes('animation:trainingBiaNoWalkCoaching 9s steps(1,end) infinite'),'coaching usa três quadros sem caminhar');
assert.ok(html.includes(".trainingBiaStage--coaching .trainingBiaPortrait{background-image:url('./assets/characters/bia/bia-feedback-4poses.webp')"),'pose estática completa como fallback, inclusive sem animação');
assert.ok(html.includes('animation:trainingBiaNoWalkField 9s steps(1,end) infinite'),'field usa só três quadros, sem caminhar');
assert.ok(html.includes(".trainingBiaStage--field .trainingBiaPortrait{background-image:url('./assets/characters/bia/bia-field-repaired-4poses.webp')"),'aba Ofertas usa o atlas com capacete restaurado');
const framePositions={
 '0':'0 0','1':'100% 0','2':'0 100%','3':'100% 100%'
};
const manifest=JSON.parse(fs.readFileSync(path.join(root,'phaser-play/assets/characters/bia/manifest.json'),'utf8'));
const walking=Object.fromEntries(manifest.atlases.map(a=>[a.id,a.frames.filter(f=>/walk/i.test(f.pose)).map(f=>f.index)]));
assert.deepEqual(walking.coaching,[1],'quadro de caminhada coaching identificado pelo manifesto');
assert.deepEqual(walking.field,[2],'quadro de caminhada field identificado pelo manifesto');
const animationRules={
 coaching:html.match(/@keyframes trainingBiaNoWalkCoaching\{([\s\S]*?)\n\}/)?.[1],
 field:html.match(/@keyframes trainingBiaNoWalkField\{([\s\S]*?)\n\}/)?.[1]
};
for(const [atlas,frames] of Object.entries({coaching:[0,2,3],field:[0,1,3]})){
 assert.ok(animationRules[atlas],'animação configurada: '+atlas);
 for(const walk of walking[atlas])assert.ok(!animationRules[atlas].includes('background-position:'+framePositions[walk]+'}'),'nunca usar pose de caminhada '+atlas);
 assert.equal((animationRules[atlas].match(/background-position:/g)||[]).length,frames.length,'somente os três quadros estáticos '+atlas);
}
// A mão da pose coaching[0] estava truncada nos pixels do atlas.
// O CSS não deve renderizar essa pose nem a caminhada coaching[1].
const coachingRules=animationRules.coaching;
assert.ok(coachingRules.includes("bia-feedback-4poses.webp');background-position:0 0"),'primeiro quadro vem do atlas alternativo íntegro');
assert.ok(!coachingRules.includes("bia-coaching-4poses.webp');background-position:0 0"),'pose com dedo cortado não reaparece');
assert.ok(!coachingRules.includes('background-position:100% 0}'),'caminhada excluída');
assert.equal((coachingRules.match(/bia-coaching-4poses.webp/g)||[]).length,2,'apenas duas poses restantes de coaching');
assert.equal((coachingRules.match(/bia-feedback-4poses.webp/g)||[]).length,1,'uma pose administrativa de prancheta');
assert.ok(html.includes('trainingBiaNoWalkCoaching 9s steps(1,end)'),'troca discreta a cada 3 segundos');
assert.ok(html.includes('.trainingBiaPortrait{width:min(166px,100%)}')&&html.includes('.trainingBiaPortrait{width:min(106px,100%)}'),'proporção preservada em tablets e celulares');
assert.ok(html.includes('@media(prefers-reduced-motion:reduce){.trainingBiaPortrait{animation:none!important}}'),'respeito à preferência de movimento reduzido');
assert.ok(html.includes('@keyframes trainingBiaPose'));
assert.ok(html.includes('prefers-reduced-motion:reduce'));
for(const atlas of ['coaching','inspection','feedback'])assert.ok(html.includes('bia-'+atlas+'-4poses.webp'));
assert.ok(html.includes('bia-field-repaired-4poses.webp'),'asset field corrigido disponível no CSS');
assert.ok(game.includes("trainingUI.tab=trainingTab.dataset.trainingTab"),'clique troca tab');
assert.ok(game.includes("trainingUI.tab=tabs[next]"),'setas/Home/End navegam com teclado');
assert.ok(game.includes("rememberTrainingSelection()"),'escolhas preservadas');
assert.ok(game.includes("window.PORCARIA_TRAINING_VIEW.render(state,E,trainingUI)"),'aba ativa é mantida nos redraws');
assert.ok(sw.includes('porcaria-vqec-20261019-v111-sap-v1-bia2'),'cache atualizado para correção da Bia');
assert.ok(html.includes('bia-coaching-4poses.webp'));
console.log('OK: Bia anima 4 atlas, painel exclusivo, abas acessíveis, presets e cache atualizados.');
