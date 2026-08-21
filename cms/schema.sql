-- Fonte da verdade do conteúdo editorial do Extensão Fácil.
-- O site público continua estático: publicar exporta este banco para
-- content/portal-data.json e regrava o HTML pré-renderizado das rotas afetadas.

PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS authors (
  slug        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  bio         TEXT
);

CREATE TABLE IF NOT EXISTS pages (
  slug         TEXT PRIMARY KEY,          -- 'relatorio-final', 'cursos/pedagogia/ideias'
  kind         TEXT NOT NULL,             -- guide | course | institution
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  eyebrow      TEXT,
  quick_answer TEXT,
  -- informational | utility | institutional | commercial-assist (PRD §60)
  intent       TEXT NOT NULL DEFAULT 'informational',
  tags         TEXT NOT NULL DEFAULT '[]',   -- JSON
  related      TEXT NOT NULL DEFAULT '[]',   -- JSON de slugs
  extra        TEXT NOT NULL DEFAULT '{}',   -- JSON: campos por tipo (accent, ideas, places, ods, tone...)
  author_slug  TEXT REFERENCES authors(slug),
  published    INTEGER NOT NULL DEFAULT 1,
  -- Data mostrada na página. Só muda em revisão de verdade (PRD §49), por isso
  -- é separada de updated_at, que registra qualquer gravação.
  reviewed_at  TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sections (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  page_slug  TEXT NOT NULL REFERENCES pages(slug) ON DELETE CASCADE,
  position   INTEGER NOT NULL,
  title      TEXT NOT NULL,
  paragraphs TEXT NOT NULL DEFAULT '[]',  -- JSON
  bullets    TEXT NOT NULL DEFAULT '[]'   -- JSON
);
CREATE INDEX IF NOT EXISTS idx_sections_page ON sections(page_slug, position);

-- PRD §48: bloco "Fontes consultadas" no fim do conteúdo.
CREATE TABLE IF NOT EXISTS sources (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  page_slug   TEXT NOT NULL REFERENCES pages(slug) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  institution TEXT NOT NULL,
  title       TEXT NOT NULL,
  url         TEXT,
  accessed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sources_page ON sources(page_slug, position);

-- Listas globais que hoje vivem no portalData (ODS, checklist).
CREATE TABLE IF NOT EXISTS collections (
  name  TEXT PRIMARY KEY,   -- 'odsList' | 'checklistItems'
  value TEXT NOT NULL       -- JSON
);

-- Trilha de publicações, para saber o que mudou e quando.
CREATE TABLE IF NOT EXISTS publish_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  at         TEXT NOT NULL DEFAULT (datetime('now')),
  routes     TEXT NOT NULL,
  ok         INTEGER NOT NULL,
  detail     TEXT
);
