# PORCARIA v0.9.14 — Programação PCM por turno (Ciclo 11)

**Escopo:** tornar a janela de 14 turnos um calendário de compromissos de PCM, preservando todas as ações explícitas do jogador.

## Semântica operacional

1. Em **Planejamento → Programar · 14 turnos**, selecione OS, mecânico, BOX 1/2/3 e turno. Confirmar cria apenas uma reserva; não atribui a OS, nem adianta diagnóstico ou material.
2. Uma OS só pode ter uma reserva ativa. No mesmo turno, não pode existir segunda reserva do mesmo mecânico ou box. Cancelar libera recursos.
3. Durante o turno reservado, alocações manuais conflitantes são bloqueadas também fora do módulo; o usuário precisa cancelar a reserva ou cumpri-la. Ao efetuar a alocação manual, a reserva muda para `fulfilled`.
4. Ao avançar o turno sem executar a reserva, o registro muda para `missed`; cancelamentos ficam em `cancelled`. Não há penalidade arbitrária nem nova ocorrência gerada só por reserva perdida.
5. Antes do diagnóstico 6/6, a peça necessária permanece desconhecida. Depois, o teste de material considera saldo e compras com ETA **até o início** do turno reservado e outras reservas concorrendo pelo mesmo item. Isso **não** é alocação física de estoque: novas OS/consumos podem mudar o cenário.
6. Descanso, integração normativa, treino, ocupação atual e ferramenta são verificados sem extrapolar situação futura de pessoal. Cada compromisso representa a reserva de um box e um mecânico por turno, não garantia de conclusão, nem medida confirmada de HH.

## Estado e retrocompatibilidade

Novos campos opcionais: `scheduleEntries[]` e `nextSchedule`, armazenados no mesmo save. Limite de 200 registros retidos. Os saves antigos continuam válidos; estados de reserva: `planned`, `fulfilled`, `missed`, `cancelled`.

Decisões vinculadas: `schedule_created`, `schedule_cancelled`, `schedule_fulfilled`, `schedule_missed`, visíveis no Histórico de Decisões PCM. Não há integração com SAP real nem validação de planejamento real de manutenção.

## Verificação

Testes automáticos: `scripts/test-weekly-schedule-v11.cjs`, CI geral, execução em campanha longa. Inspeção de CSS em desktop/mobile, eventos de training+inspeções futuras e critérios de ergonomia continuam pendentes de homologação manual.
