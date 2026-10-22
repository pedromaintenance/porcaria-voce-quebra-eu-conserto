# PORCARIA v0.9.18 — Ciclo 15 | Standby, utilização e parada parcial

## Modelo físico DIDÁTICO

O modelo parte de **12 horas por turno × 54 ativos simulados**, totalizando 648 horas-ativo/turno. Para cada equipamento, o total é particionado em quatro estados mutuamente exclusivos: **operação presumida, standby, parada preventiva e parada corretiva**.

O jogador define uma **jornada virtual de operação** por ativo: **0, 4, 8 ou 12 horas/turno**. Novas campanhas começam com 8 horas disponíveis para operação e 4 em standby quando não há manutenção. A jornada configurada é uma hipótese de despacho dentro do simulador, e não um horímetro real, produtividade medida ou escala OEM.

Hierarquia de estados no turno:
1. Havendo OS corretiva em andamento no início do turno, o ativo é classificado em corretiva. Se ela continua aberta após a execução, a parada é de 12 horas.
2. Se a OS é concluída no mesmo turno, e nenhuma falha progressiva imediatamente substitui a OS no ativo, o motor utiliza as **HH de reparo realizadas naquele turno como proxy de duração da parada**, com mínimo de 0,5h e máximo de 12h. O resto torna-se elegível à jornada operacional configurada e a standby. É aproximação discreta; HH mecânicas não equivalem necessariamente a tempo de indisponibilidade física.
3. Na ausência de corretiva, a preventiva concluída consome 2 ou 4 horas de parada. O saldo pode ser operação, limitado à jornada configurada, e standby.
4. Sem manutenção, operação = jornada configurada (0/4/8/12h); standby = 12 − operação.

**Invariante fundamental:** operação + standby + preventiva + corretiva = 12h para cada equipamento, em cada turno. Nunca confundir horas-ativo com HH de mão de obra.

## Definições dos indicadores

**Disponibilidade operacional virtual** = (horas em operação + horas em standby) ÷ horas-ativo classificadas. O equipamento em standby está disponível, mas não em produção.

**Utilização virtual** = horas em operação ÷ (horas em operação + horas em standby), quando existem horas disponíveis.

**Ocupação do tempo total virtual** = horas em operação ÷ horas-ativo classificadas. Esta é grandeza diferente de disponibilidade e utilização.

**Horímetro virtual** cresce exclusivamente nas horas de operação presumida. Não cresce em standby nem nas paradas de manutenção. O cálculo de MTBF virtual entre ocorrências continua baseado em pares de eventos gerados pelo simulador, nunca em notificações manuais nem em falhas OEM.

Os indicadores são agregados por **janela móvel de 7/14/30 dias virtuais**; não misturam amostras da metodologia V14 com V15. Os acumulados anteriores dos ativos, inclusive horímetro virtual, permanecem no save, mas a janela V15 começa na migração; não é retroativa. O painel sinaliza quando o período está incompleto.

## UX e auditabilidade

Em **Planejamento → KPIs da Manutenção**, filtrar pelo modelo, consultar os seis ativos e alterar individualmente as horas planejadas de operação no seletor de jornada. O motor valida valores, salva mudanças e gera evento `fleet_duty_changed` no histórico PCM. Mudar jornada não cancela OS, não cria compra e não manipula os resultados anteriores.

## Limitações explícitas

Os parâmetros não representam a realidade de mina. O jogo não possui registros OEM de horímetro, estados reais de produção, disponibilidade para despacho, timestamps de retorno, processo de carregamento, produtividade nem quebra em horas fracionárias comprovadas. **HH de reparo no fechamento são apenas proxy temporal**; o jogador deve ler toda a análise como indicadores virtuais de aprendizado de gestão.

## Verificação

`scripts/test-fleet-standby-v15.cjs` testa horas de standby, disponibilidade, utilização, contabilização sem sobreposição, casos de 0h/dia, manutenção preventiva, corretiva concluída no turno com duração parcial, validação de jornada, auditoria, migração V14 e idempotência. A suíte V14 continua exercitando o perfil antigo de 12 horas. CI Phaser e GitHub Pages executam ambos os testes.

**Pendente:** QA manual desktop/mobile, campanha longa e refinamento de estados parciais com timestamps de produção, assim como governança e calibração de custos e jornadas ficcionais.
