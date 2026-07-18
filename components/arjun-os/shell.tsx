"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { TOP_RAIL_HEIGHT } from "@/lib/arjun-os/constants";
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

function MobileHome({ wallpaper }: { wallpaper: string }) {
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
          <Image src={wallpaper} alt="" fill className="object-cover" priority />
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
  const { theme, snapPreview, isMobile, activeAppId, windows, accessibility, island } = useOSState();
  const reduced = useOsReducedMotion();
  const [a11yOpen, setA11yOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const wallpaper =
    theme === "dawn" ? "/wallpapers/vancouver-dawn.png" : "/wallpapers/vancouver-dusk.png";

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
        <Image
          src={wallpaper}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--os-wallpaper-veil)]" />
        <WallpaperTwinkle paused={reduced || !pageVisible || !booted} />
      </div>

      <BootScreen onComplete={() => setBooted(true)} />

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

        {snapPreview && (
          <motion.div
            className="pointer-events-none absolute bottom-24 top-[54px] z-[60] rounded-2xl border-2 border-dashed border-cyan-300/70 bg-cyan-300/10"
            style={{
              left: snapPreview === "left" ? 12 : "50%",
              width: "calc(50% - 18px)",
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
            <MobileHome wallpaper={wallpaper} />
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

      <div
        className="pointer-events-none fixed left-1/2 z-[110] -translate-x-1/2"
        style={{ top: TOP_RAIL_HEIGHT + 12 }}
      >
        <div className="pointer-events-none grid w-screen justify-items-center">
          <AiIsland />
        </div>
      </div>
      </motion.div>
    </div>
  );
}
