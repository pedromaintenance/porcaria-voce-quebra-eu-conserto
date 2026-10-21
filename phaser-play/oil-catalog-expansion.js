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
    "compartment": "Motor diesel",
    "indicators": [
      "Ferro",
      "cobre",
      "horas da amostra"
    ],
    "verification": "Conferir horas do óleo e histórico de filtro; repetir amostra representativa antes da troca.",
    "uncertainty": "Indícios elementares não isolam peça ou mecanismo.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL010": {
    "compartment": "Circuito hidráulico dos freios",
    "indicators": [
      "Partículas",
      "Fe",
      "resposta do freio"
    ],
    "verification": "Correlacionar histórico da amostra ao relato funcional e encaminhar prioridade técnica se houver alteração de resposta.",
    "uncertainty": "As partículas não confirmam bomba avariada.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL011": {
    "compartment": "Redutor de giro",
    "indicators": [
      "Ferro",
      "partículas",
      "ruído"
    ],
    "verification": "Confirmar lado/redutor e horas do lubrificante; correlacionar ruído e inspeção segura.",
    "uncertainty": "Fe no óleo não identifica engrenagem específica.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL012": {
    "compartment": "Transmissão",
    "indicators": [
      "Ferro",
      "partículas",
      "vibração sob tração"
    ],
    "verification": "Conferir compartimento, lubrificante e vibração; planejar diagnóstico da transmissão.",
    "uncertainty": "A origem do desgaste não é conhecida.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL013": {
    "compartment": "Comando final (posição 2)",
    "indicators": [
      "Silício",
      "alumínio",
      "partículas"
    ],
    "verification": "Confirmar limpeza do ponto de amostra e integridade de respiro/vedações.",
    "uncertainty": "Silício pode ter outras origens; não prova falha de vedação.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL014": {
    "compartment": "Diferencial do eixo motriz",
    "indicators": [
      "Fe",
      "Cu",
      "vibração"
    ],
    "verification": "Conferir histórico, compartimento e evidência operacional antes de concluir dano interno.",
    "uncertainty": "Fe e Cu não identificam rolamento específico.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL015": {
    "compartment": "Diferencial dianteiro",
    "indicators": [
      "Silício",
      "partículas",
      "condições de coleta"
    ],
    "verification": "Verificar técnica de coleta e condições de tampas, respiros e vedações.",
    "uncertainty": "Contaminação de amostra não equivale a ingresso no sistema.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL016": {
    "compartment": "Motor diesel (posição 1)",
    "indicators": [
      "Fe",
      "Cu",
      "condição do filtro"
    ],
    "verification": "Verificar identidade do motor, horas do óleo e histórico do elemento filtrante.",
    "uncertainty": "Metal elevado não prova que o filtro é a causa.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL017": {
    "compartment": "Comando final (posição 1)",
    "indicators": [
      "Água",
      "partículas",
      "ruído"
    ],
    "verification": "Encaminhar ao PCM para avaliação prioritária e correlação com inspeção de ruído.",
    "uncertainty": "Persistência da condição não comprova rolamento danificado.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "avaliacao_prioritaria"
  },
  "OIL018": {
    "compartment": "Comando final (posição 2)",
    "indicators": [
      "Silício",
      "Fe",
      "resíduos"
    ],
    "verification": "Confrontar amostras anterior/posterior e solicitar verificação de contaminação residual.",
    "uncertainty": "Partículas não demonstram dano em engrenagem sem evidência.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL019": {
    "compartment": "Sistema hidráulico de implementos",
    "indicators": [
      "Contagem de partículas",
      "tendência",
      "temperatura"
    ],
    "verification": "Inspecionar condições do ponto de amostra, filtragem e sintoma da função.",
    "uncertainty": "O dado não individualiza bomba nem válvula.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL020": {
    "compartment": "Conjunto tandem/transmissão",
    "indicators": [
      "Ferro",
      "partículas",
      "ruído"
    ],
    "verification": "Confirmar lado/posição, histórico de óleo e ocorrência do ruído.",
    "uncertainty": "Não existe confirmação de engrenagem danificada.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL021": {
    "compartment": "Óleo do motor diesel",
    "indicators": [
      "Viscosidade",
      "combustível diluído"
    ],
    "verification": "Correlacionar horas, nível de óleo, integridade da amostra e confirmação de diluição; avaliar necessidade de intervenção.",
    "uncertainty": "A viscosidade isolada não determina causa; roteiro FMEA específico ainda não cadastrado.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL022": {
    "compartment": "Óleo do motor diesel",
    "indicators": [
      "Fuligem",
      "oxidação",
      "viscosidade"
    ],
    "verification": "Verificar horas, aplicação e qualidade da amostra; confrontar viscosidade e histórico.",
    "uncertainty": "Oxidação e fuligem não definem peça responsável; falta roteiro específico.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_DRIVETRAIN"
    ],
    "triage": "acompanhar"
  },
  "OIL023": {
    "compartment": "Óleo do motor diesel",
    "indicators": [
      "Sódio",
      "glicol",
      "água",
      "viscosidade"
    ],
    "verification": "Priorizar avaliação técnica e confirmar contaminante e condição do sistema antes de decisão operacional.",
    "uncertainty": "Sódio isolado não confirma vazamento; rota de investigação específica não cadastrada.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_SOS_CAPACIDADES"
    ],
    "triage": "avaliacao_prioritaria"
  },
  "OIL024": {
    "compartment": "Comando final",
    "indicators": [
      "Aditivos",
      "viscosidade",
      "registro de troca"
    ],
    "verification": "Conferir produto/compatibilidade, histórico e nova linha de base com o analista; não condenar o conjunto pelo perfil isolado.",
    "uncertainty": "Mudança de assinatura química pode refletir formulação distinta, mas a compatibilidade precisa ser confirmada.",
    "sourceKeys": [
      "CAT_SOS_RESULTADOS",
      "CAT_OLEOS"
    ],
    "triage": "revisar_baseline"
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "OIL009",
    "category": "oil",
    "modelId": "EQ03",
    "title": "Motor diesel: ferro e cobre com tendência crescente",
    "baseline": "A série de óleo do motor registra crescimento concomitante de Fe e Cu, ainda sem confirmação de desgaste interno.",
    "escalationScenario": "INC069",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL010",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Freios hidráulicos: partículas ferrosas em elevação",
    "baseline": "Laudos do circuito de freios apontam partículas ferrosas crescentes; a operação registra resposta irregular eventual.",
    "escalationScenario": "INC065",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL011",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Redutor de giro: ferro crescente e ruído intermitente",
    "baseline": "A tendência do óleo do redutor de giro aponta aumento de Fe e o histórico menciona ruído intermitente ao girar.",
    "escalationScenario": "INC089",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL012",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Transmissão: aumento de metais associado a vibração",
    "baseline": "Na transmissão, a tendência de partículas e metais aumenta e há relato de vibração sob esforço.",
    "escalationScenario": "INC088",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL013",
    "category": "oil",
    "modelId": "EQ07",
    "title": "Comando final: abrasivos recorrentes após contaminação",
    "baseline": "O comando final do D9 volta a apresentar silício, alumínio e material particulado após histórico de entrada ambiental.",
    "escalationScenario": "INC042",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL014",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Diferencial: metais de desgaste e vibração sob carga",
    "baseline": "Duas análises do diferencial sugerem desgaste progressivo e a operação reporta vibração em transporte carregado.",
    "escalationScenario": "INC043",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL015",
    "category": "oil",
    "modelId": "EQ08",
    "title": "Diferencial dianteiro: silício e partículas ambientais",
    "baseline": "A análise do diferencial dianteiro da 966 mostra indício de ingresso ambiental após lavagem na região do eixo.",
    "escalationScenario": "INC092",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL016",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Motor diesel: metais elevados com troca de filtro próxima",
    "baseline": "Laudos do motor diesel apontam metais acima do histórico e manutenção de filtro de óleo próxima do prazo.",
    "escalationScenario": "INC068",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL017",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Comando final: umidade residual e ruído após correção",
    "baseline": "Após correção tardia de vedação, o comando final ainda apresenta umidade, resíduos e ruído sob carga.",
    "escalationScenario": "INC096",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "OIL018",
    "category": "oil",
    "modelId": "EQ07",
    "title": "Comando final: partículas após intervenção em vedação",
    "baseline": "Após intervenção em vedação do comando final do D9, surge novo resíduo metálico e ruído em tração.",
    "escalationScenario": "INC097",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL019",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Sistema hidráulico: partículas crescentes e resposta irregular",
    "baseline": "O sistema hidráulico da 6030 apresenta elevação do particulado e resposta irregular de função após esforço.",
    "escalationScenario": "INC061",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL020",
    "category": "oil",
    "modelId": "EQ09",
    "title": "Tandem: tendência de Fe e partículas com ruído novo",
    "baseline": "O conjunto tandem da CAT 16 registra tendência de Fe/partículas e novo ruído sob esforço.",
    "escalationScenario": "INC093",
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL021",
    "category": "oil",
    "modelId": "EQ03",
    "title": "Motor diesel: viscosidade reduzida e suspeita de combustível",
    "baseline": "O laudo do motor da CAT 395 aponta viscosidade abaixo da referência e possível diluição por combustível.",
    "escalationScenario": null,
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "OIL022",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Motor diesel: fuligem e oxidação em elevação",
    "baseline": "A série de óleo do motor registra elevação de fuligem e índice de oxidação; condição do lubrificante requer avaliação.",
    "escalationScenario": null,
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "OIL023",
    "category": "oil",
    "modelId": "EQ02",
    "title": "Motor diesel: suspeita de líquido de arrefecimento no óleo",
    "baseline": "Laudo do motor diesel da 6030 indica possível contaminação por arrefecimento, com traços que requerem confirmação.",
    "escalationScenario": null,
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "OIL024",
    "category": "oil",
    "modelId": "EQ01",
    "title": "Comando final: aditivos alterados após troca declarada de óleo",
    "baseline": "O laudo do comando final apresenta perfil de aditivos diferente após substituição declarada do produto, sem outros indícios de falha.",
    "escalationScenario": null,
    "followupTool": "COLETA",
    "followupCost": 40,
    "results": [
      "estavel",
      "estavel"
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 return {VERSION,SOURCES,METADATA,ENTRIES};
});
