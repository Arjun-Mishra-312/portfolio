"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconCode,
  IconExternalLink,
  IconTrophy,
  IconRocket,
  IconChartBar,
  IconBrain,
  IconTools,
  IconBulb,
  IconTarget,
  IconBrandGithub,
  IconLink,
} from '@tabler/icons-react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import { Safari } from '@/components/ui/safari';

// Reusable Section Components
const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="text-ai-cyan">{icon}</div>
    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{title}</h3>
  </div>
);

const TechStack = ({ technologies }: { technologies: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {technologies.map((tech, idx) => (
      <span
        key={idx}
        className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 dark:from-ai-cyan/20 dark:to-ai-blue/20 border border-ai-cyan/20 text-neutral-700 dark:text-neutral-300 font-medium"
      >
        {tech}
      </span>
    ))}
  </div>
);

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
        <span className="text-ai-cyan mt-1.5">•</span>
        <span className="text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const InfoBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">{title}</p>
    <div className="text-sm text-neutral-700 dark:text-neutral-300">{children}</div>
  </div>
);

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

// Metric badge component
const MetricBadge = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 dark:from-ai-cyan/20 dark:to-ai-blue/20 rounded-lg border border-ai-cyan/20">
    {icon && <span className="text-ai-cyan">{icon}</span>}
    <span className="text-xs text-neutral-600 dark:text-neutral-400">{label}:</span>
    <span className="text-sm font-bold text-neutral-700 dark:text-white">{value}</span>
  </div>
);

