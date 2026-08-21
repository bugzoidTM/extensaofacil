/* Painel de conteúdo — sem framework e sem build: um arquivo, servido como está. */

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const k of kids.flat()) node.append(k?.nodeType ? k : document.createTextNode(k ?? ""));
  return node;
};

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401) { state.authed = false; render(); throw new Error("sessão expirada"); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
};

const state = {
  authed: false, pages: [], authors: [], current: null, dirty: false,
  filter: "", kind: "", soRascunhos: false, msg: null, status: null, busy: false,
};

const KINDS = { guide: "Guia", course: "Curso", institution: "Faculdade" };
const INTENTS = ["informational", "utility", "institutional", "commercial-assist"];

/* ---------------------------------------------------------------- utilidades */

// Parágrafos são editados como texto corrido separado por linha em branco.
const toParagraphs = (text) => text.split(/\n\s*\n/).map((p) => p.trim().replace(/\s*\n\s*/g, " ")).filter(Boolean);
const fromParagraphs = (arr) => (arr || []).join("\n\n");
const toLines = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);

function setMsg(text, kind = "ok") { state.msg = text ? { text, kind } : null; render(); }

/* -------------------------------------------------------------------- login */

function loginView() {
  const input = el("input", { type: "password", placeholder: "senha", autofocus: true });
  const err = el("p", { className: "msg err" });
  const submit = async () => {
    try {
      await api("api/login", { method: "POST", body: { password: input.value } });
      state.authed = true;
      await loadAll();
    } catch (e) { err.textContent = e.message; }
  };
  input.onkeydown = (e) => e.key === "Enter" && submit();
  return el("div", { className: "login" },
    el("h1", {}, "Conteúdo · Extensão Fácil"),
    el("p", {}, "Painel de edição do portal."),
    el("div", { className: "field" }, input),
    el("button", { className: "primary", onclick: submit, style: "width:100%" }, "Entrar"),
    err);
}

/* --------------------------------------------------------------------- lista */

function listView() {
  const search = el("input", { placeholder: "filtrar por título ou slug", value: state.filter });
  search.oninput = () => { state.filter = search.value; renderList(); };
  const kind = el("select");
  kind.append(el("option", { value: "" }, "todos os tipos"),
    ...Object.entries(KINDS).map(([v, l]) => el("option", { value: v, selected: state.kind === v }, l)));
  kind.onchange = () => { state.kind = kind.value; renderList(); };

  const rascunhos = state.pages.filter((p) => !p.published).length;
  const filtroRascunho = el("button", {
    className: state.soRascunhos ? "primary" : "",
    onclick: () => { state.soRascunhos = !state.soRascunhos; render(); },
  }, state.soRascunhos ? `mostrando só rascunhos (${rascunhos})` : `ver só rascunhos (${rascunhos})`);

  const items = el("div", { id: "items" });
  const box = el("div", { className: "panel list" },
    el("header", {}, search, kind,
      rascunhos ? filtroRascunho : "",
      el("button", { onclick: newPage }, "+ Nova página")), items);
  renderList(items);
  return box;
}

function renderList(container = $("#items")) {
  if (!container) return;
  const q = state.filter.toLowerCase();
  const rows = state.pages.filter((p) =>
    (!state.kind || p.kind === state.kind) &&
    (!state.soRascunhos || !p.published) &&
    (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q)));
  container.replaceChildren(...rows.map((p) => {
    const btn = el("button", {
      className: "item" + (state.current?.slug === p.slug ? " active" : ""),
      onclick: () => openPage(p.slug),
    },
      el("b", {}, p.title || p.slug),
      el("span", {}, `${p.route} · ${p.words} palavras · ${p.resumo}`));
    if (p.pending) btn.querySelector("b").append(el("span", { className: "tag pending" }, "não publicado"));
    if (!p.published) btn.querySelector("b").append(el("span", { className: "tag off" }, "rascunho"));
    return btn;
  }));
  if (!rows.length) container.replaceChildren(el("p", { className: "empty" }, "Nada encontrado."));
}

