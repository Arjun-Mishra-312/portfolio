"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  Component,
  forwardRef,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import dynamic from "next/dynamic";
import { inferActionsFromAnswer, mapChatActionsToIsland } from "@/lib/arjun-os/action-mapper";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import {
  fadeUpItem,
  islandCloseTransition,
  islandContentTransition,
  islandTransition,
  staggerChildren,
  useOsReducedMotion,
} from "@/lib/arjun-os/motion";
import { RECRUITER_TOUR_STEPS, TOUR_STEP_COUNT } from "@/lib/arjun-os/tour";
import type { WidgetType } from "@/lib/chat-context";
import type { MicroWidget, WidgetPlacement } from "@/types/micro-widgets";
import { ThemeBridge } from "@/lib/theme-context";
import { MicroWidgetRenderer } from "@/components/chat/micro-widgets/micro-widget-renderer";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { IslandMark } from "./icons";
import { cn } from "@/utils/cn";

const WidgetRenderer = dynamic(
  () => import("@/components/chat/widget-renderer").then((m) => m.WidgetRenderer),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-os-fill" /> },
);

const suggestions = ["Strongest project", "Why Arjun?", "Recruiter tour"];

const VALID_WIDGET_TYPES: WidgetType[] = [
  "me",
  "projects",
  "skills",
  "experience",
  "awards",
  "fun",
  "contact",
];

function GooeyBackdrop({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="os-gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="os-island-gooey" aria-hidden>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
    </>
  );
}

function ThinkingPreview({ onCancel }: { onCancel: () => void }) {
  const reduced = useOsReducedMotion();
  return (
    <div className="mt-3 space-y-3" aria-live="polite">
      <div className="os-thinking-orbit" aria-hidden>
        <span className="os-thinking-core" />
        <span className="os-thinking-arc os-thinking-arc-a" />
        <span className="os-thinking-arc os-thinking-arc-b" />
      </div>
      <div className="os-thinking-frame">
        <div className="flex items-center gap-2 border-b border-os-hairline px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-os-fill-strong" />
          <span className="h-2 w-2 rounded-full bg-os-fill-strong" />
          <span className="h-2 w-2 rounded-full bg-os-fill-strong" />
          <span className="ml-auto h-2 w-28 rounded-full bg-os-fill-strong" />
        </div>
        <div className="space-y-2.5 p-3">
          <div className="os-thinking-row w-[72%]" />
          <div className="os-thinking-row" />
          <div className="os-thinking-row" />
          <div className="os-thinking-row w-[56%]" />
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-os-fill-strong">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-300"
              initial={{ x: "-70%" }}
              animate={{ x: "70%" }}
              transition={{
                duration: reduced ? 0.12 : 1.9,
                repeat: reduced ? 0 : Infinity,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-[var(--os-text-secondary)]">Reviewing Arjun&apos;s portfolio…</p>
        <button
          type="button"
          className="min-h-11 rounded-lg px-3 py-2 text-xs font-medium text-[var(--os-text-secondary)]"
          onClick={onCancel}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

class ArtifactErrorBoundary extends Component<
  { children: ReactNode; onClose: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Keep the island usable if a legacy widget crashes.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-3 p-2">
          <p className="text-sm text-[var(--os-text-secondary)]">
            This artifact couldn&apos;t be displayed. You can keep chatting or close the panel.
          </p>
          <button
            type="button"
            onClick={this.props.onClose}
            className="min-h-11 rounded-xl border border-os-hairline px-3 py-2 text-xs"
          >
            Close artifact
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MicroWidgetsBlock({
  widgets,
  placement,
  chatTheme,
}: {
  widgets: MicroWidget[];
  placement?: WidgetPlacement;
  chatTheme: "light" | "dark";
}) {
  if (!widgets.length) return null;
  return (
    <ThemeBridge theme={chatTheme}>
      <div
        className={cn("space-y-2", placement === "before" ? "mb-3" : "mt-3")}
        data-placement={placement ?? "after"}
      >
        {widgets.map((widget, index) => (
          <MicroWidgetRenderer key={`${widget.type}-${index}`} widget={widget} />
        ))}
      </div>
    </ThemeBridge>
  );
}

const ArtifactPane = forwardRef<
  HTMLElement,
  {
    widgetType: WidgetType;
    onClose: () => void;
    reduced: boolean;
    chatTheme: "light" | "dark";
    closing?: boolean;
  }
>(function ArtifactPane({ widgetType, onClose, reduced, chatTheme, closing }, ref) {
  return (
    <motion.aside
      ref={ref}
      layout
      className="os-island-artifact flex min-h-0 flex-col border-t border-os-hairline md:w-[58%] md:border-l md:border-t-0"
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20, filter: "blur(4px)" }}
      animate={
        closing
          ? { opacity: 0, x: 12, filter: "blur(4px)" }
          : { opacity: 1, x: 0, filter: "blur(0px)" }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 16, filter: "blur(4px)" }}
      transition={closing ? islandCloseTransition(reduced) : islandTransition(reduced)}
      aria-label="Artifact"
    >
      <div className="flex items-center justify-between border-b border-os-hairline px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
          Artifact
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--os-text-secondary)] hover:bg-os-hover"
          aria-label="Close artifact"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="os-island-artifact-body min-h-0 flex-1 overflow-y-auto p-3">
        <ThemeBridge theme={chatTheme}>
          <ArtifactErrorBoundary onClose={onClose}>
            <WidgetRenderer widgetType={widgetType} />
          </ArtifactErrorBoundary>
        </ThemeBridge>
      </div>
    </motion.aside>
  );
});

