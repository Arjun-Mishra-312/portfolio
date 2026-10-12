"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Music2,
  Radio,
  Send,
  Share2,
  Trophy,
  UserRound,
  Box,
} from "lucide-react";
import type { GithubPulsePayload } from "@/app/api/github-pulse/route";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSState } from "@/lib/arjun-os/os-context";
import { LegoViewerModal, getLegoPreviewSrc } from "@/components/arjun-os/lego-viewer-modal";
import { cn } from "@/utils/cn";

const SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM";
const SPOTIFY_EMBED_BASE =
  "https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator";

export function WidgetCard({
  children,
  className,
  label,
  widgetId,
  focused,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  widgetId?: string;
  focused?: boolean;
}) {
  return (
    <section
      className={cn(
        "os-widget os-connected-widget h-full overflow-hidden p-4",
        focused && "os-widget-focused",
        className,
      )}
      aria-label={label}
      data-os-widget={widgetId}
      data-os-focused={focused ? "true" : undefined}
    >
      {children}
    </section>
  );
}

function WidgetHeading({ icon: Icon, eyebrow, action }: { icon: typeof Music2; eyebrow: string; action?: React.ReactNode }) {
  return (
    <div className="os-widget-heading mb-3.5 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2 text-[11px] font-semibold tracking-wide text-os-secondary">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--os-accent-cyan)]" aria-hidden />
        <span className="truncate">{eyebrow}</span>
      </div>
      {action}
    </div>
  );
}

export function FocusRadioWidget({ focused = false }: { focused?: boolean }) {
  const { theme } = useOSState();
  const embedLight = theme === "dawn";

  return (
    <WidgetCard label="Focus Radio" className="flex flex-col" widgetId="focus-radio" focused={focused}>
      <WidgetHeading
        icon={Radio}
        eyebrow="Focus Radio"
        action={<span className="text-lg leading-none text-os-muted" aria-hidden>⋮</span>}
      />
      <iframe
        key={embedLight ? "spotify-light" : "spotify-dark"}
        title="Focus Radio Spotify player"
        src={`${SPOTIFY_EMBED_BASE}&theme=${embedLight ? 1 : 0}`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className={cn(
          "h-[352px] shrink-0 rounded-2xl border-0",
          embedLight ? "bg-[#f6f6f6]" : "bg-[#121212]",
        )}
      />
      <a href={SPOTIFY_PLAYLIST} target="_blank" rel="noreferrer" className="mt-2 text-center text-[9px] text-os-muted hover:text-os-primary">
        Open full playlist on Spotify
      </a>
    </WidgetCard>
  );
}

function fallbackPulse(): GithubPulsePayload {
  const now = new Date();
  return {
    days: Array.from({ length: 126 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (125 - index));
      return { date: date.toISOString().slice(0, 10), count: 0, level: 0 };
    }),
    total: 0,
    streak: 0,
    latest: null,
    status: "fallback",
    fetchedAt: now.toISOString(),
  };
}

