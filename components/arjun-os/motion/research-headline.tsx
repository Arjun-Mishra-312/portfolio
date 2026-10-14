"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useInViewOnce } from "./use-in-view";

// Recall on the 78 reference-positive cases (preprint v2): the 40 criterion agents vs axe-core.
const RINGS = [
  { value: 86, exact: 85.9, label: "40 criterion agents", detail: "67 of 78", lead: true },
  { value: 36, exact: 35.9, label: "axe-core", detail: "28 of 78" },
] as const;
const R = 52;
const C = 2 * Math.PI * R;

function CountUp({ to, run }: { to: number; run: boolean }) {
  const reduced = useOsReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!run) return;
    if (reduced) { setValue(to); return; }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, reduced, to]);
  return <>{value}</>;
}

/** The film's research beat: two recall rings that count up, beside the chip of forty agents. */
export function ResearchHeadline() {
  const root = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(root, 0.4);
  return (
    <section ref={root} className={"rh-stage" + (seen ? " is-in" : "")} aria-labelledby="research-headline">
      <div className="rh-copy">
        <p className="pf-eyebrow">The headline result</p>
        <h3 id="research-headline">Forty agents found <span className="rh-accent">86%</span> of real issues. A standard checker? 36%.</h3>
        <p className="rh-foot">Recall on 78 reference-positive cases, at 56% precision. axe-core is the standard rule-based checker. Public preprint v2.</p>
      </div>
      <div className="rh-visuals">
        <div className="rh-rings">
          {RINGS.map((ring, index) => (
            <figure key={ring.label} className={"rh-ring" + ("lead" in ring ? " is-lead" : "")} style={{ "--rh-delay": `${index * 220}ms` } as CSSProperties}>
              <svg viewBox="0 0 120 120" role="img" aria-label={`${ring.label}: ${ring.value}% recall, ${ring.detail}`}>
                <circle className="rh-track" cx="60" cy="60" r={R} />
                <circle className="rh-arc" cx="60" cy="60" r={R} strokeDasharray={C} style={{ "--rh-off": `${C * (1 - ring.exact / 100)}`, "--rh-full": `${C}` } as CSSProperties} />
              </svg>
              <span className="rh-value" aria-hidden><CountUp to={ring.value} run={seen} />%</span>
              <figcaption><strong>{ring.label}</strong><span>{ring.detail}</span></figcaption>
            </figure>
          ))}
        </div>
        <figure className="rh-chip" aria-label="An accessibility chip with 40 cores: 40 WCAG-specific agents sharing a 31-tool library">
          <svg viewBox="0 0 200 200" aria-hidden>
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} className="rh-pins">
                <rect x={36 + i * 15} y="10" width="6" height="16" rx="2" />
                <rect x={36 + i * 15} y="174" width="6" height="16" rx="2" />
                <rect x="10" y={36 + i * 15} width="16" height="6" rx="2" />
                <rect x="174" y={36 + i * 15} width="16" height="6" rx="2" />
              </g>
            ))}
            <rect className="rh-package" x="24" y="24" width="152" height="152" rx="18" />
            <rect className="rh-die" x="40" y="40" width="120" height="120" rx="10" />
            {Array.from({ length: 40 }, (_, i) => {
              const col = i % 5, row = Math.floor(i / 5);
              return <rect key={i} className="rh-core" x={50 + col * 21} y={46 + row * 13.6} width="16" height="9.6" rx="2.4" style={{ "--rh-i": i } as CSSProperties} />;
            })}
          </svg>
          <figcaption><strong>40 agents</strong><span>one per WCAG requirement · 31 shared tools</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
