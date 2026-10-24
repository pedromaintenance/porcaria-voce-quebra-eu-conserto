# P.O.R.C.A.R.I.A. — Ciclo 23 | Navegação Mobile e Voltar do Android (v0.9.26)

## Contexto
O Ciclo 22 habilitou `touch-action:pan-y`, gesto de toque sem abrir OS ao arrastar e um PWA Android com tela cheia e paisagem. A usabilidade ainda possuía limitações relevantes:

- Onze setores competiam por largura no cabeçalho, sobretudo em paisagem com altura pequena.
- O botão Voltar do Android podia fechar/navegar fora do app em vez de encerrar o painel aberto.
- Alguns navegadores resolvem `BeforeInstallPromptEvent.prompt()` sem um `outcome`; a resposta verdadeira está em `event.userChoice`.
- A área do canvas era limitada por valores CSS genéricos, sem considerar a altura real do cabeçalho.
- Após `appinstalled`, o botão de instalar poderia continuar aparecendo na guia corrente.

## Solução
1. **SETORES:** o cabeçalho do celular exibe um botão de navegação. A lista existente dos 11 setores continua sendo **a mesma**, sem duplicar comandos ou alterar as ações de jogo. Ao abrir, é apresentada em grade de duas colunas no retrato e três na paisagem compacta. O menu tem `aria-expanded`, `aria-controls`, `aria-hidden`, tecla Escape, toque fora para fechar e seleção via botões originais. O desktop continua com a barra de navegação integral.
2. **Histórico para PWA:** abrir o menu de setores ou um modal acrescenta uma entrada de histórico **somente se ainda não houver uma proteção ativa**. Voltar do Android recolhe o menu ou fecha o modal por meio da função original de fechamento. Trocar de setor com o menu aberto reutiliza a entrada, sem empilhar estados artificiais. Fechar pelo X retorna a entrada adicionada. A proteção só é ativada no mobile; não mexe no save.
3. **Instalação:** captura o resultado assíncrono de `event.userChoice`, com compatibilidade para implementações que devolvem o resultado de `prompt()`. O evento `appinstalled` oculta o comando de instalação mesmo se a guia do Chrome ainda estiver no modo navegador. Quando o aplicativo já estiver aberto em fullscreen por manifesto, oculta o controle redundante de tela cheia.
4. **Viewport:** mede `visualViewport.height` (ou `innerHeight`) menos a altura atual da barra superior e atribui `--mobile-stage-height`; recalcula após giro, redimensionamento e mudança de tela cheia. Mantém `max-width` e proporção do canvas; não recria a cena Phaser, não altera a geometria dos boxes.
5. **Toque seguro:** com a lista de setores aberta, interações com o Phaser são bloqueadas como com o modal, evitando abrir OS ao tocar fora para recolher o menu.
6. **Avisos:** mensagens de instalação podem ser dispensadas pelo toque.

## Limites e validação
O resultado de fullscreen, modo paisagem e botão Voltar depende de APIs disponíveis no navegador e da versão do Android. O modelo com `pushState` não intercepta ações que o sistema operacional reserve para fechar a aplicação; casos de navegador sem suporte seguem funcionando sem bloqueio.

**Teste manual em celular Android/Chrome instalado e em guia normal:**

- Abrir em retrato e paisagem: cabeçalho compacto, botão SETORES, duas/três colunas de setores, menu sem colisão com oficina.
- Abrir SETORES → Planejamento: tela abre e o menu se recolhe; voltar do Android fecha painel antes de sair do site. Repetir com OS completa e retorno entre janelas.
- Com o menu aberto, tocar fora sobre a oficina não deve abrir OS involuntária.
- Abrir e fechar a mesma janela repetidamente e conferir que o histórico não cresce sem necessidade.
- Abrir em paisagem curta com barra do navegador expandida/recolhida, verificar altura do canvas, 3 boxes e controles de avançar turno.
- Tentar instalar, aceitar, cancelar, concluir e abrir pelo ícone; verificar avisos/controles coerentes.
- Validar que o desktop mantém os 11 setores e navega normalmente.

## Testes automáticos
`scripts/test-mobile-navigation-v23.cjs`: lógica de menu, semântica de acessibilidade, guarda de histórico, Android Voltar, transição para modal, instalação `userChoice`, `appinstalled`, viewport e desktop. Executado pelo CI do Phaser junto com o Ciclo 22 e toda regressão existente.

## Integridade
Sem alterações em `engine.js`, arquivos de dados ou `SAVE`. Nenhuma regra de manutenção ou saldo de campanha foi alterado.
