/* P.O.R.C.A.R.I.A. — Componentes, ciclo 5, build 0.9.8.
 * Sinais autorais e qualitativos. Fontes Cat/Sandvik sustentam métodos/famílias,
 * não validam resultados, códigos, pressões ou limites de máquinas específicas.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_COMPONENT_EXPANSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='5.0.0';
 const SOURCES=Object.freeze({
  "CAT_HYDRAULIC_TESTS": "https://www.cat.com/en_US/blog/cat-hydraulics-tests-hydraulic-system-inspection.html",
  "CAT_PUMP_MAINTENANCE": "https://www.cat.com/en_US/blog/maintain-cat-hydraulic-pump.html",
  "CAT_HYDRAULIC_INSPECTION": "https://www.cat.com/en_US/blog/hydraulic-system-inspection-steps.html",
  "CAT_HYDRAULIC_CYLINDERS": "https://www.cat.com/en_US/support/maintenance/self-service-options/steering-cylinder.html",
  "CAT_HYDRAULIC_COMPONENTS": "https://parts.cat.com/en/catcorp/category/hydraulics-pumps-motors-components",
  "SANDVIK_DR410I": "https://www.rocktechnology.sandvik/en/products/equipment/surface-drill-rigs/dr410i-rotary-blasthole-drill-rig/",
  "SANDVIK_DI650I": "https://www.rocktechnology.sandvik/en/products/equipment/surface-drill-rigs/leopard-di650i-down-the-hole-drill-rig/"
});
 const METADATA=Object.freeze({
  "CMP001": {
    "componentFamily": "Bomba hidráulica de implementos",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Região de bombas, CAT 395",
    "observedSigns": "Temperatura elevada e resposta lenta após aquecimento",
    "verification": "Confirmar tempo de ciclo, temperatura do fluido, pressão e restrições segundo SIS para configuração.",
    "uncertainty": "Sintoma não condena bomba; restrição, ajuste e carga também são hipóteses.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": null,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP002": {
    "componentFamily": "Cilindro de elevação",
    "measurementMethod": "deriva_cilindro",
    "assetZone": "Braço de elevação, CAT 966",
    "observedSigns": "Deriva de posição sem confirmação de fuga interna",
    "verification": "Executar teste de deriva da configuração com equipamento apoiado e procedimentos OEM, comparando válvulas e cilindro.",
    "uncertainty": "Deriva pode ocorrer por vedação, comando ou circuito; não prova fuga interna isoladamente.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": 4,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP003": {
    "componentFamily": "Resfriamento de compressor",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Pacote do compressor DR410i",
    "observedSigns": "Aquecimento durante ciclos longos e suspeita de resfriamento insuficiente",
    "verification": "Inspecionar condições de ventilação e leitura de temperatura segundo manual Sandvik, sem especificar valores não verificados.",
    "uncertainty": "Calor não prova falha do ventilador nem do elemento compressor.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": null,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "SANDVIK_DR410I"
    ]
  },
  "CMP004": {
    "componentFamily": "Motor hidráulico do pulldown",
    "measurementMethod": "pressao_resposta",
    "assetZone": "Conjunto de avanço DI650i",
    "observedSigns": "Queda de rendimento quando fluido aquece",
    "verification": "Correlacionar pressão, resposta e carga; usar procedimento Sandvik para circuito de avanço.",
    "uncertainty": "Não é possível atribuir o problema ao motor sem excluir transmissão/corrente e válvulas.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": null,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "SANDVIK_DI650I"
    ]
  },
  "CMP005": {
    "componentFamily": "Motor diesel e arrefecimento",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Motor diesel posição 2, CAT 6030",
    "observedSigns": "Temperatura sob carga prolongada",
    "verification": "Comparar temperaturas e condições do pacote de arrefecimento com procedimentos por série do motor.",
    "uncertainty": "Aquecimento não indica necessariamente radiador restringido.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": 4,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP006": {
    "componentFamily": "Transmissão / vibração",
    "measurementMethod": "inspecao_sensitiva",
    "assetZone": "Transmissão CAT 777E",
    "observedSigns": "Vibração sob tração com histórico de resíduos",
    "verification": "Correlacionar carga, ruído, temperatura e tendência de óleo; seguir investigação do conjunto de transmissão.",
    "uncertainty": "Vibração não comprova desgaste de engrenagem sem evidência adicional.",
    "alternatives": [
      "Origem mecânica",
      "Origem hidráulica",
      "Influência operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Persistência do sintoma sem verificação pode aumentar a indisponibilidade do ativo no jogo.",
    "delayThresholdTurns": null,
    "measurementStatus": "pendente",
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP007": {
    "componentFamily": "Bomba e alimentação hidráulica",
    "measurementMethod": "sucção_pressão",
    "assetZone": "Bombas principais da CAT 395",
    "observedSigns": "Ruído em bomba e tempo de ciclo maior",
    "verification": "Medir condição de sucção e resposta do sistema sob procedimento do modelo; comparar com filtros, mangueiras e carga antes de atribuir dano à bomba.",
    "uncertainty": "Ruído pode indicar cavitação, entrada de ar ou restrição; não identifica desgaste interno.",
    "alternatives": [
      "Restrição de sucção",
      "Entrada de ar",
      "Bomba ou regulagem"
    ],
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "No jogo, demora em investigar sucção e ruído pode levar a perda adicional de rendimento.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP008": {
    "componentFamily": "Bomba e conexões hidráulicas",
    "measurementMethod": "inspecao_vazamento",
    "assetZone": "Região de bombas principais CAT 395",
    "observedSigns": "Óleo acumulado sem ponto identificado",
    "verification": "Limpar e inspecionar a frio com isolamento apropriado; confirmar se a perda vem de vedação, conexão ou mangueira pelo procedimento.",
    "uncertainty": "Óleo próximo à carcaça não prova defeito interno da bomba.",
    "alternatives": [
      "Vedação externa",
      "Conexão hidráulica",
      "Mangueira adjacente"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP009": {
    "componentFamily": "Circuito de filtragem e retorno",
    "measurementMethod": "pressao_diferencial",
    "assetZone": "Circuito de retorno CAT 395",
    "observedSigns": "Lentidão e suspeita de restrição",
    "verification": "Conferir localização e procedimento de medição para o arranjo; comparar diferencial e temperatura com referência própria do componente.",
    "uncertainty": "Sem diferencial medido e circuito definido não há base para condenar filtro ou válvula.",
    "alternatives": [
      "Restrição do filtro",
      "Viscosidade/temperatura",
      "Válvula de retorno"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP010": {
    "componentFamily": "Cilindro de elevação",
    "measurementMethod": "deriva_cilindro",
    "assetZone": "Elevação CAT 966, posição 2",
    "observedSigns": "Deriva estática sem perda externa",
    "verification": "Aplicar procedimento seguro de deriva sob apoio mecânico/isolamento; correlacionar cilindro, válvula de retenção e circuito.",
    "uncertainty": "A perda de posição não confirma vazamento interno das vedações do pistão.",
    "alternatives": [
      "Vedação de pistão",
      "Bloco de válvulas",
      "Fuga em outro circuito"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP011": {
    "componentFamily": "Cilindro de elevação",
    "measurementMethod": "inspecao_vazamento",
    "assetZone": "Elevação CAT 966, posição 1",
    "observedSigns": "Umidade externa e deriva relatada",
    "verification": "Confirmar origem do fluido, condição da haste e medir deriva somente com implemento seguro, seguindo literatura por configuração.",
    "uncertainty": "Vedação de haste externa não comprova que a vedação de pistão tenha fuga interna.",
    "alternatives": [
      "Vedação de haste",
      "Válvula do implemento",
      "Vedação do pistão"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP012": {
    "componentFamily": "Direção hidráulica",
    "measurementMethod": "pressao_resposta",
    "assetZone": "Circuito de direção CAT 966",
    "observedSigns": "Esforço de direção e lentidão",
    "verification": "Encaminhar avaliação prioritária; confirmar pressão e resposta da direção conforme procedimentos OEM antes de liberar retorno à operação.",
    "uncertainty": "Falha pode envolver bomba, restrição, válvula ou circuito e não está isolada.",
    "alternatives": [
      "Bomba de direção",
      "Restrição de alimentação",
      "Válvula/cilindro"
    ],
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Persistir operando com perda de resposta da direção aumenta exposição a acidente.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP013": {
    "componentFamily": "Arrefecimento hidráulico",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Trocador de calor hidráulico CAT 6030",
    "observedSigns": "Aquecimento com ciclos longos",
    "verification": "Correlacionar temperatura do óleo, carga de trabalho, fluxo de ar e condições do pacote de trocadores conforme SIS específico.",
    "uncertainty": "Recuperar temperatura em baixa carga não confirma trocador obstruído.",
    "alternatives": [
      "Trocador com sujeira",
      "Carga operacional elevada",
      "Controle/medição de temperatura"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP014": {
    "componentFamily": "Válvulas de implemento e filtragem",
    "measurementMethod": "pressao_diferencial",
    "assetZone": "Circuito de implemento CAT 6030",
    "observedSigns": "Resposta irregular e indicação de particulado",
    "verification": "Conferir compartimento, histórico de filtragem e diferencial onde previsto; correlacionar sinal com comando e pressões do circuito.",
    "uncertainty": "Partículas não comprovam válvula travada nem identificam a origem do desgaste.",
    "alternatives": [
      "Contaminação e restrição",
      "Válvula de controle",
      "Alimentação de bomba"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP015": {
    "componentFamily": "Filtragem do sistema hidráulico",
    "measurementMethod": "pressao_diferencial",
    "assetZone": "Circuito hidráulico DR410i",
    "observedSigns": "Lentidão generalizada sob carga",
    "verification": "Consultar documentação Sandvik e confirmar ponto de tomada, estado do elemento e diferencial de pressão por arranjo antes de substituir.",
    "uncertainty": "Diagnóstico de filtro obstruído requer medição e inspeção; fluido, controle e bombas são alternativas.",
    "alternatives": [
      "Filtro restrito",
      "Viscosidade do fluido",
      "Comando/bomba"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DR410I"
    ],
    "oemSpecificPending": true
  },
  "CMP016": {
    "componentFamily": "Motor hidráulico do avanço",
    "measurementMethod": "pressao_resposta",
    "assetZone": "Conjunto pulldown DI650i",
    "observedSigns": "Resposta fraca com óleo quente",
    "verification": "Correlacionar carga, pressão e movimento; consultar Sandvik para testes específicos do motor e da transmissão do avanço.",
    "uncertainty": "Temperatura e lentidão não confirmam falha do motor hidráulico.",
    "alternatives": [
      "Motor hidráulico",
      "Corrente/transmissão",
      "Alimentação por válvula"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DI650I"
    ],
    "oemSpecificPending": true
  },
  "CMP017": {
    "componentFamily": "Motor hidráulico de rotação",
    "measurementMethod": "inspecao_vazamento",
    "assetZone": "Cabeça rotativa DI650i",
    "observedSigns": "Lentidão e presença de fluido",
    "verification": "Isolar a área, rastrear a origem do óleo e medir desempenho conforme procedimentos Sandvik sem atribuir defeito ao motor.",
    "uncertainty": "Vazamento pode vir da vedação do motor, conexão ou mangueira.",
    "alternatives": [
      "Vedação do motor",
      "Mangueira/conexão",
      "Resistência mecânica"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DI650I"
    ],
    "oemSpecificPending": true
  },
  "CMP018": {
    "componentFamily": "Ventilação de compressor",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Ventilador de resfriamento DR410i",
    "observedSigns": "Ruído e aquecimento do sistema",
    "verification": "Confirmar temperaturas e condição de ventilação por procedimento Sandvik, sem aproximar instrumentos de componentes girantes.",
    "uncertainty": "Ruído não prova rolamento gripado, e calor pode vir de restrição ou sobrecarga.",
    "alternatives": [
      "Rolamento de ventilador",
      "Fluxo de ar insuficiente",
      "Alta demanda de ar"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DR410I"
    ],
    "oemSpecificPending": true
  },
  "CMP019": {
    "componentFamily": "Resfriamento do compressor",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Pacote do compressor DR410i",
    "observedSigns": "Temperatura crescente e poeira",
    "verification": "Inspecionar pacote e tendência térmica, relacionando ciclos e ventilação segundo manual da perfuratriz.",
    "uncertainty": "Temperatura elevada pode resultar de carga, refrigeração ou controle; não condena radiador.",
    "alternatives": [
      "Restrição externa",
      "Ventilação deficiente",
      "Sobrecarga/controle"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DR410I"
    ],
    "oemSpecificPending": true
  },
  "CMP020": {
    "componentFamily": "Trocador de calor pneumático",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Conjunto de ar comprimido DI650i",
    "observedSigns": "Arrefecimento reduzido e sujeira visível",
    "verification": "Comparar condição externa do trocador, fluxo de ar e tendência operacional com referência Sandvik aplicável.",
    "uncertainty": "Não se confirma restrição interna nem defeito do ventilador.",
    "alternatives": [
      "Sujeira externa",
      "Fluxo de ar",
      "Condição do compressor"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "SANDVIK_DI650I"
    ],
    "oemSpecificPending": true
  },
  "CMP021": {
    "componentFamily": "Motor diesel e sistema de arrefecimento",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Motor diesel 2 CAT 6030",
    "observedSigns": "Temperatura sob esforço e radiador sujo",
    "verification": "Verificar temperatura, níveis e condição externa do pacote térmico conforme procedimento do motor e OMM.",
    "uncertainty": "Sujeira visível não prova falha interna do radiador; carga e circulação são alternativas.",
    "alternatives": [
      "Sujeira em radiador",
      "Circulação de fluido",
      "Carga acima do padrão"
    ],
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP022": {
    "componentFamily": "Acionamento do ventilador",
    "measurementMethod": "tendencia_termica",
    "assetZone": "Arrefecimento do motor D9",
    "observedSigns": "Aquecimento sob carga e resposta parcial de ventilação",
    "verification": "Conferir comando, rotação e temperaturas com método seguro e literatura do arranjo de ventilador.",
    "uncertainty": "Não se sabe se o problema é motor hidráulico, comando ou trocador.",
    "alternatives": [
      "Acionamento hidráulico",
      "Controle de ventilador",
      "Restrição do radiador"
    ],
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP023": {
    "componentFamily": "Alimentação do motor diesel",
    "measurementMethod": "pressao_resposta",
    "assetZone": "Circuito de combustível 777E",
    "observedSigns": "Resposta reduzida em rampa",
    "verification": "Conferir eventos do motor e parâmetros da alimentação, comparando restrição e pressões conforme manual.",
    "uncertainty": "Perda de potência não prova filtro obstruído; carga, sensor e circuito são alternativas.",
    "alternatives": [
      "Filtro combustível",
      "Sensor/ECM",
      "Demanda operacional"
    ],
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Postergação pode reduzir a janela de diagnóstico e aumentar a indisponibilidade simulada.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  },
  "CMP024": {
    "componentFamily": "Cilindro hidráulico de direção",
    "measurementMethod": "inspecao_vazamento",
    "assetZone": "Cilindro direção CAT 966, lado não confirmado",
    "observedSigns": "Riscos visíveis e fluido na haste",
    "verification": "Priorizar avaliação técnica das superfícies e vedações por profissional capacitado, em sistema despressurizado e com orientação OEM.",
    "uncertainty": "O dano superficial não revela perda de resistência ou extensão interna; sem roteiro FMEA específico não gerar OS automaticamente.",
    "alternatives": [
      "Desgaste abrasivo",
      "Dano de proteção",
      "Falha de vedação"
    ],
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "No jogo, postergar avaliação de direção com haste danificada aumenta risco de perda de controle.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_HYDRAULIC_TESTS",
      "CAT_HYDRAULIC_INSPECTION"
    ]
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "CMP007",
    "category": "components",
    "modelId": "EQ03",
    "title": "CAT 395: bomba com ruído e implementos lentos após aquecimento",
    "baseline": "Na CAT 395, os implementos perdem velocidade com óleo aquecido e há ruído perto das bombas; sucção ainda não foi testada.",
    "escalationScenario": "INC056",
    "followupTool": "VACU",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP008",
    "category": "components",
    "modelId": "EQ03",
    "title": "CAT 395: óleo próximo à bomba principal e perda intermitente",
    "baseline": "Na CAT 395, há óleo na base da região de bomba principal e a resposta do implemento oscila; não se identificou ponto de vazamento.",
    "escalationScenario": "INC057",
    "followupTool": "MANO",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP009",
    "category": "components",
    "modelId": "EQ03",
    "title": "CAT 395: pressão diferencial anormal no retorno hidráulico",
    "baseline": "Na CAT 395, o tempo de ciclo cresce quando o óleo aquece e o diferencial de pressão é suspeito, ainda sem medição representativa.",
    "escalationScenario": null,
    "followupTool": "PDIF",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP010",
    "category": "components",
    "modelId": "EQ08",
    "title": "CAT 966: cilindro de elevação perde posição sem fuga externa",
    "baseline": "Na CAT 966, o braço perde lentamente a posição em condição estática; não há óleo aparente na haste nem teste de deriva validado.",
    "escalationScenario": "INC044",
    "followupTool": "COMP",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP011",
    "category": "components",
    "modelId": "EQ08",
    "title": "CAT 966: umidade na haste e tendência de deriva",
    "baseline": "Na CAT 966, aparece umidade no cilindro de elevação e o braço demora a manter a posição; fuga externa e interna são hipóteses separadas.",
    "escalationScenario": "INC059",
    "followupTool": "COMP",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP012",
    "category": "components",
    "modelId": "EQ08",
    "title": "CAT 966: direção lenta e esforço crescente após aquecimento",
    "baseline": "Na CAT 966, a direção perde resposta após aquecimento e exige mais esforço; pressão e vazão hidráulicas ainda não foram confirmadas.",
    "escalationScenario": "INC060",
    "followupTool": "MANO",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "CMP013",
    "category": "components",
    "modelId": "EQ02",
    "title": "CAT 6030: temperatura hidráulica cresce nos ciclos longos",
    "baseline": "Na CAT 6030, o óleo hidráulico aquece sob trabalho prolongado e se recupera com menor carga, sem causa térmica definida.",
    "escalationScenario": "INC062",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP014",
    "category": "components",
    "modelId": "EQ02",
    "title": "CAT 6030: função hidráulica irregular com partículas",
    "baseline": "Na CAT 6030, uma função responde de forma irregular depois de ciclos pesados e análises citam partículas no circuito.",
    "escalationScenario": "INC061",
    "followupTool": "PDIF",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP015",
    "category": "components",
    "modelId": "EQ05",
    "title": "DR410i: resposta hidráulica lenta com suspeita de filtro",
    "baseline": "Na DR410i, funções hidráulicas apresentam resposta lenta e sinal genérico de condição; não há medição de restrição do filtro.",
    "escalationScenario": "INC063",
    "followupTool": "PDIF",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP016",
    "category": "components",
    "modelId": "EQ06",
    "title": "DI650i: pulldown perde força após aquecimento do óleo",
    "baseline": "Na DI650i, o avanço da torre perde força em ciclos longos, embora comandos continuem respondendo; a origem permanece indeterminada.",
    "escalationScenario": "INC064",
    "followupTool": "MANO",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP017",
    "category": "components",
    "modelId": "EQ06",
    "title": "DI650i: rotação com perda de desempenho e óleo externo",
    "baseline": "Na DI650i, a rotação tem resposta mais lenta e há traço de óleo na área do motor hidráulico; ponto de fuga não foi isolado.",
    "escalationScenario": "INC022",
    "followupTool": "MANO",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP018",
    "category": "components",
    "modelId": "EQ05",
    "title": "DR410i: ventilador do compressor com ruído e temperatura crescente",
    "baseline": "Na DR410i, temperatura do compressor cresce e ruído aparece perto do ventilador; falha de rolamento ainda não foi confirmada.",
    "escalationScenario": "INC085",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP019",
    "category": "components",
    "modelId": "EQ05",
    "title": "DR410i: compressor aquece sob demanda prolongada",
    "baseline": "Na DR410i, a temperatura do compressor cresce após perfuração contínua e o desempenho diminui, com poeira no pacote de resfriamento.",
    "escalationScenario": "INC019",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "CMP020",
    "category": "components",
    "modelId": "EQ06",
    "title": "DI650i: trocador do ar comprimido com tendência de calor",
    "baseline": "Na DI650i, o circuito de ar comprimido fica mais quente e perde rendimento sob ciclos longos; existe sujeira externa no trocador.",
    "escalationScenario": "INC078",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP021",
    "category": "components",
    "modelId": "EQ02",
    "title": "CAT 6030: temperatura do motor diesel cresce sob carga",
    "baseline": "Na 6030, o motor diesel da posição 2 aquece em escavação intensa e há sujeira no pacote de radiadores, sem confirmação da causa.",
    "escalationScenario": "INC071",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP022",
    "category": "components",
    "modelId": "EQ07",
    "title": "CAT D9: ventilador responde pouco ao aumento da temperatura",
    "baseline": "No D9, a temperatura do motor aumenta durante serviço pesado e a ventilação parece insuficiente, sem leitura hidráulica independente.",
    "escalationScenario": "INC073",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP023",
    "category": "components",
    "modelId": "EQ01",
    "title": "CAT 777E: potência cai sob carga com alimentação não confirmada",
    "baseline": "No 777E, ocorre perda de potência em subida carregada com alerta genérico; pressão e vazão de combustível não foram confirmadas.",
    "escalationScenario": "INC066",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "CMP024",
    "category": "components",
    "modelId": "EQ08",
    "title": "CAT 966: haste do cilindro de direção com riscos longitudinais",
    "baseline": "Na CAT 966, haste de cilindro de direção apresenta riscos longitudinais e película de fluido; não há laudo da integridade da haste.",
    "escalationScenario": null,
    "followupTool": "COMP",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 return {VERSION,SOURCES,METADATA,ENTRIES};
});
