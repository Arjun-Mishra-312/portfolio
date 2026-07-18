"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  ChevronDown,
  Command,
  Cuboid,
  Github,
  GraduationCap,
  Linkedin,
  Loader2,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { WidgetType } from "@/lib/chat-context";
import { MicroWidget, WidgetPlacement } from "@/types/micro-widgets";
import { MicroWidgetRenderer } from "@/components/chat/micro-widgets/micro-widget-renderer";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { cn } from "@/utils/cn";

const DomeGalleryServer = dynamic(() => import("@/components/ui/dome-gallery-server"), {
  ssr: false,
  loading: () => <div className="h-[55vh] animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />,
});

const ModelViewerCard = dynamic(
  () => import("@/components/ui/model-viewer-card").then((mod) => mod.ModelViewerCard),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-[280px] animate-pulse rounded-[32px] border border-white/10 bg-white/[0.04]" />
    ),
  },
);

type OverlayMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  microWidgets?: MicroWidget[];
  widgetPlacement?: WidgetPlacement;
  widgetType?: WidgetType;
};

type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  details: string[];
  stack: string[];
  accent: "blue" | "emerald" | "violet";
};

type CaseStudy = {
  id: string;
  title: string;
  label: string;
  status: string;
  year: string;
  summary: string;
  role: string;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
  image: string;
  links: Array<{ label: string; href: string }>;
};

const suggestedPrompts = [
  "What should a recruiter see first?",
  "Show me Arjun's strongest AI projects",
  "Summarize his research experience",
  "How can I contact Arjun?",
];

const experiences: Experience[] = [
  {
    id: "copperleaf",
    company: "IFS Copperleaf",
    role: "AI Engineering Co-op",
    period: "2026",
    summary: "Building LLM-assisted internal systems for customer success and operations workflows.",
    details: [
      "Architected a full-stack tool that centralizes context from multiple enterprise data sources.",
      "Focused on practical agent workflows, latency, and reliability for internal teams.",
    ],
    stack: ["LLMs", "Next.js", "Python", "Automation", "Enterprise AI"],
    accent: "blue",
  },
  {
    id: "socius",
    company: "UBC SOCIUS Lab",
    role: "HCI/AI Research Assistant",
    period: "2025",
    summary: "Researching AI-assisted accessibility auditing and human-AI evaluation workflows.",
    details: [
      "Developed multimodal accessibility analysis pipelines combining static tooling and VLM review.",
      "Prepared research artifacts around automated web accessibility and WCAG evaluation.",
    ],
    stack: ["HCI", "Accessibility", "VLMs", "WCAG", "Research"],
    accent: "emerald",
  },
  {
    id: "ta",
    company: "University of British Columbia",
    role: "Undergraduate Teaching Assistant",
    period: "2025",
    summary: "Supported upper-year computer networking instruction across tutorials and lecture material.",
    details: [
      "Taught weekly tutorials and helped students reason through TCP/IP, DNS, and routing concepts.",
      "Supported course delivery for large lecture sections with consistent technical communication.",
    ],
    stack: ["Teaching", "Networking", "CPSC 317", "Communication"],
    accent: "violet",
  },
];

