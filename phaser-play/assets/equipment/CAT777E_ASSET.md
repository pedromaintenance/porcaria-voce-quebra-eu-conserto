# CAT 777E — asset principal v2 (pixel art sem logos)

## Entrega Phaser 0.8.3

**Status:** sprite otimizado publicado na branch de desenvolvimento; a publicação no Pages depende do merge e CI. Arte final sujeita à revisão visual dentro do jogo.

### Motivação e direção visual

- Imagem fornecida pelo usuário, refeita a partir de fotografia da frente **3/4** de um caminhão 777E, com a caçamba menos inclinada em relação ao desenho anterior.
- **Nenhuma logo CAT/Caterpillar visível** na arte final, conforme solicitação.
- **Fundo transparente**; manter os elementos da máquina íntegros (caçamba, grade frontal, cabine, rodas, corrimãos, escadas e estruturas).
- Não confundir identidade visual ilustrativa com especificação geométrica oficial da Caterpillar.

### Materiais preservados e publicação

| Arquivo | Origem/status | Dimensões | Formato | Tamanho | SHA-256 |
|---|---|---|---|---|---|
| `caminhão_de_mineração_em_pixel_art.png` | Arquivo original final, preservado na Biblioteca `/PORCARIA/Assets/Equipamentos/CAT777E_sem_logos_original.png` | 1488×1057 px | RGBA/PNG | 1.835.427 B | `1269bd7498dce4dfe71653d41e213d5d44e5672bf4e538cccf07f67d9718f967` |
| `cat777e_v2.webp` | **Sprite efetivamente carregado pelo Phaser**, `phaser-play/assets/equipment/cat777e_v2.webp`; derivado do PNG anterior via Lanczos, WebP qualidade 98 | 1100×781 px | WebP VP8X com alpha | 339.086 B | `c0c304a84f7dad6e26e046877470d609c74148717ea355a2cd0beae0d33be7fd` |
| `cat777e.png` | Asset anterior, mantido como backup no repositório `phaser-play/assets/equipment/cat777e.png` | Legado | PNG | Legado | não alterado |

**Biblioteca permanente do projeto:** `/PORCARIA/Assets/Equipamentos/CAT777E_sem_logos_original.png` e `/PORCARIA/Assets/Equipamentos/CAT777E_pixel_art_optimized.webp`. Esses caminhos são privados da Biblioteca, não URLs públicas do Pages.

### Integração no jogo

- Modelo lógico do caminhão: `EQ01`; chave de textura: `truck` em `phaser-play/game.js`.
- Nova referência de textura: `./assets/equipment/cat777e_v2.webp`. Arquivo legada `cat777e.png` não é mais carregado pela chave `truck`.
- Apresentação em `scene-map.json`: `scaleMultiplier=1.10`, `maximumWidth=265`, `maximumHeight=225`, `footprintAnchorX=0.54`.
- Renderização: **LINEAR somente para o 777E**; outros equipamentos permanecem NEAREST. A arte fonte tem muitos detalhes, e a minificação de 1100px para cerca de 200px introduziria aliasing com amostragem nearest.
- Localização vertical: `origin(0.5,1)` com a borda inferior no `groundY` do box ativo; larguras e posição horizontal são limitadas por `placementWorld` no cenário completo.
- **Não alterar** o panorama, áreas de clique, HUDs, posição dos mecânicos, OS existentes, engine nem a lógica de turnos para receber o sprite novo.

### Critérios de validação

- [x] Original e otimizado preservados; original RGBA, otimizado VP8X+alpha.
- [x] Sprite novo versionado e antigo preservado para rollback.
- [x] Asset verificado por hash SHA-256, dimensões e bit de transparência no CI.
- [x] Escala e posição calculadas e verificadas contra os três envelopes dos boxes completos em teste automatizado.
- [ ] Conferência visual no Pages, turno A e B, com ao menos um 777E em cada box: **ângulo 3/4, tamanho coerente, rodas apoiadas e cabina/caçamba nítidas**.
- [ ] Confirmar que o sprite e os mecânicos não se sobrepõem indevidamente com a configuração atual de boxes.
- [ ] Homologação artística final pelo usuário.

### Rollback

Para reverter apenas o caminhão, trocar `ASSETS.truck` novamente para `./assets/equipment/cat777e.png`, redefinir os valores anteriores do modelo `EQ01` (`scaleMultiplier=1`, `footprintAnchorX=0.52`) e preservar os arquivos e o histórico.
