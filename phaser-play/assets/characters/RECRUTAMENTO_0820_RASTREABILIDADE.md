# P.O.R.C.A.R.I.A. — Rastreabilidade do elenco contratável (v0.8.20)

**Data da verificação:** 18/10/2026  
**PR:** [#39 — equipe inicial de três e recrutamento nominal](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/pull/39)  
**Branch de integração:** `feature/named-recruits-v0820`  
**Estado:** código preparado; os seis sprites foram recebidos e convertidos, mas a transferência dos arquivos WebP para esta branch GitHub ainda não foi executada. **Não há qualquer arquivo que o usuário precise reenviar ao chat.**

## 1. Inventário e cadeia de custódia

**Origem:** seis imagens PNG RGBA disponibilizadas pelo usuário na conversa, em duas mensagens sucessivas. As três imagens da primeira mensagem correspondem, em ordem, a **Barbosa, Garcia, Braga**; as três da segunda correspondem, em ordem, a **Almeida, Sousa, Pereira**.

**Arquivos originais presentes e conferidos no ambiente da conversa:**

| Personagem | PNG original recebido | Dimensões | SHA-256 PNG |
|---|---|---|---|
| Barbosa | `Cartela de Mecânico Industrial em Quatro Poses(1).png` | 1271×1237 | `0f7ab46b8d423ee908686aeef0facddda78f6a0eda9e813517083dffb76b6b0b` |
| Garcia | `Adesivos do Trabalhador Chibi em Ação(1).png` | 1254×1254 | `d40e9c52315936adf7b3d534f3d239f41be1785302f7ca5daa5d9238c4299b90` |
| Braga | `Cartela de Operário Industrial em Quatro Poses(2).png` | 1254×1254 | `9dd5e5474de967d657b50dfc95b9d2facd96e2ae77e4d0d57ee9c0cedfc9b1ad` |
| Almeida | `Cartela de Operário em Quatro Poses(1).png` | 1254×1254 | `a5ef1d3d25240f445ab69c171eabb4e86df65444c9b9d1d1de982ae2b960f873` |
| Sousa | `Operário Chibi em Quatro Poses(1).png` | 1254×1254 | `111f634f57dc4018e0045089572dd2458651751ce9bd669ddbf69dbd19a21f6e` |
| Pereira | `Adesivo de Operário em Quatro Poses(1).png` | 1254×1254 | `95c4d9158e3b8005c9fd122957897f961b073dc4e258b4d94e65cfcbc3f3b032` |

Todos os seis arquivos originais foram localizados no ambiente e abertos como imagens PNG RGBA. **Recebimento: 6/6.**

## 2. Atlases de produção gerados

Cada imagem foi tratada como cartela de quatro poses em quadrantes 2×2, convertida para WebP com transparência, uniformizada em **1160×1244 px** com quadros **580×622 px**, para uso como sprite sheet no Phaser. A entrada visual preserva a identidade de cada personagem; a terceira pose pode ser de rádio ou inspeção conforme a cartela original. A conversão é compressão com perdas leves: o SHA do WebP não coincide com o SHA do PNG.

| Personagem | Arquivo de produção no repositório | Tamanho | SHA-256 WebP |
|---|---|---:|---|
| Barbosa | `phaser-play/assets/characters/barbosa-4poses.webp` | 191.682 B | `c4fc627f7c6fe5789ce4440d5f8ba69cf644cedeb3d7f0199d01bfdce68b7a2b` |
| Garcia | `phaser-play/assets/characters/garcia-4poses.webp` | 189.262 B | `e33245a51c1ee0af69783e0cb08871a6f8cb7515c6ae69f3fb457dad6d71ae58` |
| Braga | `phaser-play/assets/characters/braga-4poses.webp` | 179.028 B | `482f1f743be665e116f197dacf28eedfd172c53f141c63986f961c6b726e3df1` |
| Almeida | `phaser-play/assets/characters/almeida-4poses.webp` | 201.902 B | `489ec7a24050f5215ebc4ca2b2c5d9279f180f3fd057db5965afc984aa278b16` |
| Sousa | `phaser-play/assets/characters/sousa-4poses.webp` | 197.466 B | `261803a5ad92bfa33d9036f8df47e518abb8b6d88b288a92d1c0d7ea175cc192` |
| Pereira | `phaser-play/assets/characters/pereira-4poses.webp` | 198.278 B | `b3ce5baa85d26980adc7c5a8a1d5cd249fdc2e9bbef3a59cbc822bc9f8c1bfc3` |

**Conversão: 6/6.** O ZIP `PORCARIA_v0.8.20_elenco_contratavel.zip` foi criado e conferido no ambiente da conversa; contém os seis WebP nos caminhos acima e `README_IMPORTAR_NO_GITHUB.md`. O arquivo ZIP é **um anexo da conversa**, não um arquivo já hospedado no repositório.

As seis entradas estão registradas também em [`recruits-0820.json`](recruits-0820.json). O teste [`scripts/test-named-recruits.cjs`](../../../scripts/test-named-recruits.cjs) verifica presença, tamanho, dimensões, canal alfa e SHA-256.

## 3. Regras implementadas no PR #39

- **Equipe inicial de nova campanha:** Pedro (M1), Geovane (M2) e Junior (M3), sem outros profissionais gerados na abertura.
- **Catálogo contratável individual:** Costa, Silva, Santos, Moura, Barbosa, Garcia, Braga, Almeida, Sousa e Pereira (dez personagens).
- **Sem contratações genéricas novas:** o botão genérico foi substituído por opções com nome, retrato e ação de contratação. Cada personagem só pode integrar o quadro uma vez.
- **Custo por pessoa:** R$ 1.050 e 18 pontos de energia mental do supervisor, condicionado a caixa e energia disponíveis.
- **Lotação:** máximo de 13 pessoas no quadro. O número de boxes permanece **3**; ampliar o quadro não aumenta a capacidade simultânea de OS além das regras de boxes.
- **Saves existentes:** não são substituídos por uma campanha nova; nomes, contratos, IDs e vínculos de OS anteriores devem permanecer. Mecânicos genéricos **já existentes em saves antigos** não são apagados, mas o jogador não pode contratar novos genéricos.
- **Perfis:** novos personagens cadastrados como `role:'geral'` até implementação de competências específicas; nenhum bônus técnico fictício é criado.

O código alterado encontra-se em `engine.js`, `phaser-play/game.js`, `phaser-play/index.html` e `sw.js`, com suíte de regressão e documentação vinculadas ao PR.

## 4. Por que existe um teste vermelho?

A expressão anterior “arquivos ausentes” era **imprecisa**: os arquivos **não faltam ao usuário nem à conversa**. A listagem da branch do PR #39 mostra o manifesto `recruits-0820.json` e referências de código, mas **não** mostra os seis arquivos `*-4poses.webp` novos.

O workflow [Validate P.O.R.C.A.R.I.A. recruitment](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39118426012) passou nas etapas **Check syntax** e **Test simulation and recruitment** e falhou na etapa **Verify six sprite files**, porque o ambiente do GitHub Actions só tem acesso aos arquivos commitados na branch. O pipeline principal [Phaser CI](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/actions/runs/39118426018) passou nessa execução.

**Situação exata:** origem PNG recebida (6/6) → atlas WebP produzido (6/6) → pacote entregue na conversa (6/6) → arquivo binário no GitHub PR #39 (**0/6**). Falta *publicação dos binários*, não material de entrada.

## 5. Critérios para concluir a integração

1. Adicionar **estes seis arquivos WebP já produzidos**, com seus nomes exatos, à branch `feature/named-recruits-v0820` no diretório `phaser-play/assets/characters/`. Não redesenhar nem pedir novas cartelas.
2. Confirmar que o teste de integridade passa para todos os seis hashes de `recruits-0820.json` e que o PR fica sem erros de CI.
3. Em campanha nova, confirmar somente Pedro, Geovane e Junior. Abrir **Equipe → Contratação** e verificar os dez candidatos com os retratos corretos.
4. Contratar cada personagem; conferir custo, energia, impossibilidade de contratar a mesma pessoa duas vezes, ID próprio, salvamento e carregamento.
5. Alocar contratados em OS nos boxes 1–3, alternando cenário diurno/noturno; validar poses, transparência, escala, apoio dos pés no piso e ausência de sobreposição.
6. Importar save legado com equipe e OS já atribuídas; conferir que nenhum contrato é substituído, nenhuma ordem perde o responsável e nenhum novo integrante surge sozinho.
7. Manter PR #39 como **draft**, sem merge na `main` nem deploy público, até que os arquivos e os testes funcionais/visuais estejam aprovados.

## 6. Registro de responsabilidade

- **Entrega da arte:** completa pelo usuário; seis cartelas recebidas.
- **Preparação dos sprites:** completa no ambiente desta conversa.
- **Implementação de contratação:** preparada no PR #39.
- **Transferência dos WebP para o GitHub:** pendente de execução no fluxo de publicação, sem qualquer necessidade de reenviar imagens ao assistente.
- **Homologação no navegador:** pendente após CI totalmente aprovado.

Este documento existe para impedir que “asset não versionado no GitHub” seja confundido novamente com “arquivo não enviado pelo usuário”.
