/**
 * Ponte com o Apostileiros (PRD §29 a §35).
 *
 * Princípio do §29: o Extensão Fácil resolve primeiro; o Apostileiros aparece como
 * próximo passo opcional, depois que o leitor já recebeu a resposta.
 *
 * O destino é escolhido por INTENÇÃO, não por conveniência: quem acabou de ler sobre
 * relatório final vai para os projetos de extensão, não para uma página institucional.
 * Cada URL abaixo foi verificada como existente e com produtos listados.
 *
 * A quantidade de CTAs não muda com este mapa — só o destino de cada um.
 */

export const APOSTILEIROS = "https://apostileiros.com.br";

export type Destino = { href: string; titulo: string; descricao: string; label?: string };

/**
 * Destino específico por página, quando existe um mais próximo da intenção do leitor.
 * Tem precedência sobre o destino de cluster.
 */
export const destinoPorSlug: Record<string, Destino> = {
  "relatorio-final": {
    href: `${APOSTILEIROS}/categoria-produto/projeto-de-extensao/`,
    titulo: "Precisa de um modelo para se orientar?",
    descricao:
      "O Apostileiros é uma loja parceira que vende projetos de extensão e portfólios prontos, " +
      "organizados por curso e por instituição. Vale como referência de estrutura para quem está começando do zero.",
    label: "Ver projetos disponíveis",
  },
  "relatorio-final/como-preencher": {
    href: `${APOSTILEIROS}/solicite/`,
    titulo: "Precisa de algo feito para o seu caso?",
    descricao:
      "Se o seu roteiro tem exigências que nenhum modelo pronto atende, o Apostileiros, loja parceira, " +
      "faz orçamento para trabalhos sob encomenda.",
    label: "Solicitar orçamento",
  },
  "projeto-de-extensao-pronto": {
    href: `${APOSTILEIROS}/categoria-produto/projeto-de-extensao/`,
    titulo: "Onde ver o catálogo citado nesta página",
    descricao:
      "O Apostileiros é a loja parceira do Extensão Fácil e vende os modelos prontos descritos acima, " +
      "organizados por curso, instituição e etapa. Confira curso, programa e etapa antes de comprar — " +
      "e adapte o texto à ação que você realmente realizou.",
    label: "Ver o catálogo de projetos de extensão",
  },
  anhanguera: {
    href: `${APOSTILEIROS}/produto-tag/anhanguera/`,
    titulo: "Procurando material específico da Anhanguera?",
    descricao:
      "O Apostileiros, loja parceira, reúne projetos de extensão e portfólios organizados " +
      "pelo formato pedido nessa instituição.",
    label: "Ver material da Anhanguera",
  },
  unopar: {
    href: `${APOSTILEIROS}/produto-tag/unopar/`,
    titulo: "Procurando material específico da Unopar?",
    descricao:
      "O Apostileiros, loja parceira, reúne projetos de extensão e portfólios organizados " +
      "pelo formato pedido nessa instituição.",
    label: "Ver material da Unopar",
  },
  // A tag `pitagoras` existe, mas tinha um único produto na conferência de 29/08/2026 —
  // mandar o leitor para uma vitrine de um item é pior que mandar para o catálogo inteiro.
  // Por isso Pitágoras continua caindo no destino de cluster, e só Uniderp ganhou tag própria.
  uniderp: {
    href: `${APOSTILEIROS}/produto-tag/uniderp/`,
    titulo: "Procurando material específico da Uniderp?",
    descricao:
      "O Apostileiros, loja parceira, reúne projetos de extensão e portfólios organizados " +
      "pelo formato pedido nessa instituição.",
    label: "Ver material da Uniderp",
  },
};

