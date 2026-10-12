"use client";

import { useMemo, useRef } from "react";
import type { FieldPlace } from "@/lib/arjun-os/field-notes";
import { clamp01, easeInOut, useFrameLoop } from "./use-frame-loop";

const HOLD = 0.9;

function segmentPath(from: FieldPlace, to: FieldPlace, ocean: boolean) {
  if (ocean) return `M${from.x} ${from.y} C 640 -30, 330 -30, ${to.x} ${to.y}`;
  return `M${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 36} ${to.x} ${to.y}`;
}

/**
 * A schematic flight path through every place the camera has been (east to west, not an itinerary).
 * Pins are buttons; the selected place stays highlighted while the drone keeps flying the route.
 */
export function PlacesMap({ places, selected, onSelect }: { places: FieldPlace[]; selected: string; onSelect: (id: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const segments = useRef<(SVGPathElement | null)[]>([]);
  const trail = useRef<SVGPathElement>(null);
  const drone = useRef<SVGGElement>(null);
  const paths = useMemo(() => places.slice(1).map((place, index) => segmentPath(places[index], place, place.id === "seoul")), [places]);
  const weights = useMemo(() => paths.map((_, index) => (places[index + 1].id === "seoul" ? 3.4 : 1.3)), [paths, places]);

  useFrameLoop(root, (t) => {
    const cycle = weights.reduce((sum, w) => sum + w + HOLD, 0);
    let time = t % cycle;
    let index = 0;
    while (index < weights.length - 1 && time > weights[index] + HOLD) {
      time -= weights[index] + HOLD;
      index += 1;
    }
    const segment = segments.current[index];
    if (!segment) return;
    const progress = easeInOut(clamp01((time - HOLD) / weights[index]));
    const length = segment.getTotalLength();
    const point = segment.getPointAtLength(progress * length);
    drone.current?.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
    let d = paths.slice(0, index).join(" ");
    for (let step = 0; step <= 30; step += 1) {
      const p = segment.getPointAtLength((progress * length * step) / 30);
      d += ` ${step ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    trail.current?.setAttribute("d", d);
  }, 30);

  return (
    <div ref={root} className="mo-stage fn-map">
      <div className="fn-map-canvas">
      <svg viewBox="0 0 960 250" aria-hidden>
        <defs>
          <pattern id="fn-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" className="fn-dot" /></pattern>
        </defs>
        <rect width="960" height="250" fill="url(#fn-dots)" />
        <text x="560" y="236" textAnchor="middle" className="mo-label-dim">Pacific</text>
        {paths.map((d, index) => <path key={d} ref={(el) => { segments.current[index] = el; }} d={d} className="fn-route" />)}
        <path ref={trail} className="fn-trail" />
        <g ref={drone}><circle r="5" className="mo-dot-accent" /><circle r="11" className="mo-ring" opacity=".5" /></g>
      </svg>
      <div className="fn-pins">
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            className={"fn-pin" + (place.id === selected ? " is-selected" : "") + (place.labelAbove ? " is-above" : "")}
            style={{ left: `${(place.x / 960) * 100}%`, top: `${(place.y / 250) * 100}%` }}
            aria-pressed={place.id === selected}
            onClick={() => onSelect(place.id)}
          >
            <span className="fn-pin-dot" aria-hidden />
            <span className="fn-pin-label">{place.name}</span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
