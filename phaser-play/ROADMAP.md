# P.O.R.C.A.R.I.A. — Roadmap de desenvolvimento

**Projeto:** *Você Quebra, Eu Conserto* · jogo de gestão de manutenção de equipamentos de mineração.
**Interface-alvo:** oficina 2D em Phaser 3, com três boxes visíveis e menus pop-up.
**Estado de referência:** 17/10/2026 · **Phaser 0.8.11 — histórico consultável de OS concluídas com dossiê técnico, autoria do diagnóstico e indicadores registrados; CI/deploy aprovados, QA visual no navegador pendente.**
**Jogo de teste:** https://pedromaintenance.github.io/porcaria-voce-quebra-eu-conserto/phaser-play/

> Status abaixo significa implementação no código, **não homologação funcional nem aprovação artística**. O deploy do Pages é executado automaticamente, mas deve ser conferido no GitHub Actions; o teste interativo permanece necessário.

## Princípios do projeto

1. A oficina é a tela principal: não voltar a uma coleção de cards/dashboard.
2. Manter o **motor de manutenção existente** (`engine.js`) como fonte de verdade para OS, pessoas, estoque, energia, custos e avanço de turno.
3. O usuário toma decisões: prioridades, diagnóstico, pessoal, disponibilidade de material, ferramental e risco de espera.
4. **Mecânicas e assets são trilhas separadas:** usar arte provisória sem bloquear o desenvolvimento; não confundir PNG existente com sprite final aprovado.
5. Não divulgar dados pessoais de funcionários, identificadores reais de equipamentos nem informação corporativa confidencial. Cenários são fictícios.
6. Atualizações devem preservar o save existente sempre que compatíveis, e alterações de versão exigem migração explícita.
7. Qualidade mínima: código sintaticamente válido, fluxo jogável, controles acessíveis no desktop e no celular, e verificação do Pages.

## Estado implementado

| Área | Status | Detalhes |
|---|---|---|
| Phaser 3 / oficina 2D | Implementado, QA pendente | Cenário industrial com câmera recortada nos três boxes |
| HUD | Implementado, QA pendente | Dia/turno, caixa, equipe, backlog e energia do supervisor |
| Rota principal e Gestão | **0.7.1 — implementado, QA pendente** | `/` redireciona para `/phaser-play/`; Gestão é pop-up escuro com indicadores e atalhos, sem acesso à interface bege |
| Menus pop-up | **0.7.7 — implementado, QA pendente** | Fila, Ordem, Equipe, Almoxarifado, Indicadores, Ajuda e Briefing do próximo turno, sem bloquear visualização do galpão permanentemente |
| Isolamento de entrada do Phaser | Implementado, QA pendente | Não selecionar boxes sob pop-ups |
| Estado da oficina | Implementado, QA pendente | Status por box, seleção destacada, fila pesquisável |
| Motor de manutenção | Existente, parcialmente exposto | Diagnóstico em seis níveis, peças, ferramentas, alocação e turnos |
| Gestão de equipe | Implementado, QA pendente | Moral/energia, descanso, motivação, contratação |
| Almoxarifado | Implementado, QA pendente | Saldos, pedido normal/urgente, ferramentas e itens em trânsito |
| Prontidão da OS | **0.5 — implementado, QA pendente** | Disponibilidade de peça/ferramenta, quantidade em trânsito e atalho para estoque |
| Mapeamento visual dos boxes | **0.6-dev — implementado, QA pendente** | Arquivo `scene-map.json` centraliza posição dos sprites e zonas clicáveis |
| Fundo oficial dos boxes | **0.7.1 — asset HQ implementado, QA visual pendente** | AVIF 1350 × 563, ~100 KB, extraído da fonte 1976 × 796, SHA-256 no CI; fundo LINEAR e sprites NEAREST |
| Background personalizável | **0.7-dev — implementado, QA pendente** | Upload PNG/JPEG/WebP via IndexedDB; PADRÃO restaura o fundo oficial e não o galpão vetorial |
| Barras de progresso por box | **0.7.1 — implementado, QA pendente** | Diagnóstico, reparo e bloqueios; indicadores deslocados para baixo das placas dos boxes |
| Contato dos equipamentos com o piso | **0.7.1 — implementado, QA pendente** | Sprite `y=430`, sombra em `groundY=414`, hitbox ampliada para incluir a faixa de piso e limites versionados em JSON |
| Backlog e previsão de turno | **0.6-dev — implementado, QA pendente** | Tempo de espera, avisos de bloqueios, diagnóstico/reparo e pedidos previstos |
| Testes de regressão no CI | **0.7-dev — implementado, execução/QA contínua** | Verifica fundo AVIF, SHA-256, crop, localização dos sprites, box sem sobreposição, equipe e save |
| Pesquisa da fila | **0.5 — corrigido, QA pendente** | Filtro atualiza a lista, sem recriar a janela inteira a cada tecla |
| Save | **0.5 — import/export, QA pendente** | Exportação JSON; importação validada por versão e confirmação de substituição |
| Feedback e atalhos | Implementado, QA pendente | Avisos temporários, confirmação de turno, atalhos 1–5 e Esc |
| Arte definitiva/animada | Pendente | Sprites consistentes, integração local, movimento e transições |
| Testes em browser real | Pendente | Chromium/Android, acessibilidade e QA do primeiro ciclo |

## Próxima entrega — 0.6: jogabilidade e clareza operacional (P0)

- [ ] **QA ponta a ponta:** abrir, selecionar OS, alocar profissional, diagnosticar, comprar, avançar turno, concluir e salvar/reabrir.
- [ ] **Resolver bugs detectados em QA:** verificar fluxo de foco ao trocar/fechar pop-ups e cliques no canvas após interações.
- [x] **Refinar estado pré-turno (código):** detalhar OS executáveis, OS bloqueadas e pedidos com chegada prevista. **QA pendente**, sem previsão determinística do trabalho realizado.
- [ ] **Definir regras para boxes especializados:** Mecânica/Elétrica/Hidráulica; hoje os rótulos são visuais e não restringem tarefas.
- [x] **Fila com idade e criticidade (código):** exibir tempo de espera em horas, prioridade e indisponibilidades de recursos. **QA pendente**.
- [ ] **Diagnóstico didático:** apresentar evidências e consequências de decisões sem revelar respostas antecipadamente.
- [ ] **Atalhos de operação:** ir da OS bloqueada para o material exato no estoque e voltar à mesma OS.
- [ ] **Persistir UI mínima:** reabrir o menu previamente acessado sem afetar a campanha.

**Critério de aceite:** o jogador conclui pelo menos uma OS sem precisar da interface antiga, e consegue interpretar por que outra OS não progrediu.

## Fundo oficial e mapeamento dos boxes — 0.7.1

**Correção de causa raiz concluída:** a imagem limpa enviada pelo usuário anteriormente não estava incorporada ao repositório, por isso o jogo exibia o fallback vetorial. A versão compactada **agora existe como arquivo binário no GitHub**, e não apenas como referência de código.

- **Arquivo publicado:** [`phaser-play/assets/oficina-base.avif`](assets/oficina-base.avif), SHA-256 `8d13599f38ac559f12a4c62e44119f1e432f5d8abc83b593d5a7ae852ef3f2bd`.
- **Fonte:** `Oficina Industrial ao Entardecer.png`, 1976 × 796 px, fundo limpo sem equipamentos e pessoas.
- **Otimização corrigida:** AVIF **1350 × 563 px, aproximadamente 100 KB**, recorte nativo da fonte. A versão anterior (900 × 363 px) era recortada novamente e ampliada pelo Phaser, gerando borramento; agora o recorte já está preparado e é reduzido suavemente para 1080 × 450. O PNG completo continua preservado no contexto do projeto, mas não está versionado neste repositório.
- **Recorte operacional:** a origem histórica na fonte é (320,130), dimensões 1350 × 563. O AVIF publicado já vem recortado e seu mapa usa (0,0,1350,563); Phaser exibe em viewport 1080 × 450 com offset world (319,45).
- **Mapeamento versionado:** [`scene-map.json`](scene-map.json) define `hitWorld`, `spriteWorld`, `workerWorld`, `labelWorld` e `progressWorld` para cada um dos três boxes.
- **Carregamento:** Phaser tenta o AVIF oficial; se falhar, usa o galpão vetorial. O usuário pode importar imagem personalizada pelo botão CENÁRIO. PADRÃO restaura o AVIF oficial.
- **Camadas independentes:** sprites de máquinas, mecânicos, destaque do box e barras de progresso são desenhados pelo Phaser, em função das OS abertas. O fundo não duplica esses elementos.
- **Assentamento no piso:** `spriteWorld.y=430`, `groundY=414`; elipses semitransparentes de sombra de contato sob equipamentos, sem transformar sombra em física real. A hitbox vai até `y=452`.
- **Renderização:** plano de fundo com filtro LINEAR e Phaser `antialias:true`; máquinas e trabalhadores com filtro NEAREST, preservando aparência pixel art.
- **Progresso:** barras de diagnóstico, reparo e interrupção por indisponibilidade de peças/ferramentas.
- **Testes:** `scripts/smoke-phaser.cjs` e GitHub Actions validam checksum, arquivo presente, crop e geometria de posições. Verificação visual e mobile ainda pendente.

### Ações de homologação imediatas (P0)

- [ ] Abrir GitHub Pages em janela sem cache e confirmar **visualmente** o cenário de entardecer nos três boxes.
- [ ] Alocar OS aos BOX 1, 2 e 3, confirmando que máquinas e mecânicos não ultrapassam a demarcação física de cada vaga.
- [ ] Verificar que clique em cada box seleciona somente sua OS e não atravessa menus pop-up.
- [ ] Avançar turno e confirmar mudança de barras (diagnóstico, reparo, aguardo de peça e ferramenta).
- [ ] Testar o botão PADRÃO após importar fundo customizado e após recarregar a página.
- [ ] Validar navegador desktop e Android, incluindo suporte ao formato AVIF; fallback deve funcionar quando indisponível.
- [x] Publicar textura HQ 1350 × 563, 100 KB, a partir do PNG de origem.
- [ ] Validar legibilidade/qualidade da arte HQ em monitores Full HD e 4K; considerar 2× no futuro se necessário.

## Entrega 0.7.1 — Consolidação da interface (P0)

**Implementado no repositório:**
- [x] Substituir `/index.html` por redirecionamento para `/phaser-play/`; a tela de cartões bege deixa de ser a landing page.
- [x] Converter o botão **Gestão** em modal próprio com indicadores de caixa, reputação, carteira, bloqueios, equipe, utilização, concluídas e histórico.
- [x] Alterar `manifest.webmanifest` e cache do `sw.js` para iniciar a PWA na oficina 2D e atualizar instalações existentes.
- [x] Publicar textura AVIF de alta qualidade e validar checksum no deploy.
- [x] Ajustar a linha de contato dos caminhões e criar sombra elíptica sob os equipamentos.
- [x] Deslocar barras de progresso para não cobrir letreiros BOX 1–3.
- [x] Atualizar `scene-map.json` e ampliar smoke-tests de landing page, gestão e asset HQ.

**Pendente de validação em navegador (não declarar concluído sem evidência):**
- [ ] Confirmar que o domínio raiz sempre abre a oficina Phaser, inclusive após atualização da PWA.
- [ ] Confirmar que o botão Gestão nunca navega para o dashboard antigo.
- [ ] Comparar visualmente qualidade do fundo 0.7 versus 0.7.1, principalmente letras dos boxes e bancadas ao fundo.
- [ ] Confirmar o contato das rodas do CAT 777 com o piso nos boxes 1, 2 e 3, em desktop e mobile; ajustar por PNG de modelo se necessário.
- [ ] Confirmar que não existe clique vazando por trás de modal e que o gesto Esc fecha o painel.

## Entrega 0.7.2 — Organização e movimento dos assets (implementada, QA visual pendente)

### Implementado no código

- [x] **Imobilidade física das máquinas:** removido o tween vertical periódico de todos os assets. Nenhum equipamento é deslocado pelo relógio de animação.
- [x] **Apoio no piso:** equipamentos movidos para `spriteWorld.y=469`, sombra em `groundY=448`; coordenadas independentes no `scene-map.json` para os três boxes.
- [x] **Mecânicos nas laterais:** dois personagens visuais por box ocupado, um de cada lado, sobre o plano de piso `y=448`; `facing=right` no lado esquerdo e `facing=left` no direito.
- [x] **Poses reais versionadas:** `idle.png`, `inspect.png`, `point.png` e `clipboard.png` dos personagens `mec_lia` e `mec_rafael` armazenadas em `phaser-play/assets/characters/`.
- [x] **Animação sem locomoção:** apenas as imagens dos mecânicos alternam a pose a cada 560 ms. Em diagnóstico alternam `idle/inspect/point`; em reparo `idle/inspect/clipboard`; se bloqueados, permanecem em `idle`.
- [x] **Sem assets de caminhada inventados:** a biblioteca de revisão contém poses e spritesheets, mas não arquivos `walk_1.png`/`walk_2.png`. Alternância de poses não é animação de deslocamento.
- [x] **Redução de movimento:** preferência `prefers-reduced-motion` desliga as trocas de frames.
- [x] **Catálogo local de equipamentos:** quatro PNGs antes carregados da branch `fix/assets-review-20261014` agora estão em `phaser-play/assets/equipment/`, versionados na `main`.
- [x] **CAT D9 provisório melhorado:** fallback vetorial passou a representar trator de esteiras com cabine, esteira e lâmina, em vez de retângulo genérico; ainda não é sprite final homologado.
- [x] **Smoke-test:** verifica a assinatura PNG e dimensões dos frames, presença de arquivos, ausência de `this.tweens.add`, disposição no plano do piso e orientação dos personagens.

