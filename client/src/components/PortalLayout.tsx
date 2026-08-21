/**
 * Direção visual: Caderno de Campo Contemporâneo — percurso editorial, etiquetas e linha de rota como sinais recorrentes.
 */
import { Menu, Search, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/data/portalData";

const markUrl = "/manus-storage/extensao-facil-mark_d761bcd0.png";

const navItems = [
  { label: "Projeto de extensão", href: "/projeto-de-extensao/" },
  { label: "Cursos", href: "/cursos/" },
  { label: "Faculdades", href: "/faculdades/" },
  { label: "Relatório final", href: "/relatorio-final/" },
  { label: "Ferramentas", href: "/ferramentas/" },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Extensão Fácil, página inicial">
      <img src={markUrl} alt="" aria-hidden="true" className="brand-mark" />
      {!compact && <span><strong>Extensão</strong> Fácil</span>}
    </Link>
  );
}

function NavAnchor({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const [location] = useLocation();
  const active = href === "/" ? location === "/" : location.startsWith(href);
  return <Link href={href} onClick={onClick} className={`nav-link ${active ? "is-active" : ""}`}>{children}</Link>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => <NavAnchor key={item.href} href={item.href}>{item.label}</NavAnchor>)}
        </nav>
        <div className="header-actions">
          <Link href="/buscar/" aria-label="Buscar no portal" className="search-link"><Search size={18} strokeWidth={2.2} /><span>Buscar</span></Link>
          <Link href="/ferramentas/gerador-de-ideias/" className="button button-primary header-cta">Encontrar uma ideia</Link>
          <button className="menu-button" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" aria-label="Menu móvel">
          <nav>
            {navItems.map((item) => <NavAnchor key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</NavAnchor>)}
            <NavAnchor href="/buscar/" onClick={() => setOpen(false)}>Buscar no portal</NavAnchor>
          </nav>
          <Link href="/ferramentas/gerador-de-ideias/" className="button button-primary" onClick={() => setOpen(false)}>Encontrar uma ideia</Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top route-surface">
        <div className="footer-lede">
          <Brand />
          <p>Orientação prática para transformar seu projeto de extensão em uma ação possível, útil e bem documentada.</p>
        </div>
        <div className="footer-columns">
          <div><h2>Aprenda</h2><Link href="/projeto-de-extensao/">Projeto de extensão</Link><Link href="/relatorio-final/">Relatório final</Link><Link href="/ods/">ODS</Link><Link href="/evidencias/">Evidências</Link></div>
          <div><h2>Explore</h2><Link href="/cursos/">Cursos</Link><Link href="/faculdades/">Faculdades</Link><Link href="/ferramentas/">Ferramentas</Link><Link href="/buscar/">Buscar</Link></div>
          <div><h2>Extensão Fácil</h2><Link href="/sobre/">Sobre</Link><Link href="/politica-de-privacidade/">Privacidade</Link><Link href="/termos-de-uso/">Termos de uso</Link><a href="mailto:contato@extensaofacil.com.br">Contato</a></div>
        </div>
      </div>
      <div className="footer-bottom"><p>© 2026 Extensão Fácil. Portal independente de orientação sobre extensão universitária.</p><a href={`${SITE_URL}/sitemap.xml`} target="_blank" rel="noreferrer">Sitemap</a></div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header /><main id="conteudo">{children}</main><Footer /></>;
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
    <Link href="/" itemProp="item"><span itemProp="name">Início</span></Link>
    {items.map((item, index) => <span className="breadcrumb-item" key={`${item.label}-${index}`} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem"><span aria-hidden="true">/</span>{item.href ? <Link href={item.href} itemProp="item"><span itemProp="name">{item.label}</span></Link> : <span itemProp="name" aria-current="page">{item.label}</span>}<meta itemProp="position" content={String(index + 2)} /></span>)}
  </nav>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

export function RouteLine() { return <div className="route-line" aria-hidden="true"><span /><i /><i /><i /><span /></div>; }

export function AnswerBox({ children }: { children: React.ReactNode }) {
  return <aside className="answer-box"><div className="answer-mark">Resposta rápida</div><div>{children}</div></aside>;
}

export function MetaLine({ updated, category }: { updated: string; category?: string }) {
  return <div className="meta-line"><span>Por Equipe Extensão Fácil</span><span className="meta-dot" />{category && <span>{category}</span>}<span className="meta-dot" /><span>Atualizado em {updated}</span></div>;
}

export function CardArrow() { return <span className="card-arrow" aria-hidden="true">↗</span>; }

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "Extensão Fácil",
  url: SITE_URL,
  logo: `${SITE_URL}${markUrl}`,
  description: "Portal brasileiro de orientação prática sobre extensão universitária.",
};