// AI Accessibility content with comprehensive details
const AIAccessibilityContent = () => (
  <div className="space-y-8">
    {/* Overview Section */}
    <Section>
      <div className="flex items-center gap-2 mb-4">
        <IconChartBar className="w-6 h-6 text-ai-cyan" />
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          📊 Research Publication (ACM ASSETS 2026)
        </span>
      </div>
      <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        A comprehensive research project evaluating Vision-Language Models (VLMs) for automated web accessibility auditing. 
        This work addresses the critical gap where static analysis tools detect only 30-40% of WCAG violations, leaving 
        1.3 billion users with disabilities facing persistent digital barriers. The system combines rule-based static 
        analysis with VLM visual reasoning to achieve comprehensive accessibility evaluation.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <MetricBadge label="F1 Score" value="0.688" icon={<IconChartBar className="w-4 h-4" />} />
        <MetricBadge label="Precision" value="0.606" />
        <MetricBadge label="Recall" value="0.795" />
        <MetricBadge label="Combined" value="0.943" />
      </div>
    </Section>

    {/* Methodology Section */}
    <Section>
      <SectionTitle icon={<IconBrain className="w-6 h-6" />} title="Research Methodology" />
      <div className="space-y-4">
        <InfoBox title="Three-Stage VLM Protocol">
          <p className="mb-3">The evaluation protocol decomposes accessibility assessment into three focused stages:</p>
          <FeatureList items={[
            "Stage 1: Structural Analysis - Evaluates DOM structure, ARIA attributes, heading hierarchies",
            "Stage 2: Interactive Analysis - Assesses keyboard navigation, focus indicators, interactive elements",
            "Stage 3: Visual Analysis - Examines color contrast, visual cues, rendered appearance"
          ]} />
        </InfoBox>
        <InfoBox title="Evaluation Dataset">
          <p>Comprehensive benchmark comprising 10 academic library websites, 35 viewport states, and 122 expert-labeled ground-truth violations covering structural, interactive, and visual WCAG 2.2 criteria.</p>
        </InfoBox>
        <InfoBox title="Models Evaluated">
          <p className="mb-2">Five VLM architectures tested:</p>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Claude 4.5 Sonnet</strong> - Best performer (F1=0.688, Precision=0.606, Recall=0.795)</li>
            <li>• GPT-5.1 - Strong performance on visual criteria</li>
            <li>• Gemini 3 Pro - Competitive results across all stages</li>
            <li>• Gemma 3 (27B) - Local model, F1=0.420, cost-effective alternative</li>
            <li>• Qwen 2.5 (32B) - Local model, deployable on commodity GPUs</li>
          </ul>
        </InfoBox>
      </div>
    </Section>

    {/* Results & Findings Section */}
    <Section>
      <SectionTitle icon={<IconTarget className="w-6 h-6" />} title="Key Findings & Results" />
      <div className="space-y-4">
        <InfoBox title="Complementarity Analysis">
          <p className="mb-2">Critical discovery: Static analysis and VLMs are complementary, not redundant:</p>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Static Analysis</strong> dominates structural criteria (WCAG 2.4.6 Headings: F1=1.0)</li>
            <li>• <strong>VLMs</strong> excel at visual criteria where static tools fail (Color Contrast: F1=0.67 vs Static F1=0.0)</li>
            <li>• <strong>Combined Union</strong> (Static ∪ VLM) achieves 94.3% recall, detecting 115 of 122 violations</li>
          </ul>
        </InfoBox>
        <InfoBox title="Performance Metrics">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white mb-1">Best Single Model</p>
              <p>Claude 4.5 Sonnet: F1=0.688</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white mb-1">Baseline (Static Only)</p>
              <p>F1=0.280 (29.5% recall)</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white mb-1">Hybrid Approach</p>
              <p>94.3% recall (115/122 violations)</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white mb-1">Cost Optimization</p>
              <p>35% reduction in inference costs</p>
            </div>
          </div>
        </InfoBox>
      </div>
    </Section>

    {/* Technical Details Section */}
    <Section>
      <SectionTitle icon={<IconTools className="w-6 h-6" />} title="Technical Implementation" />
      <div className="space-y-4">
        <InfoBox title="Architecture">
          <p className="mb-2">Hybrid evaluation pipeline combining:</p>
          <FeatureList items={[
            "Axe-core static analysis for structural violations",
            "Playwright for browser automation and screenshot capture",
            "Multi-provider VLM integration (Anthropic, OpenAI, Google, Local)",
            "JSON schema-constrained output for machine-verifiable results",
            "Accessibility tree grounding for precise element localization"
          ]} />
        </InfoBox>
        <InfoBox title="Optimization Techniques">
          <FeatureList items={[
            "Token management and optimized prompt engineering",
            "Chain-of-Thought (CoT) prompting for complex reasoning",
            "ReAct (Reasoning + Acting) framework for multi-step analysis",
            "Hybrid inference strategy reducing per-page costs by 35%"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Technologies Section */}
    <Section>
      <SectionTitle icon={<IconCode className="w-6 h-6" />} title="Technologies" />
      <TechStack technologies={[
        "Python", "Node.js", "Axe-core", "Playwright", 
        "Claude 4.5 Sonnet", "GPT-5.1", "Gemini 3 Pro", 
        "Gemma 3", "Qwen 2.5", "WCAG 2.2"
      ]} />
    </Section>
  </div>
);

// AI Policy Aggregator content with comprehensive details
const AIPolicyAggregatorContent = () => (
  <div className="space-y-8">
    {/* Overview Section */}
    <Section>
      <Safari 
        url="AI Policy Aggregator" 
        imageSrc="/AI Policy Aggregator.png"
        className="w-full max-w-3xl mx-auto"
      />
      <div className="flex items-center gap-2 mt-6 mb-4">
        <IconRocket className="w-6 h-6 text-ai-cyan" />
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          🚀 Production System (AWS Deployed)
        </span>
      </div>
      <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        A production-ready full-stack application addressing information overload in AI policy through systematic 
        content curation and personalized summarization. Built over 5 months (February-June 2025), this system 
        aggregates content from four major policy sources and generates hallucination-free briefings using a 
        novel two-stage anti-hallucination approach.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        <MetricBadge label="Tests" value="296" icon={<IconChartBar className="w-4 h-4" />} />
        <MetricBadge label="Pass Rate" value="100%" />
        <MetricBadge label="Relevance" value="+40%" />
      </div>
    </Section>

    {/* Architecture Section */}
    <Section>
      <SectionTitle icon={<IconBrain className="w-6 h-6" />} title="System Architecture" />
      <div className="space-y-4">
        <InfoBox title="Data Ingestion Pipeline">
          <p className="mb-2">Offline pipeline operating weekly or on-demand:</p>
          <FeatureList items={[
            "Custom scrapers for OECD (HTTP/PDF), CAIDP (HTML parsing), arXiv (API), Brookings (Playwright)",
            "Content extraction via Trafilatura and pypdf",
            "Deduplication using SHA-256 hashing",
            "Embedding generation with 'all-MiniLM-L6-v2' sentence transformer (384-dimensional)",
            "Storage in ChromaDB vector database with rich metadata"
          ]} />
        </InfoBox>
        <InfoBox title="Briefing Generation Pipeline">
          <p className="mb-2">Real-time generation process:</p>
          <FeatureList items={[
            "Query expansion using rule-based synonyms and optional LLM augmentation",
            "Semantic retrieval: Top 200 articles by cosine similarity from ChromaDB",
            "Dual-stage filtering: Similarity threshold + keyword matching (reduces to 20-50 highly relevant docs)",
            "GPT-4 JSON mode summarization with strict source attribution requirements",
            "Firebase storage and delivery to React frontend (20-30s end-to-end latency)"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Anti-Hallucination Methodology */}
    <Section>
      <SectionTitle icon={<IconBulb className="w-6 h-6" />} title="Two-Stage Anti-Hallucination Approach" />
      <div className="space-y-4">
        <InfoBox title="Stage 1: Semantic Filtering">
          <p className="mb-2">Establishes bounded context before LLM processing:</p>
          <FeatureList items={[
            "Query expansion via rule-based synonyms and auxiliary LLM",
            "Semantic retrieval of top 200 articles by cosine similarity",
            "Dual relevance filter: distance threshold + keyword presence requirement",
            "Narrows from 200 to 20-50 highly relevant documents",
            "Dramatically improves LLM input quality by concentrating on on-topic material"
          ]} />
        </InfoBox>
        <InfoBox title="Stage 2: Strict Attribution Prompting">
          <p className="mb-2">Enforces source attribution through systematic prompt engineering:</p>
          <FeatureList items={[
            "System prompt explicitly requires every claim cite a specific source",
            "Forbids unsourced information and mandates valid, non-empty URLs",
            "JSON mode output with required fields: text, source_title, source_url, source_name, publication_date",
            "Pydantic model validation ensures schema compliance",
            "Achieves 100% observed source grounding in generated briefings"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Sources & Features */}
    <Section>
      <SectionTitle icon={<IconTarget className="w-6 h-6" />} title="Sources & Key Features" />
      <div className="space-y-4">
        <InfoBox title="Content Sources">
          <p className="mb-2">Four major AI policy sources aggregated:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded">• OECD</div>
            <div className="p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded">• CAIDP</div>
            <div className="p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded">• arXiv</div>
            <div className="p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded">• Brookings</div>
          </div>
        </InfoBox>
        <InfoBox title="Key Features">
          <FeatureList items={[
            "Semantic search with sentence transformers for dense retrieval",
            "Query expansion improving recall over semantically similar language",
            "Two-stage filtering balancing recall and precision",
            "100% source attribution eliminating hallucinations",
            "Personalized weekly briefings based on user-defined interests",
            "Secure Firebase authentication and user profile management"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Development & Deployment */}
    <Section>
      <SectionTitle icon={<IconTools className="w-6 h-6" />} title="Development & Deployment" />
      <div className="space-y-4">
        <InfoBox title="Development Timeline">
          <p className="mb-2">5-month development (Feb-June 2025) in three phases:</p>
          <FeatureList items={[
            "Phase 1 (Feb-Mar): Backend foundation, scrapers, ChromaDB integration, initial briefing pipeline",
            "Phase 2 (Apr-May): Prompt design iteration, two-stage filtering, AWS deployment",
            "Phase 3 (May-Jun): React frontend, Firebase authentication, end-to-end deployment"
          ]} />
        </InfoBox>
        <InfoBox title="Testing & Quality">
          <p className="mb-2">Production-grade quality assurance:</p>
          <ul className="space-y-1 text-sm">
            <li>• <strong>296 automated tests</strong> with 100% pass rate</li>
            <li>• Comprehensive test coverage across all components</li>
            <li>• Error handling and graceful failure modes</li>
            <li>• Secure authentication and role-based access control</li>
          </ul>
        </InfoBox>
      </div>
    </Section>

    {/* Technologies Section */}
    <Section>
      <SectionTitle icon={<IconCode className="w-6 h-6" />} title="Technologies" />
      <TechStack technologies={[
        "React 19", "TypeScript", "FastAPI", "OpenAI GPT-4", 
        "ChromaDB", "Sentence Transformers", "Firebase", "AWS"
      ]} />
    </Section>
  </div>
);

// LLM Pro Max content with comprehensive details
const LLMProMaxContent = () => (
  <div className="space-y-8">
    {/* Overview Section */}
    <Section>
      <Safari 
        url="devpost.com/software/llm-pro-max" 
        imageSrc="/LLM_Pro_Max.jpg"
        className="w-full max-w-3xl mx-auto"
      />
      <div className="flex items-center gap-2 mt-6 mb-4">
        <IconTrophy className="w-6 h-6 text-yellow-500" />
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          🏆 Hack the North 2024 Winner (Codegen Track)
        </span>
      </div>
      <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        Revolutionary codebase analysis platform that overcomes LLM token limitations by intelligently breaking 
        codebases into manageable chunks and feeding only relevant information to the LLM. This ensures token 
        efficiency and improved response accuracy while providing interactive dependency visualization for better 
        codebase understanding.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        <MetricBadge label="Relevancy" value="86%" icon={<IconChartBar className="w-4 h-4" />} />
        <MetricBadge label="Chunking" value="Intelligent" />
        <MetricBadge label="RAG" value="Advanced" />
      </div>
    </Section>

    {/* Problem & Solution */}
    <Section>
      <SectionTitle icon={<IconBulb className="w-6 h-6" />} title="Problem & Solution" />
      <div className="space-y-4">
        <InfoBox title="The Challenge">
          <p>Large Language Models are limited by token caps, making it difficult to process large contexts like entire codebases. Traditional approaches either hit token limits or provide irrelevant information, reducing accuracy and efficiency.</p>
        </InfoBox>
        <InfoBox title="Our Solution">
          <FeatureList items={[
            "Intelligent codebase chunking that preserves semantic context",
            "Advanced RAG techniques with query expansion and re-ranking",
            "Interactive dependency graph visualization using NetworkX and Pyvis",
            "ChromaDB vector embeddings for efficient semantic search",
            "Cohere-powered chatbot with context-aware responses"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* RAG Architecture */}
    <Section>
      <SectionTitle icon={<IconBrain className="w-6 h-6" />} title="RAG Architecture & Techniques" />
      <div className="space-y-4">
        <InfoBox title="Chunking Strategy">
          <FeatureList items={[
            "Custom chunking algorithms that respect code structure",
            "Semantic boundary detection for meaningful code segments",
            "Preservation of function/class context across chunks",
            "Intelligent handling of imports and dependencies"
          ]} />
        </InfoBox>
        <InfoBox title="Retrieval & Ranking">
          <FeatureList items={[
            "Query expansion using rule-based and LLM-based techniques",
            "Semantic search via ChromaDB vector similarity",
            "Re-ranking of retrieved chunks by relevance score",
            "Top-K selection (typically 15 chunks) for optimal context",
            "Achieved 86% query relevancy score"
          ]} />
        </InfoBox>
        <InfoBox title="Dependency Visualization">
          <FeatureList items={[
            "NetworkX for dependency graph construction",
            "Pyvis for interactive graph visualization",
            "Real-time codebase relationship mapping",
            "Visual exploration of code dependencies and connections"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Features & Capabilities */}
    <Section>
      <SectionTitle icon={<IconTarget className="w-6 h-6" />} title="Key Features" />
      <div className="space-y-4">
        <InfoBox title="Core Capabilities">
          <FeatureList items={[
            "Codebase indexing with intelligent chunking (processed 1,247 files, created 3,891 semantic chunks)",
            "Natural language queries about codebase functionality",
            "Interactive dependency graph visualization",
            "GitHub repository integration via Auth0",
            "Persistent chat history stored in Convex database",
            "Multi-repository support with context switching"
          ]} />
        </InfoBox>
        <InfoBox title="User Experience">
          <FeatureList items={[
            "Clean, intuitive React.js interface",
            "Real-time codebase analysis feedback",
            "Visual dependency exploration",
            "Seamless GitHub authentication",
            "Responsive design for all devices"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Hackathon Experience */}
    <Section>
      <SectionTitle icon={<IconTrophy className="w-6 h-6" />} title="Hackathon Experience" />
      <div className="space-y-4">
        <InfoBox title="Hack the North 2024">
          <p className="mb-2">Won the Codegen track at Canada's premier hackathon:</p>
          <FeatureList items={[
            "Built entire platform in 36 hours",
            "Successfully integrated multiple complex systems (RAG, vector DB, visualization)",
            "Demonstrated working prototype with real codebase analysis",
            "Received recognition for innovative approach to code understanding"
          ]} />
        </InfoBox>
        <InfoBox title="Team Collaboration">
          <p>Collaborated with team members working on separate components, successfully integrating frontend (React), backend (FastAPI), vector database (ChromaDB), and visualization (NetworkX/Pyvis) into a cohesive product.</p>
        </InfoBox>
      </div>
    </Section>

    {/* Technologies Section */}
    <Section>
      <SectionTitle icon={<IconCode className="w-6 h-6" />} title="Technologies" />
      <TechStack technologies={[
        "React.js", "Cohere", "Python", "FastAPI", 
        "ChromaDB", "NetworkX", "Auth0", "Convex", "LangChain"
      ]} />
    </Section>

    {/* Links Section */}
    <Section>
      <SectionTitle icon={<IconLink className="w-6 h-6" />} title="Links & Resources" />
      <a 
        href="https://devpost.com/software/llm-pro-max" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 dark:from-ai-cyan/20 dark:to-ai-blue/20 border border-ai-cyan/20 rounded-lg text-ai-cyan hover:text-ai-blue transition-colors"
      >
        <IconExternalLink className="w-5 h-5" />
        View on Devpost
      </a>
    </Section>
  </div>
);

// Re-Plate content with comprehensive details
const RePlateContent = () => (
  <div className="space-y-8">
    {/* Overview Section */}
    <Section>
      <Safari 
        url="devpost.com/software/replate-z3b5mg" 
        imageSrc="/Re-Plate.jpg"
        className="w-full max-w-3xl mx-auto"
      />
      <div className="flex items-center gap-2 mt-6 mb-4">
        <IconTrophy className="w-6 h-6 text-yellow-500" />
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          🥇 youCode 2025 1st Place (SAP Stream)
        </span>
      </div>
      <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        An AI-powered food donation platform that connects surplus food to food-insecure people through intelligent 
        donation matching. Addresses the critical problem of 1.3 billion tons of food wasted globally while 828 million 
        people go hungry. The system uses advanced computer vision and machine learning to automate food classification 
        and safety assessment, achieving 100% accuracy on expiration date detection.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        <MetricBadge label="Accuracy" value="100%" icon={<IconChartBar className="w-4 h-4" />} />
        <MetricBadge label="ML Models" value="3 Optimized" />
        <MetricBadge label="Impact" value="Real-time" />
      </div>
    </Section>

    {/* Problem & Impact */}
    <Section>
      <SectionTitle icon={<IconBulb className="w-6 h-6" />} title="Problem & Impact" />
      <div className="space-y-4">
        <InfoBox title="The Global Food Waste Crisis">
          <p className="mb-2">Critical statistics driving the need for this solution:</p>
          <ul className="space-y-1 text-sm">
            <li>• <strong>1.3 billion tons</strong> of food wasted globally each year</li>
            <li>• <strong>828 million people</strong> go hungry worldwide</li>
            <li>• <strong>40%</strong> of food waste occurs at retail and consumer levels in developed countries</li>
            <li>• Food waste in landfills produces <strong>methane</strong>, a greenhouse gas 25x more potent than CO₂</li>
            <li>• Local shelters struggle to maintain consistent supply of nutritious food</li>
          </ul>
        </InfoBox>
        <InfoBox title="Impact Metrics">
          <FeatureList items={[
            "Tracks wastage prevented in real-time",
            "Measures CO₂ emissions offset from diverted food",
            "Counts people served through donations",
            "Visualizes community-wide impact through analytics"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* AI & ML Architecture */}
    <Section>
      <SectionTitle icon={<IconBrain className="w-6 h-6" />} title="AI & ML Architecture" />
      <div className="space-y-4">
        <InfoBox title="Food Classification System">
          <p className="mb-2">Multi-model approach for accurate food identification:</p>
          <FeatureList items={[
            "Google Gemini Vision API for primary food classification",
            "Three optimized Machine Learning models (TensorFlow & PyTorch) for image analysis",
            "Custom image classifier trained on food datasets",
            "Automated food type detection from uploaded photos"
          ]} />
        </InfoBox>
        <InfoBox title="Expiration Date Detection">
          <p className="mb-2">Achieved 100% accuracy through combined analysis:</p>
          <FeatureList items={[
            "Dual-endpoint approach combining ML image analysis and Gemini text recognition",
            "TensorFlow/PyTorch models analyze packaging images",
            "Gemini Vision extracts and interprets best-before dates",
            "Handles diverse label formats, positions, and clarity levels",
            "Validates food safety based on visual condition and expiration information"
          ]} />
        </InfoBox>
        <InfoBox title="Food Safety Assessment">
          <FeatureList items={[
            "Intelligent system examines best-before dates and food conditions",
            "Ensures all donations are safe for consumption",
            "Protects both donors and recipients",
            "Real-time safety validation before matching"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Features & User Experience */}
    <Section>
      <SectionTitle icon={<IconTarget className="w-6 h-6" />} title="Features & User Experience" />
      <div className="space-y-4">
        <InfoBox title="For Food Donors">
          <FeatureList items={[
            "Quick cataloging of surplus food items through intuitive interface",
            "AI assistance for automatic food classification",
            "Automated expiration date detection",
            "Comprehensive analytics dashboard showing donation impact",
            "Visual metrics on wastage prevented, CO₂ emissions offset, and people served"
          ]} />
        </InfoBox>
        <InfoBox title="For Food Shelters">
          <FeatureList items={[
            "Create specific food requests based on current needs",
            "Get matched with available donations in their area",
            "View past food requests and donation history",
            "Access dashboard with donation analytics",
            "Coordinate pickups and deliveries"
          ]} />
        </InfoBox>
        <InfoBox title="Analytics & Visualization">
          <FeatureList items={[
            "ApexCharts integration for engaging data visualizations",
            "Donation metrics displayed intuitively",
            "Community-wide impact tracking",
            "Real-time updates on food availability"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Technical Implementation */}
    <Section>
      <SectionTitle icon={<IconTools className="w-6 h-6" />} title="Technical Implementation" />
      <div className="space-y-4">
        <InfoBox title="Frontend Development">
          <FeatureList items={[
            "Next.js with responsive design for mobile, tablet, and desktop",
            "Tailwind CSS for modern, accessible UI",
            "Component-based architecture for consistency",
            "Dynamic routing for efficient page transitions",
            "Sidebar navigation for easy access to dashboard, analytics, and requests"
          ]} />
        </InfoBox>
        <InfoBox title="Backend & AI Integration">
          <FeatureList items={[
            "Python FastAPI for efficient backend services",
            "RESTful architecture for smooth frontend-backend communication",
            "Google Gemini Vision API for image recognition",
            "TensorFlow and PyTorch for custom ML models",
            "Secure authentication and role-based access control"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Hackathon Experience */}
    <Section>
      <SectionTitle icon={<IconTrophy className="w-6 h-6" />} title="Hackathon Experience" />
      <div className="space-y-4">
        <InfoBox title="youCode 2025 - 1st Place">
          <p className="mb-2">Won first place in the SAP Stream:</p>
          <FeatureList items={[
            "Built complete platform during hackathon timeframe",
            "Successfully integrated multiple AI/ML services (Gemini, TensorFlow, PyTorch)",
            "Overcame challenge of accurately analyzing best-before dates from diverse packaging",
            "Demonstrated working prototype with real food classification",
            "Received recognition for social impact and technical innovation"
          ]} />
        </InfoBox>
        <InfoBox title="Key Challenges Overcome">
          <FeatureList items={[
            "Accurate best-before date extraction from varied food packaging formats",
            "Combining multiple ML models for optimal accuracy",
            "Designing interfaces for two distinct user groups (donors and shelters)",
            "Real-time matching algorithm for efficient food distribution"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Technologies Section */}
    <Section>
      <SectionTitle icon={<IconCode className="w-6 h-6" />} title="Technologies" />
      <TechStack technologies={[
        "Next.js", "Tailwind CSS", "Google Gemini AI", "Python FastAPI", 
        "TensorFlow", "PyTorch", "ApexCharts"
      ]} />
    </Section>

    {/* Links Section */}
    <Section>
      <SectionTitle icon={<IconLink className="w-6 h-6" />} title="Links & Resources" />
      <a 
        href="https://devpost.com/software/replate-z3b5mg" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 dark:from-ai-cyan/20 dark:to-ai-blue/20 border border-ai-cyan/20 rounded-lg text-ai-cyan hover:text-ai-blue transition-colors"
      >
        <IconExternalLink className="w-5 h-5" />
        View on Devpost
      </a>
    </Section>
  </div>
);

// CoviNet content with comprehensive details
const CoviNetContent = () => (
  <div className="space-y-8">
    {/* Overview Section */}
    <Section>
      <Safari 
        url="devpost.com/software/covinet" 
        imageSrc="/covinet.png"
        className="w-full max-w-3xl mx-auto"
      />
      <div className="flex items-center gap-2 mt-6 mb-4">
        <IconTrophy className="w-6 h-6 text-yellow-500" />
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          🏆 CruzHacks 2022 Winner (QB3 @ UCSC)
        </span>
      </div>
      <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        A comprehensive COVID-19 resource platform built during the pandemic to help users find testing locations, 
        connect with health services, access verified information, and communicate with others dealing with COVID. 
        Built with Flutter for cross-platform deployment, featuring real-time messaging, location services, and 
        verified news aggregation.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        <MetricBadge label="Platform" value="Flutter" icon={<IconRocket className="w-4 h-4" />} />
        <MetricBadge label="Database" value="Firebase RT" />
        <MetricBadge label="Real-time" value="Yes" />
      </div>
    </Section>

    {/* Problem & Solution */}
    <Section>
      <SectionTitle icon={<IconBulb className="w-6 h-6" />} title="Problem & Solution" />
      <div className="space-y-4">
        <InfoBox title="The Challenge">
          <p>During the COVID-19 pandemic, people faced difficulty finding reliable information about testing locations, 
          understanding health protocols, and connecting with others dealing with similar situations. Information was 
          scattered across multiple sources, making it hard to access timely, verified updates.</p>
        </InfoBox>
        <InfoBox title="Our Solution">
          <FeatureList items={[
            "Centralized platform for all COVID-19 resources",
            "Real-time connection with testing locations via Google Maps",
            "Verified news aggregation from trusted sources",
            "Community messaging for support and information sharing",
            "Test report tracking and case alerts by region"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Core Features */}
    <Section>
      <SectionTitle icon={<IconTarget className="w-6 h-6" />} title="Core Features" />
      <div className="space-y-4">
        <InfoBox title="Test Center Finder">
          <FeatureList items={[
            "Google Maps API integration for location-based services",
            "Find nearby COVID-19 testing locations",
            "Real-time availability and contact information",
            "Directions and navigation support"
          ]} />
        </InfoBox>
        <InfoBox title="Real-Time Messaging">
          <FeatureList items={[
            "Firebase Real-time Database for instant messaging",
            "Connect with others dealing with COVID",
            "Share experiences and support",
            "Community-driven information exchange"
          ]} />
        </InfoBox>
        <InfoBox title="Verified News & Information">
          <FeatureList items={[
            "News API integration for verified COVID updates",
            "YouTube API for informational videos",
            "Curated content from trusted sources",
            "Real-time updates on pandemic developments"
          ]} />
        </InfoBox>
        <InfoBox title="Test Report Tracking">
          <FeatureList items={[
            "Store and track COVID test reports",
            "Add new test reports with details",
            "View test history and results",
            "Personal health record management"
          ]} />
        </InfoBox>
        <InfoBox title="COVID Case Alerts">
          <FeatureList items={[
            "Regional case tracking using synthetic datasets from Gretel",
            "Alerts for COVID cases in user's area",
            "Data visualization for case trends",
            "Stay informed about local pandemic status"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Technical Architecture */}
    <Section>
      <SectionTitle icon={<IconBrain className="w-6 h-6" />} title="Technical Architecture" />
      <div className="space-y-4">
        <InfoBox title="Frontend - Flutter">
          <FeatureList items={[
            "Cross-platform mobile app (iOS and Android from single codebase)",
            "Responsive UI design for all screen sizes",
            "Native performance with Flutter's rendering engine",
            "Smooth animations and transitions"
          ]} />
        </InfoBox>
        <InfoBox title="Backend - Firebase">
          <FeatureList items={[
            "Firebase Real-time Database for instant data synchronization",
            "User authentication and session management",
            "Real-time messaging infrastructure",
            "Cloud storage for test reports and media"
          ]} />
        </InfoBox>
        <InfoBox title="API Integrations">
          <FeatureList items={[
            "Google Maps API for location services and test center data",
            "Google Cloud Platform for backend services",
            "News API for verified COVID-19 news aggregation",
            "YouTube API for informational video content",
            "Gretel for synthetic dataset generation for case tracking"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Development Challenges */}
    <Section>
      <SectionTitle icon={<IconTools className="w-6 h-6" />} title="Development Challenges" />
      <div className="space-y-4">
        <InfoBox title="Technical Challenges">
          <FeatureList items={[
            "Database access using Firebase - learning curve with real-time database",
            "Troubles implementing methods to access Firebase real-time database",
            "API links implementation and error handling",
            "Synchronizing multiple data sources in real-time"
          ]} />
        </InfoBox>
        <InfoBox title="Solutions Implemented">
          <FeatureList items={[
            "Successfully implemented Firebase Real-time Database",
            "Integrated Google Maps API and stored location data effectively",
            "Implemented messaging feature using Firebase with real-time updates",
            "Successfully integrated YouTube and News APIs with proper error handling"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Hackathon Experience */}
    <Section>
      <SectionTitle icon={<IconTrophy className="w-6 h-6" />} title="Hackathon Experience" />
      <div className="space-y-4">
        <InfoBox title="CruzHacks 2022 - Winner">
          <p className="mb-2">Won the QB3 @ UCSC sponsor prize:</p>
          <FeatureList items={[
            "Built complete mobile app during hackathon timeframe",
            "First major Flutter project - learned Dart and Flutter framework",
            "Successfully integrated multiple APIs (Firebase, Google Maps, News, YouTube)",
            "Implemented real-time database functionality",
            "Created working prototype addressing real pandemic needs"
          ]} />
        </InfoBox>
        <InfoBox title="Key Learnings">
          <FeatureList items={[
            "How to use Flutter to create mobile apps",
            "Linking multiple APIs to mobile applications",
            "Using databases to store user information",
            "Accessing and implementing Firestore's real-time database",
            "Using Gretel to create synthetic datasets",
            "Mobile app development best practices"
          ]} />
        </InfoBox>
      </div>
    </Section>

    {/* Technologies Section */}
    <Section>
      <SectionTitle icon={<IconCode className="w-6 h-6" />} title="Technologies" />
      <TechStack technologies={[
        "Flutter", "Dart", "Firebase", "Google Cloud", 
        "News-API", "YouTube API", "Gretel"
      ]} />
    </Section>

    {/* Links Section */}
    <Section>
      <SectionTitle icon={<IconLink className="w-6 h-6" />} title="Links & Resources" />
      <a 
        href="https://devpost.com/software/covinet" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 dark:from-ai-cyan/20 dark:to-ai-blue/20 border border-ai-cyan/20 rounded-lg text-ai-cyan hover:text-ai-blue transition-colors"
      >
        <IconExternalLink className="w-5 h-5" />
        View on Devpost
      </a>
    </Section>
  </div>
);

const projects = [
  {
    src: "/AI Accessibility.png",
    title: "AI-Powered Accessibility Analyzer",
    category: "AI/ML • Research • Publication",
    technologies: ["Python", "Node.js", "Axe-core", "Playwright", "Claude 4.5 Sonnet", "GPT-5.1", "Gemini 3 Pro", "WCAG 2.2"],
    content: <AIAccessibilityContent />,
  },
  {
    src: "/AI Policy Aggregator.png",
    title: "AI Policy Aggregator",
    category: "AI/ML • Production • AWS",
    technologies: ["React 19", "TypeScript", "FastAPI", "OpenAI GPT-4", "ChromaDB", "Sentence Transformers", "Firebase"],
    content: <AIPolicyAggregatorContent />,
  },
  {
    src: "/LLM_Pro_Max.jpg",
    title: "LLM Pro Max",
    category: "AI/ML • Hackathon Winner 🏆",
    technologies: ["React.js", "Cohere", "Python", "FastAPI", "ChromaDB", "NetworkX", "Auth0", "Convex"],
    content: <LLMProMaxContent />,
  },
  {
    src: "/Re-Plate.jpg",
    title: "Re-Plate",
    category: "AI/ML • Hackathon Winner 🥇",
    technologies: ["Next.js", "Tailwind CSS", "Google Gemini AI", "Python FastAPI", "TensorFlow", "PyTorch", "ApexCharts"],
    content: <RePlateContent />,
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
    category: "Full-Stack • Hackathon Winner 🏆",
    technologies: ["Flutter", "Dart", "Firebase", "Google Cloud", "News-API", "YouTube API"],
    content: <CoviNetContent />,
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
