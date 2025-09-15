"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBrain, IconCode, IconRocket } from "@tabler/icons-react";

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const loadingTexts = [
    "Initializing AI Systems...",
    "Loading Neural Networks...", 
    "Preparing Portfolio...",
    "Almost Ready!"
  ];

  useEffect(() => {
    // Set window dimensions on client side
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Text rotation effect
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    // Total loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3200); // 3.2 seconds

    return () => {
      clearInterval(textInterval);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
          }}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated background particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-ai-cyan rounded-full opacity-30"
                animate={{
                  x: [0, Math.random() * dimensions.width],
                  y: [0, Math.random() * dimensions.height],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
              />
            ))}
            
            {/* Large background gradient circles */}
            <motion.div
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 0.8, 1.2],
                rotate: [360, 180, 0] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 
              }}
              className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-ai-cyan/20 to-ai-pink/20 rounded-full blur-3xl"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100 
              }}
              className="mb-8"
            >
              <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 w-32 h-32 border-2 border-ai-blue/30 rounded-full"
                />
                
                {/* Middle ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-2 w-28 h-28 border border-ai-purple/20 rounded-full"
                />
                
                {/* Center icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="flex items-center justify-center w-32 h-32 glass-card rounded-full"
                >
                  <IconBrain className="w-12 h-12 text-gradient" />
                </motion.div>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white mb-2"
            >
              Arjun <span className="text-gradient">Mishra</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-300 mb-8"
            >
              AI Research Assistant & Full-Stack Developer
            </motion.p>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-ai-cyan font-mono text-lg"
                >
                  {loadingTexts[currentText]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-64 mx-auto"
            >
              <div className="glass-card rounded-full p-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 2.8,
                    ease: "easeInOut",
                    delay: 0.3 
                  }}
                  className="h-2 ai-gradient rounded-full"
                />
              </div>
              
              {/* Progress percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-3"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-gray-400 font-mono"
                >
                  Loading Portfolio...
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Tech Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="flex justify-center space-x-6 mt-8"
            >
              {[IconCode, IconRocket, IconBrain].map((Icon, index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut" 
                  }}
                  className="glass p-3 rounded-full"
                >
                  <Icon className="w-6 h-6 text-gray-400" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
