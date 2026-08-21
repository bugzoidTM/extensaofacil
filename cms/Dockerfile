# Imagem do painel de conteúdo. Usa a imagem oficial do Playwright porque publicar
# significa abrir as rotas num Chromium de verdade para gravar o HTML pré-renderizado.
# O código e o node_modules chegam por bind mount de /root/extensaofacil (mesmo Ubuntu
# noble do host, então os binários nativos do better-sqlite3 servem).
FROM mcr.microsoft.com/playwright:v1.62.1-noble
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 8095
CMD ["npx", "tsx", "cms/server.ts"]
