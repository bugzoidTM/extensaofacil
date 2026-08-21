/**
 * Painel de conteúdo do Extensão Fácil.
 *
 * O site público continua estático: este servidor só edita o content.db e, ao publicar,
 * regrava content/portal-data.json e re-renderiza as rotas afetadas. Ninguém do público
 * passa por aqui.
 */
import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { openDb, getPage, savePage, routeOf, CMS_DIR, REPO_DIR } from "./db";
import { exportContent } from "./export";
import { renderIncremental, allRoutes } from "../scripts/prerender";

const PORT = Number(process.env.PORT || 8095);
/** Lê de um arquivo quando existir (docker secret), senão da env. */
function fromFileOrEnv(name: string, fallback = "") {
  const file = process.env[`${name}_FILE`];
  if (file && fs.existsSync(file)) return fs.readFileSync(file, "utf-8").trim();
  return process.env[name] || fallback;
}

const PASSWORD = fromFileOrEnv("ADMIN_PASSWORD");
const SECRET = fromFileOrEnv("ADMIN_SECRET", crypto.randomBytes(32).toString("hex"));
const COOKIE = "ef_admin";
const SESSION_HOURS = 24 * 14;

if (!PASSWORD) {
  console.error("ADMIN_PASSWORD não definido — recusando subir sem senha.");
  process.exit(1);
}

const db = openDb();
const app = express();
app.use(express.json({ limit: "4mb" }));
app.set("trust proxy", true);

// ---------------------------------------------------------------- autenticação

const sign = (value: string) => crypto.createHmac("sha256", SECRET).update(value).digest("hex");

function issueToken() {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  return `${exp}.${sign(String(exp))}`;
}

function validToken(token: string | undefined) {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  return mac.length === expected.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

const readCookie = (req: express.Request) =>
  Object.fromEntries((req.headers.cookie || "").split(";").map((c) => {
    const i = c.indexOf("=");
    return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1))];
  }))[COOKIE];

// tentativas de login por IP, para não deixar a senha aberta a força bruta
const attempts = new Map<string, { n: number; until: number }>();

app.post("/api/login", (req, res) => {
  const ip = req.ip || "?";
  const state = attempts.get(ip);
  if (state && state.until > Date.now()) {
    return res.status(429).json({ error: "Muitas tentativas. Tente de novo em alguns minutos." });
  }
  const sent = String(req.body?.password ?? "");
  const ok = sent.length === PASSWORD.length &&
    crypto.timingSafeEqual(Buffer.from(sent), Buffer.from(PASSWORD));
  if (!ok) {
    const n = (state?.n ?? 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 10 * 60_000 : 0 });
    return res.status(401).json({ error: "Senha incorreta." });
  }
  attempts.delete(ip);
  res.setHeader("Set-Cookie",
    `${COOKIE}=${issueToken()}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_HOURS * 3600}`);
  res.json({ ok: true });
});

