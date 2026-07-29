"use client";

import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Copy,
  ExternalLink,
  FileCode2,
  FileText,
  Folder,
  FolderKanban,
  Gauge,
  GitBranch,
  Globe2,
  Grid2X2,
  History,
  KeyRound,
  LayoutList,
  Link2,
  LockKeyhole,
  Network,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  LAB_EXPERIENCES,
  LAB_FILES,
  MEMORY_NODES,
  SYSTEM_SCENARIOS,
  analyzeJobDescription,
  resolvePortalAddress,
  type LabExperienceId,
  type LabFile,
  type PortalResolution,
} from "@/lib/arjun-os/lab-data";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import type { ProjectId } from "@/lib/arjun-os/types";
import { cn } from "@/utils/cn";

const EXPERIENCE_ICONS: Record<LabExperienceId, LucideIcon> = {
  finder: FolderKanban,
  portal: Globe2,
  systems: Boxes,
  recruiter: BriefcaseBusiness,
  a11y: Accessibility,
  graph: Network,
};

const FILE_ICONS: Record<LabFile["kind"], LucideIcon> = {
  folder: Folder,
  project: FileCode2,
  role: BriefcaseBusiness,
  research: BookOpen,
  document: FileText,
  link: Link2,
};

function openPortfolioDestination(
  file: LabFile,
  openApp: ReturnType<typeof useOSActions>["openApp"],
  dispatch: ReturnType<typeof useOSActions>["dispatch"],
  openResume: ReturnType<typeof useOSActions>["openResume"],
) {
  if (file.projectId) {
    openApp("work");
    dispatch({ type: "SET_ACTIVE_PROJECT", projectId: file.projectId });
    return;
  }
  if (file.appId) {
    openApp(file.appId);
    return;
  }
  if (file.href === "/Resume.pdf") {
    openResume();
    return;
  }
  if (file.href) window.open(file.href, "_blank", "noopener,noreferrer");
}