/** Categoria da loja por curso — o destino mais próximo de quem lê um hub de curso. */
const CATEGORIA_POR_CURSO: Record<string, string> = {
  pedagogia: "pedagogia",
  enfermagem: "enfermagem",
  administracao: "administracao",
  "analise-e-desenvolvimento-de-sistemas": "analise-e-desenvolvimento-de-sistemas",
  direito: "direito",
  biomedicina: "biomedicina",
  "ciencias-contabeis": "ciencias-contabeis",
  "servico-social": "servico-social",
  // O slug da loja não é `recursos-humanos` — essa URL responde 404. Quatro dos nove
  // cursos caíam no destino genérico só por falta de linha aqui; todas as nove
  // categorias foram conferidas com produto listado em 29/08/2026.
  "recursos-humanos": "gestao-de-recursos-humanos",
};

function destinoDeCurso(slug: string, nome: string): Destino | null {
  const categoria = CATEGORIA_POR_CURSO[slug];
  if (!categoria) return null;
  return {
    href: `${APOSTILEIROS}/categoria-produto/${categoria}/`,
    titulo: `Quer ver como outros projetos de ${nome} são estruturados?`,
    descricao:
      `O Apostileiros, loja parceira, vende projetos de extensão e portfólios prontos de ${nome}. ` +
      "Serve como referência de estrutura para quem ainda não sabe como organizar o próprio.",
    label: `Ver projetos de ${nome}`,
  };
}

/** Destino de reserva, por cluster, quando a página não tem um específico. */
export const destinoPorCluster: Record<string, Destino> = {
  "relatorio-final": destinoPorSlug["relatorio-final"],
  cursos: {
    href: `${APOSTILEIROS}/categoria-produto/projeto-de-extensao/`,
    titulo: "Quer ver como outros projetos são estruturados?",
    descricao:
      "O Apostileiros é uma loja parceira que vende projetos de extensão e portfólios prontos, " +
      "organizados por curso. Serve como referência de estrutura.",
    label: "Ver projetos disponíveis",
  },
  faculdades: {
    href: `${APOSTILEIROS}/categoria-produto/projeto-de-extensao/`,
    titulo: "Procurando material pronto para se orientar?",
    descricao:
      "O Apostileiros, loja parceira, reúne projetos de extensão e portfólios organizados por " +
      "curso e por instituição.",
    label: "Ver projetos disponíveis",
  },
  guias: {
    href: `${APOSTILEIROS}/categoria-produto/projeto-de-extensao/`,
    titulo: "Quer um modelo como ponto de partida?",
    descricao:
      "O Apostileiros é uma loja parceira que vende projetos de extensão e portfólios prontos, " +
      "organizados por curso e por instituição.",
    label: "Ver projetos disponíveis",
  },
};

/** Resolve o destino de uma página: específico primeiro, curso depois, cluster por último. */
export function destinoDaPagina(slug: string, kind: string, nomeCurso?: string): Destino | null {
  if (destinoPorSlug[slug]) return destinoPorSlug[slug];
  if (kind === "course") {
    const porCurso = destinoDeCurso(slug, nomeCurso ?? "");
    if (porCurso) return porCurso;
  }
  return destinoPorCluster[clusterDe(slug, kind)] ?? null;
}

/**
 * Monta a URL com UTM (§35). O `campaign` é o cluster e o `content` é o slug da
 * página de origem, para dar pra saber no destino de onde veio cada clique.
 */
export function comUtm(href: string, campaign: string, content: string) {
  const url = new URL(href);
  url.searchParams.set("utm_source", "extensaofacil");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

/**
 * Onde o CTA pode aparecer.
 *
 * Só em página marcada como `commercial-assist` (§61) — e nunca em página cujo
 * conselho o CTA contradiria. As três abaixo ensinam justamente a escrever a partir
 * da própria experiência; oferecer material pronto ali seria desonesto com o leitor.
 */
const SEM_CTA = new Set([
  "relatorio-final/percepcao",
  "relatorio-final/depoimento-instituicao",
  "relatorio-final/evidencias",
]);

export function podeMostrarCta(slug: string, intent?: string) {
  return intent === "commercial-assist" && !SEM_CTA.has(slug);
}

export function clusterDe(slug: string, kind: string) {
  if (kind === "course") return "cursos";
  if (kind === "institution") return "faculdades";
  if (slug.startsWith("relatorio-final")) return "relatorio-final";
  return "guias";
}
