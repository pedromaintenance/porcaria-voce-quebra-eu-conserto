/* P.O.R.C.A.R.I.A. 0.8.13 — dia original e noite usam a MESMA geometria fullFrame. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const assets=path.join(root,'phaser-play','assets');
const official={
 day:{file:'oficina-diurna-fullframe.avif',size:181346,hash:'31453309223d11800e78276edd2e02b641a82eb4a2ffb52982dbc766e0a003c7'},
 night:{file:'oficina-noturna-hq.avif',size:160249,hash:'0637e55b3a1978842c7aa71e27c763b176ea7c8438a82ee5bc711140e1a72c15'}
};
for(const [period,p] of Object.entries(official)){
 const b=fs.readFileSync(path.join(assets,p.file));
 assert.equal(b.length,p.size,period+' asset não pode ser truncado');
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),p.hash,period+' conserva o derivado aprovado');
 assert.equal(b.toString('ascii',4,8),'ftyp',period+' formato AVIF');
 assert.equal(b.toString('ascii',8,12),'avif',period+' brand AVIF');
 const at=b.indexOf(Buffer.from('ispe'));assert.ok(at>0,period+' ispe existe');
 assert.equal(b.readUInt32BE(at+8),1976,period+' largura da imagem original');
 assert.equal(b.readUInt32BE(at+12),796,period+' altura da imagem original');
}
const map=JSON.parse(fs.readFileSync(path.join(root,'phaser-play','scene-map.json'),'utf8'));
const script=fs.readFileSync(path.join(root,'phaser-play','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play','index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.equal(map.backgroundProfiles.fullFrame.sourceReference.width,1976);
assert.equal(map.backgroundProfiles.fullFrame.sourceReference.height,796);
assert.equal(map.backgroundProfiles.fullFrame.bays.length,3);
assert.deepEqual(map.backgroundProfiles.fullFrame.bays.map(b=>b.spriteWorld.x),[568,852,1104],
 'posições do cenário completo anteriormente aprovadas permanecem');
assert.deepEqual(map.backgroundProfiles.fullFrame.bays.map(b=>b.spriteWorld.groundY),[408,408,408]);
assert.ok(script.includes("this.load.image('repoDayWorkshopBG','./assets/oficina-diurna-fullframe.avif?v=0.8.13')"),
 'dia utiliza binário oficial em vez de gerar imagem');
assert.ok(script.includes("this.load.image('repoNightWorkshopBG','./assets/oficina-noturna-hq.avif?v=0.8.4')"));
assert.ok(script.includes("!night&&this.textures.exists('repoDayWorkshopBG')?'repoDayWorkshopBG'"),
 'turno diurno seleciona quadro completo');
assert.ok(script.includes("this.setBackdrop(img,key==='repoWorkshopBG'?'cropped':'fullFrame')"),
 'ambos os arquivos originais usam layout fullFrame; recortado somente fallback');
assert.ok(script.includes("if(night&&this.nightBackdropImage){this.setBackdrop(this.nightBackdropImage,'fullFrame');return}"),
 'override noturno preservado');
assert.ok(script.includes("if(this.customBackdrop)return;"),'override global não muda');
assert.ok(script.includes("ctx.drawImage(img,0,0,width,height,0,0,canvas.width,canvas.height)"),
 'nenhum recorte nem deslocamento artificial da imagem');
assert.ok(!script.includes("ctx.drawImage(img,320,130,"),'recorte legado não reaplicado');
assert.ok(!script.includes("key==='repoNightWorkshopBG'?'fullFrame':'cropped'"),
 'não há mais diferença de geometria entre dia e noite');
assert.ok(script.includes('const activeBays=this.activeBayLayout||BAY_LAYOUT'),'sprites seguem layout ativo');
assert.ok(html.includes('game.js?v=0.8.30'),'cache da interface atualizado');
assert.ok(sw.includes('porcaria-vqec-20261019-v109'));
assert.ok(sw.includes("'./phaser-play/assets/oficina-diurna-fullframe.avif'"));
assert.ok(sw.includes("'./phaser-play/assets/oficina-noturna-hq.avif'"));
console.log('OK: original diurno 1976x796 preservado, AVIF íntegro, dia/noite fullFrame, assets, PWA e geometria.');
