# Fluxos do n8n

## extensaofacil-redator01

Escreve UMA página por execução (07h e 19h UTC), na ordem de prioridade do PRD (§90):
páginas-pilar primeiro, depois o cluster do relatório final, faculdades, cursos e, desde
13/09/2026, os guias do silo por curso (`cursos/<curso>/{exemplo,etapas,relatorio-final}`),
um curso por vez. Cada tema do silo tem roteiro e briefing próprios no nó "Escolher alvo"
(o molde genérico de 9 seções era o que fazia toda página parecer a mesma). Página que
era rascunho continua rascunho depois de escrita; a FAQ vem do mesmo JSON.

**Grava no CMS mas não publica.** O site só muda quando alguém clica Publicar em
<https://extensaofacil.com.br/admin/> — é o portão de revisão editorial do §64.

### Importar

No n8n: **Workflows → ⋯ → Import from URL** e cole:

```
https://raw.githubusercontent.com/bugzoidTM/extensaofacil/main/n8n/extensaofacil-redator01.json
```

(Ou baixe o arquivo e use *Import from File*, ou copie o conteúdo e cole no canvas com Ctrl+V.)

### Preencher antes de rodar

No nó **Configuração**, troque os três placeholders:

| Campo | Onde achar na VPS |
|---|---|
| `cmsToken` | `head -1 /root/.extensaofacil-admin-api-token` |
| `redatorToken` | `docker service inspect qwenproxy_qwenproxy \| grep API_KEY` |
| `telegramToken` | o mesmo token do @Nutef_bot usado nos outros fluxos |

### Parâmetros

- `alvo` — vazio pega a próxima da fila; preencha com um slug para forçar uma página.
- `modelo` — `qwen3.8-max` no qwenproxy. Para usar o chatgptproxy, troque a URL do nó
  Redator para `https://gptproxy.nutef.com/v1/chat/completions`, o modelo para `gpt-5`
  e o `redatorToken` pela chave daquele serviço.
- `minPalavras` / `minSecoes` — o portão de qualidade reprova abaixo disso.
- `publicarAutomaticamente` — `false` de propósito. Ligue só quando confiar no padrão.

### O que o portão reprova

Texto raso, seções de menos, description fora de 80–200 caracteres, resposta rápida curta,
link interno para slug inexistente, sobra de rascunho (`[inserir`, `TODO:`, `lorem ipsum`)
e parágrafo idêntico ao de outra página já publicada (§22/§25).

**As fontes citadas não são conferidas automaticamente**: `gov.br` e sites de universidade
devolvem 403 para o IP da VPS, então a checagem daria falso negativo. Confira os links na
revisão, antes de publicar.
