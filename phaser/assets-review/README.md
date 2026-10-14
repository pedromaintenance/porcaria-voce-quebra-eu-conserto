# P.O.R.C.A.R.I.A. — Biblioteca de assets v0.8

Acervo visual da oficina de manutenção de mina, para revisão por categoria e emissão de feedback via [GitHub Issues](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/new). Esta branch é de avaliação e **não modifica a versão jogável da `main`**.

**Estado real: 115 imagens catalogadas; os arquivos PNG binários ainda precisam ser transferidos para o GitHub**. As entradas listadas são parte do pacote ZIP disponível no chat, e os caminhos ainda não são links válidos de download no repositório. Não confundir documentação publicada com asset publicado.

| Família | Quantidade | Status predominante |
|---|---:|---|
| Máquinas e histórico | 13 | CAT 395 + dois estados DR410i aprovados visualmente; CAT 6030 pendente de revisão |
| Pedro (poses) | 8 | Aprovado visualmente |
| Elenco v0.5.1 | 72 (8 personagens × 9 arquivos) | Rafael, Davi e João preview validado; demais revisar |
| Pranchas conceituais | 20 | Referência apenas |
| Protótipos de interface | 2 | Revisão pendente |

## Máquinas de prioridade alta

| Nome | Arquivo no pacote | Situação artística |
|---|---|---|
| CAT 395 — escavadeira | `equipamentos/cat395.png` | aprovado-visual |
| CAT 6030 — Backhoe (estudo) | `equipamentos/cat6030_backhoe_estudo.png` | revisao-tecnica |
| CAT 6030 — Front Shovel (estudo) | `equipamentos/cat6030_frontshovel_estudo.png` | revisao-tecnica |
| Sandvik DR410i — mastro erguido | `equipamentos/sandvik_dr410i_torre_erguida.png` | aprovado-visual |
| Sandvik DR410i — mastro abaixado | `equipamentos/sandvik_dr410i_torre_abaixada.png` | aprovado-visual |
| Perfuratriz A (estudo) | `equipamentos/perfuratriz_a_estudo.png` | provisorio |
| Caminhão de mineração (estudo) | `equipamentos/caminhao_mineracao_estudo.png` | provisorio |

## Equipe

**Pedro:** alerta, apontando, extintor, inspecionando, neutro, positivo, prancheta, radio.

**Personagens:** Ana, Rafael, Lia, Davi, Bia, Clara, João, Nina. Cada personagem possui `alert`, `clipboard`, `extinguisher`, `idle`, `inspect`, `point`, `positive`, `radio` e `spritesheet`.

**Aviso:** os quadros das pessoas não constituem automaticamente um ciclo real de caminhada ou trabalho.

## Como avaliar

Abra uma [nova issue](https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues/new) com o título `[ASSET] Nome`, anote **Aprovar / Corrigir / Rejeitar** e inclua os pontos específicos. O catálogo JSON usa os mesmos identificadores e preserva a origem por versão.

## Escopo e privacidade

Não publicamos fotografias de pessoas reais, documentos corporativos ou dados de frota. As pranchas de modelos são conceituais; precisão mecânica depende de confirmação visual/geométrica.

## Publicação

- [x] Inventário mestre e auditoria de versões.
- [x] Metadados e estados documentados nesta branch.
- [ ] Copiar arquivos PNG / GIF / WEBP para o repositório e verificar links.
- [ ] Disponibilizar a galeria com arquivos reais por GitHub Pages.
- [ ] Integrar assets aprovados ao Phaser.

Consulte o arquivo [catalogo.json](./catalogo.json) para a lista completa de 115 itens.