app.post("/api/logout", (_req, res) => {
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
  res.json({ ok: true });
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // a API também aceita um token fixo, para o n8n ou um agente publicarem sem sessão
  const bearer = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const apiToken = fromFileOrEnv("ADMIN_API_TOKEN");
  if (validToken(readCookie(req)) || (apiToken && bearer === apiToken)) return next();
  res.status(401).json({ error: "não autenticado" });
}

// ---------------------------------------------------------------------- páginas

const wordCount = (page: any) =>
  [page.quickAnswer, ...page.sections.flatMap((s: any) => [s.title, ...s.paragraphs, ...s.bullets])]
    .join(" ").trim().split(/\s+/).filter(Boolean).length;

const lastPublishAt = () =>
  (db.prepare("SELECT at FROM publish_log WHERE ok = 1 ORDER BY id DESC LIMIT 1").get() as any)?.at ?? null;

app.get("/api/pages", requireAuth, (_req, res) => {
  const rows = db.prepare("SELECT slug, kind, title, intent, published, updated_at, reviewed_at FROM pages ORDER BY kind, slug").all() as any[];
  const since = lastPublishAt();
  res.json(rows.map((r) => {
    const page = getPage(db, r.slug)!;
    return {
      slug: r.slug, kind: r.kind, title: r.title, intent: r.intent,
      published: !!r.published, updatedAt: r.updated_at, reviewedAt: r.reviewed_at,
      route: routeOf(r), sections: page.sections.length, words: wordCount(page),
      pending: !since || r.updated_at > since,
    };
  }));
});

app.get("/api/pages/detail", requireAuth, (req, res) => {
  const page = getPage(db, String(req.query.slug ?? ""));
  if (!page) return res.status(404).json({ error: "página não encontrada" });
  res.json({ ...page, route: routeOf(page), words: wordCount(page) });
});

app.put("/api/pages/detail", requireAuth, (req, res) => {
  const body = req.body ?? {};
  if (!body.slug) return res.status(400).json({ error: "slug obrigatório" });
  if (!/^[a-z0-9/-]+$/.test(body.slug)) return res.status(400).json({ error: "slug inválido" });
  const saved = savePage(db, body);
  res.json({ ...saved, route: routeOf(saved!), words: wordCount(saved) });
});

app.delete("/api/pages/detail", requireAuth, (req, res) => {
  const slug = String(req.query.slug ?? "");
  const page = getPage(db, slug);
  if (!page) return res.status(404).json({ error: "página não encontrada" });
  db.prepare("DELETE FROM pages WHERE slug = ?").run(slug);
  res.json({ ok: true, route: routeOf(page) });
});

app.get("/api/authors", requireAuth, (_req, res) => {
  res.json(db.prepare("SELECT slug, name, role, bio FROM authors ORDER BY name").all());
});

app.get("/api/collections/:name", requireAuth, (req, res) => {
  const row = db.prepare("SELECT value FROM collections WHERE name = ?").get(req.params.name) as any;
  res.json(row ? JSON.parse(row.value) : []);
});

app.put("/api/collections/:name", requireAuth, (req, res) => {
  db.prepare("INSERT OR REPLACE INTO collections (name, value) VALUES (?, ?)")
    .run(req.params.name, JSON.stringify(req.body ?? []));
  res.json({ ok: true });
});

// -------------------------------------------------------------------- publicar

let publishing: Promise<any> | null = null;

app.post("/api/publish", requireAuth, async (req, res) => {
  if (publishing) return res.status(409).json({ error: "já existe uma publicação em andamento" });

  const only: string[] = Array.isArray(req.body?.slugs) ? req.body.slugs : [];
  const run = (async () => {
    const started = Date.now();
    // O JSON sai primeiro: a partir daqui o site já serve o conteúdo novo para quem
    // navega com JavaScript. A re-renderização abaixo é o que atualiza o HTML que os
    // crawlers leem.
    const { bytes } = exportContent(db);

    const routes = only.length
      ? [...new Set(only.map((slug) => {
          const page = getPage(db, slug);
          return page ? routeOf(page) : null;
        }).filter(Boolean) as string[])]
      : allRoutes();

    // hubs que listam o conteúdo alterado também precisam ser regravados
    const hubs = new Set<string>(["/", "/buscar/"]);
    for (const r of routes) {
      if (r.startsWith("/cursos/")) hubs.add("/cursos/");
      else if (r.startsWith("/faculdades/")) hubs.add("/faculdades/");
      else hubs.add("/guias/");
    }
    const target = [...new Set([...routes, ...(only.length ? [...hubs] : [])])];

    const result = await renderIncremental(target);
    const ms = Date.now() - started;
    db.prepare("INSERT INTO publish_log (routes, ok, detail) VALUES (?,?,?)").run(
      JSON.stringify(target), result.failures.length ? 0 : 1,
      JSON.stringify({ ms, bytes, indexed: result.indexed, missing: result.missing, failures: result.failures }));
    return { ...result, ms, routes: target };
  })();

  publishing = run;
  try {
    res.json(await run);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  } finally {
    publishing = null;
  }
});

app.get("/api/status", requireAuth, (_req, res) => {
  const last = db.prepare("SELECT at, routes, ok, detail FROM publish_log ORDER BY id DESC LIMIT 1").get() as any;
  const since = lastPublishAt();
  const pending = db.prepare("SELECT COUNT(*) n FROM pages WHERE ? IS NULL OR updated_at > ?").get(since, since) as any;
  res.json({
    lastPublish: last ? { at: last.at, ok: !!last.ok, routes: JSON.parse(last.routes).length, detail: JSON.parse(last.detail || "{}") } : null,
    pending: pending.n,
    publishing: !!publishing,
  });
});

// ------------------------------------------------------------------------ painel

app.use(express.static(path.join(CMS_DIR, "public")));
app.get("*", (_req, res) => res.sendFile(path.join(CMS_DIR, "public", "index.html")));

app.listen(PORT, () => {
  console.log(`painel de conteúdo em :${PORT} — banco ${path.relative(REPO_DIR, process.env.CONTENT_DB || path.join(CMS_DIR, "content.db"))}`);
});
