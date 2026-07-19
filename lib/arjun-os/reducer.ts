import {
  clampBounds,
  createInitialState,
  defaultBoundsFor,
  maximizedBounds,
  snappedBounds,
} from "./constants";
import { RECRUITER_TOUR_STEPS, TOUR_STEP_COUNT } from "./tour";
import type { AppId, OSAction, OSState, WindowState } from "./types";
import { APP_IDS } from "./types";

function bumpZ(state: OSState, appId: AppId): { windows: OSState["windows"]; nextZ: number } {
  if (state.nextZ >= 100) {
    const normalized = normalizeZ(state.windows);
    const nextZ = normalized.nextZ + 1;
    return {
      nextZ,
      windows: {
        ...normalized.windows,
        [appId]: { ...normalized.windows[appId], zIndex: nextZ },
      },
    };
  }
  const nextZ = state.nextZ + 1;
  return {
    nextZ,
    windows: {
      ...state.windows,
      [appId]: { ...state.windows[appId], zIndex: nextZ },
    },
  };
}

function normalizeZ(windows: Record<AppId, WindowState>): {
  windows: Record<AppId, WindowState>;
  nextZ: number;
} {
  const ordered = APP_IDS.map((id) => windows[id]).sort((a, b) => a.zIndex - b.zIndex);
  const next = { ...windows };
  ordered.forEach((win, index) => {
    next[win.appId] = { ...win, zIndex: 10 + index };
  });
  return { windows: next, nextZ: 10 + ordered.length };
}

function cloneWindows(windows: Record<AppId, WindowState>): Record<AppId, WindowState> {
  return APP_IDS.reduce(
    (acc, id) => {
      const win = windows[id];
      acc[id] = {
        ...win,
        bounds: { ...win.bounds },
        previousBounds: win.previousBounds
          ? {
              x: win.previousBounds.x,
              y: win.previousBounds.y,
              width: win.previousBounds.width,
              height: win.previousBounds.height,
            }
          : undefined,
      };
      return acc;
    },
    {} as Record<AppId, WindowState>,
  );
}

function applyTourStep(state: OSState, stepIndex: number): OSState {
  const step = RECRUITER_TOUR_STEPS[stepIndex];
  if (!step) return state;

  const arrangement = step.arrange(state.workArea);
  const windows = cloneWindows(state.windows);
  let nextZ = state.nextZ;

  APP_IDS.forEach((appId) => {
    const plan = arrangement[appId];
    if (!plan) return;
    if (plan.isOpen) {
      nextZ += 1;
      windows[appId] = {
        ...windows[appId],
        isOpen: true,
        mode: plan.mode ?? "normal",
        bounds: plan.bounds ?? defaultBoundsFor(appId, state.workArea),
        zIndex: nextZ,
        previousBounds: undefined,
      };
    } else {
      windows[appId] = {
        ...windows[appId],
        isOpen: false,
        mode: "normal",
        bounds: defaultBoundsFor(appId, state.workArea),
        previousBounds: undefined,
      };
    }
  });

  const isLast = stepIndex >= TOUR_STEP_COUNT - 1;

  return {
    ...state,
    windows,
    nextZ,
    activeAppId: step.appId,
    activeProjectId: step.projectId ?? null,
    island: {
      ...state.island,
      mode: "tour",
      expanded: true,
      activeTourStep: stepIndex,
      answer: step.summary,
      query: step.title,
      actions: isLast
        ? [
            { id: "open-resume", label: "Open Resume", type: "open-resume" },
            { id: "open-contact", label: "Open Profile", type: "open-app", appId: "profile" },
            { id: "tour-exit", label: "Exit tour", type: "tour-exit" },
          ]
        : [
            { id: "tour-back", label: "Back", type: "tour-back" },
            { id: "tour-next", label: "Next", type: "tour-next" },
          ],
      error: undefined,
    },
  };
}

