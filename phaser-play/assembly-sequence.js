/* PORCARIA | Ciclo 42 — sequência lúdica, desenho original. Sem manuais no jogador.
   Motor independente, não altera ordens, economia ou saves da campanha. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.PORCARIA_ASSEMBLY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const parts=Object.freeze([
    {id:'guard',name:'Proteção inferior',before:[],bolts:['g1','g2'],assembleAfter:['leftPad','rightPad']},
    {id:'leftPad',name:'Apoio esquerdo',before:['guard'],bolts:['l1','l2'],assembleAfter:['leftRetainer']},
    {id:'rightPad',name:'Apoio direito',before:['guard'],bolts:['r1','r2'],assembleAfter:['rightRetainer']},
    {id:'leftRetainer',name:'Trava esquerda',before:['leftPad'],bolts:[],assembleAfter:['pin']},
    {id:'rightRetainer',name:'Trava direita',before:['rightPad'],bolts:[],assembleAfter:['pin']},
    {id:'pin',name:'Pino de articulação',before:['leftRetainer','rightRetainer'],bolts:[],assembleAfter:['bushing']},
    {id:'bushing',name:'Bucha desgastada',before:['pin'],bolts:[],assembleAfter:[]}
  ]);
  const byPart=Object.freeze(Object.fromEntries(parts.map(p=>[p.id,p])));
  const labels=Object.freeze({g1:'Parafuso superior da proteção',g2:'Parafuso inferior da proteção',
    l1:'Parafuso 1 do apoio esquerdo',l2:'Parafuso 2 do apoio esquerdo',
    r1:'Parafuso 1 do apoio direito',r2:'Parafuso 2 do apoio direito'});
  const allBolts=Object.keys(labels);
  function create(){
    return {version:1,phase:'disassembly',
      installed:Object.fromEntries(parts.map(p=>[p.id,true])),
      fastened:Object.fromEntries(allBolts.map(b=>[b,true])),
      inventory:[],replacementReady:false,actions:0,errors:0,log:[]};
  }
  function isValid(s){
    return !!(s&&s.version===1&&['disassembly','inspection','assembly','complete'].includes(s.phase)
      &&s.installed&&s.fastened&&Array.isArray(s.inventory)&&Array.isArray(s.log)
      &&parts.every(p=>typeof s.installed[p.id]==='boolean')
      &&allBolts.every(b=>typeof s.fastened[b]==='boolean')
      &&Number.isInteger(s.actions)&&s.actions>=0&&Number.isInteger(s.errors)&&s.errors>=0);
  }
  function actions(s){
    if(!isValid(s)||s.phase==='complete')return [];
    if(s.phase==='inspection')return [{id:'inspect',type:'inspect',label:'Inspecionar e separar peça danificada'}];
    const available=[];
    for(const p of parts){
      if(s.phase==='disassembly'){
        if(!s.installed[p.id]||!p.before.every(dep=>!s.installed[dep]))continue;
        for(const bolt of p.bolts)if(s.fastened[bolt])
          available.push({id:'removeBolt:'+bolt,type:'removeBolt',part:p.id,bolt,label:'Soltar '+labels[bolt].toLowerCase()});
        if(p.bolts.every(b=>!s.fastened[b]))
          available.push({id:'removePart:'+p.id,type:'removePart',part:p.id,label:'Retirar '+p.name.toLowerCase()});
      }else if(s.phase==='assembly'){
        if(!p.assembleAfter.every(dep=>s.installed[dep]&&byPart[dep].bolts.every(b=>s.fastened[b])))continue;
        if(!s.installed[p.id]){
          available.push({id:'installPart:'+p.id,type:'installPart',part:p.id,
            label:'Instalar '+(p.id==='bushing'?'bucha nova':p.name.toLowerCase())});
        }else{
          for(const bolt of p.bolts)if(!s.fastened[bolt])
            available.push({id:'installBolt:'+bolt,type:'installBolt',part:p.id,bolt,label:'Fixar '+labels[bolt].toLowerCase()});
        }
      }
    }
    return available;
  }
  function apply(s,id){
    if(!isValid(s))return {ok:false,reason:'Estado do jogo inválido.'};
    const match=actions(s).find(a=>a.id===id);
    if(!match){s.errors++;return {ok:false,reason:'Esta peça ainda está bloqueada. Siga a sequência de desmontagem.'};}
    if(id==='removePart:pin'&&s.pinImpact?.round!==3)return {ok:false,reason:'Conclua os três golpes controlados antes de retirar o pino.'};
    if(match.type==='inspect'){
      s.replacementReady=true;s.phase='assembly';
      s.log.push('Peça danificada identificada: separar bucha nova.');
    } else if(match.type==='removeBolt'){
      s.fastened[match.bolt]=false;s.inventory.push({kind:'bolt',id:match.bolt});
      s.log.push('Parafuso solto: '+labels[match.bolt]);
    } else if(match.type==='removePart'){
      s.installed[match.part]=false;s.inventory.push({kind:'part',id:match.part});
      s.log.push('Retirada: '+byPart[match.part].name);
    } else if(match.type==='installPart'){
      s.installed[match.part]=true;
      const ix=s.inventory.findIndex(i=>i.kind==='part'&&i.id===match.part);
      if(ix>=0)s.inventory.splice(ix,1);
      s.log.push('Montagem: '+(match.part==='bushing'?'Bucha nova':byPart[match.part].name));
    } else if(match.type==='installBolt'){
      s.fastened[match.bolt]=true;
      const ix=s.inventory.findIndex(i=>i.kind==='bolt'&&i.id===match.bolt);
      if(ix>=0)s.inventory.splice(ix,1);
      s.log.push('Parafuso fixado: '+labels[match.bolt]);
    }
    s.actions++;
    if(s.phase==='disassembly'&&parts.every(p=>!s.installed[p.id]))s.phase='inspection';
    if(s.phase==='assembly'&&parts.every(p=>s.installed[p.id])&&allBolts.every(b=>s.fastened[b]))s.phase='complete';
    return {ok:true,action:match,phase:s.phase};
  }
  function progress(s){
    if(!isValid(s))return 0;
    if(s.phase==='complete')return 100;
    if(s.phase==='inspection')return 50;
    const installed=parts.filter(p=>s.installed[p.id]).length,bolted=allBolts.filter(b=>s.fastened[b]).length;
    const fraction=(installed+bolted)/(parts.length+allBolts.length);
    return Math.round(s.phase==='disassembly'?(1-fraction)*50:50+fraction*50);
  }
  return Object.freeze({parts,labels,create,isValid,actions,apply,progress});
});
