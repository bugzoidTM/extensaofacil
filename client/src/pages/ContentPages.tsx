/**
 * Direção visual: Caderno de Campo Contemporâneo — leitura editorial com trilho contextual, resposta rápida e próximos passos concretos.
 */
import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, FileText, GraduationCap, Info, Landmark, SearchX, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { CourseCard, GuideCard, InstitutionCard, ToolCard } from "@/components/ContentCards";
import { AnswerBox, Breadcrumb, MetaLine, PageShell, SectionHeading } from "@/components/PortalLayout";
import { courses, findRelated, getCourse, getGuide, getInstitution, guides, institutions, SITE_NAME, SITE_URL } from "@/data/portalData";
import { track, observarProfundidade } from "@/lib/analytics";
import { CommercialHelpCTA } from "@/components/CommercialHelpCTA";
import { clusterDe, commercialDestinations, destinoPorCluster, podeMostrarCta } from "@/data/commercial";
import { cartaoDe, useSeo } from "@/lib/seo";

function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL }, ...items.map((item, index) => ({ "@type": "ListItem", position: index + 2, name: item.name, item: `${SITE_URL}${item.path}` }))] };
}

const MESES_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

/** "21 de agosto de 2026" -> "2026-08-21", que é o formato que o schema.org espera. */
function paraIso(brasileira?: string): string | undefined {
  if (!brasileira) return undefined;
  const m = brasileira.match(/(\d{1,2})\s+de\s+([a-zçã]+)\s+de\s+(\d{4})/i);
  if (!m) return undefined;
  const mes = MESES_PT.indexOf(m[2].toLowerCase());
  return mes < 0 ? undefined : `${m[3]}-${String(mes + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/**
 * Schema de artigo (§46).
 *
 * As datas vinham fixas em "2026-08-21" para TODAS as páginas, e a data de revisão
 * era enfiada no campo `about`, que descreve o assunto e não o tempo. Agora sai a data
 * real da página e o autor aponta para a página de autoria (§47).
 */
function articleSchema(title: string, description: string, path: string, updated?: string, cluster?: string) {
  const iso = paraIso(updated);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    inLanguage: "pt-BR",
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
    author: { "@type": "Organization", name: "Equipe Extensão Fácil", url: `${SITE_URL}/autoria/` },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/img/extensao-facil-mark_d761bcd0.png` },
    },
    image: { "@type": "ImageObject", url: cartaoDe(cluster), width: 1200, height: 675 },
  };
}

/**
 * Monta o CTA comercial da página, quando ela pode ter um (§32, §61).
 * Devolve null quando a página não é do tipo que aceita — o silêncio é o padrão.
 */
function ctaDaPagina(slug: string, kind: string, intent?: string) {
  if (!podeMostrarCta(slug, intent)) return null;
  const cluster = clusterDe(slug, kind);
  const destino = commercialDestinations[destinoPorCluster[cluster]];
  if (!destino) return null;
  return <CommercialHelpCTA
    title={destino.titulo}
    description={destino.descricao}
    href={destino.href}
    campaign={cluster}
    content={slug}
  />;
}

