# P.O.R.C.A.R.I.A. — Roadmap de desenvolvimento

**Projeto:** *Você Quebra, Eu Conserto* · jogo de gestão de manutenção de equipamentos de mineração.
**Interface-alvo:** oficina 2D em Phaser 3, com três boxes visíveis e menus pop-up.
**Estado de referência:** 16/10/2026 · versão de trabalho **Phaser 0.7.1** (integração de gestão, novo asset HQ e correção de piso implementados; homologação visual pendente).
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
| Menus pop-up | Implementado, QA pendente | Fila, Ordem, Equipe, Almoxarifado, Indicadores, Ajuda |
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

## Entrega 0.7.2 — Oficina viva (P1)

- [ ] Sprites de mecânicos em estados *idle*, caminhada, diagnóstico, reparo e descanso.
- [ ] Indicadores visuais sincronizados ao motor: progresso da OS, bloqueio, liberação de equipamento.
- [ ] Animações simples de ferramentas, iluminação, circulação e transição entre turnos.
- [ ] Padronizar resolução, origem, transparência, orientação e escala dos sprites.
- [ ] Introduzir camadas de cenário, sombras e *occlusion* sem prejudicar legibilidade.
- [ ] Modo reduzido de movimento para acessibilidade e desempenho.

**Critério de aceite:** os boxes deixam de parecer estáticos e representam de maneira inteligível os estados de execução.

## Entrega 0.8 — Gestão avançada de manutenção (P1)

- [ ] Priorização por criticidade, idade da nota, risco e impacto operacional.
- [ ] Planejamento semanal de serviços versus capacidade de HH, ferramentas e sobressalentes.
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

## Plano de validação para a versão 0.7.1

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

### Organização recomendada

- **`phaser-play/`** — implementação do jogo Phaser
- **`engine.js`** — regras simuladas e estado
- **`game-data.json`** — catálogos e cenários
- **`phaser/assets-review/`** — revisão artística (pode estar em branch separada)
- **`phaser-play/ROADMAP.md`** — fonte de verdade para escopo e prioridades do Phaser
- **GitHub Issues / PRs** — bugs, testes e aprovações específicas

Atualize este roadmap a cada entrega; só marcar um requisito como **homologado** após validação real no navegador.
