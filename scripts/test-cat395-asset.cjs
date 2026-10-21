/* Regressão do novo asset CAT 395: pixel art original, 1536x1027 px (+3 transparentes). */
'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');const p=path.join(root,'phaser-play/assets/equipment/cat395.png');
const png=fs.readFileSync(p);
assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a','assinatura PNG');
assert.equal(png.readUInt32BE(16),1536,'largura preservada');
assert.equal(png.readUInt32BE(20),1027,'altura original 1024 + 3 px');
assert.equal(png[25],6,'PNG RGBA');
assert.equal(crypto.createHash('sha256').update(png).digest('hex'),'d1e3f7e579e25344fd26e14c0b8efe0df32dc8aadcc2de5fee54508f96ea0000','asset homologado: padding sem edição da arte');
const game=fs.readFileSync(path.join(root,'phaser-play/game.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const html=fs.readFileSync(path.join(root,'phaser-play/index.html'),'utf8');
assert.ok(game.includes("excavator:'./assets/equipment/cat395.png?v=20261019-3px'"));
assert.ok(sw.includes("'./phaser-play/assets/equipment/cat395.png'"));
assert.ok(sw.includes('porcaria-vqec-20261019-v111'));
assert.ok(html.includes('game.js?v=0.9.4'));
console.log('OK: CAT 395 1536x1027 RGBA, SHA-256 validado, cache PWA e Phaser versionados.');
