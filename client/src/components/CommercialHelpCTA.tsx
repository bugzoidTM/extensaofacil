/**
 * CTA contextual para o Apostileiros (PRD §30 a §33).
 *
 * Aparece só depois que o conteúdo entregou a resposta — nunca no hero, nunca em
 * modal, nunca fixo na tela. O link sai com `rel="sponsored"` porque é comercial e
 * entre sites do mesmo dono: sem isso, os dois domínios ficam expostos a serem
 * lidos como esquema de links.
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
        rel="sponsored noopener noreferrer"
        onClick={() => track("apostileiros_referral_click", { campaign, content, destino: href })}
      >
        {label} <ArrowUpRight size={17} />
      </a>
    </aside>
  );
}
