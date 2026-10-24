# P.O.R.C.A.R.I.A. v0.9.23 — Ciclo 20 | Energia física e continuidade das OS

## Contrato do simulador
- Jornada por turno: **12 horas corridas**, das quais **10,5 HH são produtivas** (0,5 h DDS + 1 h refeição).
- Por mecânico e por turno **com trabalho**, sortear uma taxa inteira uniforme de **40 a 70 pontos físicos para 10,5 HH**. Usar **um só sorteio** para o somatório de inspeções, preventivas e corretivas do profissional no mesmo turno.
- Consumo: `taxa_sorteada × (HH_efetivas/10,5)`. Ex.: 5,25 HH consomem 20 a 35 pontos.
- Capacidade executável respeita simultaneamente as HH restantes e a energia física disponível. Serviços multi-turno permanecem com saldo, sem conclusão artificial e sem duplicação.
- **Abaixo de 40%:** proibir nova alocação e impedir o início do turno em OS já alocada; interromper a OS, preservando etapa e trabalho realizado.
- **Energia igual a zero:** interromper as OS com recursos liberados e impor descanso nos **dois turnos seguintes**. Reativação possível após o prazo e energia suficiente.
- **Dois turnos integrais consecutivos:** terceiro turno de trabalho recusado, mesmo que a energia esteja artificialmente elevada, evitando sequência incompatível com a regra operacional.
- **Recuperação:** um turno de 12 horas sem trabalho e sem treinamento recupera entre **40 e 70 pontos**, até o teto de 100; não há recuperação física automática por virada do dia. Ausência de serviço com OS bloqueada por ferramenta ou material conta como descanso físico efetivo.
- A produtividade continua alterando velocidade, custo de oportunidade e desgaste **mental**, mas não multiplica novamente a energia física. As 10,5 HH são a base única dessa energia.

## Persistência e rastreabilidade
- `member.physical`: energia física 0–100 (campo já existente).
- `member.physicalShift`: `{tick, baseLoss, workedHH}`, cálculo auditável e retomável.
- `member.fullWorkStreak`, `member.lastFullWorkTick`: sequência de jornadas integrais.
- `member.exhaustedUntilTick`: primeiro turno apto após o bloqueio por exaustão.
- `order.lastInterruption`: `{tick, reason}` para corretivas ou preventivas interrompidas, com OS preservada.
- Migração aditiva de saves antigos via `normalizeRoster`/`normalizePhysical`; mantém `version:'1.1.0'`, ID, ordem e progresso histórico.

## Setores afetados
- **Oficina:** bloqueio na alocação, interrupção da corretiva e preservação de diagnóstico/HH.
- **Preventiva automática e Diva:** respeito ao teto físico, sem cobrança de custo antes de concluir e sem perder OS em andamento.
- **Preventivas legadas:** autorização somente quando há capacidade física para completar o pacote no turno; cancelamento com restituição se a capacidade desaparecer.
- **Inspeções:** orçamento conservador contra a maior taxa possível, prevenindo sobrealocação prévia ao sorteio efetivo; execução entra no acumulado do turno.
- **PCM:** agenda atual e futura impede bloqueios físicos já conhecidos; reservas futuras continuam condicionais à aptidão do profissional no dia da execução.
- **Equipe:** exibe a taxa sorteada, HH consumidas e condição de descanso compulsório.

## Verificação
`scripts/test-physical-energy-v20.cjs` verifica taxa mínima/máxima, proporcionalidade, descanso, recusa abaixo de 40%, duas jornadas integrais, bloqueio da terceira, exaustão imediata, retorno, inspeção mais OS, preventiva interrompida, calendário PCM e compatibilidade de saves.

**Limitações:** a taxa é mecânica de gameplay, não modelo médico de fadiga ou limite legal de jornada. A UI de inspeções confirma achados antes do avanço do turno; em caso extremo, o motor limita a apropriação física sem apagar o registro de campo. Requer teste visual manual em desktop e celular. Não representa previsão real de desempenho, acidente ou exaustão humana.
