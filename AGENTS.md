# Instruções de agentes — P.O.R.C.A.R.I.A.

## Assets binários enviados pelo produtor

Sempre que houver solicitação de incluir, substituir ou publicar sprites, spritesheets, ícones e outras imagens PNG/WebP anexadas à conversa, **ler primeiro**:

- [Skill de transferência de assets GitHub](.agents/skills/github-binary-assets/SKILL.md)

Este skill documenta a ponte comprovada em Peren / O Mar de Sangue, adaptada aos caminhos e à arquitetura de Phaser/PWA do PORCARIA: **anexo montado → Base64 segmentado → Files/Google Drive → Git blob → árvore → commit → branch/PR → CI → Pages**.

Não tratar a existência do conector GitHub como envio automático do binário. Não substituir a arte aprovada por imagem nova sem solicitação. Não pedir upload manual antes de avaliar o método documentado. Confirmar hashes, existência do arquivo no repositório, carregamento das quatro poses, cache PWA e publicação antes de declarar conclusão.

O PR #137 da troca de atlas do Nemuel depende do upload do PNG real; até esse binário existir na branch, não integrar um preload com caminho inexistente.

## Controle de mudanças

- Alterações artísticas significativas exigem aprovação da direção antes de merge.
- Correções técnicas pontuais devem preservar saves, controles, fontes de ocorrência, física e outros personagens.
- Diferenciar **implementado**, **CI aprovado**, **publicado** e **homologado no celular pelo produtor**.
