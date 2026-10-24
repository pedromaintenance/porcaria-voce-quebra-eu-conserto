# P.O.R.C.A.R.I.A. — Ciclo 28 | Ergonomia das categorias de monitoramento

## Achado na revisão do Ciclo 27
A arte havia sido limitada pela altura da tela (corretamente, para mostrar toda a ilustração). Entretanto, a sidebar de Pedro mantinha botões muito baixos (22–25 px) e fonte de 9–10 px em paisagem curta. Como o conteúdo de Monitoramento é refeito a cada mudança de categoria, os botões eram substituídos por novos nós DOM, fazendo o menu voltar ao topo e podendo causar perda de foco.

Isso é uma regressão de **usabilidade**, não uma falha de FMEA ou de classificação SAP.

## Correção
- **Aumento dos controles:** botões de categoria têm ao menos **42 px no celular** (também em paisagem curta) e texto de pelo menos 11 px. O desktop mantém dimensões proporcionais.
- **Rolagem confinada:** a lista de seis categorias rola **dentro da sidebar**, com indicador visual de barra de rolagem. A arte não cresce, não é cortada e Pedro permanece visível.
- **Foco preservado:** o novo módulo `phaser-play/monitoring-nav-state.js` captura o deslocamento do menu e a categoria do botão acionado antes de re-renderizar; após a atualização, restaura scroll e foco no botão ativo com `preventScroll:true`.
- **Proteção de seletor:** somente seis categorias conhecidas podem participar do foco restaurado: `overview`, `oil`, `faults`, `undercarriage`, `fps`, `components`.
- **Acessibilidade:** indicações de `:focus-visible` no menu do Pedro e nos cartões de OS ao lado de Elton.
- **Cache:** Service Worker e referências da folha CSS e do `game.js` tiveram suas versões atualizadas para forçar carregamento da correção após o deploy.

## Limites de layout
As zonas de proteção do Ciclo 27 **não** foram alteradas: o menu de Pedro permanece na esquerda da arte, sem recobrir seu personagem, e as três prévias de OS continuam após 57% da imagem de Elton. A imagem de Planejamento também mantém proporção e limite de altura.

Em altura de 320–450 px, não há espaço para mostrar seis controles de 42 px simultaneamente e preservar a composição. Em vez de reduzir artificialmente fonte e botões, o menu lateral passa a exigir rolagem **interna**, sem deslocar a foto. Isso preserva a possibilidade de selecionar todas as categorias.

## Verificação
- `scripts/test-mobile-interaction-v28.cjs`: captura/restauração de scroll e foco, comportamento sem foco ativo, chaves válidas, HTML carregado na ordem correta, tamanho de controles, requisitos de paisagem e referências do PWA.
- Integração à regressão completa `ci-phaser.yml`; nenhum componente do motor de manutenção é modificado.
- Ainda recomenda-se teste manual em Android real e PC para validar comportamento de touch scroll e sensibilidade da área de toque em navegadores diferentes.

## Integridade
Nenhum dado do jogo é modificado: `engine.js`, `game-data.json`, FMEA, SAP, saldo, OS, equipe, histórico, economia e saves permanecem intactos.
