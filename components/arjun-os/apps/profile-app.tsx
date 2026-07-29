"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSActions } from "@/lib/arjun-os/os-context";
import type { AppId } from "@/lib/arjun-os/types";

export function ProfileApp() {
  const { openApp, openResume, openIsland } = useOSActions();
  const { profile } = portfolioData;

  const nav: { id: AppId; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "work", label: "Work" },
    { id: "experience", label: "Experience" },
    { id: "research", label: "Research" },
    { id: "life", label: "Life + Play" },
    { id: "lab", label: "Experience Lab" },
  ];

  return (
    <div className="flex h-full min-h-[420px]">
      <aside className="os-profile-internal-nav hidden w-44 shrink-0 border-r border-os-hairline bg-os-fill-strong p-3 sm:block">
        <nav className="space-y-1" aria-label="Profile navigation">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openApp(item.id)}
              className={
                item.id === "profile"
                  ? "flex w-full items-center gap-2 rounded-lg border-l-2 border-[var(--os-accent-violet)] bg-os-fill-strong px-3 py-2 text-left text-sm"
                  : "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--os-text-secondary)] hover:bg-os-hover"
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={72}
            height={72}
            className="rounded-full border-2 border-[var(--os-accent-violet)]/50 object-cover"
          />
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-[var(--os-text-primary)] sm:text-3xl">
              {profile.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--os-accent-cobalt-text)]">{profile.title}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-[var(--os-text-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </p>
          </div>
        </div>

        <div className="my-5 h-px bg-gradient-to-r from-cyan-400/60 via-violet-400/60 to-orange-300/60" />

        <p className="max-w-2xl text-[15px] leading-7 text-[var(--os-text-secondary)]">{profile.positioning}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
              Focus areas
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--os-text-primary)]">
              {profile.focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
              Quick facts
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--os-text-primary)]">
              {profile.quickFacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-5 text-xs text-[var(--os-accent-mint-text)]">{profile.availability}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openResume}
            className="rounded-xl bg-[var(--os-action-cobalt)] px-4 py-2.5 text-sm font-medium text-white"
            style={{ color: "#fff", backgroundColor: "#2458b8" }}
          >
            Open Resume
          </button>
          <button
            type="button"
            onClick={() => openIsland("Why should we interview Arjun?")}
            className="rounded-xl border border-os-hairline px-4 py-2.5 text-sm text-[var(--os-text-primary)]"
          >
            Ask Arjun
          </button>
          <Link
            href={`mailto:${profile.contact.email}`}
            className="rounded-xl border border-os-hairline px-4 py-2.5 text-sm text-[var(--os-text-primary)]"
          >
            Email
          </Link>
        </div>
      </div>
    </div>
  );
}
