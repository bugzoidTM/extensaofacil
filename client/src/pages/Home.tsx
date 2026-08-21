/**
 * Direção visual: Caderno de Campo Contemporâneo — hero documental, percurso por etapas e cartões de papel orientados à ação.
 */
import { ArrowDown, ArrowUpRight, CheckCircle2, Compass, FileText, MapPin, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";
import { CourseCard, GuideCard, InstitutionCard, PathCard, ToolCard } from "@/components/ContentCards";
import { PageShell, RouteLine, SectionHeading, organizationSchema } from "@/components/PortalLayout";
import { courses, guides, institutions } from "@/data/portalData";
import { useSeo } from "@/lib/seo";

const heroImage = "/manus-storage/extensao-facil-hero_ba2e9b46.jpg";
const toolsImage = "/manus-storage/extensao-facil-tools_ce99dfac.jpg";
const communityImage = "/manus-storage/extensao-facil-community_9150e010.jpg";
const odsImage = "/manus-storage/extensao-facil-ods_b4aabb26.jpg";

const startPaths = [
  { href: "/projeto-de-extensao/", icon: "book" as const, title: "Entender o projeto", description: "Comece pelo que a extensão pede e por que ela importa." },
  { href: "/ferramentas/gerador-de-ideias/", icon: "idea" as const, title: "Encontrar uma ideia", description: "Filtre sugestões pelo seu curso, local e público." },
  { href: "/ferramentas/seletor-de-ods/", icon: "ods" as const, title: "Escolher ODS", description: "Relacione a ação a um objetivo que faça sentido." },
  { href: "/onde-realizar/", icon: "place" as const, title: "Encontrar local", description: "Avalie onde sua atividade pode acontecer de verdade." },
  { href: "/relatorio-final/", icon: "report" as const, title: "Preparar relatório", description: "Organize o que precisa ser contado ao final." },
  { href: "/evidencias/", icon: "evidence" as const, title: "Organizar evidências", description: "Planeje registros que representem o que foi realizado." },
];

export default function Home() {
  useSeo({
    title: "Extensão Fácil | Projeto de Extensão sem complicação",
    description: "Encontre ideias, escolha o ODS, organize sua atividade e prepare seu relatório final de extensão universitária com orientação prática.",
    path: "/",
    fullTitle: true,
    schema: organizationSchema,
  });
  return <PageShell>
    <section className="home-hero">
      <img src={heroImage} alt="Estudantes universitários conversam com educadora comunitária durante planejamento de uma atividade" className="hero-image" fetchPriority="high" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow"><span /> Orientação que cabe na vida real</p>
        <h1>Projeto de Extensão<br /><em>sem complicação.</em></h1>
        <p className="hero-copy">Encontre ideias, escolha o ODS, organize sua atividade e prepare seu relatório final com orientação prática.</p>
        <div className="hero-actions"><Link href="/ferramentas/gerador-de-ideias/" className="button button-coral"><Sparkles size={18} /> Encontrar uma ideia</Link><Link href="/projeto-de-extensao/" className="button button-light">Aprender como funciona <ArrowUpRight size={17} /></Link></div>
        <a href="#comece" className="hero-scroll">Percorra o caminho <ArrowDown size={16} /></a>
      </div>
      <aside className="hero-note"><Compass size={19} /><p><strong>Um próximo passo de cada vez.</strong><br />Você não precisa começar sabendo tudo.</p></aside>
    </section>

    <section id="comece" className="section section-paper start-section">
      <div className="section-inner">
        <SectionHeading eyebrow="Comece por aqui" title="Qual é a sua dúvida agora?" description="Escolha o ponto em que você está. Cada caminho leva a uma orientação clara e aplicável." />
        <div className="path-grid">{startPaths.map((path) => <PathCard key={path.title} {...path} />)}</div>
      </div>
    </section>

    <section className="tools-ribbon">
      <div className="tools-ribbon-art"><img src={toolsImage} alt="Caderno de campo, mapa e materiais de planejamento sobre uma mesa" loading="lazy" /><div className="art-caption"><span>Ferramentas gratuitas</span><span>Feitas para planejar</span></div></div>
      <div className="tools-ribbon-content"><p className="eyebrow">Planeje com mais clareza</p><h2>Ferramentas que transformam<br /><em>dúvida em próximo passo.</em></h2><p>Sem login, sem fórmulas mágicas e sem gerar trabalho pronto. Você encontra caminhos para decidir, organizar e registrar melhor.</p><div className="tools-stack"><ToolCard href="/ferramentas/gerador-de-ideias/" icon="ideas" title="Gerador de ideias" description="Sugestões de atividades para seu curso e contexto." /><ToolCard href="/ferramentas/seletor-de-ods/" icon="ods" title="Seletor de ODS" description="Descubra os objetivos mais coerentes para a ação." /><ToolCard href="/ferramentas/checklist-relatorio/" icon="check" title="Checklist do relatório" description="Acompanhe tudo que precisa estar pronto." /></div></div>
    </section>

    <section className="section course-section">
      <div className="section-inner"><SectionHeading eyebrow="Por curso" title="Seu conhecimento pode virar ação." description="Encontre pontos de partida que respeitam as competências e os contextos de cada formação." action={<Link href="/cursos/" className="text-link">Ver todos os cursos <ArrowUpRight size={17} /></Link>} /><div className="course-grid">{courses.slice(0, 6).map((course) => <CourseCard key={course.slug} course={course} />)}</div></div>
    </section>

    <section className="impact-section">
      <img src={odsImage} alt="Colagem em papel que representa educação, comunidade e um caminho de impacto" loading="lazy" className="impact-art" />
      <div className="impact-copy"><p className="eyebrow">Ação com sentido</p><h2>Escolher o ODS é explicar<br />o <em>porquê</em> da sua ação.</h2><p>O ODS não precisa ser uma sigla solta no relatório. Ele conecta um problema real, o público que participa e o efeito que você quer apoiar.</p><Link href="/ods/" className="button button-dark"><Target size={18} /> Entender os ODS</Link></div>
      <div className="impact-note"><CheckCircle2 size={21} /><p><strong>Comece pelo problema.</strong><br />O objetivo aparece com mais clareza depois.</p></div>
    </section>

    <section className="section section-mist faculties-section">
      <div className="section-inner"><SectionHeading eyebrow="Por faculdade" title="Seu roteiro tem particularidades." description="Use os guias como apoio e confira sempre as instruções oficiais da sua instituição." action={<Link href="/faculdades/" className="text-link">Explorar faculdades <ArrowUpRight size={17} /></Link>} /><div className="institution-grid">{institutions.map((institution) => <InstitutionCard key={institution.slug} {...institution} />)}</div><p className="editorial-note">As orientações podem variar conforme curso, instituição, disciplina e período letivo. Consulte sempre o roteiro oficial disponibilizado pela sua instituição.</p></div>
    </section>

    <section className="community-section">
      <div className="community-image-wrap"><img src={communityImage} alt="Estudante conduz atividade de aprendizagem com participantes em um centro comunitário" loading="lazy" /><span className="photo-label">Extensão acontece com pessoas, não em um formulário.</span></div>
      <div className="community-copy"><p className="eyebrow">Antes, durante e depois</p><h2>Uma boa atividade deixa <em>rastros de aprendizagem.</em></h2><p>Planejar também é pensar no registro: o que você vai observar, como vai documentar e quais cuidados deve ter ao trabalhar com pessoas e instituições.</p><div className="three-notes"><div><span>01</span><h3>Planeje</h3><p>Objetivo, público, local e materiais.</p></div><div><span>02</span><h3>Realize</h3><p>Atividade possível e conversa respeitosa.</p></div><div><span>03</span><h3>Registre</h3><p>Evidências coerentes e autorizadas.</p></div></div><Link href="/evidencias/" className="text-link">Como organizar evidências <ArrowUpRight size={17} /></Link></div>
    </section>

    <section className="section guides-section">
      <div className="section-inner"><SectionHeading eyebrow="Guias mais acessados" title="Leia, escolha e avance." description="Conteúdos de referência para você entender o processo sem complicar o que pode ser prático." action={<Link href="/guias/" className="text-link">Ver todos os guias <ArrowUpRight size={17} /></Link>} /><RouteLine /><div className="guide-grid">{guides.slice(0, 3).map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div></div>
    </section>

    <section className="final-cta"><div><p className="eyebrow">Vamos começar?</p><h2>Você já sabe seu curso.<br /><em>O resto a gente organiza junto.</em></h2></div><Link href="/ferramentas/gerador-de-ideias/" className="button button-coral">Encontrar uma ideia <ArrowUpRight size={18} /></Link></section>
  </PageShell>;
}
