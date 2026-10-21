# PORCARIA v0.9.13 — Lições Aprendidas (ciclo 10)

**Escopo:** aprendizagem a partir de OS concluídas, sem inventar evidência de campo nem alterar automaticamente a economia da oficina.

## Fluxo

Uma OS encerrada integra o painel **Planejamento → Lições Aprendidas**. O dossiê é montado a partir de `state.done[]` e, se houver, dos eventos da trilha de decisões (`decisionHistory[]`) e compras `purchaseHistory[]`.

O jogador consulta o relato original, tentativas de investigação (confirmadas, rejeitadas, inconclusivas, inspeções adicionais), custo em HH, indisponibilidade, retrabalho, esperas por materiais e ferramentas e a hipótese didática que orientou a missão. **Esta hipótese é o gabarito de uma simulação, não uma conclusão OEM nem uma causa raiz de máquina real.**

O supervisor escolhe um tema (Diagnóstico, Planejamento, Materiais, Execução, Segurança) e escreve uma ação verificável para a próxima ocorrência (20 a 300 caracteres). O jogo armazena `lessonNotes[]` com um registro por OS, até 200 fichas, e permite revisões com número de versão. Toda gravação confirmada gera um evento `lesson_reflection`, sem duplicar o texto do jogador no evento.

As fichas não modificam caixa, XP, OS, consumo de material nem score do mecânico. Uma reflexão não é automaticamente validada como verdadeira.

## Aprendizagem por recorrência

Em uma nova OS do **mesmo cenário**, o jogo identifica quantos casos semelhantes já foram concluídos. As reflexões dos casos anteriores só aparecem após a nova OS concluir as seis etapas de diagnóstico; antes disso, a interface apenas indica a existência do histórico, sem dar o gabarito nem revelar textos que contenham a causa.

As reflexões são exibidas em até três casos recentes e continuam como observações escritas pelo jogador, não orientações automáticas de execução. Não há compensação de penalidade nem correção automática de decisões.

## Estrutura e limites

| Campo | Origem | Interpretação |
|---|---|---|
| Sintoma recebido | Relato armazenado na OS | Não implica mecanismo ou causa |
| Hipótese do cenário | Catálogo FMEA do jogo | Gabarito educativo, nunca laudo real |
| Eventos diagnósticos | `diagnosticLog[].outcome` | Resultado da mecânica do jogo |
| Plano PCM | `approvedScope.estimatedHH` | Estimativa de esforço |
| Esforço executado | `worked` | HH do serviço na simulação |
| Indisponibilidade virtual | `elapsedHours` | Horas corridas de OS, não disponibilidade física da frota |
| Retrabalho | `reworkHours` | Retrabalho contabilizado; causa isolada não comprovada |
| Lições | `lessonNotes[]` | Reflexões subjetivas do jogador, editáveis e persistentes |
| Eventos | `decisionHistory[]` | Auditoria de registro/revisão, sem guardar todo o texto |

Saves antigos continuam válidos. Quando não houver `lessonNotes`, a leitura retorna vazio e o primeiro registro cria a coleção. Uma OS antiga presente em `done` pode receber reflexão, mas **não se fabricam evidências diagnósticas ausentes**.

Não há coleta de dados reais de funcionários ou de ativos nem integração SAP. O conteúdo do jogador é escapado ao ser apresentado na interface para não interpretar HTML como código. O PWA tem cache próprio atualizado.

## QA e horizonte

O teste `scripts/test-lessons-learned-v10.cjs` cobre registro em OS concluída, revisão, auditoria, rejeição de dados inválidos, filtros, proteção contra spoiler antes do diagnóstico 6/6, leitura de saves legados, limite de 200 registros, serialização e interface.

**Pendente:** homologação visual em desktop e celular, campanhas longas, ajustes de acessibilidade, estudos de lições por mecanismo de falha que não confundam recorrência de cenário fictício com frequência real de falha.
