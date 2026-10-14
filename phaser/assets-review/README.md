# P.O.R.C.A.R.I.A. — galeria de aprovação dos assets (v1.1)

> **Branch de trabalho:** `fix/assets-review-20261014` | **PR:** [#20](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/20) | **Não mesclar na `main` até a validação.**

## Abrir a galeria

**[Baixar `avaliar-v11.html` — revisão visual dos 115 assets](./avaliar-v11.html)**

Na página do arquivo no GitHub, use **Download raw file** e abra o HTML baixado em Chrome/Edge/Firefox. O navegador do GitHub exibe o código, não executa a galeria como aplicativo.

O HTML é **autossuficiente para avaliação visual**, com 115 imagens de prévia embutidas e sem depender de conexão para renderizar os itens. Prévia embutida NÃO substitui um PNG original em resolução completa.

### Como revisar

1. Use os filtros por categoria, decisão, condição de trabalho ou busca para localizar os assets.
2. Clique na imagem para ampliar. A CAT 395 teve a transparência corrigida e está sinalizada para **reavaliação**, sem aprovação presumida.
3. Marque **OK** ou **Não OK**. Ao marcar Não OK, preencha o comentário explicando a alteração pretendida.
4. Use **Exportar avaliação** para gerar o JSON completo; **Issues em JSON** exporta a seleção reprovada com referências das issues existentes.
5. Pode importar um JSON anterior para continuar em outro dispositivo; o navegador tenta salvar alterações no armazenamento local. **Exporte um backup antes de apagar cache ou trocar de navegador.**

A avaliação original de 14/10/2026 está incorporada ao revisor e preservada separadamente no arquivo [`revisao_usuario_2026-10-14.json`](./revisao_usuario_2026-10-14.json). Alterações da v1.1 aparecem como novas decisões sem sobrescrever a avaliação original arquivada.

## Inventário real verificado

| Estado | Quantidade | Observação |
|---|---:|---|
| Itens catalogados e avaliados | 115 | 41 OK, 74 Não OK |
| Comentários ausentes entre reprovações | 9 | Alguns itens foram arquivados por instrução de ignorar |
| Arquivos PNG originais publicados | 99 | Disponíveis em `assets/` |
| PNGs originais ainda pendentes | 16 | Todas são pranchas conceituais, issue [#19](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/19) |
| Imagens visualizáveis no HTML v1.1 | 115 | Incluem prévias locais dos 16 originais pendentes |
| Itens arquivados logicamente | 14 | Não integrar ao Phaser, mas preservar para histórico |
| Candidatos no manifesto `ativos.json` | 101 | Apenas `workflow_state: approved` está liberado visualmente |

**Atenção:** `README.md` antigo e campos históricos de `catalogo.json` podem descrever fases anteriores. Para decisões atuais consulte `workflow_state`, `user_decision`, `user_comment` e o JSON original.

## Pastas e arquivos importantes

- `avaliar-v11.html` — revisor offline mais recente, com os comentários originais e exportação de nova análise.
- `revisao_usuario_2026-10-14.json` — revisão original, auditável e imutável.
- `catalogo.json` — 115 entradas, origens, decisions, estados e issues.
- `ativos.json` — seleção de trabalho para integração futura no Phaser; **não** considerar todos os 101 como aprovados.
- `assets/equipamentos/`, `assets/personagens/`, `assets/conceituais/`, `assets/interface/` — caminhos originais catalogados.
- `ESTADO_POS_AVALIACAO.md` e `ISSUES_E_PROGRESSO.md` — sínteses de governança.

## Encaminhamento para Phaser

O jogo clássico permanece em `main` (`engine.js` / `app.js`). A fase seguinte é a primeira oficina Phaser com três boxes, fila de ocorrências, máquinas e mecânicos visíveis. Reutilizar o motor existente, controlar os assets por manifesto e impedir inclusão de itens rejeitados/arquivados. Nenhum spritesheet das personagens deve ser considerado automaticamente animação funcional.

### Critérios pendentes

- [x] Revisar as 115 decisões e preservar os comentários anteriores.
- [x] Publicar revisor visual HTML v1.1 e prévias embutidas.
- [x] Corrigir tecnicamente a transparência da CAT 395 e sinalizar reavaliação.
- [ ] Concluir envio dos 16 PNGs **originais** e verificar SHA-256 (#19).
- [ ] Corrigir/redesenhar os assets priorizados nas issues #4–#15.
- [ ] Validar visualmente os resultados corrigidos usando o HTML.
- [ ] Fazer teste funcional de ponta a ponta da v1.1 em navegador real e registrar evidências.
- [ ] Criar primeira cena Phaser interligada ao `engine.js` sem afetar `main`.

## Privacidade

Não incluir fotos reais de colegas, documentação corporativa ou dados sensíveis da mina neste repositório público.
