"use client";

import { useEffect, useRef, useState } from "react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { MotionFigure } from "./motion-figure";

// Recall on the 78 reference-positive cases (preprint v2, Fig. recall comparison).
const BARS = [
  { label: "axe-core", value: 35.9, detail: "28/78 · 36%" },
  { label: "VLM, uncued", value: 66.7, detail: "52/78 · 67%" },
  { label: "VLM, cued", value: 74.4, detail: "58/78 · 74%" },
  { label: "40 criterion agents", value: 85.9, detail: "67/78 · 86%", lead: true },
];

/** Recall bars that grow the first time they're seen; they rest at their true widths. */
export function RecallRace() {
  const reduced = useOsReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [grown, setGrown] = useState(true);

  useEffect(() => {
    if (reduced || !root.current) return;
    let played = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played) {
        played = true;
        setRun((value) => value + 1);
      }
    }, { threshold: 0.4 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!run) return;
    setGrown(false);
    const id = window.setTimeout(() => setGrown(true), 60);
    return () => window.clearTimeout(id);
  }, [run]);

  return (
    <div ref={root}>
      <MotionFigure
        title="Recall on 78 reference-positive cases"
        note="Public preprint v2"
        readout={<>
          <span>Precision at that recall <b>56%</b></span>
          <span>Keyboard traps both baselines missed <b>9 of 10 recovered</b></span>
          {!reduced && <button type="button" className="mo-button" onClick={() => setRun((value) => value + 1)}>Replay</button>}
        </>}
      >
        <div className="mo-bars">
          {BARS.map((bar, index) => (
            <div key={bar.label} className={bar.lead ? "mo-bar is-lead" : "mo-bar"}>
              <span>{bar.label}</span>
              <span className="mo-bar-track" aria-hidden>
                <span className="mo-bar-fill" style={{ width: grown ? `${bar.value}%` : "0%", transitionDelay: grown ? `${index * 160}ms` : "0ms" }} />
              </span>
              <span className="mo-bar-value">{bar.detail}</span>
            </div>
          ))}
        </div>
      </MotionFigure>
    </div>
  );
}