### Pendências de homologação (P0/P1)

- [ ] Confirmar visualmente que as rodas/esteiras dos modelos CAT 777E, 6030, 395, 336GC, Sandvik e D9 encostam no piso sem flutuar.
- [ ] Confirmar se espelhamento horizontal dos PNGs frontais comunica a direção correta de olhar. Se não, produzir sprites direcionais reais.
- [ ] Validar o alcance dos mecânicos e a sobreposição de sprites com máquinas de diferentes portes; ajustar separadamente por `modelId` se necessário.
- [ ] Confirmar que as poses `inspect/point/clipboard` alternam sem tremulação ou saltos de escala no desktop e celular.
- [ ] Revisar a representação de mão de obra: o motor aloca um profissional à OS, mas atualmente dois personagens visuais são desenhados por box ocupado. Não considerar o segundo como HH operacional até implementar múltiplas alocações.
- [ ] Substituir o D9 vetorial por PNG aprovado e criar sprites próprios para CAT 966 e CAT 16; não rotular fallbacks como assets definitivos.
- [ ] Introduzir caminhada somente quando houver sequência de locomoção apropriada e estados no motor; preservar máquinas estacionárias.

**Critério de aceite:** maquinário permanece imóvel e apoiado no chão; mecânicos, posicionados lateralmente, executam poses de trabalho reconhecíveis sem flutuação, e os menus e saves existentes continuam funcionais.

## Entrega 0.7.3 — Layout e usabilidade dos botões (implementada, QA visual pendente)

### Implementado no código

- [x] **Barra superior em duas faixas planejadas**: marca e navegação na faixa principal; indicadores de turno e ações na faixa secundária. Elimina quebras acidentais por `flex-wrap`.
- [x] **Navegação responsiva**: botões com dimensões consistentes, realces ao passar o mouse e selecionar menus, e faixa horizontal rolável quando a largura da tela é insuficiente.
- [x] **Hierarquia visual**: Oficina destacada como seção ativa; comandos de Gestão, Fila, Ordem, Equipe, Almoxarifado e Indicadores organizados no mesmo grupo; indicadores de caixa, equipe, backlog e energia separados das ações.
- [x] **Avançar turno promovido a ação principal**: botão amarelo `+8H` na barra de comandos; não cobre mais OS, mecânicos ou piso do BOX 3.
- [x] **Cenário como menu de opções**: botão `VISUAL` abre painel com `Trocar imagem` e `Restaurar padrão`, sem botões flutuando em cima do galpão.
- [x] **Acessibilidade**: botões nativos, estado `aria-expanded` no menu Visual e nos menus do painel, controle por teclado, Escape para fechar o menu Visual e foco visível.
- [x] **Cache de atualização**: URL do script da oficina usa `game.js?v=0.7.3` para evitar carregar JavaScript antigo após o deploy.
- [x] **Ajuda contextual**: documentação dentro do jogo atualizada para explicar controles e atalho `0` para Gestão.
- [x] **Testes de regressão**: CI verifica sete opções de navegação, presença única de botões, localização da ação de turno no header e existência das operações de cenário.

### QA visual e funcional ainda necessário

- [ ] Desktop 1366 × 768, 1600 × 900 e 1920 × 1080: garantir que a marca e todos os menus apareçam sem cortes indesejados ou quebra da barra.
- [ ] Tablet e celular: garantir que a navegação role horizontalmente e que o botão de avançar turno permaneça acessível sem obscurecer o cenário.
- [ ] Abrir cada pop-up, observar o realce do respectivo botão e verificar que os boxes não recebem cliques por trás do modal.
- [ ] Abrir o menu `VISUAL`, alterar o cenário, restaurar o fundo padrão e testar fechamento por Escape e clique fora.
- [ ] Avançar turno com o novo botão, confirmar mensagens de impacto e persistência do save.
- [ ] Verificar contraste, alvo de toque e acessibilidade por teclado em dispositivos móveis.

**Critério de aceite:** a tela principal apresenta navegação e operações legíveis, consistentes e separadas do canvas; nenhum botão crítico encobre os boxes; a interação com o motor de manutenção continua íntegra.

## Entrega 0.7.4 — Escala de frota e nitidez dos sprites (implementada, QA visual pendente)

### Causa raiz corrigida

O método antigo `machine()` renderizava TODOS os PNGs dentro da mesma caixa máxima de `310 × scale` por `220 × scale` (aproximadamente 217 × 154 pixels com `scale=0,70`). Isso fazia equipamentos de porte muito distinto parecerem semelhantes. Algumas imagens também possuíam margens transparentes, que reduziam ainda mais a área útil visível do sprite. O canvas lógico 1080 × 450 ampliado em desktop podia introduzir suavização indesejada.

### Implementação

- [x] **Deslocamento lateral:** BOX 1 — máquina e mecânicos deslocados **22 px à esquerda**; BOX 3 deslocados **22 px à direita**; BOX 2 permanece centralizado. Coordenadas de clique dos boxes não mudam.
- [x] **Multiplicadores nominais por modelo:** CAT 6030 `2×`, Sandvik DR410i `3×`, DI650i `2,4×`; CAT 777E e CAT 395 `1×`, CAT 336GC `0,95×`; demais configurações disponíveis em `scene-map.json > modelPresentation`.
- [x] **Respeito às áreas físicas dos boxes:** o tamanho desejado é limitado por largura máxima, altura máxima e espaço vertical até o piso. Portanto, os multiplicadores são alvos de apresentação, **não uma afirmação de escala física 1:1 ou aumento visual literal em todos os casos**. Um equipamento 3× não cabe integralmente no mesmo box lógico se sua altura ultrapassar o teto.
- [x] **Recorte das margens transparentes:** geração dinâmica de textura após análise do canal alfa dos PNGs; mantém os pixels úteis e aplica a origem inferior ao solo. Se o recorte falhar, o jogo utiliza o PNG original.
- [x] **Renderização mais nítida:** a textura do fundo preserva o detalhe nativo (1350 px, sem reduzir para 1080 px antes da apresentação), com filtro `LINEAR`; máquinas e personagens usam `NEAREST`, recorte alfa e coordenadas inteiras (`roundPixels`). O canvas do Phaser continua em 1080 × 450 coordenadas lógicas para não prejudicar cliques/boxes. A opção legada `GameConfig.resolution` não é usada na versão 3.90.
- [x] **Fórmula de escala isolada:** `phaser-play/layout-math.js` contém função pura `equipmentSize()` com limites e permite testes Node sem inicializar o Phaser.
- [x] **Versão e cache:** `phaser-play/index.html` inclui `layout-math.js?v=0.7.4` antes de `game.js?v=0.7.4`.
- [x] **Regressão automatizada:** testes de multiplicadores 6030/DR410i, proporção relativa, enquadramento por box, scripts de renderização e posições laterais executados antes do deploy.

### Verificações de aceitação pendentes

- [ ] Verificar em desktop que a DR410i apresenta altura e presença visual claramente superiores à versão anterior sem cobrir a navegação ou transbordar inadequadamente para o box vizinho.
- [ ] Verificar que a 6030 ficou mais imponente e sem sobrepor excessivamente os mecânicos.
- [ ] Confirmar que rodas/esteiras permanecem apoiadas no piso após o recorte alfa dos PNGs; sombra deve coincidir com a base do veículo.
- [ ] Revisar enquadramento específico do Box 1 e Box 3; manter os mecânicos visíveis nas laterais ao longo da animação de poses.
- [ ] Comparar nitidez a 1366×768, 1600×900 e 1920×1080 e em celular (principalmente contornos e partes finas da torre de perfuração).
- [ ] Se for insuficiente, substituir apenas os PNGs originais cuja resolução seja baixa; ampliar por nearest-neighbor não cria detalhe novo. Investigar atlas 2× redesenhados especificamente para o estilo visual.
- [ ] Medir uso de GPU/memória em mobile com texturas de fundo nativas e recorte alfa; se necessário, usar texturas menores nos dispositivos limitados.

**Critério de aceite:** a DR410i e a 6030 comunicam porte muito superior, os três boxes mantêm leitura operacional e o canvas apresenta contornos nítidos sem movimento artificial das máquinas.

## Entrega 0.7.5 — Ajuste fino de composição dos três boxes (implementado, QA visual pendente)

**Solicitação de referência:** na v0.7.4, transladar os conjuntos visuais do **BOX 1 −72 px**, **BOX 2 +40 px** e **BOX 3 +82 px**.

### Concluído no código

- [x] **Centros nominais das máquinas:** BOX 1 `x=407` (antes 479); BOX 2 `x=848` (antes 808); BOX 3 `x=1223` (antes 1141), todos em coordenadas do mundo Phaser.
- [x] **Mecânicos acompanham a composição:** BOX 1 `x=310/539`; BOX 2 `x=725/977`; BOX 3 `x=1102/1345`. Mantidos `groundY=448`, orientação lateral e poses animadas exclusivas dos mecânicos.
- [x] **Hitboxes arquitetônicas preservadas:** `hitWorld.x=379/660/980`. Não deslocar essas zonas com os assets: as regiões dos boxes são definidas pela estrutura do galpão, não pelo centro da máquina. Mover as três áreas simultaneamente produziria sobreposição de cliques e recorte fora da câmera.
- [x] **Indicadores e seleção preservados:** `progressWorld.x=402/695/1006`, contorno de seleção e rótulos de box vazio permanecem alinhados ao fundo e às posições físicas.
- [x] **Proteção contra corte na câmera:** função pura `visibleCenter()` em `layout-math.js`; usa largura real calculada do sprite e recorte do viewport (mundo X=319..1399). Os valores solicitados continuam registrados no JSON; o centro visual pode ser corrigido apenas o mínimo necessário para manter o sprite integralmente na tela. Exemplo: mecânico nominal x=310 é apresentado em x=354.
- [x] **Sombra de contato coerente:** acompanha o centro efetivamente renderizado da máquina (inclusive quando houve correção de borda), não o centro nominal fora da câmera.
- [x] **Clique no asset correto:** clicar na imagem da máquina ou do mecânico abre a OS associada ao seu box, mesmo quando a arte ultrapassa visualmente a demarcação de outro box; pop-ups continuam bloqueando eventos da cena.
- [x] **Regressões automatizadas:** valida coordenadas nominais, preservação de hitzones/indicadores, função de encaixe no viewport, sombra e click handlers. A lógica de OS, estoque, equipe, saves e avanço de turno não foi alterada.
- [x] **Cache atualizado:** scripts com parâmetro `v=0.7.5` e marcação de versão no HTML.

### QA visual pendente

- [ ] Confirmar em desktop que o BOX 1 parece mais deslocado à esquerda sem perder partes importantes da máquina ou do mecânico.
- [ ] Confirmar o afastamento dos BOXES 2 e 3, sobretudo com DR410i e CAT 6030, sem colidir excessivamente com o cenário.
- [ ] Clicar diretamente em sprites posicionados na zona de transição entre boxes: devem abrir **a própria OS**, nunca a do box vizinho.
- [ ] Conferir que os indicadores continuam fixos sobre seus respectivos boxes e que não acompanham os deslocamentos decorativos dos sprites.
- [ ] Verificar no celular os limites da câmera, pop-ups e alcance de toque.
- [ ] Ajustar offsets específicos por família, se os modelos maiores precisarem de compensação adicional.
- [ ] Validar visualmente a posição do CAT D9 provisório e de modelos que ainda utilizam fallbacks.

**Critério de aceite:** as posições correspondem ao pedido visual, nenhum sprite essencial fica cortado, a seleção de OS permanece correta e o galpão mantém sua geometria original.

## Entrega 0.7.6 — Ajuste milimétrico de composição e limite de câmera (implementada; aguardando homologação visual)

**Referência:** avaliação da captura da v0.7.5. O usuário aprovou integralmente o BOX 3 e pediu apenas **BOX 1 +20 px à direita** e **BOX 2 −6 px à esquerda**.

### Código implementado

- [x] **BOX 1:** centro nominal da máquina `407 → 427`; mecânicos `310/539 → 330/559`; deslocamento acumulado `-94 → -74 px`.
- [x] **BOX 2:** centro nominal `848 → 842`; mecânicos `725/977 → 719/971`; deslocamento acumulado `+40 → +34 px`.
- [x] **BOX 3 homologado visualmente pelo usuário na v0.7.5:** máquina `x=1223` e mecânicos `1102/1345` **preservados sem mudança**. Nenhuma escala, posicionamento vertical, sprite ou fundo alterado.
- [x] **Correção do efeito de clamp (causa imediata):** quando o caminhão do BOX 1 já está limitado pela borda esquerda da câmera, alterar somente `spriteWorld.x` de 407 para 427 **não deslocaria a imagem**. A função pura `calibratedCenter()` em `layout-math.js` aplica o incremento ao **centro anteriormente renderizado** e depois valida novamente os limites de enquadramento.
- [x] **Movimento visual demonstrável:** para um sprite de 265 px no BOX 1, o centro efetivo passa de `x=460` para `x=480`; o mecânico junto à borda passa de `354` para `374`. O BOX 2 perde os 6 px solicitados. O BOX 3 permanece igual.
- [x] **Eixos e enquadramento consistentes:** máquina, sombra de contato e ambos os mecânicos consultam `visualCalibrationX` do box; a origem no solo `y=448` não muda.
- [x] **Geometria de oficina imutável:** `hitWorld`, `progressWorld` e `labelWorld` continuam ligados aos três boxes físicos do galpão; não mover indicadores e zonas clicáveis junto com personagens/máquinas.
- [x] **Testes automatizados:** asserts das novas coordenadas, deslocamento efetivo após clamp, preservação de geometria e integridade do motor de simulação.
- [x] **Scripts com cache atualizado:** `game.js?v=0.7.6` e `layout-math.js?v=0.7.6`.

