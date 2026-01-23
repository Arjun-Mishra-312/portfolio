"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label className="relative inline-block w-[60px] h-[34px] cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="opacity-0 w-0 h-0"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      />
      
      {/* Slider Background */}
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 rounded-[34px] overflow-hidden"
        animate={{
          backgroundColor: isDark ? '#000000' : '#2196f3'
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Clouds (Light Mode) */}
        <svg className={`absolute ${isDark ? 'opacity-0' : 'opacity-100'} transition-opacity duration-400`}>
          <motion.ellipse
            id="cloud-1"
            cx="45"
            cy="22"
            rx="20"
            ry="8"
            fill="#eee"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            id="cloud-2"
            cx="54"
            cy="18"
            rx="10"
            ry="5"
            fill="#eee"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            id="cloud-3"
            cx="33"
            cy="31"
            rx="15"
            ry="6"
            fill="#eee"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            id="cloud-4"
            cx="51"
            cy="25"
            rx="20"
            ry="8"
            fill="#ccc"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.ellipse
            id="cloud-5"
            cx="58"
            cy="21"
            rx="10"
            ry="5"
            fill="#ccc"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.ellipse
            id="cloud-6"
            cx="37"
            cy="33"
            rx="15"
            ry="6"
            fill="#ccc"
            animate={{ x: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>

        {/* Stars (Dark Mode) */}
        <motion.div
          className="absolute"
          animate={{
            y: isDark ? 0 : -32,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute top-[2px] left-[3px]"
            animate={{ scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
          <motion.svg
            width="6"
            height="6"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute top-[16px] left-[3px]"
            animate={{ scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute top-[20px] left-[10px]"
            animate={{ scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="white"
            className="absolute top-0 left-[18px]"
            animate={{ scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
        </motion.div>

        {/* Sun/Moon Circle */}
        <motion.div
          className="absolute w-[26px] h-[26px] left-1 bottom-1 rounded-full"
          animate={{
            x: isDark ? 26 : 0,
            backgroundColor: isDark ? '#ffffff' : '#fbbf24',
            rotate: isDark ? 360 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Light Rays (Light Mode) */}
          <svg
            className={`absolute -left-2 -top-2 w-[43px] h-[43px] ${isDark ? 'opacity-0' : 'opacity-10'} transition-opacity`}
            viewBox="0 0 24 24"
            fill="white"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {/* Moon Dots (Dark Mode) */}
          <motion.div
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute w-[6px] h-[6px] rounded-full bg-gray-500 left-[10px] top-[3px]" />
            <div className="absolute w-[10px] h-[10px] rounded-full bg-gray-500 left-[2px] top-[10px]" />
            <div className="absolute w-[3px] h-[3px] rounded-full bg-gray-500 left-[16px] top-[18px]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </label>
  );
}
