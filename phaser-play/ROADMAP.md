# P.O.R.C.A.R.I.A. — Roadmap de desenvolvimento

**Projeto:** *Você Quebra, Eu Conserto* · jogo de gestão de manutenção de equipamentos de mineração.
**Interface-alvo:** oficina 2D em Phaser 3, com três boxes visíveis e menus pop-up.
**Estado de referência:** 21/10/2026 · **v0.9.13 — Lições Aprendidas com reflexões por OS, recorrência e proteção contra spoiler; QA visual pendente.**
**Jogo de teste:** https://pedromaintenance.github.io/porcaria-voce-quebra-eu-conserto/phaser-play/

> Status abaixo significa implementação no código, **não homologação funcional nem aprovação artística**. O deploy do Pages é executado automaticamente, mas deve ser conferido no GitHub Actions; o teste interativo permanece necessário.

## Entrega 0.9.13 — Lições Aprendidas, ciclo 10 (21/10/2026)

- [x] Criar dossiês pós-OS concluída relacionando relato, eventos do diagnóstico, hipótese didática FMEA, retrabalho, indisponibilidade, espera por insumo e resultado observado.
- [x] Implementar **Planejamento → Lições Aprendidas**, com filtros de revisão, dossiês e formulário de reflexão técnica do supervisor.
- [x] Adicionar `lessonNotes[]` (até 200 reflexões), uma por OS concluída, com tema, texto limitado a 20–300 caracteres, revisão e histórico auditável de gravações.
- [x] Registrar `lesson_reflection` na trilha de decisões, sem copiar o texto integral no evento, sem premiar/penalizar a equipe e sem compras ou OS automáticas.
- [x] Liberar reflexões dos casos anteriores de um mesmo cenário **somente após a sexta etapa de diagnóstico** da OS atual, evitando antecipar gabaritos.
- [x] Distinguir explicitamente gabarito fictício, hipótese de causa, evidências do jogo e diagnóstico físico confirmado; não calcular retrabalho evitado ou lucro hipotético.
- [x] Compatibilidade com saves anteriores, campos novos opcionais, escaping de notas e regressão CI/PWA.
- [ ] Homologação visual desktop/mobile, campanha longa e acessibilidade de cadastro/edição das reflexões.

**Documentação:** [Lições Aprendidas v10](../docs/LICOES_APRENDIDAS_V10.md).

## Entrega 0.9.12 — Histórico de Decisões PCM/Supervisor, ciclo 9 (21/10/2026)

- [x] Implementar `decisionHistory[]` (até 400 eventos) e sequência de decisões no motor, compatíveis com saves anteriores.
- [x] Rastrear decisões confirmadas de alocação, compra, recebimento, aprovação PCM, criação manual de OS, avaliação de hipótese e encerramento.
- [x] Exibir painel **Planejamento → Histórico de Decisões** com filtros Todos/Compras/PCM/Execução e eventos ordenados por turno/sequência.
- [x] Comparar HH planejadas pelo PCM com HH efetivamente registradas, retrabalho observado e horas corridas da OS, sem confundir esforço com indisponibilidade.
- [x] Indicar compras sem demanda já diagnosticada sem classificar estoque estratégico como compra equivocada.
- [x] Distinguir divergência PCM contra gabarito educativo de erro mecânico real; **não calcular retrabalho evitado sem contrafactual**.
- [x] Fazer consulta não mutante, auditoria de eventos, cache PWA e regressões automatizadas, preservando as 124 missões e os 120 sintomas.
- [ ] Homologação visual desktop/mobile, testes de campanha longa, validação de filtros e eventual exportação CSV.

**Documentação:** [Histórico PCM v9](../docs/HISTORICO_DECISOES_PCM_V9.md).

## Entrega 0.9.11 — Decisões PCM e impacto econômico/operacional (21/10/2026)

- [x] Criar `phaser-play/decision-impact.js`: módulo puro de consulta e comparação de decisões, com custos de oportunidade **fictícios** separados do caixa da campanha.
- [x] Persistir `purchaseHistory[]` para pedidos normais e urgentes (desembolso, prazo, demanda conhecida, estoque no pedido e recebimento), mantendo `orders[]` como pedidos ainda em trânsito.
- [x] Rastrear por OS `exposureShifts`, `materialWaitShifts`, `toolWaitShifts` e `diagnosisQueueShifts`. Os contadores de causa podem se sobrepor; não somá-los como horas adicionais de parada.
- [x] Mostrar no Planejamento horas de OS abertas, espera por material/ferramenta, retrabalho, desembolso das compras e cenário de custo de oportunidade (prioridade 1/2/3: R$ 35/75/150 por hora virtual).
- [x] Para OS com diagnóstico completo e falta de peça, comparar **normal** versus **urgente** com preços reais da economia do jogo: preço normal `round(unit)`, urgente `round(1,65 × unit)`, lead normal `2×lead` e urgente `max(1, ceil(lead/2))`, mais eventual atraso de um turno com chance simulada de 18%.
- [x] Preservar recibo de pedidos ao fim do turno: ETA não significa peça disponível durante o turno da chegada. A compra continua ação consciente do jogador no Almoxarifado, sem pedido automático.
- [x] Não antecipar material ou causa real de OS antes do estágio de diagnóstico concluído; compras erradas ou estratégicas continuam possíveis, sem atribuição automática de culpa.
- [x] Adicionar testes determinísticos de caixa, estoque, tempo de parada, recompra, alternativa de compra, histórico e compatibilidade com saves antigos.
- [ ] QA visual em telas estreitas, calibração de custos fictícios de oportunidade e teste de partidas longas com backlog de 32 OS.

**Documentação:** [PCM — Impacto de decisão v8](../docs/PCM_IMPACTO_DECISOES_V8.md).

## Entrega 0.9.10 — Missões FMEA de FPS, ciclo 7 (21/10/2026)

- [x] Criar **24 novas missões FMEA (`INC101–INC124`)**, conectadas uma a uma às 24 ocorrências FPS (`FPS005–FPS028`), totalizando **124 missões**.
- [x] Criar **16 locais funcionais didáticos de FPS** (ponta, retenção, adaptador, proteção, borda, solda e revestimento), totalizando 403 caminhos. Marcar `origin=trilha_didatica_fps` e `sapValidated=false` até homologação da estrutura real.
- [x] Expandir catálogos com oito materiais e quatro instrumentos de inspeção/diagnóstico FPS. Custos, estoque e prazos são valores **fictícios** de jogo; não são P/N SAP nem valores OEM.
- [x] Cada missão separa relato, verificação, hipótese de componente/dano/causa, risco, ferramenta e material; marca `simulation.oemValidated=false`, `sourcePartMatch=false` e roteiro pendente de revisão técnica OEM.
- [x] Conectar o fluxo **Monitoramento → Notificação PCM → Diagnóstico → Aprovação PCM → OS manual → Planejamento**, preservando ausência de OS automática.
- [x] Tornar obrigatória para FPS a investigação PCM de Sistema, Grupo, Subgrupo, Componente e Dano, deixando **Causa opcional**; não revelar gabarito na mesa de revisão.
- [x] Preservar as 100 missões antigas, os cinco catálogos de 24 sintomas e os quatro IDs FPS legados acessíveis em saves anteriores.
- [x] Adicionar teste de ponta a ponta de três famílias FPS no fluxo PCM–OS, atualização da interface, cache PWA e documentar proveniência.
- [ ] Homologar visualmente desktop/mobile, balancear dificuldade e validar locais, P/N, torques e limites reais com documentação OEM e dados SAP.

**Documentação:** [Missões FMEA FPS v7](../docs/MISSOES_FPS_FMEA_V7.md).

## Entrega 0.9.9 — FPS = Ferramentas de Penetração no Solo / GET (21/10/2026)

- [x] Confirmar FPS como **Ferramentas de Penetração no Solo** na literatura brasileira oficial Caterpillar e Sotreq; corrigir interpretação eletrônica antiga sem atribuição fictícia de código.
- [x] Registrar módulo `fps-catalog-expansion.js` com **24 sintomas recebíveis** da 6030 (12), 395 (8), 966 (2) e D9 (2). Cada um dos cinco domínios passa a ter 24 registros: **120 sintomas ativos** no total.
- [x] Preservar FPS001–FPS004 para leitura de **saves antigos**, mas removê-los do catálogo ativo e da chegada automática (nunca sortear evento genérico em 777E/DR410i).
- [x] Modelar ponta, retenção, adaptador, proteção, borda e solda com localização, condição observável, incerteza e verificação recomendada.
- [x] Aplicar prioridade de revisão PCM a pontas/retentores soltos ou ausentes e trincas suspeitas, sem gerar OS de forma automática.
- [x] Não inventar Part Numbers, limites de desgaste, intervalos de substituição ou códigos SAP: dados quantitativos continuam pendentes por máquina, série e arranjo de FPS.
- [x] Integrar dossiês, fontes OEM, cache PWA, testes e documentação com 100 missões anteriores preservadas.
- [x] **Ciclo 7 concluído em v0.9.10:** 24 missões FPS investigativas vinculadas; OS possível somente após revisão e diagnóstico PCM.
- [ ] Homologar visualmente em desktop/mobile e balancear frequência/severidade com partidas reais.

**Catálogo e fontes:** [FPS/GET v6](../docs/CATALOGO_FPS_GET_V6.md).

## Entrega 0.9.8 — Monitoramento de Componentes v5 (21/10/2026)

- [x] Ampliar Componentes de **6 para 24 sintomas**, incluindo 18 novos `CMP007–CMP024` e elevando o catálogo de condição de 82 para **100 sinais**; preservar as 100 missões de OS e 387 locais funcionais.
- [x] Criar `component-catalog-expansion.js`, com metadados para os seis casos anteriores, preservando IDs e históricos de jogo.
- [x] Distinguir **sintoma, hipóteses concorrentes, efeito operacional, localização, método de verificação e incerteza**. Trabalhar com pressão, sucção, deriva, resposta, diferencial de filtro e tendência térmica sem diagnosticar automaticamente bomba, válvula ou cilindro.
- [x] Obter referências primárias Cat de inspeção, análise hidráulica e cilindros; usar fontes Sandvik DR410i/DI650i para escopo, com limites/procedimentos quantitativos ainda pendentes do manual específico.
- [x] Exibir leituras, referência e unidades como **pendentes**; proibir limites de falha, pressões ou percentuais OEM fictícios.
- [x] Triagem prioritária da perda de resposta da direção e risco em haste de cilindro de direção, com encaminhamento PCM sem OS automática e `requiresScenarioMapping` quando falta investigação aplicável.
- [x] Estender aos componentes de risco alto a regra de postergação **fictícia** já usada para rodante: após quatro turnos de atraso da verificação programada, o resultado do jogo vira agravamento. Nunca interpretar como prazo de segurança ou intervalo P-F.
- [x] Integrar dossiês, histórico e ferramentas ao Monitoramento; atualizar cache offline, documentação técnica e regressões do CI.
- [ ] Homologação visual em dispositivos e ajuste de tempo entre sintomas, gravidade e resultados durante partida real.

**Documentação completa:** [Catálogo de Componentes v5](../docs/CATALOGO_COMPONENTES_V5.md).

## Entrega 0.9.7 — Material Rodante v4: CTS, pneus e postergação (21/10/2026)

- [x] Ampliar Material Rodante de 6 para **24 sintomas** (`UND007–UND024`), elevando total geral de 64 para **82 condições recebíveis**; manter 100 missões de OS e locações funcionais.
- [x] Criar `undercarriage-catalog-expansion.js`, contendo 18 novos casos e metadados para seis anteriores (componente, posição, método, risco e fontes).
- [x] Separar **CTS** (desgaste de esteira Caterpillar), inspeção térmica/visual de rodante e **pneus OTR** (Michelin, sem CTS); solicitar procedimento Sandvik para tensionadores DR410i.
- [x] Manter `wearPercent`, `measurementValue`, `referenceLimit` e `unit` como **null**: não inventar medidas, pressões, limites OEM nem vida remanescente.
- [x] Marcar condições selecionadas como **avaliação prioritária PCM**, com possibilidade de encaminhamento imediato e sem OS automática. Ausência de FMEA correspondente continua bloqueando conversão.
- [x] Incluir **mecânica de postergação fictícia**: em ocorrências com risco alto, verificação atrasada em pelo menos quatro turnos após o vencimento produz agravamento narrativo, gravado no histórico. Quatro turnos é parâmetro de jogo, não tolerância de segurança OEM.
- [x] Incluir dossiês por ocorrência, indicadores no catálogo, cache PWA, testes e documentação com fontes primárias Caterpillar/Michelin.
- [ ] Homologação visual em mobile/desktop e ajuste de balanceamento de frequência/penalidades após partidas reais.

**Catálogo completo:** [Material Rodante v4](../docs/CATALOGO_MATERIAL_RODANTE_V4.md).

## Entrega 0.9.6 — Códigos de Falha e Eventos, catálogo v3 (21/10/2026)

