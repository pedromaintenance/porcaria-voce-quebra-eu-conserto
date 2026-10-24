# Ciclo 26 — Posições físicas SAP e recuperação de diagnósticos

**Decisão:** os três primeiros níveis do diagnóstico representam os **segmentos do ID físico** do local de instalação da planilha `1412 Mobile(3).xlsx`, não necessariamente os códigos de tipo de objeto. A referência SAP original é imutável.

## Por que houve bloqueios indevidos

A importação do Ciclo 25 derivou `sapPaths` de **tipos de objeto** e consolidou locais de instalação posicionais distintos. A 1412, porém, contém, para o mesmo tipo de objeto `FIDR`:

- `…-DRTR-AXAS-FID1` — Comando Final; Posição 1
- `…-DRTR-AXAS-FID2` — Comando Final; Posição 2

Portanto, usar `FIDR` como identificador do **Subgrupo da localização** apagava a distinção existente na fonte. O código `FIDR` continua correto como **tipo de objeto**, mas a localização física usa `FID1` ou `FID2`. É uma correção da transformação dos dados do jogo, **não** uma alteração da nomenclatura SAP.

## Reconstrução derivada exclusivamente da planilha

A partir dos 2.535 locais, o script de auditoria relacionou os equipamentos utilizados na simulação pelas tags já presentes em `sapPaths[].assets`. Para cada registro com três níveis abaixo do equipamento e status **Completed**:

1. Encontra a folha, seu pai (Grupo) e avô (Sistema), preservando exatamente as três descrições em português.
2. Lê os segmentos do identificador de local de instalação, por exemplo `ENS2/COSY/RADI`.
3. Guarda separadamente `systemObjectType`, `groupObjectType` e `subgroupObjectType`.
4. Conserva o identificador FL completo e as tags dos equipamentos representativos.

Resultado: **442 instâncias físicas**, agrupadas em **371 combinações distintas** de Modelo / Sistema / Grupo / Subgrupo, todas com registro `Completed` na 1412. Não se extrapola a frota nem a aplicabilidade a equipamentos ausentes da exportação.

O `game-data.json.sapInstalledPaths` é a nova lista de localização do **diagnóstico**. `sapPaths` (245 tipos de caminhos agrupados) e `paths` (histórico) permanecem armazenados para compatibilidade, mas não determinam o gabarito dos cenários elegíveis.

## Cenários recuperados por correspondência literal

**16 cenários** inicialmente marcados como pendentes possuem o caminho físico exato na 1412:

| Casos | Referência recuperada |
|---|---|
| INC002, INC033, INC087 | `DRTR / AXAS / FID2` — Comando Final, Posição 2 (CAT 777E) |
| INC009, INC045, INC071 | `ENS2 / COSY / RADI` — Radiador, Motor Posição 2 (CAT 6030) |
| INC035 | `ENS2 / ENGN / LUSY` — Lubrificação do Motor Posição 2 (CAT 6030) |
| INC036 | `MAST / ROHE / CYP2` — Cilindro Pulldown Posição 2 (DR410i) |
| INC040 | `UNCR / TRF2 / TRAK` — Esteira Posição 2 (CAT D9) |
| INC042, INC097 | `DRTR / FDSP / FDS2` — Transmissão Final/Roda Dianteira Posição 2 (CAT D9) |
| INC044 | `IMAT / LIAM / CYL2` — Cilindro Elevação Posição 2 (CAT 966) |
| INC062 | `HYSY / COSY / HOC2` — Resfriador de Óleo Hidráulico Posição 2 (CAT 6030) |
| INC090 | `UNCR / TRF1 / IDL3` — Rolo Retorno Posição 3 (CAT D9) |
| INC094, INC100 | `DRTR / TAN2 / TIR4` — Pneu Posição 4 (CAT 16) |

Nenhuma dessas reativações foi feita somente por similaridade textual: todas possuem um registro FL identificado no JSON de origem.

## Situação atual

| Indicador | Antes | Depois |
|---|---:|---:|
| Cenários com caminho FL identificado | 65 | **81** |
| Cenários elegíveis, incluindo Parte objeto validada | 63 | **79** |
| Cenários com FL ausente | 59 | **43** |
| Cenários com Parte objeto provisória | 2 | **2** |
| Pendências efetivamente bloqueadas | 61 | **45** |

Os 43 cenários com FL não encontrada continuam sem aprovação automática. Isso inclui os FPS com subgrupos didáticos `TIPS`, `RETN`, `ADPT`, `PROT`, `EDGE` etc. O catálogo de **683 Partes objeto** não é alterado. O exemplo `Retentor` permanece código **3263**.

## Retrocompatibilidade e integridade

- Os valores antigos `sapPathMapping.canonicalPath` e `previousPath` ficam registrados para auditoria e migração de saves.
- O motor migra opções antigas, códigos do planejamento e textos de eventos reconhecidos, mantendo avanço da campanha, recursos, histórico e pontuação.
- Uma OS legada anteriormente bloqueada é reclassificada como elegível quando uma FL exata passa a existir; outras seguem bloqueadas, sem atribuição arbitrária.
- Somente após a **sexta etapa** o detalhe da OS mostra a FL completa e o código de Parte objeto, sem entregar respostas antes do diagnóstico.
- `phaser-play/data/sap-scenario-mapping-audit.json` apresenta os **124 casos** com localização, identificação SAP, evidência e motivo da pendência.
- `scripts/test-sap-physical-locations-v26.cjs` verifica a derivação da fonte, todas as opções do diagnóstico, 16 recuperações, bloqueio dos FPS não classificados e migração idempotente do save.

### Limite de evidência

`Completed` na 1412 indica status no arquivo de exportação, **não certificação independente do SAP produtivo atual**. O ciclo comprova a correspondência entre **cenários e registros fornecidos** — não que o defeito, o P/N OEM ou a causa raiz estejam confirmados em campo.

## Próxima decisão técnica

As **45 pendências** exigem uma investigação separada. Especialmente nos FPS, pode existir classificação em uma instalação superior (`IMAT / BUCK`), mas não se deve inventar o terceiro nível nem substituir `RETN` por `CLAM` somente para alcançar um gabarito. É necessário um mapeamento acordado com o dono da referência de local de instalação.
