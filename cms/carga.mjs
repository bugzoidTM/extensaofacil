/**
 * Carga em lote de conteúdo pela API do painel.
 *
 * Existe porque escrever dez páginas longas pelo formulário do /admin/ é inviável, e
 * porque a API já aceita token — o caminho existia, só não estava documentado nem
 * versionado. O script grava as páginas e publica em uma tacada.
 *
 *   node cms/carga.mjs ./lote                 # grava tudo de ./lote e publica
 *   node cms/carga.mjs ./lote --dry           # só diz o que faria
 *   node cms/carga.mjs ./lote --sem-publicar  # grava e deixa a publicação para o painel
 *
 * A pasta contém um .json por página, no mesmo formato que a API devolve em
 * GET /api/pages/detail — slug, kind, title, description, eyebrow, intent, quickAnswer,
 * tags, related, reviewedAt, author, sections, faq, sources.
 *
 * ARMADILHA que este script resolve: `savePage` zera o que não vem no corpo. Um PUT
 * "parcial" para acrescentar só a FAQ apagaria título, descrição e intenção da página.
 * Por isso um arquivo com a chave `_merge: true` é tratado como remendo: o script LÊ a
 * página inteira pela API, funde os campos do arquivo e devolve tudo.
 *
 * O token sai de /root/.extensaofacil-admin-api-token (ou da env ADMIN_API_TOKEN) e nunca
 * é impresso. Rode na VPS.
 */
import fs from "node:fs";
import path from "node:path";

const ARQ_TOKEN = "/root/.extensaofacil-admin-api-token";
const BASE = process.env.EF_API || "https://extensaofacil.com.br/admin/api";
const TOKEN = (process.env.ADMIN_API_TOKEN || (fs.existsSync(ARQ_TOKEN) ? fs.readFileSync(ARQ_TOKEN, "utf-8") : "")).trim();

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const SEM_PUBLICAR = args.includes("--sem-publicar");
const pasta = args.find((a) => !a.startsWith("--"));

if (!pasta) {
  console.error("uso: node cms/carga.mjs <pasta-com-json> [--dry] [--sem-publicar]");
  process.exit(1);
}
if (!TOKEN) {
  console.error(`sem token: defina ADMIN_API_TOKEN ou deixe ${ARQ_TOKEN} legível.`);
  process.exit(1);
}

const cabecalho = { "content-type": "application/json", authorization: `Bearer ${TOKEN}` };

async function api(metodo, rota, corpo) {
  const res = await fetch(`${BASE}${rota}`, {
    method: metodo,
    headers: cabecalho,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const texto = await res.text();
  if (!res.ok) throw new Error(`${metodo} ${rota} -> ${res.status}: ${texto.slice(0, 300)}`);
  return texto ? JSON.parse(texto) : null;
}

const arquivos = fs.readdirSync(pasta).filter((f) => f.endsWith(".json")).sort();
if (!arquivos.length) {
  console.error(`nenhum .json em ${pasta}`);
  process.exit(1);
}

const slugs = [];
for (const arquivo of arquivos) {
  const bruto = JSON.parse(fs.readFileSync(path.join(pasta, arquivo), "utf-8"));
  const { _merge, _comentario, ...pagina } = bruto;
  if (!pagina.slug) throw new Error(`${arquivo}: falta o campo slug`);
  slugs.push(pagina.slug);

  let corpo = pagina;
  if (_merge) {
    // remendo: a página inteira volta da API e só os campos do arquivo mudam
    const atual = await api("GET", `/pages/detail?slug=${encodeURIComponent(pagina.slug)}`);
    const { route, words, createdAt, updatedAt, ...base } = atual;
    corpo = { ...base, ...pagina };
  }

  if (DRY) {
    console.log(`[dry] ${_merge ? "MERGE" : "PUT  "} ${pagina.slug.padEnd(46)} ` +
      `${(corpo.sections || []).length} seções, ${(corpo.faq || []).length} perguntas`);
    continue;
  }
  const salvo = await api("PUT", "/pages/detail", corpo);
  console.log(`${_merge ? "fundida " : "gravada "} ${pagina.slug.padEnd(46)} ${salvo.words} palavras`);
}

if (DRY) {
  console.log(`\n[dry] publicaria ${slugs.length} rota(s)`);
  process.exit(0);
}
if (SEM_PUBLICAR) {
  console.log(`\n${slugs.length} página(s) gravadas. Publique pelo painel quando quiser.`);
  process.exit(0);
}

console.log(`\npublicando ${slugs.length} página(s)...`);
const r = await api("POST", "/publish", { slugs });
console.log(`ok em ${r.ms} ms — ${r.rendered.length} rotas renderizadas, ${r.indexed} URLs no sitemap`);
if (r.missing?.length) console.log(`sem conteúdo (404 de propósito): ${r.missing.join(", ")}`);
if (r.failures?.length) {
  console.error(`FALHAS: ${r.failures.join(" | ")}`);
  process.exit(1);
}
