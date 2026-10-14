"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { portfolioData, type PortfolioExperience } from "@/lib/arjun-os/portfolio-data";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { ChevronRight, FileText, ArrowUpRight } from "lucide-react";
import { PhoneLargeTitle, PhoneSection } from "@/components/arjun-os/phone-ui";

const roleFeatures: Record<string, { headline: string; value: string; label: string; detail: string }> = {
  copperleaf: { headline: "AI, from prototype to practice.", value: "2", label: "production AI portals", detail: "An ROI Analytics Portal adopted by Senior Leadership, and a Data Validation Portal that checks data before AI ingestion." },
  socius: { headline: "Better AI starts with people.", value: "86%", label: "recall in the study", detail: "Accessibility auditing research: 56% precision on the audited page–criterion records." },
  ta: { headline: "Making complex ideas click.", value: "250+", label: "students supported", detail: "Computer systems, networking, and hands-on C/C++ tutorials." },
};

function ExperienceDocument({ active, openResume, phone }: { active: PortfolioExperience; openResume: () => void; phone: boolean }) {
  const feature = roleFeatures[active.id];
  return <>
    <header className="pf-role-heading">
      <p className="pf-eyebrow">Experience · {active.period}</p>
      <div className="pf-role-identity">{active.logo && <Image src={active.logo} alt="" width={48} height={48} className="pf-company-logo" />}<h2>{active.organization}</h2></div>
      <h3>{feature.headline}</h3><p className="pf-role-title">{active.role}</p>
      <p className="os-note-metadata">{active.period} · {active.location}</p>
    </header>
    <div className={"pf-role-feature" + (active.id === "copperleaf" ? " is-ifs" : "")}><strong>{feature.value}</strong><div><span>{feature.label}</span><p>{feature.detail}</p></div></div>
    <p className="os-note-summary">{active.summary}</p>
    <section className="pf-role-section"><p className="pf-eyebrow">The work</p><h3>Highlights</h3><ul>{active.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className="pf-role-section"><p className="pf-eyebrow">How I work</p><h3>Tools & methods</h3><div className="os-note-tags">{active.tools.map(tool => <span key={tool}>{tool}</span>)}</div></section>
    <button type="button" onClick={openResume} className="pf-button pf-resume-action">{phone ? "Open Résumé" : "Download Résumé"}<ArrowUpRight size={15} aria-hidden /></button>
  </>;
}

export function ExperienceApp() {
  const { activeExperienceId, layoutMode } = useOSState();
  const { openResume, dispatch } = useOSActions();
  const reduced = useOsReducedMotion();
  const isPhone = layoutMode === "phone";
  const activeId = activeExperienceId ?? portfolioData.experience[0].id;
  const active = portfolioData.experience.find(item => item.id === activeId) ?? portfolioData.experience[0];

  if (isPhone && !activeExperienceId) return <div className="os-phone-screen os-notes-screen pf-notes-list">
    <PhoneLargeTitle title="Experience" eyebrow="Arjun OS · Notes" trailing={<span className="os-phone-title-icon"><FileText aria-hidden /></span>} />
    <PhoneSection title="Roles"><div className="os-phone-grouped-list">{portfolioData.experience.map(item => <button key={item.id} type="button" className="os-notes-row" onClick={() => dispatch({ type: "SET_ACTIVE_EXPERIENCE", experienceId: item.id })}>
      <span className="min-w-0 flex-1"><strong>{item.organization}</strong><span>{item.role}</span><small>{item.summary}</small><time>{item.period}</time></span><ChevronRight aria-hidden />
    </button>)}</div></PhoneSection>
  </div>;
  if (isPhone) return <article className="pf-document pf-experience-document os-phone-note-document"><ExperienceDocument active={active} openResume={openResume} phone /></article>;

  return <div className="os-experience-viewport h-full">
    <div className="experience-layout pf-experience-layout">
      <aside className="pf-role-rail"><p className="pf-eyebrow">In practice</p><h3>Experience</h3>
        <nav className="os-notes-desktop-list" aria-label="Professional roles">{portfolioData.experience.map(item => <button key={item.id} type="button" className={"os-notes-row " + (activeId === item.id ? "is-active" : "")} onClick={() => dispatch({ type: "SET_ACTIVE_EXPERIENCE", experienceId: item.id })} aria-current={activeId === item.id ? "page" : undefined}>
          <span className="min-w-0 flex-1"><strong>{item.organization}</strong><span>{item.role}</span><time>{item.period}</time></span><ChevronRight aria-hidden />
        </button>)}</nav>
      </aside>
      <div className="pf-experience-main"><AnimatePresence mode="wait" initial={false}>
        <motion.article key={active.id} className="pf-document pf-experience-document" initial={reduced ? false : {opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
          <ExperienceDocument active={active} openResume={openResume} phone={false} />
          <section className="pf-role-section pf-role-threads"><p className="pf-eyebrow">Alongside the work</p><h3>Research threads</h3>{portfolioData.research.map(note => <div key={note.id}><h4>{note.title}</h4><p>{note.summary}</p></div>)}</section>
        </motion.article>
      </AnimatePresence></div>
    </div>
  </div>;
}
