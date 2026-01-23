"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconTrophy } from "@tabler/icons-react";

interface Award {
  title: string;
  organization: string;
  date: string;
  description: string;
  category: "Competition" | "Academic" | "Recognition";
  icon: React.ReactNode;
  color: string;
  achievements?: string[];
  details?: string;
  impact?: string;
}

interface ExpandableAwardsProps {
  awards: Award[];
}

export function ExpandableAwardsCards({ awards }: ExpandableAwardsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Competition":
        return "🏆";
      case "Academic":
        return "🎓";
      case "Recognition":
        return "⭐";
      default:
        return "🏅";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Competition":
        return "from-yellow-400 to-orange-500";
      case "Academic":
        return "from-blue-500 to-purple-600";
      case "Recognition":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {awards.map((award, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="ranking-card"
        >
          {/* Outline/Top Section */}
          <div className="ranking-outline">
            {/* Trophy Icon */}
            <div className="ranking-trophy">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9M6 9V6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V9C3 9.53043 3.21071 10.0391 3.58579 10.4142C3.96086 10.7893 4.46957 11 5 11H6M6 9V6H18V9M18 9V6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V9C21 9.53043 20.7893 10.0391 20.4142 10.4142C20.0391 10.7893 19.5304 11 19 11H18M12 15V19M12 19H8M12 19H16M8 22H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Split Line */}
            <div className="ranking-split-line"></div>

            {/* Ranking Number & Word */}
            <div className="flex items-end absolute left-5 top-0 h-full pb-4">
              <div>
                <p className="ranking-number">{index + 1}</p>
                <p className="ranking-word">
                  {index === 0 ? "st" : index === 1 ? "nd" : index === 2 ? "rd" : "th"}
                </p>
              </div>
            </div>

            {/* User Info at bottom */}
            <div className="absolute bottom-2 left-5">
              <div className="flex items-center gap-2">
                <div className="ranking-avatar">{getCategoryIcon(award.category)}</div>
                <p className="ranking-username">{award.title.split(" - ")[0]}</p>
              </div>
            </div>
          </div>

          {/* Detail Section (appears on hover) */}
          <div className="ranking-detail">
            <div className="flex flex-col justify-center h-full px-5 py-3">
              {/* Organization */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Organization
                </div>
                <div className="text-sm font-semibold widget-text-primary">
                  {award.organization}
                </div>
              </div>

              {/* Date */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Date
                </div>
                <div className="text-sm font-semibold text-ai-cyan">
                  {award.date}
                </div>
              </div>

              {/* Achievements Count */}
              {award.achievements && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Achievements
                  </div>
                  <div className="text-2xl font-bold text-ai-blue">
                    {award.achievements.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
