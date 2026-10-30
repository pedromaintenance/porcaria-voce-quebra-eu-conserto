/* S31-03: teste browser real; executa somente via workflow de QA visual.
 * Não acessa saves pessoais: contexto de navegador isolado e efêmero.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright-core');
const D=require('../game-data.json'),E=require('../engine.js'),I=require('../phaser-play/inspection.js'),M=require('../phaser-play/monitoring.js');
const host=process.env.PORCARIA_TEST_URL||'http://127.0.0.1:8765/phaser-play/';
const ASSEMBLY=require('../phaser-play/assembly-sequence.js');
const PIN=require('../phaser-play/assembly-pin-impact.js');
function assembledAlmostComplete(){
 const s=ASSEMBLY.create();
 for(const id of ['removeBolt:g1','removeBolt:g2','removePart:guard',
  'removeBolt:l1','removeBolt:l2','removePart:leftPad','removePart:leftRetainer',
  'removeBolt:r1','removeBolt:r2','removePart:rightPad','removePart:rightRetainer']){
  assert.equal(ASSEMBLY.apply(s,id).ok,true,id);
 }
 for(const desired of PIN.targets){
  const time=460*Math.asin(desired*2-1);
  assert.equal(PIN.strike(s,time).precise,true);
 }
 for(const id of ['removePart:pin','removePart:bushing','inspect','installPart:bushing',
  'installPart:pin','installPart:leftRetainer','installPart:rightRetainer',
  'installPart:leftPad','installBolt:l1','installBolt:l2',
  'installPart:rightPad','installBolt:r1','installBolt:r2',
  'installPart:guard','installBolt:g1'])assert.equal(ASSEMBLY.apply(s,id).ok,true,id);
 assert.equal(s.phase,'assembly');
 assert.deepEqual(ASSEMBLY.actions(s).map(a=>a.id),['installBolt:g2']);
 return s;
}
const dir=process.env.PORCARIA_QA_ARTIFACTS||'test-results/sprint31';
fs.mkdirSync(dir,{recursive:true});
const cases=[
 {id:'desktop',width:1366,height:768,hasTouch:false,isMobile:false,ua:undefined},
 {id:'mobile-portrait',width:390,height:844,hasTouch:true,isMobile:true,ua:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'},
 {id:'mobile-landscape',width:844,height:390,hasTouch:true,isMobile:true,ua:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'}
];
function slug(s){return s.replace(/[^a-z0-9-]/gi,'-');}
async function open(page,panel,phone){
 if(phone){
  await page.locator('#mobileSectors').click();
  await page.locator('#primaryNav [data-open-panel="'+panel+'"]').click();
 }else await page.locator('#primaryNav [data-open-panel="'+panel+'"]').click();
 await page.locator('#menuOverlay').waitFor({state:'visible'});
 assert.equal(await page.locator('[data-panel="'+panel+'"].is-open').count(),1,'painel ativo '+panel);
}
async function close(page){await page.locator('#closePanel').click();await page.locator('#menuOverlay').waitFor({state:'hidden'});}
async function run(browser,test){
 const context=await browser.newContext({
  viewport:{width:test.width,height:test.height},hasTouch:test.hasTouch,
  isMobile:test.isMobile,userAgent:test.ua||undefined,deviceScaleFactor:1
 });
 const page=await context.newPage(),errors=[];
 page.on('dialog',dialog=>{errors.push('Diálogo nativo inesperado: '+dialog.type());dialog.dismiss();});
 // Phaser CDN substituído por build oficial NPM no CI: offline, determinístico.
 await page.route('https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js',
  route=>route.fulfill({path:require('node:path').resolve('node_modules/phaser/dist/phaser.min.js'),
   contentType:'application/javascript'}));
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto(host,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>document.querySelector('#day')?.textContent?.startsWith('DIA '),
   {timeout:60000});
  await page.locator('#game canvas').waitFor({state:'attached',timeout:30000})
   .catch(async()=>{throw Error('Phaser não criou canvas: '+(await page.locator('#game').innerText()).slice(0,300)+'; '+errors.join('; '));});
  assert.equal(await page.locator('#game canvas').count(),1,'Phaser canvas disponível');
  await page.screenshot({path:dir+'/'+test.id+'-oficina.png'});
  for(const p of ['queue','inspection','planning','monitoring']){
   await open(page,p,test.isMobile);
   if(test.isMobile&&['inspection','planning'].includes(p)){
    await page.locator('#menuOverlay .mobile-split-guide').waitFor({state:'visible'});
    const nav=page.locator('#mobilePanelGuide [data-guide-index]');
    assert.ok(await nav.count()>=2,'navegação em 30/70: '+p);
    await nav.nth(1).click();
    assert.equal(await nav.nth(1).getAttribute('aria-current'),'location','marcação seção: '+p);
    const valid=await page.locator('#menuOverlay .modalContent').evaluate(el=>el.scrollHeight>=el.clientHeight&&el.clientWidth>90);
    assert.ok(valid,'área de conteúdo legível no mobile');
   }
   await page.screenshot({path:dir+'/'+test.id+'-'+p+'.png'});
   if(p==='queue'){
    await page.locator('#queueSearch').fill('OS');
    assert.ok(await page.locator('#queue').count()===1);
   }
   await close(page);
  }
  // PCM — confirmação visual real após aprovação de escopo sem diagnóstico/material/ferramenta.
  const fixture=E.create(D,()=>.42);
  const rec=I.plan(fixture,D)[0];
  const n=I.inspectAndRoute(fixture,D,rec.id).notification;
  assert.ok(n&&I.review(fixture,n.id,'approve',{action:'verificar',trade:'mecanica',estimatedHH:2},D,E).ok,
   'fixture: planejamento aprovado sem pré-diagnóstico');
  const received=M.receive(fixture,D,I,{initial:true}).received[0];
  assert.ok(received,'fixture: condição recebida para a sala de controle');
  await page.evaluate(json=>localStorage.setItem('porcaria.phaser.prototype.v01',json),JSON.stringify(fixture));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#game canvas').waitFor({state:'attached',timeout:30000});
  await open(page,'monitoring',test.isMobile);
  const monitor=page.locator('#monitoringPanel .monitorDecisionCard[data-monitor-note="'+received.id+'"]');
  await monitor.waitFor({state:'visible'});
  assert.equal(await monitor.locator('.monitorFindingColumn').count(),1,'achado à esquerda');
  assert.equal(await monitor.locator('.monitorActionColumn').count(),1,'opções à direita');
  assert.equal(await monitor.locator('[data-monitor-action="escalate"]').count(),1,'escalonamento imediato visível');
  assert.equal(await monitor.locator('[data-monitor-action="decide"]').count(),1,'acompanhamento também disponível');
  await page.screenshot({path:dir+'/'+test.id+'-monitor-30-70.png'});
  await monitor.locator('[data-monitor-action="escalate"]').click();
  assert.ok(await page.locator('#monitoringPanel').innerText().then(x=>x.includes('ESCALONADO AO PCM')),
    'escalonamento sem monitoramento prévio');
  await close(page);
  await open(page,'planning',test.isMobile);
  const convert=page.locator('#planningNotifications [data-notification-action="convert"][data-notification-id="'+n.id+'"]');
  await convert.click();
  const warningDialog=page.locator('#pcmConfirmOverlay');
  await warningDialog.waitFor({state:'visible'});
  assert.equal(await page.locator('#pcmConfirmWarnings li').count(),3,'três pendências independentes no diálogo');
  assert.equal(await page.locator('#pcmConfirmCancel').evaluate(x=>document.activeElement===x),true,'foco inicial em cancelar');
  assert.equal(await page.locator('#menuOverlay').evaluate(x=>x.inert),true,'PCM bloqueado durante confirmação');
  await page.screenshot({path:dir+'/'+test.id+'-pcm-confirmacao.png'});
  await page.keyboard.press('Escape');
  await warningDialog.waitFor({state:'hidden'});
  assert.equal(await page.locator('#menuOverlay').evaluate(x=>x.inert),false,'cancelar libera o formulário');
  assert.ok(await convert.count()===1,'cancelar não converte a notificação');
  await convert.click();
  await warningDialog.waitFor({state:'visible'});
  await page.locator('#pcmConfirmProceed').click();
  await warningDialog.waitFor({state:'hidden'});
  assert.ok(await page.locator('#planningNotifications').innerText().then(x=>x.includes('OS GERADA')),
   'confirmar gera OS apenas após decisão do jogador');
  await close(page);
  // Primeiro desafio de oficina: OS de pino do D9, com tentativa única por turno.
  const repair=E.create(D,()=>.42),repairJob=repair.jobs[0];
  const pin=D.scenarios.find(x=>x.id==='INC040');
  repairJob.scene=pin.id;repairJob.title=pin.title;repairJob.modelId=pin.modelId;
  repairJob.asset='EQ07·06';repairJob.stage=6;repairJob.diagRemaining=0;
  repairJob.repairRemaining=100;repairJob.repairTarget=100;
  repair.stock[pin.material]=10;repair.tools[pin.tool]=true;
  assert.equal(E.attach(repair,repairJob.id,repair.team[0].id,0,false),null);
  await page.evaluate(raw=>localStorage.setItem('porcaria.phaser.prototype.v01',raw),JSON.stringify(repair));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#day')?.textContent?.startsWith('DIA '));
  // Dia é texto inicial do HTML; aguardar o canvas garante que events() já registrou os controles.
  await page.locator('#game canvas').waitFor({state:'attached',timeout:30000});
  await open(page,'detail',test.isMobile);
  const startRepair=page.locator('#detail [data-repair-assist-start="'+repairJob.id+'"]');
  assert.equal(await startRepair.count(),1,'desafio visível na OS elegível');
  await startRepair.click();
  const hammerFrame=page.locator('#repairAssistBlueprintFrame');
  await hammerFrame.waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('#repairAssistStage canvas').count(),0,'sem canvas separado de marreta');
  const content=await (await hammerFrame.elementHandle()).contentFrame();
  const assemblyFixture=assembledAlmostComplete();
  const sessionKey='porcaria-workbench-campaign-v1-'+repairJob.id+'-'+repair.tick;
  await content.evaluate(({k,v})=>localStorage.setItem(k,v),{k:sessionKey,v:JSON.stringify(assemblyFixture)});
  await content.evaluate(()=>location.reload());
  const bench=page.frameLocator('#repairAssistBlueprintFrame');
  await bench.locator('[data-action="installBolt:g2"]').waitFor({state:'attached'});
  await page.screenshot({path:dir+'/'+test.id+'-marretar-pino-integrado.png'});
  const last=bench.locator('#actions [data-action="installBolt:g2"]');
  await last.dispatchEvent('pointerdown',{pointerId:77,button:0,clientX:1,clientY:1});
  // Ao concluir 2s, o botão desaparece (re-render); não tentar soltar o nó removido.
  await page.waitForTimeout(2150);
  await page.waitForFunction(()=>document.querySelector('#repairAssistResult')?.textContent?.includes('Bônus válido apenas neste turno.'),{timeout:30000});
  await page.locator('#repairAssistClose').click();
  assert.equal(await startRepair.isDisabled(),true,'recompensa não pode ser repetida');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#day')?.textContent?.startsWith('DIA '));
  // Dia é texto inicial do HTML; aguardar o canvas garante que events() já registrou os controles.
  await page.locator('#game canvas').waitFor({state:'attached',timeout:30000});
  await open(page,'detail',test.isMobile);
  assert.equal(await page.locator('#detail [data-repair-assist-start="'+repairJob.id+'"]').isDisabled(),true,
   'recarregar mantém tentativa registrada');
  await close(page);
  // Ciclo 42.4: não há minigame de torque separado, mas os dados de saves antigos seguem válidos.
  const boltState=E.create(D,()=>.42),boltOrder=boltState.jobs[0];
  const bearing=D.scenarios.find(x=>x.id==='INC001');
  boltOrder.scene=bearing.id;boltOrder.title=bearing.title;boltOrder.modelId=bearing.modelId;
  boltOrder.asset='EQ01·06';boltOrder.stage=6;boltOrder.diagRemaining=0;
  boltOrder.repairRemaining=100;boltOrder.repairTarget=100;
  boltState.stock[bearing.material]=10;boltState.tools[bearing.tool]=true;
  assert.equal(E.attach(boltState,boltOrder.id,boltState.team[0].id,0,false),null);
  await page.evaluate(raw=>localStorage.setItem('porcaria.phaser.prototype.v01',raw),JSON.stringify(boltState));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#game canvas').waitFor({state:'attached',timeout:30000});
  await open(page,'detail',test.isMobile);
  assert.equal(await page.locator('#detail [data-repair-assist-kind="bolt"]').count(),0,
   'minigame de torque removido da interface');
  await close(page);
  // Avanço do turno passa pelo briefing/confirmar, não deve avançar por clique acidental.
  await page.locator('#advance').click();
  assert.equal(await page.locator('[data-panel="shift"].is-open').count(),1,'briefing antes do turno');
  await page.locator('[data-shift-action="cancel"]').click();
  assert.ok((await page.locator('#day').textContent()).includes('DIA 1'),'cancelar turno preserva campanha');
  const fatal=errors.filter(x=>!/audio|WebGL context lost/i.test(x));
  assert.equal(fatal.length,0,'erros JavaScript fatais: '+fatal.join(' | '));
  console.log('OK '+test.id+' · Oficina, Rádio, Inspeção, PCM, Monitoramento, briefing e navegação.');
 }catch(e){
  await page.screenshot({path:dir+'/'+test.id+'-FAILED.png',fullPage:true}).catch(()=>{});
  fs.writeFileSync(dir+'/'+test.id+'-errors.txt',errors.join('\n')+'\n'+String(e?.stack||e));
  throw e;
 }finally{await context.close();}
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
 try{for(const test of cases)await run(browser,test);}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
