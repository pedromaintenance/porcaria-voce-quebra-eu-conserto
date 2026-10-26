# Sprint 31 — Homologação beta dirigida pelo produtor

**Estado:** plano de QA preparado; os testes de navegador e fixtures ainda não foram implementados.  
**Contrato:** [SPRINT31_CONTRATO_EXECUCAO.md](SPRINT31_CONTRATO_EXECUCAO.md).

## O que o ChatGPT valida sem depender do diretor

- Testes Node: invariantes de OS/ativo, HH, estoque, conflitos de box e profissional, notas, origem e save; simulações reprodutíveis com 5 sementes × 42 turnos e 1 semente × 60 turnos.
- Testes Playwright no CI: navegação desktop 1366×768; mobile vertical 390×844 e horizontal 844×390; abrir/fechar menus, foco e rolagem, radio → box → OS, inspeção → notificação → PCM, monitoramento → decisão, preventiva → box.
- Artefatos: capturas de tela no ponto de entrada e depois de interação; logs do console; trace em caso de falha; conteúdo de save sanitizado e **sem dados privados**.
- Fluxos guiados por fixture **fora da campanha de produção** para simular condições em dias diferentes. Não apresentar dados simulados de teste como eventos reais na campanha do jogador.
- Acessibilidade prática: navegação por teclado, rótulos de campos, foco ao fechar modal, ações não ocultas sob overlays, indicador de ação bloqueada com motivo concreto, sem cliques atravessando Phaser.

## O que o produtor avalia jogando

### Sessão A — Descoberta da oficina (Dia 1)

**Teste:** abrir uma nova campanha sem consultar documentação, escolher o primeiro chamado do Rádio, atribuir pessoa e box e verificar progresso após um turno.  
**Avaliável:** intenção da interface, reconhecimento dos setores, resposta de Elton, clareza entre prioridade e execução, uso no celular.

### Sessão B — Comunicação entre setores (Dias 2–5 / fixture)

**Teste:** escolher um ativo e profissional para Inspeção, obter achado, encaminhar ao PCM, devolver/arquivar pelo menu sem justificar por texto, aprovar e programar uma demanda. No Monitoramento acompanhar laudo de óleo, evento eletrônico ativo e histórico sem origem incompatível.  
**Avaliável:** diferenciação entre dado de inspeção, laudo, chamado e diagnóstico; comunicação de Nemuel e Pedro.

### Sessão C — Capacidade e consequência (Dias 6–12 / fixture)

**Teste:** fila em crescimento, ausência de peça, dois profissionais ocupados, recuperação de equipe, uma preventiva no calendário e uma recoleta vencida.  
**Avaliável:** capacidade de perceber bloqueio e destravar sem tentativa-cega; percepção de que decisões importam; excesso de menus/cliques.

### Sessão D — Ciclo e modo livre (Dias 13–21 / fixture)

**Teste:** acessar marcos da campanha, visualizar trabalho realmente concluído, entrar no Dia 21, conferir relatório baseado em KPI e continuar jogando no modo livre.  
**Avaliável:** senso de evolução e conclusão sem forçar caminho único; reação de personagens não invasiva; disposição para jogar mais.

## Matriz de cenários determinísticos

| Fixture | Estado intencional | O que precisa funcionar |
|---|---|---|
| `fresh_day1` | Save recém-criado | 3 corretivas iniciais, equipe e recursos coerentes |
| `return_from_inspection` | Achado e nota em revisão | Devolver por motivo, sem campo de texto; preserva histórico |
| `oil_laboratory` | Laudo recebido e recoleta agendada | Laudo só no monitoramento; escalonamento à nota PCM |
| `active_vs_historic_faults` | Códigos ativos e registrados | Inspeção só ativos; monitoramento/PCM consultam histórico |
| `crew_material_conflict` | Equipe/boxes ocupados e peça indisponível | Bloqueios claros, sem duplicidade ou consumos irreais |
| `preventive_due` | PM vencida e reservada | Execução manual, Diva, calendário e HH |
| `day20_day21` | Perto do encerramento do ciclo | Relatório, marcos não bloqueantes e continuidade pós-ciclo |
| `legacy_save` | Save 1.1.0 anterior à melhoria | Dados preservados, sem geração de eventos retrospectivos |

## Relatório de beta — formulário mínimo

O produtor pode reportar cada ocorrência neste formato, sem produzir documentação extensa:

- **Onde:** setor e, se possível, dia/turno;
- **O que eu esperava:** comportamento;
- **O que aconteceu:** observação;
- **Impacto:** bloqueia / confunde / incomoda / sugestão estética;
- **Imagem:** opcional.

O ChatGPT reproduz e transforma o relato em teste e correção. Bugs de P0 podem ser corrigidos imediatamente na branch de execução; redesign requer apresentação ao diretor antes de integrar.

## Gates e evidências de entrega

- **G0 — Baseline:** código/CI atual e fixtures versionados sem segredos.
- **G1 — Integridade:** origem de demandas + campanha determinística + saves verdes.
- **G2 — Navegador:** Playwright e capturas demonstram fluxos críticos desktop/mobile.
- **G3 — UX:** versão candidata com decisões claras e orientação opcional; proposta de redesign entregue em comparativo, caso exista.
- **G4 — Direção:** diretor avalia experiência e autoriza mudanças visuais substanciais; pendências ficam registradas como bug, melhoria ou próximo sprint.

**Proibido declarar `homologado` somente porque um teste automatizado passou.** Do mesmo modo, não exigir do diretor que execute repetidamente cenários reproduzíveis por script.
