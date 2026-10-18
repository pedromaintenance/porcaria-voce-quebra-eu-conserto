# Projeto de capacitação técnica — P.O.R.C.A.R.I.A.

**Documento de arquitetura e balanceamento — planejamento (não implementado).**
**Responsável visual pelo futuro módulo:** Bia, personagem de apoio didático. **Bia não é contratável e não executa OS.** Geovane permanece na equipe inicial como Instrutor; sua eventual atuação como instrutor de outros profissionais deverá consumir tempo/capacidade real no jogo, nunca produzir um bônus gratuito.

## 1. Objetivo e fronteiras

Criar uma decisão de gestão de competência: investir em formação custa dinheiro e retira temporariamente pessoas da produção, mas melhora **duas capacidades distintas**: (a) identificar corretamente sistema, grupo, subgrupo, componente, dano e causa; (b) executar com qualidade e rapidez um reparo após diagnóstico confirmado.

A competência deve ser específica por **disciplina** e **modelo de equipamento**, não um bônus mágico indistinto para toda a frota. A melhoria precisa ser rastreável, limitada, condicionada a capacitação concluída e avaliada na OS, preservando a natureza investigativa do jogo.

**Nesta entrega v0.8.15:** são versionadas somente as poses da Bia, o manifesto, a galeria e o projeto técnico. **Não** existem ainda botão de treinamento, cursos pagos, pontos de competência, XP concedida, alteração de produtividade, mudança de save ou novas regras no `engine.js`.

## 2. Disciplinas e progressão

Distinguir **disciplina mecânica** (`role` do motor), **conhecimento de um sistema**, **conhecimento de um modelo**, **formação em diagnóstico** e **formação em execução**.

| Trilha | Código existente / futuro | Habilidade diagnóstica | Habilidade de reparo |
|---|---|---|---|
| Motores diesel, arrefecimento e lubrificação | `motor` | sintomas, lubrificação, temperaturas, códigos e testes | planejamento de desmontagem, montagem, tolerâncias, teste final |
| Hidráulica e implementos | `hidraulica` | pressões, vazamentos, válvulas, cilindros, filtragem | vedação, troca, ajuste, limpeza e comissionamento |
| Transmissão, diferenciais, rodas e material rodante | `rodante` | vibração, desgaste, análise de óleo e inspeções | substituição, alinhamento, pré-cargas, ajuste e inspeção |
| Elétrica/eletrônica e sensores | `eletrica` | diagramas, falhas de comunicação, sinais, testes | chicotes, conectores, módulos e verificação pós-serviço |
| Perfuratrizes | `perfuracao` | cabeça rotativa, compressor, avanço, mastros | reparos específicos e liberação operacional |
| Estruturas e soldagem | `solda` | fissuras, deformações, suportes, falha por fadiga | preparação, recuperação estrutural e inspeção |
| Multidisciplinar | `geral` | leitura de sintomas, sistemática de diagnóstico | fundamentos e apoio, sem substituir qualificações específicas |
| Segurança/LOTO e controle de risco | `safety` **futuro** | identificar riscos e pré-condições | habilita intervenções críticas, sem substituir ferramentas e procedimentos |

Os cursos são **simulações didáticas**, não qualificações legais ou autorizações reais para trabalhar em equipamentos.

## 3. Trilhas por equipamento (IDs já presentes em `game-data.json`)

| Modelo de jogo | ID | Exemplos de módulos a desbloquear |
|---|---|---|
| CAT 777E | EQ01 | motor, arrefecimento, transmissão, diferencial, freios, rodas |
| CAT 6030 | EQ02 | hidráulica, redutores de giro, implementos, motor e lubrificação |
| CAT 395 | EQ03 | bombas, válvulas, hidráulica de implementos, motor e giro |
| CAT 336GC | EQ04 | hidráulica, motor, eletrônica e rodante |
| Sandvik DR410i | EQ05 | compressor, cabeça rotativa, mastro, avanço, elétrica |
| Sandvik DI650i | EQ06 | percussão, alimentação, compressor/ar, mastro, hidráulica |
| CAT D9 | EQ07 | transmissão, material rodante, implementos e motor |
| CAT 966 | EQ08 | articulação, hidráulica, carregamento, transmissão e motor |
| CAT 16 | EQ09 | círculo/lâmina, direção, material rodante, hidráulica e motor |

**Regra para evitar conteúdo falso:** não presumir sistemas OEM ou procedimentos específicos sem base em documentação técnica. Inicialmente, o catálogo poderá usar somente códigos/nomes que já existem em `data.paths` e `data.scenarios`. Não exibir respostas verdadeiras de uma OS ainda não investigada.

