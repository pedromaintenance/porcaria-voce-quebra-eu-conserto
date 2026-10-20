# Sessão 7 — 100 missões e consequências progressivas (20/10/2026)

O **PORCARIA — Você Quebra, Eu Conserto** chegou a **100 cenários cadastrados**, sendo 95 missões independentes e **cinco missões progressivas acionadas condicionalmente** (`INC096`–`INC100`). As 95 missões anteriores, os 387 caminhos funcionais e os saves no formato `1.1.0` foram preservados.

## Fonte

[FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining): `data/knowledge/oil/diagnostic-records.json` v1.1.0 e `data/knowledge/diagnostic/playbooks.v1.json` v1.2.1. Esses registros são **sintéticos e didáticos**, não comprovam a falha secundária, sua ocorrência, probabilidade ou tempo de evolução em equipamento real.

**O nexo entre a demora e o dano secundário é uma escolha de design de jogo**, explicitada em `progression.causalModel:'hipotese_didatica_nao_probabilistica'`, `realConsequenceVerified:false` e `simulation.oemValidated:false`. Não usar para inferir prazos aceitáveis de operação, risco residual ou limites OEM.

## Encadeamentos

| Precursor independente | Consequência progressiva | Equipamento | Mecanismo didático |
|---|---|---|---|
| INC041: Umidade no óleo do comando final | **INC096: 777E — dano secundário no rolamento do comando final** | CAT 777E | umidade permanente no lubrificante pode acelerar desgaste |
| INC042: Poeira detectada no comando final do D9 | **INC097: D9 — desgaste abrasivo evolui para engrenagem danificada** | CAT D9 | particulado abrasivo pode acelerar desgaste de geracao secundaria |
| INC058: 395 — filtro hidráulico com restrição | **INC098: 395 — desgaste de bomba após restrição hidráulica persistente** | CAT 395 | contaminacao persistente pode levar a desgaste da bomba |
| INC076: DI650i — admissão do compressor restringida | **INC099: DI650i — compressor com eficiência reduzida após restrição** | Sandvik DI650i | operacao prolongada com restricao pode agravar condicao do compressor |
| INC094: CAT 16 — desgaste direcional por desalinhamento | **INC100: CAT 16 — pneu com desgaste irreversível após desalinhamento** | CAT 16 | desgaste acumulado nao revertido por alinhamento |

As cinco missões usam opções de sistema, grupo, subgrupo, componente, dano e causa (**quatro alternativas por etapa**) e o mesmo ativo da OS anterior. O segundo evento chega **depois que a OS original é concluída**: representa um efeito residual fictício, e não a repetição da mesma nota enquanto uma intervenção está em andamento.

## Regra funcional implementada

1. O sorteio inicial e os sorteios de novos turnos ignoram cenários marcados com `progression`; assim, **INC096–INC100 não aparecem sem gatilho**.
2. O motor contabiliza `idleShifts` apenas nos turnos em que a OS precursora está **sem mecânico alocado e sem conclusão diagnóstica** (`stage===0`). Um turno representa uma unidade de progressão do simulador, e não uma janela segura real.
3. Na **conclusão** da OS precursora, o jogo gera uma ocorrência secundária se houve: (a) **3 turnos sem equipe**, ou (b) **2 turnos sem equipe e pelo menos 2 classificações PCM incorretas** detectadas na primeira execução mecânica. Esses números são parâmetros fictícios.
4. A nova OS utiliza o **mesmo `asset` e `modelId`**, recebe novo ID e traz `chainOrigin` com a OS origem, cenário origem, turnos de atraso, erros PCM e natureza do gatilho. Um aviso explícito no log informa que é **evolução didática**.
5. Não surgem duas OS ativas para o mesmo ativo; há verificação de capacidade de 32 OS. Se o backlog já está no limite, a consequência não é criada nem armazenada para geração futura.
6. Saves anteriores que não possuíam `idleShifts` continuam utilizáveis; o contador começa em zero. O esquema e `version:'1.1.0'` não foram alterados.

**Limitações:** a mecânica atualmente é uma regra binária de atraso, **não um modelo de desgaste acumulado**, árvore probabilística ou cálculo confiável de risco. Erros PCM sem atraso não geram consequência. O jogador não executa medições físicas interativas; a hipótese final continua determinada pelo cenário fictício. Esta versão não inclui missões em que a decisão adequada é somente monitorar sem abrir OS.

## Referências individuais

| Cenário | Referência FMEA | Gabarito ficcional |
|---|---|---|
| INC096 | OIL-CASE-001 | Rolamento / Piteado / Contaminação |
| INC097 | OIL-CASE-004 | Engrenagem / Abrasado ou sulcado / Abrasão |
| INC098 | PB-EXC-PUMP-01 | Bomba, Hidráulica / Com função degradada / Contaminação |
| INC099 | PB-DRILL-DI650-COMP-01 | Compressor, Ar / Com função degradada / Desgaste |
| INC100 | PB-GRADER-TIRE-01 | Pneu / Desgastado / Desalinhamento |

O inventário adiciona apenas o componente e conjunto virtual **Compressor, Ar** / `COMA`; demais recursos já existiam. Seus custos, horas, estoque, dificuldade e lead time são parâmetros de balanceamento, não orçamento de manutenção real.

## Qualidade e cuidados

Teste `node scripts/test-progressive-fmea-session7.cjs` verifica 100 IDs, todos os campos 6×4, 95 anteriores preservados, bloqueio de sorteio de sequelas, ausência de efeito no reparo pontual, gatilho de 3 turnos, gatilho antecipado com erro PCM, mesmo ativo, rastreabilidade em `chainOrigin` e compatibilidade com OS legadas. A suíte CI/Pages deve rodar a validação com todos os testes anteriores antes do merge.

Em uso real, a operação continuada com contaminação em transmissão, circuito hidráulico, pneu OTR ou compressor exige análise específica de risco e documentação OEM. **Três turnos não são um limite técnico aceitável**, e as relações do jogo não constituem recomendações para liberação de equipamentos.
