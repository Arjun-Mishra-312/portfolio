"use client";

import { useRef } from "react";
import { MotionFigure } from "./motion-figure";
import { clamp01, easeInOut, useFrameLoop } from "./use-frame-loop";

const CYCLE = 12;
const BAR = { x: 40, y: 92, width: 220, height: 26 };

/**
 * Mune's on-device assistant in two beats: 4-bit weights let a 4-billion-parameter model fit in the
 * iPhone's memory, then the small model calls a finance tool instead of describing one. Illustrative;
 * the dollar amount is an example.
 */
export function ModelFit() {
  const root = useRef<HTMLDivElement>(null);
  const big = useRef<SVGGElement>(null);
  const small = useRef<SVGGElement>(null);
  const steps = useRef<(SVGGElement | null)[]>([]);

  useFrameLoop(root, (t) => {
    const phase = (t % CYCLE) / CYCLE;
    // Beat 1: full-precision weights overflow the budget, then the same model at 4-bit docks.
    const bigIn = easeInOut(clamp01(phase / 0.12)) * (1 - easeInOut(clamp01((phase - 0.2) / 0.1)));
    big.current?.setAttribute("transform", `translate(${(-36 + bigIn * 36).toFixed(1)} 0)`);
    big.current?.setAttribute("opacity", bigIn.toFixed(2));
    big.current?.setAttribute("class", bigIn > 0.95 ? "mo-chip is-over" : "mo-chip");
    const smallIn = easeInOut(clamp01((phase - 0.28) / 0.12));
    small.current?.setAttribute("transform", `translate(${(-36 + smallIn * 36).toFixed(1)} 0)`);
    small.current?.setAttribute("opacity", smallIn.toFixed(2));
    small.current?.setAttribute("class", smallIn > 0.98 ? "mo-chip is-fit" : "mo-chip");
    // Beat 2: question → narrated reply (rejected) → retry → tool call → grounded answer.
    const shows = [0.45, 0.55, 0.66, 0.74, 0.83];
    steps.current.forEach((step, index) => step?.setAttribute("opacity", phase >= shows[index] || phase < 0.02 ? "1" : "0.08"));
  }, 11.6);

  const step = (index: number) => (el: SVGGElement | null) => { steps.current[index] = el; };

  return (
    <div ref={root}>
      <MotionFigure title="A 4B model on the iPhone, and a tool call that happens" note="Illustrative; the amount is an example">
        <svg viewBox="0 0 640 210" role="img" aria-label="Qwen3.5 4B at full precision is too big for the iPhone's memory budget and backs out; the same model with 4-bit weights fits and runs with MLX. Then the assistant first describes a tool call instead of making it, a retry asks for a real tool call, and the answer comes from the tool's result.">
          <text x={BAR.x} y="40" className="mo-label">iPhone · Apple MLX</text>
          <text x={BAR.x} y="58" className="mo-label-dim">memory budget for the model</text>
          <rect x={BAR.x} y={BAR.y} width={BAR.width} height={BAR.height} rx="6" className="mo-budget" />
          <g ref={big} className="mo-chip">
            <rect x={BAR.x + 4} y={BAR.y + 4} width={BAR.width + 60} height={BAR.height - 8} rx="4" />
            <text x={BAR.x + 12} y={BAR.y + 17}>Qwen3.5 4B · full precision</text>
          </g>
          <g ref={small} className="mo-chip">
            <rect x={BAR.x + 4} y={BAR.y + 4} width="150" height={BAR.height - 8} rx="4" />
            <text x={BAR.x + 12} y={BAR.y + 17}>Qwen3.5 4B · 4-bit</text>
          </g>
          <text x={BAR.x} y="150" className="mo-label-dim">4-bit weights fit on the phone</text>

          <g transform="translate(330 22)">
            <g ref={step(0)}><rect width="270" height="26" rx="13" className="mo-bubble-user" /><text x="12" y="17" className="mo-label">How much can I spend this week?</text></g>
            <g ref={step(1)} transform="translate(0 36)"><rect width="270" height="26" rx="13" className="mo-bubble" /><text x="12" y="17" className="mo-label">“I’ll check your budgets for you…”</text></g>
            <g ref={step(2)} transform="translate(0 72)"><text x="12" y="16" className="mo-label-alert">described it</text><text x="104" y="16" className="mo-label-accent">↻ retry with a tool call</text></g>
            <g ref={step(3)} transform="translate(0 92)"><rect width="190" height="24" rx="5" className="mo-tool" /><text x="12" y="16" className="mo-label">spending tool → $212</text></g>
            <g ref={step(4)} transform="translate(0 128)"><rect width="270" height="26" rx="13" className="mo-bubble" /><text x="12" y="17" className="mo-label">You have $212 left this week.</text><text x="12" y="44" className="mo-label-dim">number taken from the tool result</text></g>
          </g>
        </svg>
      </MotionFigure>
    </div>
  );
}
