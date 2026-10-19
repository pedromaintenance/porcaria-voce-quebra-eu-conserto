# Pedro — novo asset de brigadista (v0.8.29)

## Origem e transformação

Cartela enviada pelo usuário em 19/10/2026: **`Sprites do Pedro, Bombeiro de Resgate(1).png`**.
O arquivo original RGBA **1254×1254 px** está preservado no repositório como `pedro-v0829-original.png`.

O arquivo carregado pelo jogo é **`pedro-v0829-4poses.png`**, atlas RGBA PNG **1160×1244 px**, quatro quadros de **580×622 px**, sem perdas. A escolha de PNG conserva transparência e detalhes finos, sem reamostragem adicional no navegador.

| Propriedade | Original | Atlas de jogo |
|---|---|---|
| Dimensões | 1254×1254 | 1160×1244 |
| Bytes | 1.647.387 | 1.136.848 |
| SHA-256 | `cd9524e18bb2a2544595168633e1a11d9bf7abf314d24af596ec56f6c4f4fcdf` | `ba160e74d97ab8a469b26b524049f625f89ff08bf6997a6427efb79b4b637d44` |
| Formato | PNG RGBA | PNG RGBA |
| Ordem | 2×2 | 2×2 |

### Separação e enquadramento

O arquivo original não era um atlas técnico regular: as poses superiores avançavam além da divisão matemática da altura. Para não cortar botas, a separação foi feita com **x=635 e y=665** (limites de quadrantes adaptados à arte).

As quatro silhuetas foram recortadas pela transparência, redimensionadas com **escala comum de aproximadamente 0,930016** e inseridas centralizadas nas células de 580×622, alinhando a base opaca dos pés a **12 px** da borda inferior de cada quadro. Nenhuma ferramenta, capacete, mão ou bota foi removida.

Poses em ordem de índice Phaser:

1. **Em pé com chave de tubo vermelha**
2. **Braços cruzados**
3. **Em pé com furadeira**
4. **Ajoelhado usando furadeira**

As poses continuam usando os mesmos índices de animação do jogo. O asset antigo `pedro-4poses.webp` foi mantido no repositório exclusivamente para rollback, mas **não é carregado** na versão atual.

## Integração e limites

- Registro lógico do personagem permanece `pedro` em `WORKER_SHEETS`.
- Não modificar `engine.js`, `game-data.json`, `competency.js`, `training.js` nem os saves.
- Preservados os filtros de renderização LINEAR, canvas de alta densidade, quadro 580×622, envelope do personagem 66×80, pontos de apoio e ajuste do Box 2.
- Cache do PWA atualizado para **v108**, evitando que o navegador continue exibindo a arte antiga.
- Teste em `scripts/test-pedro-asset.cjs` valida PNG original, atlas, dimensões, hashes, vínculo e versão.
- Homologação visual pendente: testar o Pedro em pé/ajoelhado nos três boxes, nas cenas diurna e noturna, e a abertura do menu Equipe.
