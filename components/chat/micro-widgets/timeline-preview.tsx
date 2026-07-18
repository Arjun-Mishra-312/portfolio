"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import Image from 'next/image';
import {
  IconBriefcase,
  IconSchool,
  IconFlask,
} from '@tabler/icons-react';

interface TimelineItem {
  role: string;
  company: string;
  period: string;
  logo?: string;
  icon: React.ReactNode;
  color: string;
}

const timeline: TimelineItem[] = [
  {
    role: 'AI Engineering Co-op',
    company: 'IFS Copperleaf',
    period: 'Oct 2025 - Present',
    logo: '/copperleaf-logo.png',
    icon: <IconBriefcase className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    role: 'AI Research Assistant',
    company: 'UBC SOCIUS Lab',
    period: 'Sept 2024 - Present',
    logo: '/UBC_CS_logo.png',
    icon: <IconFlask className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    role: 'Teaching Assistant',
    company: 'UBC Computer Science',
    period: 'Jan 2024 - Present',
    logo: '/UBC_logo.png',
    icon: <IconSchool className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
  },
];

export function TimelinePreview() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="space-y-2">
        {timeline.map((item, index) => (
          <motion.div
            key={item.company}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`glass-card rounded-xl p-3 transition-all ${
              theme === 'light'
                ? 'hover:shadow-md hover:shadow-blue-100'
                : 'hover:shadow-md hover:shadow-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                {item.logo ? (
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-white flex items-center justify-center p-1">
                    <Image
                      src={item.logo}
                      alt={item.company}
                      width={32}
                      height={32}
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  item.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {item.role}
                </div>
                <div className={`text-xs ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {item.company}
                </div>
              </div>
              <div className={`text-xs flex-shrink-0 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {item.period.split(' - ')[0]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
