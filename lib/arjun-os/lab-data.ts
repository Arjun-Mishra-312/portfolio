import type { AppId, ProjectId } from "./types";
import { portfolioData } from "./portfolio-data";

export type LabExperienceId =
  | "finder"
  | "portal"
  | "systems"
  | "recruiter"
  | "a11y"
  | "graph";

export interface LabExperience {
  id: LabExperienceId;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
}

export const LAB_EXPERIENCES: LabExperience[] = [
  {
    id: "finder",
    label: "Finder",
    shortLabel: "Files",
    description: "Browse every project, role, research thread, and artifact as one connected file system.",
    accent: "cyan",
  },
  {
    id: "portal",
    label: "Portal",
    shortLabel: "Web",
    description: "Resolve portfolio aliases and inspect safe hand-offs to verified destinations.",
    accent: "violet",
  },
  {
    id: "systems",
    label: "Systems Lab",
    shortLabel: "Systems",
    description: "Inspect project architecture, data flow, service health, and controlled failure states.",
    accent: "mint",
  },
  {
    id: "recruiter",
    label: "Recruiter Mode",
    shortLabel: "Match",
    description: "Turn a role description into a private, evidence-backed tour through Arjun OS.",
    accent: "cobalt",
  },
  {
    id: "a11y",
    label: "A11y Lab",
    shortLabel: "A11y",
    description: "Explore accessibility findings, remediation choices, and semantic structure live.",
    accent: "amber",
  },
  {
    id: "graph",
    label: "Memory Graph",
    shortLabel: "Graph",
    description: "Trace how skills connect to projects, research, roles, and verifiable outcomes.",
    accent: "rose",
  },
];

export type LabFileKind = "folder" | "project" | "role" | "research" | "document" | "link";

export interface LabFile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  kind: LabFileKind;
  location: "Projects" | "Experience" | "Research" | "Documents" | "Links";
  tags: string[];
  modified: string;
  appId?: AppId;
  projectId?: ProjectId;
  href?: string;
}

const projectFiles: LabFile[] = portfolioData.projects.map((project) => ({
  id: `project-${project.id}`,
  title: project.title,
  subtitle: `${project.label} · ${project.year}`,
  description: project.summary,
  kind: "project",
  location: "Projects",
  tags: project.tags,
  modified: project.year,
  appId: "work",
  projectId: project.id,
}));

const roleFiles: LabFile[] = portfolioData.experience.map((role) => ({
  id: `role-${role.id}`,
  title: role.organization,
  subtitle: `${role.role} · ${role.period}`,
  description: role.summary,
  kind: "role",
  location: "Experience",
  tags: role.tools,
  modified: role.period,
  appId: "experience",
}));

const researchFiles: LabFile[] = portfolioData.research.map((item) => ({
  id: `research-${item.id}`,
  title: item.title,
  subtitle: item.themes.join(" · "),
  description: item.summary,
  kind: "research",
  location: "Research",
  tags: item.themes,
  modified: "Active",
  appId: "research",
}));

export const LAB_FILES: LabFile[] = [
  ...projectFiles,
  ...roleFiles,
  ...researchFiles,
  {
    id: "document-resume",
    title: "Arjun Mishra — Resume",
    subtitle: "PDF · Current",
    description: "A concise record of experience, projects, research, education, and technical skills.",
    kind: "document",
    location: "Documents",
    tags: ["Resume", "Experience", "Skills"],
    modified: "2026",
    href: portfolioData.profile.contact.resume,
  },
  {
    id: "link-github",
    title: "GitHub",
    subtitle: "Verified external profile",
    description: "Public repositories, contribution activity, and project source where available.",
    kind: "link",
    location: "Links",
    tags: ["Code", "Open Source", "Evidence"],
    modified: "Live",
    href: portfolioData.profile.contact.github,
  },
  {
    id: "link-linkedin",
    title: "LinkedIn",
    subtitle: "Verified external profile",
    description: "Professional experience, education, and a direct connection path.",
    kind: "link",
    location: "Links",
    tags: ["Career", "Contact"],
    modified: "Live",
    href: portfolioData.profile.contact.linkedin,
  },
];

export type PortalResolution =
  | {
      status: "local";
      title: string;
      description: string;
      canonical: string;
      trail: string[];
      appId?: AppId;
      projectId?: ProjectId;
      resume?: boolean;
    }
  | {
      status: "external";
      title: string;
      description: string;
      canonical: string;
      trail: string[];
      href: string;
      hostname: string;
    }
  | {
      status: "blocked";
      title: string;
      description: string;
      canonical: string;
      trail: string[];
    };

