"use client";

import { useEffect, useRef } from "react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { cn } from "@/utils/cn";

/**
 * A short muted loop that only downloads and plays while it is on screen. Under reduced motion it
 * stays on its poster with native controls, so nothing moves until the visitor asks.
 */
export function LoopVideo({ src, poster, label, portrait, className }: { src: string; poster: string; label: string; portrait?: boolean; className?: string }) {
  const reduced = useOsReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => undefined);
      else element.pause();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={video}
      className={cn("fn-video", portrait && "is-portrait", className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      controls={reduced}
      aria-label={label}
    />
  );
}
