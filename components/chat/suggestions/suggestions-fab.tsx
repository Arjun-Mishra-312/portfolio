"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSparkles, IconX } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

interface SuggestionsFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export function SuggestionsFAB({ onClick, isOpen }: SuggestionsFABProps) {
  const { theme } = useTheme();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('suggestionsVisited');
    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  const handleClick = () => {
    if (isFirstVisit) {
      setIsFirstVisit(false);
      localStorage.setItem('suggestionsVisited', 'true');
    }
    onClick();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="fixed bottom-28 right-4 z-40 group"
      aria-label="Open suggestions menu"
    >
      <div className="relative">
        {/* Pill button */}
        <div
          className={`glass-card flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'border-ai-purple bg-ai-purple/20'
              : theme === 'light'
              ? 'border-blue-200 hover:border-blue-400'
              : 'border-white/15 hover:border-ai-cyan/50'
          }`}
          style={!isOpen ? { border: `1px solid var(--border-color)` } : undefined}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <IconX className="w-4.5 h-4.5 text-ai-purple flex-shrink-0" />
            ) : (
              <IconSparkles className={`w-4.5 h-4.5 flex-shrink-0 ${theme === 'light' ? 'text-ai-blue' : 'text-ai-cyan'}`} />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold text-ai-purple whitespace-nowrap overflow-hidden"
              >
                Close
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm font-semibold whitespace-nowrap overflow-hidden ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}
              >
                Ask me anything
              </motion.span>
            )}
          </AnimatePresence>

          {/* "New" dot for first-time visitors */}
          {isFirstVisit && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
            />
          )}
        </div>

        {/* Pulse ring — only when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-ai-cyan/20 pointer-events-none"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Glow */}
        <div
          className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 -z-10 ${
            isOpen
              ? 'bg-ai-purple/40 opacity-100'
              : 'bg-ai-cyan/30 opacity-0 group-hover:opacity-100'
          }`}
        />
      </div>
    </motion.button>
  );
}
