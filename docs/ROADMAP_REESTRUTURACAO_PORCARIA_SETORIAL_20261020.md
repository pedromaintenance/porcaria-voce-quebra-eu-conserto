# Reestruturação operacional do PORCARIA — Documento diretor (20/10/2026)

## Motivação

A interface anterior aglomerou **inspeção, diagnóstico em bancada, triagem PCM e monitoramento por condição** em uma única janela, exibindo continuamente ressalvas sobre a natureza do simulador. Isso prejudicou a experiência de gestão industrial. A estrutura precisa fazer a origem da demanda, o papel do planejador e as decisões de execução serem **consequências de gameplay**, não menus misturados.

**Diretriz de linguagem:** textos de interface operacionais, concisos, próprios de sala de controle e oficina; não usar repetidamente `fictício`, `simulado`, `didático`, `não OEM` dentro de botões, cards e resultados. **A transparência técnica permanece** em documentação técnica e nos metadados de proveniência. Não atribuir números de pressão/temperatura/limites a OEMs sem documentação.

## Arquitetura de setores

| Origem da demanda | Porta de entrada | Destino | Responsável | Regra |
|---|---|---|---|---|
| Falha reportada pelo rádio | Rádio / fila de OS | **Fila de OS** | Supervisor + oficina | Corretiva não programada; máquina pode já estar indisponível. |
| Condição identificada pelo inspetor | **Inspeções** | **Planejamento PCM** | Inspetor → Planejador | Inspeção feita no equipamento escolhido; achado gera notificação pendente de revisão, sem OS automática. |
| Condição apontada por acompanhamento técnico | **Monitoramento de Condição** | **Monitoramento** | Engenharia de manutenção | Análise de óleo, códigos de falha, material rodante, FPS e componentes; tendência, recoleta ou encaminhamento ao PCM, sempre com rastreabilidade. |

### Abas principais

1. **Oficina** — equipamentos nos boxes, execução de OS e sinais de progresso.
2. **Rádio / Fila de OS** — serviços corretivos que chegaram pelos operadores.
3. **Inspeções** — selecionar ativo e mecânico/inspetor, consumir esforço real do turno, produzir achados que seguem ao Planejamento.
4. **Planejamento PCM** — fila de notificações, revisão de pré-diagnóstico (sistema/grupo/subgrupo/componente/dano/causa opcional), priorização, escopo, HH, antecipação e compra de peças, programação de mão de obra e alocação de OS.
5. **Monitoramento de Condição** — sala de controle com o **asset fornecido do Pedro**, com navegação visual clicável para **Análise de Óleo**, **Códigos de Falha**, **Material Rodante**, **FPS**, **Componentes** e **Visão Geral**. Indicadores/tendências e acesso à carteira própria; novas condições não são notas de inspeção.
6. **Equipe / Treinamentos / Almoxarifado / Indicadores / Gestão** — mantém funções e identidade já existentes.

### Interação com o asset

Imagem original fornecida pelo usuário (sala de controle industrial com Pedro), dimensão **1672 × 941**, salva como `phaser-play/assets/pedro-sala-controle.webp`. A arte compõe o cenário principal do setor Monitoramento. Áreas clicáveis seguem a **coluna de seis botões da própria ilustração**, com rótulos legíveis e alternativa responsiva para celular/teclado. Nunca esticar nem distorcer a imagem.

## Regras técnicas e de jogo por prioridade

### Etapa 1 — Setorização, identidade visual, rotas

- Separar os setores de Inspeção, Planejamento e Monitoramento, cada um com aba e estado de menu próprios.
- Mover notificações e pré-diagnóstico para Planejamento; monitoramentos, recoletas e cards técnicos para Monitoramento.
- Usar o asset de Pedro na sala de controle e menus clicáveis por domínio; não apresentar a bancada de testes na Inspeção.
- Fazer os principais textos de interface imersivos; explicações de simulação ficam em ajuda/documentação.
- Preservar saves `1.1.0` e as 100 missões, evitando recriar ou apagar OS/relatórios anteriores.
- Verificar navegação mobile/desktop, WCAG de botões, modo teclado e ausência de ações ocultas.

### Etapa 2 — Inspeções livres por mão de obra

