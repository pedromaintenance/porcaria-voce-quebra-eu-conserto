/* Testes de regressão sem dependências: node scripts/smoke-phaser.cjs */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const engine=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'game-data.json'),'utf8'));
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const phaserHtml=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
const phaserScript=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
const pwa=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
assert.ok(home.includes("location.replace('./phaser-play/'"),'raiz redireciona para a oficina 2D');
assert.ok(phaserHtml.includes('data-open-panel="management"'),'gestão abre pop-up em vez de navegar para interface legada');
assert.ok(phaserHtml.includes('data-panel="management"'),'painel de gestão integrado ao Phaser');
assert.ok(phaserHtml.includes('data-panel="shift"'),'briefing pré-turno usa o mesmo overlay sem alterar os boxes');
assert.ok(phaserScript.includes('function drawManagement(k)'),'métricas da gestão vêm da simulação');
assert.ok(phaserScript.includes('window.PORCARIA_READINESS.compute(state,data)'),'gestão/briefing usam cálculo puro do quadro');
assert.ok(phaserHtml.includes('readiness.js?v=0.8.8'),'módulo prontidão carregado');
assert.ok(phaserHtml.indexOf('readiness.js?v=0.8.8')<phaserHtml.indexOf('game.js?v=0.8.27'),'prontidão entra antes do Phaser');
assert.ok(phaserHtml.includes('.readinessBays'),'novo quadro tem CSS responsivo');

assert.ok(phaserScript.includes('function drawShiftBrief()'),'briefing é renderizado com dados atuais');
assert.equal(pwa.start_url,'./phaser-play/','PWA inicia no Phaser');