export function ArticlePage({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  if (!guide) return <MissingPage />;
  const path = `/${guide.slug}/`;
  const cluster = clusterDe(guide.slug, "guide");
  const schema = { "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: guide.title, path }]), articleSchema(guide.title, guide.description, path, guide.updated, cluster)] };
  useSeo({ title: guide.title, description: guide.description, path, type: "article", schema, cluster });
  useEffect(() => observarProfundidade(guide.slug), [guide.slug]);
  const related = findRelated(guide.related);
  return <PageShell>
    <article className="article-page" onLoad={() => track("article_view", { slug: guide.slug })}>
      <div className="article-top"><Breadcrumb items={[{ label: guide.eyebrow, href: "/guias/" }, { label: guide.title }]} /><span className="article-eyebrow">{guide.eyebrow}</span><h1>{guide.title}</h1><p className="article-deck">{guide.description}</p><MetaLine updated={guide.updated} category={guide.tags[0]} /><div className="article-route-strip" aria-label="Percurso de leitura"><span>Orientação</span><i /><span>Planejamento</span><i /><span>Registro</span></div></div>
      <div className="article-layout">
        <aside className="toc"><p>Neste guia</p>{guide.sections.map((section, index) => <a key={section.title} href={`#secao-${index + 1}`}>{String(index + 1).padStart(2, "0")} {section.title}</a>)}<div className="toc-note"><Clock3 size={16} />Leitura objetiva, para você colocar em prática.</div></aside>
        <div className="article-body"><AnswerBox><p>{guide.quickAnswer}</p></AnswerBox>{guide.sections.map((section, index) => <section id={`secao-${index + 1}`} key={section.title} className="article-section"><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul className="check-list">{section.bullets.map((item) => <li key={item}><Check size={18} />{item}</li>)}</ul>}</section>)}<aside className="contextual-cta"><div><span>Próximo passo</span><h3>Quer transformar isso em uma proposta possível?</h3><p>Use o gerador para combinar curso, contexto e tipo de ação.</p></div><Link href="/ferramentas/gerador-de-ideias/" className="button button-primary">Encontrar uma ideia <ArrowUpRight size={17} /></Link></aside><section className="article-sources"><h2>Fontes e cuidados editoriais</h2><p>Este guia apresenta orientações gerais. Para critérios, formulários e prazos, use sempre o roteiro da sua instituição e documentos oficiais relacionados à atividade.</p><a href="https://www.gov.br/mec" target="_blank" rel="noreferrer">Consultar informações do MEC <ArrowUpRight size={15} /></a></section></div>
      </div>
      {guide.sources?.length ? (
        <section className="article-sources section-inner">
          <h2>Fontes consultadas</h2>
          <ul>{guide.sources.map((source) => (
            <li key={source.title}>
              <strong>{source.institution}</strong> — {source.url
                ? <a href={source.url} target="_blank" rel="noopener noreferrer nofollow"
                     onClick={() => track("external_source_click", { slug: guide.slug, destino: source.url ?? "" })}>{source.title}</a>
                : source.title}
              {source.accessedAt ? <span> · acesso em {source.accessedAt}</span> : null}
            </li>))}
          </ul>
        </section>
      ) : null}
      {ctaDaPagina(guide.slug, "guide", guide.intent)}
      <section className="article-related"><SectionHeading eyebrow="Continue por aqui" title="Conteúdos relacionados" /><div className="guide-grid">{related.map((relatedGuide) => <GuideCard guide={relatedGuide} key={relatedGuide.slug} />)}</div></section>
    </article>
  </PageShell>;
}

export function CoursePage({ slug }: { slug: string }) {
  const course = getCourse(slug);
  if (!course) return <MissingPage />;
  // Enquanto o curso não tem conteúdo próprio no CMS, o hub cai no texto montado por
  // template — que é idêntico para os nove cursos. Com conteúdo, usa o que foi escrito.
  const title = course.title || `Projeto de Extensão em ${course.name}: ideias e exemplos`;
  const description = course.description || `Veja como transformar competências de ${course.name} em uma atividade extensionista com público, local, ODS e evidências coerentes.`;
  const path = `/cursos/${course.slug}/`;
  useSeo({ title, description, path, cluster: "cursos", schema: { "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Cursos", path: "/cursos/" }, { name: course.name, path }]), articleSchema(title, description, path, course.reviewedAt, "cursos")] } });
  const examples = [
    { title: course.ideas[0], text: `Uma proposta direta para ${course.places[0]}, conectada a uma necessidade que você pode observar e explicar.` },
    { title: course.ideas[1], text: `Uma ação em ${course.places[1] ?? course.places[0]} que utiliza uma habilidade do curso em formato acessível ao público.` },
    { title: course.ideas[2], text: `Uma atividade com começo, desenvolvimento e devolutiva, para gerar registros coerentes no relatório.` },
  ];
  return <PageShell><article className="hub-page"><div className="hub-hero"><Breadcrumb items={[{ label: "Cursos", href: "/cursos/" }, { label: course.name }]} /><div className="hub-hero-grid"><div><span className="article-eyebrow">Guia por curso</span><h1>Projeto de Extensão<br />em <em>{course.name}</em></h1><p>{course.summary} Use este hub para decidir o que fazer, onde realizar e como registrar a sua ação.</p><div className="hub-badges">{course.ods.map((ods) => <span key={ods}>{ods}</span>)}<span>Atividades práticas</span></div><div className="course-field-note"><span>Campo de ação</span><i /><strong>{course.places[0]}</strong><i /><strong>{course.ideas[0]}</strong></div></div><aside className="course-compass" style={{ "--course-accent": course.accent } as React.CSSProperties}><GraduationCap size={30} /><p>Comece pelas competências do seu curso e pelo que pode ser útil para um público real.</p></aside></div></div><section className="hub-section section-inner"><SectionHeading eyebrow="Ponto de partida" title="Três ideias para explorar" description="São caminhos de inspiração. Ajuste o objetivo, o público e os materiais ao roteiro e ao contexto do local." /><div className="idea-preview-grid">{examples.map((example, index) => <article key={example.title}><span>0{index + 1}</span><h3>{example.title}</h3><p>{example.text}</p><Link href="/ferramentas/gerador-de-ideias/">Adaptar esta ideia <ArrowRight size={16} /></Link></article>)}</div></section><section className="hub-band"><div className="section-inner hub-band-grid"><div><p className="eyebrow">Onde pode acontecer</p><h2>Procure contextos em que sua contribuição seja específica.</h2><p>Para {course.name}, pontos de partida comuns incluem {course.places.join(", ")}. A escolha depende de autorização, público e viabilidade.</p></div><div className="hub-list"><h3>Registros que podem ajudar</h3><ul><li><Check size={17} />Materiais e ambiente preparados</li><li><Check size={17} />Atividade em desenvolvimento, com autorização</li><li><Check size={17} />Resultado, devolutiva ou material produzido</li></ul></div></div></section>{course.sections?.length ? (
      <section className="hub-section section-inner course-copy">
        {course.quickAnswer && <p className="quick-answer">{course.quickAnswer}</p>}
        {course.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.bullets?.length ? <ul className="section-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
          </section>
        ))}
        {course.sources?.length ? (
          <section className="source-list">
            <h2>Fontes consultadas</h2>
            <ul>{course.sources.map((source) => (
              <li key={source.title}>
                <strong>{source.institution}</strong> — {source.url
                  ? <a href={source.url} target="_blank" rel="noopener noreferrer nofollow">{source.title}</a>
                  : source.title}
                {source.accessedAt ? <span> · acesso em {source.accessedAt}</span> : null}
              </li>))}
            </ul>
          </section>
        ) : null}
      </section>
    ) : null}{ctaDaPagina(course.slug, "course", course.intent)}<section className="hub-section section-inner"><SectionHeading eyebrow="Aprofunde" title="Conteúdos para seu percurso" /><div className="guide-grid">{findRelated(["ideias-projeto-de-extensao", "onde-realizar", "evidencias"]).map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div></section></article></PageShell>;
}

