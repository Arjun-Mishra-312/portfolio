"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  IconBrandReact,
  IconBrandPython,
  IconBrandTypescript,
  IconBrain,
  IconDatabase,
  IconBrandDocker,
} from '@tabler/icons-react';

interface SkillBadge {
  name: string;
  icon: React.ReactNode;
  category: 'ai' | 'frontend' | 'backend';
}

const skills: SkillBadge[] = [
  { name: 'React', icon: <IconBrandReact className="w-3 h-3" />, category: 'frontend' },
  { name: 'Python', icon: <IconBrandPython className="w-3 h-3" />, category: 'backend' },
  { name: 'TypeScript', icon: <IconBrandTypescript className="w-3 h-3" />, category: 'frontend' },
  { name: 'OpenAI', icon: <IconBrain className="w-3 h-3" />, category: 'ai' },
  { name: 'ChromaDB', icon: <IconDatabase className="w-3 h-3" />, category: 'ai' },
  { name: 'Docker', icon: <IconBrandDocker className="w-3 h-3" />, category: 'backend' },
];

const categoryColors = {
  ai: 'from-blue-500 to-cyan-500',
  frontend: 'from-purple-500 to-pink-500',
  backend: 'from-orange-500 to-red-500',
};

interface SkillBadgeClusterProps {
  focus?: string | null;
}

export function SkillBadgeCluster({ focus }: SkillBadgeClusterProps) {
  const { theme } = useTheme();

  // Filter skills based on focus if provided
  const displaySkills = focus
    ? skills.filter(s => s.category === focus).concat(
        skills.filter(s => s.category !== focus).slice(0, 2)
      )
    : skills;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex flex-wrap gap-2">
        {displaySkills.slice(0, 8).map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${
              categoryColors[skill.category]
            } text-white text-xs font-medium shadow-sm cursor-default`}
          >
            {skill.icon}
            <span>{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
