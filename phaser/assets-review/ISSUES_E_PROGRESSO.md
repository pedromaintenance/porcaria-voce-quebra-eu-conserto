# P.O.R.C.A.R.I.A. — execução da avaliação dos 115 assets

Avaliação recebida de 14/10/2026: **41 OK, 74 Não OK**, 9 sem comentário. Cada um dos 74 reprovados está registrado no `catalogo.json` com sua issue de tratamento, e a exportação original está preservada em `revisao_usuario_2026-10-14.json`.

## Quadro de execução
| Issue | Escopo | Estado |
|---|---|---|
| [#3](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/3) | CAT 395 — transparência | Concluída tecnicamente; aguarda aprovação visual |
| [#4](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/4) | 6030 histórico — caçamba | Pendente: redesenho |
| [#5](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/5) | CAT 777 — cabine/frente e roda | Pendente: redesenho |
| [#6](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/6) | Escavadeira inicial — cilindro | Pendente: desenho mecânico |
| [#7](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/7) | Escavadeira isométrica histórica | Pendente: detalhamento |
| [#8](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/8) | Ana — 8 poses + spritesheet | Pendente: reconstrução |
| [#9](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/9) | Bia — 8 poses + spritesheet | Pendente: reconstrução |
| [#10](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/10) | Clara — 8 poses + spritesheet | Pendente: reconstrução |
| [#11](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/11) | Lia — 8 poses + spritesheet | Pendente: reconstrução |
| [#12](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/12) | Nina — 8 poses + spritesheet | Pendente: reconstrução |
| [#13](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/13) | Davi — 3 poses + spritesheet | Pendente: correções locais |
| [#14](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/14) | João — 3 poses + spritesheet | Pendente: correções locais |
| [#15](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/15) | Rafael — 1 pose + spritesheet | Pendente: correção local |
| [#16](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/16) | Duplicados e perfuratriz descartada | Concluída: arquivamento lógico |
| [#17](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/17) | Estudos conceituais reprovados | Concluída: arquivamento lógico |
| [#18](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/18) | Mocks UI antigos | Concluída: arquivamento lógico |
| [#19](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/19) | 16 PNGs faltantes no GitHub | Pendente: upload e hashes |

## Critério de qualidade
- Não interpretar `NAO_OK` como erro na validação JSON ou PNG; **artes aprovadas tecnicamente podem permanecer rejeitadas visualmente**.
- Os 14 itens `archived` não aparecem na lista ativa; os binários históricos não são apagados.
- #3: fundo da CAT395 corrigido e hash de PNG publicado verificado; `ready-for-review` não implica nova aprovação do usuário.
- 99 PNGs estão publicados; restam 16 pranchas conceituais (#19).
- 5 personagens com falhas generalizadas devem ser reconstruídas **individualmente e aprovadas antes do spritesheet**.
- Davi, João e Rafael: preservar poses já aprovadas, corrigir apenas as reprovadas e remontar folhas.
- A `main` permanece intacta.

Branch: `fix/assets-review-20261014`. PR de acompanhamento: https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/20.
