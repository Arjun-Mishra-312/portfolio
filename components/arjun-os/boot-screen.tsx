"use client";

import { useEffect, useRef, useState } from "react";
import { BootMark } from "./icons";
import { cn } from "@/utils/cn";

const FULL_MS = 2500;

type Phase = "playing" | "done";

export function BootScreen({
  onComplete,
  wallpaper = "/wallpapers/Vancouver_Dusk.webp",
}: {
  onComplete: () => void;
  wallpaper?: string;
}) {
  // Begin in the server-rendered HTML so a cold load does not wait for the
  // entire desktop to hydrate before the laptop starts opening.
  const [phase, setPhase] = useState<Phase>("playing");
  const rootRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const finishedRef = useRef(false);
  onCompleteRef.current = onComplete;

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("done");
    onCompleteRef.current();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const forceBoot = params.get("boot") === "1" || params.get("boot") === "force";
    const appDestination = params.get("app");
    const hasDirectDestination =
      (appDestination !== null && appDestination !== "profile") ||
      ["project", "ai", "tour"].some((key) => params.has(key));

    if (!forceBoot && hasDirectDestination) {
      finish();
      return;
    }

    const display = rootRef.current?.querySelector<HTMLElement>(".os-boot-display");
    if (display) {
      const coverScale = Math.max(
        window.innerWidth / display.offsetWidth,
        window.innerHeight / display.offsetHeight,
      );
      rootRef.current?.style.setProperty("--os-boot-cover-scale", String(coverScale * 1.025));
      rootRef.current?.style.setProperty("--os-boot-end-scale", String(coverScale * 1.045));
    }

    const remainingDuration = () => {
      const animation = rootRef.current?.getAnimations().find((item) =>
        item instanceof CSSAnimation && item.animationName === "os-boot-overlay-out"
      );
      const elapsed = typeof animation?.currentTime === "number" ? animation.currentTime : 0;
      return Math.max(0, FULL_MS - elapsed) + 80;
    };

    let startId = 0;
    let doneId = 0;
    const raf1 = window.requestAnimationFrame(() => {
      startId = window.requestAnimationFrame(() => {
        setPhase("playing");
        // Timeout is the source of truth — animationend is unreliable under reduce-motion CSS.
        doneId = window.setTimeout(finish, remainingDuration());
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(startId);
      window.clearTimeout(doneId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only boot choreography
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "os-boot fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#05080e]",
        "os-boot-playing",
      )}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "os-boot-overlay-out") {
          finish();
        }
      }}
      aria-busy="true"
      aria-label="Starting Arjun OS"
    >
      <button
        type="button"
        onClick={() => finish()}
        className="absolute right-4 top-4 z-10 min-h-11 rounded-full border border-white/15 bg-black/30 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
      >
        Skip intro
      </button>
      <div className="os-boot-stage">
        <div className="os-boot-perspective">
          <div className="os-boot-screen">
            <div className="os-boot-bezel" aria-hidden />
            <div className="os-boot-display">
              {/* eslint-disable-next-line @next/next/no-img-element -- boot must not wait on next/image */}
              <img
                src={wallpaper}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />
              <div className="os-boot-splash absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <BootMark />
                <p className="text-sm font-semibold tracking-[0.22em] text-white/90 sm:text-base">
                  ARJUN OS
                </p>
                <p className="font-mono text-[11px] text-white/65">Starting portfolio…</p>
                <span className="os-boot-bar mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/15">
                  <span className="os-boot-bar-fill block h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-300" />
                </span>
              </div>
            </div>
          </div>
          <div className="os-boot-base" aria-hidden />
        </div>
      </div>
    </div>
  );
}
