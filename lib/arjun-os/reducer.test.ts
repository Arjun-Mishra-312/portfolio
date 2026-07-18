import { describe, expect, it } from "vitest";
import { createInitialState, defaultWorkArea } from "./constants";
import { osReducer } from "./reducer";
import { mapChatActionsToIsland, inferActionsFromAnswer } from "./action-mapper";
import { TOUR_STEP_COUNT } from "./tour";

describe("osReducer window lifecycle", () => {
  it("opens, focuses, minimizes, restores, and closes apps without duplicates", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    expect(state.windows.profile.isOpen).toBe(true);

    state = osReducer(state, { type: "OPEN_APP", appId: "work" });
    expect(state.windows.work.isOpen).toBe(true);
    expect(state.activeAppId).toBe("work");

    const zBefore = state.windows.work.zIndex;
    state = osReducer(state, { type: "OPEN_APP", appId: "work" });
    expect(state.windows.work.zIndex).toBeGreaterThan(zBefore);

    state = osReducer(state, { type: "MINIMIZE_APP", appId: "work" });
    expect(state.windows.work.mode).toBe("minimized");

    state = osReducer(state, { type: "RESTORE_APP", appId: "work" });
    expect(state.windows.work.mode).toBe("normal");
    expect(state.activeAppId).toBe("work");

    state = osReducer(state, { type: "CLOSE_APP", appId: "work" });
    expect(state.windows.work.isOpen).toBe(false);
  });

  it("maximizes and restores previous bounds", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    const before = { ...state.windows.profile.bounds };
    state = osReducer(state, { type: "MAXIMIZE_APP", appId: "profile" });
    expect(state.windows.profile.mode).toBe("maximized");
    state = osReducer(state, { type: "MAXIMIZE_APP", appId: "profile" });
    expect(state.windows.profile.mode).toBe("normal");
    expect(state.windows.profile.bounds).toEqual(before);
  });

  it("snaps left and right", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = osReducer(state, { type: "SNAP_APP", appId: "profile", side: "left" });
    expect(state.windows.profile.mode).toBe("snapped-left");
    state = osReducer(state, { type: "SNAP_APP", appId: "profile", side: "right" });
    expect(state.windows.profile.mode).toBe("snapped-right");
  });
});

describe("recruiter tour", () => {
  it("starts, advances, and restores the pre-tour workspace on exit", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = osReducer(state, { type: "OPEN_APP", appId: "research" });
    state = osReducer(state, { type: "SET_ACTIVE_PROJECT", projectId: "llm-pro-max" });
    const activeBeforeTour = state.activeAppId;
    expect(state.windows.research.isOpen).toBe(true);

    state = osReducer(state, { type: "TOUR_START" });
    expect(state.island.mode).toBe("tour");
    expect(state.island.activeTourStep).toBe(0);
    expect(state.tourSnapshot?.windows.research.isOpen).toBe(true);

    state = osReducer(state, { type: "TOUR_NEXT" });
    expect(state.island.activeTourStep).toBe(1);
    expect(state.activeProjectId).toBe("ai-accessibility-analyzer");

    for (let i = 0; i < TOUR_STEP_COUNT; i += 1) {
      state = osReducer(state, { type: "TOUR_NEXT" });
    }
    expect(state.island.activeTourStep).toBe(TOUR_STEP_COUNT - 1);

    state = osReducer(state, { type: "TOUR_EXIT" });
    expect(state.island.mode).toBe("idle");
    expect(state.tourSnapshot).toBeUndefined();
    expect(state.windows.research.isOpen).toBe(true);
    expect(state.activeAppId).toBe(activeBeforeTour);
    expect(state.activeProjectId).toBe("llm-pro-max");
  });
});

