# PORCARIA v0.9.12 — Histórico de Decisões do Supervisor e PCM (ciclo 9)

**Data:** 21/10/2026 · **Objetivo:** transformar a telemetria econômica da v0.9.11 em uma trilha verificável de decisões e consequências no jogo, preservando o diagnóstico técnico.

## Registro persistente

O motor registra eventos em `decisionHistory[]` apenas após uma ação bem-sucedida, com sequência, turno, dia, tipo e identificadores relevantes. Os eventos são:

| Tipo | Quando é registrado | Evidências disponíveis |
|---|---|---|
| `purchase` | Pedido de material aceito e pago | Item, quantidade, custo, modalidade, ETA e demanda diagnosticada |
| `receipt` | Pedido efetivamente recebido | Código do pedido, item, quantidade, turno de chegada |
| `allocation` | Mecânico e box atribuídos à OS | OS, mecânico, box, apoio da chefia e etapa de diagnóstico |
| `pcm_review` | Escopo de notificação aprovado pelo PCM | Nota, HH estimadas, disciplina, presença de diagnóstico, causa opcional |
| `pcm_conversion` | OS criada manualmente a partir de nota aprovada | Relação nota/OS/cenário/equipamento |
| `planner_evaluation` | Hipóteses PCM comparadas ao gabarito educativo ao executar | Divergências detectadas, conclusão exata/incompleta, mecânico |
| `completion` | OS concluída no motor | HH corridas de OS, retrabalho, espera por peças/ferramentas, divergências PCM e reparo concluído de primeira |

O estado não registra tentativas rejeitadas como decisões bem-sucedidas. Um evento de compra com `demandAtPurchase=0` significa apenas **ausência de OS já diagnosticada demandando o item naquele instante**; também pode representar formação deliberada de estoque.

## Interface

Em **Planejamento → Histórico de Decisões**, o jogador encontra indicadores, comparações plano versus execução e linha do tempo do Supervisor/PCM. Filtros segmentam **Todos / Compras / PCM / Execução**. A consulta é pura: não compra, aloca, aprova ou altera o save.

Na comparação das OS concluídas com escopo aprovado, `approvedScope.estimatedHH` é confrontado com `worked` e os campos de retrabalho e duração de OS. **HH previstas/realizadas são esforço; `elapsedHours` são horas corridas de indisponibilidade virtual**. As grandezas não são intercambiáveis.

## Limitações de inferência

- `planner_evaluation.errors` identifica divergência com o gabarito do **jogo**; não equivale a falha de diagnóstico real da mina.
- `reworkHours` corresponde a horas adicionais registradas pelo motor. O retrabalho observado em uma OS com erro PCM **não é integralmente causado por esse erro**: há outras fontes de atraso.
- Sem um contrafactual emparelhado, o jogo **não calcula HH economizadas, produção recuperada ou retrabalho evitado**; exibe apenas resultados observados e diferenças.
- A compra antes da demanda não é automaticamente “compra errada”. Não há atribuição de dolo, culpa, responsabilidade individual ou avaliação de trabalhadores reais.
- Tempo de OS aberta não é a disponibilidade física de uma frota com múltiplas máquinas; custo de oportunidade continua fictício e sem desconto do caixa.
- O histórico é limitado a 400 eventos, o registro de compras a 200 e as OS concluídas a 200. As três janelas podem ser distintas; somá-las como se cobrissem a mesma amostra geraria inconsistências.
- Saves anteriores à v0.9.12 continuam válidos: os eventos antigos não são reconstruídos nem fabricados. Se a trilha estiver vazia, isso **não significa que não houve decisões anteriormente**.

## Validação

Novo teste `scripts/test-pcm-decision-ledger-v9.cjs` exercita compra, recebimento, alocação, revisão de FPS, conversão manual para OS, avaliação de hipóteses, indicadores e imutabilidade da consulta. CI Phaser e deploy Pages executam a suíte junto aos testes das versões anteriores.

**Próximo ciclo sugerido:** revisão visual de longa duração, instrumento de exportação CSV do histórico, vinculação de decisão a material com PR/PO SAP apenas se houver documentação e configuração reais autorizadas. Evitar atrelar dados reais de funcionários à pontuação do jogo.
