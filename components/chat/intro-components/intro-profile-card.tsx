"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AnimatedProfileCard } from '@/components/ui/animated-profile-card';

// Dynamically import the 3D model viewer to prevent SSR issues
const ModelViewerCard = dynamic(
  () => import('@/components/ui/model-viewer-card').then((mod) => mod.ModelViewerCard),
  { 
    ssr: false,
    loading: () => (
      <div className="model-viewer-card animate-pulse" style={{ background: 'var(--glass-bg)' }} />
    )
  }
);

export function IntroProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-start gap-4 py-4"
    >
      <AnimatedProfileCard />
      <ModelViewerCard />
    </motion.div>
  );
}
