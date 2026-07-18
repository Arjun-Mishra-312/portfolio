"use client";
import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Static wrapper - no scroll animations for better performance
export const SectionTransition = ({ 
  children, 
  delay = 0,
  direction = "up"
}: { 
  children: ReactNode; 
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) => {
  return (
    <div>
      {children}
    </div>
  );
};

// Staggered children animation
export const StaggeredContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = ""
}: { 
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ 
  children, 
  className = ""
}: { 
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Static reveal - no scroll-based animations
export const ScrollReveal = ({ 
  children,
  threshold = 0.1,
  triggerOnce = true
}: {
  children: ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
}) => {
  return (
    <div className="opacity-100">
      {children}
    </div>
  );
};

// Card hover animations
export const HoverCard = ({ 
  children,
  className = "",
  scale = 1.02,
  duration = 0.2
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Button with smooth animations
export const AnimatedButton = ({ 
  children,
  onClick,
  className = "",
  variant = "primary"
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all-smooth";
  const variants = {
    primary: "bg-gradient-to-r from-ai-blue to-ai-purple text-white",
    secondary: "glass-card text-white neon-border"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === "primary" 
          ? "0 10px 30px rgba(59, 130, 246, 0.3)"
          : "0 10px 30px rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Loading transitions
export const LoadingTransition = ({ 
  isLoading,
  skeleton,
  children
}: {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Section entrance animation
export const SectionEntrance = ({ 
  children,
  delay = 0
}: {
  children: ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.23, 1, 0.32, 1], // Smooth easing
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};


