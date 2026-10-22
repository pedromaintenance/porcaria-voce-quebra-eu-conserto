/* PORCARIA — redação operacional para a interface.
 * Somente apresentação: não altera evidências, saves, status ou gabaritos.
 * Ressalvas de validação de dados permanecem na documentação técnica.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_IMMERSIVE_COPY=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function clean(value){
  let s=String(value??'');
  s=s.replace(/Particulado em uma análise fictícia sem confirmação da via de entrada\./gi,
   'Particulado identificado na análise de óleo; via de entrada ainda não confirmada.');
  s=s.replace(/Partículas isoladas em coleta simulada; representatividade ainda não verificada\./gi,
   'Partículas identificadas em amostra isolada; representatividade ainda não verificada.');
  s=s.replace(/\b(?:análise|coleta|recoleta|amostra) (?:fictícia|simulada)\b/gi,m=>m.split(' ')[0]);
  s=s.replace(/\b(?:laudo|histórico|ensaio|teste|ponto de teste|circuito|resultado|instrumento|roteiro|cenário|caso) (?:fictício|simulado|didático)\b/gi,m=>m.split(' ').slice(0,-1).join(' '));
  s=s.replace(/\b(?:fictíci[ao]s?|simulad[ao]s?|didátic[ao]s?)\b/gi,'');
  s=s.replace(/\b(?:do jogo|no jogo|da simulação|nesta simulação|do simulador)\b/gi,'');
  s=s.replace(/\b(?:o gabarito|gabarito fictício|o exercício)\b/gi,'a avaliação técnica');
  s=s.replace(/\b(?:este exercício|neste exercício)\b/gi,'nesta avaliação');
  s=s.replace(/\s+\(\s*\)/g,'');
  s=s.replace(/\s+([,.;:!?])/g,'$1').replace(/([.;:!?])(?=[A-ZÁÉÍÓÚ])/g,'$1 ');
  s=sreplaceWhitespace(s);
  return s.trim();
 }
 function sreplaceWhitespace(s){return s.replace(/[ \t]{2,}/g,' ').replace(/\s+\n/g,'\n');}
 return {clean};
});