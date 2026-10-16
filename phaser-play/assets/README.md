# Background oficial da Oficina Central

O cenário **Oficina Industrial ao Entardecer**, enviado pelo usuário (1976 × 796 px, PNG), está integrado à versão Phaser.

## Arte disponível no repositório

- **Arquivo carregado pelo Phaser:** [`oficina-base.avif`](./oficina-base.avif).
- **Formato publicado:** AVIF, 900 × 363 px, aproximadamente 12 KB. Versão otimizada da imagem fornecida, preservando o fundo limpo sem veículos ou personagens embutidos.
- **Integridade:** SHA-256 `ce99d2a9b3fe47988a3f60d4b3634715fffa5e5b69af7b525ebe8b39dbf75704`.
- **Publicação:** arte binária versionada na branch `main`; o workflow do GitHub Pages verifica checksum antes do deploy.
- **Fallback:** se o arquivo não carregar, o Phaser mantém o galpão vetorial.
- **Customização:** o botão **CENÁRIO** aceita imagem local e armazena a preferência no navegador. **PADRÃO** remove essa substituição e restaura este AVIF oficial.

## Coordenadas

Consulte [`../scene-map.json`](../scene-map.json). O recorte padrão utiliza a área `x=320, y=130, w=1350, h=563` na imagem fonte 1976 × 796 e a apresenta no canvas 1080 × 450.

Todos os sprites e cliques usam coordenadas **do mundo Phaser**, descontando o deslocamento da câmera de `(319,45)`. Cada box define separadamente `hitWorld`, `spriteWorld`, `workerWorld`, `labelWorld` e `progressWorld`.

## Observações de qualidade

A compressão AVIF de prototipagem prioriza carregamento rápido. A fonte PNG de alta resolução enviada na conversa **não está arquivada em sua resolução original neste repositório**. Para arte final, considerar publicar versão de maior qualidade, após validar peso e desempenho no Pages. Não rasterizar veículos nem mecânicos sobre o fundo: eles devem continuar como objetos independentes, sincronizados às OS.

QA visual desktop e Android segue pendente.
