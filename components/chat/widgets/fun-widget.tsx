"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconHeart,
  IconCamera,
  IconCube,
  IconX,
  IconArrowLeft,
} from '@tabler/icons-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTheme } from '@/lib/theme-context';

// Dynamically import the full components
const DomeGalleryServer = dynamic(() => import('@/components/ui/dome-gallery-server'), {
  ssr: false,
  loading: () => <div className="h-96 glass-card rounded-xl animate-pulse" />,
});

const PersonalCollection = dynamic(() => import('@/components/personal-collection'), {
  ssr: false,
  loading: () => <div className="h-96 glass-card rounded-xl animate-pulse" />,
});

export default function FunWidget() {
  const [showGallery, setShowGallery] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <IconHeart className={`w-5 h-5 ${theme === 'light' ? 'text-pink-500' : 'text-ai-pink'}`} />
          Fun Stuff
        </h3>

        <div className="space-y-4">
          {/* 3D Dome Gallery Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass p-4 rounded-xl cursor-pointer"
            onClick={() => setShowGallery(true)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
                <IconCamera className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>3D Photo Gallery</h4>
                <p className={`text-sm mb-3 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Explore my adventures in an immersive 3D dome gallery with 50+ photos
                </p>
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/experiences_photos/IMG-20250915-WA0004.jpg"
                    alt="Gallery preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">Click to explore →</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3D Model Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass p-4 rounded-xl cursor-pointer"
            onClick={() => setShowModel(true)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0">
                <IconCube className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>3D Model Collection</h4>
                <p className={`text-sm mb-3 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Interactive 3D models - Lego P1 and more
                </p>
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <IconCube className="w-12 h-12 text-ai-cyan animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">Click to view →</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fun Facts */}
          <div className="glass p-4 rounded-xl space-y-2">
            <h4 className={`font-semibold text-sm mb-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>About Me</h4>
            <div className={`space-y-2 text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <p>🏆 5+ hackathon wins including Hack the North 2024</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] backdrop-blur-xl flex items-center justify-center ${
            theme === 'light' ? 'bg-white/95' : 'bg-black/95'
          }`}
          onClick={() => setShowGallery(false)}
        >
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div
              className={`sticky top-0 z-[120] backdrop-blur-xl border-b ${
                theme === 'light'
                  ? 'bg-white/90 border-gray-200'
                  : 'bg-black/70 border-white/10'
              }`}
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowGallery(false)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                      : 'glass text-white border border-white/10 hover:bg-white/10'
                  }`}
                  aria-label="Back to chat"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Back to chat
                </button>
                <button
                  onClick={() => setShowGallery(false)}
                  className={`rounded-lg p-2 transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                      : 'glass text-white border border-white/10 hover:bg-white/10'
                  }`}
                  aria-label="Close gallery"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="min-h-screen py-4 pt-14 pb-40 sm:pb-48 px-4 relative">
              {/* Floating Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowGallery(false)}
                className={`absolute top-20 right-4 z-[130] rounded-full p-2 shadow-lg transition-all ${
                  theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50'
                    : 'bg-black/80 text-white border-2 border-white/20 hover:bg-black/90'
                }`}
                aria-label="Close gallery"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconX className="w-5 h-5" />
              </motion.button>
              <DomeGalleryServer />
            </div>
          </div>
        </motion.div>
      )}

      {/* Fullscreen 3D Model Modal */}
      {showModel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] backdrop-blur-xl flex items-center justify-center ${
            theme === 'light' ? 'bg-white/95' : 'bg-black/95'
          }`}
          onClick={() => setShowModel(false)}
        >
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div
              className={`sticky top-0 z-[120] backdrop-blur-xl border-b ${
                theme === 'light'
                  ? 'bg-white/90 border-gray-200'
                  : 'bg-black/70 border-white/10'
              }`}
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowModel(false)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                      : 'glass text-white border border-white/10 hover:bg-white/10'
                  }`}
                  aria-label="Back to chat"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Back to chat
                </button>
                <button
                  onClick={() => setShowModel(false)}
                  className={`rounded-lg p-2 transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                      : 'glass text-white border border-white/10 hover:bg-white/10'
                  }`}
                  aria-label="Close 3D model"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="min-h-screen flex items-center justify-center py-4 pt-14 pb-40 sm:pb-48 px-4">
              <div className="relative w-full max-w-4xl">
                {/* Floating Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowModel(false)}
                  className={`absolute -top-2 -right-2 z-[130] rounded-full p-2 shadow-lg transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50'
                      : 'bg-black/80 text-white border-2 border-white/20 hover:bg-black/90'
                  }`}
                  aria-label="Close 3D model"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconX className="w-5 h-5" />
                </motion.button>
                <PersonalCollection />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
