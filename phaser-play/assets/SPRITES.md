# Catálogo de sprites — Oficina Phaser (v0.7.2)

Este diretório contém assets **versionados na branch `main`**, independentes da branch de revisão artística. Nenhum desses PNGs deve ser buscado de outro branch durante o carregamento normal.

## Equipamentos (`equipment/`)

| Arquivo | Utilização atual | Origem na revisão | Observação |
|---|---|---|---|
| `cat777e.png` | CAT 777E (`EQ01`) | `equipamentos/historico/caminhao_pixel_art_original.png` | Sprite ainda sujeito à homologação visual |
| `cat6030.png` | CAT 6030 (`EQ02`) | `equipamentos/cat6030_frontshovel_estudo.png` | Estudo front-shovel |
| `cat395.png` | CAT 395 e 336GC (`EQ03`, `EQ04`) | `equipamentos/cat395.png` | 336GC compartilha arte provisória |
| `sandvik_dr410i.png` | DR410i e DI650i (`EQ05`, `EQ06`) | `equipamentos/sandvik_dr410i_torre_erguida.png` | DI650i compartilha arte provisória |

**Pendências de frota:** CAT D9 (`EQ07`) utiliza trator de esteiras vetorial provisório; CAT 966 e CAT 16 também aguardam sprites específicos. O objetivo é substituir esses fallbacks por imagens consistentes com as demais máquinas.

## Personagens (`characters/`)

Existem dois personagens de oficina: `mec_lia` e `mec_rafael`. Cada pasta contém:

- `idle.png`: posição de espera.
- `inspect.png`: inspeção visual.
- `point.png`: apontamento técnico.
- `clipboard.png`: prancheta/registro.

**São poses completas, não quadros de caminhada.** O Phaser intercala essas poses com timer de 560 ms apenas para os mecânicos alocados em boxes; máquinas permanecem rigorosamente estáticas. Bloqueios por peças ou ferramentas deixam os trabalhadores em `idle`. O sistema `prefers-reduced-motion` é respeitado.

Os PNGs foram trazidos **sem edição binária** da revisão artística na branch `fix/assets-review-20261014`. Proveniência e status de aprovação devem ser preservados no catálogo de revisão existente. O fato de o PNG estar no jogo não significa que sua arte está aprovada como final.

## Coordenadas e manutenção

- `../scene-map.json`: `spriteWorld`, `workerWorld`, `groundY`, `hitWorld`, `progressWorld`.
- `../game.js`: tabela `ASSETS`, mapeamento `MACHINES` e sequência de poses por situação.
- **Não usar tweens de posição nas máquinas.** Em caso de movimento novo, garantir alteração apenas no sprite do mecânico.
- Alterar sprites ou posições exige rodar `node scripts/smoke-phaser.cjs` e conferir a composição visual em Desktop e mobile.

**Nota de fidelidade:** a engine atualmente aloca um mecânico por OS; a cena exibe dois mecânicos decorativos por box ocupado. O segundo não deve ser contabilizado como mão de obra executante até que exista suporte para equipes por OS no motor.
