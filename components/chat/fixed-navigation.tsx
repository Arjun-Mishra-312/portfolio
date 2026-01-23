"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconUser,
  IconCode,
  IconBrain,
  IconHeart,
  IconMail,
} from '@tabler/icons-react';
import { WidgetType } from '@/lib/chat-context';
import { useTheme } from '@/lib/theme-context';

interface NavButton {
  id: WidgetType;
  label: string;
  icon: React.ReactNode;
}

const navButtons: NavButton[] = [
  { id: 'me', label: 'Me', icon: <IconUser className="w-5 h-5" /> },
  { id: 'projects', label: 'Projects', icon: <IconCode className="w-5 h-5" /> },
  { id: 'skills', label: 'Skills', icon: <IconBrain className="w-5 h-5" /> },
  { id: 'fun', label: 'Fun', icon: <IconHeart className="w-5 h-5" /> },
  { id: 'contact', label: 'Contact', icon: <IconMail className="w-5 h-5" /> },
];

interface FixedNavigationProps {
  onNavigate: (widgetType: WidgetType) => void;
  currentSection?: WidgetType;
}

export function FixedNavigation({ onNavigate, currentSection }: FixedNavigationProps) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
    >
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="glass-card rounded-2xl p-3 shadow-2xl transition-colors duration-300" style={{ 
          border: `1px solid var(--border-color)`,
          background: 'var(--glass-bg)'
        }}>
          <div className="flex justify-around items-center gap-2">
            {navButtons.map((button) => {
              const isActive = currentSection === button.id;
              return (
                <motion.button
                  key={button.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(button.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white'
                      : ''
                  }`}
                  style={!isActive ? { 
                    color: 'var(--text-secondary)',
                    background: 'transparent'
                  } : undefined}
                >
                  {button.icon}
                  <span className="text-xs font-medium">{button.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
