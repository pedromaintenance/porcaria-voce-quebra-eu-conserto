> **Atualização 19/10/2026 — Lotação e tentativas:** removidos os tetos de profissionais e de decisões assistidas por turno. Dez personagens nomeados permanecem únicos; mecânicos avulsos podem ser contratados sem limite numérico (respeitando custos e integração). Saves preservados e três boxes continuam limitando OS simultâneas. O registro abaixo conserva o histórico de versões anteriores.

> **Atualização 19/10/2026 — Acassio (Instrutor):** novo quarto membro inicial (M4) em campanhas novas. Matriz de competências especificada em `engine.js`; atlas RGBA 1160×1244, quatro poses 580×622, em `acassio-4poses.png`. A imagem é obrigatória antes de integrar o PR, validada por `scripts/test-acassio.cjs`. Saves antigos permanecem com o elenco e as ordens que já tinham. O teto de elenco passa a 14.

> **Atualização 19/10/2026 — v0.8.29:** nova cartela de Pedro enviada pelo usuário; o arquivo original e o procedimento de separação, escala e alinhamento estão registrados em [PEDRO_ASSET_0829.md](PEDRO_ASSET_0829.md). Nenhum atributo de personagem ou OS foi modificado.

# Equipe visual — P.O.R.C.A.R.I.A. v0.8.18

> **Biblioteca futura de supervisores (18/10/2026, v0.8.23):** Major e Duarte foram registrados em [supervisors/](supervisors/) com PNGs originais, WebPs lossless (4 poses cada), manifesto e galeria. **Eles não integram a equipe inicial, contratação ou oficina nesta versão.** A documentação abaixo conserva o histórico das versões anteriores.

**Fonte artística:** cartelas encaminhadas pelo usuário nesta conversa, com quatro poses por personagem. O jogo utiliza **essas artes**, sem redesenho nem personagens adicionais. Para distribuição, cada cartela foi segmentada em quatro quadrantes, ajustada em células uniformes com a base dos pés alinhada e codificada como WebP de qualidade 85, preservando transparência. A compactação tem perdas leves; arquivos originais permanecem nesta conversa.

| Funcionário | Identidade visível | Arquivo oficial | Bytes | SHA-256 |
|---|---|---|---:|---|
| Costa | Eletricista, uniforme cinza com capacete amarelo; antigo Isaias | `costa-4poses.webp` | 171.914 | `32b708ae3c33555e26602730644f6848daa49bbd168a51aa6b1e31de9a4edcd2` |
| Pedro | Brigadista de resgate, capacete vermelho, chave de tubo e furadeira | `pedro-v0829-4poses.png` | 1.136.848 | `ba160e74d97ab8a469b26b524049f625f89ff08bf6997a6427efb79b4b637d44` |
| Geovane | Instrutor, uniforme amarelo | `geovane-4poses.webp` | 175.328 | `229f8caddeb6fc332972c94841342424f74da65dcd37479bd51a3524c888470a` |
| Silva | Mecânico com marreta, capacete amarelo e uniforme azul/amarelo | `silva-4poses.webp` | 287.544 | `26f68b092d14bfb940a7e44577b1d117d14571b27bd69fc0a248124102c849eb` |
| Santos | Mecânico com chave, capacete amarelo e uniforme cinza/amarelo | `santos-4poses.webp` | 281.232 | `48105f1036d2b9693531abb349954f251e1c2d31c4a599e8cdd7ad9c0d5f89ce` |
| Moura | Mecânico com proteção facial, rádio e uniforme amarelo/cinza | `moura-4poses.webp` | 313.970 | `eba522ff337b6838cd4e2f5f77043c7e410bf32a425d2dd243a143f9b64fd99d` |
| Junior | Especialista; balaclava e uniforme de campo | `junior/junior-work-4poses.webp` | 202.152 | `a4777757f79ae25f595b5736fb112cc102455452e95969b2a3b64c653303a229` |

As cartelas atuais usam transparência e **1160 × 1244 px**, organizadas em **2 colunas × 2 linhas**, cada quadro com **580 × 622 px**. A partir da v0.8.29, **Pedro usa PNG RGBA sem perdas**; os demais permanecem WebP:

1. Ferramenta, em pé
2. Positivo, em pé
3. Prancheta ou ferramenta (Pedro usa furadeira)
4. Trabalho ajoelhado

O mesmo asset é renderizado por quadro com amostragem NEAREST em escala pequena; não gerar frames novos dinamicamente. A animação alterna somente poses da pessoa alocada, sem movimentar a máquina.

## Regras operacionais