### QA pendente

- [ ] Confirmar, na mesma resolução da captura anterior, que o CAT 777E no BOX 1 anda **20 px para a direita**, sem corte de rodas ou cabine.
- [ ] Confirmar o deslocamento discreto de **6 px para a esquerda** no BOX 2, inclusive com máquinas grandes.
- [ ] Confirmar que o BOX 3 continua idêntico à versão aprovada.
- [ ] Verificar se os mecânicos mantêm sua relação lateral com cada máquina e se o clique sobre qualquer sprite seleciona a OS correspondente.
- [ ] Se algum tipo de sprite (especialmente fallback vetorial) parecer deslocado, calibrar o modelo isoladamente antes de alterar novamente um box aprovado.

**Critério de aceite:** dois movimentos visuais observáveis, BOX 3 intacto e nenhum efeito regressivo em interações ou HUD. A aprovação desta geometria deve preceder novas alterações artísticas.

## Entrega 0.7.7 — Briefing operacional antes de avançar o turno (implementada, QA no navegador pendente)

**Problema:** a confirmação de `AVANÇAR TURNO +8H` utilizava `window.confirm`, exibindo apenas totais resumidos, sem identificar quais OS estavam bloqueadas ou dar acesso rápido à ordem e ao almoxarifado. Isso dificultava as decisões de programação e criava risco de avançar sem planejar o atendimento.

### Implementado

- [x] **Confirmação dentro do mesmo visual Phaser:** o botão `Avançar turno` abre o painel `Briefing do próximo turno` no mesmo overlay dos menus. Sem pop-up nativo do navegador, e sem alterar posições da oficina.
- [x] **Resumo da capacidade:** boxes ocupados, diagnósticos, ordens aptas ao reparo e bloqueios, calculados a partir do **estado atual** (`state.jobs`, `state.stock`, `state.tools`) antes do avanço.
- [x] **Três cartões por box:** exibem modelo, OS, mecânico alocado, idade da OS, etapa ou bloqueio específico. Um botão `VER OS` abre a ordem correta; `ALMOXARIFADO` abre a lista já filtrada pelo item/ferramenta faltante.
- [x] **Riscos conhecidos:** OS crítica ainda sem mecânico, fadiga física/mental dos profissionais alocados e boxes livres. *Fadiga é um alerta de produtividade e não um bloqueio automático.*
- [x] **Logística sem falsa previsão:** os pedidos com ETA `<= tick + 1` aparecem como recebimento **ao final das 8h**, seguindo a ordem de execução do motor `engine.advance()`. Não são contabilizados como saldo disponível para reparar a máquina durante as mesmas 8 horas.
- [x] **Folha fixa na virada do dia:** quando o próximo avanço parte do turno B, o painel mostra `equipe × R$ 220 + R$ 180`, conforme o motor. Exclui custos variáveis, receitas, falhas e resultados não determinísticos.
- [x] **Avanço de turno exclusivamente por confirmação:** `CANCELAR/VOLTAR` não modifica o estado; `CONFIRMAR +8H` avança exatamente uma vez via `E.advance()`. Token `data-turn-tick` exige nova revisão caso o turno tenha mudado desde a abertura.
- [x] **Modelo testável sem dependência Phaser:** `phaser-play/shift-brief.js`, módulo puro que não modifica o save; `scripts/test-shift-brief.cjs` valida precedência de bloqueios, peças/ferramentas, pedidos com ETA, fadiga, folha, invariância do estado e ações de confirmação.
- [x] **Acesso adicional pelo menu Gestão:** botão `REVISAR PRÓXIMO TURNO` no painel de gestão; navegação e sprites existentes mantidos.
- [x] **Scripts com cache atualizado:** `shift-brief.js?v=0.7.7` e `game.js?v=0.7.7`.
- [x] **Regressão incorporada ao pipeline de Pages:** testes de interface, motor, geometria e briefing passam a ser executados antes do upload/deploy.

### Critérios de aceite / QA ainda pendentes

- [ ] Abrir o briefing em desktop e celular, fechar com `Esc`, `VOLTAR À OFICINA` e botão `FECHAR`, sem alterar caixa, dia, turno, estoque, OS ou energia.
- [ ] Avançar uma vez e conferir `+8H`, atualização do estado, persistência do save e inexistência de avanço duplo.
- [ ] Criar OS em diagnóstico, bloqueada por ferramenta, bloqueada por peça e apta ao reparo; verificar mensagens exatas em cada cartão.
- [ ] Testar o botão `VER OS` e o atalho do almoxarifado de um bloqueio, mantendo a OS de origem corretamente identificada.
- [ ] Confirmar ETA de pedido ao fim do turno, distinguindo recebimento posterior ao trabalho de material já disponível.
- [ ] Confirmar alerta de fadiga sem classificar automaticamente o reparo como bloqueado.
- [ ] Inspecionar a legibilidade e a rolagem no celular, sem vazamento de clique para os boxes atrás do overlay.
- [ ] Garantir que BOX 1 e BOX 2 mantenham os ajustes da v0.7.6 e que o BOX 3 continue na posição aprovada.

**Critério de conclusão:** jogador consegue decidir o próximo turno com informações rastreáveis ao motor, e somente a confirmação executa a passagem de 8 horas. Não são inferidas durações, entregas ou probabilidades inexistentes no estado.

## Entrega 0.7.8 — Planejamento PCM e alocação assistida (implementada, QA funcional pendente)

**Problema:** as OS já possuíam prioridade, data de abertura, recursos e equipe, mas não havia uma visualização integrada que recomendasse **o que programar primeiro, com qual mecânico e em qual box**, sem comprometer a autonomia do jogador. A fila anterior classificava apenas por prioridade e data, sem indicar capacidade ou justificativa da recomendação.

### Implementado

- [x] **Painel Planejamento PCM** acessível pela **Gestão** e pela **Fila de OS**, sem inserir botões na barra superior e sem modificar o cenário Phaser.
- [x] **Priorização heurística transparente:** criticidade `×100`; mais `3 pontos por turno` na carteira (máximo 90); `+22` quando o serviço está apto; `−26` quando faltam ferramentas ou peças necessárias. Os pontos são critério de ordenação **fictício**, não uma avaliação quantitativa de risco conforme norma.
- [x] **Capacidade livre operacional:** contagem de mecânicos disponíveis (não alocados e sem descanso), boxes livres, inícios simultâneos possíveis e `8 HH brutas × min(mecânicos livres, boxes livres)`. O número **não** desconta fadiga, rendimentos individuais nem as tarefas já executadas; não é previsão de horas produtivas.
- [x] **Recomendação explicável de mão de obra:** comparar especialidade da OS e profissional, habilidade cadastrada, energia física e mental; fadiga reduz a preferência mas não elimina a disponibilidade pelo motor. Atribuição automática só pode sugerir **um mecânico livre e um box realmente vago**.
- [x] **Prontidão de serviço derivada de `engine.js`:** sem ferramenta não inicia diagnóstico; após os 6 níveis do diagnóstico, sem saldo de peça o reparo fica bloqueado. Item já baixado da reserva (`materialUsed`) não é requisitado novamente.
- [x] **Materiais em trânsito não são saldo:** exibir número de turnos para o ETA; o recebimento ocorre após o trabalho do turno, exatamente como no `engine.advance()`.
- [x] **Ação deliberada do jogador:** `ALOCAR SUGESTÃO` recalcula a recomendação, valida o turno e chama `E.attach()`, que verifica ocupação, descanso e regras de alocação. `VER / ALOCAR MANUALMENTE` preserva a escolha manual dentro da OS. Nenhum pedido de material é criado automaticamente.
- [x] **Atalhos contextuais:** `CONSULTAR RECURSO` abre o almoxarifado com filtro na ferramenta ou peça faltante; `BRIEFING DO TURNO` acessa o resumo implantado na v0.7.7.
- [x] **Código isolado e sem side effects:** módulo puro `phaser-play/planning.js` calcula a lista sem tocar no save. A interface está concentrada no `game.js` e no modal HTML existente.
- [x] **Regressões automatizadas:** testes `scripts/test-planning.cjs` verificam score, HH brutas, especialistas, boxes, peças, ferramentas, fadiga, descanso, alocação explícita, ETA e ausência de mutação; integrados à CI antes do deploy no Pages.
- [x] **Versão dos scripts:** `planning.js?v=0.7.8` e `game.js?v=0.7.8`. O módulo de briefing 0.7.7 e o layout de boxes 0.7.6 continuam intactos.

### QA ainda necessária

- [ ] Acessar Planejar OS a partir de Gestão e Fila sem perder o menu aberto, e navegar pelos atalhos com mouse e teclado.
- [ ] Conferir ordenação de críticas, altas e moderadas, incluindo serviço antigo bloqueado por material e serviço apto mais recente.
- [ ] Alocar a sugestão, confirmar escolha da **OS correta**, ocupação do box e alteração da disponibilidade do mecânico. Repetir até acabar a capacidade.
- [ ] Conferir que a recomendação seguinte não reutiliza box/mecânico já ocupado e que nenhum serviço avança o turno durante alocação.
- [ ] Conferir que a OS bloqueada não oferece `ALOCAR SUGESTÃO` e que a compra de peça/ferramenta continua sendo decisão do jogador.
- [ ] Testar abertura do almoxarifado já filtrado com necessidade de material e com falta de ferramental; voltar para a Fila e Gestão.
- [ ] Validar a leitura dos cartões de OS no celular (rolagem sem clique atravessar o overlay).
- [ ] Confirmar que os três boxes mantiveram **as posições homologadas na v0.7.6**, sem alteração de tamanho de equipamentos, cenário ou personagens.

**Critério de aceite:** a recomendação é rastreável aos dados simulados, respeita os recursos realmente livres, não altera o estado sem consentimento e pode ser executada em poucos cliques.

## Entrega 0.7.9 — Visão semanal de capacidade e materiais conhecidos (implementada, QA pendente)

### Fundamento técnico

O motor `engine.js` resolve diagnósticos por etapas, com probabilidade de acerto, retrabalho, influência da especialidade e fadiga. No reparo, a taxa produtiva varia conforme habilidades e apoio do supervisor. As horas `repairRemaining` representam esforço pendente do simulador, **não HH de calendário confirmadas**. Portanto, **não é tecnicamente justificável prometer datas de conclusão nem subtrair diretamente esse esforço da capacidade bruta**.

### Implementado

- [x] **Nova aba `JANELA SEMANAL · 14 TURNOS`** dentro do menu `Planejamento PCM`, preservando a aba `PRÓXIMO TURNO · 8H` da versão 0.7.8. Nenhum botão novo ocupa a barra principal.
- [x] **14 turnos de 8h corridas**, em janela deslizante a partir do turno A/B atual (112h corridas). Exibir sequência correta de dia/turno mesmo iniciando no turno B.
- [x] **Capacidade nominal por turno:** `8h × min(boxes, mecânicos do quadro)`; descanso **já programado no turno atual** é descontado só nesse turno. Não projetar descanso futuro, contratação, rotatividade, liberação automática de box ou sobrecarga produtiva.
- [x] **Separação entre capacidade e demanda:** painel informa HH nominais, esforço `repairRemaining` (horas-equivalentes do motor), número de OS aguardando diagnóstico e etapas ainda não confirmadas. Não converter etapas de diagnóstico arbitrariamente em HH e não inferir conclusão.
- [x] **Recebimentos conhecidos, no turno correto:** pedidos com `eta = tick+offset+1` são exibidos **ao final** desse turno, quando o motor registra a entrega. Não antecipar disponibilidade da peça no mesmo turno.
- [x] **Risco de materiais apenas de OS diagnosticadas:** agrupar componentes `scenario.material` somente quando `stage >= 6` e `materialUsed=false`; contar necessidades por item, saldo atual e quantidades de pedidos dentro do horizonte, mostrando déficit presente e déficit após entregas conhecidas. Não revelar a peça de falha ainda não diagnosticada.
- [x] **Referência de custos fixos:** marcar viradas do dia (turno B) e calcular folha/estrutura do quadro atual pela fórmula do motor (`equipe × R$220 + R$180`). Não incluir gastos variáveis ou projetar caixa.
- [x] **Módulo puro de leitura `phaser-play/weekly.js`:** consulta estado e catálogos sem gravar ou chamar `engine.advance()`; não simula aleatoriedade nem gera OS.
- [x] **Visualização horizontal acessível e responsiva:** 14 colunas de turno com indicador de HH, entregas e virada do dia; navegação horizontal no celular, categorias com déficit e lista explícita de hipóteses e limites.
- [x] **Testes de regressão:** `scripts/test-weekly.cjs` verifica dias/turnos, HH nominais, descanso, ETAs, materiais de OS diagnosticadas, competição por estoque e imutabilidade do save; pipeline do Pages bloqueia deploy se falhar.
- [x] **Versão de cache:** `weekly.js?v=0.7.9` e `game.js?v=0.7.9`; mapa da oficina e sprites não alterados.

