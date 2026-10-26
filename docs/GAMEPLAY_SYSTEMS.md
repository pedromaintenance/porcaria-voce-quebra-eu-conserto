# Contrato dos sistemas — fonte vigente

| Entrada | Recebimento | Destino/decisão | Restrição|
|---|---|---|---|
| Rádio | Relato operacional e código eletrônico **ativo** | Fila de OS corretivas | Nunca gerar análise laboratorial de óleo como rádio aleatório |
| Inspeção | Achado sensitivo ou código eletrônico **ativo** | Notificação para PCM | Sem OS automática, exige profissional/HH |
| Monitoramento | Óleo, códigos ativos/históricos, FPS, rodante, componentes | Acompanhar, reanalisar, escalar | Histórico não vira diagnóstico fechado; laudo fica nesta fonte |
| PCM | Notificações de inspeção ou escalonamento | Revisão, hipótese, escopo, programação, materiais | Não executar teste técnico de bancada antecipado |
| Oficina | OS e recursos alocados | Seis níveis SAP, reparo e encerramento | Box/profissional, ferramenta, peça e HH |
| Preventivas | Horímetro virtual e programação | OS preventiva e execução manual | Conflito com box, equipe e jornada do ativo |
| Treinamentos | Bia: interno, externo e normativo | Competência/indisponibilidade temporária | Integrar com bloqueios e HH do turno |

## Distinções críticas
- `fmeaSource.layer='oil/diagnostic-records.json'` não é observação de inspetor e não inicia OS aleatória no rádio. Um encaminhamento ao PCM após agravamento não apaga sua origem.
- Código eletrônico com `codeState='ativo'` pode ser observado em diversas fontes; `registrado` e `nao_confirmado` não representam alerta ativo observado em inspeção.
- Pré-diagnóstico PCM é hipótese, não gabarito. Seis níveis da OS: Sistema → Grupo → Subgrupo → Componente → Dano → Causa.
- Diretriz pendente do Sprint 32: ensaios técnicos somente com OS aberta e equipe alocada; há código legado de prática que ainda precisa ser migrado conscientemente.
- A equipe tem restrições de energia física, descanso, moral e competências; scores do jogo não são limiares médicos ou ocupacionais.

Os contratos são visões de produto: conferir módulo responsável antes de anunciar mudança concluída. [Campanha](CAMPAIGN.md) · [UX](UX_MAP.md).
