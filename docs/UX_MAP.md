# Mapa UX — versão atual e gates de direção

## Navegação
Oficina → Rádio/Fila de OS → OS rápida/detalhada → PCM → Inspeção → Monitoramento → Equipe → Treinamento → Almoxarifado → Indicadores → Gestão. A navegação não implica uma ordem obrigatória de decisões.

## Prioridade da informação por setor
- **Rádio:** chamado, ativo, criticidade, bloqueio e escolha de OS. Nada de laudo laboratorial.
- **Inspeção:** selecionar TAG/profissional, reservar HH, registrar achado, encaminhar nota, consultar rondas (sem histórico de códigos inativos).
- **PCM:** pendência/decisão primeiro; histórico e risco como consulta; devolução por motivo da lista, sem texto obrigatório.
- **Monitoramento:** separar registros recebidos, histórico de eventos, biblioteca de 120 entradas, recoletas e decisões; biblioteca não é backlog.
- **Oficina:** box, profissional, seis níveis de diagnóstico, peças/ferramentas, execução; impedir clique atravessando modal.
- **Gestão:** visão de prontidão, limites de boxes e HH, alertas e indicadores; não automatizar decisões do jogador.

## Mobile
Inspeção e PCM possuem navegação lateral próxima a 30% e conteúdo próximo a 70% em `mobile-split-v29.css`. Não alterar proporções/estrutura visual sem aprovação do produtor. O menu lateral e conteúdo têm rolagens independentes, com foco de teclado.

## Convenção de comportamento
- Uma ação principal clara, com status e motivo de bloqueio.
- Nenhuma justificativa longa obrigatória quando a escolha estruturada é suficiente.
- Mensagens de personagens: evento real, curtas, dispensáveis, sem repetição por render ou reload e sem revelar causa oculta.
- Regressões em navegador devem testar toque, teclas, foco, scroll e fechamento de overlay.

**Estado:** navegação existente implementada; orientação narrativa e tela de marco híbrido são escopo aprovado do Sprint 31, ainda sujeitos a gate visual.
