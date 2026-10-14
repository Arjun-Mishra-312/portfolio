"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProjectId } from "@/lib/arjun-os/types";
import { getProject } from "@/lib/arjun-os/portfolio-data";

/** Each project's colour field, from the films (Roadpack blue, Mune violet, UBC blue for the research). */
export const BRAND_FIELDS: Record<ProjectId, { stops: [string, string, string]; icon?: string }> = {
  roadpack: { stops: ["#4AA8FF", "#1E62DA", "#08245E"], icon: "/roadpack/surfaces/icon.png" },
  mune: { stops: ["#A26BFF", "#5B2BF0", "#1E0A6E"], icon: "/editorial/mune-icon.webp" },
  "ai-accessibility-analyzer": { stops: ["#3D86E8", "#0055B7", "#001A3D"] },
  buildstory: { stops: ["#FFB066", "#F2650A", "#4A1A00"] },
  "llm-pro-max": { stops: ["#8C9CFF", "#4252D9", "#121640"] },
  "re-plate": { stops: ["#6FD6C3", "#1F8A7A", "#0A2E2A"] },
};

const EVENT = "arjun-os-brand-open";
type Request = { from: DOMRect; projectId: ProjectId; run: () => void; key: number };

const prefersReduced = () =>
  document.documentElement.dataset.reduceMotion === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Open a project the way the films do: its colour floods out of the card that was pressed, fills the
 * window with the project's name, then folds away to reveal the case study. Without motion, it just opens.
 */
export function brandOpen(from: Element | null, projectId: ProjectId, run: () => void) {
  if (!from || prefersReduced() || typeof Element.prototype.animate !== "function") { run(); return; }
  window.dispatchEvent(new CustomEvent<Omit<Request, "key">>(EVENT, { detail: { from: from.getBoundingClientRect(), projectId, run } }));
}

/** Where the case study will appear: the Work window on the desktop, the app area on phones and tablets. */
function targetRect(): DOMRect {
  const win = document.querySelector<HTMLElement>('[aria-labelledby="window-title-work"]');
  if (win?.offsetParent) {
    const parent = (win.offsetParent as HTMLElement).getBoundingClientRect();
    return new DOMRect(parent.left + win.offsetLeft, parent.top + win.offsetTop, win.offsetWidth, win.offsetHeight);
  }
  const main = document.querySelector<HTMLElement>("#os-workspace main") ?? document.body;
  return main.getBoundingClientRect();
}

const inset = (r: DOMRect, round: number) =>
  `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round ${round}px)`;
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function BrandTransitionHost() {
  const [request, setRequest] = useState<Request | null>(null);
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<Omit<Request, "key">>).detail;
      counter.current += 1;
      setRequest({ ...detail, key: counter.current });
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  useLayoutEffect(() => {
    if (!request || !frame.current || !field.current || !mark.current) return;
    // The frame clips to the card, then the window; the field inside it folds away as an iris.
    const box = frame.current, el = field.current, label = mark.current;
    let ran = false;
    const run = () => { if (!ran) { ran = true; request.run(); } };
    let cancelled = false;

    (async () => {
      try {
        const from = request.from;
        box.style.clipPath = inset(from, 24);
        // 1 · the colour floods the card it came from.
        await box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: "ease-out", fill: "forwards" }).finished;
        run();
        await nextFrame(); await nextFrame();
        if (cancelled) return;
        // 2 · and expands to fill the window, carrying the name to its centre.
        const to = targetRect();
        // Light the field from the window's own top-left, as the films' colour cards are.
        const [a, b, c] = BRAND_FIELDS[request.projectId].stops;
        el.style.background = `radial-gradient(${to.width * 1.2}px ${to.height * 1.1}px at ${to.left + to.width * 0.28}px ${to.top + to.height * 0.18}px, ${a} 0%, ${b} 45%, ${c} 100%)`;
        const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
        label.style.left = `${to.left + to.width / 2}px`;
        label.style.top = `${to.top + to.height / 2}px`;
        const grow = { duration: 520, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" as const };
        box.animate([{ clipPath: inset(from, 24) }, { clipPath: inset(to, 16) }], grow);
        await label.animate([
          { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.72)`, opacity: 0, filter: "blur(8px)" },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1, filter: "blur(0px)" },
        ], grow).finished;
        // 3 · a beat on the name, then the field folds away to the case study (the films' iris).
        await wait(260);
        if (cancelled) return;
        const cx = to.left + to.width / 2, cy = to.top + to.height * 0.42;
        const radius = Math.hypot(to.width, to.height) * 0.62;
        label.animate([{ opacity: 1, filter: "blur(0px)", transform: "translate(-50%, -50%) scale(1)" }, { opacity: 0, filter: "blur(10px)", transform: "translate(-50%, -50%) scale(0.92)" }], { duration: 300, easing: "ease-in", fill: "forwards" });
        await el.animate([
          { clipPath: `circle(${radius}px at ${cx}px ${cy}px)`, opacity: 1 },
          { clipPath: `circle(${radius * 0.42}px at ${cx}px ${cy}px)`, opacity: 1, offset: 0.6 },
          { clipPath: `circle(0px at ${cx}px ${cy}px)`, opacity: 0 },
        ], { duration: 560, easing: "cubic-bezier(0.37, 0, 0.63, 1)", fill: "forwards" }).finished;
      } catch {
        // An interrupted animation must never block the navigation.
      } finally {
        run();
        if (!cancelled) setRequest((current) => (current?.key === request.key ? null : current));
      }
    })();
    return () => { cancelled = true; run(); };
  }, [request]);

  if (!ready || !request) return null;
  const brand = BRAND_FIELDS[request.projectId];
  const project = getProject(request.projectId);
  const [a, b, c] = brand.stops;
  return createPortal(
    <div className="bt-root" aria-hidden>
      <div ref={frame} className="bt-frame" style={{ opacity: 0 }}>
        <div ref={field} className="bt-field" style={{ background: `radial-gradient(120% 110% at 28% 18%, ${a} 0%, ${b} 45%, ${c} 100%)` }} />
      </div>
      <div ref={mark} className="bt-mark" style={{ opacity: 0 }}>
        {brand.icon && (
          // eslint-disable-next-line @next/next/no-img-element -- a 300 ms overlay; next/image would only add a wrapper
          <img src={brand.icon} alt="" width={72} height={72} />
        )}
        <strong>{project?.title}</strong>
        <span>{project?.label}</span>
      </div>
    </div>,
    document.body,
  );
}
