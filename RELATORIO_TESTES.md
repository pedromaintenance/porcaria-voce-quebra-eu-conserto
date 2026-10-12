# Relatório de validação — v1.1

## Automatizado: motor de simulação (Node)

O script `test_engine.js` testa:

- 29 casos com seis opções corretas entre alternativas;
- abertura de carreira, fila, quatro mecânicos e boxes;
- alocação e execução do diagnóstico;
- limitação de decisões assistidas por turno;
- progressão de um turno de oito horas;
- compra e entrega de material;
- dependência do ferramental;
- consumo de peça, conclusão e remuneração da OS;
- tempo de restauração maior que zero e recálculo dos indicadores;
- avanço por dezenas de turnos com save JSON válido.

**Resultado:** passou no ambiente de criação.

## Automatizado: interface em Chromium

A interface foi carregada isoladamente em memória, sem acesso a servidor web (restrição do navegador de testes). Foram exercitados:

- renderização mobile 390 × 844;
- alternância entre as cinco abas;
- abertura de uma OS;
- alocação de mecânico e box;
- apresentação do diagnóstico assistido;
- clique em uma resposta e feedback;
- diálogo de avanço de turno;
- mudança para Turno B;
- ausência de exceções JavaScript durante o roteiro.

**Resultado:** passou no ambiente de criação.

## Testes de dados

- 29/29 cenários com materiais e ferramentas definidos;
- 29/29 componentes dos casos encontrados nos grupos de parte objeto consultados;
- nenhuma referência textual aos nomes internos da empresa, códigos completos dos locais de instalação ou IDs internos de ativos nos dados publicados.

## Limites da validação

A instalação real do PWA em Android/iOS, o cache offline após instalação e a compatibilidade da versão publicada no GitHub Pages devem ser verificados por um usuário em dispositivo real. Estes itens **não** foram confirmados no navegador gráfico isolado; não são apresentados como aprovados.

## Auditoria técnica necessária antes de uso formal

A aderência de cada cenário a famílias/modelos específicos e a validade de procedimentos de execução ainda requerem revisão de especialistas e documentação OEM vigente. O jogo é treinamento de raciocínio e gestão, não procedimento operacional aprovado.
