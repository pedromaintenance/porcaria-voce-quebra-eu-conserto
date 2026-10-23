# PORCARIA v0.9.21 — Ciclo 18 | Comparador de decisões PCM

## Objetivo
Apoiar o jogador a **comparar alternativas de alocação e reserva** antes de executá-las. O comparador está em **Planejamento → Comparar Decisões**, acessível no menu da oficina. Não substitui diagnóstico, programação real da equipe ou avanço de turno.

## Ordem de serviço e alternativas
Selecione uma OS aberta (corretiva em backlog ou preventiva automática ainda não alocada), um mecânico e um box. O painel compara:
1. **Este turno:** para OS corretiva, testa uma reserva PCM com os validadores existentes; para preventiva, testa a alocação atual com Diva. A confirmação registra efetivamente a reserva ou alocação.
2. **Próximo turno:** para corretivas, compara e permite confirmar uma reserva futura, sem execução automática; para preventivas, indica claramente que a carteira não possui mecanismo de reserva futura, portanto não oferece um botão inoperante.
3. **Manter na carteira:** referência sem alteração, não cria reserva, não ocupa recursos e não apropria custos.

Todos os testes de disponibilidade executam as ações normais `engine.scheduleJob` ou `engine.assignPreventiveOrder` **sobre uma cópia JSON descartável do save**. Desta forma, a simulação respeita as regras já codificadas para ferramenta, diagnóstico, estoque, conflitos de box e mecânico, folgas, integração, treinamento e agenda PCM, mas não provoca efeitos colaterais no estado real.

## Indicadores técnicos apresentados
O comparador mostra a jornada virtual configurada do ativo, o esforço restante conhecido e, no caso de preventiva imediata, o **possível conflito entre a duração nominal do serviço e as horas disponíveis fora da jornada**. Exemplo: em turno de 12 horas, jornada planejada de 8 horas, preventiva de 2 HH não reduz a operação programada se houver pelo menos 4 horas de standby. Esse é um limite aritmético e pressupõe conclusão dentro do turno. HH mecânicas e tempo físico de parada não são a mesma grandeza.

Para OS corretivas, a exposição de um ou dois turnos é uma **hipótese condicional de permanência em aberto**, e NÃO previsão de MTTR, disponibilidade ou reparo. A reserva só protege recursos no calendário; o jogador deve executar a alocação e a investigação.

## Integridade e imersão
- Consultar cenários não modifica `tick`, caixa, estoque, horímetro, equipe, histórico de decisão ou OS.
- A interface só mostra botão de confirmação para alternativas disponíveis.
- Antes de confirmar, recalcula a situação atual e rejeita alternativas desatualizadas.
- Confirmações chamam as funções existentes do motor; o log de decisões usa os registros padrão `schedule_created` e `preventive_os_assigned`, sem eventos duplicados de teste.
- A interface usa linguagem de planejamento da oficina, sem avisos de ficção nos relatórios internos.
- Saves anteriores funcionam sem migração: controles e parâmetros de cenário são locais à interface.

## Limites conhecidos
Não há previsão confiável de retorno do equipamento, falha adicional, qualidade do diagnóstico ou estoque futuro além da regra já aplicada no calendário. A alternativa de adiamento de preventiva continua sem reserva futura; transformar preventivas em agenda real de vários turnos seria um escopo independente.

## Qualidade
`scripts/test-pcm-options-v18.cjs` verifica a consulta pura, criação de OS inicial, recursos, conflitos, cenário atual e seguinte, ausência de efeitos antes da confirmação e execução das ações existentes. CI Phaser e GitHub Pages executam a regressão.
