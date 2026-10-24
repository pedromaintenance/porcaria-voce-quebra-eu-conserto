# P.O.R.C.A.R.I.A. — Ciclo 22: Experiência mobile / v0.9.25

## Diagnóstico do problema
A oficina é um canvas Phaser que anteriormente capturava os eventos de toque, impedindo a rolagem vertical do navegador quando o gesto começava sobre a arte. Além disso, os boxes abriam uma OS em `pointerdown`, antes de distinguir toque deliberado de arrasto. No Chrome normal, a barra de endereço não pode ser retirada automaticamente ao carregar uma página.

## Solução adotada
1. **Rolagem vertical livre sobre o canvas:** Phaser usa `input.touch.capture = false` nos dispositivos touch, e a cena usa `touch-action: pan-y`. Mouse e teclado no desktop preservam o comportamento.
2. **Toque versus arrastar:** no mobile, os boxes, equipamentos e mecânicos respondem ao `pointerup` somente se o movimento desde `pointerdown` foi inferior a 14 unidades de entrada; gestos verticais deixam de abrir OS involuntariamente.
3. **PWA de celular independente:** `phaser-play/mobile.webmanifest` tem ID próprio, `start_url: ./?mobile=1`, `display: fullscreen` e `orientation: landscape`. O manifesto desktop original `manifest.webmanifest` continua com `standalone`. O HTML escolhe o manifesto mobile antecipadamente em smartphones/tablets e telas touch compactas.
4. **Instalação:** controle INSTALAR aparece somente em dispositivos mobile fora da janela instalada. Quando `beforeinstallprompt` está disponível, usa a solicitação nativa iniciada por toque. Caso contrário, apresenta instruções pelo menu ⋮ do Chrome.
5. **Tela cheia por toque:** botão TELA CHEIA chama `requestFullscreen` diretamente no clique, tenta `screen.orientation.lock('landscape')` se permitido e oferece alternativas legíveis se bloqueado. O botão alterna para SAIR DA TELA CHEIA enquanto ativo.
6. **Interface:** cabeçalho mais compacto em paisagem, recomendação não bloqueante de giro em retrato, canvas proporcional aos limites de viewport, botões de toque maiores e modal rolável com áreas seguras para notch/navigation bar.
7. **PWA offline:** Service Worker inclui manifest e controlador mobile no cache, com versão renovada; não altera as chaves do save.

## Limitações técnicas
- Um site comum **não pode** entrar em fullscreen ou girar a tela automaticamente em todo navegador. Acesso via PWA instalado é o caminho mais consistente no Chrome Android, condicionado ao suporte da versão/SO. `orientation: landscape` é preferência de manifesto, não garantia em todo celular.
- O navegador decide se deve disponibilizar `beforeinstallprompt`; sem evento, orientar instalação manual.
- Em dispositivos que bloqueiam orientação ou API fullscreen, o modo retrato continua funcional com orientação sugerida, sem travar o gameplay.
- O resultado de `pan-y`/captura de eventos depende da implementação do navegador. Validar in loco Android Chrome (versão regular e instalada), retrato/paisagem, primeiro toque e gesto em box ocupado.
- Em iOS, a disponibilidade de fullscreen e bloqueio de orientação é menor; o PWA ainda poderá ocultar a barra conforme o suporte do Safari.

## Verificação recomendada no celular
1. Abrir `https://pedromaintenance.github.io/porcaria-voce-quebra-eu-conserto/phaser-play/` no Chrome Android.
2. Deslizar verticalmente começando sobre o centro da oficina; verificar que a página rola sem abrir OS.
3. Tocar deliberadamente em um box e confirmar que abre uma única vez.
4. Usar **INSTALAR** e iniciar pelo ícone da tela inicial; conferir se a barra de endereço desapareceu.
5. Conferir orientação paisagem e **TELA CHEIA** quando permitido, depois sair e retornar.
6. Abrir Planning/Inspeções/Fila e rolar até o final com o dedo. Confirmar botões e safe-area.
7. Validar **AVANÇAR TURNO** e reabrir save; verificar que desktop continua sem alterações.

## Automação
`node scripts/test-mobile-experience-v22.cjs` cobre manifestos, ID e escopo separados, touch-action, configuração Phaser, seleção por toque concluído, fluxo de instalação, fullscreen, girar e preservação do desktop. O CI executa os testes juntamente com a regressão anterior.

Nenhuma alteração de regra de manutenção, balança financeira ou progressão foi planejada neste ciclo.
