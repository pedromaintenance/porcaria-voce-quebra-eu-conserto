# P.O.R.C.A.R.I.A. — Você Quebra, Eu Conserto
## Versão 1.1 — Case de Gestão de Manutenção Corretiva

**Formato:** PWA em HTML, CSS e JavaScript puro; instalação no celular via navegador; suporte offline após a primeira visita completa por HTTPS.

## O que mudou desde a v1.0

Este não é mais apenas um jogo de acertar uma árvore de códigos. A oficina agora tem **restrições operacionais e consequências persistentes**.

1. **33 cenários técnicos roteirizados** (não combinações arbitrárias de dano e causa), com caminhos de sistema/grupo/subgrupo derivados do banco enviado. Eles podem surgir repetidamente em unidades simuladas diferentes, em uma campanha que aumenta a pressão ao longo dos dias.
2. **Turnos:** um dia tem Turno A e Turno B, de 8 horas cada. Ordens consomem turnos para diagnóstico e reparo. O desempenho depende de especialidade e fadiga.
3. **Capacidade real da simulação:** três boxes. Cada profissional só pode estar atribuído a uma OS. É possível liberar a equipe e o box sem apagar o diagnóstico.
4. **Estoque e suprimentos:** 12 classes de materiais consumíveis, reservas na reparação, compras padrão/urgentes, prazos de entrega e atraso logístico eventual.
5. **Ferramental:** oito instrumentos e conjuntos de ferramentas, dos quais alguns já existem no início. Sem o ferramental requerido, não se avança na OS.
6. **Equipe:** especialidades em hidráulica, motor, elétrica, rodante, perfuração, soldagem e generalista, desempenho técnico, energia física/mental, motivação, contratação, descanso e possível demissão.
7. **Você no campo:** auxiliar um diagnóstico abre seis etapas de identificação. Acerto retorna energia física e mental para a dupla; erro consome energia, aumenta retrabalho e pesa na conta da oficina. Sua ajuda também diminui o esforço físico no reparo.
8. **KPIs:** backlog, ordens críticas, envelhecimento, tempo de restauração, taxa de reparo sem retrabalho, utilização de mão de obra, pendências de peças/ferramentas, caixa, reputação e evolução histórica.
9. **Ciclo de gestão:** marco de avaliação ao fim de 20 dias; depois disso, você pode continuar em modo livre.

**Ampliação 20/10/2026:** quatro ocorrências didáticas novas adaptadas de roteiros autorais do [FMEA Database Mining](https://github.com/pedromaintenance/fmea-database-mining): CAT 395 (vedação de bomba), CAT 6030 (restrição em radiador), CAT D9 (rodante) e CAT 777E (engrenagens de comando final). Os roteiros-fonte ainda aguardam revisão OEM; os vínculos de peça/dano/causa e o gabarito são escolhas **ficcionais de jogabilidade**, não diagnósticos validados. As regras futuras de Inspeção/PCM não foram implementadas neste pacote.

## Como jogar

Abra **Oficina**, escolha uma ocorrência do rádio e faça a triagem. Designe um profissional disponível e um box. Se marcar **Vou junto**, poderá realizar diagnósticos assistidos sem teto fixo de tentativas por turno. Caso contrário, o mecânico investigará no avanço de turno — com chance de equívoco proporcional à habilidade e ao estado de fadiga.

A árvore de diagnóstico segue exatamente:

**Sistema (nível 6) → Grupo (nível 7) → Subgrupo (nível 8) → Componente (Parte Objeto) → Dano (Perda) → Causa.**

Após confirmar os seis níveis, a corretiva só entra em execução quando existe material e ferramenta. Avance turnos para a intervenção progredir. O estoque é consumido na entrada em reparo.

A aba **Equipe** traz contratação, descanso, desempenho e motivação. A aba **Almoxarifado** exibe saldos, pedidos e ferramentas; **Indicadores** traz tendências e tempos; **Academia** tem explicações e navegador do banco reconstruído.

## Publicação no GitHub Pages

1. Descompacte o ZIP.
2. Coloque o **conteúdo interno da pasta** na raiz do seu repositório.
3. Em **Settings → Pages**, selecione **Deploy from a branch**; branch `main`, pasta `/ (root)`.
4. Abra a página HTTPS gerada e instale em *Adicionar à tela inicial* ou *Instalar aplicativo*.
5. Carregue o jogo pelo menos uma vez com conexão para preencher o cache offline.

Para rodar localmente em PC com Python: `python -m http.server 8000` na pasta e acesse `http://localhost:8000`. Abrir o HTML diretamente em `file://` não funciona porque o navegador bloqueia a leitura local do JSON.

## Salvar, restaurar e apagar

O progresso é salvo no `localStorage` do navegador. Use o botão **Salvar JSON** no alto da página, ou **Exportar save** na Academia. A importação restaura os dados da versão 1.1. Saves da v1.0 **não são compatíveis** com o motor novo. Ao solicitar reset, o jogo oferece exportação antes da confirmação.

## Fontes e critérios de privacidade

Fonte de vocabulário: planilhas fornecidas pelo usuário `1412 Mobile.xlsx` e `Catalog Profile - Pats, Coding, Damage and Cause.xlsx`.

O pacote **não contém as planilhas originais**, nomes corporativos, seus caminhos SAP completos, identificadores de ativos internos, fornecedores, dados financeiros reais ou registros de ordens. Mantém nomes técnicos de modelos, códigos dos níveis 6–8 e os catálogos de danos/causas utilizados nos exercícios, dentro de uma estrutura pública de treinamento.

**Atenção:** associação entre códigos/peças, sintomas, criticidades, causa e testes é **roteiro pedagógico criado a partir dos cadastros**, e não evidência de falha realmente ocorrida. Horas, preços, salários e probabilidades são inventados para o equilíbrio do jogo. Nenhuma decisão do jogo substitui OMM, SIS, procedimento aprovado, medição ou autorização de segurança.

## Arquivos

- `index.html` interface e navegação
- `styles.css` design responsivo da oficina
- `engine.js` motor da simulação com funções testáveis
- `app.js` camada de interface e interação
- `game-data.json` dados pedagógicos derivados/anônimos
- `sw.js` service worker de cache offline
- `manifest.webmanifest` instalação PWA
- `test_engine.js` testes de regressão executáveis no Node
- `GUIA_DO_INSTRUTOR.md` abordagem de treinamento e validação
