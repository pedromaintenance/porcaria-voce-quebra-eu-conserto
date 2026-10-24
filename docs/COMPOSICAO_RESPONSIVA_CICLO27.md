# Ciclo 27 — Layout responsivo da oficina, Rádio, Monitoramento e Planejamento

## Solicitação do teste em Android (24/10/2026)

As capturas de jogo mostraram: barras inferiores dos boxes cortadas no celular; menu VISUAL desnecessário; ilustrações Elton, Pedro e Planejamento grandes demais para a área útil; em Monitoramento o menu móvel fora da imagem; e três OS prioritárias que poderiam ocupar a zona livre à direita de Elton.

## Regras implementadas

### Oficina e navegação

- **Somente celular**: o HUD inferior dos três boxes é ocultado. Progresso/OS permanecem no jogo, menus de setor, Fila de OS e detalhes da máquina; a geometria dos boxes não foi modificada.
- **Desktop e celular**: o controle VISUAL foi retirado da interface, mantendo somente o suporte técnico de assets e estados em DOM oculto para não quebrar os listeners e saves existentes. A troca oficial entre dia e noite permanece automática.
- Não foram alterados `engine.js`, peças SAP, diagramas, mecanismos FMEA, regras de alocação, turno ou economia.

### Fila de OS e a arte de Elton

- Ilustração **original completa** com `object-fit: contain`, dimensões proporcionais a `108dvh` (reduzidas em telas baixas), sem recortar cabeça, corpo, braço ou fim da imagem.
- Nova área de prévia é sobreposta **exclusivamente a partir de x=57%** da largura do quadro. O espaço até x=57% é protegido para Elton e o dedo que aponta. Em celular estreito vertical, x=55% para os cartões não ficarem inviáveis.
- As **três primeiras OS da lista ordenada e filtrada** aparecem lado a lado com Elton, em três cartões na coluna direita. Ao tocar, utilizam a ação existente `data-pick` e abrem a mesma OS, sem duplicar dados.
- **Lista completa, pesquisa e filtros permanecem abaixo** da arte. Selecionar crítico, aguardando, alocadas ou digitar na busca modifica a prévia e a lista a partir de uma única coleção filtrada.
- Cards possuem limites de altura e texto reduzido em paisagem muito curta; nenhuma barra de rolagem da foto é necessária.
- Status do rádio (chamados, críticos, aguardando e alocados) permanece abaixo da cena.

### Monitoramento e a arte de Pedro

- **Um único menu funcional** sobre a área esquerda da arte, como no desktop. O menu mobile separado é ocultado.
- Sidebar posicionada a partir de **x=1,35%**, com **largura máxima de 32%** do quadro; Pedro e os monitores à direita permanecem fora da área de comandos.
- Em telas baixas, a lista de botões pode rolar **dentro da própria sidebar**. A arte permanece completamente visível; seus pixels não são cortados com `object-fit: cover`.
- O atalho superior “Categorias” do Ciclo 24 agora aponta para a própria sidebar.

### Planejamento e arte da sala PCM

- A imagem mantém sua proporção **1447:1087** e é dimensionada a `min(100%,60dvh,560px)` de largura (58dvh se altura até 520px).
- `object-fit: contain` garante o começo e o fim da ilustração na mesma área visual, tanto no PC quanto no celular.
- Programação, notas, filtros e demais funções de PCM permanecem abaixo da figura.

## Medidas de segurança de layout

A posição dos menus é proporcional à **caixa que contém a imagem inteira**, não à janela; isso evita desvio de alinhamento quando a foto diminui. As zonas seguras são declaradas em `phaser-play/responsive-scenes-v27.css`.

Os três setores usam o **mesmo arquivo de arte** e têm ajuste adicional em telas com altura até 520 px. O CSS novo é carregado **após** a folha interna legada, que continha `object-fit: cover` e regras de monitoramento mobile divergentes.

## Verificação

- Teste automático `scripts/test-responsive-scenes-v27.cjs` valida posições seguras de Elton/Pedro, uso da imagem inteira, visibilidade do HUD somente em desktop, controles de fila íntegros, CSS carregado e cache PWA renovado.
- Phaser CI continua com os testes de menus anteriores e com o teste histórico de Elton.
- Teste visual real em Android Chrome/PWA e desktop ainda deve verificar legibilidade dos cartões em diferentes relações largura/altura. Nenhum teste estático substitui uma conferência de renderização em dispositivo.
