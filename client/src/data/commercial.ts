/**
 * Ponte com o Apostileiros (PRD §29 a §35).
 *
 * Princípio do §29: o Extensão Fácil resolve primeiro; o Apostileiros aparece como
 * próximo passo opcional, depois que o leitor já recebeu a resposta.
 *
 * ATENÇÃO ao escolher destino. A página /sobre/ deste portal afirma que ele "não
 * oferece trabalhos prontos nem orienta o preenchimento de informações inventadas".
 * Apontar um CTA para produto de trabalho pronto contradiz esse compromisso editorial
 * e, pior, contradiz o conselho da própria página em que o CTA apareceria. Por isso os
 * destinos abaixo levam ao que é compatível: cursos com certificado para horas
 * complementares, explicação de como o serviço funciona e canal de dúvidas.
 */

export const APOSTILEIROS = "https://apostileiros.com.br";

export type Destino = { href: string; titulo: string; descricao: string };

/** Destino por cluster de conteúdo. Cada um leva ao ponto mais relevante, não à home (§34). */
export const commercialDestinations: Record<string, Destino> = {
  "horas-complementares": {
    href: `${APOSTILEIROS}/cursos-gratuitos-com-certificado-para-horas-de-aco/`,
    titulo: "Precisa também de horas complementares?",
    descricao:
      "A extensão costuma vir junto com a exigência de horas de atividades complementares. " +
      "O Apostileiros mantém uma lista de cursos gratuitos com certificado que contam para esse fim.",
  },
  "como-funciona": {
    href: `${APOSTILEIROS}/como-funciona/`,
    titulo: "Quer apoio além deste guia?",
    descricao:
      "Se depois de ler você ainda precisar de acompanhamento para organizar o seu projeto, " +
      "veja como funciona o atendimento do Apostileiros e decida se faz sentido para o seu caso.",
  },
  duvidas: {
    href: `${APOSTILEIROS}/duvidas-frequentes/`,
    titulo: "Ficou com dúvida que este guia não respondeu?",
    descricao:
      "O Apostileiros reúne as perguntas mais frequentes de estudantes sobre extensão, " +
      "prazos e entrega de portfólio.",
  },
};

/** Qual destino combina com cada cluster de conteúdo. */
export const destinoPorCluster: Record<string, keyof typeof commercialDestinations> = {
  "relatorio-final": "como-funciona",
  cursos: "horas-complementares",
  faculdades: "duvidas",
  guias: "horas-complementares",
};

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
 * da própria experiência; oferecer atalho comercial ali seria desonesto com o leitor.
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
