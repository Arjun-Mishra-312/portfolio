import type { AppId, DesktopWidgetId, IslandAction, IslandEvidence, ProjectId } from "./types";
import { isDesktopWidgetId, isExperienceId } from "./ai-tools";
import { isAppId, isProjectId } from "./portfolio-data";

/** Map only known chat/widget suggestions into IslandAction. Unknown values stay as text. */
export function mapChatActionsToIsland(raw: unknown): IslandAction[] {
  if (!Array.isArray(raw)) return [];

  const actions: IslandAction[] = [];

  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const entry = item as Record<string, unknown>;
    const label = typeof entry.label === "string" ? entry.label : typeof entry.title === "string" ? entry.title : null;
    const type = typeof entry.type === "string" ? entry.type : typeof entry.action === "string" ? entry.action : null;
    if (!label || !type) return;

    const id = typeof entry.id === "string" ? entry.id : `action-${index}`;

    if (type === "open-app" || type === "open_app" || type === "app") {
      const appId = entry.appId ?? entry.app;
      if (typeof appId === "string" && isAppId(appId)) {
        actions.push({ id, label, type: "open-app", appId });
      }
      return;
    }

    if (type === "open-project" || type === "open_project" || type === "project") {
      const projectId = entry.projectId ?? entry.project;
      if (typeof projectId === "string" && isProjectId(projectId)) {
        actions.push({ id, label, type: "open-project", projectId });
      }
      return;
    }

    if (type === "open-experience" || type === "open_experience" || type === "experience") {
      const experienceId = entry.experienceId ?? entry.role ?? entry.experience;
      if (typeof experienceId === "string" && isExperienceId(experienceId)) {
        actions.push({ id, label, type: "open-experience", experienceId });
      }
      return;
    }

    if (type === "open-resume" || type === "resume") {
      actions.push({ id, label, type: "open-resume" });
      return;
    }

    if (type === "start-tour" || type === "tour") {
      actions.push({ id, label, type: "start-tour" });
      return;
    }

    if (type === "focus-widget" || type === "focus_widget" || type === "widget") {
      const widgetId = entry.widgetId ?? entry.widget;
      if (typeof widgetId === "string" && isDesktopWidgetId(widgetId)) {
        actions.push({ id, label, type: "focus-widget", widgetId });
      }
    }
  });

  return actions;
}

const AUTO_RUN_TYPES = new Set<IslandAction["type"]>([
  "open-app",
  "open-project",
  "open-experience",
  "focus-widget",
  "start-tour",
]);

/** At most one primary navigation/focus intent auto-runs per turn. */
export function pickPrimaryAutoRunAction(actions: IslandAction[]): IslandAction | null {
  return actions.find((action) => AUTO_RUN_TYPES.has(action.type)) ?? null;
}

export function inferActionsFromAnswer(answer: string): IslandAction[] {
  const lower = answer.toLowerCase();
  const actions: IslandAction[] = [];

  if (/\broadpack\b/.test(lower)) {
    actions.push({ id: "open-roadpack", label: "Explore Roadpack", type: "open-project", projectId: "roadpack" });
  } else if (/\bbuildstory\b/.test(lower)) {
    actions.push({ id: "open-buildstory", label: "Explore BuildStory", type: "open-project", projectId: "buildstory" });
  } else if (/\bmune\b/.test(lower)) {
    actions.push({ id: "open-mune", label: "Explore Mune", type: "open-project", projectId: "mune" });
  } else if (/\b(preprint|arxiv|paper|publication|wrap)\b/.test(lower)) {
    actions.push({ id: "open-paper", label: "Explore the research", type: "open-app", appId: "research" });
  } else if (
    lower.includes("life + play") ||
    lower.includes("for fun") ||
    lower.includes("lego") ||
    lower.includes("hiking") ||
    lower.includes("photography") ||
    (lower.includes("vancouver") && lower.includes("hobby"))
  ) {
    actions.push({
      id: "open-life",
      label: "Open Life + Play",
      type: "open-app",
      appId: "life" satisfies AppId,
    });
  } else if (lower.includes("accessibility")) {
    actions.push({
      id: "open-a11y",
      label: "Open case study",
      type: "open-project",
      projectId: "ai-accessibility-analyzer" satisfies ProjectId,
    });
  } else if (lower.includes("llm pro") || lower.includes("hack the north")) {
    actions.push({
      id: "open-llm",
      label: "Open LLM Pro Max",
      type: "open-project",
      projectId: "llm-pro-max",
    });
  } else if (lower.includes("re-plate") || lower.includes("replate")) {
    actions.push({
      id: "open-replate",
      label: "Open Re-Plate",
      type: "open-project",
      projectId: "re-plate",
    });
  } else if (lower.includes("focus radio") || lower.includes("spotify") || lower.includes("music")) {
    actions.push({
      id: "focus-radio",
      label: "Show Focus Radio",
      type: "focus-widget",
      widgetId: "focus-radio" satisfies DesktopWidgetId,
    });
  } else if (lower.includes("github") || lower.includes("shipping") || lower.includes("contribution")) {
    actions.push({
      id: "focus-github",
      label: "Show GitHub Pulse",
      type: "focus-widget",
      widgetId: "github-pulse",
    });
  } else {
    actions.push({ id: "open-work", label: "Open Work", type: "open-app", appId: "work" satisfies AppId });
  }

  actions.push({ id: "open-resume", label: "Open Resume", type: "open-resume" });
  actions.push({ id: "start-tour", label: "Start recruiter tour", type: "start-tour" });
  return actions;
}

export function isIslandEvidence(value: unknown): value is IslandEvidence {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    entry.kind === "github-pulse" &&
    typeof entry.title === "string" &&
    typeof entry.total === "number" &&
    typeof entry.streak === "number" &&
    (entry.status === "ready" || entry.status === "fallback")
  );
}
