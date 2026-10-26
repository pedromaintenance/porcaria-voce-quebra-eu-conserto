# Campanha vigente — P.O.R.C.A.R.I.A.

## Contrato atual do motor
- Nova campanha: R$ 15.800, reputação 86, três boxes, equipe inicial Pedro, Geovane, Junior, Acassio, Nemuel; três OS corretivas sorteadas.
- Nove modelos virtuais (CAT 777E/6030/395/336GC/D9/966/16, Sandvik DR410i e DI650i), cada um com seis unidades simuladas.
- Dois turnos A/B por dia, 12h cada, 10,5 HH úteis por trabalhador (DDS 0,5h + refeição 1h).
- Pressão no backlog aumenta por faixas de dias. Novos casos surgem em fechamentos de dia, sujeitos a limite de carteira, elegibilidade SAP, prevenção e ativos ocupados.
- A simulação pode continuar mesmo com caixa negativo; isso produz alerta e não constitui por si só uma condição codificada de derrota.
- Na passagem para o Dia 21, `engine.advance()` define `closed=true` e apresenta aviso; **não existe vitória/derrota pontuada nem tela final de avaliação** na versão em produção.
- O modo livre continua após o Dia 21.

## Direção aprovada e ainda em desenvolvimento (Sprint 31)
Marcos opcionais, calculados do save: OS concluída, notificação originada de Inspeção tratada no PCM e preventiva executada. Serão elegíveis em qualquer ordem, sem recursos travados. Relatório do Dia 21 informativo, sem ranking arbitrário. **Não declarar implementado até que haja PR integrado.**

## O que muda por decisão
Inspeções consomem HH e geram notificações; monitoramento cria condição própria e admite reanálise/escalonamento; PCM programa e antecipa escopo; oficina consome peça/ferramenta/tempo; adiamento pode agravar falha; treinamentos indisponibilizam equipe, aumentam competência; avance de turno liquida custos e disponibilidade. Cada decisão é auditável no save conforme módulo.

## Persistência
Jogo Phaser usa chave `porcaria.phaser.prototype.v01` no localStorage. O schema de save é `1.1.0`, que **não equivale** à versão do aplicativo `0.9.x`. Exportação e importação em JSON disponíveis. Saves legados devem preservar dados sem eventos retroativos forçados.
