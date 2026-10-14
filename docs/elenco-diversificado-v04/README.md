# P.O.R.C.A.R.I.A. — Elenco diversificado v0.4

Branch de trabalho para integrar os novos personagens à migração Phaser 3, sem alterar o jogo HTML/JS em produção.

## Primeira leva produzida (pacote local)

- 8 personagens fictícios: 3 mecânicos, 2 eletricistas, 2 PCM/Engenharia, 1 brigadista.
- 8 poses por personagem: idle, walk_1 a walk_4, inspect, work, point.
- 64 quadros PNG RGBA, 8 spritesheets (4 colunas x 2 linhas), 260 x 300 por quadro.
- Uniformes conforme fotografias de referência da manutenção de mina; aparência física variada, sem representar nominalmente colegas.
- Galeria Phaser experimental e visualizador offline no pacote ZIP disponibilizado na conversa.
- Testes de dimensões, transparência, índices e equivalência dos quadros passaram.

## Pendência de publicação

**Os PNGs binários e o gerador Python ainda não estão anexados a esta branch.** O pacote completo está disponível como ZIP na conversa ChatGPT; esta branch contém o catálogo de integração e o ponto de entrada técnico. Não realizar merge até subir os binários, executar a galeria e revisar qualidade artística.

## Próximos passos

1. Subir 8 spritesheets PNG para `assets/workers/<id>/spritesheet.png`.
2. Copiar `galeria.js` e `index.html` do pacote para `experimentos/phaser-elenco-v04/` e ajustar os caminhos relativos.
3. Validar Phaser em desktop e celular.
4. Refinar animação lateral/diagonal e alinhar estilo visual com o Pedro original.
5. Só então abrir PR para integração com a oficina.
