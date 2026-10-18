# Pacote de equipamentos EQ07, EQ08 e EQ09 — v0.8.19

**Destino:** P.O.R.C.A.R.I.A. · oficina Phaser 3. Estes arquivos foram preparados a partir das três artes pixel-art apresentadas na conversa (derivadas das referências do usuário), não dos desenhos vetoriais anteriormente exibidos pelo jogo. Esta integração **não gera novas imagens**.

| Modelo | Código | Asset final | PNG de entrada | SHA-256 do WebP |
|---|---|---|---|---|
| CAT D9 (trator de esteiras) | EQ07 | `catd9-dozer-v0819.webp` | `bulldozer_amarelo_em_arte_pixel_art.png` | `ca914d9882d5b6f7f8548a17152b3170dfa0906f2dc527446785d54255dbc952` |
| CAT 966 (pá carregadeira) | EQ08 | `cat966-loader-v0819.webp` | `carregadeira_amarela_em_pixel_art.png` | `044b425baf37f4836482c5b9cd28824f30b638b0504cde40b27117116d4de700` |
| CAT 16 (motoniveladora) | EQ09 | `cat16-grader-v0819.webp` | `motoniveladora_amarela_em_pixel_art.png` | `dd520eeca708c389235fd2c4707bfd42e99dff567fd79c5d4ecc2d56bb3c35de` |

**Dimensão:** os três arquivos possuem 1448 × 1086 px, transparência (WebP RGBA), composição integral sem recorte artístico e filtro NEAREST no Phaser. O WebP usa qualidade 92 com compressão com perdas para reduzir tráfego, mantendo os detalhes em pixel-art.

### Rastreabilidade e volumes

| Modelo | PNG recebido, bytes / SHA-256 | WebP final, bytes |
|---|---|---:|
| EQ07 | 1.411.326 / `3af950a232d0eb5bc9b167682c33ceb62eefd74103f628348d3fa4f492731f98` | 273.480 |
| EQ08 | 1.333.093 / `8c048e5d3bdf188fe625af57e75fc6dd75fc78596b5e366ca10d3cb7dfe5e4aa` | 231.356 |
| EQ09 | 1.201.450 / `30ab7a2f717fca17a89644850fa4513ca91e1cd9661d290bd8782f9b4bfcc596` | 245.206 |

### Integração e limitações

- `phaser-play/game.js` mantém uma chave por modelo em `MACHINES`. A classe `WorkshopScene.machine()` seleciona a textura através do **ID do equipamento**, preservando as lógicas de OS, diagnóstico e seleção do box.
- `scene-map.json` mantém os limites de geometria existentes para EQ07/08/09: `maximumWidth=258`, `maximumHeight=230`; base no plano `spriteWorld.groundY` e contenção `placementWorld`. O método `trimmedEquipment()` remove apenas margens transparentes em tempo de execução e posiciona a imagem com origem inferior `(.5,1)`, evitando imagens flutuantes.
- O fallback vetorial histórico do D9 permanece no código e só aparece quando o asset de textura não for carregado; EQ08/09 também mantêm os fallbacks genéricos de emergência. Não são mais o cenário esperado.
- Outros modelos, inclusive CAT 777E, CAT 6030, CAT 395, Sandvik DR410i e DI650i, **não foram alterados**. Nenhuma OS/salvamento foi migrado ou regravado.
- O PWA usa novo cache `porcaria-vqec-20261018-v099`, com os três WebP no precache. A verificação de integridade está no teste `scripts/test-loader-grader-dozer-asset.cjs` e na rotina de deploy Pages.

### Critérios de homologação no jogo

1. Forçar OS de cada modelo EQ07, EQ08 e EQ09, e verificar que o sprite certo aparece no box.
2. Conferir alinhamento das rodas/esteiras com o piso, sem salto de escala, flutuação ou sombra deslocada.
3. Verificar contenção nos BOX 1, 2 e 3, inclusive caixas de diálogo de diagnóstico e rodapé de OS.
4. Alternar A (dia) → B (noite) → A e verificar mesmo enquadramento.
5. Comparar qualidade em desktop, celular e PWA instalada; revisar eventuais halos das bordas por pixel-art.
6. Garantir que não ocorreu troca inadvertida de sprites em EQ01–EQ06.

**QA visual no navegador permanece pendente** até que o usuário confira a publicação.
