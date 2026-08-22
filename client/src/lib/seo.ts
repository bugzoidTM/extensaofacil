/** Direção visual: Caderno de Campo Contemporâneo — SEO descritivo, transparente e acessível. */
import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/data/portalData";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  fullTitle?: boolean;
  noindex?: boolean;
  cluster?: string;
  type?: "website" | "article";
  schema?: Record<string, unknown>;
};

/**
 * Cartão editorial por cluster, 1200x675 (§50). Sem isto, todas as 44 páginas
 * compartilhavam a mesma imagem no Google Discover e no preview de link.
 */
const CARTOES: Record<string, string> = {
  guias: "/img/og-guias.jpg",
  "relatorio-final": "/img/og-relatorio.jpg",
  cursos: "/img/og-cursos.jpg",
  faculdades: "/img/og-faculdades.jpg",
};

export function cartaoDe(cluster?: string) {
  return `${SITE_URL}${CARTOES[cluster ?? "guias"] ?? CARTOES.guias}`;
}

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    if (property) element.setAttribute("property", name);
    else element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

export function useSeo({ title, description, path, fullTitle = false, noindex = false, type = "website", schema, cluster }: SeoOptions) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`;
    // O Google corta perto de 60 caracteres. Quando o título já é longo, o sufixo
    // "| Extensão Fácil" só ocupa o espaço que descreveria a página.
    const comSufixo = `${title} | ${SITE_NAME}`;
    document.title = fullTitle || comSufixo.length > 62 ? title : comSufixo;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex,follow" : "index,follow,max-image-preview:large");
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:url", canonical, true);
    const cartao = cartaoDe(cluster);
    setMeta("og:image", cartao, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "675", true);
    setMeta("og:locale", "pt_BR", true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("twitter:image", cartao);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;
    const scriptId = "route-structured-data";
    document.getElementById(scriptId)?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [cluster, description, fullTitle, noindex, path, schema, title, type]);
}
