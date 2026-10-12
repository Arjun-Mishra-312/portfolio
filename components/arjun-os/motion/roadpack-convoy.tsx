"use client";

import { useRef } from "react";
import { MotionFigure } from "./motion-figure";
import { useFrameLoop } from "./use-frame-loop";

const ROUTE = "M28 205 C 110 70, 205 230, 300 140 S 455 40, 612 74";
const ROUTE_KM = 38;
const CYCLE = 18;
const CARS = ["A", "B", "C"] as const;

/**
 * Three vehicles on one route. Spread is measured along the road, a regroup point appears once
 * the pack stretches out, and car B loses signal: its votes queue in the outbox and replay once,
 * without duplicates, when it reconnects.
 */
export function RoadpackConvoy() {
  const root = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const spread = useRef<SVGPathElement>(null);
  const regroup = useRef<SVGGElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const cars = useRef<(SVGGElement | null)[]>([]);
  const room = useRef<SVGTextElement>(null);
  const km = useRef<HTMLElement>(null);
  const carB = useRef<HTMLElement>(null);
  const outbox = useRef<HTMLElement>(null);
  const note = useRef<HTMLSpanElement>(null);

  useFrameLoop(root, (t) => {
    const path = route.current;
    if (!path) return;
    const length = path.getTotalLength();
    const at = (f: number) => path.getPointAtLength(Math.max(0, Math.min(1, f)) * length);
    const phase = (t % CYCLE) / CYCLE;
    const lead = 0.26 + 0.68 * phase;
    const tail = 0.05 + 0.14 * Math.sin(phase * Math.PI);
    const positions = [lead, lead - tail * 0.42, lead - tail];
    const offline = phase > 0.32 && phase < 0.56;
    const replaying = phase >= 0.56 && phase < 0.62;
    const queued = offline ? Math.min(3, 1 + Math.floor((phase - 0.32) / 0.07)) : replaying ? 3 : 0;

    positions.forEach((f, index) => {
      const car = cars.current[index];
      if (!car) return;
      const point = at(f);
      car.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      car.setAttribute("class", index === 1 && offline ? "mo-car is-offline" : "mo-car");
    });

    let d = "";
    for (let step = 0; step <= 24; step += 1) {
      const point = at(positions[2] + ((positions[0] - positions[2]) * step) / 24);
      d += `${step ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    }
    spread.current?.setAttribute("d", d);

    const stretched = tail > 0.145;
    regroup.current?.setAttribute("opacity", stretched ? "1" : "0");
    if (stretched) {
      const point = at(lead + 0.07);
      regroup.current?.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      ring.current?.setAttribute("r", (12 + 6 * Math.abs(Math.sin(t * 3))).toFixed(1));
    }

    if (room.current) room.current.textContent = `snapshot v${Math.floor(t * 1.5)} → ${offline ? 2 : 3} phones`;
    if (km.current) km.current.textContent = `${(tail * ROUTE_KM).toFixed(1)} km`;
    if (carB.current) carB.current.textContent = offline ? "offline · tunnel" : "online";
    if (outbox.current) outbox.current.textContent = String(queued);
    if (note.current) {
      note.current.textContent = offline
        ? "votes queued on the phone"
        : replaying
          ? "3 commands replayed · 0 duplicates"
          : stretched
            ? "pack stretched → regroup proposed"
            : "";
    }
  }, 7.2);

  return (
    <div ref={root}>
      <MotionFigure
        title="One trip, one source of truth"
        note="Example route, not live data"
        readout={<>
          <span>Pack spread <b ref={km}>0.0 km</b></span>
          <span>Car B <b ref={carB}>online</b></span>
          <span>Outbox <b ref={outbox}>0</b></span>
          <span ref={note} aria-hidden />
        </>}
      >
        <svg viewBox="0 0 640 250" role="img" aria-label="Three cars travel along a winding route. Pack spread is measured along the road, a regroup point appears when the pack spreads out, and a car that loses signal queues its votes and replays them once it reconnects.">
          <path ref={route} d={ROUTE} className="mo-track-wide" />
          <path d={ROUTE} className="mo-track-dashed" />
          <path ref={spread} className="mo-spread" />
          <g ref={regroup} opacity="0" className="mo-regroup">
            <circle ref={ring} r="16" className="mo-ring" />
            <circle r="6" className="mo-dot-accent" />
            <text y="-24" textAnchor="middle" className="mo-label-accent">regroup here</text>
          </g>
          {CARS.map((name, index) => (
            <g key={name} ref={(el) => { cars.current[index] = el; }} className="mo-car">
              <circle r="12" className="mo-car-halo" />
              <circle r="7" className="mo-car-body" />
              <text y="-14" textAnchor="middle" className="mo-label">{name}</text>
            </g>
          ))}
          <g transform="translate(20 22)" className="mo-label-dim">
            <text>Durable Object · one per trip</text>
            <text ref={room} y="16">snapshot v0 → 3 phones</text>
          </g>
        </svg>
      </MotionFigure>
    </div>
  );
}
