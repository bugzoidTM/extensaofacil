/**
 * Direção visual: Caderno de Campo Contemporâneo — busca direta, resultados legíveis e sem becos sem saída.
 */
import { ArrowUpRight, Search } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Breadcrumb, PageShell } from "@/components/PortalLayout";
import { normalize, searchIndex } from "@/data/portalData";
import { track } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const initial = new URLSearchParams(window.location.search).get("q") ?? "";
  const [query, setQuery] = useState(initial);
  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get("q") ?? ""); }, [location]);
  const results = useMemo(() => { const term = normalize(query.trim()); if (!term) return []; return searchIndex.filter((entry) => normalize([entry.title, entry.description, entry.category, ...entry.tags].join(" ")).includes(term)); }, [query]);
  useSeo({ title: "Buscar no portal", description: "Pesquise guias, cursos, faculdades e ferramentas sobre extensão universitária.", path: "/buscar/", noindex: true });
  function submit(event: FormEvent) { event.preventDefault(); const value = query.trim(); setLocation(value ? `/buscar/?q=${encodeURIComponent(value)}` : "/buscar/"); if (value) track("internal_search", { query: value }); }
  return <PageShell><section className="search-page section-inner"><Breadcrumb items={[{ label: "Buscar" }]} /><p className="eyebrow">Busca interna</p><h1>O que você quer entender agora?</h1><form onSubmit={submit} className="search-form"><Search size={21} /><label className="sr-only" htmlFor="search-input">Buscar conteúdo</label><input id="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: relatório final, pedagogia, ODS..." autoFocus /><button type="submit" className="button button-primary">Buscar</button></form>{query.trim() ? <div className="search-results"><p className="results-summary">{results.length} resultado{results.length === 1 ? "" : "s"} para <strong>“{query.trim()}”</strong></p>{results.length ? <div>{results.map((result) => <Link href={result.href} className="search-result" key={result.href}><span>{result.category}</span><h2>{result.title}</h2><p>{result.description}</p><ArrowUpRight size={18} /></Link>)}</div> : <div className="search-empty"><h2>Nenhum resultado exato por aqui.</h2><p>Tente termos como “projeto de extensão”, “ideias”, “relatório”, “ODS” ou o nome do seu curso.</p></div>}</div> : <div className="search-suggestions"><p>Você pode buscar por tema, etapa, curso, faculdade ou ferramenta.</p><div>{["projeto de extensão", "ideias", "relatório final", "ODS", "evidências"].map((suggestion) => <button type="button" key={suggestion} onClick={() => { setQuery(suggestion); setLocation(`/buscar/?q=${encodeURIComponent(suggestion)}`); }}>{suggestion}</button>)}</div></div>}</section></PageShell>;
}
