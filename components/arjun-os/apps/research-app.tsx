"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSState } from "@/lib/arjun-os/os-context";
import { PhoneLargeTitle, PhoneSection } from "@/components/arjun-os/phone-ui";

const nodes = ["Accessibility", "Multimodal AI", "HCI", "Developer Tools"];

export function ResearchApp() {
  const reduced = useOsReducedMotion();
  const { layoutMode } = useOSState();

  if (layoutMode === "phone") {
    return (
      <div className="os-phone-screen os-journal-screen">
        <PhoneLargeTitle title="Research" eyebrow="Arjun OS · Journal" />
        <article className="os-journal-feature">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={portfolioData.visuals.researchHero} alt={portfolioData.visuals.researchHeroAlt} fill className="object-cover" />
          </div>
          <div>
            <p className="os-phone-eyebrow">Featured thread</p>
            <h2>AI + human-centered systems</h2>
            <p>Research connecting accessibility, multimodal AI, HCI, and developer tools.</p>
          </div>
        </article>
        <PhoneSection title="Current threads">
          <div className="os-journal-feed">
            {portfolioData.research.map((item, index) => (
              <article key={item.id}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div>
                    {item.themes.map((theme) => (
                      <small key={theme}>{theme}</small>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PhoneSection>
        <PhoneSection title="Research map">
          <div className="os-journal-map">
            {nodes.map((node) => (
              <span key={node}>{node}</span>
            ))}
          </div>
        </PhoneSection>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-7">
      <div className="os-journal-desktop">
        <p className="os-phone-eyebrow">Arjun OS · Journal</p>
        <h2 className="mt-1 text-[28px] font-semibold tracking-tight text-[var(--os-text-primary)]">Research</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--os-text-secondary)]">
          Threads connecting accessibility, multimodal AI, HCI, and developer tools — grounded in SOCIUS Lab work and applied engineering.
        </p>

        <motion.article
          className="os-journal-feature mt-6"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative aspect-[16/7] min-h-[180px] overflow-hidden">
            <Image
              src={portfolioData.visuals.researchHero}
              alt={portfolioData.visuals.researchHeroAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 760px"
            />
          </div>
          <div>
            <p className="os-phone-eyebrow">Featured thread</p>
            <h2>AI + human-centered systems</h2>
            <p>Research connecting accessibility, multimodal AI, HCI, and developer tools.</p>
          </div>
        </motion.article>

        <PhoneSection title="Current threads">
          <motion.div
            className="os-journal-feed"
            variants={staggerContainer(reduced, 0.08)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {portfolioData.research.map((item, index) => (
              <article key={item.id}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div>
                    {item.themes.map((theme) => (
                      <small key={theme}>{theme}</small>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </PhoneSection>

        <PhoneSection title="Research map">
          <div className="os-journal-map">
            {nodes.map((node) => (
              <span key={node}>{node}</span>
            ))}
          </div>
        </PhoneSection>
      </div>
    </div>
  );
}
