# Asset oficial — Oficina noturna sob chuva

**Status:** ARTE NOTURNA ORIGINAL PRESERVADA; **arquivo binário AVIF integrado à branch do jogo e preparado para publicação no Pages na versão 0.8.4**. A homologação visual no navegador permanece pendente.

## Arquivo fornecido pelo usuário

- **Nome original:** `Hangar Industrial Noturno sob a Chuva.png`
- **Descrição:** mesma oficina industrial com BOX 1, BOX 2 e BOX 3; período noturno, piso molhado, luminárias industriais quentes, mina iluminada ao fundo.
- **Dimensões:** 1976 × 796 px.
- **Formato:** PNG, RGBA.
- **Tamanho:** 3.578.590 bytes.
- **SHA-256 do original:** `fd4711611b7f83ca6f3428b5bbc59ae855cc800ab26dcd481b8c2eaf0c89ceee`
- **Proveniência:** imagem enviada pelo usuário no projeto P.O.R.C.A.R.I.A., em 16/10/2026. Não redistribuir fora do projeto sem autorização.
- **Cópia preservada na Biblioteca pessoal:** `/PORCARIA/Assets/Oficina/Hangar Industrial Noturno sob a Chuva.png` (biblioteca privada, **não** URL pública de CDN).
- **ID da cópia na biblioteca:** `libfile_50ae9f745dfc8191a99a80148d1e29e4`.

## Derivativo otimizado pronto para integração

- **Nome:** `oficina-noturna-hq.avif`.
- **Dimensões:** 1976 × 796 px (mesma geometria; ajuste de perspectiva/recorte da cena pode reutilizar o mapeamento existente).
- **Tamanho:** 160.249 bytes.
- **Qualidade AVIF:** 56 (Pillow).
- **SHA-256 do derivativo:** `0637e55b3a1978842c7aa71e27c763b176ea7c8438a82ee5bc711140e1a72c15`.
- **Cópia da biblioteca pessoal:** `/PORCARIA/Assets/Oficina/oficina-noturna-hq.avif`.
- **ID:** `libfile_d87b615cfa308191aa0398f86ebec73c`.

## Integração oficial no Phaser v0.8.4

1. **Arquivo no repositório:** `phaser-play/assets/oficina-noturna-hq.avif` — 160.249 bytes, 1976×796, SHA-256 verificado `0637e55b3a1978842c7aa71e27c763b176ea7c8438a82ee5bc711140e1a72c15`, incorporado sem recompressão.
2. **Carregamento:** `repoNightWorkshopBG` no `preload()` do Phaser com URL relativa versionada `./assets/oficina-noturna-hq.avif?v=0.8.4`.
3. **Turnos:** A (dia) usa `repoWorkshopBG` + perfil geométrico `cropped`; B (noite) usa `repoNightWorkshopBG` + `fullFrame`. Posições dos três boxes, equipamentos, mecânicos, HUDs e áreas clicáveis seguem `scene-map.json`.
4. **Menu Visual:** informa qual cenário está ativo e mantém importação local opcional para personalização. A prioridade é: fundo personalizado global → fundo noturno personalizado, somente no B → fundo noturno oficial → fallback escurecido se o navegador não suportar o AVIF.
5. **Restaurar noite oficial:** apaga apenas a preferência local do B, voltando ao asset do repositório. **Restaurar dia/noite oficiais:** limpa preferência global; não elimina a personalização noturna independente.
6. **Regressão:** `scripts/test-night-workshop.cjs` checa tamanho, SHA-256, extensão `ispe` no AVIF, preload, precedência dos fundos, mapa e textos de ajuda. `.github/workflows/deploy-pages.yml` bloqueia o deploy se o asset tiver tamanho/hash incorreto.
7. **QA visual pendente:** validar em computador e celular a alternância A→B→A, escala do galpão, letreiros BOX 1/2/3, posição de máquinas e mecânicos, nitidez, e restaurar fundos personalizados.

**Referência original:** o PNG fornecido permanece guardado na Biblioteca do projeto. O AVIF publicado é derivativo de exibição, não substitui o original editável.
