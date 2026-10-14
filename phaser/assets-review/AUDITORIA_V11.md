# Auditoria estática — revisor visual v1.1

Data: 14/10/2026. Branch: `fix/assets-review-20261014`.

**Escopo:** leitura direta do HTML publicado, extração da lista `assetData` embutida e cruzamento com a árvore Git do repositório. Isto **não substitui testes interativos em navegador real**.

## Validações concluídas

| Verificação | Resultado |
|---|---:|
| Entradas válidas no catálogo incorporado | 115 |
| Decisões originais preservadas: OK | 41 |
| Decisões originais preservadas: Não OK | 74 |
| Não OK sem comentário original | 9 |
| Itens arquivados | 14 |
| Arquivos PNG originais publicados no GitHub | 99 |
| Caminhos de PNG original ausentes | 16 |
| Imagens sem prévia incorporada | 0 |
| Inconsistências entre 'binaryOnline' e Git tree | 0 |

O HTML contém rotinas de persistência `localStorage`, importação de JSON v1/v2, exportação JSON integral e de issues, filtros e eventos de clique para OK/Não OK. Esses recursos foram **inspecionados estaticamente**, não validados por automação de navegador nesta etapa.

## PNGs originais pendentes (issue #19)

- `phaser/assets-review/assets/conceituais/a_detailed_pixel_art_sprite_sheet_infographic_on_a.png` — Atlas conceitual geral — v0.1 — decisão original OK
- `phaser/assets-review/assets/conceituais/a_large_clean_organized_pixel_art_sprite_sheet_i.png` — Atlas de direção de arte — catálogo v0.4 — decisão original OK
- `phaser/assets-review/assets/conceituais/a_pixel_art_sprite_sheet_displays_maintenance_and.png` — Atlas de personagens e máquinas — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/a_detailed_pixel_art_sprite_sheet_asset_atlas_illu.png` — Atlas visual de referência — decisão original OK
- `phaser/assets-review/assets/conceituais/a_detailed_pixel_art_sprite_sheet_composite_image.png` — Atlas — elenco e equipamentos — decisão original OK
- `phaser/assets-review/assets/conceituais/sprite_sheet_de_brigadista_em_pixel_art.png` — Brigadista — atlas inicial — decisão original OK
- `phaser/assets-review/assets/conceituais/a_wide_high_resolution_game_asset_style_sprite_s.png` — Catálogo visual anterior — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/a_wide_poster_like_pixel_art_sprite_sheet_and_ass.png` — Estudo da frota v0.6 — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/wide_infographic_pixel_art_concept_sheet_split_int.png` — Estudo de CAT 395 e DR410i — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/wide_high_resolution_pixel_art_sprite_sheet_poste.png` — Estudo de máquina e oficina — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/mecânico_pixelando_com_chave_inglesa.png` — Mecânico — sprite inicial — decisão original OK
- `phaser/assets-review/assets/conceituais/oficina_p.o.r.c.a.r.i.a._em_ação.png` — Oficina P.O.R.C.A.R.I.A. — mockup — decisão original OK
- `phaser/assets-review/assets/conceituais/a_wide_infographic_style_comparison_image_in_a_pi.png` — Prancha atualizada dos dois equipamentos — decisão original NAO_OK
- `phaser/assets-review/assets/conceituais/a_wide_high_resolution_sprite_sheet_style_poster.png` — Prancha de cenários e máquinas — decisão original OK
- `phaser/assets-review/assets/conceituais/a_wide_high_resolution_pixel_art_sprite_sheet_a.png` — Prancha industrial de sprites — decisão original OK
- `phaser/assets-review/assets/conceituais/supervisor_de_obra_em_pixel_art.png` — Supervisor — atlas inicial — decisão original OK

**Importante:** as miniaturas incorporadas no HTML são versões de visualização; não substituí-las pelo original, não atribuir a elas SHA-256 dos PNGs originais, nem declarar 115/115 PNGs publicados.

## Teste manual ainda necessário

1. Abrir `avaliar-v11.html` em navegador, filtrar por categoria e conferir a visualização de todos os itens.
2. Na CAT 395, clicar para ampliar, conferir transparência e registrar OK ou Não OK com observação.
3. Escolher um item Não OK, editar comentário, exportar JSON completo e confirmar integridade da alteração e das 115 entradas.
4. Reimportar o JSON num perfil limpo e comparar decisões; testar exportação de issues e restauração da linha de base.

Não mesclar a branch na `main` antes do aceite visual.