describe("AI Island conversation", () => {
  it("retains bounded user and assistant history across collapse", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = osReducer(state, { type: "ISLAND_OPEN_COMPOSE", query: "What should I see?" });
    state = osReducer(state, {
      type: "ISLAND_ANSWER",
      answer: "Start with Work.",
      actions: [],
    });
    state = osReducer(state, { type: "ISLAND_COLLAPSE" });
    expect(state.island.history).toEqual([
      { role: "user", content: "What should I see?" },
      { role: "assistant", content: "Start with Work." },
    ]);
  });

  it("stores artifact fields on answer and clears them on collapse", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = osReducer(state, { type: "ISLAND_OPEN_COMPOSE", query: "Show projects" });
    state = osReducer(state, {
      type: "ISLAND_ANSWER",
      answer: "Here are the projects.",
      actions: [],
      microWidgets: [{ type: "quickStats" }],
      widgetType: "projects",
      widgetPlacement: "after",
    });
    expect(state.island.widgetType).toBe("projects");
    expect(state.island.microWidgets).toEqual([{ type: "quickStats" }]);
    expect(state.island.widgetPlacement).toBe("after");

    state = osReducer(state, { type: "ISLAND_CLEAR_ARTIFACT" });
    expect(state.island.widgetType).toBeUndefined();
    expect(state.island.answer).toBe("Here are the projects.");
    expect(state.island.microWidgets).toEqual([{ type: "quickStats" }]);

    state = osReducer(state, { type: "ISLAND_COLLAPSE" });
    expect(state.island.expanded).toBe(false);
    expect(state.island.microWidgets).toBeUndefined();
    expect(state.island.widgetPlacement).toBeUndefined();
  });

  it("clears artifacts when opening a new compose session", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = osReducer(state, { type: "ISLAND_OPEN_COMPOSE", query: "Show me" });
    state = osReducer(state, {
      type: "ISLAND_ANSWER",
      answer: "Skills overview.",
      widgetType: "skills",
      microWidgets: [{ type: "skillBadges" }],
    });
    state = osReducer(state, { type: "ISLAND_OPEN_COMPOSE", query: "Another question" });
    expect(state.island.mode).toBe("compose");
    expect(state.island.widgetType).toBeUndefined();
    expect(state.island.microWidgets).toBeUndefined();
  });
});

describe("widget interface state", () => {
  it("collapses the stack and tracks weather lifecycle phases", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    expect(state.widgets).toEqual({ collapsed: false, weatherPhase: "loading" });
    state = osReducer(state, { type: "TOGGLE_WIDGETS" });
    expect(state.widgets.collapsed).toBe(true);
    state = osReducer(state, { type: "SET_WEATHER_PHASE", phase: "ready" });
    expect(state.widgets.weatherPhase).toBe("ready");
    state = osReducer(state, { type: "SET_WIDGETS_COLLAPSED", collapsed: false });
    expect(state.widgets.collapsed).toBe(false);
  });
});

describe("z-index lifecycle", () => {
  it("normalizes large z-index values while preserving focus", () => {
    let state = createInitialState(defaultWorkArea(1440, 900));
    state = { ...state, nextZ: 100 };
    state = osReducer(state, { type: "FOCUS_APP", appId: "profile" });
    expect(state.activeAppId).toBe("profile");
    expect(state.nextZ).toBeLessThan(100);
    expect(state.windows.profile.zIndex).toBe(state.nextZ);
  });
});

describe("action mapper", () => {
  it("maps known actions and ignores malformed ones", () => {
    const mapped = mapChatActionsToIsland([
      { id: "1", label: "Open Work", type: "open-app", appId: "work" },
      { id: "2", label: "Bad", type: "exec-shell", command: "rm -rf /" },
      { id: "3", label: "Resume", type: "open-resume" },
      { label: "Missing type" },
    ]);
    expect(mapped).toHaveLength(2);
    expect(mapped[0]).toMatchObject({ type: "open-app", appId: "work" });
    expect(mapped[1]).toMatchObject({ type: "open-resume" });
  });

  it("infers safe portfolio actions from answer text", () => {
    const actions = inferActionsFromAnswer("The AI Accessibility Analyzer is strongest.");
    expect(actions.some((a) => a.type === "open-project")).toBe(true);
    expect(actions.some((a) => a.type === "open-resume")).toBe(true);
  });
});
