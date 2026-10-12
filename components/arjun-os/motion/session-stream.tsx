"use client";

import { useRef } from "react";
import { MotionFigure } from "./motion-figure";
import { useFrameLoop } from "./use-frame-loop";

const GATE = 320;
const SPEED = 70;
const GAP = 1.4;
const POOL = 7;
const TOKENS = 5;

const sensitive = (chunk: number, token: number) => ((chunk * 7 + token * 3) % 5 + 5) % 5 === 0;

/** BuildStory's scanner: session logs stream through a privacy gate in 64 KB chunks; source files are never opened. */
export function SessionStream() {
  const root = useRef<HTMLDivElement>(null);
  const chunks = useRef<(SVGGElement | null)[]>([]);
  const tokens = useRef<(SVGRectElement | null)[][]>(Array.from({ length: POOL }, () => []));
  const read = useRef<HTMLElement>(null);
  const redacted = useRef<HTMLElement>(null);

  useFrameLoop(root, (t) => {
    const total = Math.floor(t / GAP);
    chunks.current.forEach((group, slot) => {
      const chunk = total - slot;
      const x = (t - chunk * GAP) * SPEED - 80;
      group?.setAttribute("transform", `translate(${x.toFixed(1)} 58)`);
      tokens.current[slot].forEach((token, index) => {
        const past = x + 6 + index * 13 > GATE;
        const state = sensitive(chunk, index) ? (past ? "mo-token is-redacted" : "mo-token is-secret") : "mo-token";
        token?.setAttribute("class", state);
      });
    });
    let count = 0;
    for (let chunk = 0; chunk <= total - 4; chunk += 1) for (let index = 0; index < TOKENS; index += 1) if (sensitive(chunk, index)) count += 1;
    if (read.current) read.current.textContent = String(Math.max(0, total - 3));
    if (redacted.current) redacted.current.textContent = String(count);
  }, 6);

  return (
    <div ref={root}>
      <MotionFigure
        title="Reading sessions, never source"
        note="64 KB streaming chunks"
        readout={<>
          <span>Chunks read <b ref={read}>0</b></span>
          <span>Values redacted <b ref={redacted}>0</b></span>
          <span>Source files opened <b>0</b></span>
        </>}
      >
        <svg viewBox="0 0 640 170" role="img" aria-label="Session log chunks stream through a privacy gate. Sensitive values turn grey after the gate, and the count of source files opened stays at zero.">
          <rect x={GATE - 2} y="18" width="4" height="120" className="mo-gate" />
          <text x={GATE} y="156" textAnchor="middle" className="mo-label-accent">privacy gate</text>
          <text x="20" y="156" className="mo-label-dim">Claude Code · Codex · Cursor · Antigravity</text>
          <text x="620" y="156" textAnchor="end" className="mo-label-dim">report.json</text>
          {Array.from({ length: POOL }, (_, slot) => (
            <g key={slot} ref={(el) => { chunks.current[slot] = el; }}>
              <rect width="76" height="40" rx="4" className="mo-chunk" />
              <text x="6" y="14" className="mo-label-dim mo-label-small">64 KB</text>
              {Array.from({ length: TOKENS }, (_, index) => (
                <rect key={index} ref={(el) => { tokens.current[slot][index] = el; }} x={6 + index * 13} y="22" width="10" height="8" rx="1.5" className="mo-token" />
              ))}
            </g>
          ))}
        </svg>
      </MotionFigure>
    </div>
  );
}
