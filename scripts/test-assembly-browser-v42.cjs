'use strict';
/* Ciclo 42.2 — browser real: desktop, touch e proteção contra gesto interrompido. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright-core');
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
    p=await point(page,'removeBolt:g2');
    await page.mouse.move(p.x,p.y);await page.mouse.down();await sleep(400);
    await page.mouse.move(p.x+75,p.y);await sleep(500);await page.mouse.up();await sleep(400);
    assert.equal(await page.locator('#actionsCount').innerText(),'1 interações',
      'Arrastar longe cancela sem progresso persistido');
    assert.equal(errors.length,0,errors.join('; '));
    await page.screenshot({path:artifacts+'/desktop-blueprint.png',fullPage:true});
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
