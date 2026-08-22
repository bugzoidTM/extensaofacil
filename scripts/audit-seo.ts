/**
 * Auditoria de SEO técnico (PRD §45 e §67).
 *
 * Roda contra os arquivos JÁ pré-renderizados em dist/public, que é exatamente o que
 * o crawler recebe — auditar o app em execução mediria outra coisa.
 *
 *   pnpm audit:seo
 */
import fs from "node:fs";
import path from "node:path";
import { allRoutes, SITE_URL } from "./prerender";

const DIST = path.resolve(import.meta.dirname, "..", "dist", "public");
const arquivo = (rota: string) =>
  rota === "/" ? path.join(DIST, "index.html") : path.join(DIST, rota, "index.html");

type Problema = { rota: string; nivel: "erro" | "aviso"; msg: string };
const problemas: Problema[] = [];
const erro = (rota: string, msg: string) => problemas.push({ rota, nivel: "erro", msg });
const aviso = (rota: string, msg: string) => problemas.push({ rota, nivel: "aviso", msg });

const pegar = (html: string, re: RegExp) => (html.match(re) ?? [])[1];

const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf-8");
const noSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE_URL, "")));

const rotas = allRoutes().filter((r) => fs.existsSync(arquivo(r)));
const titulos = new Map<string, string[]>();

for (const rota of rotas) {
  const html = fs.readFileSync(arquivo(rota), "utf-8");
  const url = `${SITE_URL}${rota}`;

  const title = pegar(html, /<title>([^<]*)<\/title>/);
  if (!title) erro(rota, "sem <title>");
  else {
    if (title.length > 65) aviso(rota, `title com ${title.length} caracteres (acima de 65 o Google costuma cortar)`);
    titulos.set(title, [...(titulos.get(title) ?? []), rota]);
  }

  const desc = pegar(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) erro(rota, "sem meta description");
  else if (desc.length < 80 || desc.length > 200) aviso(rota, `description com ${desc.length} caracteres (ideal entre 120 e 160)`);

  const canonical = pegar(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) erro(rota, "sem canonical");
  else if (canonical !== url) erro(rota, `canonical aponta para ${canonical}, deveria ser ${url}`);

  const robotsMeta = pegar(html, /<meta name="robots" content="([^"]*)"/) ?? "";
  const indexavel = !robotsMeta.includes("noindex");

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1.length === 0) erro(rota, "sem h1");
  else if (h1.length > 1) aviso(rota, `${h1.length} h1 na mesma página`);

  const robots = robotsMeta;
  if (indexavel && !noSitemap.has(rota)) aviso(rota, "indexável mas fora do sitemap");
  if (!indexavel && noSitemap.has(rota)) erro(rota, "noindex e mesmo assim listada no sitemap");
  if (indexavel && !robots.includes("max-image-preview:large")) aviso(rota, "sem max-image-preview:large (§51)");

  for (const prop of ["og:title", "og:description", "og:url", "og:image", "twitter:card"]) {
    if (!html.includes(`"${prop}"`)) aviso(rota, `sem ${prop}`);
  }

  const ld = [...html.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  // página noindex não disputa resultado, então não precisa de dado estruturado
  if (!ld.length && indexavel) erro(rota, "sem JSON-LD");
  for (const bloco of ld) {
    try {
      const dados = JSON.parse(bloco[1]);
      const nos = dados["@graph"] ?? [dados];
      const tipos = nos.map((n: any) => n["@type"]);
      if (!tipos.includes("BreadcrumbList") && rota !== "/") aviso(rota, "sem BreadcrumbList (§41)");
      for (const n of nos) {
        if (n["@type"] === "Article") {
          if (!n.datePublished) erro(rota, "Article sem datePublished");
          if (!n.author?.name) erro(rota, "Article sem autor (§47)");
          if (!n.image?.url) aviso(rota, "Article sem imagem");
        }
      }
    } catch (e) {
      erro(rota, `JSON-LD inválido: ${(e as Error).message}`);
    }
  }

  const texto = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  if (indexavel && palavras < 300) aviso(rota, `só ${palavras} palavras de conteúdo`);
}

for (const [titulo, rotas] of titulos) {
  if (rotas.length > 1) erro(rotas[0], `title duplicado em ${rotas.length} páginas: ${rotas.join(", ")}`);
}

const erros = problemas.filter((p) => p.nivel === "erro");
const avisos = problemas.filter((p) => p.nivel === "aviso");
console.log(`\n  ${rotas.length} páginas auditadas · ${erros.length} erro(s) · ${avisos.length} aviso(s)\n`);
for (const p of [...erros, ...avisos]) {
  console.log(`  ${p.nivel === "erro" ? "ERRO " : "aviso"} ${p.rota.padEnd(46)} ${p.msg}`);
}
console.log("");
process.exit(erros.length ? 1 : 0);
