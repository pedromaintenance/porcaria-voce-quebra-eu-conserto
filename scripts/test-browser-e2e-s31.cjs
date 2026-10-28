/* S31-03: teste browser real; executa somente via workflow de QA visual.
 * Não acessa saves pessoais: contexto de navegador isolado e efêmero.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright-core');
const D=require('../game-data.json'),E=require('../engine.js'),I=require('../phaser-play/inspection.js');
const host=process.env.PORCARIA_TEST_URL||'http://127.0.0.1:8765/phaser-play/';
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
  await page.evaluate(json=>localStorage.setItem('porcaria.phaser.prototype.v01',json),JSON.stringify(fixture));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#day')?.textContent?.startsWith('DIA '));
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
