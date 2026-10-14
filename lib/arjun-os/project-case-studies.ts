import type { ProjectId } from "./types";

export type DetailedProjectId = Exclude<ProjectId, "roadpack">;
export interface CaseMedia {
  asset: string;
  alt: string;
  caption: string;
  portrait?: boolean;
  /** A short muted screen recording that loops while on screen; `asset` is its poster. */
  video?: string;
}
interface CaseFeature {
  eyebrow: string;
  title: string;
  body: string;
  media: CaseMedia[];
}
interface CaseDecision { title: string; body: string; consequence: string }
export interface ProjectCaseStudy {
  premise: { title: string; body: string };
  features: CaseFeature[];
  problem: { title: string; body: string }[];
  scope: string[];
  process: { title: string; body: string; decisions: CaseDecision[]; media?: CaseMedia };
  system: {
    title: string;
    groups: { label: string; title: string; body: string; tools: string[] }[];
    stages: { title: string; body: string }[];
    boundary: string;
    media?: CaseMedia;
  };
  resultNote: string;
  resultMedia?: CaseMedia;
  sources: { label: string; href: string }[];
}

// Grounded in the project repositories, original captures, resume, and public paper.
// Asset provenance and source paths: docs/design/arjun-os/case-study-depth.md.
export const projectCaseStudies: Record<DetailedProjectId, ProjectCaseStudy> = {
  buildstory: {
    premise: {
      title: "Leave the decisions in.",
      body: "A launch shows what shipped. BuildStory adds the work behind it: the detours, tradeoffs, and moments that changed the direction. An inspectable local report becomes a richer web experience when the creator chooses to share it.",
    },
    features: [
      {
        eyebrow: "The recap",
        title: "A build, in a few memorable moments.",
        body: "A timed recap turns a long report into an approachable first look. It gives the build a rhythm and a visual identity, with shareable cards drawn from the same report.",
        media: [{ asset: "buildstory-recap", alt: "BuildStory's orange Toolkit recap slide showing 8248 exec calls from a published example build", caption: "A live recap slide from the published Vibe-social story." }],
      },
      {
        eyebrow: "The receipt",
        title: "Keep the story grounded.",
        body: "The build receipt brings sessions, commits, model mix, and estimated API-equivalent cost into one compact artifact. Estimates are labelled as estimates; the receipt describes a build window rather than ranking the builder’s productivity.",
        media: [{ asset: "buildstory-receipt", alt: "BuildStory exported receipt for Vibe-social with a model mix and build statistics", caption: "An exported share card from an earlier Vibe-social chapter. Cost is an estimate, not a bill.", portrait: true }],
      },
      {
        eyebrow: "The public story",
        title: "More than a finished repository.",
        body: "Published chapters preserve how a project changes. The story sits beside its receipt, while discoveries and decisions carry evidence references. Creators review the public fields before publishing.",
        media: [{ asset: "buildstory-story", alt: "The published Vibe-social build story beside its AI build receipt", caption: "The published example story, captured from buildstory.dev." }],
      },
    ],
    problem: [
      { title: "The work is scattered.", body: "Git aggregates and provider-specific session formats describe different parts of the same build. Bringing them together requires a common record without collecting the repository’s source-file bodies." },
      { title: "Sharing needs a boundary.", body: "A useful private report contains more than a public story should. Local inspection, optional remote generation, and publication are separate choices in the product." },
    ],
    scope: ["Created the TypeScript CLI and terminal report experience, including provider adapters, bounded streaming, and canonical report validation.", "Designed the hosted story presentation: recap, receipt, project chapters, and the relationship between private reports and published stories.", "Defined the collection and upload boundaries, with documentation that distinguishes local, bring-your-own-key, hosted, and metrics-only modes."],
    process: {
      title: "Make the report inspectable first.",
      body: "The local engine produces a useful artifact before the website adds presentation. That separation also gives the scanner a public contract people can read and test.",
      decisions: [
        { title: "Normalize at the adapter.", body: "Claude Code, Codex, Cursor, and Antigravity have different record shapes. Provider adapters turn supported histories into one reporting model.", consequence: "Common reporting, with provider-specific limitations still visible." },
        { title: "Build an allowed snapshot.", body: "The report is assembled from approved fields. Raw transcript and tool-payload fields are discarded locally rather than copied wholesale into a report.", consequence: "A smaller, explicit data contract to validate and inspect." },
        { title: "Connect separately from uploading.", body: "A dashboard connection grants a short-lived upload capability. Scanning and uploading still require their own consent, followed by one validated snapshot.", consequence: "An optional hosted path with a clear handoff." },
        { title: "Let the presentation keep its evidence.", body: "Receipts, turning points, and public chapters offer different ways into the same build. The source reference remains part of the story.", consequence: "A memorable first impression with detail available behind it." },
      ],
      media: { asset: "buildstory-turning-points", alt: "BuildStory turning-point cards with discoveries, decisions, and evidence references beside a receipt", caption: "Turning points in an earlier published example: discovery, decision, and delivery with cited evidence." },
    },
    system: {
      title: "Local evidence. An optional public story.",
      groups: [
        { label: "On the computer", title: "Collect narrowly", body: "Repository-scoped Git aggregates and supported session records enter the local scanner.", tools: ["CLI / TUI", "Streaming adapters", "Git counts"] },
        { label: "The report contract", title: "Reduce and validate", body: "Normalize records, compute signals, apply privacy filtering, and build a canonical snapshot.", tools: ["Redaction", "Schema validation", "JSON · Markdown · HTML"] },
        { label: "Optional hosting", title: "Review, then publish", body: "A sanitized report opens privately in Studio. Selected fields become public chapters.", tools: ["Private report", "Receipt + recap", "Publication review"] },
      ],
      stages: [
        { title: "Read supported records", body: "Stream JSONL in bounded chunks; do not open source-file bodies." },
        { title: "Normalize and compute", body: "Build provider-scoped metrics, deterministic signals, and opaque evidence references." },
        { title: "Apply the privacy contract", body: "Drop raw payloads, filter recognized sensitive patterns, and validate the allowed snapshot." },
        { title: "Choose the narrative path", body: "Local Ollama, a reviewed BYOK or hosted path, or metrics-only mode." },
        { title: "Keep or share the artifact", body: "Save the local report, or explicitly upload it and review the publication fields." },
      ],
      boundary: "The open-source scanner and report engine are separate from the hosted website. Pattern redaction has limits; remote narrative modes require reviewing what will leave the machine.",
      media: { asset: "buildstory-redaction", alt: "BuildStory report showing locally withheld tokens, provenance, and privacy filtering details", caption: "The report exposes redaction and provenance as reviewable product information." },
    },
    resultNote: "The scanner is open source; the hosted portal adds the richer presentation and publication workflow. Screens here show example build windows, not current usage or adoption totals.",
    sources: [{ label: "Scanner + privacy docs", href: "https://github.com/Arjun-Mishra-312/buildstory-scan" }, { label: "Published example", href: "https://buildstory.dev/u/arjun-mishra/vibe-social" }],
  },
  mune: {
    premise: {
      title: "From transactions to everyday decisions.",
      body: "Mune puts an everyday finance dashboard and an assistant in the same native app. The assistant runs Qwen3.5 4B on the iPhone with Apple’s MLX, and it doesn’t just answer: it acts through 22 finance tools.",
    },
    features: [
      {
        eyebrow: "It doesn’t just answer. It acts.",
        title: "Can I afford it? Ask.",
        body: "The assistant checks what you can afford, builds budgets, and sets goals from one conversation. Every number in the answer comes from a finance tool’s result, not from the model’s own arithmetic.",
        media: [
          { asset: "mune-ask", video: "/case-studies/mune-ask.mp4", alt: "Screen recording of Mune: the question “Can I afford a $1000 trip next month?” is answered with liquid cash, Safe-to-Spend, and a “Looks affordable” card", caption: "A real affordability check, recorded on an iPhone. The model’s reasoning is trimmed for length.", portrait: true },
          { asset: "mune-budgets", alt: "Mune's assistant answering with budget progress for overall, food, and shopping spending", caption: "Budgets, from the same conversation. Real app capture.", portrait: true },
        ],
      },
      {
        eyebrow: "Look a little further",
        title: "See patterns. Plan what’s next.",
        body: "Insights bring the year into view: net totals, income against spending, and where the money went. Ask about any of it, like last month’s DoorDash orders, and the answer lists the actual transactions.",
        media: [
          { asset: "mune-insights", alt: "Mune Insights showing net for 2026, monthly spending bars, and a ring of total spending by category", caption: "Insights. Real app capture.", portrait: true },
          { asset: "mune-doordash", alt: "Mune's assistant listing last month's two DoorDash transactions with a total and a trend chart", caption: "“Show me my last month DoorDash transactions.” Real app capture.", portrait: true },
        ],
      },
    ],
    problem: [
      { title: "A balance is only part of the answer.", body: "Everyday decisions depend on upcoming commitments, spending patterns, budgets, and goals. The app needs to make that context accessible without turning every interaction into an analysis task." },
      { title: "Privacy is an engineering constraint.", body: "On-device inference must fit real device resources. Bank connectivity also needs a clear separation between a connection service and the financial records used by the local assistant." },
    ],
    scope: ["Co-founded Mune and contributed native Swift engineering across everyday finance, account connectivity, and production app flows.", "Integrated local model runtimes and device-aware selection with finance tools that ground the assistant’s answers.", "Worked on Plaid and backend integration, account lifecycle, and RevenueCat subscriptions for the shipped app."],
    process: {
      title: "Start with the decision the user needs.",
      body: "The dashboard, local tool loop, and connection boundary solve different parts of the experience. Each has to work before the assistant can be useful.",
      decisions: [
        { title: "Make the daily view useful on its own.", body: "Safe-to-Spend, budgets, goals, and subscriptions provide a concrete finance experience before someone opens a conversation.", consequence: "A quick answer when a chat is unnecessary." },
        { title: "Ground answers in finance tools.", body: "The local assistant gathers structured finance results before writing its response. Bounded tool rounds and deterministic fallbacks handle incomplete model outputs.", consequence: "Numbers come from tool results rather than free-form invention." },
        { title: "Fit inference to the device.", body: "Release builds run Qwen3.5 4B with 4-bit weights on MLX Swift. A second runtime on LiteRT-LM supports Gemma models, with memory-aware model choice and managed downloads.", consequence: "A 4-billion-parameter model that fits a phone’s memory and storage." },
        { title: "Make the connection boundary explicit.", body: "The Node.js service supports authenticated Plaid connectivity. The code also provides a stateless development path with access tokens in Keychain; finance records power the local assistant.", consequence: "On-device AI and bank connectivity have different data flows." },
      ],
    },
    system: {
      title: "An assistant that works where the data lives.",
      groups: [
        { label: "Native experience", title: "Your daily finances", body: "Swift screens bring transactions, budgets, goals, and subscriptions into the local product.", tools: ["Swift", "Core Data", "Finance tools"] },
        { label: "On-device intelligence", title: "Tools before answers", body: "The model requests finance tools, then responds from their verified results.", tools: ["Qwen3.5 4B · MLX", "22 finance tools", "LiteRT-LM"] },
        { label: "Connected services", title: "The bank bridge", body: "A Node.js service supports Plaid connectivity and account lifecycle. RevenueCat supports subscriptions.", tools: ["Plaid", "Node.js / Vercel", "RevenueCat"] },
      ],
      stages: [
        { title: "Connect the account", body: "The authenticated Plaid backend handles connection and transaction-refresh operations." },
        { title: "Build the local finance view", body: "Core Data records power the dashboard and the finance tools." },
        { title: "Choose an appropriate model", body: "Device-aware selection and local downloads prepare the inference runtime." },
        { title: "Gather structured context", body: "The assistant runs a bounded finance-tool loop before composing an answer." },
        { title: "Return a grounded response", body: "Use the tool results, with fallback handling when the model cannot complete the turn." },
      ],
      boundary: "The AI conversation runs on the device. Bank connectivity still uses Plaid and the proxy; on-device AI does not mean every app service is offline.",
    },
    resultNote: "Shipped on the App Store with on-device inference and production bank connectivity. Screens are real app captures with a clean 9:41 status bar; the recording is trimmed for length.",
    sources: [{ label: "Mune website", href: "https://askmune.app" }, { label: "App Store", href: "https://apps.apple.com/app/mune-private-finance-ai/id6777609206" }],
  },
  "ai-accessibility-analyzer": {
    premise: {
      title: "An assessment is only useful if you can inspect it.",
      body: "The research translates a WCAG requirement into a repeatable inspection task. A worker can query the page, operate controls, and collect observations before returning a criterion-level assessment for human review.",
    },
    features: [
      {
        eyebrow: "A worked example",
        title: "The first check isn’t the whole audit.",
        body: "In the public OpenStax trace, a selected-rule audit returned zero violations. The worker continued with image queries, DOM extraction, and a screenshot, then recorded a positive assessment for Non-text Content.",
        media: [{ asset: "research-trace", alt: "Original OpenStax worked-trace figure: initial check, gather context, inspect appearance, and return assessment", caption: "Original preprint figure. The positive assessment agrees at criterion level; individual image correctness still needs human validation." }],
      },
    ],
    problem: [
      { title: "Different requirements need different evidence.", body: "A text alternative, a keyboard interaction, and a visual presentation issue do not share one inspection strategy. Criterion-specific instructions connect the requirement to the observations needed to assess it." },
      { title: "Detection and certainty are different.", body: "Finding more barriers is valuable, but an automated finding still needs enough recorded context for an auditor to review the interpretation." },
    ],
    scope: ["First author and research engineer on the public preprint, submitted to ACM CHI 2027.", "Implemented the criterion-specific workers and shared browser tooling, with recorded operations and structured assessments.", "Evaluated page–criterion records against reference assessments and reported comparisons, execution behavior, and limitations."],
    process: {
      title: "Turn a requirement into an inspection strategy.",
      body: "The authoring loop connects normative requirements to evidence operations, then checks what the worker actually does. Prompt and tool guidance can be revised from recorded runs.",
      decisions: [
        { title: "Scope one worker to one criterion.", body: "Tailored instructions describe the evidence, context, and exceptions for the assigned requirement.", consequence: "A smaller assessment task with an explicit output contract." },
        { title: "Share the browser operations.", body: "The 31-tool library includes DOM and accessibility-tree queries, screenshots, keyboard interaction, computed styles, contrast, and axe checks.", consequence: "Workers can inspect both semantics and visible behavior." },
        { title: "Preserve the execution record.", body: "Tool observations and the final assessment remain inspectable. An unfinished run is distinguished from a completed negative finding.", consequence: "The result can be reviewed alongside the path that produced it." },
        { title: "Evaluate the tradeoff.", body: "Compare criterion-level assessments with the reference labels, including false positives and the criteria represented in the dataset.", consequence: "Report recall alongside precision and coverage limits." },
      ],
    },
    system: {
      title: "Requirement → evidence → assessment.",
      groups: [
        { label: "Configure", title: "The criterion skill", body: "A saved page and WCAG requirement select the worker’s instructions and response contract.", tools: ["WCAG", "Criterion skill", "Saved snapshot"] },
        { label: "Inspect", title: "The evidence loop", body: "Interpret an observation, choose an action, and run a shared browser operation.", tools: ["Chromium", "31 tools", "DOM + visual evidence"] },
        { label: "Review", title: "A recorded assessment", body: "Return the result, impact label, and cited observations; retain the execution logs.", tools: ["Structured finding", "Audit report", "Human review"] },
      ],
      stages: [
        { title: "Select the requirement", body: "Assign a criterion and saved target page to a worker." },
        { title: "Load the inspection guidance", body: "Use the criterion skill, shared response contract, and first-tool guidance." },
        { title: "Act and observe", body: "Query, operate, or capture the page; interpret the returned evidence and repeat as needed." },
        { title: "Record the assessment", body: "Return a criterion-level result, impact label, and cited observations." },
        { title: "Support the auditor", body: "Aggregate findings while retaining the operations for inspection and review." },
      ],
      boundary: "40 requirements were implemented. Positive benchmark cases covered 15 of them; the remaining 25 do not have a recall estimate from this dataset. Tool guidance is not a strict capability sandbox.",
      media: { asset: "research-architecture", alt: "Original framework diagram connecting a saved Chromium page and WCAG criterion to configuration, browser tools, the assess-execute loop, and an audit report", caption: "The framework architecture from the public v2 preprint." },
    },
    resultNote: "67 of 78 positive cases recovered: 86% recall at 56% precision across 250 page–criterion records on 11 scholarly platforms. These are dataset-level findings, not a conformance guarantee. Submission to CHI 2027 is pending.",
    resultMedia: { asset: "research-recall", alt: "Recall comparison: axe-core 35.9%, uncued batch VLM 66.7%, cued batch VLM 74.4%, criterion workers 85.9%, with counts out of 78 positive cases", caption: "Original recall comparison from the preprint; the headline values are rounded to 36%, 67%, 74%, and 86%." },
    sources: [{ label: "Public preprint + artifacts", href: "https://arxiv.org/abs/2609.09379v2" }],
  },
  "llm-pro-max": {
    premise: { title: "Find the relevant context before asking the model.", body: "LLM Pro Max combines repository retrieval with a dependency view. A developer can inspect relationships and ask a focused question without trying to fit an entire codebase into one conversation." },
    features: [
      {
        eyebrow: "Explore the structure", title: "See how the pieces connect.",
        body: "The graph distinguishes files, functions, classes, and modules, with import and call relationships. A selected node exposes code context beside the visual structure.",
        media: [{ asset: "llm-graph", alt: "LLM Pro Max dependency graph with colored node types and a selected order-model code excerpt", caption: "Original interactive graph capture from the Hack the North submission." }],
      },
      {
        eyebrow: "Ask about the repository", title: "Bring the code into the conversation.",
        body: "The conversational interface pairs repository context with the graph. Retrieval selects relevant chunks before the Cohere-powered response is generated.",
        media: [{ asset: "llm-chat", alt: "LLM Pro Max chat answering a repository question beneath an embedded dependency graph", caption: "Original repository Q&A interface from the project’s Devpost gallery." }],
      },
    ],
    problem: [
      { title: "Context is expensive to assemble.", body: "An unfamiliar repository has structure as well as text. The retrieval pipeline selects relevant code while the graph gives the developer a way to orient themselves." },
      { title: "A demo needs connected parts.", body: "The hackathon challenge included integrating the retrieval, graph, and conversation surfaces into one usable loop." },
    ],
    scope: ["Contributed the RAG pipeline and system architecture as part of the Hack the North team.", "Worked with repository chunking, embeddings, query expansion, and re-ranking to support contextual answers.", "Helped connect retrieval with the demo’s repository and dependency-exploration experience."],
    process: {
      title: "Retrieve, relate, then respond.", body: "The team’s implementation brought vector retrieval and graph exploration together under hackathon constraints.",
      decisions: [
        { title: "Chunk the repository.", body: "Store code embeddings in Chroma instead of passing the entire repository into the model.", consequence: "A focused context for each question." },
        { title: "Add relationships.", body: "Python graph tooling exposes imports and function calls alongside the textual context.", consequence: "A visible way to investigate the surrounding code." },
        { title: "Improve selection before generation.", body: "Query expansion and re-ranking refine the retrieval step before the chatbot responds.", consequence: "Answer quality depends on which evidence reaches the model." },
      ],
      media: { asset: "llm-dependencies", alt: "LLM Pro Max graph highlighting authentication dependencies while other nodes are muted", caption: "The original dependency view, highlighting a related group of nodes." },
    },
    system: {
      title: "Two views of the same codebase.",
      groups: [
        { label: "Index", title: "Code and relationships", body: "Chunked embeddings capture textual context; graph analysis captures dependencies.", tools: ["Chroma", "NetworkX", "Python"] },
        { label: "Retrieve", title: "Select the context", body: "Query expansion and re-ranking focus the model on relevant repository chunks.", tools: ["RAG", "Cohere", "FastAPI"] },
        { label: "Explore", title: "Conversation + graph", body: "React presents chat and a Pyvis graph, with authentication and stored chat history.", tools: ["React", "Pyvis", "Auth0 / Convex"] },
      ],
      stages: [
        { title: "Ingest a repository", body: "Prepare code chunks and dependency relationships." },
        { title: "Build the vector index", body: "Store embeddings for repository retrieval." },
        { title: "Refine the query context", body: "Expand the question, retrieve candidates, and re-rank the relevant code." },
        { title: "Generate the response", body: "Give the model the selected repository context." },
        { title: "Inspect the structure", body: "Use the companion graph to explore imports, calls, and related nodes." },
      ],
      boundary: "A Hack the North 2024 team prototype. The reported 86% query relevancy is a project result, not a general benchmark for arbitrary repositories.",
    },
    resultNote: "Won the Codegen prize at Hack the North 2024. The preserved screenshots show the original prototype and its graph-assisted repository Q&A.",
    sources: [{ label: "Hackathon submission", href: "https://devpost.com/software/llm-pro-max" }, { label: "Project repository", href: "https://github.com/gigabite-pro/LLM-pro-max" }],
  },
  "re-plate": {
    premise: { title: "Give surplus food a clearer path to a shelter.", body: "Re-Plate connects a donation workflow with image-assisted classification and a shelter request interface. The prototype makes the item, its condition, and the receiving side visible in one product story." },
    features: [
      {
        eyebrow: "The donation", title: "Start with an item. Add useful context.",
        body: "The image analyzer brings the item, classification, packaging, and date fields into the donation flow. The prototype’s AI output needs review; it does not certify food safety.",
        media: [{ asset: "replate-analyzer", alt: "Re-Plate prototype showing a ketchup image, AI classification, best-before date fields, and an add-to-inventory action", caption: "The original image-analyzer prototype from the youCode submission." }],
      },
      {
        eyebrow: "The receiving side", title: "A request with a visible status.",
        body: "Shelters have their own dashboard for requests and donor connections. A request captures items and urgency so the receiving workflow has clear, structured context.",
        media: [{ asset: "replate-shelter", alt: "Re-Plate shelter dashboard with active and accepted request tabs, urgency labels, and a donor network", caption: "Original shelter dashboard, with demonstration request data." }],
      },
    ],
    problem: [
      { title: "Logging is only the first step.", body: "A donation needs item details, condition, dates, and a receiving workflow. The prototype brings those steps into a connected interface." },
      { title: "A model output needs context.", body: "Photo quality and varied date labels make classification difficult. Clear input fields and error handling matter alongside the model result." },
    ],
    scope: ["Contributed full-stack engineering and AI integration on the youCode team.", "Connected the donation flow to Gemini vision and the project’s classification services.", "Worked on expiration checks and impact analytics in the prototype."],
    process: {
      title: "Design the handoff, as well as the analyzer.", body: "The product’s donation and shelter interfaces are as central to the story as its AI component.",
      decisions: [
        { title: "Structure the donation context.", body: "Place the image and date information alongside the classification result.", consequence: "A visible item record rather than an isolated prediction." },
        { title: "Make both sides legible.", body: "Donor and shelter flows use clear status and urgency information.", consequence: "The receiving workflow remains part of the product." },
        { title: "Connect the model to the workflow.", body: "FastAPI services support vision and classification, while the frontend handles capture and review.", consequence: "Model outputs have a concrete next step." },
      ],
      media: { asset: "replate-design", alt: "Re-Plate local design-system board with teal colors, typography, button styles, and navigation symbols", caption: "Design-system board from the project’s local reference materials." },
    },
    system: {
      title: "From capture to a coordinated donation.",
      groups: [
        { label: "Capture + review", title: "An item with context", body: "The Next.js interface brings item photos, dates, and donation details together.", tools: ["Next.js", "Tailwind", "Review fields"] },
        { label: "Classify", title: "Assisted analysis", body: "FastAPI connects Gemini vision with the project’s Python classification work.", tools: ["Gemini", "FastAPI", "TensorFlow / PyTorch"] },
        { label: "Coordinate", title: "Requests and impact", body: "Shelter request flows and donor analytics give the prototype its receiving side.", tools: ["Shelter dashboard", "Donor workflow", "ApexCharts"] },
      ],
      stages: [
        { title: "Capture the item", body: "Add its image and donation details." },
        { title: "Run assisted analysis", body: "Extract classification and date-related information." },
        { title: "Review the context", body: "Keep packaging, storage, and date fields visible beside the result." },
        { title: "Enter the donation workflow", body: "Connect item records with donor and shelter interfaces." },
        { title: "Show the outcome", body: "Present request status and donation-impact analytics." },
      ],
      boundary: "A youCode 2025 prototype. The 100% expiration-date accuracy describes the controlled test set. Classification is not a food-safety guarantee; driver routing and chat were future ideas.",
      media: { asset: "replate-request", alt: "Re-Plate shelter request form with urgency, requested items, quantity, and notes", caption: "Structured requests complete the receiving side of the original prototype." },
    },
    resultNote: "First place in the SAP stream at youCode 2025, with expiration-date checks and CO₂ impact tracking demonstrated in the prototype. No real-world deployment scale is claimed.",
    sources: [{ label: "Hackathon submission", href: "https://devpost.com/software/replate-z3b5mg" }, { label: "Project repository", href: "https://github.com/Arjun-Mishra-312/re-plate" }],
  },
};