const IslandContentShell = forwardRef<
  HTMLDivElement,
  { reduced: boolean; children: ReactNode }
>(function IslandContentShell({ reduced, children }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.92, filter: "blur(5px)", originX: 0.5, originY: 0.5 }
      }
      animate={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, scale: 1, filter: "blur(0px)", originX: 0.5, originY: 0.5 }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(3px)" }}
      transition={islandContentTransition(reduced)}
    >
      {children}
    </motion.div>
  );
});

export function AiIsland() {
  const { island, accessibility, activeAppId, activeProjectId, theme } = useOSState();
  const { dispatch, collapseIsland, openIsland, runIslandAction, startTour } = useOSActions();
  const reduced = useOsReducedMotion();
  const chatTheme = theme === "dawn" ? "light" : "dark";
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const wasExpandedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [localQuery, setLocalQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalQuery(island.query);
  }, [island.query]);

  useEffect(() => {
    if (!island.expanded) setIsClosing(false);
  }, [island.expanded]);

  useEffect(() => {
    const workspace = document.getElementById("os-workspace");
    if (!workspace) return;
    if (island.expanded) workspace.setAttribute("inert", "");
    else workspace.removeAttribute("inert");
    return () => workspace.removeAttribute("inert");
  }, [island.expanded]);

  const requestCollapse = useCallback(() => {
    if (island.mode === "thinking" || isClosing || !island.expanded) return;
    setIsClosing(true);
  }, [island.mode, island.expanded, isClosing]);

  // Fade content first, then morph shell → pill (avoids janky artifact→idle snap)
  useEffect(() => {
    if (!isClosing) return;
    const delay = reduced ? 70 : 200;
    const timer = window.setTimeout(() => {
      collapseIsland();
      setIsClosing(false);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isClosing, reduced, collapseIsland]);

  useEffect(() => {
    if (island.expanded && !wasExpandedRef.current) {
      invokerRef.current ??= document.activeElement as HTMLElement | null;
      const timer = window.setTimeout(() => inputRef.current?.focus(), reduced ? 40 : 220);
      wasExpandedRef.current = true;
      return () => window.clearTimeout(timer);
    }
    if (!island.expanded && wasExpandedRef.current) {
      const returnToTrigger = invokerRef.current?.classList.contains("os-island-pill");
      const returnTarget = invokerRef.current;
      window.requestAnimationFrame(() =>
        returnToTrigger ? triggerRef.current?.focus() : returnTarget?.focus(),
      );
      invokerRef.current = null;
      wasExpandedRef.current = false;
      return;
    }
  }, [island.expanded, reduced]);

  const onOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (island.mode === "thinking" || isClosing) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest(".os-island-pill")) return;
      requestCollapse();
    },
    [island.mode, isClosing, requestCollapse],
  );

  useOutsideClick(surfaceRef, onOutside);

  const filamentClass = useMemo(() => {
    if (accessibility.highContrast) return "os-filament-hc";
    if (accessibility.reduceMotion) return "os-filament-static";
    return "os-filament";
  }, [accessibility.highContrast, accessibility.reduceMotion]);

  const submit = async (value?: string) => {
    const query = (value ?? localQuery).trim();
    if (!query) return;

    if (query.toLowerCase().includes("recruiter tour") || query.toLowerCase() === "recruiter tour") {
      startTour();
      return;
    }

    dispatch({ type: "ISLAND_SET_QUERY", query });
    dispatch({ type: "ISLAND_THINKING" });
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          messages: [...island.history, { role: "user", content: query }],
          uiContext: {
            activeAppId: activeAppId ?? undefined,
            activeProjectId: activeProjectId ?? undefined,
            tourStep: island.activeTourStep,
          },
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      const answer =
        data.response ||
        data.message ||
        data.content ||
        "I can help with Arjun's work, experience, and research. Try asking about a project.";

      const mapped = mapChatActionsToIsland(data.actions ?? data.suggestions);
      const actions = mapped.length > 0 ? mapped : inferActionsFromAnswer(answer);
      const microWidgets = Array.isArray(data.microWidgets)
        ? (data.microWidgets as MicroWidget[])
        : undefined;
      const widgetType =
        typeof data.widgetType === "string" &&
        VALID_WIDGET_TYPES.includes(data.widgetType as WidgetType)
          ? (data.widgetType as WidgetType)
          : undefined;
      const widgetPlacement =
        data.widgetPlacement === "before" ||
        data.widgetPlacement === "after" ||
        data.widgetPlacement === "inline"
          ? (data.widgetPlacement as WidgetPlacement)
          : undefined;

      dispatch({
        type: "ISLAND_ANSWER",
        answer,
        actions,
        linkedAppId: activeAppId ?? undefined,
        linkedProjectId: activeProjectId ?? undefined,
        microWidgets,
        widgetType,
        widgetPlacement,
      });
      setLocalQuery("");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      dispatch({
        type: "ISLAND_ERROR",
        error: "AI is temporarily unavailable. You can still explore the portfolio normally.",
      });
    }
  };

  const tourStep = island.activeTourStep ?? 0;
  const showGooey = island.mode === "compose" && !reduced && !accessibility.highContrast;
  const hasArtifact = island.mode === "answer" && Boolean(island.widgetType);
  const micros = island.microWidgets ?? [];
  const microsBefore = micros.length > 0 && island.widgetPlacement === "before";
  const microsAfter = micros.length > 0 && island.widgetPlacement !== "before";

  const surfaceWidth = hasArtifact
    ? "w-[min(960px,calc(100vw-24px))]"
    : island.mode === "answer" || island.mode === "error" || island.mode === "tour"
      ? "w-[min(680px,calc(100vw-24px))]"
      : island.mode === "thinking"
        ? "w-[min(420px,calc(100vw-24px))]"
        : "w-[min(640px,calc(100vw-24px))]";

  return (
    <>
      {/* Aceternity-style dimmed backdrop — portaled so transforms don't trap fixed */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {island.expanded && (
              <motion.div
                key="ai-island-backdrop"
                className="pointer-events-auto fixed inset-0 z-[100] bg-os-overlay backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: isClosing ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.1 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  if (island.mode === "thinking") return;
                  requestCollapse();
                }}
                aria-hidden
              />
            )}
          </AnimatePresence>,
          document.body,
        )}

      <AnimatePresence mode="sync" initial={false}>
        {!island.expanded ? (
          <motion.button
            key="ai-island-idle"
            layout
            layoutId="ai-island"
            ref={triggerRef}
            type="button"
            transition={islandTransition(reduced)}
            whileHover={reduced || isClosing ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            onClick={(event) => {
              invokerRef.current = event.currentTarget;
              openIsland();
            }}
            className={cn(
              "os-island-pill pointer-events-auto relative z-[65] col-start-1 row-start-1 flex h-[38px] min-h-11 w-[156px] items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-[var(--os-text-primary)] sm:min-h-[38px]",
              filamentClass,
            )}
            style={{ borderRadius: 999 }}
            aria-label="Ask Arjun"
            data-island-mode="idle"
          >
            <IslandMark />
            Ask Arjun
          </motion.button>
        ) : (
          <motion.div
            key="ai-island-expanded"
            layout
            layoutId="ai-island"
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Island"
            transition={islandTransition(reduced)}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = surfaceRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
              );
              if (!focusable?.length) return;
              const first = focusable[0];
              const last = focusable[focusable.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
            className={cn(
              "os-island-surface pointer-events-auto relative z-[65] col-start-1 row-start-1 overflow-hidden",
              filamentClass,
              surfaceWidth,
              island.mode !== "compose" && "max-h-[min(72dvh,760px)]",
            )}
            style={{ borderRadius: hasArtifact ? 28 : 26 }}
            data-island-mode={island.mode}
            data-has-artifact={hasArtifact ? "true" : undefined}
            data-closing={isClosing ? "true" : undefined}
          >
            <GooeyBackdrop enabled={showGooey && !isClosing} />
            <motion.div
              className={cn(
                "relative z-[1] bg-[var(--os-surface-elevated)]/92 backdrop-blur-xl",
                hasArtifact ? "flex max-h-[min(72dvh,760px)] flex-col md:flex-row" : "p-3.5",
              )}
              animate={
                isClosing
                  ? { opacity: 0, scale: 0.97, filter: "blur(5px)" }
                  : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              transition={islandCloseTransition(reduced)}
            >
              <div
                className={cn(
                  hasArtifact && "flex min-h-0 min-w-0 flex-1 flex-col p-3.5 md:w-[42%]",
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {(island.mode === "compose" || island.mode === "thinking") && (
                    <IslandContentShell key={`compose-${island.mode}`} reduced={reduced}>
                      <div className="flex items-center gap-2">
                        <input
                          ref={inputRef}
                          value={localQuery}
                          onChange={(e) => {
                            setLocalQuery(e.target.value);
                            dispatch({ type: "ISLAND_SET_QUERY", query: e.target.value });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submit();
                          }}
                          placeholder="Ask about my work, experience, or research..."
                          className="h-11 flex-1 rounded-xl bg-transparent px-3 text-sm text-[var(--os-text-primary)] outline-none placeholder:text-[var(--os-text-muted)]"
                          disabled={island.mode === "thinking"}
                        />
                        {island.mode !== "thinking" && (
                          <>
                            <span className="hidden font-mono text-[10px] text-[var(--os-text-muted)] sm:inline">
                              ⌘ K
                            </span>
                            <button
                              type="button"
                              onClick={() => requestCollapse()}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--os-text-secondary)] hover:bg-os-hover"
                              aria-label="Close AI Island"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => submit()}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[var(--os-action-cobalt)] text-white"
                              aria-label="Send"
                            >
                              <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
                            </button>
                          </>
                        )}
                      </div>

                      {island.mode === "compose" && (
                        <motion.div
                          className="mt-3 flex flex-wrap gap-2"
                          initial="initial"
                          animate="animate"
                          variants={{ animate: { transition: staggerChildren(reduced) } }}
                        >
                          {suggestions.map((item) => (
                            <motion.button
                              key={item}
                              type="button"
                              variants={fadeUpItem}
                              onClick={() =>
                                item === "Recruiter tour" ? startTour() : submit(item)
                              }
                              className="min-h-11 rounded-full border border-os-hairline px-3 py-1.5 text-xs text-[var(--os-text-secondary)] hover:bg-os-hover"
                            >
                              {item}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}

                      {island.mode === "thinking" && (
                        <ThinkingPreview
                          onCancel={() => {
                            abortRef.current?.abort();
                            dispatch({ type: "ISLAND_OPEN_COMPOSE" });
                          }}
                        />
                      )}
                    </IslandContentShell>
                  )}

                  {island.mode === "tour" && (
                    <IslandContentShell key="tour" reduced={reduced}>
                      <div
                        className="max-h-[calc(70dvh-24px)] space-y-3 overflow-y-auto p-1"
                        aria-live="polite"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
                          Recruiter tour {String(tourStep + 1).padStart(2, "0")} /{" "}
                          {String(TOUR_STEP_COUNT).padStart(2, "0")}
                        </p>
                        <h3 className="text-lg font-semibold text-[var(--os-text-primary)]">
                          {island.query}
                        </h3>
                        <p className="text-sm leading-6 text-[var(--os-text-secondary)]">
                          {island.answer}
                        </p>
                        <div className="flex items-center gap-1.5 py-1">
                          {RECRUITER_TOUR_STEPS.map((step, index) => (
                            <button
                              key={step.id}
                              type="button"
                              aria-label={`Go to step ${index + 1}`}
                              onClick={() => dispatch({ type: "TOUR_GOTO", step: index })}
                              className={cn(
                                "h-2.5 w-2.5 rounded-full transition",
                                index === tourStep
                                  ? "bg-[var(--os-accent-violet)]"
                                  : "bg-os-fill-strong",
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {island.actions.map((action) => (
                            <button
                              key={action.id}
                              type="button"
                              onClick={() => runIslandAction(action)}
                              className={cn(
                                "min-h-11 rounded-xl px-3 py-2 text-xs font-medium",
                                action.type === "tour-next" || action.type === "open-resume"
                                  ? "bg-[var(--os-action-violet)] text-white"
                                  : "border border-os-hairline text-[var(--os-text-primary)]",
                              )}
                            >
                              {action.label}
                            </button>
                          ))}
                          {tourStep < TOUR_STEP_COUNT - 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                runIslandAction({
                                  id: "exit",
                                  label: "Exit",
                                  type: "tour-exit",
                                })
                              }
                              className="min-h-11 rounded-xl border border-os-hairline px-3 py-2 text-xs"
                            >
                              Exit
                            </button>
                          )}
                        </div>
                      </div>
                    </IslandContentShell>
                  )}

                  {island.mode === "answer" && (
                    <IslandContentShell key="answer" reduced={reduced}>
                      <div
                        className="os-island-answer flex min-h-0 flex-1 flex-col gap-3"
                        aria-live="polite"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-[var(--os-text-muted)]">
                            {island.history.at(-2)?.content ?? island.query}
                          </p>
                          <button
                            type="button"
                            onClick={() => requestCollapse()}
                            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-[var(--os-text-secondary)] hover:bg-os-hover"
                            aria-label="Close AI Island"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                          {island.history.length > 2 && (
                            <details className="mb-3 rounded-xl border border-os-hairline bg-os-fill p-2 text-xs text-[var(--os-text-muted)]">
                              <summary className="cursor-pointer">Earlier conversation</summary>
                              <div className="mt-2 space-y-2">
                                {island.history.slice(0, -2).map((message, index) => (
                                  <p key={`${message.role}-${index}`}>
                                    <span className="font-medium uppercase">{message.role}:</span>{" "}
                                    {message.content}
                                  </p>
                                ))}
                              </div>
                            </details>
                          )}
                          {microsBefore && (
                            <MicroWidgetsBlock
                              widgets={micros}
                              placement={island.widgetPlacement}
                              chatTheme={chatTheme}
                            />
                          )}
                          <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--os-text-primary)]">
                            {island.answer}
                          </p>
                          {microsAfter && (
                            <MicroWidgetsBlock
                              widgets={micros}
                              placement={island.widgetPlacement ?? "after"}
                              chatTheme={chatTheme}
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5" aria-label="Answer evidence">
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 font-mono text-[10px] text-cyan-200">
                            VERIFIED PORTFOLIO DATA
                          </span>
                          {island.linkedAppId && (
                            <span className="rounded-full border border-os-hairline px-2 py-1 font-mono text-[10px] text-[var(--os-text-muted)]">
                              CONTEXT: {island.linkedAppId.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {island.actions.map((action) => (
                            <button
                              key={action.id}
                              type="button"
                              onClick={() => runIslandAction(action)}
                              className="min-h-11 rounded-xl border border-os-hairline bg-os-fill px-3 py-2 text-xs font-medium text-[var(--os-text-primary)] hover:bg-os-hover"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 border-t border-os-hairline pt-3">
                          <input
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submit();
                            }}
                            placeholder="Ask a follow-up..."
                            className="h-11 flex-1 rounded-xl bg-os-fill-strong px-3 text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => submit()}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[var(--os-action-cobalt)] text-white"
                            aria-label="Send follow-up"
                          >
                            <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
                          </button>
                        </div>
                      </div>
                    </IslandContentShell>
                  )}

                  {island.mode === "error" && (
                    <IslandContentShell key="error" reduced={reduced}>
                      <div className="space-y-3 p-1" role="alert">
                        <p className="text-sm text-[var(--os-text-primary)]">{island.error}</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              runIslandAction({ id: "retry", label: "Try again", type: "retry" })
                            }
                            className="min-h-11 rounded-xl bg-[var(--os-action-cobalt)] px-3 py-2 text-xs font-medium text-white"
                          >
                            Try again
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              runIslandAction({
                                id: "work",
                                label: "Open Work",
                                type: "open-app",
                                appId: "work",
                              })
                            }
                            className="min-h-11 rounded-xl border border-os-hairline px-3 py-2 text-xs"
                          >
                            Open Work
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              runIslandAction({
                                id: "resume",
                                label: "Download Resume",
                                type: "open-resume",
                              })
                            }
                            className="min-h-11 rounded-xl border border-os-hairline px-3 py-2 text-xs"
                          >
                            Download Resume
                          </button>
                        </div>
                      </div>
                    </IslandContentShell>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {hasArtifact && island.widgetType && (
                  <ArtifactPane
                    widgetType={island.widgetType}
                    onClose={() => requestCollapse()}
                    reduced={reduced}
                    chatTheme={chatTheme}
                    closing={isClosing}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
