"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronRight, FolderOpen } from "lucide-react";
import { PhoneLargeTitle, PhoneSearch, PhoneSegmented, PhoneSection, usePhonePresentationState } from "@/components/arjun-os/phone-ui";
import { getProject, portfolioData } from "@/lib/arjun-os/portfolio-data";
import { fadeUpItem, staggerChildren, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import type { ProjectId } from "@/lib/arjun-os/types";
import { cn } from "@/utils/cn";

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

const ARCHITECTURE_STAGES: Record<ProjectId, string[]> = {
  "ai-accessibility-analyzer": ["Browser capture", "Static WCAG checks", "VLM review", "Normalized evidence", "Evaluator decision"],
  "llm-pro-max": ["Repository ingest", "Chunk + embed", "Graph enrichment", "Retrieve + rank", "Grounded answer"],
  "re-plate": ["Donation capture", "Vision classification", "Safety checks", "Matching workflow", "Impact analytics"],
};

export function WorkApp() {
  const { activeProjectId, layoutMode } = useOSState();
  const { dispatch } = useOSActions();
  const reduced = useOsReducedMotion();
  const [chapter, setChapter] = useState<Chapter>("Overview");
  const [direction, setDirection] = useState(1);
  const [phoneFilter, setPhoneFilter] = usePhonePresentationState<"Featured" | "All">("work-filter", "Featured");
  const [phoneQuery, setPhoneQuery] = usePhonePresentationState("work-query", "");
  const project = activeProjectId
    ? getProject(activeProjectId)
    : layoutMode === "tabletPortrait"
      ? portfolioData.projects[0]
      : null;
  const selectChapter = (next: Chapter) => {
    setDirection(CHAPTERS.indexOf(next) >= CHAPTERS.indexOf(chapter) ? 1 : -1);
    setChapter(next);
  };

  if (project) {
    if (layoutMode === "phone") {
      return (
        <article className="os-phone-document space-y-8 px-5 pb-10">
          <nav className="os-phone-document-index" aria-label="Case study chapters">
            {CHAPTERS.map((item) => <a key={item} href={`#chapter-${item.toLowerCase()}`}>{item}</a>)}
          </nav>
          <section id="chapter-overview" className="scroll-mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-accent-violet-text)]">Case study</p>
            <h2 className="mt-2 text-2xl font-semibold text-os-primary">{project.title}</h2>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-os-hairline"><Image src={project.image} alt={project.title} fill className="object-cover" /></div>
            <p className="mt-4 text-sm leading-6 text-os-secondary">{project.summary}</p>
          </section>
          <section id="chapter-problem" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Problem</h3><p className="mt-2 text-sm leading-6 text-os-secondary">{project.problem}</p></section>
          <section id="chapter-role" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Role</h3><p className="mt-2 text-sm leading-6 text-os-secondary">{project.role}</p></section>
          <section id="chapter-process" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Process</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-os-secondary">{project.process.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section id="chapter-architecture" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Architecture</h3><p className="mt-2 text-sm leading-6 text-os-secondary">{project.architecture}</p><ol className="mt-3 space-y-2">{ARCHITECTURE_STAGES[project.id].map((stage, index) => <li key={stage} className="rounded-xl border border-os-hairline bg-os-fill p-3 text-sm"><span className="mr-2 font-mono text-[10px] text-[var(--os-accent-cyan-text)]">{String(index + 1).padStart(2, "0")}</span>{stage}</li>)}</ol></section>
          <section id="chapter-results" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Results</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-os-primary">{project.results.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section id="chapter-learnings" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Learnings</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-os-secondary">{project.learnings.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section id="chapter-links" className="scroll-mt-16"><h3 className="text-lg font-semibold text-os-primary">Links</h3><div className="mt-3 flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-full border border-os-hairline px-3 py-1.5 text-xs text-os-secondary">{tech}</span>)}</div></section>
        </article>
      );
    }
    return (
      <div className="flex h-full min-h-[420px]">
        <aside className="hidden w-44 shrink-0 border-r border-os-hairline bg-os-fill-strong p-3 sm:block">
          <div className="mb-3 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-[var(--os-accent-violet)]" aria-hidden />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
              Case study
            </p>
          </div>
          {layoutMode === "tabletPortrait" ? (
            <nav className="space-y-2" aria-label="Projects">
              {portfolioData.projects.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setChapter("Overview");
                    dispatch({ type: "SET_ACTIVE_PROJECT", projectId: item.id as ProjectId });
                  }}
                  className={cn(
                    "w-full rounded-xl border px-3 py-3 text-left",
                    project.id === item.id ? "border-[var(--os-accent-violet)] bg-os-fill-strong" : "border-os-hairline text-os-secondary",
                  )}
                >
                  <span className="block text-xs font-semibold text-os-primary">{item.title}</span>
                  <span className="mt-1 block text-[10px] leading-4">{item.tags.slice(0, 2).join(" · ")}</span>
                </button>
              ))}
            </nav>
          ) : <motion.nav
            className="space-y-1"
            aria-label="Case study chapters"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: staggerChildren(reduced, 0.035) } }}
          >
            {CHAPTERS.map((item, index) => (
              <motion.button
                key={item}
                type="button"
                variants={fadeUpItem}
                onClick={() => selectChapter(item)}
                style={
                  reduced
                    ? undefined
                    : {
                        transformOrigin: "left center",
                        rotate: (index - 3.5) * 0.6,
                      }
                }
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-xs shadow-[0_1px_0_rgba(255,255,255,0.04)]",
                  chapter === item
                    ? "bg-os-fill-strong text-[var(--os-text-primary)]"
                    : "text-[var(--os-text-secondary)] hover:bg-os-hover",
                )}
              >
                {item}
              </motion.button>
            ))}
          </motion.nav>}
          {layoutMode !== "tabletPortrait" && <button
            type="button"
            onClick={() => dispatch({ type: "SET_ACTIVE_PROJECT", projectId: null })}
            className="mt-4 text-xs text-[var(--os-text-muted)] hover:text-[var(--os-text-primary)]"
          >
            ← Selected Work
          </button>}
        </aside>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_ACTIVE_PROJECT", projectId: null })}
            className="mb-4 text-xs text-[var(--os-text-muted)] sm:hidden"
          >
            ← Back to Selected Work
          </button>

          <div className={cn("mb-4 flex gap-2 overflow-x-auto", layoutMode === "tabletPortrait" ? "flex" : "sm:hidden")}>
            {CHAPTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectChapter(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs",
                  chapter === item
                    ? "border-os-border bg-os-fill-strong text-[var(--os-text-primary)]"
                    : "border-os-hairline text-[var(--os-text-muted)]",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${project.id}-${chapter}`}
              custom={direction}
              initial={reduced ? false : { opacity: 0, x: direction * 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, x: direction * -12, filter: "blur(3px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-1 flex items-center gap-2 text-[var(--os-accent-violet-text)]">
                <FolderOpen className="h-4 w-4" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Open folder</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--os-text-primary)]">{project.title}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--os-text-muted)]">
                {chapter}
              </p>

              {chapter === "Overview" && (
                <div className="mt-5 space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(240px,0.8fr)_1.2fr]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-os-hairline">
                      <Image src={project.image} alt={project.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm leading-6 text-[var(--os-text-secondary)]">{project.summary}</p>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--os-text-muted)]">Role</p>
                      <p className="mt-1 text-sm text-[var(--os-text-primary)]">{project.role}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {project.results.slice(0, 3).map((result) => (
                      <div key={result} className="rounded-xl border border-os-hairline bg-os-fill p-3 text-xs leading-5 text-[var(--os-text-primary)]">
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {chapter === "Problem" && (
                <p className="mt-5 text-sm leading-6 text-[var(--os-text-secondary)]">{project.problem}</p>
              )}
              {chapter === "Role" && (
                <p className="mt-5 text-sm leading-6 text-[var(--os-text-primary)]">{project.role}</p>
              )}
              {chapter === "Process" && (
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-[var(--os-text-secondary)]">
                  {project.process.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {chapter === "Architecture" && (
                <div className="mt-5 space-y-5">
                  <p className="text-sm leading-6 text-[var(--os-text-secondary)]">{project.architecture}</p>
                  <ol className="grid gap-2 lg:grid-cols-5" aria-label={`${project.title} architecture flow`}>
                    {ARCHITECTURE_STAGES[project.id].map((stage, index) => (
                      <li key={stage} className="relative rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
                        <span className="font-mono text-[9px] text-[var(--os-accent-cyan-text)]">{String(index + 1).padStart(2, "0")}</span>
                        <span className="mt-1 block text-xs text-[var(--os-text-primary)]">{stage}</span>
                        {index < ARCHITECTURE_STAGES[project.id].length - 1 && (
                          <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-[var(--os-accent-cyan)]/50 lg:block" aria-hidden />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {chapter === "Results" && (
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-[var(--os-text-primary)]">
                  {project.results.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {chapter === "Learnings" && (
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-[var(--os-text-secondary)]">
                  {project.learnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {chapter === "Links" && (
                <div className="mt-5 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-os-hairline px-2.5 py-1 font-mono text-[10px] text-[var(--os-text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.links.length === 0 ? (
                    <p className="text-sm text-[var(--os-text-muted)]">
                      External links are omitted until a verified public URL is available.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center gap-1 text-sm text-[var(--os-accent-cyan-text)] hover:underline"
                        >
                          {link.label} <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (layoutMode === "phone") {
    const shown = portfolioData.projects.filter((item, index) => {
      const matchesFilter = phoneFilter === "All" || index < 2;
      const query = phoneQuery.trim().toLowerCase();
      return matchesFilter && (!query || `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase().includes(query));
    });
    return (
      <div className="os-phone-screen">
        <PhoneLargeTitle title="Work" eyebrow="Arjun OS · Files" />
        <PhoneSearch value={phoneQuery} onChange={setPhoneQuery} placeholder="Search projects" />
        <PhoneSegmented value={phoneFilter} options={["Featured", "All"] as const} onChange={setPhoneFilter} label="Project filter" />
        <PhoneSection title="Projects">
          <div className="os-phone-grouped-list">
            {shown.map((item) => (
              <button key={item.id} type="button" className="os-files-row" onClick={() => dispatch({ type: "SET_ACTIVE_PROJECT", projectId: item.id as ProjectId })}>
                <span className="os-files-thumbnail"><Image src={item.image} alt="" fill className="object-cover" /></span>
                <span className="min-w-0 flex-1"><strong>{item.title}</strong><small>{item.tags.slice(0, 2).join(" · ")}</small><small>{item.summary}</small></span>
                <ChevronRight aria-hidden />
              </button>
            ))}
            {shown.length === 0 && <p className="os-phone-empty">No projects match “{phoneQuery}”.</p>}
          </div>
        </PhoneSection>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--os-text-muted)]">
        Selected Work
      </p>
      <h3 className="mt-2 text-xl font-semibold text-[var(--os-text-primary)]">Featured projects</h3>
      <div className="work-project-grid mt-5 grid gap-4">
        {portfolioData.projects.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => {
              setChapter("Overview");
              dispatch({ type: "SET_ACTIVE_PROJECT", projectId: item.id as ProjectId });
            }}
            className="group overflow-hidden rounded-2xl border border-os-hairline bg-os-fill-strong text-left transition hover:border-[var(--os-accent-violet)]/50"
            whileHover={reduced ? undefined : { y: -5, scale: 1.012 }}
            whileTap={reduced ? undefined : { scale: 0.985 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] text-[var(--os-accent-violet-text)]">
                {item.tags.join(" · ")}
              </p>
              <h4 className="mt-1 text-sm font-semibold text-[var(--os-text-primary)]">{item.title}</h4>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--os-text-secondary)]">
                {item.summary}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--os-accent-cyan-text)]">
                View project <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
