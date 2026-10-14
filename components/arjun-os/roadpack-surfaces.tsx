"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { cn } from "@/utils/cn";

// Roadpack 1.1 outside the app (build 117): Live Activities with the Dynamic Island, Home and Lock Screen
// widgets, Lock Screen vote buttons, and 18 App Intents (9 App Shortcuts). Siri phrases are the app's own.
const SURFACES = [
  {
    id: "lock",
    label: "Lock Screen",
    title: "The whole pack, on the Lock Screen.",
    body: "A Live Activity keeps the pack’s status, the next stop, and the arrival time in view, updated by push while the phone stays in a pocket. Votes can be cast right from the Lock Screen.",
  },
  {
    id: "island",
    label: "Dynamic Island",
    title: "In any app, in the Dynamic Island.",
    body: "The same Live Activity folds into the Dynamic Island, so the trip and its ETA stay a glance away while someone else navigates or picks the music.",
  },
  {
    id: "siri",
    label: "Siri",
    title: "Or just ask.",
    body: "18 App Intents, 9 of them App Shortcuts: ask when everyone will arrive, what’s next, who’s last, or tell the pack you need coffee.",
  },
] as const;
type SurfaceId = (typeof SURFACES)[number]["id"];

const DWELL = 4600;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.9 };

export function RoadpackSurfaces() {
  const reduced = useOsReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [islandOpen, setIslandOpen] = useState(reduced);
  const surface = SURFACES[index];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Cycle the surfaces while the section is on screen, until the visitor picks one.
  useEffect(() => {
    if (reduced || !auto || !visible) return;
    const id = window.setTimeout(() => setIndex((value) => (value + 1) % SURFACES.length), DWELL);
    return () => window.clearTimeout(id);
  }, [auto, index, reduced, visible]);

  // The island arrives compact, then expands into the Live Activity, as it does on a long-press.
  useEffect(() => {
    if (surface.id !== "island") return;
    if (reduced) { setIslandOpen(true); return; }
    setIslandOpen(false);
    const id = window.setTimeout(() => setIslandOpen(true), 1100);
    return () => window.clearTimeout(id);
  }, [surface.id, reduced]);

  const choose = (next: number) => { setAuto(false); setIndex(next); };

  return (
    <section ref={root} className="rs-section pf-section" aria-labelledby="roadpack-surfaces">
      <div className="rs-copy">
        <p className="pf-eyebrow">Beyond the app</p>
        <h3 id="roadpack-surfaces">It lives where<br />you look.</h3>
        <div className="rs-tabs" role="tablist" aria-label="Where Roadpack appears">
          {SURFACES.map((item, i) => (
            <button key={item.id} type="button" role="tab" aria-selected={i === index} onClick={() => choose(i)} className={cn(i === index && "is-active")}>
              {item.label}
              {i === index && auto && !reduced && visible && <span className="rs-tab-timer" style={{ animationDuration: `${DWELL}ms` }} aria-hidden />}
            </button>
          ))}
        </div>
        <div className="rs-detail" role="tabpanel" aria-live="polite">
          <h4>{surface.title}</h4>
          <p>{surface.body}</p>
        </div>
        <p className="rs-spec">ActivityKit · WidgetKit · App Intents · Home and Lock Screen widgets</p>
      </div>

      <div className="rs-stage">
        <div className="rs-phone" aria-hidden>
          <div className="rs-screen">
            <Image src="/roadpack/surfaces/lockscreen.webp" alt="" fill sizes="280px" className={cn("rs-wall", surface.id !== "lock" && "is-dim")} priority={false} />
            <AnimatePresence initial={false}>
              {surface.id === "lock" && (
                <motion.span key="ring" className="rs-la-ring" initial={reduced ? false : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.5 }} />
              )}
            </AnimatePresence>

            {/* The island: compact pill, or the full Live Activity (18.6% of the screen is its real aspect at 94% width). */}
            <motion.div
              className="rs-island"
              initial={false}
              animate={surface.id === "island" && islandOpen
                ? { left: "3%", top: "1.6%", width: "94%", height: "18.6%", borderRadius: 26 }
                : { left: "33%", top: "2%", width: "34%", height: "4.8%", borderRadius: 16 }}
              transition={reduced ? { duration: 0 } : SPRING}
            >
              <AnimatePresence initial={false}>
                {surface.id === "island" && (islandOpen ? (
                  <motion.div key="open" className="rs-island-open" initial={reduced ? false : { opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.15 }}>
                    <Image src="/roadpack/surfaces/live-activity.webp" alt="" width={884} height={379} sizes="260px" />
                  </motion.div>
                ) : (
                  <motion.div key="compact" className="rs-island-compact" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Image src="/roadpack/surfaces/icon.png" alt="" width={18} height={18} />
                    <span>8:33</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {surface.id === "siri" && (
                <motion.div key="siri" className="rs-siri" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.4 }}>
                  <span className="rs-siri-glow" />
                  <motion.div className="rs-siri-answer" initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 1.2 }}>
                    <Image src="/roadpack/surfaces/icon.png" alt="" width={26} height={26} />
                    <p>Everyone should arrive between 8:31 and 8:36&nbsp;PM.</p>
                  </motion.div>
                  <motion.p className="rs-siri-ask" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.25 }}>
                    “When will everyone arrive in Roadpack?”
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="rs-note">Lock Screen: a real capture from a trip. Island and Siri: recreated from the same Live Activity; times are examples.</p>
      </div>
    </section>
  );
}
