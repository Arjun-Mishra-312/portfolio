"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconTrophy,
  IconMedal,
  IconStar,
  IconSchool,
  IconBrain,
  IconX,
  IconCalendar,
  IconBuilding,
  IconSparkles,
} from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

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

const awards: Award[] = [
  {
    title: "Winner - Hack the North 2024",
    organization: "University of Waterloo",
    date: "September 2024",
    description: "Won Canada's premier hackathon with LLM Pro Max, an innovative codebase analysis platform that revolutionizes how developers interact with large codebases using AI.",
    category: "Competition",
    icon: <IconTrophy className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-500",
    achievements: [
      "Competed against 1000+ participants from top universities",
      "Developed production-ready RAG pipeline with 86% relevancy",
      "Built interactive dependency graphs for code exploration"
    ],
    details: "Competed against 1000+ participants from top universities across North America. Built a production-ready platform using React.js, Cohere LLM, Python, and ChromaDB for RAG implementation.",
    impact: "86% relevancy in LLM-powered code analysis queries, significantly improving developer productivity for large codebases."
  },
  {
    title: "1st Place - youCode 2025, SAP Stream",
    organization: "SAP & University Partners",
    date: "February 2025",
    description: "Secured first place with Re-Plate, an intelligent food donation platform that uses AI to reduce food waste and help communities through smart redistribution.",
    category: "Competition",
    icon: <IconMedal className="w-6 h-6" />,
    color: "from-blue-500 to-purple-600",
    achievements: [
      "Achieved 100% accuracy in food expiration date detection",
      "Integrated Gemini vision + text APIs for automated food classification",
      "Built comprehensive impact analytics with CO₂ offset tracking"
    ],
    details: "Built a comprehensive platform connecting food donors with recipients using AI-powered food classification and smart redistribution algorithms.",
    impact: "Potential to reduce food waste by 30% in target communities while providing comprehensive CO₂ offset tracking and impact analytics."
  },
  {
    title: "Work Learn International Undergraduate Research Award",
    organization: "University of British Columbia",
    date: "2024-2025",
    description: "Prestigious research award supporting international students conducting high-impact undergraduate research in AI and HCI systems.",
    category: "Academic",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-green-500 to-teal-600",
    achievements: [
      "Selected for excellence in AI/HCI research proposal",
      "Funding for full-stack AI system development",
      "Direct collaboration with lead professors"
    ],
    details: "Prestigious research award supporting international students conducting high-impact undergraduate research.",
    impact: "Enabling advancement of AI-powered accessibility tools that will benefit many users with disabilities worldwide."
  },
  {
    title: "Faculty of Science International Student Scholar",
    organization: "UBC Faculty of Science",
    date: "2022-2027",
    description: "Merit-based scholarship recognizing outstanding academic achievement and potential in Computer Science among international students.",
    category: "Academic",
    icon: <IconSchool className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
    achievements: [
      "Awarded for exceptional academic performance",
      "Recognition of Extracurricular Activities",
    ],
    details: "Scholarship recognizing outstanding academic achievement and potential among international students in the Science program.",
    impact: "Maintains top percentile academic standing while actively contributing to the university community."
  },
  {
    title: "Dean's Honors List",
    organization: "UBC Faculty of Science",
    date: "Multiple Terms",
    description: "Consistent recognition for maintaining high academic standing with GPA in top percentile of Computer Science students.",
    category: "Academic",
    icon: <IconStar className="w-6 h-6" />,
    color: "from-purple-500 to-pink-600",
    achievements: [
      "Maintained top-tier academic performance",
      "Recognized across multiple academic terms",
      "Excellence in advanced CS coursework"
    ],
    details: "Placement on Dean's Honors List across multiple academic terms, recognizing sustained excellence in university coursework.",
    impact: "Demonstrates consistent academic excellence while balancing research work, hackathon participation, and project development."
  }
];

