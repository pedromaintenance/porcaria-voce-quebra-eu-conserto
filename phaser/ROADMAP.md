# Oficina Phaser: plano de migração

A versão atual de main continua HTML/JavaScript. O motor em engine.js será reaproveitado, sem duplicar regras de turnos, diagnósticos, equipe, peças e ferramentas.

1. Integrar assets CAT 395 e Sandvik DR410i (mastro erguido e abaixado) em assets/equipamentos/; imagens binárias ainda pendentes.
2. Montar BootScene e WorkshopScene com 3 boxes e fila de OS.
3. Conectar ações da UI a PORCARIA_ENGINE: attach, release, advance.
4. Adicionar DiagnosticScene e ações de ferramental/material; manter save separado.
5. Integrar tutorial do Pedro e otimizar a interface para celular e PWA.
6. Testar e fazer revisão antes de mesclar na main.

Critério de entrega: estado real do motor refletido em tela, sem perda de save, três boxes e assets adequados publicados e carregando corretamente.
