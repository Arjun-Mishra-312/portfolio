"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSActions } from "@/lib/arjun-os/os-context";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { cn } from "@/utils/cn";

export function ExperienceApp() {
  const [activeId, setActiveId] = useState(portfolioData.experience[1]?.id ?? portfolioData.experience[0].id);
  const { openResume } = useOSActions();
  const reduced = useOsReducedMotion();
  const active = portfolioData.experience.find((item) => item.id === activeId) ?? portfolioData.experience[0];

  return (
    <div className="grid h-full min-h-[420px] lg:grid-cols-[240px_1fr_220px]">
      <aside className="border-r border-os-hairline bg-os-fill-strong p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
          Experience + Research
        </p>
        <motion.ol className="mt-4 space-y-3" variants={staggerContainer(reduced, 0.07)} initial="initial" animate="animate">
          {portfolioData.experience.map((item, index) => (
            <motion.li key={item.id} variants={cinematicItem(reduced)}>
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "w-full rounded-xl border px-3 py-3 text-left transition",
                  activeId === item.id
                    ? "border-[var(--os-accent-violet)] bg-[var(--os-accent-violet)]/10"
                    : "border-os-hairline hover:bg-os-hover",
                )}
              >
                <p className="font-mono text-[10px] text-[var(--os-text-muted)]">0{index + 1}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--os-text-primary)]">{item.organization}</p>
                <p className="text-[11px] text-[var(--os-text-secondary)]">{item.role}</p>
              </button>
            </motion.li>
          ))}
        </motion.ol>
      </aside>

      <div className="overflow-y-auto p-5 sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active.id} initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -10, filter: "blur(3px)" }}>
        <div className="flex items-center gap-3">
          {active.logo && (
            <Image src={active.logo} alt="" width={40} height={40} className="rounded-lg object-contain" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-[var(--os-text-primary)]">{active.organization}</h3>
            <p className="text-sm text-[var(--os-accent-cobalt-text)]">{active.role}</p>
          </div>
        </div>
        <p className="mt-2 font-mono text-[11px] text-[var(--os-text-muted)]">
          {active.period} · {active.location}
        </p>
        <p className="mt-4 text-sm leading-6 text-[var(--os-text-secondary)]">{active.summary}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--os-text-primary)]">
          {active.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {active.tools.map((tool) => (
            <span key={tool} className="rounded-full border border-os-hairline px-2.5 py-1 text-[11px] text-[var(--os-text-secondary)]">
              {tool}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={openResume}
          className="mt-6 rounded-xl bg-[var(--os-action-violet)] px-4 py-2.5 text-sm font-medium text-white"
        >
          Download Résumé
        </button>
        </motion.div>
        </AnimatePresence>
      </div>

      <aside className="hidden border-l border-os-hairline p-4 lg:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">Research notes</p>
        <div className="mt-3 space-y-3">
          {portfolioData.research.map((note, index) => (
            <article
              key={note.id}
              className="rounded-xl border border-os-hairline bg-os-fill-strong p-3"
              style={{
                borderColor:
                  index === 0 ? "rgba(167,139,250,0.45)" : index === 1 ? "rgba(52,211,153,0.45)" : "rgba(245,158,11,0.45)",
              }}
            >
              <h4 className="text-xs font-semibold text-[var(--os-text-primary)]">{note.title}</h4>
              <p className="mt-1 text-[11px] leading-5 text-[var(--os-text-secondary)]">{note.summary}</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
