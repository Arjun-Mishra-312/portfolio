"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { WidgetType } from '@/lib/chat-context';
import {
  IconUser,
  IconCode,
  IconBrain,
  IconBriefcase,
  IconTrophy,
  IconSparkles,
  IconMail,
} from '@tabler/icons-react';

interface PreviewCard {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const cards: PreviewCard[] = [
  {
    type: 'projects',
    title: 'Projects',
    description: '8+ AI/ML & Full-Stack Apps',
    icon: <IconCode className="w-5 h-5" />,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'skills',
    title: 'Skills',
    description: 'AI/ML, React, Python & More',
    icon: <IconBrain className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    type: 'experience',
    title: 'Experience',
    description: 'Copperleaf, UBC & More',
    icon: <IconBriefcase className="w-5 h-5" />,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    type: 'awards',
    title: 'Awards',
    description: '5+ Hackathon Wins',
    icon: <IconTrophy className="w-5 h-5" />,
    gradient: 'from-green-500 to-emerald-500',
  },
];

interface PreviewCardsProps {
  onCardClick: (type: WidgetType) => void;
}

export function PreviewCards({ onCardClick }: PreviewCardsProps) {
  const { theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <motion.button
            key={card.type}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              rotateY: hoveredIndex === index ? 5 : 0,
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => onCardClick(card.type)}
            className={`
              group relative overflow-hidden rounded-xl p-4 text-left transition-all
              ${theme === 'light'
                ? 'bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100'
                : 'glass-card hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10'
              }
            `}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {/* Gradient overlay on hover */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              initial={false}
              animate={{
                opacity: hoveredIndex === index ? 0.1 : 0,
              }}
            />

            {/* Icon */}
            <div className={`relative mb-3 inline-flex p-2.5 rounded-lg bg-gradient-to-r ${card.gradient} text-white shadow-sm`}>
              {card.icon}
            </div>

            {/* Content */}
            <div className="relative">
              <div className={`text-sm font-bold mb-1 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {card.title}
              </div>
              <div className={`text-xs ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {card.description}
              </div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{
                x: hoveredIndex === index ? '100%' : '-100%',
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
