# FPS v6 — Ferramentas de Penetração no Solo (GET)

> Registro histórico do catálogo de sintomas v0.9.9. As **24 missões FMEA**, sua vinculação e a passagem ao PCM/OS foram implementadas no ciclo seguinte: [Missões FPS FMEA v7](MISSOES_FPS_FMEA_V7.md). As afirmações abaixo sobre ausência de roteiros descrevem apenas a versão antiga.

**PORCARIA v0.9.9 · Ciclo 6 do Monitoramento de Condição.**

FPS significa **Ferramentas de Penetração no Solo**, equivalente a Ground Engaging Tools (GET), confirmado em documentação Caterpillar e Sotreq. **Não representa alarme eletrônico, módulo de proteção contra incêndio ou métrica de vídeo.**

A literatura do fabricante fundamenta inspeções visuais de pontas, adaptadores, retentores, protetores, bordas e soldas. Os relatos são cenários educativos inventados; não representam inspeções reais, laudos de máquinas da mina ou limites OEM.

## Referências públicas

- CAT_FPS_BR: https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools.html
- CAT_FPS_MINING: https://www.cat.com/pt_BR/by-industry/mining/equipment-management/wear-maintenance-parts/ground-engaging-tools.html
- CAT_FPS_SHOVELS: https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools/get-for-hydraulic-mining-shovels.html
- CAT_GET_INSPECTION: https://www.cat.com/en_US/articles/for-owners/what-to-know-about-ground-engaging-tools.html
- CAT_GET_EXCAVATOR: https://www.cat.com/en_US/articles/for-owners/get-selection-and-maintenance.html
- CAT_GET_LOADER: https://www.cat.com/en_US/articles/for-owners/cat-excavator-and-wheel-loader-bucket-tips.html
- CAT_GET_DOZER: https://www.cat.com/pt_BR/products/new/parts/ground-engaging-tools/get-for-dozers/cutting-edges-end-bits-dozers.html
- SOTREQ_FPS: https://www.sotreq.com.br/fps

## Estrutura e conservação do histórico

O catálogo contém **24 FPS ativas**, IDs FPS005 a FPS028, distribuídas entre 6030 (12), 395 (8), 966 (2) e D9 (2). O catálogo total contém **120 sintomas recebíveis**, 24 em cada domínio.

Os registros históricos FPS001 a FPS004 continuam acessíveis via get(id) para salvar compatibilidade com partidas antigas, mas **não são sorteados novamente**; a interpretação anterior da sigla era indefinida.

As ocorrências incluem família do componente, posição, observação, incerteza, verificação sugerida, triagem, risco e fonte. **Não são atribuídos P/N, código SAP, série de ponta, percentual de desgaste, espessura, intervalo ou limite de descarte sem identificação do arranjo OEM.** Campos quantitativos permanecem nulos.

A ação inicial é inspeção visual, sem kit artificial. Condições de perda de ponta ou retenção, trincas suspeitas e fixações ausentes são triadas prioritariamente, sem converter automaticamente em OS.

**Pendência funcional:** as 100 missões FMEA existentes não contêm investigação específica de FPS. Portanto, FPS tem escalationScenario nulo; o encaminhamento ao PCM é possível, mas a conversão em OS permanece bloqueada até curadoria de novos roteiros FPS.

## Catálogo de 24 ocorrências

