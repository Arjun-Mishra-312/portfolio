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
  image: string;
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
    title: "AI Engineer + HCI Researcher",
    location: "Vancouver, BC",
    availability: "Available for full-time and internship conversations",
    positioning:
      "I build intelligent systems and accessible experiences that create real human impact — spanning applied AI engineering, VLM accessibility research, and product-minded full-stack work.",
    focusAreas: ["Applied AI systems", "Accessibility research", "HCI + product engineering"],
    quickFacts: [
      "AI Engineering Co-op at IFS Copperleaf",
      "HCI/AI Research Assistant at UBC SOCIUS Lab",
      "Hack the North 2024 winner (LLM Pro Max)",
      "youCode 2025 SAP Stream winner (Re-Plate)",
    ],
    contact: {
      email: "arjunmishra31204@gmail.com",
      github: "https://github.com/Arjun-Mishra-312",
      linkedin: "https://linkedin.com/in/-arjun-mishra/",
      resume: "/Resume.pdf",
    },
    avatar: "/pfp.png",
  },
  projects: [
    {
      id: "ai-accessibility-analyzer",
      title: "AI Accessibility Analyzer",
      label: "Research system",
      year: "2026",
      summary:
        "A multimodal accessibility analyzer combining automated audits with VLM-based interface review for evaluator workflows.",
      role: "Research engineer and system builder",
      problem:
        "Accessibility evaluation still depends on fragmented tooling and manual expert review, especially for visual interface issues.",
      approach:
        "Pair static WCAG checks with AI visual reasoning to surface contrast, touch target, and semantic issues.",
      process: [
        "Mapped evaluator pain points around visual and semantic checks that static tools miss.",
        "Built a hybrid pipeline combining axe-core style checks with VLM screenshot review.",
        "Iterated prompts and scoring so findings stay actionable for WCAG certifiers.",
      ],
      architecture:
        "Static analysis layer feeds structured findings into a VLM reasoning stage; results are normalized for evaluator review rather than raw model output.",
      results: ["WCAG 2.2 focused pipeline", "Static + VLM analysis", "Designed for evaluator workflows"],
      learnings: [
        "Hybrid systems outperform model-only audits when grounded in WCAG criteria.",
        "Evaluator trust depends on explainable findings, not just recall-oriented detection.",
      ],
      stack: ["Python", "Node.js", "Playwright", "Axe-core", "Gemini", "WCAG"],
      image: "/AI Accessibility.png",
      links: [],
      tags: ["AI", "Accessibility", "Research"],
    },
    {
      id: "llm-pro-max",
      title: "LLM Pro Max",
      label: "Hackathon winner",
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
      results: ["Hack the North 2024 winner", "86% query relevancy", "Interactive dependency graph"],
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
      role: "Full-stack and AI integration contributor",
      problem:
        "Food donors and shelters need a faster way to evaluate donations, coordinate pickups, and understand impact.",
      approach:
        "Integrated Gemini vision and analytics flows for food classification, expiration checks, and impact tracking.",
      process: [
        "Designed donation capture flows that prioritize speed for real donors.",
        "Connected vision classification to expiration and safety checks on a controlled test set.",
        "Surfaced impact analytics so shelters can see redistribution outcomes.",
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
      role: "AI Engineering Co-op",
      period: "2026",
      location: "Vancouver, BC",
      summary:
        "Building LLM-assisted internal systems for customer success and operations workflows.",
      responsibilities: [
        "Architected a full-stack tool that centralizes context from multiple enterprise data sources.",
        "Focused on practical agent workflows, latency, and reliability for internal teams.",
      ],
      tools: ["LLMs", "Next.js", "Python", "Automation", "Enterprise AI"],
      logo: "/copperleaf-logo.png",
    },
    {
      id: "socius",
      organization: "UBC SOCIUS Lab",
      role: "HCI/AI Research Assistant",
      period: "2025 – Present",
      location: "Vancouver, BC",
      summary:
        "Supporting human-centered AI research at the intersection of accessibility and vision-language models.",
      responsibilities: [
        "Developed multimodal accessibility analysis pipelines combining static tooling and VLM review.",
        "Prepared research artifacts around automated web accessibility and WCAG evaluation.",
      ],
      tools: ["HCI", "Accessibility", "VLMs", "WCAG", "Research"],
      logo: "/UBC_logo.png",
    },
    {
      id: "ta",
      organization: "University of British Columbia",
      role: "Undergraduate Teaching Assistant",
      period: "2025",
      location: "Vancouver, BC",
      summary:
        "Supported upper-year computer networking instruction across tutorials and lecture material.",
      responsibilities: [
        "Taught weekly tutorials and helped students reason through TCP/IP, DNS, and routing concepts.",
        "Supported course delivery for large lecture sections with consistent technical communication.",
      ],
      tools: ["Teaching", "Networking", "CPSC 317", "Communication"],
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
      id: "ai-hcd",
      title: "AI + Human-Centered Design",
      summary:
        "Designing AI tools that fit evaluator and developer workflows rather than forcing new process overhead.",
      themes: ["HCI", "Product", "AI Systems"],
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
    lego: "Complex LEGO Technic builds as a parallel practice in systems thinking.",
    interests: ["Chai", "Chess (~1200 ELO)", "Hiking", "Photography"],
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
    value === "ai-accessibility-analyzer" ||
    value === "llm-pro-max" ||
    value === "re-plate"
  );
}