- Jogador escolhe o **equipamento individual** por TAG e **o profissional** responsável.
- Sem limite arbitrário de três inspeções: limite é capacidade efetiva do turno, pessoal disponível, ferramentas necessárias e consumo de HH.
- Uma inspeção ocupa uma fração mensurável do turno do profissional; não poderá ser executada se estiver em OS, descanso ou treinamento conflitante. Evitar dupla alocação.
- Achado gera imediatamente **notificação para Planejamento PCM**, jamais OS diretamente.
- Inspeção sem achado registra histórico sensitivo; não produz demanda.
- Carregar saves antigos com programação de inspeção, sem perdas.

### Etapa 3 — Pré-diagnóstico e antecipação de materiais PCM

- Proposta do PCM antes da intervenção, baseada no sintoma e histórico, **sem gabarito**.
- Escopo e disciplina, HH, reserva ou compra de materiais, ferramentas e previsão de chegada.
- Programação e disponibilidade afetam probabilidade/impacto do retorno ao serviço com estoque.
- Manter separados: hipótese do planejador, evidência do mecânico, diagnóstico após testes e conclusão.
- Peças solicitadas antes da falha total podem chegar antes do agravamento. Custos e prazos são de balanceamento, não cotações.
- Monitoramento agravado abre notificação ao PCM; não cria OS de modo automático.

### Etapa 4 — Diagnóstico e testes SOMENTE na execução da OS

- O jogador só solicita ensaios quando a máquina está com **OS aberta e mecânico alocado**; não executa testes na inspeção, no monitoramento nem na pré-triagem PCM.
- Teste exige ferramental disponível; pode consumir R$, HH do mecânico e turno de oficina. O resultado (positivo, negativo, inconclusivo) fica no **histórico da OS** e é utilizado para decidir hipóteses.
- Testes precisam ser pertinentes ao sistema/defeito, com hipóteses concorrentes e custo de oportunidade; nenhum gabarito antecipado.
- Retirar a experiência de *bancada de treinamento* da tela Inspeções.
- Preservar estudos anteriores `INC066/067`, `INC076/077`, `INC086/087` como pilotos para testes no serviço, usando seus registros `diagnosticTests`.

### Etapa 5 — Progressão de anormalidades encontradas em inspeção

- **Todo achado de inspeção aberto** possui idade em turnos, fator de severidade e estado de progressão; aumenta risco de degradação a cada turno sem tratamento.
- Relacionar severidade à prioridade, histórico, evidência, tipo de mecanismo e atraso; não presumir que todo defeito cause exatamente o mesmo desfecho.
- Trabalhar ao menos com estados **Observado → Agravado → Crítico / Falha Funcional**, de modo que cada caso tenha consequências coerentes.
- Mostrar avisos e custos do atraso; transição para falha funcional pode enviar ocorrência para Fila de OS.
- A velocidade de progressão será parâmetro de balanceamento do jogo **sem alegação OEM**. Distinguir risco potencial de dano confirmado.

### Etapa 6 — Energia física, descanso e continuidade de serviços

**Regra do usuário — obrigatória para a evolução do motor:**

- A janela do turno é **12 horas**, com **10,5 horas produtivas** para a contabilidade de esforço.
- Para cada mecânico, em cada turno trabalhado, sortear **um valor-base uniforme entre 40 e 70 pontos** de consumo da energia física para 10,5 HH úteis.
- Multiplicar o valor-base pela fração efetivamente trabalhada: 
  `perda = U(40,70) × (HH_trabalhadas_no_turno / 10,5)`. Exemplo: 5,25 HH → 20 a 35 pontos; 10,5 HH → 40 a 70 pontos. Somar todas as OS e inspeções do mesmo mecânico no turno, sem sortear outra vez para cada ordem.
