# Expansão de 12 cenários didáticos FMEA — 20/10/2026

A campanha passou de **33 para 45 cenários**, com IDs `INC034`–`INC045`. Não foi modificado nenhum dos 33 anteriores.

## Proveniência

- Banco pesquisado: [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining).
- Camadas: `data/knowledge/diagnostic/playbooks.v1.json`, `data/knowledge/oil/diagnostic-records.json` e taxonomia `data/catalog/failure-db.v1.json`.
- **Todos os gabaritos adicionais são ficcionais.** No banco, os playbooks permanecem sem evidência de teste executado, revisão OEM ou vínculo SAP confirmado. Os registros de óleo também são simulações.
- `sourcePartMatch:false` em cada caso significa que caminho/componente/dano/causa não foram homologados como conjunto pela origem. Os caminhos usados no jogo já constavam de `game-data.json`; isso não confere validade OEM à peça escolhida.
- Não foram copiados valores reais de horas, custo, população de falhas, código de peça, DTC ou limites operacionais. Valores monetários e durações são exclusivamente do simulador.
- `INC044` é ficção própria para CAT 966 baseada na taxonomia de falhas. **Não** transfere a aplicabilidade do roteiro da CAT 980.

## Casos adicionados

| ID | Modelo | Situação de ensino | Fonte FMEA | Gabarito simulado |
| --- | --- | --- | --- | --- |
| INC034 | CAT 395 | Mangueira roçando no conjunto de bombas | PB-EXC-HOSE-01 | Mangueira; Abrasado ou sulcado; Abrasão |
| INC035 | CAT 6030 | Alerta de óleo no motor diesel 2 | PB-SHOVEL-MOTOR-OIL-01 | Filtro, Óleo; Entupido ou restringido; Contaminação |
| INC036 | Sandvik DR410i | Pulldown com avanço irregular | PB-DRILL-DR410-FEED-01 | Cilindro; Com função degradada; Falha de vedação |
| INC037 | Sandvik DI650i | Pressão do compressor desaparece no painel | PB-DRILL-DI650-COMP-01 | Conector, Elétrica; Com sinal perdido; Corrosão |
| INC038 | CAT 777E | Combustível com suspeita de água no 777 | PB-TRUCK-FUEL-01 | Vedação Junta O-ring; Deteriorado; Falha de vedação |
| INC039 | CAT 16 | Pneu de motoniveladora com desgaste em ombro | PB-GRADER-TIRE-01 | Pneu; Desgastado; Ajuste ou setpoint incorreto |
| INC040 | CAT D9 | Folga em articulação de esteira do D9 | PB-DOZER-TRACK-01 | Pino; Afrouxado; Folga ou afrouxamento |
| INC041 | CAT 777E | Umidade no óleo do comando final | OIL-CASE-001 | Vedação; Deteriorado; Falha de vedação |
| INC042 | CAT D9 | Poeira detectada no comando final do D9 | OIL-CASE-004 | Vedação; Deteriorado; Exposição ambiental |
| INC043 | CAT 777E | Metais em elevação no diferencial | OIL-CASE-070 | Rolamento; Piteado; Contaminação |
| INC044 | CAT 966 | Braço de elevação perdendo posição na 966 | Taxonomia geral | Vedação; Deteriorado; Desgaste |
| INC045 | CAT 6030 | Perda lenta de arrefecimento no motor 2 | PB-SHOVEL-COOL-01 | Mangueira; Vazando; Falha de vedação |

## Recursos virtuais incluídos

- `FILO`: elemento filtrante de óleo; `PNEU`: pneu OTR (simulado).
- `CALP`: manômetro calibrado para pneus; `COLETA`: kit de coleta e inspeção de fluidos.
- Custos, estoque, prazos e HH são **valores de balanceamento de jogo**, não referenciais de fornecimento nem tempos de oficina.

## Uso no jogo

Os cenários participam do sorteio e das **inspeções → notificações → revisão PCM → OS**, preservando seis escolhas (Sistema, Grupo, Subgrupo, Componente, Dano e Causa opcional para PCM). O planejador não recebe confirmação de gabarito no momento da aprovação; a consequência acontece quando o mecânico inicia a OS.

Os campos `verification` descrevem verificações **a executar no exercício**, sem alegar que foram executadas em ativos reais. Recomendação de evolução: apresentar resultados simulados graduais dos testes FMEA como pistas condicionais antes de permitir conclusão causal, distinguindo resultado favorável, desfavorável e inconclusivo.

## Verificação

`node scripts/test-fmea-playbook-cases.cjs` e `node scripts/test-fmea-expansion.cjs` validam os contratos da simulação; a CI existente também executa testes de regressão completos.
