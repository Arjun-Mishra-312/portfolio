"use client";
import React, { useState, useRef, forwardRef } from "react";
import { motion } from "framer-motion";
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
} from "@tabler/icons-react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Safari } from "@/components/ui/safari";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/utils/cn";

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
  content: React.ReactNode;
  demoType?: 'safari' | 'terminal' | 'video' | 'standard';
  demoUrl?: string;
}

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

// Project Content Components
const AIAccessibilityContent = () => (
  <div className="space-y-6">
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-white">
          Dual-mode AI Pipeline for Web & Mobile Accessibility
        </span>{" "}
        Combines Axe-core static analysis with Gemini 2.5 Pro&apos;s vision capabilities
        to provide comprehensive WCAG 2.2 AA compliance checking. The system performs
        automated scans on both web and mobile platforms, identifying accessibility issues
        including color contrast, touch target sizes, and semantic HTML violations.
      </p>
    </div>

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <h3 className="font-bold text-neutral-700 dark:text-white text-xl mb-4">Architecture</h3>
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
        <ArchitectureDiagram type="accessibility" />
      </div>
    </div>

    <Terminal className="max-w-3xl mx-auto">
      <TypingAnimation>&gt; python accessibility_analyzer.py scan https://example.com</TypingAnimation>
      <AnimatedSpan className="text-green-400">
        ✓ Starting accessibility scan...
      </AnimatedSpan>
      <AnimatedSpan className="text-blue-400">
        → Running Axe-core static analysis
      </AnimatedSpan>
      <AnimatedSpan className="text-green-400">
        ✓ Found 12 issues (3 critical, 5 serious, 4 moderate)
      </AnimatedSpan>
      <AnimatedSpan className="text-blue-400">
        → Analyzing with Gemini 2.5 Pro Vision
      </AnimatedSpan>
      <AnimatedSpan className="text-green-400">
        ✓ Visual analysis complete: Color contrast issues detected
      </AnimatedSpan>
      <AnimatedSpan className="text-cyan-400">
        ℹ Report generated: accessibility_report_2024.pdf
      </AnimatedSpan>
    </Terminal>
  </div>
);

const AIPolicyContent = () => (
  <div className="space-y-6">
    <Safari 
      url="ai-policy-aggregator.com" 
      imageSrc="/AI Policy Aggregator.png"
      className="max-w-4xl mx-auto"
    />
    
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-white">
          Production RAG System with Vector Search
        </span>{" "}
        Deployed on AWS with 296 comprehensive tests covering all AI components.
        The system uses ChromaDB for semantic search with Sentence Transformers,
        achieving 40% improvement in content relevance through query expansion algorithms.
        Automated scrapers collect data from OECD, arXiv, Brookings, and CAIDP.
      </p>
    </div>

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <h3 className="font-bold text-neutral-700 dark:text-white text-xl mb-4">System Architecture</h3>
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
        <ArchitectureDiagram type="policy" />
      </div>
    </div>
  </div>
);

const LLMProMaxContent = () => (
  <div className="space-y-6">
    <Safari 
      url="devpost.com/software/llm-pro-max" 
      imageSrc="/LLM_Pro_Max.jpg"
      className="max-w-4xl mx-auto"
    />

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-white">
          🏆 Hack the North 2024 Winner
        </span>{" "}
        Revolutionary codebase analysis platform that uses RAG and custom chunking
        strategies to enable context-aware LLM queries. Built interactive dependency
        graphs using NetworkX and Pyvis, achieving 86% query relevancy score.
      </p>
    </div>

    <Terminal className="max-w-3xl mx-auto">
      <TypingAnimation>&gt; llm-pro-max analyze ./src --query &quot;How does authentication work?&quot;</TypingAnimation>
      <AnimatedSpan className="text-green-400">
        ✓ Indexing codebase...
      </AnimatedSpan>
      <AnimatedSpan className="text-blue-400">
        → Processing 1,247 files with intelligent chunking
      </AnimatedSpan>
      <AnimatedSpan className="text-green-400">
        ✓ Created 3,891 semantic chunks in ChromaDB
      </AnimatedSpan>
      <AnimatedSpan className="text-blue-400">
        → Querying Cohere LLM with top 15 relevant chunks
      </AnimatedSpan>
      <AnimatedSpan className="text-green-400">
        ✓ Query relevancy score: 86%
      </AnimatedSpan>
    </Terminal>

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <h3 className="font-bold text-neutral-700 dark:text-white text-xl mb-4">RAG Pipeline</h3>
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
        <ArchitectureDiagram type="llmpro" />
      </div>
    </div>
  </div>
);