export function InstitutionPage({ slug }: { slug: string }) {
  const institution = getInstitution(slug);
  if (!institution) return <MissingPage />;
  const title = institution.title || `Projeto de Extensão ${institution.name}: guia para atividades extensionistas`;
  const path = `/faculdades/${institution.slug}/`;
  useSeo({ title, description: institution.description || institution.summary, path, cluster: "faculdades", schema: { "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Faculdades", path: "/faculdades/" }, { name: institution.name, path }]), articleSchema(title, institution.description || institution.summary, path, institution.reviewedAt, "faculdades")] } });
  return <PageShell><article className="institution-page"><div className="institution-hero" style={{ "--institution-tone": institution.tone } as React.CSSProperties}><Breadcrumb items={[{ label: "Faculdades", href: "/faculdades/" }, { label: institution.name }]} /><span className="article-eyebrow">Guia de apoio</span><h1>Projeto de Extensão<br /><em>{institution.name}</em></h1><p>{institution.summary}</p><div className="verification-badge"><ShieldCheck size={18} /><span><strong>Última verificação:</strong> {institution.reviewedAt || "agosto de 2026"}</span></div></div><div className="institution-content section-inner"><aside className="editorial-warning"><Info size={21} /><p><strong>Antes de começar:</strong> as orientações podem variar conforme curso, disciplina e período letivo. Consulte sempre o roteiro oficial disponibilizado pela sua instituição.</p></aside>{institution.sections?.length
        ? <div className="institution-copy">
            {institution.quickAnswer && <p className="quick-answer">{institution.quickAnswer}</p>}
            {institution.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                {section.bullets?.length ? <ul className="section-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
            {institution.sources?.length ? (
              <section className="source-list">
                <h2>Fontes consultadas</h2>
                <ul>{institution.sources.map((source) => (
                  <li key={source.title}>
                    <strong>{source.institution}</strong> — {source.url
                      ? <a href={source.url} target="_blank" rel="noopener noreferrer nofollow">{source.title}</a>
                      : source.title}
                    {source.accessedAt ? <span> · acesso em {source.accessedAt}</span> : null}
                  </li>))}
                </ul>
              </section>
            ) : null}
          </div>
        : <div className="two-column-copy"><section><h2>Use o roteiro como ponto de controle</h2><p>O roteiro da instituição informa os campos obrigatórios, prazos, formatos e evidências esperadas. Antes de escolher uma ideia, localize o objetivo da disciplina e destaque o que precisa aparecer no relatório.</p><p>Este portal não substitui orientações acadêmicas específicas. Ele ajuda a organizar o processo de entender, planejar, realizar e documentar sua ação.</p></section><section><h2>Um caminho seguro para se organizar</h2><ol className="number-list"><li><span>1</span><p>Leia o roteiro e marque entregas, datas e critérios.</p></li><li><span>2</span><p>Defina uma ação pequena, realista e ligada ao seu curso.</p></li><li><span>3</span><p>Confirme o local e planeje como registrar a experiência.</p></li><li><span>4</span><p>Use o checklist antes de preencher o relatório final.</p></li></ol></section></div>}{ctaDaPagina(institution.slug, "institution", institution.intent)}<section className="institution-next"><div><p className="eyebrow">Organize a atividade</p><h2>Se o roteiro trouxe dúvidas, comece pelo que é possível fazer.</h2></div><div className="institution-next-actions"><Link href="/ferramentas/gerador-de-ideias/" className="button button-primary">Gerar uma ideia</Link><Link href="/relatorio-final/" className="text-link">Ver guia de relatório <ArrowUpRight size={17} /></Link></div></section></div></article></PageShell>;
}

export function CollectionPage({ type }: { type: "cursos" | "faculdades" | "guias" | "ferramentas" }) {
  const content = {
    cursos: { title: "Projetos de extensão por curso", description: "Encontre pontos de partida que dialogam com as competências e os contextos de cada formação.", eyebrow: "Explorar por curso" },
    faculdades: { title: "Projetos de extensão por faculdade", description: "Guias de apoio para organizar a atividade a partir do seu roteiro institucional.", eyebrow: "Explorar por faculdade" },
    guias: { title: "Guias para projeto de extensão", description: "Conteúdos claros para entender, planejar, realizar e documentar sua atividade.", eyebrow: "Biblioteca prática" },
    ferramentas: { title: "Ferramentas para organizar seu projeto", description: "Três formas simples de transformar dúvida em um próximo passo possível.", eyebrow: "Ferramentas gratuitas" },
  }[type];
  const path = `/${type}/`;
  useSeo({ title: content.title, description: content.description, path, schema: breadcrumbSchema([{ name: content.title, path }]) });
  return <PageShell><section className="collection-page"><div className="collection-hero section-inner"><Breadcrumb items={[{ label: content.title }]} /><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p>{content.description}</p></div><div className="section-inner collection-content">{type === "cursos" && <div className="course-grid all-courses">{courses.map((course) => <CourseCard course={course} key={course.slug} />)}</div>}{type === "faculdades" && <><div className="institution-grid collection-institutions">{institutions.map((institution) => <InstitutionCard key={institution.slug} {...institution} />)}</div><p className="editorial-note">As páginas de faculdade apresentam orientação geral. Regras, campos e prazos devem ser confirmados no roteiro oficial da sua instituição.</p></>}{type === "guias" && <div className="guide-grid all-guides">{guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</div>}{type === "ferramentas" && <div className="tool-collection"><ToolCard href="/ferramentas/gerador-de-ideias/" icon="ideas" title="Gerador de ideias" description="Combine curso, local, público e complexidade para explorar propostas." /><ToolCard href="/ferramentas/seletor-de-ods/" icon="ods" title="Seletor de ODS" description="Encontre objetivos compatíveis e uma explicação para a relação." /><ToolCard href="/ferramentas/checklist-relatorio/" icon="check" title="Checklist do relatório" description="Salve seu andamento no próprio dispositivo, sem criar conta." /></div>}</div></section></PageShell>;
}

export function StaticPage({ page }: { page: "sobre" | "autoria" | "privacidade" | "termos" }) {
  const copy = {
    sobre: { title: "Sobre o Extensão Fácil", description: "Conheça o propósito editorial do portal e a forma como os conteúdos são preparados.", eyebrow: "O portal", sections: [{ title: "Orientação que ajuda a sair do lugar", text: "O Extensão Fácil é um portal independente de orientação prática sobre extensão universitária. Nosso foco é ajudar estudantes a entender o que precisa ser feito, tomar decisões mais claras e registrar suas atividades com responsabilidade." }, { title: "Como usamos as informações", text: "Nossos guias apresentam explicações gerais, exemplos e ferramentas de apoio. Cada instituição pode ter regras próprias; por isso, o roteiro oficial da disciplina continua sendo a fonte principal para requisitos, formatos e prazos." }, { title: "Compromisso editorial", text: "Não oferecemos trabalhos prontos nem orientamos o preenchimento de informações inventadas. O portal existe para apoiar o planejamento, a aprendizagem aplicada e a documentação honesta das ações extensionistas." }] },
    privacidade: { title: "Política de Privacidade", description: "Entenda como o Extensão Fácil trata dados e usa recursos locais para entregar as ferramentas.", eyebrow: "Privacidade", sections: [{ title: "Coleta mínima", text: "As ferramentas do Extensão Fácil foram concebidas para funcionar sem cadastro. Não pedimos informações pessoais para gerar ideias, selecionar ODS ou acompanhar o checklist." }, { title: "Armazenamento no dispositivo", text: "O checklist do relatório pode salvar seu progresso no localStorage do navegador. Esses dados ficam no seu dispositivo e podem ser removidos por você a qualquer momento, usando o botão de limpar progresso." }, { title: "Medição e contato", text: "Recursos de medição podem ser configurados no portal para compreender o uso agregado das páginas e ferramentas. Caso seja necessário consentimento para alguma tecnologia, ele será solicitado de forma apropriada." }] },
    autoria: { title: "Quem escreve o Extensão Fácil", description: "Como os conteúdos deste portal são produzidos, revisados e corrigidos.", eyebrow: "Autoria e método", sections: [
      { title: "Quem assina os conteúdos", text: "Os guias, hubs de curso e páginas de faculdade são produzidos e revisados pela equipe editorial do Extensão Fácil. Assinamos como equipe porque cada página passa por mais de uma mão: levantamento, redação, revisão de linguagem e conferência das ressalvas institucionais." },
      { title: "Como um conteúdo é produzido", text: "Partimos de dúvidas reais de estudantes e do que os roteiros de disciplina costumam pedir. Cada página é escrita para responder a uma pergunta específica, com exemplos identificados como fictícios e sem oferecer texto pronto para ser entregue como trabalho. Quando o assunto envolve exigência institucional, indicamos que ela varia e orientamos a consulta ao roteiro oficial." },
      { title: "O que não fazemos", text: "Não afirmamos regra de faculdade sem fonte, não publicamos estatística sem origem verificável, não descrevemos atividades reais de terceiros e não vendemos trabalhos prontos. Quando não temos uma resposta segura, dizemos isso na página em vez de preencher a lacuna." },
      { title: "Revisão e correção", text: "As páginas trazem a data da última verificação editorial, atualizada quando há revisão de conteúdo — não a cada ajuste de texto. Se você encontrar uma informação incorreta ou desatualizada, escreva para nós: a correção é publicada e a data de verificação é atualizada." },
    ] },
    termos: { title: "Termos de Uso", description: "Condições para o uso responsável dos guias e ferramentas do Extensão Fácil.", eyebrow: "Uso responsável", sections: [{ title: "Finalidade do portal", text: "O conteúdo tem caráter informativo e de apoio ao planejamento de atividades extensionistas. Ele não substitui orientações oficiais da instituição, acompanhamento docente ou normas aplicáveis ao contexto da ação." }, { title: "Responsabilidade do estudante", text: "O usuário deve adaptar as sugestões ao seu roteiro, curso, local e público. Todo registro, relato e evidência inserido em trabalhos acadêmicos deve corresponder ao que foi realmente realizado." }, { title: "Atualizações", text: "Podemos atualizar conteúdos para melhorar clareza e adequação. Páginas relacionadas a instituições indicam a última verificação editorial quando aplicável." }] },
  }[page];
  // Encadear ternários fazia toda página nova cair no /sobre/ por omissão — foi assim
  // que a /autoria/ nasceu com canonical apontando para outra página.
  const CAMINHOS: Record<typeof page, string> = {
    sobre: "/sobre/",
    autoria: "/autoria/",
    privacidade: "/politica-de-privacidade/",
    termos: "/termos-de-uso/",
  };
  const path = CAMINHOS[page];
  useSeo({ title: copy.title, description: copy.description, path, schema: breadcrumbSchema([{ name: copy.title, path }]) });
  return <PageShell><article className="static-page section-inner"><Breadcrumb items={[{ label: copy.title }]} /><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p className="static-deck">{copy.description}</p><div className="static-copy">{copy.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</div></article></PageShell>;
}

export function MissingPage() {
  useSeo({ title: "Página não encontrada", description: "A página que você procura não foi encontrada.", path: "/404/", noindex: true });
  return <PageShell><section className="missing-page section-inner"><SearchX size={36} /><p className="eyebrow">Caminho não encontrado</p><h1>Esta página não está no nosso roteiro.</h1><p>Volte ao início ou use a busca para encontrar um guia, curso ou ferramenta.</p><div><Link href="/" className="button button-primary">Ir para o início</Link><Link href="/buscar/" className="button button-outline">Buscar no portal</Link></div></section></PageShell>;
}