export function GithubPulseWidget({ focused = false }: { focused?: boolean }) {
  const [pulse, setPulse] = useState<GithubPulsePayload | null>(null);
  const [selected, setSelected] = useState(125);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-pulse")
      .then(async (response) => {
        if (!response.ok) throw new Error(`GitHub pulse ${response.status}`);
        return (await response.json()) as GithubPulsePayload;
      })
      .then((data) => {
        if (cancelled) return;
        setPulse(data);
        setSelected(Math.max(0, data.days.length - 1));
      })
      .catch(() => {
        if (cancelled) return;
        setPulse(fallbackPulse());
      });
    return () => { cancelled = true; };
  }, []);

  const ready = pulse ?? fallbackPulse();
  const selectedDay = ready.days[selected] ?? ready.days.at(-1);
  const loading = pulse === null;

  return (
    <WidgetCard label="GitHub Pulse" className="flex flex-col" widgetId="github-pulse" focused={focused}>
      <WidgetHeading icon={Github} eyebrow="GitHub Pulse" />
      <div className="relative overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridAutoColumns: "9px" }}
          aria-label="GitHub contributions for the last 18 weeks"
          aria-busy={loading}
        >
          {ready.days.map((day, index) => (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`${day.date}: ${day.count} contributions`}
              aria-pressed={selected === index}
              className={cn(
                "os-github-day h-[9px] w-[9px] rounded-[2.5px] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
                selected === index && "scale-125 outline outline-1 outline-[var(--os-accent-cyan)]",
              )}
              style={{
                background:
                  day.level === 0
                    ? "var(--os-github-empty)"
                    : `color-mix(in srgb, var(--os-accent-mint) ${28 + day.level * 18}%, transparent)`,
              }}
            />
          ))}
        </div>
        {loading && (
          <span className="os-github-loading" role="status" aria-label="Loading GitHub activity" />
        )}
      </div>
      <div className="mt-3.5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[22px] font-semibold leading-none tracking-tight tabular-nums text-os-primary">{ready.total}</p>
          <p className="mt-1 text-[11px] text-os-muted">{ready.total > 0 ? "contributions" : "public activity"} · {ready.streak}d streak</p>
        </div>
        <p className="max-w-[100px] text-right text-[11px] leading-4 text-os-secondary">
          {selectedDay ? `${selectedDay.date.slice(5)} · ${selectedDay.count}` : "Activity unavailable"}
        </p>
      </div>
      {ready.latest && (
        <a href={ready.latest.url} target="_blank" rel="noreferrer" className="mt-3 flex min-h-10 items-center justify-between rounded-2xl bg-os-fill px-3 text-[11px] text-os-secondary hover:bg-os-hover">
          <span className="truncate"><span className="text-os-primary">{ready.latest.repo}</span> · {ready.latest.label}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )}
    </WidgetCard>
  );
}

export function LinkedinWidget() {
  const profile = portfolioData.profile;
  return (
    <WidgetCard label="LinkedIn Connect">
      <WidgetHeading icon={Linkedin} eyebrow="LinkedIn" />
      <div className="flex items-center gap-3">
        <Image src={profile.avatar} alt="Arjun Mishra" width={48} height={48} className="h-12 w-12 rounded-full border border-os-hairline object-cover" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-tight text-os-primary">{profile.name}</p>
          <p className="truncate text-[12px] text-[var(--os-accent-cobalt-text)]">{profile.title}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-os-muted"><MapPin className="h-2.5 w-2.5" /> Vancouver, BC</p>
        </div>
      </div>
      <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="mt-3.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#0a66c2] px-3 text-[12px] font-medium text-white hover:bg-[#095aa9]">
        Connect on LinkedIn <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </WidgetCard>
  );
}

const DEVPOST_ITEMS = [
  { title: "LLM Pro Max", award: "Hack the North 2024 Codegen prize", href: "https://devpost.com/software/llm-pro-max", accent: "violet" },
  { title: "Re-Plate", award: "youCode 2025 SAP Stream winner", href: "https://devpost.com/software/replate-z3b5mg", accent: "mint" },
] as const;

export function DevpostWidget() {
  const [index, setIndex] = useState(0);
  const item = DEVPOST_ITEMS[index];
  return (
    <WidgetCard label="Devpost Launchpad" className="flex flex-col">
      <WidgetHeading icon={Trophy} eyebrow="Devpost Launchpad" />
      <div className="flex min-h-[112px] flex-1 flex-col justify-between rounded-2xl border border-os-hairline bg-os-fill/80 p-3.5">
        <div>
          <p className="text-[17px] font-semibold leading-snug tracking-tight text-os-primary">{item.title}</p>
          <p className="mt-1.5 text-[12px] leading-5 text-os-secondary">{item.award}</p>
        </div>
        <a href={item.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-[12px] font-medium text-[var(--os-accent-violet-text)] hover:underline">
          View on Devpost <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] tabular-nums text-os-muted">{index + 1} / {DEVPOST_ITEMS.length}</span>
        <div className="flex gap-0.5">
          <button type="button" className="os-icon-action" aria-label="Previous Devpost project" onClick={() => setIndex((index - 1 + DEVPOST_ITEMS.length) % DEVPOST_ITEMS.length)}><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button type="button" className="os-icon-action" aria-label="Next Devpost project" onClick={() => setIndex((index + 1) % DEVPOST_ITEMS.length)}><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </WidgetCard>
  );
}

