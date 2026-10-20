# Sessão 5 — Perfuratrizes e sistemas pneumáticos · 20/10/2026

**Catálogo: 75 → 85 missões** (`INC076`–`INC085`). Preservadas as 75 anteriores.

## Fonte e rastreabilidade

Base consultada: [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining), especialmente `data/knowledge/diagnostic/playbooks.v1.json`, versão 1.2.1. Existem dois roteiros aplicáveis como **referências conceituais**, não como diagnóstico real:

- `PB-DRILL-DI650-COMP-01`: DI650i, ar insuficiente; hipóteses de restrição de filtro, perda pneumática e falha de compressor/controle.
- `PB-DRILL-DR410-FEED-01`: DR410i, avanço irregular; hipóteses de desgaste/tensão de corrente, guiamento e resposta hidráulica/controle.

**Restrições:** os playbooks são hipóteses didáticas, sem testes executados, número de peça confirmado, limites OEM, identificação de variante ou correspondência SAP homologada. Casos baseados em um playbook de *outra máquina* devem ser interpretados apenas como analogias mecânicas (`INC080`, `INC081`, `INC082`). Os casos `INC078`, `INC084` e `INC085` são **elaborações autorais**, não oriundos de evidência específica FMEA. O desfecho de todas as missões é **ficção de gameplay**.

## Missões

| ID | Máquina | Contexto didático | Origem conceitual | Resposta simulada |
|---|---|---|---|---|
| INC076 | Sandvik DI650i | DI650i — admissão do compressor restringida | PB-DRILL-DI650-COMP-01 | Filtro, Ar; Entupido ou restringido; Contaminação |
| INC077 | Sandvik DI650i | DI650i — perda de ar na mangueira do compressor | PB-DRILL-DI650-COMP-01 | Mangueira; Vazando; Abrasão |
| INC078 | Sandvik DI650i | DI650i — ar de descarga aquecido por restrição térmica | Elaboração autoral | Trocador de Calor; Entupido ou restringido; Material estranho |
| INC079 | Sandvik DI650i | DI650i — perda na interface do vaso de ar | PB-DRILL-DI650-COMP-01 | Vedação Junta O-ring; Vazando; Falha de vedação |
| INC080 | Sandvik DI650i | DI650i — corrente de avanço com alongamento | PB-DRILL-DR410-FEED-01 | Corrente; Alongado; Desgaste |
| INC081 | Sandvik DR410i | DR410i — válvula do compressor sem atuação regular | PB-DRILL-DI650-COMP-01 | Válvula, Pneumática; Travado; Contaminação |
| INC082 | Sandvik DR410i | DR410i — mangueira de ar danificada por contato | PB-DRILL-DI650-COMP-01 | Mangueira; Abrasado ou sulcado; Abrasão |
| INC083 | Sandvik DR410i | DR410i — pulldown perde força com aquecimento | PB-DRILL-DR410-FEED-01 | Vedação; Com função degradada; Desgaste |
| INC084 | Sandvik DR410i | DR410i — rotação irregular da cabeça | Elaboração autoral | Motor, Hidráulico; Com função degradada; Desgaste |
| INC085 | Sandvik DR410i | DR410i — ventilação do compressor com ruído crescente | Elaboração autoral | Rolamento; Desgastado; Lubrificação insuficiente |

## Diagnóstico diferencial e ensino

- **INC076, INC077, INC079, INC081:** baixa pressão de ar pode vir de filtro, fuga em linha, vedação do vaso ou comando de carga. É necessário validar grandeza real e circuito antes de trocar o compressor inteiro.
- **INC078 e INC085:** ar quente pode decorrer de resfriador obstruído ou redução de ventilação. Verificar trocador, comando e ventilador; o rolamento utilizado no último gabarito não está confirmado no hardware OEM.
- **INC080 e INC083:** avanço com trancos ou perda de força exige separar corrente, guias, hidráulica e sensores. Não atribuir um sistema da DR410i à DI650i sem confirmar a arquitetura.
- **INC084:** variação de rotação do cabeçote exige distinguir carga de perfuração, alimentação hidráulica, motor e transmissão.
- **INC082:** abrasão de mangueira do compressor pode evoluir para fuga; eliminar interferência é parte do reparo, não apenas trocar o componente.

## Recursos introduzidos

- Nova classe de componente **Válvula, Pneumática**.
- Dois materiais virtuais: `VALP` (conjunto de válvula pneumática) e `AIRT` (kit de vedação do circuito de ar).
- Ferramenta virtual `PNEU`: kit de diagnóstico pneumático (independente do código `PNEU` já utilizado para um material de pneu OTR).
- Dois caminhos funcionais adicionais, exclusivos do jogo e não homologados no SAP:

- Sandvik DI650i: `AISY/COMR/INFL` — Filtragem da Admissão de Ar (`sapValidated:false`)
- Sandvik DI650i: `AISY/COMR/HSVV` — Mangueiras / Conexões Pneumáticas (`sapValidated:false`)

Custos, estoque, lead time, HH e ferramenta são parâmetros de balanceamento, não especificações Sandvik.

## Segurança

Os procedimentos descritos em `verification` são **propostas não executadas**. Para qualquer intervenção em ar comprimido e vasos de pressão, controlar energia armazenada e confirmar despressurização conforme fabricante e requisitos aplicáveis. A hipótese de dano no corpo do vaso não pode ser reparada como se fosse simples troca de vedação. Mastro, guias, correntes, pulldown e rotação precisam de bloqueio e sustentação segura. Não incluir valores arbitrários de pressão, temperatura ou torque como critérios OEM.

## Contrato com o jogo

Mantido o fluxo `Inspeção → Notificação → Revisão PCM → OS → Alocação → Execução` e as seis escolhas por missão (quatro alternativas por etapa). `drillTraining` registra hipóteses concorrentes e precauções, com `releasePolicy:'restrito_ao_instrutor_ate_conclusao'`. O gabarito é determinístico e **não constitui resultado de testes efetuados pelo jogador**.

O modo de investigação com ações interativas e evidências discriminantes ainda não foi construído. O teste `node scripts/test-drill-pneumatic-fmea-session5.cjs` verifica os 85 casos, a rastreabilidade das dez novas missões e a estabilidade do contrato do jogo. Integração depende da CI e do deploy.

