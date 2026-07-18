"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { dockItemTransition, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { APP_META, type AppId } from "@/lib/arjun-os/types";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { DockTile, type DockIconName } from "./icons";
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

export function Dock() {
  const { windows, activeAppId, isMobile } = useOSState();
  const { openApp, openResume } = useOSActions();
  const reduced = useOsReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [launching, setLaunching] = useState<AppId | "resume" | null>(null);
  const items = useMemo(() => [...portfolioData.dockOrder, "resume" as const], []);

  const scaleFor = (index: number) => {
    if (reduced || isMobile || hoverIndex === null) return 1;
    const distance = Math.abs(index - hoverIndex);
    if (distance === 0) return 1.22;
    if (distance === 1) return 1.1;
    if (distance === 2) return 1.04;
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
        "os-dock pointer-events-auto fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-end gap-1 rounded-2xl px-2 py-2",
        isMobile &&
          "bottom-[max(0.75rem,env(safe-area-inset-bottom))] w-[calc(100vw-1.5rem)] max-w-md justify-between",
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
              onClick={() => launch("resume", openResume)}
              animate={{ scale: scaleFor(index), y: scaleFor(index) > 1 ? -6 : 0 }}
              transition={dockItemTransition(reduced)}
              className="group relative flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl px-1.5 py-1"
              aria-label="Resume"
              style={{ "--dock-accent": "#94a3b8" } as CSSProperties}
            >
              <DockTile name="resume" className={launching === "resume" ? "os-dock-launching" : undefined} />
              {!isMobile && (
                <span className="mt-1 text-[10px] text-[var(--os-text-muted)] opacity-0 transition group-hover:opacity-100">
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
            onClick={() => launch(appId, () => openApp(appId))}
            animate={{ scale: scaleFor(index), y: scaleFor(index) > 1 ? -6 : 0 }}
            transition={dockItemTransition(reduced)}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            className={cn(
              "group relative flex min-h-11 min-w-11 flex-col items-center justify-center rounded-xl px-1.5 py-1",
              isActive && "bg-os-fill",
            )}
            aria-label={meta.dockLabel}
            aria-current={isActive ? "true" : undefined}
            style={{ "--dock-accent": accent } as CSSProperties}
          >
            <DockTile name={iconName[appId]} active={isActive} className={launching === appId ? "os-dock-launching" : undefined} />
            {!isMobile && (
              <span className="mt-1 max-w-[72px] truncate text-[10px] text-[var(--os-text-muted)] opacity-0 transition group-hover:opacity-100">
                {meta.dockLabel}
              </span>
            )}
            <AnimatePresence>
              {(isOpen || isActive) && (
                <motion.span
                  layoutId={`dock-open-${appId}`}
                  className="os-dock-item-active-line absolute bottom-0.5"
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
    </nav>
  );
}
