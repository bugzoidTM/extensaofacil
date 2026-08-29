/** Acesso ao content.db e a forma canônica do conteúdo (o mesmo JSON que o site consome). */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export const CMS_DIR = path.resolve(import.meta.dirname);
export const REPO_DIR = path.resolve(CMS_DIR, "..");
export const DB_PATH = process.env.CONTENT_DB || path.join(CMS_DIR, "content.db");

export function openDb() {
  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  db.exec(fs.readFileSync(path.join(CMS_DIR, "schema.sql"), "utf-8"));
  // `CREATE TABLE IF NOT EXISTS` não acrescenta coluna em tabela que já existe, então
  // a migração precisa vir aqui — e no openDb, não no server, para o export e o import
  // também enxergarem a coluna quando rodam sozinhos.
  try { db.prepare("SELECT faq FROM pages LIMIT 1").get(); }
  catch { db.exec("ALTER TABLE pages ADD COLUMN faq TEXT NOT NULL DEFAULT '[]'"); }
  return db;
}

export type Db = ReturnType<typeof openDb>;

const j = (v: string) => JSON.parse(v);

export type PageRow = {
  slug: string; kind: string; title: string; description: string; eyebrow: string | null;
  quick_answer: string | null; intent: string; tags: string; related: string; extra: string; faq: string;
  author_slug: string | null; published: number; reviewed_at: string | null;
  created_at: string; updated_at: string;
};

/** Uma página com seções e fontes, no formato usado pelo painel e pela API. */
export function getPage(db: Db, slug: string) {
  const row = db.prepare("SELECT * FROM pages WHERE slug = ?").get(slug) as PageRow | undefined;
  if (!row) return null;
  return {
    slug: row.slug, kind: row.kind, title: row.title, description: row.description,
    eyebrow: row.eyebrow ?? "", quickAnswer: row.quick_answer ?? "", intent: row.intent,
    tags: j(row.tags), related: j(row.related), extra: j(row.extra), faq: j(row.faq ?? "[]"),
    author: row.author_slug, published: !!row.published, reviewedAt: row.reviewed_at,
    createdAt: row.created_at, updatedAt: row.updated_at,
    sections: (db.prepare("SELECT title, paragraphs, bullets FROM sections WHERE page_slug = ? ORDER BY position").all(slug) as any[])
      .map((s) => ({ title: s.title, paragraphs: j(s.paragraphs), bullets: j(s.bullets) })),
    sources: (db.prepare("SELECT institution, title, url, accessed_at FROM sources WHERE page_slug = ? ORDER BY position").all(slug) as any[])
      .map((s) => ({ institution: s.institution, title: s.title, url: s.url, accessedAt: s.accessed_at })),
  };
}

export type PageInput = Partial<ReturnType<typeof getPage>> & { slug: string };

export function savePage(db: Db, input: any) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const atual = getPage(db, input.slug);
  const exists = !!atual;

  // Um cliente que não conhece o campo `extra` mandava `{}` e apagava name, summary e
  // tone da faculdade — a página passou a renderizar "Projeto de Extensão undefined".
  // Campo ausente ou objeto vazio preserva o que já está gravado.
  const extra = input.extra && Object.keys(input.extra).length ? input.extra : (atual?.extra ?? {});
  // Mesma armadilha do `extra`: o painel antigo não conhece `faq` e mandaria a página
  // inteira sem o campo. Ausente preserva o que está gravado; `[]` explícito apaga.
  const faq = input.faq === undefined ? (atual?.faq ?? []) : input.faq;
  const values = {
    slug: input.slug,
    kind: input.kind ?? "guide",
    title: input.title ?? "",
    description: input.description ?? "",
    eyebrow: input.eyebrow ?? "",
    quick_answer: input.quickAnswer ?? "",
    intent: input.intent ?? "informational",
    tags: JSON.stringify(input.tags ?? []),
    related: JSON.stringify(input.related ?? []),
    extra: JSON.stringify(extra),
    faq: JSON.stringify(faq),
    author_slug: input.author ?? null,
    published: input.published === false ? 0 : 1,
    reviewed_at: input.reviewedAt ?? null,
    updated_at: now,
  };

  const tx = db.transaction(() => {
    if (exists) {
      db.prepare(`UPDATE pages SET kind=@kind, title=@title, description=@description, eyebrow=@eyebrow,
        quick_answer=@quick_answer, intent=@intent, tags=@tags, related=@related, extra=@extra, faq=@faq,
        author_slug=@author_slug, published=@published, reviewed_at=@reviewed_at, updated_at=@updated_at
        WHERE slug=@slug`).run(values);
    } else {
      db.prepare(`INSERT INTO pages (slug, kind, title, description, eyebrow, quick_answer, intent, tags,
        related, extra, faq, author_slug, published, reviewed_at, updated_at)
        VALUES (@slug, @kind, @title, @description, @eyebrow, @quick_answer, @intent, @tags,
        @related, @extra, @faq, @author_slug, @published, @reviewed_at, @updated_at)`).run(values);
    }
    if (input.sections) {
      db.prepare("DELETE FROM sections WHERE page_slug = ?").run(input.slug);
      const ins = db.prepare("INSERT INTO sections (page_slug, position, title, paragraphs, bullets) VALUES (?,?,?,?,?)");
      input.sections.forEach((s: any, i: number) =>
        ins.run(input.slug, i, s.title ?? "", JSON.stringify(s.paragraphs ?? []), JSON.stringify(s.bullets ?? [])));
    }
    if (input.sources) {
      db.prepare("DELETE FROM sources WHERE page_slug = ?").run(input.slug);
      const ins = db.prepare("INSERT INTO sources (page_slug, position, institution, title, url, accessed_at) VALUES (?,?,?,?,?,?)");
      input.sources.forEach((s: any, i: number) =>
        ins.run(input.slug, i, s.institution ?? "", s.title ?? "", s.url ?? null, s.accessedAt ?? null));
    }
  });
  tx();
  return getPage(db, input.slug);
}

/** A rota pública de uma página, do jeito que o App a serve. */
export function routeOf(page: { kind: string; slug: string }) {
  if (page.kind === "course") return `/cursos/${page.slug}/`;
  if (page.kind === "institution") return `/faculdades/${page.slug}/`;
  return `/${page.slug}/`;
}