type LocalPortalRoute = {
  title: string;
  description: string;
  canonical: string;
  appId?: AppId;
  projectId?: ProjectId;
  resume?: boolean;
};

const LOCAL_ROUTES: Record<string, LocalPortalRoute> = {
  "arjun://home": {
    title: "About Arjun",
    description: "Return to the profile and positioning overview.",
    canonical: "arjun://home",
    appId: "profile",
  },
  "arjun://work": {
    title: "Selected Work",
    description: "Open the project library and detailed case studies.",
    canonical: "arjun://work",
    appId: "work",
  },
  "arjun://experience": {
    title: "Experience",
    description: "Explore industry, research, and teaching roles.",
    canonical: "arjun://experience",
    appId: "experience",
  },
  "arjun://research": {
    title: "Research",
    description: "Open the active HCI, accessibility, and AI research threads.",
    canonical: "arjun://research",
    appId: "research",
  },
  "arjun://life": {
    title: "Life + Play",
    description: "Explore photography, Vancouver, interests, and 3D builds.",
    canonical: "arjun://life",
    appId: "life",
  },
  "arjun://lab": {
    title: "Experience Lab",
    description: "Stay in the interactive portfolio laboratory.",
    canonical: "arjun://lab",
    appId: "lab",
  },
  "arjun://resume": {
    title: "Resume",
    description: "Open the current resume in a new browser tab.",
    canonical: "arjun://resume",
    resume: true,
  },
};

const ROUTE_ALIASES: Record<string, string> = {
  home: "arjun://home",
  about: "arjun://home",
  work: "arjun://work",
  projects: "arjun://work",
  experience: "arjun://experience",
  research: "arjun://research",
  life: "arjun://life",
  lab: "arjun://lab",
  resume: "arjun://resume",
  cv: "arjun://resume",
  github: portfolioData.profile.contact.github,
  linkedin: portfolioData.profile.contact.linkedin,
};

const ALLOWED_EXTERNAL_HOSTS = ["github.com", "linkedin.com", "devpost.com"];

function isAllowedExternalHost(hostname: string) {
  const normalized = hostname.toLowerCase();
  return ALLOWED_EXTERNAL_HOSTS.some(
    (host) => normalized === host || normalized === `www.${host}`,
  );
}