/* -------------------------------------------------------------------- editor */

function field(label, input, hint) {
  return el("div", { className: "field" }, el("label", {}, label), hint ? el("p", { className: "hint" }, hint) : "", input);
}

function bind(obj, key, input, transform = (v) => v) {
  input.oninput = () => { obj[key] = transform(input.value); state.dirty = true; markDirty(); };
  return input;
}

function markDirty() {
  const b = $("#save");
  if (b) { b.disabled = false; b.textContent = "Salvar alterações"; }
}

function sectionEditor(page) {
  const wrap = el("div");
  const draw = () => {
    wrap.replaceChildren(...page.sections.map((s, i) => {
      const title = bind(s, "title", el("input", { value: s.title, placeholder: "Título da seção" }));
      const paras = bind(s, "paragraphs", el("textarea", { value: fromParagraphs(s.paragraphs) }), toParagraphs);
      const bullets = bind(s, "bullets", el("textarea", { value: (s.bullets || []).join("\n"), style: "min-height:70px" }), toLines);
      const move = (delta) => {
        const j = i + delta;
        if (j < 0 || j >= page.sections.length) return;
        [page.sections[i], page.sections[j]] = [page.sections[j], page.sections[i]];
        state.dirty = true; markDirty(); draw();
      };
      return el("div", { className: "section" },
        el("div", { className: "head" }, title,
          el("button", { onclick: () => move(-1), title: "subir" }, "↑"),
          el("button", { onclick: () => move(1), title: "descer" }, "↓"),
          el("button", { className: "danger", onclick: () => { page.sections.splice(i, 1); state.dirty = true; markDirty(); draw(); } }, "remover")),
        field("Parágrafos", paras, "Uma linha em branco separa um parágrafo do outro."),
        field("Lista (opcional)", bullets, "Um item por linha."));
    }),
      el("button", { onclick: () => { page.sections.push({ title: "", paragraphs: [], bullets: [] }); state.dirty = true; markDirty(); draw(); } },
        "+ Adicionar seção"));
  };
  draw();
  return wrap;
}

function sourceEditor(page) {
  const wrap = el("div");
  const draw = () => {
    wrap.replaceChildren(...page.sources.map((s, i) =>
      el("div", { className: "section" },
        el("div", { className: "row" },
          field("Instituição", bind(s, "institution", el("input", { value: s.institution || "" }))),
          field("Título", bind(s, "title", el("input", { value: s.title || "" })))),
        el("div", { className: "row" },
          field("URL", bind(s, "url", el("input", { value: s.url || "", placeholder: "https://" }))),
          field("Acesso em", bind(s, "accessedAt", el("input", { value: s.accessedAt || "", placeholder: "2026-08-21" })))),
        el("button", { className: "danger", onclick: () => { page.sources.splice(i, 1); state.dirty = true; markDirty(); draw(); } }, "remover fonte"))),
      el("button", { onclick: () => { page.sources.push({ institution: "", title: "", url: "", accessedAt: "" }); state.dirty = true; markDirty(); draw(); } },
        "+ Adicionar fonte"));
  };
  draw();
  return wrap;
}

function extraEditor(page) {
  if (page.kind === "course") {
    const e = page.extra;
    return el("div", {},
      el("div", { className: "row" },
        field("Nome do curso", bind(e, "name", el("input", { value: e.name || "" }))),
        field("Nome curto", bind(e, "short", el("input", { value: e.short || "" }))),
        field("Cor de destaque", bind(e, "accent", el("input", { value: e.accent || "" })))),
      field("Resumo", bind(e, "summary", el("textarea", { value: e.summary || "", style: "min-height:60px" }))),
      el("div", { className: "row" },
        field("Ideias", bind(e, "ideas", el("textarea", { value: (e.ideas || []).join("\n") }), toLines), "Uma por linha."),
        field("Locais", bind(e, "places", el("textarea", { value: (e.places || []).join("\n") }), toLines), "Um por linha."),
        field("ODS", bind(e, "ods", el("textarea", { value: (e.ods || []).join("\n") }), toLines), "Um por linha, ex.: ODS 4")));
  }
  if (page.kind === "institution") {
    const e = page.extra;
    return el("div", { className: "row" },
      field("Nome", bind(e, "name", el("input", { value: e.name || "" }))),
      field("Cor", bind(e, "tone", el("input", { value: e.tone || "" }))),
      field("Resumo", bind(e, "summary", el("input", { value: e.summary || "" }))));
  }
  return el("div");
}

