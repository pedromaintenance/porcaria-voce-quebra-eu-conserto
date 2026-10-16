# P.O.R.C.A.R.I.A. — Roadmap de desenvolvimento

**Projeto:** *Você Quebra, Eu Conserto* · jogo de gestão de manutenção de equipamentos de mineração.
**Interface-alvo:** oficina 2D em Phaser 3, com três boxes visíveis e menus pop-up.
**Estado de referência:** 16/10/2026 · versão de trabalho **Phaser 0.6-dev** (código entregue, QA visual pendente).
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
| Menus pop-up | Implementado, QA pendente | Fila, Ordem, Equipe, Almoxarifado, Indicadores, Ajuda |
| Isolamento de entrada do Phaser | Implementado, QA pendente | Não selecionar boxes sob pop-ups |
| Estado da oficina | Implementado, QA pendente | Status por box, seleção destacada, fila pesquisável |
| Motor de manutenção | Existente, parcialmente exposto | Diagnóstico em seis níveis, peças, ferramentas, alocação e turnos |
| Gestão de equipe | Implementado, QA pendente | Moral/energia, descanso, motivação, contratação |
| Almoxarifado | Implementado, QA pendente | Saldos, pedido normal/urgente, ferramentas e itens em trânsito |
| Prontidão da OS | **0.5 — implementado, QA pendente** | Disponibilidade de peça/ferramenta, quantidade em trânsito e atalho para estoque |
| Mapeamento visual dos boxes | **0.6-dev — implementado, QA pendente** | Arquivo `scene-map.json` centraliza posição dos sprites e zonas clicáveis |
| Background personalizável | **0.6-dev — implementado, QA pendente** | Importação de PNG/JPEG/WebP pelo jogador e persistência IndexedDB; imagem limpa ainda não publicada no repo |
| Backlog e previsão de turno | **0.6-dev — implementado, QA pendente** | Tempo de espera, avisos de bloqueios, diagnóstico/reparo e pedidos previstos |
| Testes de regressão no CI | **0.6-dev — implementado, execução pendente** | Smoke-test Node como pré-condição para Pages |
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

## Cenário de referência e integração de arte — 0.6-dev

A imagem indicada para a nova oficina é uma **composição de interface**, com máquinas, pessoas e HUD já desenhados. Não pode servir diretamente como fundo definitivo de sprites independentes sem causar duplicação.

- **Arquivo de mapeamento:** `phaser-play/scene-map.json`.
- **Referência:** 1672 × 941 px, três boxes; recorte inicialmente estimado em `x=359, y=246, largura=1045, altura=407`.
- **Cena Phaser:** 1080 × 450 px, câmera world scroll `(319,45)`.
- **Zonas clicáveis no mundo:** Box 1 `(324,155,337,323)`, Box 2 `(679,155,337,323)`, Box 3 `(1034,155,337,323)`.
- **Sprites independentes:** coordenadas `spriteWorld` e `workerWorld` por box, editáveis no JSON.
- **Substituição temporária:** botão **CENÁRIO** permite carregar PNG/JPEG/WebP do computador, aplica recorte e guarda no IndexedDB do navegador; **PADRÃO** restaura a cena vetorial.
- **Integração automática preparada:** ao adicionar `phaser-play/assets/oficina-base.png` na branch `main`, o Phaser carrega a imagem como fundo; imagens panorâmicas usam a área inteira e screenshots completos (proporção 1672×941) são recortados para os boxes. A personalização salva no navegador tem precedência.
- **Limitação:** a imagem enviada nesta conversa ainda **não foi publicada como PNG no GitHub**. A funcionalidade de importar a imagem pelo navegador não equivale a um asset incluído no repositório.
- **Pendente P0:** produzir/fornecer versão limpa **sem equipamentos, personagens, HUD ou textos duplicados**, registrar `phaser-play/assets/oficina-base.png` e configurar carregamento automático. Caso o PNG contenha veículos, não sobrepor sprites móveis sem primeiro removê-los da base.
- **Pendente P0:** validar manualmente alinhamento dos três hotspots com o fundo final em resoluções desktop e mobile; refinar as coordenadas do JSON conforme necessário.

## Entrega 0.7 — Oficina viva (P1)

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
| Apenas verificação sintática no CI | Bugs interativos passam pelo deploy | Adicionar testes de motor e Playwright em CI |
| Dependência do CDN Phaser | Falha offline | Vendor/bundle local e definir política de licença |

## Plano de validação para a versão 0.5

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

### Organização recomendada

- **`phaser-play/`** — implementação do jogo Phaser
- **`engine.js`** — regras simuladas e estado
- **`game-data.json`** — catálogos e cenários
- **`phaser/assets-review/`** — revisão artística (pode estar em branch separada)
- **`phaser-play/ROADMAP.md`** — fonte de verdade para escopo e prioridades do Phaser
- **GitHub Issues / PRs** — bugs, testes e aprovações específicas

Atualize este roadmap a cada entrega; só marcar um requisito como **homologado** após validação real no navegador.
