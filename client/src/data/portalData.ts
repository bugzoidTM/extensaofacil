/**
 * Direção visual: Caderno de Campo Contemporâneo — dados editoriais claros, úteis e sem promessas comerciais.
 *
 * O conteúdo NÃO mora mais neste arquivo: ele vem de /content/portal-data.json, gerado
 * a partir do content.db pelo painel de edição. Isso é o que permite publicar um texto
 * novo sem rodar `vite build` — o bundle não muda quando o conteúdo muda.
 *
 * As listas abaixo são `let` e ficam vazias até `loadPortalData()` rodar (em main.tsx,
 * antes do render). Como são bindings de módulo ES, quem importa enxerga o valor
 * atualizado sem precisar de contexto ou hook.
 */

export const SITE_URL = "https://extensaofacil.com.br";
export const SITE_NAME = "Extensão Fácil";
export const STORAGE_PREFIX = "extensao-facil";

export type Course = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  accent: string;
  ideas: string[];
  places: string[];
  ods: string[];
  intent?: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updated: string;
  tags: string[];
  quickAnswer: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  related: string[];
  intent?: string;
  author?: string | null;
  sources?: { institution: string; title: string; url: string | null; accessedAt: string | null }[];
};

export type Institution = {
  slug: string;
  name: string;
  summary: string;
  tone: string;
  reviewedAt?: string;
  intent?: string;
};

export type OdsItem = { id: string; title: string; summary: string; keywords: string[] };
export type Author = { slug: string; name: string; role: string | null; bio: string | null };
export type SearchEntry = { title: string; description: string; href: string; category: string; tags: string[] };

export let courses: Course[] = [];
export let guides: Guide[] = [];
export let institutions: Institution[] = [];
export let odsList: OdsItem[] = [];
export let checklistItems: string[] = [];
export let authors: Author[] = [];
export let searchIndex: SearchEntry[] = [];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
export const getCourse = (slug: string) => courses.find((course) => course.slug === slug);
export const getInstitution = (slug: string) => institutions.find((institution) => institution.slug === slug);

export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function buildSearchIndex(): SearchEntry[] {
  return [
    ...guides.map((guide) => ({ title: guide.title, description: guide.description, href: `/${guide.slug}/`, category: guide.eyebrow, tags: guide.tags })),
    ...courses.map((course) => ({ title: `Projeto de Extensão em ${course.name}`, description: course.summary, href: `/cursos/${course.slug}/`, category: "Curso", tags: [course.name, ...course.ideas, ...course.ods] })),
    ...institutions.map((institution) => ({ title: `Projeto de Extensão ${institution.name}`, description: institution.summary, href: `/faculdades/${institution.slug}/`, category: "Faculdade", tags: [institution.name, "roteiro", "atividade extensionista"] })),
    { title: "Gerador de ideias", description: "Sugestões de atividades por curso, público, local e complexidade.", href: "/ferramentas/gerador-de-ideias/", category: "Ferramenta", tags: ["ideias", "curso", "atividade"] },
    { title: "Seletor de ODS", description: "Encontre o ODS mais coerente para sua ação.", href: "/ferramentas/seletor-de-ods/", category: "Ferramenta", tags: ["ODS", "impacto", "objetivo"] },
    { title: "Checklist do relatório", description: "Acompanhe os itens essenciais antes de entregar o relatório final.", href: "/ferramentas/checklist-relatorio/", category: "Ferramenta", tags: ["relatório", "evidências", "conclusão"] },
    { title: "Sobre o Extensão Fácil", description: "Conheça o propósito editorial e como usamos informações neste portal.", href: "/sobre/", category: "Institucional", tags: ["sobre", "metodologia"] },
  ];
}

let loaded: Promise<void> | null = null;

/** Carrega o conteúdo publicado. Chamado uma vez, em main.tsx, antes do primeiro render. */
export function loadPortalData(): Promise<void> {
  if (loaded) return loaded;
  loaded = fetch("/content/portal-data.json", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`portal-data.json: HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      courses = data.courses ?? [];
      guides = data.guides ?? [];
      institutions = data.institutions ?? [];
      odsList = data.odsList ?? [];
      checklistItems = data.checklistItems ?? [];
      authors = data.authors ?? [];
      searchIndex = buildSearchIndex();
    });
  return loaded;
}

export function findRelated(slugs: string[]) {
  return slugs.map(getGuide).filter((guide): guide is Guide => Boolean(guide));
}

export function getIdeas(course: Course, place: string, audience: string, ods: string, complexity: string) {
  const contextPlace = place && place !== "nao-sei" ? place : course.places[0];
  const contextAudience = audience || "a comunidade atendida";
  const selectedOds = ods || course.ods[0];
  const level = complexity === "simples" ? "em formato direto e de fácil organização" : complexity === "intermediaria" ? "com uma etapa adicional de acompanhamento" : "com escopo adaptável à sua disponibilidade";
  const verbs = ["Conhecer e orientar", "Mapear e propor", "Aprender fazendo", "Dialogar e compartilhar", "Organizar para continuar"];
  const actions = course.ideas;
  return verbs.map((verb, index) => ({
    title: `${verb}: ${actions[index % actions.length]}`,
    problem: `Há uma oportunidade de apoiar ${contextAudience.toLowerCase()} com informação prática relacionada a ${course.name.toLowerCase()}.`,
    audience: contextAudience,
    place: contextPlace,
    activity: `Realize ${actions[index % actions.length]} ${level}. Comece com uma conversa breve, desenvolva uma atividade principal e encerre com uma devolutiva simples.`,
    ods: selectedOds,
    materials: index % 2 === 0 ? "Folhas, canetas, material de apoio e espaço combinado com antecedência." : "Roteiro simples, cartaz ou apresentação curta, registros autorizados e materiais do contexto.",
    evidence: "Foto do material e do ambiente, registro da sequência da atividade e devolutiva autorizada do local.",
    result: "Participantes com acesso a uma orientação clara, material prático ou atividade aplicável ao seu contexto.",
  }));
}

export function rankOds(problem: string, audience: string, action: string, environment: string) {
  const text = normalize(`${problem} ${audience} ${action} ${environment}`);
  return odsList
    .map((ods) => ({ ...ods, score: ods.keywords.reduce((total, keyword) => total + (text.includes(normalize(keyword)) ? 2 : 0), 0) + (ods.id === "ODS 4" && /oficina|orientacao|atividade/.test(text) ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