### Limitações deliberadas

- Não constitui um **cronograma semanal por OS** com datas e sequência de execução. Para chegar a essa funcionalidade, será necessário modelar alocações de HH ao longo dos turnos, consumo concorrente de peças, liberação de boxes e produtividade estocástica. Isso permanece no roadmap 0.8.
- Não há previsão das novas falhas geradas na virada do dia, demissões, compras não realizadas ou resultados probabilísticos. Os valores são **fotografia dos recursos e obrigações conhecidas agora**.
- Um pedido chegando na janela não garante que todas as OS disputando a peça poderão ser atendidas.

### Homologação no navegador pendente

- [ ] Alternar `PRÓXIMO TURNO` ↔ `JANELA SEMANAL` sem alocar, comprar, alterar energia ou avançar turnos.
- [ ] Confirmar rolagem horizontal com 14 colunas no celular e legibilidade das entregas e salários.
- [ ] Verificar que, quando o turno B é o atual, os marcadores de dia avançam corretamente na passagem para A.
- [ ] Criar dois diagnósticos concluídos para a mesma peça com saldo 1 e confirmar alerta de insuficiência, incluindo ETA posterior ao turno atual.
- [ ] Validar o gráfico e os indicadores após compras, descanso, contratação, conclusão de diagnóstico e avanço de turno.
- [ ] Confirmar que os três boxes preservam o layout e os sprites da v0.7.6 (homologação de composição).

**Critério de aceite:** capacidade bruta e demandas de materiais conhecidas são apresentadas de forma clara, coerente com o motor e sem produzir falsas previsões ou alterar o jogo.

## Entrega 0.8.0 — Turnos de 12 horas, metas e ativo noturno (implementada parcialmente; QA/asset público pendentes)

### Escopo de tempo oficial

- [x] **Dois turnos por dia:** `A = dia` e `B = noite`, **12 horas corridas por turno**.
- [x] **Tempos indisponíveis por profissional em cada turno:** DDS **0,5h** e refeição **1h**; resultam em **10,5 HH úteis por mecânico por turno**. `engine.js` define `SHIFT_HOURS=12`, `DDS_HOURS=0.5`, `MEAL_HOURS=1` e `EFFECTIVE_HOURS=10.5`. Não contabilizar as 12 horas como mão de obra produtiva.
- [x] **Capacidade versus utilização:** equipe total é contabilizada com até 10,5 HH/mecânico presente; quem está programado para descanso não integra as HH oferecidas naquele turno. Três boxes limitam serviços simultâneos. A capacidade da visão semanal usa `min(boxes,mecânicos disponíveis) × 10,5 HH`.
- [x] **Horizonte PCM:** 14 turnos = **7 dias corridos**, ou **168 horas de calendário**. Para 3 boxes cobertos nos 14 turnos, são até **441 HH úteis de oportunidade** no horizonte, ainda sem ajustes por produtividade, falhas ou materiais.
- [x] **Tempo desde abertura/MTTR:** contagem de períodos de 12h para idade das OS e horas corridas dos serviços concluídos. Datas/horas históricas salvas com a regra antiga podem precisar ser reprocessadas caso seja necessária comparabilidade de séries.
- [x] **UI e briefings:** botão avançar turno `+12H`, painel de confirmação e planejamento do próximo turno `12H`, painel semanal `168h`, indicação de dia/noite na barra superior.

### Meta de produtividade — regra de jogo explicitada

- [x] **Controle em Gestão:** `20 ≤ meta ≤ 100` (passo 5), valor padrão e neutro **60**. A escolha pertence ao save; saves antigos recebem 60 se ainda não possuem o campo.
- [x] **Produção esperada no simulador:** relação gradual, `speed = 1 − 0,25 × (60−meta)/40` abaixo de 60 e `speed = 1 + 0,20 × (meta−60)/40` acima de 60. Ritmo 75% na meta 20, 100% na 60 e 120% na 100; **não é produtividade industrial medida**.
- [x] **Fadiga por HH efetivamente trabalhada:** se `h = max(0,(meta−60)/40)`, fator `F = 1 + 4 × (exp(3h)−1)/(exp(3)−1)`. Resulta em fator 1 na meta 60 e 5 na 100. Aplica-se ao desgaste mental e físico por HH. **Curva exponencial ficcional**, não uma recomendação de saúde ou ergonomia.
- [x] **Moral por HH trabalhada:** se `l = max(0,(60−meta)/40)`, penalidade adicional por HH `M = 1,25 × l²`. Zero na meta 60, 1,25 ponto por HH na meta 20; somada à moral perdida por falhas, baixa energia e outros mecanismos já existentes.
- [x] **Distinção entre esforço e HH trabalhada:** `repairRemaining` representa carga de reparo simulada, enquanto `j.worked`, `costLabor` e `metrics.productive` passam a somar HH de mão de obra efetivamente utilizadas, limitadas a 10,5 por mecânico por turno, mesmo com ganho de velocidade/apoio.
- [x] **Regressão planejada:** testes `scripts/test-shifts-productivity.cjs` cobrem os limites 20/60/100, fadiga exponencial, moral, turno A→B→A, HH, salva/restaura meta e calendário de OS.

### Cenário noturno — fonte preservada, publicação binária pendente

- [x] **PNG original salvo na biblioteca pessoal**, em `/PORCARIA/Assets/Oficina/Hangar Industrial Noturno sob a Chuva.png`, 1976 × 796 px, SHA-256 `fd4711611b7f83ca6f3428b5bbc59ae855cc800ab26dcd481b8c2eaf0c89ceee`.
- [x] **Derivativo AVIF de alta resolução guardado na biblioteca**, `/PORCARIA/Assets/Oficina/oficina-noturna-hq.avif`, 1976 × 796 px, SHA-256 `0637e55b3a1978842c7aa71e27c763b176ea7c8438a82ee5bc711140e1a72c15`.
- [x] **Manifesto de preservação publicado:** `phaser-play/assets/OFICINA-NOTURNA.md` inclui origem, tamanho, dimensões, checksums, nomes, IDs de biblioteca e instruções de integração.
- [x] **Alternância de cenário preparada no Phaser:** durante o turno A, o fundo padrão diurno; no B, tenta carregar `phaser-play/assets/oficina-noturna-hq.avif`. Quando ausente, usa **apenas uma tonalização noturna provisória** no fundo diurno (não corresponde ao PNG noturno fornecido). Fundo personalizado escolhido em `VISUAL` continua com prioridade, inclusive o PNG original carregado pelo jogador.
- [x] **Integração local sem publicar binário:** em `VISUAL → Definir fundo da noite`, o jogador importa o PNG/AVIF do arquivo preservado. O jogo armazena a imagem separadamente no IndexedDB do navegador e passa a usá-la **automaticamente em cada Turno B**. `Limpar fundo noturno local` remove essa cópia; um cenário personalizado geral continua tendo prioridade. **Esse mecanismo não envia o arquivo ao GitHub nem sincroniza entre dispositivos.**
- [ ] **Dependência:** copiar o AVIF binário preservado para `phaser-play/assets/oficina-noturna-hq.avif` na `main`, verificar SHA-256, testar o recorte e os três boxes à noite. O conector GitHub atual admite escrita textual e blobs informados em base64, mas não transferiu automaticamente os bytes do arquivo local. **Não declarar o asset como publicado antes dessa etapa.**
- [ ] Confirmar que a troca A→B→A não reposiciona sprites nem interfere em menus, saves ou seleção de OS.

### Homologação e balanceamento pendentes

- [ ] Testar 20/60/100, verificar declínio exponencial de energia mental/física, perda de moral em metas baixas e recuperar meta 60 pelo controle.
- [ ] Inspecionar dinâmica de fadiga, permanência de equipe, demissões e throughput por vários dias; **valores de balanceamento são provisórios**.
- [ ] Confirmar que o motor de 12h mantém chegada de OS, custos de folha, ETA de materiais e prazo da campanha coerentes.
- [ ] Testar o arquivo noturno **real** no browser, após integrar o binário. Até lá, a tonalização provisória serve apenas para distinguir períodos.
- [ ] Validar responsividade em desktop/celular, continuidade dos saves e integridade das posições dos boxes aprovadas na v0.7.6.

## Entrega 0.8.1 — Correção estrutural do mapeamento visual (implementada; QA no Pages pendente)

**Sintoma observado:** no teste após a v0.8.0, a CAT 6030 e os caminhões 777E pareciam deslocados para fora dos boxes, apesar de as barras e os letreiros permanecerem em posições plausíveis. O problema tornou-se evidente ao usar uma imagem completa da oficina no lugar do fundo diurno oficial já recortado.

### Diagnóstico

O código antigo em `setBackdrop()` decidia arbitrariamente se deveria recortar uma imagem conforme a proporção (`aspect > 2.42`). O PNG completo (1976×796, proporção 2,482) era recortado em uma janela equivalente a `x=320, y=130`, enquanto versões completas reexportadas em proporções pouco diferentes eram exibidas inteiras. **As imagens passavam a ter coordenadas visuais distintas, mas máquinas, mecânicos e hitboxes continuavam usando o mesmo `scene-map.json`**. Os ajustes acumulados da v0.7.6 e a proteção de borda da câmera aumentavam a inconsistência.

### Implementado

- [x] **Dois perfis explícitos:** `cropped` para `oficina-base.avif` (arquivo 1350×563 previamente recortado) e `fullFrame` para imagens completas, incluindo o original do turno noturno e os arquivos personalizados da oficina.
- [x] **Preservar o perfil já aprovado:** `backgroundProfiles.cropped.bays="base"` mantém os três centros `[427,842,1223]`, posições dos trabalhadores, barras, áreas clicáveis e escala da v0.7.6.
- [x] **Recalibração inicial do fundo completo:** centros dos três boxes `[611,846,1094]` no mundo Phaser. Os limites físicos `hitWorld` estão separados, sem sobreposição entre áreas clicáveis. Coordenadas derivadas do enquadramento e imagem disponibilizados pelo usuário; **precisam de QA visual real**.
- [x] **Remoção do recorte implícito baseado em aspect ratio:** `setBackdrop(img,profile)` desenha a fonte inteira; o asset diurno oficial já tem a janela correta pré-aplicada. Fundos completos não devem sofrer a antiga operação de corte `(320,130)`.
- [x] **Troca sincronizada de geometria e fundo:** `applyBayProfile()` seleciona o conjunto certo de boxes, recria `this.bayZones` com as novas áreas clicáveis e mantém o vínculo da seleção da OS. Máquina, mecânicos, sombras, rótulos de box livre e indicadores passam a usar `activeBayLayout` simultaneamente.
- [x] **Apoio físico dentro de cada box:** `layout-math.js` inclui `placeMachineInBay()` para levar em conta o deslocamento entre centro visual e centro de apoio de rodas/esteiras (`footprintAnchorX`) e limitar a imagem ao espaço da área operacional. `placeWorkerInBay()` mantém mecânicos laterais visíveis dentro do box ao usar o fundo completo.
- [x] **Preservação das regras de manutenção:** motor diesel, diagnóstico, alocação, produtividade, turno de 12h, DDS, almoço e disponibilidade de 10,5HH não sofreram alteração nesta entrega.
- [x] **Testes de regressão:** `scripts/test-scene-profiles.cjs` valida separação de hitboxes, posicionamento de equipamentos e mecânicos, apoio no chão, limites de largura/altura e os dois modos de exibição. Integração no workflow de Pages com verificação obrigatória antes do deploy.
- [x] **Cache invalidado:** `game.js?v=0.8.1` e `layout-math.js?v=0.8.1` no HTML público.

### Verificações pendentes para homologação

- [ ] Testar **fundo diurno oficial** e comparar com a disposição aprovada na v0.7.6; nenhuma mudança visual relevante deve aparecer.
- [ ] Importar **imagem completa do galpão** pelo menu Visual, validar que placas BOX 1/2/3 coincidem com as OS e que a 6030 e os 777E permanecem dentro dos espaços corretos.
- [ ] Repetir no Turno B com o **asset noturno original**, preservado conforme `phaser-play/assets/OFICINA-NOTURNA.md`; confirmar alternância A→B→A e os mesmos pontos de apoio.
- [ ] Clicar diretamente nas máquinas, nos mecânicos e nas regiões vazias dos boxes: não pode abrir a OS do box vizinho.
- [ ] Conferir a proporção da 6030, 777E, DR410i e D9 no perfil completo (máquinas grandes precisam de limites sem perder a leitura visual de porte).
- [ ] Confirmar visibilidade do último mecânico do BOX 3 e alinhamento do chão nas resoluções usuais.
- [ ] **Pendência separada:** enviar o arquivo binário da noite para `main` e validar SHA-256; a preservação na Biblioteca e manifesto não equivale à publicação do asset.

**Critério de aceite:** todas as imagens da oficina selecionam e renderizam geometria compatível; rodas/esteiras e mecânicos ficam dentro do box certo; barra de progresso e clique correspondem à mesma OS. Não ajustar offsets isolados antes de validar o perfil do cenário escolhido.

## Entrega 0.8.2 — Reposicionamento físico do piso, assets e HUDs (implementada; homologação visual pendente)

