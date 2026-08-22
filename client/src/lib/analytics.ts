/**
 * Direção visual: Caderno de Campo Contemporâneo — eventos discretos, sem coleta pessoal desnecessária.
 *
 * Eventos de funil (PRD §36 e §72). A Cloudflare Web Analytics cobre tráfego, mas não
 * faz evento customizado; estes vão para um coletor próprio via `sendBeacon`, que não
 * bloqueia a navegação e é entregue mesmo quando a página está sendo descarregada —
 * é o que garante o registro do clique de saída para o Apostileiros.
 *
 * Sem cookie e sem identificador persistente: a sessão é um id aleatório em
 * sessionStorage, que morre ao fechar a aba. Isso mantém o portal fora da exigência
 * de banner de consentimento.
 */

// O coletor vive no mesmo serviço do painel, atrás do Traefik. Caminho relativo para
// não depender de configuração de ambiente no build.
const ENDPOINT = import.meta.env.VITE_EVENTS_ENDPOINT || "/admin/api/events";

/** A pré-renderização abre o site num Chromium; sem isto, cada build sujaria a base. */
const ehPrerender = () =>
  typeof location !== "undefined" && /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const CHAVE_SESSAO = "extensao-facil:sessao";

function sessaoId(): string {
  try {
    let id = sessionStorage.getItem(CHAVE_SESSAO);
    if (!id) {
      id = crypto.randomUUID?.() ?? String(Math.random()).slice(2);
      sessionStorage.setItem(CHAVE_SESSAO, id);
    }
    return id;
  } catch {
    return "sem-sessao";
  }
}

export function track(event: string, properties: Record<string, string | number | boolean> = {}) {
  // mantido: quem quiser escutar de fora, ou um gtag futuro, continua funcionando
  window.dispatchEvent(new CustomEvent("extensao-facil:analytics", { detail: { event, properties } }));
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
  analytics.gtag?.("event", event, properties);

  if (!ENDPOINT || ehPrerender()) return;
  const corpo = JSON.stringify({
    evento: event,
    sessao: sessaoId(),
    caminho: location.pathname,
    referrer: document.referrer || null,
    em: new Date().toISOString(),
    props: properties,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([corpo], { type: "application/json" }));
    } else {
      fetch(ENDPOINT, { method: "POST", body: corpo, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    /* medição nunca pode quebrar a página */
  }
}

/** Marcos de leitura, disparados uma vez por página (§72). */
export function observarProfundidade(slug: string) {
  const marcos = [
    { pct: 0.5, evento: "content_depth_50", disparado: false },
    { pct: 0.9, evento: "content_depth_90", disparado: false },
  ];
  const aoRolar = () => {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    if (altura <= 0) return;
    const lido = window.scrollY / altura;
    for (const m of marcos) {
      if (!m.disparado && lido >= m.pct) {
        m.disparado = true;
        track(m.evento, { slug });
      }
    }
    if (marcos.every((m) => m.disparado)) window.removeEventListener("scroll", aoRolar);
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  return () => window.removeEventListener("scroll", aoRolar);
}
