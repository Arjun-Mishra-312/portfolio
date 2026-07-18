"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { LayoutGroup, LazyMotion, MotionConfig, domMax } from "motion/react";
import { A11Y_STORAGE_KEY, THEME_STORAGE_KEY, WIDGETS_SESSION_KEY, createInitialState, defaultWorkArea } from "./constants";
import { isAppId, isProjectId } from "./portfolio-data";
import { osReducer } from "./reducer";
import type { AppId, IslandAction, OSAction, OSState, ProjectId } from "./types";

type OSActions = {
  dispatch: React.Dispatch<OSAction>;
  openApp: (appId: AppId) => void;
  focusApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  minimizeApp: (appId: AppId) => void;
  maximizeApp: (appId: AppId) => void;
  openResume: () => void;
  openIsland: (query?: string) => void;
  collapseIsland: () => void;
  runIslandAction: (action: IslandAction) => void;
  startTour: () => void;
  setTheme: (theme: OSState["theme"]) => void;
  toggleTheme: () => void;
  setAccessibility: (prefs: Partial<OSState["accessibility"]>) => void;
  toggleWidgets: () => void;
};

const OSStateContext = createContext<OSState | null>(null);
const OSActionsContext = createContext<OSActions | null>(null);

function buildQuery(
  appId: AppId | null,
  projectId: ProjectId | null,
  aiOpen: boolean,
  tourActive: boolean,
) {
  const params = new URLSearchParams();
  // Profile is the default desktop state; keeping it out of the URL prevents a
  // normal reload from being mistaken for an intentional deep link.
  if (appId && appId !== "profile") params.set("app", appId);
  if (appId === "work" && projectId) params.set("project", projectId);
  if (tourActive) params.set("tour", "recruiter");
  else if (aiOpen) params.set("ai", "open");
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, undefined, () => createInitialState());
  const hydratedRef = useRef(false);
  const applyingUrlRef = useRef(false);
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dusk" || savedTheme === "dawn") {
      dispatch({ type: "SET_THEME", theme: savedTheme });
    }
    const savedA11y = localStorage.getItem(A11Y_STORAGE_KEY);
    if (savedA11y) {
      try {
        dispatch({ type: "SET_ACCESSIBILITY", prefs: JSON.parse(savedA11y) });
      } catch {
        /* ignore */
      }
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent | MediaQueryList) =>
      dispatch({ type: "SET_ACCESSIBILITY", prefs: { reduceMotion: event.matches } });
    if (media.matches) onMotionChange(media);
    setPreferencesReady(true);
    media.addEventListener("change", onMotionChange);
    return () => media.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_WIDGETS_COLLAPSED",
      collapsed: sessionStorage.getItem(WIDGETS_SESSION_KEY) === "true",
    });
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    document.documentElement.dataset.arjunTheme = state.theme;
    document.documentElement.classList.toggle("dark", state.theme === "dusk");
  }, [preferencesReady, state.theme]);

  useEffect(() => {
    if (!preferencesReady) return;
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(state.accessibility));
    document.documentElement.dataset.reduceMotion = String(state.accessibility.reduceMotion);
    document.documentElement.dataset.reduceTransparency = String(
      state.accessibility.reduceTransparency,
    );
    document.documentElement.dataset.highContrast = String(state.accessibility.highContrast);
  }, [preferencesReady, state.accessibility]);

  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dispatch({
        type: "SET_WORK_AREA",
        workArea: defaultWorkArea(width, height),
        isMobile: width < 768,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const hydrateFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get("app");
      const projectParam = params.get("project");
      if (appParam === "profile") {
        params.delete("app");
        const normalizedQuery = params.toString();
        window.history.replaceState(
          window.history.state,
          "",
          normalizedQuery ? `/?${normalizedQuery}` : "/",
        );
      }
      applyingUrlRef.current = true;
      dispatch({
        type: "HYDRATE_FROM_URL",
        appId: isAppId(appParam) ? appParam : "profile",
        projectId: isProjectId(projectParam) ? projectParam : null,
        openAi: params.get("ai") === "open",
        startTour: params.get("tour") === "recruiter",
      });
    };

    hydratedRef.current = true;
    hydrateFromLocation();
    window.addEventListener("popstate", hydrateFromLocation);
    return () => window.removeEventListener("popstate", hydrateFromLocation);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || window.location.pathname !== "/") return;
    if (applyingUrlRef.current) {
      applyingUrlRef.current = false;
      return;
    }
    const tourActive = state.island.mode === "tour";
    const next = buildQuery(
      state.activeAppId,
      state.activeProjectId,
      state.island.expanded && state.island.mode !== "idle" && !tourActive,
      tourActive,
    );
    const current = `${window.location.pathname}${window.location.search}`;
    if (next !== current) {
      window.history.pushState({ arjunOS: true }, "", next);
    }
  }, [
    state.activeAppId,
    state.activeProjectId,
    state.island.expanded,
    state.island.mode,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCommandK) {
        event.preventDefault();
        dispatch({ type: "ISLAND_OPEN_COMPOSE" });
      }
      if (event.key === "Escape" && state.island.expanded) {
        event.preventDefault();
        dispatch({ type: "ISLAND_COLLAPSE" });
      }
      if (state.island.mode === "tour") {
        if (event.key === "ArrowRight" || event.key === "Enter") {
          event.preventDefault();
          dispatch({ type: "TOUR_NEXT" });
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          dispatch({ type: "TOUR_BACK" });
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.island.expanded, state.island.mode]);

  const openResume = useCallback(() => {
    window.open("/Resume.pdf", "_blank", "noopener,noreferrer");
  }, []);

  const runIslandAction = useCallback(
    (action: IslandAction) => {
      switch (action.type) {
        case "open-app":
          dispatch({ type: "OPEN_APP", appId: action.appId });
          break;
        case "open-project":
          dispatch({ type: "OPEN_APP", appId: "work" });
          dispatch({ type: "SET_ACTIVE_PROJECT", projectId: action.projectId });
          break;
        case "open-resume":
          openResume();
          break;
        case "start-tour":
          dispatch({ type: "TOUR_START" });
          break;
        case "tour-next":
          dispatch({ type: "TOUR_NEXT" });
          break;
        case "tour-back":
          dispatch({ type: "TOUR_BACK" });
          break;
        case "tour-exit":
          dispatch({ type: "TOUR_EXIT" });
          break;
        case "retry":
          dispatch({ type: "ISLAND_RETRY" });
          break;
        default:
          break;
      }
    },
    [openResume],
  );

  const actions = useMemo<OSActions>(
    () => ({
      dispatch,
      openApp: (appId) => dispatch({ type: "OPEN_APP", appId }),
      focusApp: (appId) => dispatch({ type: "FOCUS_APP", appId }),
      closeApp: (appId) => {
        dispatch({ type: "CLOSE_APP", appId });
        window.requestAnimationFrame(() => document.getElementById(`dock-${appId}`)?.focus());
      },
      minimizeApp: (appId) => {
        dispatch({ type: "MINIMIZE_APP", appId });
        window.requestAnimationFrame(() => document.getElementById(`dock-${appId}`)?.focus());
      },
      maximizeApp: (appId) => dispatch({ type: "MAXIMIZE_APP", appId }),
      openResume,
      openIsland: (query) => dispatch({ type: "ISLAND_OPEN_COMPOSE", query }),
      collapseIsland: () => dispatch({ type: "ISLAND_COLLAPSE" }),
      runIslandAction,
      startTour: () => dispatch({ type: "TOUR_START" }),
      setTheme: (theme) => dispatch({ type: "SET_THEME", theme }),
      toggleTheme: () =>
        dispatch({ type: "SET_THEME", theme: state.theme === "dusk" ? "dawn" : "dusk" }),
      setAccessibility: (prefs) => dispatch({ type: "SET_ACCESSIBILITY", prefs }),
      toggleWidgets: () => {
        const collapsed = !state.widgets.collapsed;
        sessionStorage.setItem(WIDGETS_SESSION_KEY, String(collapsed));
        dispatch({ type: "SET_WIDGETS_COLLAPSED", collapsed });
      },
    }),
    [openResume, runIslandAction, state.theme, state.widgets.collapsed],
  );

  return (
    <OSStateContext.Provider value={state}>
      <OSActionsContext.Provider value={actions}>
        <LazyMotion features={domMax}>
          <MotionConfig reducedMotion={state.accessibility.reduceMotion ? "always" : "user"}>
            <LayoutGroup id="arjun-os">{children}</LayoutGroup>
          </MotionConfig>
        </LazyMotion>
      </OSActionsContext.Provider>
    </OSStateContext.Provider>
  );
}

export function useOSState() {
  const ctx = useContext(OSStateContext);
  if (!ctx) throw new Error("useOSState must be used within OSProvider");
  return ctx;
}

export function useOSActions() {
  const ctx = useContext(OSActionsContext);
  if (!ctx) throw new Error("useOSActions must be used within OSProvider");
  return ctx;
}
