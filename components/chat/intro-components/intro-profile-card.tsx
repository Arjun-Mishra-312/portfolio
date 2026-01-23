"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedProfileCard } from '@/components/ui/animated-profile-card';

export function IntroProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-start py-4"
    >
      <AnimatedProfileCard />
    </motion.div>
  );
}
