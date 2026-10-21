# Nemuel — Inspetor titular da manutenção

**Situação:** integrante do time principal desde o início de novas campanhas; incorporado por migração idempotente às partidas anteriores.

## Identidade e função

- **Nome na interface:** Nemuel
- **Especialidade:** Inspetor
- **Papel interno:** `inspecao`
- **Sprite:** `phaser-play/assets/characters/nemuel-inspetor-4poses.webp`
- **Arte:** derivada da cartela enviada nesta conversa, em uma grade 2 × 2 com quatro poses: medição, confirmação, rádio e inspeção dimensional.
- **Dimensão do atlas:** 1160 × 1244 pixels; quatro quadros de 580 × 622, com fundo transparente e enquadramento individual das poses.
- **Disponibilidade:** time inicial, selecionável para inspeções por TAG, dentro das regras de HH e alocação existentes; não requer contratação no Almoxarifado.

## Matriz de proficiência

| Grupo | Regra |
|---|---|
| Disciplinas (22) | **70** em todas |
| Sistemas (25) | **70** em todos |
| Máquinas Caterpillar | **70** em todos |
| Sandvik DR410i (`EQ05`) | **50** |
| Sandvik DI650i (`EQ06`) | **50** |

A pontuação geral legada `skill` é 70. A matriz `competencies` é usada pelo motor para cálculo de proficiência por cenário; os valores de Sandvik são específicos às duas máquinas, sem reduzir as demais disciplinas/sistemas.

## Compatibilidade de saves

Novas campanhas iniciam com cinco titulares: Pedro, Geovane, Junior, Acassio e Nemuel.

Ao abrir um save `1.1.0` criado antes da inclusão, `normalizeRoster` adiciona **apenas Nemuel** se ele estiver ausente, utiliza o próximo ID `M#` livre e preserva integralmente a lista original, os identificadores, características e OS existentes. Uma segunda normalização não duplica o inspetor.

O sprite é carregado pelo Phaser a partir de `WORKER_SHEETS` e está incluído no cache offline do PWA. As dez contratações nomeadas anteriores continuam disponíveis, sem alterar sua posição ou exclusividade.

## Verificações

`scripts/test-nemuel-inspector.cjs` assegura grade de quatro poses, RGBA, valores 70/50, função, presença na equipe, agendamento de inspeção, migração sem perda de OS e inclusão no PWA. Regressões anteriores de recrutamento, supervisor e habilidades foram adaptadas ao novo elenco.

A validação automática não substitui conferir o enquadramento de cada pose no navegador.
