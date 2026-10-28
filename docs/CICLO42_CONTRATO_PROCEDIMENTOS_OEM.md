# Ciclo 42 — Contrato de procedimentos OEM e árvore de desmontagem

## Estado inicial verificado (28/10/2026)
Ciclo 41 integrado à main no commit 2f4a44d. Dois minigames Phaser operacionais: Marretar Pino (INC023/INC040) e Aperto de Parafusos (INC001/INC025/INC086). O modelo atual de quatro fixadores é abstrato e não instrui aperto em equipamento real.

## Objetivo
Habilitar uma futura camada de procedimentos por equipamento/serial e literatura, sem misturar mecânica lúdica com instrução OEM. Esta etapa define contrato e critérios de implementação, **não libera nenhuma sequência ou torque Caterpillar**.

## Camadas e responsabilidades
1. **Catálogo de ocorrências**: INC/SAP, componente, cenário, classe de serviço.
2. **Catálogo técnico OEM**: procedimento, edição/revisão, intervalo serial aplicável, fonte, licença, atividades, pré-requisitos, EPI, isolamento, riscos, ferramentas, materiais, inspeções e critérios de aceite.
3. **Grafo de dependências**: operações e passos, com relações de precedência orientadas (DAG). Desmontagem e montagem são fluxos explicitamente validados; não assumir que montagem é reverso perfeito da desmontagem.
4. **Adaptador de gameplay**: associa um passo autorizado a uma modalidade (pino/parafuso etc.) e calcula desempenho somente no jogo.
5. **Acompanhamento técnico**: resultado de jogo não certifica torque, bloqueio, inspeção ou liberação do equipamento.

## Contrato sugerido para registro original
```json
{
  "schemaVersion": "1.0.0",
  "id": "oem-procedure-id",
  "status": "draft",
  "equipment": {"make": "Caterpillar", "model": null, "serialPrefix": null, "serialRange": null},
  "component": {"name": null, "partNumber": null},
  "source": {"literatureId": null, "revision": null, "publicationDate": null, "language": null, "accessRights": "unverified", "referenceOnly": true},
  "operation": {"kind": "remove-install", "prerequisiteIds": [], "steps": []},
  "gameplay": {"eligible": false, "minigame": null, "relatedIncidentIds": []},
  "review": {"engineeringValidatedBy": null, "validatedAt": null, "confidence": "unverified"}
}
```

Cada elemento de `operation.steps` deverá conter `id`, `title`, `predecessorIds`, `actionType`, `riskTags`, `requiredEvidence`, `technicalCheckpoint` e `sourceReference`. Campos de torque, padrão de aperto, ferramenta especial e verificações dimensionais somente existem quando corroborados por literatura válida e pela aplicação do número de série.

## Validações bloqueantes
- Impedir passo com dependência não atendida e detectar ciclos no grafo.
- Impedir `status=validated` sem publicação/revisão, aplicação serial, requisitos de segurança e revisor responsável.
- Impedir visualização de torque ou sequência em interface apresentada como técnica se fonte for ausente, incerta, indisponível ou restrita.
- Impedir ativação de procedimento OEM em qualquer INC sem mapeamento SAP e confirmação do componente.
- INC103/INC111/INC115/INC122 (FPS) continuam não elegíveis até equivalência SAP validada.
- Manter limite global de uma assistência por turno, save antigo, HH contabilizadas, materiais, ferramentas, bloqueios, bônus combinados e controles mobile.
- Conteúdo técnico restrito/licenciado não deve ser copiado integralmente para repositório público.

## Primeira fatia implementável
1. Criar módulo isolado com importador de registros e validador puro de esquema, evidências, serial e dependências.
2. Incluir fixtures sintéticas de um grafo de acesso (retirar proteção -> acessar conjunto -> atuar em fixadores -> inspecionar) **sem denominar isso procedimento Caterpillar**.
3. Ligar o grafo sintético a uma visualização de etapas opcional, sem alterar a economia dos minigames.
4. Criar testes de ciclo, precedência, ausência de fonte, serial incompatível, saves e casos FPS.
5. Somente após documentação fornecida e permissão de uso: cadastrar primeiro procedimento Caterpillar com revisão e serial, revisão de engenharia e referência pontual.

## Fonte técnica
Para localizar literatura no SIS 2.0: equipamento + número de série -> informações de serviço -> Desmontagem e Montagem (Disassembly and Assembly) -> mídia/revisão. A apostila SIS & ET do projeto descreve pesquisa pelo número de série, por número de mídia e acesso às informações de serviço; não fornece procedimentos completos dos INC selecionados.

## Gate
Este documento é especificação inicial. Implementação, CI, homologação mobile e integração ficam como etapas distintas a demonstrar por evidência. Não fazer merge de componentes sem testes e não rotular protótipo como instrução de oficina.
