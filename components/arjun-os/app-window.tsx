"use client";

import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { EDGE_SNAP_THRESHOLD, MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "@/lib/arjun-os/constants";
import { getDockOrigin, useOsReducedMotion, windowOpenVariants } from "@/lib/arjun-os/motion";
import { APP_META, type AppId, type Bounds } from "@/lib/arjun-os/types";
import { cn } from "@/utils/cn";
import { WindowControls } from "./primitives";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function applyResize(edge: ResizeEdge, origin: Bounds, mx: number, my: number): Bounds {
  let { x, y, width, height } = origin;
  if (edge.includes("e")) width = origin.width + mx;
  if (edge.includes("s")) height = origin.height + my;
  if (edge.includes("w")) {
    width = origin.width - mx;
    x = origin.x + mx;
  }
  if (edge.includes("n")) {
    height = origin.height - my;
    y = origin.y + my;
  }
  width = Math.max(MIN_WINDOW_WIDTH, width);
  height = Math.max(MIN_WINDOW_HEIGHT, height);
  return { x, y, width, height };
}

function ResizeHandle({
  edge,
  onResize,
  disabled,
}: {
  edge: ResizeEdge;
  onResize: (edge: ResizeEdge, mx: number, my: number, last: boolean) => void;
  disabled?: boolean;
}) {
  const bind = useDrag(
    ({ movement: [mx, my], last, event }) => {
      event?.stopPropagation();
      onResize(edge, mx, my, last);
    },
    { filterTaps: true },
  );

  if (disabled) return null;

  const cursorMap: Record<ResizeEdge, string> = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
    sw: "nesw-resize",
  };

  const positionMap: Record<ResizeEdge, string> = {
    n: "left-3 right-3 top-0 h-2",
    s: "left-3 right-3 bottom-0 h-2",
    e: "top-3 bottom-3 right-0 w-2",
    w: "top-3 bottom-3 left-0 w-2",
    ne: "right-0 top-0 h-3 w-3",
    nw: "left-0 top-0 h-3 w-3",
    se: "right-0 bottom-0 h-3 w-3",
    sw: "left-0 bottom-0 h-3 w-3",
  };

  return (
    <div
      {...bind()}
      className={cn("absolute z-20 touch-none", positionMap[edge])}
      style={{ cursor: cursorMap[edge] }}
      aria-hidden
    />
  );
}

