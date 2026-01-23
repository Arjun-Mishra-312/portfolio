"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { pillSets, Pill } from './questions-data';

interface FloatingPillsProps {
  onPillClick: (pill: Pill) => void;
}

export function FloatingPills({ onPillClick }: FloatingPillsProps) {
  const { theme } = useTheme();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [clickedPills, setClickedPills] = useState<Set<string>>(new Set());

  // Auto-rotate pills every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % pillSets.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Load clicked pills from localStorage
  useEffect(() => {
    const clicked = localStorage.getItem('clickedPills');
    if (clicked) {
      setClickedPills(new Set(JSON.parse(clicked)));
    }
  }, []);

  const handlePillClick = (pill: Pill) => {
    // Mark as clicked
    const newClicked = new Set(clickedPills);
    newClicked.add(pill.id);
    setClickedPills(newClicked);
    localStorage.setItem('clickedPills', JSON.stringify([...newClicked]));

    // Trigger action
    onPillClick(pill);
  };

  const currentPills = pillSets[currentSetIndex];

  return (
    <div className="relative z-10 px-4 mb-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <AnimatePresence mode="wait">
            {currentPills.map((pill, index) => (
              <motion.button
                key={`${currentSetIndex}-${pill.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: [0, -4, 0],
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePillClick(pill)}
                className="relative flex-shrink-0 group"
              >
                <div className={`glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  clickedPills.has(pill.id)
                    ? theme === 'light'
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-ai-cyan/50 bg-ai-cyan/10'
                    : ''
                }`} style={{
                  border: clickedPills.has(pill.id) ? undefined : `1px solid var(--border-color)`,
                  color: 'var(--text-primary)'
                }}>
                  <span className="text-lg">{pill.emoji}</span>
                  <span>{pill.text}</span>
                  {clickedPills.has(pill.id) && (
                    <span className={`text-xs ${theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'}`}>✓</span>
                  )}
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {pillSets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSetIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSetIndex
                  ? theme === 'light'
                    ? 'bg-blue-500 w-6'
                    : 'bg-ai-cyan w-6'
                  : theme === 'light'
                  ? 'bg-gray-400 hover:bg-gray-600'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to pill set ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
