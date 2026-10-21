# P.O.R.C.A.R.I.A. — Ciclo 12 | Preventiva versus corretiva (v0.9.15)

## Delimitação técnica
O jogo tem 124 missões FMEA, cujo diagnóstico de seis etapas e gabarito não devem ser expostos previamente. A intervenção preventiva é planejada por **ativo físico fictício** (por exemplo EQ01·01), não por causa do cenário. Não é reparo de uma OS aberta nem comprova condição de máquina real. Não há predição OEM, dado SAP, taxa de falha validada ou estimativa real de RCM.

## Pacotes do jogo
| Pacote | HH do turno | Custo do caixa | Redução da chance de ocorrência aleatória | Duração |
|---|---:|---:|---:|---:|
| Inspeção preventiva | 2 HH | R$ 120 | 25% | 4 turnos posteriores |
| Serviço preventivo | 4 HH | R$ 360 | 45% | 8 turnos posteriores |

Estes números são **parâmetros fictícios de balanceamento**, configuráveis no objeto \`PACKAGES\` em \`phaser-play/preventive.js\`. Mesmo com cobertura ativa, a ocorrência ainda é possível. A lógica de redução atua somente nos **sorteios de novas ocorrências aleatórias**, não nos danos progressivos definidos para consequências mecânicas, notificações originadas de inspeção nem em OS já existentes.

## Sequência material e econômica
1. Jogador escolhe ativo livre de OS, profissional disponível, box e pacote em **Planejamento → Preventiva × Corretiva**.
2. O motor valida recursos, sobreposição com programação PCM do turno, inspeções, treinamentos, descanso, ferramentas e caixa. O custo é debitado na autorização.
3. A reserva pode ser cancelada antes do avanço do turno; nesse caso, o valor integral retorna ao caixa. Após a execução não existe reembolso.
4. No fechamento do turno, a preventiva consome 2 ou 4 HH de atividade, afeta a energia do profissional pelas regras de produtividade vigentes, grava o serviço executado e inicia a janela de proteção.
5. A oficina gera ocorrências aleatórias no fechamento dos dias. Para o ativo sorteado com cobertura ainda válida, um teste independente pode rejeitar o evento com probabilidade de 25% ou 45%. Isto **não redistribui** automaticamente a ocorrência para outra máquina, de forma que a decisão de priorizar preventivas tem oportunidade real no jogo.
6. O contador \`screenedRandomCandidates\` mede **sorteios sintéticos recusados pelo motor**. Não é quantidade de falhas físicas evitadas, nem tempo de indisponibilidade ou dinheiro economizado.
7. Ações autorizadas, canceladas e executadas ficam no Histórico de Decisões PCM. Nenhuma compra, serviço ou OS é criado automaticamente por causa de uma preventiva.

## Arquitetura e persistência
- \`phaser-play/preventive.js\`: validação, reservas, benefícios temporários e leitura pura do painel.
- \`engine.js\`: proteção na geração aleatória; disputa de box e mecânico com OS e calendário; apropriação de HH, custo e auditoria.
- \`phaser-play/game.js\`: tela de autorização e cancelamento, estado dos ativos e histórico.
- \`state.preventiveJobs[]\`, \`preventiveEffects[]\`, \`preventiveMetrics\`, \`nextPreventive\`: campos opcionais para saves antigos, com retenção limitada para históricos.

## Riscos e homologação
- Os custos e probabilidades não são comparáveis a custos reais de oficina ou curvas de confiabilidade OEM.
- A janela não representa manutenção baseada em condição de componentes; isso exigiria horímetros, lubrificação, histórico e dados de falha reais.
- A validação automática verifica invariantes do motor, comportamento probabilístico determinístico com RNG controlado, conflito de recursos, caixa, HH e compatibilidade. Homologação visual mobile/desktop e campanhas longas ficam pendentes.
