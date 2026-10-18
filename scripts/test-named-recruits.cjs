/* Integridade e vinculo de seis novos atlas WebP transparentes v0.8.20. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),E=require(path.join(root,'engine.js'));
const data=JSON.parse(fs.readFileSync(path.join(root,'phaser-play/assets/characters/recruits-0820.json'),'utf8'));
assert.equal(data.dimensions.width,1160);assert.equal(data.dimensions.height,1244);
for(const [key,meta] of Object.entries(data.assets)){
 const file=path.join(root,'phaser-play/assets/characters',key+'-4poses.webp');
 assert.ok(fs.existsSync(file),key+': arquivo faltando; publicar o WebP da pasta ZIP antes do merge');
 const raw=fs.readFileSync(file);assert.equal(raw.length,meta.size,key+': bytes');
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),meta.sha256,key+': hash');
 assert.equal(raw.toString('ascii',0,4),'RIFF');assert.equal(raw.toString('ascii',8,12),'WEBP');
 // WebP lossless compacto usa VP8L; o lote anterior com perdas usava VP8X.
 const kind=raw.toString('ascii',12,16);
 assert.equal(kind,'VP8L',key+': formato WebP sem perdas esperado');
 assert.equal(raw[20],0x2f,key+': assinatura VP8L');
 const w=1+(raw[21]|((raw[22]&0x3f)<<8));
 const h=1+((raw[22]>>6)|(raw[23]<<2)|((raw[24]&0x0f)<<10));
 assert.equal(w,1160,key+': largura');
 assert.equal(h,1244,key+': altura');
 assert.ok((raw[24]&0x10)!==0,key+': sinalizador alfa VP8L');
 assert.ok(E.RECRUIT_POOL.some(p=>p.sprite===key));
}
console.log('OK: arquivos de Barbosa, Garcia, Braga, Almeida, Sousa e Pereira integrados.');
