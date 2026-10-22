# P.O.R.C.A.R.I.A. — Ciclo 14 | Horímetros e disponibilidade simulados (v0.9.17)

## Modelo de tempo e premissas

A frota da campanha tem nove modelos e seis ativos virtuais por modelo (54 unidades). Cada turno possui 12 horas corridas. A medição se inicia na criação do novo jogo ou, para um save antigo, **no turno de migração**, sem gerar histórico retroativo.

Classificação mutuamente exclusiva por ativo e turno:
- **Parada corretiva virtual:** se há OS ativa ao início do turno, atribuir as 12 horas como indisponibilidade corretiva. A conclusão da OS no próprio turno não remove retroativamente a exposição desse turno. Trata-se de aproximação discreta, não de registro de parada real.
- **Parada preventiva virtual:** se não há corretiva aberta e existe preventiva autorizada no turno, atribuir 2 ou 4 horas ao pacote e o restante à operação presumida.
- **Operação presumida:** sem corretiva ou preventiva, atribuir 12 horas de operação. O jogo **não possui** standby, horas reais de produção nem dados OEM; portanto, essa classe é uma regra didática.

Para cada ativo, a soma de horas classificadas durante turnos medidos deve ser exatamente 12 × quantidade de turnos. Em todos os 54 ativos, um turno completo representa 648 horas-ativo classificadas; isso NÃO significa 648 HH de mecânicos.

## Indicadores

**Disponibilidade operacional virtual** = horas de operação presumida / (operação + parada preventiva + parada corretiva) dentro dos turnos medidos na janela.

**Disponibilidade de exclusão corretiva virtual** = (operação + parada preventiva) / tempo classificado. Essa segunda grandeza está disponível na API, mas não substitui a operacional nem disponibilidade física.

**Horímetro virtual** = horas acumuladas de operação presumida por ativo desde o início da coleta, excluindo paradas de manutenção.

**MTBF virtual observado entre ocorrências** = média das diferenças positivas ou nulas de horímetro entre dois eventos consecutivos de nova ocorrência gerada pelo motor, por ativo. O indicador exige pelo menos um intervalo completo (duas ocorrências). As ocorrências elegíveis são apenas as geradas aleatoriamente ou por progressão didática do motor; notificações convertidas manualmente não são automaticamente classificadas como falha. O MTBF agregado é ponderado pela quantidade de intervalos, não pela quantidade de ativos. Não representa MTBF real/OEM.

Um intervalo entra no cálculo de uma janela de 7, 14 ou 30 dias virtuais se o segundo evento cai dentro da janela e seu primeiro evento existe no histórico guardado. Sem dois registros de evento no ativo, o MTBF é **indisponível**, nunca zero.

## Persistência e compatibilidade

O objeto opcional `fleetTelemetry` contém:
- `startedTick`, `throughTick`;
- `assets[assetId]` com `hourmeter`, `correctiveDown`, `preventiveDown`, `failures[]` e `lastState`;
- `samples[]` com até **120 turnos** recentes de totais agregados.

Uma leitura de consulta nunca altera save. A atualização é única por avanço válido de turno; uma chamada repetida ou um salto de ticks gera erro, não fabrica horas. Saves antigos iniciam o horímetro em zero no turno corrente, preservando OS, profissionais, dinheiro e histórico preexistentes.

## Comparação com manutenção real

O jogo não utiliza estados efetivos de produção, disponibilidade para despacho, regime de turnos da mina, timestamp real de detecção/retorno, horímetros OEM nem falhas confirmadas. Portanto, nenhuma disponibilidade ou MTBF aqui pode fundamentar decisão de manutenção industrial real. Para isso, seriam necessários dados de produção/operador, códigos de falha revisados, eventos de parada, relatórios de execução, horímetros e taxonomia de falhas.

## Verificação

Teste: `scripts/test-fleet-telemetry-v14.cjs`. Critérios: 54 ativos, conservação das horas, classificação sem sobreposição, preventiva de 4h, OS em aberto, janela parcial, medição sem retroatividade, MTBF somente com pares, serialização, cache PWA, imutabilidade dos relatórios e testes CI/Pages. Homologação manual em desktop/celular e campanhas prolongadas continua pendente.
