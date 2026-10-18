# Equipe visual inicial — P.O.R.C.A.R.I.A. v0.8.14

**Fonte artística:** três cartelas encaminhadas pelo usuário nesta conversa, com quatro poses por personagem. O jogo utiliza **essas artes**, sem redesenho nem personagens adicionais. Para distribuição, cada cartela foi segmentada em quatro quadrantes, ajustada em células uniformes com a base dos pés alinhada e codificada como WebP de qualidade 85, preservando transparência. A compactação tem perdas leves; arquivos originais permanecem nesta conversa.

| Funcionário | Identidade visível | Arquivo oficial | Bytes | SHA-256 |
|---|---|---|---:|---|
| Isaias | Eletricista, uniforme cinza com capacete amarelo | `isaias-4poses.webp` | 171.914 | `32b708ae3c33555e26602730644f6848daa49bbd168a51aa6b1e31de9a4edcd2` |
| Pedro | Brigadista, capacete e colete vermelhos | `pedro-4poses.webp` | 165.916 | `4942108bc9e3d4ab40a086acdcd702cd0ea684f298b2c7c8a242a44b684488ea` |
| Geovane | Instrutor, uniforme amarelo | `geovane-4poses.webp` | 175.328 | `229f8caddeb6fc332972c94841342424f74da65dcd37479bd51a3524c888470a` |

Todas as cartelas são WebP com transparência **1160 × 1244 px**, organizadas em **2 colunas × 2 linhas**, cada quadro com **580 × 622 px**:

1. Ferramenta, em pé
2. Positivo, em pé
3. Prancheta (Pedro usa ferramenta)
4. Trabalho ajoelhado

O mesmo asset é renderizado por quadro com amostragem NEAREST em escala pequena; não gerar frames novos dinamicamente. A animação alterna somente poses da pessoa alocada, sem movimentar a máquina.

## Regras operacionais

- **Equipe nova:** apenas M1 Isaias (especialidade elétrica), M2 Pedro (brigadista) e M3 Geovane (instrutor). Suas funções de brigadista/instrutor são identidade visual; a simulação continua empregando o papel operacional `geral` para Pedro e Geovane.
- **Contratar:** a ação permanece disponível, preservando R$ 1.050, custo de energia mental, skill/moral, regras de capacidade e especialidade simulada existente. Todo contratado futuro se chama **Mecânico**, recebe `sprite:null` e é identificado por seu ID (M4, M5...). O box mostra apenas texto, sem avatar.
- **Ordem em box:** há um responsável por OS. Somente o sprite do profissional atribuído deve ser exibido; não desenhar dois personagens fictícios em razão dos dois pontos de posição do cenário.
- **Saves legados:** `normalizeRoster(s)` migra nomes M1/M2/M3 sem tocar em habilidade, energia, OS ou progresso. O antigo quarto personagem inicial (Nico/M4) é retirado se não tiver atribuição; se estiver trabalhando, é conservado como **Mecânico**, sem sprite, para não cancelar serviço. Contratados reais adicionais permanecem genéricos.
- **Sprites legados Lia/Rafael:** arquivos históricos no Git não são carregados pela versão atual; permanecem para rollback/referência.

## Testes e status

- `scripts/test-worker-roster.cjs` verifica nomes, contratação genérica, ausência de sprite, compatibilidade de save e SHA-256 das três cartelas.
- O CI e o workflow Pages bloqueiam publicação se um sprite estiver faltando ou apresentar hash divergente.
- Homologação visual ainda necessária em cada box, dia/noite, modos diagnóstico/reparo, escala dos pés e transparência.

## Biblioteca da Bia — futura interface de treinamento (v0.8.15)

Quatro atlas / 16 poses da Bia foram registrados em [`bia/`](bia/README.md) com [manifesto](bia/manifest.json) e [galeria de verificação](bia/index.html). **Bia não é funcionária contratável e não possui vínculo de OS ou motor de simulação.** Seu uso está reservado ao futuro menu **Gestão → Treinamentos**. O projeto de capacitação por disciplina e modelo, incluindo custos/HH, avaliação e ganhos limitados em diagnóstico e reparo, está em [`TRAINING_DESIGN.md`](../../TRAINING_DESIGN.md); não há mecânica implementada nesta versão.
