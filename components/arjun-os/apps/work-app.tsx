"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PhoneLargeTitle, PhoneSearch, PhoneSegmented, PhoneSection, usePhonePresentationState } from "@/components/arjun-os/phone-ui";
import { getProject, portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import type { ProjectId } from "@/lib/arjun-os/types";
import { RoadpackCaseStudy } from "../roadpack-case-study";
import { ProjectArt, projectEditorial } from "../project-art";
import { CaseStudyChapter } from "../case-study-sections";
import { brandOpen } from "../brand-transition";

const CHAPTERS = [
  "Overview",
  "Problem",
  "Role",
  "Process",
  "Architecture",
  "Results",
  "Learnings",
  "Links",
] as const;

type Chapter = (typeof CHAPTERS)[number];

export function WorkApp() {
  const { activeProjectId, layoutMode } = useOSState();
  const { dispatch } = useOSActions();
  const reduced = useOsReducedMotion();
  const [chapter, setChapter] = useState<Chapter>("Overview");
  const caseRoot = useRef<HTMLElement>(null);
  useEffect(() => setChapter("Overview"), [activeProjectId]);
  // A new desktop chapter starts at its heading even after a long product tour.
  useEffect(() => {
    if (layoutMode !== "phone") caseRoot.current?.parentElement?.scrollTo({ top: 0 });
  }, [chapter, activeProjectId, layoutMode]);
  const [phoneFilter, setPhoneFilter] = usePhonePresentationState<"Featured" | "All">("work-filter", "All");
  const [phoneQuery, setPhoneQuery] = usePhonePresentationState("work-query", "");
  const project = activeProjectId ? getProject(activeProjectId) : null;
  const onBack = () => { setChapter("Overview"); dispatch({ type: "SET_ACTIVE_PROJECT", projectId: null }); };
  const chooseProject = (id: ProjectId) => { setChapter("Overview"); dispatch({ type: "SET_ACTIVE_PROJECT", projectId: id }); };

  if (project?.id === "roadpack") return <RoadpackCaseStudy onBack={onBack} />;
  if (project) {
    const isPhone = layoutMode === "phone";
    return <article ref={caseRoot} data-case-project={project.id} className={"pf-document pf-case " + (isPhone ? "pf-case-phone" : "")}>
      {!isPhone && <button className="pf-link pf-back" onClick={onBack}>← Selected Work</button>}
      {layoutMode === "tabletPortrait" && <nav className="pf-project-switcher" aria-label="Projects">{portfolioData.projects.map(item => <button key={item.id} aria-current={project.id === item.id ? "page" : undefined} onClick={() => chooseProject(item.id)}>{item.title}</button>)}</nav>}
      <nav className="pf-chapter-nav" aria-label="Case study chapters">
        {CHAPTERS.map(item => isPhone ? <a key={item} href={"#chapter-" + item.toLowerCase()}>{item}</a> : <button key={item} aria-current={chapter === item ? "page" : undefined} onClick={() => setChapter(item)}>{item}</button>)}
      </nav>
      <header className={"pf-case-heading" + (chapter !== "Overview" && !isPhone ? " pf-case-heading-compact" : "")}>
        <p className="pf-eyebrow">{project.label}</p><h2>{project.title}</h2>
        {(isPhone || chapter === "Overview") && <h3>{projectEditorial[project.id].headline}</h3>}
      </header>
      {isPhone ? CHAPTERS.map(item => <section key={item} id={"chapter-" + item.toLowerCase()} className={item === "Overview" ? "pf-case-overview" : "pf-chapter-body pf-rich-chapter"}>
        {item !== "Overview" && <><p className="pf-eyebrow">{project.title}</p><h3>{item}</h3></>}
        <CaseStudyChapter project={project} chapter={item} />
      </section>) : <AnimatePresence mode="wait" initial={false}>
        <motion.section key={project.id + chapter} className={chapter === "Overview" ? "pf-case-overview" : "pf-chapter-body pf-rich-chapter"} initial={reduced ? false : {opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
          {chapter !== "Overview" && <><p className="pf-eyebrow">Inside {project.title}</p><h3>{chapter}</h3></>}
          <CaseStudyChapter project={project} chapter={chapter} />
        </motion.section>
      </AnimatePresence>}
    </article>;
  }

  if (layoutMode === "phone") {
    const shown = portfolioData.projects.filter((item, index) => {
      const query = phoneQuery.trim().toLowerCase();
      return (phoneFilter === "All" || index < 4) && (!query || (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase().includes(query));
    });
    return <div className="os-phone-screen pf-phone-work">
      <PhoneLargeTitle title="Work" eyebrow="Arjun OS · Files" />
      <PhoneSearch value={phoneQuery} onChange={setPhoneQuery} placeholder="Search projects" />
      <PhoneSegmented value={phoneFilter} options={["Featured", "All"] as const} onChange={setPhoneFilter} label="Project filter" />
      <PhoneSection title="Projects"><div className="os-phone-grouped-list">
        {shown.map(item => <button key={item.id} type="button" className="os-files-row pf-file-project" onClick={(event) => brandOpen(event.currentTarget, item.id, () => chooseProject(item.id))}>
          <span className="os-files-thumbnail"><ProjectArt id={item.id} compact /></span>
          <span className="min-w-0 flex-1"><strong>{item.title}</strong><small>{item.tags.slice(0, 2).join(" · ")}</small><small>{item.summary}</small></span><ChevronRight aria-hidden />
        </button>)}
        {shown.length === 0 && <p className="os-phone-empty">No projects match “{phoneQuery}”.</p>}
      </div></PhoneSection>
    </div>;
  }

  return <div className="pf-document pf-work-list">
    <header className="pf-gallery-heading"><p className="pf-eyebrow">Selected Work · 2024–2026</p><h3 className="pf-work-heading">A few things I’ve<br />put into the world.</h3><p>Shipped products, open-source tools, and research.<br />The ideas, decisions, and engineering behind them.</p></header>
    <div className="work-project-grid">
      {portfolioData.projects.map(item => <motion.button key={item.id} type="button" onClick={(event) => brandOpen(event.currentTarget, item.id, () => chooseProject(item.id))} className="pf-project-card" whileHover={reduced ? undefined : {y:-3}} whileTap={reduced ? undefined : {scale:.99}}>
        <div className="pf-project-copy"><p className="pf-eyebrow">{item.label}</p><h4>{item.title}</h4><p>{projectEditorial[item.id].headline}</p><span className="pf-link">View project<ArrowRight size={15} aria-hidden /></span></div>
        <ProjectArt id={item.id} />
        <div className="pf-project-detail"><p>{item.summary}</p><span>{item.tags.join(" · ")}</span></div>
      </motion.button>)}
    </div>
  </div>;
}
