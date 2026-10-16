# Asset oficial — Oficina noturna sob chuva

**Status:** ORIGEM PRESERVADA (biblioteca do projeto), **ainda não versionada como arquivo binário em `main`**. Este manifesto é deliberadamente explícito: não afirmar publicação do asset quando só existem os metadados.

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

## Integração esperada (dependência de binário)

1. Copiar o derivativo AVIF preservado para `phaser-play/assets/oficina-noturna-hq.avif` na branch `main` **sem recompressão**.
2. Conferir SHA-256 com o manifesto antes de publicar.
3. Registrar o arquivo no preload Phaser e escolher fundo conforme `state.shift`: `0 → DIA (asset atual)`, `1 → NOITE (asset noturno)`. Mudança de fundo não pode alterar posições `scene-map.json`.
4. Manter opção `VISUAL` para substituir o fundo manualmente; escolha personalizada tem prioridade sobre o cenário automático.
5. Até a integração binária, a interface deve indicar **fundo noturno pendente**, sem fingir que exibe a imagem fornecida. É possível usar o botão VISUAL para carregar o PNG noturno localmente.
6. Acrescentar um teste verificando `test -f phaser-play/assets/oficina-noturna-hq.avif` e SHA-256 para promover o item a CONCLUÍDO.

**Não deletar as cópias privadas até a confirmação da publicação binária no repositório e validação visual do usuário.**
