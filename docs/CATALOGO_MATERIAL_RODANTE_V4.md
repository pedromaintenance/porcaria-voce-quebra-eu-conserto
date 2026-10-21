# Material Rodante — Catálogo v4, CTS e pneus

**P.O.R.C.A.R.I.A. v0.9.7 · Ciclo 4 de Monitoramento de Condição.**

Ampliação de 6 para 24 sinais (18 novos), chegando a 82 condições no catálogo geral. A fonte de verdade dos casos é `phaser-play/undercarriage-catalog-expansion.js`. Este documento distingue critérios OEM publicados de regras e narrativas fictícias do jogo.

## Literatura primária consultada

**Caterpillar** documenta CTS (Custom Track Service) como inspeção técnica e acompanhamento dimensional de desgaste do rodante de esteiras; recomenda observar pinos, buchas, elos, roletes, rodas-guia, segmentos, sapatas, alinhamento e tensão de acordo com arranjo e OMM. **Michelin** aborda inspeção de pneus de equipamentos pesados por deformações, cortes, sulcos, pressão, posição e alinhamento. **CTS de esteira não é procedimento para pneus.**

- CAT_CTS: https://www.cat.com/en_US/blog/undercarriage-care-cat-dealer-programs.html
- CAT_TRACK_INSPECTION: https://www.cat.com/en_US/articles/for-owners/dozer-undercarriage-maintenance.html
- CAT_EXCAVATOR_INSPECTION: https://www.cat.com/en_US/articles/for-owners/what-to-know-about-excavator-undercarriage-maintenance.html
- CAT_TRACK_TENSION: https://www.cat.com/en_US/blog/maintain-cat-steel-tracks.html
- MICHELIN_OTR_INSPECTION: https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-maintenance-earthmover-tyre-inspection
- MICHELIN_OTR_PRESSURE: https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-pressure-for-earthmover-vehicles
- MICHELIN_OTR_DAMAGE: https://b2b.middle-east.michelin.com/help-advice/earthmover-vehicles/tyre-wear-earthmover-tyre-repair

**Aplicabilidade e limitações:** os manuais Cat consultados apresentam métodos e famílias de falhas, mas não fornecem tabelas CTS válidas para cada número de série das máquinas do jogo. Para DR410i, manual Sandvik e configuração do tensionador são necessários; não utilizar tolerâncias Caterpillar. Para pneus, calibragem, carga e condição térmica dependem de especificação do fabricante do pneu e posição. Não há autorização para manipular pneu danificado, esteira, tensionador ou graxa sob pressão fora de procedimento seguro.

## Estrutura material do catálogo

- 24 registros `UND001–UND024`, incluindo 18 novos. Os seis antigos mantêm IDs e resultados originais, agora com metadados.
- `componentGroup`, `assetZone`, `measurementMethod` (`cts`, `termica`, `inspecao_esteira`, `pneu`, `pressao_pneu` ou variação legada), `measurementStatus`, `measurementValue`, `wearPercent`, `referenceLimit`, `unit`, `verification`, `uncertainty`, `riskOnDelay`, `delayRisk` e `sourceKeys`.
- Valores dimensionais e de desgaste permanecem explicitamente **null** até que exista medição e referência correta. O jogo não gera um percentual de desgaste CTS fictício com aparência de valor OEM.
- Cada registro tem `escalationScenario` compatível com uma missão existente ou `null`; em `null` a notificação é encaminhável ao PCM, mas o sistema bloqueia a conversão em OS até haver roteiro curado. Não se devem associar falhas de pneus a missões de esteiras.
- Encaminhamento prioritário é possível para rolete aquecido com suspeita de perda de rotação, fixações ausentes, tensionamento crítico e corte/deformação de flanco. Isso registra condição a avaliar, não um diagnóstico de causa.

## Regra de postergação — somente balanceamento fictício

Para um monitoramento de material rodante com `delayRisk=alto` e `delayThresholdTurns=4`, uma **verificação realizada pelo menos quatro turnos depois de vencer** recebe resultado `agravamento` independentemente do resultado programado, exigindo avaliação. O evento é salvo com `lateTurns`, `delayEscalation` e justificativa. Esta regra **não é uma curva P-F, prazo de segurança, limite dimensional ou recomendação da Caterpillar/Michelin**. A finalidade é tornar o custo de negligenciar inspeções visível no jogo. Atraso menor ou outros domínios não recebe agravamento automático.

## Catálogo de 24 ocorrências

