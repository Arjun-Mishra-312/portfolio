"use client";

import { useEffect, useState } from "react";
import { Accessibility, Wifi } from "lucide-react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { ThemeGlyph } from "./icons";

export function TopRail({ onOpenAccessibility }: { onOpenAccessibility?: () => void }) {
  const { theme } = useOSState();
  const { toggleTheme } = useOSActions();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = now
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Vancouver",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now)
    : "";

  return (
    <header
      className="os-top-rail pointer-events-auto fixed inset-x-0 top-0 z-[80] flex h-[54px] items-center justify-between px-3 pt-[env(safe-area-inset-top)] sm:px-4"
      role="banner"
      aria-label="Arjun OS system rail"
    >
      <div className="hidden min-w-[120px] text-sm font-medium tracking-wide text-[var(--os-text-primary)] md:block">
        ARJUN OS <span className="text-[var(--os-text-muted)]">|</span> PORTFOLIO
      </div>

      <div className="ml-auto flex items-center justify-end gap-1 text-[var(--os-text-secondary)] sm:min-w-[140px] sm:gap-3">
        <span className="hidden items-center gap-1.5 text-xs font-medium md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          AVAILABLE
        </span>
        <button
          type="button"
          onClick={onOpenAccessibility}
          className="absolute left-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1.5 transition hover:bg-os-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--os-accent-cobalt)] sm:static"
          aria-label="Open accessibility settings"
        >
          <Accessibility className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-2 min-h-11 min-w-11 rounded-md p-1.5 transition hover:bg-os-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--os-accent-cobalt)] sm:static"
          aria-label={`Switch to ${theme === "dusk" ? "dawn" : "dusk"} theme`}
        >
          <ThemeGlyph dusk={theme === "dusk"} />
        </button>
        <Wifi className="hidden h-4 w-4 sm:block" aria-hidden />
        {now && (
          <time
            className="hidden font-mono text-xs tabular-nums text-[var(--os-text-primary)] lg:block"
            dateTime={now.toISOString()}
          >
            {timeLabel}
          </time>
        )}
      </div>
    </header>
  );
}
