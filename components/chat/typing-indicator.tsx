"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const TypingIndicator = React.forwardRef<HTMLDivElement>(function TypingIndicator(_props, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-3 mb-6"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden glass-card">
          <Image
            src="/pfp.png"
            alt="Arjun"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>

      {/* Typing animation */}
      <div className="glass-card px-5 py-4 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-ai-cyan rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});
