# Missões FMEA de FPS/GET — ciclo 7 (v0.9.10)

**Escopo:** 24 missões novas (`INC101–INC124`), cada uma vinculada a uma ocorrência FPS (`FPS005–FPS028`), preservando 100 missões anteriores. O total de missões FMEA passa a **124** e os caminhos didáticos de instalação passam a **403** (387 anteriores + 16 caminhos de FPS).

## Critério técnico e limitações

FPS é Ferramentas de Penetração no Solo (Ground Engaging Tools / GET). As famílias e inspeções são inspiradas nas orientações gerais de Caterpillar e Sotreq, descritas em [Catálogo FPS/GET v6](CATALOGO_FPS_GET_V6.md).

**Estes casos são roteiros FMEA de treinamento, não laudos reais.** A escolha de componente, dano e causa no banco é um **gabarito fictício para o jogo**, não confirmação física nem indicação de substituição. A causa poderá permanecer indefinida pelo jogador no PCM. Não existem códigos SAP, P/N, vida residual, limites de descarte ou torques OEM validados.

As 16 novas posições foram criadas como **locais didáticos** com `origin=trilha_didatica_fps` e `sapValidated=false`. Não replicam automaticamente a hierarquia técnica real do SAP da mina. O próximo ciclo de homologação precisa confirmar os arranjos e os locais reais por série de equipamento.

Os oito itens novos de estoque (FPTP, FPRT, FPAD, FPPR, FPBR, FPPL, FPSO, FPFX) e quatro ferramentas de jogo (INSP, METR, TORQ, ENDP) possuem preços e prazos **inventados para balanceamento**, sem correspondência garantida com códigos comerciais.

## Fluxo executável

1. A condição de FPS chega ao Monitoramento, sem abrir OS.
2. Para condições críticas de retenção, perda ou suspeita de trinca, o jogo oferece encaminhamento direto à revisão PCM. Outras condições permitem acompanhar, verificar e escalar.
3. O escalonamento cria notificação com o cenário FMEA correspondente, ainda **sem OS**.
4. O PCM deve escolher hipóteses das cinco dimensões obrigatórias: Sistema, Grupo, Subgrupo, Componente e Dano. **Causa é opcional.** A interface não informa acerto/erro durante a revisão.
5. O PCM aprova estratégia, disciplina, HH e escopo. Só depois a ação explícita **criar OS** habilita a ordem na fila de planejamento.
6. O jogo conserva revisão, notificação de origem, hipóteses, ferramenta e material, mas não autoriza aplicar procedimento real sem documento OEM.

## Índice das missões

| Missão | Sintoma | Equipamento | Componente | Dano hipotético | Causa hipotética | Material | Ferramenta | 
|---|---|---|---|---|---|---|---|
| INC101 | FPS005 | CAT 6030 | Ponta FPS | Desgastado | Abrasão | FPTP | METR |
| INC102 | FPS006 | CAT 6030 | Ponta FPS | Ausente | Fixação incorreta | FPTP | INSP |
| INC103 | FPS007 | CAT 6030 | Retentor FPS | Afrouxado | Desgaste | FPRT | TORQ |
| INC104 | FPS008 | CAT 6030 | Adaptador FPS | Desgastado | Abrasão | FPAD | METR |
| INC105 | FPS009 | CAT 6030 | Adaptador FPS | Trincado | Fadiga | FPAD | ENDP |
| INC106 | FPS010 | CAT 6030 | Protetor FPS | Desgastado | Abrasão | FPPR | INSP |
| INC107 | FPS011 | CAT 6030 | Protetor FPS | Desgastado | Abrasão | FPPR | INSP |
| INC108 | FPS012 | CAT 6030 | Borda cortante FPS | Desgastado | Abrasão | FPBR | METR |
| INC109 | FPS013 | CAT 6030 | Solda do adaptador FPS | Trincado | Fadiga | FPSO | ENDP |
| INC110 | FPS014 | CAT 6030 | Ponta FPS | Desgastado | Abrasão | FPTP | METR |
| INC111 | FPS015 | CAT 6030 | Retentor FPS | Afrouxado | Desgaste | FPRT | TORQ |
| INC112 | FPS016 | CAT 6030 | Placa de desgaste FPS | Afrouxado | Fadiga | FPPL | INSP |
| INC113 | FPS017 | CAT 395 | Ponta FPS | Desgastado | Abrasão | FPTP | METR |
| INC114 | FPS018 | CAT 395 | Adaptador FPS | Trincado | Fadiga | FPAD | ENDP |
| INC115 | FPS019 | CAT 395 | Retentor FPS | Afrouxado | Desgaste | FPRT | TORQ |
| INC116 | FPS020 | CAT 395 | Adaptador FPS | Desgastado | Abrasão | FPAD | METR |
| INC117 | FPS021 | CAT 395 | Protetor FPS | Ausente | Fixação incorreta | FPPR | INSP |
| INC118 | FPS022 | CAT 395 | Placa de desgaste FPS | Desgastado | Abrasão | FPPL | METR |
| INC119 | FPS023 | CAT 395 | Solda do adaptador FPS | Trincado | Fadiga | FPSO | ENDP |
| INC120 | FPS024 | CAT 395 | Perfil de ponta FPS | Com função degradada | Aplicação incorreta de componente ou material | FPTP | INSP |
| INC121 | FPS025 | CAT 966 | Borda cortante FPS | Desgastado | Abrasão | FPBR | METR |
| INC122 | FPS026 | CAT 966 | Retentor FPS | Afrouxado | Desgaste | FPRT | TORQ |
| INC123 | FPS027 | CAT D9 | Borda cortante FPS | Desgastado | Abrasão | FPBR | METR |
| INC124 | FPS028 | CAT D9 | Fixador de borda FPS | Ausente | Fixação incorreta | FPFX | TORQ |

## Guardas e validações

- Notificação de monitoramento não cria OS automaticamente.
- A revisão exige diagnóstico FPS de cinco dimensões; causa pode ficar sem resposta.
- A criação de OS exige aprovação PCM, limite de carteira disponível e ausência de duplicidade por ativo.
- Todo roteiro segue `fmeaSource.status=roteiro_fps_didatico_pendente_revisao_OEM`, `simulation.oemValidated=false` e `sourcePartMatch=false`.
- O percurso completo foi coberto em `scripts/test-fps-fmea-session10.cjs`: recebimento, prioridade, PCM, diagnóstico, planejamento e OS.
- As 100 missões antigas, as 120 condições recebíveis e os quatro FPS legados (somente saves) permanecem preservados.

## Pendências de próxima iteração

- Validar configuração de FPS instalada por equipamento: modelo/arranjo/série de ponta, adaptador, retenção, proteções e lâmina.
- Confirmar códigos SAP, Parts Numbers, torques, referências dimensionais e estratégias de estoque com OEM e catálogo interno.
- Homologar visual em desktop/mobile e balancear frequência, dificuldade, recursos e impactos dos cenários numa partida real.
