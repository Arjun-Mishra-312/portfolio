"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { cn } from "@/utils/cn";

export type DockIconName = "home" | "work" | "experience" | "research" | "life" | "resume";

const ACCENT: Record<DockIconName, string> = {
  home: "#22d3ee",
  work: "#a78bfa",
  experience: "#3b82f6",
  research: "#34d399",
  life: "#f59e0b",
  resume: "#94a3b8",
};

export function DockTile({
  name,
  active,
  className,
}: {
  name: DockIconName;
  active?: boolean;
  className?: string;
}) {
  const accent = ACCENT[name];
  return (
    <span
      className={cn("os-dock-tile relative flex h-11 w-11 items-center justify-center", className)}
      style={
        {
          "--dock-accent": accent,
        } as CSSProperties
      }
      data-active={active ? "true" : "false"}
    >
      <Image
        src={`/arjun-os/icons/${name}.svg?v=2`}
        alt=""
        aria-hidden
        width={64}
        height={64}
        unoptimized
        className="os-app-icon h-full w-full"
      />
    </span>
  );
}

export function ThemeGlyph({ dusk }: { dusk: boolean }) {
  return (
    <span className="os-theme-glyph relative inline-flex h-5 w-5 items-center justify-center" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="overflow-visible">
        <g
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: dusk ? 0 : 1 }}
        >
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="2.4"
              x2="12"
              y2="4.6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </g>
        <path
          d="M15.2 4.6a7.2 7.2 0 1 0 4.6 12.5 5.8 5.8 0 1 1-4.6-12.5Z"
          fill="currentColor"
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: dusk ? 1 : 0 }}
        />
      </svg>
    </span>
  );
}

export function WeatherSunCloud({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="4.5" fill="#FBBF24" />
      <path
        d="M9 19h11a4 4 0 0 0 .2-8 5.5 5.5 0 0 0-10.4 1.5A3.5 3.5 0 0 0 9 19Z"
        fill="rgba(255,255,255,0.88)"
        stroke="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

export function IslandMark() {
  return (
    <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden>
      <span className="absolute inset-0 rounded-full bg-cyan-300/50 blur-[3px]" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-300" />
    </span>
  );
}

export function BootMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="6" width="32" height="22" rx="4" stroke="url(#bootGrad)" strokeWidth="1.6" />
      <path d="M12 34h16" stroke="url(#bootGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 28v6M24 28v6" stroke="url(#bootGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="bootGrad" x1="4" y1="6" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
    </svg>
  );
}
