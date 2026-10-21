# Monitoramento de Condição — Catálogo v1

> Documento histórico. O [ciclo 6 de FPS/GET](CATALOGO_FPS_GET_V6.md) confirma FPS como Ferramentas de Penetração no Solo e eleva o total a 120 sintomas ativos. FPS001–004 são apenas legado de saves.

> Documento histórico dos primeiros 30 sinais. O [Catálogo de Componentes v5](CATALOGO_COMPONENTES_V5.md) completa a expansão para **100 condições recebíveis**.

> Histórico da v0.9.4. Depois das expansões de óleo e códigos, a [v4 de Material Rodante](CATALOGO_MATERIAL_RODANTE_V4.md) amplia o total a **82 sinais** e diferencia CTS, pneus e risco de postergação.

> Documento histórico. Além da v2 de óleo (24 casos), a [v3 de Códigos de Falha](CATALOGO_CODIGOS_FALHA_V3.md) adiciona 18 novos sinais, totalizando 64 entradas na carteira de condição.

> Documento histórico da v0.9.4: catálogo base de 30 sinais. A expansão de óleo v2 adiciona 16 casos (total 46), documentados em [Catálogo de Óleo v2](CATALOGO_OLEO_V2.md).

Entrega v0.9.4 — estrutura para ciclos incrementais de expansão. Fonte canônica: [condition-catalog.js](../phaser-play/condition-catalog.js).

## Fluxo operacional

- Recebimento automático: um registro na inicialização de campanha, depois até uma ocorrência nova a cada dois turnos pares; não há botões de criação de estudos de teste.
- O recebimento cria uma notificação NM numerada, vinculada a um ativo, domínio e sintoma, com origem no monitoramento. Não cria inspeção artificial, diagnóstico nem OS.
- O jogador decide programar acompanhamento, confirmar nova leitura e registrar evolução, continuar, encerrar ou encaminhar ao PCM. OS depende de revisão e conversão explícitas.
- A carteira é persistente no save. O controle de giro por categoria e por IDs evita duplicidade quando o painel é reaberto. Há limite de oito registros ativos para evitar sobrecarga.
- O catálogo contém situações de jogo mecanicamente plausíveis, não dados reais da mina, laudos verdadeiros ou limites OEM. Os resultados futuros ainda são sequências qualitativas autorais.

## Catálogo inicial por domínio

| ID | Categoria | Modelo | Sintoma | Cenário de investigação |
|---|---|---|---|---|
| OIL001 | Análise de óleo | EQ01 | Comando final: presença de água ou emulsão no lubrificante | INC041 |
| OIL002 | Análise de óleo | EQ07 | Comando final: silício e alumínio em elevação | INC042 |
| OIL003 | Análise de óleo | EQ01 | Diferencial: crescimento de metais de desgaste | INC043 |
| OIL004 | Análise de óleo | EQ02 | Sistema hidráulico: contaminação por partículas | INC061 |
| OIL005 | Análise de óleo | EQ02 | Motor diesel: metais acima da tendência histórica | INC068 |
| OIL006 | Análise de óleo | EQ08 | Diferencial dianteiro: indício de contaminante ambiental | INC092 |
| OIL007 | Análise de óleo | EQ09 | Transmissão/tandem: partículas acima do histórico | INC093 |
| OIL008 | Análise de óleo | EQ01 | Arrefecimento: concentração do fluido incompatível com referência | INC072 |
| FLT001 | Códigos de falha | EQ01 | Alarme intermitente de alimentação elétrica auxiliar | INC046 |
| FLT002 | Códigos de falha | EQ08 | Eventos de alimentação elétrica após a partida | INC049 |
| FLT003 | Códigos de falha | EQ03 | Perda de resposta elétrica do implemento com aquecimento | INC050 |
| FLT004 | Códigos de falha | EQ09 | Indicação anômala de pressão da direção | INC052 |
| FLT005 | Códigos de falha | EQ05 | Comunicação irregular entre módulos de monitoramento | INC053 |
| FLT006 | Códigos de falha | EQ02 | Intermitência do joystick em condição de vibração | INC055 |
| UND001 | Material rodante | EQ07 | Rolete: aquecimento localizado e ruído de arrasto | INC090 |
| UND002 | Material rodante | EQ07 | Esteira: deslocamento lateral e marcas assimétricas | INC091 |
| UND003 | Material rodante | EQ09 | Pneu: desgaste direcional persistente | INC094 |
| UND004 | Material rodante | EQ05 | Tensionamento de esteira: perda após deslocamento | INC095 |
| UND005 | Material rodante | EQ01 | Comando final: tendência de temperatura e ruído | INC086 |
| UND006 | Material rodante | EQ07 | Conjunto de esteira: estalos em manobra | INC040 |
| FPS001 | FPS | EQ01 | FPS: indicação de falha não classificada no painel | Não mapeado |
| FPS002 | FPS | EQ05 | FPS: perda intermitente de atualização de estado | Não mapeado |
| FPS003 | FPS | EQ02 | FPS: diferença entre estados registrados em turnos | Não mapeado |
| FPS004 | FPS | EQ08 | FPS: sinal de verificação pendente | Não mapeado |
| CMP001 | Componentes | EQ03 | Bomba hidráulica: temperatura e perda de rendimento | INC056 |
| CMP002 | Componentes | EQ08 | Cilindro de elevação: deriva de posição | INC044 |
| CMP003 | Componentes | EQ05 | Compressor: temperatura elevada sob ciclos longos | INC085 |
| CMP004 | Componentes | EQ06 | Pulldown: queda de rendimento com óleo aquecido | INC064 |
| CMP005 | Componentes | EQ02 | Motor diesel: aquecimento sob carga prolongada | INC071 |
| CMP006 | Componentes | EQ01 | Transmissão: tendência de vibração sob tração | INC088 |

Total: 30 sintomas; oito de óleo, seis de códigos, seis de material rodante, quatro de FPS e seis de componentes.

## Contrato do catálogo

Cada entrada tem ID estável, categoria, modelo, título, observação inicial, cenário para eventual investigação, ferramenta para acompanhamento, custo virtual e evolução qualitativa. Esta estrutura permite acrescentar entradas sem mudar as regras da interface ou do save.

**FPS:** a definição técnica da sigla não está cadastrada. As quatro ocorrências são apenas sinais genéricos de estado, sem afirmação sobre a função do sistema. Podem gerar notificação para avaliação pelo PCM, mas o campo requiresScenarioMapping permanece verdadeiro e impede a conversão em OS até a curadoria de um roteiro pertinente.

## Compatibilidade

Os três estudos legados (baseline, sample, differential) continuam interpretáveis apenas para preservar saves anteriores; nenhum botão os apresenta como ocorrências recebíveis. As 100 missões de OS e os 387 caminhos funcionais permanecem inalterados.

## Próximos ciclos

1. Expandir famílias com indícios de literatura e códigos/compartimentos por modelo; validar severidade e tipo de leitura.
2. Regras de frequência e evolução por condição/tempo, correlacionadas ao histórico sem antecipar o gabarito.
3. Definir FPS formalmente e cadastrar roteiros pertinentes antes de liberar OS para esse sistema.
4. Revisar a experiência visual mobile e os critérios de balanceamento de entradas/fechamentos.

Testes: scripts/test-condition-catalog.cjs e scripts/test-monitoring-session9.cjs; validar pelo CI e Pages antes de considerar publicada.
