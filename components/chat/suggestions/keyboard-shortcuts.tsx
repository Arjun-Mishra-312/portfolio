"use client";
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onOpenDrawer: () => void;
  onRandomQuestion: () => void;
  onNavigatePills: (direction: 'left' | 'right') => void;
}

export function useKeyboardShortcuts({
  onOpenDrawer,
  onRandomQuestion,
  onNavigatePills,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Open drawer
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenDrawer();
      }

      // Cmd/Ctrl + R: Random question
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        onRandomQuestion();
      }

      // Arrow keys to navigate pills (when not focused on input)
      if (document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onNavigatePills('left');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onNavigatePills('right');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenDrawer, onRandomQuestion, onNavigatePills]);
}
