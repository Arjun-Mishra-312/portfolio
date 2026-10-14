"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, FileText, Play } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSActions } from "@/lib/arjun-os/os-context";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { openIntroFilm } from "./intro-film";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.9 };

/**
 * A Dynamic Island for availability, in the empty band above the desktop's windows. Compact, it reads
 * like a Live Activity: who, and when. Hover, focus or tap expands it into the details and next steps.
 */
export function StatusIsland() {
  const reduced = useOsReducedMotion();
  const { openResume } = useOSActions();
  const { profile } = portfolioData;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>(0);

  const show = () => { window.clearTimeout(closeTimer.current); setOpen(true); };
  const hide = (delay = 220) => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpen(false), delay); };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onDown = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [open]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const transition = reduced ? { duration: 0 } : SPRING;
  return (
    <div
      ref={root}
      className="si-root"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") show(); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") hide(); }}
      onFocus={show}
      onBlur={(event) => { if (!root.current?.contains(event.relatedTarget as Node)) hide(0); }}
    >
      <motion.div
        layout
        className="si-island"
        data-open={open}
        transition={transition}
        style={{ borderRadius: open ? 30 : 20 }}
      >
        {!open ? (
          <motion.button
            key="compact"
            layout="position"
            type="button"
            className="si-compact"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-label="Availability: open to new-grad roles, graduating May 2027. Show details."
            initial={reduced ? false : { opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <Image src={profile.avatar} alt="" width={22} height={22} className="si-avatar" />
            <span className="si-label">Open to new-grad roles</span>
            <span className="si-live"><i aria-hidden />May 2027</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            layout="position"
            className="si-expanded"
            role="group"
            aria-label="Availability"
            initial={reduced ? false : { opacity: 0, filter: "blur(6px)", scale: 0.96 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.32, delay: reduced ? 0 : 0.06 }}
          >
            <div className="si-head">
              <Image src={profile.avatar} alt="" width={44} height={44} className="si-avatar is-large" />
              <div className="min-w-0">
                <strong>{profile.name}</strong>
                <span>Graduating May 2027 · Vancouver, BC</span>
              </div>
              <span className="si-live is-large"><i aria-hidden />Available</span>
            </div>
            <p className="si-roles">New-grad software, forward-deployed, and AI engineering roles.</p>
            <div className="si-actions">
              <button type="button" onClick={() => { setOpen(false); openIntroFilm("short"); }}><Play size={13} fill="currentColor" aria-hidden />Watch the intro</button>
              <button type="button" onClick={() => { setOpen(false); openResume(); }}><FileText size={13} aria-hidden />Résumé</button>
              <a href={`mailto:${profile.contact.email}`}>Email<ArrowUpRight size={13} aria-hidden /></a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
