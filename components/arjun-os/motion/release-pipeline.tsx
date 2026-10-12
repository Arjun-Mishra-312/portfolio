"use client";

import { useRef } from "react";
import { MotionFigure } from "./motion-figure";
import { useFrameLoop } from "./use-frame-loop";

const STAGES = [
  ["Windows PC", "git push"],
  ["GitHub Actions", "macOS runner"],
  ["Keychain", "from secrets"],
  ["xcodebuild", "archive"],
  ["ASC API", "upload"],
  ["App Store", "release"],
] as const;

const LOG = [
  "$ git push origin main              # from Windows",
  "→ runs-on: macos · fresh runner, empty keychain",
  "→ import signing identity from secrets → temporary keychain",
  "→ xcodebuild archive · build number from the App Store Connect API",
  "→ upload to App Store Connect · TestFlight",
  "✓ keychain deleted · build ready for review",
];

const CYCLE = 9;
const X = STAGES.map((_, index) => 60 + index * 104);

/** The Windows → App Store release path, one stage at a time, with the matching runner log. */
export function ReleasePipeline() {
  const root = useRef<HTMLDivElement>(null);
  const packet = useRef<SVGCircleElement>(null);
  const nodes = useRef<(SVGCircleElement | null)[]>([]);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);

  useFrameLoop(root, (t) => {
    const phase = (t % CYCLE) / CYCLE;
    const progress = Math.min(1, phase / 0.85);
    const reached = Math.floor(progress * (STAGES.length - 1) + 1e-6);
    packet.current?.setAttribute("cx", (X[0] + (X[X.length - 1] - X[0]) * progress).toFixed(1));
    nodes.current.forEach((node, index) => {
      const done = index === STAGES.length - 1 && phase > 0.85;
      node?.setAttribute("class", done ? "mo-node is-done" : index <= reached ? "mo-node is-active" : "mo-node");
    });
    lines.current.forEach((line, index) => {
      if (line) line.hidden = index > reached;
    });
  }, 8.5);

  return (
    <div ref={root}>
      <MotionFigure title="Shipping iOS from Windows" note="Release path, simplified" className="mo-pipeline">
        <svg viewBox="0 0 640 120" role="img" aria-label="A release moves from a Windows PC through a GitHub Actions macOS runner, a temporary signing keychain, an Xcode archive and App Store Connect to the App Store.">
          <line x1={X[0]} y1="56" x2={X[X.length - 1]} y2="56" className="mo-wire" />
          {STAGES.map(([name, detail], index) => (
            <g key={name} className="mo-stage-label mo-small-type">
              <circle ref={(el) => { nodes.current[index] = el; }} cx={X[index]} cy="56" r="11" className="mo-node" />
              <text x={X[index]} y="28" textAnchor="middle" className="mo-label">{name}</text>
              <text x={X[index]} y="92" textAnchor="middle" className="mo-label-dim">{detail}</text>
            </g>
          ))}
          <circle ref={packet} cx={X[0]} cy="56" r="6" className="mo-dot-accent" />
        </svg>
        <pre className="mo-term" aria-label="Runner log">
          {LOG.map((line, index) => (
            <span key={line} ref={(el) => { lines.current[index] = el; }} className={index === LOG.length - 1 ? "is-ok" : undefined}>{line + "\n"}</span>
          ))}
        </pre>
      </MotionFigure>
    </div>
  );
}