- **Recuperação:** turno de **12 horas sem trabalho**, sem interrupções, devolve valor sorteado entre **40 e 70 pontos**, limitado a 100.
- **Recusa:** energia física **abaixo de 40%** no momento da alocação ou do início de um turno impede trabalho; mecânico descansa compulsoriamente.
- **Exaustão:** ao chegar a **0**, interromper imediatamente o serviço, remover a alocação, registrar a OS como interrompida; descansar nos **dois turnos seguintes**, só então voltar à escala.
- A capacidade de completar dois turnos inteiros consecutivos depende da energia inicial e dos sorteios; **não é permitido trabalhar três turnos inteiros consecutivos**. Precisamos testar o caso-limite para que nenhuma sequência residual de energia viole esta regra.
- É essencial separar *energia no início do turno*, *desconto por horas efetivamente executadas* e *tempo de descanso*, para não recuperar energia simplesmente porque o jogo mudou o dia.
- Persistir `physical`, sorteio do turno, HH acumuladas, bloqueio/descanso e motivo de interrupção em saves antigos sem modificar seus resultados anteriores.
- Testes obrigatórios: meia jornada, jornada completa, duas jornadas possíveis, terceira recusada, recusa abaixo de 40, exaustão a zero com interrupção e dois turnos de afastamento, retorno ao fim do período e conflito entre inspeção/OS no mesmo turno.

## Contratos e restrições

As 100 missões e 387 caminhos cadastrados são um legado a preservar. As rotinas anteriores `inspection.js`, `monitoring.js`, `evidence.js` e `engine.js` devem ser refatoradas em etapas pequenas, com regressão automatizada e revisão de experiência de usuário. Não afirmar que uma etapa futura foi implementada só porque consta neste documento.

**Pendências para confirmar em implementação posterior:** interpretação interna da sigla **FPS** e seu modelo de dados; parâmetros de consumo HH por tipo de inspeção; custo e duração de cada ensaio; probabilidades de transição de achados; quantidade de categorias de monitoramento com dados novos e critérios para casos sem ação corretiva.

## Etapa 1B — Catálogo de sintomas e entrada automática (20/10/2026)

- Implementado catálogo v1 de 30 sintomas distribuídos entre análise de óleo, códigos de falha, material rodante, FPS e componentes.
- Interface de monitoramento recebe registros no decorrer dos turnos e mostra sinais efetivamente recebidos; botões de estudos-piloto saíram dos menus.
- Sistema de leitura utiliza ferramental pertinente, mantém histórico, impede conversão automática em OS e conserva saves anteriores.
- Critérios de entrada: um registro inicial, depois tentativa a cada dois turnos pares; rodízio de cinco fontes e máximo oito ativos.
- FPS: quatro padrões genéricos enquanto não houver definição aprovada; encaminhamento ao PCM exige mapeamento de cenário antes de converter em OS.
- Detalhes: [Catálogo de Monitoramento v1](CATALOGO_MONITORAMENTO_V1.md).

## Etapa 1C — Catálogo de óleo v2 (21/10/2026)

- Publicada no código a extensão modular dos casos de óleo, de 8 para 24 e catálogo total de 46 sinais.
- Cada sintoma de fluido recebe compartimento, indicadores, verificação recomendada, incerteza e fonte OEM rastreável.
- Suspeitas prioritárias não seguem espera por recoleta; são encaminháveis imediatamente à avaliação PCM, sem OS automática.
- Formulações distintas não são automaticamente classificadas como defeito; confirmação de compatibilidade e linha de base permanece necessária.
- Referência: [Catálogo de Óleo v2](CATALOGO_OLEO_V2.md).

## Etapa 1D — Sinais eletrônicos e códigos de falha v3 (21/10/2026)

- Acrescidos 18 cenários eletrônicos (`FLT007–FLT024`); 24 ocorrências da categoria, 64 sintomas totais na carteira.
- Dados de código separaram diagnóstico/evento, ativo/registrado/não confirmado, ECM e padrão intermitente.
- Hipóteses concorrentes e limitações são exibidas, sem criar numeração OEM fictícia.
- Triagem prioritária para perda de comando e eventos térmicos; sem missão específica, encaminha à revisão PCM sem permitir OS automática.
- Referência técnica: [Catálogo de Códigos de Falha v3](CATALOGO_CODIGOS_FALHA_V3.md).

## Etapa 1E — Material Rodante CTS e pneus (21/10/2026)

- 18 novos registros de rodante, total 24 na categoria e 82 condições no catálogo geral.
- Componentes, localização, método de medição e investigação separados entre CTS Cat, pneu e inspeção visual/térmica.
- Sem valores de desgaste, pressão ou limites OEM inventados; fichas exibem medições pendentes e exigem documentação específica.
- Riscos críticos: triagem imediata ao PCM, sem OS automática. Atraso de quatro turnos é penalidade qualitativa **apenas do jogo**, nunca recomendação de manutenção.
- Fontes e índices: [Material Rodante v4](CATALOGO_MATERIAL_RODANTE_V4.md).

