/**
 * CTA contextual para o Apostileiros (PRD §30 a §33).
 *
 * Aparece só depois que o conteúdo entregou a resposta — nunca no hero, nunca em
 * modal, nunca fixo na tela.
 *
 * Sobre o `rel` (decisão do dono em 07/09/2026): o portal existe para dar visibilidade
 * ao Apostileiros. O `rel="sponsored"` que estava aqui instrui o Google a NÃO passar
 * ranking — anulava o propósito. `sponsored` é para anúncio pago; link editorial entre
 * dois sites do mesmo dono, com a parceria declarada no texto (eyebrow "Parceria" e
 * "loja parceira" na descrição), é link normal. A divulgação fica no texto, não no rel.
 */
import { ArrowUpRight } from "lucide-react";
import { comUtm } from "@/data/commercial";
import { track } from "@/lib/analytics";

type Props = {
  title: string;
  description: string;
  href: string;
  campaign: string;
  content: string;
  label?: string;
};

export function CommercialHelpCTA({ title, description, href, campaign, content, label = "Conhecer opções" }: Props) {
  const destino = comUtm(href, campaign, content);
  return (
    <aside className="commercial-cta" aria-label="Conteúdo patrocinado">
      <p className="commercial-cta-eyebrow">Parceria</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <a
        href={destino}
        target="_blank"
        rel="noopener"
        onClick={() => track("apostileiros_referral_click", { campaign, content, destino: href })}
      >
        {label} <ArrowUpRight size={17} />
      </a>
    </aside>
  );
}
