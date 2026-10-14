"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useInViewOnce } from "./use-in-view";

/** A wrapper that gains `.is-in` the first time it is seen, which starts its children's CSS motion. */
export function InView({ className, children, threshold }: { className?: string; children: ReactNode; threshold?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(root, threshold);
  return <div ref={root} className={cn(className, seen && "is-in")}>{children}</div>;
}
