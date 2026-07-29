import type { ChatCompletionTool } from "openai/resources/chat/completions";
import { fetchGithubPulse, type GithubPulsePayload } from "@/lib/github-pulse";
import { isAppId, isProjectId, portfolioData } from "./portfolio-data";
import type { DesktopWidgetId, IslandAction, IslandEvidence } from "./types";

export const DESKTOP_WIDGET_IDS: DesktopWidgetId[] = [
  "github-pulse",
  "focus-radio",
  "weather",
  "coffee-chat",
];

export const EXPERIENCE_IDS = portfolioData.experience.map((item) => item.id);

export function isDesktopWidgetId(value: string | null | undefined): value is DesktopWidgetId {
  return Boolean(value && DESKTOP_WIDGET_IDS.includes(value as DesktopWidgetId));
}

export function isExperienceId(value: string | null | undefined): value is string {
  return Boolean(value && EXPERIENCE_IDS.includes(value));
}

export const AI_OS_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "control_os",
      description:
        "Navigate Arjun OS for the visitor. Call when they should see an app, project, experience role, resume, tour, desktop widget, or a slim evidence card. Never invent destinations outside the allowlist.",
      parameters: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: [
              "open-app",
              "open-project",
              "open-experience",
              "open-resume",
              "start-tour",
              "focus-widget",
              "show-evidence",
            ],
          },
          appId: {
            type: "string",
            enum: ["profile", "work", "experience", "research", "life", "lab"],
          },
          projectId: {
            type: "string",
            enum: ["ai-accessibility-analyzer", "llm-pro-max", "re-plate"],
          },
          experienceId: {
            type: "string",
            enum: EXPERIENCE_IDS,
          },
          widgetId: {
            type: "string",
            enum: DESKTOP_WIDGET_IDS,
          },
          evidenceKind: {
            type: "string",
            enum: ["github-pulse"],
          },
          label: {
            type: "string",
            description: "Short button label for the visitor (e.g. Open Life + Play).",
          },
        },
        required: ["action"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_github_pulse",
      description:
        "Fetch live GitHub contribution pulse (totals, streak, latest public activity). Use before answering about recent shipping or GitHub activity.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_portfolio_slice",
      description:
        "Load a verified portfolio data slice for grounded answers. Prefer this over guessing details.",
      parameters: {
        type: "object",
        properties: {
          slice: {
            type: "string",
            enum: ["profile", "projects", "experience", "research", "life"],
          },
        },
        required: ["slice"],
      },
    },
  },
];

export type ControlOsArgs = {
  action?: string;
  appId?: string;
  projectId?: string;
  experienceId?: string;
  widgetId?: string;
  evidenceKind?: string;
  label?: string;
};

export type ToolLoopState = {
  actions: IslandAction[];
  evidence?: IslandEvidence;
  lastPulse?: GithubPulsePayload;
};

function defaultLabel(action: string, args: ControlOsArgs): string {
  if (typeof args.label === "string" && args.label.trim()) return args.label.trim();
  switch (action) {
    case "open-app":
      return args.appId === "life"
        ? "Open Life + Play"
        : args.appId
          ? `Open ${args.appId[0]!.toUpperCase()}${args.appId.slice(1)}`
          : "Open app";
    case "open-project":
      return "Open case study";
    case "open-experience":
      return "Open Experience";
    case "open-resume":
      return "Open Resume";
    case "start-tour":
      return "Start recruiter tour";
    case "focus-widget":
      return args.widgetId === "focus-radio"
        ? "Show Focus Radio"
        : args.widgetId === "github-pulse"
          ? "Show GitHub Pulse"
          : "Show widget";
    case "show-evidence":
      return "View evidence";
    default:
      return "Continue";
  }
}

/** Validate a control_os call into IslandAction / evidence. Unknown values are dropped. */
export function applyControlOsIntent(args: ControlOsArgs, state: ToolLoopState): ToolLoopState {
  const action = args.action;
  if (!action || typeof action !== "string") return state;

  const id = `tool-${state.actions.length + 1}`;
  const label = defaultLabel(action, args);
  const next: ToolLoopState = { ...state, actions: [...state.actions] };

  if (action === "open-app" && typeof args.appId === "string" && isAppId(args.appId)) {
    next.actions.push({ id, label, type: "open-app", appId: args.appId });
    return next;
  }

  if (action === "open-project" && typeof args.projectId === "string" && isProjectId(args.projectId)) {
    next.actions.push({ id, label, type: "open-project", projectId: args.projectId });
    return next;
  }

  if (action === "open-experience" && isExperienceId(args.experienceId)) {
    next.actions.push({ id, label, type: "open-experience", experienceId: args.experienceId });
    return next;
  }

  if (action === "open-resume") {
    next.actions.push({ id, label, type: "open-resume" });
    return next;
  }

  if (action === "start-tour") {
    next.actions.push({ id, label, type: "start-tour" });
    return next;
  }

  if (action === "focus-widget" && isDesktopWidgetId(args.widgetId)) {
    next.actions.push({ id, label, type: "focus-widget", widgetId: args.widgetId });
    return next;
  }

  if (action === "show-evidence" && args.evidenceKind === "github-pulse" && state.lastPulse) {
    next.evidence = pulseToEvidence(state.lastPulse);
    return next;
  }

  return state;
}

export function pulseToEvidence(pulse: GithubPulsePayload): IslandEvidence {
  return {
    kind: "github-pulse",
    title: "GitHub Pulse",
    total: pulse.total,
    streak: pulse.streak,
    latest: pulse.latest,
    status: pulse.status,
  };
}

export function getPortfolioSlice(slice: string) {
  switch (slice) {
    case "profile":
      return portfolioData.profile;
    case "projects":
      return portfolioData.projects.map(({ image, ...project }) => project);
    case "experience":
      return portfolioData.experience.map(({ logo, ...experience }) => experience);
    case "research":
      return portfolioData.research;
    case "life":
      return portfolioData.life;
    default:
      return { error: "Unknown slice" };
  }
}

export async function executeAiTool(
  name: string,
  rawArgs: string,
  state: ToolLoopState,
): Promise<{ result: string; state: ToolLoopState }> {
  let args: Record<string, unknown> = {};
  try {
    args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
  } catch {
    return { result: JSON.stringify({ error: "Invalid JSON arguments" }), state };
  }

  if (name === "get_github_pulse") {
    const pulse = await fetchGithubPulse();
    const next = { ...state, lastPulse: pulse };
    return {
      result: JSON.stringify({
        total: pulse.total,
        streak: pulse.streak,
        latest: pulse.latest,
        status: pulse.status,
        fetchedAt: pulse.fetchedAt,
      }),
      state: next,
    };
  }

  if (name === "get_portfolio_slice") {
    const slice = typeof args.slice === "string" ? args.slice : "";
    return { result: JSON.stringify(getPortfolioSlice(slice)), state };
  }

  if (name === "control_os") {
    const next = applyControlOsIntent(args as ControlOsArgs, state);
    return {
      result: JSON.stringify({
        ok: next.actions.length > state.actions.length || next.evidence !== state.evidence,
        actionsQueued: next.actions.length,
        hasEvidence: Boolean(next.evidence),
      }),
      state: next,
    };
  }

  return { result: JSON.stringify({ error: "Unknown tool" }), state };
}
