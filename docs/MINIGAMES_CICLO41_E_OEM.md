# Ciclo 41 — Aperto de Parafusos / preparação para procedimentos OEM

## Status
Protótipo jogável abstrato. **Não é um roteiro de desmontagem Caterpillar**, nem substitui procedimentos, torques, ferramentas especiais ou verificações da assistência técnica. Minigame não deve ser apresentado como instrução operacional.

## Dois minigames e regras de negócio
- **Marretar Pino:** INC023/INC040 (CAT D9), até +12% de velocidade e -4% desgaste físico por HH.
- **Apertar Parafusos:** INC001 (rolamento de roda traseira), INC025 (rolamento de eixo dianteiro), INC086 (rolamento de comando final). Piloto de fixadores genéricos com quatro etapas visuais, até +6% velocidade e -12% desgaste físico por HH.
- **Os cenários de retentores FPS INC103/111/115/122 permanecem excluídos** por pendência de equivalência SAP. Não introduzir exceção para liberar o minigame.
- Ambos compartilham um limite de uma assistência por turno em toda a oficina, mesmo após atualizar/importar save. Tentativa registrada ANTES do início.
- Habilidades físicas não substituem materiais, ferramentas, diagnóstico, HH e descanso. Bônus válido somente para OS, mecânico e turno registrados. Sem ganho retroativo, sem conclusão automática e sem adição de HH.
- Limite combinado de bônus de chefia + minigame: 1,40, sem mexer nos fatores de competência e na meta de produtividade.

## Referência de arquitetura do Car Mechanic Simulator 2021
O CMS usa um sistema de desmontagem e montagem por peças e níveis de dependência. Guias públicos de seu editor descrevem:
- **bodyconfig.txt**, que inclui dependências de desmontagem de partes de carroceria;
- **config.txt**, para parametrização do veículo;
- módulos comunitários capazes de modelar assemblies e componentes.
Isso é uma referência conceitual, NÃO uma autorização para reproduzir código, modelos, arquivos ou assets protegidos. Construir a nossa estrutura original.

Fontes:
- https://steamcommunity.com/sharedfiles/filedetails/?id=2582093775
- https://www.nexusmods.com/carmechanicsimulator2021/articles/33
- https://showgamer.com/en/prohozhdeniya-igr/20-prohozhdenie-car-mechanic-simulator-2021

## Modelo proposto para futura integração de literatura CAT
Uma atividade de desmontagem/montagem deverá ter:
1. equipmentModel, serialNumberPrefix e componentPN (quando aplicável);
2. literatureId, revision, publicationDate, sourceRights, language;
3. accessConditions, isolationRequirements, safetyCriticalWarnings;
4. parts[], tools[], specialTools[], consumables[];
5. steps[] com id, title, prerequisites[], dependencies[], type, requiredEvidence[], checkpoint;
6. fasteners[] com quantity, location, OEM sequence, torque, unit, method, sourceReference (somente quando literalmente verificável na literatura);
7. gameplay[] — minigames originais associados a passos elegíveis, sem equivaler sucesso de arcade a liberação técnica;
8. signoffRequirements[], finalInspection[], testCriteria[];
9. confidence, validationBy, lastReviewed.

**Nenhum valor numérico OEM será inventado.** Torques e sequências serão documentados em estruturas licenciadas/referenciadas, não copiados integralmente para um repositório público sem autorização. A documentação técnica CAT será recebida, analisada e transformada em dados próprios autorizados, preservando as referências.

## Critérios de aceite
- Node testa os três cenários Bolt validáveis, bloqueios e não repetição.
- E2E Chromium desktop e mobile realiza a sequência inteira e verifica persistência.
- Save antigo segue válido sem migração destrutiva.
- Nenhum script de diagnóstico/preditiva/PCM fica dependente de mini-game.
