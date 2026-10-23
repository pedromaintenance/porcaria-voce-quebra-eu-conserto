# PORCARIA v0.9.19 — Ciclo 16 | OS preventivas automáticas e Diva

## Objetivo
Criar ordens de serviço preventivas automaticamente por vencimento do horímetro de cada equipamento. Durante a execução, o supervisor **Diva** aparece ao lado do mecânico no box. Não há geração manual da OS preventiva pelo jogador: ele realiza a gestão de recursos e execução.

## Fluxo de trabalho
1. A cada início de turno e ao carregar campanhas antigas, validar os vencimentos da frota.
2. Se o horímetro virtual alcança o limite e não há OS corretiva, OS preventiva existente ou preventiva legada autorizada sobre o mesmo ativo, criar uma **OS sequencial** (prefixo `OS`; campo `kind='preventive'`).
3. A carteira em **Planejamento → Preventivas** mostra as OS em aberto, esforço HH, custo e vencimento.
4. O jogador escolhe mecânico e box; o sistema impede conflitos com OS corretiva, reservas PCM, treinamento e outros serviços preventivos.
5. O Diva surge no box junto do mecânico, com quatro poses transparentes. Ele é supervisor visual; não substitui nem duplica a mão de obra.
6. Ao avançar o turno, o serviço consome HH úteis do mecânico, aplica fadiga, registra parada preventiva do equipamento e, ao concluir, debita custo, ativa proteção temporária do componente e encerra a OS.
7. Próxima preventiva após **48 horas de operação virtual contadas após o turno de conclusão**. O horímetro não corre em standby nem durante a parada.

## Parâmetros da primeira implementação
- `inspection`: 2 HH, R$120 de custo interno, redução probabilística de novas ocorrências no ativo de 25% por quatro turnos;
- `service`: 4 HH, R$360, redução probabilística de 45% por oito turnos;
- Vencimento inaugural escalonado pela frota para evitar concentrar 54 OS no primeiro turno;
- Limite de 18 OS automáticas abertas simultaneamente; vencimentos pendentes permanecem nos horímetros e são avaliados no próximo turno;
- Histórico retém até 180 OS automáticas concluídas;
- Os três primeiros ciclos de cada ativo seguem o pacote alternado (duas inspeções, um serviço).

Esses são parâmetros de balanceamento da campanha, **não procedimentos de manutenção OEM**. A interface mostra a redação natural das atividades; notas sobre a metodologia permanecem nesta documentação.

## Compatibilidade
- As OS corretivas seguem inalteradas em `state.jobs`; as preventivas automáticas têm `state.preventiveOrders`, com `OS...` sequencial única, e seus resultados ficam também em `preventiveJobs`.
- Saves antigos recebem `preventiveOrders=[]` e calendário `preventiveDue` sem reconstruir historicamente os serviços já realizados.
- O fluxo legado `PV...` permanece operável para reservas que já existiam no save; novas preventivas são abertas pela carteira automática.
- O indicador PM/CM utiliza `preventiveJobs.completed`, evitando dupla contagem das OS preventivas.
- O Diva não é cadastrado como mecânico e não ocupa capacidade nem HH. Sua participação é visual e registrada nos metadados da ordem.

## Testes
`scripts/test-auto-preventive-diva-v16.cjs` cobre geração, ausência de duplicação, numeração OS, alocação, bloqueio de box, liberação, HH, caixa, próximo vencimento, indisponibilidade do ativo, retorno da equipe, save legado, arquivo WebP e cache de publicação. CI Phaser e Pages executam a regressão.

**Pendente:** homologação visual manual no desktop/mobile e balanceamento de campanhas prolongadas; conferir cenários com faltas de equipe e vários vencimentos simultâneos.
