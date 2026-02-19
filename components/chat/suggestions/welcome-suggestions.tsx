"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';
import { welcomeCarouselSets, WelcomeCarouselItem } from './questions-data';
import { Question } from './questions-data';

interface WelcomeSuggestionsProps {
  onQuestionClick: (question: Question) => void;
  onSpecialAction: (action: 'random' | 'tour' | 'everything' | 'secret') => void;
  onViewAll: () => void;
  visible: boolean;
}

export function WelcomeSuggestions({
  onQuestionClick,
  onSpecialAction,
  onViewAll,
  visible,
}: WelcomeSuggestionsProps) {
  const { theme } = useTheme();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % welcomeCarouselSets.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (item: WelcomeCarouselItem) => {
    setClickedIds((prev) => new Set(prev).add(item.id));
    if (item.action) {
      onSpecialAction(item.action);
    } else {
      onQuestionClick({ id: item.id, text: item.text, widgetType: item.widgetType });
    }
  };

  const currentItems = welcomeCarouselSets[currentSetIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 px-4 mb-3"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-2">
                <IconSparkles className={`w-4 h-4 ${theme === 'light' ? 'text-ai-blue' : 'text-ai-cyan'}`} />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Try asking me...
                </span>
              </div>
              <button
                onClick={onViewAll}
                className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group ${
                  theme === 'light'
                    ? 'text-gray-400 hover:text-ai-blue'
                    : 'text-gray-500 hover:text-ai-cyan'
                }`}
              >
                All questions
                <IconArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            {/* Carousel pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <AnimatePresence mode="sync">
                {currentItems.map((item, index) => {
                  const isClicked = clickedIds.has(item.id);
                  return (
                    <motion.button
                      key={`${currentSetIndex}-${item.id}`}
                      initial={{ opacity: 0, y: 12, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClick(item)}
                      className="relative flex-shrink-0 group"
                    >
                      <div
                        className={`glass-card px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                          isClicked
                            ? theme === 'light'
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-ai-cyan/50 bg-ai-cyan/10'
                            : ''
                        }`}
                        style={{
                          border: isClicked ? undefined : `1px solid var(--border-color)`,
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span>{item.text}</span>
                        {isClicked && (
                          <span className={`text-xs ${theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'}`}>✓</span>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mt-2">
              {welcomeCarouselSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSetIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSetIndex
                      ? theme === 'light'
                        ? 'bg-blue-500 w-6 h-1.5'
                        : 'bg-ai-cyan w-6 h-1.5'
                      : theme === 'light'
                      ? 'bg-gray-400 hover:bg-gray-600 w-1.5 h-1.5'
                      : 'bg-white/30 hover:bg-white/50 w-1.5 h-1.5'
                  }`}
                  aria-label={`Go to question set ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