const getCategoryBadgeColor = (category: string, theme: string) => {
  switch (category) {
    case "Competition":
      return theme === 'light' 
        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300"
        : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
    case "Academic":
      return theme === 'light'
        ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300"
        : "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30";
    case "Recognition":
      return theme === 'light'
        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
        : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30";
    default:
      return theme === 'light'
        ? "bg-gray-100 text-gray-700 border-gray-300"
        : "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

export default function AwardsWidget() {
  const { theme } = useTheme();
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-3xl p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 ${
              theme === 'light' ? 'shadow-lg shadow-yellow-500/30' : 'shadow-lg shadow-yellow-500/20'
            }`}>
              <IconTrophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Awards & Achievements
              </h3>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {awards.length} prestigious recognitions
              </p>
            </div>
          </div>
        </div>
        
        {/* Awards Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03,
                y: -4,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAward(award)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="award-card-premium cursor-pointer group relative"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${award.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Content Container */}
              <div className="relative z-10 p-5 h-full flex flex-col">
                {/* Top Section - Rank & Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <motion.div
                      className={`text-5xl font-black ${
                        theme === 'light' ? 'text-white/90' : 'text-white'
                      }`}
                      style={{
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      #{index + 1}
                    </motion.div>
                    <span className={`text-lg font-semibold ${
                      theme === 'light' ? 'text-white/80' : 'text-white/70'
                    }`}>
                      {index === 0 ? "st" : index === 1 ? "nd" : index === 2 ? "rd" : "th"}
                    </span>
                  </div>
                  
                  <motion.div
                    className={`p-2.5 rounded-xl backdrop-blur-md ${
                      theme === 'light' 
                        ? 'bg-white/20 border border-white/30' 
                        : 'bg-black/20 border border-white/20'
                    }`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-white">
                      {award.icon}
                    </div>
                  </motion.div>
                </div>

                {/* Award Title */}
                <h4 className={`text-lg font-bold mb-3 line-clamp-2 ${
                  theme === 'light' ? 'text-white' : 'text-white'
                }`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                  {award.title}
                </h4>

                {/* Category Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${getCategoryBadgeColor(award.category, theme)}`}>
                  <IconSparkles className="w-3 h-3" />
                  {award.category}
                </div>

                {/* Hover Preview Section */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-auto space-y-2 overflow-hidden"
                    >
                      <div className={`h-px bg-gradient-to-r from-transparent via-white/40 to-transparent`} />
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 text-xs"
                      >
                        <IconBuilding className={`w-3.5 h-3.5 ${
                          theme === 'light' ? 'text-white/90' : 'text-white/80'
                        }`} />
                        <span className={`${
                          theme === 'light' ? 'text-white/90' : 'text-white/80'
                        }`}>
                          {award.organization}
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex items-center gap-2 text-xs"
                      >
                        <IconCalendar className={`w-3.5 h-3.5 ${
                          theme === 'light' ? 'text-white/90' : 'text-white/80'
                        }`} />
                        <span className={`${
                          theme === 'light' ? 'text-white/90' : 'text-white/80'
                        }`}>
                          {award.date}
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-xs font-medium mt-2 ${
                          theme === 'light' ? 'text-white/80' : 'text-white/70'
                        }`}
                      >
                        Click for full details →
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative Elements */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 bg-white/20`} />
              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20 bg-white/10`} />
            </motion.div>
          ))}
        </div>

        {/* Summary Banner */}
        <motion.div 
          className={`relative overflow-hidden rounded-2xl p-5 border ${
            theme === 'light'
              ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-yellow-200/50'
              : 'bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border-yellow-500/20'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          <div className="relative flex items-center justify-center gap-3">
            <div className={`p-2 rounded-xl ${
              theme === 'light' 
                ? 'bg-yellow-100 border border-yellow-300' 
                : 'bg-yellow-500/20 border border-yellow-500/30'
            }`}>
              <IconTrophy className={`w-5 h-5 ${
                theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
              }`} />
            </div>
            <p className={`text-sm font-medium ${
              theme === 'light' ? 'text-gray-800' : 'text-gray-200'
            }`}>
              <span className={`font-bold ${
                theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
              }`}>
                5+ hackathon wins
              </span>
              {' • '}
              <span className={`font-bold ${
                theme === 'light' ? 'text-orange-700' : 'text-orange-400'
              }`}>
                Multiple academic honors
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ 
              background: theme === 'light' 
                ? 'rgba(0, 0, 0, 0.6)' 
                : 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)'
            }}
            onClick={() => setSelectedAward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Background Accent */}
              <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r ${selectedAward.color}`} />
              
              {/* Header */}
              <div className="flex items-start gap-5 mb-6">
                <motion.div 
                  className={`p-4 rounded-2xl bg-gradient-to-br ${selectedAward.color} shadow-lg flex-shrink-0`}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">
                    {selectedAward.icon}
                  </div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {selectedAward.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <IconBuilding className={`w-4 h-4 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {selectedAward.organization}
                      </p>
                    </div>
                    <span className={`${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`}>•</span>
                    <div className="flex items-center gap-2">
                      <IconCalendar className={`w-4 h-4 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {selectedAward.date}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getCategoryBadgeColor(selectedAward.category, theme)}`}>
                    <IconSparkles className="w-3 h-3" />
                    {selectedAward.category}
                  </span>
                </div>
                <motion.button
                  onClick={() => setSelectedAward(null)}
                  className={`glass p-2.5 rounded-full transition-colors flex-shrink-0 ${
                    theme === 'light'
                      ? 'hover:bg-gray-200 text-gray-600'
                      : 'hover:bg-white/10 text-gray-400'
                  }`}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconX className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${selectedAward.color}`} />
                  About
                </h4>
                <p className={`text-sm leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {selectedAward.description}
                </p>
              </div>

              {/* Key Achievements */}
              <div className="mb-6">
                <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${selectedAward.color}`} />
                  Key Highlights
                </h4>
                <div className="space-y-3">
                  {selectedAward.achievements.map((achievement, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl glass"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${selectedAward.color}`} />
                      <p className={`text-sm leading-relaxed flex-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {achievement}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              {selectedAward.impact && (
                <div className="mb-6">
                  <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${selectedAward.color}`} />
                    Impact
                  </h4>
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedAward.color} bg-opacity-10 border border-opacity-20`}>
                    <p className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                    }`}>
                      {selectedAward.impact}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {selectedAward.details && (
                <div>
                  <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${selectedAward.color}`} />
                    Additional Details
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {selectedAward.details}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