function normalizePortalInput(input: string) {
  const trimmed = input.trim();
  const alias = ROUTE_ALIASES[trimmed.toLowerCase().replace(/\/+$/, "")];
  if (alias) return alias;
  if (/^(github\.com|www\.github\.com|linkedin\.com|www\.linkedin\.com|devpost\.com|www\.devpost\.com)\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function resolvePortalAddress(input: string): PortalResolution {
  const normalized = normalizePortalInput(input);
  const local = LOCAL_ROUTES[normalized.toLowerCase().replace(/\/+$/, "")];
  if (local) {
    return {
      status: "local",
      ...local,
      trail: ["Address resolved", "Arjun OS route", local.title],
    };
  }

  try {
    const url = new URL(normalized);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || !isAllowedExternalHost(url.hostname)) {
      return {
        status: "blocked",
        title: "Destination not allowlisted",
        description: "Portal only hands off to Arjun’s verified GitHub, LinkedIn, and Devpost destinations.",
        canonical: normalized || input,
        trail: ["Address parsed", "Safety check", "Hand-off blocked"],
      };
    }

    const title = url.hostname.includes("github")
      ? "GitHub destination"
      : url.hostname.includes("linkedin")
        ? "LinkedIn destination"
        : "Devpost destination";

    return {
      status: "external",
      title,
      description: "This verified destination will open outside Arjun OS in a new browser tab.",
      canonical: url.toString(),
      href: url.toString(),
      hostname: url.hostname,
      trail: ["Address parsed", `${url.hostname} verified`, "External hand-off ready"],
    };
  } catch {
    return {
      status: "blocked",
      title: "Address not recognized",
      description: "Try work, research, resume, github, or an arjun:// address.",
      canonical: normalized || input,
      trail: ["Address parsed", "No matching route", "Navigation paused"],
    };
  }
}

export interface SystemNode {
  id: string;
  label: string;
  category: "input" | "service" | "intelligence" | "data" | "output";
  detail: string;
}

export interface SystemScenario {
  projectId: ProjectId;
  title: string;
  summary: string;
  nodes: SystemNode[];
  normalLog: string[];
  failureLog: string[];
}

export const SYSTEM_SCENARIOS: Record<ProjectId, SystemScenario> = {
  "ai-accessibility-analyzer": {
    projectId: "ai-accessibility-analyzer",
    title: "AI Accessibility Analyzer",
    summary: "Hybrid accessibility evidence pipeline",
    nodes: [
      { id: "capture", label: "Browser capture", category: "input", detail: "Collects DOM structure and a deterministic interface screenshot." },
      { id: "static", label: "WCAG checks", category: "service", detail: "Runs deterministic semantic, contrast, and interaction checks." },
      { id: "vlm", label: "VLM review", category: "intelligence", detail: "Examines visual issues that static rules can miss." },
      { id: "normalize", label: "Evidence normalizer", category: "data", detail: "Maps mixed findings into a consistent evidence contract." },
      { id: "review", label: "Evaluator review", category: "output", detail: "Presents explainable findings for a human decision." },
    ],
    normalLog: ["DOM snapshot accepted", "Static checks complete", "VLM evidence grounded", "Evaluator packet ready"],
    failureLog: ["VLM service timeout", "Static findings retained", "Fallback evidence packet created", "Human review flagged"],
  },
  "llm-pro-max": {
    projectId: "llm-pro-max",
    title: "LLM Pro Max",
    summary: "Repository intelligence and grounded retrieval",
    nodes: [
      { id: "repo", label: "Repository ingest", category: "input", detail: "Reads source structure and normalizes supported file types." },
      { id: "chunk", label: "Chunk + embed", category: "service", detail: "Builds retrievable semantic units from source files." },
      { id: "graph", label: "Graph enrichment", category: "data", detail: "Adds dependency relationships to semantic context." },
      { id: "rank", label: "Retrieve + rank", category: "intelligence", detail: "Combines similarity and structural signals." },
      { id: "answer", label: "Grounded answer", category: "output", detail: "Returns an answer tied to relevant modules and relationships." },
    ],
    normalLog: ["Repository indexed", "Dependency graph connected", "Relevant chunks ranked", "Grounded answer returned"],
    failureLog: ["Embedding request degraded", "Keyword fallback enabled", "Graph context preserved", "Answer marked low confidence"],
  },
  "re-plate": {
    projectId: "re-plate",
    title: "Re-Plate",
    summary: "Vision-assisted food donation workflow",
    nodes: [
      { id: "donation", label: "Donation capture", category: "input", detail: "Collects the food image and donor-provided context." },
      { id: "vision", label: "Vision classification", category: "intelligence", detail: "Extracts food type and visible date information." },
      { id: "safety", label: "Safety checks", category: "service", detail: "Applies controlled validation before matching." },
      { id: "match", label: "Shelter matching", category: "data", detail: "Finds a suitable redistribution destination." },
      { id: "impact", label: "Impact analytics", category: "output", detail: "Tracks redistribution and estimated CO₂ impact." },
    ],
    normalLog: ["Donation image accepted", "Expiration date extracted", "Safety checks passed", "Shelter match prepared"],
    failureLog: ["Vision confidence below threshold", "Manual confirmation requested", "Matching paused safely", "No impact claim recorded"],
  },
};

export interface RecruiterEvidence {
  id: string;
  title: string;
  eyebrow: string;
  rationale: string;
  keywords: string[];
  appId: AppId;
  projectId?: ProjectId;
}

const RECRUITER_EVIDENCE: RecruiterEvidence[] = [
  {
    id: "evidence-accessibility",
    title: "AI Accessibility Analyzer",
    eyebrow: "Research system",
    rationale: "Hybrid static and multimodal evaluation demonstrates responsible AI, HCI, and accessibility depth.",
    keywords: ["accessibility", "wcag", "hci", "research", "multimodal", "vlm", "responsible ai", "evaluation"],
    appId: "work",
    projectId: "ai-accessibility-analyzer",
  },
  {
    id: "evidence-copperleaf",
    title: "IFS Copperleaf",
    eyebrow: "Industry AI engineering",
    rationale: "Enterprise AI work demonstrates full-stack delivery, agent workflows, reliability, and product judgment.",
    keywords: ["enterprise", "ai engineer", "full stack", "full-stack", "agents", "llm", "reliability", "next.js", "python"],
    appId: "experience",
  },
  {
    id: "evidence-llm",
    title: "LLM Pro Max",
    eyebrow: "Hackathon winner",
    rationale: "A winning retrieval platform shows RAG architecture, graph reasoning, and fast collaborative shipping.",
    keywords: ["rag", "retrieval", "developer tools", "graph", "python", "fastapi", "react", "llm", "search"],
    appId: "work",
    projectId: "llm-pro-max",
  },
  {
    id: "evidence-replate",
    title: "Re-Plate",
    eyebrow: "Product + social impact",
    rationale: "Vision integration and a real donation workflow demonstrate applied AI and product-minded implementation.",
    keywords: ["vision", "gemini", "product", "social impact", "full stack", "full-stack", "next.js", "fastapi"],
    appId: "work",
    projectId: "re-plate",
  },
  {
    id: "evidence-socius",
    title: "UBC SOCIUS Lab",
    eyebrow: "HCI/AI research",
    rationale: "Research work demonstrates experimental thinking, technical communication, and human-centered AI practice.",
    keywords: ["research", "hci", "human-centered", "accessibility", "academic", "experiment", "evaluation", "vlm"],
    appId: "experience",
  },
  {
    id: "evidence-teaching",
    title: "UBC Teaching",
    eyebrow: "Technical communication",
    rationale: "Networking instruction shows clear communication, mentoring, and strong computer-science fundamentals.",
    keywords: ["communication", "teaching", "mentoring", "networking", "tcp", "dns", "collaboration"],
    appId: "experience",
  },
];

export interface RecruiterAnalysis {
  score: number;
  matchedTerms: string[];
  evidence: RecruiterEvidence[];
}

export function analyzeJobDescription(description: string): RecruiterAnalysis {
  const normalized = description.toLowerCase();
  const scored = RECRUITER_EVIDENCE.map((item) => {
    const matches = item.keywords.filter((keyword) => normalized.includes(keyword));
    return { item, matches, score: matches.length };
  }).sort((a, b) => b.score - a.score);

  const meaningful = scored.filter((entry) => entry.score > 0);
  const selected = (meaningful.length > 0 ? meaningful : scored).slice(0, 4);
  const matchedTerms = Array.from(new Set(selected.flatMap((entry) => entry.matches))).slice(0, 8);
  const termCoverage = Math.min(36, matchedTerms.length * 6);
  const evidenceCoverage = meaningful.length > 0 ? Math.min(28, meaningful.length * 7) : 10;
  const specificity = Math.min(26, Math.floor(description.trim().length / 24));

  return {
    score: Math.min(96, 28 + termCoverage + evidenceCoverage + specificity),
    matchedTerms,
    evidence: selected.map((entry) => entry.item),
  };
}

export type MemoryNodeKind = "skill" | "project" | "role" | "research" | "outcome";

export interface MemoryNode {
  id: string;
  label: string;
  kind: MemoryNodeKind;
  detail: string;
  links: string[];
  appId?: AppId;
  projectId?: ProjectId;
}

export const MEMORY_NODES: MemoryNode[] = [
  { id: "ai-systems", label: "AI systems", kind: "skill", detail: "Applied LLM, VLM, and retrieval systems designed around real workflows.", links: ["copperleaf", "a11y-project", "llm-project", "replate-project"] },
  { id: "accessibility", label: "Accessibility", kind: "skill", detail: "WCAG evaluation, multimodal auditing, and evaluator-centered design.", links: ["a11y-project", "socius", "hci-research"] },
  { id: "product", label: "Product engineering", kind: "skill", detail: "Full-stack implementation with attention to reliability, clarity, and impact.", links: ["copperleaf", "replate-project", "wins"] },
  { id: "a11y-project", label: "AI Accessibility Analyzer", kind: "project", detail: "Static and VLM evidence combined for evaluator review.", links: ["accessibility", "ai-systems", "hci-research"], appId: "work", projectId: "ai-accessibility-analyzer" },
  { id: "llm-project", label: "LLM Pro Max", kind: "project", detail: "RAG and dependency-graph context for large codebases.", links: ["ai-systems", "wins"], appId: "work", projectId: "llm-pro-max" },
  { id: "replate-project", label: "Re-Plate", kind: "project", detail: "Vision-assisted donation safety, matching, and impact analytics.", links: ["ai-systems", "product", "wins"], appId: "work", projectId: "re-plate" },
  { id: "copperleaf", label: "IFS Copperleaf", kind: "role", detail: "Enterprise AI engineering for customer-success and operations workflows.", links: ["ai-systems", "product"], appId: "experience" },
  { id: "socius", label: "UBC SOCIUS Lab", kind: "role", detail: "Human-centered AI research at the intersection of accessibility and VLMs.", links: ["accessibility", "hci-research"], appId: "experience" },
  { id: "hci-research", label: "HCI + evaluation", kind: "research", detail: "Research threads spanning accessibility, multimodal AI, and developer tooling.", links: ["accessibility", "a11y-project", "socius"], appId: "research" },
  { id: "wins", label: "2 hackathon wins", kind: "outcome", detail: "Hack the North 2024 and youCode 2025 SAP Stream.", links: ["llm-project", "replate-project", "product"] },
];

