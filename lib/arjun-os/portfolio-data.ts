import type { AppId, ProjectId } from "./types";

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioProject {
  id: ProjectId;
  title: string;
  label: string;
  year: string;
  summary: string;
  role: string;
  problem: string;
  approach: string;
  process: string[];
  architecture: string;
  results: string[];
  learnings: string[];
  stack: string[];
  image: string | null;
  links: PortfolioLink[];
  tags: string[];
}

export interface PortfolioExperience {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
  tools: string[];
  logo?: string;
}

export interface PortfolioResearchItem {
  id: string;
  title: string;
  summary: string;
  themes: string[];
}

export const portfolioData = {
  profile: {
    name: "Arjun Mishra",
    title: "Software Engineer + HCI/AI Researcher",
    location: "Vancouver, BC",
    availability: "Graduating May 2027 · open to new-grad software, forward-deployed, and AI engineering roles",
    positioning:
      "I’m graduating from UBC in May 2027 and looking for new-grad software, forward-deployed, and AI engineering roles. I shipped Roadpack to the App Store from a Windows PC, co-founded Mune, build production AI at IFS Copperleaf, and am first author on an accessibility-agents paper submitted to CHI 2027.",
    proof: [
      { value: "2", label: "apps on the App Store" },
      { value: "1st", label: "author, CHI 2027 submission" },
      { value: "2", label: "hackathon prizes" },
      { value: "250+", label: "students taught" },
    ],
    focusAreas: ["Production AI systems", "Accessibility research", "Native iOS + distributed systems", "Developer tooling"],
    quickFacts: [
      "Jr. AI Implementations Engineer (part-time) at IFS Copperleaf, following an AI Engineering Co-op",
      "HCI/AI Research Assistant at UBC SOCIUS Lab",
      "Roadpack and Mune live on the App Store; BuildStory’s scanner is open source",
      "First author of Agentic Web Accessibility Auditing; second author of WRAP — both submitted to ACM CHI 2027",
      "Hack the North 2024 Codegen sponsor prize (LLM Pro Max)",
      "youCode 2025 SAP Stream winner (Re-Plate)",
    ],
    education: {
      institution: "University of British Columbia",
      degree: "BSc Computer Science (AI Specialization)",
      minor: "Commerce Minor",
      period: "Sep 2022 – May 2027",
      graduation: "Expected May 2027",
      awards: ["youCode 2025 — 1st Place, SAP Stream", "Hack the North 2024 — Codegen sponsor prize", "Work Learn International Undergraduate Research Award", "Faculty of Science International Student Scholar", "Dean’s Honors List"],
    },
    skills: [
      { title: "Languages", items: ["Swift", "TypeScript / JavaScript", "Python", "C / C++", "SQL", "Java", "Dart"] },
      { title: "Backend & systems", items: ["Node.js", "FastAPI", "Cloudflare Workers", "Durable Objects", "WebSockets", "D1", "R2", "Databricks", "Spark", "Delta Lake"] },
      { title: "Mobile & web", items: ["SwiftUI", "iOS SDK", "React", "Next.js", "Flutter", "Playwright", "GitHub Actions", "Docker"] },
      { title: "AI & ML", items: ["LLM agents", "MCP", "RAG", "VLMs", "LangChain", "OpenAI", "Gemini", "Claude", "PyTorch", "MLX Swift", "LLM evaluation"] },
    ],
    contact: {
      email: "arjunmishra31204@gmail.com",
      github: "https://github.com/Arjun-Mishra-312",
      linkedin: "https://linkedin.com/in/-arjun-mishra/",
      resume: "/Resume.pdf?v=2026-10-05",
    },
    avatar: "/arjun-lake-avatar.webp",
  },
  projects: [
    {
      id: "roadpack",
      title: "Roadpack",
      label: "Shipped on the App Store",
      year: "Aug 2026 – Present",
      summary: "Separate cars. One shared trip. A native iPhone app for live pack locations, shared stops, regrouping, expenses, and a Rewind of the moments along the way.",
      role: "Independent product builder — product design, native app, backend, and launch",
      problem: "A map gets one car to the destination. A group travelling in separate vehicles also needs a shared plan, arrival times, and a way to agree on the next stop.",
      approach: "Make the vehicle the unit of coordination: one status, one arrival time, and one vote. Put the pack's next decision beside the live map.",
      process: [
        "Designed a map-first experience around shared arrival times and the next stop.",
        "Built stop discovery, proposals, and one vote per vehicle into the shared itinerary.",
        "Integrated Live Activities, widgets, App Intents, Universal Link / QR invites, and background location.",
        "Built authoritative trip snapshots, idempotent commands, and offline outboxes for real-time coordination.",
        "Shipped every TestFlight and App Store release (1.0.0, 1.0.1, 1.1.0) from Windows through GitHub Actions macOS runners, with the App Store Connect API key and signing identity held as repository secrets.",
      ],
      architecture: "A Swift / SwiftUI and MapKit client connects to Cloudflare Workers. Durable Objects and WebSockets coordinate authoritative trip snapshots, with idempotent commands and offline outboxes. D1, R2, and queued push delivery support persistence, media, and notifications; background location keeps the active pack in sync.",
      results: ["Live on the App Store", "First Pro subscriber within the first six downloads, before any marketing", "Three App Store releases shipped from Windows via GitHub Actions macOS runners", "203 Swift files across 13 feature areas", "40 iOS + 20 backend test files"],
      learnings: ["Coordination works best when the next decision is visible beside the map.", "One vote per vehicle keeps the decision aligned with how people actually travel.", "A useful trip experience includes the memories after the drive."],
      stack: ["Swift", "SwiftUI", "MapKit", "Cloudflare Workers", "Durable Objects", "WebSockets", "D1", "R2", "GitHub Actions"],
      image: "/roadpack/screens/ipad.webp",
      links: [{ label: "Get Roadpack", href: "https://apps.apple.com/app/roadpack-travel-together/id6801922780" }, { label: "Product website", href: "https://roadpack.app" }],
      tags: ["iOS", "Product", "Shipped"],
    },
    {
      id: "buildstory",
      title: "BuildStory",
      label: "Open-source developer tool",
      year: "Jul 2026 – Present",
      summary: "Turn Git history and AI coding sessions into an inspectable engineering story. An open-source local scanner with an optional hosted portal for recaps, receipts, and published chapters.",
      role: "Creator — local report engine, privacy scanner, and hosted story experience",
      problem: "A finished repository shows the result, but the decisions and AI-assisted work that produced it are spread across Git and incompatible coding-session formats.",
      approach: "Normalize supported session formats into a common report, with local scanning, redaction, and a clear boundary around source files.",
      process: [
        "Built common adapters for Claude Code, Codex, Cursor, and Gemini Antigravity coding sessions.",
        "Streamed JSONL in 64 KB chunks and normalized provider token and cost accounting.",
        "Added canonical upload validation and redacted reporting; the scanner never reads source-file bodies.",
        "Covered the tool with 330+ automated tests and released the scanner as open source.",
      ],
      architecture: "Git history and provider-specific JSONL sessions → streaming adapters → normalized token / cost records → privacy filtering and canonical validation → structured reports, CLI / TUI, and optional hosted presentation.",
      results: ["Open-source scanner", "330+ automated tests", "Four coding-session providers supported", "64 KB streaming chunks; source files stay unread"],
      learnings: ["Privacy boundaries need to be enforced where data is collected.", "Common adapters make provider-specific histories useful in one inspectable report."],
      stack: ["TypeScript", "Node.js", "CLI / TUI", "Git", "JSONL", "LLM APIs"],
      image: null,
      links: [{ label: "Visit BuildStory", href: "https://buildstory.dev" }, { label: "Open-source scanner", href: "https://github.com/Arjun-Mishra-312/buildstory-scan" }],
      tags: ["Developer Tools", "Open Source", "AI"],
    },
    {
      id: "mune",
      title: "Mune",
      label: "Shipped on the App Store",
      year: "May 2026 – Present",
      summary: "A personal finance app with Safe-to-Spend, budgets, goals, subscriptions, and bank connectivity. Its assistant runs Qwen3.5 4B on the iPhone with Apple’s MLX, and acts through 22 finance tools.",
      role: "Co-founder and iOS engineer — on-device assistant, Plaid integration, and everyday finance features",
      problem: "People need a useful view of everyday finances, and a way to ask about their spending and act on it, with the AI running on their own phone.",
      approach: "Run a 4-billion-parameter model on the iPhone with MLX, let it act through finance tools, and back it with production Plaid connectivity.",
      process: [
        "Built Safe-to-Spend, budgets, goals, subscriptions, and notifications in a native Swift app.",
        "Shipped an assistant that runs Qwen3.5 4B (4-bit) on the iPhone with Apple’s MLX and acts through 22 finance tools: checking what you can afford, building budgets, and setting goals.",
        "Hardened tool calling for small on-device models, including a corrective retry when a model describes a tool call instead of making it.",
        "Built a second on-device runtime for Gemma models on LiteRT-LM, with memory-aware model choice and background downloads that survive interruptions.",
        "Implemented Plaid token exchange, webhooks, and transaction refresh in a Node.js / Vercel backend.",
        "Connected authentication, account lifecycle, and RevenueCat subscriptions; shipped on the App Store.",
      ],
      architecture: "Release builds run Qwen3.5 4B (4-bit) on the device with MLX Swift, with a LiteRT-LM runtime for Gemma models; answers come from local finance tools. A Node.js backend on Vercel handles Plaid token exchange, webhooks, transaction refresh, authentication, and account lifecycle; RevenueCat supports subscriptions.",
      results: ["Live on the App Store", "Qwen3.5 4B (4-bit) runs on the iPhone with Apple’s MLX", "22 finance tools: numbers come from tool results, not the model", "Production Plaid bank connectivity"],
      learnings: ["Local inference needs to fit the device’s available resources.", "Bank connectivity and account lifecycle are part of the product’s core engineering."],
      stack: ["Swift", "MLX Swift", "LiteRT-LM", "Node.js", "Vercel", "Plaid", "RevenueCat"],
      image: null,
      links: [{ label: "Get Mune", href: "https://apps.apple.com/app/mune-private-finance-ai/id6777609206" }, { label: "Product website", href: "https://askmune.app" }],
      tags: ["iOS", "On-device AI", "Shipped"],
    },
    {
      id: "ai-accessibility-analyzer",
      title: "AI Accessibility Analyzer",
      label: "Research system",
      year: "2026",
      summary:
        "Criterion-specific agents that inspect webpages, operate controls, and record evidence for accessibility assessments. Public preprint and supporting research artifacts.",
      role: "First author and research engineer · submitted to ACM CHI 2027",
      problem:
        "Accessibility evaluation still depends on fragmented tooling and manual expert review, especially for visual interface issues.",
      approach:
        "Give each WCAG requirement tailored instructions and browser tools so an agent can gather the evidence that the criterion needs.",
      process: [
        "Implemented 40 criterion-specific agents with a shared 31-tool browser and accessibility library.",
        "Evaluated 250 page-criterion records across 11 scholarly platforms.",
        "Released the preprint with a worked trace, metrics, prompts, and tool inventory.",
      ],
      architecture:
        "WCAG requirement → tailored agent instructions → browser interaction and inspection → recorded evidence → criterion-level assessment for human review.",
      results: ["86% recall (67 of 78 positive cases) at 56% precision", "Recall baselines: 36% axe-core; 67% uncued VLM", "40 WCAG-specific agents; 31 shared tools", "First-author public preprint; submitted to ACM CHI 2027"],
      learnings: [
        "Interactive evidence can reveal barriers that static checks miss.",
        "Higher recall comes with a precision tradeoff; findings still need human review.",
      ],
      stack: ["Python", "Node.js", "Playwright", "Axe-core", "WCAG"],
      image: "/AI Accessibility.png",
      links: [{ label: "Read the preprint", href: "https://arxiv.org/abs/2609.09379v2" }],
      tags: ["AI", "Accessibility", "Research"],
    },
    {
      id: "llm-pro-max",
      title: "LLM Pro Max",
      label: "Hack the North prize",
      year: "2024",
      summary:
        "A retrieval-augmented codebase analysis platform for exploring large repositories through contextual AI queries.",
      role: "RAG pipeline and architecture contributor",
      problem:
        "Developers lose time building context before they can ask useful questions about unfamiliar codebases.",
      approach:
        "Combined chunking, embeddings, graph analysis, and conversational retrieval to make repository structure queryable.",
      process: [
        "Ingested repositories into chunked embeddings with dependency-graph context.",
        "Wired conversational retrieval so answers cite relevant modules and relationships.",
        "Shipped a demo interaction loop for exploratory Q&A during Hack the North.",
      ],
      architecture:
        "Ingestion → embeddings/store → graph enrichment → retrieval + generation, with an interactive frontend for dependency exploration.",
      results: ["Hack the North 2024 Codegen sponsor prize", "86% query relevancy", "Interactive dependency graph"],
      learnings: [
        "Graph context materially improves relevancy for structural codebase questions.",
        "Hackathon constraints forced a clear retrieval contract over open-ended agent sprawl.",
      ],
      stack: ["React", "FastAPI", "Cohere", "ChromaDB", "NetworkX", "Python"],
      image: "/LLM_Pro_Max.jpg",
      links: [
        { label: "Devpost", href: "https://devpost.com/software/llm-pro-max" },
        { label: "GitHub", href: "https://github.com/gigabite-pro/LLM-pro-max" },
      ],
      tags: ["AI", "RAG", "Developer Tools"],
    },
    {
      id: "re-plate",
      title: "Re-Plate",
      label: "AI social impact",
      year: "2025",
      summary:
        "An AI food donation platform using vision models to classify food safety and track redistribution impact.",
      role: "Backend lead — FastAPI services, Gemini Vision extraction, and impact analytics, connected to the frontend",
      problem:
        "Food donors and shelters need a faster way to evaluate donations, coordinate pickups, and understand impact.",
      approach:
        "Integrated Gemini vision and analytics flows for food classification, expiration checks, and impact tracking.",
      process: [
        "Built the FastAPI backend and connected it to the Next.js frontend, including parts of the donation flow.",
        "Built one endpoint that joins Gemini Vision text extraction (packaging and expiry dates) with the team's image classifiers.",
        "Built the ApexCharts impact dashboard so shelters can see redistribution outcomes.",
      ],
      architecture:
        "Next.js frontend with FastAPI vision services and analytics for expiration accuracy and CO2 impact tracking.",
      results: [
        "youCode 2025 SAP Stream winner",
        "100% expiration-date accuracy on test set",
        "CO2 impact tracking",
      ],
      learnings: [
        "Vision checks only help when the product flow stays frictionless for donors.",
        "Impact metrics make social-tech demos recruiter-readable without inventing scale claims.",
      ],
      stack: ["Next.js", "Tailwind", "FastAPI", "Gemini Vision", "ApexCharts"],
      image: "/Re-Plate.jpg",
      links: [
        { label: "Devpost", href: "https://devpost.com/software/replate-z3b5mg" },
        { label: "GitHub", href: "https://github.com/Arjun-Mishra-312/re-plate" },
      ],
      tags: ["AI", "Product", "Social Impact"],
    },
  ] satisfies PortfolioProject[],
  experience: [
    {
      id: "copperleaf",
      organization: "IFS Copperleaf",
      role: "Jr. AI Implementations Engineer (part-time) · previously AI Engineering Co-op",
      period: "Oct 2025 – Present",
      location: "Vancouver, BC",
      summary:
        "Retained part-time after my co-op as a forward-deployed engineer, taking production AI and data applications from stakeholder discovery to deployment.",
      responsibilities: [
        "Owned the AI-powered ROI Analytics Portal end-to-end, combining a conversational assistant and interactive analytics adopted by Department Leaders and Senior Leadership.",
        "Built a Data Validation Portal that runs enterprise data-quality checks before data reaches AI ingestion.",
        "Delivered production applications using Databricks, Spark, Delta Lake, and LLM APIs.",
      ],
      tools: ["Databricks", "Spark", "Delta Lake", "LLM APIs", "Production AI", "Stakeholder discovery"],
      logo: "/copperleaf-logo.png",
    },
    {
      id: "socius",
      organization: "UBC SOCIUS Lab",
      role: "Undergraduate Research Assistant (HCI/AI)",
      period: "Feb 2025 – Present",
      location: "Vancouver, BC",
      summary:
        "Building agentic accessibility systems and studying how automated and human auditing work together, under Professor Dongwook Yoon.",
      responsibilities: [
        "Built 40 WCAG-specific agents and a shared 31-tool browser / accessibility library with interactive inspection and machine-readable evidence traces.",
        "Evaluated 250 page–criterion records across 11 platforms: 67/78 positive cases recovered (86% recall) at 56% precision, against 36% axe-core and 67% uncued-VLM recall.",
        "First author of Agentic Web Accessibility Auditing and second author of WRAP; both submitted to ACM CHI 2027.",
      ],
      tools: ["HCI", "Accessibility", "VLMs", "WCAG", "Research"],
      logo: "/UBC_logo.png",
    },
    {
      id: "ta",
      organization: "University of British Columbia",
      role: "Undergraduate Teaching Assistant",
      period: "Sep 2024 – Jun 2025",
      location: "Vancouver, BC",
      summary:
        "Supported 250+ students in computer networking, translating systems concepts into practical tutorials.",
      responsibilities: [
        "Taught C / C++, TCP/IP, DNS, routing, HTTP, and Linux to 250+ students.",
        "Redesigned TCP-server and FTP tutorials, contributing to a 20% increase in attendance.",
      ],
      tools: ["C / C++", "TCP/IP", "DNS", "Routing", "HTTP", "Linux", "Teaching"],
      logo: "/UBC_CS_logo.png",
    },
  ] satisfies PortfolioExperience[],
  research: [
    {
      id: "vlm-accessibility",
      title: "VLM Accessibility Evaluation",
      summary:
        "Evaluating vision-language models for real-world usability and safety in accessibility auditing.",
      themes: ["Accessibility", "Multimodal AI", "HCI"],
    },
    {
      id: "wrap",
      title: "WRAP · Sharing the audit work",
      summary:
        "Optimizing WCAG task allocation across automated and human audit modalities. Second-author work submitted to ACM CHI 2027.",
      themes: ["HCI", "Accessibility", "Human + automated auditing"],
    },
    {
      id: "rag-devtools",
      title: "RAG for Developer Productivity",
      summary:
        "Using retrieval-augmented generation to make large codebases navigable through natural-language questions.",
      themes: ["Developer Tools", "RAG", "Multimodal AI"],
    },
  ] satisfies PortfolioResearchItem[],
  life: {
    vancouver: "Living in Vancouver — mountains, water, and weekend hiking energy.",
    lego: "LEGO Technic supercars, including a LaFerrari I rebuilt from the Daytona SP3’s parts using fan-designed instructions.",
    interests: ["Chai", "Chess", "Hiking", "Drone filmmaking", "LEGO Technic"],
    galleryPath: "/experiences_photos",
    vancouverModel: "/3D_modals/Vancouver_3D.glb",
    vancouverPreview: "/fun-widget/vancouver-preview.png",
    libraryPreview: "/fun-widget/library-preview.png",
    legoEmbedBase:
      "https://www.kiriengine.app/share/3dgsEmbed/2008260390479200256?userId=1657534&auto_spin=1",
    legoPreviewLight: "/fun-widget/model-light.png",
    legoPreviewDark: "/fun-widget/model-dark.png",
    heroVisual: "/IMG-20250915-WA0007.jpg",
  },
  visuals: {
    researchHero: "/AI Accessibility.png",
    researchHeroAlt:
      "AI Accessibility Analyzer project visual",
    lifeHeroAlt:
      "Arjun driving at an arcade",
  },
  dockOrder: ["profile", "work", "experience", "research", "life"] as AppId[],
};

export function getProject(id: ProjectId) {
  return portfolioData.projects.find((project) => project.id === id);
}

export function isAppId(value: string | null): value is AppId {
  return value === "profile" || value === "work" || value === "experience" || value === "research" || value === "life";
}

export function isProjectId(value: string | null): value is ProjectId {
  return (
    value === "roadpack" ||
    value === "buildstory" ||
    value === "mune" ||
    value === "ai-accessibility-analyzer" ||
    value === "llm-pro-max" ||
    value === "re-plate"
  );
}