const RePlateContent = () => (
  <div className="space-y-6">
    <Safari 
      url="devpost.com/software/replate-z3b5mg" 
      imageSrc="/Re-Plate.jpg"
      className="max-w-4xl mx-auto"
    />

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-white">
          🥇 youCode 2025 1st Place - SAP Stream
        </span>{" "}
        AI-powered food donation platform that reduces waste by connecting donors with
        recipients. Uses Gemini Vision API for automated food classification and expiration
        detection, achieving 100% accuracy on 20 packaged goods test set.
      </p>
    </div>

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <h3 className="font-bold text-neutral-700 dark:text-white text-xl mb-4">AI Classification Flow</h3>
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden">
        <ArchitectureDiagram type="replate" />
      </div>
    </div>
  </div>
);

const JobGeekContent = () => (
  <div className="space-y-6">
    <Safari 
      url="jobgeek.vercel.app" 
      imageSrc="/JobGeek.png"
      className="max-w-4xl mx-auto"
    />

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        Comprehensive job search platform that aggregates listings from multiple sources.
        Features advanced filtering, application tracking, and market trend analytics
        to help job seekers manage their search process efficiently.
      </p>
    </div>
  </div>
);

const CoviNetContent = () => (
  <div className="space-y-6">
    <Safari 
      url="devpost.com/software/covinet" 
      imageSrc="/covinet.png"
      className="max-w-4xl mx-auto"
    />

    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        COVID-19 resource platform developed during the pandemic to help communities
        navigate testing locations and health services. Integrated real-time health data
        and connected users with appropriate medical resources.
      </p>
    </div>
  </div>
);

// Architecture Diagram Component
const ArchitectureDiagram = ({ type }: { type: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);

  const configs = {
    accessibility: {
      nodes: [
        { ref: node1Ref, label: "Playwright", icon: <IconCode className="w-5 h-5" /> },
        { ref: node2Ref, label: "Axe-core", icon: <IconEye className="w-5 h-5" /> },
        { ref: node3Ref, label: "Gemini 2.5", icon: <IconBrain className="w-5 h-5" /> },
        { ref: node4Ref, label: "Report", icon: <IconExternalLink className="w-5 h-5" /> },
      ]
    },
    policy: {
      nodes: [
        { ref: node1Ref, label: "Scrapers", icon: <IconCode className="w-5 h-5" /> },
        { ref: node2Ref, label: "ChromaDB", icon: <IconDatabase className="w-5 h-5" /> },
        { ref: node3Ref, label: "GPT-4", icon: <IconBrain className="w-5 h-5" /> },
        { ref: node4Ref, label: "Frontend", icon: <IconUsers className="w-5 h-5" /> },
      ]
    },
    llmpro: {
      nodes: [
        { ref: node1Ref, label: "Code", icon: <IconCode className="w-5 h-5" /> },
        { ref: node2Ref, label: "ChromaDB", icon: <IconDatabase className="w-5 h-5" /> },
        { ref: node3Ref, label: "Cohere", icon: <IconBrain className="w-5 h-5" /> },
        { ref: node4Ref, label: "UI", icon: <IconUsers className="w-5 h-5" /> },
      ]
    },
    replate: {
      nodes: [
        { ref: node1Ref, label: "Photo", icon: <IconEye className="w-5 h-5" /> },
        { ref: node2Ref, label: "Gemini", icon: <IconBrain className="w-5 h-5" /> },
        { ref: node3Ref, label: "Classify", icon: <IconCode className="w-5 h-5" /> },
        { ref: node4Ref, label: "Database", icon: <IconDatabase className="w-5 h-5" /> },
      ]
    }
  };

  const config = configs[type as keyof typeof configs];

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-2xl px-10">
        {config.nodes.map((node, idx) => (
          <Circle key={idx} ref={node.ref} className="bg-gradient-to-r from-ai-blue to-ai-purple">
            {node.icon}
          </Circle>
        ))}
      </div>
      
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node1Ref}
        toRef={node2Ref}
        gradientStartColor="#3b82f6"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node2Ref}
        toRef={node3Ref}
        gradientStartColor="#8b5cf6"
        gradientStopColor="#ec4899"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node3Ref}
        toRef={node4Ref}
        gradientStartColor="#ec4899"
        gradientStopColor="#06b6d4"
      />
    </div>
  );
};

