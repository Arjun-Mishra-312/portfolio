"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconCube } from "@tabler/icons-react";
import { useTheme } from "@/lib/theme-context";

export default function PersonalCollection() {
  const { theme } = useTheme();

  return (
    <section id="collection" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px", amount: 0.3 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconCube
              className={`w-7 h-7 ${
                theme === "light" ? "text-blue-500" : "text-ai-cyan"
              }`}
            />
            <h2
              className={`text-3xl sm:text-4xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Personal <span className="text-gradient">Collection</span>
            </h2>
          </div>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            3D Models & Interactive Experiences
          </p>
        </motion.div>

        {/* 3D Model Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className={`glass-card rounded-2xl p-4 sm:p-6 ${
              theme === "light" ? "bg-white/90 border-gray-200" : ""
            }`}
          >
            {/* 3D Model Viewer */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <iframe
                title="Interactive 3D Model - Lego McLaren P1"
                src="https://www.kiriengine.app/share/3dgsEmbed/2008260390479200256?userId=1657534&bg_theme=transparent&auto_spin=1"
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
                allowFullScreen
                allow="autoplay; fullscreen;"
              />
            </div>

            {/* Model Info */}
            <div className="mt-4 space-y-3">
              <div
                className={`p-4 rounded-xl ${
                  theme === "light"
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                    : "bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10 border border-ai-cyan/20"
                }`}
              >
                <h4
                  className={`font-semibold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Featured Model: Lego McLaren P1
                </h4>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  High-detail 3D model with interactive controls. Rotate, zoom,
                  and explore every detail of this stunning build.
                </p>
              </div>

              {/* Controls Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`glass p-3 rounded-lg text-center ${
                    theme === "light" ? "bg-white/50" : ""
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    🖱️ Drag
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Rotate Model
                  </div>
                </div>
                <div
                  className={`glass p-3 rounded-lg text-center ${
                    theme === "light" ? "bg-white/50" : ""
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    🔍 Scroll
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Zoom In/Out
                  </div>
                </div>
                <div
                  className={`glass p-3 rounded-lg text-center ${
                    theme === "light" ? "bg-white/50" : ""
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    ↻ Auto-Spin
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Always Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 text-center"
        >
          <p
            className={`text-sm ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            🎨 Powered by Kiri Engine, more 3D models coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}     