- [x] Expandir de **6 para 24 sinais eletrônicos**, acrescentando 18 ocorrências (`FLT007–FLT024`) e elevando o total geral de 46 para **64 registros**.
- [x] Criar módulo independente `fault-catalog-expansion.js`, sem modificar as 100 missões de OS nem os 24 casos existentes de análise de óleo.
- [x] Separar `signalClass` (**diagnóstico** × **evento operacional**), `codeState` (**ativo**, **registrado** ou **não confirmado**) e padrão de intermitência. Não tratar intermitência como estado do código.
- [x] Registrar contexto do módulo, efeito relatado, hipóteses concorrentes, limitações e verificações recomendadas por sinal.
- [x] **Não fabricar códigos MID/CID/FMI/EID, SPN/FMI ou de sistemas Sandvik.** Números seguem ausentes até haver literatura/relatório verificável específico por modelo/módulo.
- [x] Sinais de perda de comando e eventos térmicos selecionados passam por triagem prioritária e encaminhamento PCM; sem cenário FMEA adequado, registro com `requiresScenarioMapping` bloqueia a conversão fictícia em OS.
- [x] Preservar sinais legados, histórico de partidas, módulo de óleo v2 e lógica de chegada automática por turnos.
- [x] Atualizar interface, PWA, documentação e regressões; executar testes da frota, monitoramento, PCM e recrutamento pelo CI.
- [ ] Aceite visual em desktop/mobile e balanceamento dos resultados e da frequência das ocorrências.

**Dossiê de fontes e 24 casos:** [Catálogo de Códigos de Falha v3](../docs/CATALOGO_CODIGOS_FALHA_V3.md). Critérios Cat ET são referencial técnico geral, não validação de código OEM por equipamento.

## Entrega 0.9.5 — Catálogo técnico de óleo e fluidos v2 (21/10/2026)

- [x] Ampliar análises de óleo/fluidos de **8 para 24 casos** (`OIL009–OIL024`), elevando o catálogo geral de 30 para **46 sinais**; preservar IDs e 100 missões antigas.
- [x] Extrair módulo independente `oil-catalog-expansion.js`, carregado antes do catálogo principal, com 16 novos registros e 24 conjuntos de metadados.
- [x] Registrar **compartimento, indicadores, incerteza, verificação e fontes Caterpillar** por caso; não produzir valores de laboratório ou limites OEM inventados.
- [x] Tratar suspeita de arrefecimento no óleo e condição persistente após intervenção com **triagem prioritária e encaminhamento PCM**; impedir simples adiamento por recoleta.
- [x] Tratar diferença declarada de aditivos por mudança de produto como **revisão do baseline**, sem diagnóstico automático de dano.
- [x] Sem roteiro FMEA correspondente, encaminhar notificação com `requiresScenarioMapping:true` e bloquear a geração de OS fictícia por causa incorreta.
- [x] Preservar jogos anteriores, leitura de laudos, encaminhamento manual e fluxo de programação PCM sem modificar `game-data.json` ou engine.
- [x] Atualizar dossiês, catálogo visual, cache PWA, testes de regressão e documentação das fontes.
- [ ] Homologação visual e balanceamento de frequência, prioridade e resultados em desktop/mobile após publicação.

**Fontes e lista completa:** [Catálogo de Óleo v2](../docs/CATALOGO_OLEO_V2.md). Todas as ocorrências simuladas continuam ficcionais; a literatura suporta famílias de sintomas, não diagnósticos nem resultados determinísticos.

## Entrega 0.9.3 — Sala visual do Planejamento PCM (20/10/2026)

**Objetivo:** apresentar o novo asset da sala de planejamento no menu Planejamento do jogo, sem alterar regras de programação, materiais ou notificações.

- [x] Asset enviado pelo usuário, convertido para AVIF em `phaser-play/assets/sala-planejamento.avif` com resolução 1447 × 1087 px, 99.728 bytes e SHA-256 `d0602ed2c71460e45166f4c2c4518cca1af6478b2d0ed80273d2c33027ffa06e`. O PNG original permanece inalterado fora do repositório.
- [x] Hero visual inserido exclusivamente no menu `data-panel="planning"`, antes dos cartões de OS e notificações, com legenda e `alt` acessível, proporção preservada e layout adaptável ao celular.
- [x] Asset incluído no pré-cache offline do Service Worker; identificador de cache versionado preservando o prefixo para limpeza de caches antigos.
- [x] Teste automatizado de integridade do AVIF, inclusão no HTML, cache e documentação adicionado aos workflows CI e Pages.
- [x] `engine.js`, `game.js`, `planning.js`, dados e formato de save mantidos intactos.
- [x] **Publicação confirmada:** workflow [Deploy P.O.R.C.A.R.I.A. to GitHub Pages](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39533578322) e workflow nativo de Pages concluídos com sucesso (20/10/2026, 23h32 BRT), incluindo verificação de SHA-256 e testes de regressão. Commit funcional: [`ed485a3`](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/commit/ed485a3262e13d2236694ec8d05de51686a4a393).
- [ ] Verificação visual manual em desktop e celular após a publicação.
- [ ] Registrar a aceitação visual do jogador, incluindo proporção entre a imagem e a carteira de serviços.

**Critério de aceite:** a arte aparece no menu Planejamento, as abas de 12h e 14 turnos e as notificações continuam operacionais e os arquivos permanecem acessíveis offline após pré-cache.

## Entrega 0.9.4 — Monitoramento de condição com catálogo de sintomas (20/10/2026)

- [x] Substituir os botões dos três estudos de óleo por uma **carteira de sinais recebidos**, separada do catálogo de condições possíveis.
- [x] Criar catálogo independente `phaser-play/condition-catalog.js` com 30 sintomas técnicos em cinco famílias (óleo 8, códigos 6, rodante 6, FPS 4, componentes 6).
- [x] Gerar um primeiro sinal na inicialização e, depois, até um registro a cada dois turnos, com rodízio de domínio, anti-duplicação e limite de oito ativos.
- [x] Identificar cada ocorrência como notificação de condição vinculada ao ativo, sem criar inspeção fictícia, OS ou causa-raiz confirmada.
- [x] Aplicar instrumentos de leitura por fonte; coleta de óleo usa seu kit/custo virtual específico, sem exigir o mesmo kit para sinais eletrônicos, rodante e FPS.
- [x] Preservar triagem, continuidade, decisão, encerramento e escalonamento para revisão PCM; preservar as três sequências antigas apenas para saves existentes.
- [x] FPS fica sem mapeamento de investigação até a definição do sistema, com notificação para PCM mas sem autorização de gerar OS fictícia por roteiro incorreto.
- [x] Atualizar navegação do monitoramento, cache PWA, documentação e testes dedicados.
- [ ] Homologar visual e balancear frequência, custo e evolução com a jogabilidade. Próximos ciclos ampliarão o catálogo, sem mudar este contrato.

**Especificação e lista completa:** [Catálogo de Monitoramento v1](../docs/CATALOGO_MONITORAMENTO_V1.md). Sintomas e resultados são conteúdo de jogo, não leitura operacional real ou limites OEM.

## Entrega 0.9.2 — PCM gamificado, hipóteses técnicas e consequências mecânicas (20/10/2026)

- [x] **Nenhum campo de texto livre na inspeção ou revisão:** achado é preenchido automaticamente pelo evento simulado; motivo de devolução/arquivamento, disciplina, HH e estratégia são selecionados de listas.
- [x] Planejador escolhe **Sistema, Grupo, Subgrupo, Componente, Dano** e, opcionalmente, **Causa** dentre quatro alternativas por etapa. Alternativas fixas por notificação, sem gabarito ou devolução visual de erro.
- [x] Compras explícitas de peças (item + quantidade) e ferramentas (item) no fluxo PCM; permanecem sujeitas a caixa, estoque, ETA e regras do motor. Compra não indica material correto.
- [x] Aprovação armazena hipóteses e gera escopo predefinido, sem iniciar OS; botão separado converte em OS vinculada à notificação.
- [x] Primeira execução mecânica avalia o plano **uma única vez**: 6/6 certas restaura energia mental a 100 e acrescenta 20 de moral; cada escolha incorreta implica -8 mental, -3 física, -5 moral, 0,5h de retrabalho e R$25, sem detalhar o gabarito ao planejador. Causa vazia não conta como erro, mas não concede bônus integral.
- [x] OS legadas sem plano PCM seguem o fluxo normal; saves mantêm compatibilidade estrutural.
- [ ] Evoluir inspeções para verificações condicionalmente observáveis e balancear o impacto das penalidades com jogadores.
**Nota técnica:** os valores e cenários são fictícios, feitos para jogabilidade, não procedimento de oficina.

## Entrega 0.9.1 — Revisão técnica de notificações pelo PCM (20/10/2026)

- [x] Mesa PCM na aba de Inspeções com status, justificativa, histórico de decisões por turno e rastreio `IN#### → NM#### → OS####`.
- [x] **Devolver** para complementar relato e prioridade (sem apagar a notificação), **arquivar** com justificativa, ou **aprovar** com escopo, disciplina e HH estimadas.
- [x] A aprovação **não gera OS**. Botão distinto **Gerar OS para Planejamento** cria uma OS na fila, sem mecânico, sem box e sem programação.
- [x] A conversão exige escopo aprovado, roteiro existente e ausência de OS ativa no mesmo equipamento. Impede conversão repetida, alterações posteriores em notas já convertidas e duplicidade de ID.
- [x] OS convertida preserva o relato, prioridade, inspeção e origem; usa o contrato de diagnóstico do motor sem revelar causa antecipadamente. Estimativa PCM é informativa; HH de reparo permanecem as do cenário até evolução posterior.
- [x] Todos os campos editáveis são tratados como texto escapado, com validação de formato e comprimento; saves antigos continuam válidos.
- [ ] **Fase 3:** planejar materiais e ferramentas a partir do escopo, separar pronto para programação da fila e integrar capacidade semanal/HH por disciplina.
- [ ] Checklists, medição e plano de inspeções com periodicidade/HH de inspetor (fora deste incremento).

**Limites:** procedimentos, evidências e causas do FMEA são fictícios e não homologados. A revisão é uma ação do jogador, não uma aprovação técnica real nem autorização de trabalho.

## Entrega 0.9.0 — Inspeção sensitiva, achados e notificações (20/10/2026)

- [x] Aba **INSPEÇÕES** independente da Fila de OS e do planejamento.
- [x] Até três rotinas de inspeção **simuladas** por turno, em modelos com roteiros existentes, sem escolher equipamento que tenha OS ativa. A abertura do painel no mesmo turno não duplica tarefas.
- [x] Desfechos sensitivo-didáticos: sem anormalidade aparente ou indício de defeito. Sintomas só são revelados depois da inspeção; não há medição, causa confirmada nem evidência real.
- [x] Abrir uma **notificação NM####** apenas após um achado, com texto editável e prioridade definida pelo jogador. Cada nota guarda inspeção de origem e permanece em `aguarda_revisao_pcm`.
- [x] A notificação **não é OS**, não altera o backlog de serviços, nem compra material, nem consome HH neste MVP.
- [x] Saves antigos recebem coleções novas sem perder as OS ou o histórico; uma inspeção não executada vence ao trocar de turno.
- [x] Testes de planejamento idempotente, notificações não duplicadas, fonte simulada, saves antigos e integridade da fila de OS.
- [ ] Implementar checklists por equipamento e programa com periodicidade, HH e designação de inspetor.
- [ ] Implementar revisão de notificações: aceitar, devolver, arquivar e transformar em OS com escopo e evidências.
- [ ] Integrar programação PCM, materiais, ferramentas e capacidade semanal antes de execução.
- [ ] Expandir inspeções com evidências positivas, negativas e inconclusivas do FMEA (somente após curadoria).

**Observação:** probabilidades e quantidade de inspeções são parâmetros fictícios do jogo; o módulo não se apresenta como procedimento de campo. Os dados FMEA ainda não são homologação OEM.

## Entrega 0.8.30 — Redesign do Setor de Treinamentos (somente interface)

**Solicitação de 19/10/2026:** substituir a Bia pequena no cabeçalho por personagem grande e animada à esquerda, com alteração de poses; transformar as quatro etiquetas coloridas em **abas interativas**, exibindo **apenas a seção selecionada**. Referência: captura do modal da v0.8.28 fornecida pelo usuário.

- [x] Reaproveitar os quatro spritesheets transparentes 2×2 existentes de Bia: `coaching` na Capacitação, `field` nas Ofertas, `inspection` nos Normativos e `feedback` no Histórico. Alternar continuamente as quatro poses de cada atlas mediante CSS, sem regenerar imagens nem criar temporizadores JS; desativar animação sob `prefers-reduced-motion`.
- [x] Bia ampliada no lado esquerdo, sem moldura de retrato; manter nome/cargo **Analista Administrativa do Setor de Treinamentos** e um post-it com o aviso administrativo mais recente. Área administrativa à direita com cabeçalho, indicador de turno, caixa e funcionários disponíveis.
- [x] Abas como botões reais com `role=tablist/tab/tabpanel`, `aria-selected`, foco, tecla Home/End e setas; cores e indicação de seleção. **Um único painel presente no HTML de cada renderização** (interno, externo, obrigatório ou histórico), em vez de quatro seções exibidas simultaneamente.
- [x] Estado da aba e seleções de instrutor, aprendiz, grupo, habilidade e participante externo mantidos em memória entre trocas e redesenhos, sem alterar o save.
- [x] Layout responsivo: desktop em duas colunas, celular com Bia em destaque no topo horizontal; preservar área de rolagem do modal apenas onde necessário.
- [x] Preservar as regras vigentes da **v0.8.28**: créditos fracionários garantidos, tetos, custo de curso externo, duas jornadas de integração normativa, registros e disponibilidade; v0.8.29 do sprite do Pedro permanece intacta.
- [x] Atualizar JS de apresentação, CSS, cache PWA para `v109` e regressão `scripts/test-training-layout.cjs`, além das suítes existentes.
- [ ] Homologação visual em navegador desktop e celular: quatro poses por aba, sem cortes nas silhuetas; ausência de painéis simultâneos; preservação das seleções e controles; aviso longo sem transbordar; aceitação artística pelo usuário.

