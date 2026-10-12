import Image from "next/image";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { type PortfolioProject } from "@/lib/arjun-os/portfolio-data";
import { projectCaseStudies, type CaseMedia, type DetailedProjectId } from "@/lib/arjun-os/project-case-studies";
import dimensions from "@/public/case-studies/dimensions.json";
import { ProjectArt, projectEditorial } from "./project-art";
import { EngineeringStories } from "./engineering-stories";

type Chapter = "Overview" | "Problem" | "Role" | "Process" | "Architecture" | "Results" | "Learnings" | "Links";

function CaseFigure({ media }: { media: CaseMedia }) {
  const size = dimensions[media.asset as keyof typeof dimensions];
  return <figure className={"pf-story-figure" + (media.portrait ? " pf-story-portrait" : "")}>
    <div className="pf-story-image"><Image src={"/case-studies/" + media.asset + ".webp"} alt={media.alt} width={size.width} height={size.height} sizes={media.portrait ? "(max-width: 640px) 80vw, 400px" : "(max-width: 640px) 100vw, 1000px"} /></div>
    <figcaption>{media.caption}</figcaption>
  </figure>;
}

function SourceNotes({ id }: { id: DetailedProjectId }) {
  return <footer className="pf-case-sources"><span>Explore the original work</span><div>{projectCaseStudies[id].sources.map(source => <a className="pf-link" key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={14} aria-hidden /></a>)}</div></footer>;
}

function ResultWidgets({ project }: { project: PortfolioProject }) {
  return <div className="pf-glass-stage pf-summary-stage"><div className="pf-case-outcomes">{project.results.slice(0, 3).map(result => <div className="pf-glass-widget" key={result}><Check size={17} aria-hidden /><p>{result}</p></div>)}</div></div>;
}

export function CaseStudyChapter({ project, chapter }: { project: PortfolioProject; chapter: Chapter }) {
  const id = project.id as DetailedProjectId;
  const study = projectCaseStudies[id];
  if (chapter === "Overview") return <>
    <figure className="pf-case-cover"><ProjectArt id={id} priority /><figcaption>{projectEditorial[id].caption}</figcaption></figure>
    <div className="pf-case-facts"><span><small>My role</small>{project.role}</span><span><small>Status</small>{project.label}</span><span><small>Period</small>{project.year}</span></div>
    <div className="pf-case-summary"><p className="pf-lede">{project.summary}</p><div className="pf-actions">{project.links.map(link => <a key={link.href} className="pf-link" href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} aria-hidden /></a>)}</div></div>
    <ResultWidgets project={project} />
    <EngineeringStories projectId={id} />
    <section className="pf-story-premise"><p className="pf-eyebrow">The idea</p><h3>{study.premise.title}</h3><p>{study.premise.body}</p></section>
    <div className="pf-feature-stories">{study.features.map((feature, index) => <section key={feature.title} className={"pf-feature-story" + (feature.media.length > 1 ? " pf-feature-pair" : feature.media[0].portrait ? "" : " pf-feature-landscape") + (index % 2 ? " pf-feature-reverse" : "")}>
      <div className="pf-story-copy"><p className="pf-eyebrow">{feature.eyebrow}</p><h4>{feature.title}</h4><p>{feature.body}</p></div>
      <div className="pf-story-gallery">{feature.media.map(media => <CaseFigure key={media.asset} media={media} />)}</div>
    </section>)}</div>
    <p className="pf-case-note">{study.resultNote}</p><SourceNotes id={id} />
  </>;
  if (chapter === "Process") return <>
    <div className="pf-chapter-intro"><h4>{study.process.title}</h4><p>{study.process.body}</p></div>
    <ol className="pf-decision-grid" aria-label={project.title + " design decisions"}>{study.process.decisions.map((decision, index) => <li key={decision.title}><span className="pf-step-number">{String(index + 1).padStart(2, "0")}</span><h4>{decision.title}</h4><p>{decision.body}</p><div className="pf-decision-consequence"><Check size={16} aria-hidden /><span>{decision.consequence}</span></div></li>)}</ol>
    {study.process.media && <CaseFigure media={study.process.media} />}<SourceNotes id={id} />
  </>;
  if (chapter === "Architecture") return <>
    <div className="pf-chapter-intro"><h4>{study.system.title}</h4><p>{project.architecture}</p></div>
    <div className="pf-glass-stage pf-system-map"><p className="pf-eyebrow">System at a glance</p><div className="pf-system-groups">{study.system.groups.map(group => <section key={group.label} className="pf-glass-widget"><p className="pf-eyebrow">{group.label}</p><h4>{group.title}</h4><p>{group.body}</p><div className="pf-tags">{group.tools.map(tool => <span key={tool}>{tool}</span>)}</div></section>)}</div></div>
    {study.system.media && <CaseFigure media={study.system.media} />}
    <div className="pf-flow-heading"><p className="pf-eyebrow">How it fits together</p><h4>Follow the work through the system.</h4></div>
    <ol className="pf-architecture pf-detailed-flow" aria-label={project.title + " architecture flow"}>{study.system.stages.map((stage, index) => <li key={stage.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{stage.title}</strong><p>{stage.body}</p></div></li>)}</ol>
    <aside className="pf-system-boundary"><ShieldCheck size={20} aria-hidden /><div><strong>The boundary</strong><p>{study.system.boundary}</p></div></aside><SourceNotes id={id} />
  </>;
  if (chapter === "Problem") return <>
    <p className="pf-chapter-lede">{project.problem}</p><div className="pf-problem-grid">{study.problem.map(frame => <section key={frame.title}><h4>{frame.title}</h4><p>{frame.body}</p></section>)}</div>
    <div className="pf-approach"><p className="pf-eyebrow">The approach</p><p>{project.approach}</p></div>
  </>;
  if (chapter === "Role") return <>
    <p className="pf-chapter-lede">{project.role}</p><ol className="pf-scope-list">{study.scope.map((item, index) => <li key={item}><span className="pf-step-number">{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol><div className="pf-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>
  </>;
  if (chapter === "Results") return <>
    <ResultWidgets project={project} />{study.resultMedia && <CaseFigure media={study.resultMedia} />}<p className="pf-case-note">{study.resultNote}</p><ul className="pf-secondary-results">{project.results.slice(3).map(result => <li key={result}>{result}</li>)}</ul><SourceNotes id={id} />
  </>;
  if (chapter === "Learnings") return <>
    <div className="pf-learning-grid">{project.learnings.map((entry, index) => <section key={entry}><span className="pf-step-number">{String(index + 1).padStart(2, "0")}</span><h4>{entry}</h4></section>)}</div><aside className="pf-system-boundary"><ShieldCheck size={20} aria-hidden /><div><strong>What I carry forward</strong><p>{study.system.boundary}</p></div></aside>
  </>;
  return <><div className="pf-actions">{project.links.map(link => <a key={link.href} className="pf-link" href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} aria-hidden /></a>)}</div><div className="pf-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><SourceNotes id={id} /></>;
}
