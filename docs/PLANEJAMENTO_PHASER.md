# P.O.R.C.A.R.I.A. — Sprint Phaser 01: Indução do Pedro

## Objetivo
Migrar de forma incremental a interface da oficina para Phaser sem afetar a campanha, saves nem o motor HTML/JS em produção.

## Regra de direção de cena
Pedro (brigadista vermelho) inicia neutro; apresenta-se como responsável pela indução. Após a frase "Nós somos um setor profissional em apagar incêndios...", a pose muda **somente** no cue `ajeita_extintor`. Surge "*ajeita o extintor*" e, após uma pausa, a fala "operacionais, é claro." O personagem permanece junto ao extintor durante a punchline.

## Checklist
- [x] Inspecionar sprite original do brigadista.
- [x] Recortar 8 poses PNG transparentes no pacote local.
- [x] Roteirizar intro e 6 lições em JSON.
- [x] Implementar cena isolada em Phaser 3 no pacote local.
- [x] Rodar teste automatizado de ordem, pose e fala; duração 11,5 s.
- [x] Criar branch `feature/phaser-tutorial-brigadista`.
- [ ] Subir código completo do protótipo e os PNGs para esta branch.
- [ ] Validar o Phaser real no navegador e em celular.
- [ ] Validar instalação/offline com Phaser distribuído localmente.
- [ ] Integrar a abertura à versão principal após avaliação de jogo.

## Preparação de recursos/branches posteriores
- `feature/phaser-oficina-mapa`: boxes, mapa, movimentação.
- `feature/phaser-mecanicos-animacoes`: idle, caminhada, diagnóstico, execução.
- `feature/phaser-ativos-maquinas`: 777, 395, 6030 Backhoe, Front Shovel, DR410i, DI650i.
- `feature/phaser-gestao-interface`: OS, fila, equipe, estoque, indicadores.
- `feature/phaser-integracao-motor`: integração com engine e migração de save.

## Cuidados
Não copiar informações identificáveis da frota; não publicar material confidencial. O asset já gerado do brigadista serve de base de arte. Os testes da timeline passaram em simulador; renderização Phaser e PWA em dispositivo estão pendentes.