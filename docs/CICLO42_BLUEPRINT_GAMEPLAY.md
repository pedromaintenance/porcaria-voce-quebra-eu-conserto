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

## Ciclo 42.2 — pesquisa de UX, inspeção crítica e melhorias (29/10/2026)

### Pesquisa comparada (referências públicas de interface, não documentação de engenharia)
- **Apple HIG — Buttons / Designing for Games**: controles direcionados ao toque precisam de tamanho suficiente e de estado visível de pressão. Referência geral de 44×44 pt; em interfaces de jogos, preferir contato direto com objetos.
  - https://developer.apple.com/design/human-interface-guidelines/buttons
  - https://developer.apple.com/design/human-interface-guidelines/game-controls
- **Android Accessibility — Touch target size**: referência de 48×48 dp e espaçamento entre alvos; áreas de toque podem ser maiores que a arte visível.
  - https://support.google.com/accessibility/android/answer/7101858?hl=en
- **MDN — Pointer Events, pointer capture e touch-action**: `setPointerCapture` e `lostpointercapture` para concluir/cancelar gestos com consistência, evitando que soltar fora do componente mantenha pressão fantasma. `touch-action:none` apenas nos alvos interativos, preservando o scroll ao redor.
  - https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
  - https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- **Car Mechanic Simulator 2021 (benchmark conceitual)**: destaque visual contextual do componente que pode ser retirado. Não copiar interface, texturas, ilustrações ou instruções.
  - https://store.steampowered.com/app/1190000/Car_Mechanic_Simulator_2021/

### Problemas encontrados
1. A prancha SVG original era encolhida em telas de 390 px; parafusos pequenos exigiam precisão excessiva, apesar da lista de ações ter botões maiores.
2. A única barra de progresso ficava acima do desenho, distante do componente que estava sendo pressionado.
3. Fora da área do documento/iframe, o `pointerup` poderia não chegar à janela; uma captura explícita reduz riscos de retenção indevida.
4. O elemento de texto de progresso estava anunciado a cada quadro (`aria-live`), gerando excesso de feedback para leitores de tela.

### Entregas
- Enquadramento aproximado `viewBox="145 102 610 290"` para até 620 px, mantendo o enquadramento original em desktop.
- Alvos de toque invisíveis `r=51` (unidades SVG), separados da geometria visual do fixador. Com zoom mobile, a área clicável renderizada cresce para aproximadamente 60–65 px em celulares de 390 px, dependendo das dimensões reais.
- Alvos geométricos grandes para peças, com `pointer-events` controlado, sem liberar ações fora da sequência.
- **Anel radial** junto ao componente mostra o avanço de 0–100% do hold; a barra horizontal continua como redundância.
- `setPointerCapture` ao iniciar, `lostpointercapture` para cancelar, limite de deslocamento e cancelamento por desfoque/aba.
- Respeito a `prefers-reduced-motion`: o parafuso não gira quando o usuário pede movimento reduzido; o tempo de retenção e feedback de progresso continuam.
- Botões auxiliares ampliados (56–58 px), mantendo mouse, toque, Enter e Espaço.
- Testes de máquina de estado, sintaxe e **E2E de Chrome real em desktop/touch**, com screenshot do protótipo.

### Critérios de homologação
- Segurar 600 ms + soltar -> **nenhuma alteração**, anel retorna ao zero.
- Segurar 2,1 segundos -> exatamente uma alteração.
- Arrastar além de 48 px -> cancelar sem alterar.
- Celular 390 px -> `viewBox` compacto e alvo circular >=44 px CSS (teste automatizado).
- Nenhum documento técnico aparece para o jogador; blueprint é original e lúdico.
- A rota de laboratório no Pages é independente da campanha e da sua persistência.

## Ciclo 42.3 — Acabamento de desmontagem e remontagem (29/10/2026)

**Objetivo:** feedback legível sem adicionar novos comandos, moedas, telas obrigatórias ou dificuldades. A retenção de 2 segundos e o reset ao soltar continuam imutáveis.

- **Retirada visual:** após 2 s completos, um clone não interativo do componente percorre ~42 px com redução de escala e desaparece em 340 ms, enquanto a alteração de estado já foi registrada uma única vez. A animação não adiciona atraso, não modifica o resultado e não afeta o histórico.
- **Instalação:** elemento reinstalado recebe movimento curto de entrada `translateY(16px)` e escala 0,94 → 1 em 340 ms.
- **Inventário em bancada:** itens removidos passam a ser cartões com ícones distintos para peças/fixadores, contagem e destaque momentâneo do item novo.
- **Orientação contextual:** mostra quantas opções de ação estão disponíveis e uma dica curta com base na fase e no tipo das ações autorizadas pelo motor; sem forçar ordem indevida entre fixadores independentes.
- **Sem reforços artificiais:** animação não habilita peças, não altera saves/custos/tempo da campanha e não cria recompensas.
- **Acessibilidade:** animação de confirmação desabilitada quando `prefers-reduced-motion`; indicadores textuais persistem.
- **Testes:** Node garante presença de feedback sem alterar contrato do motor. E2E em Chrome verifica inventário após remover, persistência após recarga, arraste cancelando, teclado e progressão até remoção da proteção; mobile valida toque e enquadramento.

