/* P.O.R.C.A.R.I.A. — exemplo de carregamento do elenco no Phaser 3
 * IMPORTANTE: spritesheets binários pendentes na branch; copiar do ZIP antes de executar.
 */
const ELENCO_IDS=['mec_ana','mec_rafael','mec_lia','ele_davi','ele_bia','pcm_clara','pcm_joao','brig_nina'];
const ELENCO_FRAME={width:260,height:300};
function preloadElenco(scene,assetBase='assets/workers'){
  for(const id of ELENCO_IDS){
    scene.load.spritesheet(id,`${assetBase}/${id}/spritesheet.png`,{
      frameWidth:ELENCO_FRAME.width,frameHeight:ELENCO_FRAME.height
    });
  }
}
function registrarAnimacoesElenco(scene){
  for(const id of ELENCO_IDS){
    for(const [action,frames] of Object.entries({idle:[0],walk:[1,2,3,4],inspect:[5],work:[6],point:[7]})){
      const key=`${id}-${action}`;
      if(scene.anims.exists(key))continue;
      scene.anims.create({key,frames:frames.map(frame=>({key:id,frame})),frameRate:action==='walk'?5:1,repeat:action==='walk'?-1:0});
    }
  }
}
