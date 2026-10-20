# Sessão 8 — Diagnóstico por evidências interativas (20/10/2026)

A sessão preserva as **100 missões**, **387 caminhos** e o fluxo de aprovação PCM. O objetivo é transformar um subconjunto de seis cenários FMEA em **exercícios verificáveis**, em vez de aumentar apenas o catálogo.

## Pilotos

Três famílias de sintomas, com duas variantes de hipótese que o jogo alterna por família, sem mostrar seu `scene` no botão:

| Família | Variantes | Testes disponíveis |
|---|---|---|
| CAT 777E: perda de potência / combustível | INC066 (restrição do filtro), INC067 (indicação incorreta) | Referência independente de pressão (`MANO`), restrição de filtragem (`PDIF`), amostra qualitativa (`COLETA`) |
| Sandvik DI650i: pressão pneumática insuficiente | INC076 (admissão restringida), INC077 (fuga em mangueira) | Estanqueidade (`PNEU`), restrição na admissão (`PDIF`), tendência térmica (`TERM`) |
| CAT 777E: ruído em comando final | INC086 (rolamento), INC087 (engrenagem) | Partículas no óleo (`COLETA`), inspeção interna virtual (`EXTR`), tendência de temperatura/ruído (`TERM`) |

Os seis cenários já existentes são adaptações de roteiros do [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining), principalmente `PB-TRUCK-FUEL-01`, `PB-DRILL-DI650-COMP-01` e `PB-TRUCK-FINAL-01`. Os **novos resultados de testes**, inclusive estados de indício observado, não observado, divergência e inconclusivo, foram **escritos especificamente para o jogo**; não existem como laudos OEM ou medições reais nas fontes.

## Acesso e experiência

Na tela **Inspeções e Notificações**, há agora a seção **Treino de diagnóstico com testes**. O jogador seleciona o **sintoma**; a lógica cria uma inspeção didática e uma notificação PCM correspondente, sem ordem de serviço automática. A variante alterna entre os dois mecanismos candidatos nos exercícios seguintes. O limite por turno é de **dois exercícios**, respeitando ativos livres; os três casos são escolhidos apenas por iniciativa do usuário.

Cada notificação elegível ganha uma **Bancada de evidências**, exibindo somente descrições dos testes, ferramentas necessárias e custos de simulação. **Resultados são ocultos até clicar em executar teste.** A execução exige instrumento disponível e caixa para debitar **R$35 virtuais**, uma vez por teste e notificação. Não há execução repetida nem preço ou valor real de oficina.

A bancada registra `evidenceTests` dentro da notificação, com método, resultado qualitativo, limitação, custo e turno, além de `reviewHistory`. O jogador pode comparar indícios convergentes, contraditórios ou inconclusivos antes das seis hipóteses PCM. O modo de operação normal — **hipóteses → escopo aprovado → conversão manual em OS → mecânico** — continua inalterado. O motor só avalia a correção das hipóteses após o início do serviço.

## Política de evidências e limitações

- **Nada foi medido em máquina real.** O campo `simulationOnly:true` em `game-data.json` e `source:'resultado_ficticio_sem_medicao_OEM'` registra a natureza da observação.
- Não foram criadas tabelas de códigos de falha, limites de pressão/temperatura ou valores de desgaste arbitrariamente atribuídos a Caterpillar ou Sandvik.
- Nem todo teste é conclusivo: no diferencial de comando final, partículas e aquecimento não permitem identificar o componente. Apenas a inspeção interna *virtual* apresenta um achado discriminante.
- A ferramenta necessária deve ser comprada pelo jogador antes de usar a verificação, quando indisponível. Comprar ferramenta **não revela o gabarito nem executa testes automaticamente**.
- O modelo atual não simula tempo físico de bancada: o teste é instantâneo na interface e debita somente valor virtual de jogo. Isso evita atribuir HH sem suporte e mantém o objetivo piloto restrito à produção de evidências.
- As evidências são persistidas no mesmo save `1.1.0`, sem renomear chaves anteriores. A bancada é um módulo isolado `phaser-play/evidence.js` e não substitui a lógica existente de inspeções.
- A decisão de **monitoramento sem criação de OS** já pode ser representada por arquivamento com justificativa, mas um fluxo próprio de monitoramento programado com recoleta futura e sem serviço corretivo **ainda não foi desenvolvido**. Não foi simulado como se fosse uma OS.
- Para uso real, qualquer inspeção de comando final, circuito diesel, ar comprimido ou aplicação de teste depende de procedimento OEM, bloqueio/despressurização e análise de segurança.

## Alterações técnicas e validação

Arquivos: `game-data.json` (fichas dos seis casos), `phaser-play/evidence.js` (execução), `phaser-play/inspection-view.js` (interface), `phaser-play/game.js` (ações), `phaser-play/index.html` (script e responsividade), `sw.js` (cache PWA), `scripts/test-evidence-investigation-session8.cjs` (regressões), workflows de CI/deploy.

A suíte valida: 100 missões inalteradas, alternância dos casos, zero OS antes de conversão, dedução de custos, bloqueio sem ferramenta, vedação a repetição, inexistência de resposta antes do teste, persistência, aprovação PCM, conversão manual, resultados inconclusivos e compatibilidade com a interface anterior. Testes automáticos não substituem inspeção visual em navegador.
