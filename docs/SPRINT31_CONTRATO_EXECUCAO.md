# Sprint 31 — Contrato técnico de execução (proposta fechada para direção)

> **Estado:** ESCOPO FECHADO / EXECUÇÃO NÃO INICIADA.  
> **Base inspecionada:** main `9870be295577` (26/10/2026).  
> **Papel:** ChatGPT é executor técnico (desenvolvimento, testes, documentação, QA automatizado); o produtor é diretor criativo e beta tester.  
> **Documento complementar:** [Plano de homologação beta](SPRINT31_HOMOLOGACAO_BETA.md).

## Decisões do diretor — obrigatórias

1. **Campanha híbrida:** marcos, metas e relatório do ciclo de 20 dias, mas nenhuma missão tranca menus, obriga ordem de escolhas, muda a vitória por uma métrica arbitrária ou impede modo livre após o Dia 21.
2. **Narrativa contextual por personagens existentes:** orientações e reações **derivadas de eventos reais do save**, concisas, opcionais e sem spoiler da causa oculta ou diagnóstico. Elton — rádio, Pedro — monitoramento, Bia — treinamentos, Nemuel — inspeções, Diva — preventiva. PCM pode usar narração institucional da equipe até o diretor homologar um personagem próprio. Não inventar novas artes, dublagem ou diálogo complexo.
3. **Direção de arte e UX:** mudanças visuais significativas (layout, proporção, fontes globais, estilo, personagens, cores, organização de setores, imagens) exigem demonstração visual e aprovação explícita do produtor **antes de merge na main**. Corrigir bugs de acessibilidade/rolagem/campo sem mudança conceitual é elegível a PR técnico, após testes e comparação.

## Critério de conclusão do Sprint

- Integridade da origem: óleo é **recebido no Monitoramento**; só suas consequências formalmente escalonadas chegam ao PCM. Não aparece como inspeção nem como OS aleatória gerada pelo rádio. Código de falha **ativo** pode chegar por rádio, inspeção ou monitoramento. Registros eletrônicos históricos/não confirmados ficam consultáveis no Monitoramento/PCM, sem se tornarem achados ativos da inspeção. Preventivas vencidas seguem o próprio fluxo.
- Capacidade operacional e saves: pelo menos cinco campanhas determinísticas de 42 turnos (21 dias) e uma campanha longa de 60 turnos, com invariantes de ativos/OS únicas, estoque não negativo quando aplicável, equipe/boxes sem dupla alocação, avanço consistente, escopos de tratamento válidos e saves que sobrevivem a exportar/importar/recarregar. Testar idempotência do load e migradores existentes. Não retroagir eventos a saves antigos.
- Navegação de navegador real: desktop 1366x768 e mobile 390x844, 844x390; incluir toque, teclado, rolagem independente, troca de telas e foco após reconstrução de DOM; falhas geram artefatos (screenshots, logs e traços). CI sem flaky retry cego.
- Ciclo de jogo completo: rádio → OS → box/diagnóstico/reparo; inspeção → nota → PCM → OS; monitoramento → acompanhamento/recoleta → decisão/escalonamento → PCM; preventiva → programação → execução; treinamento sem conflito de HH. Não exigir que todos ocorram em um único save aleatório: usar fixtures determinísticas.
- Campanha: metadados de progresso **derivados de eventos existentes**; três tipos de objetivos não obrigatórios (retornar uma OS ao serviço, tratar uma nota, concluir uma preventiva) e relatório do Dia 21 (sem nota de aprovação/reprovação não pactuada). Progresso e ações continuam acessíveis no modo livre.
- Orientação contextual: cada domínio prioritário tem ao menos uma orientação ao chegar e uma reação a um evento, sempre baseada em estado real, descartável, não intrusiva, sem obrigar leitura nem revelar solução.
- Documentação: fonte de verdade atualizada, com estados separados **implementado / teste automatizado / homologado pelo diretor**. Evitar prometer QA visual sem execução.

## Sequência e prioridades

| Ordem | ID | Prioridade | Incremento | Dependência / gate |
|---|---|---|---|---|
| 1 | S31-01 | P0 | Contrato de origem de demandas e regressões no motor | Bloqueia correções de interface que ocultem erro de origem |
| 2 | S31-02 | P0 | Simulação determinística, invariantes e compatibilidade de saves | Bloqueia avaliação da campanha |
| 3 | S31-03 | P0 | Playwright: fluxo E2E, toque, teclado, viewport mobile, capturas | Bloqueia homologação técnica |
| 4 | S31-04 | P1 | UX: tornar decisões evidentes e remover cliques/campos redundantes | Redesigns vão para avaliação antes de merge |
| 5 | S31-05 | P1 | Objetivos híbridos, personagens contextuais e resumo do Dia 21 | Revisão de conteúdo e visual pelo diretor |
| 6 | S31-06 | P1 | Atualizar documentação corrente e separar histórico | Sem remoção de arquivos históricos |
| 7 | S31-07 | P1 | Preparar fixtures e roteiro de beta test | Após S31-01/02/03; fechamento exige feedback do diretor |

## Constatações técnicas fundamentadas

