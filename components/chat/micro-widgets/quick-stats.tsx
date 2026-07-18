"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  IconBrain,
  IconCode,
  IconTrophy,
  IconSchool,
} from '@tabler/icons-react';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <IconBrain className="w-4 h-4" />,
    value: "3+",
    label: "AI Projects",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <IconCode className="w-4 h-4" />,
    value: "6+",
    label: "Full-Stack Apps",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <IconTrophy className="w-4 h-4" />,
    value: "5+",
    label: "Hackathon Wins",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <IconSchool className="w-4 h-4" />,
    value: "100+",
    label: "Students Taught",
    color: "from-green-500 to-emerald-500"
  },
];

export function QuickStats() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`glass-card rounded-xl p-3 text-center transition-all ${
              theme === 'light' 
                ? 'hover:shadow-lg hover:shadow-blue-100' 
                : 'hover:shadow-lg hover:shadow-blue-500/10'
            }`}
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
              <div className="text-white">
                {stat.icon}
              </div>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {stat.value}
            </div>
            <div className={`text-xs ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
