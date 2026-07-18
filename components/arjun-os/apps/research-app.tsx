"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";

const nodes = ["Accessibility", "Multimodal AI", "HCI", "Developer Tools"];

export function ResearchApp() {
  const reduced = useOsReducedMotion();
  return (
    <div className="h-full overflow-y-auto p-5 sm:p-7">
      <motion.div
        className="relative mb-6 aspect-[16/7] min-h-[180px] overflow-hidden rounded-2xl border border-os-hairline"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      >
        <Image
          src={portfolioData.visuals.researchHero}
          alt={portfolioData.visuals.researchHeroAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 840px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/85 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">Research</p>
          <h3 className="mt-1 text-xl font-semibold text-white">AI + human-centered systems</h3>
        </div>
      </motion.div>
      <p className="max-w-2xl text-sm leading-6 text-[var(--os-text-secondary)]">
        Research threads connecting accessibility, multimodal AI, HCI, and developer tools — grounded in SOCIUS Lab work and applied engineering projects.
      </p>

      <motion.div
        className="mt-6 grid gap-4 md:grid-cols-3"
        variants={staggerContainer(reduced, 0.08)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.25 }}
      >
        {portfolioData.research.map((item) => (
          <motion.article key={item.id} variants={cinematicItem(reduced)} whileHover={reduced ? undefined : { y: -4 }} className="rounded-2xl border border-os-hairline bg-os-fill-strong p-4">
            <h4 className="text-sm font-semibold text-[var(--os-text-primary)]">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-[var(--os-text-secondary)]">{item.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.themes.map((theme) => <span key={theme} className="rounded-full border border-[color:var(--os-accent-mint)]/25 px-2 py-0.5 font-mono text-[10px] text-[var(--os-accent-mint-text)]">{theme}</span>)}
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.section
        className="relative mt-8 overflow-hidden rounded-2xl border border-os-hairline bg-os-fill p-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(reduced, 0.1)}
      >
        <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">Research map</h4>
        <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {!reduced && <motion.span className="absolute left-[12%] right-[12%] top-1/2 h-px origin-left bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.55 }} transition={{ duration: 0.9, delay: 0.2 }} aria-hidden />}
          {nodes.map((node, index) => (
            <motion.span key={node} variants={cinematicItem(reduced)} className="relative z-10 rounded-xl border border-[var(--os-accent-mint)]/30 bg-os-fill-strong px-3 py-3 text-center text-sm text-[var(--os-text-primary)]">
              <span className="mb-1 block font-mono text-[9px] text-[var(--os-accent-mint-text)]">0{index + 1}</span>{node}
            </motion.span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