## 4. Níveis de competência propostos

Duas progressões independentes, por colaborador:

- `diagnostic`: **N0** sem treinamento, **N1** fundamentos, **N2** investigação orientada, **N3** análise avançada, **N4** especialista validado;
- `repair`: **N0** sem treinamento, **N1** execução assistida, **N2** execução padrão, **N3** intervenção avançada, **N4** especialista validado.

Para cada tipo existe um nível de **disciplina** e outro de **modelo**. Conhecimento generalista é transferível parcialmente: estudar hidráulica ajuda em mais de uma máquina, mas o certificado CAT 6030 não produz automaticamente competência numa perfuratriz.

**Proposta inicial de balanceamento, não regra vigente:**

```text
fatorDiagnostico = max(0,78, 1 - 0,035 × nivelDisciplinaDiagnostico - 0,020 × nivelModeloDiagnostico)
fatorReparo      = max(0,72, 1 - 0,045 × nivelDisciplinaReparo - 0,025 × nivelModeloReparo)
```

Interpretação: o tempo/HH simulados **da atividade pertinente** seriam multiplicados pelo fator; no máximo, treinamento reduziria o tempo de diagnóstico em **22%** e o de reparo em **28%**, antes da calibração com partidas de teste. Os números são parâmetros de game design, **não coeficientes técnicos ou fisiológicos reais**. Jamais aplicar às 12 horas do turno ou à regra de 10,5 HH úteis/mecânico; essas permanecem intactas.

O ganho em acerto diagnóstico deve vir de **menos tentativas erradas e maior capacidade de investigar**, sem o sistema responder perguntas pelo jogador, revelar a causa verdadeira prematuramente ou eliminar necessidade de dados/inspeção. A competência de reparo não dispensa peça, ferramental, bloqueio/segurança ou diagnóstico concluído.

## 5. Tipos de treinamento e pré-requisitos

1. **Teoria e fundamentos:** 1 turno, baixo custo; exige pessoa livre e segurança básica. Desenvolve uma disciplina.
2. **Simulador de diagnóstico:** 1 a 2 turnos, caso fictício com sintomas/evidências. Aplica as mesmas seis etapas de investigação da OS, sem spoilers de casos abertos. Melhora `diagnostic`.
3. **Prática supervisionada:** 2 a 3 turnos, maior custo; exige disponibilidade de equipamentos ou bancada de treinamento (recurso simulado), ferramentas adequadas e registro de segurança. Melhora `repair`.
4. **Especialização por modelo:** sequência de teoria + simulação + prática com requisitos da família. Melhora nível daquele modelo.
5. **Avaliação/certificação:** desafio com critérios mínimos de acerto, retrabalho e segurança. Não avança nível automaticamente por mera passagem de tempo.

Esses tempos/custos são **hipóteses de balanceamento** e devem entrar em `training-catalog.json` como dados parametrizáveis. Nunca usar dinheiro real da empresa nem inventar procedimento OEM.

## 6. Decisão operacional: quem treinar e quando

Em **Gestão → Treinamentos** (futuro), o supervisor escolherá colaborador, disciplina, modelo, objetivo (diagnóstico ou reparo), turma/curso e turno de início. O sistema mostrará antes de confirmar:

- investimento, HH removidas da capacidade produtiva, impacto nos três boxes e previsão de conclusão;
- situação de descanso, OS ativa e compromissos programados;
- pré-requisitos, ferramental de ensino, vagas e possíveis benefícios **estimados**, sem prometer resultado;
- efeitos sobre carga mental/física e moral, com limites consistentes com o motor.

**Sem trabalho e aula simultâneos.** Funcionário alocado numa OS não pode ser inscrito em treinamento conflitante. Uma turma ocupa tempo real; ao concluir, o progresso só entra no turno seguinte ou quando certificado. Cancelamento antes de iniciar e interrupção devem preservar gastos já incorridos e não conceder XP fictícia.

**Geovane como Instrutor:** quando a futura mecânica de instrutoria for habilitada, sua alocação à turma também deverá consumir sua disponibilidade; Bia será a personagem de interface que explica progresso, certificações e resultados, nunca uma funcionária extra gratuita.

## 7. Interface e uso dos assets da Bia

Biblioteca versionada em `assets/characters/bia/`, com quatro atlas transparentes **1160 × 1244 px**; cada atlas é 2×2, quatro frames de **580 × 622 px**. Os 16 quadros têm a mesma orientação, âncora de solo de 12 px, transparência e IDs determinísticos.

