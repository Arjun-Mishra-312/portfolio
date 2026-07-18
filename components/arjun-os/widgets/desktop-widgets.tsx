"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CloudSun, PanelsTopLeft } from "lucide-react";
import { VANCOUVER } from "@/lib/arjun-os/constants";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { OS_EASE, OS_SPRING_SOFT, cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { WeatherSunCloud } from "../icons";
import { cn } from "@/utils/cn";

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

  return (
    <motion.section layout className="os-widget w-[168px] p-3" aria-label="Calendar" transition={OS_SPRING_SOFT}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={`${dateParts.year}-${dateParts.month}`}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--os-text-muted)]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
        >
          {dateParts.monthLabel}
        </motion.p>
      </AnimatePresence>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`} className="text-center font-mono text-[8px] text-[var(--os-text-muted)]">{label}</span>
        ))}
        {Array.from({ length: dateParts.firstWeekday }, (_, index) => <span key={`blank-${index}`} aria-hidden />)}
        {Array.from({ length: Math.min(dateParts.daysInMonth, 31) }, (_, index) => index + 1).map((date) => (
          <span key={date} className="relative flex h-5 w-5 items-center justify-center text-[10px] text-[var(--os-text-secondary)]">
            {date === dateParts.day && (
              <motion.span
                layoutId="calendar-current-day"
                className="absolute inset-0 rounded-full bg-[var(--os-action-violet)] shadow-[0_0_14px_rgba(167,139,250,.45)]"
                transition={OS_SPRING_SOFT}
              />
            )}
            <span className={cn("relative z-10", date === dateParts.day && "font-semibold")} style={date === dateParts.day ? { color: "#fff" } : undefined}>{date}</span>
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

export function WeatherWidget() {
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
      className="os-widget os-weather-card w-[220px] overflow-hidden p-3 outline-none"
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

export function DesktopWidgets() {
  const reduced = useOsReducedMotion();
  const { widgets } = useOSState();
  const { toggleWidgets } = useOSActions();

  return (
    <motion.aside layoutRoot className="pointer-events-auto absolute left-4 top-[70px] z-[20] hidden md:block" aria-label="Desktop widgets">
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
      <AnimatePresence initial={false}>
        {!widgets.collapsed && (
          <motion.div
            id="desktop-widget-stack"
            key="widget-stack"
            className="flex origin-top-left flex-col gap-3"
            variants={staggerContainer(reduced, 0.08, 0.02)}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: "28px -18px" }}
          >
            {[<CalendarWidget key="calendar" />, <WeatherWidget key="weather" />].map((widget, index) => (
              <motion.div key={index} layout variants={cinematicItem(reduced)} transition={OS_SPRING_SOFT}>{widget}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
