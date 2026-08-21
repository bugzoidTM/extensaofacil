/**
 * Pré-renderização estática.
 *
 * O app é um SPA: o HTML que o nginx entrega seria uma casca vazia e todo o conteúdo
 * (inclusive title, description, canonical e JSON-LD, montados pelo useSeo) só apareceria
 * depois que o React roda. Crawlers de IA — GPTBot, ClaudeBot, PerplexityBot — e os
 * unfurlers de link do WhatsApp/LinkedIn não executam JavaScript.
 *
 * Este passo sobe um servidor estático sobre dist/public, abre cada rota num Chromium
 * headless, espera o React terminar e grava o DOM pronto em dist/public/<rota>/index.html.
 *
 *   npx tsx scripts/prerender.ts                      # tudo
 *   npx tsx scripts/prerender.ts /ods/ /cursos/direito/   # só estas rotas (publicação do painel)
 *
 * O conteúdo vem de content/portal-data.json (gerado do content.db), não do bundle:
 * publicar um texto não exige `vite build`, só regravar o JSON e re-renderizar a rota.
 */
import { chromium, type Browser } from "@playwright/test";
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";

const REPO = path.resolve(import.meta.dirname, "..");
const DIST = path.join(REPO, "dist", "public");
const STATE_FILE = path.join(DIST, ".render-state.json");
const PORT = Number(process.env.PRERENDER_PORT || 4183);
const CONCURRENCY = 4;

export const SITE_URL = "https://extensaofacil.com.br";

/** Rotas sem conteúdo indexável próprio: pré-renderizadas, mas fora do sitemap. */
const NOINDEX = new Set(["/buscar/"]);

const STATIC_ROUTES = [
  "/", "/buscar/", "/cursos/", "/faculdades/", "/guias/", "/ferramentas/",
  "/ferramentas/gerador-de-ideias/", "/ferramentas/seletor-de-ods/", "/ferramentas/checklist-relatorio/",
  "/sobre/", "/politica-de-privacidade/", "/termos-de-uso/",
];

type Payload = { guides: { slug: string }[]; courses: { slug: string }[]; institutions: { slug: string }[] };

function loadPayload(): Payload {
  const file = path.join(DIST, "content", "portal-data.json");
  if (!fs.existsSync(file)) throw new Error(`${file} não existe — rode \`npx tsx cms/export.ts\` antes.`);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

/** Todas as rotas que o App sabe servir, derivadas do conteúdo publicado. */
export function allRoutes(payload = loadPayload()): string[] {
  const routes = new Set<string>(STATIC_ROUTES);
  for (const g of payload.guides) routes.add(`/${g.slug}/`);
  for (const c of payload.courses) {
    routes.add(`/cursos/${c.slug}/`);
    routes.add(`/cursos/${c.slug}/ideias/`);
  }
  for (const i of payload.institutions) routes.add(`/faculdades/${i.slug}/`);
  return [...routes];
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".txt": "text/plain", ".xml": "application/xml", ".woff2": "font/woff2",
};

function startServer(port: number) {
  return new Promise<() => void>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      let file = path.join(DIST, url);
      if (!path.resolve(file).startsWith(DIST)) return res.writeHead(403).end();
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      // fallback de SPA: rota ainda sem arquivo cai no index.html original
      if (!fs.existsSync(file)) file = path.join(DIST, "index.html");
      res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(() => server.close()));
  });
}

/**
 * Adianta o download da imagem de LCP replicando o srcset/sizes do <source> WebP,
 * para que o preload case exatamente com o que o layout vai pedir.
 */