**Não alterado:** `training.js`, `competency.js`, `engine.js`, catálogo de 56 habilidades, OS, HH, caixa, regras de progressão ou save.

## Entrega 0.8.29 — Nova arte do Pedro (somente asset)

- [x] Recebida e preservada a cartela original `pedro-v0829-original.png`, fornecida pelo usuário (1254×1254 RGBA).
- [x] Convertida para atlas `pedro-v0829-4poses.png`, transparente, 1160×1244 px, quatro quadros de 580×622 px, sem perdas.
- [x] Ajustados os recortes da imagem original em x=635/y=665 para não cortar as botas superiores; escala uniforme aproximada de 0,93, silhuetas centralizadas e pés alinhados a 12 px da base do quadro.
- [x] Atualizado apenas `WORKER_SHEETS.pedro`, sem mudar frame, envelope 66×80, câmera, Box 2, ordem das poses, engine, OS, habilidades, treinamento ou saves.
- [x] Cache PWA `v108`, versão JS `0.8.29`, rastreabilidade SHA-256 em [PEDRO_ASSET_0829.md](assets/characters/PEDRO_ASSET_0829.md) e regressão dedicada.
- [ ] Conferir visualmente as quatro poses em oficina, nos três boxes, em dia/noite, e o retrato do menu Equipe.
- [ ] Verificar carregamento da arte nova em PWA previamente instalado.

**Aceite da publicação:** CI aprovado e deploy GitHub Pages concluído. **QA visual permanece pendente** até teste no navegador.

## Entrega 0.8.28 — Treinamentos determinísticos e asset Sandvik DI650i

### Capacitação — regra validada no design
- [x] **Treinamentos internos e externos sempre geram crédito de habilidade**, sem rolagem aleatória de sucesso. Permanecem as 12 horas de reserva integral dos participantes e o custo financeiro exclusivo dos cursos externos. A aprendizagem prática em OS permanece probabilística e limitada ao nível 90.
- [x] **Curva reduzida pela metade**, com interpolação por faixa (instrutor nível 100): aprendiz 30 → **+5**, 40 → **+3,5**, 50 → **+2**, 60 → **+1**, 70 ou mais → **+0,5** por sessão. Para nível inferior a 30, ganho-base fixado em 5 para conter aceleração.
- [x] **Ajuste pela diferença de proficiência:** `crédito = B(A) × (T−A)/(100−A)`, com `B(A)` ganho-base, `T` treinador e `A` aprendiz. Ex.: Geovane 80 ensina Pedro 40 em Lubrificação: **+2,333333** créditos; Pedro sobe imediatamente de 40 para 42, preservando 0,333333 para aula futura. Junior 100 ensinando Pedro 40 rende +3,5.
- [x] Armazenar `member.trainingProgress["grupo:habilidade"]` com até seis casas decimais; notas principais permanecem **inteiras de 0 a 100**. Ex.: aluno 70 + instrutor 100: primeira sessão +0,5 crédito (nota 70), segunda +0,5 (nota 71). O crédito não desaparece entre turnos/saves. Ganho é registrado com `earned`, `creditBefore`, `creditAfter`, `gain` e horário no histórico organizado pela Bia.
- [x] Manter elegibilidade atual para interno (**diferença mínima 5**, teto `min(95,T−2)`), externo comum (máximo 97), externo premium (máximo 100), bloqueios normativos e indisponibilidade de instrutor/aprendiz, sem alterar custo dos cursos.
- [x] A Bia, **Analista Administrativa do Setor de Treinamentos**, mostra projeção determinística e saldo, eliminando texto sobre chance/sorteio. Treinadores são mecânicos ou instrutores externos, nunca a Bia. Escolha de inscrito em curso externo atualiza a projeção exibida.
- [x] Migração de cursos já agendados na v0.8.26: se não houver `plannedCredit`, recalcular a curva aprovada no encerramento, sem sorteio. **Sem reembolsos ou punições retroativas**; saves existentes mantêm integrantes, OS, caixa e competências.
- [x] A **chance continua somente para progressão por prática** na OS, com curva v0.8.27; a precisão do diagnóstico também continua probabilística por ser uma ação técnica de desempenho, não uma evolução de habilidade. Não misturar as duas probabilidades.

### Imagem DI650i (EQ06)
- [x] Substituir o asset emprestado da DR410i no `ASSETS.drill` pelo novo `sandvik_di650i_v0828.webp`, **1536×1024, VP8L lossless com alfa**, 984.300 bytes, SHA-256 `371ba7f11dca88fcb29e29fc876747c5231f1c14614512c36240b8b9a908f36d`.
- [x] Conversão *pixel-perfect* da arte PNG fornecida pelo usuário: todos os pixels RGBA preservados, inclusive transparência. Asset próprio e separado do `EQ05` DR410i. Geometria, escala do modelo, pontos de apoio, boxes, sombras e sprites de trabalhadores inalterados.
- [x] Teste de tamanho, assinatura WebP, dimensões e SHA-256; referências e cache PWA `v107`; documentação específica em [DI650I_ASSET.md](assets/equipment/DI650I_ASSET.md).

### Homologação
- [ ] Teste visual da DI650i nos três boxes em cenas diurna/noturna; conferir lança, mangueiras, esteiras, bordas e ausência de deslocamento.
- [ ] Teste de duas sessões com ganho fracionário em campanha normal e recarga do save entre elas.
- [ ] Verificar que externo premium ultrapassa 90 e que aprendizagem por prática não ultrapassa 90.
- [ ] Conferir mensagens da Bia e projeções de ganhos em desktop e celular.
- [ ] Validar disponibilidade, custos, 12 horas de bloqueio, normativos e demais sistemas sem regressões.

**Aceite da release:** testes automatizados aprovados, deploy GitHub Pages concluído; homologação visual e balanceamento após campanha mantidos como pendências reais.

## Entrega 0.8.27 — Competências nas OS e aprendizagem por prática (implementação)

**Dependência concluída:** v0.8.26, PR #46, treinamento interno/externo/normativo com Bia como Analista Administrativa e histórico persistido. **Planejamento detalhado já documentado na PR #45, antes do código.**

### Aplicação dos atributos
- [x] Novo módulo isolado `competency.js`, consumido por `engine.js` e `phaser-play/planning.js`, com mapeamento explícito dos **29 cenários existentes** para exatamente **uma disciplina**, **um sistema** e **um equipamento** da matriz da v0.8.25. Nenhuma habilidade ou cenário foi adicionado; fallback mapeado e validado nos testes.
- [x] Proficiência `P=0,40D+0,35S+0,25M`. A probabilidade do diagnóstico autônomo utiliza `clamp(0,25+0,006P+bônus-penalidades,0,20,0,98)`; fadiga e moral continuam influenciando, sem dupla soma da habilidade geral antiga.
- [x] Reparos usam `V=clamp(0,75+0,007P,0,75,1,40)`, multiplicado pelos fatores preexistentes de pressão de produtividade, fadiga e apoio. Limite de **10,5 HH úteis** por turno preservado, sem diminuir jornada de 12 horas, retirar necessidade de material ou ferramental, nem produzir reparo antes do diagnóstico.
- [x] Seleção sugerida de mecânico no planejamento PCM usa a proficiência da OS no lugar da habilidade geral, com peso adicional de energia, especialidade e indisponibilidade.
- [x] Aprendizagem por atuação real em OS (diagnóstico assistido/autônomo ou reparo): chance `clamp(0,30−0,003H,0,03,0,30)` para as três habilidades pertinentes. Em sucesso, **+1**, raramente +2 para nível menor, limitado em **90**. Profissionais com 90–100 avançam **somente por treinamento**.
- [x] Uma única oportunidade por **habilidade** e **turno**, inclusive se o jogador clicar repetidamente no diagnóstico. Campo de controle do membro registrado no save e evento de sucesso em `training.history` com identificação da OS, turno, atributo e nota antes/depois.
- [x] Hipóteses do jogador ainda exigem seleção correta: proficiência não revela respostas, não automatiza a escolha e não apaga retrabalho de erro. O diagnóstico autônomo usa a nova chance proporcional.
- [x] Testes de 29 cenários, 0–100, limites de 90, especialista contra iniciante, duração de reparo, resposta manual, HH úteis e cache PWA atualizado.
- [ ] Homologar no navegador: observar velocidade e curva de aprendizagem ao longo da campanha, comparar desempenho de Pedro, Geovane e Junior, custo-benefício de cursos e dados importados de saves antigos.
- [ ] Balancear a curva de aprendizagem após sessões completas. Valores são de **design fictício**, não estimativas de produtividade industrial.

**Sem alterações neste release:** quantidade de falhas, atributos e equipamentos, fontes OEM, estrutura das seis etapas, contratação, custos de materiais ou duração das turmas. O futuro aumento de falhas permanece em backlog para explorar habilidades existentes.

## Entrega 0.8.26 — Setor de Treinamentos (implementação; homologação visual pendente)

**Documentação registrada e incorporada antes do código:** PR #45. Nesta etapa, criados os módulos \`training.js\` (regras puras de agenda/turno) e \`phaser-play/training-view.js\` (fichário CSS com Bia como **Analista Administrativa**).

