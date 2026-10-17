# Oficina diurna original — fundo oficial completo (Phaser 0.8.13)

**Fonte:** imagem fornecida pelo usuário nesta conversa, `Oficina Industrial ao Entardecer (2).png`, sem redesenho e sem recorte.
**Original:** PNG 1976 × 796, 3.868.658 bytes, SHA-256 `98bba3ae2ae10a150ea0365c38e4b3ce7b56369b083f047779a6dc5b96b541d9`.
**Derivado de distribuição:** `oficina-diurna-fullframe.avif`, 1976 × 796, AVIF RGB qualidade 55, 181.346 bytes.
**SHA-256 (derivado):** `31453309223d11800e78276edd2e02b641a82eb4a2ffb52982dbc766e0a003c7`.
**Blob GitHub:** `1395f2389c2e56c365e5b6e497b813388bd64233`.

## Critério de fidelidade

A conversão PNG → AVIF é exclusivamente otimização de distribuição; mantém todos os pixels na composição, tamanho, perspectiva e enquadramento. É codificação com perdas, portanto detalhes de compressão não são bit a bit iguais, mas **não há nova geração nem alterações criativas da arte**.

A versão anterior `oficina-base.avif` permanece no repositório apenas como fallback quando o arquivo novo não carregar.

## Integração

- Turno A (diurno): `repoDayWorkshopBG` → `oficina-diurna-fullframe.avif` com perfil `fullFrame`.
- Turno B (noturno): `repoNightWorkshopBG` → `oficina-noturna-hq.avif` com perfil `fullFrame`.
- Os três boxes, a hitbox de interação, os mecânicos, o solo, as sombras e o HUD passam a seguir a geometria completa já utilizada à noite.
- O arquivo gerado erroneamente na tentativa anterior **não é utilizado**.

## Validação

- `scripts/test-day-night-fullframe.cjs`: verifica hash, tamanho 1976×796, dimensões AVIF, regras de escolha de textura e perfil, PWA.
- `deploy-pages.yml`: verifica SHA-256 antes de publicar.
- **QA visual pendente:** conferir a correspondência entre fundos e equipamentos ao alternar turnos, especialmente os letreiros e os limites dos boxes.

Não redistribuir os originais fora do projeto sem a autorização do usuário.