**Evidência:** duas capturas fornecidas pelo usuário em 17/10/2026, sendo a segunda anotada com três zonas. A interpretação aprovada distingue **linha vermelha horizontal inferior = contato com o piso**, **bordas verdes laterais = limites permitidos para equipamentos/mecânicos**, **região azul inferior = percentual de diagnóstico**. **As bordas superiores dos retângulos verdes NÃO são restrições verticais.**

### Causa de engenharia

Na versão 0.8.1, `hitWorld` controlava simultaneamente o clique, a largura máxima do sprite e a posição do mecânico, enquanto `progressWorld.y=217` colocava os indicadores na região visual dos letreiros. O plano de contato `groundY=448` deixava máquinas e mecânicos aproximadamente **40 unidades do mundo** abaixo da linha de apoio indicada pelo usuário. Isso não podia ser resolvido apenas transladando máquinas para os lados.

### Alterações entregues

- [x] **Quatro geometrías independentes por box:** `hitWorld` (clique), `placementWorld` (limites laterais dos assets e linha de piso), `progressWorld` (HUD de percentual) e `footerWorld` (barra inferior identificadora da OS). `signageWorld` registra os letreiros para verificação de ausência de sobreposição.
- [x] **Perfil `fullFrame` calibrado segundo a captura:** `placementWorld.x=[450,738,1008]` e larguras `[228,228,202]` em coordenadas mundiais. Os limites verdes são somente laterais; `topY=101` é o limite técnico independente de altura disponível, não a borda superior da marcação.
- [x] **Máquinas e mecânicos elevados:** `spriteWorld.y=groundY=408` e `workerWorld[].y=408` nos três boxes completos (antes 448). As sombras de contato também utilizam `placementWorld.groundY`, reduzindo dimensões para caber dentro de cada envelope.
- [x] **HUD de diagnóstico abaixo da máquina:** `progressWorld.y=441` (antes 217), desenhando o card de 48px em `y=410…458`, imediatamente abaixo do piso em `y=408` e dentro da faixa azul marcada. Larguras dos cards **220/219/194** estão contidas nos envelopes verdes. Os letreiros `BOX 1/2/3` em `y≈166…203` ficam livres.
- [x] **Rodapé independente:** `footerWorld.y=470` e posições horizontais individuais; os badges HTML no rodapé passam a ler percentuais derivados do mundo Phaser, em vez de ocupar arbitrariamente colunas de um grid. No celular o rodapé continua fixado à borda inferior para manter legibilidade.
- [x] **Encaixe por `placementWorld`:** `equipmentSize()`, `placeMachineInBay()` e `placeWorkerInBay()` usam a área visual quando presente, nunca o `hitWorld` para dimensionar a arte. A área de clique permanece separada e reconstruída pelo perfil de fundo ativo.
- [x] **Suporte ao fundo previamente recortado:** os centros, tamanhos, apoio e progressos da v0.7.6 permanecem nos mesmos valores; apenas a nova separação semântica e o sistema de rodapé são compartilhados. A homologação visual desse perfil permanece pendente.
- [x] **Modo de verificação opcional:** acrescentar `&debugBoxes=1` à URL de Pages para mostrar os guias em **verde** (laterais), **vermelho** (contato), **azul** (indicador) e **violeta** (barra inferior), sem impactar o jogo padrão nem capturar cliques.
- [x] **Regressões em CI:** `scripts/test-scene-profiles.cjs` verifica os três fundos e zonas, colisões horizontais, encaixe de modelos grandes, piso, distância entre card e letreiro, intervalo entre diagnóstico e rodapé e posições do cenário da v0.7.6.

### Controle de qualidade pendente

- [ ] No fundo completo, validar que rodas/esteiras e pés correspondem à marcação horizontal vermelha; o recorte alfa dos PNGs pode introduzir diferenças entre **base total do sprite** e **ponto real de contato do rodado**.
- [ ] Em cada box, verificar CAT 777E, CAT 6030, CAT 336GC, DR410i e veículos com arte vetorial, observando interferência visual dos mecânicos com a máquina.
- [ ] Conferir na resolução 1703×821 (referência da captura) que a barra percentual ocupa a faixa azul **sem encobrir placas**, que ficam acima dela, e que a barra inferior de identificação não cobre informação essencial.
- [ ] Comparar visualmente o perfil recortado do dia, o perfil completo de noite e um fundo completo selecionado manualmente. Ajustar a posição conforme o enquadramento real do asset, não apenas pelo aspect ratio.
- [ ] Validar áreas clicáveis, animação dos mecânicos, menu sobreposto, responsividade mobile e linha de apoio ao trocar Turno A ↔ B ↔ A.

**Critério de aceite:** as máquinas e mecânicos estão no piso vermelho, limitados lateralmente ao verde; indicadores ficam na faixa azul abaixo dos equipamentos; nomes dos boxes e barras inferiores permanecem legíveis. O motor de 12h, 10,5 HH úteis e meta de produtividade 20–100 **não foi modificado**.

## Entrega 0.8.3 — CAT 777E em pixel art: substituição e escala (implementada; QA visual pendente)

**Solicitação:** substituir o asset antigo do 777E, cuja caçamba parecia excessivamente inclinada, pela nova pixel art aprovada pelo usuário, baseada na referência frontal 3/4, sem logos CAT/Caterpillar e com fundo transparente.

### Trabalho executado

- [x] **Novo arquivo binário real integrado ao GitHub:** `phaser-play/assets/equipment/cat777e_v2.webp` (**1100×781 px; 339.086 bytes**), criado a partir do PNG RGBA final de 1488×1057 px, com redução de resolução Lanczos, WebP qualidade 98 e canal alpha. A transparência é preservada sem fundo preto.
- [x] **Arte aprovada mantida:** cabine, chassis, caçamba, corrimãos, escadas, grade e rodados intactos na composição da imagem-fonte. Sprite com vista frontal 3/4 menos inclinada, sem marcas CAT/Caterpillar visíveis.
- [x] **Arquivo original protegido:** `caminhão_de_mineração_em_pixel_art.png` (1.835.427 B, SHA-256 `1269bd7498dce4dfe71653d41e213d5d44e5672bf4e538cccf07f67d9718f967`) guardado na Biblioteca do projeto em `/PORCARIA/Assets/Equipamentos/CAT777E_sem_logos_original.png`. O WebP otimizado também foi guardado ali como segunda cópia.
- [x] **Arquivo anterior conservado no Git:** `phaser-play/assets/equipment/cat777e.png` permanece como backup e não é mais referenciado pelo carregamento `truck` do Phaser. Nenhuma máquina adicional foi alterada.
- [x] **Integração Phaser:** `ASSETS.truck` aponta para `./assets/equipment/cat777e_v2.webp`. `MACHINES.EQ01` continua apontando para `truck`; a lógica e os saves de OS não precisam migrar.
- [x] **Escala e rodas:** em `scene-map.json`, `EQ01.scaleMultiplier=1.10`, `EQ01.footprintAnchorX=0.54`, largura máxima 265 e altura máxima 225; o perfil de `placementWorld` limita o equipamento ao envelope lateral do box no cenário completo, com `origin(.5,1)` apoiado no `groundY`.
- [x] **Nitidez de renderização:** o 777E usa filtro `LINEAR` ao reduzir o sprite detalhado de 1100px para aproximadamente 200px no jogo, evitando aliasing excessivo; os demais equipamentos continuam com o filtro `NEAREST` anterior.
- [x] **Manifesto de asset:** `phaser-play/assets/equipment/CAT777E_ASSET.md` documenta origem, duas versões, checksums, parâmetros, risco visual e rollback.
- [x] **Cache atualizado para v0.8.3:** `game.js?v=0.8.3` no HTML, sem alterar as referências independentes de módulos estáveis.
- [x] **Regressões e integridade binária:** `scripts/test-777-asset.cjs` verifica byte count, SHA-256, formato RIFF/WEBP/VP8X, canal alpha, dimensões, caminho utilizado no Phaser, layout e limites dos três boxes completos. O pipeline valida o checksum antes de publicar.

**SHA-256 do novo arquivo publicado:** `c0c304a84f7dad6e26e046877470d609c74148717ea355a2cd0beae0d33be7fd`.

### Homologação visual pendente

- [ ] Testar no **GitHub Pages** com o CAT 777E no BOX 1, BOX 2 e BOX 3, em fundo diurno e noturno.
- [ ] Confirmar a redução visual da inclinação e a correspondência com a referência fotográfica.
- [ ] Confirmar que o WebP mantém fundo realmente transparente e bordas sem halo visível no galpão.
- [ ] Verificar apoio das rodas na linha de chão (`groundY`) e ocupação lateral sem invadir o box vizinho.
- [ ] Verificar nitidez do asset a tamanho de jogo e o equilíbrio de escala com a CAT 6030 e a CAT 336GC.
- [ ] Conferir que nenhuma interação, HUD, mecânico, turno ou OS foi alterada ou regressou.

**Critério de aceite:** o caminhão novo aparece automaticamente no Pages, com pose frontal 3/4, sem logos e sem fundo, nas dimensões apropriadas e com as rodas apoiadas, sem deslocar o restante da oficina. Se o usuário não aprovar o tamanho, calibrar apenas o `EQ01` e não os boxes.

## Entrega 0.8.4 — Publicação do cenário noturno oficial e continuidade dia/noite (implementada; QA visual pendente)

**Motivação:** o fundo noturno entregue pelo usuário estava preservado na Biblioteca desde 16/10/2026, mas não integrava o Pages. Isso obrigava a importação manual em cada navegador e produzia, por padrão, apenas a versão diurna escurecida quando o turno B começava.

### Alterações concretas

- [x] **Publicação de binário autêntico:** `phaser-play/assets/oficina-noturna-hq.avif`, **1976×796 pixels**, **160.249 bytes**, AVIF extraído sem reprocessamento do arquivo previamente aprovado. **SHA-256:** `0637e55b3a1978842c7aa71e27c763b176ea7c8438a82ee5bc711140e1a72c15`. Original PNG preservado na Biblioteca pessoal sob `/PORCARIA/Assets/Oficina/Hangar Industrial Noturno sob a Chuva.png`; SHA-256 `fd4711611b7f83ca6f3428b5bbc59ae855cc800ab26dcd481b8c2eaf0c89ceee`.
- [x] **Preload e seleção por turno:** Phaser carrega o arquivo oficial sob a textura `repoNightWorkshopBG` com `?v=0.8.4`. No turno **A (dia)**, utiliza `repoWorkshopBG` com perfil `cropped`; no turno **B (noite)**, utiliza `repoNightWorkshopBG` com perfil `fullFrame`. A câmera, as dimensões do palco, os limites dos boxes e a disposição dos sprites permanecem como definidos em `scene-map.json`.
- [x] **Menu Visual informativo:** campo `sceneState` exibe de onde veio a imagem ativa: dia oficial, noite oficial, noite personalizada do navegador ou imagem personalizada para ambos os turnos. Isso permite identificar uma preferência local persistente que antes mascarava o fundo real.
- [x] **Personalização reversível:** `Substituir noite (opcional)` guarda a imagem do jogador apenas no navegador; `Restaurar noite oficial` elimina essa substituição sem afetar a campanha. `Restaurar dia/noite oficiais` remove a sobreposição global de fundo, preservando as preferências específicas da noite.
- [x] **Fallback transparente ao usuário:** somente se o navegador não conseguir carregar o AVIF oficial, o turno B exibe a versão diurna escurecida. Quando o arquivo existe, o original noturno é utilizado — não uma tonalização simulada.
- [x] **Arquivo de origem e manifesto:** `phaser-play/assets/OFICINA-NOTURNA.md` atualizado para distinguir **binário agora versionado** de **validação artística futura**, sem apagar o histórico dos arquivos de origem.
- [x] **Testes obrigatórios de implantação:** `scripts/test-night-workshop.cjs` verifica SHA-256, tamanho, cabeçalho AVIF `ftyp`, dimensões no box `ispe`, preload, precedência de personalizações, textos do menu, troca correta dos perfis e integridade do posicionamento dos três boxes. Pipeline `.github/workflows/deploy-pages.yml` exige o hash exato antes do deploy.
- [x] **Nenhuma alteração de simulação:** motor de manutenção, diagnóstico, HH úteis de 10,5h, turno de 12h, meta de produtividade, gestão PCM, mecânicos e sprite novo CAT 777E seguem inalterados.

### Homologação de navegador pendente

- [ ] Abrir um save no **turno A**, conferir o fundo diurno oficial, avançar para B e ver a **oficina noturna real**, avançar para A e retornar ao cenário diurno sem alteração de OS, posição de máquinas ou mecânicos.
- [ ] Em **VISUAL**, comprovar o rótulo `Noite: cenário oficial HQ do repositório`; testar a personalização noturna e `Restaurar noite oficial`.
- [ ] Conferir no celular e no desktop se a imagem de 1976×796 preenche o palco com nitidez adequada e se a perspectiva dos boxes coincide com a geometria `fullFrame` calibrada anteriormente.
- [ ] Verificar comportamento em navegador sem suporte a AVIF: fallback do turno B deve manter o jogo operacional, com indicação correta no menu.
- [ ] Garantir que o menu nunca passe cliques para os boxes enquanto aberto.

**Critério de aceite:** um usuário em um novo navegador, sem fundos personalizados, vê o **asset noturno correto** automaticamente a cada Turno B, sem escolher arquivo local. O sistema continua reversível e nenhuma geometria dos boxes ou progressão de jogo é modificada.

