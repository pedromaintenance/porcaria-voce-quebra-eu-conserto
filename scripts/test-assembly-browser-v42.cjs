'use strict';
/* Ciclo 42.2 — browser real: desktop, touch e proteção contra gesto interrompido. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright-core');
const M=require('../phaser-play/assembly-sequence.js');
const HOST=process.env.PORCARIA_HOLD_URL||'http://127.0.0.1:8765/phaser-play/assembly-workbench.html';
const artifacts='test-results/assembly-v42';
fs.mkdirSync(artifacts,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function point(page,id){
  const target=page.locator('[data-action="'+id+'"] .bp-hit-target').first();
  await target.waitFor({state:'attached'});
  const box=await target.boundingBox();
  assert(box&&box.width>0&&box.height>0,'Alvo deve possuir área clicável: '+id);
  return {x:box.x+box.width/2,y:box.y+box.height/2,width:box.width};
}
async function desktop(browser){
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(HOST,{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#machine').getAttribute('viewBox'),'0 0 900 480');
    assert.equal(await page.locator('#availableCount').innerText(),'2 opções disponíveis');
    assert.match(await page.locator('#taskGuide').innerText(),/fixadores destacados/);
    let p=await point(page,'removeBolt:g1');
    await page.mouse.move(p.x,p.y);await page.mouse.down();await sleep(600);await page.mouse.up();
    await sleep(480);
    assert.equal(await page.locator('#history').innerText().then(t=>t.includes('Parafuso solto')),false,
      'Clique interrompido não desmonta fixador');
    assert.equal(await page.locator('#holdMeter').getAttribute('aria-valuenow'),'0');
    p=await point(page,'removeBolt:g1');
    await page.mouse.move(p.x,p.y);await page.mouse.down();await sleep(2100);await page.mouse.up();
    assert.equal(await page.locator('#history').innerText().then(t=>t.includes('Parafuso solto')),true);
    assert.equal(await page.locator('#actionsCount').innerText(),'1 interações');
    assert.equal(await page.locator('[data-action="removeBolt:g1"]').count(),0,'Alvo removido após progresso completo');
    assert.equal(await page.locator('#inventoryCount').innerText(),'1 item','peça vai para bancada');
    assert.equal(await page.locator('[data-inventory-item="g1"]').count(),1);
    // Uma recarga não apaga a peça retirada nem reabre o mesmo parafuso.
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#actionsCount').innerText(),'1 interações');
    assert.equal(await page.locator('#inventoryCount').innerText(),'1 item');
    p=await point(page,'removeBolt:g2');
    await page.mouse.move(p.x,p.y);await page.mouse.down();await sleep(400);
    await page.mouse.move(p.x+75,p.y);await sleep(500);await page.mouse.up();await sleep(400);
    assert.equal(await page.locator('#actionsCount').innerText(),'1 interações',
      'Arrastar longe cancela sem progresso persistido');
    // Teclado: retenção de ESPAÇO durante 2 segundos também aplica a ação.
    const keyboardTarget=page.locator('#actions [data-action="removeBolt:g2"]');
    await keyboardTarget.focus();
    await page.keyboard.down('Space');await sleep(2100);await page.keyboard.up('Space');
    assert.equal(await page.locator('#actionsCount').innerText(),'2 interações');
    assert.match(await page.locator('#taskGuide').innerText(),/Remova a peça liberada/);
    p=await point(page,'removePart:guard');
    await page.mouse.move(p.x,p.y);await page.mouse.down();await sleep(2100);await page.mouse.up();
    assert.equal(await page.locator('#actionsCount').innerText(),'3 interações');
    assert.equal(await page.locator('[data-inventory-item="guard"]').count(),1,'proteção no inventário');
    assert.equal(await page.locator('#inventoryCount').innerText(),'3 itens');
    assert.equal(errors.length,0,errors.join('; '));
    await page.screenshot({path:artifacts+'/desktop-blueprint.png',fullPage:true});
    // O pino especial só aparece após a desmontagem de apoios e travas.
    const pinScene=M.create();
    for(const id of ['removeBolt:g1','removeBolt:g2','removePart:guard',
      'removeBolt:l1','removeBolt:l2','removePart:leftPad','removePart:leftRetainer',
      'removeBolt:r1','removeBolt:r2','removePart:rightPad','removePart:rightRetainer'])
      assert.equal(M.apply(pinScene,id).ok,true,id);
    await page.evaluate(value=>localStorage.setItem('porcaria-workbench-demo-v1',value),
      JSON.stringify(pinScene));
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#impactMini').count(),1,'marreta aparece apenas após liberar o pino');
    assert.equal(await page.locator('#actions [data-action="removePart:pin"]').count(),0,
      'pino não pode ser removido com hold, precisa de impactos');
    await page.locator('#actions [data-strike-pin]').click();
    assert.equal(await page.locator('#impactTitle').innerText().then(v=>v.includes('GOLPE 2/3')),true,
      'primeiro impacto incrementa o contador sem retirar pino');
    assert.equal(await page.locator('#impactFx .impact-fx').count(),1,
      'efeito vetorial aparece após o primeiro impacto');
    await page.screenshot({path:artifacts+'/desktop-first-impact.png',fullPage:true});
    await page.locator('#actions [data-strike-pin]').click();
    await page.locator('#actions [data-strike-pin]').click();
    await page.waitForFunction(()=>document.querySelector('[data-inventory-item="pin"]')!==null);
    const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('porcaria-workbench-demo-v1')));
    assert.equal(state.pinImpact.round,3);
    assert.equal(state.installed.pin,false,'três golpes liberam extração mecânica');
    assert.equal(await page.locator('#impactMini').count(),0,'desafio desaparece após a remoção');
    assert.equal(errors.length,0,errors.join('; '));
    await page.screenshot({path:artifacts+'/desktop-pin-integrated.png',fullPage:true});
  }finally{await context.close();}
}
async function mobile(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0 Mobile Safari/537.36'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(HOST,{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#machine').getAttribute('viewBox'),'145 102 610 290','zoom mobile ativo');
    const p=await point(page,'removeBolt:g1');
    assert(p.width>=44,'hotspot móvel em pixels CSS deve ter tamanho confortável: '+p.width);
    const client=await context.newCDPSession(page);
    const start=()=>client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y,radiusX:8,radiusY:8}]});
    const end=()=>client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await start();await sleep(550);await end();await sleep(430);
    assert.equal(await page.locator('#actionsCount').innerText(),'0 interações','toque curto não deve remover');
    await start();await sleep(2120);await end();
    assert.equal(await page.locator('#actionsCount').innerText(),'1 interações','hold touch conclui uma ação');
    const pinScene=M.create();
    for(const id of ['removeBolt:g1','removeBolt:g2','removePart:guard',
      'removeBolt:l1','removeBolt:l2','removePart:leftPad','removePart:leftRetainer',
      'removeBolt:r1','removeBolt:r2','removePart:rightPad','removePart:rightRetainer'])
      assert.equal(M.apply(pinScene,id).ok,true,id);
    await page.evaluate(value=>localStorage.setItem('porcaria-workbench-demo-v1',value),
      JSON.stringify(pinScene));
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#machine').getAttribute('viewBox'),'145 95 610 320',
      'marreta inteira deve caber na prancha móvel');
    const impact=page.locator('#impactMini [data-strike-pin]');
    await impact.waitFor({state:'attached'});
    const bounds=await impact.boundingBox();
    assert(bounds&&bounds.width>110&&bounds.height>22,'área de golpe deve ser confortável no celular');
    await impact.tap();
    assert.equal(await page.locator('#impactTitle').innerText().then(v=>v.includes('GOLPE 2/3')),true);
    assert.equal(errors.length,0,errors.join('; '));
    await page.screenshot({path:artifacts+'/mobile-blueprint.png',fullPage:true});
  }finally{await context.close();}
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,
   args:['--no-sandbox','--disable-dev-shm-usage']});
 try{await desktop(browser);await mobile(browser);console.log('OK: hold 2s desktop e mobile, zoom, captura e cancelamentos.');}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
