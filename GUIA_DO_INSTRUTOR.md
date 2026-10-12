# Guia do Instrutor — Case de Gestão Corretiva

## Proposta

Desenvolver raciocínio técnico e gestão de recursos de forma integrada. Cada corretiva nasce de um relato de operador, percorre a árvore de identificação técnica e disputa recursos de uma oficina limitada.

### Critérios de aprendizagem

**1. Triagem e priorização.** Avaliar criticidade, idade da OS, impacto operacional e ferramentas, sem sacrificar controle de riscos.

**2. Diagnóstico.** Distinguir sintoma, local técnico, parte objeto, dano e causa. Um código de parte ou uma classificação de falha **não substitui inspeção e teste**.

**3. Capacidade.** Dimensionar boxes, alocação exclusiva de mecânicos, horas, aptidões e fadiga. A decisão de ajudar um mecânico tem custo de oportunidade.

**4. Material.** Compras urgentes são mais caras; comprar o item errado ou não prever lead time compromete a disponibilidade. É necessário diferenciar pedido, recebimento e reserva.

**5. Pessoas.** A fadiga excessiva reduz produtividade, moral e permanência na equipe. Treinamento e condições de trabalho são parte da engenharia de manutenção.

**6. Indicadores.** Tempo até restaurar uma máquina ≠ tempo de reparo; backlog ≠ demanda total resolvida; KPIs precisam de definições e de contexto operacional.

## Exercício de discussão após jogar 10 turnos

1. Quais OS ficaram paradas por falta de peça e como a compra poderia ter sido antecipada?
2. Houve alocação de técnico especializado em tarefa de outra disciplina enquanto uma OS crítica esperava?
3. Qual foi a relação entre motivação, energia e horas realmente produtivas?
4. Como a distribuição de boxes influenciou a fila? Um box liberado para outra OS reduziu o tempo agregado?
5. O lucro da oficina teria sido maior caso a equipe tivesse menos profissionais? Qual o risco desse raciocínio?
6. Qual indicador foi mais útil? Algum deles poderia ser manipulado pela forma de registrar as OS?

## Definições de indicadores (nesta simulação)

- **MTTR simulado:** média do tempo corrido entre entrada da OS e encerramento, incluindo filas e espera. Unidade: horas. Não é o MTTR real de uma máquina da mina nem permite comparar diretamente com SAP.
- **Taxa de primeira execução:** proporção das OS encerradas sem erro ou retrabalho no diagnóstico.
- **Utilização de mão de obra:** soma acumulada das horas lançadas / total de horas disponíveis por profissional nos turnos simulados. Não confundir com produtividade, eficiência ou wrench time aferido no campo.
- **Backlog:** todas as OS não encerradas. **Atrasadas:** mais de 32 horas corridas na simulação.
- **Reputação:** pontuação abstrata do jogo; não representa indicador corporativo.

## Limitações importantes

O mecanismo associa um caminho de estrutura técnica a uma falha plausível. Ele não valida que o catálogo realmente vincule aquela causa ao item naquele modelo, nem reproduz condições de aplicação específicas por série. Os procedimentos de segurança e operação devem ser buscados nos documentos vigentes do fabricante. A simulação **não autoriza retorno à operação**.

Os preços, tempos, lead times, probabilidades de falha, produtividade e desempenho da equipe não foram calibrados com dados reais; seu papel é provocar decisões em um ambiente controlado. O modelo não calcula confiabilidade estatística ou distribuição de falhas baseada em dados históricos.
