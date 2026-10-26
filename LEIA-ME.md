# P.O.R.C.A.R.I.A. — Você Quebra, Eu Conserto

**Estado do jogo:** Phaser 3 + PWA; 124 cenários técnicos no catálogo de missões, 120 entradas de condição, 9 modelos de equipamentos, oficina com 3 boxes e campanha de 20 dias + modo livre. **Turnos de 12h, com 10,5 HH úteis por trabalhador.**

## Como jogar hoje

Você administra uma oficina de manutenção de equipamentos pesados: responde ao Rádio, escolhe OS corretivas, aloca profissional e box, diagnostica em seis níveis SAP (Sistema, Grupo, Subgrupo, Componente, Dano, Causa), programa e executa reparos e preventivas. Inspeções registram achados e enviam notificações ao PCM; Monitoramento reúne óleo, eventos eletrônicos, material rodante, FPS/GET e componentes. Os sistemas interagem com disponibilidade virtual de frota, caixa, peças, ferramentas, energia, competências, treinamentos e atrasos.

**Distinção de fontes:** laudo de óleo nasce no Monitoramento e não como chamado aleatório no Rádio nem como ronda de campo; código eletrônico ativo pode chegar de diferentes fontes; histórico não é observação de falha ativa na inspeção. O PCM pode receber demanda escalonada de qualquer origem legítima.

A versão Phaser está na linha `0.9.x`; o **schema do save permanece 1.1.0** e não deve ser confundido com a versão visual do aplicativo. O jogo salva no navegador e oferece exportação/importação JSON. O Dia 21 sinaliza conclusão do ciclo, permitindo continuar livremente; a tela final de avaliação e orientações por personagem estão em preparação no Sprint 31.

**Jogar:** https://pedromaintenance.github.io/porcaria-voce-quebra-eu-conserto/phaser-play/

## Documentação vigente

- [Visão do produto](docs/PRODUCT_VISION.md)
- [Campanha atual](docs/CAMPAIGN.md)
- [Contratos entre setores](docs/GAMEPLAY_SYSTEMS.md)
- [Mapa de UX](docs/UX_MAP.md)
- [Status — implementado × testado × homologado](docs/CURRENT_STATUS.md)
- [Backlog](docs/BACKLOG.md)
- [Plano de Sprint 31](docs/SPRINT31_CONTRATO_EXECUCAO.md)

## Uso seguro da simulação

Os roteiros e números são de jogo. Códigos, sintomas, HH, custos, falhas prováveis e regras de balanceamento não substituem manuais, diagnósticos OEM, procedimentos e dados de fábrica. Histórico de documentação e evolução permanece no [roadmap](phaser-play/ROADMAP.md) e em `docs/`.
