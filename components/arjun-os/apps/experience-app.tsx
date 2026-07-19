"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { cn } from "@/utils/cn";
import { ChevronRight, FileText } from "lucide-react";
import { PhoneLargeTitle, PhoneSection } from "@/components/arjun-os/phone-ui";

export function ExperienceApp() {
  const { activeExperienceId, layoutMode } = useOSState();
  const { openResume, dispatch } = useOSActions();
  const reduced = useOsReducedMotion();
  const isPhone = layoutMode === "phone";
  const activeId = activeExperienceId ?? portfolioData.experience[1]?.id ?? portfolioData.experience[0].id;
  const active = portfolioData.experience.find((item) => item.id === activeId) ?? portfolioData.experience[0];

  if (isPhone && !activeExperienceId) {
    return (
      <div className="os-phone-screen os-notes-screen">
        <PhoneLargeTitle title="Experience" eyebrow="Arjun OS · Notes" trailing={<span className="os-phone-title-icon"><FileText aria-hidden /></span>} />
        <PhoneSection title="Roles">
          <div className="os-phone-grouped-list">
            {portfolioData.experience.map((item) => (
              <button key={item.id} type="button" className="os-notes-row" onClick={() => dispatch({ type: "SET_ACTIVE_EXPERIENCE", experienceId: item.id })}>
                <span className="min-w-0 flex-1"><strong>{item.organization}</strong><span>{item.role}</span><small>{item.summary}</small><time>{item.period}</time></span>
                <ChevronRight aria-hidden />
              </button>
            ))}
          </div>
        </PhoneSection>
      </div>
    );
  }

  if (isPhone && activeExperienceId) {
    return (
      <article className="os-phone-note-document">
        <p className="os-phone-eyebrow">Experience note</p>
        <div className="mt-3 flex items-center gap-3">
          {active.logo && <Image src={active.logo} alt="" width={46} height={46} className="rounded-xl bg-white object-contain p-1" />}
          <div><h2>{active.organization}</h2><p className="os-note-role">{active.role}</p></div>
        </div>
        <p className="os-note-metadata">{active.period} · {active.location}</p>
        <p className="os-note-summary">{active.summary}</p>
        <h3>Highlights</h3>
        <ul>{active.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Tools & methods</h3>
        <div className="os-note-tags">{active.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
        <button type="button" onClick={openResume} className="os-phone-primary-action">Open Résumé</button>
      </article>
    );
  }

  return (
    <div className="experience-layout grid h-full">
      <aside className={cn("border-r border-os-hairline bg-os-fill-strong p-4", isPhone && activeExperienceId && "hidden")}>
        <p className="os-phone-eyebrow">Notes</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--os-text-primary)]">Experience</h3>
        <motion.div
          className="os-notes-desktop-list mt-4"
          variants={staggerContainer(reduced, 0.07)}
          initial="initial"
          animate="animate"
        >
          {portfolioData.experience.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              variants={cinematicItem(reduced)}
              onClick={() => dispatch({ type: "SET_ACTIVE_EXPERIENCE", experienceId: item.id })}
              className={cn("os-notes-row", activeId === item.id && "is-active")}
              aria-current={activeId === item.id ? "page" : undefined}
            >
              <span className="min-w-0 flex-1">
                <strong>{item.organization}</strong>
                <span>{item.role}</span>
                <time>{item.period}</time>
              </span>
              <ChevronRight aria-hidden />
            </motion.button>
          ))}
        </motion.div>
      </aside>

      <div className={cn("p-5 sm:p-7", isPhone && !activeExperienceId && "hidden")}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={active.id}
            className="os-notes-desktop-document os-phone-note-document"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -10, filter: "blur(3px)" }}
          >
            <p className="os-phone-eyebrow">Experience note</p>
            <div className="mt-3 flex items-center gap-3">
              {active.logo && (
                <Image src={active.logo} alt="" width={46} height={46} className="rounded-xl bg-white object-contain p-1" />
              )}
              <div>
                <h2>{active.organization}</h2>
                <p className="os-note-role">{active.role}</p>
              </div>
            </div>
            <p className="os-note-metadata">
              {active.period} · {active.location}
            </p>
            <p className="os-note-summary">{active.summary}</p>
            <h3>Highlights</h3>
            <ul>
              {active.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Tools & methods</h3>
            <div className="os-note-tags">
              {active.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <button type="button" onClick={openResume} className="os-phone-primary-action max-w-xs">
              Download Résumé
            </button>
          </motion.article>
        </AnimatePresence>
      </div>

      <aside className="hidden border-l border-os-hairline p-4 lg:block">
        <p className="os-phone-eyebrow">Sticky notes</p>
        <p className="mt-1 text-sm font-semibold text-[var(--os-text-primary)]">Research threads</p>
        <div className="mt-3 space-y-3">
          {portfolioData.research.map((note) => (
            <article key={note.id} className="os-notes-sticky">
              <h4>{note.title}</h4>
              <p>{note.summary}</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
