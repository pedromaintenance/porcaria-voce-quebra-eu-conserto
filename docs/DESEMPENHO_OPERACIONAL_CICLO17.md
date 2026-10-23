# PORCARIA v0.9.20 — Ciclo 17 | Desempenho operacional da frota

## Finalidade
Acompanhar o atendimento à **jornada operacional programada** por equipamento e por modelo, relacionando intervenções de manutenção e tempo produtivo. Não calcular tonelagem, BCM, ciclos de carregamento/transporte ou receita por produção sem fontes e mecanismos capazes de sustentar tais valores.

A funcionalidade é acessada em **Planejamento → Desempenho da Frota**.

## Método

A partir do Ciclo 17, cada registro de turno em `fleetTelemetry.samples[].perAsset[]` preserva `dutyHours` — a jornada de 0, 4, 8 ou 12 h atribuída àquele ativo **naquele turno**. É um snapshot histórico, não uma leitura da configuração atual.

Para cada ativo/turno com amostra válida:

- **Horas programadas:** jornada armazenada no turno.
- **Horas cumpridas:** operação registrada, limitada à jornada armazenada.
- **Déficit de jornada:** máximo entre zero e jornada programada menos horas cumpridas.
- **Déficit associado à corretiva:** mínimo entre o déficit e as horas de parada corretiva daquele mesmo turno.
- **Déficit associado à preventiva:** mínimo entre o déficit restante e as horas de parada preventiva daquele mesmo turno.
- **Cumprimento:** horas cumpridas ÷ horas programadas × 100, indisponível se o total programado é zero.

Essas parcelas não extrapolam o déficit. Por exemplo: jornada de 8 h, preventiva de 2 h e operação de 8 h significam **zero horas programadas não cumpridas**, porque a intervenção foi absorvida pelas 4 h originalmente destinadas ao standby. Já 5 h de parada corretiva deixam apenas 7 h disponíveis e podem produzir 1 h de déficit.

**Unidade de análise:** hora-ativo. Somar modelos permite analisar total de jornada atendida, mas NÃO significa agregar toneladas, cargas, perfurações ou unidades físicas de produtos distintos.

## Metas e decisões
O PCM pode estabelecer uma meta de cumprimento por modelo: 60%, 75%, 85% ou 95% (85% é o padrão). A meta é usada para comparar resultados já medidos e não altera retrospectivamente amostras, comportamento de equipamento, números de falha, dinheiro nem tempo. Cada alteração real fica registrada como `production_target_changed` no Histórico PCM.

O ranking por equipamento usa somente períodos com informação histórica da jornada. Um ativo com jornada zero não é classificado como desempenho 0% ou 100%: o percentual é não aplicável.

## Integridade histórica
Saves anteriores preservam suas amostras V14/V15 sem `dutyHours`. Não é permitido calcular a jornada original a partir da configuração atual, porque o jogador pode tê-la alterado depois. Portanto:
- Amostras antigas continuam disponíveis na telemetria de horas operadas.
- Para *cumprimento da jornada*, linhas sem snapshot são excluídas e apontadas como cobertura parcial.
- O painel oferece janelas de 7, 14 e 30 dias e informa cobertura incompleta.
- `productionTargets` é opcional e compatível com todos os saves anteriores.
- O módulo `production-performance.js` realiza consulta sem modificar o save.

## Limites e próximos controles
Os valores derivam de regras operacionais do jogo. Não substituem medição de produção da mina nem comprovam perda física de produto. O desvio é de **horas previstas de operação**, e não de receita ou tonelagem. Uma meta cumprida não elimina a necessidade de análise de confiabilidade, segurança ou backlog.

A homologação visual desktop/mobile, a avaliação de campanhas extensas e uma futura dinâmica com ciclos produtivos explícitos permanecem pendentes.

## Testes
`scripts/test-production-v17.cjs` verifica snapshot de jornada, 54 ativos, horas conservadas, metas, auditoria PCM, resultados por equipamento/modelo, segregação de perdas, cobertura histórica e compatibilidade de saves. A suíte roda no CI Phaser e no workflow de implantação do GitHub Pages.
