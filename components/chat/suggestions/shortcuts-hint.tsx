"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconKeyboard, IconX } from '@tabler/icons-react';
import { useTheme } from '@/lib/theme-context';

export function ShortcutsHint() {
  const { theme } = useTheme();
  const [showHint, setShowHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the hint
    const isDismissed = localStorage.getItem('shortcutsHintDismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Show hint after 2 seconds
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowHint(false);
    setDismissed(true);
    localStorage.setItem('shortcutsHintDismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 left-6 z-30 max-w-xs"
        >
          <div className={`glass-card rounded-xl p-4 shadow-2xl border ${
            theme === 'light' 
              ? 'border-ai-blue/40 bg-white/90' 
              : 'border-ai-cyan/30'
          }`}>
            <div className="flex items-start gap-3">
              <IconKeyboard className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === 'light' ? 'text-ai-blue' : 'text-ai-cyan'
              }`} />
              <div className="flex-1">
                <h4 className={`text-sm font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Keyboard Shortcuts</h4>
                <div className={`space-y-1 text-xs ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <kbd className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      theme === 'light' 
                        ? 'bg-gray-100 border border-gray-300 text-gray-900' 
                        : 'bg-white/10 border border-white/20 text-gray-100'
                    }`}>⌘K</kbd>
                    <span>Open menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      theme === 'light' 
                        ? 'bg-gray-100 border border-gray-300 text-gray-900' 
                        : 'bg-white/10 border border-white/20 text-gray-100'
                    }`}>⌘R</kbd>
                    <span>Random question</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                  theme === 'light' 
                    ? 'hover:bg-gray-200 text-gray-600' 
                    : 'hover:bg-white/10 text-gray-400'
                }`}
                aria-label="Dismiss hint"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
