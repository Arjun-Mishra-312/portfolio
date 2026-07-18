"use client";
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface WidgetWrapperProps {
  children: ReactNode;
  className?: string;
}

export function WidgetWrapper({ children, className = '' }: WidgetWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-2xl p-6 space-y-4 transition-colors duration-300 ${className}`}
      style={{
        border: `1px solid var(--border-color)`,
        background: 'var(--glass-bg)',
        color: 'var(--text-primary)'
      }}
    >
      {children}
    </motion.div>
  );
}
