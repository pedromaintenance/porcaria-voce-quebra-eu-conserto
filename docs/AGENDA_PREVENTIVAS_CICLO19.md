# PORCARIA v0.9.22 — Ciclo 19 | Programação futura das OS preventivas com Diva

## Fluxo operacional
As OS preventivas continuam sendo abertas **automaticamente por horímetro**. O jogador agora pode reservar o mecânico e o box para um turno futuro, usando a janela vinculante de 14 turnos do PCM.

1. Acesse **Planejamento → Programar · 14 Turnos**; o seletor de OS apresenta corretivas abertas e preventivas automáticas ainda sem reserva.
2. Selecione OS, profissional, box e turno. A reserva bloqueia os mesmos recursos contra outras reservas, corretivas ou preventivas.
3. A reserva não movimenta caixa, não aloca o profissional e não inicia trabalho. O vencimento por horímetro e o estado da OS continuam inalterados.
4. No turno reservado, use **INICIAR PREVENTIVA COM DIVA** no calendário. O sistema revalida condições operacionais, aloca o mecânico, marca a reserva como cumprida e renderiza Diva junto ao profissional no box.
5. Somente o avanço do turno executa HH, apropria custos e encerra a OS, caso o trabalho seja completado. Diva acompanha o serviço sem HH adicionais.
6. Se o turno passar sem alocação, a reserva passa a **NÃO REALIZADA**, mas a OS preventiva continua aberta e pode ser reprogramada. Cancelar uma reserva também libera o recurso sem excluir a OS.

A aba **Comparar Decisões** do Ciclo 18 oferece a nova alternativa **Programar no turno seguinte** para preventivas, conservando a comparação imutável até a confirmação.

## Regras de engenharia e de execução
A agenda integrada usa `scheduleEntries[]` com `kind:'preventive'` para OS automáticas; reservas corretivas antigas, que não têm `kind`, continuam interpretadas como corretivas.

O mecanismo de reserva impede dupla alocação de mecânico e box no mesmo turno, considerando treinamento, descanso, integração, ocupação por corretivas e preventivas em execução. A execução da preventiva é barrada se outra reserva ocupar o recurso ou se a mesma OS estiver programada em turno futuro. Uma reserva coincidente de **mesma OS + mesmo mecânico + mesmo box + turno corrente** permite a alocação e é marcada como cumprida.

Não se presume que o caixa, o estoque ou a disponibilidade futura sejam garantidos: todos os requisitos de alocação são revalidados no turno da execução. As reservas não geram segunda OS nem evento de manutenção concluída por si só.

## Persistência e auditoria
Não há migração destrutiva de saves. A propriedade opcional `kind` é adicionada somente a novas reservas preventivas. Os eventos existentes `schedule_created`, `schedule_fulfilled`, `schedule_cancelled`, `schedule_missed` e `preventive_os_assigned` continuam representando as transições reais e constam no Histórico PCM.

## Validação
`scripts/test-preventive-scheduling-v19.cjs` valida geração, reserva futura, concorrência de recursos, imutabilidade da consulta, impossibilidade de execução antecipada, início manual com Diva, apropriação de HH e custos, vencimento sem execução, cancelamento, reservas antigas de corretivas e integridade dos saves.

Continuam pendentes testes visuais manuais no desktop/celular e balanceamento de campanhas longas.