export function AppWindow({
  appId,
  children,
}: {
  appId: AppId;
  children: React.ReactNode;
}) {
  const { windows, activeAppId, workArea, isMobile, accessibility } = useOSState();
  const { dispatch, focusApp, closeApp, minimizeApp, maximizeApp } = useOSActions();
  const reduced = useOsReducedMotion();
  const win = windows[appId];
  const dragOrigin = useRef({ x: 0, y: 0 });
  const resizeOrigin = useRef<Bounds | null>(null);
  const windowRef = useRef<HTMLElement>(null);
  const [transformOrigin, setTransformOrigin] = useState("50% 100%");
  const variants = windowOpenVariants(reduced || accessibility.reduceMotion);

  useEffect(() => {
    if (win.mode === "minimized") windowRef.current?.setAttribute("inert", "");
    else windowRef.current?.removeAttribute("inert");
  }, [win.mode]);

  useEffect(() => {
    const origin = getDockOrigin(appId);
    if (origin) setTransformOrigin(`${origin.x - win.bounds.x}px ${origin.y - win.bounds.y}px`);
  }, [appId, win.bounds.x, win.bounds.y]);

  const bind = useDrag(
    ({ first, last, movement: [mx, my], xy: [px], event, cancel }) => {
      if (isMobile || win.mode === "maximized") {
        cancel();
        return;
      }
      event?.stopPropagation();
      if (first) {
        focusApp(appId);
        dragOrigin.current = { x: win.bounds.x, y: win.bounds.y };
      }

      const next = {
        ...win.bounds,
        x: dragOrigin.current.x + mx,
        y: dragOrigin.current.y + my,
      };
      dispatch({ type: "MOVE_WINDOW", appId, bounds: next });

      const relativeX = px - workArea.left;
      if (relativeX < EDGE_SNAP_THRESHOLD) {
        dispatch({ type: "SET_SNAP_PREVIEW", preview: "left" });
      } else if (relativeX > workArea.width - EDGE_SNAP_THRESHOLD) {
        dispatch({ type: "SET_SNAP_PREVIEW", preview: "right" });
      } else {
        dispatch({ type: "SET_SNAP_PREVIEW", preview: null });
      }

      if (last) {
        if (relativeX < EDGE_SNAP_THRESHOLD) {
          dispatch({ type: "SNAP_APP", appId, side: "left" });
        } else if (relativeX > workArea.width - EDGE_SNAP_THRESHOLD) {
          dispatch({ type: "SNAP_APP", appId, side: "right" });
        } else {
          dispatch({ type: "SET_SNAP_PREVIEW", preview: null });
        }
      }
    },
    { filterTaps: true, pointer: { capture: true } },
  );

  const onResize = (edge: ResizeEdge, mx: number, my: number, last: boolean) => {
    if (!resizeOrigin.current) resizeOrigin.current = { ...win.bounds };
    const next = applyResize(edge, resizeOrigin.current, mx, my);
    dispatch({ type: "RESIZE_WINDOW", appId, bounds: next });
    if (last) resizeOrigin.current = null;
  };

  if (!win.isOpen || (isMobile && win.mode === "minimized")) return null;

  const isActive = activeAppId === appId;
  const titleId = `window-title-${appId}`;
  const statusId = `window-status-${appId}`;
  const canResize = !isMobile && win.mode !== "maximized" && workArea.width >= 1200;

  if (isMobile) {
    return (
      <section
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={statusId}
        aria-modal="false"
        className="os-window absolute inset-x-0 bottom-0 top-[54px] z-30 flex flex-col rounded-none border-0"
        onMouseDown={() => focusApp(appId)}
      >
        <header className="flex h-12 items-center justify-between border-b border-os-hairline px-3">
          <span id={statusId} className="sr-only">Active application window</span>
          <h2 id={titleId} className="text-sm font-medium text-[var(--os-text-primary)]">
            {APP_META[appId].title}
          </h2>
          <WindowControls
            onMinimize={() => minimizeApp(appId)}
            onMaximize={() => maximizeApp(appId)}
            onClose={() => closeApp(appId)}
            showMaximize={false}
          />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</div>
      </section>
    );
  }

  return (
    <motion.section
      ref={windowRef}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={statusId}
      className={cn(
        "os-window absolute flex flex-col overflow-hidden rounded-2xl",
        isActive ? "os-window-active" : "os-window-inactive",
      )}
      style={{
        left: win.bounds.x,
        top: win.bounds.y,
        width: win.bounds.width,
        height: win.bounds.height,
        zIndex: win.zIndex,
        transformOrigin,
      }}
      variants={variants}
      initial="initial"
      animate={
        win.mode === "minimized"
          ? { opacity: 0, scale: 0.12, y: Math.max(40, workArea.height - win.bounds.y), pointerEvents: "none" }
          : "animate"
      }
      exit="exit"
      transition={{ duration: reduced ? 0.12 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={() => focusApp(appId)}
      aria-hidden={win.mode === "minimized"}
      data-active={isActive}
    >
      <span id={statusId} className="sr-only">{isActive ? "Active application window" : "Inactive application window"}</span>
      <header
        className="window-title-rail flex h-11 cursor-grab items-center justify-between border-b border-os-hairline px-3 outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--os-accent-cobalt)]"
        {...bind()}
        tabIndex={0}
        aria-label={`${APP_META[appId].title} window controls. Alt arrows snap, Alt Shift arrows move, Alt Control arrows resize, Alt Enter maximizes, Alt M minimizes.`}
        onKeyDown={(event) => {
          if (!event.altKey) return;
          if (event.shiftKey && event.key.startsWith("Arrow")) {
            event.preventDefault();
            const dx = event.key === "ArrowLeft" ? -20 : event.key === "ArrowRight" ? 20 : 0;
            const dy = event.key === "ArrowUp" ? -20 : event.key === "ArrowDown" ? 20 : 0;
            dispatch({ type: "MOVE_WINDOW", appId, bounds: { ...win.bounds, x: win.bounds.x + dx, y: win.bounds.y + dy } });
            return;
          }
          if (event.ctrlKey && event.key.startsWith("Arrow")) {
            event.preventDefault();
            const dw = event.key === "ArrowLeft" ? -20 : event.key === "ArrowRight" ? 20 : 0;
            const dh = event.key === "ArrowUp" ? -20 : event.key === "ArrowDown" ? 20 : 0;
            dispatch({ type: "RESIZE_WINDOW", appId, bounds: { ...win.bounds, width: win.bounds.width + dw, height: win.bounds.height + dh } });
            return;
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            dispatch({ type: "SNAP_APP", appId, side: "left" });
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            dispatch({ type: "SNAP_APP", appId, side: "right" });
          } else if (event.key === "Enter") {
            event.preventDefault();
            maximizeApp(appId);
          } else if (event.key.toLowerCase() === "m") {
            event.preventDefault();
            minimizeApp(appId);
          }
        }}
      >
        <h2 id={titleId} className="text-sm font-medium text-[var(--os-text-primary)]">
          {APP_META[appId].title}
        </h2>
        <WindowControls
          onMinimize={() => minimizeApp(appId)}
          onMaximize={() => maximizeApp(appId)}
          onClose={() => closeApp(appId)}
          maximized={win.mode === "maximized"}
        />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

      {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeEdge[]).map((edge) => (
        <ResizeHandle key={edge} edge={edge} onResize={onResize} disabled={!canResize} />
      ))}
    </motion.section>
  );
}
