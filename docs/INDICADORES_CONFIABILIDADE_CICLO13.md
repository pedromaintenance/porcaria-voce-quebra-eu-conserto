# PORCARIA v0.9.16 — Indicadores de Manutenção | Ciclo 13

## Objetivo
Analisar dados realmente registrados na campanha, sem inventar MTBF, horas operadas, disponibilidade física, falhas reais evitadas ou economia contrafactual.

O painel fica em **Planejamento → KPIs da Manutenção**, com filtros de **7, 14 e 30 dias virtuais** (2 turnos de 12 horas por dia) e atalho em **Gestão → KPIs PCM**.

## Dicionário de métricas

| Indicador | Fonte | Semântica |
|---|---|---|
| Corretivas concluídas e HH corretivas | state.done: finishedTick e worked | Fechamentos e esforço de OS concluídas dentro da janela |
| Preventivas executadas e HH | preventiveJobs completed: closedTick, hours | Serviços efetivamente realizados dentro da janela |
| Participação preventiva | HH PM / (HH PM + HH CM) | Relação entre esforços executados registrados; não inclui OS abertas |
| Prazo médio de OS | done.elapsedHours | Horas corridas entre abertura e conclusão; não é MTTR físico |
| Esforço médio por OS | done.worked | HH registradas por ordem fechada |
| Primeira execução correta | done.firstTime | Apenas OS classificadas true/false; nulos não entram no denominador |
| Reincidência no ativo | Nova OS com tickOpen após finishedTick de OS anterior no mesmo asset | Não confirma mesma causa, mesmo modo de falha ou falha OEM |
| Exposição de OS em aberto | (tick - tickOpen) × 12 por OS | Soma de horas corridas por ordem, não downtime físico da frota |
| Espera por peças, ferramenta e fila | done.materialWaitShifts/toolWaitShifts/diagnosisQueueShifts | Dimensões que se sobrepõem; nunca somá-las |
| Preventivas executadas (R$) | preventiveJobs completed.cost | Desembolso fictício efetivado |
| Preventivas pendentes (R$) | preventiveJobs planned.cost | Valor já autorizado; apresentado separadamente |
| Mão de obra corretiva (R$) | done.costLabor | Contabilidade de OS, não necessariamente débito de caixa |
| Valor indicativo do material usado (R$) | done.materialCost se materialUsed | Não duplicar com histórico de compras |
| Compras efetuadas (R$) | purchaseHistory.paid e orderedTick | Fluxo de caixa, separado do consumo valorizado |

Os gráficos mostram HH por dia virtual, discriminando serviços de preventiva executados e OS corretivas encerradas. Dados de eventos posteriores não são projetados.

## Retenção, integridade e limitações
O save retém até 200 OS concluídas e 150 registros de pacotes preventivos. O painel sinaliza teto alcançado: períodos históricos podem ser parciais. Não há mutação de estado pelo módulo puro reliability-kpis.js; o filtro de período pertence apenas à interface.

**Não calcular MTBF nem disponibilidade:** faltam horímetros/horas efetivas em operação e estados comprovados de produção, standby e manutenção. **Não calcular falhas ou economias evitadas:** rejeições de sorteios probabilísticos da campanha não constituem contrafactual observado. Custos do jogo misturam desembolso e apropriação contábil; não consolidar despesas sem conciliação.

## Testes
scripts/test-reliability-kpis-v13.cjs verifica série e janelas, esforço, custos separados, recorrência, classificação parcial, imutabilidade, save legado e retenção. A suíte Phaser e o deploy Pages executam o teste. QA manual em desktop/mobile e campanhas longas fica pendente.
