import type { WidgetType } from "@/lib/chat-context";
import type { MicroWidget, WidgetPlacement } from "@/types/micro-widgets";

export type AppId = "profile" | "work" | "experience" | "research" | "life" | "lab";

export type { WidgetType, MicroWidget, WidgetPlacement };

export type ProjectId =
  | "ai-accessibility-analyzer"
  | "llm-pro-max"
  | "re-plate";

export type DesktopWidgetId = "github-pulse" | "focus-radio" | "weather" | "coffee-chat";

export type IslandEvidence = {
  kind: "github-pulse";
  title: string;
  total: number;
  streak: number;
  latest: { repo: string; label: string; url: string; occurredAt: string } | null;
  status: "ready" | "fallback";
};

export type WindowMode =
  | "normal"
  | "snapped-left"
  | "snapped-right"
  | "maximized"
  | "minimized";

export type OsTheme = "dusk" | "dawn";
export type LayoutMode = "phone" | "tabletPortrait" | "tabletLandscape" | "desktop";

export type MotionPreference = "system" | "full" | "reduced";
export type WeatherPhase = "loading" | "ready" | "fallback" | "updating";

export interface WidgetUIState {
  collapsed: boolean;
  weatherPhase: WeatherPhase;
  focusedWidgetId: DesktopWidgetId | null;
}

export interface VisualAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
}

export interface DockIconDefinition {
  appId: AppId | "resume";
  label: string;
  accent: string;
  activeAccent: string;
}

export type IslandMode =
  | "idle"
  | "compose"
  | "thinking"
  | "answer"
  | "tour"
  | "error";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  appId: AppId;
  mode: WindowMode;
  bounds: Bounds;
  previousBounds?: Bounds;
  zIndex: number;
  isOpen: boolean;
}

export type IslandAction =
  | { id: string; label: string; type: "open-app"; appId: AppId }
  | { id: string; label: string; type: "open-project"; projectId: ProjectId }
  | { id: string; label: string; type: "open-experience"; experienceId: string }
  | { id: string; label: string; type: "open-resume" }
  | { id: string; label: string; type: "start-tour" }
  | { id: string; label: string; type: "focus-widget"; widgetId: DesktopWidgetId }
  | { id: string; label: string; type: "tour-next" }
  | { id: string; label: string; type: "tour-back" }
  | { id: string; label: string; type: "tour-exit" }
  | { id: string; label: string; type: "retry" };

export interface IslandState {
  mode: IslandMode;
  expanded: boolean;
  query: string;
  answer?: string;
  actions: IslandAction[];
  linkedAppId?: AppId;
  linkedProjectId?: ProjectId;
  activeTourStep?: number;
  error?: string;
  history: ChatMessage[];
  microWidgets?: MicroWidget[];
  widgetType?: WidgetType;
  widgetPlacement?: WidgetPlacement;
  evidence?: IslandEvidence;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TourSnapshot {
  windows: Record<AppId, WindowState>;
  activeAppId: AppId | null;
  activeProjectId: ProjectId | null;
  activeExperienceId: string | null;
  island: IslandState;
  nextZ: number;
}

export interface AccessibilityPrefs {
  reduceMotion: boolean;
  reduceTransparency: boolean;
  highContrast: boolean;
}

export interface WorkArea {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface OSState {
  windows: Record<AppId, WindowState>;
  activeAppId: AppId | null;
  activeProjectId: ProjectId | null;
  activeExperienceId: string | null;
  island: IslandState;
  theme: OsTheme;
  accessibility: AccessibilityPrefs;
  widgets: WidgetUIState;
  workArea: WorkArea;
  snapPreview: "left" | "right" | null;
  nextZ: number;
  tourSnapshot?: TourSnapshot;
  layoutMode: LayoutMode;
}

export type OSAction =
  | { type: "SET_WORK_AREA"; workArea: WorkArea; layoutMode: LayoutMode }
  | { type: "SET_THEME"; theme: OsTheme }
  | { type: "SET_ACCESSIBILITY"; prefs: Partial<AccessibilityPrefs> }
  | { type: "SET_WIDGETS_COLLAPSED"; collapsed: boolean }
  | { type: "TOGGLE_WIDGETS" }
  | { type: "SET_WEATHER_PHASE"; phase: WeatherPhase }
  | { type: "FOCUS_WIDGET"; widgetId: DesktopWidgetId }
  | { type: "CLEAR_WIDGET_FOCUS" }
  | { type: "OPEN_APP"; appId: AppId }
  | { type: "FOCUS_APP"; appId: AppId }
  | { type: "CLOSE_APP"; appId: AppId }
  | { type: "MINIMIZE_APP"; appId: AppId }
  | { type: "RESTORE_APP"; appId: AppId }
  | { type: "MAXIMIZE_APP"; appId: AppId }
  | { type: "SNAP_APP"; appId: AppId; side: "left" | "right" }
  | { type: "MOVE_WINDOW"; appId: AppId; bounds: Bounds }
  | { type: "RESIZE_WINDOW"; appId: AppId; bounds: Bounds }
  | { type: "SET_SNAP_PREVIEW"; preview: "left" | "right" | null }
  | { type: "SET_ACTIVE_PROJECT"; projectId: ProjectId | null }
  | { type: "SET_ACTIVE_EXPERIENCE"; experienceId: string | null }
  | { type: "SELECT_TAB"; appId: AppId; reset?: boolean }
  | { type: "ISLAND_OPEN_COMPOSE"; query?: string }
  | { type: "ISLAND_SET_QUERY"; query: string }
  | { type: "ISLAND_THINKING" }
  | {
      type: "ISLAND_ANSWER";
      answer: string;
      actions?: IslandAction[];
      linkedAppId?: AppId;
      linkedProjectId?: ProjectId;
      microWidgets?: MicroWidget[];
      widgetType?: WidgetType;
      widgetPlacement?: WidgetPlacement;
      evidence?: IslandEvidence;
    }
  | { type: "ISLAND_ERROR"; error: string }
  | { type: "ISLAND_COLLAPSE" }
  | { type: "ISLAND_CLEAR_ARTIFACT" }
  | { type: "ISLAND_RETRY" }
  | { type: "NORMALIZE_Z" }
  | { type: "TOUR_START" }
  | { type: "TOUR_NEXT" }
  | { type: "TOUR_BACK" }
  | { type: "TOUR_EXIT" }
  | { type: "TOUR_GOTO"; step: number }
  | {
      type: "HYDRATE_FROM_URL";
      appId: AppId;
      projectId?: ProjectId | null;
      experienceId?: string | null;
      openAi?: boolean;
      startTour?: boolean;
    };

export const APP_IDS: AppId[] = ["profile", "work", "experience", "research", "life", "lab"];

export const APP_META: Record<
  AppId,
  { title: string; dockLabel: string; accent: string }
> = {
  profile: { title: "About Arjun", dockLabel: "Home", accent: "cyan" },
  work: { title: "Selected Work", dockLabel: "Work", accent: "violet" },
  experience: { title: "Experience", dockLabel: "Experience", accent: "cobalt" },
  research: { title: "Research", dockLabel: "Research", accent: "mint" },
  life: { title: "Life + Play", dockLabel: "Life + Play", accent: "amber" },
  lab: { title: "Experience Lab", dockLabel: "Lab", accent: "rose" },
};
