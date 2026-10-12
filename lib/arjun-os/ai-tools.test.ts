import { describe, expect, it } from "vitest";
import {
  applyControlOsIntent,
  executeAiTool,
  getPortfolioSlice,
  isDesktopWidgetId,
  pulseToEvidence,
  type ToolLoopState,
} from "./ai-tools";
import {
  inferActionsFromAnswer,
  isIslandEvidence,
  mapChatActionsToIsland,
  pickPrimaryAutoRunAction,
} from "./action-mapper";

describe("ai-tools allowlist", () => {
  it.each(["buildstory", "mune"])("loads and opens the new %s case study through the AI tools", async (projectId) => {
    const slice = await executeAiTool("get_portfolio_slice", '{"slice":"projects"}', { actions: [] });
    expect(JSON.parse(slice.result).some((project: { id: string }) => project.id === projectId)).toBe(true);
    const navigation = await executeAiTool("control_os", JSON.stringify({ action: "open-project", projectId }), slice.state);
    expect(navigation.state.actions).toEqual([expect.objectContaining({ type: "open-project", projectId })]);
    expect(pickPrimaryAutoRunAction(inferActionsFromAnswer(`Explore ${projectId}.`))).toMatchObject({ type: "open-project", projectId });
  });

  it("provides education and submission status to the guide", async () => {
    const profile = await executeAiTool("get_portfolio_slice", '{"slice":"profile"}', { actions: [] });
    expect(JSON.parse(profile.result).education).toMatchObject({ graduation: "Expected May 2027", minor: "Commerce Minor" });
    const research = await executeAiTool("get_portfolio_slice", '{"slice":"research"}', { actions: [] });
    expect(JSON.parse(research.result).submissions).toEqual([
      expect.objectContaining({ authorship: "First author", status: "Submitted to ACM CHI 2027" }),
      expect.objectContaining({ title: "WRAP", authorship: "Second author", status: "Submitted to ACM CHI 2027" }),
    ]);
  });

  it("accepts only known desktop widget ids", () => {
    expect(isDesktopWidgetId("focus-radio")).toBe(true);
    expect(isDesktopWidgetId("github-pulse")).toBe(true);
    expect(isDesktopWidgetId("shell")).toBe(false);
  });

  it("maps control_os intents into IslandActions and drops unknowns", () => {
    let state: ToolLoopState = { actions: [] };
    state = applyControlOsIntent({ action: "open-app", appId: "life", label: "Open Life + Play" }, state);
    state = applyControlOsIntent({ action: "open-project", projectId: "llm-pro-max" }, state);
    state = applyControlOsIntent({ action: "open-experience", experienceId: "copperleaf" }, state);
    state = applyControlOsIntent({ action: "focus-widget", widgetId: "focus-radio" }, state);
    state = applyControlOsIntent({ action: "exec-shell", label: "Nope" } as never, state);
    state = applyControlOsIntent({ action: "open-app", appId: "admin" }, state);

    expect(state.actions).toHaveLength(4);
    expect(state.actions[0]).toMatchObject({ type: "open-app", appId: "life" });
    expect(state.actions[1]).toMatchObject({ type: "open-project", projectId: "llm-pro-max" });
    expect(state.actions[2]).toMatchObject({ type: "open-experience", experienceId: "copperleaf" });
    expect(state.actions[3]).toMatchObject({ type: "focus-widget", widgetId: "focus-radio" });
  });

  it("attaches github evidence only when pulse was fetched", async () => {
    let state: ToolLoopState = { actions: [] };
    state = applyControlOsIntent({ action: "show-evidence", evidenceKind: "github-pulse" }, state);
    expect(state.evidence).toBeUndefined();

    const pulse = {
      days: [],
      total: 12,
      streak: 2,
      latest: null,
      status: "fallback" as const,
      fetchedAt: new Date().toISOString(),
    };
    state = { ...state, lastPulse: pulse };
    state = applyControlOsIntent({ action: "show-evidence", evidenceKind: "github-pulse" }, state);
    expect(state.evidence).toEqual(pulseToEvidence(pulse));
    expect(isIslandEvidence(state.evidence)).toBe(true);
  });

  it("returns portfolio slices without inventing keys", () => {
    const life = getPortfolioSlice("life") as { interests: string[] };
    expect(life.interests.length).toBeGreaterThan(0);
    expect(getPortfolioSlice("secret")).toEqual({ error: "Unknown slice" });
  });

  it("rejects unknown tools", async () => {
    const result = await executeAiTool("rm_rf", "{}", { actions: [] });
    expect(JSON.parse(result.result)).toMatchObject({ error: "Unknown tool" });
  });
});

describe("action mapper extensions", () => {
  it("maps focus-widget and open-experience", () => {
    const mapped = mapChatActionsToIsland([
      { id: "1", label: "Show Focus Radio", type: "focus-widget", widgetId: "focus-radio" },
      { id: "2", label: "Open Copperleaf", type: "open-experience", experienceId: "copperleaf" },
      { id: "3", label: "Bad widget", type: "focus-widget", widgetId: "terminal" },
    ]);
    expect(mapped).toHaveLength(2);
    expect(mapped[0]).toMatchObject({ type: "focus-widget", widgetId: "focus-radio" });
    expect(mapped[1]).toMatchObject({ type: "open-experience", experienceId: "copperleaf" });
  });

  it("picks a single primary auto-run action", () => {
    const actions = mapChatActionsToIsland([
      { id: "1", label: "Open Life + Play", type: "open-app", appId: "life" },
      { id: "2", label: "Open Resume", type: "open-resume" },
      { id: "3", label: "Start tour", type: "start-tour" },
    ]);
    expect(pickPrimaryAutoRunAction(actions)).toMatchObject({ type: "open-app", appId: "life" });
  });

  it("infers life app from fun-oriented answers", () => {
    const actions = inferActionsFromAnswer("For fun I build LEGO Technic sets and hike around Vancouver.");
    expect(actions.some((action) => action.type === "open-app" && action.appId === "life")).toBe(true);
  });
});
