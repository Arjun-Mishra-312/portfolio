"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  IconBrain,
  IconBuilding,
  IconCalendar,
  IconMapPin,
  IconX,
  IconCode,
  IconTrophy,
  IconChevronDown,
} from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  description?: string;
  achievements: string[];
  technologies?: string[];
  metrics?: string[];
  logo: string;
  color: string;
  current: boolean;
}

const experiences: Experience[] = [
  {
    id: "ifs-copperleaf-ai",
    title: "AI Engineering Co-op",
    company: "IFS Copperleaf",
    location: "Vancouver, BC",
    duration: "Oct 2025 - Present",
    type: "Industry",
    description: "Collaborating with the Technology & AI team to identify and automate repetitive tasks using scripting and workflow automation, enhancing operational efficiency. Assisting in exploring and implementing AI-assisted tools to streamline IT processes.",
    achievements: [
      "Collaborate with the Technology & AI team to identify and automate repetitive tasks using scripting and workflow automation, enhancing operational efficiency",
      "Assist in exploring and implementing AI-assisted tools to streamline IT processes like ticket handling and user self-service",
      "Contribute to organization-wide rollout of LLM solutions by developing adoption strategies & establishing best practices"
    ],
    technologies: ["Python", "Scripting", "Workflow Automation", "AI Tools", "LLM Solutions", "IT Process Optimization"],
    metrics: ["Process Automation", "AI Implementation", "LLM Rollout"],
    logo: "/copperleaf-logo.png",
    color: "from-emerald-500 to-green-500",
    current: true
  },
  {
    id: "socius-research",
    title: "HCI/AI Research Assistant",
    company: "UBC SOCIUS Lab",
    location: "Vancouver, BC",
    duration: "Sept 2024 - Present",
    type: "Research",
    description: "Leading end-to-end development of production-ready AI systems for policy aggregation and accessibility analysis. Managing project timelines directly with lead professor and presenting weekly demos to stakeholders.",
    achievements: [
      "Led development of two full-stack AI applications translating research goals into production systems",
      "Delivered production-ready AI Policy Aggregator deployed on AWS, actively used by research stakeholders",
      "Drove project progress with weekly demos and iterative development cycles",
      "Communicated technical findings through presentations, reports, and data visualizations"
    ],
    technologies: ["Python", "React 19", "FastAPI", "OpenAI GPT-4", "ChromaDB", "AWS", "Docker"],
    metrics: ["2 Production Apps", "Weekly Demos", "AWS Deployment"],
    logo: "/UBC_logo.png",
    color: "from-blue-500 to-indigo-500",
    current: true
  },
  {
    id: "ubc-ta",
    title: "Teaching Assistant",
    company: "UBC CS Department",
    location: "Vancouver, BC",
    duration: "Jan 2024 - Present",
    type: "Teaching",
    description: "Teaching weekly tutorials for 35+ students in upper-year Computer Networking (CPSC 317), focusing on TCP/IP, DNS, and routing protocols. Supporting lectures with 250+ students across multiple terms.",
    achievements: [
      "Redesigned tutorial format with visually engaging slides, leading to 20% increase in attendance",
      "Format adopted across all sections due to effectiveness and student engagement",
      "Supported 250+ students over 2 Winter Terms and 1 Summer Term",
      "Created supplementary materials to enhance learning outcomes for complex networking concepts"
    ],
    technologies: ["Computer Networking", "TCP/IP", "DNS", "Routing Protocols", "Educational Technology"],
    metrics: ["35+ Students/Tutorial", "20% Attendance Increase", "250+ Students Supported"],
    logo: "/UBC_CS_logo.png",
    color: "from-green-500 to-teal-500",
    current: false
  },
];

const getCategoryBadgeColor = (type: string) => {
  switch (type) {
    case "Research":
      return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    case "Teaching":
      return "bg-green-500/20 text-green-400 border-green-400/30";
    case "Industry":
      return "bg-purple-500/20 text-purple-400 border-purple-400/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-400/30";
  }
};

