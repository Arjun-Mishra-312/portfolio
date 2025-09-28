"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { 
  IconTrophy, 
  IconSchool, 
  IconAward, 
  IconStar,
  IconCertificate,
  IconX
} from "@tabler/icons-react";

interface Award {
  title: string;
  organization: string;
  date: string;
  description: string;
  category: "Competition" | "Academic" | "Recognition";
  icon: React.ReactNode;
  color: string;
  achievements: string[];
  details?: string;
  impact?: string;
}

interface ExpandableAwardsProps {
  awards: Award[];
}

export function ExpandableAwardsCards({ awards }: ExpandableAwardsProps) {
  const [active, setActive] = useState<Award | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Competition":
        return <IconTrophy className="w-6 h-6" />;
      case "Academic":
        return <IconSchool className="w-6 h-6" />;
      case "Recognition":
        return <IconAward className="w-6 h-6" />;
      default:
        return <IconStar className="w-6 h-6" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Competition":
        return "bg-yellow-500/20 text-yellow-400";
      case "Academic":
        return "bg-blue-500/20 text-blue-400";
      case "Recognition":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 items-center justify-center glass-card rounded-full h-10 w-10 text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setActive(null)}
            >
              <IconX className="w-5 h-5" />
            </motion.button>
            
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-fit max-h-[90vh] flex flex-col glass-card rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start space-x-4">
                  <motion.div
                    layoutId={`icon-${active.title}-${id}`}
                    className={`glass p-4 rounded-xl bg-gradient-to-r ${active.color}`}
                  >
                    {active.icon}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`organization-${active.organization}-${id}`}
                      className="text-gray-300 text-sm sm:text-base"
                    >
                      {active.organization} • {active.date}
                    </motion.p>
                    <motion.span
                      layoutId={`category-${active.category}-${id}`}
                      className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(active.category)}`}
                    >
                      {active.category}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex-1 overflow-auto">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">About</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {active.description}
                    </p>
                  </div>

                  {/* Key Achievements */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Key Highlights</h4>
                    <div className="space-y-2">
                      {active.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-ai-cyan rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact (if available) */}
                  {active.impact && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Impact</h4>
                      <p className="text-ai-blue text-sm font-medium">{active.impact}</p>
                    </div>
                  )}

                  {/* Additional Details (if available) */}
                  {active.details && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Details</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{active.details}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {awards.map((award, index) => (
          <motion.div
            layoutId={`card-${award.title}-${id}`}
            key={`card-${award.title}-${id}`}
            onClick={() => setActive(award)}
            className="glass-card p-4 sm:p-6 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-all-smooth"
          >
            <div className="flex items-start space-x-4 mb-4">
              <motion.div
                layoutId={`icon-${award.title}-${id}`}
                className={`glass p-3 rounded-xl bg-gradient-to-r ${award.color} group-hover:scale-110 transition-transform`}
              >
                {award.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3
                  layoutId={`title-${award.title}-${id}`}
                  className="text-lg font-bold text-white mb-1 group-hover:text-ai-cyan transition-colors"
                >
                  {award.title}
                </motion.h3>
                <motion.p
                  layoutId={`organization-${award.organization}-${id}`}
                  className="text-sm text-gray-400"
                >
                  {award.organization}
                </motion.p>
                <p className="text-xs text-gray-500 mt-1">{award.date}</p>
              </div>
            </div>

            <motion.span
              layoutId={`category-${award.category}-${id}`}
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(award.category)} mb-3`}
            >
              {award.category}
            </motion.span>

            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {award.description}
            </p>

            <div className="mt-4 flex items-center text-ai-cyan text-sm font-medium group-hover:text-white transition-colors">
              <span>View Details</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
