function editorView() {
  const page = state.current;
  if (!page) return el("div", { className: "panel" }, el("p", { className: "empty" }, "Escolha uma página à esquerda para editar."));

  const intent = el("select");
  intent.append(...INTENTS.map((v) => el("option", { value: v, selected: page.intent === v }, v)));
  intent.onchange = () => { page.intent = intent.value; state.dirty = true; markDirty(); };

  const author = el("select");
  author.append(el("option", { value: "" }, "—"),
    ...state.authors.map((a) => el("option", { value: a.slug, selected: page.author === a.slug }, a.name)));
  author.onchange = () => { page.author = author.value || null; state.dirty = true; markDirty(); };

  const published = el("input", { type: "checkbox", checked: page.published, style: "width:auto" });
  published.onchange = () => { page.published = published.checked; state.dirty = true; markDirty(); };

  const body = el("div", { className: "editor" },
    el("h2", {}, page.title || page.slug),
    el("div", { className: "route" }, page.route, " · ", KINDS[page.kind] || page.kind, " · ", `${page.words} palavras`),
    el("label", { className: "publish-toggle" + (page.published ? "" : " off") },
      published,
      el("span", {}, page.published
        ? "Publicada — sai no site na próxima publicação."
        : "RASCUNHO — não vai ao ar nem no \"Publicar tudo\". Marque aqui para aprovar.")),

    field("Título", bind(page, "title", el("input", { value: page.title }))),
    field("Descrição (meta description)", bind(page, "description", el("textarea", { value: page.description, style: "min-height:60px" })),
      "Aparece no Google e no preview de link. Entre 120 e 160 caracteres funciona melhor."),
    el("div", { className: "row" },
      field("Chapéu", bind(page, "eyebrow", el("input", { value: page.eyebrow }))),
      field("Intenção de busca", intent),
      field("Autor", author)),
    field("Resposta rápida", bind(page, "quickAnswer", el("textarea", { value: page.quickAnswer })),
      "O parágrafo que responde a dúvida logo de cara — é o trecho que os motores de resposta costumam citar."),
    el("div", { className: "row" },
      field("Tags", bind(page, "tags", el("input", { value: (page.tags || []).join(", ") }), (v) => v.split(",").map((t) => t.trim()).filter(Boolean))),
      field("Conteúdos relacionados", bind(page, "related", el("input", { value: (page.related || []).join(", ") }), (v) => v.split(",").map((t) => t.trim()).filter(Boolean)), "slugs separados por vírgula"),
      field("Última verificação", bind(page, "reviewedAt", el("input", { value: page.reviewedAt || "", placeholder: "2026-08-21" })))),

    extraEditor(page),
    el("label", { style: "margin-top:22px" }, "Seções"),
    sectionEditor(page),
    el("label", { style: "margin-top:22px" }, "Fontes consultadas"),
    sourceEditor(page),
    );

  const bar = el("div", { className: "bar" },
    el("button", { id: "save", className: "primary", disabled: !state.dirty, onclick: save }, state.dirty ? "Salvar alterações" : "Salvo"),
    el("button", { onclick: () => publish([page.slug]), disabled: state.busy }, "Publicar esta página"),
    el("a", { href: "https://extensaofacil.com.br" + page.route, target: "_blank", className: "msg", style: "margin-left:6px" }, "ver no site ↗"),
    el("div", { className: "grow" }),
    el("button", { className: "danger", onclick: removePage }, "Excluir"));

  return el("div", { className: "panel" }, body, bar);
}

