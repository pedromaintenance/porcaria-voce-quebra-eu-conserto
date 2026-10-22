/* Ciclo 14: visualização sem mutação dos horímetros VIRTUAIS da frota. */
(function(root,factory){
 const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_FLEET_VIEW=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const n=x=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:1});
 const show=x=>x===null||x===undefined?'—':n(x);
 const metric=(label,value,note)=>'<div class="planningMetric"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong>'
  +(note?'<small>'+esc(note)+'</small>':'')+'</div>';
 function render(fleet,selectedModel){
  let out='<h3 class="resourceSection">HORÍMETROS VIRTUAIS E ESTADOS OPERACIONAIS</h3>';
  if(!fleet.available)return out+'<p class="planningNoResource">'+esc(fleet.message)+'</p>';
  const m=fleet.metrics,c=fleet.coverage,models=fleet.models;
  const model=models.some(x=>x.modelId===selectedModel)?selectedModel:models[0]?.modelId;
  out+='<div class="planningMetrics">'
   +metric('Horas virtuais em operação',show(m.operatingHours)+' h','Soma de ativos na janela observada')
   +metric('Parada corretiva virtual',show(m.correctiveDownHours)+' h','12 horas por turno com OS ativa')
   +metric('Parada preventiva virtual',show(m.preventiveDownHours)+' h','Tempo do pacote executado')
   +metric('Disponibilidade virtual',m.operationalAvailabilityPct===null?'—':show(m.operationalAvailabilityPct)+'%','Operação presumida / horas classificadas')
   +metric('MTBF virtual entre ocorrências',m.mtbfHours===null?'—':show(m.mtbfHours)+' h','Base de '+m.mtbfIntervals+' intervalos')
   +metric('Turnos amostrados',c.sampledTicks+'/'+c.requestedTicks,'Medição a partir do turno '+fleet.startedTick)
   +'</div>';
  if(m.theoreticalHours){
   out+='<div class="fleetAvailability" aria-label="Distribuição das horas virtuais" role="img">'
    +'<span class="operational" style="width:'+(m.operatingHours/m.theoreticalHours*100).toFixed(2)+'%"></span>'
    +'<span class="preventive" style="width:'+(m.preventiveDownHours/m.theoreticalHours*100).toFixed(2)+'%"></span>'
    +'<span class="corrective" style="width:'+(m.correctiveDownHours/m.theoreticalHours*100).toFixed(2)+'%"></span></div>'
    +'<p class="planningExplanation">Legenda: <span style="color:#77d3a1">■ Operação presumida</span> · '
    +'<span style="color:#dcb768">■ Preventiva</span> · <span style="color:#e98f8f">■ Corretiva</span></p>';
  }
  if(!c.complete)out+='<p class="planningNoResource">Cobertura parcial: janela não completamente medida desde o início. Não extrapolar disponibilidade nem MTBF para o período não observado.</p>';
  if(c.historyTruncated)out+='<p class="planningExplanation">As amostras por turno são limitadas aos últimos 120 turnos.</p>';
  out+='<div class="fleetModelSelect"><label for="fleetModelFilter">MODELO</label>'
   +'<select id="fleetModelFilter" aria-label="Modelo de equipamento">'
   +models.map(x=>'<option value="'+esc(x.modelId)+'"'+(x.modelId===model?' selected':'')+'>'+esc(x.name)
     +' · '+x.assets+' ativos</option>').join('')+'</select></div>';
  out+='<div class="fleetAssetList">'+fleet.assets.filter(a=>a.asset.startsWith(model+'·')).map(a=>{
   const status={corrective:'PARADO · CORRETIVA',preventive:'PREVENTIVA PROGRAMADA',operating_assumed:'OPERANDO (PRESUMIDO)'}[a.currentState]||'NÃO OBSERVADO';
   return '<article class="planningOrder"><div class="planningOrderHeader"><strong>'+esc(a.asset)+'</strong><span class="planningTag">'+esc(status)+'</span></div>'
    +'<div class="fleetAssetMetrics"><span>Horímetro virtual: '+show(a.hourmeter)+' h</span>'
    +'<span>Parada corretiva: '+show(a.correctiveDown)+' h</span>'
    +'<span>Parada preventiva: '+show(a.preventiveDown)+' h</span>'
    +'<span>Ocorrências geradas na janela: '+a.failures+'</span>'
    +'<span>MTBF virtual: '+(a.mtbfHours===null?'—':show(a.mtbfHours)+' h')+' ('+a.validIntervals+' intervalos)</span>'
    +'</div></article>';
  }).join('')+'</div>';
  return out+'<p class="planningExplanation">'+esc(fleet.message)+'</p>';
 }
 return {render};
});