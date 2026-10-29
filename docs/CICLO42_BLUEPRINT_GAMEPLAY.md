# Ciclo 42 — Linguagem visual de minigames: blueprint interativo

## Direção
- A oficina, personagens e equipamentos seguem em pixel art.
- Operações de desmontagem, instalação, inspeção e aperto usam **pranchas azuis procedurais**, como uma interface de trabalho mecânico dentro do jogo.
- O jogador recebe objetivos de jogo ("solte os fixadores", "retire a peça", "reinstale a bucha") e **nunca** identificadores ou referências de fontes técnicas.
- A mecânica é encadeada por dependências de peças, não por perguntas de múltipla escolha sobre documentação.

## Visual
- Fundo azul com grade vetorial maior/menor e marcações de plano.
- Componentes vetoriais 2D criados no motor do jogo, contorno técnico ciano e hachuras leves.
- Amarelo indica a interação liberada; semiarcos/contornos tracejados indicam o espaço deixado por componentes retirados.
- Os desenhos são autorais, estilizados e **sem escala**; nada de marcas de OEM, torques inventados ou peças copiadas de manuais.
- Controles desktop (mouse/teclado) e mobile (toque, hit area ampla). Evitar zoom involuntário ao rolar.

## Regra operacional de gameplay
1. Selecionar visualmente fixadores acessíveis.
2. Soltar cada fixador e armazená-lo na bancada do jogador.
3. Remover somente peças com dependências resolvidas.
4. Inspecionar/substituir a peça defeituosa como objeto.
5. Remontar em ordem coerente, reinstalando componentes e fixadores.
6. Acionar minigames específicos (impacto/precisão) em etapas especiais, nunca como substitutos da árvore de montagem.
7. Pontuação de jogo e bônus de turno são separados da conformidade técnica real.

## Arquivos
- `phaser-play/assembly-workbench.html`: protótipo isolado de bancada com grade blueprint gerada em SVG, zonas clicáveis, contornos e inventário.
- `phaser-play/assembly-sequence.js`: engine de dependências, desmontagem, inventário e remontagem.
- `phaser-play/repair-minigames.js`: fundo procedural em Phaser para minigames de pino e parafuso, sem depender de imagens raster.
- `scripts/test-assembly-sequence-v42.cjs`, `scripts/test-bolt-v41.cjs`: testes de sequência e identidade visual.

## Critérios de aceite
- Um jogador entende qual parte é clicável pela linguagem de cor, sem ler manual.
- Proteção e peças ocultam a zona de acesso até serem retiradas.
- Peças removidas permanecem no inventário; a reinstalação é obrigatória para completar o serviço.
- Sem números de literatura ou marcas externas na interface.
- O motor de montagem preserva todos os saves da campanha; é isolado até receber integração explícita.
- A apresentação em celular não deve exigir zoom ou pinch para acertar fixadores.
- CI sintático/regressões e, posteriormente, validação visual no navegador e aprovação do produtor.

**Estado:** primeira implementação visual integrada à branch de desenvolvimento; não publicada na campanha.

## Ciclo 42.1 — Interação de pressionar e segurar (29/10/2026)
- Qualquer ação de fixador, retirada/instalação de peça ou inspeção na **bancada isolada** inicia somente com `pointerdown` (mouse/toque) ou `keydown` (Espaço/Enter) e exige **2.000 ms contínuos**.
- Enquanto mantém a entrada: parafusos giram até 720° com deslocamento discreto; peças movem-se até 30 px no blueprint. A barra visual informa o percentual do gesto.
- `pointerup`/`keyup` antes de 2 s faz o desenho e a barra **retrocederem ao zero** em 350 ms. Progresso parcial nunca é armazenado e o jogador deve reiniciar do zero.
- `pointercancel`, mover o cursor/dedo para longe, `blur`, troca de aba ou `visibilitychange`: cancelam sem executar a ação.
- Ao atingir 2 s contínuos, somente uma aplicação é registrada no motor de peças, que conserva todos os bloqueios de precedência.
- Componente: `phaser-play/assembly-hold.js` (máquina de estados independente), integrado em `assembly-workbench.html`.
- Cobertura de teste em `scripts/test-assembly-hold-v42.cjs`, incluída no CI.
- **Pages experimental publicado** na rota `/phaser-play/playtest-v42/` por cópia seletiva dos arquivos de teste; campanha principal não alterada. Desafios independentes de pino/parafuso mantêm a mecânica original.

### Gate de integração
- Confirmar pela experiência real no desktop e no celular se a animação de recuo é perceptível, se a área de retenção é suficiente e se os gestos não atrapalham rolagem da página.
