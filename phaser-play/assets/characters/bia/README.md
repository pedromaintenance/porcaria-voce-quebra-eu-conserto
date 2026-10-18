# Bia — biblioteca visual de capacitação (v0.8.15)

**Status:** sprites aprovados como acervo de desenvolvimento, ainda **não integrados à equipe, ao motor nem ao menu principal**. Personagem de apoio ao futuro sistema de treinamentos, avaliações e feedback. Os assets vieram de quatro cartelas PNG enviadas pelo jogador, sem criação de nova arte.

## Coleções e poses

| Atlas | Quadro 0 | Quadro 1 | Quadro 2 | Quadro 3 |
|---|---|---|---|---|
| `bia-feedback-4poses.webp` | prancheta/análise | aprovação sorrindo | revisão na prancheta | aprovação |
| `bia-inspection-4poses.webp` | anotações em pé | aprovação | inspeção ajoelhada | feedback ajoelhada |
| `bia-field-4poses.webp` | registro de campo | registro alternativo | caminhada com prancheta | contato por rádio |
| `bia-coaching-4poses.webp` | apontar/instruir | deslocar-se para tarefa | verificar agachada | inspeção ajoelhada |

**Padrão de exportação:** PNG original 1254×1254, grade 2×2 de quadrantes 627×627; novo atlas 1160×1244 com grade 2×2, cada frame 580×622. Escala uniforme entre as 16 poses, centralização horizontal, pés em Y = 610 dentro de cada quadro (margem inferior 12 px). A transparência foi preservada. Fragmentos isolados provenientes de quadrantes vizinhos foram removidos antes do empacotamento; nenhuma pose foi redesenhada. WebP com compressão de qualidade 91.

**Mapeamento:** quadro 0 = superior esquerdo, 1 = superior direito, 2 = inferior esquerdo, 3 = inferior direito. IDs estáveis no `manifest.json`. Algumas poses são visualmente semelhantes, mas são preservadas como alternativas, não tratadas como novas animações inventadas.

- [Abrir a galeria de inspeção](index.html)
- [Manifesto de pose e SHA-256](manifest.json)
- [Projeto de treinamento por disciplina e modelo](../../../TRAINING_DESIGN.md)

## Uso futuro no Phaser

```js
// Exemplo de integração FUTURA, não carregado no jogo atual:
this.load.spritesheet('bia_coaching', './assets/characters/bia/bia-coaching-4poses.webp', {
  frameWidth: 580, frameHeight: 622
});
const bia = this.add.sprite(x, y, 'bia_coaching', 0).setOrigin(0.5, 1);
bia.setFrame(2); // ajoelhada durante demonstração
```

Não adicionar Bia em `engine.create().team`, no objeto `WORKER_SHEETS` ou na contratação até haver decisão expressa. Bia é facilitadora visual; Geovane é o Instrutor entre os profissionais iniciais e sua eventual atuação pedagógica consumirá HH/turno.

**QA pendente:** conferir nitidez em escala de menu, alpha nas bordas do capacete/cabelos, consistência dos pés/andadas, quatro quadros sem vazamentos e uso em celular. `scripts/test-bia-training-assets.cjs` valida os quatro arquivos, frames, hashes, documentação e não regressão na equipe.
