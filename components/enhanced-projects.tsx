"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  IconBrain,
  IconCode,
  IconDatabase,
  IconExternalLink,
  IconBrandGithub,
  IconRocket,
  IconTrophy,
  IconEye,
  IconUsers,
  IconChevronDown,
  IconChevronUp
} from "@tabler/icons-react";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: "AI/ML" | "Full-Stack" | "Mobile" | "Research";
  status: "Production" | "Research" | "Hackathon" | "Demo";
  technologies: string[];
  achievements: string[];
  metrics?: string[];
  link: string;
  github: string;
  thumbnail: string;
  icon: React.ReactNode;
  color: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    id: "ai-accessibility",
    title: "AI-Powered Web & Mobile Accessibility Analyzer",
    description: "AI-powered accessibility analyzer using Gemini 2.5 Pro + Axe-core for WCAG compliance.",
    category: "AI/ML",
    status: "Research",
    technologies: ["Python", "Node.js", "Axe-core", "Playwright", "Google Gemini 2.5 Pro", "WCAG 2.2", "Computer Vision"],
    achievements: [
      "Dual-mode AI pipeline (Axe-core + Gemini 2.5 Pro)",
      "100% WCAG 2.2 AA coverage",
      "Visual analysis for color contrast & touch targets"
    ],
    metrics: ["100% WCAG Coverage", "Multi-Modal Analysis", "Production Ready"],
    link: "#",
    github: "",
    thumbnail: "/AI Accessibility.png",
    icon: <IconEye className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    featured: true,
    longDescription: ""
  },
  {
    id: "ai-policy-aggregator",
    title: "AI Policy Aggregator",
    description: "Intelligent policy news aggregation platform with personalized AI briefings using OpenAI GPT-4 and RAG with ChromaDB vector database.",
    longDescription: "A production-ready AI system that aggregates policy news from multiple sources and provides intelligent summarization. The platform uses advanced RAG techniques with semantic search to identify the most relevant articles and generate personalized briefings for policy researchers.",
    category: "AI/ML",
    status: "Production",
    technologies: ["React 19", "TypeScript", "FastAPI", "OpenAI GPT-4", "ChromaDB", "Sentence Transformers", "AWS", "Docker"],
    achievements: [
      "Deployed on AWS with 296 comprehensive tests and 90-100% coverage on AI components",
      "Improved content relevance by 40% with query expansion algorithms",
      "Automated web scraping from 4 major policy sources (OECD, arXiv, Brookings, CAIDP)"
    ],
    metrics: ["200+ Articles Processed", "40% Relevance Improvement", "AWS Production Deployment"],
    link: "#",
    github: "",
    thumbnail: "/AI Policy Aggregator.png",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    featured: true
  },
  {
    id: "llm-pro-max",
    title: "LLM Pro Max",
    description: "Innovative codebase analysis platform using RAG and custom code interpretation to enable context-aware LLM queries on large codebases.",
    longDescription: "Winner of Hack the North 2024, this platform revolutionizes how developers interact with large codebases. It uses advanced chunking strategies and vector embeddings to enable precise, context-aware LLM queries while building interactive dependency graphs for project exploration.",
    category: "AI/ML",
    status: "Hackathon",
    technologies: ["React.js", "Cohere", "Python", "Pyvis", "FastAPI", "ChromaDB", "NetworkX", "Autho", "Convex"],
    achievements: [
      "🏆 Hack the North 2024 Winner - Canada's premier hackathon",
      "Architected core RAG pipeline achieving 86% query relevancy",
      "Built interactive dependency graphs using NetworkX and Pyvis"
    ],
    metrics: ["86% Query Relevancy", "1000+ Competitors", "Production RAG Pipeline"],
    link: "https://devpost.com/software/llm-pro-max",
    github: "https://github.com/gigabite-pro/LLM-pro-max",
    thumbnail: "/LLM_Pro_Max.jpg",
    icon: <IconTrophy className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
    featured: true
  },
  {
    id: "re-plate",
    title: "Re-Plate",
    description: "Intelligent food donation platform using Gemini AI for automated food classification and impact analytics with CO₂ offset tracking.",
    longDescription: "1st Place winner at youCode 2025 SAP Stream. An innovative platform that uses AI to reduce food waste by connecting donors with recipients. Features advanced computer vision for food classification and expiration detection.",
    category: "AI/ML",
    status: "Hackathon",
    technologies: ["Next.js", "Tailwind CSS", "ApexCharts", "Google Gemini AI", "Python FastAPI", "Computer Vision"],
    achievements: [
      "🥇 youCode 2025 1st Place - SAP Stream",
      "Achieved 100% accuracy in identifying expiration dates on test set of 20 packaged goods",
      "Integrated Gemini vision + text APIs for automated food safety checks"
    ],
    metrics: ["100% Accuracy", "Food Waste Reduction", "Impact Analytics"],
    link: "https://devpost.com/software/replate-z3b5mg",
    github: "https://github.com/Arjun-Mishra-312/re-plate",
    thumbnail: "/Re-Plate.jpg",
    icon: <IconRocket className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    featured: true
  },
  {
    id: "jobgeek",
    title: "JobGeek",
    description: "A comprehensive job search platform for tracking job listings across different platforms with advanced filtering and analytics.",
    longDescription: "A full-stack web application that aggregates job listings from multiple platforms, providing users with a centralized dashboard to track applications, analyze market trends, and manage their job search process.",
    category: "Full-Stack",
    status: "Demo",
    technologies: ["React", "Node.js", "MongoDB", "Express", "API Integration"],
    achievements: [
      "Built comprehensive job tracking system",
      "Integrated multiple job board APIs",
      "Implemented advanced search and filtering"
    ],
    link: "https://jobgeek.vercel.app/",
    github: "",
    thumbnail: "/JobGeek.png",
    icon: <IconCode className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    featured: false
  },
  {
    id: "covinet",
    title: "CoviNet",
    description: "A comprehensive COVID-19 information and testing platform connecting users with local resources and health services.",
    longDescription: "Developed during the pandemic to help communities navigate COVID-19 resources. The platform provides real-time information about testing locations, health guidelines, and connects users with appropriate medical resources.",
    category: "Full-Stack",
    status: "Demo",
    technologies: ["React", "Node.js", "API Integration", "Real-time Data"],
    achievements: [
      "Connected users with local COVID resources",
      "Real-time health data integration",
      "Community impact during pandemic"
    ],
    link: "https://devpost.com/software/covinet",
    github: "https://github.com/Arjun-Mishra-312/covinet",
    thumbnail: "/covinet.png",
    icon: <IconUsers className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    featured: false
  }
];

