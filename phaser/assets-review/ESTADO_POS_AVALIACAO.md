# P.O.R.C.A.R.I.A. — seleção ativa pós-revisão

A avaliação completa de 14/10/2026 foi importada para o catálogo. Das 115 imagens, **14 saíram da seleção ativa** conforme rejeição por duplicidade/obsolescência/descarte (sem apagar originais para fins de auditoria).

- **41 aprovadas**
- **59 aguardam correção técnica/artística**
- **1 exige esclarecimento**
- **14 arquivadas e excluídas deste manifest**
- **101 candidatas no manifest de trabalho** (não confundir com 101 prontas para uso)
- **99 PNGs publicados**, **16 pendentes de upload**.

## Uso
- `catalogo.json`: fonte de todos os itens, com decisão, comentário, issue e condição atual.
- `revisao_usuario_2026-10-14.json`: exportação original sem modificação, auditável.
- `ativos.json`: seleção ativa; excluir `archived`.
- **Somente** `state: approved` deve virar arte de produção sem revisão.
- `needs-revision` e `awaiting-clarification` devem aparecer na galeria de trabalho com aviso.

Issues: https://github.com/pedromaintenance/porcaria-voce-quebra-eu-conserto/issues
Branch: `fix/assets-review-20261014`.
