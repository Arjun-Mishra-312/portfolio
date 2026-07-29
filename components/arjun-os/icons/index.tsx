"use client";

import { useId, type CSSProperties } from "react";
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

const TILE_GRADIENT: Record<DockIconName, [string, string, string]> = {
  home: ["#57e8ff", "#138bff", "#0751cf"],
  work: ["#d8a8ff", "#8b5cf6", "#5630c7"],
  experience: ["#72c5ff", "#2678f2", "#1548af"],
  research: ["#80f5d0", "#22bfa0", "#087f7f"],
  life: ["#ffd166", "#ff8a47", "#ef4f72"],
  resume: ["#f8fbff", "#aebff5", "#6674c8"],
};

function Symbol({ name }: { name: DockIconName }) {
  const stroke = "rgba(255,255,255,0.94)";
  switch (name) {
    case "home":
      return (
        <g className="os-enamel-symbol">
          <path d="M15 33.5 32 18l17 15.5v15.2a4.3 4.3 0 0 1-4.3 4.3H19.3a4.3 4.3 0 0 1-4.3-4.3Z" fill="rgba(255,255,255,.94)" />
          <path d="M11.5 33 32 14.4 52.5 33" fill="none" stroke="#dff9ff" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 53V39.5c0-3.2 2.7-5.8 6-5.8s6 2.6 6 5.8V53" fill="#1598ff" />
          <circle cx="32" cy="29" r="3" fill="#70e9ff" />
        </g>
      );
    case "work":
      return (
        <g className="os-enamel-symbol">
          <rect x="14" y="18" width="29" height="25" rx="7" fill="#f2eaff" opacity=".7" transform="rotate(-8 14 18)" />
          <rect x="20" y="14" width="30" height="27" rx="7" fill="#fff" opacity=".88" transform="rotate(7 20 14)" />
          <rect x="15" y="25" width="34" height="27" rx="8" fill="#6036d0" />
          <path d="M15 34h34v10a8 8 0 0 1-8 8H23a8 8 0 0 1-8-8Z" fill="#7549ea" />
          <circle cx="24" cy="34" r="3" fill="#e8dcff" /><path d="M31 34h10" stroke="#e8dcff" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "experience":
      return (
        <g className="os-enamel-symbol">
          <path d="M24 23v-4.5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4V23" fill="none" stroke="#eaf6ff" strokeWidth="4" />
          <rect x="12" y="22" width="40" height="30" rx="9" fill="#f4f9ff" />
          <path d="M12 31h40v13a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8Z" fill="#2777e9" />
          <path d="M12 31c6 6 34 6 40 0" fill="none" stroke="#91d4ff" strokeWidth="3" />
          <rect x="28" y="29" width="8" height="9" rx="3" fill="#ff6683" stroke="white" strokeWidth="1.5" />
        </g>
      );
    case "research":
      return (
        <g className="os-enamel-symbol">
          <circle cx="30" cy="29" r="15" fill="#eafff9" opacity=".95" />
          <circle cx="30" cy="29" r="10" fill="#1cae9c" />
          <circle cx="30" cy="29" r="4.5" fill="#dffff7" />
          <path d="m40.5 40 10 10" stroke="#f2fffc" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M17 20c7-7 22-7 29 1M14 30c1 10 10 18 20 17" fill="none" stroke="#8ff1da" strokeWidth="2" strokeLinecap="round" />
          <circle cx="46" cy="19" r="3" fill="#fff4a8" />
        </g>
      );
    case "life":
      return (
        <g className="os-enamel-symbol">
          <circle cx="43" cy="19" r="7" fill="#fff4a3" />
          <path d="M8 51 24 27l9 13 7-9 16 20Z" fill="#fff" opacity=".94" />
          <path d="M8 51 25 36l8 8 7-7 16 14Z" fill="#ff5b72" />
          <path d="m18 51 8-8 5 5 5-4 8 7Z" fill="#c93d78" opacity=".72" />
        </g>
      );
    case "resume":
      return (
        <g className="os-enamel-symbol">
          <path d="M18 11h21l10 10v33H18Z" fill="#fbfdff" />
          <path d="M39 11v11h10" fill="#cbd6ff" />
          <path d="M25 30h17M25 36h17M25 42h12" stroke="#5967bd" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="46" r="8" fill="#43d6a7" stroke="white" strokeWidth="2" />
          <path d="m40.5 46 2.3 2.2 4.2-4.8" fill="none" stroke="#075b49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
  }
}

function EnamelGlyph({ name }: { name: DockIconName }) {
  const rawId = useId().replace(/:/g, "");
  const gradientId = `dock-${name}-${rawId}`;
  const shadowId = `dock-shadow-${name}-${rawId}`;
  const [top, middle, bottom] = TILE_GRADIENT[name];
  return (
    <svg className="os-enamel-icon h-full w-full overflow-visible" viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="13" y1="5" x2="51" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor={top} />
          <stop offset=".48" stopColor={middle} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <filter id={shadowId} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#07101f" floodOpacity=".28" /></filter>
      </defs>
      <rect x="4" y="3" width="56" height="57" rx="16" fill={`url(#${gradientId})`} stroke="rgba(255,255,255,.72)" strokeWidth="1" filter={`url(#${shadowId})`} />
      <path className="os-enamel-sheen" d="M12 7h40c4 0 6 2.2 6 6-12-3.5-31-2.5-50 6 .2-6.8 1.2-10.5 4-12Z" fill="rgba(255,255,255,.3)" />
      <path d="M9 45c13 9 34 10 49-1v7c0 4-3 7-7 7H13c-4 0-7-3-7-7v-8Z" fill="rgba(0,0,0,.08)" />
      <g filter={`url(#${shadowId})`}><Symbol name={name} /></g>
    </svg>
  );
}

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
      <span className="os-dock-tile-face absolute inset-0 rounded-[14px]" aria-hidden />
      <span className="relative z-[1] h-full w-full">
        <EnamelGlyph name={name} />
      </span>
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
