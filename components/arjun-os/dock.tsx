"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { dockItemTransition, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { APP_META, type AppId } from "@/lib/arjun-os/types";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { DockTile, type DockIconName } from "./icons";
import { ThemeGlyph } from "./icons";
import { Accessibility } from "lucide-react";
import { cn } from "@/utils/cn";

const iconName: Record<AppId | "resume", DockIconName> = {
  profile: "home",
  work: "work",
  experience: "experience",
  research: "research",
  life: "life",
  resume: "resume",
};

const accentMap: Record<string, string> = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  cobalt: "#3b82f6",
  mint: "#34d399",
  amber: "#f59e0b",
};

export function Dock({ onOpenAccessibility }: { onOpenAccessibility?: () => void }) {
  const { windows, activeAppId, layoutMode, theme } = useOSState();
  const isMobile = layoutMode === "phone";
  const { openApp, openResume, toggleTheme } = useOSActions();
  const reduced = useOsReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [launching, setLaunching] = useState<AppId | "resume" | null>(null);
  const items = useMemo(() => [...portfolioData.dockOrder, "resume" as const], []);

  const scaleFor = (index: number) => {
    if (reduced || isMobile || hoverIndex === null) return 1;
    const distance = Math.abs(index - hoverIndex);
    if (distance === 0) return 1.12;
    if (distance === 1) return 1.04;
    return 1;
  };

  const launch = (id: AppId | "resume", action: () => void) => {
    setLaunching(id);
    action();
    window.setTimeout(() => setLaunching((current) => (current === id ? null : current)), 520);
  };

  return (
    <nav
      className={cn(
        "os-dock pointer-events-auto fixed right-5 top-1/2 z-[70] flex -translate-y-1/2 flex-col items-center gap-1 rounded-2xl p-2",
        isMobile &&
          "bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 right-auto top-auto w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 translate-y-0 flex-row justify-between",
      )}
      aria-label="Arjun OS dock"
      onMouseLeave={() => setHoverIndex(null)}
    >
      {items.map((id, index) => {
        if (id === "resume") {
          return (
            <motion.button
              key="resume"
              type="button"
              onMouseEnter={() => setHoverIndex(index)}
              onFocus={() => setHoverIndex(index)}
              onBlur={() => setHoverIndex(null)}
              onClick={() => launch("resume", openResume)}
              animate={{ scale: scaleFor(index), x: scaleFor(index) > 1 ? -3 : 0 }}
              transition={dockItemTransition(reduced)}
              className="os-dock-button group relative flex h-14 w-14 items-center justify-center rounded-2xl"
              aria-label="Resume"
              style={{ "--dock-accent": "#94a3b8" } as CSSProperties}
            >
              <DockTile name="resume" className={launching === "resume" ? "os-dock-launching" : undefined} />
              {!isMobile && (
                <span className="os-dock-label" aria-hidden>
                  Resume
                </span>
              )}
            </motion.button>
          );
        }

        const appId = id;
        const meta = APP_META[appId];
        const win = windows[appId];
        const isActive = activeAppId === appId && win.isOpen && win.mode !== "minimized";
        const isOpen = win.isOpen;
        const accent = accentMap[meta.accent] ?? "#22d3ee";

        return (
          <motion.button
            key={appId}
            id={`dock-${appId}`}
            type="button"
            onMouseEnter={() => setHoverIndex(index)}
            onFocus={() => setHoverIndex(index)}
            onBlur={() => setHoverIndex(null)}
            onClick={() => launch(appId, () => openApp(appId))}
            animate={{ scale: scaleFor(index), x: scaleFor(index) > 1 ? -3 : 0 }}
            transition={dockItemTransition(reduced)}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            className={cn(
              "os-dock-button group relative flex h-14 w-14 items-center justify-center rounded-2xl",
              isActive && "bg-os-fill",
            )}
            aria-label={meta.dockLabel}
            aria-current={isActive ? "true" : undefined}
            style={{ "--dock-accent": accent } as CSSProperties}
          >
            <DockTile name={iconName[appId]} active={isActive} className={launching === appId ? "os-dock-launching" : undefined} />
            {!isMobile && (
              <span className="os-dock-label" aria-hidden>
                {meta.dockLabel}
              </span>
            )}
            <AnimatePresence>
              {(isOpen || isActive) && (
                <motion.span
                  layoutId={`dock-open-${appId}`}
                  className="os-dock-item-active-line absolute right-0 top-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  aria-hidden
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
      {!isMobile && (
        <>
          <span className="my-1 h-px w-8 bg-[var(--os-divider)]" aria-hidden />
          <button type="button" onClick={toggleTheme} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-os-secondary transition hover:bg-os-hover hover:text-os-primary" aria-label={`Switch to ${theme === "dusk" ? "dawn" : "dusk"} theme`}>
            <ThemeGlyph dusk={theme === "dusk"} />
          </button>
          <button type="button" onClick={onOpenAccessibility} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-os-secondary transition hover:bg-os-hover hover:text-os-primary" aria-label="Open accessibility settings">
            <Accessibility className="h-5 w-5" />
          </button>
        </>
      )}
    </nav>
  );
}
