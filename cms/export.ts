/**
 * content.db -> content/portal-data.json
 *
 * O JSON é gravado em dois lugares: dist/public (servido na hora pelo nginx, é o que
 * torna a publicação instantânea) e client/public (vai para o git, então o conteúdo
 * fica versionado e um clone limpo builda sem precisar do banco).
 */
import fs from "node:fs";
import path from "node:path";
import { openDb, REPO_DIR, type Db } from "./db";

const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const brDate = (iso: string | null) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
};

const j = (v: string) => JSON.parse(v);

export function buildPayload(db: Db) {
  const pages = db.prepare("SELECT * FROM pages WHERE published = 1 ORDER BY slug").all() as any[];
  const sections = db.prepare("SELECT * FROM sections ORDER BY page_slug, position").all() as any[];
  const sources = db.prepare("SELECT * FROM sources ORDER BY page_slug, position").all() as any[];
  const authors = db.prepare("SELECT * FROM authors").all() as any[];
  const byPage = <T extends { page_slug: string }>(rows: T[], slug: string) => rows.filter((r) => r.page_slug === slug);

  const guides = pages.filter((p) => p.kind === "guide").map((p) => ({
    slug: p.slug, title: p.title, description: p.description, eyebrow: p.eyebrow ?? "",
    updated: brDate(p.reviewed_at), tags: j(p.tags), quickAnswer: p.quick_answer ?? "",
    sections: byPage(sections, p.slug).map((s) => ({
      title: s.title, paragraphs: j(s.paragraphs),
      ...(j(s.bullets).length ? { bullets: j(s.bullets) } : {}),
    })),
    related: j(p.related),
    intent: p.intent,
    ...(j(p.faq ?? "[]").length ? { faq: j(p.faq ?? "[]") } : {}),
    author: p.author_slug,
    sources: byPage(sources, p.slug).map((s) => ({ institution: s.institution, title: s.title, url: s.url, accessedAt: s.accessed_at })),
  }));

  const courses = pages.filter((p) => p.kind === "course").map((p) => {
    const e = j(p.extra);
    return {
      slug: p.slug, name: e.name, short: e.short, summary: e.summary, accent: e.accent,
      ideas: e.ideas ?? [], places: e.places ?? [], ods: e.ods ?? [], intent: p.intent,
      // Mesmo motivo das faculdades: sem isto o hub de curso cai no texto montado
      // por template dentro do componente, igual para os nove cursos.
      title: p.title, description: p.description, quickAnswer: p.quick_answer ?? "",
      reviewedAt: brDate(p.reviewed_at), tags: j(p.tags), related: j(p.related),
      ...(j(p.faq ?? "[]").length ? { faq: j(p.faq ?? "[]") } : {}),
      sections: byPage(sections, p.slug).map((s) => ({
        title: s.title, paragraphs: j(s.paragraphs),
        ...(j(s.bullets).length ? { bullets: j(s.bullets) } : {}),
      })),
      sources: byPage(sources, p.slug).map((s) => ({ institution: s.institution, title: s.title, url: s.url, accessedAt: s.accessed_at })),
    };
  });

  const institutions = pages.filter((p) => p.kind === "institution").map((p) => {
    const e = j(p.extra);
    return {
      slug: p.slug, name: e.name, summary: e.summary, tone: e.tone,
      reviewedAt: brDate(p.reviewed_at), intent: p.intent,
      // Sem isto a página de faculdade cai no texto fixo do componente — que é o
      // mesmo para todas, exatamente o problema do §18 do PRD.
      title: p.title, description: p.description, quickAnswer: p.quick_answer ?? "",
      tags: j(p.tags), related: j(p.related),
      ...(j(p.faq ?? "[]").length ? { faq: j(p.faq ?? "[]") } : {}),
      sections: byPage(sections, p.slug).map((s) => ({
        title: s.title, paragraphs: j(s.paragraphs),
        ...(j(s.bullets).length ? { bullets: j(s.bullets) } : {}),
      })),
      sources: byPage(sources, p.slug).map((s) => ({ institution: s.institution, title: s.title, url: s.url, accessedAt: s.accessed_at })),
    };
  });

  const collection = (name: string) => {
    const row = db.prepare("SELECT value FROM collections WHERE name = ?").get(name) as { value: string } | undefined;
    return row ? j(row.value) : [];
  };

  return {
    generatedAt: new Date().toISOString(),
    guides, courses, institutions,
    odsList: collection("odsList"),
    checklistItems: collection("checklistItems"),
    authors: authors.map((a) => ({ slug: a.slug, name: a.name, role: a.role, bio: a.bio })),
  };
}

export function exportContent(db: Db) {
  const payload = buildPayload(db);
  const json = JSON.stringify(payload);
  const targets = [
    path.join(REPO_DIR, "dist", "public", "content", "portal-data.json"),
    path.join(REPO_DIR, "client", "public", "content", "portal-data.json"),
  ];
  for (const file of targets) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, json);
  }
  return { payload, bytes: json.length, targets };
}

if (import.meta.filename === process.argv[1]) {
  const db = openDb();
  const { payload, bytes } = exportContent(db);
  console.log(`content/portal-data.json: ${(bytes / 1024).toFixed(1)} kB — ` +
    `${payload.guides.length} guias, ${payload.courses.length} cursos, ${payload.institutions.length} faculdades`);
}