const caseStudies: CaseStudy[] = [
  {
    id: "accessibility",
    title: "AI Accessibility Analyzer",
    label: "Research system",
    status: "Active",
    year: "2026",
    summary: "A multimodal accessibility analyzer combining automated audits with VLM-based interface review.",
    role: "Research engineer and system builder",
    problem:
      "Accessibility evaluation still depends on fragmented tooling and manual expert review, especially for visual interface issues.",
    solution:
      "Built an analyzer that pairs static WCAG checks with AI visual reasoning to surface contrast, touch target, and semantic issues.",
    impact: ["WCAG 2.2 focused pipeline", "Static + VLM analysis", "Designed for evaluator workflows"],
    stack: ["Python", "Node.js", "Playwright", "Axe-core", "Gemini", "WCAG"],
    image: "/AI Accessibility.png",
    links: [],
  },
  {
    id: "llm-pro-max",
    title: "LLM Pro Max",
    label: "Hackathon winner",
    status: "Winner",
    year: "2024",
    summary: "A RAG codebase analysis platform for exploring large repositories through contextual AI queries.",
    role: "RAG pipeline and architecture contributor",
    problem:
      "Developers lose time building context before they can ask useful questions about unfamiliar codebases.",
    solution:
      "Combined chunking, embeddings, graph analysis, and conversational retrieval to make repository structure queryable.",
    impact: ["Hack the North 2024 winner", "86% query relevancy", "Interactive dependency graph"],
    stack: ["React", "FastAPI", "Cohere", "ChromaDB", "NetworkX", "Python"],
    image: "/LLM_Pro_Max.jpg",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/llm-pro-max" },
      { label: "GitHub", href: "https://github.com/gigabite-pro/LLM-pro-max" },
    ],
  },
  {
    id: "re-plate",
    title: "Re-Plate",
    label: "AI social impact",
    status: "1st Place",
    year: "2025",
    summary: "An AI food donation platform using vision models to classify food safety and track impact.",
    role: "Full-stack and AI integration contributor",
    problem:
      "Food donors and shelters need a faster way to evaluate donations, coordinate pickups, and understand impact.",
    solution:
      "Integrated Gemini vision and analytics flows for food classification, expiration checks, and impact tracking.",
    impact: ["youCode 2025 SAP Stream winner", "100% expiration-date accuracy on test set", "CO2 impact tracking"],
    stack: ["Next.js", "Tailwind", "FastAPI", "Gemini Vision", "ApexCharts"],
    image: "/Re-Plate.jpg",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/replate-z3b5mg" },
      { label: "GitHub", href: "https://github.com/Arjun-Mishra-312/re-plate" },
    ],
  },
];

