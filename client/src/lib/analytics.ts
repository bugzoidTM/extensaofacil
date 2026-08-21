/** Direção visual: Caderno de Campo Contemporâneo — eventos discretos, sem coleta pessoal desnecessária. */
export function track(event: string, properties: Record<string, string | number | boolean> = {}) {
  window.dispatchEvent(new CustomEvent("extensao-facil:analytics", { detail: { event, properties } }));
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
  analytics.gtag?.("event", event, properties);
}
