# Sessão 4 — Motores diesel e análise de óleo · 20/10/2026

O catálogo do jogo **PORCARIA — Você Quebra, Eu Conserto** foi expandido de **65 para 75 missões** (`INC066` a `INC075`), sem alterar o conteúdo das 65 anteriores.

## Referências consultadas

- [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining): `data/knowledge/diagnostic/playbooks.v1.json` (hipóteses sobre combustível, lubrificação e arrefecimento).
- `data/knowledge/oil/diagnostic-records.json` (registros sintéticos de análise de fluidos; **não** são laudos de campo).
- `data/knowledge/electronic/diagnostic-records.json` (casos eletrônicos simulados, incluindo pressão do cárter sem identificação de causa específica).
- O catálogo de caminhos, danos e causas já existente no `game-data.json`.

**Escopo da evidência:** os registros FMEA citados são *didáticos*, não comprovam modos de falha em um equipamento real da frota e não substituem documentação OEM, ensaio, amostra ou inspeção. Onde a fonte apenas cita o sintoma ou uma hipótese, o desfecho técnico foi criado para o jogo. Missões sem `recordId` são **elaborações autorais**, não evidências tiradas da base. Custos e HH são exclusivamente valores para balanceamento do jogo.

## Missões adicionadas

| ID | Máquina | Relato / foco de aprendizagem | Origem | Resolução fictícia |
|---|---|---|---|---|
| INC066 | CAT 777E | 777E — falta de potência por filtro de combustível | PB-TRUCK-FUEL-01 | Filtro, Combustível / Entupido ou restringido / Contaminação |
| INC067 | CAT 777E | 777E — alerta de combustível com pressão normal | PB-TRUCK-FUEL-01 | Sensor, Pressão / Indicado incorretamente / Falha de instrumento |
| INC068 | CAT 6030 | 6030 — metais no óleo do motor diesel 1 | OIL-CASE-049 | Filtro, Óleo / Contaminado / Contaminação |
| INC069 | CAT 395 | 395 — desgaste metálico no óleo e revisão do filtro | OIL-CASE-052 | Filtro, Óleo / Contaminado / Contaminação |
| INC070 | CAT 336GC | 336GC — admissão de ar com restrição | Elaboração autoral | Filtro, Ar / Entupido ou restringido / Material estranho |
| INC071 | CAT 6030 | 6030 — aquecimento por radiador obstruído | PB-SHOVEL-COOL-01 | Radiador / Entupido ou restringido / Material estranho |
| INC072 | CAT 777E | 777E — concentração incorreta do arrefecimento | OIL-CASE-061 | Líquido, Arrefecimento / Contaminado / Fluido ou lubrificante incorreto |
| INC073 | CAT D9 | D9 — ventilação insuficiente por acionamento hidráulico | Elaboração autoral | Motor, Hidráulico / Com função degradada / Desgaste |
| INC074 | CAT 966 | 966 — ar de admissão escapando pela mangueira | Elaboração autoral | Mangueira / Rompido / Abrasão |
| INC075 | CAT 16 | CAT 16 — pressão do cárter anormal | ELEC-CF-19-1 | Respiro, Cárter / Entupido ou restringido / Contaminação |

## Lógica de diagnóstico

- **INC066–INC067:** mesma perda de potência pode representar restrição de combustível ou indicação falsa. Testar grandeza física antes de condenar filtro, sensor ou bomba.
- **INC068–INC069:** metais no óleo exigem análise de tendência e amostra representativa; uma inspeção interna de filtro só é válida quando removido em condição segura e **o elemento removido não deve ser reinstalado**. No jogo, `OLMO` representa a troca conjunta fictícia de óleo e filtro, com investigação de origem dos metais ainda aberta. Nenhum mancal ou engrenagem foi condenado automaticamente.
- **INC070 e INC074:** admissão de ar com filtro restrito versus mangueira de admissão rompida. Não diagnosticar um pelo simples relato de perda de potência.
- **INC071 e INC073:** aquecimento por colmeia obstruída versus problema no acionamento do ventilador. O caso do D9 é ficção autoral com motor hidráulico: **verificar arquitetura de série e OEM antes de alegar aplicabilidade real**.
- **INC072:** composição do arrefecimento incompatível com referência requer revisão de especificação e mistura, e não remontagem desnecessária do motor.
- **INC075:** evento genérico de pressão de cárter não confirma `blow-by` nem respiro bloqueado; o gabarito desse cenário resolve virtualmente o respiro, sem atribuir o código da fonte à CAT 16.

## Recursos e delimitações

Novas classes do catálogo: `Filtro, Combustível`, `Líquido, Arrefecimento`, `Respiro, Cárter`. Materiais virtuais: `FILC`, `OLMO`, `ARRF`, `RESC`. Ferramenta adicional: `REFR` (refratômetro).

Foram acrescentados quatro caminhos funcionais **somente para jogabilidade**, marcados `origin:'trilha_didatica_simulada'` e `sapValidated:false`:

- CAT 777E: `ENSY/FUSY/FILF` — Filtro de Combustível
- CAT 777E: `ENSY/FUSY/SENF` — Sensor de Alimentação de Combustível
- CAT 777E: `ENSY/COSY/CLFL` — Líquido de Arrefecimento
- CAT 16: `ENSY/ENGN/CCBR` — Sistema de Respiro do Cárter

**Esses caminhos não são um cadastro SAP nem estrutura homologada pelos OEMs.** Dano/componente/causa não foram validados como combinação de peça real; `sourcePartMatch:false` e `oemValidated:false` permanecem explícitos.

## Funcionamento, riscos e evolução pendente

Todas as dez novas missões usam o fluxo padrão `Inspeção → Notificação → Revisão PCM → OS → Mecânico` e seis campos de hipóteses, com quatro alternativas cada. O planejamento não exibe confirmação de acerto antecipada.

O motor de gameplay exige uma ação/ordem para cada missão. Por isso, **casos de mera tendência normal, mudança documentada de formulação ou monitoramento sem manutenção não foram adicionados**; precisam de caminho específico para decidir `não intervir` ou `continuar monitorando` sem gerar OS fictícia. O modelo também ainda não reproduz coleta, análise e ensaio como ações interativas com evidência positiva/negativa/inconclusiva.

Ações nos sistemas de combustível de alta pressão, motor quente, ventiladores, amostras e óleo demandam bloqueio e procedimentos do fabricante na oficina real. Em nenhum caso os valores fictícios devem ser usados como critérios de retorno à operação.

## Regressões

`node scripts/test-diesel-oil-fmea-session4.cjs` verifica as dez missões, fontes, 75 IDs únicos, 382 caminhos, 6×4 opções, materiais, ferramentas, seleção aleatória e preservação das 65 missões. CI de PR e deploy devem executar junto com os testes legados.
