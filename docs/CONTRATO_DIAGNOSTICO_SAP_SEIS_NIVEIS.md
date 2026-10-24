> **Atualização — Ciclo 26:** os níveis Sistema, Grupo e Subgrupo passam a usar os **segmentos do ID físico da 1412** (ex.: FID1/FID2). Não confundir com tipo de objeto FIDR. Recuperados 16 casos e mantidas 45 pendências. [Auditoria](SAP_INSTANCIAS_FISICAS_CICLO26.md).

---

> **Atualização 24/10/2026 — referência substituída:** a planilha original do perfil SAP foi fornecida e auditada. Ela contém **683 partes objeto**, inclusive **3263 — Retainer / Retentor**. Não use as contagens de 43 componentes e a hipótese anterior de que “Retentor FPS” seria rótulo SAP oficial. O nome **Retentor FPS** era uma extensão do jogo; a denominação SAP correta é **Retentor**, código 3263. A fonte atual e a comparação por cenário estão documentadas em [Importação Integral SAP](IMPORTACAO_INTEGRAL_SAP_1412_CATALOG_PROFILE.md).

---

# P.O.R.C.A.R.I.A. — Contrato de referência SAP nos seis níveis de diagnóstico

**Decisão de engenharia (24/10/2026):** a lista de locais de instalação e os catálogos de Componente, Dano e Causa são a **base**. Um cenário ou manual OEM deve ser enquadrado nesse vocabulário. **Nunca adicionar, renomear ou substituir uma opção SAP para fazer um caso didático funcionar.**

## Ordem hierárquica obrigatória

1. **Sistema:** código e descrição conforme local de instalação aplicável ao equipamento
2. **Grupo:** código e descrição relacionados ao Sistema no mesmo caminho
3. **Subgrupo:** código e descrição relacionados ao Sistema e Grupo no mesmo caminho
4. **Componente:** nome existente em `game-data.json.catalog.parts`
5. **Dano:** descrição existente em `game-data.json.catalog.damages[].pt`
6. **Causa:** descrição existente em `game-data.json.catalog.causes[].pt`

O gabarito é uma **hipótese didática**. A presença dos seis rótulos na lista não demonstra que a falha específica esteja comprovada em campo.

## Separação de três fontes distintas

- **Lista de referência do jogo:** `game-data.json.paths` e `game-data.json.catalog` (não alterada nesta revisão).
- **Vocabulário OEM:** nomes de peças, títulos SIS/ET, manuais, códigos de item, etc. Usado para interpretar e documentar equivalência. **Não** entra automaticamente na lista.
- **Cenário do jogo:** `game-data.json.scenarios`; seus seis valores `[...path, component, damage, cause]` precisam referenciar a lista. Uma equivalência funcional proposta não representa homologação de P/N por equipamento e série.

## Exemplo: 649-8929 TIP GP-SPIKE / CAT SIS

Do recorte SIS fornecido pelo usuário:

| P/N | Nomenclatura inglesa | Português SIS |
|---|---|---|
| 456-2512 | Retainer-Lock | Trava do Fixador |
| 444-5061 | Sleeve | Luva |

No vocabulário atual do jogo, **Retentor FPS** é uma opção existente para o campo **Componente**. Não se deve substituir esse rótulo por **Trava do Fixador**, porque esse último não consta da lista de opções do jogo. A relação é um **enquadramento terminológico de exemplo**, não prova de que o grupo 649-8929 está montado na CAT 6030 da simulação. O componente específico e sua função precisam ser verificados pela configuração/série OEM para aplicação física.

### Pendência importantíssima de locais de instalação

O caminho do cenário **INC103** é `IMAT / BUCK / RETN` — **Implemento / Caçamba / Sistema Retenção FPS** — mas o registro `RETN` foi acrescentado pelo projeto com `origin: trilha_didatica_fps` e `sapValidated:false`. **Ele não pode ser descrito como um subgrupo comprovadamente presente no catálogo SAP original.**

A solução correta **não** é transformar arbitrariamente RETN em `CLAM / Mandíbula`, `CYTL / Cil Inclinação` ou outro subgrupo sem equivalência técnica defensável. O cenário deve continuar identificado como pendência até existir um enquadramento verificável na lista de referência, ou ser retirado do conjunto de diagnósticos SAP válidos em uma revisão explícita de conteúdo.

## Auditoria da base nesta revisão

- 124 cenários investigativos existentes.
- 403 caminhos na estrutura atual, dos quais 371 **não** têm marcação `sapValidated:false` e 32 foram explicitamente acrescentados como trilhas didáticas (`origin: trilha_didatica_simulada` ou `trilha_didatica_fps`).
- **43 cenários** referenciam um desses 32 caminhos adicionados. **Não é correto chamar essa totalidade de SAP homologado.**
- Catálogos mantidos sem alterações: 43 opções de Componente, 66 de Dano e 81 de Causa.
- Todos os 124 cenários possuem seis valores que existem **na estrutura atual**; isso não comprova que as 43 rotas didáticas façam parte da relação SAP original.

## Proteção implementada

A função `validateDiagnosticReference(d,sc)` em `engine.js` é chamada antes de gerar alternativas: qualquer código de localização ou componente/dano/causa fora da referência atual gera erro explícito; a função **não cria códigos**, **não corrige nomes** e **não altera o catálogo**.

O teste `scripts/test-sap-diagnostic-contract-v25.cjs`:

- percorre os seis níveis de todos os 124 cenários e verifica opções/gabaritos em cinco sementes;
- conserva uma impressão digital das quatro listas da base, detectando alteração acidental de conteúdo ou ordenação;
- bloqueia novas trilhas didáticas/cenários desse tipo sem revisão explícita;
- testa que nomenclaturas externas como `Trava do Fixador` e `Danificado OEM` não passam a ser escolhas;
- registra a dívida de reconciliação **32 caminhos / 43 cenários**, sem disfarçá-la como homologação.

### Próxima etapa de conteúdo (não executada automaticamente)

Produzir uma tabela de equivalência para cada uma das 43 missões, com campos **modelo, sintoma, tripla SAP existente, componente SAP, dano SAP, causa SAP, evidência OEM e confiança na equivalência**. Só publicar a substituição quando a equivalência for tecnicamente defensável. Se não existir alternativa adequada, manter o caso fora do diagnóstico SAP homologado em vez de reescrever a lista de referência.

**Política:** mudanças no catálogo SAP exigem atualização deliberada da referência de origem; importar novos casos FMEA ou documentos OEM **não** autoriza alterá-lo.
