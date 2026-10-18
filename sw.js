/* P.O.R.C.A.R.I.A.: network-first para sempre atualizar o Pages; offline como fallback. */
const CACHE='porcaria-vqec-20261018-v102';
const CORE=['./','./index.html','./engine.js','./game-data.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./phaser-play/index.html','./phaser-play/game.js','./phaser-play/render-quality.js','./phaser-play/assets/equipment/cat777e_v3.webp','./phaser-play/assets/equipment/sandvik_dr410i_v2.webp','./phaser-play/assets/equipment/cat966-loader-v0819.webp','./phaser-play/assets/equipment/cat16-grader-v0819.webp','./phaser-play/assets/equipment/catd9-dozer-v0819.webp','./phaser-play/assets/characters/costa-4poses.webp','./phaser-play/assets/characters/barbosa-4poses.webp','./phaser-play/assets/characters/garcia-4poses.webp','./phaser-play/assets/characters/braga-4poses.webp','./phaser-play/assets/characters/almeida-4poses.webp','./phaser-play/assets/characters/sousa-4poses.webp','./phaser-play/assets/characters/pereira-4poses.webp','./phaser-play/assets/characters/silva-4poses.webp','./phaser-play/assets/characters/santos-4poses.webp','./phaser-play/assets/characters/moura-4poses.webp','./phaser-play/assets/characters/pedro-4poses.webp','./phaser-play/assets/characters/geovane-4poses.webp','./phaser-play/assets/characters/junior/junior-work-4poses.webp','./phaser-play/assets/characters/junior/junior-training-4poses.webp','./phaser-play/readiness.js','./phaser-play/diagnostic-board.js','./phaser-play/diagnostic-view.js','./phaser-play/closed-orders.js','./phaser-play/scene-map.json','./phaser-play/assets/oficina-base.avif','./phaser-play/assets/oficina-diurna-fullframe.avif','./phaser-play/assets/oficina-noturna-hq.avif'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('porcaria-vqec-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;
 e.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{
     const response=await fetch(e.request,{cache:'no-store'});
     if(response.ok)await cache.put(e.request,response.clone());
     return response;
   }catch(error){
     const cached=await cache.match(e.request);
     if(cached)return cached;
     throw error;
   }
 })());
});
