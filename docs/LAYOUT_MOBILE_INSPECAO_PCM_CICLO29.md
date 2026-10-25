# Ciclo 29 — Inspeção e PCM em duas colunas (mobile)

Implementação prevista para **v0.9.31**, sobre o código do ciclo 28.

## Solicitação

Nas telas de Inspeção e Planejamento PCM, manter cerca de **30% da largura para navegação lateral** e 70% para conteúdo, inclusive em celulares em modo paisagem. Reduzir tipografia, padding e altura da interface sem comprometer leitura, seleção ou funcionalidade.

## Comportamento implementado

- Apenas **Inspeção** e **PCM** acionam a classe `mobile-split-guide`. Outros painéis preservam a navegação anterior.
- Abas do guia (Início, Programar, Indicadores, Ronda; Início, Programação, Notas PCM, Risco quando disponíveis) ficam à esquerda em lista vertical.
- Coluna esquerda e área direita possuem **rolagem independente**, com indicação visual da seção selecionada e foco do teclado preservado.
- Interface é responsiva: coluna com `clamp(96px,29%,204px)`, limitando a 92px no celular estreito; painel cresce com o espaço disponível.
- Tipografia de painéis cai majoritariamente para **11–12px**, sem reduzir selects em dispositivos iOS a um tamanho capaz de induzir zoom ao tocar.
- Sem alteração na engine, SAP, diagnóstico, valores, inventário, decisões, notificações, ordens ou save.
- Incluído CSS independente `mobile-split-v29.css`, teste `test-mobile-split-v29.cjs`, CI e precache do PWA versionado.

## Homologação manual pendente

1. Android Chrome e iPhone Safari (paisagem e retrato), inspeção com 3 abas e PCM com 3 abas.
2. Clicar Início, Programar, Indicadores, Ronda, Notas PCM e Risco; validar rolagem apenas na coluna de conteúdo e destaque da aba.
3. Rolar menu lateral sem mover o conteúdo; abrir selects com teclado virtual; executar uma inspeção e programar uma OS.
4. Conferir conteúdos extensos do PCM, lista de notificações e calendário horizontal sem cortar botões nem sair do modal.
5. Validar desktop e Monitoramento fora da alteração. Reabrir jogo instalado como PWA, inclusive offline.

**Nota de QA:** testes automatizados verificam estrutura, estado e integração. Aprovação visual/funcional em aparelhos reais ainda é necessária.
