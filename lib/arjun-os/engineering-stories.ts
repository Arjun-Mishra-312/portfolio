import type { ProjectId } from "./types";

export type StoryVisual = "convoy" | "pipeline" | "recall" | "session-stream" | "model-fit";

export interface EngineeringStory {
  title: string;
  problem: string;
  constraint: string;
  move: string;
  proof: string;
  visual?: StoryVisual;
}

// Each story leads with the decision, not the stack. Every claim here is confirmed by Arjun or
// traceable to the repository / public paper (see docs/arjun-os/resume-sync.md for sources).
export const engineeringStories: Partial<Record<ProjectId, EngineeringStory[]>> = {
  roadpack: [
    {
      title: "Shipping iOS without a Mac",
      problem: "Every CI run starts on a fresh macOS runner with an empty keychain, so automatic signing asked Apple for a new certificate on every build. Apple caps those per account, and the pipeline broke itself after a handful of archives.",
      constraint: "No Mac to sign on locally, and revoking certificates automatically would silently break signing anywhere else that identity lives.",
      move: "Import one existing signing identity from repository secrets into a temporary keychain that is deleted at the end of every job. The App Store Connect API picks the next build number, and the archive is checked before upload.",
      proof: "Three App Store releases (1.0.0, 1.0.1, 1.1.0) shipped from Windows. Tests run on iOS 18 and 26, on iPhone and iPad, because App Review tests on iPad.",
      visual: "pipeline",
    },
    {
      title: "One source of truth per trip",
      problem: "Several phones vote on stops and change one shared plan at the same moment, and cars drop signal on mountain roads.",
      constraint: "Every phone has to agree, and a command replayed after reconnecting must never double-vote or add a stop twice.",
      move: "Each trip is one SQLite-backed Durable Object that owns the state. Phones send idempotent commands, queue them offline, and receive snapshots over WebSockets.",
      proof: "Pack spread and regroup points are measured along the route polyline, so views render server state instead of re-deriving it.",
      visual: "convoy",
    },
  ],
  "ai-accessibility-analyzer": [
    {
      title: "The checker said zero",
      problem: "In the paper's OpenStax trace, the first rule-based audit returned zero violations, yet the page still had a Non-text Content problem.",
      constraint: "Each WCAG criterion needs different evidence, and one generic prompt cannot inspect all of them.",
      move: "Built 40 criterion-specific agents on a shared 31-tool browser library that query, operate and screenshot the page before they assess it.",
      proof: "86% recall against 36% for axe-core, at 56% precision. Agents recovered 9 of the 10 keyboard traps that both baselines missed.",
      visual: "recall",
    },
  ],
  buildstory: [
    {
      title: "Tell the story, never read the code",
      problem: "AI coding-session logs are large JSONL files that sit right next to private source code.",
      constraint: "Bounded memory, four providers with different formats, and no source-file bodies ever read.",
      move: "Stream sessions in 64 KB chunks through provider adapters into an allowlisted snapshot, with redaction before anything leaves the machine.",
      proof: "An open-source scanner anyone can audit, covered by 330+ automated tests.",
      visual: "session-stream",
    },
    {
      title: "A cache rate that was wrong",
      problem: "The receipt's cache-hit rate looked wrong for Claude sessions.",
      constraint: "Each provider counts cached, uncached and cache-read tokens differently.",
      move: "Traced it to cached tokens being divided by uncached input, with Claude's cache-read bucket skipped. Fixed the normalization and added a regression test.",
      proof: "Receipt numbers are now consistent across providers.",
    },
  ],
  mune: [
    {
      title: "Small models describe instead of acting",
      problem: "On-device models small enough for a phone often describe a tool call in prose instead of making it, then invent the numbers.",
      constraint: "Financial answers must be correct, and the model has to run on the phone itself: Qwen3.5 4B with 4-bit weights on Apple’s MLX.",
      move: "Hardened tool calling with a corrective retry when a model narrates instead of calling a tool, so answers come from one of 22 finance tools. I also built a second runtime for Gemma models on LiteRT-LM.",
      proof: "Live on the App Store: it checks what you can afford, builds budgets, and sets goals from one conversation.",
      visual: "model-fit",
    },
  ],
  "re-plate": [
    {
      title: "Two models, one answer",
      problem: "Donors photograph food packaging, and shelters need to know what it is and when it expires.",
      constraint: "A hackathon weekend, image classifiers that can't read printed text, and a vision model that is weak at classifying food.",
      move: "Built the FastAPI backend with one endpoint that joins Gemini Vision text extraction (packaging and expiry dates) with the team's image classifiers, then connected it to the frontend.",
      proof: "1st place in the SAP Stream at youCode 2025, with 100% expiration-date accuracy on our test set.",
    },
  ],
};