const categories = ["All", "AI/ML", "Full-Stack", "Mobile", "Research"];

const EnhancedProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute bottom-20 left-2 sm:left-5 lg:left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-4"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <IconRocket className="w-6 h-6 sm:w-8 sm:h-8 text-ai-cyan" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Production AI systems • Award-winning projects • Real-world impact
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6 sm:mb-8 md:mb-12 px-4"
        >
          <div className="glass-card p-1 sm:p-2 rounded-full w-full max-w-md sm:max-w-none">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-0.5 sm:space-x-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all-smooth whitespace-nowrap ${selectedCategory === category
                      ? "ai-gradient text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <IconTrophy className="w-6 h-6 text-yellow-400 mr-2" />
              Featured AI/ML Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  expanded={expandedProject === project.id}
                  onToggleExpand={() => setExpandedProject(
                    expandedProject === project.id ? null : project.id
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <IconCode className="w-6 h-6 text-ai-blue mr-2" />
              Additional Projects
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  compact?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  compact = false,
  expanded = false,
  onToggleExpand
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card p-4 sm:p-6 rounded-2xl hover:scale-[1.02] transition-all-smooth"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`glass p-3 rounded-xl bg-gradient-to-r ${project.color}`}>
            {project.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-bold text-white text-base sm:text-lg ${!compact && 'md:text-xl'}`}>
                {project.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'Production' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Research' ? 'bg-blue-500/20 text-blue-400' :
                    project.status === 'Hackathon' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-purple-500/20 text-purple-400'
                }`}>
                {project.status}
              </span>
            </div>
            <p className="text-ai-cyan text-xs font-medium mb-2">{project.category}</p>
          </div>
        </div>
      </div>

      {/* Project Image */}
      <div className="relative mb-3 sm:mb-4 rounded-xl overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={400}
          height={compact ? 150 : 200}
          className="w-full h-28 sm:h-32 md:h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Project Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {expanded ? project.longDescription : project.description}
      </p>

      {/* Expand/Collapse for non-compact cards */}
      {!compact && onToggleExpand && (
        <button
          onClick={onToggleExpand}
          className="flex items-center text-ai-cyan text-sm hover:text-white transition-colors mb-4"
        >
          {expanded ? <IconChevronUp className="w-4 h-4 mr-1" /> : <IconChevronDown className="w-4 h-4 mr-1" />}
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {(expanded || compact) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Achievements */}
            {project.achievements && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-2">Key Achievements:</h4>
                <ul className="space-y-1">
                  {project.achievements.slice(0, compact ? 2 : undefined).map((achievement, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start">
                      <span className="text-ai-cyan mr-2">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics */}
            {project.metrics && (
              <div className="flex flex-wrap gap-2">
                {project.metrics.map((metric, idx) => (
                  <span key={idx} className="px-2 py-1 bg-ai-blue/20 text-ai-blue rounded text-xs">
                    {metric}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technologies */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, compact ? 4 : 6).map((tech, idx) => (
            <span key={idx} className="px-2 py-1 text-xs glass rounded text-gray-300">
              {tech}
            </span>
          ))}
          {project.technologies.length > (compact ? 4 : 6) && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{project.technologies.length - (compact ? 4 : 6)} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {project.link && project.link !== "#" && (
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-ai-blue to-ai-purple text-white rounded-lg text-xs font-medium hover:scale-105 transition-all-smooth"
          >
            <IconExternalLink className="w-3 h-3" />
            <span>View Project</span>
          </Link>
        )}
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 glass rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            <IconBrandGithub className="w-3 h-3" />
            <span>GitHub</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedProjects;
