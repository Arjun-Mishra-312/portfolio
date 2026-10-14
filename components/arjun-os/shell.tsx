"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { snappedBounds, TOP_RAIL_HEIGHT } from "@/lib/arjun-os/constants";
import { islandTransition, stateTransition, useOsReducedMotion } from "@/lib/arjun-os/motion";
import type { AppId } from "@/lib/arjun-os/types";
import { AccessibilityPanel } from "./accessibility-panel";
import { AppWindow } from "./app-window";
import { BootScreen } from "./boot-screen";
import { Dock } from "./dock";
import { PhoneTabBar, TabletSidebar } from "./adaptive-navigation";
import { AiIsland } from "./ai-island";
import { TopRail } from "./top-rail";
import { DesktopWidgets, MobileConnectedWidgets } from "./widgets/desktop-widgets";
import { ProfileApp } from "./apps/profile-app";
import { IntroFilmHost } from "./intro-film";
import { BrandTransitionHost } from "./brand-transition";
import { StatusIsland } from "./status-island";
import { TourDot } from "./tour-dot";
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

function MobileHome() {
  return (
    <div className="os-phone-home flex h-full flex-col overflow-y-auto">
      <ProfileApp />
      <div className="px-5 pb-8"><MobileConnectedWidgets /></div>
    </div>
  );
}

