# P.O.R.C.A.R.I.A. — Ciclo 24 | Leitura dos Painéis Técnicos no Celular (v0.9.27)

## Problema
O Ciclo 23 simplificou a navegação entre setores no Android. A consulta dentro dos painéis ainda sofria principalmente em **paisagem**, em que a largura é suficiente para ativar layouts de desktop, mas a altura é reduzida e campos densos ficam pequenos. Entre as telas afetadas estão a revisão de notificações PCM, o diagnóstico mecânico em seis estágios, a sala de monitoramento, os indicadores de inspeção e o planejamento.

## Escopo concluído
- CSS exclusiva para `html.mobile-play`, abrangendo orientação paisagem/retrato, sem remover dados, comandos ou blocos técnicos.
- Revisão PCM: campos de hipótese e escopo em duas colunas no modo mobile horizontal, com ajustes em retrato; fontes de seletores de 16 px para evitar zoom involuntário em navegadores móveis e controles com 44 px de altura.
- Diagnóstico: passos em duas colunas e cartões de conhecimento em uma coluna, com margem, tipografia e rolagem consistentes; respostas e gabaritos permanecem regidos pelo motor existente.
- Monitoramento: navegação mobile apresentada independentemente da largura da tela, com menu desktop oculto só em mobile; painel ilustrado de Pedro recebe altura limitada, preservando a imagem.
- Planejamento: arte de ambientação compacta, abas roláveis horizontalmente e painéis de notificações com quebra de linha em textos longos.
- Inspeções: indicadores em duas colunas, cartões em uma coluna e controles responsivos.
- Modal: barra de leitura entre cabeçalho e conteúdo, preservando a rolagem em `.modalContent`; áreas seguras para dispositivos móveis e minimização de espaços excessivos.
- **Atalhos de leitura**: módulo puro `mobile-panel-guide.js` monta destinos apenas se há seções presentes, como Programação, Notas PCM, Risco, Categorias, Carteira, Catálogo, Investigação e Evidências. Os botões fazem rolagem **dentro do modal** sem trocar setor, acionar decisões ou salvar dados. Honram `prefers-reduced-motion`.
- A barra de atalhos é reconstruída na abertura do setor e removida ao fechar; nenhum dado de campanha é modificado.

## Segurança de gameplay
Sem alterações em `engine.js`, `game-data.json`, notas, FMEA, diagnósticos ou política de manutenção. A nova navegação não cria OS, não executa análises e não seleciona nenhuma hipótese de PCM.

## Validação
`node scripts/test-mobile-panels-v24.cjs` verifica: versão de scripts/Service Worker, estilos mobile para cada disciplina, destinos válidos, rolagem dentro do modal, comportamento com seção ausente, ausência no desktop e preservação de dados.
Executado no GitHub Actions junto à regressão existente do Phaser.

**Verificações manuais pendentes no dispositivo físico:** Android Chrome normal e PWA instalado, retrato e paisagem curta; toque em controles de revisão PCM, abertura de seletor sem zoom, rolagem vertical de longas notas, botões de recoleta/triagem, painel de diagnóstico com seis estágios e salto para evidências. Conferir disponibilidade de gestos e renderização do canvas em telefones específicos.

## Limitações
Reorganização de elementos não garante acessibilidade perfeita em todos os tamanhos de Android/iOS. Algumas telas de jogo com conteúdo longo ainda exigem rolagem vertical. O navegador decide se fullscreen, orientação e zoom são permitidos.
