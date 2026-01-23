"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconSparkles } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

interface SuggestionsFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export function SuggestionsFAB({ onClick, isOpen }: SuggestionsFABProps) {
  const { theme } = useTheme();
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Show "New" badge on first visit
    const hasVisited = localStorage.getItem('suggestionsVisited');
    if (!hasVisited) {
      setShowBadge(true);
    }
  }, []);

  const handleClick = () => {
    if (showBadge) {
      setShowBadge(false);
      localStorage.setItem('suggestionsVisited', 'true');
    }
    onClick();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-28 right-6 z-40 group"
      aria-label="Open suggestions menu"
    >
      <div className="relative">
        {/* Main button */}
        <div className={`glass-card p-4 rounded-2xl shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'border-ai-purple bg-ai-purple/20'
            : ''
        }`} style={!isOpen ? {
          border: `1px solid var(--border-color)`
        } : undefined}>
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <IconSparkles className={`w-6 h-6 transition-colors duration-300 ${
              isOpen ? 'text-ai-purple' : 'text-ai-cyan'
            }`} />
          </motion.div>
        </div>

        {/* Pulse animation */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-ai-cyan/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 -z-10 ${
          isOpen
            ? 'bg-ai-purple/40 opacity-100'
            : 'bg-ai-cyan/40 opacity-0 group-hover:opacity-100'
        }`} />

        {/* "New" badge */}
        {showBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
          >
            New
          </motion.div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="glass-card px-3 py-1.5 rounded-lg whitespace-nowrap text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          ✨ Ask me anything
        </motion.div>
      </div>
    </motion.button>
  );
}
