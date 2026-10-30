# D9 J3D00357 — seleção de pilotos a partir do SIS 2.0

Status: **estudo de engenharia / sem homologação e sem instrução operacional**.
Fonte recebida do usuário: oito PDFs SIS 2.0 da publicação **M0116841-01** (Track Roller Frame e Equalizer Bar), 29/10/2026. Manter referências, mas não republicar páginas/imagens OEM no repositório.

## Decisão de design
- **Marretar Pino**: piloto candidato é a **remoção do pino lateral (4) da barra equalizadora**, conforme *Equalizer Bar - Remove and Install*, identificador de artigo **i08205669**, página 6, etapa 8. O documento indica uso de martelo apropriado com **Tooling (C), 9S-5563 Pin Driver Cap**. Isso não autoriza golpes livres em qualquer pino.
- **Extração hidráulica**: o pino central (8) da mesma barra é removido com Tooling (F), descrito na página 8, etapa 13. É minigame futuro distinto.
- **Prensagem de pino-cartucho**: *Track Roller Frame - Disassemble* (**i05438974**), p. 3 etapa 9 e p. 5 etapa 16, mostra pinos-cartucho (8) e (12) extraídos com Tooling (A), hidráulico. *Track Roller Frame - Assemble* (**i05438980**), p. 5 etapas 5–6 e p. 7 etapas 12–13, utiliza ferramental hidráulico para instalar. **Não vincular ao minigame Marretar Pino.**
- **Aperto de parafusos**: na montagem do Track Roller Frame, *i05438980*, p. 8 etapa 16 e p. 9 etapa 19 há diferentes torques para fixadores de funções distintas; não transformar a barra abstrata de quatro fixadores em sequência OEM sem rastreio por fixador/revisão. No *Equalizer Bar - Remove and Install* p. 9 há ordem específica para fixadores da retenção do pino, potencial futuro minigame, com validação separada.

## Grafo narrativo sugerido (síntese de design, NÃO passos completos de oficina)
### Equalizer Bar — remoção
1. Liberar frente e suportar o conjunto (gate de segurança; procedimento fonte);
2. Liberar fixações de retenção dos pinos laterais;
3. **Mini-interação de impacto controlado no pino lateral com adaptador correto**;
4. Isolar/desconectar as conexões indicadas;
5. Apoiar conjunto e usar sistema hidráulico para o pino central;
6. Transferir a barra ao cavalete.

### Track Roller Frame — desmontagem de bogies
1. Subconjuntos previamente removidos e frame estabilizado;
2. Remoção de roletes/acessórios para acesso;
3. Abertura dos fechamentos dos cartuchos;
4. **Extração hidráulica** dos cartuchos menor/maior;
5. Separação controlada dos bogies;
6. Remontagem como grafo próprio, incluindo orientação e alinhamento de cartuchos e vedações.

## Bloqueios antes da ligação ao motor
- Confirmar como INC023/INC040 são definidos na fonte do jogo e fazer mapeamento SAP real. Nome do D9 na OS **não basta** para equivalência entre pino de barra equalizadora e pino de bogie.
- Validar aplicabilidade serial no SIS para cada artigo (além da busca inicial no serial J3D00357), versão/revisão.
- Não apresentar gráficos OEM protegidos no cliente web; produzir sprites próprios e manter páginas nas referências privadas.
- Não fazer parecer que pontuação de arcade valida extração/instalação em máquina de verdade.
- Usar instruções gerais de energia armazenada, fluidos sob pressão, içamento e isolamento como bloqueios de missão, sem reproduzir procedimento técnico incompleto.
- Variante *Track Roller Frame - Remove and Install - Ladder Equipped* é ramificação por configuração; não misturar acessórios/ferramentas da variante com o cenário genérico.

## Documentação adicional desejável
1. No catálogo do jogo, descrição técnica integral e SAP dos casos **INC023** e **INC040**;
2. Vista explodida da **Equalizer Bar**, nomenclatura e PNs dos pinos laterais e central do D9 J3D00357;
3. **Equalizer Bar Pads - Remove and Install** RECEBIDO e analisado em 29/10/2026. Próxima fonte da cadeia: **Bottom Guard - Remove and Install** (necessária para completar seu `Start By`);
4. Para extensão ao bogie: **Idler - Remove and Install** e documentação de **Track Roller - Remove and Install** quando essa cadeia for simulada.

