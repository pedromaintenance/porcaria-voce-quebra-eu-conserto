/* P.O.R.C.A.R.I.A. v0.9.7 — expansão material rodante (ciclo 4).
 * Cenários de jogo autorais. Sem medidas CTS, percentuais de desgaste, pressões ou limites OEM fabricados.
 * CTS Caterpillar e avaliação de pneus Michelin são metodologias DISTINTAS.
 * Para sistemas Sandvik, desenho/método/limites requerem manual do fabricante correspondente.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_UNDERCARRIAGE_EXPANSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='4.0.0';
 const SOURCES=Object.freeze({
  "CAT_CTS": "https://www.cat.com/en_US/blog/undercarriage-care-cat-dealer-programs.html",
  "CAT_TRACK_INSPECTION": "https://www.cat.com/en_US/articles/for-owners/dozer-undercarriage-maintenance.html",
  "CAT_EXCAVATOR_INSPECTION": "https://www.cat.com/en_US/articles/for-owners/what-to-know-about-excavator-undercarriage-maintenance.html",
  "CAT_TRACK_TENSION": "https://www.cat.com/en_US/blog/maintain-cat-steel-tracks.html",
  "MICHELIN_OTR_INSPECTION": "https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-maintenance-earthmover-tyre-inspection",
  "MICHELIN_OTR_PRESSURE": "https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-pressure-for-earthmover-vehicles",
  "MICHELIN_OTR_DAMAGE": "https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-wear-earthmover-tyre-repair"
});
 const METADATA=Object.freeze({
  "UND001": {
    "componentGroup": "Rolete / rolamento",
    "undercarriageKind": "esteira",
    "measurementMethod": "temperatura",
    "assetZone": "Rolete de retorno, posição a confirmar",
    "observedSigns": "Diferença térmica e ruído, sem ensaio conclusivo",
    "verification": "Confirmar identidade do rolete e tendência térmica com inspeção segura; não aplicar CTS dimensional a rolamento gripado.",
    "uncertainty": "Aquecimento não prova gripamento; verificar vedação e rotação.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION"
    ]
  },
  "UND002": {
    "componentGroup": "Roda-guia e alinhamento",
    "undercarriageKind": "esteira",
    "measurementMethod": "cts",
    "assetZone": "Lado e posição 2",
    "observedSigns": "Marcas assimétricas e deslocamento lateral",
    "verification": "Registrar geometria e condição da roda-guia; confrontar medidas CTS com modelo/configuração Cat aplicável.",
    "uncertainty": "Desgaste assimétrico não individualiza o componente desalinhado.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION"
    ]
  },
  "UND003": {
    "componentGroup": "Pneu da motoniveladora",
    "undercarriageKind": "pneu",
    "measurementMethod": "inspecao_pneu",
    "assetZone": "Conjunto tandem, posição conforme OS",
    "observedSigns": "Desgaste direcional do pneu",
    "verification": "Medir profundidade do sulco e pressão a frio com segurança; encaminhar alinhamento e avaliação de pneus.",
    "uncertainty": "Desgaste direcional pode ter múltiplas causas; CTS não é método de pneus.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "MICHELIN_OTR_INSPECTION",
      "MICHELIN_OTR_PRESSURE"
    ]
  },
  "UND004": {
    "componentGroup": "Tensionador de esteira",
    "undercarriageKind": "esteira",
    "measurementMethod": "inspecao_esteira",
    "assetZone": "Lado 1 da perfuratriz",
    "observedSigns": "Perda de tensão e umidade próxima ao tensionador",
    "verification": "Registrar condição em inspeção autorizada Sandvik; conferir manual do tensionador antes de intervir em graxa pressurizada.",
    "uncertainty": "Ponto úmido não comprova vazamento em vedação.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION"
    ]
  },
  "UND005": {
    "componentGroup": "Comando final de caminhão",
    "undercarriageKind": "transmissao",
    "measurementMethod": "temperatura",
    "assetZone": "Comando final, posição a confirmar",
    "observedSigns": "Aquecimento e ruído sob carga",
    "verification": "Correlacionar temperatura e ruído em condição segura; encaminhar avaliação do comando final.",
    "uncertainty": "Comando final do 777E não deve receber medição CTS de esteira.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": null,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_TRACK_INSPECTION"
    ]
  },
  "UND006": {
    "componentGroup": "Articulação da esteira",
    "undercarriageKind": "esteira",
    "measurementMethod": "inspecao_esteira",
    "assetZone": "D9, lado/posição 2",
    "observedSigns": "Estalos em manobra e possível deslocamento de pino",
    "verification": "Inspecionar pinos/buchas, fixações e folga com método aprovado; planejar medição CTS quando aplicável.",
    "uncertainty": "Estalos não confirmam pino solto sem inspeção.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Condições sem avaliação podem evoluir em desgaste ou indisponibilidade no exercício.",
    "delayThresholdTurns": 4,
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION"
    ]
  },
  "UND007": {
    "componentGroup": "Elos de esteira",
    "assetZone": "Lado 1 versus lado 2",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Programar CTS por lado e comparar altura dos elos com referência do arranjo de rodante instalado.",
    "uncertainty": "A assimetria aparente não revela percentual de desgaste nem causa de alinhamento.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Atraso pode reduzir a janela de intervenção planejada e aumentar custo de material rodante.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Levantamento visual do D9 sugere desgaste desigual dos elos entre lados, sem medidas de perfil registradas."
  },
  "UND008": {
    "componentGroup": "Pinos e buchas",
    "assetZone": "Esteira lado 1, bucha externa",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Medir buchas por CTS e verificar padrão de contato com segmentos conforme arranjo de esteira.",
    "uncertainty": "Marcas de contato não determinam se há necessidade de giro de buchas ou troca.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Perda de oportunidade de planejar intervenções em pinos, buchas e roda motriz.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Buchas de uma esteira do D9 apresentam polimento assimétrico e sinais de contato irregular com a roda motriz."
  },
  "UND009": {
    "componentGroup": "Roda motriz / segmentos",
    "assetZone": "Lado 1, conjunto de segmentos",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Registrar perfil do segmento e comparar desgaste com padrão correto e condição de buchas/elo.",
    "uncertainty": "Não é possível classificar limite de descarte sem critério específico do conjunto.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Maior risco de desgaste conjunto entre buchas e segmentos caso contato anormal persista.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Inspeção encontra desgaste com aparência irregular nas bolsas dos segmentos da roda motriz do D9."
  },
  "UND010": {
    "componentGroup": "Roda-guia",
    "assetZone": "Lado 2, roda-guia dianteira",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Conferir geometria e medições CTS e condições de alinhamento da guia antes de recomendar intervenção.",
    "uncertainty": "Marcas laterais não comprovam falha de rolamento nem posição incorreta da roda-guia.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Continuidade do desalinhamento pode concentrar desgaste em elos e guias.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Na roda-guia do D9, as abas mostram desgaste desigual e há sinais de contato lateral da esteira."
  },
  "UND011": {
    "componentGroup": "Rolete de retorno",
    "assetZone": "Lado 1, rolete de retorno",
    "measurementMethod": "termica",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Correlacionar temperatura e movimento por inspeção autorizada; avaliar vedação e rolamento sem desmontagem prematura.",
    "uncertainty": "A diferença térmica não prova rolamento gripado.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, postergação amplia risco de imobilização e danos de contato na esteira.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Rolete de retorno do D9 apresenta calor localizado e indício de rotação irregular durante deslocamento."
  },
  "UND012": {
    "componentGroup": "Sapatas / garras",
    "assetZone": "Lados 1 e 2, sapatas",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Medir garras e sapatas com CTS no arranjo aplicável; avaliar solo, operação e histórico de desgaste.",
    "uncertainty": "O desgaste observado não revela quanto resta de vida útil.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Perda de tração e janela de renovação mais cara se a intervenção for postergada.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "As garras das sapatas do D9 apresentam perda de altura desigual entre lados sem série dimensional anterior."
  },
  "UND013": {
    "componentGroup": "Roletes inferiores",
    "assetZone": "Esteira lado 1, rolete a identificar",
    "measurementMethod": "termica",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Localizar rolete com inspeção segura, registrar tendência térmica e planejar avaliação de rotação/vedação.",
    "uncertainty": "Temperatura comparativa sozinha não comprova rolamento defeituoso.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, atraso pode causar parada inesperada por falha de apoio da esteira.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Em deslocamento curto, um rolete inferior da 6030 fica mais quente e há resistência de giro perceptível."
  },
  "UND014": {
    "componentGroup": "Roletes inferiores",
    "assetZone": "Esteira lado 1",
    "measurementMethod": "termica",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Inspecionar roletes e condição da guia, correlacionar ruído, temperatura e rotação com cuidado.",
    "uncertainty": "Ruído repetitivo não identifica rolamento ou componente sem inspeção.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Atraso pode permitir agravamento de desgaste antes da correção.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Na 336GC, uma região da esteira apresenta ruído cíclico durante deslocamento lento, sem rolete isolado."
  },
  "UND015": {
    "componentGroup": "Pinos e buchas",
    "assetZone": "Esteira lado 2",
    "measurementMethod": "inspecao_esteira",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Verificar articulações e folgas com máquina imobilizada e equipe habilitada; comparar desgaste medido posteriormente.",
    "uncertainty": "Estalos não indicam qual pino ou bucha está avariado.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, postergação pode transformar anomalia localizada em interrupção do deslocamento.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "A esteira do D9 apresenta estalos em manobras e marcas de atrito localizadas próximas a uma articulação."
  },
  "UND016": {
    "componentGroup": "Fixações de sapatas",
    "assetZone": "Esteira lado 1, sapata a identificar",
    "measurementMethod": "inspecao_esteira",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Encaminhar avaliação imediata ao PCM, garantir inspeção do conjunto e plano de fixação conforme torque OEM.",
    "uncertainty": "A ausência de fixador é constatada, mas a extensão de danos na rosca/elo é desconhecida.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, postergação amplia o risco de soltura da sapata e danos adicionais.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Inspeção visual no D9 constata parafuso de fixação de sapata ausente e sinais de movimento entre sapata e elo."
  },
  "UND017": {
    "componentGroup": "Tensionador hidráulico/de graxa",
    "assetZone": "Lado 1, mecanismo tensionador",
    "measurementMethod": "inspecao_esteira",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Confirmar especificação do tensionador no manual Sandvik; avaliar vedação e ajuste apenas em procedimento seguro. Referência de método Caterpillar não substitui limite OEM Sandvik.",
    "uncertainty": "Umidade próxima ao tensionador não prova vazamento de graxa e CTS Cat não é critério do arranjo Sandvik.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, atraso pode ampliar folga e gerar risco de desalojamento da esteira.",
    "delayThresholdTurns": 4,
    "sourceKeys": [],
    "undercarriageKind": "esteira",
    "observedSigns": "Na DR410i, a esteira fica frouxa após deslocamento e há umidade próxima ao mecanismo de tensionamento.",
    "oemSpecificPending": true
  },
  "UND018": {
    "componentGroup": "Tensionamento de esteira",
    "assetZone": "Lado 1, mecanismo tensionador",
    "measurementMethod": "inspecao_esteira",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Solicitar avaliação prioritária e conferência do mecanismo segundo procedimento Sandvik, sem manipular graxa sob pressão sem autorização. Referência de método Caterpillar não substitui limite OEM Sandvik.",
    "uncertainty": "O sintoma não distingue falha de vedação, desgaste ou ajuste.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, atraso aumenta a chance de parada por desengate da esteira.",
    "delayThresholdTurns": 4,
    "sourceKeys": [],
    "undercarriageKind": "esteira",
    "observedSigns": "Relatos sucessivos na DR410i indicam folga crescente da esteira após manobras, ainda sem confirmação do ponto de perda.",
    "oemSpecificPending": true
  },
  "UND019": {
    "componentGroup": "Rodante / limpeza",
    "assetZone": "Lados 1 e 2, região de elos/roletes",
    "measurementMethod": "inspecao_esteira",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Verificar limpeza segura, padrão de acúmulo e tensão conforme OMM; não ajustar graxa baseado apenas na aparência.",
    "uncertainty": "Solo compactado pode alterar tensão aparente sem demonstrar defeito do tensor.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Sem limpeza ou correção adequada, pode ocorrer desgaste adicional de elos e roletes.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_TRACK_INSPECTION",
      "CAT_TRACK_TENSION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Inspeção encontra solo compactado no rodante do D9 com deslocamento mais pesado após operação em material úmido."
  },
  "UND020": {
    "componentGroup": "Elos / sapatas",
    "assetZone": "Esteira esquerda e direita, pontos de CTS",
    "measurementMethod": "cts",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Programar medição CTS Cat por componente/lado com arranjo correto e documentar percentual somente após leitura.",
    "uncertainty": "Estimativa visual não é porcentagem CTS nem vida residual.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Sem tendência medida, a compra de conjunto pode ser tardia ou antecipada.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "CAT_CTS",
      "CAT_TRACK_INSPECTION",
      "CAT_EXCAVATOR_INSPECTION"
    ],
    "undercarriageKind": "esteira",
    "observedSigns": "Na CAT 395, elos e garras mostram desgaste visual crescente, mas a equipe não possui série CTS para comparar."
  },
  "UND021": {
    "componentGroup": "Pneu / flanco",
    "assetZone": "Roda motriz, lado e posição a confirmar",
    "measurementMethod": "pneu",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Isolar condição e acionar profissional de pneus para avaliar carcaça/aro conforme procedimento, antes de qualquer retorno à operação.",
    "uncertainty": "Não é possível assegurar reparabilidade; não inflar ou manipular conjunto suspeito sem equipe especializada.",
    "triage": "avaliacao_prioritaria",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, a postergação aumenta a exposição a falha estrutural de pneu.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "MICHELIN_OTR_INSPECTION",
      "MICHELIN_OTR_PRESSURE",
      "MICHELIN_OTR_DAMAGE"
    ],
    "undercarriageKind": "pneu",
    "observedSigns": "Inspeção na CAT 966 encontra corte profundo e deformação visível no flanco de um pneu; integridade estrutural desconhecida."
  },
  "UND022": {
    "componentGroup": "Pneu / alinhamento",
    "assetZone": "Tandem, posição 4",
    "measurementMethod": "pneu",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Correlacionar desgaste por posição, pressão e geometria com equipe de pneus, sem substituir pneu antes da análise.",
    "uncertainty": "Não há medição que comprove qual eixo está desalinhado.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Desgaste da banda pode continuar mesmo antes do ajuste geométrico.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "MICHELIN_OTR_INSPECTION",
      "MICHELIN_OTR_PRESSURE",
      "MICHELIN_OTR_DAMAGE"
    ],
    "undercarriageKind": "pneu",
    "observedSigns": "Na CAT 16, pneu da posição 4 mostra desgaste direcional enquanto operador relata leve tendência lateral."
  },
  "UND023": {
    "componentGroup": "Pneu / desgaste residual",
    "assetZone": "Tandem, posição 4",
    "measurementMethod": "pneu",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Documentar banda remanescente e decisão de substituição segundo critérios do fabricante de pneus.",
    "uncertainty": "Corrigir geometria não recompõe borracha; não concluir falha de alinhamento persistente.",
    "triage": "acompanhar",
    "delayRisk": "moderado",
    "riskOnDelay": "Pneu já consumido pode precisar de substituição mesmo com causa geométrica corrigida.",
    "delayThresholdTurns": null,
    "sourceKeys": [
      "MICHELIN_OTR_INSPECTION",
      "MICHELIN_OTR_PRESSURE",
      "MICHELIN_OTR_DAMAGE"
    ],
    "undercarriageKind": "pneu",
    "observedSigns": "Após correção de alinhamento na CAT 16, o pneu da posição 4 continua com desgaste já estabelecido."
  },
  "UND024": {
    "componentGroup": "Pneu / pressão",
    "assetZone": "Roda de transporte, posição a confirmar",
    "measurementMethod": "pressao_pneu",
    "measurementValue": null,
    "wearPercent": null,
    "referenceLimit": null,
    "unit": null,
    "measurementStatus": "pendente",
    "verification": "Confirmar leitura por equipe habilitada, pressão recomendada conforme carga e histórico; pesquisar vazamento e dano antes de uso.",
    "uncertainty": "Sem condição de medição e especificação por pneu, não se pode determinar limite de operação.",
    "triage": "acompanhar",
    "delayRisk": "alto",
    "riskOnDelay": "Na simulação, uso com pressão inadequada acelera desgaste e eleva risco de falha do pneu.",
    "delayThresholdTurns": 4,
    "sourceKeys": [
      "MICHELIN_OTR_INSPECTION",
      "MICHELIN_OTR_PRESSURE",
      "MICHELIN_OTR_DAMAGE"
    ],
    "undercarriageKind": "pneu",
    "observedSigns": "Registro de inspeção do 777E aponta pressão de pneu inferior ao histórico informado, sem medição homologada a frio."
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "UND007",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: desgaste de elos discrepante entre os lados",
    "baseline": "Levantamento visual do D9 sugere desgaste desigual dos elos entre lados, sem medidas de perfil registradas.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND008",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: bucha externa com polimento e desgaste desigual",
    "baseline": "Buchas de uma esteira do D9 apresentam polimento assimétrico e sinais de contato irregular com a roda motriz.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "UND009",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: segmentos da roda motriz com marcas de encaixe anormal",
    "baseline": "Inspeção encontra desgaste com aparência irregular nas bolsas dos segmentos da roda motriz do D9.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND010",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: roda-guia com desgaste assimétrico de aba",
    "baseline": "Na roda-guia do D9, as abas mostram desgaste desigual e há sinais de contato lateral da esteira.",
    "escalationScenario": "INC091",
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND011",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: rolete de retorno com aquecimento e pouca rotação",
    "baseline": "Rolete de retorno do D9 apresenta calor localizado e indício de rotação irregular durante deslocamento.",
    "escalationScenario": "INC090",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "UND012",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: sapatas com garras desgastadas em patamares distintos",
    "baseline": "As garras das sapatas do D9 apresentam perda de altura desigual entre lados sem série dimensional anterior.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "UND013",
    "category": "undercarriage",
    "modelId": "EQ02",
    "title": "6030: rolete inferior aquecido durante deslocamento",
    "baseline": "Em deslocamento curto, um rolete inferior da 6030 fica mais quente e há resistência de giro perceptível.",
    "escalationScenario": "INC011",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "UND014",
    "category": "undercarriage",
    "modelId": "EQ04",
    "title": "336GC: ruído repetitivo de rolete em deslocamento lento",
    "baseline": "Na 336GC, uma região da esteira apresenta ruído cíclico durante deslocamento lento, sem rolete isolado.",
    "escalationScenario": "INC017",
    "followupTool": "TERM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND015",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: articulações com marcas de atrito e estalos",
    "baseline": "A esteira do D9 apresenta estalos em manobras e marcas de atrito localizadas próximas a uma articulação.",
    "escalationScenario": "INC023",
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND016",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: fixação de sapata com parafuso ausente",
    "baseline": "Inspeção visual no D9 constata parafuso de fixação de sapata ausente e sinais de movimento entre sapata e elo.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "UND017",
    "category": "undercarriage",
    "modelId": "EQ05",
    "title": "DR410i: perda de tensão da esteira com umidade no tensionador",
    "baseline": "Na DR410i, a esteira fica frouxa após deslocamento e há umidade próxima ao mecanismo de tensionamento.",
    "escalationScenario": "INC095",
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND018",
    "category": "undercarriage",
    "modelId": "EQ05",
    "title": "DR410i: folga de esteira aumentando após manobras",
    "baseline": "Relatos sucessivos na DR410i indicam folga crescente da esteira após manobras, ainda sem confirmação do ponto de perda.",
    "escalationScenario": "INC095",
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "UND019",
    "category": "undercarriage",
    "modelId": "EQ07",
    "title": "D9: material compactado no rodante e tensão aparente excessiva",
    "baseline": "Inspeção encontra solo compactado no rodante do D9 com deslocamento mais pesado após operação em material úmido.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "UND020",
    "category": "undercarriage",
    "modelId": "EQ03",
    "title": "CAT 395: elos e sapatas com desgaste progressivo sem medição",
    "baseline": "Na CAT 395, elos e garras mostram desgaste visual crescente, mas a equipe não possui série CTS para comparar.",
    "escalationScenario": null,
    "followupTool": "CTSM",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "UND021",
    "category": "undercarriage",
    "modelId": "EQ08",
    "title": "CAT 966: corte profundo e deformação de flanco do pneu",
    "baseline": "Inspeção na CAT 966 encontra corte profundo e deformação visível no flanco de um pneu; integridade estrutural desconhecida.",
    "escalationScenario": null,
    "followupTool": "CALP",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "UND022",
    "category": "undercarriage",
    "modelId": "EQ09",
    "title": "CAT 16: desgaste direcional no tandem com desvio lateral",
    "baseline": "Na CAT 16, pneu da posição 4 mostra desgaste direcional enquanto operador relata leve tendência lateral.",
    "escalationScenario": "INC094",
    "followupTool": "CALP",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "UND023",
    "category": "undercarriage",
    "modelId": "EQ09",
    "title": "CAT 16: desgaste remanescente após alinhamento corrigido",
    "baseline": "Após correção de alinhamento na CAT 16, o pneu da posição 4 continua com desgaste já estabelecido.",
    "escalationScenario": "INC100",
    "followupTool": "CALP",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "UND024",
    "category": "undercarriage",
    "modelId": "EQ01",
    "title": "CAT 777E: pressão do pneu abaixo do histórico de turno",
    "baseline": "Registro de inspeção do 777E aponta pressão de pneu inferior ao histórico informado, sem medição homologada a frio.",
    "escalationScenario": null,
    "followupTool": "CALP",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 return {VERSION,SOURCES,METADATA,ENTRIES};
});