- `engine.js:504-533` filtra `progression` e `sapEligible` no sorteio de `spawn()`, **mas não filtra o `fmeaSource.layer`**. O catálogo contém registros de `oil/diagnostic-records.json` sem `progression`. **Hipótese de bug concreta:** OS de rádio aleatória baseada em análise de óleo. Corrigir no motor/fonte, não esconder só na UI.
- `inspection.js` já possui `inspectionEligible()` para excluir óleo e restringir eletrônica a ativos; `monitoring.js` mantém `monitorOnly` e fluxo de escalonamento. Validar a consistência de ambos e de dados legados.
- `monitoring.open()` ainda cria uma inspeção técnica sintética interna (`kind:'monitoring_practice'`); **não a confundir com inspeção do jogador**. Avaliar se o registro precisa evoluir sem quebrar saves/estudos existentes.
- `engine.create()` começa com R$ 15.800, reputação 86, 3 boxes, equipe principal de cinco profissionais, 3 OS sorteadas, turnos de 12h (10,5 HH úteis) e frota de 9 modelos × 6 ativos. `engine.advance()` apenas marca `closed=true` quando `day>=21` e deixa seguir jogando. Não existe nota final estruturada com critérios de desempenho pactuados.
- `game.js` usa localStorage sob chave `porcaria.phaser.prototype.v01`, com contrato do save `1.1.0`; são conceitos distintos da versão do app `0.9.x`. Não alterar a chave nem invalidar saves para introduzir progresso ou mensagens.
- `phaser-play/ROADMAP.md` permanece com estado de referência v0.9.22, `LEIA-ME.md` fala em 33 cenários/turnos de 8h e `NOTAS_DA_VERSAO.md` descreve 29 incidentes. Atualizar fontes atuais mantendo arquivos históricos e avisando que versões antigas não são contratos vigentes.
- A UI possui painéis de Rádio (Elton), Monitoramento (Pedro), Treinamentos (Bia), Inspeções, PCM e Oficina; a revisão deve preservar o mapeamento real, não inventar personagens ausentes. O guia mobile 30/70 cobre Inspeção e PCM; observar seus limites por aparelho antes de alterar dimensão ou fonte.
- O CI executa testes Node.js, mas não faz QA E2E de navegador real; testes de DOM falso não substituem toque/rolagem/foco/captura visual.

## Design de objetivos híbridos — contrato mínimo

Metas **observacionais** e não bloqueantes, calculadas por registros do save:
- **Retornar equipamento ao serviço:** ao menos uma OS concluída com `done`/histórico de execução real.
- **Tratar uma condição de campo:** uma nota de inspeção revisada/encaminhada no PCM (não confundir com protocolo laboratorial).
- **Programar e realizar preventiva:** serviço de preventiva concluído, não apenas reserva aberta.
Os marcos podem ser completados em qualquer ordem ou ignorados. O relatório do Dia 21 mostra resultados reais com legenda e comparação ao estado inicial, nunca nota de aprovação arbitrária. Não inventar eventos nem recompensa financeira por ter lido um tutorial. Visual da apresentação é **gate da direção**.

## Personagens e interface — contrato mínimo

- Reações elegíveis: novo chamado prioritário (Elton), tendência/recoleta que exige decisão (Pedro), achado e nota (Nemuel), curso/disponibilidade de equipe (Bia), preventiva a vencer/execução (Diva).
- `eventId`, `tick`, `source`, `type` e `dismissed` ou equivalente devem permitir deduplicação e evitar mensagens repetidas a cada `drawUI()`/reload. Não duplicar a auditoria de decisões sem necessidade.
- Máximo uma dica contextual relevante por entrada no setor; não interromper trabalho com modal obrigatório; oferecer dispensar e silêncio/redução de dicas.
- Redações operacionais curtas, sem exposição de gabarito de 6 níveis, pressões/limites não verificados ou classificações OEM não sustentadas.

## Fora do escopo (não abrir durante este sprint)

- Reestruturação do diagnóstico por testes de bancada em OS (Sprint 32), salvo correções de bloqueio de fluxo sem mecânica nova.
- Redesenho de personagens, novos sprites/maquinários e transferência integral dos 115 assets (Sprint 33 / PR #2).
- Economia rebalanceada de maneira ampla, novo modelo físico/falha probabilística, sistema de vitórias por pontuação, campanha roteirizada obrigatória, infraestrutura de backend ou contas de jogador.
- Troca de framework, refatoração total dos 149 KB de `game.js`, migração disruptiva de schema e remoção de histórico anterior.

## Workflow de execução para ChatGPT

1. Criar **branch específica por issue**, partindo de `main` atual e explicitando seu SHA; nunca trabalhar sobre o PR de arte em rascunho.
2. Antes de corrigir bug, escrever regressão que reproduza o problema; registrar evidência e invariantes. Preferir abstrações pequenas e sem novas dependências, exceto Playwright onde justificado.
3. Entregar incremento com teste local/CI e PR delimitado, notas de risco, comparação antes/depois e instruções mínimas de beta.
4. PR técnico sem mudança visual relevante pode ser integrado após CI e avaliação de impacto; **PR que muda composição visual fica aberto/draft até sinal verde do diretor**, mesmo que testes passem.
5. Registrar estado `proposto → implementado → testado → homologado`. Publicar o resultado somente depois de merge e sucesso do Pages; não confundir build e homologação humana.
6. Falha de P0 interrompe acréscimos de UX até resolução. Ao fechar Sprint 31, apresentar relatório do CI, evidências do navegador, limitações e pendências encaminhadas aos próximos sprints.

## Política de decisão editorial

O diretor mantém decisão final sobre narrativa, ritmo, termos, personagens, metas, layout e arte. O ChatGPT mantém responsabilidade por segurança técnica, testes, coerência do sistema e clareza de impacto. Questões sem impacto visual relevante e já aprovadas por contrato podem ser resolvidas autonomamente; alternativas com efeito criativo relevante devem vir com explicação e evidências para aprovação.
