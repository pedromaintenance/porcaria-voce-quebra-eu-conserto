/* Perfil de rasterizacao Phaser 3.90: 1x/2x sem recorrer a GameConfig.resolution (removido). */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.PORCARIA_RENDER_QUALITY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function selectScale({viewportWidth=0,devicePixelRatio=1,override=null}={}){
  const force=String(override??'').trim().toLowerCase();
  if(['1','low','standard','leve'].includes(force))return 1;
  if(['2','high','sharp','alta'].includes(force))return 2;
  const width=Number(viewportWidth)||0;
  const dpr=Number(devicePixelRatio)||1;
  // O celular ja reduz o canvas base na tela e tem menor orcamento GPU.
  return width>=960||(width>=700&&dpr>=2)?2:1;
 }
 function profile({viewportWidth=0,devicePixelRatio=1,override=null,sceneRef={}}={}){
  const scale=selectScale({viewportWidth,devicePixelRatio,override});
  const worldWidth=Number(sceneRef.width)||1080;
  const worldHeight=Number(sceneRef.height)||450;
  const worldX=Number(sceneRef.worldX)||0;
  const worldY=Number(sceneRef.worldY)||0;
  return Object.freeze({
   scale,width:worldWidth*scale,height:worldHeight*scale,
   worldWidth,worldHeight,centerX:worldX+worldWidth/2,centerY:worldY+worldHeight/2
  });
 }
 return Object.freeze({selectScale,profile});
});
