"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconBrandReact,
  IconBrandNextjs,
  IconBrandPython,
  IconBrandDocker,
  IconDatabase,
  IconBrain,
} from '@tabler/icons-react';

interface Tech {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const techStack: Tech[] = [
  {
    name: 'Next.js',
    icon: <IconBrandNextjs className="w-3.5 h-3.5" />,
    color: 'from-gray-700 to-gray-900',
  },
  {
    name: 'React',
    icon: <IconBrandReact className="w-3.5 h-3.5" />,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Python',
    icon: <IconBrandPython className="w-3.5 h-3.5" />,
    color: 'from-blue-500 to-yellow-500',
  },
  {
    name: 'OpenAI',
    icon: <IconBrain className="w-3.5 h-3.5" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'ChromaDB',
    icon: <IconDatabase className="w-3.5 h-3.5" />,
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Docker',
    icon: <IconBrandDocker className="w-3.5 h-3.5" />,
    color: 'from-blue-400 to-blue-600',
  },
];

export function TechStackPill() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.06,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${tech.color} text-white text-xs font-medium shadow-sm`}
          >
            {tech.icon}
            <span>{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
