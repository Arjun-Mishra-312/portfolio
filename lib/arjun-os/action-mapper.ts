import type { AppId, IslandAction, ProjectId } from "./types";
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

    if (type === "open-resume" || type === "resume") {
      actions.push({ id, label, type: "open-resume" });
      return;
    }

    if (type === "start-tour" || type === "tour") {
      actions.push({ id, label, type: "start-tour" });
    }
  });

  return actions;
}

export function inferActionsFromAnswer(answer: string): IslandAction[] {
  const lower = answer.toLowerCase();
  const actions: IslandAction[] = [];

  if (lower.includes("accessibility")) {
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
  } else {
    actions.push({ id: "open-work", label: "Open Work", type: "open-app", appId: "work" satisfies AppId });
  }

  actions.push({ id: "open-resume", label: "Open Resume", type: "open-resume" });
  actions.push({ id: "start-tour", label: "Start recruiter tour", type: "start-tour" });
  return actions;
}