## Entrega 0.8.5 — Quadro de Prontidão Operacional e decisões de equipe (implementada; QA interativo pendente)

**Objetivo:** transformar a Gestão em apoio prático para decidir o próximo turno, além de exibir apenas os KPIs gerais. Um mecânico pode estar disponível, cansado, com moral comprometida, em descanso ou alocado em OS bloqueada — condições que precisam ficar explícitas antes de comprometer recursos. O sistema **não automatiza decisões** de descanso, compra, alocação nem avanço.

### Implementação

- [x] **Módulo novo e puro:** `phaser-play/readiness.js` expõe `window.PORCARIA_READINESS.compute(state,data)` e `module.exports` para testes Node. Não grava estado, não realiza compras, não muda OS nem altera o save. A ordenação dos alertas é determinística.
- [x] **Capacidade por turno e gargalo físico:** relatório informa `nominalCrewHH = mecânicos disponíveis × 10,5`, `boxLimitedHH = min(boxes,mecânicos disponíveis) × 10,5` e `additionalHH = min(boxes livres,mecânicos livres não descansando) × 10,5`. Distingue HH nominais de oportunidade, não estima produção real nem duração para encerramento da OS.
- [x] **Condição da equipe:** registra quantos estão alocados, livres, descansando, em atenção e em estado crítico; calcula a menor energia entre mental/física. Limiares fictícios e auditáveis: **energia abaixo de 25 = crítica; abaixo de 45 = atenção; moral abaixo de 25 = crítica; abaixo de 40 = atenção**. O uso de “crítico” é apenas a severidade do indicador do jogo e **não uma classificação médica ou de segurança ocupacional**.
- [x] **Situação por box:** `free`, `diagnosis`, `repair`, `tool`, `material` ou `unknown` conforme OS alocada, ferramenta existente, etapa de diagnóstico, peça e reserva (`materialUsed`). Um pedido de material em trânsito **não libera** reparo antes de ser recebido e baixado pelo motor.
- [x] **Painel Gestão visual:** quatro indicadores quantitativos, três cartões de box e lista priorizada de alertas com botões de navegação. Situações mais urgentes aparecem primeiro, sem cobrir a oficina Phaser.
- [x] **Atalhos funcionais:** bloqueio de peça/ferramenta abre o Almoxarifado com busca preenchida para o código; energia/moral abre Equipe; OS crítica sem equipe abre a OS vigente (somente se ainda existir). Sem ações silenciosas.
- [x] **Briefing de turno enriquecido:** informa teto de HH e contagem de profissionais com energia/moral em atenção ou crítica, com botão para abrir o quadro da Gestão, antes da confirmação de +12 horas.
- [x] **Testes automatizados:** `scripts/test-readiness.cjs` cobre pureza, determinismo, regras 10,5 HH, gargalo de 3 boxes, descanso, prioridade de alerta, energia e moral nos limiares, ferramentas, peças, reserva, ETA não antecipado, OS crítica sem alocação e integração de navegação/UI. `.github/workflows/deploy-pages.yml` exige esse teste e verificação sintática em toda publicação.
- [x] **Sem mudanças no core simulado:** faturamento, moral, fadiga, diagnóstico, ordens, contratação, turnos A/B, assets, cena diurna/noturna, coordenadas dos boxes e textos do jogo continuam baseados no motor e mapeamento anteriores.
- [x] **Versão em cache:** `readiness.js?v=0.8.5` é carregado antes de `game.js?v=0.8.5`; o Phaser sinaliza ausência do módulo ao iniciar, em vez de apresentar tela parcialmente quebrada.

### Limitações explícitas

- O quadro **não prevê falha, absenteísmo ou acidentes**; limiares e níveis são heurísticas de balanceamento.
- O teto de HH ignora aptidão por especialidade, horas efetivamente produzidas, sequência de diagnóstico e esperas logísticas. A leitura de capacidade **não substitui** programação operacional detalhada.
- A equipe “em atenção” é um aviso visual, **não impede a escala automaticamente**. O operador do jogo deve abrir Equipe e Planejamento para decidir.
- Alertas são derivados de dados do save no instante da consulta; não monitoram continuamente fora do jogo.

### Critérios de homologação no Pages

- [ ] Abrir Gestão no dia 1: **4 mecânicos × 10,5 HH = 42 HH disponíveis**, **3 boxes × 10,5 HH = teto 31,5 HH**, oportunidade para novos serviços até 31,5 HH, sem alocações.
- [ ] Alocar uma OS em um box: o contador de HH livres passa para no máximo **21 HH** (dois boxes livres); alterar meta e avançar turno deve atualizar a equipe sem travar.
- [ ] Reduzir energia física/mental ou moral ao longo da campanha: abrir Equipe pelo alerta; conferir recomendação de descanso sem ação automática.
- [ ] Criar OS com falta de ferramenta ou material, abrir Almoxarifado pelo botão e conferir o código filtrado. Peça em trânsito não deve ser exibida como disponível.
- [ ] Navegar do alerta de OS crítica até os detalhes, retornar à oficina e confirmar que o pop-up não ativa o box por trás.
- [ ] Confirmar que os fundos de dia/noite, as máquinas (incluindo novo 777E) e a precisão dos boxes permanecem inalterados.

**Critério de aceite:** leitura consistente e acionável do estado da oficina, sem prometer produtividade ou prever falhas; gestores conseguem identificar atenção de equipe e bloqueios com poucos cliques, sem regressões de save e cena.

## Entrega 0.8.6 — Consulta de OS, estoque e decisões rastreáveis (P0)

**Status:** **PR #25 integrado à `main` em 17/10/2026**, após aprovação da suíte Phaser no GitHub Actions. Deploy automático solicitado pelo push; confirmação do Pages e QA no navegador ainda pendentes.

### Problema resolvido

A versão 0.8.5 mostrava o nome da peça na tela de detalhes **antes** da conclusão das seis etapas de diagnóstico, embora a visão semanal evitasse revelar peças não confirmadas. Além disso, atalhos entre bloqueios e Almoxarifado não preservavam a OS que originou a consulta, e a Gestão limitava visualmente a lista aos seis primeiros alertas.

### Implementação

- [x] **Diagnóstico coerente:** antes da etapa 6, a prontidão da OS apresenta "Material a confirmar no diagnóstico"; a peça específica e o botão de consulta só aparecem após confirmar o diagnóstico. O motor mantém seus requisitos e a compra direta na OS não muda.
- [x] **Navegação OS → estoque → OS:** o botão de ferramental abre a ferramenta exata, e o botão de peça confirmada abre o material exato; a origem fica somente na memória da interface (não no save). O Almoxarifado exibe "Voltar à OS" e valida se ela ainda está aberta.
- [x] **Origem preservada nos alertas e briefing:** o bloqueio de peça/ferramenta do box traz o identificador da OS de origem. Atalhos de planejamento sem OS única continuam sem retorno associado.
- [x] **Sem consultas com efeitos colaterais:** abrir o Almoxarifado, filtrar um material, expandir um alerta e voltar à OS não alteram estoque, compras, turnos ou energia; operações de compra dependem de clique explícito.
- [x] **Alertas acessíveis:** os seis primeiros permanecem no quadro resumido, mas os demais são exibidos por controle "Mostrar mais" com `aria-expanded`; não são descartados.
- [x] **PWA:** recursos `readiness.js` e `game.js` têm querystring 0.8.6; cache service-worker versionado e inclui o módulo de prontidão.
- [x] **Automação:** teste `scripts/test-readiness-navigation.cjs`, atualização dos testes legados presos ao cache 0.8.5, suíte obrigatória de deploy e workflow de testes em pull requests.
- [x] **Sem alterações no estado persistente:** nenhum campo novo no JSON do save. Os fundos, assets, hitboxes dos três boxes e motor da manutenção permanecem inalterados.

### Homologação necessária no GitHub Pages

- [ ] Selecionar OS no início de jogo e verificar que **não aparece o código/nome da peça ainda não diagnosticada** na área de prontidão; verificar ferramental.
- [ ] Abrir ferramental da OS e confirmar filtro do código, identificação da OS e retorno exato à ordem original.
- [ ] Concluir o diagnóstico de uma OS; verificar que agora a peça e a opção "Ver peça confirmada" aparecem, navegar ao Almoxarifado e retornar.
- [ ] A partir de Gestão e Briefing, abrir alerta de box bloqueado e confirmar que o botão "Voltar à OS" leva ao serviço correto, mesmo que outra OS estivesse previamente selecionada.
- [ ] Gerar sete ou mais alertas, expandir e recolher; verificar que alertas adicionais são legíveis em desktop e celular.
- [ ] Confirmar que consultar insumo não dispara pedido, compra de ferramenta, passagem de turno ou alterações de save.
- [ ] Verificar comportamento de modal, telas pequenas, modo PWA/offline e cenas diurna/noturna. Teste físico/visual **não está coberto** pelos testes Node.

**Critério de aceite:** cada consulta mantém a referência do serviço; o diagnóstico não revela a peça antes da investigação; todos os alertas são acessíveis, sem regressões nas rotinas da oficina.

## Entrega 0.8.7 — Rastreamento e destaque da investigação (P0)

