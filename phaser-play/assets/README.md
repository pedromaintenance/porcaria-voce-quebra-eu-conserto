# Cenário da oficina — assets

Coloque nesta pasta o arquivo `oficina-base.png` (PNG). O Phaser o carregará automaticamente como background da oficina em GitHub Pages.

- Preferência: **imagem limpa sem máquinas, mecânicos, painéis de HUD ou números de OS**; esses elementos são desenhados separadamente pelo jogo.
- Panorâmico (largura/altura > 2,05): usado integralmente em um canvas de 1080×450.
- Screenshot inteiro (ex.: 1672×941): o Phaser recorta a região central de três boxes, com coordenadas configuradas em [`../scene-map.json`](../scene-map.json).
- Clique e seleção dos boxes continuam mapeados no JSON, independentemente do visual de fundo.
- Se não houver arquivo, o jogo usa o cenário vetorial já existente.
- O botão **CENÁRIO** no jogo também permite testar uma imagem armazenada somente no navegador. Use **PADRÃO** para retirar a substituição local e voltar ao arquivo do repositório ou ao fallback.

**Pendente:** imagem limpa final de referência e homologação do enquadramento em desktop e celular.
