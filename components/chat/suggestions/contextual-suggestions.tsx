"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBulb } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';
import { getAllQuestions, Question } from './questions-data';

interface ContextualSuggestionsProps {
  userInput: string;
  onSuggestionClick: (question: Question) => void;
}

export function ContextualSuggestions({ userInput, onSuggestionClick }: ContextualSuggestionsProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<Question[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Debounce: show suggestions after user stops typing for 2 seconds
    const timer = setTimeout(() => {
      if (userInput.trim().length > 2) {
        const allQuestions = getAllQuestions();
        const input = userInput.toLowerCase();
        
        // Simple keyword matching
        const matches = allQuestions.filter(q => {
          const text = q.text.toLowerCase();
          return (
            text.includes(input) ||
            (input.includes('project') && q.widgetType === 'projects') ||
            (input.includes('skill') && q.widgetType === 'skills') ||
            (input.includes('experience') && q.widgetType === 'experience') ||
            (input.includes('contact') && q.widgetType === 'contact') ||
            (input.includes('fun') && q.widgetType === 'fun') ||
            (input.includes('about') && q.widgetType === 'me') ||
            (input.includes('who') && q.widgetType === 'me')
          );
        }).filter(q => !q.easterEgg).slice(0, 3);

        if (matches.length > 0) {
          setSuggestions(matches);
          setShowSuggestions(true);
        }
      } else {
        setShowSuggestions(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userInput]);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (showSuggestions) {
      const timer = setTimeout(() => {
        setShowSuggestions(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showSuggestions]);

  const handleSuggestionClick = (question: Question) => {
    setShowSuggestions(false);
    onSuggestionClick(question);
  };

  return (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 px-4 mb-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className={`glass-card rounded-2xl p-4 shadow-2xl border ${
              theme === 'light' ? 'border-blue-300 bg-white/90' : 'border-ai-cyan/30'
            }`}>
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <IconBulb className={`w-5 h-5 ${theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'}`} />
                </motion.div>
                <div className="flex-1">
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Looking for something like...</p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-3 py-2 rounded-lg glass transition-all duration-200 group ${
                          theme === 'light'
                            ? 'border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                            : 'hover:border-ai-cyan/50'
                        }`}
                        style={{ border: theme === 'light' ? undefined : `1px solid var(--border-color)` }}
                      >
                        <span className={`text-sm font-medium transition-colors ${
                          theme === 'light' ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {suggestion.text}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pulsing glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl blur-xl -z-10 ${
                  theme === 'light' ? 'bg-blue-200/30' : 'bg-ai-cyan/10'
                }`}
                animate={{ opacity: theme === 'light' ? [0.2, 0.4, 0.2] : [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
