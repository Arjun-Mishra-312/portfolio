"use client";

import { useEffect, useState, type RefObject } from "react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";

/** True once the element has been on screen (and immediately under reduced motion, so nothing waits to appear). */
export function useInViewOnce(target: RefObject<Element | null>, threshold = 0.35) {
  const reduced = useOsReducedMotion();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (reduced) { setSeen(true); return; }
    const element = target.current;
    if (!element || seen) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, seen, target, threshold]);
  return seen;
}
