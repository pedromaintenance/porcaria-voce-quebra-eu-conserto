/* P.O.R.C.A.R.I.A.: network-first para sempre atualizar o Pages; offline como fallback. */
const CACHE='porcaria-vqec-20261016-v071';
const CORE=['./','./index.html','./engine.js','./game-data.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./phaser-play/index.html','./phaser-play/game.js','./phaser-play/scene-map.json','./phaser-play/assets/oficina-base.avif'];
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
