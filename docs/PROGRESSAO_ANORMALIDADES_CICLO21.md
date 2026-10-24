# P.O.R.C.A.R.I.A. v0.9.24 — Ciclo 21: progressão de anormalidades

## Objetivo
Transformar a postergação de **achados de inspeção com notificação aberta** em consequências reais de gameplay. O PCM precisa decidir entre revisar, planejar, converter em OS, acompanhar ou arquivar com justificativa. **Não converta automaticamente observação em diagnóstico**: causa e dano continuam hipóteses até verificação do mecânico.

## Gatilhos e estados
- Um achado de inspeção produz `anomalyProgression` no momento da notificação; nasce em **OBSERVADO**.
- Cada avanço de turno, enquanto a nota não for arquivada nem estiver concluída, avalia sua idade acompanhada e progride por **OBSERVADO → AGRAVADO → CRÍTICO → FALHA FUNCIONAL**.
- O limiar é parametrizado por prioridade do registro e família do cenário. Prioridades alta/média/baixa possuem, como base virtual, os marcos **2/4/6**, **3/6/9** e **4/8/12** turnos. Famílias hidráulica/motor/freios/direção/compressor antecipam um turno; rodante/pneus/FPS postergam um turno. **Esses números são exclusivamente de balanceamento do jogo, não limites OEM, previsões de confiabilidade nem limites de operação segura.**
- A passagem por agravado ou crítico apenas registra novos sinais e avisos na Mesa PCM. Não gera OS nessas fases.
- A chegada à falha funcional registra **R$ 180 de mobilização emergencial virtual**, exatamente uma vez, e tenta abrir uma corretiva pela Fila de OS.
- A corretiva gerada na falha funcional usa `sourceScenario`, a mesma TAG, a observação original como relato e **prioridade crítica**, sem alocação automática, sem presumir peça ou causa raiz e sem excluir a nota. O vínculo é `notificationId` e `inspectionId`.
- Se houver outra OS do mesmo equipamento, preventiva em execução, limite de 32 OS ou cenário inválido, a falha fica **pendente de geração de OS**, com nova tentativa por turno e sem repetir o custo ou eventos.
- Arquivamento justificado pelo PCM interrompe a degradação. A conclusão da OS vinculada encerra o acompanhamento; mera aprovação de escopo, programação ou abertura de OS não equivalem a reparo.

## Separação entre setores
- **Inspeções:** identifica a condição, registra achado, envia notificação; não executa reparos.
- **Planejamento PCM:** apresenta idade do registro, estado, histórico cronológico e estágio provável seguinte; carteira ordenada por criticidade.
- **Rádio/Fila:** recebe corretiva automática **apenas** na falha funcional. A execução e o diagnóstico seguem o fluxo normal da Oficina.
- **Monitoramento de Condição:** seus registros `monitorOnly` continuam com protocolos específicos de recoleta/escalonamento; não entram no motor de progressão dos achados sensitivos.

## Contratos de dados
`notification.anomalyProgression` contém `startTick, phase, changedTick, history, failureCostApplied, pendingFailure, linkedOrderId, resolvedTick, closingReason, version`.
Eventos no histórico de decisões: `anomaly_progression`, `anomaly_emergency_cost`, `anomaly_failure_order`, `anomaly_resolved`. Não há exclusão nem recriação das OS antigas.

**Migração:** saves sem o campo recebem acompanhamento a partir do **turno da primeira importação**, sem fabricar um passado de deterioração ou uma multa retroativa. `version:'1.1.0'` é preservado.

## Validação
`node scripts/test-anomaly-progression-v21.cjs` integra o CI. Cenários de teste: prioridades e limiares, transições, falha/OS crítica, evento/custo único, repetição de turno, conflitos, interrupção por arquivamento, isolamento do monitoramento, save legado e presença dos componentes de UI/PWA.

## Limitações
Os catálogos são cenários pedagógicos, não laudos ou diagnósticos OEM. O jogo não utiliza probabilidade real de falha, medição física, histórico de degradação verificado ou função de risco por ativo. A penalização por tempo é intencionalmente simplificada. Validação visual e balanceamento longo de campanhas permanecem tarefas manuais.