| ID | Modelo | Conjunto / posição | Sintoma recebido | Triagem |
|---|---|---|---|---|
| FPS005 | EQ02 | Ponta de caçamba — Ponta central | Ponta central com desgaste abrasivo progressivo, ainda sem medição de material remanescente. | Monitorar |
| FPS006 | EQ02 | Ponta de caçamba — Posição 2 | Falta uma ponta da caçamba; há indício de exposição do nariz do adaptador. | Prioritária |
| FPS007 | EQ02 | Retentor e trava — Posição 3 | Retentor aparenta deslocamento e a ponta tem movimento anormal na fixação. | Prioritária |
| FPS008 | EQ02 | Adaptador — Posição 1 | Face inferior do adaptador apresenta perda de material após desgaste da ponta. | Monitorar |
| FPS009 | EQ02 | Adaptador — Posição 4 | Suspeita de trinca na região do adaptador, junto à transição com a borda da caçamba. | Prioritária |
| FPS010 | EQ02 | Protetor entre pontas — Centro da borda de ataque | Protetor entre dentes está muito desgastado, com aumento de exposição da borda principal. | Monitorar |
| FPS011 | EQ02 | Protetor lateral — Lado direito da caçamba | Protetor da barra lateral apresenta desgaste desigual, deixando parte do flanco exposta. | Monitorar |
| FPS012 | EQ02 | Borda de ataque — Trecho entre adaptadores | Desgaste por escavação na borda de ataque parece alcançar a região de apoio de proteção. | Monitorar |
| FPS013 | EQ02 | Solda de adaptador — Canto esquerdo da borda | Uma linha semelhante a trinca foi vista na região de solda do adaptador da caçamba. | Prioritária |
| FPS014 | EQ02 | Conjunto de pontas — Lados esquerdo e direito | As pontas da mesma caçamba exibem desgaste bastante desigual entre posições. | Monitorar |
| FPS015 | EQ02 | Sistema de retenção — Posição 5 | Pino de retenção aparenta dano mecânico; a ponta ainda está instalada. | Prioritária |
| FPS016 | EQ02 | Revestimento de desgaste — Fundo interno próximo à borda | Placa interna de desgaste aparenta levantamento em uma extremidade e redução de cobertura. | Monitorar |
| FPS017 | EQ03 | Ponta de caçamba — Posição central | Ponta central da escavadeira 395 apresenta desgaste abrasivo com perda de perfil de penetração. | Monitorar |
| FPS018 | EQ03 | Ponta de caçamba — Posição 2, alojamento | Há indicação de fissura no alojamento de uma ponta, junto à área de encaixe no adaptador. | Prioritária |
| FPS019 | EQ03 | Retentor de ponta — Posição 3 | Retentor da ponta parece solto e há movimento do conjunto na caçamba da 395. | Prioritária |
| FPS020 | EQ03 | Adaptador de ponta — Posição 1 | Adaptador de ponta da 395 apresenta marcas de desgaste na região inferior de apoio. | Monitorar |
| FPS021 | EQ03 | Protetor lateral — Lado esquerdo da caçamba | Uma proteção lateral de FPS está ausente e há desgaste novo na barra da caçamba. | Prioritária |
| FPS022 | EQ03 | Placa de desgaste — Fundo interno da caçamba | Placa de desgaste do fundo interno apresenta afinamento localizado próximo à borda. | Monitorar |
| FPS023 | EQ03 | Solda de adaptador — Canto direito da caçamba | Linha suspeita de trinca apareceu entre o adaptador lateral e a borda de ataque da 395. | Prioritária |
| FPS024 | EQ03 | Seleção do perfil de ponta — Conjunto de caçamba | A produtividade caiu após a troca do perfil de pontas, mas o material escavado também mudou. | Monitorar |
| FPS025 | EQ08 | Borda cortante da caçamba — Centro da borda | Borda de corte da carregadeira 966 apresenta desgaste assimétrico ao longo da largura. | Monitorar |
| FPS026 | EQ08 | Ponta e retenção — Lado direito da caçamba | Uma ponta da 966 mostra folga perceptível no encaixe depois de turno de carregamento. | Prioritária |
| FPS027 | EQ07 | Borda cortante da lâmina — Trecho central da lâmina D9 | A borda cortante do D9 está com perfil muito desgastado e redução perceptível da capacidade de corte. | Monitorar |
| FPS028 | EQ07 | Ponteira lateral da lâmina — Lado esquerdo do D9 | Ponteira lateral da lâmina apresenta fixador ausente e marca de movimento na interface. | Prioritária |

## Ciclo 7 proposto — Missões FMEA de FPS

Criar cenários investigativos independentes para desgaste, retenção, trinca de adaptador/solda, perda de proteção e dano de borda, com inspeções e recursos coerentes por modelo. Associar as missões FPS somente após validação técnica das árvores componente–dano–causa; nenhuma OS será disparada automaticamente.

**Testes:** scripts/test-fps-catalog-v6.cjs e todas as regressões dos domínios anteriores, em CI e Pages. Homologação visual e balanceamento em partida permanecem pendentes.
