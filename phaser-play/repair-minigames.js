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

 // Desafio inteiramente abstrato: diagrama e sequência não representam especificação Caterpillar.
 function launchBolt({Phaser,parent,onFinish}){
  if(!Phaser||!parent||typeof onFinish!=='function')throw Error('Interface de minigame indisponível.');
  const sequence=[0,3,1,2],coords=[[220,134],[420,134],[220,223],[420,223]];
  class BoltTightening extends Phaser.Scene{
   constructor(){super({key:'BoltTightening'});this.round=0;this.hits=0;this.elapsed=0;this.finished=false;this.phase='select';this.progress=0;}
   create(){
    this.add.rectangle(320,180,640,360,0x0a1d2d);
    this.add.rectangle(320,31,615,52,0x183448).setStrokeStyle(2,0xe0aa56);
    this.add.text(320,31,'FIXADORES · ASSISTÊNCIA MECÂNICA',{
     fontFamily:'monospace',fontSize:'16px',fontStyle:'bold',color:'#ffda97'
    }).setOrigin(.5);
    this.add.text(320,76,'1–4: selecionar fixador · ESPAÇO/ENTER: confirmar aperto',{
     fontFamily:'monospace',fontSize:'12px',color:'#c6dbe9'
    }).setOrigin(.5);
    this.add.rectangle(320,177,290,176,0x536a77).setStrokeStyle(5,0x98abb6);
    this.add.circle(320,177,43,0x263947).setStrokeStyle(3,0xb5c8d2);
    this.fasteners=coords.map(([x,y],i)=>{
     const circle=this.add.circle(x,y,27,0x9babb9).setStrokeStyle(3,0x273c4c).setInteractive({useHandCursor:true});
     const label=this.add.text(x,y,String(i+1),{fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#0b2334'}).setOrigin(.5);
     circle.on('pointerdown',()=>this.selectBolt(i));
     label.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.selectBolt(i));
     return {circle,label};
    });
    this.add.rectangle(320,301,504,40,0x07121f).setStrokeStyle(2,0x547083).setInteractive({useHandCursor:true})
      .on('pointerdown',()=>this.tighten());
    this.gauge=this.add.graphics(); // Renderizar medidor ACIMA da placa de clique, sem interceptar o pointer.
    this.status=this.add.text(320,103,'',{fontFamily:'monospace',fontSize:'12px',color:'#ffe2ae'}).setOrigin(.5);
    this.message=this.add.text(320,341,'',{fontFamily:'monospace',fontSize:'12px',color:'#c3dfeb'}).setOrigin(.5);
    this.refresh();
   }
   refresh(){
    const current=sequence[this.round];
    if(this.finished){
     this.status.setText('ATIVIDADE FINALIZADA · '+this.hits+'/4 FIXADORES PRECISOS');
     this.message.setText('BÔNUS REGISTRADO NA ORDEM');
    }else{
     this.status.setText('ETAPA '+(this.round+1)+'/4 · SELECIONE FIXADOR '+(current+1)
      +(this.phase==='tighten'?' · ACIONE NA FAIXA DOURADA':''));
     this.message.setText(this.phase==='select'?'TOQUE NO FIXADOR INDICADO':
       'AGORA TOQUE NA BARRA OU PRESSIONE ESPAÇO');
    }
    this.fasteners.forEach((bolt,i)=>{
     const done=sequence.slice(0,this.round).includes(i);
     const active=!this.finished&&current===i;
     bolt.circle.setFillStyle(done?0x69aa8a:active?0xe0b460:0x9babb9);
     bolt.label.setColor(done?'#061e2d':'#112738');
    });
   }
   selectBolt(index){
    if(this.finished||this.phase!=='select')return;
    if(!Number.isInteger(index)||index<0||index>3)return;
    if(index!==sequence[this.round]){
     this.round++;this.phase='select';this.elapsed=0;
     if(this.round>=4)this.complete();else this.refresh();
     return;
    }
    this.phase='tighten';this.elapsed=0;this.refresh();
   }
   update(_time,delta){
    if(this.finished)return;
    this.elapsed+=Math.min(70,delta);
    this.progress=(Math.sin(this.elapsed/520)+1)/2;
    this.gauge.clear();
    this.gauge.fillStyle(0x30475c).fillRoundedRect(78,290,484,22,5);
    this.gauge.fillStyle(0xeab651).fillRoundedRect(78+0.5*484-41,291,82,20,4);
    this.gauge.lineStyle(3,0xe6f3fb).lineBetween(78+this.progress*484,283,78+this.progress*484,318);
   }
   tighten(){
    if(this.finished||this.phase!=='tighten')return;
    if(Math.abs(this.progress-.5)<=.105)this.hits++;
    this.round++;this.phase='select';this.elapsed=0;
    if(this.round>=4)this.complete();else this.refresh();
   }
   complete(){
    if(this.finished)return;
    this.finished=true;this.refresh();onFinish(this.hits);
   }
  }
  return new Phaser.Game({
   type:Phaser.CANVAS,parent,width:640,height:360,
   backgroundColor:'#081d2d',
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY},
   render:{pixelArt:true,antialias:false},
   scene:[BoltTightening]
  });
 }
 function launch(kind,args){
  if(kind==='hammer')return launchHammer(args);
  if(kind==='bolt')return launchBolt(args);
  throw Error('Minigame desconhecido.');
 }
 return Object.freeze({launch,launchHammer,launchBolt});
});
