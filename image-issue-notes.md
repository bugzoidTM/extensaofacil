# Relato de correção anterior — leitura verificada

Os primeiros dois recortes confirmam que uma correção anterior já substituiu URLs `/manus-storage/...` por referências locais em `client/public/img/`, restringiu complementos de desenvolvimento para impedir o inchaço do bundle e removeu um script de analytics com URL inexistente.

Também confirmam a pendência central: cinco imagens originais não estão no repositório nem no histórico disponível, e foram substituídas por placeholders de gradiente verde. A restauração precisa fornecer cinco ativos de produção e manter referências locais relativas, sem retornar ao proxy exclusivo do ambiente de desenvolvimento.

O arquivo atual do hero foi inspecionado e é, de fato, um gradiente com o texto “Extensao Facil — imagem provisoria”. Portanto, não é um problema apenas de URL: os cinco arquivos locais precisam ser substituídos por ativos editoriais reais.

A nova imagem principal foi verificada: apresenta uma conversa de planejamento entre estudantes e educadora comunitária, com área escura livre à esquerda para o texto do hero. A marca anterior também foi revisada; ela será substituída por uma nova marca simbólica sem letras, coerente com o posicionamento editorial do portal.

Os cinco arquivos finais foram otimizados e gravados em `client/public/img/` com os mesmos nomes já referenciados pela aplicação. O build de produção concluiu com `index.html` de cerca de 1,14 kB, e os três testes E2E existentes continuam aprovados. A captura final da homepage confirma a presença das imagens restauradas em hero, ferramentas, ODS, comunidade e identidade visual.
