"use client";
import { motion, MotionProps } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PerformanceAwareMotionProps extends MotionProps {
  children: ReactNode;
  reducedMotion?: boolean;
  fallback?: ReactNode;
}

export function PerformanceAwareMotion({
  children,
  reducedMotion = false,
  fallback,
  ...motionProps
}: PerformanceAwareMotionProps) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check for user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setShouldAnimate(!mediaQuery.matches && !reducedMotion);
    };

    handleChange(); // Set initial state
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [reducedMotion]);

  useEffect(() => {
    // Disable animations on low-end devices or slow connections
    const connection = (navigator as any).connection;
    if (connection?.effectiveType === '2g' || connection?.saveData) {
      setShouldAnimate(false);
    }

    // Disable animations if device has low memory
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
      setShouldAnimate(false);
    }
  }, []);

  if (!shouldAnimate) {
    return fallback ? <>{fallback}</> : <div>{children}</div>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}

// Optimized motion presets for common animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

