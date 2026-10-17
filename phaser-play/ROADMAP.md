# P.O.R.C.A.R.I.A. — Roadmap de desenvolvimento

**Projeto:** *Você Quebra, Eu Conserto* · jogo de gestão de manutenção de equipamentos de mineração.
**Interface-alvo:** oficina 2D em Phaser 3, com três boxes visíveis e menus pop-up.
**Estado de referência:** 17/10/2026 · **Phaser 0.8.1 — perfis geométricos independentes para fundos recortados/completos; homologação visual pendente.**
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

## Plano de validação para a versão 0.8.1

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

### Organização recomendada

- **`phaser-play/`** — implementação do jogo Phaser
- **`engine.js`** — regras simuladas e estado
- **`game-data.json`** — catálogos e cenários
- **`phaser/assets-review/`** — revisão artística (pode estar em branch separada)
- **`phaser-play/ROADMAP.md`** — fonte de verdade para escopo e prioridades do Phaser
- **GitHub Issues / PRs** — bugs, testes e aprovações específicas

Atualize este roadmap a cada entrega; só marcar um requisito como **homologado** após validação real no navegador.