| ID | Modelo | Componente / posição | Método | Sintoma | FMEA investigativo |
|---|---|---|---|---|---|
| UND001 | EQ07 | Rolete / rolamento / Rolete de retorno, posição a confirmar | temperatura | Rolete: aquecimento localizado e ruído de arrasto | INC090 |
| UND002 | EQ07 | Roda-guia e alinhamento / Lado e posição 2 | cts | Esteira: deslocamento lateral e marcas assimétricas | INC091 |
| UND003 | EQ09 | Pneu da motoniveladora / Conjunto tandem, posição conforme OS | inspecao_pneu | Pneu: desgaste direcional persistente | INC094 |
| UND004 | EQ05 | Tensionador de esteira / Lado 1 da perfuratriz | inspecao_esteira | Tensionamento de esteira: perda após deslocamento | INC095 |
| UND005 | EQ01 | Comando final de caminhão / Comando final, posição a confirmar | temperatura | Comando final: tendência de temperatura e ruído | INC086 |
| UND006 | EQ07 | Articulação da esteira / D9, lado/posição 2 | inspecao_esteira | Conjunto de esteira: estalos em manobra | INC040 |
| UND007 | EQ07 | Elos de esteira / Lado 1 versus lado 2 | cts | D9: desgaste de elos discrepante entre os lados | PENDENTE |
| UND008 | EQ07 | Pinos e buchas / Esteira lado 1, bucha externa | cts | D9: bucha externa com polimento e desgaste desigual | PENDENTE |
| UND009 | EQ07 | Roda motriz / segmentos / Lado 1, conjunto de segmentos | cts | D9: segmentos da roda motriz com marcas de encaixe anormal | PENDENTE |
| UND010 | EQ07 | Roda-guia / Lado 2, roda-guia dianteira | cts | D9: roda-guia com desgaste assimétrico de aba | INC091 |
| UND011 | EQ07 | Rolete de retorno / Lado 1, rolete de retorno | termica | D9: rolete de retorno com aquecimento e pouca rotação | INC090 |
| UND012 | EQ07 | Sapatas / garras / Lados 1 e 2, sapatas | cts | D9: sapatas com garras desgastadas em patamares distintos | PENDENTE |
| UND013 | EQ02 | Roletes inferiores / Esteira lado 1, rolete a identificar | termica | 6030: rolete inferior aquecido durante deslocamento | INC011 |
| UND014 | EQ04 | Roletes inferiores / Esteira lado 1 | termica | 336GC: ruído repetitivo de rolete em deslocamento lento | INC017 |
| UND015 | EQ07 | Pinos e buchas / Esteira lado 2 | inspecao_esteira | D9: articulações com marcas de atrito e estalos | INC023 |
| UND016 | EQ07 | Fixações de sapatas / Esteira lado 1, sapata a identificar | inspecao_esteira | D9: fixação de sapata com parafuso ausente | PENDENTE |
| UND017 | EQ05 | Tensionador hidráulico/de graxa / Lado 1, mecanismo tensionador | inspecao_esteira | DR410i: perda de tensão da esteira com umidade no tensionador | INC095 |
| UND018 | EQ05 | Tensionamento de esteira / Lado 1, mecanismo tensionador | inspecao_esteira | DR410i: folga de esteira aumentando após manobras | INC095 |
| UND019 | EQ07 | Rodante / limpeza / Lados 1 e 2, região de elos/roletes | inspecao_esteira | D9: material compactado no rodante e tensão aparente excessiva | PENDENTE |
| UND020 | EQ03 | Elos / sapatas / Esteira esquerda e direita, pontos de CTS | cts | CAT 395: elos e sapatas com desgaste progressivo sem medição | PENDENTE |
| UND021 | EQ08 | Pneu / flanco / Roda motriz, lado e posição a confirmar | pneu | CAT 966: corte profundo e deformação de flanco do pneu | PENDENTE |
| UND022 | EQ09 | Pneu / alinhamento / Tandem, posição 4 | pneu | CAT 16: desgaste direcional no tandem com desvio lateral | INC094 |
| UND023 | EQ09 | Pneu / desgaste residual / Tandem, posição 4 | pneu | CAT 16: desgaste remanescente após alinhamento corrigido | INC100 |
| UND024 | EQ01 | Pneu / pressão / Roda de transporte, posição a confirmar | pressao_pneu | CAT 777E: pressão do pneu abaixo do histórico de turno | PENDENTE |

## Pontos de atenção

- `UND007`, `UND008`, `UND009`, `UND012` e `UND020`: desgaste de elos, buchas, segmentos e garras; acompanhamento CTS, sem número nem limite de troca imaginado.
- `UND011`, `UND013` e `UND016`: roletes aquecidos ou parafuso de sapata ausente; triagem priorizada, sem condenar automaticamente rolamento ou elo.
- `UND017–UND018`: tensionamento da DR410i; inspeção segura por Sandvik, sem importar tabela CTS Cat.
- `UND021`: corte profundo e deformação do flanco de pneu da 966; avaliação por profissional de pneus antes do retorno à operação, sem gerar ordem por roteiro equivocado.
- `UND022–UND024`: desgaste direcional, resíduo após correção de alinhamento e pressão de pneu; testes `CALP`, jamais CTS.
- `UND015`: primeira verificação prevista como inconclusiva, mas atrasada quatro turnos fica agravada por regra de jogo, registrada no histórico e encaminhável ao PCM.

## QA e expansão posterior

Teste dedicado `scripts/test-undercarriage-catalog-v4.cjs` integrado ao CI e deploy, além das regressões de óleo, eletrônica, planejamento e OS. Verificação visual em navegador permanece pendente após publicação.

**Ciclo 5 sugerido:** Monitoramento de Componentes com ciclos térmicos, pressões, vazamento interno, bomba/valvulagem, cavitação e vibração; priorizar curvas observáveis sem interpolar leituras OEM. Alternativamente, aprimorar módulo CTS com preenchimento manual de medições reais, referências parametrizadas por P/N e máquina e taxa de desgaste calculada apenas quando houver histórico válido.
