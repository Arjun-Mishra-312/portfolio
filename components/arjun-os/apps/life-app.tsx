"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";

const ModelViewerCard = dynamic(
  () => import("@/components/ui/model-viewer-card").then((mod) => mod.ModelViewerCard),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-2xl border border-os-hairline bg-os-fill" /> },
);

export function LifeApp() {
  const reduced = useOsReducedMotion();
  const photos = [
    "/experiences_photos/IMG-20250915-WA0004.jpg",
    "/experiences_photos/IMG-20250915-WA0010.jpg",
    "/experiences_photos/IMG-20250915-WA0020.jpg",
    "/experiences_photos/IMG-20250915-WA0030.jpg",
    "/experiences_photos/IMG-20250915-WA0040.jpg",
    "/experiences_photos/IMG-20250915-WA0050.jpg",
  ];

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-7">
      <motion.div className="relative aspect-[16/7] min-h-[180px] overflow-hidden rounded-2xl border border-os-hairline" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}>
        <Image src={portfolioData.life.heroVisual} alt={portfolioData.visuals.lifeHeroAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/90 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="bg-gradient-to-r from-amber-200 via-rose-200 to-sky-200 bg-clip-text text-2xl font-semibold text-transparent">Life + Play</h3>
          <p className="mt-1 max-w-xl text-sm text-white/75">A warm scrapbook of Vancouver, builds, and interests — personality without distracting from employability.</p>
        </div>
      </motion.div>

      <motion.div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" variants={staggerContainer(reduced, 0.08)} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }}>
        <motion.section variants={cinematicItem(reduced)} className="rounded-2xl border border-os-hairline bg-os-fill-strong p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-accent-amber-text)]">Vancouver</p>
          <p className="mt-2 text-sm text-[var(--os-text-secondary)]">{portfolioData.life.vancouver}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {photos.map((src, index) => (
              <motion.div key={src} whileHover={reduced ? undefined : { y: -4, rotate: index % 2 === 0 ? -1.2 : 1.2, scale: 1.03 }} className="relative aspect-square overflow-hidden rounded-xl border border-os-hairline">
                <Image src={src} alt={`Vancouver gallery photograph ${index + 1}`} fill className="object-cover" sizes="120px" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={cinematicItem(reduced)} className="rounded-2xl border border-os-hairline bg-os-fill-strong p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-accent-amber-text)]">LEGO + builds</p>
          <p className="mt-2 text-sm text-[var(--os-text-secondary)]">{portfolioData.life.lego}</p>
          <div className="mt-4 flex justify-center"><ModelViewerCard reducedMotion={reduced} /></div>
        </motion.section>
      </motion.div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portfolioData.life.interests.map((interest) => (
          <motion.div key={interest} whileHover={reduced ? undefined : { y: -3, scale: 1.02 }} className="rounded-xl border border-os-hairline bg-os-fill px-3 py-4 text-center text-sm text-[var(--os-text-primary)]">{interest}</motion.div>
        ))}
      </div>
    </div>
  );
}