export function CoffeeChatWidget({ focused = false }: { focused?: boolean }) {
  const email = portfolioData.profile.contact.email;
  return (
    <WidgetCard label="Coffee Chat" className="os-coffee-card flex min-h-[228px] flex-col" widgetId="coffee-chat" focused={focused}>
      <WidgetHeading icon={Coffee} eyebrow="Coffee Chat" />
      <a
        href={`mailto:${email}?subject=Coffee%20chat%20with%20Arjun`}
        className="group flex min-h-[128px] flex-1 items-center gap-3.5 overflow-hidden rounded-2xl py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--os-accent-violet)]"
        aria-label="Start a coffee chat with Arjun by email"
      >
        <span className="os-mail-scene" aria-hidden>
          <span className="os-mail-animated">
            <span className="os-mail-back-fold" />
            <span className="os-mail-letter">
              <span className="os-mail-letter-border" />
              <span className="os-mail-letter-title" />
              <span className="os-mail-letter-context" />
              <span className="os-mail-letter-stamp" />
            </span>
            <span className="os-mail-top-fold" />
            <span className="os-mail-body" />
            <span className="os-mail-left-fold" />
          </span>
          <span className="os-mail-shadow" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug tracking-tight text-os-primary">Let’s build something thoughtful.</span>
          <span className="mt-1 block text-[11px] leading-4 text-os-secondary">AI, HCI, accessibility, or a good coffee in Vancouver.</span>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--os-accent-violet-text)]">Write to me <Mail className="h-3 w-3" /></span>
        </span>
      </a>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-os-muted"><Clock3 className="h-3 w-3" /> Pacific Time · replies by email</p>
    </WidgetCard>
  );
}

type NotePhase = "idle" | "sending" | "sent" | "error";

export function PrivateNoteWidget() {
  const [phase, setPhase] = useState<NotePhase>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("sending");
    const form = event.currentTarget;
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
    try {
      const response = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setPhase("sent");
    } catch {
      setPhase("error");
    }
  }

  return (
    <WidgetCard label="Leave Arjun a private note">
      <WidgetHeading icon={MessageSquareText} eyebrow="Private Note" />
      {phase === "sent" ? (
        <div className="flex min-h-[184px] flex-col items-center justify-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-[var(--os-accent-mint-text)]"><Check className="h-5 w-5" /></span>
          <p className="mt-3 text-sm font-medium text-os-primary">Note delivered</p>
          <p className="mt-1 text-[10px] text-os-secondary">Thanks — only Arjun can see it.</p>
          <button type="button" onClick={() => setPhase("idle")} className="mt-3 min-h-11 text-[10px] text-[var(--os-accent-cyan-text)]">Send another</button>
        </div>
      ) : (
        <form name="arjun-private-note" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="space-y-2">
          <input type="hidden" name="form-name" value="arjun-private-note" />
          <p className="hidden"><label>Do not fill this out <input name="bot-field" /></label></p>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="note-name">Name</label>
            <input id="note-name" name="name" required maxLength={50} placeholder="Name" className="os-widget-input" />
            <label className="sr-only" htmlFor="note-email">Email, optional</label>
            <input id="note-email" name="email" type="email" maxLength={120} placeholder="Email (optional)" className="os-widget-input" />
          </div>
          <label className="sr-only" htmlFor="note-message">Private message</label>
          <textarea id="note-message" name="message" required maxLength={300} rows={4} placeholder="Leave a short private note…" className="os-widget-input resize-none" />
          <button disabled={phase === "sending"} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--os-action-cobalt)] px-3 text-xs font-medium text-white disabled:opacity-60">
            {phase === "sending" ? "Sending…" : "Send privately"} <Send className="h-3.5 w-3.5" />
          </button>
          {phase === "error" && <p role="alert" className="text-[10px] text-[var(--os-accent-coral-text)]">Couldn’t send the note. Please use email instead.</p>}
          <p className="text-center text-[9px] text-os-muted">Not published. Stored in Netlify Forms.</p>
        </form>
      )}
    </WidgetCard>
  );
}

