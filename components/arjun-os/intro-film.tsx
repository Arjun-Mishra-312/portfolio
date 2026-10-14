"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";

/** The two cuts of "Introducing Arjun Mishra": web encodes of the launch film (see scripts/site-media.py). */
export const INTRO_FILMS = {
  short: { src: "/films/introducing-60.mp4", poster: "/films/introducing-60.jpg", captions: "/films/introducing-60.vtt", duration: "1:12", title: "Introducing Arjun Mishra", note: "The short film" },
  full: { src: "/films/introducing.mp4", poster: "/films/introducing.jpg", captions: "/films/introducing.vtt", duration: "2:26", title: "Introducing Arjun Mishra", note: "The full film" },
} as const;
export type IntroCut = keyof typeof INTRO_FILMS;

const OPEN_EVENT = "arjun-os-intro-film";

/** Open the film player from anywhere in the OS (Home, the status island, the AI island). */
export function openIntroFilm(cut: IntroCut = "short") {
  window.dispatchEvent(new CustomEvent<IntroCut>(OPEN_EVENT, { detail: cut }));
}

/** One player for the whole OS, mounted once in the shell. */
export function IntroFilmHost() {
  const reduced = useOsReducedMotion();
  const [cut, setCut] = useState<IntroCut | null>(null);
  const [ready, setReady] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    const onOpen = (event: Event) => {
      opener.current = document.activeElement as HTMLElement | null;
      setCut((event as CustomEvent<IntroCut>).detail ?? "short");
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    video.current?.pause();
    setCut(null);
    requestAnimationFrame(() => opener.current?.focus?.({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!cut) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cut, close]);

  // A new cut starts from the top, with sound: the visitor asked for it.
  useEffect(() => {
    if (!cut || !video.current) return;
    video.current.load();
    video.current.play().catch(() => undefined);
    video.current.focus({ preventScroll: true });
  }, [cut]);

  if (!ready) return null;
  const film = cut ? INTRO_FILMS[cut] : null;
  return createPortal(
    <AnimatePresence>
      {film && cut && (
        <motion.div
          key="intro-film"
          className="if-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${film.title}, ${film.note.toLowerCase()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={close}
        >
          <motion.figure
            className="if-player"
            onClick={(event) => event.stopPropagation()}
            initial={reduced ? false : { scale: 0.94, y: 18, filter: "blur(10px)" }}
            animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
            exit={reduced ? undefined : { scale: 0.97, y: 8, filter: "blur(6px)" }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="if-frame">
              <video key={cut} ref={video} controls playsInline preload="auto" poster={film.poster} tabIndex={0} aria-label={film.title}>
                <source src={film.src} type="video/mp4" />
                <track kind="captions" src={film.captions} srcLang="en" label="English" />
              </video>
            </div>
            <figcaption className="if-caption">
              <div>
                <strong>{film.title}</strong>
                <span>{film.note} · {film.duration} · Captions in the player (CC)</span>
              </div>
              <button type="button" className="if-switch" onClick={() => setCut(cut === "short" ? "full" : "short")}>
                {cut === "short" ? `Watch the full film · ${INTRO_FILMS.full.duration}` : `Watch the short cut · ${INTRO_FILMS.short.duration}`}
              </button>
            </figcaption>
            <button type="button" className="if-close" onClick={close} aria-label="Close film"><X aria-hidden /></button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** The front door on Home: the film's own title frame, one tap from playing. */
export function IntroFilmCard() {
  const film = INTRO_FILMS.short;
  return (
    <button type="button" className="if-card" onClick={() => openIntroFilm("short")} aria-label={`Play ${film.title}, ${film.duration}`}>
      <span className="if-card-media">
        <Image src={film.poster} alt="" fill sizes="(max-width: 640px) 100vw, 900px" className="object-cover" priority />
      </span>
      <span className="if-card-copy">
        <span className="if-card-play" aria-hidden><Play size={18} fill="currentColor" /></span>
        <span>
          <strong>Watch the intro film</strong>
          <small>Roadpack, Mune, the research, IFS Copperleaf, and life away from the keyboard · {film.duration}</small>
        </span>
      </span>
    </button>
  );
}