function FinderExperience() {
  const { openApp, dispatch, openResume } = useOSActions();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Files");
  const [selectedId, setSelectedId] = useState(LAB_FILES[0]?.id ?? "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const locations = ["All Files", "Projects", "Experience", "Research", "Documents", "Links"];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return LAB_FILES.filter((file) => {
      const inLocation = location === "All Files" || file.location === location;
      const haystack = `${file.title} ${file.subtitle} ${file.description} ${file.tags.join(" ")}`.toLowerCase();
      return inLocation && (!normalized || haystack.includes(normalized));
    });
  }, [location, query]);
  const selected = LAB_FILES.find((file) => file.id === selectedId) ?? filtered[0] ?? null;

  const copyDeepLink = async () => {
    if (!selected) return;
    const relative = selected.projectId
      ? `/?app=work&project=${selected.projectId}`
      : selected.appId
        ? `/?app=${selected.appId}`
        : selected.href ?? "/";
    const value = relative.startsWith("/") ? `${window.location.origin}${relative}` : relative;
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <div className="lab-finder" data-testid="lab-finder">
      <aside className="lab-finder-sidebar">
        <p className="lab-kicker">Locations</p>
        <nav aria-label="Finder locations">
          {locations.map((item) => (
            <button
              key={item}
              type="button"
              className={cn(location === item && "is-active")}
              onClick={() => setLocation(item)}
              aria-current={location === item ? "page" : undefined}
            >
              <Folder aria-hidden />
              <span>{item}</span>
              <small>{item === "All Files" ? LAB_FILES.length : LAB_FILES.filter((file) => file.location === item).length}</small>
            </button>
          ))}
        </nav>
        <div className="lab-finder-smart">
          <p className="lab-kicker">Smart tags</p>
          <span><i className="bg-cyan-400" /> AI</span>
          <span><i className="bg-amber-400" /> Accessibility</span>
          <span><i className="bg-violet-400" /> Research</span>
        </div>
      </aside>

      <section className="lab-finder-main">
        <header className="lab-toolbar">
          <label className="lab-search">
            <Search aria-hidden />
            <span className="sr-only">Search portfolio files</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Arjun OS" />
          </label>
          <div className="lab-view-toggle" role="group" aria-label="Finder view">
            <button type="button" className={cn(view === "grid" && "is-active")} onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"}><Grid2X2 /></button>
            <button type="button" className={cn(view === "list" && "is-active")} onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"}><LayoutList /></button>
          </div>
        </header>

        <div className="lab-finder-path">
          <Folder aria-hidden />
          <span>Arjun OS</span>
          <ChevronRight aria-hidden />
          <strong>{location}</strong>
          <small>{filtered.length} items</small>
        </div>

        <div className={cn("lab-file-browser", view === "list" && "is-list")} aria-label={`${location} files`}>
          {filtered.map((file) => {
            const Icon = FILE_ICONS[file.kind];
            return (
              <button
                key={file.id}
                type="button"
                className={cn("lab-file", selected?.id === file.id && "is-selected")}
                onClick={() => setSelectedId(file.id)}
                onDoubleClick={() => openPortfolioDestination(file, openApp, dispatch, openResume)}
                aria-pressed={selected?.id === file.id}
              >
                <span className={`lab-file-icon is-${file.kind}`}><Icon aria-hidden /></span>
                <span className="lab-file-copy">
                  <strong>{file.title}</strong>
                  <small>{file.subtitle}</small>
                </span>
                <span className="lab-file-date">{file.modified}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="lab-empty">
              <Search aria-hidden />
              <strong>No files found</strong>
              <span>Try another location or search term.</span>
            </div>
          )}
        </div>
      </section>

      <aside className="lab-quick-look" aria-label="Quick Look">
        <p className="lab-kicker">Quick Look</p>
        {selected ? (
          <>
            <div className={`lab-preview-art is-${selected.kind}`}>
              {(() => {
                const Icon = FILE_ICONS[selected.kind];
                return <Icon aria-hidden />;
              })()}
              <span>{selected.location}</span>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <div className="lab-tag-row">
              {selected.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <dl className="lab-meta-list">
              <div><dt>Kind</dt><dd>{selected.kind}</dd></div>
              <div><dt>Modified</dt><dd>{selected.modified}</dd></div>
              <div><dt>Location</dt><dd>{selected.location}</dd></div>
            </dl>
            <div className="lab-quick-actions">
              <button type="button" className="lab-primary-button" onClick={() => openPortfolioDestination(selected, openApp, dispatch, openResume)}>
                Open <ArrowRight aria-hidden />
              </button>
              <button type="button" className="lab-icon-button" onClick={copyDeepLink} aria-label="Copy deep link">
                {copyState === "copied" ? <Check /> : <Copy />}
              </button>
            </div>
            <span className="lab-copy-status" aria-live="polite">{copyState === "copied" ? "Deep link copied" : "Double-click any file to open it"}</span>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function PortalCard({
  resolution,
  onOpen,
}: {
  resolution: PortalResolution;
  onOpen: () => void;
}) {
  return (
    <article className={cn("lab-portal-card", `is-${resolution.status}`)} aria-live="polite">
      <header>
        <span className="lab-portal-status">
          {resolution.status === "blocked" ? <AlertTriangle aria-hidden /> : resolution.status === "external" ? <ShieldCheck aria-hidden /> : <BadgeCheck aria-hidden />}
          {resolution.status === "blocked" ? "Navigation paused" : resolution.status === "external" ? "Verified hand-off" : "Local route"}
        </span>
        <span className="lab-portal-protocol">{resolution.status === "external" ? "HTTPS" : resolution.status === "local" ? "ARJUN" : "BLOCKED"}</span>
      </header>
      <div className="lab-portal-hero">
        <span className="lab-portal-orb">{resolution.status === "blocked" ? <LockKeyhole /> : resolution.status === "external" ? <Globe2 /> : <Sparkles />}</span>
        <div>
          <p className="lab-kicker">Destination preview</p>
          <h3>{resolution.title}</h3>
          <p>{resolution.description}</p>
        </div>
      </div>
      <code>{resolution.canonical}</code>
      <ol className="lab-redirect-trail" aria-label="Redirect trail">
        {resolution.trail.map((step, index) => (
          <li key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
            {index < resolution.trail.length - 1 && <ArrowRight aria-hidden />}
          </li>
        ))}
      </ol>
      {resolution.status !== "blocked" && (
        <button type="button" className="lab-primary-button" onClick={onOpen}>
          {resolution.status === "external" ? "Open verified destination" : "Open in Arjun OS"}
          {resolution.status === "external" ? <ExternalLink aria-hidden /> : <ArrowRight aria-hidden />}
        </button>
      )}
    </article>
  );
}

function PortalExperience() {
  const { openApp, dispatch, openResume } = useOSActions();
  const [address, setAddress] = useState("arjun://work");
  const [history, setHistory] = useState<PortalResolution[]>([resolvePortalAddress("arjun://work")]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const resolution = history[historyIndex];

  const navigate = (nextAddress: string) => {
    const next = resolvePortalAddress(nextAddress);
    setAddress(next.canonical);
    setHistory((current) => [...current.slice(0, historyIndex + 1), next]);
    setHistoryIndex((current) => current + 1);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(address);
  };

  const moveHistory = (direction: -1 | 1) => {
    const nextIndex = Math.max(0, Math.min(history.length - 1, historyIndex + direction));
    setHistoryIndex(nextIndex);
    setAddress(history[nextIndex].canonical);
  };

  const openResolution = () => {
    if (resolution.status === "blocked") return;
    if (resolution.status === "external") {
      window.open(resolution.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (resolution.resume) {
      openResume();
      return;
    }
    if (resolution.projectId) {
      openApp("work");
      dispatch({ type: "SET_ACTIVE_PROJECT", projectId: resolution.projectId });
      return;
    }
    if (resolution.appId) openApp(resolution.appId);
  };

  return (
    <div className="lab-portal" data-testid="lab-portal">
      <header className="lab-browser-chrome">
        <div className="lab-browser-controls">
          <button type="button" onClick={() => moveHistory(-1)} disabled={historyIndex === 0} aria-label="Back"><ArrowLeft /></button>
          <button type="button" onClick={() => moveHistory(1)} disabled={historyIndex === history.length - 1} aria-label="Forward"><ArrowRight /></button>
          <button type="button" onClick={() => navigate(address)} aria-label="Reload"><RefreshCw /></button>
        </div>
        <form className="lab-address-bar" onSubmit={submit}>
          <ShieldCheck aria-hidden />
          <label className="sr-only" htmlFor="portal-address">Portal address</label>
          <input id="portal-address" value={address} onChange={(event) => setAddress(event.target.value)} spellCheck={false} />
          <button type="submit" aria-label="Go to address"><ArrowRight /></button>
        </form>
        <span className="lab-browser-badge"><LockKeyhole aria-hidden /> Allowlisted</span>
      </header>

      <div className="lab-bookmarks" aria-label="Portal bookmarks">
        {[
          ["Work", "arjun://work"],
          ["Research", "arjun://research"],
          ["Resume", "arjun://resume"],
          ["GitHub", "github"],
          ["LinkedIn", "linkedin"],
        ].map(([label, value]) => (
          <button key={label} type="button" onClick={() => navigate(value)}>{label}</button>
        ))}
      </div>

      <div className="lab-portal-stage">
        <PortalCard resolution={resolution} onOpen={openResolution} />
        <aside className="lab-portal-history">
          <header><History aria-hidden /><div><p className="lab-kicker">Session history</p><strong>{history.length} destinations</strong></div></header>
          <ol>
            {[...history].reverse().map((item, reverseIndex) => {
              const actualIndex = history.length - 1 - reverseIndex;
              return (
                <li key={`${item.canonical}-${actualIndex}`}>
                  <button type="button" className={cn(actualIndex === historyIndex && "is-active")} onClick={() => {
                    setHistoryIndex(actualIndex);
                    setAddress(item.canonical);
                  }}>
                    <span>{item.status === "blocked" ? <AlertTriangle /> : item.status === "external" ? <Globe2 /> : <Sparkles />}</span>
                    <span><strong>{item.title}</strong><small>{item.canonical}</small></span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p>Portal never embeds arbitrary sites. It previews the route, verifies the destination, then gives control back to you.</p>
        </aside>
      </div>
    </div>
  );
}

function SystemsExperience() {
  const [projectId, setProjectId] = useState<ProjectId>("ai-accessibility-analyzer");
  const [selectedNode, setSelectedNode] = useState(SYSTEM_SCENARIOS[projectId].nodes[0].id);
  const [failure, setFailure] = useState(false);
  const scenario = SYSTEM_SCENARIOS[projectId];
  const node = scenario.nodes.find((item) => item.id === selectedNode) ?? scenario.nodes[0];
  const logs = failure ? scenario.failureLog : scenario.normalLog;

  const changeScenario = (next: ProjectId) => {
    setProjectId(next);
    setSelectedNode(SYSTEM_SCENARIOS[next].nodes[0].id);
    setFailure(false);
  };

  return (
    <div className="lab-systems" data-testid="lab-systems">
      <header className="lab-systems-header">
        <div>
          <p className="lab-kicker">Interactive architecture</p>
          <h2>{scenario.title}</h2>
          <p>{scenario.summary}</p>
        </div>
        <label>
          <span>System</span>
          <select value={projectId} onChange={(event) => changeScenario(event.target.value as ProjectId)}>
            {Object.values(SYSTEM_SCENARIOS).map((item) => <option key={item.projectId} value={item.projectId}>{item.title}</option>)}
          </select>
        </label>
      </header>

      <section className={cn("lab-system-canvas", failure && "is-failing")} aria-label={`${scenario.title} architecture`}>
        <div className="lab-system-flow">
          {scenario.nodes.map((item, index) => (
            <div key={item.id} className="lab-system-stage">
              <button
                type="button"
                className={cn(`is-${item.category}`, selectedNode === item.id && "is-selected")}
                onClick={() => setSelectedNode(item.id)}
                aria-pressed={selectedNode === item.id}
              >
                <span>{index + 1}</span>
                <strong>{item.label}</strong>
                <small>{item.category}</small>
              </button>
              {index < scenario.nodes.length - 1 && (
                <span className="lab-system-link" aria-hidden>
                  <i />
                  {!failure && <motion.b animate={{ x: ["0%", "180%"], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.24 }} />}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="lab-system-grid" aria-hidden />
      </section>

      <div className="lab-system-console">
        <article className="lab-node-inspector">
          <header><CircleDot aria-hidden /><span>Node inspector</span><small>{node.category}</small></header>
          <h3>{node.label}</h3>
          <p>{node.detail}</p>
          <dl>
            <div><dt>Latency</dt><dd>{failure && node.category === "intelligence" ? "timeout" : `${34 + scenario.nodes.indexOf(node) * 17} ms`}</dd></div>
            <div><dt>Contract</dt><dd>{node.id}.v1</dd></div>
            <div><dt>Status</dt><dd className={failure ? "text-amber-300" : "text-emerald-300"}>{failure ? "degraded" : "healthy"}</dd></div>
          </dl>
        </article>

        <article className="lab-live-log">
          <header><TerminalSquare aria-hidden /><span>Live trace</span><small>{failure ? "DEGRADED" : "HEALTHY"}</small></header>
          <ol>
            {logs.map((log, index) => (
              <li key={log}><time>00:0{index}.{index * 17 + 11}</time><span className={failure && index === 0 ? "is-warning" : ""}>{log}</span></li>
            ))}
          </ol>
        </article>

        <article className="lab-health-panel">
          <header><Gauge aria-hidden /><span>System health</span></header>
          <strong>{failure ? "72" : "99.95"}<small>%</small></strong>
          <div className="lab-health-bars" aria-hidden>{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ height: `${28 + ((index * 13) % 64)}%` }} />)}</div>
          <button type="button" className={cn("lab-failure-button", failure && "is-active")} onClick={() => setFailure((current) => !current)}>
            {failure ? <RefreshCw aria-hidden /> : <AlertTriangle aria-hidden />}
            {failure ? "Restore service" : "Inject safe failure"}
          </button>
        </article>
      </div>
    </div>
  );
}

const DEFAULT_JOB =
  "We’re looking for an AI engineer who can ship reliable full-stack products with Python and Next.js, work with LLM or retrieval systems, communicate clearly, and bring a human-centered accessibility mindset.";

function RecruiterExperience() {
  const { openApp, dispatch } = useOSActions();
  const [description, setDescription] = useState(DEFAULT_JOB);
  const [analysis, setAnalysis] = useState(() => analyzeJobDescription(DEFAULT_JOB));
  const [analyzing, setAnalyzing] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const runAnalysis = () => {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalysis(analyzeJobDescription(description));
      setTourStep(0);
      setAnalyzing(false);
    }, 520);
  };

  const openEvidence = (index: number) => {
    const evidence = analysis.evidence[index];
    if (!evidence) return;
    openApp(evidence.appId);
    if (evidence.projectId) dispatch({ type: "SET_ACTIVE_PROJECT", projectId: evidence.projectId });
  };

  return (
    <div className="lab-recruiter" data-testid="lab-recruiter">
      <section className="lab-role-input">
        <header>
          <div><p className="lab-kicker">Private matching</p><h2>What does the role need?</h2></div>
          <span><LockKeyhole aria-hidden /> Runs locally</span>
        </header>
        <label htmlFor="job-description">Paste a job description or role summary</label>
        <textarea id="job-description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <div className="lab-role-input-footer">
          <small>{description.length} characters · nothing is uploaded</small>
          <button type="button" className="lab-primary-button" onClick={runAnalysis} disabled={!description.trim() || analyzing}>
            {analyzing ? <RefreshCw className="animate-spin" /> : <WandSparkles />}
            {analyzing ? "Matching evidence" : "Build my tour"}
          </button>
        </div>
      </section>

      <section className="lab-match-summary">
        <div className="lab-match-score" aria-label={`${analysis.score} percent evidence match`}>
          <span style={{ "--score": `${analysis.score * 3.6}deg` } as React.CSSProperties}><strong>{analysis.score}</strong><small>%</small></span>
          <div><p className="lab-kicker">Evidence match</p><strong>Strong overlap</strong><small>Based on portfolio facts, not generated claims</small></div>
        </div>
        <div className="lab-match-terms">
          <p className="lab-kicker">Signals detected</p>
          <div>{analysis.matchedTerms.length > 0 ? analysis.matchedTerms.map((term) => <span key={term}>{term}</span>) : <span>general engineering</span>}</div>
        </div>
      </section>

      <section className="lab-tour-builder">
        <header>
          <div><p className="lab-kicker">Personalized route</p><h3>Your 90-second evidence tour</h3></div>
          <span><Clock3 aria-hidden /> {analysis.evidence.length} stops</span>
        </header>
        <div className="lab-tour-layout">
          <ol className="lab-tour-steps">
            {analysis.evidence.map((evidence, index) => (
              <li key={evidence.id}>
                <button type="button" className={cn(tourStep === index && "is-active")} onClick={() => setTourStep(index)} aria-current={tourStep === index ? "step" : undefined}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span><small>{evidence.eyebrow}</small><strong>{evidence.title}</strong></span>
                  <ChevronRight aria-hidden />
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait">
            <motion.article
              key={analysis.evidence[tourStep]?.id}
              className="lab-tour-preview"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="lab-tour-preview-icon"><Bot aria-hidden /></span>
              <p className="lab-kicker">Why this evidence matters</p>
              <h3>{analysis.evidence[tourStep]?.title}</h3>
              <p>{analysis.evidence[tourStep]?.rationale}</p>
              <div className="lab-tour-preview-actions">
                <button type="button" className="lab-primary-button" onClick={() => openEvidence(tourStep)}>Open evidence <ArrowRight /></button>
                <button type="button" className="lab-secondary-button" onClick={() => setTourStep((current) => (current + 1) % analysis.evidence.length)}>Next stop</button>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

type A11yIssueId = "contrast" | "label" | "target" | "focus";

const A11Y_ISSUES: Array<{ id: A11yIssueId; title: string; criterion: string; before: string; after: string }> = [
  { id: "contrast", title: "Low text contrast", criterion: "WCAG 1.4.3", before: "2.3:1", after: "7.8:1" },
  { id: "label", title: "Unnamed action", criterion: "WCAG 4.1.2", before: "button", after: "Save project" },
  { id: "target", title: "Small touch target", criterion: "WCAG 2.5.8", before: "24 × 24", after: "44 × 44" },
  { id: "focus", title: "Unclear focus order", criterion: "WCAG 2.4.3", before: "1 → 4 → 2", after: "1 → 2 → 3" },
];

function A11yExperience() {
  const [fixed, setFixed] = useState<Record<A11yIssueId, boolean>>({
    contrast: false,
    label: false,
    target: false,
    focus: false,
  });
  const [selected, setSelected] = useState<A11yIssueId>("contrast");
  const [audited, setAudited] = useState(true);
  const fixedCount = Object.values(fixed).filter(Boolean).length;
  const score = 62 + fixedCount * 8;
  const issue = A11Y_ISSUES.find((item) => item.id === selected) ?? A11Y_ISSUES[0];

  const autoFix = () => {
    setFixed({ contrast: true, label: true, target: true, focus: true });
    setAudited(true);
  };

  return (
    <div className="lab-a11y" data-testid="lab-a11y">
      <header className="lab-a11y-header">
        <div><p className="lab-kicker">Evaluator workspace</p><h2>Accessibility remediation lab</h2><p>Inspect modeled findings without making the demo itself inaccessible.</p></div>
        <div className="lab-a11y-score"><span>{score}</span><small>/ 100</small><strong>{score >= 90 ? "AA ready" : "Needs review"}</strong></div>
      </header>

      <div className="lab-a11y-workspace">
        <section className="lab-a11y-preview">
          <header>
            <span className="lab-traffic-lights" aria-hidden><i /><i /><i /></span>
            <code>sample-dashboard.local</code>
            <span className={cn("lab-audit-badge", audited && "is-ready")}><CircleDot /> Audit ready</span>
          </header>
          <div className={cn("lab-sample-ui", fixed.contrast && "fix-contrast", fixed.target && "fix-target", fixed.focus && "fix-focus")}>
            <aside>
              <strong>DataScope</strong>
              <button type="button">Overview</button>
              <button type="button">Reports</button>
              <button type="button">Team</button>
            </aside>
            <main>
              <p>Quarterly impact</p>
              <h3>Accessibility insights</h3>
              <div className="lab-sample-stats">
                <article><small>Coverage</small><strong>86%</strong><i /></article>
                <article><small>Issues</small><strong>{4 - fixedCount}</strong><i /></article>
              </div>
              <div className="lab-sample-chart" aria-label="Sample ascending bar chart">
                {[38, 54, 47, 68, 76, 88].map((height, index) => <i key={height} style={{ height: `${height}%` }}><span className="sr-only">Period {index + 1}: {height}</span></i>)}
              </div>
              <button type="button" className="lab-sample-save" aria-label={fixed.label ? "Save project" : "Modeled unnamed action"}>
                {fixed.label ? "Save project" : <KeyRound aria-hidden />}
              </button>
            </main>
          </div>
        </section>

        <aside className="lab-issue-list">
          <header><div><p className="lab-kicker">Findings</p><strong>{4 - fixedCount} open issues</strong></div><button type="button" onClick={() => setAudited(true)}><RefreshCw /> Run audit</button></header>
          <div>
            {A11Y_ISSUES.map((item) => (
              <button key={item.id} type="button" className={cn(selected === item.id && "is-selected", fixed[item.id] && "is-fixed")} onClick={() => setSelected(item.id)}>
                <span>{fixed[item.id] ? <Check /> : <AlertTriangle />}</span>
                <span><strong>{item.title}</strong><small>{item.criterion}</small></span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section className="lab-remediation">
        <article>
          <header><span className={fixed[selected] ? "is-fixed" : ""}>{fixed[selected] ? <Check /> : <AlertTriangle />}</span><div><p className="lab-kicker">{issue.criterion}</p><h3>{issue.title}</h3></div></header>
          <p>This finding is represented safely in a controlled preview. The surrounding Arjun OS controls remain labeled, keyboard reachable, and testable.</p>
        </article>
        <div className="lab-before-after">
          <div><small>Before</small><strong>{issue.before}</strong></div>
          <ArrowRight aria-hidden />
          <div className="is-after"><small>After</small><strong>{issue.after}</strong></div>
        </div>
        <div className="lab-remediation-actions">
          <button type="button" className="lab-secondary-button" onClick={() => setFixed((current) => ({ ...current, [selected]: !current[selected] }))}>
            {fixed[selected] ? "Undo fix" : "Apply this fix"}
          </button>
          <button type="button" className="lab-primary-button" onClick={autoFix}><WandSparkles /> Apply all fixes</button>
        </div>
      </section>

      <section className="lab-semantic-trace">
        <header><GitBranch aria-hidden /><div><p className="lab-kicker">Semantic trace</p><strong>Keyboard path + accessibility tree</strong></div></header>
        <ol>
          {["Navigation · Overview", "Main · Quarterly impact", "Region · Accessibility insights", fixed.label ? "Button · Save project" : "Button · unnamed (modeled issue)"].map((item, index) => (
            <li key={item}><span>{index + 1}</span><code>{item}</code>{index < 3 && <ArrowRight />}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const GRAPH_KIND_LABELS = {
  skill: "Skills",
  project: "Projects",
  role: "Experience",
  research: "Research",
  outcome: "Outcomes",
};

function MemoryGraphExperience() {
  const { openApp, dispatch } = useOSActions();
  const [selectedId, setSelectedId] = useState("ai-systems");
  const selected = MEMORY_NODES.find((node) => node.id === selectedId) ?? MEMORY_NODES[0];
  const connected = new Set([selected.id, ...selected.links]);

  const openSelected = () => {
    if (!selected.appId) return;
    openApp(selected.appId);
    if (selected.projectId) dispatch({ type: "SET_ACTIVE_PROJECT", projectId: selected.projectId });
  };

  return (
    <div className="lab-memory" data-testid="lab-memory">
      <header className="lab-memory-header">
        <div><p className="lab-kicker">Evidence topology</p><h2>Arjun’s memory graph</h2><p>Select a node to trace the work, skills, roles, and outcomes connected to it.</p></div>
        <span><Network aria-hidden /> {MEMORY_NODES.length} nodes · {Math.round(MEMORY_NODES.reduce((sum, node) => sum + node.links.length, 0) / 2)} relationships</span>
      </header>

      <div className="lab-memory-layout">
        <section className="lab-graph-canvas" aria-label="Portfolio relationship graph">
          <div className="lab-graph-center">
            <span>AM</span>
            <strong>Arjun</strong>
            <small>AI · HCI · Product</small>
          </div>
          <div className="lab-graph-rings" aria-hidden><i /><i /><i /></div>
          {MEMORY_NODES.map((node, index) => {
            const angle = (index / MEMORY_NODES.length) * Math.PI * 2 - Math.PI / 2;
            const radiusX = index % 2 === 0 ? 40 : 34;
            const radiusY = index % 2 === 0 ? 38 : 31;
            const left = 50 + Math.cos(angle) * radiusX;
            const top = 50 + Math.sin(angle) * radiusY;
            return (
              <button
                key={node.id}
                type="button"
                className={cn(`is-${node.kind}`, connected.has(node.id) && "is-connected", selected.id === node.id && "is-selected")}
                style={{ left: `${left}%`, top: `${top}%` }}
                onClick={() => setSelectedId(node.id)}
                aria-pressed={selected.id === node.id}
              >
                <span>{node.kind === "skill" ? <Sparkles /> : node.kind === "project" ? <FileCode2 /> : node.kind === "role" ? <BriefcaseBusiness /> : node.kind === "research" ? <BookOpen /> : <BadgeCheck />}</span>
                <strong>{node.label}</strong>
              </button>
            );
          })}
        </section>

        <aside className="lab-memory-inspector">
          <p className="lab-kicker">{GRAPH_KIND_LABELS[selected.kind]}</p>
          <h3>{selected.label}</h3>
          <p>{selected.detail}</p>
          <div className="lab-memory-connections">
            <span>{selected.links.length} direct connections</span>
            {selected.links.map((linkId) => {
              const node = MEMORY_NODES.find((item) => item.id === linkId);
              return node ? <button key={linkId} type="button" onClick={() => setSelectedId(linkId)}><i className={`is-${node.kind}`} /><span>{node.label}</span><ChevronRight /></button> : null;
            })}
          </div>
          {selected.appId && <button type="button" className="lab-primary-button" onClick={openSelected}>Open evidence <ArrowRight /></button>}
        </aside>
      </div>

      <footer className="lab-graph-legend">
        {Object.entries(GRAPH_KIND_LABELS).map(([kind, label]) => <span key={kind}><i className={`is-${kind}`} />{label}</span>)}
        <small>Dimmed nodes are outside the selected evidence path.</small>
      </footer>
    </div>
  );
}

function ExperienceContent({ active }: { active: LabExperienceId }) {
  switch (active) {
    case "finder":
      return <FinderExperience />;
    case "portal":
      return <PortalExperience />;
    case "systems":
      return <SystemsExperience />;
    case "recruiter":
      return <RecruiterExperience />;
    case "a11y":
      return <A11yExperience />;
    case "graph":
      return <MemoryGraphExperience />;
  }
}

export function ExperienceLabApp() {
  const { layoutMode } = useOSState();
  const [active, setActive] = useState<LabExperienceId>(() => {
    if (typeof window === "undefined") return "finder";
    const saved = sessionStorage.getItem("arjun-os-lab-experience");
    return LAB_EXPERIENCES.some((item) => item.id === saved) ? (saved as LabExperienceId) : "finder";
  });
  const selected = LAB_EXPERIENCES.find((item) => item.id === active) ?? LAB_EXPERIENCES[0];
  const compact = layoutMode === "phone" || layoutMode === "tabletPortrait";

  useEffect(() => {
    sessionStorage.setItem("arjun-os-lab-experience", active);
  }, [active]);

  return (
    <div className="experience-lab-app">
      {!compact && (
        <aside className="lab-navigation">
          <header>
            <span><Sparkles aria-hidden /></span>
            <div><p>Arjun OS</p><strong>Experience Lab</strong></div>
          </header>
          <p className="lab-kicker">Experiments</p>
          <nav aria-label="Experience Lab tools">
            {LAB_EXPERIENCES.map((item, index) => {
              const Icon = EXPERIENCE_ICONS[item.id];
              return (
                <button key={item.id} type="button" className={cn(active === item.id && "is-active")} onClick={() => setActive(item.id)} aria-current={active === item.id ? "page" : undefined}>
                  <span className={`is-${item.accent}`}><Icon aria-hidden /></span>
                  <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  <kbd>{index + 1}</kbd>
                </button>
              );
            })}
          </nav>
          <footer><ShieldCheck aria-hidden /><span><strong>Evidence mode</strong><small>Verified portfolio data only</small></span></footer>
        </aside>
      )}

      <section className="lab-workspace">
        <header className="lab-workspace-header">
          <div>
            <p className="lab-kicker">Experience {String(LAB_EXPERIENCES.findIndex((item) => item.id === active) + 1).padStart(2, "0")}</p>
            <h1>{selected.label}</h1>
            <p>{selected.description}</p>
          </div>
          <span className="lab-live-pill"><i /> Interactive</span>
        </header>

        {compact && (
          <nav className="lab-mobile-nav" aria-label="Experience Lab tools">
            {LAB_EXPERIENCES.map((item) => {
              const Icon = EXPERIENCE_ICONS[item.id];
              return <button key={item.id} type="button" className={cn(active === item.id && "is-active")} onClick={() => setActive(item.id)} aria-label={item.label} aria-current={active === item.id ? "page" : undefined}><Icon /><span>{item.shortLabel}</span></button>;
            })}
          </nav>
        )}

        <div className="lab-experience-viewport">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="h-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              <ExperienceContent active={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