export function ArjunPassWidget() {
  const profile = portfolioData.profile;
  const reduced = useOsReducedMotion();
  const vcard = useMemo(() => [
    "BEGIN:VCARD", "VERSION:3.0", "N:Mishra;Arjun;;;", "FN:Arjun Mishra",
    `TITLE:${profile.title}`, `EMAIL:${profile.contact.email}`, `URL:${profile.contact.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.contact.github}`, "ADR:;;;Vancouver;BC;;Canada", "END:VCARD",
  ].join("\r\n"), [profile]);

  function downloadContact() {
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Arjun-Mishra.vcf";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function shareContact() {
    if (navigator.share) await navigator.share({ title: profile.name, text: profile.positioning, url: profile.contact.linkedin });
    else downloadContact();
  }

  return (
    <WidgetCard label="Arjun Pass">
      <WidgetHeading icon={UserRound} eyebrow="Arjun Pass" />
      <motion.div whileHover={reduced ? undefined : { rotateX: 1.5, rotateY: -2 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-violet-400/10 to-rose-400/10 p-3">
        <div className="flex items-center gap-3">
          <Image src={profile.avatar} alt="" width={42} height={42} className="rounded-full object-cover" />
          <div><p className="text-sm font-semibold text-os-primary">Arjun Mishra</p><p className="text-[9px] text-os-secondary">AI Engineer + HCI Researcher</p></div>
        </div>
        <p className="mt-3 text-[9px] text-os-muted">Vancouver · Pacific Time</p>
      </motion.div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={downloadContact} className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-os-fill text-[10px] text-os-primary hover:bg-os-hover"><Download className="h-3.5 w-3.5" /> Save contact</button>
        <button type="button" onClick={shareContact} className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-os-fill text-[10px] text-os-primary hover:bg-os-hover"><Share2 className="h-3.5 w-3.5" /> Share</button>
      </div>
    </WidgetCard>
  );
}

export function LegoBuildWidget() {
  const [open, setOpen] = useState(false);
  const reduced = useOsReducedMotion();
  const { theme } = useOSState();
  const isLight = theme === "dawn";
  const previewSrc = getLegoPreviewSrc(theme);

  return (
    <>
      <WidgetCard label="LEGO Build" className="flex flex-col">
        <WidgetHeading icon={Box} eyebrow="LEGO Build" />
        <motion.button
          type="button"
          className="group relative min-h-[148px] overflow-hidden rounded-2xl border border-os-hairline text-left"
          onClick={() => setOpen(true)}
          whileHover={reduced ? undefined : { scale: 1.01 }}
          whileTap={reduced ? undefined : { scale: 0.985 }}
          aria-label="Open LEGO McLaren P1 3D model"
        >
          <Image
            key={previewSrc}
            src={previewSrc}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="320px"
            priority
          />
          <div
            className={cn(
              "absolute inset-0",
              isLight
                ? "bg-gradient-to-t from-black/45 via-transparent to-transparent"
                : "bg-gradient-to-t from-black/75 via-black/20 to-transparent",
            )}
          />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-sm font-semibold text-white">McLaren P1</p>
            <p className="mt-0.5 text-[11px] text-white/85">Preview · tap to expand</p>
          </div>
        </motion.button>
      </WidgetCard>
      <LegoViewerModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const CONNECTED_WIDGETS = [
  { id: "focus-radio", component: FocusRadioWidget },
  { id: "github-pulse", component: GithubPulseWidget },
  { id: "linkedin", component: LinkedinWidget },
  { id: "devpost", component: DevpostWidget },
  { id: "coffee", component: CoffeeChatWidget },
  { id: "note", component: PrivateNoteWidget },
  { id: "pass", component: ArjunPassWidget },
  { id: "lego", component: LegoBuildWidget },
] as const;
