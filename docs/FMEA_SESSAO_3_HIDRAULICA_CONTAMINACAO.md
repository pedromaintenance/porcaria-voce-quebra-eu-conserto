# Sessão 3 — Hidráulica e Contaminação · 20/10/2026

O catálogo didático passa de **55 para 65 missões** após integração, sem alterar a sequência das 55 anteriores.

## Referências efetivamente consultadas

- [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining): `data/knowledge/diagnostic/playbooks.v1.json` (roteiros candidatos; não comprovados por ensaios reais).
- `data/knowledge/oil/diagnostic-records.json` (72 situações sintéticas, sem laudos laboratoriais reais).
- A árvore de localização funcional e as classificações de dano/causa já cadastradas em `game-data.json`.

**Atenção:** os playbooks e análises de óleo do FMEA Database **não homologam** os gabaritos escolhidos pelo jogo. Fontes originalmente associadas a CAT 777, CAT 980 ou DR410i foram extrapoladas quando aplicadas respectivamente a CAT 6030, CAT 966 ou DI650i; nenhum vínculo OEM/SAP foi validado. Os casos sem `recordId` são **elaborações autorais para gameplay**, não falhas extraídas do banco.

## Missões criadas

| ID | Modelo | Situação | Fonte | Gabarito fictício |
|---|---|---|---|---|
| INC056 | CAT 395 | 395 — alimentação hidráulica estrangulada | PB-EXC-PUMP-01 | Mangueira / Colapsado ou esmagado / Bloqueio ou restrição |
| INC057 | CAT 395 | 395 — vazamento na conexão junto à bomba | PB-EXC-PUMP-01 | Conexão, Mangueira / Vazando / Conexão frouxa |
| INC058 | CAT 395 | 395 — filtro hidráulico com restrição | PB-EXC-PUMP-01 | Filtro, Hidráulico / Entupido ou restringido / Contaminação |
| INC059 | CAT 966 | 966 — cilindro de elevação com fuga externa | PB-LOADER-CYL-01 | Vedação / Vazando / Falha de vedação |
| INC060 | CAT 966 | 966 — direção pesada com bomba desgastada | Elaboração autoral | Bomba, Hidráulica / Com função degradada / Desgaste |
| INC061 | CAT 6030 | 6030 — válvula principal presa por partículas | OIL-CASE-043 | Válvula, Hidráulica / Travado / Contaminação |
| INC062 | CAT 6030 | 6030 — troca térmica hidráulica prejudicada | Elaboração autoral | Trocador de Calor / Entupido ou restringido / Material estranho |
| INC063 | Sandvik DR410i | DR410i — retorno hidráulico com restrição | Elaboração autoral | Filtro, Hidráulico / Entupido ou restringido / Material estranho |
| INC064 | Sandvik DI650i | DI650i — pulldown perde torque hidráulico | PB-DRILL-DR410-FEED-01 | Motor, Hidráulico / Com função degradada / Desgaste |
| INC065 | CAT 777E | 777E — metais e falha na bomba dos freios | OIL-CASE-046 | Bomba, Hidráulica / Desgastado / Contaminação |

## Objetivos de ensino

- `INC056` vs. `INC057`: movimentos lentos e óleo perto de bomba **não demonstram avaria da bomba**. Diferenciar estrangulamento de sucção e vazamento em conexão.
- `INC058` e `INC063`: confirmar circuito real de filtragem, resultado de indicador/diferencial e origem das partículas; não presumir que troca isolada do filtro corrige o mecanismo gerador.
- `INC059` vs. `INC044` anterior: distinguir fuga **externa** pela vedação da haste de **deriva interna** do implemento. A CAT 980 do playbook não equivale a comprovação CAT 966.
- `INC060`: direção de carregadeira — vazão/pressão, perda de eficiência, hipóteses de bomba e risco de liberação.
- `INC061`: partículas no óleo justificam investigação de válvula, não condenação instantânea.
- `INC062`: temperatura alta pode vir de sujidade externa, ventilação, fluxo ou leitura. Não atribuir diretamente a uma bomba.
- `INC064`: o pulldown pode perder desempenho por resistência mecânica, desajuste ou fuga interna de motor hidráulico; requer ensaios da configuração real.
- `INC065`: partículas e resposta irregular dos freios exigem **isolamento de risco antes de continuar operando**; o cenário confirma virtualmente uma bomba danificada, sem qualquer atestado de campo.

## Mudanças no catálogo

Novos nomes para classificação: **Bomba, Hidráulica; Válvula, Hidráulica; Trocador de Calor; Motor, Hidráulico**.

Novos materiais virtuais: `FILH` (elemento de filtro hidráulico), `BOMH` (bomba), `VALH` (válvula) e `MOTH` (motor hidráulico). Novas ferramentas: `VACU` (diagnóstico de sucção) e `PDIF` (diferencial de pressão).

Os dois caminhos adicionais de filtração foram marcados **`origin:'trilha_didatica_simulada'` e `sapValidated:false`**, e não devem ser tratados como localização funcional SAP:

- CAT 395: `HYSY/FISY/FILH` (Filtro de Retorno Hidráulico)
- Sandvik DR410i: `HYSY/FISY/FILH` (Filtro Hidráulico)

**Custos, estoque, prazos de entrega, dificuldade e HH são exclusivamente parâmetros de game design**; não representam lista de sobressalentes, plano OEM ou orçamento de manutenção.

## Comportamento preservado

Os 10 novos casos usam o sorteio normal de missões e o fluxo `Inspeção → Notificação → Revisão PCM → OS → Mecânico` já implementado. Sistema, Grupo, Subgrupo, Componente, Dano e Causa usam seis conjuntos de opções com quatro alternativas; Causa continua opcional no planejamento. Sem gabarito prévio, as consequências continuam ocorrendo uma vez no início do serviço.

`hydraulicTraining` registra mecanismos, hipóteses concorrentes e verificações propostas, mas **não é evidência física produzida por testes executados**. A expansão de investigação interativa por resultados favoráveis, desfavoráveis e inconclusivos permanece como evolução futura.

## Verificação

`node scripts/test-hydraulic-fmea-session3.cjs`: 65 IDs únicos, seis etapas × quatro opções, integridade dos 55 casos anteriores, recursos, rastreabilidade de fonte, flag OEM/SAP, entrada no sorteio. A suíte completa de Phaser e recrutamento continua obrigatória antes do merge.
