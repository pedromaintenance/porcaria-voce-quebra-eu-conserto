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

## Correção da pose apontando no menu (20/10/2026)

O arquivo original `bia-coaching-4poses.webp` foi preservado intacto, porém o quadro 0 (apontar) contém a ponta do dedo truncada na própria imagem, conforme captura do jogo. **Não é um recorte de CSS.** No menu de Capacitação, essa pose foi substituída visualmente pelo quadro 0 (prancheta/análise) de `bia-feedback-4poses.webp`. A animação usa, portanto, `feedback[0] → coaching[2] → coaching[3]`, a cada 3 segundos. O quadro `coaching[1]` (caminhada) continua excluído. Com movimento reduzido, exibe a pose completa de prancheta. A galeria de assets mantém as 16 poses originais para documentação.

## Correção do capacete cortado na aba Ofertas (20/10/2026)

O original `bia-field-4poses.webp` permanece **intacto**. Os quadros inferiores 2 e 3 da cartela original vieram com o topo do capacete truncado pelo enquadramento do PNG fonte, apesar de possuírem margem transparente no frame exportado. A sequência de Ofertas contém o quadro 3 (Bia usando o celular) e não deve exibir a borda horizontal cortada.

Geramos `bia-field-repaired-4poses.webp` com `python scripts/repair-bia-field-atlas.py`, recuperando exclusivamente a área superior dos capacetes com pixels dos quadros originais 0 e 1, alinhados a partir dos contornos existentes. **Nenhuma nova arte foi gerada**. Quadros 0/1 iguais ao original em RGBA; 2/3 têm apenas o capacete reconstruído, com suavização de borda; ordem 2×2, 580×622 px por frame, canal alfa e animação de 3 segundos preservados. O novo arquivo é um WebP **lossless** de 1160×1244 px para evitar nova degradação.

SHA-256: `0df565e155bea199facfd3c6a0032c2afba59ad9d057c282cff877c538` (786602 bytes). A aba **Ofertas** usa a cópia corrigida, enquanto a versão original é backup. A caminhada field[2] continua excluída do ciclo de animação.

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
