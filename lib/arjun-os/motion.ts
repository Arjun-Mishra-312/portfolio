"use client";

import { useReducedMotion, type Transition, type Variants } from "motion/react";
import { useOSState } from "./os-context";

export const OS_EASE = [0.22, 1, 0.36, 1] as const;
export const OS_EASE_IN = [0.32, 0, 0.67, 0] as const;
export const OS_SPRING = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.8 };
export const OS_SPRING_SOFT = { type: "spring" as const, stiffness: 250, damping: 26, mass: 0.92 };
export const OS_SPRING_CINEMATIC = { type: "spring" as const, stiffness: 210, damping: 24, mass: 1 };
export const OS_LAYOUT_TRANSITION: Transition = { ...OS_SPRING_SOFT };

export const OS_DURATION = {
  micro: 0.16,
  component: 0.32,
  layout: 0.48,
  cinematic: 0.82,
} as const;

export const OS_BLUR = {
  enter: 10,
  subtle: 4,
} as const;

export function useOsReducedMotion() {
  const system = useReducedMotion();
  const { accessibility } = useOSState();
  return Boolean(system || accessibility.reduceMotion);
}

export function windowOpenVariants(reduced: boolean, dockOffset = { x: 0, y: 28 }): Variants {
  if (reduced) {
    return {
      initial: { opacity: 0, scale: 1, x: 0, y: 0 },
      portal: { opacity: 0, scale: 1, x: 0, y: 0 },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.12 } },
      minimized: { opacity: 0, scale: 1, x: 0, y: 0, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  return {
    initial: { opacity: 0, scale: 0.94, x: 0, y: 16 },
    portal: { opacity: 0, scale: 0.06, x: dockOffset.x, y: dockOffset.y },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.48, ease: OS_EASE, opacity: { duration: 0.2 } },
    },
    minimized: {
      opacity: 0,
      scale: 0.06,
      x: dockOffset.x,
      y: dockOffset.y,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.16, delay: 0.3 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      x: 0,
      y: 10,
      transition: { duration: 0.2, ease: OS_EASE_IN },
    },
  };
}

export function dockItemTransition(reduced: boolean): Transition {
  if (reduced) return { duration: 0.01 };
  return { type: "spring", stiffness: 500, damping: 28 };
}

export function islandTransition(reduced: boolean): Transition {
  if (reduced) return { duration: 0.15 };
  // Snappy but controlled — high bounce breaks large artifact→pill morphs
  return { type: "spring", stiffness: 320, damping: 34, mass: 0.85 };
}

export function islandContentTransition(reduced: boolean): Transition {
  if (reduced) return { duration: 0.12 };
  return { type: "spring", stiffness: 380, damping: 32, mass: 0.8, delay: 0.04 };
}

export function islandCloseTransition(reduced: boolean): Transition {
  if (reduced) return { duration: 0.08 };
  return { duration: 0.18, ease: OS_EASE };
}

export function stateTransition(reduced: boolean, duration = OS_DURATION.component): Transition {
  return reduced ? { duration: 0.12 } : { duration, ease: OS_EASE };
}

export function staggerContainer(reduced: boolean, stagger = 0.045, delay = 0.04): Variants {
  return {
    initial: {},
    animate: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } },
    exit: { transition: { staggerChildren: reduced ? 0 : stagger / 2, staggerDirection: -1 } },
  };
}

export function cinematicItem(reduced: boolean): Variants {
  return reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12, filter: `blur(${OS_BLUR.subtle}px)` },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.36, ease: OS_EASE } },
        exit: { opacity: 0, y: -6, filter: `blur(${OS_BLUR.subtle}px)`, transition: { duration: 0.2 } },
      };
}

export function staggerChildren(reduced: boolean, delay = 0.04) {
  if (reduced) return { staggerChildren: 0, delayChildren: 0 };
  return { staggerChildren: delay, delayChildren: 0.06 };
}

export const fadeUpItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: OS_EASE } },
};

export function getDockOrigin(appId: string): { x: number; y: number } | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(`dock-${appId}`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
