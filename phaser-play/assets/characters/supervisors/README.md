# Biblioteca de supervisores — Major e Duarte

**Estado:** somente cadastro de artes para expansão futura do P.O.R.C.A.R.I.A. Não altera `engine.js`, `game-data.json`, `game.js`, saves, recrutamento, HH ou regras de supervisão.

## Identidade e origem

- **Major** — primeira cartela enviada nesta conversa (`supervisor_negro_sprite_2x2_transparente(1).png`). Camisa azul, colete laranja refletivo, capacete branco, óculos e botas. Poses: braços cruzados, positivo, tablet e rádio ajoelhado.
- **Duarte** — segunda cartela enviada nesta conversa (`Supervisor de Obra em Quatro Poses(2).png`). Camisa azul, colete laranja refletivo, capacete branco e botas. Poses: anotação na prancheta, positivo, rádio e apresentação de checklist.

## Estrutura e integração futura

`major-original.png` e `duarte-original.png` preservam os bytes exatos das imagens originais. `major-4poses.webp` e `duarte-4poses.webp` são atlases independentes com canal alfa e compressão WebP **sem perdas**. A cartela possui 1160 × 1244 pixels, células de 580 × 622 (linha/coluna por índice 0,1,2,3) e base de solo alinhada com margem inferior nominal de 12 px.

A imagem de Duarte tem personagens superiores ultrapassando a divisória horizontal dos quadrantes originais. Um corte cego perderia partes dos pés ou misturaria os personagens. Por isso, as silhuetas foram identificadas por componentes conectados do canal alfa, preservando as bordas semitransparentes de cada uma e reposicionando independentemente seus limites no atlas. Foram mantidas as proporções relativas das poses com **um único fator de escala por personagem**, centralização horizontal e apoio vertical comum.

Para futura integração no Phaser, usar os metadados de `manifest.json`: `spriteSheet.file`, `spriteSheet.frames[*].pose`, grade `580×622`. Adicionar o carregamento do sprite somente quando existir interface/mecânica aprovada de supervisores; por enquanto, **não adicionar os dois a `WORKER_SHEETS`, `INITIAL_TEAM` ou `RECRUIT_POOL`**. Diferenciar presença visual de supervisor de trabalhador alocado à OS: não creditar HH automaticamente.

Galeria de prévia (GitHub Pages): [Major e Duarte](index.html). Hashes SHA-256 e dimensões estão no [manifesto](manifest.json). O roadmap registra a homologação futura.