**Pendente antes de integrar à campanha:** homologação visual pelo produtor, confirmação das áreas de toque no aparelho real e conexão opcional com os minigames específicos de pino e fixador.

## Ciclo 42.4 — Marreta integrada, torque independente aposentado

- A desmontagem mantém a ordem `proteção → apoios → travas → pino → bucha`; o pino só sai após **três golpes controlados**. O desafio usa uma barra de tempo e marcador de precisão na **mesma prancha SVG**, sem trocar de tela.
- O jogador ativa cada golpe por toque, clique ou teclado no pino/barra quando o cursor alcançar a janela dourada. A precisão gera uma pontuação **0–3**, mas as três ações sempre permitem concluir a retirada (não prender a OS por desempenho).
- O pino se desloca um pouco com cada golpe; só no terceiro é transferido ao inventário. Na instalação, retorna à posição e o mecanismo convencional de segurar 2 segundos prossegue.
- `phaser-play/assembly-pin-impact.js`: pontuação/dificuldade originais, separados da DOM; `assembly-sequence.js` impede remover o pino antes de três impactos.
- `assembly-workbench.html?mode=campaign&order=<id>&turn=<tick>`: salva o protótipo na chave **por OS/turno**, diferente do save da campanha. O `postMessage` de conclusão é validado em `game.js` pela origem, referência de iframe, OS, turno e faixa de pontuação, antes de aplicar `REPAIR.finish`.
- `phaser-play/game.js`: somente OS elegíveis para pino recebem assistência; iniciado o serviço, a tentativa é consumida no turno antes de abrir a bancada, como no fluxo existente.
- O minigame independente de aperto/torque **não é mais exposto** na campanha ou no laboratório. Os parafusos já fazem parte da bancada por hold de 2s; regras históricas de saves/bonificações antigos permanecem no domínio para compatibilidade, mas não geram novas atividades.
- Nenhum texto de publicações técnicas ou parâmetros OEM é apresentado ao jogador.
- QA de lógica `test-assembly-pin-v42.cjs`, QA de Chrome desktop/mobile `test-assembly-browser-v42.cjs` e teste end-to-end de campanha adaptado ao iframe.

**Importante:** o processo é abstrato, feito para o jogo; valores de esforço, posição e tempo não representam instruções reais de campo.


## Ciclo 42.5 — Sensação de impacto e legibilidade (30/10/2026)

- **Objetivo:** melhorar o feedback físico da marreta sem criar novos controles, menus, pontuações ou recursos.
- Cada um dos três golpes usa o mesmo cursor de precisão e dispara uma **animação autoral de blueprint** (cabeça de marreta, onda radial, quatro linhas de esforço e breve reação do pino). O resultado é expresso também em texto: preciso, parcial ou fora da faixa.
- O deslocamento visual cumulativo do pino passou a 12 unidades de desenho por golpe. A **pontuação continua inalterada (0–3 golpes precisos)** e não exige acerto para avançar a desmontagem.
- O indicador de três círculos mostra golpes efetuados; a animação de retirada no terceiro golpe continua compatível com a bancada.
- No celular, quando a marreta está ativa, a prancha amplia o enquadramento para `viewBox="145 95 610 320"`, mantendo o medidor inteiro visível. As demais etapas preservam o enquadramento anterior.
- `prefers-reduced-motion`: anula efeitos decorativos sem anular o gesto, a contagem ou o resultado. Nenhum som obrigatório e nenhuma vibração automática.
- `sw.js` preenche o cache de assets da bancada (HTML/JS) para compatibilidade PWA; versões das URLs da bancada e do jogo foram atualizadas para evitar scripts antigos.
- `scripts/test-assembly-pin-v42.cjs` confere qualidade/avanço e a presença dos elementos; `test-assembly-browser-v42.cjs` testa o primeiro impacto e o enquadramento mobile em Chrome real.
- `phaser-play/playtest-v42/` segue como laboratório independente com a mesma versão do motor.

**Regra de produto:** técnica lúdica, desenho sem escala; nenhuma instrução de manutenção real ou fonte documental na interface.
