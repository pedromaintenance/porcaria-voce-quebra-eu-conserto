/* P.O.R.C.A.R.I.A. — catálogo de condições recebíveis, v1. Ciclos futuros acrescentam registros.
 * Sintomas e evolução são cenários de jogo, NÃO dados reais de máquinas ou limites OEM.
 * FPS = Ferramentas de Penetração no Solo (GET) confirmado em literatura Caterpillar e Sotreq.
 */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PORCARIA_CONDITION_CATALOG=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const OIL_V2=typeof require==='function'?require('./oil-catalog-expansion.js'):globalThis.PORCARIA_OIL_EXPANSION;
 if(!OIL_V2||!Array.isArray(OIL_V2.ENTRIES))throw Error('Expansão do catálogo de óleo não carregada.');
 const FAULT_V3=typeof require==='function'?require('./fault-catalog-expansion.js'):globalThis.PORCARIA_FAULT_EXPANSION;
 if(!FAULT_V3||!Array.isArray(FAULT_V3.ENTRIES))throw Error('Expansão do catálogo eletrônico não carregada.');
 const UNDERCARRIAGE_V4=typeof require==='function'?require('./undercarriage-catalog-expansion.js'):globalThis.PORCARIA_UNDERCARRIAGE_EXPANSION;
 if(!UNDERCARRIAGE_V4||!Array.isArray(UNDERCARRIAGE_V4.ENTRIES))throw Error('Expansão de material rodante não carregada.');
 const COMPONENT_V5=typeof require==='function'?require('./component-catalog-expansion.js'):globalThis.PORCARIA_COMPONENT_EXPANSION;
 if(!COMPONENT_V5||!Array.isArray(COMPONENT_V5.ENTRIES))throw Error('Expansão de Componentes não carregada.');
 const FPS_V6=typeof require==='function'?require('./fps-catalog-expansion.js'):globalThis.PORCARIA_FPS_EXPANSION;
 if(!FPS_V6||!Array.isArray(FPS_V6.ENTRIES))throw Error('Expansão de FPS não carregada.');
 const VERSION='6.0.0';
 const CATEGORIES=Object.freeze({"oil":"Análises de óleo","faults":"Códigos de falha","undercarriage":"Material rodante","fps":"FPS","components":"Componentes"});
 const ENTRIES=Object.freeze([
  {id:"OIL001",category:"oil",modelId:"EQ01",title:"Comando final: presença de água ou emulsão no lubrificante",baseline:"Laudo de óleo aponta água no comando final; confirmar histórico, amostragem e condição das vedações.",escalationScenario:"INC041",followupTool:"COLETA",followupCost:40,results:["inconclusivo","agravamento"]},
  {id:"OIL002",category:"oil",modelId:"EQ07",title:"Comando final: silício e alumínio em elevação",baseline:"Tendência de silício e alumínio no óleo do comando final, com indício de partículas externas.",escalationScenario:"INC042",followupTool:"COLETA",followupCost:40,results:["estavel","agravamento"]},
  {id:"OIL003",category:"oil",modelId:"EQ01",title:"Diferencial: crescimento de metais de desgaste",baseline:"Laudos sucessivos indicam elevação de metais no diferencial, ainda sem componente condenado.",escalationScenario:"INC043",followupTool:"COLETA",followupCost:40,results:["estavel","agravamento"]},
  {id:"OIL004",category:"oil",modelId:"EQ02",title:"Sistema hidráulico: contaminação por partículas",baseline:"Histórico de amostras indica particulado no circuito hidráulico e possível perda de desempenho.",escalationScenario:"INC061",followupTool:"COLETA",followupCost:40,results:["inconclusivo","agravamento"]},
  {id:"OIL005",category:"oil",modelId:"EQ02",title:"Motor diesel: metais acima da tendência histórica",baseline:"Amostra do motor diesel apresenta alteração de metais; é necessário correlacionar com horas e filtros.",escalationScenario:"INC068",followupTool:"COLETA",followupCost:40,results:["estavel","agravamento"]},
  {id:"OIL006",category:"oil",modelId:"EQ08",title:"Diferencial dianteiro: indício de contaminante ambiental",baseline:"Laudo do diferencial apresenta indício de contaminação ambiental sem indicação de dano interno confirmado.",escalationScenario:"INC092",followupTool:"COLETA",followupCost:40,results:["estavel","agravamento"]},
  {id:"OIL007",category:"oil",modelId:"EQ09",title:"Transmissão/tandem: partículas acima do histórico",baseline:"Laudo do conjunto de transmissão/tandem mostra partículas elevadas; conferir amostra e compartimento.",escalationScenario:"INC093",followupTool:"COLETA",followupCost:40,results:["inconclusivo","agravamento"]},
  {id:"OIL008",category:"oil",modelId:"EQ01",title:"Arrefecimento: concentração do fluido incompatível com referência",baseline:"Histórico de reposição acompanhado de alteração na concentração do fluido de arrefecimento.",escalationScenario:"INC072",followupTool:"REFR",followupCost:0,results:["estavel","estavel"]},
  {id:"FLT001",category:"faults",modelId:"EQ01",title:"Alarme intermitente de alimentação elétrica auxiliar",baseline:"Registro intermitente de tensão auxiliar após vibração ou lavagem; tensão real ainda não verificada.",escalationScenario:"INC046",followupTool:"MULT",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FLT002",category:"faults",modelId:"EQ08",title:"Eventos de alimentação elétrica após a partida",baseline:"Ocorrências eletrônicas recorrentes de alimentação anormal, mais frequentes sob vibração.",escalationScenario:"INC049",followupTool:"MULT",followupCost:0,results:["estavel","agravamento"]},
  {id:"FLT003",category:"faults",modelId:"EQ03",title:"Perda de resposta elétrica do implemento com aquecimento",baseline:"Alerta de comando sem resposta após aquecimento; ainda não se sabe se falhou comando ou atuador.",escalationScenario:"INC050",followupTool:"SCAN",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FLT004",category:"faults",modelId:"EQ09",title:"Indicação anômala de pressão da direção",baseline:"Sistema registra pressão elevada sem esforço proporcional; medição independente pendente.",escalationScenario:"INC052",followupTool:"SCAN",followupCost:0,results:["estavel","agravamento"]},
  {id:"FLT005",category:"faults",modelId:"EQ05",title:"Comunicação irregular entre módulos de monitoramento",baseline:"Múltiplos sinais param de atualizar durante operação; integridade da comunicação não confirmada.",escalationScenario:"INC053",followupTool:"CAN",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FLT006",category:"faults",modelId:"EQ02",title:"Intermitência do joystick em condição de vibração",baseline:"Eventos do comando do implemento durante vibração da cabine; circuito ainda não isolado.",escalationScenario:"INC055",followupTool:"MULT",followupCost:0,results:["estavel","agravamento"]},
  {id:"UND001",category:"undercarriage",modelId:"EQ07",title:"Rolete: aquecimento localizado e ruído de arrasto",baseline:"Inspeção do material rodante identifica diferença térmica e ruído em rolete; medição pendente.",escalationScenario:"INC090",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]},
  {id:"UND002",category:"undercarriage",modelId:"EQ07",title:"Esteira: deslocamento lateral e marcas assimétricas",baseline:"Indicação de deslocamento lateral da esteira e desgaste desigual no contato; geometria não medida.",escalationScenario:"INC091",followupTool:"CTSM",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"UND003",category:"undercarriage",modelId:"EQ09",title:"Pneu: desgaste direcional persistente",baseline:"Pneu em posição de tandem apresenta desgaste direcional, com suspeita de desalinhamento.",escalationScenario:"INC094",followupTool:"CALP",followupCost:0,results:["estavel","agravamento"]},
  {id:"UND004",category:"undercarriage",modelId:"EQ05",title:"Tensionamento de esteira: perda após deslocamento",baseline:"Relato de perda de tensão da esteira entre deslocamentos e umidade próxima ao tensionador.",escalationScenario:"INC095",followupTool:"CTSM",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"UND005",category:"undercarriage",modelId:"EQ01",title:"Comando final: tendência de temperatura e ruído",baseline:"Acompanhamento acusa aquecimento localizado do comando final e ronco sob carga.",escalationScenario:"INC086",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]},
  {id:"UND006",category:"undercarriage",modelId:"EQ07",title:"Conjunto de esteira: estalos em manobra",baseline:"Estalos e indício de deslocamento de articulação, ainda sem medição de folga.",escalationScenario:"INC040",followupTool:"CTSM",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FPS001",category:"fps",modelId:"EQ01",title:"FPS: indicação de falha não classificada no painel",baseline:"Sistema identificado apenas como FPS apresenta sinal de falha; função e código específico não documentados.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FPS002",category:"fps",modelId:"EQ05",title:"FPS: perda intermitente de atualização de estado",baseline:"Registro FPS deixou de atualizar durante parte do turno, sem evidência de condição física.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FPS003",category:"fps",modelId:"EQ02",title:"FPS: diferença entre estados registrados em turnos",baseline:"Histórico FPS apresenta estados conflitantes entre turnos; é necessária confirmação local.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"FPS004",category:"fps",modelId:"EQ08",title:"FPS: sinal de verificação pendente",baseline:"Painel FPS informa pendência de verificação, sem especificação do subsistema afetado.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"CMP001",category:"components",modelId:"EQ03",title:"Bomba hidráulica: temperatura e perda de rendimento",baseline:"Tendência de temperatura com resposta lenta da bomba após aquecimento, sem falha confirmada.",escalationScenario:"INC056",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]},
  {id:"CMP002",category:"components",modelId:"EQ08",title:"Cilindro de elevação: deriva de posição",baseline:"Acompanhamento registra perda lenta de posição do implemento, sem discriminar fuga interna.",escalationScenario:"INC044",followupTool:"MANO",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"CMP003",category:"components",modelId:"EQ05",title:"Compressor: temperatura elevada sob ciclos longos",baseline:"Compressor apresenta aquecimento em ciclos longos; estado do resfriamento não verificado.",escalationScenario:"INC085",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]},
  {id:"CMP004",category:"components",modelId:"EQ06",title:"Pulldown: queda de rendimento com óleo aquecido",baseline:"Conjunto de avanço perde desempenho após aquecimento; origem hidráulica ou mecânica indeterminada.",escalationScenario:"INC064",followupTool:"MANO",followupCost:0,results:["inconclusivo","agravamento"]},
  {id:"CMP005",category:"components",modelId:"EQ02",title:"Motor diesel: aquecimento sob carga prolongada",baseline:"Histórico de temperatura do motor aumenta em ciclos intensos, sem origem isolada.",escalationScenario:"INC071",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]},
  {id:"CMP006",category:"components",modelId:"EQ01",title:"Transmissão: tendência de vibração sob tração",baseline:"Conjunto de transmissão apresenta vibração em carga, com histórico de partículas no lubrificante.",escalationScenario:"INC088",followupTool:"TERM",followupCost:0,results:["estavel","agravamento"]}
 ].filter(x=>x.category!=='fps').concat(OIL_V2.ENTRIES,FAULT_V3.ENTRIES,UNDERCARRIAGE_V4.ENTRIES,COMPONENT_V5.ENTRIES,FPS_V6.ENTRIES).map(x=>{
  const meta=OIL_V2.METADATA[x.id]||FAULT_V3.METADATA[x.id]||UNDERCARRIAGE_V4.METADATA[x.id]||COMPONENT_V5.METADATA[x.id]||FPS_V6.METADATA[x.id];
  return Object.freeze({...x,...(meta||{}),
   ...(meta?.indicators?{indicators:Object.freeze(meta.indicators.slice())}:{}),
   ...(meta?.alternatives?{alternatives:Object.freeze(meta.alternatives.slice())}:{}),
   ...(meta?.sourceKeys?{sourceKeys:Object.freeze(meta.sourceKeys.slice())}:{}),
   results:Object.freeze(x.results.slice())});
 }));
 // Preservar os quatro IDs FPS genéricos SOMENTE para leitura de saves legados.
 const LEGACY_FPS=Object.freeze([
  {id:"FPS001",category:"fps",modelId:"EQ01",title:FPS_V6.LEGACY_LABELS.FPS001,baseline:"Registro FPS criado antes da definição técnica da sigla.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"],legacyOnly:true},
  {id:"FPS002",category:"fps",modelId:"EQ05",title:FPS_V6.LEGACY_LABELS.FPS002,baseline:"Registro histórico sem identificação de ferramenta física GET.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"],legacyOnly:true},
  {id:"FPS003",category:"fps",modelId:"EQ02",title:FPS_V6.LEGACY_LABELS.FPS003,baseline:"Registro FPS histórico não classificado.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"],legacyOnly:true},
  {id:"FPS004",category:"fps",modelId:"EQ08",title:FPS_V6.LEGACY_LABELS.FPS004,baseline:"Registro FPS histórico sem verificação de componente.",escalationScenario:null,followupTool:null,followupCost:0,results:["inconclusivo","agravamento"],legacyOnly:true}
 ].map(x=>Object.freeze({...x,results:Object.freeze(x.results)})));
 const BY_ID=new Map([...LEGACY_FPS,...ENTRIES].map(e=>[e.id,e]));
 function get(id){return BY_ID.get(id)||null}
 function byCategory(category){return ENTRIES.filter(e=>e.category===category)}
 return {VERSION,CATEGORIES,ENTRIES,LEGACY_FPS,get,byCategory,SOURCES:Object.freeze({...OIL_V2.SOURCES,...FAULT_V3.SOURCES,...UNDERCARRIAGE_V4.SOURCES,...COMPONENT_V5.SOURCES,...FPS_V6.SOURCES})};
});
