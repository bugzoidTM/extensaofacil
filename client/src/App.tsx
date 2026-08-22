/**
 * Direção visual: Caderno de Campo Contemporâneo — arquitetura aberta, navegação contextual e carregamento leve por percurso.
 */
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ArticlePage = lazy(async () => ({ default: (await import("./pages/ContentPages")).ArticlePage }));
const CollectionPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).CollectionPage }));
const CoursePage = lazy(async () => ({ default: (await import("./pages/ContentPages")).CoursePage }));
const InstitutionPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).InstitutionPage }));
const MissingPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).MissingPage }));
const StaticPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).StaticPage }));
const ChecklistToolPage = lazy(async () => ({ default: (await import("./pages/ToolsPages")).ChecklistToolPage }));
const IdeasToolPage = lazy(async () => ({ default: (await import("./pages/ToolsPages")).IdeasToolPage }));
const OdsToolPage = lazy(async () => ({ default: (await import("./pages/ToolsPages")).OdsToolPage }));

function RouteLoading() {
  return <div className="route-loading" role="status" aria-label="Carregando conteúdo"><span /><span /><span /></div>;
}

function Router() {
  return <Suspense fallback={<RouteLoading />}><Switch>
    <Route path="/" component={Home} />
    <Route path="/buscar/" component={SearchPage} />
    <Route path="/ferramentas/" component={() => <CollectionPage type="ferramentas" />} />
    <Route path="/ferramentas/gerador-de-ideias/" component={IdeasToolPage} />
    <Route path="/ferramentas/seletor-de-ods/" component={OdsToolPage} />
    <Route path="/ferramentas/checklist-relatorio/" component={ChecklistToolPage} />
    <Route path="/relatorio-final/:section/">{(params) => <ArticlePage slug={`relatorio-final/${params.section}`} />}</Route>
    <Route path="/cursos/" component={() => <CollectionPage type="cursos" />} />
    <Route path="/cursos/:course/ideias/">{(params) => <ArticlePage slug={`cursos/${params.course}/ideias`} />}</Route>
    <Route path="/cursos/:slug/">{(params) => <CoursePage slug={params.slug} />}</Route>
    <Route path="/faculdades/" component={() => <CollectionPage type="faculdades" />} />
    <Route path="/faculdades/:slug/">{(params) => <InstitutionPage slug={params.slug} />}</Route>
    <Route path="/guias/" component={() => <CollectionPage type="guias" />} />
    <Route path="/sobre/" component={() => <StaticPage page="sobre" />} />
    <Route path="/autoria/" component={() => <StaticPage page="autoria" />} />
    <Route path="/politica-de-privacidade/" component={() => <StaticPage page="privacidade" />} />
    <Route path="/termos-de-uso/" component={() => <StaticPage page="termos" />} />
    <Route path="/:slug/">{(params) => <ArticlePage slug={params.slug} />}</Route>
    <Route component={MissingPage} />
  </Switch></Suspense>;
}

export default function App() {
  return <ErrorBoundary><Router /></ErrorBoundary>;
}
