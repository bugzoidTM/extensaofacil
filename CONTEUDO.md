# Como o conteúdo do Extensão Fácil funciona

## Onde o conteúdo mora

O conteúdo editorial **não está no código**. Ele vive em `cms/content.db` (SQLite) e é
exportado para `content/portal-data.json`, que o site carrega em tempo de execução.

É isso que permite publicar um texto novo **sem rodar `vite build`**: o bundle JavaScript
não muda quando o conteúdo muda, então publicar significa apenas regravar o JSON e o HTML
pré-renderizado das rotas afetadas — cerca de 2 segundos.

```
cms/content.db ──export──> content/portal-data.json ──> o SPA lê no navegador
       │                                        └──> prerender grava dist/public/<rota>/index.html
       └── fonte da verdade                              (é isso que o Google e os bots de IA leem)
```

## Painel

<https://extensaofacil.com.br/admin/> — senha em `/root/.extensaofacil-admin-password` na VPS.

- **Salvar** grava no banco, sem mexer no site.
- **Publicar esta página** exporta o JSON e regrava o HTML dessa rota (mais a home e os hubs
  que a listam). ~2 s.
- **Publicar tudo** regrava as 47 rotas. ~40 s. Use depois de excluir uma página ou mudar
  muita coisa, porque é o que reconcilia o sitemap por inteiro.

O topo mostra quantas páginas têm alteração salva mas ainda não publicada.

## API

A mesma API aceita `Authorization: Bearer <ADMIN_API_TOKEN>`, então n8n ou um agente
publicam sem sessão:

```bash
curl -X PUT https://extensaofacil.com.br/admin/api/pages/detail \
  -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"slug":"relatorio-final/durante-a-acao","kind":"guide","title":"...","sections":[...]}'

curl -X POST https://extensaofacil.com.br/admin/api/publish \
  -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"slugs":["relatorio-final/durante-a-acao"]}'
```

## Quando ainda é preciso build

Só quando o **código** muda (componentes, CSS, rotas do App): `/root/extensaofacil/deploy.sh`.

## Backup e recuperação

Todo publish grava `client/public/content/portal-data.json`, que vai para o git — o conteúdo
fica versionado mesmo com o banco fora do repositório. Se o `content.db` for perdido:

```bash
npx tsx cms/import.ts     # reconstrói o banco a partir do snapshot do repo
```

## Rotas sem conteúdo

O App tem rota para `/cursos/<curso>/ideias/` de todo curso, mas só alguns têm o conteúdo
escrito. As que não têm não geram arquivo e respondem **404 de verdade** — em vez de uma
página "não encontrada" com status 200, que o Google trata como soft 404. Assim que o
conteúdo for escrito no painel, elas voltam sozinhas ao sitemap.
