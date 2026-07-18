"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  IconTrophy,
  IconStar,
  IconAward,
  IconSparkles,
} from '@tabler/icons-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const achievements: Record<string, Achievement> = {
  'hack-the-north': {
    id: 'hack-the-north',
    title: 'Hack the North 2024',
    description: 'Winner - Canada\'s Premier Hackathon',
    icon: <IconTrophy className="w-5 h-5" />,
    color: 'from-yellow-500 via-orange-500 to-red-500',
  },
  'youcode': {
    id: 'youcode',
    title: 'youCode 2025',
    description: '1st Place - SAP Stream',
    icon: <IconAward className="w-5 h-5" />,
    color: 'from-blue-500 via-purple-500 to-pink-500',
  },
  'research-award': {
    id: 'research-award',
    title: 'Work Learn International Research Award',
    description: 'University of British Columbia',
    icon: <IconStar className="w-5 h-5" />,
    color: 'from-cyan-500 via-blue-500 to-purple-500',
  },
};

interface AchievementBadgeProps {
  featured?: string;
}

export function AchievementBadge({ featured = 'hack-the-north' }: AchievementBadgeProps) {
  const { theme } = useTheme();
  const achievement = achievements[featured] || achievements['hack-the-north'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="w-full"
    >
      <div className={`glass-card rounded-2xl p-4 relative overflow-hidden ${
        theme === 'light'
          ? 'hover:shadow-lg hover:shadow-yellow-100'
          : 'hover:shadow-lg hover:shadow-yellow-500/10'
      }`}>
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-10`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconSparkles className={`w-5 h-5 ${
            theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'
          }`} />
        </motion.div>

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r ${achievement.color} flex items-center justify-center text-white shadow-lg`}>
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-bold mb-1 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {achievement.title}
            </div>
            <div className={`text-xs ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {achievement.description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