**Publicação técnica:** PR [#26](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/26) integrado na `main` (commit `a1fdebde`); a suíte do CI de PR concluiu com sucesso. O push aciona o workflow de GitHub Pages; **conclusão do deploy e verificação no navegador permanecem não confirmadas**.


**Problema:** a OS exibia somente o avanço numérico (`stage`), sem registrar o que foi confirmado e sem distinguir investigação guiada pelo jogador de descoberta automática do mecânico durante o turno.

**Implementado:**
- [x] **Etapa atual em primeiro plano:** título grande da fase atual (Sistema → Grupo → Subgrupo → Componente → Dano → Causa), índice 1/6–6/6, percentual e barra com atributos de acessibilidade.
- [x] **Mapa visual das seis fases:** resultados confirmados com sua descrição; etapa em andamento destacada; etapas futuras mostram apenas "A investigar", sem revelar resposta.
- [x] **Duas fontes de conhecimento:** painel "Você confirmou" para respostas corretas dadas manualmente e "Mecânico descobriu" para etapas que avançaram na simulação automática. Nome do mecânico e turno são registrados quando disponíveis.
- [x] **Registro de investigação:** eventos de acerto, hipótese incorreta, tentativa automática inconclusiva e evidência solicitada; tentativas não confirmadas não avançam o estágio.
- [x] **Evidência contextual:** indício pedido continua visível apenas depois de solicitação, agora em área destacada do quadro. A seção de decisão manual permanece separada abaixo do histórico.
- [x] **Save retrocompatível:** campo `job.diagnosticLog` opcional, sem alteração de `state.version`. Saves anteriores têm etapas já confirmadas reconstruídas pelos dados do cenário, em seção "Histórico anterior", **sem inventar a autoria nem recuperar palpites antigos**. Novas respostas e turnos passam a ser auditáveis.
- [x] **Módulos isolados:** `phaser-play/diagnostic-board.js` (projeção pura, sem mutação) e `phaser-play/diagnostic-view.js` (HTML escapado). Eventos são gravados apenas por `engine.js`.
- [x] **Responsividade e PWA:** UI adequada a três colunas no desktop e duas no celular, títulos acessíveis, cache dos dois módulos e versão 0.8.7 do cliente.
- [x] **Testes:** `scripts/test-diagnostic.cjs` para fluxos manual e automático, erro, evidência, não antecipação das respostas, leitura imutável, save legado, XSS e etapas concluídas; testes do Pages/PR exigem a suíte.

**Limites e decisões:**
- `job.wrong` inclui tanto erros do jogador quanto tentativas automáticas fracassadas; contador agregado, não índice separado de culpa.
- Descobertas anteriores à 0.8.7 não tinham autoria; só é seguro reconstituir resultados das fases efetivamente concluídas. Nem todas as tentativas antigas podem ser recuperadas.
- Respostas futuras e peças ainda não confirmadas não são mostradas; o jogador ainda precisa interpretar o sintoma e escolher as hipóteses.
- As regras de chance de sucesso, fadiga, progressão, turno, compras e economia **não mudaram**.

**Homologação em browser (pendente):**
- [ ] Abrir OS nova e confirmar “ETAPA 1 DE 6 · SISTEMA”, seis fases visuais e todos os resultados futuros ocultos.
- [ ] Errar hipótese: etapa não muda; registro informa hipótese incorreta sem mostrar a resposta correta.
- [ ] Acertar Sistema: mapa da etapa 1 confirmado, coluna "Você confirmou" mostra a escolha e atualiza fase 2.
- [ ] Solicitar evidência em fase em andamento: aparece somente após o clique.
- [ ] Alocar mecânico e avançar turno: descoberta automática aparece na seção do mecânico com nome e turno; progresso e fase são atualizados.
- [ ] Salvar/exportar/importar, recarregar PWA e conferir preservação do histórico e das autorias.
- [ ] Importar save anterior à 0.8.7 com diagnóstico parcial e verificar “Histórico anterior” sem autoria falsa.
- [ ] Testar em Android/desktop (rolagem, legibilidade, foco e modal), sem interferência nos fundos/boxes.

**Critério de aceite:** o jogador sabe imediatamente em qual fase está, o que já foi comprovado e por quem, sem respostas antecipadas ou registros inventados.

## Entrega 0.8.8 — Evidências didáticas sem spoilers (P0)

**Problema observado na v0.8.7:** `hint()` registrava o código da resposta correta em `diagnosticLog`; a projeção do painel também apresentava o valor de `scenario.path[stage]`, `component`, `damage` ou `verification` como indício. Isso transformava a opção “Solicitar evidência” numa forma de consultar o gabarito, principalmente nas três fases da localização funcional.

### Implementado na branch `feature/diagnostic-evidence-teaching-v088`

- [x] **Corrigido o vazamento na origem:** `engine.hint()` registra somente “Inspeção orientativa solicitada”, preservando o custo de 4 pontos de energia mental da chefia, 1 ponto do mecânico e 0,4 h na investigação.
- [x] **Orientação por fase:** cada uma das seis etapas tem uma pergunta-guia, objetivo e orientação sobre que decisão tomar, sem apontar a alternativa correta.
- [x] **Evidência solicitada = método, não resposta:** quando o jogador pede evidência, a interface expande passos de investigação relativos à fase, sem revelar sistema, grupo, subgrupo, componente, dano ou causa.
- [x] **Higienização retrocompatível:** `diagnostic-board.js` elimina da apresentação o valor bruto das antigas entradas `outcome='evidence'`, inclusive em saves importados; não modifica nem apaga o registro histórico persistido.
- [x] **Interpretação após a escolha:** ao confirmar uma etapa, o jogador pode expandir “Por que as etapas confirmadas importam” para ler o significado daquela identificação sem inferir automaticamente causa raiz.
- [x] **Critérios do catálogo:** definições de dano e causa provenientes de `game-data.json.catalog.damages/causes[].criteria` só são expostas depois de suas respectivas etapas serem confirmadas.
- [x] **Conclusão técnica do cenário:** `verification` e `lesson` da própria base são apresentadas em “Aprendizado do caso” somente quando a OS atinge `stage=6`. São referências didáticas, **não prova de que o teste foi executado no campo**.
- [x] **UI e PWA:** blocos responsivos `diagnosticCoach`, `diagnosticLearning` e `diagnosticCaseStudy`; recursos cacheados em v0.8.8.
- [x] **Teste antisspoiler:** `scripts/test-diagnostic-teaching.cjs` percorre todos os cenários, verifica ocultação de `lesson`/`verification` antes de 6/6, limpeza de indícios antigos, fluxo do motor, imutabilidade, HTML escapado e compatibilidade do cache; CI de PR e deploy exigem esse teste.

### Limites e dependências

- As orientações são **métodos de investigação do jogo**, não procedimentos OEM nem instruções executáveis com especificações de torque, pressão ou segurança.
- A descrição do relatório do operador continua visível desde a abertura da OS (informação inicialmente conhecida). Os testes e as lições do cenário continuam bloqueados até a conclusão.
- O comportamento da escolha, probabilidade do mecânico, punições, custo de evidência, meta de produtividade e estado do save são preservados.
- Os eventos antigos com gabarito continuam fisicamente no arquivo de save, mas não são apresentados pela interface; uma migração de dados opcional pode higienizar sua exportação futuramente.

### Homologação funcional no GitHub Pages

- [ ] Abrir uma OS nova, ler orientação da fase Sistema e conferir que a resposta correta não aparece antes da escolha.
- [ ] Solicitar evidência: verificar orientação de como investigar e custo no motor, sem nomes/códigos do gabarito.
- [ ] Errar uma hipótese, registrar a tentativa e confirmar que a resposta não é exposta.
- [ ] Acertar etapas e abrir “Por que as etapas confirmadas importam”, garantindo que nada sobre etapas futuras é revelado.
- [ ] Concluir a sexta etapa e verificar “Aprendizado do caso” com procedimento/explicação fiel ao cenário, claramente didáticos.
- [ ] Importar save antigo contendo um evento `evidence` com resposta, conferir que o texto não é renderizado pelo painel.
- [ ] Testar em desktop, mobile e PWA; conferir que fundo e boxes permanecem visualmente inalterados.

**Critério de aceite:** o sistema ensina por que uma confirmação importa, mas só revela a solução técnica completa depois da investigação, sem afetar os dados nem as regras de manutenção.

## Entrega 0.8.11 — Histórico de OS encerradas e dossiê de manutenção (P0 / jogo)

**Publicação:** PR [#30](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/30) integrado em `main` (merge `4c75e7e`), suíte de CI aprovada e workflow [GitHub Pages #39065055500](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39065055500) concluído com sucesso. A homologação manual de navegação, dados e responsividade permanece aberta.


**Problema:** na versão 0.8.10 o motor mantém OS concluídas em `state.done` (até 200), incluindo histórico de investigação, mas a tela Indicadores mostrava somente agregados. O diagnóstico e as descobertas técnicas desapareciam da interface quando a OS era concluída.

### Implementação

- [x] **Histórico de OS concluídas** em Indicadores, consultável inclusive quando não existem OS abertas, com busca por número de OS, modelo, título do caso e relato operacional.
- [x] **Dossiê de encerramento** com título do equipamento, identificação da OS, relatório do operador, status, turno de encerramento e seis fases de investigação preservadas.
- [x] **Reutilização do painel diagnóstico** para conferir o que o jogador confirmou, o que o mecânico descobriu e os registros legados sem atribuição inventada.
- [x] **Indicadores por OS** apresentados com terminologia explícita: tempo decorrido (horas corridas), esforço registrado (HH), custo de mão de obra da simulação, valor unitário de material registrado, receita fictícia, retrabalho e bloqueios por peça/ferramental.
- [x] **Sem margem fictícia:** receita e custos são apresentados separadamente; não há cálculo de lucro ou rentabilidade sem base completa.
- [x] **Segurança de dados:** apresentação HTML escapada, filtro em memória e leitura pura; nenhuma alteração em `engine.js`, `state.version` ou formato do save.
- [x] **Compatibilidade:** registros antigos sem campo de custo/classificação exibem informação não registrada, não conclusões inventadas; o histórico é limitado à retenção real de 200 OS já aplicada pelo motor.
- [x] **Navegação reversível:** botão de retornar à listagem, pesquisa responsiva e limpeza de contexto após reiniciar/importar campanha.
- [x] **Implementação modular:** `phaser-play/closed-orders.js` (projeção + apresentação), `scripts/test-closed-orders.cjs`, inclusão no CI de PR e no workflow de Pages.
- [x] **Versões e cache:** script principal `game.js?v=0.8.11`, módulo do histórico `closed-orders.js?v=0.8.11` e PWA `porcaria-vqec-20261017-v091`.

### Plano de homologação funcional (pendente)

- [ ] Avançar turnos até concluir uma OS, entrar em **Indicadores → Histórico de OS concluídas** e localizar o serviço.
- [ ] Abrir a OS encerrada; comparar etapa final, respostas confirmadas, autoria do mecânico e lição técnica com as etapas visualizadas durante a investigação.
- [ ] Comparar horas trabalhadas e tempo decorrido, custo de mão de obra e valor unitário de material com o que o motor efetivamente registrou, sem exibir receita como lucro.
- [ ] Confirmar busca parcial, sem correspondências e retorno à lista; testar teclado e celular.
- [ ] Importar save antigo com OS concluídas sem histórico de autoria ou sem métrica de encerramento: informação faltante não deve ser inventada.
- [ ] Reiniciar a campanha, conferir a limpeza de seleção e a inexistência de modificações no save apenas por consultar o histórico.
- [ ] Abrir o histórico sem nenhuma OS ativa, incluindo cenário com apenas serviços encerrados.

**Critério de aceite:** uma OS deixa de ocupar o box ao ser concluída, mas mantém consulta técnica a investigação, resultados e indicadores dentro da oficina; a navegação não altera nenhum dado operacional.

## Entrega 0.8.10 — Sprite oficial CAT 777E em pixel art (P0 / arte)

**Status:** **publicado na `main`** por meio do [PR #29](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/29), merge `c6e346db` em 17/10/2026. CI de PR aprovado e workflow [Deploy P.O.R.C.A.R.I.A. to GitHub Pages](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39059085461) concluído com sucesso, incluindo verificação do SHA-256 da imagem e regressão. **Homologação visual e funcional no navegador ainda pendente.**

### Decisão visual implementada

- [x] **Asset novo e exato enviado ao GitHub:** `phaser-play/assets/equipment/cat777e_v3.webp`, WebP VP8L lossless com alfa, 1100 × 781 px, **622.844 bytes**.
- [x] **SHA-256:** `bec258a0b4afb512cae047a0a3c10ff7072be2dba5156b826c57fb0ca137a4bd`.
- [x] **Git blob SHA-1:** `5edb793900159cd0b2a76a07dccd5800aa52cd67`; hash verificado idêntico ao arquivo de origem antes da integração.
- [x] **Arte aprovada:** perspectiva frontal em três quartos com câmera à altura da cabine, pixel art sem marcas CAT, calços amarelos localizados **na frente e atrás da roda traseira visível**. São parte da representação de máquina imobilizada na oficina; não substituem um procedimento real de bloqueio.
- [x] **Backup para rollback:** tanto `cat777e_v2.webp` quanto `cat777e.png` continuam versionados.
- [x] **Runtime:** `ASSETS.truck` aponta para v3 e `scene-map.json.modelPresentation.EQ01.texturePath` contém o novo caminho e checksum. Restrições geométricas dos boxes e parâmetros de escala mantidos.
- [x] **Aprimoramento da transição:** a chave de preferência de upload local no menu Visual foi versionada; um preview antigo da v0.8.9 não substitui silenciosamente o novo sprite oficial. O jogador ainda pode testar outra textura e restaurar a versão v3.
- [x] **PWA:** v0.8.10 e cache `porcaria-vqec-20261017-v090`, com o novo WebP incluído no cache offline.
- [x] **Validação automatizada:** `scripts/test-777-asset.cjs` exige RIFF/VP8L, alfa, dimensão exata, tamanho, SHA-256, presença dos backups, caminho v3, encaixe horizontal e vertical em três boxes; workflow do GitHub Pages só publica se hash do arquivo bater com o aprovado.
- [x] **Manifesto artístico** atualizado em `phaser-play/assets/equipment/CAT777E_ASSET.md`.

### O que foi preservado

Sem alteração em `engine.js`, saves, códigos de cenário, economia, energia, turnos, equipamento lógico `EQ01`, hitboxes dos boxes, posições de mecânicos, fundos diurno/noturno ou interface de diagnóstico. Filtro LINEAR para minificação da textura grande foi mantido até comparação visual com NEAREST.

### Homologação no Pages

- [ ] Abrir sem preview local e alocar OS do 777E para confirmar carregamento da textura v3.
- [ ] Examinar BOX 1, 2 e 3 com cenário diurno e noturno: cabine, caçamba, rodas, margem e contato com piso.
- [ ] Confirmar que não há marca CAT e que dois calços amarelos aparecem na frente e atrás da roda traseira visível.
- [ ] Confirmar que outros equipamentos não foram alterados.
- [ ] Conferir atualização automática do PWA (sem reinstalação) e opção do menu Visual para testar/restaurar outros sprites sem mudar saves.
- [ ] Se a minificação prejudicar leitura da pixel art, comparar filtro LINEAR/NEAREST em mudança separada e documentada.

**Critério de aceite:** v3 renderizada por padrão, integridade do arquivo verificada, fallback versionado e publicação automatizada aprovada. A homologação visual por dispositivo permanece separada da aprovação dos testes Node.

## Entrega 0.8.9 — Revisão da perspectiva do CAT 777E (P0 / arte)

**Integração:** PR [#28](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/28) integrado na `main`, commit `0deb47c8`. CI de PR aprovado, e o workflow `Deploy P.O.R.C.A.R.I.A. to GitHub Pages` do commit concluiu com sucesso. O sprite de teste precisa ser importado manualmente pelo jogador, pois não foi incorporado ao repositório.


**Solicitação:** o caminhão publicado na 0.8.3 tem ângulo de câmera excessivamente baixo, olhando de baixo para cima; isso destoa do ponto de vista do galpão. A referência enviada requer vista frontal em três quartos, com câmera acima do solo em altura de cabine e eixo de visão horizontal. O novo sprite deve ter perspectiva coerente com o piso e manter cabine, rodas, escadas e caçamba identificáveis.

### Novos candidatos de arte (externos ao repositório)
- [x] Arte de comparação gerada para análise e convertida para recorte com transparência e sem sombra de estúdio.
- [x] PNG de trabalho e WebP otimizado em 1100 × 781 px (mesmas dimensões nominais da textura atual), entregues ao solicitante na conversa.
- [ ] **Aprovação visual da perspectiva:** o candidato é aproximação gerada, não reprodução geométrica exata de fotografia. Confirmar em jogo se altura da câmera e ângulo correspondem à referência.
- [ ] **Incorporar WebP binário no repositório como asset versionado** após aprovação; esta entrega publica **o mecanismo de comparação**, não substitui a textura `cat777e_v2.webp`.
- [ ] Revisar logos, número de modelo, silhueta, posição das rodas e licenciamento/proveniência da arte antes de promovê-la a sprite definitivo.

### Comparação no Phaser (código implementado)
- [x] `VISUAL → Testar PNG/WebP do 777E` permite importar o candidato sem modificar o motor da simulação.
- [x] `truckCustom` substitui exclusivamente os sprites `EQ01`/CAT 777E; outros modelos mantêm seus assets.
- [x] Importação local persistida em IndexedDB, **fora do save da campanha**; restaurada após recarga do navegador.
- [x] Limites de arquivo: PNG/WebP, até 5 MB, largura e altura de 100–4096 px; filtragem LINEAR.
- [x] Recalcula a textura recortada `trim_truckCustom` ao substituir arquivo e atualiza a cena, mantendo tamanho e geometria calculados por `layout-math.js`.
- [x] `Restaurar 777E oficial` remove a textura local e seu registro do IndexedDB; preserva o arquivo binário original do jogo.
- [x] Status e miniatura local no menu Visual, que passa a rolar em viewport estreita.
- [x] Novo teste `scripts/test-777-override.cjs` na suíte de PR e deploy. Cache PWA passa para `v089` e script principal para `0.8.9`.

### Homologação no Pages
- [ ] Abrir Visual, conferir que o estado inicial é “sprite oficial do jogo”.
- [ ] Importar o WebP de 1100 × 781 fornecido na conversa e verificar miniatura/status de teste.
- [ ] Alocar uma OS do CAT 777E nos BOX 1, 2 e 3 em situações diferentes, avaliando escala, apoio das rodas no piso e coerência visual com fundo diurno/noturno.
- [ ] Verificar que os outros equipamentos não trocam de textura e que o upload não modifica OS, estoque, energia ou save.
- [ ] Recarregar a página, verificar persistência local; usar “Restaurar 777E oficial” e confirmar retorno exato ao asset `cat777e_v2.webp`.
- [ ] Testar importação no desktop e Android, arquivo incompatível, limites de tamanho e comportamento offline PWA.

**Critério de aceite:** importar, comparar e reverter o candidato do 777E sem alterar textura oficial ou estado da campanha. **Aprovação artística e publicação binária como sprite definitivo permanecem separadas.**

## Entrega 0.8 — Gestão avançada de manutenção (P1)

- [x] **Etapa inicial (v0.7.8):** priorização por criticidade, idade da OS e bloqueio de insumos, com pontuação de jogo explícita. **Pendente:** modelagem calibrável de risco e impacto operacional.
- [ ] **Programação semanal vinculante por OS**, com conflitos de HH, boxes e materiais e lógica de produtividade. *A v0.7.9 entregou somente a visão semanal da capacidade nominal e dos recursos já conhecidos (14 turnos), sem prometer datas de conclusão.*
- [ ] Preventiva versus corretiva com efeito sobre falhas futuras **simulado e calibrável**, sem prometer comportamento real.
- [ ] Especialidades técnicas, curva de experiência e fadiga com limites auditáveis.
- [ ] KPIs de backlog, tempo médio de reparo, primeira execução correta, utilização e custo.
- [ ] Eventos narrativos de operação e oficina, sem trivializar segurança.

**Critério de aceite:** decisões de PCM produzem consequências claras e balanceadas ao longo de vários turnos.

## Entrega 0.9 — Arte, balanceamento e conteúdo (P2)

- [ ] Revisar arte de CAT 777, CAT 6030, escavadeiras, perfuratrizes e personagens.
- [ ] Consolidar atlas local, licenças/proveniência e manifesto de recursos; eliminar dependência dos PNGs servidos por branch externa.
- [ ] Ajustar curva de custos, receita fictícia, lead time, energia, moral e frequência de ocorrências.
- [ ] Incluir tutorial curto e salvamento/migração de versão.
- [ ] Testar responsividade, desempenho e cache PWA.
- [ ] Garantir que as cenas respeitem o resultado da revisão de sprites, sem presumir homologação das imagens reprovadas.

## Riscos técnicos conhecidos

| Risco | Impacto | Tratativa |
|---|---|---|
| Carregamento de PNG por URL externa à versão implantada | Arte pode sumir se a branch/arquivo mudar | Migrar para assets locais versionados |
| Save local sem migração formal | Mudanças no esquema podem perder progresso | Versionar contrato e implementar migrador |
| Estado Phaser + DOM HTML | Entrada duplicada ou pop-ups sobrepondo boxes | Testes de regressão e controle de interação |
| Cenas simuladas, não telemetria real | Interpretação equivocada de desempenho | Rotular como fictício e documentar premissas |
| Teste de sintaxe e motor sem navegador | Bugs interativos ainda passam pelo deploy | Adicionar Playwright e teste mobile em CI |
| Dependência do CDN Phaser | Falha offline | Vendor/bundle local e definir política de licença |

## Plano de validação para a versão 0.8.11

1. Acessar **Oficina 2D** pelo GitHub Pages.
2. Confirmar que o HUD e os três boxes aparecem sem dados inesperados.
3. Abrir e fechar todos os pop-ups; clicar sobre a região dos boxes com o menu aberto e confirmar que a OS não muda.
4. Digitar uma palavra inteira na pesquisa da fila e filtrar OS alocadas/críticas.
5. Abrir uma OS, verificar material e ferramenta, navegar ao estoque e efetuar uma compra.
6. Motivar/descansar um profissional disponível e confirmar alteração de energia/moral.
7. Avançar turno após conferir o resumo de bloqueios e conferir logs, caixa e progresso.
8. Exportar o save, importar o mesmo arquivo e verificar continuidade.
9. Repetir o fluxo no celular; registrar qualquer bloqueio de UI ou escala inadequada.

## Política de testes e publicação

O workflow `.github/workflows/deploy-pages.yml` executa `node --check` e `node scripts/smoke-phaser.cjs` antes do upload. O smoke-test cobre:

- Save inicial e serialização;
- três boxes sem sobreposição e layout versionado;
- alocação, bloqueio de dupla alocação e liberação;
- descanso e impedimento de nova alocação durante o descanso;
- avanço de turno e retorno numérico da simulação.

**Pendência:** estes testes não substituem o Playwright ou QA real do canvas, do carregamento de imagens nem da navegação pop-up. Se o CI falhar, corrigir antes de declarar que a versão está no ar.

## Registro de evolução

- **0.1:** primeira cena Phaser e integração ao motor existente.
- **0.2:** enquadramento limitado aos três boxes; menus pop-up.
- **0.3:** Equipe e Almoxarifado operacionais.
- **0.4:** indicadores de boxes, filtros, atalhos, avisos, resumo de turno.
- **0.4.1:** bloqueio de cliques no Phaser atrás do modal.
- **0.5:** prontidão da OS, atalho ao Almoxarifado, busca da fila sem perda de foco, importação de save validada e documentação deste roadmap.
- **0.6-dev:** idade de OS e bloqueios na fila, previsão de turno por categoria, coordenadas dos boxes em JSON, fundo personalizado armazenado no navegador, smoke-test automatizado e roadmap atualizado.
- **0.7-dev:** fundo limpo oficial enviado ao GitHub em AVIF com integridade verificada, recorte e hotspots calibrados para três boxes, sprites posicionados pelo JSON, progressos por fase, restauração do fundo padrão e testes geométricos ampliados.
- **0.7.1:** interface bege aposentada da rota principal, Gestão reimplementada como modal escuro, PWA iniciando no Phaser, fundo oficial atualizado de 900×363 para 1350×563 com filtragem independente dos sprites, veículos rebaixados, sombra de contato, progresso reposicionado e smoke-test ampliado.
- **0.7.2:** sprites de equipamentos e oito poses de dois mecânicos incorporados à `main`; veículos estáticos e rebaixados, profissionais laterais orientados ao equipamento, animação contextual de poses dos mecânicos, fallback D9 aprimorado, redução de movimento e testes estáticos de asset/posicionamento. **Implementado — homologação visual pendente.**
- **0.7.3:** navegação reorganizada em duas faixas, indicadores separados, botão principal de turno no header, menu Visual para personalização do cenário, realce dos menus ativos, rolagem horizontal em telas estreitas, foco e comportamento de teclado aprimorados; testes CI e QA visual pendente.
- **0.7.4:** composição deslocada 22 px nas laterais, escala configurável por modelo (CAT 6030 2×, DR410i 3× nominal), recorte alfa dos sprites, preservação da textura de fundo em 1350 px e separação de filtros, módulo de geometria testável e regressões de tamanho/posição. **Código implementado; testes e homologação visual devem ser verificados no Pages.**
- **0.7.5:** offsets adicionais de −72/+40/+82 px nos três boxes, mantendo hotspots/indicadores arquitetônicos fixos; clamp visual para evitar cortes, sombras alinhadas ao centro renderizado, clique direto nas imagens para selecionar a OS correta e testes específicos de geometria. **Código implementado; QA visual pendente.**
- **0.7.6:** ajustes incrementais BOX 1 +20 px, BOX 2 −6 px, BOX 3 sem modificação; função `calibratedCenter()` garante que o movimento se manifeste mesmo quando sprites estavam limitados pela câmera; testes de posição e regressão; QA visual pendente.
- **0.7.7:** briefing pré-turno dentro do modal Phaser, com três boxes, bloqueios específicos, ETA ao fim do turno, fadiga, folha, OS crítica sem equipe e atalhos de OS/almoxarifado; fluxo confirmar/cancelar; testes puros de leitura do estado e CI. **Implementado; QA funcional/visual pendente.**
- **0.7.8:** planejamento PCM de curto prazo, índice heurístico transparente, comparação de especialidades/capacidade de HH brutas, recomendações com alocação explicitamente autorizada, bloqueios por insumos e atalhos contextuais. Módulo puro e testes adicionados; **homologação funcional pendente**.
- **0.7.9:** janela de capacidade de 14 turnos, HH brutas sem extrapolar produtividade, necessidades de peças apenas após diagnóstico, entregas no fim do turno, referência de folha fixa, hipóteses explícitas e testes automatizados; **QA visual e funcional pendente**.
- **0.8.0:** 12h/turno, DDS 0,5h e almoço 1h, 10,5 HH/mecânico, meta 20–100 (60 estável; fadiga exponencial acima; moral abaixo), interface e PCM recalibrados. PNG noturno original e AVIF derivados arquivados, hashes no manifesto; **publicação do binário noturno ainda pendente**.
- **0.8.1:** elimina corte de imagem decidido pela proporção, mapeia separadamente o galpão recortado e o cenário completo, alterna hitboxes/indicadores/sprites em conjunto e usa limites físicos de box e centro de apoio do equipamento. Testes geométricos em CI. **QA visual no Pages pendente.**
- **0.8.2:** distingue clique, área visual, indicador e footer; sobe rodado/mecânicos para linha de apoio, desloca barras para a faixa inferior e limita sprites pelas laterais dos boxes; habilita guias opcionais `debugBoxes=1`. **Testes de geometria automatizados; QA visual pendente.**
- **0.8.3:** substitui o sprite do 777E por arte frontal 3/4 sem logos e com fundo transparente (WebP + alpha), calibra escala/footprint e minificação, arquiva original PNG e mantém asset anterior como backup; adiciona manifesto, SHA-256 e testes obrigatórios no deploy. **QA visual pendente.**
- **0.8.4:** arquivo original noturno otimizado publicado no repositório (AVIF de 1976×796, SHA-256 auditado), alternância automática por turno com perfil geométrico apropriado, origem exibida no menu Visual, personalizações opcionais e restauração do cenário oficial; testes binários e regressão em CI. **QA visual pendente.**
- **0.8.5:** quadro consultivo de prontidão, capacidade nominal de 10,5 HH por mecânico e gargalo de três boxes, condição física/mental e moral, alertas de bloqueios e OS críticas, links de ação manual e resumo no briefing; testes de pureza e limites integrados ao Pages. **QA interativo pendente.**
- **0.8.6:** retira spoiler da peça no detalhe antes do diagnóstico, cria consulta de insumos vinculada à OS com retorno validado, expande alertas além dos seis principais, mantém toda ação manual, atualiza cache e testes de PR/deploy; **QA interativo e visual pendente.**
- **0.8.7:** quadro visual de diagnóstico por OS com seis etapas, autoria e descrição das confirmações, descobertas do mecânico, tentativas inconclusivas, evidências e compatibilidade com saves legados. **QA interativo pendente.**
- **0.8.8:** evidências orientativas sem revelar respostas, coach de investigação por etapa, explicações pós-confirmação com critérios de catálogo para dano/causa, lição de cenário apenas após 6/6, limpeza visual de dicas legadas e testes de segurança pedagógica. **QA visual/interativo pendente.**
- **0.8.9:** permite carregar PNG/WebP do 777E localmente para comparação no Phaser, persistir em IndexedDB e restaurar o sprite oficial; código, PWA e regressões atualizados, sem substituição binária e **QA visual pendente**.
- **0.8.10:** sprite oficial v3 em WebP lossless/alpha, pixel art aprovado sem logos e com calços na roda traseira visível; versão v2 preservada, chave de preview local renovada, cache PWA atualizado, arquivo/hash e geometria testados, manifesto atualizado. **QA visual do Pages pendente.**
- **0.8.11:** histórico buscável de OS concluídas em Indicadores, dossiê individual com diagnóstico, autoria, aprendizado e indicadores reais do save; nova suíte de regressão e cache. **QA interativo e visual pendente.**

### Organização recomendada

- **`phaser-play/`** — implementação do jogo Phaser
- **`engine.js`** — regras simuladas e estado
- **`game-data.json`** — catálogos e cenários
- **`phaser/assets-review/`** — revisão artística (pode estar em branch separada)
- **`phaser-play/ROADMAP.md`** — fonte de verdade para escopo e prioridades do Phaser
- **GitHub Issues / PRs** — bugs, testes e aprovações específicas

Atualize este roadmap a cada entrega; só marcar um requisito como **homologado** após validação real no navegador.