function AdaptiveAppContent({ appId }: { appId: AppId }) {
  const { activeProjectId, activeExperienceId, layoutMode } = useOSState();
  const { dispatch, selectTab } = useOSActions();
  const viewportRef = useRef<HTMLDivElement>(null);
  const showBack = appId === "work" ? Boolean(activeProjectId) : appId === "experience" ? Boolean(activeExperienceId) : false;
  const showHome = layoutMode === "phone" && appId !== "profile" && !showBack;
  const title = appId === "profile" ? "Home" : appId === "work" ? "Work" : appId === "experience" ? "Experience" : appId === "research" ? "Research" : "Life + Play";

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const saved = Number(sessionStorage.getItem(`arjun-os-scroll-${appId}`) ?? 0);
    requestAnimationFrame(() => viewport.scrollTo({ top: saved, behavior: "auto" }));
    const reset = (event: Event) => {
      if ((event as CustomEvent<AppId>).detail !== appId) return;
      sessionStorage.setItem(`arjun-os-scroll-${appId}`, "0");
      viewport.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("arjun-os-tab-reset", reset);
    return () => window.removeEventListener("arjun-os-tab-reset", reset);
  }, [appId]);

  return (
    <section className="os-adaptive-app" aria-label={title}>
      {(layoutMode !== "phone" || showBack) && <header className={cn("os-adaptive-app-header", layoutMode === "phone" && "os-phone-inline-header")}>
        {showBack ? (
          <button
            type="button"
            className="os-adaptive-back"
            onClick={() => dispatch(appId === "work" ? { type: "SET_ACTIVE_PROJECT", projectId: null } : { type: "SET_ACTIVE_EXPERIENCE", experienceId: null })}
          >
            <span aria-hidden>‹</span> Back
          </button>
        ) : showHome ? (
          <button type="button" className="os-adaptive-back" onClick={() => selectTab("profile") }>
            <span aria-hidden>‹</span> Home
          </button>
        ) : <span className="w-16" aria-hidden />}
        <h1>{title}</h1>
        <span className="w-16" aria-hidden />
      </header>}
      <div
        ref={viewportRef}
        className="os-app-viewport"
        data-layout={layoutMode}
        onScroll={(event) => sessionStorage.setItem(`arjun-os-scroll-${appId}`, String(event.currentTarget.scrollTop))}
      >
        {appId === "profile" && <ProfileApp />}
        {appId === "work" && <Suspense fallback={<AppSkeleton />}><WorkApp /></Suspense>}
        {appId === "experience" && <Suspense fallback={<AppSkeleton />}><ExperienceApp /></Suspense>}
        {appId === "research" && <Suspense fallback={<AppSkeleton />}><ResearchApp /></Suspense>}
        {appId === "life" && <Suspense fallback={<AppSkeleton />}><LifeApp /></Suspense>}
      </div>
    </section>
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
  const { theme, snapPreview, layoutMode, activeAppId, windows, accessibility, island, workArea } = useOSState();
  const isMobile = layoutMode === "phone";
  const isTabletPortrait = layoutMode === "tabletPortrait";
  const isAdaptive = isMobile || isTabletPortrait;
  const reduced = useOsReducedMotion();
  const [a11yOpen, setA11yOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [railHeight, setRailHeight] = useState(TOP_RAIL_HEIGHT);
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

  useEffect(() => {
    if (!isAdaptive) {
      setRailHeight(TOP_RAIL_HEIGHT);
      return;
    }
    const measure = () => {
      const rail = document.querySelector<HTMLElement>(".os-top-rail");
      if (rail) setRailHeight(rail.getBoundingClientRect().height || TOP_RAIL_HEIGHT);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isAdaptive]);

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
        className={cn("h-full", !booted && "pointer-events-none")}
        aria-hidden={!booted}
        initial={false}
      >
      <div id="os-workspace" className="h-full" aria-hidden={(island.expanded && island.mode !== "compose") || undefined}>
      {isAdaptive && <TopRail onOpenAccessibility={() => setA11yOpen((v) => !v)} />}

      <main
        className={cn(
          "relative h-full w-full",
          isAdaptive && "pt-[var(--os-top-rail-height)]",
          "pb-0",
        )}
        role="main"
        aria-label="Arjun OS workspace"
      >
        {layoutMode === "desktop" && <DesktopWidgets />}
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

        {isAdaptive ? (
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeAppId ?? "profile"}
            className="h-full"
            initial={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, x: 14 }
                  : { opacity: 0, x: 18, filter: "blur(4px)" }
            }
            animate={
              reduced || isMobile
                ? { opacity: 1, x: 0 }
                : { opacity: 1, x: 0, filter: "blur(0px)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, x: -10 }
                  : { opacity: 0, x: -12, filter: "blur(3px)" }
            }
            transition={stateTransition(reduced)}
          >
          <div className={cn("h-full", isTabletPortrait && "flex bg-[var(--os-solid-fallback)]")}>
            {isTabletPortrait && <TabletSidebar />}
            <div className="h-full min-w-0 flex-1">
              {(activeAppId ?? "profile") === "profile" && isMobile ? <MobileHome /> : <AdaptiveAppContent appId={activeAppId ?? "profile"} />}
            </div>
          </div>
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

      {isMobile ? <PhoneTabBar /> : !isTabletPortrait && <Dock onOpenAccessibility={() => setA11yOpen((v) => !v)} />}
      {layoutMode === "desktop" && booted && <StatusIsland />}
      <TourDot />

      {!isMobile && (
        <p className="pointer-events-none fixed bottom-1 right-3 z-[5] font-mono text-[10px] text-os-muted">
          © 2026 Arjun — Arjun OS
        </p>
      )}
      </div>

      {isMobile ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[110]"
          initial={false}
          animate={{
            top: island.expanded
              ? railHeight + 12
              : Math.max(0, railHeight - TOP_RAIL_HEIGHT) + (TOP_RAIL_HEIGHT - 38) / 2,
          }}
          transition={islandTransition(reduced)}
        >
          <div className="pointer-events-none grid w-screen justify-items-center"><AiIsland /></div>
        </motion.div>
      ) : (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[110] grid items-end justify-items-center pb-5"
          initial={false}
          animate={{ y: island.expanded ? -4 : 0 }}
          transition={islandTransition(reduced)}
        >
          <AiIsland />
        </motion.div>
      )}
      </motion.div>
      <IntroFilmHost />
      <BrandTransitionHost />
    </div>
  );
}