function injectHeroPreload(html: string): string {
  if (html.includes('rel="preload" as="image"')) return html;
  const picture = html.match(/<picture>(?:(?!<\/picture>)[\s\S])*?<img\b(?![^>]*loading=["']lazy["'])[^>]*>[\s\S]*?<\/picture>/i);
  let tag: string | null = null;
  if (picture) {
    const srcset = picture[0].match(/<source[^>]*type=["']image\/webp["'][^>]*srcset=["']([^"']+)["']/i);
    const sizes = picture[0].match(/<source[^>]*sizes=["']([^"']+)["']/i);
    if (srcset) {
      tag = `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset[1]}"` +
            (sizes ? ` imagesizes="${sizes[1]}"` : "") + ` fetchpriority="high" />`;
    }
  }
  if (!tag) {
    const img = html.match(/<img\b(?![^>]*loading=["']lazy["'])[^>]*\bsrc=["']([^"']+)["']/i);
    if (!img) return html;
    tag = `<link rel="preload" as="image" href="${img[1]}" fetchpriority="high" />`;
  }
  return html.replace("</head>", `  ${tag}\n  </head>`);
}

type State = { missing: string[] };
const readState = (): State => {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")); } catch { return { missing: [] }; }
};
const writeState = (s: State) => fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));

export function writeSitemap(routes: string[], missing: string[]) {
  const today = new Date().toISOString().slice(0, 10);
  const list = routes.filter((r) => !NOINDEX.has(r) && !missing.includes(r)).sort((a, b) => a.localeCompare(b));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    list.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(REPO, "client", "public", "sitemap.xml"), xml);
  return list.length;
}

const routeToFile = (route: string) =>
  route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");

/**
 * Renderiza as rotas pedidas. Devolve as que caíram na MissingPage — o App tem rota
 * para /cursos/<slug>/ideias/ de todo curso, mas nem todo curso tem esse conteúdo
 * escrito. Publicar isso daria uma página "não encontrada" com status 200, então
 * elas não geram arquivo e o nginx devolve 404 de verdade.
 */
export async function renderRoutes(routes: string[], opts: { quiet?: boolean; port?: number } = {}) {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error("dist/public/index.html não existe — rode o `vite build` antes.");
  }
  const port = opts.port ?? PORT;
  const stop = await startServer(port);
  const browser: Browser = await chromium.launch();
  const missing: string[] = [];
  const failures: string[] = [];
  const rendered: string[] = [];
  let done = 0;
  const log = (msg: string) => { if (!opts.quiet) console.log(msg); };

  const queue = [...routes.map((route) => ({ route, outFile: routeToFile(route) })),
                 { route: "/rota-inexistente-para-gerar-o-404/", outFile: path.join(DIST, "404.html") }];
  const total = queue.length;

  async function render(route: string, outFile: string) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    try {
      const res = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle", timeout: 45000 });
      if (!res || !res.ok()) throw new Error(`HTTP ${res?.status()}`);
      await page.waitForFunction(() => {
        const root = document.getElementById("root");
        return !!root && root.children.length > 0 && !document.querySelector(".route-loading");
      }, { timeout: 30000 });
      await page.waitForFunction(() => !!document.querySelector('link[rel="canonical"]'), { timeout: 15000 });

      const isMissing = await page.evaluate(() =>
        document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content.includes("noindex") ?? false);
      if (isMissing && !NOINDEX.has(route) && !outFile.endsWith("404.html")) {
        missing.push(route);
        fs.rmSync(path.dirname(outFile), { recursive: true, force: true });
        log(`  [${String(++done).padStart(2)}/${total}] ${route.padEnd(46)} sem conteúdo -> 404`);
        return;
      }
      const html = injectHeroPreload("<!doctype html>\n" + (await page.content()).replace(/^<!DOCTYPE html>\n?/i, ""));
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html);
      rendered.push(route);
      log(`  [${String(++done).padStart(2)}/${total}] ${route.padEnd(46)} ${(html.length / 1024).toFixed(0).padStart(3)} kB  ${(await page.title()).slice(0, 42)}`);
    } catch (err) {
      failures.push(`${route}: ${(err as Error).message}`);
      console.error(`  [ERRO] ${route}: ${(err as Error).message}`);
    } finally {
      await page.close();
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    let job;
    while ((job = queue.shift())) await render(job.route, job.outFile);
  }));

  await browser.close();
  stop();
  return { rendered, missing, failures };
}

/** Publicação incremental: re-renderiza só as rotas pedidas e atualiza o sitemap. */
export async function renderIncremental(routes: string[]) {
  const result = await renderRoutes(routes, { quiet: true });
  const state = readState();
  // as rotas desta leva substituem o que se sabia sobre elas
  const missing = [...new Set([...state.missing.filter((r) => !routes.includes(r)), ...result.missing])];
  writeState({ missing });
  const indexed = writeSitemap(allRoutes(), missing);
  return { ...result, indexed };
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => a.startsWith("/"));
  const full = argv.length === 0;
  const routes = full ? allRoutes() : argv;

  const result = await renderRoutes(routes);
  const state = readState();
  const missing = full
    ? result.missing
    : [...new Set([...state.missing.filter((r) => !routes.includes(r)), ...result.missing])];
  writeState({ missing });

  const indexed = writeSitemap(allRoutes(), missing);
  console.log(`\n  sitemap.xml regravado com ${indexed} URLs indexáveis.`);
  if (missing.length) {
    console.log(`  ${missing.length} rota(s) sem conteúdo, fora do sitemap e respondendo 404:\n   - ${missing.join("\n   - ")}`);
  }
  if (result.failures.length) {
    console.error(`\n  ${result.failures.length} rota(s) falharam:\n   - ${result.failures.join("\n   - ")}`);
    process.exit(1);
  }
  console.log(`  pré-renderização concluída: ${result.rendered.length} rotas + 404.html\n`);
}

if (import.meta.filename === process.argv[1]) main().catch((err) => { console.error(err); process.exit(1); });
