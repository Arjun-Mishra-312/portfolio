"use client";

import { useEffect, useRef } from "react";
import { useOSState } from "@/lib/arjun-os/os-context";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { RECRUITER_TOUR_STEPS } from "@/lib/arjun-os/tour";

const SIZE = 14;

/**
 * The One Dot film's guide, for the recruiter tour: a single orange dot flies from window to window and
 * opens into a ring around each one the tour brings forward. Desktop only, and never under reduced motion.
 */
export function TourDot() {
  const { island, layoutMode } = useOSState();
  const reduced = useOsReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const at = useRef<{ x: number; y: number } | null>(null);
  const active = island.mode === "tour" && layoutMode === "desktop" && !reduced;
  const step = island.activeTourStep ?? 0;

  useEffect(() => {
    if (!active) {
      // Only a dot that was shown fades out; on a fresh page there is nothing to hide.
      if (at.current) dot.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
      at.current = null;
      return;
    }
    const appId = RECRUITER_TOUR_STEPS[step]?.appId;
    let cancelled = false;
    // Let the tour arrange its windows first.
    const id = window.setTimeout(() => {
      const win = document.querySelector<HTMLElement>(`[aria-labelledby="window-title-${appId}"]`);
      if (cancelled || !win || !dot.current || !ring.current) return;
      const r = win.getBoundingClientRect();
      const to = { x: r.left + 26, y: r.top + 22 };
      // From where it last was, or rising from the AI island at the bottom of the screen.
      const from = at.current ?? { x: window.innerWidth / 2, y: window.innerHeight - 40 };
      const lift = Math.min(160, Math.hypot(to.x - from.x, to.y - from.y) * 0.3);
      const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
      const place = (p: { x: number; y: number }, s = 1) => `translate(${p.x - SIZE / 2}px, ${p.y - SIZE / 2}px) scale(${s})`;
      at.current = to;
      dot.current.animate(
        [
          { transform: place(from, 0.8), opacity: 1 },
          { transform: place(mid, 1.15), opacity: 1, offset: 0.5 },
          { transform: place(to, 1), opacity: 1 },
        ],
        { duration: 760, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
      );
      // On arrival the dot opens into a ring that traces the window, then lets it go.
      ring.current.animate(
        [
          { left: `${to.x - SIZE / 2}px`, top: `${to.y - SIZE / 2}px`, width: `${SIZE}px`, height: `${SIZE}px`, borderRadius: `${SIZE}px`, opacity: 0 },
          { opacity: 1, offset: 0.08 },
          { left: `${r.left - 6}px`, top: `${r.top - 6}px`, width: `${r.width + 12}px`, height: `${r.height + 12}px`, borderRadius: "22px", opacity: 0.9, offset: 0.55 },
          { left: `${r.left - 10}px`, top: `${r.top - 10}px`, width: `${r.width + 20}px`, height: `${r.height + 20}px`, borderRadius: "26px", opacity: 0 },
        ],
        { duration: 1100, delay: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    }, 420);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [active, step]);

  if (layoutMode !== "desktop") return null;
  return (
    <div className="td-root" aria-hidden>
      <div ref={ring} className="td-ring" />
      <div ref={dot} className="td-dot" style={{ opacity: 0 }} />
    </div>
  );
}
