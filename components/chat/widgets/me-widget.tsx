"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-context';
import {
  IconBrain,
  IconCode,
  IconSchool,
  IconTrophy,
  IconDownload,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMapPin,
} from '@tabler/icons-react';

const stats = [
  {
    icon: <IconBrain className="w-5 h-5" />,
    value: "3+",
    label: "AI Projects"
  },
  {
    icon: <IconCode className="w-5 h-5" />,
    value: "6+", 
    label: "Full-Stack Apps"
  },
  {
    icon: <IconSchool className="w-5 h-5" />,
    value: "UBC",
    label: "Computer Science"
  },
  {
    icon: <IconTrophy className="w-5 h-5" />,
    value: "5+",
    label: "Hackathon Wins"
  }
];

export default function MeWidget() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative w-24 h-24 rounded-full overflow-hidden glass-card flex-shrink-0">
          <Image
            src="/pfp.png"
            alt="Arjun Mishra"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className={`text-2xl font-bold mb-1 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Arjun Mishra
          </h3>
          <p className={`font-medium mb-2 ${
            theme === 'light' ? 'text-blue-600' : 'text-ai-cyan'
          }`}>
            AI Research Assistant @ UBC SOCIUS Lab
          </p>
          <div className={`flex items-center justify-center sm:justify-start gap-2 text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <IconMapPin className="w-4 h-4" />
            <span>Vancouver, BC, Canada</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-3">
        <p className={`leading-relaxed ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          I&apos;m passionate about building intelligent systems that solve real-world problems. Currently working on AI accessibility tools and LLM-powered applications at UBC.
        </p>
        <p className={`leading-relaxed ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          When I&apos;m not coding, you&apos;ll find me competing in hackathons, exploring new AI technologies, or contributing to open-source projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="glass p-3 rounded-xl text-center">
            <div className={`flex justify-center mb-2 ${
              theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'
            }`}>
              {stat.icon}
            </div>
            <div className={`text-lg font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>{stat.value}</div>
            <div className={`text-xs ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a 
          href="/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 group relative inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white font-medium transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-ai-blue/25"
        >
          <IconDownload className="w-4 h-4" />
          <span className="text-sm">Resume</span>
        </a>
        
        <a
          href="mailto:arjunmishra31204@gmail.com"
          className={`flex-1 group relative inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl glass-card font-medium transition-all hover:scale-[1.02] border ${
            theme === 'light'
              ? 'text-gray-900 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              : 'text-white border-white/10 hover:border-ai-cyan/50'
          }`}
        >
          <IconMail className="w-4 h-4" />
          <span className="text-sm">Email</span>
        </a>
      </div>

      {/* Social Links with Tooltips */}
      <div className="flex justify-center gap-6 pt-2">
        {/* LinkedIn */}
        <div className="tooltip-container-compact">
          <div className="tooltip-compact">
            <div className="tooltip-profile-compact">
              <div className="tooltip-user-compact">
                <div className="tooltip-img-compact linkedin" style={{ borderColor: 'var(--ai-blue)', color: 'var(--ai-blue)' }}>
                  A
                </div>
                <div className="tooltip-details-compact">
                  <div className="tooltip-name-compact" style={{ color: 'var(--ai-blue)' }}>
                    LinkedIn
                  </div>
                  <div className="tooltip-about-compact">
                    Connect with me
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            href="https://linkedin.com/in/-arjun-mishra/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link-compact linkedin"
          >
            <div className="icon-layer-compact">
              <span></span>
              <span></span>
              <span></span>
              <span className="icon-content">
                <IconBrandLinkedin className="w-5 h-5" />
              </span>
            </div>
          </a>
        </div>

        {/* GitHub */}
        <div className="tooltip-container-compact">
          <div className="tooltip-compact">
            <div className="tooltip-profile-compact">
              <div className="tooltip-user-compact">
                <div className="tooltip-img-compact github" style={{ borderColor: '#E0E0E0', color: '#E0E0E0' }}>
                  A
                </div>
                <div className="tooltip-details-compact">
                  <div className="tooltip-name-compact" style={{ color: '#E0E0E0' }}>
                    GitHub
                  </div>
                  <div className="tooltip-about-compact">
                    @Arjun-Mishra-312
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            href="https://github.com/Arjun-Mishra-312"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link-compact github"
          >
            <div className="icon-layer-compact">
              <span></span>
              <span></span>
              <span></span>
              <span className="icon-content">
                <IconBrandGithub className="w-5 h-5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
