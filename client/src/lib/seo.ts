/** Direção visual: Caderno de Campo Contemporâneo — SEO descritivo, transparente e acessível. */
import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/data/portalData";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  fullTitle?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
  schema?: Record<string, unknown>;
};

const heroImage = `${SITE_URL}/manus-storage/extensao-facil-hero_ba2e9b46.jpg`;

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

export function useSeo({ title, description, path, fullTitle = false, noindex = false, type = "website", schema }: SeoOptions) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`;
    document.title = fullTitle ? title : `${title} | ${SITE_NAME}`;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex,follow" : "index,follow,max-image-preview:large");
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:url", canonical, true);
    setMeta("og:image", heroImage, true);
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
  }, [description, fullTitle, noindex, path, schema, title, type]);
}
