# Sessão 9 — Monitoramento por condição, recoleta e tendência (20/10/2026)

O catálogo **PORCARIA — Você Quebra, Eu Conserto** permanece com **100 missões** e **387 caminhos funcionais**. A sessão cria uma jogabilidade nova de monitoramento, sem acrescentar falso reparo e sem gerar OS automaticamente.

## Objetivo funcional

Permitir que o planejador avalie uma notificação de condição cujo indício ainda não justifica condenação de componente, registre o motivo da observação, programe recoleta por turno simulado, compare qualitativamente tendências e decida **encerrar sem OS**, **continuar monitorando** ou **escalonar para revisão PCM**.

**Atenção:** esses exemplos não autorizam a continuidade operacional de equipamento real. Tendências, intervalo de recoleta, condição inicial, equivalência entre amostras e resultado são **ficção didática**, não critérios OEM, procedimentos SOS ou laudos laboratoriais genuínos.

## Estudos-piloto disponíveis na Mesa PCM

| Protocolo | Modelo | Observação simulada | Evolução fictícia | Se escalonado |
|---|---|---|---|---|
| `baseline` | CAT 777E | Perfil químico diferente após reposição declarada; não há defeito comprovado | Estável → Estável (encerra sem OS) | INC041, cenário de investigação de ingresso de água, não comprovação de falha |
| `sample` | CAT D9 | Partículas em amostra cuja representatividade ainda requer confirmação | Inconclusivo → Agravamento | INC042, investigar ingresso de poeira |
| `differential` | CAT 966 | Particulado suspeito em laudo do diferencial | Agravamento | INC092, investigar vias de contaminação |

Os registros **INC041, INC042 e INC092** pertencem ao catálogo didático existente, referenciando o [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining). As sequências de recoleta, resultados de piora e intervalos foram **escritos exclusivamente para este jogo**. O motor cria uma *notificação de investigação* vinculada a um cenário original somente ao escalonar; essa associação não equivale à causa raiz confirmada.

## Máquina de estados implementada

1. **Abrir registro de condição** → cria inspeção `IN####` e notificação `NM####`, sem OS, com `monitorOnly:true` e `sourceScenario:null`.
2. **Justificar e programar** → escolher motivo em catálogo controlado e próxima recoleta em **2 ou 4 turnos fictícios**; a nota passa ao status `monitorando`.
3. **Recoletar** → somente a partir do turno devido, exigindo a ferramenta virtual `COLETA` e caixa de R$40 fictícios. O sistema desconta uma vez e grava `samples` com `tick`, resultado, texto interpretativo, custo e natureza simulada.
4. **Decidir com base na tendência**: um resultado estável ou inconclusivo exige decisão explícita de continuar; duas recoletas **estáveis consecutivas** permitem **encerrar sem OS**; uma piora passa a `requer_avaliacao` e bloqueia continuidade simples.
5. **Escalonar** → gera nova notificação `NM####` com `previousMonitorId`, mesmo `asset`, motivo/última recoleta e status de revisão PCM. O monitoramento de origem passa a `escalonada_monitoramento`. **Nenhuma OS nasce neste passo.** Para intervir, ainda é necessário revisar hipóteses, aprovar o plano e realizar a conversão manual em OS pelo fluxo PCM existente.
6. **Acompanhar** → a Mesa PCM apresenta ativos, recoletas vencidas, agravamentos e monitoramentos encerrados. O briefing de turno mostra alertas de coleta e piora. O sorteio normal de ocorrências e a inspeção sistemática evitam o mesmo equipamento enquanto ele possuir monitoramento aberto.

Não há alegação de segurança de uso, previsão de vida remanescente ou limites químicos reais. Os limites `2`, `4` turnos e o valor R$40 são parâmetros de game design. O monitoramento não simula coleta física ou emissão automática de laudo.

## Dados, auditoria e saves

A trilha `monitoring` fica dentro da própria notificação: `baseline`, `reason`, `interval`, `nextTick`, `samples[]` e `decisions[]`. A nova notificação PCM guarda `previousMonitorId` e a original recebe `escalationNotificationId`. Os saves legados `version:'1.1.0'` permanecem compatíveis, e nenhum campo é necessário até o jogador iniciar um protocolo.

O módulo `phaser-play/monitoring.js` isola regras e transições; `phaser-play/inspection-view.js` e `game.js` são responsáveis pela interface e ações. `engine.js` e `inspection.js` reservam ativos em monitoramento, evitando OS/inspeções simultâneas geradas automaticamente. O cache PWA foi versionado sem quebrar sua assinatura anterior.

## Referências, segurança e limitações

A mudança de formulação conhecida pode alterar o baseline de análise de óleo sem indicar falha, **mas a equivalência do lubrificante, sua compatibilidade e a condição operacional não foram confirmadas por OEM neste exercício**. Uma análise isolada pode requerer recoleta antes de condenar um conjunto, desde que as condições de operação e avaliação de risco o permitam. **Piora reiterada, água, sílica, metais, alarmes ou sintomas de segurança exigem investigação e não devem ser descartados como “apenas tendência” sem evidência.**

Não há resultados quantitativos, algoritmo de tendência estatística, limites de alerta ou modelos de taxa de falha: cada teste fictício possui uma sequência qualitativa conhecida apenas pelo motor.

## Regressões

`node scripts/test-monitoring-session9.cjs` verifica abertura sem OS, justificativa, agendamento, coleta antecipada recusada, custo e instrumento, tendência estável, inconclusivo, agravamento, encerramento, escalonamento à PCM, conversão **somente após aprovação**, vínculo de ativo, reserva de máquina e saves anteriores. Os testes antigos de PCM, inspeção, sessões FMEA, recrutamento e Phaser continuam obrigatórios.

A conferência visual manual após publicação segue recomendada.
