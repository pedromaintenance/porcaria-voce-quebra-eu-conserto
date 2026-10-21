# P.O.R.C.A.R.I.A. — PCM: impacto de decisões (ciclo 8)

**Versão:** 0.9.11 · **Referência:** 21/10/2026

## Diagnóstico do sistema antes da mudança

O motor já dispunha de caixa, estoque, pedidos com ETA, mecânica de compra urgente, bloqueio de reparos sem insumo, diagnóstico PCM e retrabalho por erros. Faltava consolidar esses efeitos e torná-los observáveis no Planejamento. Não foi necessário criar uma economia externa ou curvas OEM.

## Regras confirmadas no motor do jogo

| Decisão | Regra de cálculo do jogo | Consequência |
|---|---|---|
| Compra normal | Preço unitário arredondado; ETA-base = 2 × lead do material | Desembolso imediato, chegada somente ao final do turno programado |
| Compra urgente | Preço unitário = round(1,65 × unit); ETA-base = max(1, ceil(lead/2)) | Premium de compra, menor janela de espera |
| Variação logística | 18% de chance fictícia de +1 turno, nas duas modalidades | Prazo anunciado em intervalo mínimo–máximo, sem prometer entrega |
| Falta de material | Estágio de reparo com material não reservado e sem saldo | Reparo continua bloqueado até recebimento e reserva |
| Falta de ferramenta | Ferramental indisponível | Diagnóstico/execução bloqueados conforme etapa |
| Diagnóstico PCM incorreto | Rotina de retrabalho já existente | HH adicionais, energia/moral afetadas e desembolso virtual no motor |
| Atraso de OS | 12 horas corridas por turno transcorrido, inclusive turno de conclusão | Tempo acumulado por OS e carteira |
| Custo de oportunidade | 35/75/150 R$/h virtual para prioridades 1/2/3 | Indicador **ilustrativo**, não debitado do caixa |

## Novos registros

- `purchaseHistory[]`: histórico de até 200 pedidos com `orderedTick`, `eta`, `paid`, `fast`, `stockAtPurchase`, `demandAtPurchase` e `receivedTick`. Os pedidos ainda em trânsito continuam em `orders[]`.
- `exposureShifts`: turnos em que a OS esteve na carteira durante uma passagem de turno.
- `materialWaitShifts`: turnos de ausência de peça após finalizar as seis etapas de diagnóstico e antes da baixa de material.
- `toolWaitShifts`: turnos com ferramenta indisponível para o cenário.
- `diagnosisQueueShifts`: turnos sem alocação enquanto o diagnóstico ainda estava pendente.

Esses últimos três contadores **podem coexistir no mesmo turno**. Somá-los produziria falsa indisponibilidade dupla ou tripla. A indisponibilidade calculada pelo painel é `tick atual − tick de abertura` (ou `elapsedHours` após conclusão).

## Indicadores expostos no menu Planejamento

A visualização apresenta duração da OS, espera explicativa por recursos, retrabalho registrado, valor desembolsado em compras, pedidos ativos e comparação de compra normal/urgente para materiais de missões que **já concluíram o diagnóstico**.

A comparação usa o mesmo modelo de preços e ETA do motor, mas **não executa a compra** e não adianta o recebimento de peças. O jogador continua usando o Almoxarifado e decidindo sozinho.

O custo de oportunidade utiliza uma tarifa sintética por prioridade. Não representa perdas de produção, custo horário de equipamento, OEE, MTTR, disponibilidade física real ou estimativa econômica da operação. É mantido separado do saldo de caixa. Da mesma forma, `indicativeInventoryValue` representa unidades em estoque ao preço unitário fictício, não valor contábil.

A demanda visível de peças é calculada somente a partir de OS já diagnosticadas (`stage ≥ 6`) e desconta saldo disponível e pedidos em trânsito. Isso impede que a tela revele qual peça trocar antes de investigar o sintoma. Compra sem demanda diagnosticada **não é necessariamente compra errada**: pode ser aquisição estratégica de estoque.

## Retrocompatibilidade e testes

Saves antigos não possuem `purchaseHistory` nem os novos contadores; o módulo consulta tudo com valores padrão zero. Quando o jogador faz a primeira compra, o histórico é criado sem destruir o progresso anterior. Nenhuma migração obrigatória do formato geral do save foi imposta.

O teste `scripts/test-pcm-decision-impact-v8.cjs` cobre cálculos de urgência, custo, disponibilidade no fim do turno, material diferente do exigido, exposição acumulada, rework, persistência e não mutação durante análises. Os workflows Phaser e Pages também repetem as regressões anteriores.

## Limitações e próximo ciclo

Pendente homologação visual no desktop e celular, balanceamento de tarifas de oportunidade, avaliação de partidas longas e eventual painel histórico de compras por decisão. Não confundir a probabilidade logística artificial do jogo com o lead time real de uma PR/PO ou contrato de mineração.