- [x] Cadastro compatível com save anterior: \`state.training\` (v1), lista de compromissos, oferta externa, avisos administrativos e histórico por pessoa/turno/habilidade; nenhum bloqueio normativo retroativo em equipe já existente de save antigo.
- [x] Contratação gera obrigatoriamente dois turnos de integração normativa com impedimento de OS e outras capacitações; encerramento ocorre após dois avanços do jogo. O funcionário já integra a folha.
- [x] Treinamento interno gratuito com instrutor/aprendiz disponíveis por 12h e diferença mínima de cinco pontos; chance proporcional ao gap, teto \`min(95,T-2)\`, bloqueio de aula e trabalho simultâneos.
- [x] Cursos externos pagos com instrutor de nível 100, oferta periódica randômica, limite comum 97 e premium 100, custos de R$600 a R$3000 (premium 2× tarifa) e um turno de indisponibilidade.
- [x] Solicitações simuladas ocasionais da Segurança do Trabalho, bloqueio da pessoa específica e registro da conclusão.
- [x] Interface com Bia (sprite original existente), pasta, post-its, abas coloridas, cadastro, ofertas, normativos e registros. Nenhuma nova imagem gerada.
- [x] Integração com seleção rápida de OS, alocação no motor, descanso, gestão, planejamento, quadro de prontidão e cálculo de HH disponíveis.
- [x] Regressão \`scripts/test-training.cjs\` e atualização de testes/workflows, cache PWA \`v105\`.
- [ ] Homologação no navegador em desktop/mobile: altura dos cards, responsividade, foto da Bia, instrutor/aprendiz e menus sem regressão.
- [ ] Balancear custos e incidência externa/normativa após partidas reais.

**Propositadamente ainda não nesta entrega:** efeito composto das 56 habilidades sobre diagnóstico e velocidade de reparo e progressão por prática; previstos na **v0.8.27** descrita acima. A habilidade geral \`skill\` permanece válida durante a v0.8.26.

## Planejamento aprovado — Treinamentos, habilidades ativas e aprendizagem (18/10/2026)

**Regra de execução:** registrar este plano integralmente no roadmap, incorporá-lo à \`main\` e **somente depois** iniciar as mudanças de código. O projeto será entregue em etapas verificáveis: \`v0.8.26\` (Setor de Treinamentos), \`v0.8.27\` (habilidades aplicadas às OS e prática). Os coeficientes seguintes são **hipóteses de balanceamento de jogo**, não probabilidades observadas ou procedimentos técnicos reais. O design vigente usa a matriz da v0.8.25, sem adicionar habilidades nesta fase.

### Identidade e fronteira de responsabilidades

**Bia é Analista Administrativa do Setor de Treinamentos**, não instrutora, mecânica, nem coordenadora técnica. Ela organiza agendas, registra resultados e certificações, apresenta exigências comunicadas pela Segurança do Trabalho, promove vagas de cursos externos e informa a gestão. Seu sprite existente será usado na interface, sem atribuir-lhe HH de manutenção, proficiência técnica, bônus, nem incluí-la na equipe contratável. Treinadores internos são **mecânicos da equipe**; treinadores externos são recursos de um curso pago.

Treinamentos normativos são **requisitos simulados no jogo**: não concedem habilitação legal, não correspondem a certificados NR reais e não substituem capacitação exigida na operação.

### Etapa 1 — v0.8.26: setor de Treinamentos (implementar primeiro)

**Interface e direção de arte:** novo menu **📚 TREINAMENTOS** junto à Equipe; pasta administrativa sobre mesa, divisórias coloridas, cartões com cantos de post-it, clipes, etiquetas, marcadores de status e fichário de histórico; cabeçalho com sprite da Bia em uma das poses existentes, retratada como **Analista Administrativa**. Usar CSS/DOM sem gerar novos sprites. Áreas da pasta:
1. **Bia informa:** avisos de integração de recém-contratados, pendências normativas e oferta externa vigente; explicações curtas e contextualizadas.
2. **Treinamento interno:** selecionar treinador livre, aprendiz livre, grupo (disciplina/sistema/máquina) e habilidade; exibir notas T/A, diferença, chance, ganho possível e ocupação do turno; confirmar para reservar **ambos** por **12 h / 1 turno**, sem custo financeiro.
3. **Treinamento externo:** Bia disponibiliza periodicamente uma oferta aleatória para **uma habilidade**; custo explícito, instrutor simulado em **100**, participante livre e ocupação por **1 turno**; **oferta premium rara** pode atingir 100, comum até 97; dinheiro debitado na inscrição.
4. **Normativos / integração:** pasta de pendências da Segurança do Trabalho, equipe bloqueada, tempo restante, avisos do dia e registro da conclusão.
5. **Histórico organizado:** fichas por turno/funcionário/habilidade com resultado, antes/depois, valores e custo (se aplicável), disponíveis em save.

**Regras operacionais de simultaneidade:** nenhum mecânico em OS, descanso ou curso ativo pode ser inscrito. O treinador interno também fica indisponível. Cada profissional entra em no máximo **um compromisso por turno**. A duração é contabilizada em turnos reais da simulação, não em tempo de relógio do navegador. Professores internos precisam ter nível **ao menos 5 pontos superior** ao do aprendiz naquela habilidade; treinamento não reduz nota quando não há ganho. Um curso iniciado antes do avanço do turno entrega resultado na conclusão daquele turno, sem permitir que o mecânico trabalhe simultaneamente. Recursos livres não devem ser silenciosamente alocados em tarefas de OS.

**Equação interna (T = professor; A = aprendiz; gap = T−A, gap ≥5):**
\[
p_{\rm interno}=\operatorname{clamp}(0{,}20+0{,}005\cdot gap,\;0{,}20,\;0{,}70)
\]
Se passar no sorteio: **+1** ou **+2 se gap ≥30**; teto **mín(95,T−2)**. Caso a regra do teto já esteja atingida, apresentar curso como ineficaz e impedir agendamento. A diferença sempre é **na habilidade ensinada**, não no cargo ou senioridade. **Mecânicos também podem treinar capacidades acima de 90**, dentro do teto de 95 e do conhecimento do instrutor.

**Equação externa (T = 100; A = participante):**
\[
p_{\rm externo}=\operatorname{clamp}(0{,}35+0{,}005(100-A),\;0{,}35,\;0{,}85)
\]
Ganho simulado +1 ou +2 (chance eventual de +3 nos níveis baixos), respeitando teto **97 no comum / 100 no premium**. Proposta de custos parametrizados: R$ 600–1.500 por curso comum; premium mais caro. Oferta ocasional (faixa proposta 20–30% por turno), no máximo uma vigente, expira após prazo informado; nenhum custo para treinamento interno. **Ofertas são aleatórias, não garantidas a cada turno.**

**Normativo inicial:** ao **contratar** qualquer mecânico do catálogo, a Bia gera aviso e coloca a pessoa em **integração normativa obrigatória por dois avanços de turno**. A pessoa já aparece no cadastro/folha, mas **não entra em OS, treinamento interno, externo nem capacidade disponível** até encerrar os dois turnos (próximo dia operacional). Treinamento é automático, sem botão de pular. Para trabalhadores já contratados, a Segurança do Trabalho pode demandar periodicamente treinamento normativo individual: aviso da Bia, reserva/bloqueio por duração definida (1–2 turnos) e registro de cumprimento; não inventar punições por recusa nesta etapa. Exigências simuladas não usam números de NRs para fingir conformidade.

**Modelo de estado:** \`state.training={version,assignments,offers,history,notices,...}\`, \`member.competencies\` preservado, \`trainingUntilTick\` ou compromisso equivalente explícito. Migração idempotente de saves \`1.1.0\` sem reter pessoas antigas compulsoriamente em novo onboarding, sem alterar OS, caixa e energia; novas contratações entram no novo fluxo. Eventos e gastos entram no save. Ao término do turno, processar primeiro compromisso e conclusão; o funcionário só volta à disponibilidade após conclusão.

**QA obrigatório:** contratação bloqueada por dois turnos; preservação dos saves antigos; ausência de simultaneidade OS × aula, instrutor × OS e aula × descanso; teste de T/A e teto; compra externa desconta valor certo e não gera curso grátis; chance com RNG injetável; Bia não integra a equipe; histórico persistido; interface responsiva desktop/mobile; casos sem vagas e indisponibilidade tratados.

### Etapa 2 — v0.8.27: habilidades governam diagnóstico, reparo e prática

Vincular cada OS às competências **pertinentes do catálogo existente**: **uma disciplina** + **um sistema** + **o modelo de equipamento**. Usar primeiro as informações de \`game-data.json\` (\`scenarios\`, \`paths\`, \`modelId\`, \`category\`); mapeamento explícito de códigos conhecidos, fallback documentado para sistemas não mapeados. Não aumentar agora o catálogo das 56 habilidades. **Não revelar causa/componente real ao jogador antes de confirmar o diagnóstico** por causa do mapeamento interno.

**Proficiência conjugada**:
\[
P=0{,}40 D+0{,}35 S+0{,}25 M
\]
onde D = disciplina, S = sistema, M = máquina (0–100), preservando precisão por especialidade e evitando usar uma média global indiscriminada.

**Chance de sucesso nas tentativas autônomas do mecânico:**
\[
p_{\rm diag}=\operatorname{clamp}(0{,}25+0{,}006P+\text{bônus situacionais}-\text{penalidades},\;0{,}20,\;0{,}98).
\]
Calibrar bônus/penalidades atuais sem somar novamente o \`skill\` global da v0.8.25. Respeitar ferramentas, fadiga, moral e chance de investigação; **não automatizar o acerto de escolhas feitas pelo jogador**. Diagnóstico incorreto mantém retrabalho.

**Multiplicador proposto da velocidade de reparo:**
\[
V_{\rm reparo}=\operatorname{clamp}(0{,}75+0{,}007P,\;0{,}75,\;1{,}40).
\]
Aplicar exclusivamente às HH simuladas de reparo do trabalhador ativo, mantendo jornada de 12h, DDS, almoço (10,5 HH úteis), consumo de peças, ferramentas, bloqueios, turnos, recursos, risco e saves. Não reduzir artificialmente as 12h do turno nem permitir ultrapassar o limite de HH úteis por funcionário.

**Aprendizagem por prática:** ao efetivamente atuar em OS, sortear progressão para **disciplina pertinente**, **sistema pertinente** e **modelo da máquina**, no máximo uma tentativa por dimensão por turno trabalhado; só praticar **enquanto habilidade <90**. Chance:
\[
p_{\rm prática}=\operatorname{clamp}(0{,}30-0{,}003H,\;0{,}03,\;0{,}30)
\]
(H = habilidade atual). Acerto gera **+1**, eventual +2 em eventos relevantes, sem ultrapassar **90** pela prática. Habilidades já em 90 ou acima **não crescem por serviço**, somente por treinamento. Ganhos registrados com origem, turno e OS, e nunca concedidos sem atuação concreta.

**QA:** verificação de P dos três personagens em máquinas contrastantes; especialista ganha mais chance e velocidade no domínio específico; nada acima de 90 por trabalho; treino consegue ultrapassar 90 dentro dos tetos; importação de save legado não perde histórico; cálculos de HH e fadiga não duplicam bônus; RNG determinístico nas regressões; relatórios/diagnóstico sem spoilers.

### Etapas futuras — registrar, mas NÃO implementar agora

- **Variedade ampliada de modos de falha e cenários** para cobrir mais disciplinas, sistemas e modelos da matriz. Só criar com desenho pedagógico, classificação e testes próprios; **não aumentar o número de tipos de falha nem a lista das 56 habilidades agora**.
- Especializações por modelo, cursos sequenciais com pré-requisitos, avaliação e certificação, simuladores de diagnóstico, instrutores externos especializados e controle de efetividade baseado em indicadores, preservando o escopo da Bia como analista administrativa.
- Balanceamento com dados de partidas, análise de convergência das notas próximas de 90, efeito financeiro das capacitações, saturação de especialistas e risco de contratar trabalhadores sem disponibilidade.

**Nota de precedência:** o documento \`phaser-play/TRAINING_DESIGN.md\` contém um design exploratório da v0.8.15 com níveis N0–N4 e elenco da época. As **regras numéricas e personagens desta seção**, articuladas com a matriz 0–100 da v0.8.25, **substituem** aqueles trechos quando conflitantes; preservar o documento anterior apenas como histórico até sua atualização coordenada na execução.

---

## Entrega 0.8.25 — Matriz de habilidades da equipe (dados + interface consultiva)

### Objetivo e taxonomia
Os atributos técnicos da equipe foram separados em **três categorias**, com notas inteiras de **0 a 100**. O sistema registra as competências para uso futuro sem introduzir vantagens inventadas na simulação:
- **Disciplinas (22):** hidráulica, elétrica, eletrônica, lubrificação, soldagem, usinagem, pneumática, mecânica de manutenção, mecânica dos materiais, mecânica dos fluidos, termodinâmica, transferência de calor, dinâmica, estática, vibrações mecânicas, tribologia, metrologia, desenho técnico, instrumentação, automação e controle, resistência dos materiais e eletromagnetismo.
- **Sistemas (25):** material rodante, FPS, motores, pneus, cilindros hidráulicos, mangueiras, válvulas, eletrônica embarcada, transmissão, comandos finais, direção, freios, suspensão, arrefecimento, combustível e injeção, admissão e escape, sistema de lubrificação, circuitos hidráulicos, sistema elétrico, bombas, redutores de giro, perfuração, compressores, ar-condicionado e estruturas e soldas.
- **Máquinas (9, por ID EQ01..EQ09):** CAT 777E, CAT 6030, CAT 395, CAT 336GC, Sandvik DR410i, Sandvik DI650i, CAT D9, CAT 966 e CAT 16. A matriz é explicitamente validada contra `game-data.json` no CI; novos modelos deverão receber novos IDs/perfis.

### Perfis de personagem
| Perfil | Disciplinas | Sistemas | Máquinas |
| --- | --- | --- | --- |
| Junior | Lubrificação = **100**; outras = **90** | Todas = **90** | Todas = **70** |
| Geovane | Todas = **80** | Todas = **90** | Todas as CAT = **100**; DR410i/DI650i = **50** |
| Pedro | Lubrificação **40**, Mecânica dos materiais **40**, Elétrica **30**, Eletrônica **40**, demais **20** | FPS **30**, Motores **30**, Pneus **60**, demais **20** | CAT 6030 **50**, CAT 777E **30**, Sandvik DR410i e DI650i **40**, demais **20** |
| 10 contratáveis nomeados | Cada atributo **30–70** | Cada atributo **30–70** | CAT 6030 e Sandvik **30–39**; demais **30–70** |

### Arquitetura, UI e saves
- [x] Catálogo e valores-base definidos no `engine.js` como `SKILL_CATALOG`, `baselineSkills`, `skillsFor`, `SKILL_GROUPS`; os metadados estão disponíveis no módulo de simulação e podem ser acessados por outras telas futuramente.
- [x] Cada personagem recebe `competencies.disciplines`, `competencies.systems` e `competencies.machines`, separados do atributo **`skill` preexistente**.
- [x] Contratáveis possuem perfis individuais **determinísticos** por identidade e habilidade: nomes iguais entre novas campanhas têm os mesmos pontos, sem consumo do gerador de aleatoriedade de turnos; em CAT 6030 e Sandvik o limite estrito é **menos de 40**.
- [x] `normalizeRoster` adiciona as competências ausentes em saves antigos sem substituir os valores já válidos de habilidades, sem alterar as OS, a equipe, a energia, a moral e o atributo `skill`. O formato de save permanece `1.1.0` por compatibilidade.
- [x] No menu **Equipe**, tanto os candidatos quanto os profissionais ativos têm **Ver habilidades**, três categorias expansíveis, médias consultivas e barras por atributo. O painel é recolhido por padrão.
- [x] Acrescentar `scripts/test-skills.cjs` à suíte de CI, validação e deploy; verificar perfis, intervalos, modelos de frota, contratação determinística e migração idempotente.
- [x] Atualização de cache PWA para `porcaria-vqec-20261018-v104` e arquivo de interface `game.js?v=0.8.25`.

### Limite funcional explícito
**Estas habilidades ainda NÃO influenciam** chance de sucesso, HH, rendimento de diagnóstico, reparo, custo, fadiga, requisitos de alocação ou evolução do personagem. O jogo ainda usa o **antigo `skill` geral**, no motor de turnos. Substituir essa regra exigirá proposta independente para relacionar tarefas a múltiplas competências sem contar três vezes a mesma habilidade (disciplina + sistema + máquina).

### Próxima evolução sugerida (não implementada)
1. Vincular cada tarefa/OS a uma disciplina, um sistema e um modelo, com mapeamento explícito de atributos e exclusões.
2. Definir fórmula de proficiência composta, esforço em HH, confiabilidade de diagnóstico e aprendizado após serviço/treinamento.
3. Incluir ganhos por experiência e capacitação, sem retroagir sobre saves antigos nem desequilibrar os especialistas.
4. Homologar visualmente o painel de habilidades em mobile/desktop e navegar pelas 56 habilidades dos personagens.

## Entrega 0.8.24 — Fluxo compacto de OS e diagnóstico sem rolagem (UX / P0)

**Objetivo:** o jogador não deve ser obrigado a navegar por um modal longo para alocar uma OS ou investigar suas seis etapas. A interface distingue **resumo rápido** de **detalhes completos** sem modificar as funções, custos ou resultados do motor de manutenção.

### Estados de interação

| Gatilho/estado | Conteúdo do resumo | Encerramento |
|---|---|---|
| Clique em **box vazio** | Abre **Fila de OS** filtrada por **Aguardando**; o box escolhido fica pré-selecionado na alocação | X da fila retorna à oficina |
| Clique em OS **não alocada** na fila | Relato operador/inspetor; selects **mecânico** e **box**, botão **Alocar**, **Detalhes** e **Fechar** | Fechar/X/Esc volta à lista, com pesquisa/filtro preservados |
| Clique em OS **alocada** na fila | Relato; seis quadrinhos (Sistema, Grupo, Subgrupo, Componente, Dano, Causa); quatro hipóteses e **Solicitar evidência**; **Detalhes** | X/Esc retorna à lista |
| Clique em **box ocupado** | Mesma tela de OS alocada | X/Esc retorna à oficina, sem passar pela lista |
| Falta ferramenta com diagnóstico incompleto | Mostra seis quadrinhos e **somente Comprar ferramenta** em vez de hipóteses e evidência; **Detalhes** continua disponível | Mesma origem |
| Após etapa 6 | Exibe resultados confirmados de **Componente / Dano / Causa**, informação de estoque e botão **Comprar peça** se peça confirmada estiver sem saldo; **Detalhes** | Mesma origem |
| Botão **Detalhes** | Painel longo original, com todos os logs, explicações, recursos, controles e **Liberar box** | Voltar ao resumo ou X/Esc à origem |

### Mudanças na implementação
- [x] Criar `phaser-play/order-quick.js`: renderizador isolado, sem mutações do engine, HTML escapado, conteúdo condicionado a alocação/etapa/ferramental/estoque.
- [x] Manter `data-panel="detail"` como resumo e criar `data-panel="full-detail"` para o menu integral já conhecido; todo botão **Liberar Box** fica exclusivamente dentro do painel integral.
- [x] Recuperar origem na navegação (`queue` vs `workshop`) para X, Esc e Fechar; dados apenas de navegação em memória, não no save.
- [x] No box vazio, abrir fila e pré-selecionar o box no formulário de alocação; a engine continua validando conflitos de mecânico, box e descanso.
- [x] Mostrar feedback de hipótese escolhida **logo abaixo dos seis quadros**, sem antecipar a resposta antes do clique. Resposta correta/incorreta continua registrada por `E.answer`; custo de retrabalho e recuperação de energia permanecem iguais.
- [x] Evidência da fase só aparece após `E.hint`; o custo de energia mental permanece, sem revelar a hipótese correta.
- [x] Ferramenta faltante bloqueia a escolha de hipótese e a solicitação de evidência como já faz `engine.js`, agora refletindo também esse bloqueio no modal.
- [x] Diagnóstico concluído mostra somente resultados já confirmados; `Comprar peça` usa a compra urgente atual (`E.orderMaterial`) e só aparece quando não há saldo nem uso confirmado.
- [x] CSS compacto: modal de até 760 px, seis quadros em grade 3×2, quatro hipóteses 2×2; tamanhos, espaçamentos e botões reduzidos com regras responsivas (inclusive telas baixas); `overflow:hidden` exclusivo do resumo rápido, `overflow-y:auto` no menu de detalhes.
- [x] Alterar HTML, scripts, cache PWA e adicionar regressão `scripts/test-order-quick.cjs` ao CI, validação de elenco e deploy.

### Limites e homologação
- O relato pode ser mais longo que o espaço disponível: o resumo limita linhas visuais para preservar a janela sem scroll, mas o texto completo permanece no menu Detalhes.
- Fila, Gestão, Almoxarifado e demais painéis conservam seu próprio comportamento de rolagem, necessário para listas extensas; **a restrição sem scroll é dos modais rápidos de OS**.
- [ ] Homologar no navegador desktop, Android e telas baixas: primeira seleção na fila, box vazio, box ocupado, retorno pelo X/Esc, box pré-selecionado e quatro hipóteses.
- [ ] Conferir progressão de etapas com acerto/erro, registro de evidência, compra de ferramenta, falta de saldo/peça, pedido em trânsito, liberação somente nos Detalhes.
- [ ] Verificar se textos longos de falha, nomes de recursos e labels das hipóteses cabem e permanecem acessíveis; testar navegação por teclado.
- [ ] Testar importação/exportação de campanha anterior e exibir a mesma OS após retorno do menu completo.

**Critério de aceite:** alocação e diagnóstico em no máximo uma tela sem rolagem do resumo, preservando o processo de manutenção e retorno contextual.

## Entrega 0.8.23 — Biblioteca de supervisores (apenas assets; sem gameplay)

**Origem:** duas imagens enviadas pelo usuário em 18/10/2026, identificadas na ordem como **Major** (primeira imagem) e **Duarte** (segunda imagem). O usuário confirmou que a nova renderização 2× da v0.8.22 apresentou qualidade visual excelente. Esta entrega não modifica a renderização, o sistema de OS, a equipe nem o save.

### Arquivos e transformações

- [x] Registrar Major e Duarte em `phaser-play/assets/characters/supervisors/manifest.json`, com papéis visuais de **supervisor**, IDs exclusivos, origem, poses, SHA-256 e metadados de processamento.
- [x] Preservar as cartelas PNG originais sem qualquer alteração nos arquivos `major-original.png` e `duarte-original.png`.
- [x] Gerar spritesheets **WebP lossless com alfa**, `major-4poses.webp` e `duarte-4poses.webp`, layout padronizado **1160×1244**, quadros **580×622**, quatro poses por personagem (2 colunas × 2 linhas).
- [x] Corrigir a separação vertical de Duarte: a imagem de origem possuía personagens dos quadros superiores que ultrapassavam a divisória; segmentação por componente conexo do canal alfa evita cortar botas ou contaminar as poses inferiores.
- [x] Ajustar uma escala consistente por personagem, centralizar as silhuetas e manter **margem de solo de ao menos 12 px** sob o ponto opaco mais baixo, preservando proporção e poses.
- [x] Expor [galeria de supervisores](assets/characters/supervisors/index.html) com visualização de cada pose e links diretos para WebP e originais.
- [x] Registrar teste `scripts/test-supervisor-assets.cjs` para integridade, dimensões, hash, formato lossless, transparência, grade e não participação na simulação. Acrescentar validação no CI e workflow de publicação.

### Poses cadastradas

| Personagem | Quadro 0 | Quadro 1 | Quadro 2 | Quadro 3 |
| --- | --- | --- | --- | --- |
| **Major** | Braços cruzados | Positivo | Tablet | Ajoelhado com rádio |
| **Duarte** | Anotação em prancheta | Positivo | Rádio | Checklist |

### Fronteira funcional

- **Não implementado:** contratação de supervisores, supervisão em OS, gestão de escala, animação deles na oficina, bônus de produtividade ou custos associados. Não alterar `engine.js`, `game-data.json`, `game.js`, `WORKER_SHEETS`, `INITIAL_TEAM` ou `RECRUIT_POOL` nesta entrega.
- [ ] Futuro: detalhar a mecânica de supervisão e sua capacidade/energia antes de ativar sprites na cena, mantendo separada a figura do supervisor dos HH produtivos das ordens.
- [ ] Homologação visual: conferir galeria publicada em desktop/mobile e reconhecer as quatro poses de ambos; registrar aprovação artística.

**Critério de aceite desta entrega:** quatro arquivos de imagem versionados (dois originais + dois atlas) e dois supervisores disponíveis no catálogo futuro sem qualquer efeito na campanha existente.

## Entrega 0.8.22 — Renderização de personagens em alta densidade (P0 / imagem)

**Motivo:** o usuário confirmou que a v0.8.21 segue excessivamente pixelada. Alterar PNG para WebP não resolve: WebP é um contêiner; os sprites atuais são WebP sem perdas, mas o canvas lógico de 1080×450 é ampliado por CSS e os trabalhadores eram desenhados em cerca de 54×58 pixels de mundo.

### Mudanças implementadas
- [x] A resolução de rasterização passa a **2160×900 pixels no desktop** por padrão; mantém **1080×450 no celular** por padrão para reduzir GPU e consumo de bateria.
- [x] Em Phaser 3.90 **não utilizar `GameConfig.resolution`**, removido no Phaser 3.50; em seu lugar, o zoom de câmera acompanha o multiplicador (2×/1×), com `centerOn` sobre o centro da janela original `(859,270)`. Preserva a área de mundo 1080×450, os três boxes, limites, posições de máquinas, sombras, HUD e as zonas de clique.
- [x] `render.antialias=true` e `antialiasGL=true`, `pixelArt=false`; workers continuam LINEAR com pré-filtragem por quadro e máquinas com tratamento específico já existente.
- [x] Trabalhadores passam a ocupar envelope máximo nominal **66×80** em vez de 54×64 (cerca de 22% mais largura). Mantêm `origin(.5,1)`; não há deslocamento manual do piso. A geometria de contenção usa a largura nova; verificar enquadramento especialmente em escavadeiras/perfuratrizes.
- [x] Perfil isolado em `phaser-play/render-quality.js`, testável em Node, carregado antes do jogo. `?quality=low` ou `?quality=1` força 1080×450 para comparação/rollback; `?quality=high` ou `?quality=2` força 2160×900 inclusive no celular, sob responsabilidade do usuário.
- [x] Novo cache PWA `porcaria-vqec-20261018-v102`, script `game.js?v=0.8.22` e regressões automatizadas; saves não são alterados.

### Evidência e limitações
- Conforme documentação do Phaser v3.90, Scale.FIT pode aplicar aumento CSS sem aumentar a resolução real; a câmera com zoom acompanha o canvas maior para manter a mesma área de mundo. O recurso legado de resolução foi removido da v3.
- O ganho esperado decorre de **mais pixels rasterizados, personagens menos minúsculos e filtragem bilinear**. Isso não aumenta detalhe que não existe no asset, nem substitui aprovação visual.
- Rendering HiDPI com tela maior usa até 4× pixels de framebuffer no desktop. O modo leve fica acessível para GPUs restritas, e a escolha automática no navegador é feita no carregamento (mudança de tamanho de janela pede reload).
- Nenhuma alteração no formato WebP, na arte original, na geometria da oficina, no funcionamento das OS ou no arquivo de save.

### Testes de homologação (pendentes no navegador)
- [ ] Verificar que o fundo 2D exibe exatamente os mesmos limites nos modos `?quality=low` e `?quality=high`.
- [ ] Clicar nos três boxes, selecionar OS via máquinas e mecânicos, alternar cenários dia/noite sem seleção deslocada.
- [ ] Confirmar cabeças, óculos, EPIs e braços legíveis nos sprites; comparar captura desktop antes/depois em zoom 100%.
- [ ] Conferir se os novos trabalhadores de 66 px permanecem dentro do box e não encobrem ferramentas, rodas ou HUD; observar poses ajoelhadas.
- [ ] Rodar turno, importar/exportar save, abrir/fechar pop-ups e verificar responsividade no mobile.
- [ ] Medir uso de GPU/desempenho desktop e validar modo leve `?quality=low` como fallback.

**Aceite:** mais nitidez percebida sem mover equipamentos, afetar seleção de OS, reduzir FPS drasticamente ou introduzir incompatibilidade PWA.

## Entrega 0.8.21 — Junior em proporção chibi e pré-filtragem dos sprites (P0 / arte e renderização)

**Implementação de 18/10/2026.** Status: código e novo WebP preparados para publicação; CI e inspeção visual no navegador não equivalem à aprovação artística.

### Corrigido
- [x] Substituir **somente o atlas de campo do Junior** (`assets/characters/junior/junior-work-4poses.webp`), preservando a arte de camisa azul exclusiva de Equipe/treinamento.
- [x] Usar a imagem revisada com cabeça maior e tronco mais largo, mantendo as poses ferramenta, aprovação, rádio e reparo ajoelhado.
- [x] Separar corretamente as quatro silhuetas antes da criação do atlas: a imagem original 1254×1254 tinha poses com pixels além do limite teórico dos quadrantes, causando recorte de botas. O novo atlas 1160×1244 contém quatro quadros independentes de 580×622.
- [x] Ancoragem de cada pose pelo menor ponto opaco, com **12 px inferiores de margem**; nenhuma silhueta invade outro quadro. O ponto de apoio `origin(.5,1)`, a posição dos boxes e a altura visual nominal dos profissionais não mudam.
- [x] WebP VP8X/VP8L **lossless** com transparência, SHA-256 `752ac264efe56c7a93d80780b94f9a344c4562c8a4ac7b82615aa82c0ed4e5b2`, **922.726 bytes**; hashes e tamanho conferidos no teste `test-junior-specialist.cjs`.
- [x] **Pré-filtragem única por personagem e por pose** no Phaser: reamostragem do atlas de 580×622 para **290×311 por frame** via Canvas 2D (`imageSmoothingQuality='high'`), depois filtro LINEAR. Evita a minificação direta ~10× realizada anteriormente. O atlas original permanece íntegro; cache de texturas derivadas não é recalculado a cada frame.
- [x] Nenhum deslocamento de máquinas, sombras, HUD, hitboxes, pontos de apoio nem alteração de save ou regras econômicas.
- [x] Invalidação de cache PWA (`porcaria-vqec-20261018-v101`) e script Phaser (`game.js?v=0.8.21`); regressões para dimensões, filtragem, geometria e compatibilidade.

### Limite material da nitidez
A oficina usa mundo Phaser **1080×450**, ampliado via CSS no desktop. A pré-filtragem melhora a amostragem dos **sprites individuais**, mas não aumenta a resolução física do canvas. Dobrar a resolução da câmera/viewport é uma evolução separada, pois exige validar transformações de clique, barras, fontes, desempenho mobile e as três hitboxes. Não declarar nitidez perfeita sem capturas comparativas.

### Homologação obrigatória no GitHub Pages
- [ ] Limpar preview/caches, carregar campanha nova com Junior; conferir capacete, proporção, braços e botas nas quatro poses.
- [ ] Verificar Junior em BOX 1/2/3, com fundo diurno e noturno; conferir 12 px de transparência abaixo das botas e ausência de corte/teleporte entre poses.
- [ ] Conferir que Geovane, Pedro e demais contratáveis mantêm a posição e que os novos sprites estão **mais legíveis** em telas 1366, 1920 e mobile.
- [ ] Executar OS (diagnóstico→reparo), concluir serviço, importar save legado e verificar identidade e persistência.
- [ ] Testar fallback de textura no Firefox/Chromium, exportação/importação, PWA e custo de memória.
- [ ] Registrar comparação de captura **antes/depois** e, somente então, aprovar arte e renderização.

**Critério de aceite:** Junior compacto, quatro quadros íntegros e ancorados pelo mesmo piso; detalhes de EPI legíveis sem alterar a oficina nem o estado simulado.

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


## Entrega 0.8.20 — Contratação nominal, qualidade visual e Box 2 (PR #39)

- [x] Equipe inicial de campanhas novas: **Pedro, Geovane e Junior**.
- [x] Dez contratações possíveis: **Costa, Silva, Santos, Moura, Barbosa, Garcia, Braga, Almeida, Sousa e Pereira**.
- [x] Seleção individual de personagem com retrato, nome e custo, sem trabalhadores genéricos novos.
- [x] Máximo de 13 personagens; três boxes e a mesma economia de contratação.
- [x] Migração sem substituição, adição automática ou perda de OS nos saves anteriores.
- [x] Seis imagens WebP preparadas, com hashes registrados e testes de integridade.
- [x] **Seis WebP integrados:** arquivos de produção reexportados em modo lossless, com novos hashes verificados por teste.
- [x] **Minificação:** LINEAR nos sprites de profissionais (escala aproximada 580×622 → 54×64).
- [x] **Geometria:** deslocamento adicional de -5 px aplicado somente aos mecânicos do BOX 2 nos dois perfis, sem mover máquinas e HUD.
- [ ] **Homologação visual:** conferir qualidade e oclusão do Junior perto da caçamba em dia/noite.
- [ ] Verificar CI e homologar recrutamento, sprites no galpão, retratos, dia/noite e saves em desktop/mobile.

### Correção visual da v0.8.20 — 18/10/2026

**Evidência recebida:** screenshot mostrou detalhes perdidos nos funcionários e Junior aparentemente apoiado sobre a caçamba no BOX 2. O código usava filtro `NEAREST` para quadros de 580×622 reduzidos a aproximadamente 54×64, agravando o aliasing. O lote anterior de seis WebP também usava compressão com perdas.

**Ações:** atlas dos seis novos personagens recompostos dos PNG originais e salvos em WebP **lossless**, canal alfa e grade 2×2 preservados; Phaser filtra spritesheets de profissionais com **LINEAR** na minificação, sem mudar equipamentos; offset `workerOffsetX=-5` somente no BOX 2, aplicado após posicionamento/clamp nos perfis fullFrame e cropped, sem alterações na sombra, chão, máquinas ou HUD. Novo teste de regressão: `scripts/test-worker-visual-quality.cjs`. O teste `test-named-recruits.cjs` interpreta o cabeçalho VP8L para dimensões/alfa (diferente do VP8X com perdas).

**Limite de validação:** reposicionar 5 px não demonstra sozinho que desapareça a percepção de flutuação; conferir visualmente a oclusão entre profissional e caçamba no Pages. O jogo mantém a âncora inferior `(0.5,1)` e o Y original, e o QA humano é necessário.

## Entrega 0.8.19 — Sprites da pá carregadeira, motoniveladora e trator (P0 / equipamentos)

**Publicação:** [PR #38](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/38) integrado à `main` em `ff8f1615` (18/10/2026). [CI #39115279306](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39115279306) e [workflow Pages #39115333229](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39115333229) aprovados, inclusive hashes das três imagens e testes do motor. **QA visual em navegador ainda pendente.**


**Solicitação:** o usuário forneceu referências para CAT 966, CAT 16 e CAT D9, avaliou as três artes pixel-art produzidas e solicitou a substituição dos assets no jogo, documentação e publicação no GitHub Pages.

### Implementação

- [x] **CAT D9 / EQ07:** substituído o desenho provisório de trator de esteiras por `assets/equipment/catd9-dozer-v0819.webp` (273.480 bytes; SHA-256 `ca914d9882d5b6f7f8548a17152b3170dfa0906f2dc527446785d54255dbc952`). O fallback vetorial permanece apenas para falha do carregamento.
- [x] **CAT 966 / EQ08:** substituído o desenho genérico da carregadeira por `assets/equipment/cat966-loader-v0819.webp` (231.356 bytes; SHA-256 `044b425baf37f4836482c5b9cd28824f30b638b0504cde40b27117116d4de700`).
- [x] **CAT 16 / EQ09:** substituído o desenho genérico de motoniveladora por `assets/equipment/cat16-grader-v0819.webp` (245.206 bytes; SHA-256 `dd520eeca708c389235fd2c4707bfd42e99dff567fd79c5d4ecc2d56bb3c35de`).
- [x] **Conversão:** as três artes consolidadas em PNG RGBA foram convertidas para WebP RGBA de qualidade 92, **1448 × 1086 px**, sem recorte da composição nem nova geração durante a integração. Transparência preservada.
- [x] **Mapeamento Phaser:** `MACHINES` agora associa explicitamente `EQ07:'dozer'`, `EQ08:'loader'`, `EQ09:'grader'`. Modelos EQ01–EQ06 e DR410i/DI650i continuam com as mesmas texturas, sem alterações no motor de OS.
- [x] **Geometria e piso:** `scene-map.json` registra origem, tamanho, hashes e filtro NEAREST. A versão mantém limites dos boxes, escala, posição de contato com o piso e recorte somente das margens transparentes pelo Phaser; preserva os alinhamentos anteriores de dia/noite e os offsets do BOX 3.
- [x] **PWA:** atualizado `game.js?v=0.8.19` e `sw.js` `porcaria-vqec-20261018-v099`, com pré-cache das três novas imagens.
- [x] **Teste automatizado de integridade:** `scripts/test-loader-grader-dozer-asset.cjs` verifica tamanho, canal alpha, hash, vínculo por ID, geometria dos três boxes, condições de fallback e PWA; registrado no CI e deploy Pages.
- [x] **Documentação de ativos:** [ASSET-PACK-0819.md](assets/equipment/ASSET-PACK-0819.md) detalha arquivo original, SHA-256, dimensões, otimização, rollback e homologação.

### Homologação visual pendente

- [ ] Abrir OS para **CAT D9**, **CAT 966** e **CAT 16**, conferir correspondência e definição dos sprites novos.
- [ ] Verificar perspectiva e alinhamento de rodas/esteiras, sombra de contato com piso e escala em cada BOX 1/2/3.
- [ ] Alternar dia → noite → dia e verificar que não há salto de escala nem deslocamento indevido.
- [ ] Verificar que diagnósticos, placas BOX, HUD de OS e mecânicos não ficam encobertos indevidamente.
- [ ] Testar carregamento desktop e mobile/PWA com cache atualizado, inclusive rede lenta e retorno offline.
- [ ] Garantir que CAT 777E, CAT 6030, escavadeiras, DR410i e DI650i não tenham regressão visual.

**Critério de aceite:** as três máquinas aparecem com as imagens aprovadas no modelo correto, cabem no box e tocam o piso, mantendo integralmente as regras do jogo. **Testes geométricos e CI não substituem QA visual de navegador.**

## Entrega 0.8.18 — Junior Especialista: duas identidades visuais por contexto (P0 / personagens)

**Publicação:** [PR #37](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/37) integrado à `main` no commit `201ce9ee`, com [CI #39088898785](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39088898785) e [Pages #39088956397](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39088956397) concluídos com sucesso. **Homologação visual no navegador ainda aberta.**


**Origem:** duas cartelas enviadas pelo usuário representam **a mesma pessoa, Junior (Especialista)**. No trabalho em máquinas deve vestir proteção com **balaclava**; nos menus futuros de treinamento deve usar **camisa social azul**. Nenhum personagem duplicado, nenhuma arte nova gerada.

### Implementado
- [x] **Arquivos aprovados:** `assets/characters/junior/junior-work-4poses.webp` — 202.152 B, SHA-256 `a4777757f79ae25f595b5736fb112cc102455452e95969b2a3b64c653303a229`; `assets/characters/junior/junior-training-4poses.webp` — 213.964 B, SHA-256 `a652d9f9666e9cfaa4970cfbe3d6e51bafeef3f7a0e3963463fbdcf1fd5c2ab7`. Ambos transparentes, 1160×1244 px, grade 2×2, quatro quadros de 580×622 px, pés alinhados. Fontes PNG 1254×1254 e processo detalhados no [manifesto](assets/characters/junior/manifest.json).
- [x] **Equipe inicial:** Junior adicionado como sétimo membro, normalmente M7 numa campanha nova, com `specialty:'Especialista'`, `sprite:'junior'` e `trainingSprite:'junior-training'`. Os seis nomes anteriores permanecem na mesma ordem. O campo `role:'geral'` permanece intencionalmente até regras específicas de especialização serem desenhadas, sem bônus fictício.
- [x] **Oficina:** motor Phaser exibe exclusivamente a cartela com balaclava quando Junior está atribuído à OS, inclusive dia/noite e nos três boxes; participa das quatro poses no mesmo código de animação dos demais funcionários.
- [x] **Equipe e futura capacitação:** retrato do Junior usa **camisa azul** na tela Equipe, e a cartela equivalente está versionada para o futuro menu **Gestão → Treinamentos**. O menu de treinamento ainda **não existe**; nenhuma certificação/progressão foi ativada.
- [x] **Migração segura:** `normalizeRoster` preserva os contratos e OS existentes, inclusive o antigo “Mecânico M7”, adicionando Junior em outro ID livre. Evita ultrapassar a lotação máxima atual de 9 profissionais em saves antigos completos. A migração é idempotente.
- [x] **Capacidade:** 7 × 10,5 = **73,5 HH nominais de equipe**; somente **31,5 HH simultâneas** cabem nos três boxes. A folha total acompanha o tamanho da equipe; contratação continua por R$ 1.050 e com limite máximo 9.
- [x] **Versionamento:** build `0.8.18`, PWA `v098`, preload do EPI de oficina, pré-cache das duas fardas, arquivos legados preservados.
- [x] **Testes:** `scripts/test-junior-specialist.cjs` cobre dois hashes, alpha, quadros, separação de contexto, M7 legado, função e save idempotente; incluído no CI e no deploy Pages.
- [x] **Documentação:** [Junior README](assets/characters/junior/README.md), [ROSTER.md](assets/characters/ROSTER.md), projeto de treinamento alinhado ao papel de especialista.

### Homologação visual pendente
- [ ] Confirmar Junior de balaclava (e NUNCA de camisa azul) numa OS de equipamento, em cenário diurno e noturno.
- [ ] Confirmar o retrato com camisa azul em Equipe; mais tarde, validá-lo no futuro menu de Treinamentos.
- [ ] Verificar prancheta, positivo, rádio e trabalho ajoelhado nos quadros adequados, sem sobreposição de quadrantes, recorte ou flutuação.
- [ ] Criar nova campanha e verificar os sete nomes, contratação do genérico M8 sem sprite e capacidade de três boxes.
- [ ] Importar save antigo com M7 contratado/alocado; garantir que Junior receba outro ID e não altere a OS existente.
- [ ] Verificar comportamento com campanha já lotada (nove profissionais), responsividade móvel e atualização PWA.

**Critério de aceite:** contextos visuais distintos respeitados, dados e campanha preservados, nenhum bônus de Especialista aplicado sem futura especificação, testes automáticos aprovados e homologação visual no Pages.

## Entrega 0.8.17 — Substituição do asset Sandvik DR410i (P0 / equipamentos)

**Publicação:** [PR #36](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/36) integrado à `main` no commit `df9b60d9`, com [CI #39087180090](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39087180090) aprovado e [Pages #39087216683](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39087216683) publicado com sucesso. **Homologação visual no navegador ainda pendente.**


**Origem:** o usuário enviou `Plataforma de Perfuração Industrial Laranja(1).png` para **substituir somente a DR410i**. A imagem apresenta perfuratriz laranja/vermelha com cabine branca, guarda-corpos amarelos e esteiras pretas em vista 3/4 de cima. O novo asset deriva do arquivo recebido, sem nova geração, remoção de peças nem mudança de perspectiva.

### Entrega
- [x] **Imagem original:** PNG RGBA **1536 × 1024 px**, 2.115.371 bytes, SHA-256 `353782cf7ec99fe4f0fe35aa5f5e57f3f0818bbf0bb63e269e4e39c71d7df0f8`. Transparência confirmada; sem recorte.
- [x] **Asset de produção:** `phaser-play/assets/equipment/sandvik_dr410i_v2.webp`, **1536 × 1024 px**, 339.938 bytes; WebP qualidade 92 com canal alpha, SHA-256 `ccea0bbc7380d683dc44dcd06281b80af4150147fb6250ef8db6c009ec1da13a`. Otimização com perdas leves de codificação, sem alteração criativa.
- [x] **Separação por modelo:** `EQ05` (Sandvik DR410i) referencia a nova textura `dr410i`; `EQ06` (Sandvik DI650i) mantém a chave e a imagem legadas `drill` / `sandvik_dr410i.png`. Isso evita substituir indevidamente as duas máquinas, que compartilhavam um sprite.
- [x] **Geometria:** renderização Phaser respeita proporção original, origem inferior do equipamento e limites de `placementWorld` nos três boxes, com perfil único `fullFrame` para dia/noite. `scene-map.json` registra novo arquivo, dimensões, origem histórica e hash.
- [x] **Rollback:** arquivo `sandvik_dr410i.png` antigo mantido no repositório; CAT 777E, 6030, 395, DI650i, mecânicos, saves e regras não foram modificados.
- [x] **Versão/cache:** `game.js?v=0.8.17` e Service Worker `porcaria-vqec-20261017-v097` com pré-cache do novo sprite para reduzir a chance de clientes PWA exibirem imagem desatualizada.
- [x] **Testes de regressão:** `scripts/test-dr410i-asset.cjs` verifica integridade SHA-256, 1536×1024, transparência, uso exclusivo em EQ05 e geometria dos três boxes. CI e Pages exigem esse teste e o hash do asset.

### Homologação
- [ ] Iniciar/carregar OS da Sandvik DR410i (EQ05), verificar forma, cores, sem corte de mastro/esteiras e alinhamento no piso.
- [ ] Alternar turnos diurno/noturno, verificar mesmo tamanho, posição e sombra.
- [ ] Conferir que a DI650i (EQ06) **não** recebeu o novo desenho da DR410i.
- [ ] Testar equipamento nos boxes 1, 2 e 3 e em largura desktop/mobile; confirmar sem sobreposição de outras máquinas e HUD.
- [ ] Testar PWA instalada ou recarregar após troca de cache.
- [ ] Revisar qualidade e proporção visual em comparação com os outros equipamentos.

**Critério de aceite:** DR410i mostra somente o PNG fornecido convertido para WebP sem redesenho; DI650i e demais equipamentos preservados; máquina plenamente enquadrada nos boxes e sem quebra de navegação. **QA visual humana pendente.**

## Entrega 0.8.16 — Costa, Silva, Santos e Moura: equipe inicial ampliada (P0 / personagens)

**Publicação:** [PR #35](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/35) integrado à `main` (commit `bfaad3fb`), com [CI #39086221428](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39086221428) aprovado e [Pages #39086274259](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39086274259) publicado com sucesso. Os seis hashes de sprites e os testes de migração/HH passaram. **A avaliação visual das quatro poses por profissional no navegador permanece pendente.**


**Origem:** o jogador enviou três cartelas novas para Silva, Santos e Moura e solicitou a mudança do nome Isaias para Costa. A ordem dos arquivos anexados determina a associação: Silva = marreta e óculos escuros; Santos = chave, óculos transparentes e lanterna vermelha; Moura = proteção facial e rádio. A arte da Bia continua exclusiva do futuro módulo de treinamento.

### Implementação

- [x] **Costa:** M1 deixa de se chamar Isaias; mantém perfil eletricista e o mesmo sprite visual. Um novo caminho `costa-4poses.webp` referencia os bytes aprovados do arquivo histórico `isaias-4poses.webp`, preservado para rollback.
- [x] **Novos atlas:** `silva-4poses.webp` (287.544 B, SHA-256 `26f68b092d14bfb940a7e44577b1d117d14571b27bd69fc0a248124102c849eb`), `santos-4poses.webp` (281.232 B, `48105f1036d2b9693531abb349954f251e1c2d31c4a599e8cdd7ad9c0d5f89ce`) e `moura-4poses.webp` (313.970 B, `eba522ff337b6838cd4e2f5f77043c7e410bf32a425d2dd243a143f9b64fd99d`). Todos têm 1160 × 1244 px, transparência e quatro quadros 580 × 622 px. Arte original fornecida pelo jogador, sem geração adicional.
- [x] **Equipe inicial:** M1 Costa, M2 Pedro, M3 Geovane, M4 Silva, M5 Santos e M6 Moura; os três novos recebem função inicial `Mecânico` e `role:'geral'` até definição da disciplina. Profissionais da equipe continuam com energia, moral e trabalho individual.
- [x] **Contratação genérica:** continua habilitada, nome “Mecânico”, ID individual e `sprite:null`. Em campanha nova, o primeiro contratado passa a ser M7; nunca usar a arte dos seis personagens oficiais para contratados.
- [x] **Migração idempotente:** `normalizeRoster` troca Isaias por Costa, adiciona os três nomes somente se ausentes e usa IDs livres. Mecânicos M4/M5/etc. contratados antes desta atualização permanecem genéricos, conservando especialidade, skill, energia, OS e dinheiro. Nico/M4 legado ocioso continua removível; Nico designado mantém sua OS. Nenhuma versão/schema de save é alterada.
- [x] **Limites físicos e econômicos:** permanecem três boxes e 10,5 HH úteis/pessoa/turno. Seis disponíveis equivalem a **63 HH nominais da equipe**, mas somente **31,5 HH por turno podem trabalhar simultaneamente nos boxes**; equipe extra cobre descanso, fila e flexibilidade. O custo fixo de pessoal acompanha os seis empregados (nenhuma redução artificial de folha).
- [x] **Phaser/UI:** `WORKER_SHEETS` carrega os seis arquivos corretos e desenha exclusivamente o funcionário atribuído à OS; cards de Equipe exibem retrato/nome/função. Os fundos diurno/noturno e equipamentos aprovados não mudaram.
- [x] **Integridade e cache:** testes de nomes, arquivos, quatro quadros e migração sem colisões; teste de planejamento/prontidão/semanal atualizado para seis; cache PWA `v096`, `game.js?v=0.8.16`.
- [x] **Documentação:** [ROSTER.md](assets/characters/ROSTER.md) registra associação de arquivos, hashes, sprites legados e comportamentos.

### Homologação manual (pendente)

- [ ] Reiniciar uma campanha, verificar em Equipe somente os seis perfis oficiais iniciais na ordem Costa, Pedro, Geovane, Silva, Santos e Moura.
- [ ] Conferir que Costa usa o mesmo visual elétrico anteriormente chamado Isaias e que cada novo uniforme/ferramenta corresponde à pessoa correta.
- [ ] Alocar Silva, Santos e Moura individualmente no BOX 1/2/3; observar quatro poses, transparência e apoio de botas no piso no dia e à noite.
- [ ] Contratar um profissional e verificar “Mecânico (M7)” sem sprite; não alterar o rol de seis identidades.
- [ ] Importar save antigo com M4 já contratado ou trabalhando. Seu número não pode ser reutilizado para Silva, e todas as OS atribuídas precisam permanecer intactas.
- [ ] Confirmar nas telas de planejamento e prontidão que 63 HH nominais não se confundem com teto de execução simultânea de 31,5 HH dos três boxes.
- [ ] Validar o desempenho no celular/PWA e a carga de imagens (sprites da Bia continuam fora do preload do jogo).

**Critério de aceite:** seis pessoas reais cadastradas, identidades e imagens sem trocas, migração sem perda de OS ou IDs, limites operacionais realistas, nenhum sprite genérico inventado. Testes automáticos não substituem QA visual.

## Entrega 0.8.15 — Acervo da Bia e projeto de treinamento (P1 / base artística + planejamento)

**Publicado:** [PR #34](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/34) integrado na `main` (commit `32c5107a`). [CI #39083803606](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39083803606) e [Pages #39083846517](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39083846517) aprovados, incluindo os quatro hashes. **A biblioteca visual aguarda homologação humana no navegador; T1–T5 continuam futuros.**


**Escopo desta entrega:** organizar as quatro cartelas fornecidas para futura interface de capacitação e detalhar um projeto pedagógico que aumente capacidades de diagnóstico e reparo por **disciplina e equipamento**. **Não implementar ainda a compra de cursos, ganho de habilidade ou alteração de saves.**

### Assets e rastreabilidade — implementado

- [x] **Quatro atlas WebP transparentes** da Bia, cada um com 4 quadros (16 poses). Diretório `phaser-play/assets/characters/bia/`. Atlas `1160 × 1244`, quadros `580 × 622`, mesma escala de personagem, pés alinhados e alpha preservado.
- [x] **Coleções nomeadas:** `feedback` (prancheta/aprovação), `inspection` (anotações/ajoelhada), `field` (prancheta/rádio/caminhada), `coaching` (apontar/caminhar/avaliar ajoelhada).
- [x] **Origem preservada:** quatro PNGs originais de 1254 × 1254 fornecidos na conversa, sem geração de personagens ou redesenho. Fragmentos provenientes de quadros vizinhos removidos na conversão mecânica. WebP qualidade 91.
- [x] **Manifesto de poses** `assets/characters/bia/manifest.json` com quatro arquivos, origem, SHA-256, dimensões e índices de quadros.
- [x] **Galeria independente** para homologação visual, sem carregar Bia na oficina: [Visualizar as 16 poses](assets/characters/bia/).
- [x] **Guia de sprites** `assets/characters/bia/README.md`, com uso previsto no Phaser. `scripts/test-bia-training-assets.cjs` protege integridade, dimensões, número de quadros e Bia fora da equipe inicial.
- [x] **Sem alteração do motor:** Isaias/Pedro/Geovane continuam equipe inicial, contratação genérica mantém `sprite:null`, UI operacional/diagnóstico e save não são alterados.

### Sistema de treinamento — especificado, **ainda não implementado**

O projeto completo está em [TRAINING_DESIGN.md](TRAINING_DESIGN.md). Ele abrange:

- [x] **T0 / desenho:** fundamentos, diagnóstico e reparo independentes; disciplinas `motor`, `hidraulica`, `rodante`, `eletrica`, `perfuracao`, `solda`, `geral` e segurança (futuro), e as nove máquinas EQ01–EQ09 já cadastradas.
- [x] **Matriz de progressão proposta** N0–N4 por disciplina e por modelo, separando especialização diagnóstica da capacidade de execução; limites de bônus configuráveis e sem atalhos que revelem respostas de OS.
- [x] **Economia planejada:** teoria, simulador, prática e avaliação consomem turnos, recursos e disponibilidade do colaborador. Geovane poderá atuar como instrutor somente se o tempo dele for contabilizado; Bia é apenas apoio visual.
- [x] **Integração prevista:** salvar competências com migração explícita, respeitar descanso e OS em andamento; medir custo, HH sacrificadas, MTTR, acerto, retrabalho e first-time fix sem atribuir indevidamente efeito a formação.
- [ ] **T1 — Catálogo de cursos:** lista data-driven por disciplina/modelo, pré-requisitos, progressão, cursos e casos de treino sem spoilers.
- [ ] **T2 — Motor de capacitação:** conflitos, turno, matrícula, custo, avaliação, certificados, impacto limitado no diagnóstico e reparo.
- [ ] **T3 — UI de Gestão → Treinamentos:** Bia, inscrições, análise de custo/benefício, níveis e cursos; acessibilidade desktop/mobile.
- [ ] **T4 — Prática e avaliações:** casos didáticos, feedback contextual e certificados, sem revelar causas ocultas de OS abertas.
- [ ] **T5 — Métricas e balanceamento:** comparar turmas e OS, limites de ganho, testes de save, PWA e calibração.

### Homologação

- [ ] Conferir as 16 poses na página de galeria: cabelo, uniforme vermelho, capacete branco decorado, tatuagens, transparência, prancheta e pés sobre a mesma base.
- [ ] Testar galeria e filtros em desktop e celular.
- [ ] Confirmar equipe inicial e contratação inalteradas, sem Bia no seletor de OS.
- [ ] Verificar se o novo acervo não afeta o tempo de carregamento inicial da oficina, nem os cenários dia/noite.

**Critério de aceite:** assets e projeto documentados, quatro arquivos acessíveis no Pages e protegidos por teste automatizado; nenhum progresso de treinamento deve ser simulado antes da implementação de T1–T5.

## Entrega 0.8.14 — Equipe oficial e sprites por profissional (P0 / personagens)

**Publicação:** [PR #33](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/33) integrado à `main` no commit `8667ef36`, com CI e suíte de regressão aprovados. [Workflow Pages #39079556189](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39079556189) concluiu com sucesso, inclusive verificação de integridade dos WebP. **Pendente apenas homologação visual/funcional no navegador.**


**Solicitação:** substituir as imagens antigas de mecânicos pelas três cartelas de poses enviadas pelo jogador, deixar somente **Isaias (Eletricista), Pedro (Brigadista) e Geovane (Instrutor, uniforme amarelo)** na equipe inicial e permitir contratações futuras com o nome **“Mecânico”**, sem sprite, até receberem novos assets.

### Entrega implementada

- [x] **Arquivos oficiais versionados:** três atlas WebP transparentes `assets/characters/{isaias,pedro,geovane}-4poses.webp`, 1160 × 1244 px, quadros 580 × 622 px, quatro poses. Derivação exclusiva das cartelas encaminhadas pelo usuário; sem nova geração ou alteração criativa.
- [x] **Correspondência de identidades:** Isaias = roupa cinza/capacete amarelo, `eletrica`; Pedro = uniforme vermelho de brigadista, `geral`; Geovane = roupa amarela de instrutor, `geral`. O código separa **identidade/função visual** de especialidade mecânica simulada.
- [x] **Equipe inicial reduzida:** M1 Isaias, M2 Pedro, M3 Geovane; três funcionários e três boxes. A capacidade nominal inicial passa a 31,5 HH úteis/turno (3 × 10,5), coerente com as regras já existentes.
- [x] **Contratação genérica:** novos funcionários recebem `name:'Mecânico'`, `sprite:null`, ID próprio e especialidade simulada; custam R$ 1.050 e 18 de energia mental como antes. A interface os identifica pelo ID para evitar confusão e renderiza somente um rótulo textual no box, sem personagem.
- [x] **Uma pessoa real por OS:** removida alternância artificial Lia/Rafael por slot; o box agora consulta o mecânico realmente alocado em `j.assigned` e usa somente seu conjunto de quatro poses (ou nome para genérico). A animação alterna frames da cartela; não cria mais dois mecânicos para uma única OS.
- [x] **Equipe:** cards exibem retrato oficial e função com número identificador; contratados exibem “SEM SPRITE”. Ordem de Serviço e menu de alocação passam a distinguir contratados com nomes iguais usando ID.
- [x] **Migração sem romper campanha:** `normalizeRoster` atualiza M1/M2/M3 no save antigo, preservando habilidade, energia, OS e materiais; antigo M4/Nico ocioso é retirado por se tratar de funcionário inicial legado; se ele ainda estiver atribuído a uma OS, permanece como Mecânico sem sprite para não cancelar trabalho. Contratados existentes permanecem genéricos. A versão do save é preservada.
- [x] **PWA/cache:** versão de `game.js?v=0.8.14`, `sw.js` v094, pré-cache dos três WebP; assets Lia/Rafael não são mais solicitados, mas permanecem no Git para referência/rollback.
- [x] **Validação técnica:** `scripts/test-worker-roster.cjs` confere novo time, contratações, IDs, save legado/OS em execução, hash, dimensões e 2×2 WebP, integração no Phaser; suíte de CI e deploy exige integridade dos três assets.
- [x] **Documentação de proveniência:** `phaser-play/assets/characters/ROSTER.md` detalha cartelas, dimensões, compressão e regra de renderização.

### Homologação manual pendente

- [ ] Criar campanha nova, conferir Isaias, Pedro e Geovane — e apenas esses três — em **Equipe**.
- [ ] Alocar os três em boxes diferentes; confirmar que cada sprite corresponde ao membro selecionado e que nenhuma cópia de Lia/Rafael aparece.
- [ ] Verificar poses de ferramenta, confirmação, inspeção/prancheta e agachamento durante diagnóstico e reparo, sem pés flutuando nem vazamento de quadrantes.
- [ ] Contratar um funcionário: aparece **Mecânico (M4)** na equipe e no seletor; em um box aparece apenas seu nome, sem imagem de personagem.
- [ ] Importar um save anterior: conferir migração para o trio e preservação de OS com antigo M4 ainda designado.
- [ ] Alternar dia/noite, conferir sombra, escala, transparência e legibilidade dos personagens em desktop e celular.
- [ ] Confirmar que contratação, descanso, moral, produtividade, capacitação e plano de turno permanecem funcionais.

**Critério de aceite:** o jogo inicial não possui personagens sem arte; somente três funcionários oficiais são renderizados; contratações usam placeholders textuais até aprovação de novos sprites. Testes automatizados não equivalem à homologação visual.

## Entrega 0.8.13 — Unificar enquadramento original dia/noite (P0 / visual)

**Publicação:** [PR #32](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/32) integrado à `main` no commit `3e858327`. Sintaxe e suíte completa aprovadas, incluindo integridade SHA-256/dimensões do asset. [Workflow GitHub Pages #39076569324](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39076569324) concluído com sucesso. **Homologação visual e funcional em navegador/PWA ainda pendente.**


**Solicitação:** o jogador percebeu que o dia estava ampliado/recortado, enquanto a noite mostrava a imagem completa. Enviou novamente a **imagem original de entardecer em 1976 × 796 px** e rejeitou corretamente a geração de uma arte substituta. O dia deve preservar integralmente essa arte e usar o mesmo `fullFrame` da noite.

### Mudanças implementadas

- [x] **Arte certa, sem geração:** `Oficina Industrial ao Entardecer (2).png` (1976 × 796 px, SHA-256 `98bba3ae2ae10a150ea0365c38e4b3ce7b56369b083f047779a6dc5b96b541d9`) enviada pelo usuário, sem redesenhar ou recortar. PNG convertido somente em AVIF otimizado (qualidade 55) para Pages.
- [x] **Binário versionado:** `phaser-play/assets/oficina-diurna-fullframe.avif`, 181.346 bytes, 1976 × 796 px, SHA-256 `31453309223d11800e78276edd2e02b641a82eb4a2ffb52982dbc766e0a003c7`. O asset original de dia recortado (`oficina-base.avif`) continua no repositório como fallback.
- [x] **Enquadramento idêntico:** `repoDayWorkshopBG` usa `fullFrame` no turno A; `repoNightWorkshopBG` já usava o mesmo `fullFrame` no turno B. Não há `crop`, `zoom` ou `stretch` que diferencie o perfil. O `setBackdrop()` desenha a fonte integral.
- [x] **Geometria unificada:** ambos usam o perfil completo de `scene-map.json`, incluindo BOX 3 deslocado 5 px à esquerda, sombras recalibradas e as mesmas coordenadas do piso, HUD e zonas clicáveis. O perfil antigo `cropped` continua disponível **somente se falhar o carregamento AVIF diurno**, sem quebrar navegadores sem suporte.
- [x] **Substituições manuais preservadas:** opção Visual de teste de cenário global e substituição do noturno ainda têm precedência sobre os respectivos fundos oficiais. Saves, mecânica, equipe e máquinas não foram modificados.
- [x] **Rastreabilidade de asset:** manifesto `phaser-play/assets/OFICINA-DIURNA.md` registra fonte, dimensão, tamanho, hash e limite de fidelidade da codificação com perdas; geração artística anterior descartada.
- [x] **QA de integração automatizado:** `scripts/test-day-night-fullframe.cjs` valida os dois AVIFs, SHA-256, dimensões originais, preload, perfil, ausência de crop e cache PWA; exigido em PR e deploy.
- [x] **Cache:** build Phaser v0.8.13, Service Worker v093 e pré-cache dos dois cenários oficiais, invalidando a versão anterior.

### Homologação pendente no Pages

- [ ] Abrir um turno A e verificar que são visíveis todas as laterais do asset original, sem ampliação comparativamente ao turno B.
- [ ] Avançar A → B → A, comparar posição das placas BOX 1/2/3, piso, equipamentos e mecânicos, confirmando ausência de salto de escala e de translação das hitboxes.
- [ ] Conferir alinhamento do 777E com o piso em ambos turnos e a posição dos calços no equipamento bloqueado.
- [ ] Testar desktop e Android (PWA instalada), atualização da imagem após troca de cache e funcionamento offline.
- [ ] Testar backup/fallback legado apenas caso AVIF não carregue, sem exigir recorte nos navegadores com suporte.
- [ ] Checar cenário personalizado/alternativo e restaurar o fundo oficial.

**Critério de aceite:** alternar dia/noite muda somente a arte e iluminação, sem modificar a câmera nem o enquadramento. A imagem diurna é o original do usuário, não uma nova geração. Validação humana no navegador permanece necessária.

## Entrega 0.8.12 — Composição BOX 3 e sombras de contato (P0 / visual)

**Publicação:** [PR #31](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/31) integrado à `main` no commit `fa7f4a2`. Todos os testes Node/CI, incluindo `test-bay-contact.cjs`, passaram; [GitHub Pages workflow #39066953314](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39066953314) concluído com sucesso. **Comparação visual no navegador, especialmente rodas/sombras de dia e noite, continua pendente.**


**Origem:** captura do jogador de 17/10/2026. A máquina e os mecânicos do BOX 3 apareciam cerca de 5 px à direita do desejado, e as sombras estavam baixas em relação ao contato dos pneus/esteiras com o chão, criando aparência de flutuação. A solicitação contempla **dia e noite**, não apenas o fundo fotografado no print.

### Mudanças implementadas
- [x] **BOX 3 — dia (`preCropped`):** centro nominal da máquina de 1223 para 1218 px; mecânicos de 1102/1345 para 1097/1340 px; `visualCalibrationX: -5` para assegurar deslocamento visível mesmo com proteção de borda.
- [x] **BOX 3 — noite (`fullFrame`):** centro nominal de 1109 para 1104 px; mecânicos de 1027/1192 para 1022/1187 px; envelope físico `placementWorld.x` de 1008 para 1003 px, mantendo tamanho da vaga e assegurando que o clamp translade efetivamente os assets em −5 px.
- [x] **Sombras de contato de todas as máquinas:** sombra principal em `ground - 3` (antes `ground`) e secundária em `ground - 1` (antes `ground + 2`), mantendo intensidades, dimensões e a posição X derivada da máquina realmente renderizada. Isso vale para os dois perfis geométricos.
- [x] **Planos de apoio preservados:** terreno/rodas/pés dos mecânicos mantidos em Y=448 (perfil diurno recortado) e Y=408 (perfil noturno completo); as sombras sobem sem alterar o posicionamento vertical de máquinas ou mecânicos.
- [x] **Hitboxes, barras de diagnóstico, nomes, rodapés e demais boxes preservados.** Nenhum dado da campanha, regra do motor, duração de turno, sprite oficial ou arquivo de cenário foi substituído.
- [x] **Testes geométricos:** `scripts/test-bay-contact.cjs` confirma translação horizontal efetiva de −5 px nos dois perfis (incluindo equipamentos limitados por envelope e dois mecânicos), contato vertical constante, sombras −3/−1, e preservação dos demais boxes. Testes de mapa/smoke atualizados.
- [x] **Publicação preparada:** `game.js?v=0.8.12`, Service Worker `porcaria-vqec-20261017-v092`, e nova verificação obrigatória em CI/Deploy Pages.

### Homologação visual após publicação
- [ ] **Diurno:** abrir o BOX 3 com CAT 6030 (como na captura) e comparar sua composição com os boxes 1/2, verificando 5 px à esquerda.
- [ ] **Noturno:** avançar até turno B e avaliar a mesma OS/equipamento no BOX 3; conferir que a composição equivalente também transladou.
- [ ] Comparar a sombra de contato junto aos pneus/esteiras em ambos os períodos, com atenção ao risco de elipse excessivamente visível.
- [ ] Testar CAT 777E, CAT 395 e perfuratriz nos três boxes e confirmar ausência de colisões visuais ou cortes no enquadramento.
- [ ] Confirmar que clicar no caminhão, escavadeira ou mecânico seleciona a OS correta sem interferir nos menus; testar em desktop e celular.
- [ ] Conferir com `?debugBoxes=1` que os marcadores técnicos e hitboxes seguem fixos, enquanto a composição da arte é ajustada.

**Critério de aceite:** no BOX 3 os sprites se deslocam aproximadamente 5 pixels da coordenada de mundo Phaser para a esquerda em cada cenário, as sombras parecem ligadas ao piso, e a interface interativa/OS não muda. Os testes Node asseguram coordenadas e regras; **a qualidade perceptiva ainda exige validação no navegador.**

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

## Plano de validação para a versão 0.8.19

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
- **0.8.12:** BOX 3 deslocado 5 px à esquerda em ambos os perfis geométricos; sombras principal/secundária sobem 3 px sem mudar o piso; testes de clamp, sprites, hitbox, HUD e PWA. **QA visual pendente.**
- **0.8.13:** fundo diurno original completo 1976×796 derivado para AVIF, junto ao noturno no perfil fullFrame; fallback recortado preservado, hash e proveniência documentados e nova suíte dia/noite no CI. **QA visual pendente.**
- **0.8.14:** equipe inicial restrita a Isaias/Pedro/Geovane, três sprite sheets por personagem real alocado, contratação futura de Mecânico sem sprite e migração retrocompatível; testes de identidade/atlas e cache versionado. **QA visual pendente.**
- **0.8.15:** quatro atlas WebP/16 poses da Bia reservados para futuro menu de capacitação; galeria independente, manifesto com hashes e projeto detalhado de treinamento por disciplina e equipamento. **Mecânica futura explicitamente não implementada; QA de arte pendente.**
- **0.8.16:** três mecânicos novos Silva/Santos/Moura + renomeação Isaias→Costa, atlas WebP em quatro poses, seis iniciais, genéricos sem sprite e migração sem reatribuir IDs de contratados; PWA/testes atualizados. **QA visual pendente.**
- **0.8.17:** asset Sandvik DR410i fornecido pelo jogador (1536×1024) convertido para WebP transparente, com EQ05 desvinculado de EQ06 e arquivo anterior preservado; testes exclusivos de textura, integridade e geometria. **QA visual pendente.**
- **0.8.18:** Junior Especialista com dois atlas de 4 poses (EPI/balaclava nas OS; camisa azul em Equipe/treinamento futuro), nova identidade sem sobrescrever M7 legado, 7 profissionais e 3 boxes preservados. **QA visual pendente.**
- **0.8.22:** canvas interno 2160×900 no desktop (camera zoom2), 1080×450 no celular, trabalhadores 66×80 e modo leve `?quality=low`. **QA visual pendente.**
- **0.8.21:** Junior recebe atlas chibi com pés/frames normalizados e WebP lossless; personagens recebem pré-filtragem 2×/LINEAR com geometria mantida. **QA visual pendente.**
- **0.8.20:** equipe inicial de três, 10 contratáveis identificados, 6 atlas WebP lossless, filtro LINEAR e BOX 2 −5 px nos trabalhadores; CI e deploy concluídos. **QA visual pendente.**
- **0.8.19:** CAT D9, CAT 966 e CAT 16 recebem sprites WebP pixel-art completos, com chaves próprias EQ07/EQ08/EQ09 no Phaser, fallback histórico, hashes e teste de enquadramento no CI. **QA visual pendente.**

### Organização recomendada

- **`phaser-play/`** — implementação do jogo Phaser
- **`engine.js`** — regras simuladas e estado
- **`game-data.json`** — catálogos e cenários
- **`phaser/assets-review/`** — revisão artística (pode estar em branch separada)
- **`phaser-play/ROADMAP.md`** — fonte de verdade para escopo e prioridades do Phaser
- **GitHub Issues / PRs** — bugs, testes e aprovações específicas

Atualize este roadmap a cada entrega; só marcar um requisito como **homologado** após validação real no navegador.