const headerStart=phaserHtml.indexOf('<header class="top"');
const headerEnd=phaserHtml.indexOf('</header>',headerStart);
const topHeader=headerStart>=0&&headerEnd>=0?phaserHtml.slice(headerStart,headerEnd+9):null;
assert.ok(topHeader,'barra principal da oficina presente');
assert.ok(topHeader.includes('class="top-main"')&&topHeader.includes('class="top-status"'),'duas faixas de controles distintas');
assert.ok(topHeader.includes('class="primary-nav"'),'menus organizados em navegação própria');
assert.equal((topHeader.match(/class="tab nav-item/g)||[]).length,8,'oito opções de navegação, incluindo Treinamentos');
assert.ok(topHeader.includes('class="status-metrics"'),'KPIs separados da navegação');
assert.ok(topHeader.includes('class="toolbar-actions"'),'comandos de sessão agrupados');
assert.equal((phaserHtml.match(/id="advance"/g)||[]).length,1,'ação avançar turno aparece uma única vez');
assert.ok(topHeader.includes('id="advance"'),'avançar turno fora da área dos boxes');
assert.equal((phaserHtml.match(/id="helpBtn"/g)||[]).length,1,'ajuda única');
assert.equal((phaserHtml.match(/id="sceneMenuBtn"/g)||[]).length,1,'um controle visual');
assert.equal((phaserHtml.match(/id="sceneMenu"/g)||[]).length,1,'menu de cenário único');
assert.equal((phaserHtml.match(/id="bgPicker"/g)||[]).length,1,'selecionador de cenário preservado');
assert.equal((phaserHtml.match(/id="bgPickBtn"/g)||[]).length,1,'botão de cenário acessível preservado');
assert.ok(phaserScript.includes("bgPickBtn').addEventListener('click'"),'botão de cenário aciona seletor de arquivos');
assert.equal((phaserHtml.match(/id="bgReset"/g)||[]).length,1,'ação restaurar cenário preservada');
assert.ok(topHeader.includes('id="bgPicker"')&&topHeader.includes('id="bgReset"'),'ações de cenário agrupadas na barra');
assert.ok(!phaserHtml.includes('class="backgroundControl"'),'menu de cenário não cobre mais os boxes');
assert.ok(phaserHtml.includes('overflow-x:auto'),'navegação responsiva rolável');
assert.ok(phaserScript.includes('function closeSceneMenu()'),'menu de cenário pode ser fechado');
assert.ok(phaserScript.includes("sceneMenuBtn').addEventListener('click'"),'controle de abertura do menu presente');
assert.ok(phaserScript.includes("if(!$('sceneMenu').hidden)"),'Escape fecha o dropdown antes do modal');
assert.ok(phaserHtml.includes('game.js?v=0.8.27'),'script principal tem cache versionado');
assert.ok(phaserHtml.includes('shift-brief.js?v=0.7.7'),'módulo de briefing carregado junto ao jogo');
assert.ok(phaserHtml.includes('planning.js?v=0.8.27'),'módulo do planejamento carregado no Pages');
assert.ok(phaserHtml.includes('weekly.js?v=0.7.9'),'módulo semanal do PCM carregado');
assert.ok(phaserScript.includes('function drawWeekly()'),'visão semanal acessível no painel de planejamento');
assert.ok(phaserHtml.includes('data-panel="planning"'),'menu de planejamento integrado sem adicionar botões ao header');
assert.ok(phaserScript.includes('function drawPlanning()'),'planejamento renderizado do estado ativo');
assert.ok(phaserHtml.includes('layout-math.js?v=0.8.2'),'funções de geometria carregam antes da oficina');

const state=engine.create(data,()=>0.42);
assert.ok(engine.validate(state),'save inicial válido');
assert.equal(state.jobs.length,3,'iniciar com três OS');
assert.deepEqual(state.team.map(m=>m.name),['Pedro','Geovane','Junior'],'três titulares na nova campanha');
assert.equal(engine.SHIFT_HOURS,12,'turnos de dia/noite de 12h');
assert.equal(engine.EFFECTIVE_HOURS,10.5,'DDS 30min e almoço 1h');
assert.equal(state.productivityTarget,60,'meta padrão de produtividade estável');
assert.ok(phaserScript.includes('applyOfficialBackdrop()'),'alternância de fundos por turno implementada');
assert.ok(phaserHtml.includes('id="bgNightBtn"'),'menu Visual permite escolher asset da noite');
assert.ok(phaserHtml.includes('id="sceneState"'),'menu informa cenário diurno ou noturno ativo');
assert.ok(phaserHtml.includes('Restaurar noite oficial'),'ação restaura a noite oficial sem apagar save');
assert.ok(phaserScript.includes("oficina-noturna-hq.avif?v=0.8.4"),'caminho da noite oficial versionado e carregado');
assert.ok(phaserHtml.includes('id="nightPicker"'),'arquivo noturno tem seletor separado');
assert.ok(phaserHtml.includes('id="bgNightReset"'),'arquivo noturno pode ser limpo');
assert.ok(phaserScript.includes("sceneStore('save',file,'night')"),'imagem da noite é persistida em chave própria');
assert.ok(phaserScript.includes('if(night&&this.nightBackdropImage)'),'fundo local ganha precedência no turno B');
assert.ok(phaserScript.includes("if(state?.shift===1&&!this.customBackdrop)"),'troca noturna respeita cenário global personalizado');
assert.ok(fs.existsSync(path.join(root,'phaser-play','assets','OFICINA-NOTURNA.md')),'manifesto da arte noturna original versionado');
assert.ok(phaserHtml.includes('id="advance"')&&phaserHtml.includes('+12H'),'botão indica duração correta');
assert.equal(map.bays.length,3,'mapeamento contém três boxes');
assert.equal(map.backgroundProfiles.fullFrame.bays.length,3,'mapa adicional para fundo completo');
assert.deepEqual(map.backgroundProfiles.fullFrame.bays.map(b=>b.spriteWorld.x),[568,852,1104],'centros recalibrados no cenário completo');
assert.ok(phaserScript.includes('this.applyBayProfile(profile)'),'mapeamento acompanha modo da imagem');
assert.ok(map.backgroundProfiles.fullFrame.bays.every(b=>b.placementWorld&&b.footerWorld),'geometrias visuais e HUD separadas por box');
assert.ok(map.backgroundProfiles.fullFrame.bays.every(b=>b.progressWorld.y===441),'porcentagem de diagnóstico na faixa inferior');
assert.ok(map.backgroundProfiles.fullFrame.bays.every(b=>b.spriteWorld.groundY===408),'pé das máquinas na marcação de apoio');
assert.ok(phaserScript.includes('placementWorld?.groundY'),'sombra está ancorada no novo plano de apoio');
assert.ok(phaserScript.includes('footerWorld||'),'badges independentes do clique e dos sprites');

assert.ok(phaserScript.includes('this.activeBayLayout||BAY_LAYOUT'),'desenho usa mapa ativo');
assert.ok(phaserScript.includes('this.bayZones=this.createBayZones()'),'reconstrói zonas clicáveis');
assert.ok(!phaserScript.includes('if(aspect>2.42'),'fundo completo não é cortado por limiar de proporção');

const zones=map.bays.map(b=>b.hitWorld);
assert.ok(zones.every(z=>z.width>0&&z.height>0),'zonas clicáveis válidas');
assert.ok(zones.every((z,i)=>zones.every((other,j)=>i===j||z.x+z.width<=other.x||other.x+other.width<=z.x)),'boxes não se sobrepõem');
// O asset oficial precisa existir na revisão em execução, não apenas no HTML.
const crypto=require('node:crypto');
const background=path.join(root,'phaser-play',map.background.file.replace(/^\.\//,''));
assert.ok(fs.existsSync(background),'fundo oficial versionado existe');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(background)).digest('hex'),map.background.checksumSHA256,'fundo oficial íntegro');
assert.ok(map.background.width>=1350,'fundo oficial possui resolução suficiente');
assert.ok(fs.statSync(background).size>=90000,'AVIF com qualidade superior à textura anterior');
const crop=map.background.sourceCrop;
assert.ok(crop.x>=0&&crop.y>=0&&crop.x+crop.width<=map.background.sourceWidth&&crop.y+crop.height<=map.background.sourceHeight,'recorte da oficina está dentro da imagem original');
const left=map.viewport.worldScrollX,top=map.viewport.worldScrollY;
const layoutMath=require(path.join(root,'phaser-play','layout-math.js'));
for(const bay of map.bays){
 const z=bay.hitWorld;
 assert.ok(z.x>=left&&z.x+z.width<=left+map.viewport.width,'box visível horizontalmente');
 assert.ok(z.y>=top&&z.y+z.height<=top+map.viewport.height,'box visível verticalmente');
 assert.ok(bay.spriteWorld.x>=z.x&&bay.spriteWorld.x<=z.x+z.width,'máquina centralizada no próprio box');
 assert.ok(bay.spriteWorld.y>=z.y&&bay.spriteWorld.y<=z.y+z.height,'máquina sobre piso do box');
 for(const worker of bay.workerWorld){
  assert.ok(worker.y>=z.y&&worker.y<=z.y+z.height,'mecânico mantém contato com o piso do galpão');
  const visible=layoutMath.visibleCenter(worker.x,54,map.viewport,8);
  assert.ok(visible>=left+35&&visible<=left+map.viewport.width-35,'mecânico é mantido dentro do recorte visível');
 }
 assert.ok(bay.progressWorld.x>=z.x&&bay.progressWorld.x+bay.progressWorld.width<=z.x+z.width,'barra de progresso dentro do box');
}
// v0.7.4 — escala específica por modelo com limites reais do espaço visual.
assert.equal(map.version,'0.8.3','mapeamento com placementWorld, progressWorld e footerWorld');
assert.equal(map.modelPresentation.EQ02.scaleMultiplier,2,'CAT 6030 com proporção alvo 2x');
assert.equal(map.modelPresentation.EQ05.scaleMultiplier,3,'DR410i com proporção alvo 3x');
const expectedX=[427,842,1218];
const expectedWorkers=[[330,559],[719,971],[1097,1340]];
const expectedProgress=[402,695,1006];
const expectedHits=[379,660,980];
for(let i=0;i<3;i++){
 const b=map.bays[i];
 assert.equal(b.spriteWorld.x,expectedX[i],`BOX ${i+1}: novo centro nominal da máquina`);
 assert.deepEqual(b.workerWorld.map(w=>w.x),expectedWorkers[i],`BOX ${i+1}: mecânicos acompanham translação`);
 assert.equal(b.hitWorld.x,expectedHits[i],`BOX ${i+1}: hotspot preservado`);
 assert.equal(b.progressWorld.x,expectedProgress[i],`BOX ${i+1}: progresso não se desloca do letreiro`);
}
assert.deepEqual(map.bays.map(b=>b.compositionOffsetX),[-74,34,104],'deslocamentos acumulados apos ajuste fino');
assert.deepEqual(map.bays.map(b=>b.visualCalibrationX),[20,-6,-5],'calibração visual preservada e novo deslocamento BOX 3');
assert.equal(layoutMath.calibratedCenter(330,54,map.viewport,20,8),374,'mecânico do box 1 se move efetivamente 20px mesmo quando limitado pela borda');
assert.equal(layoutMath.calibratedCenter(427,265,map.viewport,20,8),480,'CAT 777E no BOX 1 efetivamente 20px mais à direita');
assert.equal(layoutMath.calibratedCenter(842,265,map.viewport,-6,8),842,'BOX 2 move a máquina 6px para a esquerda');
assert.equal(layoutMath.calibratedCenter(719,54,map.viewport,-6,8),719,'mecânico do BOX 2 segue translação');
assert.equal(layoutMath.calibratedCenter(1218,230,map.viewport,-5,8),1218,'BOX 3 -5px para a esquerda no cenário diurno');
assert.equal(layoutMath.calibratedCenter(427,272,map.viewport,20,8),483,'equipamento largo do BOX 1 mantém novo deslocamento e enquadramento');
assert.equal(layoutMath.calibratedCenter(1340,54,map.viewport,-5,8),1340,'mecânico do BOX 3 também -5px');
assert.ok(phaserScript.includes("machineNode.on('pointerdown'"),'clique na máquina seleciona a própria OS');
assert.ok(phaserScript.includes("actor.on('pointerdown'"),'clique no mecânico seleciona a própria OS mesmo sobre região vizinha');
assert.ok(phaserScript.includes('fillEllipse(machineX,shadowMainY,')&&phaserScript.includes('fillEllipse(machineX,shadowSoftY,'),'as duas sombras seguem o centro efetivamente renderizado da máquina');
assert.ok(phaserScript.includes('calibratedCenter(x,WORKER_DISPLAY.width,SCENE_REFERENCE,visualCalibrationX'),'mecânicos usam deslocamento posterior ao clamp');
assert.ok(phaserScript.includes('calibratedCenter(x,plan.width,SCENE_REFERENCE,bay?.visualCalibrationX'),'equipamentos usam deslocamento posterior ao clamp');
assert.ok(phaserScript.includes('this.lastFallbackMachineX=x'),'fallback vetorial guarda sua posição efetivamente renderizada');
assert.ok(phaserScript.includes('this.lastFallbackMachineX??cx'),'sombra do fallback acompanha o centro renderizado');
const bay=map.bays[1];
const oldDrill=layoutMath.equipmentSize(1086,1448,bay.spriteWorld.scale,{scaleMultiplier:1},bay);
const newDrill=layoutMath.equipmentSize(1086,1448,bay.spriteWorld.scale,map.modelPresentation.EQ05,bay);
assert.ok(newDrill.height>oldDrill.height*1.7,'perfuratriz significativamente maior sem atravessar o teto do box');
assert.ok(newDrill.width<=map.modelPresentation.EQ05.maximumWidth,'perfuratriz cabe no box pela largura');
assert.ok(newDrill.height<=bay.placementWorld.groundY-bay.placementWorld.topY-14,'perfuratriz cabe na altura técnica do placementWorld, independente do clique');
assert.ok(newDrill.capped,'fator nominal 3x respeita limite físico da cena');
const oldShovel=layoutMath.equipmentSize(540,540,bay.spriteWorld.scale,{scaleMultiplier:1},bay);
const newShovel=layoutMath.equipmentSize(540,540,bay.spriteWorld.scale,map.modelPresentation.EQ02,bay);
assert.ok(newShovel.height>oldShovel.height*1.5,'CAT 6030 perceptivelmente maior');
assert.ok(newShovel.width<=map.modelPresentation.EQ02.maximumWidth,'CAT 6030 cabe em largura');
assert.ok(phaserScript.includes('trimmedEquipment(key)'),'remover bordas transparentes para aproveitar o sprite');
assert.ok(phaserScript.includes('equipmentSize(src.width,src.height'),'escala da maquina calculada pelo modulo');
assert.ok(phaserScript.includes('const density=Math.min(2'),'backdrop mantém textura nativa de alta resolução');
assert.ok(phaserScript.includes('setDisplaySize(SCENE_REFERENCE.width,SCENE_REFERENCE.height)'),'backdrop preserva tamanho lógico no mundo');
assert.ok(!phaserScript.includes('width:1080,height:450,resolution'),'configuração Phaser 3 não depende da opção resolution descontinuada');
assert.ok(phaserScript.includes('roundPixels:true'),'posições inteiras reduzem borrado');
assert.ok(phaserScript.includes("modelId==='EQ01' ? Phaser.Textures.FilterMode.LINEAR : Phaser.Textures.FilterMode.NEAREST"),'CAT 777E usa minificação suave e demais sprites continuam nítidos com NEAREST');
assert.ok(phaserScript.includes("FilterMode.LINEAR"),'fundo pintado usa suavização independente');
// As áreas clicáveis continuam sem sobreposição; a apresentação visual é limitada por tipo de máquina.
// v0.7.2 — sprites versionados e nenhuma flutuação do maquinário.
const pngHeader=Buffer.from('89504e470d0a1a0a','hex');
const equipment=['cat777e_v3.webp','cat6030.png','cat395.png','sandvik_dr410i.png'];
const poses=['idle','inspect','point','clipboard'];
for(const sprite of equipment){
 const asset=path.join(root,'phaser-play','assets','equipment',sprite);
 assert.ok(fs.existsSync(asset),'equipamento local ausente: '+sprite);
 const bytes=fs.readFileSync(asset);
 if(sprite.endsWith('.webp')){
  assert.ok(bytes.length>10000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','WebP de equipamento inválido: '+sprite);
 }else{
  assert.ok(bytes.length>10000&&bytes.subarray(0,8).equals(pngHeader),'PNG de equipamento inválido: '+sprite);
 }
 assert.ok(phaserScript.includes('./assets/equipment/'+sprite),'sprite de equipamento não referenciado: '+sprite);
}
for(const person of ['costa','pedro','geovane','silva','santos','moura']){
 const file=path.join(root,'phaser-play','assets','characters',person+'-4poses.webp');
 const bytes=fs.readFileSync(file);
 assert.ok(bytes.length>100000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','cartela WebP válida: '+person);
 assert.ok(phaserScript.includes(person+'-4poses.webp'),'referência de sprite: '+person);
}
assert.ok(!phaserScript.includes('worker_lia_idle')&&!phaserScript.includes('worker_rafael_idle'),'sprites antigos não são carregados');
assert.ok(!phaserScript.includes('this.tweens.add('),'máquinas não podem flutuar via tween');
assert.ok(phaserScript.includes('actor.sprite.setFrame(actor.frames[actor.index])'),'os quadros dos personagens são animados sem trocar a textura');
for(const bay of map.bays){
 const b=bay.hitWorld,m=bay.spriteWorld,w=bay.workerWorld;
 assert.equal(w.length,2,'dois profissionais em cada box');
 assert.equal(m.y,m.groundY,'apos recorte alpha, a base visual da maquina coincide com a sombra/piso');
 assert.ok(m.y<=b.y+b.height,'imagem ainda está dentro da zona clicável');
 assert.ok(w.every(p=>p.y===m.groundY),'mecânicos e equipamento compartilham o mesmo plano do piso');
 assert.ok(w[0].x<m.x&&w[1].x>m.x,'mecânicos devem ficar nas laterais');
 assert.equal(w[0].facing,'right','personagem à esquerda aponta para o equipamento');
 assert.equal(w[1].facing,'left','personagem à direita aponta para o equipamento');
}
const first=state.jobs[0],person=state.team[0];
assert.equal(engine.attach(state,first.id,person.id,0,true),null,'alocar OS');
assert.equal(first.bay,0,'OS no box 1');
assert.equal(person.assigned,first.id,'mecânico ocupado');
assert.ok(engine.attach(state,state.jobs[1].id,person.id,1,true),'impedir dupla alocação');
assert.equal(engine.release(state,first.id),null,'liberar box');
assert.equal(first.bay,null,'box liberado');
assert.equal(person.assigned,null,'mecânico liberado');
assert.equal(engine.rest(state,person.id),null,'descanso programado');
assert.ok(engine.attach(state,first.id,person.id,0,true),'impedir alocação durante descanso');
const before=state.tick;
const result=engine.advance(state,data,()=>0.42);
assert.equal(state.tick,before+1,'turno avança');
assert.ok(Number.isFinite(result.hours),'horas calculadas');
assert.ok(engine.validate(JSON.parse(JSON.stringify(state))),'save serializado íntegro');
console.log('OK: sprites locais, poses, imobilidade do maquinário, piso, geometria e motor de manutenção.');
