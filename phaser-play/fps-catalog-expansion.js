/* FPS (Ferramentas de Penetração no Solo) / GET — ciclo 6 (v0.9.9).
 * Fontes OEM validam famílias e sinais observáveis; conteúdo das ocorrências é ficcional.
 * Sem Part Number, montagem, horas de vida útil, percentuais de desgaste ou limites fabricados.
 * FPS001..004 permanecem somente no mapa de compatibilidade para saves históricos.
 * FPS005..028 ligados a INC101..INC124 como roteiros investigativos NÃO OEM-homologados.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_FPS_EXPANSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='7.0.0';
 const SOURCES=Object.freeze({
  "CAT_FPS_BR": "https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools.html",
  "CAT_FPS_MINING": "https://www.cat.com/pt_BR/by-industry/mining/equipment-management/wear-maintenance-parts/ground-engaging-tools.html",
  "CAT_FPS_SHOVELS": "https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools/get-for-hydraulic-mining-shovels.html",
  "CAT_GET_INSPECTION": "https://www.cat.com/en_US/articles/for-owners/what-to-know-about-ground-engaging-tools.html",
  "CAT_GET_EXCAVATOR": "https://www.cat.com/en_US/articles/for-owners/get-selection-and-maintenance.html",
  "CAT_GET_LOADER": "https://www.cat.com/en_US/articles/for-owners/cat-excavator-and-wheel-loader-bucket-tips.html",
  "CAT_GET_DOZER": "https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools/get-for-dozers/cutting-edges-end-bits-dozers.html",
  "SOTREQ_FPS": "https://www.sotreq.com.br/fps"
});
 const METADATA=Object.freeze({
  "FPS005": {
    "componentFamily": "Ponta de caçamba",
    "assetZone": "Ponta central",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Ponta central com desgaste abrasivo progressivo, ainda sem medição de material remanescente.",
    "verification": "Inspecionar perfil e desgaste por posição; comparar com peça compatível e histórico do conjunto.",
    "uncertainty": "Ponta gasta não indica necessariamente falha do adaptador.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS006": {
    "componentFamily": "Ponta de caçamba",
    "assetZone": "Posição 2",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Falta uma ponta da caçamba; há indício de exposição do nariz do adaptador.",
    "verification": "Registrar perda e avaliar adaptador e retenção em inspeção segura antes de retornar à escavação.",
    "uncertainty": "A ponta ausente é observada; a causa de soltura ainda é desconhecida.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS007": {
    "componentFamily": "Retentor e trava",
    "assetZone": "Posição 3",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Retentor aparenta deslocamento e a ponta tem movimento anormal na fixação.",
    "verification": "Verificar integridade do sistema de retenção e especificação do conjunto instalado sem golpear retentor desconhecido.",
    "uncertainty": "Movimento não permite apontar falta de torque ou incompatibilidade de peça.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS008": {
    "componentFamily": "Adaptador",
    "assetZone": "Posição 1",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Face inferior do adaptador apresenta perda de material após desgaste da ponta.",
    "verification": "Documentar desgaste no nariz e alças do adaptador e consultar critérios do sistema instalado.",
    "uncertainty": "Desgaste visual não estabelece automaticamente o limite de descarte.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS009": {
    "componentFamily": "Adaptador",
    "assetZone": "Posição 4",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Suspeita de trinca na região do adaptador, junto à transição com a borda da caçamba.",
    "verification": "Priorizar avaliação técnica, limpeza e inspeção de trincas conforme procedimento de solda/estrutura.",
    "uncertainty": "Linha visual pode ser indicação superficial; extensão não verificada.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS010": {
    "componentFamily": "Protetor entre pontas",
    "assetZone": "Centro da borda de ataque",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Protetor entre dentes está muito desgastado, com aumento de exposição da borda principal.",
    "verification": "Inspecionar retenção, desgaste do protetor e integridade da borda, registrando posição e fotos.",
    "uncertainty": "Não há cota de desgaste nem desenho do sistema identificado.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS011": {
    "componentFamily": "Protetor lateral",
    "assetZone": "Lado direito da caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Protetor da barra lateral apresenta desgaste desigual, deixando parte do flanco exposta.",
    "verification": "Conferir fixação, integridade da proteção e diferença de desgaste por lado.",
    "uncertainty": "Desgaste assimétrico não prova desalinhamento da caçamba.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS012": {
    "componentFamily": "Borda de ataque",
    "assetZone": "Trecho entre adaptadores",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Desgaste por escavação na borda de ataque parece alcançar a região de apoio de proteção.",
    "verification": "Registrar desgaste e possíveis alterações geométricas; confrontar com desenho e padrão de referência do conjunto.",
    "uncertainty": "Não foi medido material residual nem confirmada deformação estrutural.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS013": {
    "componentFamily": "Solda de adaptador",
    "assetZone": "Canto esquerdo da borda",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Uma linha semelhante a trinca foi vista na região de solda do adaptador da caçamba.",
    "verification": "Isolar e solicitar inspeção estrutural especializada, com método compatível e referência OEM.",
    "uncertainty": "Não foi confirmada profundidade, extensão ou causa da indicação.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS014": {
    "componentFamily": "Conjunto de pontas",
    "assetZone": "Lados esquerdo e direito",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "As pontas da mesma caçamba exibem desgaste bastante desigual entre posições.",
    "verification": "Mapear posição, perfil e aplicação; verificar rocha, operação e compatibilidade dos tipos instalados.",
    "uncertainty": "Diferença de desgaste não prova erro do operador ou material defeituoso.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS015": {
    "componentFamily": "Sistema de retenção",
    "assetZone": "Posição 5",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Pino de retenção aparenta dano mecânico; a ponta ainda está instalada.",
    "verification": "Priorizar inspeção do mecanismo de trava e condição de retenção, sem assumir método de montagem.",
    "uncertainty": "Pino marcado não confirma perda iminente sem avaliação da fixação.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS016": {
    "componentFamily": "Revestimento de desgaste",
    "assetZone": "Fundo interno próximo à borda",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Placa interna de desgaste aparenta levantamento em uma extremidade e redução de cobertura.",
    "verification": "Verificar fixação, integridade da placa e condição do substrato com inspeção segura.",
    "uncertainty": "A aparência não confirma soltura total ou dano do metal-base.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_FPS_SHOVELS",
      "CAT_FPS_MINING",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS017": {
    "componentFamily": "Ponta de caçamba",
    "assetZone": "Posição central",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Ponta central da escavadeira 395 apresenta desgaste abrasivo com perda de perfil de penetração.",
    "verification": "Comparar com as demais pontas, identificar família instalada e registrar tendência por horas de trabalho.",
    "uncertainty": "Desgaste visível não estabelece vida restante sem modelo e método de medição.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS018": {
    "componentFamily": "Ponta de caçamba",
    "assetZone": "Posição 2, alojamento",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Há indicação de fissura no alojamento de uma ponta, junto à área de encaixe no adaptador.",
    "verification": "Encaminhar avaliação técnica e inspeção do acoplamento e trava antes de serviço com carga.",
    "uncertainty": "Fissura visual não identifica o mecanismo de falha nem conformidade da peça.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS019": {
    "componentFamily": "Retentor de ponta",
    "assetZone": "Posição 3",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Retentor da ponta parece solto e há movimento do conjunto na caçamba da 395.",
    "verification": "Verificar retenção e sistema de montagem conforme a família de FPS instalada; evitar procedimentos de outro sistema.",
    "uncertainty": "Não se sabe se é desgaste de trava, instalação inadequada ou componente incorreto.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS020": {
    "componentFamily": "Adaptador de ponta",
    "assetZone": "Posição 1",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Adaptador de ponta da 395 apresenta marcas de desgaste na região inferior de apoio.",
    "verification": "Avaliar nariz, cinta e borda com procedimento de inspeção do sistema instalado.",
    "uncertainty": "Desgaste da cinta não confirma que a solda esteja comprometida.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS021": {
    "componentFamily": "Protetor lateral",
    "assetZone": "Lado esquerdo da caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Uma proteção lateral de FPS está ausente e há desgaste novo na barra da caçamba.",
    "verification": "Priorizar avaliação de proteção, encaixe e substrato para limitar exposição estrutural.",
    "uncertainty": "Proteção ausente não prova deformação ou trinca estrutural.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS022": {
    "componentFamily": "Placa de desgaste",
    "assetZone": "Fundo interno da caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Placa de desgaste do fundo interno apresenta afinamento localizado próximo à borda.",
    "verification": "Registrar área e estado do substrato; consultar plano de proteção e especificação aplicável.",
    "uncertainty": "Sem espessura não é possível determinar troca ou soldagem.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS023": {
    "componentFamily": "Solda de adaptador",
    "assetZone": "Canto direito da caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Linha suspeita de trinca apareceu entre o adaptador lateral e a borda de ataque da 395.",
    "verification": "Solicitar avaliação estrutural e registrar posição, desenho e necessidade de ensaio adequado.",
    "uncertainty": "A origem da linha não está confirmada e a falha não pode ser classificada somente visualmente.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS024": {
    "componentFamily": "Seleção do perfil de ponta",
    "assetZone": "Conjunto de caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "A produtividade caiu após a troca do perfil de pontas, mas o material escavado também mudou.",
    "verification": "Comparar aplicação, tipo da ponta e desgaste sem concluir erro de especificação antes de correlacionar o material.",
    "uncertainty": "Queda de produtividade pode decorrer da dureza e granulometria, além do desenho da FPS.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_EXCAVATOR",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS025": {
    "componentFamily": "Borda cortante da caçamba",
    "assetZone": "Centro da borda",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Borda de corte da carregadeira 966 apresenta desgaste assimétrico ao longo da largura.",
    "verification": "Inspecionar borda, fixações e aplicação e conferir perfil com referência da ferramenta instalada.",
    "uncertainty": "Não há prova de falta de alinhamento ou limite de descarte.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_LOADER",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS026": {
    "componentFamily": "Ponta e retenção",
    "assetZone": "Lado direito da caçamba",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Uma ponta da 966 mostra folga perceptível no encaixe depois de turno de carregamento.",
    "verification": "Avaliar fixação do sistema e desgaste do adaptador antes de liberar esforço, conforme OMM.",
    "uncertainty": "Folga não permite concluir causa de perda de retenção.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_LOADER",
      "CAT_GET_INSPECTION"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS027": {
    "componentFamily": "Borda cortante da lâmina",
    "assetZone": "Trecho central da lâmina D9",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "A borda cortante do D9 está com perfil muito desgastado e redução perceptível da capacidade de corte.",
    "verification": "Inspecionar desgaste por segmento e fixações; comparar com conjunto especificado sem presumir medida de descarte.",
    "uncertainty": "Desempenho pode variar com o solo e a geometria, sem confirmação de limite de uso.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "A postergação pode expor adaptador, borda ou proteção a desgaste adicional no jogo.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_DOZER",
      "CAT_FPS_BR"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  },
  "FPS028": {
    "componentFamily": "Ponteira lateral da lâmina",
    "assetZone": "Lado esquerdo do D9",
    "inspectionMethod": "inspecao_visual_fps",
    "observedSigns": "Ponteira lateral da lâmina apresenta fixador ausente e marca de movimento na interface.",
    "verification": "Priorizar avaliação da ponteira, estado dos fixadores e assento antes da continuidade do trabalho.",
    "uncertainty": "A ausência do fixador é visível, mas a condição das roscas e superfície não foi avaliada.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Atraso na avaliação de retenção, perda ou trinca de FPS pode ampliar danos à caçamba no jogo.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_GET_DOZER",
      "CAT_FPS_BR"
    ],
    "applicability": "Família de FPS/GET somente; montagem e limites dependem de arranjo/P/N/serie não informados."
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "FPS005",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Ponta de caçamba: Ponta central",
    "baseline": "Ponta central com desgaste abrasivo progressivo, ainda sem medição de material remanescente.",
    "escalationScenario": "INC101",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FPS006",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Ponta de caçamba: Posição 2",
    "baseline": "Falta uma ponta da caçamba; há indício de exposição do nariz do adaptador.",
    "escalationScenario": "INC102",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS007",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Retentor e trava: Posição 3",
    "baseline": "Retentor aparenta deslocamento e a ponta tem movimento anormal na fixação.",
    "escalationScenario": "INC103",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS008",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Adaptador de ponta: desgaste na posição 1",
    "baseline": "Face inferior do adaptador apresenta perda de material após desgaste da ponta.",
    "escalationScenario": "INC104",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS009",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Adaptador de ponta: possível trinca na posição 4",
    "baseline": "Suspeita de trinca na região do adaptador, junto à transição com a borda da caçamba.",
    "escalationScenario": "INC105",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS010",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Protetor entre pontas: Centro da borda de ataque",
    "baseline": "Protetor entre dentes está muito desgastado, com aumento de exposição da borda principal.",
    "escalationScenario": "INC106",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS011",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Protetor lateral: Lado direito da caçamba",
    "baseline": "Protetor da barra lateral apresenta desgaste desigual, deixando parte do flanco exposta.",
    "escalationScenario": "INC107",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS012",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Borda de ataque: Trecho entre adaptadores",
    "baseline": "Desgaste por escavação na borda de ataque parece alcançar a região de apoio de proteção.",
    "escalationScenario": "INC108",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS013",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Solda de adaptador: Canto esquerdo da borda",
    "baseline": "Uma linha semelhante a trinca foi vista na região de solda do adaptador da caçamba.",
    "escalationScenario": "INC109",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS014",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Conjunto de pontas: Lados esquerdo e direito",
    "baseline": "As pontas da mesma caçamba exibem desgaste bastante desigual entre posições.",
    "escalationScenario": "INC110",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FPS015",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Sistema de retenção: Posição 5",
    "baseline": "Pino de retenção aparenta dano mecânico; a ponta ainda está instalada.",
    "escalationScenario": "INC111",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS016",
    "category": "fps",
    "modelId": "EQ02",
    "title": "Revestimento de desgaste: Fundo interno próximo à borda",
    "baseline": "Placa interna de desgaste aparenta levantamento em uma extremidade e redução de cobertura.",
    "escalationScenario": "INC112",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS017",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Ponta de caçamba: Posição central",
    "baseline": "Ponta central da escavadeira 395 apresenta desgaste abrasivo com perda de perfil de penetração.",
    "escalationScenario": "INC113",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FPS018",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Ponta de caçamba: Posição 2, alojamento",
    "baseline": "Há indicação de fissura no alojamento de uma ponta, junto à área de encaixe no adaptador.",
    "escalationScenario": "INC114",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS019",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Retentor de ponta: Posição 3",
    "baseline": "Retentor da ponta parece solto e há movimento do conjunto na caçamba da 395.",
    "escalationScenario": "INC115",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS020",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Adaptador de ponta: Posição 1",
    "baseline": "Adaptador de ponta da 395 apresenta marcas de desgaste na região inferior de apoio.",
    "escalationScenario": "INC116",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS021",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Protetor lateral: Lado esquerdo da caçamba",
    "baseline": "Uma proteção lateral de FPS está ausente e há desgaste novo na barra da caçamba.",
    "escalationScenario": "INC117",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS022",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Placa de desgaste: Fundo interno da caçamba",
    "baseline": "Placa de desgaste do fundo interno apresenta afinamento localizado próximo à borda.",
    "escalationScenario": "INC118",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FPS023",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Solda de adaptador: Canto direito da caçamba",
    "baseline": "Linha suspeita de trinca apareceu entre o adaptador lateral e a borda de ataque da 395.",
    "escalationScenario": "INC119",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS024",
    "category": "fps",
    "modelId": "EQ03",
    "title": "Seleção do perfil de ponta: Conjunto de caçamba",
    "baseline": "A produtividade caiu após a troca do perfil de pontas, mas o material escavado também mudou.",
    "escalationScenario": "INC120",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "estavel"
    ]
  },
  {
    "id": "FPS025",
    "category": "fps",
    "modelId": "EQ08",
    "title": "Borda cortante da caçamba: Centro da borda",
    "baseline": "Borda de corte da carregadeira 966 apresenta desgaste assimétrico ao longo da largura.",
    "escalationScenario": "INC121",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FPS026",
    "category": "fps",
    "modelId": "EQ08",
    "title": "Ponta e retenção: Lado direito da caçamba",
    "baseline": "Uma ponta da 966 mostra folga perceptível no encaixe depois de turno de carregamento.",
    "escalationScenario": "INC122",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FPS027",
    "category": "fps",
    "modelId": "EQ07",
    "title": "Borda cortante da lâmina: Trecho central da lâmina D9",
    "baseline": "A borda cortante do D9 está com perfil muito desgastado e redução perceptível da capacidade de corte.",
    "escalationScenario": "INC123",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FPS028",
    "category": "fps",
    "modelId": "EQ07",
    "title": "Ponteira lateral da lâmina: Lado esquerdo do D9",
    "baseline": "Ponteira lateral da lâmina apresenta fixador ausente e marca de movimento na interface.",
    "escalationScenario": "INC124",
    "followupTool": null,
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 const LEGACY_LABELS=Object.freeze({"FPS001":"Registro FPS legado sem significado conhecido à época da criação","FPS002":"Registro FPS legado de perfuratriz com interpretação de painel não validada","FPS003":"Registro FPS legado com dados não classificados","FPS004":"Registro FPS legado com verificação pendente de classificação"});
 return {VERSION,SOURCES,METADATA,ENTRIES,LEGACY_LABELS};
});
