# Catálogo de Análises de Óleo e Fluidos — Expansão v2

**PORCARIA v0.9.5 | ciclo 2 da carteira de Monitoramento de Condição.**

Este documento distingue **famílias de sinais apoiadas na literatura do fabricante** de **situações e evoluções criadas para a jogabilidade**. Nenhum laudo do jogo representa uma amostra real, uma medição confirmada ou um limite de condenação OEM.

## Referências técnicas e limites da interpretação

Fontes primárias consultadas (documentação pública Caterpillar):
- **CAT_SOS_RESULTADOS**: https://www.cat.com/en_US/support/maintenance/sos-services/take-sample.html
- **CAT_SOS_CAPACIDADES**: https://www.cat.com/en_US/support/maintenance/sos-services/analysis-101.html
- **CAT_SOS_AMOSTRAGEM**: https://www.cat.com/en_US/blog/take-drive-train-samples.html
- **CAT_OLEOS**: https://www.cat.com/en_US/campaigns/awareness/filters-and-fluids/fluids/oils.html
- **CAT_DRIVETRAIN**: https://www.cat.com/en_US/blog/drivetrain-repairs-preventive-maintenance.html

A Caterpillar descreve análise de fluidos para desgaste (Fe, Cu, Al, Pb, Cr), contaminação (água, combustível, glicol, particulado, silício), degradação (viscosidade, oxidação, fuligem) e identificação de produto por aditivos. A amostra representativa, o ponto de coleta e o histórico são determinantes. Esses princípios inspiram a seleção dos sintomas, mas **não respaldam as sequências 'estável/agravamento' inventadas para o jogo**.

A mudança conhecida de lubrificante não autoriza automaticamente classificar aditivos diferentes como defeito. No caso OIL024, confirmar produto homologado para aquele compartimento e comparar novo baseline. A linha FDAO da Caterpillar é uma família para comandos finais/eixos, mas a compatibilidade de produto/grau depende da configuração e orientação aplicável; o jogo não define óleo correto da máquina.

Não transferir limites numéricos ou intervalos de outro modelo de motor para os equipamentos simulados. Prioridade de avaliação no jogo é uma regra de segurança e jogabilidade, não autorização para operação real.

## Contrato de dados v2

- `OIL001–OIL008`: IDs anteriores preservados; recebem metadados de compartimento, indicadores, incerteza, verificação e fontes.
- `OIL009–OIL024`: 16 novos casos com mesma estrutura, sem mexer nas missões históricas.
- Metadados: `compartment`, `indicators[]`, `verification`, `uncertainty`, `sourceKeys[]`, `triage` (acompanhar, revisar_baseline, avaliacao_prioritaria).
- Novas ocorrências continuam chegando por turno; sem sorteios arbitrários de valor de metal ou referência de medição.
- `triage=avaliacao_prioritaria` cria sinal com prioridade alta, **não permite adiar via monitoramento** e disponibiliza encaminhamento direto ao PCM. Mantém julgamento técnico separado de uma OS.
- `escalationScenario` é um roteiro existente **compatível para investigação**, jamais conclusão da causa; quando não existe, fica `null`, e o PCM não autoriza conversão em OS até existir roteiro curado.
- As séries `results[]` são desfechos qualitativos de game design. Nenhuma tem compromisso com probabilidade, vida residual, intervalos OEM ou dinâmica real de contaminação.

## Índice dos 24 casos de análise de fluidos

