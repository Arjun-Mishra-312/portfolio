import type { AppId, Bounds, IslandState, OSState, WindowState, WorkArea } from "./types";
import { APP_IDS } from "./types";

export const TOP_RAIL_HEIGHT = 54;
export const DOCK_CLEARANCE = 96;
export const EDGE_SNAP_THRESHOLD = 28;
export const MIN_WINDOW_WIDTH = 420;
export const MIN_WINDOW_HEIGHT = 320;
export const THEME_STORAGE_KEY = "arjun-os-theme";
export const A11Y_STORAGE_KEY = "arjun-os-a11y";
export const WIDGETS_SESSION_KEY = "arjun-os-widgets-collapsed";
export const BOOT_SESSION_KEY = "arjun-os-booted";

export const VANCOUVER = {
  latitude: 49.2827,
  longitude: -123.1207,
  timezone: "America/Vancouver",
  label: "Vancouver, BC",
};

export function defaultWorkArea(viewportWidth = 1440, viewportHeight = 900): WorkArea {
  return {
    left: 0,
    top: TOP_RAIL_HEIGHT,
    width: viewportWidth,
    height: Math.max(320, viewportHeight - TOP_RAIL_HEIGHT - DOCK_CLEARANCE),
  };
}

export function defaultBoundsFor(
  appId: AppId,
  workArea: WorkArea,
): Bounds {
  const presets: Record<AppId, { width: number; height: number; offsetX: number; offsetY: number }> = {
    profile: { width: 860, height: 560, offsetX: 0, offsetY: 0 },
    work: { width: 920, height: 620, offsetX: 40, offsetY: 20 },
    experience: { width: 880, height: 580, offsetX: -30, offsetY: 30 },
    research: { width: 840, height: 560, offsetX: 50, offsetY: -10 },
    life: { width: 900, height: 600, offsetX: -20, offsetY: 40 },
  };

  const preset = presets[appId];
  const width = Math.min(preset.width, workArea.width - 48);
  const height = Math.min(preset.height, workArea.height - 48);
  const x = workArea.left + Math.max(16, (workArea.width - width) / 2 + preset.offsetX);
  const y = workArea.top + Math.max(16, (workArea.height - height) / 2 + preset.offsetY);

  return clampBounds({ x, y, width, height }, workArea);
}

export function clampBounds(bounds: Bounds, workArea: WorkArea): Bounds {
  const width = Math.min(Math.max(bounds.width, MIN_WINDOW_WIDTH), workArea.width);
  const height = Math.min(Math.max(bounds.height, MIN_WINDOW_HEIGHT), workArea.height);
  const maxX = workArea.left + workArea.width - width;
  const maxY = workArea.top + workArea.height - Math.min(48, height);
  const x = Math.min(Math.max(bounds.x, workArea.left), Math.max(workArea.left, maxX));
  const y = Math.min(Math.max(bounds.y, workArea.top), Math.max(workArea.top, maxY));
  return { x, y, width, height };
}

export function snappedBounds(side: "left" | "right", workArea: WorkArea): Bounds {
  const gap = 12;
  const width = Math.floor((workArea.width - gap * 3) / 2);
  const height = workArea.height - gap * 2;
  return {
    x: side === "left" ? workArea.left + gap : workArea.left + workArea.width - width - gap,
    y: workArea.top + gap,
    width,
    height,
  };
}

export function maximizedBounds(workArea: WorkArea): Bounds {
  return {
    x: workArea.left + 8,
    y: workArea.top + 8,
    width: workArea.width - 16,
    height: workArea.height - 16,
  };
}

export function createInitialIsland(): IslandState {
  return {
    mode: "idle",
    expanded: false,
    query: "",
    actions: [],
    history: [],
  };
}

export function createInitialWindows(workArea: WorkArea): Record<AppId, WindowState> {
  const windows = {} as Record<AppId, WindowState>;
  APP_IDS.forEach((appId, index) => {
    windows[appId] = {
      appId,
      mode: "normal",
      bounds: defaultBoundsFor(appId, workArea),
      zIndex: 10 + index,
      isOpen: appId === "profile",
    };
  });
  return windows;
}

export function createInitialState(
  workArea: WorkArea = defaultWorkArea(),
  isMobile = false,
): OSState {
  return {
    windows: createInitialWindows(workArea),
    activeAppId: "profile",
    activeProjectId: null,
    island: createInitialIsland(),
    theme: "dusk",
    accessibility: {
      reduceMotion: false,
      reduceTransparency: false,
      highContrast: false,
    },
    widgets: {
      collapsed: false,
      weatherPhase: "loading",
    },
    workArea,
    snapPreview: null,
    nextZ: 20,
    isMobile,
  };
}
