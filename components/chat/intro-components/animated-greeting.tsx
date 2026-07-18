"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

const greetings = [
  "Hey! 👋",
  "Hello! 👋",
  "Hi there! 👋",
  "Welcome! 👋",
];

export function AnimatedGreeting() {
  const { theme } = useTheme();
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    // Cycle through greetings quickly, then settle
    const greetingTimer = setTimeout(() => {
      if (currentGreeting < greetings.length - 1) {
        setCurrentGreeting(prev => prev + 1);
      } else {
        setShowName(true);
      }
    }, currentGreeting === 0 ? 300 : 150);

    return () => clearTimeout(greetingTimer);
  }, [currentGreeting]);

  return (
    <div className="inline-flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentGreeting}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`text-lg font-medium ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}
        >
          {greetings[currentGreeting]}
        </motion.span>
      </AnimatePresence>
      
      <AnimatePresence>
        {showName && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`text-lg font-medium ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}
          >
            I&apos;m{' '}
            <span className="text-gradient font-bold">
              Arjun
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