| ID | Equipamento | Compartimento | Sintoma | Investigação ligada | Triagem |
|---|---|---|---|---|---|
| OIL001 | EQ01 | Comando final (posição 1) | Comando final: presença de água ou emulsão no lubrificante | INC041 | acompanhar |
| OIL002 | EQ07 | Comando final (posição 2) | Comando final: silício e alumínio em elevação | INC042 | acompanhar |
| OIL003 | EQ01 | Diferencial | Diferencial: crescimento de metais de desgaste | INC043 | acompanhar |
| OIL004 | EQ02 | Sistema hidráulico | Sistema hidráulico: contaminação por partículas | INC061 | acompanhar |
| OIL005 | EQ02 | Motor diesel (posição 1) | Motor diesel: metais acima da tendência histórica | INC068 | acompanhar |
| OIL006 | EQ08 | Diferencial dianteiro | Diferencial dianteiro: indício de contaminante ambiental | INC092 | acompanhar |
| OIL007 | EQ09 | Transmissão/tandem | Transmissão/tandem: partículas acima do histórico | INC093 | acompanhar |
| OIL008 | EQ01 | Circuito de arrefecimento | Arrefecimento: concentração do fluido incompatível com referência | INC072 | acompanhar |
| OIL009 | EQ03 | Motor diesel | Motor diesel: ferro e cobre com tendência crescente | INC069 | acompanhar |
| OIL010 | EQ01 | Circuito hidráulico dos freios | Freios hidráulicos: partículas ferrosas em elevação | INC065 | acompanhar |
| OIL011 | EQ02 | Redutor de giro | Redutor de giro: ferro crescente e ruído intermitente | INC089 | acompanhar |
| OIL012 | EQ01 | Transmissão | Transmissão: aumento de metais associado a vibração | INC088 | acompanhar |
| OIL013 | EQ07 | Comando final (posição 2) | Comando final: abrasivos recorrentes após contaminação | INC042 | acompanhar |
| OIL014 | EQ01 | Diferencial do eixo motriz | Diferencial: metais de desgaste e vibração sob carga | INC043 | acompanhar |
| OIL015 | EQ08 | Diferencial dianteiro | Diferencial dianteiro: silício e partículas ambientais | INC092 | acompanhar |
| OIL016 | EQ02 | Motor diesel (posição 1) | Motor diesel: metais elevados com troca de filtro próxima | INC068 | acompanhar |
| OIL017 | EQ01 | Comando final (posição 1) | Comando final: umidade residual e ruído após correção | INC096 | avaliacao_prioritaria |
| OIL018 | EQ07 | Comando final (posição 2) | Comando final: partículas após intervenção em vedação | INC097 | acompanhar |
| OIL019 | EQ02 | Sistema hidráulico de implementos | Sistema hidráulico: partículas crescentes e resposta irregular | INC061 | acompanhar |
| OIL020 | EQ09 | Conjunto tandem/transmissão | Tandem: tendência de Fe e partículas com ruído novo | INC093 | acompanhar |
| OIL021 | EQ03 | Óleo do motor diesel | Motor diesel: viscosidade reduzida e suspeita de combustível | Sem roteiro | acompanhar |
| OIL022 | EQ01 | Óleo do motor diesel | Motor diesel: fuligem e oxidação em elevação | Sem roteiro | acompanhar |
| OIL023 | EQ02 | Óleo do motor diesel | Motor diesel: suspeita de líquido de arrefecimento no óleo | Sem roteiro | avaliacao_prioritaria |
| OIL024 | EQ01 | Comando final | Comando final: aditivos alterados após troca declarada de óleo | Sem roteiro | revisar_baseline |

### Casos que exigem atenção de design

- **OIL017 (777E):** umidade/ruído após intervenção de vedação, com roteiro `INC096`, pode ser encaminhado diretamente para triagem PCM; o sintoma não antecipa rolamento danificado.
- **OIL023 (6030):** suspeita de entrada de arrefecimento no óleo do motor; encaminhamento prioritário, sem roteiro de causa fechado. A nota PCM fica marcada com `requiresScenarioMapping`, impedindo criação de OS até curadoria de um roteiro apropriado.
- **OIL024 (777E):** mudança declarada de formulação/aditivos sem outros indícios; revisar produto e baseline. Duas verificações estáveis podem permitir encerramento sem OS, conforme regra de jogo.
- **OIL021 e OIL022:** diluição de combustível/condição de óleo; sem correspondência exata na carteira de missões existentes. É possível monitorar e escalar a nota, mas não fabricar um diagnóstico para permitir conversão.

## QA e próximos ciclos

Regressões: `scripts/test-oil-catalog-v2.cjs` + `scripts/test-condition-catalog.cjs` + sessão anterior de monitoramento, todas incluídas nos workflows CI e Pages. Verificar visualmente a legibilidade do dossiê e a posição das ações em desktop/mobile.

**Próximo ciclo sugerido:** incorporar códigos de falha reais com registro de fonte, efeito no sistema, condição de disparo e hipóteses concorrentes, sem inventar SPN/FMI/CID/MID. A curadoria de códigos exatos requer documentação por máquina e módulo.

Observação de escopo: dados técnicos são referenciais qualitativos; textos e valores numéricos de tendência não foram extraídos de laudos reais.
