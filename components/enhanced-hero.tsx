"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FlipWords } from "./ui/flip-words";
import { 
  IconBrain, 
  IconCode, 
  IconSchool, 
  IconTrophy,
  IconDownload,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub
} from "@tabler/icons-react";

export function EnhancedHero() {

  const aiSpecialties = [
    "GenAI\u00A0Specialist",
    "Team\u00A0Player", 
    "Full-Stack\u00A0Developer",
    "LLM\u00A0Engineer",
    "Passionate\u00A0Individual",
  ];

  const stats = [
    {
      icon: <IconBrain className="w-6 h-6" />,
      value: "3+",
      label: "AI Projects"
    },
    {
      icon: <IconCode className="w-6 h-6" />,
      value: "6+", 
      label: "Full-Stack Apps"
    },
    {
      icon: <IconSchool className="w-6 h-6" />,
      value: "UBC",
      label: "Computer Science"
    },
    {
      icon: <IconTrophy className="w-6 h-6" />,
      value: "5+",
      label: "Hackathon Wins"
    }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-2 sm:left-5 lg:left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 ai-gradient rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-5 lg:right-10 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-ai-purple to-ai-pink rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left order-last lg:order-first"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-2"
            >
              <p className="text-ai-cyan font-mono text-base sm:text-lg">Hi there! I&apos;m</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Arjun <span className="text-gradient">Mishra</span>
              </h1>
            </motion.div>

            {/* Dynamic Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-300"
            >
              <FlipWords words={aiSpecialties} />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
               <p>
                 <span className="text-ai-cyan font-semibold">HCI/AI Research Assistant</span> at 
                 <span className="text-ai-blue font-semibold"> UBC SOCIUS Lab</span> • 
                 Building production AI systems & full-stack apps
               </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="glass-card p-3 sm:p-4 rounded-xl text-center">
                  <div className="flex justify-center mb-2 text-ai-cyan">
                    {stat.icon}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
            >
              <a 
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-ai-blue to-ai-purple text-white font-medium transition-all-smooth hover:scale-105 hover:shadow-lg hover:shadow-ai-blue/25 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <IconDownload className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
              
              <a
                href="mailto:arjunmishra31204@gmail.com"
                className="group relative inline-flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-full glass-card text-white font-medium transition-all-smooth hover:scale-105 neon-border text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <IconMail className="w-5 h-5" />
                <span>Get in Touch</span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex space-x-3 sm:space-x-4 justify-center lg:justify-start"
            >
              <a
                href="https://linkedin.com/in/-arjun-mishra/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full text-gray-400 hover:text-ai-blue transition-all-smooth hover:scale-110"
              >
                <IconBrandLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/Arjun-Mishra-312"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full text-gray-400 hover:text-white transition-all-smooth hover:scale-110"
              >
                <IconBrandGithub className="w-6 h-6" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile & Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative mt-6 lg:mt-0 order-first lg:order-last">
              {/* Profile Image Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto lg:mx-0">
                {/* Animated background rings */}
                <div className="absolute inset-0 rounded-full border border-ai-blue/30 animate-pulse-glow" />
                <div className="absolute inset-4 rounded-full border border-ai-purple/20" />
                
                {/* Main profile image */}
                <div className="relative w-full h-full glass-card rounded-full p-6 overflow-hidden">
                  <Image
                    src="/pfp.png"
                    alt="Arjun Mishra"
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 glass-card p-2 sm:p-3 rounded-full"
                >
                  <IconBrain className="w-4 h-4 sm:w-6 sm:h-6 text-ai-cyan" />
                </motion.div>
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 glass-card p-2 sm:p-3 rounded-full"
                >
                  <IconCode className="w-4 h-4 sm:w-6 sm:h-6 text-ai-purple" />
                </motion.div>
              </div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 left-1/2 transform -translate-x-1/2 glass-card p-2 sm:p-3 lg:p-4 rounded-xl text-center min-w-max"
              >
                <div className="flex items-center space-x-2">
                  <IconTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-medium text-white">Hack the North 2024 Winner</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