## Referências de leitura
- M0116841-01 — Equalizer Bar - Remove and Install, **i08467781** (nome no PDF; paginação 1–9), p. 5–9.
- M0116841-01 — Equalizer Bar - Disassemble, **i08205343**, p. 1–4.
- M0116841-01 — Equalizer Bar - Assemble, **i08205418**, p. 1–6.
- M0116841-01 — Track Roller Frame - Disassemble, **i10576562** no cabeçalho do PDF; rodapé **i05438974**. Identificadores divergentes dentro do próprio documento: registrar ambos até validar SIS.
- M0116841-01 — Track Roller Frame - Assemble, **i08442919** no cabeçalho; rodapé **i05438980**. Identificadores divergentes: verificar no SIS.
- M0116841-01 — Track Roller Frame - Remove and Install, **i11161665** no cabeçalho; rodapé **i08205722**.
- M0116841-01 — Track Roller Frame - Remove and Install - Ladder Equipped, **i11196548**.
- M0116841-01 — Track Roller Frame (Front) - Remove and Install, **i09980443** no cabeçalho.

**Revisão obrigatória**: o vínculo entre a peça catálogo 311-1298 e os cartuchos numerados (8)/(12) da desmontagem exige PN por posição, não está estabelecido pelas imagens de procedimento isoladamente.

## Atualização 29/10/2026 — Pré-requisito Equalizer Bar Pads
**Fonte efetivamente recebida**: *Equalizer Bar Pads - Remove and Install (M0116841-01)*, SMCS 7206, publicada em **01/04/2021**; artigo de cabeçalho **i08202810**, rodapé **i05439085**. Divergência entre identificadores preservada até conferência no SIS. Cinco páginas; fonte protegida, somente esta síntese própria é pública.

### Constatações verificáveis
- **p.1, Start By**: dois protetores inferiores centrais (*two middle bottom guards*) são pré-requisito, com remissão à literatura *Bottom Guard - Remove and Install* ainda não recebida.
- **p.1, Table 1**: ferramental A = cavalete de elevação 9U-7536 com bomba elétrica hidráulica adequada (alternativas de tensão); ferramental B = grupo elevador 504-9826/504-9827 conforme alimentação. O próprio manual permite **A ou B**, não exige ambos.
- **pp.2–3, steps 1–8**: remoção dos pads do lado esquerdo enquanto a elevação controlada se dá no lado direito; quatro primeiros passos com A, quatro seguintes com B são **caminhos alternativos** para a mesma intervenção, não oito passos cumulativos.
- **pp.3–4, steps 9–16**: operação equivalente do lado direito, com elevação do lado esquerdo e opções A/B.
- **p.4, Installation Procedure**: manda reinstalar em ordem inversa. O arquivo **não traz torques específicos** para esses parafusos; não improvisar números nem afirmar que a sequência inversa é suficiente para executar serviço em campo.

### Arquitetura do jogo
- Nova fixture original `data/oem/d9-j3d00357-equalizer-pads-draft.json`: D9, revisão rastreável, etapas com dependências, evidências, riscos, links de página e seleção exclusiva A/B.
- `src/oem-procedures.js` ganhou suporte a `choiceGroups` de modo `exactly-one` e `requiresChoiceGroup`; um ramo só fica disponível após escolha válida.
- Esta fixture permanece `draft`, `gameplay.eligible=false`, sem vínculo de `INC023/INC040`; **não é procedimento para executar manutenção real**.
- O fluxo de gameplay será `Bottom Guard (documento pendente) -> Pads -> Equalizer Bar -> interação de pino lateral`. A confirmação de cada etapa não equivale a certificação técnica.

### Pendências agora objetivas
1. **Bottom Guard - Remove and Install**, pois completa o pré-requisito real da operação dos pads.
2. **Vista explodida e PNs da Equalizer Bar** no J3D00357, para vincular o pino lateral corretamente.
3. **Mapeamento SAP e descrição original** de INC023/INC040 antes de associar a assistência do jogo.
4. Homologação das alternativas A/B, aplicação serial e requisitos de segurança, com revisão de engenharia.
