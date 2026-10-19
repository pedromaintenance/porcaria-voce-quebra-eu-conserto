# DI650i — atualização visual v0.8.28

**Equipamento:** Sandvik DI650i (modelo `EQ06`; chave Phaser `drill`).

**Arte de origem:** `Perfuratriz Industrial Pixel Art (1)(1).png`, fornecida pelo usuário em 18/10/2026. Não foi gerada outra imagem; houve somente conversão sem perdas para reduzir tráfego e preservar alfa.

**Asset publicado:** `sandvik_di650i_v0828.webp`

| Propriedade | Valor |
| --- | --- |
| Dimensões | 1536 × 1024 px |
| Transparência | Alfa RGBA |
| Compressão | WebP VP8L lossless |
| Peso | 984.300 bytes |
| SHA-256 | `371ba7f11dca88fcb29e29fc876747c5231f1c14614512c36240b8b9a908f36d` |
| Pixel equivalence | Idêntico ao PNG de entrada, inclusive canal alfa (Pillow ImageChops: nenhum pixel diferente) |
| Bounding box alfa | (0, 21, 1520, 1024) |

## Integração

- O arquivo substitui somente o `ASSETS.drill` antes apontado para `sandvik_dr410i.png`, que era emprestado da DR410i.
- `MACHINES.EQ06='drill'` permanece; `MACHINES.EQ05='dr410i'` continua com seu asset próprio `sandvik_dr410i_v2.webp`.
- O jogo usa `trimmedEquipment`, limites de modelo, geometria e âncora inferior originais; nenhuma mudança em dimensões de box, sombra, hitbox, zoom, OS, motor ou save.
- Asset incluído no cache do service worker `v107` e testado pelo `scripts/test-di650i-asset.cjs`.
- Compatibilidade do WebP lossless com o navegador e aparência em dia/noite requerem homologação visual.

## Testes visuais pendentes

- [ ] DI650i correta no Box 1, Box 2 e Box 3.
- [ ] Nenhum corte na mangueira, lança e esteiras.
- [ ] Frente e traseira dentro do box, com pé/esteira apoiados no piso.
- [ ] Comparar com DR410i para garantir dois modelos visualmente distintos.
- [ ] Carregamento após atualização do PWA e em tela de alta densidade.