export function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case "SET_WORK_AREA": {
      const { workArea, layoutMode } = action;
      const windows = { ...state.windows };

      // Phone and portrait-tablet shells do not render desktop windows. Preserve their
      // last geometry instead of clamping it into the narrow adaptive work area.
      if (layoutMode === "phone" || layoutMode === "tabletPortrait") {
        return { ...state, workArea, layoutMode, windows };
      }

      // Adaptive layouts can carry phone-sized or tablet-snapped bounds. Re-entering
      // desktop should always produce intentional, centered windows rather than a
      // stack of narrow panes at the previous work area's top-left corner.
      if (layoutMode === "desktop" && state.layoutMode !== "desktop") {
        APP_IDS.forEach((appId) => {
          const win = windows[appId];
          windows[appId] = {
            ...win,
            mode: win.mode === "minimized" ? "minimized" : "normal",
            bounds: defaultBoundsFor(appId, workArea),
            previousBounds: undefined,
          };
        });
        return { ...state, workArea, layoutMode, windows };
      }

      if (layoutMode === "tabletLandscape" && state.layoutMode !== "tabletLandscape") {
        const visible = APP_IDS.filter((id) => windows[id].isOpen && windows[id].mode !== "minimized")
          .sort((a, b) => windows[b].zIndex - windows[a].zIndex)
          .slice(0, 2);
        APP_IDS.forEach((id) => {
          if (windows[id].isOpen && !visible.includes(id)) windows[id] = { ...windows[id], mode: "minimized" };
        });
        if (visible.length === 1) {
          const id = visible[0];
          windows[id] = { ...windows[id], mode: "maximized", bounds: maximizedBounds(workArea) };
        } else if (visible.length === 2) {
          windows[visible[1]] = { ...windows[visible[1]], mode: "snapped-left", bounds: snappedBounds("left", workArea) };
          windows[visible[0]] = { ...windows[visible[0]], mode: "snapped-right", bounds: snappedBounds("right", workArea) };
        }
        return { ...state, workArea, layoutMode, windows };
      }
      APP_IDS.forEach((appId) => {
        const win = windows[appId];
        if (!win.isOpen || win.mode === "minimized") return;
        if (win.mode === "maximized") {
          windows[appId] = { ...win, bounds: maximizedBounds(workArea) };
        } else if (win.mode === "snapped-left") {
          windows[appId] = { ...win, bounds: snappedBounds("left", workArea) };
        } else if (win.mode === "snapped-right") {
          windows[appId] = { ...win, bounds: snappedBounds("right", workArea) };
        } else {
          windows[appId] = { ...win, bounds: clampBounds(win.bounds, workArea) };
        }
      });
      return { ...state, workArea, layoutMode, windows };
    }

    case "SET_THEME":
      return { ...state, theme: action.theme };

    case "SET_ACCESSIBILITY":
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.prefs },
      };

    case "SET_WIDGETS_COLLAPSED":
      return { ...state, widgets: { ...state.widgets, collapsed: action.collapsed } };

    case "TOGGLE_WIDGETS":
      return { ...state, widgets: { ...state.widgets, collapsed: !state.widgets.collapsed } };

    case "SET_WEATHER_PHASE":
      return { ...state, widgets: { ...state.widgets, weatherPhase: action.phase } };

    case "FOCUS_WIDGET":
      return {
        ...state,
        widgets: {
          ...state.widgets,
          collapsed: false,
          focusedWidgetId: action.widgetId,
        },
      };

    case "CLEAR_WIDGET_FOCUS":
      return {
        ...state,
        widgets: { ...state.widgets, focusedWidgetId: null },
      };

    case "OPEN_APP": {
      const win = state.windows[action.appId];
      if (state.layoutMode === "tabletLandscape") {
        const visible = APP_IDS.filter(
          (id) => state.windows[id].isOpen && state.windows[id].mode !== "minimized" && id !== action.appId,
        ).sort((a, b) => state.windows[b].zIndex - state.windows[a].zIndex);
        const windows = cloneWindows(state.windows);
        if (visible.length >= 2) {
          const displaced = visible[visible.length - 1];
          windows[displaced] = { ...windows[displaced], mode: "minimized" };
        }
        const partner = visible[0];
        if (partner) {
          windows[partner] = {
            ...windows[partner],
            mode: "snapped-left",
            bounds: snappedBounds("left", state.workArea),
          };
          windows[action.appId] = {
            ...windows[action.appId],
            isOpen: true,
            mode: "snapped-right",
            bounds: snappedBounds("right", state.workArea),
            zIndex: state.nextZ + 1,
          };
        } else {
          windows[action.appId] = {
            ...windows[action.appId],
            isOpen: true,
            mode: "maximized",
            bounds: maximizedBounds(state.workArea),
            zIndex: state.nextZ + 1,
          };
        }
        return { ...state, windows, activeAppId: action.appId, nextZ: state.nextZ + 1 };
      }
      if (win.isOpen && win.mode !== "minimized") {
        const z = bumpZ(state, action.appId);
        return { ...state, ...z, activeAppId: action.appId };
      }
      if (win.isOpen && win.mode === "minimized") {
        return osReducer(state, { type: "RESTORE_APP", appId: action.appId });
      }
      const z = bumpZ(state, action.appId);
      return {
        ...state,
        ...z,
        activeAppId: action.appId,
        windows: {
          ...z.windows,
          [action.appId]: {
            ...z.windows[action.appId],
            isOpen: true,
            mode: "normal",
            bounds: defaultBoundsFor(action.appId, state.workArea),
          },
        },
      };
    }

    case "FOCUS_APP": {
      if (!state.windows[action.appId].isOpen) return state;
      const z = bumpZ(state, action.appId);
      return { ...state, ...z, activeAppId: action.appId };
    }

    case "CLOSE_APP": {
      const remaining = APP_IDS.filter(
        (id) =>
          id !== action.appId &&
          state.windows[id].isOpen &&
          state.windows[id].mode !== "minimized",
      );
      return {
        ...state,
        activeAppId:
          state.activeAppId === action.appId ? remaining.at(-1) ?? null : state.activeAppId,
        activeProjectId: action.appId === "work" ? null : state.activeProjectId,
        windows: {
          ...state.windows,
          [action.appId]: {
            ...state.windows[action.appId],
            isOpen: false,
            mode: "normal",
            bounds: defaultBoundsFor(action.appId, state.workArea),
            previousBounds: undefined,
          },
        },
      };
    }

    case "MINIMIZE_APP": {
      const win = state.windows[action.appId];
      if (!win.isOpen || win.mode === "minimized") return state;
      const remaining = APP_IDS.filter(
        (id) =>
          id !== action.appId &&
          state.windows[id].isOpen &&
          state.windows[id].mode !== "minimized",
      );
      return {
        ...state,
        activeAppId:
          state.activeAppId === action.appId ? remaining.at(-1) ?? null : state.activeAppId,
        windows: {
          ...state.windows,
          [action.appId]: {
            ...win,
            mode: "minimized",
            previousBounds: win.mode === "normal" ? win.bounds : win.previousBounds ?? win.bounds,
          },
        },
      };
    }

    case "RESTORE_APP": {
      const win = state.windows[action.appId];
      const bounds = clampBounds(win.previousBounds ?? win.bounds, state.workArea);
      const z = bumpZ(state, action.appId);
      return {
        ...state,
        ...z,
        activeAppId: action.appId,
        windows: {
          ...z.windows,
          [action.appId]: {
            ...z.windows[action.appId],
            isOpen: true,
            mode: "normal",
            bounds,
            previousBounds: undefined,
          },
        },
      };
    }

    case "MAXIMIZE_APP": {
      const win = state.windows[action.appId];
      if (win.mode === "maximized") {
        const bounds = clampBounds(
          win.previousBounds ?? defaultBoundsFor(action.appId, state.workArea),
          state.workArea,
        );
        const z = bumpZ(state, action.appId);
        return {
          ...state,
          ...z,
          activeAppId: action.appId,
          windows: {
            ...z.windows,
            [action.appId]: {
              ...z.windows[action.appId],
              mode: "normal",
              bounds,
              previousBounds: undefined,
            },
          },
        };
      }
      const z = bumpZ(state, action.appId);
      return {
        ...state,
        ...z,
        activeAppId: action.appId,
        windows: {
          ...z.windows,
          [action.appId]: {
            ...z.windows[action.appId],
            mode: "maximized",
            previousBounds: win.bounds,
            bounds: maximizedBounds(state.workArea),
          },
        },
      };
    }

    case "SNAP_APP": {
      const win = state.windows[action.appId];
      const z = bumpZ(state, action.appId);
      return {
        ...state,
        ...z,
        snapPreview: null,
        activeAppId: action.appId,
        windows: {
          ...z.windows,
          [action.appId]: {
            ...z.windows[action.appId],
            mode: action.side === "left" ? "snapped-left" : "snapped-right",
            previousBounds: win.mode === "normal" ? win.bounds : win.previousBounds ?? win.bounds,
            bounds: snappedBounds(action.side, state.workArea),
          },
        },
      };
    }

    case "MOVE_WINDOW":
    case "RESIZE_WINDOW": {
      const win = state.windows[action.appId];
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.appId]: {
            ...win,
            mode: "normal",
            bounds: clampBounds(action.bounds, state.workArea),
          },
        },
      };
    }

    case "SET_SNAP_PREVIEW":
      return { ...state, snapPreview: action.preview };

    case "SET_ACTIVE_PROJECT":
      return { ...state, activeProjectId: action.projectId };

    case "SET_ACTIVE_EXPERIENCE":
      return { ...state, activeExperienceId: action.experienceId };

    case "SELECT_TAB": {
      let next = osReducer(state, { type: "OPEN_APP", appId: action.appId });
      if (action.reset) {
        if (action.appId === "work") next = { ...next, activeProjectId: null };
        if (action.appId === "experience") next = { ...next, activeExperienceId: null };
      }
      return next;
    }

    case "ISLAND_OPEN_COMPOSE":
      return {
        ...state,
        island: {
          ...state.island,
          mode: "compose",
          expanded: true,
          query: action.query ?? state.island.query,
          error: undefined,
          activeTourStep: undefined,
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
          evidence: undefined,
        },
      };

    case "ISLAND_SET_QUERY":
      return { ...state, island: { ...state.island, query: action.query } };

    case "ISLAND_THINKING":
      return {
        ...state,
        island: {
          ...state.island,
          mode: "thinking",
          expanded: true,
          error: undefined,
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
          evidence: undefined,
        },
      };

    case "ISLAND_ANSWER":
      return {
        ...state,
        island: {
          ...state.island,
          mode: "answer",
          expanded: true,
          answer: action.answer,
          actions: action.actions ?? [],
          linkedAppId: action.linkedAppId,
          linkedProjectId: action.linkedProjectId,
          microWidgets: action.microWidgets,
          widgetType: action.widgetType,
          widgetPlacement: action.widgetPlacement,
          evidence: action.evidence,
          history: [
            ...state.island.history,
            { role: "user" as const, content: state.island.query },
            { role: "assistant" as const, content: action.answer },
          ].slice(-12),
          error: undefined,
        },
      };

    case "ISLAND_ERROR":
      return {
        ...state,
        island: {
          ...state.island,
          mode: "error",
          expanded: true,
          error: action.error,
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
          evidence: undefined,
        },
      };

    case "ISLAND_COLLAPSE":
      if (state.island.mode === "tour") {
        return osReducer(state, { type: "TOUR_EXIT" });
      }
      return {
        ...state,
        island: {
          ...state.island,
          mode: "idle",
          expanded: false,
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
          evidence: undefined,
        },
      };

    case "ISLAND_CLEAR_ARTIFACT":
      return {
        ...state,
        island: {
          ...state.island,
          widgetType: undefined,
          evidence: undefined,
        },
      };

    case "ISLAND_RETRY":
      return {
        ...state,
        island: {
          ...state.island,
          mode: "compose",
          expanded: true,
          error: undefined,
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
          evidence: undefined,
        },
      };

    case "NORMALIZE_Z": {
      const normalized = normalizeZ(state.windows);
      return { ...state, ...normalized };
    }

    case "TOUR_START": {
      const withSnapshot: OSState = {
        ...state,
        tourSnapshot: {
          windows: cloneWindows(state.windows),
          activeAppId: state.activeAppId,
          activeProjectId: state.activeProjectId,
          activeExperienceId: state.activeExperienceId,
          island: {
            ...state.island,
            actions: [...state.island.actions],
            history: [...state.island.history],
          },
          nextZ: state.nextZ,
        },
        island: { ...state.island, activeTourStep: 0 },
      };
      return applyTourStep(withSnapshot, 0);
    }

    case "TOUR_NEXT": {
      const current = state.island.activeTourStep ?? 0;
      if (current >= TOUR_STEP_COUNT - 1) return applyTourStep(state, TOUR_STEP_COUNT - 1);
      return applyTourStep(state, current + 1);
    }

    case "TOUR_BACK": {
      const current = state.island.activeTourStep ?? 0;
      if (current <= 0) return state;
      return applyTourStep(state, current - 1);
    }

    case "TOUR_GOTO": {
      const step = Math.max(0, Math.min(TOUR_STEP_COUNT - 1, action.step));
      return applyTourStep(state, step);
    }

    case "TOUR_EXIT": {
      const snapshot = state.tourSnapshot;
      const restored = snapshot ? cloneWindows(snapshot.windows) : state.windows;
      return {
        ...state,
        windows: restored,
        tourSnapshot: undefined,
        nextZ: snapshot?.nextZ ?? state.nextZ,
        activeAppId: snapshot?.activeAppId ?? "profile",
        activeProjectId: snapshot?.activeProjectId ?? null,
        activeExperienceId: snapshot?.activeExperienceId ?? null,
        island: {
          ...(snapshot?.island ?? state.island),
          mode: "idle",
          expanded: false,
          activeTourStep: undefined,
          actions: [],
          microWidgets: undefined,
          widgetType: undefined,
          widgetPlacement: undefined,
        },
      };
    }

    case "HYDRATE_FROM_URL": {
      let next = createInitialState(state.workArea, state.layoutMode);
      next = {
        ...next,
        theme: state.theme,
        accessibility: state.accessibility,
        widgets: state.widgets,
        workArea: state.workArea,
        layoutMode: state.layoutMode,
      };
      next = osReducer(next, { type: "OPEN_APP", appId: action.appId });
      if (action.projectId) {
        next = { ...next, activeProjectId: action.projectId };
      }
      if (action.experienceId) {
        next = { ...next, activeExperienceId: action.experienceId };
      }
      if (action.openAi) {
        next = osReducer(next, { type: "ISLAND_OPEN_COMPOSE" });
      }
      if (action.startTour) {
        next = osReducer(next, { type: "TOUR_START" });
      }
      return next;
    }

    default:
      return state;
  }
}
