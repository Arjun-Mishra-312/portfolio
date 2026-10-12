"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";

/**
 * Drives an imperative SVG animation without re-rendering React every frame.
 * `draw` receives elapsed seconds. The loop only runs while the figure is on screen, and
 * under reduced motion it draws the single `stillAt` frame, which must read on its own.
 */
export function useFrameLoop(target: RefObject<Element | null>, draw: (seconds: number) => void, stillAt: number) {
  const reduced = useOsReducedMotion();
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const element = target.current;
    drawRef.current(stillAt);
    if (reduced || !element) return;

    let frame = 0;
    let last = 0;
    let elapsed = stillAt;
    const tick = (now: number) => {
      if (last) elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      drawRef.current(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, stillAt, target]);

  return reduced;
}

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const easeInOut = (value: number) => (value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2);
