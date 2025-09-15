"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  IconBrain,
  IconCode, 
  IconDatabase,
  IconCloud,
  IconDevices,
  IconApi,
  IconRocket,
  IconTools
} from "@tabler/icons-react";
import { HoverCard, StaggeredContainer } from "./ui/page-transitions";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: SkillItem[];
}

interface SkillItem {
  name: string;
  level: number; // 1-5 standardized experience level
  experienceMonths: number; // actual months of experience
  projects?: number;
}

// Standardized experience levels
const EXPERIENCE_LEVELS = [
  { level: 1, label: "0-6 months", minMonths: 0, maxMonths: 6 },
  { level: 2, label: "6-12 months", minMonths: 6, maxMonths: 12 },
  { level: 3, label: "1-2 years", minMonths: 12, maxMonths: 24 },
  { level: 4, label: "2-3 years", minMonths: 24, maxMonths: 36 },
  { level: 5, label: "3+ years", minMonths: 36, maxMonths: Infinity }
];

const getExperienceLabel = (months: number): string => {
  const level = EXPERIENCE_LEVELS.find(l => months >= l.minMonths && months < l.maxMonths);
  return level?.label || "3+ years";
};

const getExperienceLevel = (months: number): number => {
  const level = EXPERIENCE_LEVELS.find(l => months >= l.minMonths && months < l.maxMonths);
  return level?.level || 5;
};

const skillCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-ai-blue to-ai-cyan",
    skills: [
      { name: "Large Language Models (LLMs)", experienceMonths: 15, projects: 4 },
      { name: "OpenAI GPT-4/4.1", experienceMonths: 15, projects: 3 },
      { name: "Google Gemini 2.5 Pro", experienceMonths: 8, projects: 2 },
      { name: "Retrieval-Augmented Generation (RAG)", experienceMonths: 15, projects: 3 },
      { name: "Vector Databases (ChromaDB)", experienceMonths: 12, projects: 2 },
      { name: "Sentence Transformers", experienceMonths: 15, projects: 2 },
      { name: "Prompt Engineering", experienceMonths: 18, projects: 4 },
      { name: "Computer Vision (CV)", experienceMonths: 8, projects: 2 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  },
  {
    title: "Frontend Development",
    icon: <IconDevices className="w-6 h-6" />,
    color: "from-ai-purple to-ai-pink",
    skills: [
      { name: "React.js (v18/v19)", experienceMonths: 42, projects: 8 },
      { name: "Next.js", experienceMonths: 30, projects: 5 },
      { name: "TypeScript", experienceMonths: 28, projects: 6 },
      { name: "Tailwind CSS", experienceMonths: 26, projects: 6 },
      { name: "Framer Motion", experienceMonths: 15, projects: 3 },
      { name: "Flutter", experienceMonths: 30, projects: 4 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  },
  {
    title: "Backend & APIs",
    icon: <IconApi className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
    skills: [
      { name: "Python", experienceMonths: 42, projects: 8 },
      { name: "FastAPI", experienceMonths: 15, projects: 4 },
      { name: "Node.js", experienceMonths: 28, projects: 5 },
      { name: "Express.js", experienceMonths: 26, projects: 4 },
      { name: "RESTful APIs", experienceMonths: 40, projects: 8 },
      { name: "WebSocket APIs", experienceMonths: 12, projects: 2 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  },
  {
    title: "Cloud & DevOps",
    icon: <IconCloud className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "AWS (App Runner, S3, CloudFront)", experienceMonths: 12, projects: 3 },
      { name: "Docker", experienceMonths: 15, projects: 4 },
      { name: "GitHub Actions", experienceMonths: 12, projects: 3 },
      { name: "CloudFormation", experienceMonths: 8, projects: 2 },
      { name: "Firebase", experienceMonths: 28, projects: 4 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  },
  {
    title: "Database & Storage",
    icon: <IconDatabase className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    skills: [
      { name: "ChromaDB (Vector DB)", experienceMonths: 12, projects: 2 },
      { name: "SQL", experienceMonths: 30, projects: 5 },
      { name: "Microsoft SQL Server", experienceMonths: 14, projects: 2 },
      { name: "SQLite", experienceMonths: 26, projects: 3 },
      { name: "Firestore", experienceMonths: 28, projects: 3 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  },
  {
    title: "Development Tools",
    icon: <IconTools className="w-6 h-6" />,
    color: "from-gray-500 to-slate-600",
    skills: [
      { name: "Git & GitHub", experienceMonths: 44, projects: 12 },
      { name: "Playwright", experienceMonths: 8, projects: 2 },
      { name: "Beautiful Soup", experienceMonths: 15, projects: 2 },
      { name: "NetworkX & Pyvis", experienceMonths: 8, projects: 1 },
      { name: "Katalon Studios", experienceMonths: 8, projects: 1 }
    ].map(skill => ({ ...skill, level: getExperienceLevel(skill.experienceMonths) }))
  }
];

function ModernSkills() {
  return (
    <section id="skills" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute top-20 left-2 sm:left-5 lg:left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconRocket className="w-8 h-8 text-ai-cyan" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Production AI/ML systems • Full-stack development • Cloud deployment
          </p>
        </motion.div>

        {/* Skills Grid */}
        <StaggeredContainer className="grid lg:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
          {skillCategories.map((category, categoryIndex) => (
            <HoverCard
              key={category.title}
              className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl"
              scale={1.03}
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className={`glass p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{category.title}</h3>
              </div>

              {/* Skills List */}
              <StaggeredContainer className="space-y-3 sm:space-y-4" staggerDelay={0.05}>
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{getExperienceLabel(skill.experienceMonths)}</span>
                        {skill.projects && (
                          <span className="px-2 py-1 bg-ai-blue/20 text-ai-blue rounded text-xs">
                            {skill.projects} projects
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Skill Level Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                          transition={{ duration: 1, delay: (categoryIndex * 0.1) + (skillIndex * 0.1) }}
                          viewport={{ once: true }}
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                      
                      {/* Standardized Experience Level Dots */}
                      <div className="flex justify-between mt-1">
                        {EXPERIENCE_LEVELS.map((expLevel) => (
                          <div
                            key={expLevel.level}
                            className={`w-2 h-2 rounded-full ${
                              expLevel.level <= skill.level 
                                ? 'bg-white' 
                                : 'bg-gray-600'
                            }`}
                            title={expLevel.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggeredContainer>
            </HoverCard>
          ))}
        </StaggeredContainer>

        {/* Technical Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Technical Highlights & Certifications
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <IconBrain className="w-8 h-8 text-ai-blue mx-auto mb-3" />
                <div className="text-xl font-bold text-white">AI/ML Expert</div>
                <div className="text-sm text-gray-400">LLMs, RAG, Vector DBs</div>
              </div>
              <div className="text-center">
                <IconCloud className="w-8 h-8 text-ai-purple mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Cloud Native</div>
                <div className="text-sm text-gray-400">AWS, Docker, CI/CD</div>
              </div>
              <div className="text-center">
                <IconCode className="w-8 h-8 text-ai-cyan mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Full-Stack</div>
                <div className="text-sm text-gray-400">React, Python, APIs</div>
              </div>
              <div className="text-center">
                <IconRocket className="w-8 h-8 text-ai-pink mx-auto mb-3" />
                <div className="text-xl font-bold text-white">Production</div>
                <div className="text-sm text-gray-400">Deployed at Scale</div>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
    </section>
  );
}

export default ModernSkills;
