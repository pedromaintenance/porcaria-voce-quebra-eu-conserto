# Sessão 6 — Material rodante, transmissão e desgaste (20/10/2026)

Catálogo de missões do **PORCARIA — Você Quebra, Eu Conserto**: **85 → 95 missões**. Foram preservadas as 85 anteriores; casos novos `INC086` a `INC095`.

## Fundamentação técnica e limites da fonte

Referências de treino: [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining), arquivos `data/knowledge/diagnostic/playbooks.v1.json` (v1.2.1) e `data/knowledge/oil/diagnostic-records.json` (v1.1.0).

As bases têm **playbooks e registros sintéticos**. Nenhum diagnóstico de componente e causa foi confirmado por literatura OEM, inspeção em equipamento real, laudo laboratorial original ou registro SAP. Todos os gabaritos aqui usados são **desfechos fictícios para jogabilidade**; `sourcePartMatch:false`, `simulation.oemValidated:false` e `applicabilityValidated:false` permanecem obrigatórios. `INC095` é elaboração autoral sem `recordId`.

Quando o caso originalmente diz apenas *contaminação*, *metais* ou *redutor com dano interno*, não atribuí à fonte prova de **pitting, fadiga ou determinada engrenagem**. Esses detalhes foram criados para o jogo e estão nos campos `lesson` e `drivetrainTraining`.

## Missões integradas

| ID | Equipamento | Missão | Referência FMEA | Gabarito ficcional |
| --- | --- | --- | --- | --- |
| INC086 | CAT 777E | 777E — ronco de comando final por rolamento | PB-TRUCK-FINAL-01 | Rolamento / Piteado / Fadiga |
| INC087 | CAT 777E | 777E — dano em dente de engrenagem do comando final | PB-TRUCK-FINAL-01 | Engrenagem / Lascado / Sobrecarga mecânica |
| INC088 | CAT 777E | 777E — metais de desgaste na transmissão | OIL-CASE-038 | Engrenagem / Piteado / Lubrificação insuficiente |
| INC089 | CAT 6030 | 6030 — metais no Redutor de Giro | OIL-CASE-029 | Engrenagem / Desgastado / Lubrificação insuficiente |
| INC090 | CAT D9 | D9 — rolete de retorno aquecendo e agarrando | PB-DOZER-TRACK-01 | Rolamento / Gripado / Lubrificação insuficiente |
| INC091 | CAT D9 | D9 — roda-guia desalinhada no lado direito | PB-DOZER-TRACK-01 | Roda-Guia / Desalinhado / Desalinhamento |
| INC092 | CAT 966 | 966 — contaminação no diferencial dianteiro | OIL-CASE-067 | Vedação / Deteriorado / Falha de vedação |
| INC093 | CAT 16 | CAT 16 — tandem com engrenagem piteada | OIL-CASE-069 | Engrenagem / Piteado / Contaminação |
| INC094 | CAT 16 | CAT 16 — desgaste direcional por desalinhamento | PB-GRADER-TIRE-01 | Pneu / Desgastado / Desalinhamento |
| INC095 | Sandvik DR410i | DR410i — tensionador de esteira perde retenção | Elaboração autoral | Vedação / Vazando / Falha de vedação |

## Diagnóstico diferencial: o que o jogador deve aprender

- **INC086 versus INC087:** ruído e metais no comando final do 777E não diferenciam rolamento de engrenagem sem inspeção. Na ficção, os resultados de inspeção final são distintos.
- **INC088:** mesmo inspeção interna *virtualmente* conclusiva de transmissão não identifica, na origem, a peça exata. O gabarito da engrenagem da transmissão é uma adaptação autoral.
- **INC089:** o FMEA `OIL-CASE-029` trata dano interno de **Redutor de Giro** da 6030, sem prova de que seja engrenagem e sem localização funcional detalhada. O jogo força uma peça e um mecanismo, mas não os promove a diagnóstico real.
- **INC090 versus INC091:** atrito e aquecimento no D9 podem ser rolamento gripado ou roda-guia desalinhada; diferenciar localização, folgas, ângulos e tensão.
- **INC092:** indício de poeira ou água no diferencial de CAT 966 exige amostra e inspeção de respiros/vedações. A referência `OIL-CASE-067` é de **CAT 950** e não confirma aplicação na 966.
- **INC093:** o caso `OIL-CASE-069` diz apenas que houve contaminação suspeita no conjunto de transmissão/diferencial CAT 16. Pitting de engrenagem na missão **não está provado pelo óleo**.
- **INC094:** desgaste por geometria do pneu difere do cenário anterior `INC039`, que ensina pressão incompatível com aplicação.
- **INC095:** tensionador de esteira DR410i perde retenção devido à vedação **na narrativa autoral**; confirmação de arquitetura e método de despressurização depende de procedimento OEM.

## Mudanças de inventário e cadastro fictício

- Nova classe de peça `Roda-Guia` e sobressalente virtual `RGUA`.
- Instrumentos virtuais: `CTSM` (kit de medição dimensional de material rodante) e `COMP` (relógio comparador).
- Três **caminhos didáticos** (não SAP e sem validação OEM):

- CAT 777E: `DRTR/TRAN/TRGE` — Conjunto de Engrenagens (didático); `sapValidated:false`
- CAT 6030: `SWAS/SWT1/REDG` — Redutor de Giro;Posição 1 (didático); `sapValidated:false`
- CAT D9: `UNCR/TRF2/GUID` — Roda-Guia;Posição 2 (didático); `sapValidated:false`

Valores de HH, custos, estoque, prazos de materiais e preços de instrumentos são exclusivamente **parâmetros do jogo**, não referencias comerciais ou especificação técnica.

## Continuidade do jogo

O fluxo `Inspeção → Notificação → Revisão PCM → OS → Mecânico` e as **seis etapas com quatro alternativas cada** foram mantidos. Os campos `verification` são verificações **propostas, não executadas**. O conteúdo de `drivetrainTraining` está reservado para aprendizagem posterior à conclusão, com hipóteses concorrentes e cuidados de execução.

Não foi implementada nesta sessão a seleção explícita de *monitorar sem intervenção*. Isso permanece importante para laudos sem evidência de dano ou que demonstrem apenas mudança de fluido, mas depende de uma mecânica própria para **não abrir OS**.

## Segurança e validação

Não utilizar estes casos para liberar freios, rodantes, transmissores ou vasos reais. Controle de energia armazenada no tensionamento de esteira, estabilização de conjuntos suspensos, bloqueio e diagnóstico dimensional requerem procedimentos específicos dos fabricantes e pessoal habilitado. Nenhum limite ou torque OEM foi inferido.

O teste `scripts/test-drivetrain-fmea-session6.cjs` valida 95 IDs, 387 caminhos (três novos não-SAP), cada etapa com quatro alternativas, materiais, ferramentas, rastreabilidade e seleção de missões. CI e deploy devem passar antes do merge.
