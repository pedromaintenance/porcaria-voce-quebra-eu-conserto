# Sprint 31 — Comparativo de UX para a direção (PR #132)

> **STATUS:** CANDIDATO, NÃO APROVADO. Nenhuma mudança visual deste documento foi incorporada à `main`.

## 1. Gestão
**Antes:** KPIs e quadro de prontidão sem um marco de campanha explícito. **Depois (candidato):** uma seção compacta de 3 marcos opcionais no topo da Gestão; cada marco muda apenas pela situação real no save. Após o Dia 21, relatório numérico de fechamento com continuidade do modo livre. Sem pontuação artificial, sem telas bloqueantes.

## 2. Orientação pelos personagens
**Antes:** orientações predominantemente em textos institucionais ou dispersos. **Depois (candidato):** um cartão não modal no topo do setor quando houver evento elegível: Elton — chamado crítico, Nemuel — achado/nota, Pedro — condição recebida, Bia — oferta de capacitação, Diva — preventiva, Equipe PCM — notificação pendente. O jogador dispensa com ✕ e isso persiste no save. Não há nova arte, áudio ou revelação de diagnóstico.

## 3. Celular
Mantém navegação lateral 30/70 de Inspeção/PCM; cartões de orientação ficam dentro da área do conteúdo e usam 11px; não devem cobrir ações nem exigir scroll horizontal. Se a versão vertical estiver apertada, comparar uma variante de orientação ainda mais curta, sem encostar no campo de trabalho.

## 4. Pontos de aprovação do produtor
1. A seção de metas ocupa espaço demais na Gestão?
2. As falas dos personagens têm personalidade suficiente sem transformar o jogo em tutorial invasivo?
3. O relatório do Dia 21 comunica conquista sem induzir a uma nota de aprovação arbitrária?
4. A interface funciona no celular, em retrato e paisagem, sem ocultar as informações técnicas?

## Evidência
O CI Chromium da branch registra capturas das vistas nos três viewports, como artefatos da execução. Um print aprovado vale apenas para a apresentação; a validação jogável continua sendo atribuição do produtor.

**Regra:** não mesclar o PR #132 antes de aprovação explícita da direção; bugs técnicos podem ser corrigidos na própria branch sem aprovar layout.
