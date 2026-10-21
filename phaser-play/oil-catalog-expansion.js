/* P.O.R.C.A.R.I.A. — óleo e fluidos, expansão v2 (v0.9.5 do jogo).
   Os sintomas são cenários educativos autorais baseados em FAMÍLIAS de sinais Cat S.O.S,
   não são laudos reais, limites de condenação, prescrições de operação ou diagnósticos confirmados.
   Fonte OEM em SOURCES; campos de incerteza e confirmação mantêm hipótese separada de evidência.
*/
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_OIL_EXPANSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='2.0.0';
 const SOURCES=Object.freeze({
  "CAT_SOS_RESULTADOS": "https://www.cat.com/en_US/support/maintenance/sos-services/take-sample.html",
  "CAT_SOS_CAPACIDADES": "https://www.cat.com/en_US/support/maintenance/sos-services/analysis-101.html",
  "CAT_SOS_AMOSTRAGEM": "https://www.cat.com/en_US/blog/take-drive-train-samples.html",
  "CAT_OLEOS": "https://www.cat.com/en_US/campaigns/awareness/filters-and-fluids/fluids/oils.html",
  "CAT_DRIVETRAIN": "https://www.cat.com/en_US/blog/drivetrain-repairs-preventive-maintenance.html"
});
 const METADATA=Object.freeze({
  "OIL001": {
    "compartment": "Comando final (posição 1)",
    "indicators": [
      "Água",
      "emulsão"
    ],
    "verification": "Confirmar amostra, histórico de água e condição de vedação.",
    "uncertainty": "Água não identifica ponto de ingresso.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL002": {
    "compartment": "Comando final (posição 2)",
    "indicators": [
      "Silício",
      "alumínio",
      "partículas"
    ],
    "verification": "Validar representatividade, limpeza da coleta e vedações.",
    "uncertainty": "Associação de elementos não prova poeira entrando pelo retentor.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL003": {
    "compartment": "Diferencial",
    "indicators": [
      "Fe",
      "Cu",
      "tendência"
    ],
    "verification": "Correlacionar histórico e sintomas sob carga.",
    "uncertainty": "Metal no lubrificante não identifica rolamento.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL004": {
    "compartment": "Sistema hidráulico",
    "indicators": [
      "Particulado",
      "histórico"
    ],
    "verification": "Confrontar tendência, filtros e condição da coleta.",
    "uncertainty": "Contagem não localiza gerador de partículas.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL005": {
    "compartment": "Motor diesel (posição 1)",
    "indicators": [
      "Metais",
      "horas do óleo"
    ],
    "verification": "Conferir hora da amostra e filtro existente.",
    "uncertainty": "Metais não indicam componente específico sem evidências.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL006": {
    "compartment": "Diferencial dianteiro",
    "indicators": [
      "Silício",
      "partículas"
    ],
    "verification": "Verificar contaminação externa da coleta e condição das vedações.",
    "uncertainty": "A causa de ingresso ainda é hipótese.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL007": {
    "compartment": "Transmissão/tandem",
    "indicators": [
      "Partículas",
      "tendência"
    ],
    "verification": "Conferir compartimento, pontos de coleta e histórico de ruído.",
    "uncertainty": "Não há componente condenado.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_AMOSTRAGEM"
    ]
  },
  "OIL008": {
    "compartment": "Circuito de arrefecimento",
    "indicators": [
      "Concentração",
      "histórico de reposição"
    ],
    "verification": "Confirmar especificação do fluido e medição com refratômetro.",
    "uncertainty": "Concentração fora de referência não confirma dano interno.",
    "triage": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_CAPACIDADES"
    ]
  },
  "OIL009": {
    "compartment": "Ferro, cobre, horas da amostra",
    "indicators": [
      "A série de óleo do motor registra crescimento concomitante de Fe e Cu",
      "ainda sem confirmação de desgaste interno."
    ],
    "verification": "Indícios elementares não isolam peça ou mecanismo.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL010": {
    "compartment": "Partículas, Fe, resposta do freio",
    "indicators": [
      "Laudos do circuito de freios apontam partículas ferrosas crescentes; a operação registra resposta irregular eventual."
    ],
    "verification": "As partículas não confirmam bomba avariada.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL011": {
    "compartment": "Ferro, partículas, ruído",
    "indicators": [
      "A tendência do óleo do redutor de giro aponta aumento de Fe e o histórico menciona ruído intermitente ao girar."
    ],
    "verification": "Fe no óleo não identifica engrenagem específica.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL012": {
    "compartment": "Ferro, partículas, vibração sob tração",
    "indicators": [
      "Na transmissão",
      "a tendência de partículas e metais aumenta e há relato de vibração sob esforço."
    ],
    "verification": "A origem do desgaste não é conhecida.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL013": {
    "compartment": "Silício, alumínio, partículas",
    "indicators": [
      "O comando final do D9 volta a apresentar silício",
      "alumínio e material particulado após histórico de entrada ambiental."
    ],
    "verification": "Silício pode ter outras origens; não prova falha de vedação.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL014": {
    "compartment": "Fe, Cu, vibração",
    "indicators": [
      "Duas análises do diferencial sugerem desgaste progressivo e a operação reporta vibração em transporte carregado."
    ],
    "verification": "Fe e Cu não identificam rolamento específico.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL015": {
    "compartment": "Silício, partículas, condições de coleta",
    "indicators": [
      "A análise do diferencial dianteiro da 966 mostra indício de ingresso ambiental após lavagem na região do eixo."
    ],
    "verification": "Contaminação de amostra não equivale a ingresso no sistema.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL016": {
    "compartment": "Fe, Cu, condição do filtro",
    "indicators": [
      "Laudos do motor diesel apontam metais acima do histórico e manutenção de filtro de óleo próxima do prazo."
    ],
    "verification": "Metal elevado não prova que o filtro é a causa.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL017": {
    "compartment": "Água, partículas, ruído",
    "indicators": [
      "Após correção tardia de vedação",
      "o comando final ainda apresenta umidade",
      "resíduos e ruído sob carga."
    ],
    "verification": "Persistência da condição não comprova rolamento danificado.",
    "uncertainty": "avaliacao_prioritaria",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL018": {
    "compartment": "Silício, Fe, resíduos",
    "indicators": [
      "Após intervenção em vedação do comando final do D9",
      "surge novo resíduo metálico e ruído em tração."
    ],
    "verification": "Partículas não demonstram dano em engrenagem sem evidência.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL019": {
    "compartment": "Contagem de partículas, tendência, temperatura",
    "indicators": [
      "O sistema hidráulico da 6030 apresenta elevação do particulado e resposta irregular de função após esforço."
    ],
    "verification": "O dado não individualiza bomba nem válvula.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL020": {
    "compartment": "Ferro, partículas, ruído",
    "indicators": [
      "O conjunto tandem da CAT 16 registra tendência de Fe/partículas e novo ruído sob esforço."
    ],
    "verification": "Não existe confirmação de engrenagem danificada.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL021": {
    "compartment": "Viscosidade, combustível diluído",
    "indicators": [
      "O laudo do motor da CAT 395 aponta viscosidade abaixo da referência e possível diluição por combustível."
    ],
    "verification": "A viscosidade isolada não determina causa; roteiro FMEA específico ainda não cadastrado.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL022": {
    "compartment": "Fuligem, oxidação, viscosidade",
    "indicators": [
      "A série de óleo do motor registra elevação de fuligem e índice de oxidação; condição do lubrificante requer avaliação."
    ],
    "verification": "Oxidação e fuligem não definem peça responsável; falta roteiro específico.",
    "uncertainty": "acompanhar",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ]
  },
  "OIL023": {
    "compartment": "Sódio, glicol, água, viscosidade",
    "indicators": [
      "Laudo do motor diesel da 6030 indica possível contaminação por arrefecimento",
      "com traços que requerem confirmação."
    ],
    "verification": "Sódio isolado não confirma vazamento; rota de investigação específica não cadastrada.",
    "uncertainty": "avaliacao_prioritaria",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_CAPACIDADES"
    ]
  },
  "OIL024": {
    "compartment": "Aditivos, viscosidade, registro de troca",
    "indicators": [
      "O laudo do comando final apresenta perfil de aditivos diferente após substituição declarada do produto",
      "sem outros indícios de falha."
    ],
    "verification": "Mudança de assinatura química pode refletir formulação distinta, mas a compatibilidade precisa ser confirmada.",
    "uncertainty": "revisar_baseline",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_OLEOS"
    ]
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "OIL009",
    "category": "oil",
    "modelId": "EQ03",
    "title": "Motor diesel: ferro e cobre com tendência crescente",
    "baseline": "INC069",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Conferir horas do óleo e histórico de filtro; repetir amostra representativa antes da troca."
    ]
  },
  {
    "id": "OIL010",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Freios hidráulicos: partículas ferrosas em elevação",
    "baseline": "INC065",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Correlacionar histórico da amostra ao relato funcional e encaminhar prioridade técnica se houver alteração de resposta."
    ]
  },
  {
    "id": "OIL011",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Redutor de giro: ferro crescente e ruído intermitente",
    "baseline": "INC089",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Confirmar lado/redutor e horas do lubrificante; correlacionar ruído e inspeção segura."
    ]
  },
  {
    "id": "OIL012",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Transmissão: aumento de metais associado a vibração",
    "baseline": "INC088",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Conferir compartimento",
      " lubrificante e vibração; planejar diagnóstico da transmissão."
    ]
  },
  {
    "id": "OIL013",
    "category": "oil",
    "modelId": "EQ07",
    "title": "Comando final: abrasivos recorrentes após contaminação",
    "baseline": "INC042",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Confirmar limpeza do ponto de amostra e integridade de respiro/vedações."
    ]
  },
  {
    "id": "OIL014",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Diferencial: metais de desgaste e vibração sob carga",
    "baseline": "INC043",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Conferir histórico",
      " compartimento e evidência operacional antes de concluir dano interno."
    ]
  },
  {
    "id": "OIL015",
    "category": "oil",
    "modelId": "EQ08",
    "title": "Diferencial dianteiro: silício e partículas ambientais",
    "baseline": "INC092",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Verificar técnica de coleta e condições de tampas",
      " respiros e vedações."
    ]
  },
  {
    "id": "OIL016",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Motor diesel: metais elevados com troca de filtro próxima",
    "baseline": "INC068",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Verificar identidade do motor",
      " horas do óleo e histórico do elemento filtrante."
    ]
  },
  {
    "id": "OIL017",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Comando final: umidade residual e ruído após correção",
    "baseline": "INC096",
    "escalationScenario": "agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Encaminhar ao PCM para avaliação prioritária e correlação com inspeção de ruído."
    ]
  },
  {
    "id": "OIL018",
    "category": "oil",
    "modelId": "EQ07",
    "title": "Comando final: partículas após intervenção em vedação",
    "baseline": "INC097",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Confrontar amostras anterior/posterior e solicitar verificação de contaminação residual."
    ]
  },
  {
    "id": "OIL019",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Sistema hidráulico: partículas crescentes e resposta irregular",
    "baseline": "INC061",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Inspecionar condições do ponto de amostra",
      " filtragem e sintoma da função."
    ]
  },
  {
    "id": "OIL020",
    "category": "oil",
    "modelId": "EQ09",
    "title": "Tandem: tendência de Fe e partículas com ruído novo",
    "baseline": "INC093",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Confirmar lado/posição",
      " histórico de óleo e ocorrência do ruído."
    ]
  },
  {
    "id": "OIL021",
    "category": "oil",
    "modelId": "EQ03",
    "title": "Motor diesel: viscosidade reduzida e suspeita de combustível",
    "baseline": "null",
    "escalationScenario": "inconclusivo,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Correlacionar horas",
      " nível de óleo",
      " integridade da amostra e confirmação de diluição; avaliar necessidade de intervenção."
    ]
  },
  {
    "id": "OIL022",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Motor diesel: fuligem e oxidação em elevação",
    "baseline": "null",
    "escalationScenario": "estavel,agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Verificar horas",
      " aplicação e qualidade da amostra; confrontar viscosidade e histórico."
    ]
  },
  {
    "id": "OIL023",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Motor diesel: suspeita de líquido de arrefecimento no óleo",
    "baseline": "null",
    "escalationScenario": "agravamento",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Priorizar avaliação técnica e confirmar contaminante e condição do sistema antes de decisão operacional."
    ]
  },
  {
    "id": "OIL024",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Comando final: aditivos alterados após troca declarada de óleo",
    "baseline": "null",
    "escalationScenario": "estavel,estavel",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "Conferir produto/compatibilidade",
      " histórico e nova linha de base com o analista; não condenar o conjunto pelo perfil isolado."
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 return {VERSION,SOURCES,METADATA,ENTRIES};
});
