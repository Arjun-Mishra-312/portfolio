"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconBrain,
  IconDevices,
  IconApi,
  IconCloud,
  IconDatabase,
  IconTools,
} from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: <IconBrain className="w-5 h-5" />,
    skills: ["LLMs", "OpenAI GPT-4", "Gemini 2.5 Pro", "RAG", "ChromaDB"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Frontend Development",
    icon: <IconDevices className="w-5 h-5" />,
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Backend & APIs",
    icon: <IconApi className="w-5 h-5" />,
    skills: ["Python", "FastAPI", "Node.js", "Express.js", "RESTful APIs"],
    color: "from-green-500 to-teal-500",
  },
  {
    title: "Cloud & DevOps",
    icon: <IconCloud className="w-5 h-5" />,
    skills: ["AWS", "Docker", "GitHub Actions", "Firebase"],
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Databases",
    icon: <IconDatabase className="w-5 h-5" />,
    skills: ["ChromaDB", "SQL", "MongoDB", "Firestore"],
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Tools",
    icon: <IconTools className="w-5 h-5" />,
    skills: ["Git", "Playwright", "Beautiful Soup", "NetworkX"],
    color: "from-yellow-500 to-orange-500",
  },
];

export default function SkillsWidget() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <h3 className={`text-xl font-bold mb-4 ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        Skills & Expertise
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {skillCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-4 rounded-xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                {category.icon}
              </div>
              <h4 className={`font-semibold text-sm ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {category.title}
              </h4>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-2.5 py-1 text-xs rounded-lg border ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-800 border-gray-300'
                      : 'glass-card text-gray-100 border-white/10'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`mt-4 p-4 rounded-xl border ${
        theme === 'light'
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
          : 'bg-gradient-to-r from-ai-blue/10 to-ai-purple/10 border border-ai-blue/20'
      }`}>
        <p className={`text-sm text-center ${
          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
        }`}>
          💡 Specialized in building{' '}
          <span className={`font-semibold ${
            theme === 'light' ? 'text-blue-700' : 'text-ai-cyan'
          }`}>
            production-ready AI systems
          </span>
          {' '}with modern full-stack technologies
        </p>
      </div>
    </motion.div>
  );
}
