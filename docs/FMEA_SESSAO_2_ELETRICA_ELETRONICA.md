# Sessão 2 — Elétrica e eletrônica: 10 novas missões (20/10/2026)

**Resultado:** o catálogo do PORCARIA passa de **45 para 55 missões**, mantendo intactas as anteriores `INC001`–`INC045`.

## Base consultada

[FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining), arquivo `data/knowledge/electronic/diagnostic-records.json`, com biblioteca de diagnósticos didáticos derivada do simulador [Códigos de Falha](https://github.com/pedromaintenance/porcaria-codigos-de-falha). O banco diferencia, para o mesmo sintoma/código ilustrativo, conectores, chicotes, sensores, solenoides e falhas de rede.

**Limite da evidência:** os 72 registros eletrônicos são cenários simulados, não ocorrências comprovadas em máquinas, FMEA homologada, literatura de execução OEM ou confirmação de que um MID/CID/FMI se aplique a modelo, ECM ou versão. Nenhuma medição numérica foi importada. `electronicTraining.exampleCode` guarda o código de **referência da fonte**, acompanhado de `codeApplicableToModel:false`; ele não aparece nos relatos de operadores como identificação validada. As evidências textuais são simulações **não executadas**.

## Missões integradas

| ID | Máquina | Missão | Fonte (caso didático) | Peça/dano/causa do gabarito fictício |
| --- | --- | --- | --- | --- |
| INC046 | CAT 777E | Alimentação auxiliar intermitente — conector | ELEC-CF-01-1 | Conector, Elétrica / Operando intermitentemente / Corrosão |
| INC047 | CAT 777E | Alimentação auxiliar intermitente — chicote | ELEC-CF-01-2 | Chicote Elétrico / Curto-circuitado / Abrasão |
| INC048 | CAT 777E | Alimentação auxiliar intermitente — sensor | ELEC-CF-01-3 | Sensor, Tensão / Indicado incorretamente / Deriva de calibração |
| INC049 | CAT 966 | Aviso de tensão elevada na 966 | ELEC-CF-02-2 | Chicote Elétrico / Curto-circuitado / Falha de isolamento |
| INC050 | CAT 395 | Solenoide do implemento sem resposta | ELEC-CF-08-1 | Bobina, Solenoide / Com circuito aberto / Temperatura alta |
| INC051 | CAT 395 | Implemento não responde após flexão | ELEC-CF-08-2 | Chicote Elétrico / Com circuito aberto / Roteamento inadequado |
| INC052 | CAT 16 | Leitura anormal de pressão da direção | ELEC-CF-09-3 | Sensor, Pressão / Indicado incorretamente / Deriva de calibração |
| INC053 | Sandvik DR410i | Rede da DR410i perde módulos simultâneos | ELEC-CF-13-1 | Resistor, Terminação / Com comunicação perdida / Defeito de material |
| INC054 | Sandvik DI650i | Comunicação irregular do compressor DI650i | ELEC-CF-13-3 | Conector, Elétrica / Com comunicação perdida / Conexão frouxa |
| INC055 | CAT 6030 | Joystick da 6030 falha em movimentos | ELEC-CF-23-2 | Chicote Elétrico / Curto-circuitado / Abrasão |

## Aprendizado pretendido

1. **Mesmo relato, múltiplas causas (A01):** INC046, INC047 e INC048 usam a mesma família de hipóteses para ensinar a diferenciar conector, chicote e sensor.
2. **Caminho do comando versus atuador (A08):** INC050 e INC051 exigem separar solenoide realmente aberto de fio rompido entre módulo e atuador.
3. **Grandeza física versus indicação:** INC052 confronta o valor mostrado no painel com medição externa antes de classificar falha hidráulica.
4. **Rede CAN (A13):** INC053 e INC054 diferenciam terminação física de problema intermitente em conexão/rede; sem topologia OEM não usar referência numérica padronizada.
5. **Chicote de joystick:** INC055 usa somente a lógica geral de cabos e sinais; **não afirma** que a CAT 6030 utilize o joystick Danfoss mencionado na origem.

## Locais funcionais e itens novos

Foram incluídos cinco **caminhos didáticos**, marcados `origin:'trilha_didatica_simulada'` e `sapValidated:false`. Não são importação de estrutura funcional SAP nem confirmação de instalação nas máquinas:

- CAT 777E: `OPCB/ECSY/AUXC` — Alimentação Elétrica Auxiliar
- CAT 966: `ENSY/ENGN/ELCT` — Circuito de Alimentação Elétrica
- CAT 395: `IMAT/BOOM/ELCM` — Comando Elétrico do Implemento
- CAT 16: `HYSY/STSY/SENP` — Sensor de Pressão da Direção
- CAT 6030: `OPCB/ECSY/JOYS` — Circuito de Comando do Joystick

Novas classes de partes: **Chicote Elétrico, Sensor de Tensão, Sensor de Pressão, Bobina de Solenoide e Resistor de Terminação**. Novos materiais virtuais `CHIC`, `SENT`, `SENP`, `SOLN`, `CANR`; novas ferramentas `OSCI` (osciloscópio) e `CAN` (analisador de rede). Quantidades, preços e HH são **parâmetros de jogo**, não orçamento de oficina.

## Mecânica e segurança

- Mantidos os seis campos de hipóteses, com **quatro alternativas em cada**, e a causa opcional no PCM.
- Permanece o fluxo `Inspeção → Notificação → Revisão PCM → OS → Alocação → Execução`.
- A análise atual do jogo segue **determinística** (gabarito ficcional). Não se deve promover esse gabarito a diagnóstico técnico confirmado ou exibir respostas de `electronicTraining` antes de concluir a investigação.
- Inspeções, testes elétricos e medidas de pressão devem ser tratados como **propostas**. Bloqueio, energia armazenada, integridade de chicote e testes sob tensão precisam de procedimentos OEM aplicáveis.
- **Pendência de gameplay:** evoluir para evidências interativas, com resultados simulados de inspeções/testes que sustentem, enfraqueçam ou não discriminem hipóteses. Sem esse recurso, as missões treinam interpretação e planejamento, mas não reproduzem validação real da causa raiz.

## Testes

`node scripts/test-electronic-fmea-session2.cjs` verifica integridade de caminho, seis etapas com quatro alternativas, materiais, ferramentas, fontes e confidencialidade didática. As Actions de PR e de deploy também rodam esse teste juntamente com as regressões anteriores.
