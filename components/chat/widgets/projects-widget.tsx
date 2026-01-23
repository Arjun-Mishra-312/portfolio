"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconCode,
} from '@tabler/icons-react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import { Safari } from '@/components/ui/safari';
import { Terminal, TypingAnimation, AnimatedSpan } from '@/components/ui/terminal';

// Simple content component for expanded view
const SimpleContent = ({ title, description, link, imgSrc }: { 
  title: string; 
  description: string; 
  link?: string;
  imgSrc: string;
}) => (
  <div className="space-y-4">
    {link && link !== "#" && (
      <Safari 
        url={link.includes('http') ? new URL(link).hostname : link}
        imageSrc={imgSrc}
        className="max-w-2xl mx-auto"
      />
    )}
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-6 md:p-10 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-lg font-sans">
        {description}
      </p>
    </div>
  </div>
);

// LLM Pro Max content with Terminal
const LLMProMaxContent = () => (
  <div className="space-y-4">
    <Safari 
      url="devpost.com/software/llm-pro-max" 
      imageSrc="/LLM_Pro_Max.jpg"
      className="max-w-2xl mx-auto"
    />
    
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-6 md:p-10 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-lg font-sans">
        <span className="font-bold text-neutral-700 dark:text-white">
          🏆 Hack the North 2024 Winner!
        </span>{" "}
        Revolutionary codebase analysis platform using RAG with custom chunking strategies. 
        Achieved 86% query relevancy score with interactive dependency graphs.
      </p>
    </div>

    <Terminal className="max-w-2xl mx-auto">
      <TypingAnimation>&gt; llm-pro-max analyze ./src --query "How does authentication work?"</TypingAnimation>
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
  </div>
);

// AI Accessibility content with Terminal
const AIAccessibilityContent = () => (
  <div className="space-y-4">
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-6 md:p-10 rounded-3xl">
      <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-lg font-sans">
        <span className="font-bold text-neutral-700 dark:text-white">
          Dual-mode AI Pipeline
        </span>{" "}
        Combines Axe-core static analysis with Gemini 2.5 Pro for comprehensive WCAG 2.2 AA compliance checking.
      </p>
    </div>

    <Terminal className="max-w-2xl mx-auto">
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

const projects = [
  {
    src: "/AI Accessibility.png",
    title: "AI-Powered Accessibility Analyzer",
    category: "AI/ML • Research",
    technologies: ["Python", "Node.js", "Axe-core", "Playwright", "Google Gemini 2.5 Pro", "WCAG 2.2"],
    content: <AIAccessibilityContent />,
  },
  {
    src: "/AI Policy Aggregator.png",
    title: "AI Policy Aggregator",
    category: "AI/ML • Production",
    technologies: ["React 19", "TypeScript", "FastAPI", "OpenAI GPT-4", "ChromaDB", "Sentence Transformers"],
    content: <SimpleContent 
      title="AI Policy Aggregator" 
      description="Production RAG system deployed on AWS with 296 comprehensive tests. Uses ChromaDB for semantic search, achieving 40% improvement in content relevance through query expansion."
      link="#"
      imgSrc="/AI Policy Aggregator.png"
    />,
  },
  {
    src: "/LLM_Pro_Max.jpg",
    title: "LLM Pro Max",
    category: "AI/ML • Hackathon Winner 🏆",
    technologies: ["React.js", "Cohere", "Python", "FastAPI", "ChromaDB", "NetworkX"],
    content: <LLMProMaxContent />,
  },
  {
    src: "/Re-Plate.jpg",
    title: "Re-Plate",
    category: "AI/ML • Hackathon Winner 🥇",
    technologies: ["Next.js", "Tailwind CSS", "Google Gemini AI", "Python FastAPI", "Computer Vision"],
    content: <SimpleContent 
      title="Re-Plate" 
      description="youCode 2025 1st Place winner! AI-powered food donation platform using Gemini Vision for automated classification. Achieved 100% accuracy on expiration date detection."
      link="https://devpost.com/software/replate-z3b5mg"
      imgSrc="/Re-Plate.jpg"
    />,
  },
  {
    src: "/JobGeek.png",
    title: "JobGeek",
    category: "Full-Stack • Demo",
    technologies: ["React", "Node.js", "MongoDB", "Express", "API Integration"],
    content: <SimpleContent 
      title="JobGeek" 
      description="Comprehensive job search platform aggregating listings from multiple sources with advanced filtering and market trend analytics."
      link="https://jobgeek.vercel.app/"
      imgSrc="/JobGeek.png"
    />,
  },
  {
    src: "/covinet.png",
    title: "CoviNet",
    category: "Full-Stack • Demo",
    technologies: ["React", "Node.js", "API Integration", "Real-time Data"],
    content: <SimpleContent 
      title="covinet" 
      description="COVID-19 resource platform connecting users with testing locations and health services. Real-time health data integration during the pandemic."
      link="https://devpost.com/software/covinet"
      imgSrc="/covinet.png"
    />,
  },
];

export default function ProjectsWidget() {
  const cards = projects.map((project, index) => (
    <Card 
      key={project.title} 
      card={project} 
      index={index} 
      layout={true} 
    />
  ));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-4 space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <IconCode className="w-5 h-5 text-ai-cyan" />
        <h3 className="text-lg font-bold text-white">
          Featured Projects
        </h3>
      </div>
      
      <div className="overflow-hidden -mx-4">
        <Carousel items={cards} initialScroll={0} />
      </div>
    </motion.div>
  );
}
