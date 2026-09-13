# Divisão de papéis: Extensão Fácil × Apostileiros (decisão do dono, 13/09/2026)

**Regra:** os dois domínios não disputam a mesma consulta. O Extensão Fácil conquista a
cauda longa **informacional por curso** e manda o leitor qualificado para a **página
comercial do curso** no Apostileiros. A cauda **transacional** é da loja.

| Intenção (o que a pessoa digita)                                   | Quem responde | Onde |
|--------------------------------------------------------------------|---------------|------|
| `como fazer projeto de extensão <curso>`                           | Extensão Fácil | `/cursos/<curso>/` (hub) |
| `temas / ideias de projeto de extensão <curso>`                    | Extensão Fácil | `/cursos/<curso>/ideias/` |
| `exemplo de projeto de extensão <curso>`                           | Extensão Fácil | `/cursos/<curso>/exemplo/` |
| `projeto de extensão I / II / III <curso>`, `programa de …`        | Extensão Fácil | `/cursos/<curso>/etapas/` |
| `relatório final projeto de extensão <curso>`                      | Extensão Fácil | `/cursos/<curso>/relatorio-final/` |
| `projeto de extensão <curso> pronto / pdf / modelo / portfólio individual` | Apostileiros | `categoria-produto/<curso>/` e `produto/projeto-de-extensao-<etapa>-<curso>/` |
| `projeto de extensão <curso> unopar / anhanguera / …`              | Apostileiros | idem |
| modalidades, preço, o que vem no material, como adaptar            | Apostileiros (blog) | artigos comerciais do `Posta Wordpress 2.0` |

Base empírica: `docs/cauda-longa-autocomplete-2026-09-13.json` (585 consultas ao
autocomplete do Google, 9 cursos). As famílias informacionais que apareceram de verdade
foram: como fazer, temas/ideias, exemplo, etapa numerada + programa, relatório final,
"o que é", EAD. Justificativa/objetivo/metodologia/cronograma **por curso** não
apareceram — ficam nos guias gerais, não viram página por curso.

## O silo por curso

```
/cursos/<curso>/                 hub (kind=course)          "como fazer"
/cursos/<curso>/ideias/          guia                        "temas / ideias"
/cursos/<curso>/exemplo/         guia                        "exemplo"
/cursos/<curso>/etapas/          guia                        "projeto de extensão II <curso>"
/cursos/<curso>/relatorio-final/ guia                        "relatório final <curso>"
```

- A rota `/cursos/:course/:topic/` é genérica no App: página nova no CMS com slug
  `cursos/<curso>/<tema>` passa a existir sem mexer no código.
- `CourseSiloNav` (ContentPages.tsx) liga hub ↔ guias do silo nos dois sentidos.
  Publicar um guia do silo re-renderiza o hub do curso (cms/server.ts).
- **CTA:** toda página do silo mostra o CTA para `categoria-produto/<curso>/`
  (`podeMostrarCta` em commercial.ts), independentemente do `intent`. Quem chegou por
  "temas para projeto de extensão em Pedagogia" já é o leitor qualificado.
- Os 27 guias novos (9 cursos × exemplo/etapas/relatório) foram criados como **rascunho**
  (`published=false`) por `/root/extensaofacil-carga/silo/`; o redator do n8n escreve um
  por execução (07h e 19h UTC), preserva o rascunho, e o dono publica no painel.
- Fatos das etapas (`etapas`): correspondência etapa → programa lida nas páginas de
  produto da loja em 13/09/2026 (`docs/loja-etapas-programas-2026-09-13.json`). O redator
  recebe isso como "costuma", nunca como regra (§20).

## O que mudou no blog da loja (`Posta Wordpress 2.0`, n8n RGHUxq0cDQjYNxo0)

- Tema "Projeto de Extensão" só sai com ângulo **comercial** (o que vem no modelo pronto,
  pronto × do zero, conferir componente/programa, portfólio × relatório, modalidades,
  personalizar). Os ângulos informacionais continuam para TCC e estágio.
- Todo artigo de extensão linka o hub do curso no Extensão Fácil para "entender e
  planejar" (domínio de 2018 apontando para o portal de 2026).
- As 3 pautas prioritárias informacionais foram marcadas como cobertas pelo portal.
- Não mexemos nos ~3.200 posts antigos de extensão (muitos com título repetido
  `formatacao-abnt-...-11`): é um problema próprio da loja, fora deste escopo.
