/* PORCARIA v0.9.6 — catálogo de sinais eletrônicos, ciclo 3.
 * Códigos/ECMs/FMI concretos dependem de número de série, ECM e documentação OEM.
 * Nenhum código numérico é fabricado; cenários/séries simulados são autorais.
 * Fontes CAT ilustram metodologia geral, NÃO validam códigos da Sandvik.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_FAULT_EXPANSION=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const VERSION='3.0.0';
 const SOURCES=Object.freeze({
  "CAT_ET_CAPABILITIES": "https://www.cat.com/en_US/articles/IRF-Resource-Center/TIA-FAQ-Form.html",
  "CAT_ELECTRONICS_TROUBLESHOOT": "https://www.cat.com/en_US/by-industry/oil-and-gas/learning/program/electronics-troubleshooting-ilt.html",
  "CAT_ELECTRONICS_FUNDAMENTALS": "https://www.cat.com/en_US/by-industry/oil-and-gas/learning/program/g3600-electronics-fundamentals-ilt.html",
  "CAT_ACTIVE_LOGGED": "https://www.cat.com/en_US/blog/cat-hydraulics-tests-hydraulic-system-inspection.html"
});
 const METADATA=Object.freeze({
  "FLT001": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle elétrico auxiliar (módulo a identificar)",
    "observedEffect": "Aviso elétrico após lavagem sem tensão medida",
    "verification": "Verificar ECM/código, ocorrência, tensão real e conectores com multímetro conforme esquema.",
    "uncertainty": "Código não identifica sozinho conector ou falha física.",
    "alternatives": [
      "Umidade",
      "Chicote",
      "Fonte de alimentação"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT002": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle do motor (módulo a identificar)",
    "observedEffect": "Avisos logo após partida e sob vibração",
    "verification": "Confirmar registros do módulo, tensão de carga e alimentação/terra antes da correção.",
    "uncertainty": "Evento eletrônico não distingue chicote, alternador ou ponto de massa.",
    "alternatives": [
      "Alimentação",
      "Massa",
      "Chicote"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT003": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Controle de implementos (módulo a identificar)",
    "observedEffect": "Função indisponível após aquecimento",
    "verification": "Correlacionar código, comandos e resposta do implemento sob procedimento seguro.",
    "uncertainty": "Não foi confirmado defeito elétrico ou hidráulico.",
    "alternatives": [
      "Solenoide",
      "Chicote",
      "Bloqueio de comando"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT004": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Controle da direção (módulo a identificar)",
    "observedEffect": "Pressão exibida alta sem sintoma proporcional",
    "verification": "Comparar pressão mecânica verificada com indicação e alimentação do sensor.",
    "uncertainty": "Leitura de pressão não comprova sobrepressão física.",
    "alternatives": [
      "Sensor",
      "Pressão real",
      "Circuito"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT005": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Comunicação da DR410i (módulo a identificar)",
    "observedEffect": "Múltiplos indicadores sem atualização",
    "verification": "Verificar rede, alimentação de módulos e relatório Sandvik antes de identificar causa.",
    "uncertainty": "Perda de atualização não indica terminação defeituosa por si.",
    "alternatives": [
      "Rede",
      "Alimentação",
      "Tela"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT006": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Comando do joystick (módulo a identificar)",
    "observedEffect": "Não resposta do implemento ao vibrar a cabine",
    "verification": "Correlacionar código, sinal de entrada do joystick e resposta funcional com testes seguros.",
    "uncertainty": "Falha de comando não prova curto em chicote.",
    "alternatives": [
      "Joystick",
      "Chicote",
      "Intertravamento"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT007": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Controle elétrico auxiliar (módulo exato a identificar)",
    "observedEffect": "Sem perda funcional confirmada após a lavagem",
    "verification": "Consultar ocorrência e horômetro no ET/relatório; medir tensão e verificar conectores conforme procedimento.",
    "uncertainty": "Histórico não prova defeito ainda ativo nem aponta conector específico.",
    "alternatives": [
      "Umidade em conexão",
      "Problema de alimentação elétrica",
      "Anomalia de leitura ou registro"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT008": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle elétrico auxiliar (módulo exato a identificar)",
    "observedEffect": "Aviso associado à vibração, sem queda elétrica medida",
    "verification": "Correlacionar horário, vibração, alimentação medida e integridade de fixação/roteamento com circuito isolado.",
    "uncertainty": "A associação com vibração não confirma curto em chicote.",
    "alternatives": [
      "Contato frouxo",
      "Chicote em atrito",
      "Alimentação intermitente de outra origem"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT009": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Controle elétrico auxiliar (módulo exato a identificar)",
    "observedEffect": "Alertas frequentes sem alteração operacional comprovada",
    "verification": "Confirmar código/ECM, comparar leitura ET com multímetro e inspecionar circuito antes de substituir sensor.",
    "uncertainty": "Leitura errada e queda real de tensão continuam concorrentes.",
    "alternatives": [
      "Sensor descalibrado",
      "Tensão real fora da faixa",
      "Problema de referência de tensão"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT010": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle do motor (identificação do ECM pendente)",
    "observedEffect": "Alerta após partida, sem medição de tensão",
    "verification": "Conferir registros, sistema de carga, aterramento e alimentação nos pontos indicados pelo esquema elétrico.",
    "uncertainty": "Vibração não distingue falha de isolamento de queda de alimentação.",
    "alternatives": [
      "Aterramento deficiente",
      "Alimentação instável",
      "Falha de isolamento em chicote"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT011": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Controle do implemento (módulo a confirmar)",
    "observedEffect": "Perda de comando com aquecimento, sem prova de travamento hidráulico",
    "verification": "Identificar módulo e código, verificar alimentação/sinal e correlacionar temperatura e resposta funcional conforme procedimento.",
    "uncertainty": "Falha elétrica, hidráulica e erro de sinal não estão discriminados.",
    "alternatives": [
      "Bobina com falha térmica",
      "Chicote/terminal",
      "Bloqueio hidráulico ou controle"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "avaliacao_prioritaria",
    "pattern": "não especificado"
  },
  "FLT012": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle do implemento (módulo a confirmar)",
    "observedEffect": "Perda de comando condicionada à movimentação",
    "verification": "Conferir inspeção visual e continuidade do chicote com energias controladas, comparando registros antes/depois.",
    "uncertainty": "O histórico de intervenção não comprova rompimento de fio.",
    "alternatives": [
      "Roteamento ou fixação",
      "Conexão intermitente",
      "Defeito em atuador de comando"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "avaliacao_prioritaria",
    "pattern": "intermitente"
  },
  "FLT013": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle dos comandos da cabine (módulo a identificar)",
    "observedEffect": "Função comandada não responde ocasionalmente",
    "verification": "Comparar entradas de joystick no ET com resposta da função, inspecionando conexões conforme esquema e bloqueio adequado.",
    "uncertainty": "Não está comprovado defeito do joystick nem do circuito hidráulico.",
    "alternatives": [
      "Conexão de joystick",
      "Sinal elétrico intermitente",
      "Intertravamento/condição de comando"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "avaliacao_prioritaria",
    "pattern": "intermitente"
  },
  "FLT014": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Controle de implementos (módulo a confirmar)",
    "observedEffect": "Registro eletrônico sem correlação de função",
    "verification": "Conferir status de entrada e histórico de ocorrências do módulo antes de programar teste funcional seguro.",
    "uncertainty": "Não é possível atribuir o evento a falha mecânica sem correlação de comando.",
    "alternatives": [
      "Falha de conexão",
      "Ruído/interferência no sinal",
      "Condição transitória registrada"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT015": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Rede de comunicação de controle da perfuratriz (módulo OEM a identificar)",
    "observedEffect": "Múltiplas indicações congeladas",
    "verification": "Confirmar topologia e procedimento Sandvik antes de avaliar conectores, alimentação, terminações e comunicação.",
    "uncertainty": "Ausência de atualização pode decorrer do módulo de origem, rede ou tela.",
    "alternatives": [
      "Falha de rede",
      "Alimentação de um módulo",
      "Interface de visualização"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ELECTRONICS_FUNDAMENTALS",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT016": {
    "signalClass": "diagnostico",
    "codeState": "nao_confirmado",
    "moduleContext": "Comunicação do controlador de compressor (módulo a identificar)",
    "observedEffect": "Tela perde informação de estado durante deslocamento",
    "verification": "Correlacionar atualização da tela, estado do controlador e medição independente indicada no procedimento Sandvik.",
    "uncertainty": "A queda visual de pressão não comprova queda física de ar.",
    "alternatives": [
      "Conector intermitente",
      "Falha de comunicação",
      "Anomalia de medição de pressão"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ELECTRONICS_FUNDAMENTALS",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT017": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Rede de módulos de controle (módulo a identificar)",
    "observedEffect": "Intermitência histórica sem sintoma funcional atual confirmado",
    "verification": "Avaliar contagem/frequência, horário, alimentação e rastreio de comunicação conforme literatura da perfuratriz.",
    "uncertainty": "Código registrado não implica rede atualmente inoperante.",
    "alternatives": [
      "Evento histórico isolado",
      "Conector/terminação",
      "Software ou alimentação do módulo"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ELECTRONICS_FUNDAMENTALS",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT018": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Controlador do compressor (módulo a identificar)",
    "observedEffect": "Diferença relatada entre indicação e resposta percebida",
    "verification": "Confirmar medição pneumática em condição segura e comparar indicação digital/analógica antes de intervir no compressor.",
    "uncertainty": "Sem medição externa, pode ser erro de indicação em vez de perda de ar.",
    "alternatives": [
      "Falha de sensor",
      "Falha de comunicação",
      "Restrição pneumática real"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ELECTRONICS_FUNDAMENTALS",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT019": {
    "signalClass": "diagnostico",
    "codeState": "ativo",
    "moduleContext": "Controle do sistema de direção (ECM a confirmar)",
    "observedEffect": "Indicação de pressão alta sem evidência funcional proporcional",
    "verification": "Comparar pressão mecânica aferida e sinal de sensor conforme procedimento OEM e condições de segurança.",
    "uncertainty": "Não se confirma pressão real elevada nem defeito do sensor.",
    "alternatives": [
      "Sensor com deriva",
      "Pressão real alta",
      "Erro de circuito/ref. elétrica"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT020": {
    "signalClass": "evento",
    "codeState": "nao_confirmado",
    "moduleContext": "Controle do motor (módulo a confirmar)",
    "observedEffect": "Indicação intermitente associada a carga prolongada",
    "verification": "Revisar eventos, dados do motor e respiro; confirmar condição real conforme procedimento aplicável antes de afirmar blow-by.",
    "uncertainty": "Evento operacional não comprova respiro obstruído nem desgaste de anéis.",
    "alternatives": [
      "Restrição do respiro",
      "Pressão de cárter real",
      "Leitura eletrônica anômala"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "intermitente"
  },
  "FLT021": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Controle elétrico auxiliar (ECM a confirmar)",
    "observedEffect": "Nenhum efeito operacional atual comprovado",
    "verification": "Comparar primeira/última ocorrência, horômetro e recorrência antes de decidir intervir.",
    "uncertainty": "A repetição do histórico não significa código ativo no momento.",
    "alternatives": [
      "Defeito histórico corrigido",
      "Falha intermitente ainda não reproduzida",
      "Problema de registro ou leitura"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT022": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Módulo de origem não identificado",
    "observedEffect": "Nenhum comportamento funcional confirmado",
    "verification": "Obter relatório do módulo emissor, código completo e esquema aplicável ao número de série antes de propor reparo.",
    "uncertainty": "Não é possível mapear uma missão FMEA só pelo texto genérico da ocorrência.",
    "alternatives": [
      "Alimentação do ECM",
      "Falha no equipamento de leitura",
      "Evento isolado do subsistema"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  },
  "FLT023": {
    "signalClass": "evento",
    "codeState": "ativo",
    "moduleContext": "Controle do motor (ECM exato a confirmar)",
    "observedEffect": "Temperatura indicada elevada com resposta reduzida sob carga",
    "verification": "Encaminhar avaliação prioritária; confirmar condições de operação, temperaturas e procedimento de segurança OEM antes de retornar à operação.",
    "uncertainty": "O evento não identifica qual componente do arrefecimento está falhando.",
    "alternatives": [
      "Sobrecarga/condição operacional",
      "Problema de arrefecimento",
      "Leitura de temperatura incorreta"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "avaliacao_prioritaria",
    "pattern": "não especificado"
  },
  "FLT024": {
    "signalClass": "diagnostico",
    "codeState": "registrado",
    "moduleContext": "Módulo não identificado",
    "observedEffect": "Condição funcional ainda não relatada",
    "verification": "Solicitar código integral, identificação ECM e horímetro de primeira/última ocorrência antes da classificação de componente.",
    "uncertainty": "Não há evidência suficiente para ligar o registro a uma missão de falha específica.",
    "alternatives": [
      "Falha de captura dos dados",
      "Ocorrência histórica",
      "Anomalia real ainda não localizada"
    ],
    "codeValue": null,
    "codeVerified": false,
    "sourceKeys": [
      "CAT_ET_CAPABILITIES",
      "CAT_ELECTRONICS_TROUBLESHOOT"
    ],
    "triage": "acompanhar",
    "pattern": "não especificado"
  }
});
 const ENTRIES=Object.freeze([
  {
    "id": "FLT007",
    "category": "faults",
    "modelId": "EQ01",
    "title": "Alimentação auxiliar: alerta registrado após lavagem",
    "baseline": "No CAT 777E, um aviso eletrônico de alimentação auxiliar foi registrado depois de lavagem; não há confirmação de anormalidade elétrica atual.",
    "escalationScenario": "INC046",
    "followupTool": "MULT",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "estavel"
    ]
  },
  {
    "id": "FLT008",
    "category": "faults",
    "modelId": "EQ01",
    "title": "Oscilação de alimentação ao atravessar irregularidades",
    "baseline": "O histórico do 777E aponta alerta intermitente de alimentação elétrica durante deslocamento irregular; o sintoma cessa na parada.",
    "escalationScenario": "INC047",
    "followupTool": "MULT",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT009",
    "category": "faults",
    "modelId": "EQ01",
    "title": "Alerta de tensão persistente sem confirmação externa",
    "baseline": "Os avisos de alimentação elétrica do 777E tornam-se mais frequentes, porém a medição independente ainda não foi realizada.",
    "escalationScenario": "INC048",
    "followupTool": "MULT",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT010",
    "category": "faults",
    "modelId": "EQ08",
    "title": "Alimentação elétrica irregular na partida sob vibração",
    "baseline": "Na CAT 966, uma indicação de alimentação elétrica anormal aparece após a partida e ocorre mais vezes quando o motor vibra.",
    "escalationScenario": "INC049",
    "followupTool": "MULT",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT011",
    "category": "faults",
    "modelId": "EQ03",
    "title": "Comando do implemento indisponível com aquecimento",
    "baseline": "Na CAT 395, a função de implemento fica indisponível quando aquece; há alerta eletrônico ainda não interpretado pelo módulo correto.",
    "escalationScenario": "INC050",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT012",
    "category": "faults",
    "modelId": "EQ03",
    "title": "Comando do implemento falha ao mover a lança",
    "baseline": "Na CAT 395, o comando do implemento perde resposta perto de uma zona de movimentação da lança após serviço em cabos.",
    "escalationScenario": "INC051",
    "followupTool": "MULT",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT013",
    "category": "faults",
    "modelId": "EQ02",
    "title": "Joystick: intermitência do comando durante vibração",
    "baseline": "A CAT 6030 apresenta episódios de não resposta do joystick quando a cabine vibra; o alerta eletrônico foi registrado sem diagnóstico conclusivo.",
    "escalationScenario": "INC055",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT014",
    "category": "faults",
    "modelId": "EQ02",
    "title": "Entrada do joystick registrada como inconsistente",
    "baseline": "Na 6030, a indicação do comando de joystick oscila entre turnos, mas a condição real de deslocamento do implemento não foi correlacionada.",
    "escalationScenario": "INC055",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FLT015",
    "category": "faults",
    "modelId": "EQ05",
    "title": "DR410i: perda de atualização entre módulos",
    "baseline": "Na DR410i, vários parâmetros de módulos de monitoramento deixam de atualizar no painel, enquanto a causa da comunicação permanece indefinida.",
    "escalationScenario": "INC053",
    "followupTool": "CAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT016",
    "category": "faults",
    "modelId": "EQ06",
    "title": "DI650i: dados do compressor congelam em terreno irregular",
    "baseline": "Na DI650i, a indicação do controlador do compressor deixa de atualizar em movimento e volta após parada; a pressão real não foi verificada.",
    "escalationScenario": "INC054",
    "followupTool": "CAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT017",
    "category": "faults",
    "modelId": "EQ05",
    "title": "DR410i: comunicação intermitente sem perda operacional confirmada",
    "baseline": "O histórico da DR410i registra interrupções de atualização entre módulos, mas não existe perda comprovada de comando ou função.",
    "escalationScenario": "INC053",
    "followupTool": "CAN",
    "followupCost": 0,
    "results": [
      "estavel",
      "agravamento"
    ]
  },
  {
    "id": "FLT018",
    "category": "faults",
    "modelId": "EQ06",
    "title": "DI650i: inconsistência entre painel e pressão de ar",
    "baseline": "No painel da DI650i ocorre descontinuidade de sinal do compressor, sem medição pneumática independente e sem falha de ar confirmada.",
    "escalationScenario": "INC054",
    "followupTool": "PNEU",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT019",
    "category": "faults",
    "modelId": "EQ09",
    "title": "CAT 16: pressão da direção indicada alta sem esforço",
    "baseline": "Na CAT 16, o controlador informa pressão de direção anormalmente alta, mas o operador não observa aumento proporcional de esforço.",
    "escalationScenario": "INC052",
    "followupTool": "MANO",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT020",
    "category": "faults",
    "modelId": "EQ09",
    "title": "CAT 16: alerta intermitente de pressão do cárter",
    "baseline": "Na CAT 16, um alerta de pressão do cárter aparece após ciclos longos; a pressão efetiva ainda não foi validada externamente.",
    "escalationScenario": "INC075",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT021",
    "category": "faults",
    "modelId": "EQ01",
    "title": "CAT 777E: repetição histórica de aviso elétrico sem sintoma atual",
    "baseline": "Relatório de eventos do 777E registra diversas ocorrências antigas de alimentação auxiliar; no turno atual não existe sintoma confirmado.",
    "escalationScenario": "INC046",
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "estavel",
      "estavel"
    ]
  },
  {
    "id": "FLT022",
    "category": "faults",
    "modelId": "EQ02",
    "title": "CAT 6030: aviso eletrônico de alimentação sem origem confirmada",
    "baseline": "A 6030 registra aviso genérico de alimentação de módulo sem indicação da rede nem do subsistema; identificação do código ainda não disponível.",
    "escalationScenario": null,
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "agravamento"
    ]
  },
  {
    "id": "FLT023",
    "category": "faults",
    "modelId": "EQ01",
    "title": "CAT 777E: evento ativo de temperatura com perda de potência",
    "baseline": "O CAT 777E exibe evento ativo de temperatura elevada e relato de perda de potência sob carga; não há confirmação instrumental da temperatura.",
    "escalationScenario": null,
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "agravamento"
    ]
  },
  {
    "id": "FLT024",
    "category": "faults",
    "modelId": "EQ08",
    "title": "CAT 966: aviso eletrónico sem código integral disponível",
    "baseline": "Na carregadeira 966, o relatório traz descrição genérica de alerta eletrônico após partida, mas não informa código completo, módulo e horários.",
    "escalationScenario": null,
    "followupTool": "SCAN",
    "followupCost": 0,
    "results": [
      "inconclusivo",
      "estavel"
    ]
  }
].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 return {VERSION,SOURCES,METADATA,ENTRIES};
});
