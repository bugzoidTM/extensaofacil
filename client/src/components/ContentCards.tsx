/**
 * Direção visual: Caderno de Campo Contemporâneo — cartões de papel com etiquetas, cor de percurso e ação legível.
 */
import { ArrowUpRight, BookOpen, Building2, ClipboardCheck, FileText, Lightbulb, Target } from "lucide-react";
import { Link } from "wouter";
import type { Course, Guide } from "@/data/portalData";

export function ToolCard({ href, icon, title, description, label }: { href: string; icon: "ideas" | "ods" | "check"; title: string; description: string; label?: string }) {
  const Icon = icon === "ideas" ? Lightbulb : icon === "ods" ? Target : ClipboardCheck;
  return <Link href={href} className="tool-card"><div className="tool-card-top"><span className="tool-icon"><Icon size={23} /></span><span className="tool-label">{label ?? "Ferramenta gratuita"}</span></div><h3>{title}</h3><p>{description}</p><span className="tool-link">Abrir ferramenta <ArrowUpRight size={16} /></span></Link>;
}

export function GuideCard({ guide, compact = false }: { guide: Guide; compact?: boolean }) {
  return <Link href={`/${guide.slug}/`} className={`guide-card ${compact ? "compact" : ""}`}><div className="guide-card-head"><span>{guide.eyebrow}</span><ArrowUpRight size={18} /></div><h3>{guide.title}</h3>{!compact && <p>{guide.description}</p>}<div className="card-footer"><span>{guide.updated}</span><span>{guide.tags[0]}</span></div></Link>;
}

export function CourseCard({ course }: { course: Course }) {
  return <Link href={`/cursos/${course.slug}/`} className="course-card" style={{ "--course-accent": course.accent } as React.CSSProperties}><span className="course-stamp"><BookOpen size={18} /></span><h3>{course.short}</h3><p>{course.summary}</p><div><span>{course.ods[0]}</span><ArrowUpRight size={17} /></div></Link>;
}

export function InstitutionCard({ name, summary, slug, tone }: { name: string; summary: string; slug: string; tone: string }) {
  return <Link href={`/faculdades/${slug}/`} className="institution-card" style={{ "--institution-tone": tone } as React.CSSProperties}><span><Building2 size={18} /></span><div><h3>{name}</h3><p>{summary}</p></div><ArrowUpRight size={18} /></Link>;
}

export function PathCard({ href, icon, title, description }: { href: string; icon: "book" | "idea" | "ods" | "place" | "report" | "evidence"; title: string; description: string }) {
  const icons = { book: BookOpen, idea: Lightbulb, ods: Target, place: Building2, report: FileText, evidence: ClipboardCheck };
  const Icon = icons[icon];
  return <Link href={href} className="path-card"><Icon size={22} /><h3>{title}</h3><p>{description}</p><ArrowUpRight className="path-arrow" size={17} /></Link>;
}
