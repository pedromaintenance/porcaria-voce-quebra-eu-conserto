# Monitoramento de Componentes — Catálogo v5

**PORCARIA 0.9.8 · Ciclo 5 · Modelagem educativa de falhas e confiabilidade.**

O módulo expande de 6 para 24 sintomas por componente, adicionando 18 casos. O catálogo geral alcança **100 sinais**, independentemente das **100 missões de OS** já existentes. O vínculo com uma missão FMEA é uma rota investigativa por equipamento e sistema, não a confirmação automática da causa raiz.

## Fundamentação e separação de evidências

As fontes Caterpillar descrevem testes de deriva de cilindros, tempo de ciclo, pressão hidráulica, inspeção de mangueiras, bombas e contaminação. Lentidão, aquecimento, vibração, vazamentos e perda de pressão têm **múltiplas causas possíveis**. Em cilindros, a deriva pode resultar de vedação interna, bloco de controle ou outros caminhos de fuga; em bombas, ruído pode estar ligado a sucção, cavitação, restrição ou regulagem. Testes devem respeitar temperaturas, posições, isolamento e condições específicas do manual por máquina.

As fontes Sandvik confirmam a arquitetura e as famílias de componentes das perfuratrizes DR410i e Leopard DI650i, **não valores de diagnóstico ou procedimentos detalhados**. Os manuais de operação/manutenção específicos ficam no portal My Sandvik; curvas de pressão, critérios de desempenho, tempos de ciclo e limites por P/N continuam pendentes.

### Fontes públicas rastreáveis
- `CAT_HYDRAULIC_TESTS`: https://www.cat.com/en_US/blog/cat-hydraulics-tests-hydraulic-system-inspection.html
- `CAT_PUMP_MAINTENANCE`: https://www.cat.com/en_US/blog/maintain-cat-hydraulic-pump.html
- `CAT_HYDRAULIC_INSPECTION`: https://www.cat.com/en_US/blog/hydraulic-system-inspection-steps.html
- `CAT_HYDRAULIC_CYLINDERS`: https://www.cat.com/en_US/support/maintenance/self-service-options/steering-cylinder.html
- `CAT_HYDRAULIC_COMPONENTS`: https://parts.cat.com/en/catcorp/category/hydraulics-pumps-motors-components
- `SANDVIK_DR410I`: https://www.rocktechnology.sandvik/en/products/equipment/surface-drill-rigs/dr410i-rotary-blasthole-drill-rig/
- `SANDVIK_DI650I`: https://www.rocktechnology.sandvik/en/products/equipment/surface-drill-rigs/leopard-di650i-down-the-hole-drill-rig/

### O que não é medido nem inferido

- Nenhuma entrada inventa pressão, vazão, temperatura, RPM, vibração, desvio de cilindro ou limite de condenação OEM: `measurementValue`, `referenceLimit` e `unit` estão em `null`, com `measurementStatus:'pendente'`.
- As sequências `results[]` são evolução qualitativa **pré-roteirizada para o jogo**; não derivam de modelos prognósticos nem de estatísticas reais da mina.
- `alternatives[]` lista hipóteses concorrentes para o jogador investigar. Não identifica peça responsável, custo de reparo real ou ordem de substituição.
- `CMP009` e `CMP024` têm `escalationScenario:null` por não existir roteiro equivalente validado. Encaminhar ao PCM é permitido; converter em OS fica impedido até curadoria do cenário.

## Fluxo e risco de postergação

Chegada automática de ocorrências `NM`, triagem, escolha entre acompanhamento e avaliação PCM, verificação mediante ferramenta disponível no jogo, registro de nova tendência e, quando aplicável, escalonamento manual. A recepção por si só não cria inspeção fictícia nem OS. Prioridade de avaliação: `CMP012` (anomalia de direção) e `CMP024` (dano na haste de cilindro de direção).

Para entradas de **risco alto** com `delayThresholdTurns:4`, uma verificação realizada pelo menos quatro turnos após a data programada torna-se `agravamento` narrativo, independentemente da sequência normal. A janela de quatro turnos é **exclusivamente regra de game design**, não intervalo P-F, prazo seguro de operação ou recomendação OEM. O registro contém `lateTurns`, `delayEscalation` e razão contextual. Demais fontes do jogo continuam regidas pelas regras de seus próprios ciclos.

## Contrato de dados

`componentFamily`, `assetZone`, `measurementMethod`, `observedSigns`, `verification`, `uncertainty`, `alternatives[]`, `sourceKeys[]`, `triage`, `delayRisk`, `riskOnDelay`, `delayThresholdTurns`, `measurementStatus`, `measurementValue`, `referenceLimit`, `unit` e `oemSpecificPending` quando a configuração Sandvik exige literatura própria. IDs antigos preservados e metadados acrescidos sem reescrever saves.

## Índice de ocorrências