const stackGroups = [
  ["AI/ML", "LLMs", "RAG", "VLMs", "OpenAI", "Gemini", "ChromaDB"],
  ["Frontend", "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  ["Backend", "Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB"],
  ["Systems", "Playwright", "Docker", "AWS", "WCAG", "Testing"],
];

export function PremiumPortfolio() {
  return (
    <ThemeProvider defaultTheme="dark">
      <PremiumPortfolioContent />
    </ThemeProvider>
  );
}

function PremiumPortfolioContent() {
  const { theme } = useTheme();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [personalModal, setPersonalModal] = useState<"gallery" | "lego" | null>(null);
  const [expandedExperience, setExpandedExperience] = useState("copperleaf");
  const [expandedProject, setExpandedProject] = useState("accessibility");
  const isDark = theme === "dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCommandK) {
        event.preventDefault();
        setOverlayOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openAssistantWithPrompt = (prompt?: string) => {
    setOverlayOpen(true);
    window.dispatchEvent(new CustomEvent("portfolio-assistant-prompt", { detail: prompt ?? "" }));
  };

  return (
    <main
      data-portfolio-theme={theme}
      className={cn(
        "portfolio-shell min-h-screen selection:bg-cyan-400/20 selection:text-white",
        isDark ? "dark bg-[#0a0a0a] text-[#ededed]" : "bg-[#f7f4ed] text-[#171717]",
      )}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[780px] flex-col px-5 sm:px-8">
        <PortfolioNav onAsk={() => setOverlayOpen(true)} isDark={isDark} />

        <section id="home" className="pt-16 sm:pt-24">
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI systems, HCI research, and product engineering
          </div>

          <h1 className="text-[3.2rem] font-medium leading-[0.95] tracking-normal text-neutral-200 sm:text-[4.8rem]">
            Arjun Mishra
          </h1>

          <div className="mt-6 space-y-4 text-[1.05rem] leading-8 text-neutral-400 sm:text-[1.12rem]">
            <p>
              I build research-backed AI systems as an{" "}
              <strong className="font-medium text-neutral-100">AI Research Assistant</strong> at UBC SOCIUS Lab
              and a <strong className="font-medium text-neutral-100">Full-Stack AI Engineer</strong> focused on
              practical tools that make complex workflows easier to understand and use.
            </p>
            <p>
              My work spans accessibility analysis, codebase intelligence, food redistribution, teaching, and
              enterprise AI automation.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link className="portfolio-link" href="/Resume.pdf" target="_blank">
              resume <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link className="portfolio-link" href="mailto:arjunmishra31204@gmail.com">
              email <Mail className="h-3.5 w-3.5" />
            </Link>
            <Link className="portfolio-link" href="https://github.com/Arjun-Mishra-312" target="_blank">
              github <Github className="h-3.5 w-3.5" />
            </Link>
            <Link className="portfolio-link" href="https://linkedin.com/in/-arjun-mishra/" target="_blank">
              linkedin <Linkedin className="h-3.5 w-3.5" />
            </Link>
          </div>

          <AssistantEntry onOpen={() => openAssistantWithPrompt()} onPrompt={openAssistantWithPrompt} />
        </section>

        <SectionHeader
          id="experience"
          eyebrow="proof of work"
          title="Experience"
          description="A compact view of the roles that shape my AI, research, and product judgment."
        />

        <div className="space-y-2">
          {experiences.map((experience) => (
            <ExperienceRow
              key={experience.id}
              experience={experience}
              expanded={expandedExperience === experience.id}
              onToggle={() => setExpandedExperience((current) => (current === experience.id ? "" : experience.id))}
            />
          ))}
        </div>

        <SectionHeader
          id="projects"
          eyebrow="selected case studies"
          title="Featured work"
          description="The projects below are organized for quick recruiter scanning: role, problem, solution, impact, and stack."
        />

        <div className="space-y-3">
          {caseStudies.map((project) => (
            <CaseStudyRow
              key={project.id}
              project={project}
              expanded={expandedProject === project.id}
              onToggle={() => setExpandedProject((current) => (current === project.id ? "" : project.id))}
            />
          ))}
        </div>

        <SectionHeader
          id="personal"
          eyebrow="personal signal"
          title="Outside the work"
          description="A few interactive pieces that keep the portfolio human: the city I call home, the moments I collect, and the builds that teach patience."
        />

        <PersonalSignal onOpenModal={setPersonalModal} />

        <SectionHeader
          id="stack"
          eyebrow="tools"
          title="Stack"
          description="The recurring tools and systems I reach for when turning research ideas into usable products."
        />

        <section className="grid gap-3 pb-20 sm:grid-cols-2">
          {stackGroups.map(([title, ...items]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
              <h3 className="text-sm font-medium text-neutral-100">{title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="rounded-md border border-white/10 px-2 py-1 text-xs text-neutral-400">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <footer className="border-t border-white/10 py-10 text-sm text-neutral-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>Designed for focused reading. Powered by a few carefully placed AI affordances.</p>
            <button className="portfolio-link w-fit" onClick={() => setOverlayOpen(true)}>
              ask Arjun AI <MessageSquareText className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </div>

      <AssistantOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      <PersonalModal modal={personalModal} onClose={() => setPersonalModal(null)} />
    </main>
  );
}

function PortfolioNav({ onAsk, isDark }: { onAsk: () => void; isDark: boolean }) {
  return (
    <header
      className={cn(
        "fixed left-1/2 top-0 z-30 w-full max-w-[780px] -translate-x-1/2 border-b px-5 py-5 backdrop-blur sm:px-8",
        isDark ? "border-white/[0.06] bg-[#0a0a0a]/90" : "border-black/[0.08] bg-[#f7f4ed]/90",
      )}
    >
      <nav className="flex items-center justify-between text-sm">
        <Link href="#home" className="text-neutral-200 transition hover:text-white">
          home
        </Link>
        <div className="flex items-center gap-3 text-xs text-neutral-500 sm:gap-5">
          <Link className="hidden transition hover:text-neutral-200 sm:inline" href="#experience">
            experience
          </Link>
          <Link className="transition hover:text-neutral-200" href="#projects">
            projects
          </Link>
          <Link className="hidden transition hover:text-neutral-200 sm:inline" href="#personal">
            personal
          </Link>
          <Link className="hidden transition hover:text-neutral-200 sm:inline" href="#stack">
            stack
          </Link>
          <button className="inline-flex items-center gap-1.5 transition hover:text-cyan-200" onClick={onAsk}>
            <Command className="h-3.5 w-3.5" />
            ask
          </button>
          <AnimatedThemeToggler duration={750} />
        </div>
      </nav>
    </header>
  );
}

function AssistantEntry({
  onOpen,
  onPrompt,
}: {
  onOpen: () => void;
  onPrompt: (prompt: string) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "mt-12 rounded-xl border p-2",
        isDark
          ? "border-cyan-300/15 bg-cyan-300/[0.035] shadow-[0_20px_80px_rgba(8,145,178,0.08)]"
          : "border-cyan-700/10 bg-white/45 shadow-[0_20px_70px_rgba(35,31,20,0.08)]",
      )}
    >
      <button
        onClick={onOpen}
        className={cn(
          "group flex w-full items-center justify-between rounded-lg border px-4 py-4 text-left transition",
          isDark
            ? "border-white/10 bg-[#111]/90 hover:border-cyan-300/35 hover:bg-[#151515]"
            : "border-black/[0.08] bg-[#fffdf7] hover:border-cyan-700/20 hover:bg-white",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
              isDark ? "bg-cyan-300/10 text-cyan-200" : "bg-cyan-700/10 text-cyan-700",
            )}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-100">Ask Arjun AI</p>
            <p className="truncate text-sm text-neutral-500">What should I see first?</p>
          </div>
        </div>
        <kbd
          className={cn(
            "hidden rounded-md border px-2 py-1 text-[11px] text-neutral-500 sm:block",
            isDark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-black/[0.03]",
          )}
        >
          ⌘K
        </kbd>
      </button>
      <div className="grid gap-2 px-1 py-2 sm:grid-cols-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPrompt(prompt)}
            className={cn(
              "rounded-md px-3 py-2 text-left text-xs text-neutral-500 transition",
              isDark ? "hover:bg-white/[0.04] hover:text-neutral-200" : "hover:bg-black/[0.035] hover:text-neutral-900",
            )}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id={id} className="scroll-mt-24 pt-24">
      <p className={cn("text-xs uppercase tracking-[0.22em]", isDark ? "text-cyan-300/70" : "text-cyan-600/80")}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-normal text-neutral-100">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-500">{description}</p>
    </section>
  );
}

function ExperienceRow({
  experience,
  expanded,
  onToggle,
}: {
  experience: Experience;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
      <button
        className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-white/[0.025]"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
              experience.accent === "emerald" && "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
              experience.accent === "blue" && "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
              experience.accent === "violet" && "border-violet-300/20 bg-violet-300/10 text-violet-200",
            )}
          >
            {experience.id === "ta" ? <GraduationCap className="h-4 w-4" /> : <BriefcaseBusiness className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-medium text-neutral-100">{experience.company}</h3>
              <span className="text-xs text-neutral-600">{experience.period}</span>
            </div>
            <p className="mt-1 text-sm text-neutral-400">{experience.role}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{experience.summary}</p>
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-neutral-500 transition", expanded && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="border-t border-white/10 px-4 pb-4 pt-3">
              <ul className="space-y-2 text-sm leading-6 text-neutral-400">
                {experience.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-300/70" />
                    {detail}
                  </li>
                ))}
              </ul>
              <ChipList items={experience.stack} className="mt-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function CaseStudyRow({
  project,
  expanded,
  onToggle,
}: {
  project: CaseStudy;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
      <button
        className="grid w-full gap-3 p-4 text-left transition hover:bg-white/[0.025] sm:grid-cols-[1fr_auto]"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-neutral-100">{project.title}</h3>
            <span className="rounded-md border border-emerald-300/15 bg-emerald-300/10 px-2 py-0.5 text-[11px] text-emerald-200">
              {project.status}
            </span>
            <span className="text-xs text-neutral-600">{project.year}</span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyan-300/60">{project.label}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">{project.summary}</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 justify-self-end text-neutral-500 transition", expanded && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-5 border-t border-white/10 p-4 sm:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <ProofBlock title="Role">{project.role}</ProofBlock>
                <ProofBlock title="Problem">{project.problem}</ProofBlock>
                <ProofBlock title="Solution">{project.solution}</ProofBlock>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">Impact</p>
                  <div className="mt-2 grid gap-2">
                    {project.impact.map((item) => (
                      <div
                        key={item}
                        className="rounded-md border border-emerald-300/15 bg-emerald-300/[0.045] px-3 py-2 text-sm text-emerald-100/85"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <ChipList items={project.stack} />
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {project.links.map((link) => (
                      <Link key={link.href} href={link.href} target="_blank" className="portfolio-link">
                        {link.label.toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative min-h-[170px] overflow-hidden rounded-lg border border-white/10 bg-neutral-950">
                <Image src={project.image} alt={project.title} fill sizes="220px" className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function ProofBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">{title}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-400">{children}</p>
    </div>
  );
}

function ChipList({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span key={item} className="rounded-md border border-white/10 px-2 py-1 text-xs text-neutral-500">
          {item}
        </span>
      ))}
    </div>
  );
}

function PersonalSignal({
  onOpenModal,
}: {
  onOpenModal: (modal: "gallery" | "lego") => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const personalCardClass = cn(
    "group overflow-hidden rounded-lg border p-3 transition",
    isDark
      ? "border-white/10 bg-white/[0.02] hover:border-cyan-300/25"
      : "border-black/[0.08] bg-white/50 shadow-[0_16px_50px_rgba(35,31,20,0.06)] hover:border-cyan-700/20 hover:bg-white/70",
  );
  const cityFrameClass = cn(
    "relative flex h-[210px] items-center justify-center overflow-hidden rounded-md border",
    isDark ? "border-white/10 bg-black/30" : "border-black/[0.08] bg-[#ebe7df]",
  );
  const mediaFrameClass = cn(
    "relative h-[210px] overflow-hidden rounded-md border",
    isDark ? "border-white/10 bg-black/30" : "border-black/[0.08] bg-[#ece8df]",
  );
  const cyanMetaClass = cn(
    "flex items-center gap-2 text-xs uppercase tracking-[0.16em]",
    isDark ? "text-cyan-300/60" : "text-cyan-600/75",
  );

  return (
    <section className="grid gap-3 pb-2 sm:grid-cols-3">
      <article className={personalCardClass}>
        <div className={cityFrameClass}>
          <div className="scale-[0.72]">
            <ModelViewerCard title="Vancouver" subtitle="My City" />
          </div>
        </div>
        <div className="mt-4">
          <div className={cyanMetaClass}>
            <Cuboid className="h-3.5 w-3.5" />
            3D city
          </div>
          <h3 className="mt-2 text-sm font-medium text-neutral-100">Vancouver</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            A small interactive nod to the place that anchors the portfolio.
          </p>
        </div>
      </article>

      <button
        onClick={() => onOpenModal("gallery")}
        className={cn(personalCardClass, "text-left")}
      >
        <div className={mediaFrameClass}>
          <Image
            src={isDark ? "/fun-widget/gallery-dark.png" : "/fun-widget/gallery-light.png"}
            alt="Life gallery preview"
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-md border border-white/20 bg-black/50 px-2 py-1 text-xs text-white">
            open gallery
          </span>
        </div>
        <div className="mt-4">
          <div className={cyanMetaClass}>
            <Camera className="h-3.5 w-3.5" />
            moments
          </div>
          <h3 className="mt-2 text-sm font-medium text-neutral-100">Life Gallery</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Travel, people, wins, and the bits that make the work feel lived-in.
          </p>
        </div>
      </button>

      <button
        onClick={() => onOpenModal("lego")}
        className={cn(
          "group overflow-hidden rounded-lg border p-3 text-left transition",
          isDark
            ? "border-white/10 bg-white/[0.02] hover:border-yellow-300/25"
            : "border-black/[0.08] bg-white/50 shadow-[0_16px_50px_rgba(35,31,20,0.06)] hover:border-amber-500/30 hover:bg-white/70",
        )}
      >
        <div
          className={cn(
            "relative h-[210px] overflow-hidden rounded-md border",
            isDark ? "border-white/10 bg-[#f8f8f5]" : "border-black/[0.08] bg-[#f5f2eb]",
          )}
        >
          <iframe
            title="LEGO McLaren preview"
            src="https://www.kiriengine.app/share/3dgsEmbed/2008260390479200256?userId=1657534&bg_theme=white&auto_spin=1"
            className="absolute inset-0 h-full w-full scale-125 border-0"
            loading="lazy"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-md border border-white/20 bg-black/45 px-2 py-1 text-xs text-white">
            inspect model
          </span>
        </div>
        <div className="mt-4">
          <div
            className={cn(
              "flex items-center gap-2 text-xs uppercase tracking-[0.16em]",
              isDark ? "text-yellow-300/70" : "text-amber-500/90",
            )}
          >
            <Cuboid className="h-3.5 w-3.5" />
            build
          </div>
          <h3 className="mt-2 text-sm font-medium text-neutral-100">LEGO McLaren</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            A precision build that says more about patience than a skill badge can.
          </p>
        </div>
      </button>
    </section>
  );
}

function PersonalModal({
  modal,
  onClose,
}: {
  modal: "gallery" | "lego" | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/80 px-4 py-4 backdrop-blur-md sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-100">
                  {modal === "gallery" ? "Life Gallery" : "LEGO McLaren"}
                </p>
                <p className="text-xs text-neutral-500">
                  {modal === "gallery" ? "A rotating wall of moments." : "Interactive 3D model preview."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-neutral-500 transition hover:bg-white/5 hover:text-neutral-200"
                aria-label="Close personal preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {modal === "gallery" ? (
                <DomeGalleryServer />
              ) : (
                <div className="flex min-h-full items-center justify-center p-4">
                  <div className="relative h-[min(74vh,760px)] w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-white">
                    <iframe
                      title="Interactive 3D Model - LEGO McLaren"
                      src="https://www.kiriengine.app/share/3dgsEmbed/2008260390479200256?userId=1657534&bg_theme=white&auto_spin=1"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="autoplay; fullscreen"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AssistantOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<OverlayMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me what to review first, which projects are strongest, or how Arjun's research maps to product engineering roles.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) setInput(detail);
    };

    window.addEventListener("portfolio-assistant-prompt", handlePrompt);
    return () => window.removeEventListener("portfolio-assistant-prompt", handlePrompt);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canSend = input.trim().length > 0 && !loading;

  const submitPrompt = async (event?: FormEvent, promptOverride?: string) => {
    event?.preventDefault();
    const prompt = (promptOverride ?? input).trim();
    if (!prompt || loading) return;

    setInput("");
    setLoading(true);
    const userMessage: OverlayMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
    };
    setMessages((current) => [...current, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error("Assistant request failed");

      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            data.response ??
            "I can help you navigate Arjun's work. Try asking about projects, research, skills, or contact details.",
          microWidgets: data.microWidgets,
          widgetPlacement: data.widgetPlacement,
          widgetType: data.widgetType,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I could not reach the assistant service, but the portfolio below has the key path: experience, featured work, stack, and contact links.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = useMemo(() => suggestedPrompts.slice(0, 3), []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-4 backdrop-blur-md sm:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Ask Arjun AI"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="dark flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] text-neutral-100 shadow-2xl shadow-black/60 sm:max-h-[78vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-medium">Ask Arjun AI</h2>
                  <p className="text-xs text-neutral-500">Guided portfolio exploration</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-neutral-500 transition hover:bg-white/5 hover:text-neutral-200"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <AssistantMessage key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                  Reading the portfolio context...
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {promptChips.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => submitPrompt(undefined, prompt)}
                    disabled={loading}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-neutral-500 transition hover:border-cyan-300/30 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={submitPrompt} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about projects, research, skills, or fit..."
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-cyan-300/40"
                />
                <button
                  disabled={!canSend}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-300 text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AssistantMessage({ message }: { message: OverlayMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-lg px-3 py-2 text-sm leading-6",
          isUser
            ? "bg-cyan-300 text-black"
            : "border border-white/10 bg-white/[0.035] text-neutral-300",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.microWidgets && message.microWidgets.length > 0 && (
          <div className="mt-3 space-y-3">
            {message.microWidgets.map((widget, index) => (
              <MicroWidgetRenderer key={`${widget.type}-${index}`} widget={widget} />
            ))}
          </div>
        )}
        {!isUser && message.widgetType && <RelatedSectionHint widgetType={message.widgetType} />}
      </div>
    </div>
  );
}

function RelatedSectionHint({ widgetType }: { widgetType: WidgetType }) {
  const section = getRelatedSection(widgetType);

  return (
    <Link
      href={section.href}
      className="mt-3 inline-flex items-center gap-2 rounded-md border border-cyan-300/15 bg-cyan-300/[0.04] px-2.5 py-1.5 text-xs text-cyan-100/80 transition hover:border-cyan-300/35 hover:text-cyan-50"
    >
      {section.label}
      <ArrowUpRight className="h-3 w-3" />
    </Link>
  );
}

function getRelatedSection(widgetType: WidgetType) {
  switch (widgetType) {
    case "projects":
      return { label: "Jump to Featured Work", href: "#projects" };
    case "experience":
      return { label: "Jump to Experience", href: "#experience" };
    case "skills":
      return { label: "Jump to Stack", href: "#stack" };
    case "contact":
      return { label: "Use Contact Links", href: "mailto:arjunmishra31204@gmail.com" };
    default:
      return { label: "Continue with the portfolio", href: "#home" };
  }
}
