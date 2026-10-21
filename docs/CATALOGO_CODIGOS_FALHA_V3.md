# Catálogo de Códigos de Falha e Eventos — Expansão v3

**PORCARIA v0.9.6 · Ciclo 3 do Monitoramento de Condição.**

**Âmbito:** 24 sinais eletrônicos (6 anteriores enriquecidos + 18 novas ocorrências); 64 sintomas de condição no catálogo total. Módulo: [fault-catalog-expansion.js](../phaser-play/fault-catalog-expansion.js).

## O que veio das fontes e o que é simulação

Fontes primárias e manuais de capacitação apresentados no projeto fundamentam a **metodologia**: Cat ET distingue códigos de diagnóstico ativos/registrados e eventos ativos/registrados; relatórios identificam ECM, descrição, ocorrências e, quando disponível, horas de primeira/última ocorrência. Diagnósticos e eventos não são sinônimos. Confirmação de circuitos requer esquema do equipamento e instrumentos adequados. A literatura consultada não autoriza inferir MID/CID/FMI/EID, módulo exato ou causas a partir de um sintoma narrativo.

**Documentos de capacitação do projeto:** `Caterpillar Electronic Technician Customer User's Manual`, seção 3, páginas 3-2, 3-8, 3-128 e 3-130 (conceito de ativos, registrados e eventos); `APOSTILA SIS & ET`, seção 20.1–20.4 (códigos ativos/registrados e eventos). Confirmar revisão e aplicação ao número de série antes de usar em manutenção real.

**Referências públicas OEM (procedimentos e capacidades gerais, não tabelas de códigos por máquina):**
- `CAT_ET_CAPABILITIES`: https://www.cat.com/en_US/articles/IRF-Resource-Center/TIA-FAQ-Form.html
- `CAT_ELECTRONICS_TROUBLESHOOT`: https://www.cat.com/en_US/by-industry/oil-and-gas/learning/program/electronics-troubleshooting-ilt.html
- `CAT_ELECTRONICS_FUNDAMENTALS`: https://www.cat.com/en_US/by-industry/oil-and-gas/learning/program/g3600-electronics-fundamentals-ilt.html
- `CAT_ACTIVE_LOGGED`: https://www.cat.com/en_US/blog/cat-hydraulics-tests-hydraulic-system-inspection.html

**Limitação de plataforma:** CAT ET não é documentação de diagnóstico específica de DR410i/DI650i. Nos casos Sandvik, as mesmas classes de sintomas são apenas abstrações didáticas; teste, nomenclatura de controladores e identificação de falhas exigem o manual Sandvik correspondente.

**Não há números de códigos inventados.** Todos os 24 registros usam `codeValue:null`, `codeVerified:false`. Um código completo (MID/CID/FMI, EID ou outro formato efetivamente suportado) só entrará após verificação no relatório e na documentação aplicável. Nenhum valor de horímetro, ocorrência ou leitura elétrica foi fabricado.

## Contrato de dados

- Campos: `id`, `category`, `modelId`, `title`, `baseline`, `escalationScenario` (ou null), `followupTool`, `followupCost`, `results[]`.
- Metadados eletrônicos: `signalClass` (diagnostico/evento), `codeState` (ativo/registrado/nao_confirmado), `pattern` (intermitência separada do estado), `moduleContext`, `observedEffect`, `verification`, `uncertainty`, `alternatives[]`, `codeValue`, `codeVerified`, `sourceKeys[]`, `triage`.
- `ativo` indica condição presente **no momento da observação simulada**; `registrado` indica ocorrência histórica, não falha necessariamente presente; `nao_confirmado` significa ausência de informação suficiente no relatório, mesmo que o sintoma seja intermitente.
- As hipóteses concorrentes não são respostas confirmadas; as ferramentas são compras virtuais e a sequência `results[]` é narrativa, não telemetria/medição real.
- `triage=avaliacao_prioritaria` coloca o achado em prioridade alta e oferece encaminhamento imediato ao PCM. O fluxo não cria OS automaticamente.
- Sem `escalationScenario` equivalente ao modelo (`FLT022`, `FLT023` e `FLT024`), o PCM recebe `requiresScenarioMapping:true` e não libera conversão em OS até existir investigação validada.

## Índice rastreável das 24 ocorrências

