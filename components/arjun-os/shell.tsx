"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { islandTransition, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { snappedBounds, TOP_RAIL_HEIGHT } from "@/lib/arjun-os/constants";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import type { AppId } from "@/lib/arjun-os/types";
import { AccessibilityPanel } from "./accessibility-panel";
import { AppWindow } from "./app-window";
import { BootScreen } from "./boot-screen";
import { Dock } from "./dock";
import { AiIsland } from "./ai-island";
import { TopRail } from "./top-rail";
import { DesktopWidgets, CalendarWidget, WeatherWidget } from "./widgets/desktop-widgets";
import { ProfileApp } from "./apps/profile-app";
import { cn } from "@/utils/cn";

const WorkApp = dynamic(() => import("./apps/work-app").then((m) => m.WorkApp), {
  ssr: false,
  loading: () => <AppSkeleton />,
});
const ExperienceApp = dynamic(() => import("./apps/experience-app").then((m) => m.ExperienceApp), {
  ssr: false,
  loading: () => <AppSkeleton />,
});
const ResearchApp = dynamic(() => import("./apps/research-app").then((m) => m.ResearchApp), {
  ssr: false,
  loading: () => <AppSkeleton />,
});
const LifeApp = dynamic(() => import("./apps/life-app").then((m) => m.LifeApp), {
  ssr: false,
  loading: () => <AppSkeleton />,
});

function AppSkeleton() {
  return <div className="h-full animate-pulse bg-os-fill" />;
}

const WALLPAPERS = {
  dawn: "/wallpapers/Vancouver_Dawn.webp",
  dusk: "/wallpapers/Vancouver_Dusk.webp",
} as const;

function WallpaperLayers({ theme, reduced }: { theme: keyof typeof WALLPAPERS; reduced: boolean }) {
  return (
    <>
      {(Object.keys(WALLPAPERS) as Array<keyof typeof WALLPAPERS>).map((variant) => {
        const active = variant === theme;

        return (
          <motion.div
            key={variant}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              filter: active ? "blur(0px)" : "blur(18px)",
              scale: active ? 1 : 1.025,
            }}
            transition={reduced ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <Image src={WALLPAPERS[variant]} alt="" fill priority className="object-cover" sizes="100vw" />
          </motion.div>
        );
      })}
    </>
  );
}

function MobileHome({ theme, reduced }: { theme: keyof typeof WALLPAPERS; reduced: boolean }) {
  const { openApp } = useOSActions();
  const { profile } = portfolioData;

  const links: Array<{ id: AppId; title: string; subtitle: string }> = [
    { id: "work", title: "Work", subtitle: "Projects, case studies, and impact" },
    { id: "experience", title: "Experience", subtitle: "Roles, impact, and timeline" },
    { id: "research", title: "Research", subtitle: "Accessibility, VLMs, HCI" },
    { id: "life", title: "Life + Play", subtitle: "Vancouver, LEGO, and gallery" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 pb-28">
      <div className="overflow-hidden rounded-2xl border border-os-hairline">
        <div className="relative h-36">
          <WallpaperLayers theme={theme} reduced={reduced} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="mb-2 text-xs text-white/85">Vancouver, BC</p>
            <WeatherWidget />
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-os-hairline bg-os-fill-strong p-4">
        <div className="flex items-center gap-3">
          <Image src={profile.avatar} alt="" width={52} height={52} className="rounded-full object-cover" />
          <div>
            <h2 className="text-lg font-semibold text-os-primary">{profile.name}</h2>
            <p className="text-xs text-[var(--os-accent-violet-text)]">{profile.title}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-os-secondary">{profile.positioning}</p>
      </section>

      <div className="space-y-2">
        {links.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openApp(item.id)}
            className="flex min-h-11 w-full items-center justify-between rounded-xl border border-os-hairline bg-os-fill-strong px-4 py-3 text-left"
          >
            <span>
              <span className="block text-sm font-medium text-os-primary">{item.title}</span>
              <span className="block text-xs text-os-secondary">{item.subtitle}</span>
            </span>
            <span className="text-os-muted">›</span>
          </button>
        ))}
      </div>

      <div className="opacity-80">
        <CalendarWidget />
      </div>
    </div>
  );
}