/* ------------------------------------------------------------------- ações */

async function loadAll() {
  const [pages, authors, status] = await Promise.all([
    api("api/pages"), api("api/authors"), api("api/status"),
  ]);
  state.pages = pages; state.authors = authors; state.status = status; state.authed = true;
  render();
}

async function openPage(slug) {
  if (state.dirty && !confirm("Há alterações não salvas. Descartar?")) return;
  state.current = await api(`api/pages/detail?slug=${encodeURIComponent(slug)}`);
  state.dirty = false;
  render();
}

async function save() {
  try {
    const saved = await api("api/pages/detail", { method: "PUT", body: state.current });
    state.current = saved;
    state.dirty = false;
    await loadAll();
    setMsg("Salvo. Publique para atualizar o site.");
  } catch (e) { setMsg(e.message, "err"); }
}

async function publish(slugs) {
  state.busy = true; setMsg(slugs ? "Publicando página…" : "Publicando tudo…");
  try {
    const r = await api("api/publish", { method: "POST", body: slugs ? { slugs } : {} });
    const parts = [`${r.rendered.length} rota(s) em ${(r.ms / 1000).toFixed(1)}s`, `${r.indexed} URLs no sitemap`];
    if (r.missing.length) parts.push(`${r.missing.length} sem conteúdo (404)`);
    if (r.failures.length) parts.push(`${r.failures.length} falha(s)`);
    setMsg("Publicado: " + parts.join(" · "), r.failures.length ? "err" : "ok");
    await loadAll();
  } catch (e) { setMsg(e.message, "err"); }
  finally { state.busy = false; render(); }
}

async function newPage() {
  const slug = prompt("Slug da nova página (ex.: relatorio-final/durante-a-acao ou cursos/direito/ideias):");
  if (!slug) return;
  const kind = prompt("Tipo: guide, course ou institution", "guide");
  if (!kind) return;
  try {
    await api("api/pages/detail", { method: "PUT", body: { slug: slug.replace(/^\/|\/$/g, ""), kind, title: "", description: "", sections: [], sources: [] } });
    await loadAll();
    await openPage(slug.replace(/^\/|\/$/g, ""));
  } catch (e) { setMsg(e.message, "err"); }
}

async function removePage() {
  if (!confirm(`Excluir "${state.current.title || state.current.slug}"? A página passa a responder 404 depois de publicar.`)) return;
  await api(`api/pages/detail?slug=${encodeURIComponent(state.current.slug)}`, { method: "DELETE" });
  state.current = null; state.dirty = false;
  await loadAll();
  setMsg("Página excluída. Publique tudo para atualizar o sitemap.");
}

/* -------------------------------------------------------------------- render */

function render() {
  const app = $("#app");
  if (!state.authed) return app.replaceChildren(loginView());

  const st = state.status || {};
  const top = el("div", { className: "top" },
    el("strong", {}, "Extensão Fácil"),
    el("span", { className: "status" },
      st.pending ? `${st.pending} página(s) com alteração não publicada` : "tudo publicado",
      (() => {
        const r = state.pages.filter((p) => !p.published).length;
        // "Publicar tudo" NÃO leva rascunho ao ar: published=false tira a página do
        // payload inteiro. Sem dizer isso aqui, some do radar.
        return r ? ` · ${r} rascunho(s) fora do ar — "Publicar tudo" não os inclui` : "";
      })(),
      st.lastPublish ? ` · última publicação ${st.lastPublish.at} UTC` : ""),
    el("div", { className: "grow" }),
    state.msg ? el("span", { className: "msg " + state.msg.kind, style: "color:#fff" }, state.msg.text) : "",
    el("button", { className: "primary", disabled: state.busy, onclick: () => publish(null) }, "Publicar tudo"),
    el("button", { onclick: async () => { await api("api/logout", { method: "POST" }); state.authed = false; render(); } }, "Sair"));

  app.replaceChildren(top, el("div", { className: "wrap" }, listView(), editorView()));
}

loadAll().catch(() => render());