export default function ExperienceWidget() {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ai-blue/5 via-ai-purple/5 to-ai-pink/5 animate-pulse" />
      
      <div className="relative z-10">
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <IconBuilding className={`w-5 h-5 ${
            theme === 'light' ? 'text-blue-600' : 'text-ai-cyan'
          } animate-pulse`} />
          <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
            Experience
          </span>
        </h3>
        
        <div className="space-y-4 relative z-10">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const hasMoreContent = exp.achievements.length > 2 || exp.description || exp.technologies || exp.metrics;
            
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative glass p-4 rounded-xl space-y-3 hover:bg-white/5 transition-all hover:scale-[1.02] hover:shadow-lg group"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                <div className="flex gap-3 relative z-10">
                  <motion.div 
                    className="relative w-12 h-12 rounded-lg overflow-hidden glass flex-shrink-0 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Glowing effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-30 blur-lg transition-opacity`} />
                    <div className="relative w-full h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1.5">
                      <Image
                        src={exp.logo}
                        alt={exp.company}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className={`font-bold text-sm ${
                          theme === 'light' 
                            ? 'text-gray-900 group-hover:text-blue-600' 
                            : 'text-white group-hover:from-ai-cyan group-hover:to-ai-purple'
                        } transition-all`}>
                          {exp.title}
                        </h4>
                        <p className={`text-sm ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        } group-hover:text-ai-cyan transition-colors`}>{exp.company}</p>
                      </div>
                      {exp.current && (
                        <motion.span 
                          className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 whitespace-nowrap border border-green-500/30 flex items-center gap-1"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Current
                        </motion.span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-xs mb-3">
                      <motion.span 
                        className={`flex items-center gap-1 transition-colors cursor-default ${
                          theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <IconCalendar className={`w-3 h-3 ${
                          theme === 'light' ? 'text-blue-600' : 'text-ai-purple'
                        }`} />
                        {exp.duration}
                      </motion.span>
                      <motion.span 
                        className={`flex items-center gap-1 transition-colors cursor-default ${
                          theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <IconMapPin className={`w-3 h-3 ${
                          theme === 'light' ? 'text-blue-600' : 'text-ai-pink'
                        }`} />
                        {exp.location}
                      </motion.span>
                    </div>
                    
                    {/* Type Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getCategoryBadgeColor(exp.type)}`}>
                        <IconBrain className="w-3 h-3" />
                        {exp.type}
                      </span>
                    </div>
                    
                    {/* Compact achievements list */}
                    <ul className="space-y-1.5">
                      {exp.achievements.slice(0, 2).map((achievement, idx) => (
                        <motion.li 
                          key={idx} 
                          className={`text-xs flex items-start group/item ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                          <span className={`mr-2 mt-0.5 group-hover/item:scale-125 transition-transform ${
                            theme === 'light' ? 'text-blue-600' : 'text-ai-cyan'
                          }`}>✦</span>
                          <span className="group-hover/item:opacity-80 transition-opacity">{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Expand/Collapse Button */}
                    {hasMoreContent && (
                      <motion.button
                        onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                        className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                          theme === 'light' 
                            ? 'text-blue-600 hover:text-blue-700' 
                            : 'text-ai-cyan hover:text-ai-blue'
                        }`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconChevronDown 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                        {isExpanded ? 'Show less' : `Show ${exp.achievements.length - 2} more achievements`}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="pt-3 mt-3 border-t border-white/10 space-y-4">
                        {/* Description */}
                        {exp.description && (
                          <div>
                            <h5 className={`text-xs font-semibold mb-2 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              About
                            </h5>
                            <p className={`text-xs leading-relaxed ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {exp.description}
                            </p>
                          </div>
                        )}

                        {/* All Achievements */}
                        {exp.achievements.length > 2 && (
                          <div>
                            <h5 className={`text-xs font-semibold mb-2 flex items-center gap-1 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              <IconTrophy className={`w-3 h-3 ${
                                theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                              }`} />
                              All Achievements
                            </h5>
                            <ul className="space-y-1.5">
                              {exp.achievements.slice(2).map((achievement, idx) => (
                                <motion.li 
                                  key={idx} 
                                  className={`text-xs flex items-start ${
                                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                                  }`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <span className={`mr-2 mt-0.5 ${
                                    theme === 'light' ? 'text-blue-600' : 'text-ai-cyan'
                                  }`}>✦</span>
                                  <span>{achievement}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Technologies */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div>
                            <h5 className={`text-xs font-semibold mb-2 flex items-center gap-1 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              <IconCode className={`w-3 h-3 ${
                                theme === 'light' ? 'text-purple-600' : 'text-ai-purple'
                              }`} />
                              Technologies
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.technologies.map((tech, idx) => (
                                <motion.span 
                                  key={tech} 
                                  className={`px-2 py-0.5 text-xs rounded-lg border ${
                                    theme === 'light'
                                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                                      : 'glass-card text-gray-200 border-white/10'
                                  }`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.03 }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Metrics */}
                        {exp.metrics && exp.metrics.length > 0 && (
                          <div>
                            <h5 className={`text-xs font-semibold mb-2 flex items-center gap-1 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              <IconTrophy className={`w-3 h-3 ${
                                theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                              }`} />
                              Impact Metrics
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.metrics.map((metric, idx) => (
                                <motion.span 
                                  key={metric} 
                                  className={`px-2 py-0.5 text-xs rounded-lg bg-gradient-to-r ${exp.color} text-white font-medium border border-white/20`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.03 }}
                                >
                                  {metric}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className={`mt-6 p-4 rounded-xl bg-gradient-to-r from-ai-purple/10 via-ai-pink/10 to-ai-cyan/10 border border-ai-purple/20 relative overflow-hidden group/footer ${
            theme === 'light' ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-r from-ai-purple/20 to-ai-pink/20 opacity-0 group-hover/footer:opacity-100 transition-opacity ${
            theme === 'light' ? 'from-purple-100 to-pink-100' : ''
          }`} />
          
          <div className="relative z-10 flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.span>
            <p className={`text-xs text-center ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
            }`}>
              Currently focusing on{' '}
              <span className={`font-semibold px-2 py-0.5 rounded ${
                theme === 'light' 
                  ? 'text-purple-700 bg-purple-100' 
                  : 'text-ai-purple bg-ai-purple/10'
              }`}>
                AI Engineering
              </span>
              {' '}and{' '}
              <span className={`font-semibold px-2 py-0.5 rounded ${
                theme === 'light' 
                  ? 'text-pink-700 bg-pink-100' 
                  : 'text-ai-pink bg-ai-pink/10'
              }`}>
                HCI Research
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