function WallpaperTwinkle({ paused }: { paused: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 7) * 0.35}s`,
        size: i % 5 === 0 ? 3 : 2,
      })),
    [],
  );

  if (paused) return null;

  return (
    <div className="os-wallpaper-twinkle pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

export function ArjunOSShell() {
  const { theme, snapPreview, isMobile, activeAppId, windows, accessibility, island, workArea } = useOSState();
  const reduced = useOsReducedMotion();
  const [a11yOpen, setA11yOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const wallpaper = WALLPAPERS[theme];
  const snapPreviewBounds = useMemo(
    () => (snapPreview ? snappedBounds(snapPreview, workArea) : null),
    [snapPreview, workArea],
  );

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      className={cn("os-root relative h-[100dvh] w-screen overflow-hidden", theme === "dawn" && "os-theme-dawn")}
      data-reduce-transparency={accessibility.reduceTransparency}
      data-high-contrast={accessibility.highContrast}
      data-reduce-motion={accessibility.reduceMotion}
      data-page-visible={pageVisible}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <WallpaperLayers theme={theme} reduced={reduced} />
        <div className="absolute inset-0 bg-[var(--os-wallpaper-veil)]" />
        <WallpaperTwinkle paused={reduced || !pageVisible || !booted} />
      </div>

      <BootScreen wallpaper={wallpaper} onComplete={() => setBooted(true)} />

      <motion.div
        className={cn(!booted && "pointer-events-none")}
        aria-hidden={!booted}
        initial={false}
      >
      <div id="os-workspace" aria-hidden={island.expanded || undefined}>
      <TopRail onOpenAccessibility={() => setA11yOpen((v) => !v)} />

      <main
        className="relative h-full w-full pt-[54px] pb-24"
        role="main"
        aria-label="Arjun OS workspace"
      >
        {!isMobile && <DesktopWidgets />}
        <AccessibilityPanel open={a11yOpen} onClose={() => setA11yOpen(false)} />

        {snapPreviewBounds && (
          <motion.div
            className="pointer-events-none fixed z-[60] rounded-2xl border-2 border-dashed border-cyan-300/70 bg-cyan-300/10"
            style={{
              left: snapPreviewBounds.x,
              top: snapPreviewBounds.y,
              width: snapPreviewBounds.width,
              height: snapPreviewBounds.height,
            }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            aria-hidden
          />
        )}

        {isMobile ? (
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={!activeAppId || activeAppId === "profile" || !windows[activeAppId]?.isOpen || windows[activeAppId]?.mode === "minimized" ? "mobile-home" : activeAppId}
            className="h-full"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12, filter: "blur(3px)" }}
          >
          {(!activeAppId ||
          activeAppId === "profile" ||
          !windows[activeAppId]?.isOpen ||
          windows[activeAppId]?.mode === "minimized") ? (
            <MobileHome theme={theme} reduced={reduced} />
          ) : (
            <AppWindow appId={activeAppId}>
              {activeAppId === "work" && (
                <Suspense fallback={<AppSkeleton />}>
                  <WorkApp />
                </Suspense>
              )}
              {activeAppId === "experience" && (
                <Suspense fallback={<AppSkeleton />}>
                  <ExperienceApp />
                </Suspense>
              )}
              {activeAppId === "research" && (
                <Suspense fallback={<AppSkeleton />}>
                  <ResearchApp />
                </Suspense>
              )}
              {activeAppId === "life" && (
                <Suspense fallback={<AppSkeleton />}>
                  <LifeApp />
                </Suspense>
              )}
            </AppWindow>
          )}
          </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <AppWindow appId="profile">
              <ProfileApp />
            </AppWindow>
            <AppWindow appId="work">
              <Suspense fallback={<AppSkeleton />}>
                <WorkApp />
              </Suspense>
            </AppWindow>
            <AppWindow appId="experience">
              <Suspense fallback={<AppSkeleton />}>
                <ExperienceApp />
              </Suspense>
            </AppWindow>
            <AppWindow appId="research">
              <Suspense fallback={<AppSkeleton />}>
                <ResearchApp />
              </Suspense>
            </AppWindow>
            <AppWindow appId="life">
              <Suspense fallback={<AppSkeleton />}>
                <LifeApp />
              </Suspense>
            </AppWindow>
          </>
        )}
      </main>

      <Dock />

      <p className="pointer-events-none fixed bottom-1 right-3 z-[5] font-mono text-[10px] text-os-muted">
        © 2026 Arjun — Arjun OS
      </p>
      </div>

      <motion.div
        className="pointer-events-none fixed left-1/2 z-[110] -translate-x-1/2"
        initial={false}
        animate={{
          top: island.expanded
            ? TOP_RAIL_HEIGHT + 12
            : (TOP_RAIL_HEIGHT - 38) / 2,
        }}
        transition={islandTransition(reduced)}
      >
        <div className="pointer-events-none grid w-screen justify-items-center">
          <AiIsland />
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
