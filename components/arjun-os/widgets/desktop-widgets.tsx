"use client";

import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CloudSun, PanelsTopLeft } from "lucide-react";
import { VANCOUVER } from "@/lib/arjun-os/constants";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { OS_EASE, OS_SPRING_SOFT, cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { WeatherSunCloud } from "../icons";
import { cn } from "@/utils/cn";
import { CoffeeChatWidget, DevpostWidget, FocusRadioWidget, GithubPulseWidget, LegoBuildWidget, LinkedinWidget } from "./connected-widgets";

type WeatherResponse =
  | {
      temperature: number;
      weatherCode: number;
      humidity: number;
      windSpeed: number;
      isDay: boolean;
      label: string;
      source: string;
      fetchedAt: string;
      error?: undefined;
    }
  | { error: true; fallback: string };

function isWeatherFallback(value: WeatherResponse): value is { error: true; fallback: string } {
  return value.error === true;
}

function RollingValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const reduced = useOsReducedMotion();
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={value}
          className="col-start-1 row-start-1 tabular-nums"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: reduced ? 0.12 : 0.3, ease: OS_EASE }}
        >
          {value}{suffix}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function CalendarWidget() {
  const [now, setNow] = useState(() => new Date());
  const reduced = useOsReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const dateParts = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: VANCOUVER.timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(now);
    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const day = Number(parts.find((part) => part.type === "day")?.value);
    return {
      year,
      month,
      day,
      monthLabel: new Intl.DateTimeFormat("en-CA", {
        timeZone: VANCOUVER.timezone,
        month: "long",
      }).format(now),
      daysInMonth: new Date(year, month, 0).getDate(),
      firstWeekday: new Date(year, month - 1, 1).getDay(),
    };
  }, [now]);

  const weekday = new Intl.DateTimeFormat("en-CA", {
    timeZone: VANCOUVER.timezone,
    weekday: "long",
  }).format(now);

  return (
    <motion.section layout className="os-widget os-calendar-widget w-full p-4" aria-label="Calendar" transition={OS_SPRING_SOFT}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`${dateParts.year}-${dateParts.month}`}
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--os-accent-coral-text)]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
            >
              {dateParts.monthLabel}
            </motion.p>
          </AnimatePresence>
          <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-tight text-os-primary tabular-nums">{dateParts.day}</p>
          <p className="mt-1 text-[11px] text-os-secondary">{weekday}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-1.5 gap-x-0.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`} className="text-center text-[9px] font-medium text-os-muted">{label}</span>
        ))}
        {Array.from({ length: dateParts.firstWeekday }, (_, index) => <span key={`blank-${index}`} aria-hidden />)}
        {Array.from({ length: Math.min(dateParts.daysInMonth, 31) }, (_, index) => index + 1).map((date) => (
          <span
            key={date}
            className={cn(
              "os-calendar-day relative flex items-center justify-center text-[11px] tabular-nums",
              date === dateParts.day ? "font-semibold text-white" : "text-os-secondary",
            )}
          >
            {date === dateParts.day && (
              <motion.span
                layoutId="calendar-current-day"
                className="os-calendar-day-today absolute inset-0 rounded-full"
                transition={OS_SPRING_SOFT}
              />
            )}
            <span className="relative z-10">{date}</span>
          </span>
        ))}
      </div>
    </motion.section>
  );
}

function WeatherSkeleton() {
  return (
    <div className="mt-3 space-y-2" role="status" aria-label="Loading Vancouver weather">
      <div className="os-weather-skeleton h-7 w-32 rounded-lg" />
      <div className="os-weather-skeleton h-3 w-24 rounded" />
    </div>
  );
}

function LegacyWeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [expanded, setExpanded] = useState(false);
  const reduced = useOsReducedMotion();
  const { dispatch } = useOSActions();

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "SET_WEATHER_PHASE", phase: "loading" });
    fetch("/api/weather")
      .then(async (response) => {
        const data = (await response.json()) as WeatherResponse;
        if (cancelled) return;
        setWeather(data);
        dispatch({ type: "SET_WEATHER_PHASE", phase: isWeatherFallback(data) ? "fallback" : "ready" });
      })
      .catch(() => {
        if (cancelled) return;
        setWeather({ error: true, fallback: `${VANCOUVER.label} • Pacific Time` });
        dispatch({ type: "SET_WEATHER_PHASE", phase: "fallback" });
      });
    return () => { cancelled = true; };
  }, [dispatch]);

  const contentKey = !weather ? "loading" : isWeatherFallback(weather) ? "fallback" : `weather-${weather.weatherCode}-${weather.isDay}`;

  return (
    <motion.section
      layout
      className="os-widget os-weather-card w-full overflow-hidden p-3 outline-none"
      aria-label="Vancouver weather"
      tabIndex={0}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setExpanded(false); }}
      whileHover={reduced ? undefined : { y: -2, boxShadow: "0 18px 44px rgba(0,0,0,.38)" }}
      transition={OS_SPRING_SOFT}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--os-text-muted)]">{VANCOUVER.label}</p>
        <CloudSun className="h-3.5 w-3.5 text-[var(--os-accent-cyan)]" aria-hidden />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={contentKey}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: reduced ? 0.12 : 0.32, ease: OS_EASE }}
        >
          {!weather && <WeatherSkeleton />}
          {weather && isWeatherFallback(weather) && <p className="mt-3 text-sm text-[var(--os-text-primary)]">{weather.fallback}</p>}
          {weather && !isWeatherFallback(weather) && (
            <>
              <div className="mt-2 flex items-center gap-2">
                <motion.span
                  key={weather.weatherCode}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -12, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                >
                  <WeatherSunCloud />
                </motion.span>
                <p className="text-2xl font-semibold text-[var(--os-text-primary)]"><RollingValue value={Math.round(weather.temperature)} suffix="°" /></p>
                <p className="text-sm text-[var(--os-text-secondary)]">{weather.label}</p>
              </div>
              <div className="grid">
              <AnimatePresence initial={false} mode="sync">
                {expanded ? (
                  <motion.div
                    key="weather-details"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: reduced ? 0.12 : 0.34, ease: OS_EASE }}
                    className="col-start-1 row-start-1 overflow-hidden"
                  >
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px] text-[var(--os-text-muted)]">
                      <div><dt className="inline">Humidity </dt><dd className="inline"><RollingValue value={weather.humidity} suffix="%" /></dd></div>
                      <div><dt className="inline">Wind </dt><dd className="inline"><RollingValue value={Math.round(weather.windSpeed)} suffix=" km/h" /></dd></div>
                    </dl>
                    <a href={weather.source} target="_blank" rel="noreferrer" className="mt-2 inline-block font-mono text-[10px] text-[var(--os-accent-cyan-text)] underline-offset-2 hover:underline">Open-Meteo</a>
                  </motion.div>
                ) : (
                  <motion.p
                    key="weather-hint"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -3 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -2 }}
                    transition={{ duration: reduced ? 0.12 : 0.3, ease: OS_EASE }}
                    className="col-start-1 row-start-1 mt-2 overflow-hidden font-mono text-[9px] text-[var(--os-text-muted)]"
                  >
                    Hover or focus for details
                  </motion.p>
                )}
              </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {weather && !isWeatherFallback(weather) ? `${Math.round(weather.temperature)} degrees, ${weather.label}` : weather && isWeatherFallback(weather) ? weather.fallback : "Loading weather"}
      </span>
    </motion.section>
  );
}

export function WeatherWidget({ focused = false }: { focused?: boolean }) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [now, setNow] = useState(() => new Date());
  const reduced = useOsReducedMotion();
  const { dispatch } = useOSActions();

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "SET_WEATHER_PHASE", phase: "loading" });
    fetch("/api/weather")
      .then(async (response) => {
        let data: WeatherResponse;
        try {
          data = (await response.json()) as WeatherResponse;
        } catch {
          throw new Error("Invalid weather payload");
        }
        if (cancelled) return;
        if (!response.ok && !isWeatherFallback(data)) {
          data = { error: true, fallback: `${VANCOUVER.label} • Pacific Time` };
        }
        setWeather(data);
        dispatch({ type: "SET_WEATHER_PHASE", phase: isWeatherFallback(data) ? "fallback" : "ready" });
      })
      .catch(() => {
        if (cancelled) return;
        setWeather({ error: true, fallback: `${VANCOUVER.label} • Pacific Time` });
        dispatch({ type: "SET_WEATHER_PHASE", phase: "fallback" });
      });
    const clock = window.setInterval(() => setNow(new Date()), 60_000);
    return () => { cancelled = true; window.clearInterval(clock); };
  }, [dispatch]);

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: VANCOUVER.timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  const ready = weather && !isWeatherFallback(weather) ? weather : null;

  return (
    <motion.section
      className={cn("os-widget os-weather-today relative flex h-full w-full flex-col overflow-hidden p-4", focused && "os-widget-focused")}
      aria-label="Vancouver weather and today's date"
      data-os-widget="weather"
      data-os-focused={focused ? "true" : undefined}
      whileHover={reduced ? undefined : { y: -2 }}
      transition={OS_SPRING_SOFT}
    >
      <div className="os-weather-art" aria-hidden>
        <span className="os-weather-sun" />
        <span className="os-weather-sun-pulse" />
        <span className="os-weather-cloud os-weather-cloud-back"><i /><b /></span>
        <span className="os-weather-cloud os-weather-cloud-front"><i /><b /></span>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-wide text-os-secondary">{VANCOUVER.label}</p>
        <p className="mt-0.5 text-[12px] text-os-muted">{date}</p>
      </div>
      <div className="relative z-10 mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="min-w-0">
          {ready ? (
            <>
              <p className="text-[44px] font-semibold leading-none tracking-tight text-os-primary">
                <RollingValue value={Math.round(ready.temperature)} suffix="°" />
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-os-secondary">{ready.label}</p>
            </>
          ) : weather && isWeatherFallback(weather) ? (
            <p className="max-w-[180px] text-sm font-semibold leading-snug text-os-primary">{weather.fallback}</p>
          ) : (
            <WeatherSkeleton />
          )}
        </div>
        {ready && (
          <dl className="shrink-0 space-y-1 text-right text-[10px] tabular-nums text-os-muted">
            <div>
              <dt className="inline text-os-muted">H </dt>
              <dd className="inline text-os-secondary">{ready.humidity}%</dd>
            </div>
            <div>
              <dt className="inline text-os-muted">W </dt>
              <dd className="inline text-os-secondary">{Math.round(ready.windSpeed)} km/h</dd>
            </div>
          </dl>
        )}
      </div>
      <span className="sr-only" aria-live="polite">{ready ? `${Math.round(ready.temperature)} degrees, ${ready.label}` : "Loading weather"}</span>
    </motion.section>
  );
}

export function DesktopWidgets() {
  const reduced = useOsReducedMotion();
  const { widgets } = useOSState();
  const { toggleWidgets, dispatch } = useOSActions();
  const scrollRailRef = useRef<HTMLDivElement>(null);
  const [hasMoreWidgets, setHasMoreWidgets] = useState(false);
  const focusedId = widgets.focusedWidgetId;
  const desktopWidgets = [
    { key: "weather", size: "medium", widget: <WeatherWidget focused={focusedId === "weather"} /> },
    { key: "focus", size: "player", widget: <FocusRadioWidget focused={focusedId === "focus-radio"} /> },
    { key: "activity", size: "medium", widget: <ActivityStackWidget focusedId={focusedId} /> },
    { key: "lego", size: "medium", widget: <LegoBuildWidget /> },
    { key: "social", size: "medium", widget: <SocialStackWidget focusedId={focusedId} /> },
  ];

  useEffect(() => {
    if (!focusedId) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-os-widget="${focusedId}"]`);
      target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    });
    const clear = window.setTimeout(() => dispatch({ type: "CLEAR_WIDGET_FOCUS" }), 4500);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(clear);
    };
  }, [dispatch, focusedId]);

  useEffect(() => {
    const rail = scrollRailRef.current;
    if (!rail || widgets.collapsed) {
      setHasMoreWidgets(false);
      return;
    }

    const updateOverflow = () => {
      setHasMoreWidgets(rail.scrollTop + rail.clientHeight < rail.scrollHeight - 2);
    };
    updateOverflow();
    rail.addEventListener("scroll", updateOverflow, { passive: true });
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(rail);
    for (const child of Array.from(rail.children)) observer.observe(child);
    return () => {
      rail.removeEventListener("scroll", updateOverflow);
      observer.disconnect();
    };
  }, [widgets.collapsed]);

  return (
    <motion.aside layoutRoot className="os-widget-deck pointer-events-auto absolute left-5 top-5 z-[5] hidden max-w-[calc(100vw-40px)] xl:block" aria-label="Connected widgets">
      <div className="flex items-center gap-2">
        <motion.button
          layout
          type="button"
          onClick={toggleWidgets}
          className="os-widget-toggle mb-2 flex min-h-11 items-center gap-2 rounded-full border border-os-hairline bg-os-fill-strong px-3 text-[11px] font-medium text-[var(--os-text-secondary)] backdrop-blur-xl"
          aria-expanded={!widgets.collapsed}
          aria-controls="desktop-widget-stack"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
        >
          <PanelsTopLeft className="h-3.5 w-3.5 text-[var(--os-accent-cyan)]" aria-hidden />
          Widgets
          <motion.span animate={{ rotate: widgets.collapsed ? -90 : 0 }} transition={OS_SPRING_SOFT}><ChevronDown className="h-3.5 w-3.5" /></motion.span>
        </motion.button>
        {!widgets.collapsed && <span className="mb-2 text-[10px] font-medium tracking-wide text-os-muted">Connected spaces</span>}
      </div>
      <AnimatePresence initial={false}>
        {!widgets.collapsed && (
          <div className="relative">
          <motion.div
            ref={scrollRailRef}
            id="desktop-widget-stack"
            className={cn(
              "os-widget-scroll-rail os-widget-deck-panel os-widget-size-grid grid max-h-[calc(100dvh-82px)] w-full origin-top-left grid-cols-1 items-start gap-3",
              hasMoreWidgets && "os-widget-scroll-masked",
            )}
            variants={staggerContainer(reduced, 0.08, 0.02)}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: "28px -18px" }}
          >
            {desktopWidgets.map(({ key, size, widget }) => (
              <motion.div
                key={key}
                className={cn(
                  "min-w-0",
                  size === "medium" && "os-widget-medium-slot",
                  size === "compact" && "os-widget-compact-slot",
                  size === "player" && "os-widget-player-slot",
                )}
                layout
                variants={cinematicItem(reduced)}
                transition={OS_SPRING_SOFT}
              >
                {widget}
              </motion.div>
            ))}
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

type PairedWidgetItem = { id: string; shortLabel: string; label: string; content: ReactNode };

const FOCUS_TAB_MAP: Record<string, string> = {
  "github-pulse": "github",
  "coffee-chat": "coffee",
};

function PairedWidgetStack({
  label,
  items,
  preferTabId,
}: {
  label: string;
  items: [PairedWidgetItem, PairedWidgetItem];
  preferTabId?: string | null;
}) {
  const reduced = useOsReducedMotion();
  const [active, setActive] = useState(items[0].id);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const baseId = useId();

  useEffect(() => {
    if (!preferTabId) return;
    if (items.some((item) => item.id === preferTabId)) {
      setActive(preferTabId);
      setPaused(true);
    }
  }, [items, preferTabId]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || reduced || !pageVisible) return;
    const timer = window.setInterval(() => setActive((current) => current === items[0].id ? items[1].id : items[0].id), 8000);
    return () => window.clearInterval(timer);
  }, [items, pageVisible, paused, reduced]);

  const activeItem = items.find((item) => item.id === active) ?? items[0];

  return (
    <section
      className="os-widget-stack-slot relative"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div className="os-widget-segment absolute right-3 top-3 z-20" role="tablist" aria-label={`Choose ${label}`}>
        {items.map((item) => (
          <button
            key={item.id}
            id={`${baseId}-${item.id}-tab`}
            type="button"
            role="tab"
            aria-selected={active === item.id}
            aria-controls={`${baseId}-${item.id}-panel`}
            aria-label={`Show ${item.label}`}
            onClick={() => setActive(item.id)}
            className={cn(
              "min-h-7 min-w-7 rounded-full px-2.5 text-[10px] font-medium transition",
              active === item.id ? "text-os-primary" : "text-os-muted hover:text-os-primary",
            )}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          id={`${baseId}-${activeItem.id}-panel`}
          aria-labelledby={`${baseId}-${activeItem.id}-tab`}
          className="relative"
          key={activeItem.id}
          role="tabpanel"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
          transition={{ duration: reduced ? 0.1 : 0.28, ease: OS_EASE }}
        >
          {activeItem.content}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ActivityStackWidget({ focusedId }: { focusedId?: string | null }) {
  const preferTabId = focusedId ? FOCUS_TAB_MAP[focusedId] : null;
  const items = useMemo<[PairedWidgetItem, PairedWidgetItem]>(() => [
    { id: "github", shortLabel: "GH", label: "GitHub Pulse", content: <GithubPulseWidget focused={focusedId === "github-pulse"} /> },
    { id: "devpost", shortLabel: "DP", label: "Devpost Launchpad", content: <DevpostWidget /> },
  ], [focusedId]);
  return <PairedWidgetStack label="activity widget" items={items} preferTabId={preferTabId} />;
}

function SocialStackWidget({ focusedId }: { focusedId?: string | null }) {
  const preferTabId = focusedId ? FOCUS_TAB_MAP[focusedId] : null;
  const items = useMemo<[PairedWidgetItem, PairedWidgetItem]>(() => [
    { id: "linkedin", shortLabel: "IN", label: "LinkedIn Connect", content: <LinkedinWidget /> },
    { id: "coffee", shortLabel: "CO", label: "Coffee Chat", content: <CoffeeChatWidget focused={focusedId === "coffee-chat"} /> },
  ], [focusedId]);
  return <PairedWidgetStack label="social widget" items={items} preferTabId={preferTabId} />;
}

function LocalStackWidget() {
  const items = useMemo<[PairedWidgetItem, PairedWidgetItem]>(() => [
    { id: "calendar", shortLabel: "CAL", label: "Calendar", content: <CalendarWidget /> },
    { id: "weather", shortLabel: "WX", label: "Vancouver Weather", content: <WeatherWidget /> },
  ], []);
  return <PairedWidgetStack label="calendar and weather widget" items={items} />;
}

export function MobileConnectedWidgets() {
  // Similar-height cards share the swipe deck; Spotify stays full-width below
  // because the embed (~352px) would stretch every carousel slot.
  const carouselWidgets = [
    { key: "weather", content: <WeatherWidget /> },
    { key: "activity", content: <ActivityStackWidget /> },
    { key: "lego", content: <LegoBuildWidget /> },
    { key: "social", content: <SocialStackWidget /> },
  ];

  return (
    <section aria-labelledby="mobile-widget-title" className="space-y-4">
      <div>
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-os-muted">Connected</p>
            <h2 id="mobile-widget-title" className="text-base font-semibold text-os-primary">Around the web</h2>
          </div>
          <p className="text-[10px] text-os-muted">Swipe to explore</p>
        </div>
        <div className="os-mobile-widget-carousel -mx-4 flex snap-x snap-mandatory items-stretch gap-2 overflow-x-auto px-4 pb-1">
          {carouselWidgets.map((widget) => (
            <div
              key={widget.key}
              className="os-mobile-widget-slot flex w-[calc(100vw-40px)] max-w-[360px] shrink-0 snap-center flex-col"
            >
              {widget.content}
            </div>
          ))}
        </div>
      </div>

      <div className="os-mobile-focus-slot">
        <FocusRadioWidget />
      </div>
    </section>
  );
}
