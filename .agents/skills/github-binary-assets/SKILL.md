---
name: github-binary-assets
description: Transfira assets PNG/WebP do P.O.R.C.A.R.I.A. a partir de anexos do chat ao GitHub via ponte Files/Google Drive → Base64 → Git blob → tree/commit, com verificação de hash, Phaser e cache PWA.
---

# Skill: Publicação de assets binários do P.O.R.C.A.R.I.A.

**Procedimento validado nos projetos de origem em 26/10/2026 e adaptado ao P.O.R.C.A.R.I.A.** Fonte: [O Mar de Sangue](https://github.com/pedromaintenance/o-mar-de-sangue/blob/main/.agents/skills/github-binary-assets/SKILL.md) e [Peren](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/.agents/skills/github-binary-assets/SKILL.md). Esta adaptação não implica que um upload de asset para o PORCARIA já tenha sido concluído.

Para `pedromaintenance/porcaria-voce-quebra-eu-conserto`, quando o GitHub só receber conteúdo textual nas ações de arquivos, utilizar a ponte de Base64 do skill e **não concluir que é impossível transferir sprites**. O sprite final aprovado deve ser publicado com os mesmos bytes, sem substituição por imagem gerada ou upload manual imposto ao produtor.

## Quando usar

O usuário fornece um asset/spritesheet e pede para incluir ou substituir um PNG/WebP **no jogo**. Preserve a imagem aprovada pixel a pixel, inclusive alfa/transparência e formato, salvo se o produtor autorizar conversão. Não confundir geração de uma ilustração nova com alteração do asset em produção. Revisar o loader real do Phaser, as coordenadas dos quadros, o cache PWA e os testes de regressão.

## Ferramentas

1. Container/Python: acesso ao anexo montado em `/mnt/data`, Base64 em arquivos texto temporários, Pillow para dimensões, `hashlib` para integridade.
2. Files: `files__manage_library` para `create_folder` e `upload` dos `.txt` em `/Google Drive/porcaria-github-bridge`; `files__read` para recuperar os blocos do Drive por `file_id` completo. Opcional: `mcp__Google_Drive__list_folder` para recuperar IDs e nomes da pasta, nunca usar uma ID inventada.
3. GitHub: `mcp__GitHub__create_blob({repository_full_name,content,encoding:"base64"})`, `create_tree`, `create_commit`, `update_ref`, `fetch_file`, PR e CI.
4. As ferramentas se comunicam por `functions.exec` (`tools.<nome>`); a transferência de megabytes deve ocorrer **dentro do código de ferramenta**, não no texto da resposta.

## Receita verificada

### 1. Preparar blocos de Base64 locais

```python
from pathlib import Path
from PIL import Image
import base64, hashlib
source = Path('/mnt/data/SEU_SPRITE_ORIGINAL.png')
img = Image.open(source)
data = source.read_bytes()
base64_text = base64.b64encode(data).decode('ascii')
stage = Path('/mnt/data/porcaria_binary_stage'); stage.mkdir(exist_ok=True)
prefix = 'seu_sprite_unico'
names = []
for i, start in enumerate(range(0, len(base64_text), 160_000)):
    block = base64_text[start:start+160_000]
    name = f'{prefix}_part_{i:03d}.txt'
    (stage/name).write_text('\n'.join(block[k:k+4000] for k in range(0,len(block),4000)), encoding='ascii')
    names.append(name)
print('dimensions', img.size, 'mode', img.mode, 'bytes', len(data), 'b64', len(base64_text))
print('sha256', hashlib.sha256(data).hexdigest())
print('git_blob_sha1', hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest())
print('names', names)
```

Os tamanhos **160.000 caracteres por arquivo** com linhas de **4.000 caracteres** foram testados. A divisão é textual, não recorta a spritesheet. Guardar todos os nomes **na ordem** e os hashes esperados.

### 2. Enviar os blocos texto ao Drive conectado

```javascript
await tools.files__manage_library({operations:[
  {operation:'create_folder',path:'/Google Drive/porcaria-github-bridge',parents:true}
]});
const names = ['seu_sprite_unico_part_000.txt', 'seu_sprite_unico_part_001.txt']; // completar todos
const r = await tools.files__manage_library({operations:names.map(n=>({
  operation:'upload',
  container_path:'/mnt/data/porcaria_binary_stage/'+n,
  destination_path:'/Google Drive/porcaria-github-bridge/'+n
}))});
```

Enviar **até 20 uploads por chamada**, verificar `status:'succeeded'`, armazenar os `file_id` completos associados a cada nome. Não usar `overwrite:true`: nesta execução o Drive retornou `overwrite_not_supported`. Utilizar nomes exclusivos; pode listar a pasta real com `mcp__Google_Drive__list_folder`, usando URL/ID retornado pela criação, se for necessário redescobrir as partes.

### 3. Reconstituir e criar um blob Git com os mesmos bytes

Executar dentro de **uma** chamada `functions.exec`:

```javascript
const repo='pedromaintenance/porcaria-voce-quebra-eu-conserto';
const ids=[/* file_id completo na ordem dos blocos */];
const chunks=[];
for(let start=0;start<ids.length;start+=5){
  const r=await tools.files__read({read:ids.slice(start,start+5).map(id=>({
    ref_id:id, mode:'full'
  }))});
  for(const item of r.results){
    if(item.has_more) throw Error('Bloco incompleto');
    const b64=(item.content||[]).filter(v=>typeof v==='string')
      .join('\n').replace(/\s+/g,'');
    if(!b64) throw Error('Bloco vazio');
    chunks.push(b64);
  }
}
const full=chunks.join('');
if(full.length!==B64_LENGTH_ESPERADO)throw Error('Comprimento Base64 incorreto');
const blob=await tools.mcp__GitHub__create_blob({
  repository_full_name:repo, content:full, encoding:'base64'
});
if(blob.result.sha!==GIT_SHA1_ESPERADO)throw Error('Arte incorreta ou corrompida');
text({blobSha:blob.result.sha,verificado:true});
```

**Evidência dos projetos de origem (não são assets do PORCARIA):** a ponte confirmou os hashes Git dos PNGs Dagon e Cortejo dos Afogados. Isso demonstra a técnica, mas a imagem do PORCARIA deverá ter **seu próprio SHA calculado a partir do anexo real**. **Criar blob não basta para publicar.**

### 4. Integrar o blob à árvore Git da branch

Obter HEAD atual da branch e tree SHA via GitHub API `GET /repos/{owner}/{repo}/git/commits/{head_sha}` (ação `mcp__GitHub__fetch`). Não inventar hashes. Depois:

```javascript
const tree=await tools.mcp__GitHub__create_tree({
  repository_full_name:repo,
  base_tree_sha:TREE_SHA_ATUAL,
  tree_elements:[{path:'phaser-play/assets/characters/nemuel-inspetor-4poses-v2.png',mode:'100644',type:'blob',sha:BLOB_SHA}]
});
const commit=await tools.mcp__GitHub__create_commit({
  repository_full_name:repo,
  message:'asset: update exact original artwork',
  tree_sha:tree.result.sha,
  parent_sha:HEAD_SHA_ATUAL
});
await tools.mcp__GitHub__update_ref({
  repository_full_name:repo,branch_name:BRANCH,
  sha:commit.result.sha,expected_sha:HEAD_SHA_ATUAL
});
```

`expected_sha` protege contra sobrescrever trabalho concorrente. Se falhar, recarregar HEAD e TREE, reconstruir em cima do novo commit; **não forçar push**. Substituição pelo mesmo caminho preserva imports e não duplica o arquivo.

### 5. Integrar ao P.O.R.C.A.R.I.A. / Phaser / PWA

- **Caminho e preload real:** ler `phaser-play/game.js` antes de alterar qualquer coisa; o dicionário de sprites define `nemuel:'./assets/characters/nemuel-inspetor-4poses.webp'` na `main` de referência. Há PR #137 em rascunho que aponta para `phaser-play/assets/characters/nemuel-inspetor-4poses-v2.png`, mas **o arquivo binário ainda precisa existir na árvore Git** antes de integrar esse PR.
- **Atlas novo de Nemuel:** o sprite de quatro poses aprovado mede **1211 × 1299 px** conforme anexo disponibilizado pelo produtor no chat. A distribuição não é uma grade 2×2 exata: definir os recortes por pose no bloco `workerRenderTexture(texture)` em `phaser-play/game.js`, inspecionando quadros completos (capacete, botas, esquadro, rádio). O arquivo fonte não deve ser alterado para compensar um erro do código; usar recortes com limites válidos e padding/transparência quando preciso.
- **Contrato visual existente:** saída da textura convertida em quatro frames `WORKER_RENDER_FRAME={width:290,height:311}` e exibição com `WORKER_DISPLAY={width:66,height:80}` (conferir valores reais antes de usar). Preservar escala, pé apoiado no chão, alternância de quatro poses, física, oficina e outros trabalhadores.
- **Precache:** inspecionar `sw.js` e as entradas `CORE` e arquivos do Phaser; inserir o novo PNG apenas **depois** de criar blob → tree → commit e confirmar o caminho. Incrementar a constante `CACHE`, atualizar o query param de `game.js` em `phaser-play/index.html` e, se necessário, a URL do PNG no preload para impedir reaproveitamento da versão antiga.
- **Validação de bytes:** conferir `SHA256`, `git_blob_sha1`, assinatura PNG ou WebP, dimensão real e integridade da alfa. Verificar a árvore da branch e consultar `fetch_file({repository_full_name,path,ref,encoding:'base64'})` para atestar que o GitHub contém o asset correto. Não usar `create_file`/ `update_file` UTF-8 para arquivo binário.
- **Regressões:** atualizar `scripts/test-nemuel-crop-v31.cjs` para a nova arte e coordenadas; confirmar que o teste anterior não obriga dimensões do atlas antigo. Executar suíte de `.github/workflows/ci-phaser.yml`, Chromium desktop/mobile, teste de renderização das quatro poses e publicação GitHub Pages. Testes geométricos não substituem inspeção visual.
- **Fluxo de entrega:** criar branch, publicar arquivo binário, alterar loader e frames, ajustar testes/cache, abrir PR, validar, fazer merge e confirmar Pages. Se o PR #137 ainda estiver aberto, atualizar seu conteúdo/branch com cuidado; não mesclar referência a arquivo inexistente e não alegar conclusão sem verificá-la.

### 6. Limpeza

Após validar os arquivos no GitHub e integrar o PR, apagar **somente** os `.txt` temporários deste envio no Drive. Não remover arquivos de terceiros. Não anunciar sucesso completo se apenas o Git blob existe: é necessária árvore Git + commit + branch + testes + merge.

## Problemas já resolvidos — não repetir

- `create_file`/`update_file` do GitHub criam texto UTF-8, **não PNG** → usar `create_blob` com Base64.
- O GitHub não recebe `/mnt/data` diretamente → usar `files__manage_library` para o Drive e `files__read` dentro de `functions.exec`.
- `overwrite=true` falha nos uploads Google Drive → omitir.
- Blocos longos podem ser truncados → 160 mil caracteres, 4 mil por linha, leitura de até 5 arquivos e verificação de tamanho total.
- Blob criado sem `create_tree` é objeto solto, não arquivo no branch.
- Saves pré-alfa **não** são barreira para a qualidade final, mas regredir a funcionalidade do jogo ou invalidar o cache da PWA é erro.
- Testes antigos que exigem exatamente um parâmetro de versão JS ou cache devem ser atualizados com critério de versão consistente, preservando verificações de integridade.

## Checklist obrigatório

- [ ] Original preservado pixel a pixel, hash do Git Blob confere.
- [ ] Binário ligado à branch por tree/commit e verificado no caminho correto.
- [ ] Phaser carrega as quatro poses do **atlas novo** sem cortes, artefatos, troca de ordem ou alteração de escala.
- [ ] Mecânicas anteriores continuam funcionando.
- [ ] Cache PWA e testes passaram.
- [ ] PR integrado à main e publicação conferida, sem declarar testagem física não realizada.

**A ponte foi comprovada nos projetos de origem. No PORCARIA, executar e verificar novamente em vez de alegar impossibilidade ou sucesso não confirmado. Não pedir reenvio do mesmo anexo já montado.**
## Observações operacionais para agentes

- Se a biblioteca Files/Google Drive não estiver conectada ou a transferência exigir ação do usuário, registrar o bloqueio específico; não inventar uma autorização. O GitHub estar conectado **não significa** que um PNG local já foi enviado.
- `files__manage_library` permite até 20 operações por chamada; use `upload` com `container_path` nos blocos de texto temporários e `files__read` com os IDs devolvidos. Não copiar dezenas de megabytes de Base64 para a conversa.
- Toda etapa posterior de leitura e `create_blob` deve acontecer na **mesma chamada de ferramenta de código** para que a cadeia de Base64 não precise ser transmitida ao texto do chat. Verifique que nenhum `has_more` veio ativo e mantenha a ordem das partes.
- Preferir atualização em branch e PR isolado com `expected_sha`; não criar ícones substitutos, não modificar código de outros personagens e não alterar arquivos do atlas que não foram pedidos.
- Quando necessário, buscar suporte em `.agents/skills/github-binary-assets/SKILL.md` antes de concluir que um asset enviado não pode ser publicado no GitHub.
