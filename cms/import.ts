/**
 * Reconstrói o content.db a partir do snapshot versionado em
 * client/public/content/portal-data.json.
 *
 * Foi assim que o conteúdo saiu do portalData.ts na migração inicial, e é o caminho
 * de recuperação se o banco for perdido: o JSON está no git, então nada some.
 *
 *   npx tsx cms/import.ts            # a partir do snapshot do repo
 *   npx tsx cms/import.ts arquivo.json
 */
import fs from "node:fs";
import path from "node:path";
import { openDb, savePage, REPO_DIR } from "./db";

const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function toIso(br: string | undefined | null): string | null {
  if (!br) return null;
  const m = br.match(/(\d{1,2})\s+de\s+([a-zçã]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const mes = MESES.indexOf(m[2].toLowerCase());
  return mes < 0 ? null : `${m[3]}-${String(mes + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

const file = process.argv[2] || path.join(REPO_DIR, "client", "public", "content", "portal-data.json");
const data = JSON.parse(fs.readFileSync(file, "utf-8"));
const db = openDb();

const insAuthor = db.prepare("INSERT OR REPLACE INTO authors (slug, name, role, bio) VALUES (?,?,?,?)");
for (const a of data.authors ?? []) insAuthor.run(a.slug, a.name, a.role ?? null, a.bio ?? null);
if (!(data.authors ?? []).length) {
  insAuthor.run("equipe-extensao-facil", "Equipe Extensão Fácil", "Redação",
    "Conteúdo produzido e revisado pela equipe editorial do Extensão Fácil.");
}

let n = 0;
for (const g of data.guides ?? []) {
  savePage(db, {
    slug: g.slug, kind: "guide", title: g.title, description: g.description, eyebrow: g.eyebrow,
    quickAnswer: g.quickAnswer, tags: g.tags, related: g.related,
    author: g.author ?? "equipe-extensao-facil", reviewedAt: toIso(g.updated),
    intent: g.intent ?? "informational",
    sections: (g.sections ?? []).map((s: any) => ({ title: s.title, paragraphs: s.paragraphs ?? [], bullets: s.bullets ?? [] })),
    sources: g.sources ?? [],
  });
  n++;
}
for (const c of data.courses ?? []) {
  savePage(db, {
    slug: c.slug, kind: "course", title: `Projeto de Extensão em ${c.name}`, description: c.summary,
    eyebrow: "Guia por curso", tags: [c.name], related: [], author: "equipe-extensao-facil",
    intent: c.intent ?? "commercial-assist",
    extra: { name: c.name, short: c.short, summary: c.summary, accent: c.accent, ideas: c.ideas, places: c.places, ods: c.ods },
  });
  n++;
}
for (const i of data.institutions ?? []) {
  savePage(db, {
    slug: i.slug, kind: "institution", title: `Projeto de Extensão ${i.name}`, description: i.summary,
    eyebrow: "Guia por faculdade", tags: [i.name], related: [], author: "equipe-extensao-facil",
    intent: i.intent ?? "institutional", reviewedAt: toIso(i.reviewedAt),
    extra: { name: i.name, summary: i.summary, tone: i.tone },
  });
  n++;
}

const col = db.prepare("INSERT OR REPLACE INTO collections (name, value) VALUES (?, ?)");
col.run("odsList", JSON.stringify(data.odsList ?? []));
col.run("checklistItems", JSON.stringify(data.checklistItems ?? []));

console.log(`content.db reconstruído de ${path.relative(REPO_DIR, file)}: ${n} páginas`);
