> **Atualização — Ciclo 26:** a consolidação anterior de 245 caminhos representava **tipos de objeto**, não todos os locais posicionais. A 1412 contém FID1/FID2, ENS1/ENS2 etc. O diagnóstico agora usa **371 triplas físicas reais**, com **16 casos recuperados** e **45 pendentes**. Consulte [Instâncias Físicas SAP — Ciclo 26](SAP_INSTANCIAS_FISICAS_CICLO26.md). As contagens 65/59 abaixo são históricas e não representam a situação atual.

---

# Importação integral dos dados SAP (1412 Mobile + Catalog Profile) — v0.9.28

## Regra de engenharia
**O conteúdo das planilhas é a fonte.** O jogo deve classificar cenários FMEA nas opções que realmente estão nelas, nunca acrescentar valores fictícios ao catálogo.

## Fontes entregues em 24/10/2026
- `1412 Mobile(3).xlsx`: 2.535 locais de instalação, com ID integral, ID do superior, tipo de objeto, descrições EN/PT, categoria, fabricante, modelo, tag, estado da importação e perfil de catálogo.
- `Catalog Profile - Pats, Coding, Damage and Cause(2).xlsx`: 683 códigos de **Parte objeto** (New Code List), 987 tipos de objeto, 31.106 vinculações (+ 1 linha de identificação do catálogo) entre grupo e código (WORKING COPY), 66 danos, 81 causas, 32 códigos de origem e 5 grupos de origem.
- As planilhas contêm **Retainer → Retentor (código 3263)**. Esse é um valor real da lista, não deve ser traduzido novamente para “Trava do Fixador”. O P/N OEM pode ser descrito no texto técnico da missão.

## Arquivos versionados
- `phaser-play/data/sap-catalog-profile.json`: lista integral de 683 partes (código, PT, EN, indicações por tipos de objeto disponíveis na aba New Code List), tipos, danos, causas, fontes e caminhos para os modelos do jogo.
- `phaser-play/data/sap-functional-locations.json`: as 2.535 linhas de local de instalação com o vínculo ao superior; preserva registros ativos e marcados Skipped.
- `game-data.json`: catálogo de alternativas atualizado para todas as 683 partes oficiais. Cada caso tem `sapPartCode`, `sapPartMapping` (rótulo usado antes, status da equivalência), `sapPathMapping` (status e FL original) e `sapPaths` (245 caminhos distintos, com códigos e desc PT dos modelos representados no jogo).
- O JSON auditável completo, com as 31.107 atribuições de catálogo, foi produzido como arquivo de entrega separado, pois o motor não precisa carregar 11 MB de matriz de compatibilidade em toda abertura da campanha.

## Mapeamento dos cenários e limites
Foram auditados 124 cenários existentes:
- **65** possuem correspondência de código ou descrição na hierarquia 1412.
- **59** não possuem correspondência segura com os três níveis nos equipamentos consultados. Isso inclui os casos de FPS: *Implemento → Caçamba → Sistema Retenção FPS* não aparece como subgrupo na planilha 1412 fornecida.
- Alguns componentes só possuem equivalência genérica, não exata (por exemplo, líquidos, pneumática e roda-guia). Esses casos são marcados como `provisorio`, não como homologados.
- Para **novas OS/inspeções**, o motor usa apenas roteiros cuja localização foi encontrada na 1412 e cujo componente tem mapeamento válido. Os cenários pendentes permanecem para rastreabilidade e compatibilidade com os saves antigos, mas são **bloqueados para avanço de diagnóstico** até revisão de equivalência.
- Não atribuir automaticamente ponta, retentor ou adaptador à *Mandíbula* apenas porque é o único subgrupo disponível sob *Caçamba*. Essa substituição seria falsa.

## Comportamento de jogo
- O sorteio de componentes na etapa 4 usa os **683 nomes em português extraídos da planilha**, em vez dos 43 anteriores.
- Nas etapas 1–3, cenários validados usam os caminhos `sapPaths`, derivados da árvore real de local de instalação.
- Etapas 5 e 6 mantêm os 66 danos e 81 causas, cujas descrições coincidem com os catálogos fornecidos.
- Histórico de save não é excluído. Nomes antigos das alternativas de parte-objeto são convertidos para a opção oficial via `catalog.partAliases`; conflitos de opções são reconciliados. Casos sem equivalência de local são identificados no painel com um aviso, sem atribuir uma localização fictícia.
- O Service Worker inclui os dois JSONs de referência em cache novo, preservando o acesso offline.

## Validação técnica
- `scripts/test-sap-diagnostic-contract-v25.cjs` foi atualizado para conferir o conteúdo de referência (683 partes, 2.535 locais, 987 tipos, 31.106 vínculos (+ 1 linha de identificação do catálogo), 66 danos e 81 causas) e que todos os **cenários liberados** usem códigos e descrições oficiais nos seis estágios, com quatro alternativas e sem nomes inventados.
- Testes de regressão de funcionalidades, API de saves e PCM devem continuar passando no CI.
- Pendente para um ciclo específico: revisão técnica caso a caso dos 59 cenários, com comprovação da melhor FL existente ou descontinuidade explícita do roteiro no jogo.

## Atenção
`1412 Mobile` é um arquivo de construção/exportação de local de instalação e contém registros com estados variados (inclusive “Skipped”). Estar na planilha não comprova necessariamente que cada objeto tenha sido criado com sucesso no SAP produtivo. A representação **fiel à planilha** não deve ser anunciada como homologação individual de cada registro no SAP live.
