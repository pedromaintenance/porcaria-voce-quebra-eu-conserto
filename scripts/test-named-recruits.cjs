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
 assert.equal(raw.toString('ascii',12,16),'VP8X');
 assert.ok((raw[20]&16)!==0,key+': alpha');
 assert.equal(1+raw[24]+(raw[25]<<8)+(raw[26]<<16),1160);
 assert.equal(1+raw[27]+(raw[28]<<8)+(raw[29]<<16),1244);
 assert.ok(E.RECRUIT_POOL.some(p=>p.sprite===key));
}
console.log('OK: arquivos de Barbosa, Garcia, Braga, Almeida, Sousa e Pereira integrados.');