| ID | Equipamento | Natureza | Estado | Sintoma | Missão de investigação |
|---|---|---|---|---|---|
| FLT001 | EQ01 | diagnostico | nao_confirmado | Alarme intermitente de alimentação elétrica auxiliar | INC046 |
| FLT002 | EQ08 | diagnostico | nao_confirmado | Eventos de alimentação elétrica após a partida | INC049 |
| FLT003 | EQ03 | diagnostico | ativo | Perda de resposta elétrica do implemento com aquecimento | INC050 |
| FLT004 | EQ09 | diagnostico | ativo | Indicação anômala de pressão da direção | INC052 |
| FLT005 | EQ05 | diagnostico | ativo | Comunicação irregular entre módulos de monitoramento | INC053 |
| FLT006 | EQ02 | diagnostico | nao_confirmado | Intermitência do joystick em condição de vibração | INC055 |
| FLT007 | EQ01 | diagnostico | registrado | Alimentação auxiliar: alerta registrado após lavagem | INC046 |
| FLT008 | EQ01 | diagnostico | nao_confirmado | Oscilação de alimentação ao atravessar irregularidades | INC047 |
| FLT009 | EQ01 | diagnostico | ativo | Alerta de tensão persistente sem confirmação externa | INC048 |
| FLT010 | EQ08 | diagnostico | nao_confirmado | Alimentação elétrica irregular na partida sob vibração | INC049 |
| FLT011 | EQ03 | diagnostico | ativo | Comando do implemento indisponível com aquecimento | INC050 |
| FLT012 | EQ03 | diagnostico | nao_confirmado | Comando do implemento falha ao mover a lança | INC051 |
| FLT013 | EQ02 | diagnostico | nao_confirmado | Joystick: intermitência do comando durante vibração | INC055 |
| FLT014 | EQ02 | diagnostico | registrado | Entrada do joystick registrada como inconsistente | INC055 |
| FLT015 | EQ05 | diagnostico | ativo | DR410i: perda de atualização entre módulos | INC053 |
| FLT016 | EQ06 | diagnostico | nao_confirmado | DI650i: dados do compressor congelam em terreno irregular | INC054 |
| FLT017 | EQ05 | diagnostico | registrado | DR410i: comunicação intermitente sem perda operacional confirmada | INC053 |
| FLT018 | EQ06 | diagnostico | registrado | DI650i: inconsistência entre painel e pressão de ar | INC054 |
| FLT019 | EQ09 | diagnostico | ativo | CAT 16: pressão da direção indicada alta sem esforço | INC052 |
| FLT020 | EQ09 | evento | nao_confirmado | CAT 16: alerta intermitente de pressão do cárter | INC075 |
| FLT021 | EQ01 | diagnostico | registrado | CAT 777E: repetição histórica de aviso elétrico sem sintoma atual | INC046 |
| FLT022 | EQ02 | diagnostico | registrado | CAT 6030: aviso eletrônico de alimentação sem origem confirmada | PENDENTE |
| FLT023 | EQ01 | evento | ativo | CAT 777E: evento ativo de temperatura com perda de potência | PENDENTE |
| FLT024 | EQ08 | diagnostico | registrado | CAT 966: aviso eletrónico sem código integral disponível | PENDENTE |

## Casos de validação prioritária

- `FLT011` e `FLT012` (CAT 395): perda de comando de implemento. Encaminhamento prioritário e possibilidade de investigação FMEA `INC050`/`INC051`; sem atribuir causa ao solenoide ou chicote antecipadamente.
- `FLT013` (CAT 6030): comando joystick sem resposta e vibração. Prioridade de avaliação, missão investigativa existente `INC055`; não condenar joystick ou chicote.
- `FLT023` (CAT 777E): evento de temperatura indicada elevada sob carga, com perda de potência relatada. Prioridade alta, sem roteiro eletrônico adequado; impede OS de gabarito inventado.
- `FLT021` (777E): código histórico registrado com ausência de sintoma atual. Permite acompanhar e encerrar após duas verificações estáveis no jogo, sem equiparar histórico a falha ativa.
- `FLT015`/`FLT016` (DR410i/DI650i): comunicação entre módulos. As hipóteses de rede, alimentação e visualização são alternativas; nenhuma designação de código Sandvik é atribuída.

## QA e próxima expansão

Teste dedicado: `scripts/test-fault-catalog-v3.cjs`. Os testes de óleo, monitoramento, gestão de OS e PCM anteriores continuam no CI e no deploy. Verificar visualmente os dossiês e seus limites de texto nos diferentes tamanhos de tela.

**Próxima evolução recomendada:** criar a estrutura tipada de `faultRecord` por ECM e modelo, e só popular `codeValue` a partir de documentos OEM/relatórios de códigos reais vinculados a série e software. Em seguida, probabilidades de recorrência e efeitos sobre disponibilidade devem ser balanceados no jogo, sem apresentar diagnóstico automático.
