"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconSparkles,
  IconLock,
  IconChevronDown,
  IconDice5,
} from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';
import { questionSections, Question, getRandomQuestion, getRandomEasterEgg } from './questions-data';

interface SuggestionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionClick: (question: Question) => void;
}

export function SuggestionsDrawer({ isOpen, onClose, onQuestionClick }: SuggestionsDrawerProps) {
  const { theme } = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>('me');
  const [clickedQuestions, setClickedQuestions] = useState<Set<string>>(new Set());
  const [hoveredEasterEgg, setHoveredEasterEgg] = useState<string | null>(null);

  // Load clicked questions from localStorage
  useEffect(() => {
    const clicked = localStorage.getItem('clickedQuestions');
    if (clicked) {
      setClickedQuestions(new Set(JSON.parse(clicked)));
    }
  }, []);

  const handleQuestionClick = (question: Question) => {
    // Mark as clicked
    const newClicked = new Set(clickedQuestions);
    newClicked.add(question.id);
    setClickedQuestions(newClicked);
    localStorage.setItem('clickedQuestions', JSON.stringify(Array.from(newClicked)));

    // Close drawer and trigger action
    onClose();
    onQuestionClick(question);
  };

  const handleSurpriseMe = () => {
    const randomQ = getRandomQuestion();
    handleQuestionClick(randomQ);
  };

  const handleSecretReveal = () => {
    const secretQ = getRandomEasterEgg();
    handleQuestionClick(secretQ);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-xl z-50"
            style={{ background: theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] backdrop-blur-2xl z-50 overflow-hidden flex flex-col transition-colors duration-300"
            style={{ 
              background: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
              borderLeft: `1px solid var(--border-color)`
            }}
          >
            {/* Header */}
            <div className="p-6 transition-colors duration-300" style={{ borderBottom: `1px solid var(--border-color)` }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <IconSparkles className={`w-6 h-6 ${theme === 'light' ? 'text-ai-blue' : 'text-ai-cyan'}`} />
                  Ask Me Anything
                </h2>
                <button
                  onClick={onClose}
                  className="glass-card p-2 rounded-xl transition-colors"
                  aria-label="Close menu"
                >
                  <IconX className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                </button>
              </div>

              {/* Surprise Me Button */}
              <button
                onClick={handleSurpriseMe}
                className="w-full glass-card px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-ai-blue/20 hover:to-ai-purple/20 transition-all duration-300 group"
                style={{ border: `1px solid var(--border-color)` }}
              >
                <div className="flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconDice5 className={`w-5 h-5 ${theme === 'light' ? 'text-ai-blue' : 'text-ai-cyan'}`} />
                  </motion.div>
                  <span>🎲 Surprise me!</span>
                </div>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {questionSections.map((section, sectionIndex) => {
                const isExpanded = expandedSection === section.id;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full glass-card px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 border group ${
                        theme === 'light'
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{section.emoji}</span>
                        <span className={`font-semibold ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>{section.title}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconChevronDown className={`w-5 h-5 transition-colors ${
                          theme === 'light'
                            ? 'text-gray-500 group-hover:text-gray-900'
                            : 'text-gray-400 group-hover:text-white'
                        }`} />
                      </motion.div>
                    </button>

                    {/* Questions List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 space-y-2 pl-2">
                            {section.questions.map((question, qIndex) => {
                              const isClicked = clickedQuestions.has(question.id);
                              const isHovered = hoveredEasterEgg === question.id;
                              
                              return (
                                <motion.button
                                  key={question.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: qIndex * 0.05 }}
                                  onClick={() => handleQuestionClick(question)}
                                  onMouseEnter={() => question.easterEgg && setHoveredEasterEgg(question.id)}
                                  onMouseLeave={() => setHoveredEasterEgg(null)}
                                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                                    question.featured
                                      ? theme === 'light'
                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-300 hover:border-blue-400'
                                        : 'bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border border-ai-cyan/30 hover:border-ai-cyan/60'
                                      : question.easterEgg
                                      ? theme === 'light'
                                        ? 'bg-yellow-50 border border-yellow-400 hover:border-yellow-500'
                                        : 'bg-black/40 border border-yellow-500/30 hover:border-yellow-500/60'
                                      : theme === 'light'
                                      ? 'glass border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                      : 'glass border border-white/10 hover:border-white/20 hover:bg-white/5'
                                  } ${isClicked ? 'opacity-60' : ''}`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1">
                                      {question.featured && (
                                        <IconSparkles className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                          theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'
                                        }`} />
                                      )}
                                      {question.easterEgg && (
                                        <motion.div
                                          animate={{ rotate: isHovered ? 15 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <IconLock className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                            theme === 'light' ? 'text-yellow-600' : 'text-yellow-500'
                                          }`} />
                                        </motion.div>
                                      )}
                                      <span className={`text-sm font-medium transition-all duration-300 ${
                                        question.featured
                                          ? theme === 'light'
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
                                            : 'text-transparent bg-clip-text bg-gradient-to-r from-ai-blue to-ai-purple'
                                          : question.easterEgg && !isHovered
                                          ? theme === 'light'
                                            ? 'blur-sm group-hover:blur-none text-gray-700'
                                            : 'blur-sm group-hover:blur-none'
                                          : theme === 'light'
                                          ? 'text-gray-700 group-hover:text-gray-900'
                                          : 'text-gray-300 group-hover:text-white'
                                      }`}>
                                        {question.text}
                                      </span>
                                    </div>
                                    {isClicked && (
                                      <span className={`text-xs flex-shrink-0 ${
                                        theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'
                                      }`}>✓</span>
                                    )}
                                  </div>

                                  {/* Glow effect */}
                                  {question.featured && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ai-blue/10 to-ai-purple/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Secret Easter Egg Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleSecretReveal}
                className={`w-full mt-6 glass-card px-4 py-3 rounded-xl border transition-all duration-300 group ${
                  theme === 'light'
                    ? 'border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50'
                    : 'border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10'
                }`}
              >
                <div className={`flex items-center justify-center gap-2 font-medium ${
                  theme === 'light' ? 'text-yellow-700' : 'text-yellow-500'
                }`}>
                  <IconLock className="w-5 h-5" />
                  <span>🔐 Tell me a secret</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