const projects: Project[] = [
  {
    id: "ai-accessibility",
    title: "AI-Powered Web & Mobile Accessibility Analyzer",
    description: "AI-powered accessibility analyzer using Gemini 2.5 Pro + Axe-core for WCAG compliance.",
    longDescription: "Dual-mode AI pipeline combining Axe-core static analysis with Gemini 2.5 Pro for comprehensive accessibility testing.",
    category: "AI/ML",
    status: "Research",
    technologies: ["Python", "Node.js", "Axe-core", "Playwright", "Google Gemini 2.5 Pro", "WCAG 2.2"],
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
    content: <AIAccessibilityContent />,
    demoType: "terminal",
  },
  {
    id: "ai-policy-aggregator",
    title: "AI Policy Aggregator",
    description: "Intelligent policy news aggregation with personalized AI briefings using GPT-4 and RAG.",
    longDescription: "Production-ready AI system with advanced RAG techniques using ChromaDB vector database.",
    category: "AI/ML",
    status: "Production",
    technologies: ["React 19", "TypeScript", "FastAPI", "OpenAI GPT-4", "ChromaDB", "AWS", "Docker"],
    achievements: [
      "Deployed on AWS with 296 tests and 90-100% coverage",
      "40% improvement in content relevance",
      "Automated scraping from 4 major policy sources"
    ],
    metrics: ["200+ Articles Processed", "40% Relevance Boost", "AWS Production"],
    link: "#",
    github: "",
    thumbnail: "/AI Policy Aggregator.png",
    icon: <IconBrain className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    featured: true,
    content: <AIPolicyContent />,
    demoType: "safari",
    demoUrl: "#",
  },
  {
    id: "llm-pro-max",
    title: "LLM Pro Max",
    description: "Revolutionary codebase analysis with RAG and context-aware LLM queries.",
    longDescription: "Hack the North 2024 Winner - Platform enabling precise queries on large codebases with 86% relevancy.",
    category: "AI/ML",
    status: "Hackathon",
    technologies: ["React.js", "Cohere", "Python", "FastAPI", "ChromaDB", "NetworkX"],
    achievements: [
      "🏆 Hack the North 2024 Winner",
      "86% query relevancy score",
      "Interactive dependency graphs with NetworkX"
    ],
    metrics: ["86% Query Relevancy", "1000+ Competitors", "Production RAG Pipeline"],
    link: "https://devpost.com/software/llm-pro-max",
    github: "https://github.com/gigabite-pro/LLM-pro-max",
    thumbnail: "/LLM_Pro_Max.jpg",
    icon: <IconTrophy className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
    featured: true,
    content: <LLMProMaxContent />,
    demoType: "safari",
    demoUrl: "https://devpost.com/software/llm-pro-max",
  },
  {
    id: "re-plate",
    title: "Re-Plate",
    description: "AI food donation platform with Gemini Vision for classification and impact analytics.",
    longDescription: "youCode 2025 1st Place - Reduces food waste by connecting donors with recipients using AI.",
    category: "AI/ML",
    status: "Hackathon",
    technologies: ["Next.js", "Tailwind CSS", "Google Gemini AI", "Python FastAPI", "Computer Vision"],
    achievements: [
      "🥇 youCode 2025 1st Place - SAP Stream",
      "100% accuracy identifying expiration dates",
      "Automated food safety checks with Gemini"
    ],
    metrics: ["100% Accuracy", "Food Waste Reduction", "Impact Analytics"],
    link: "https://devpost.com/software/replate-z3b5mg",
    github: "https://github.com/Arjun-Mishra-312/re-plate",
    thumbnail: "/Re-Plate.jpg",
    icon: <IconRocket className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    featured: true,
    content: <RePlateContent />,
    demoType: "safari",
    demoUrl: "https://devpost.com/software/replate-z3b5mg",
  },
  {
    id: "jobgeek",
    title: "JobGeek",
    description: "Comprehensive job search platform with advanced filtering and analytics.",
    longDescription: "Full-stack application aggregating job listings with centralized tracking and market analysis.",
    category: "Full-Stack",
    status: "Demo",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    achievements: [
      "Comprehensive job tracking system",
      "Multiple job board API integrations",
      "Advanced search and filtering"
    ],
    link: "https://jobgeek.vercel.app/",
    github: "",
    thumbnail: "/JobGeek.png",
    icon: <IconCode className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    featured: false,
    content: <JobGeekContent />,
    demoType: "safari",
    demoUrl: "https://jobgeek.vercel.app/",
  },
  {
    id: "covinet",
    title: "CoviNet",
    description: "COVID-19 information and testing platform connecting users with health resources.",
    longDescription: "Pandemic response platform providing real-time information about testing locations and health services.",
    category: "Full-Stack",
    status: "Demo",
    technologies: ["React", "Node.js", "API Integration"],
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
    featured: false,
    content: <CoviNetContent />,
    demoType: "safari",
    demoUrl: "https://devpost.com/software/covinet",
  }
];

const categories = ["All", "AI/ML", "Full-Stack", "Mobile", "Research"];

const ProjectsCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const cards = filteredProjects.map((project, index) => (
    <Card 
      key={project.id} 
      card={{
        src: project.thumbnail,
        title: project.title,
        category: project.category,
        content: project.content,
        technologies: project.technologies,
      }} 
      index={index} 
      layout={true} 
    />
  ));

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
                  className={`px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all-smooth whitespace-nowrap ${
                    selectedCategory === category
                      ? "ai-gradient text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  aria-label={`Filter by ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        <Carousel items={cards} />
      </div>
    </section>
  );
};

export default ProjectsCarousel;
