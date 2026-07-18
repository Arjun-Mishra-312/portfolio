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

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: <IconBrain className="w-5 h-5" />,
    skills: [
      "Large Language Models (LLMs)",
      "OpenAI GPT-4/4.1",
      "Google Gemini 2.5 Pro",
      "Retrieval-Augmented Generation (RAG)",
      "Vector Databases (ChromaDB)",
      "Sentence Transformers",
      "Prompt Engineering",
      "Computer Vision (CV)"
    ]
  },
  {
    title: "Frontend Development",
    icon: <IconDevices className="w-5 h-5" />,
    skills: [
      "React.js (v18/v19)",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Flutter"
    ]
  },
  {
    title: "Backend & APIs",
    icon: <IconApi className="w-5 h-5" />,
    skills: [
      "Python",
      "FastAPI",
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "WebSocket APIs"
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: <IconCloud className="w-5 h-5" />,
    skills: [
      "AWS (App Runner, S3, CloudFront)",
      "Docker",
      "GitHub Actions",
      "CloudFormation",
      "Firebase"
    ]
  },
  {
    title: "Database & Storage",
    icon: <IconDatabase className="w-5 h-5" />,
    skills: [
      "ChromaDB (Vector DB)",
      "SQL",
      "Microsoft SQL Server",
      "SQLite",
      "Firestore"
    ]
  },
  {
    title: "Development Tools",
    icon: <IconTools className="w-5 h-5" />,
    skills: [
      "Git & GitHub",
      "Playwright",
      "Beautiful Soup",
      "NetworkX & Pyvis",
      "Katalon Studios"
    ]
  }
];

function ModernSkills() {
  return (
    <section id="skills" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconRocket className="w-7 h-7 text-ai-cyan" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Technical <span className="text-gradient">Skills</span>
            </h2>
          </div>
        </motion.div>

        {/* Minimalistic Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-white/10">
                <div className="text-ai-cyan">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-2">
                {category.skills.map((skill) => (
                  <div
                    key={skill}
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ModernSkills;