## Etapa 1F — Componentes hidráulicos, motores e compressores (21/10/2026)

- Expansão Componentes de seis para 24 sinais, somando 100 entradas no monitoramento.
- Dossiês de bomba, cilindro, válvulas, filtros, motor diesel, transmissão e compressor com método e hipóteses concorrentes.
- Sem pressão, temperatura, deriva, vazão, vida remanescente ou limites OEM fictícios. Procedimentos por série/configuração ainda necessários.
- Risco de direção: triagem prioritária ao PCM. Casos sem FMEA aplicável não podem gerar OS automaticamente.
- Consequência de atraso por quatro turnos após vencimento: narrativa **apenas do jogo**, sem valor de recomendação técnica.
- Fonte e índice: [Catálogo de Componentes v5](CATALOGO_COMPONENTES_V5.md).

## Etapa 1G — Ferramentas de Penetração no Solo (FPS/GET) — 21/10/2026

- Nomenclatura confirmada pela Caterpillar/Sotreq: FPS = Ferramentas de Penetração no Solo.
- 24 ocorrências físicas recebíveis de FPS em 6030, 395, 966 e D9; 120 condições totais em cinco categorias.
- Posições, componentes e verificações por ponta, adaptador, fixador, protetor e borda; sem números de desgaste e P/N não verificados.
- Preservar quatro IDs históricos genéricos somente para saves; não sorteá-los novamente.
- Necessário **novo ciclo de missões FMEA** para transformar diagnóstico GET em OS planejável; no ciclo 6 a revisão PCM permanece bloqueada sem cenário.
- Documentação: [FPS/GET v6](CATALOGO_FPS_GET_V6.md).

## Etapa 1H — Missões FMEA próprias de FPS (21/10/2026)

- 24 investigações didáticas, com mapeamento FPS005–028 para INC101–124 (124 missões totais).
- Novos itens de estoque e instrumentos de jogo sem Part Number ou especificação OEM, 16 locais didáticos marcados não homologados no SAP.
- PCM exige diagnóstico com cinco dimensões obrigatórias (Causa opcional) e aprovação prévia. OS criada manualmente somente após revisão; planejamento usa a carteira existente.
- 100 missões anteriores e 120 sintomas monitoráveis preservados. Fontes e mapa: [Missões FPS FMEA v7](MISSOES_FPS_FMEA_V7.md).

## Critérios de aceite por entrega

1. Commit por etapa em branch própria, PR revisável, CI Phaser e recrutamento sem regressões.
2. GitHub Pages publicado após merge verde; verificação dos dois workflows.
3. Logs auditáveis e partidas antigas legíveis; rotas funcionais acessíveis por teclado/mobile.
4. Interface com linguagem do universo do jogo; metadados técnicos mantêm proveniência e limites de aplicabilidade sem interromper a imersão.
5. Qualquer funcionalidade ainda planejada deve ser marcada como pendente no changelog (e não simular operação inexistente).


## Etapa 6 — Ciclo 20 / v0.9.23 (24/10/2026)

Implementação na branch do Ciclo 20: débito físico por HH, taxa única sorteada de 40–70/10,5 HH por pessoa e turno, recuperação somente em turno sem trabalho, recusa abaixo de 40%, interrupção de OS em zero com dois turnos de recuperação, bloqueio da terceira jornada integral consecutiva e migração aditiva dos saves. Consultar [Energia Física — Ciclo 20](ENERGIA_FISICA_CICLO20.md). Testes automatizados e validação visual condicionam publicação na main.


## Etapa 5 — Ciclo 21 / v0.9.24 (24/10/2026)

Progressão observada → agravada → crítica → falha funcional, baseada em idade, prioridade e família. Integra notificação PCM, custo virtual único, geração controlada de corretiva pela Fila de OS, histórico auditável e migração de saves. [Contrato e validação](PROGRESSAO_ANORMALIDADES_CICLO21.md).


## Ciclo 22 — Modo Mobile / v0.9.25 (24/10/2026)

