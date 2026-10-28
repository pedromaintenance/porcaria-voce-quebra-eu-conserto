/* P.O.R.C.A.R.I.A. — primeiro minigame Phaser: retirada assistida de pino (arcade abstrato). */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.PORCARIA_REPAIR_MINIGAMES=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function launchHammer({Phaser,parent,onFinish}){
  if(!Phaser||!parent||typeof onFinish!=='function')throw Error('Interface de minigame indisponível.');
  class HammerPin extends Phaser.Scene{
   constructor(){super({key:'HammerPin'});this.hits=0;this.round=0;this.elapsed=0;this.finished=false;}
   create(){
    this.add.rectangle(320,160,640,320,0x0a1d2d);
    this.add.rectangle(320,38,606,58,0x183448).setStrokeStyle(2,0xd5a04c);
    this.add.text(320,25,'RETIRADA DE PINO · ASSISTÊNCIA MECÂNICA',{
     fontFamily:'monospace',fontSize:'16px',color:'#ffda97',fontStyle:'bold'
    }).setOrigin(.5);
    this.add.text(320,65,'Acione no instante em que o cursor passar pela janela dourada.',{
     fontFamily:'monospace',fontSize:'11px',color:'#c9dce8'
    }).setOrigin(.5);
    this.add.rectangle(320,164,490,94,0x304759).setStrokeStyle(3,0x8192a2);
    this.add.rectangle(320,164,340,34,0x8d9baa).setStrokeStyle(2,0xdae5ec);
    this.add.rectangle(320,164,50,52,0xbabfc8).setStrokeStyle(2,0x1e303d);
    this.track=this.add.graphics();
    this.feedback=this.add.text(320,245,'ESPAÇO / ENTER / TOQUE PARA GOLPEAR',{
     fontFamily:'monospace',fontSize:'14px',color:'#ffe5af',align:'center'
    }).setOrigin(.5);
    this.counter=this.add.text(320,283,'GOLPE 1/3 · ACERTOS 0',{
     fontFamily:'monospace',fontSize:'13px',color:'#c1d9e9'
    }).setOrigin(.5);
    this.input.on('pointerdown',()=>this.strike());
    this.input.keyboard?.on('keydown-SPACE',()=>this.strike());
    this.input.keyboard?.on('keydown-ENTER',()=>this.strike());
   }
   update(_time,delta){
    if(this.finished)return;
    this.elapsed+=Math.min(70,delta);
    const progress=(Math.sin(this.elapsed/460)+1)/2;
    const target=[.32,.69,.46][this.round];
    this.progress=progress;
    this.track.clear();
    this.track.fillStyle(0x07121f).fillRoundedRect(75,204,490,16,6);
    this.track.fillStyle(0xffc457).fillRoundedRect(80+target*455-29,205,58,14,5);
    this.track.lineStyle(3,0xe1f3ff).lineBetween(80+progress*455,194,80+progress*455,229);
   }
   strike(){
    if(this.finished)return;
    const target=[.32,.69,.46][this.round];
    const distance=Math.abs((this.progress??0)-target);
    if(distance<=.07)this.hits++;
    this.feedback.setText(distance<=.07?'GOLPE PRECISO!':distance<=.16?'IMPACTO PARCIAL':'FORA DA ZONA DE PRECISÃO')
     .setColor(distance<=.07?'#89e3ac':'#ffcb82');
    this.round++;
    if(this.round>=3){
     this.finished=true;
     this.counter.setText('ATIVIDADE CONCLUÍDA · '+this.hits+'/3 GOLPES PRECISOS');
     this.feedback.setText('RESULTADO REGISTRADO NA OS');
     onFinish(this.hits);
    }else this.counter.setText('GOLPE '+(this.round+1)+'/3 · ACERTOS '+this.hits);
   }
  }
  return new Phaser.Game({
   type:Phaser.CANVAS,parent,width:640,height:320,
   backgroundColor:'#081d2d',
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},
   render:{pixelArt:true,antialias:false},
   scene:[HammerPin]
  });
 }
 return Object.freeze({launchHammer});
});
