#!/usr/bin/env bash
# Build + deploy do extensaofacil.com.br
#   ./deploy.sh          -> git pull, instala, builda e recarrega o nginx
#   ./deploy.sh --local  -> builda o que já está na pasta, sem git pull
set -euo pipefail
cd /root/extensaofacil

# credenciais do painel ficam fora do repo (público); o stack.yml só referencia
if [ -f /root/.extensaofacil.env ]; then set -a; . /root/.extensaofacil.env; set +a; fi

export PNPM_HOME=/root/.local/share/pnpm
export PATH="$PNPM_HOME:$PATH"
corepack enable >/dev/null 2>&1 || true

if [ "${1:-}" != "--local" ]; then
  git pull --ff-only
fi

pnpm install --frozen-lockfile
pnpm rebuild esbuild @tailwindcss/oxide >/dev/null
npx vite build           # gera dist/public (o server/ express não é usado; quem serve é o nginx)
npx tsx cms/export.ts          # content.db -> content/portal-data.json
npx tsx scripts/prerender.ts   # grava um index.html pronto por rota + 404.html + sitemap.xml

docker service update --force extensaofacil_site >/dev/null 2>&1 || \
  docker stack deploy -c /root/extensaofacil/stack.yml extensaofacil
echo "== deploy concluído: https://extensaofacil.com.br"