- **Equipe nova:** M1 Costa (elétrica), M2 Pedro (brigadista), M3 Geovane (instrutor), M4 Silva, M5 Santos e M6 Moura (Mecânicos com papel operacional `geral` até especialização definida). Suas funções de brigadista/instrutor são identidade visual; a simulação continua empregando o papel operacional `geral` para Pedro e Geovane.
- **Contratar:** a ação permanece disponível, preservando R$ 1.050, custo de energia mental, skill/moral, regras de capacidade e especialidade simulada existente. Todo contratado futuro (normalmente M7 em campanha nova) se chama **Mecânico**, recebe `sprite:null` e é identificado por seu ID (M4, M5...). O box mostra apenas texto, sem avatar.
- **Ordem em box:** há um responsável por OS. Somente o sprite do profissional atribuído deve ser exibido; não desenhar dois personagens fictícios em razão dos dois pontos de posição do cenário.
- **Saves legados:** `normalizeRoster(s)` renomeia o antigo Isaias/M1 para Costa, preserva experiência/energia/OS de M1–M3 e adiciona Silva/Santos/Moura com novos IDs livres. Se M4, M5 ou posteriores já são Mecânicos genéricos contratados, eles permanecem genéricos (não são convertidos em personagens nomeados). O antigo Nico/M4 é retirado só se ocioso; se estiver trabalhando, é mantido como Mecânico genérico até liberar a OS. A migração é idempotente.
- **Arquivo legado `isaias-4poses.webp`:** permanece em Git para recuperação; os bytes foram reaproveitados em `costa-4poses.webp` e só este último é carregado pela versão atual. **Sprites legados Lia/Rafael:** arquivos históricos no Git não são carregados pela versão atual; permanecem para rollback/referência.

## Testes e status

- `scripts/test-worker-roster.cjs` verifica os seis nomes, contratação genérica, migração sem colisão de IDs/OS e SHA-256 de todos os seis atlas.
- O CI e o workflow Pages bloqueiam publicação se um sprite estiver faltando ou apresentar hash divergente.
- Homologação visual ainda necessária em cada box, dia/noite, modos diagnóstico/reparo, escala dos pés e transparência.

## Origem da expansão v0.8.16

As imagens da rodada atual foram associadas **pela ordem de envio**: 1. `Adesivos de Trabalhador Industrial em Ação(1).png` → Silva (marreta); 2. `Mecânico em Quatro Poses com Capacete Vermelho(1).png` → Santos (chave); 3. `Cartela de Sprites do Mecânico Chibi(2).png` → Moura (proteção facial). Cada original tem 1254 × 1254 px (grade 2×2). O processo recorta quadrantes, remove fragmentos desconectados de poses vizinhas que invadiam as bordas da cartela, normaliza enquadramento e base dos pés, conserva transparência e exporta WebP 1160 × 1244 px. **Nenhuma figura foi redesenhada.**

Os três novos permanecem classificados como Mecânico (`role:'geral'`) por falta de especialidade operacional definida na solicitação; isso não deve ser confundido com qualificação específica em hidráulica, motor ou rodante.

## Biblioteca da Bia — futura interface de treinamento (v0.8.15)

Quatro atlas / 16 poses da Bia foram registrados em [`bia/`](bia/README.md) com [manifesto](bia/manifest.json) e [galeria de verificação](bia/index.html). **Bia não é funcionária contratável e não possui vínculo de OS ou motor de simulação.** Seu uso está reservado ao futuro menu **Gestão → Treinamentos**. O projeto de capacitação por disciplina e modelo, incluindo custos/HH, avaliação e ganhos limitados em diagnóstico e reparo, está em [`TRAINING_DESIGN.md`](../../TRAINING_DESIGN.md); não há mecânica implementada nesta versão.

## Junior — duas fardas por contexto (v0.8.18)

Junior é um único profissional, sétimo membro da equipe inicial, com a função visível **Especialista**. Quando trabalha em máquina usa **`junior/junior-work-4poses.webp`** (balaclava, capacete branco, óculos e uniforme amarelo); no retrato da Equipe e no futuro menu de Treinamentos usa **`junior/junior-training-4poses.webp`** (camisa azul e crachá, 213.964 bytes, SHA-256 `a652d9f9666e9cfaa4970cfbe3d6e51bafeef3f7a0e3963463fbdcf1fd5c2ab7`). [Manifesto](junior/manifest.json) · [Guia](junior/README.md).

O papel mecânico segue `role:'geral'` até calibração do módulo de especialidades; a identificação **Especialista** não aumenta magicamente o acerto ou velocidade. M7 genérico em save antigo **não é sobrescrito**: Junior recebe próximo ID livre. Se a equipe antiga já possui 9 integrantes, não ultrapassar o teto de lotação automaticamente.

## v0.8.20 — Equipe inicial e elenco contratável

- Equipe inicial de nova campanha: **Pedro, Geovane e Junior**, nesta ordem.
- Catálogo único para contratar: **Costa, Silva, Santos, Moura, Barbosa, Garcia, Braga, Almeida, Sousa e Pereira**.
- Personagens únicos, custo fixo por contratação de R$ 1.050 e 18 pontos de energia mental.
- Máximo de 13 integrantes simultâneos; os três boxes operacionais permanecem iguais.
- As seis imagens novas são WebP RGBA 1160×1244, quatro poses 580×622; manifesto `recruits-0820.json`.
- **Pendente de publicação:** copiar seis arquivos *-4poses.webp disponibilizados no pacote do usuário para esta pasta antes do merge do PR.
- Saves anteriores preservam mecânicos previamente contratados e OS, inclusive os genéricos legados. Não existe mais contratação de mecânico genérico.
- Todos os novos mecânicos têm inicialmente `role:'geral'`, sem bônus especial fictício.

## Retificação visual v0.8.20

Os seis novos personagens passaram de WebP com perdas para **WebP lossless**, preservando 1160×1244, grade 2×2 e alfa. O Phaser renderiza trabalhadores em escala ~54×64 usando filtro **LINEAR**, evitando redução serrilhada por NEAREST. No BOX 2, `workerOffsetX=-5` px ajusta somente o X final do mecânico nos dois perfis. Arquivos definitivos e hashes em `recruits-0820.json`.