Correção de rolagem vertical sobre o canvas Phaser, toque concluído com tolerância a arrastos, PWA fullscreen/landscape independente do PWA desktop, botões de instalação e tela cheia, layout responsivo em paisagem e testes automatizados. [Contrato de experiência mobile](EXPERIENCIA_MOBILE_CICLO22.md). Validação visual e gestual no Chrome Android ainda necessária.


## Ciclo 23 — Navegação Mobile / v0.9.26 (24/10/2026)

O menu compacto SETORES libera a área útil em paisagem. O botão Voltar do Android passa a fechar menus/modais sem encerrar prematuramente a sessão; o fluxo de instalação utiliza `userChoice`, a altura do canvas respeita a viewport atual e os controles redundantes são ocultados no PWA instalado. Teste automatizado e roteiro para Android em [Navegação Mobile — Ciclo 23](NAVEGACAO_MOBILE_CICLO23.md).


## Ciclo 24 — Painéis Técnicos Mobile / v0.9.27 (24/10/2026)

Leitura de PCM, diagnóstico, inspeção e monitoramento em Android retrato/paisagem, com controles adequados ao toque, abas e imagens compactas, modal rolável e atalhos para seções internas. Sem mudanças no motor ou saves. [Detalhes e roteiro de validação](PAINEIS_TECNICOS_MOBILE_CICLO24.md).


## Política de catálogo SAP — 6 níveis (24/10/2026)

O vocabulário de Sistema → Grupo → Subgrupo → Componente → Dano → Causa passa a ser **contrato de fonte imutável** para novos cenários. Vocabulário OEM é mapeado nos casos; nunca altera as opções SAP. Proteção no motor, teste de regressão e registro de 43 cenas referenciando 32 caminhos didáticos não validados em [Contrato do Diagnóstico SAP](CONTRATO_DIAGNOSTICO_SAP_SEIS_NIVEIS.md). A reconciliação das rotas é pendência de conteúdo: não realizar substituição semanticamente artificial.


## Importação completa da referência SAP (24/10/2026)

Substituição da lista parcial por 683 Partes objeto do Catalog Profile; árvore com 2.535 locais de instalação da 1412, 987 tipos de objeto, 31.106 vínculos (+ 1 linha de identificação do catálogo) de código, 66 danos e 81 causas. Mapeamentos de parte objeto guardam o código e a nomenclatura PT/EN original. Novas missões usam apenas caminhos de instalação verificados; os casos legados sem enquadramento mantêm histórico, com pendência explícita. Ver [relatório de importação](IMPORTACAO_INTEGRAL_SAP_1412_CATALOG_PROFILE.md).


## Ciclo 26 — Localização SAP física sem perda de posição (24/10/2026)

Consolidação por tipo de objeto da importação anterior escondia as posições físicas da 1412. Reconstituição de 371 caminhos físicos (442 instâncias), retorno de 16 cenários comprovados ao sorteio/PCM, seis níveis com descrições e códigos reais, migração de saves e auditoria dos 124 casos. Permanecem 45 pendências sem equivalência segura. [Detalhes](SAP_INSTANCIAS_FISICAS_CICLO26.md).


## Ciclo 27 — Composição responsiva no celular e desktop (24/10/2026)

A ilustração de Elton passa a exibir uma prévia das três primeiras OS na zona direita segura; o menu de Monitoramento retorna à margem esquerda dentro da arte, preservando Pedro; imagens de Rádio, Monitoramento e Planejamento são limitadas pela altura da janela e mantidas integralmente visíveis. Removido VISUAL de ambas as interfaces; oculto somente no celular o HUD inferior cortado. Testes e critérios em [Composição responsiva — Ciclo 27](COMPOSICAO_RESPONSIVA_CICLO27.md).


## Ciclo 28 — Ergonomia do monitoramento mobile (24/10/2026)

Após limitar as ilustrações à altura da tela, a barra de categorias ficava com botões muito baixos e perdia a posição ao trocar de seção. Os controles agora mantêm 42 px no celular, com rolagem dentro do menu de Pedro, foco e posição restaurados após renderização e realce para teclado. Não mexe na arte nem no motor. [Detalhes](ERGONOMIA_MONITORAMENTO_CICLO28.md).