| ID | Modelo | Componente | Método | Sintoma reportável | Rota FMEA |
|---|---|---|---|---|---|
| CMP001 | EQ03 | Bomba hidráulica de implementos | tendencia_termica | Bomba hidráulica: temperatura e perda de rendimento | INC056 |
| CMP002 | EQ08 | Cilindro de elevação | deriva_cilindro | Cilindro de elevação: deriva de posição | INC044 |
| CMP003 | EQ05 | Resfriamento de compressor | tendencia_termica | Compressor: temperatura elevada sob ciclos longos | INC085 |
| CMP004 | EQ06 | Motor hidráulico do pulldown | pressao_resposta | Pulldown: queda de rendimento com óleo aquecido | INC064 |
| CMP005 | EQ02 | Motor diesel e arrefecimento | tendencia_termica | Motor diesel: aquecimento sob carga prolongada | INC071 |
| CMP006 | EQ01 | Transmissão / vibração | inspecao_sensitiva | Transmissão: tendência de vibração sob tração | INC088 |
| CMP007 | EQ03 | Bomba e alimentação hidráulica | sucção_pressão | CAT 395: bomba com ruído e implementos lentos após aquecimento | INC056 |
| CMP008 | EQ03 | Bomba e conexões hidráulicas | inspecao_vazamento | CAT 395: óleo próximo à bomba principal e perda intermitente | INC057 |
| CMP009 | EQ03 | Circuito de filtragem e retorno | pressao_diferencial | CAT 395: pressão diferencial anormal no retorno hidráulico | PENDENTE |
| CMP010 | EQ08 | Cilindro de elevação | deriva_cilindro | CAT 966: cilindro de elevação perde posição sem fuga externa | INC044 |
| CMP011 | EQ08 | Cilindro de elevação | inspecao_vazamento | CAT 966: umidade na haste e tendência de deriva | INC059 |
| CMP012 | EQ08 | Direção hidráulica | pressao_resposta | CAT 966: direção lenta e esforço crescente após aquecimento | INC060 |
| CMP013 | EQ02 | Arrefecimento hidráulico | tendencia_termica | CAT 6030: temperatura hidráulica cresce nos ciclos longos | INC062 |
| CMP014 | EQ02 | Válvulas de implemento e filtragem | pressao_diferencial | CAT 6030: função hidráulica irregular com partículas | INC061 |
| CMP015 | EQ05 | Filtragem do sistema hidráulico | pressao_diferencial | DR410i: resposta hidráulica lenta com suspeita de filtro | INC063 |
| CMP016 | EQ06 | Motor hidráulico do avanço | pressao_resposta | DI650i: pulldown perde força após aquecimento do óleo | INC064 |
| CMP017 | EQ06 | Motor hidráulico de rotação | inspecao_vazamento | DI650i: rotação com perda de desempenho e óleo externo | INC022 |
| CMP018 | EQ05 | Ventilação de compressor | tendencia_termica | DR410i: ventilador do compressor com ruído e temperatura crescente | INC085 |
| CMP019 | EQ05 | Resfriamento do compressor | tendencia_termica | DR410i: compressor aquece sob demanda prolongada | INC019 |
| CMP020 | EQ06 | Trocador de calor pneumático | tendencia_termica | DI650i: trocador do ar comprimido com tendência de calor | INC078 |
| CMP021 | EQ02 | Motor diesel e sistema de arrefecimento | tendencia_termica | CAT 6030: temperatura do motor diesel cresce sob carga | INC071 |
| CMP022 | EQ07 | Acionamento do ventilador | tendencia_termica | CAT D9: ventilador responde pouco ao aumento da temperatura | INC073 |
| CMP023 | EQ01 | Alimentação do motor diesel | pressao_resposta | CAT 777E: potência cai sob carga com alimentação não confirmada | INC066 |
| CMP024 | EQ08 | Cilindro hidráulico de direção | inspecao_vazamento | CAT 966: haste do cilindro de direção com riscos longitudinais | PENDENTE |

## Casos de validação de jogabilidade

- **CMP007 (395):** ruído de bombas e lentidão após aquecimento, com investigação de sucção via ferramenta `VACU`. Atraso crítico simulado de quatro turnos produz agravamento, sem alegar degradação física mensurável.
- **CMP010–011 (966):** deriva de cilindro não equivale a vazamento externo e não permite condenar vedações internas sem isolar o circuito. Verificação fictícia utiliza `COMP` (comparador) como recurso do jogo, não substituto de procedimento Cat.
- **CMP012 (966):** resposta ruim da direção requer avaliação prioritária; `INC060` é roteiro possível, não causa comprovada.
- **CMP015–020 (Sandvik):** testes e referências quantitativos específicos pendentes, marcados `oemSpecificPending`. Literatura Cat serve apenas à metodologia geral, sem atribuição de ajuste Sandvik.
- **CMP024 (966):** risco potencial no cilindro de direção gera triagem prioritária. Sem roteiro específico de dano de haste, PCM não aprova uma OS baseada em causa falsa.

## QA e continuidade

`scripts/test-component-catalog-v5.cjs` e regressões dos ciclos de óleo, códigos de falha, material rodante, inspeção, planejamento e missões de OS entram nos workflows de CI e deploy. A homologação visual e o balanceamento em partida real continuam pendentes.

**Próximo ciclo:** a quinta categoria, FPS, permanece sem definição técnica confirmada. Antes de expandi-la, identificar o significado formal da sigla, os sistemas/equipamentos em escopo e literatura OEM. Como alternativa, desenvolver medições parametrizadas por modelo e P/N para Componentes e CTS sem números fabricados.