- `feedback`: prancheta e aprovação — resultado, aprovação, conclusão;
- `inspection`: anotação e inspeção ajoelhada — atividade prática e validação;
- `field`: caminhada com prancheta e rádio — envio de solicitação/coordenação;
- `coaching`: apontamento, acompanhamento e inspeção — orientação inicial e condução.

O UI futuro consultará `manifest.json` por coleção/pose (não indexará nomes de arquivos duplicados). **Não carregar essas imagens na oficina Phaser durante partidas normais** até que o menu exista. Galeria temporária, somente visual: [Biblioteca da Bia](assets/characters/bia/index.html).

**Estado de personagem (atualizado na v0.8.16):** Bia = facilitadora da interface, não contratável. A equipe inicial é formada por Costa (antes Isaias), Pedro, Geovane, Silva, Santos e Moura; o sistema ainda não concede competências de treinamento. Contratados futuros com o nome genérico "Mecânico" continuam sem sprite.

## 8. Modelo de dados, integração e migração futura

Proposta de módulo puro `training.js` + catálogo `training-catalog.json` + visual `training-view.js`. **Arquivos e API ainda não existem.** Estrutura sugerida para versão futura do save:

```json
{
  "training": {
    "version": 1,
    "assignments": [],
    "history": [],
    "certifications": {}
  },
  "team": [
    {
      "id": "M1",
      "competencies": {
        "disciplines": {"eletrica": {"diagnostic": 1, "repair": 0}},
        "models": {"EQ01": {"diagnostic": 0, "repair": 0}}
      }
    }
  ]
}
```

Adicionar somente por **migração explícita** em save válido, preservando `role`, `skill`, energia, morale, OS vinculada, histórico, peças e dinheiro. A habilidade global atual deve continuar sendo o baseline, evitando contar duas vezes o bônus de especialização. Recalcular bônus na execução do turno, não antecipar abatimentos e não reescrever registros de OS já encerradas.

Separar funções:
`listCourses(data)`, `getEligibility(state, mechanic, course, startTick)`, `previewTraining(...)`, `scheduleTraining(...)`, `cancelTraining(...)`, `advanceTraining(...)`, `computeCompetencyModifier(...)`.
**Nenhuma dessas funções deve revelar o diagnóstico verdadeiro de uma OS aberta.**

## 9. Indicadores de treinamento

Registrar custo por HH de formação, horas produtivas sacrificadas, matrículas, taxa de conclusão/certificação e cobertura de competências por modelo/frota. Comparar OS posteriores por **sistema, modelo, gravidade e experiência**, acompanhando:

- redução de HH em diagnóstico confirmado e reparo executado;
- taxa de hipóteses corretas nas seis etapas, com cuidado para não confundir jogadas fáceis e difíceis;
- MTTR, first-time fix, retrabalho e bloqueio por material/ferramenta — **não atribuir à capacitação efeitos causados por falta de peças**;
- custo total (treino + mão de obra + material + indisponibilidade de box), não apenas velocidade de um serviço.

Na interface de decisão, apresentar benefícios como **estimativas condicionais simuladas**, jamais como garantia ou estatística operacional real.

## 10. Roadmap de execução e critérios de aceite

| Marco | Entrega | Estado |
|---|---|---|
| **T0: acervo artístico** | 16 poses da Bia, metadados, galeria, hashes, testes e documentação | **Em implementação v0.8.15** |
| T1: currículo | catálogo por disciplina/modelo, cursos, pré-requisitos e progressão N0–N4 | **Planejado** |
| T2: motor | inscrição, conflitos com OS/descanso, turnos, custo e competência; migração de save | **Planejado** |
| T3: menu | Gestão → Treinamentos, Bia contextual e prévia do custo/oportunidade | **Planejado** |
| T4: aprendizagem | simulador sem spoilers, avaliação e certificações | **Planejado** |
| T5: balanceamento | métricas, limites, regressões e homologação em desktop/celular/PWA | **Planejado** |

**Critérios para T1–T5:** (1) ninguém faz OS e curso no mesmo turno; (2) treinamento consome recursos e gera ganhos proporcionais e limitados; (3) diagnóstico continua uma decisão humana no jogo; (4) reparo não ignora peças/ferramental; (5) save antigo carrega sem perda; (6) Bia só aparece em contextos pedagógicos; (7) se o recurso não estiver pronto, a UI não fingirá ofertá-lo; (8) os três boxes, dia/noite, 777E e desempenho PWA não sofrem regressão.

## Próxima ação

Implementar **T1** com catálogo de cursos fundamentado nas 9 máquinas e nas 7 especialidades já existentes; incluir disciplina/sistema e um conjunto inicial de casos pedagógicos **não derivados das causas ocultas de OS ativas**. Somente depois integrar motor e novos menus.
