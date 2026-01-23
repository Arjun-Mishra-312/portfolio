"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import {
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMapPin,
  IconCalendar,
  IconDownload,
  IconSend,
  IconCheck,
} from '@tabler/icons-react';

export default function ContactWidget() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-5"
    >
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        <IconMail className={`w-5 h-5 ${theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'}`} />
        Let's Connect
      </h3>

      {/* Contact Info Cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="glass p-4 rounded-xl space-y-1">
          <div className={`flex items-center gap-2 mb-2 ${
            theme === 'light' ? 'text-blue-500' : 'text-ai-cyan'
          }`}>
            <IconMail className="w-4 h-4" />
            <h4 className="font-semibold text-sm">Email</h4>
          </div>
          <a
            href="mailto:arjunmishra31204@gmail.com"
            className={`text-sm transition-colors break-all font-medium ${
              theme === 'light'
                ? 'text-gray-700 hover:text-gray-900'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            arjunmishra31204@gmail.com
          </a>
        </div>

        <div className="glass p-4 rounded-xl space-y-1">
          <div className={`flex items-center gap-2 mb-2 ${
            theme === 'light' ? 'text-purple-500' : 'text-ai-purple'
          }`}>
            <IconMapPin className="w-4 h-4" />
            <h4 className="font-semibold text-sm">Location</h4>
          </div>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Vancouver, BC, Canada
          </p>
          <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
            Remote-friendly
          </p>
        </div>

        <div className="glass p-4 rounded-xl space-y-1">
          <div className={`flex items-center gap-2 mb-2 ${
            theme === 'light' ? 'text-green-600' : 'text-green-400'
          }`}>
            <IconCalendar className="w-4 h-4" />
            <h4 className="font-semibold text-sm">Availability</h4>
          </div>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Currently available
          </p>
          <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
            For projects & opportunities
          </p>
        </div>

        <div className="glass p-4 rounded-xl">
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-full py-2 px-4 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white text-sm font-medium hover:scale-[1.02] transition-all"
          >
            <IconDownload className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      </div>

      {/* Quick Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Name"
            required
            className={`w-full px-4 py-2.5 rounded-xl glass border text-sm transition-all ${
              theme === 'light'
                ? 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                : 'border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50'
            }`}
          />
        </div>
        <div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Your Email"
            required
            className={`w-full px-4 py-2.5 rounded-xl glass border text-sm transition-all ${
              theme === 'light'
                ? 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                : 'border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50'
            }`}
          />
        </div>
        <div>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your Message"
            required
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl glass border text-sm transition-all resize-none ${
              theme === 'light'
                ? 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                : 'border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white text-sm font-medium hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : isSubmitted ? (
            <>
              <IconCheck className="w-4 h-4" />
              Message Sent!
            </>
          ) : (
            <>
              <IconSend className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>

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

        {/* Email */}
        <div className="tooltip-container-compact">
          <div className="tooltip-compact">
            <div className="tooltip-profile-compact">
              <div className="tooltip-user-compact">
                <div className="tooltip-img-compact email" style={{ borderColor: 'var(--ai-cyan)', color: 'var(--ai-cyan)' }}>
                  A
                </div>
                <div className="tooltip-details-compact">
                  <div className="tooltip-name-compact" style={{ color: 'var(--ai-cyan)' }}>
                    Email
                  </div>
                  <div className="tooltip-about-compact">
                    Get in touch
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            href="mailto:arjunmishra31204@gmail.com"
            className="social-icon-link-compact email"
          >
            <div className="icon-layer-compact">
              <span></span>
              <span></span>
              <span></span>
              <span className="icon-content">
                <IconMail className="w-5 h-5" />
              </span>
            </div>
          </a>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-xl bg-gradient-to-r border ${
        theme === 'light'
          ? 'from-blue-50 to-purple-50 border-blue-200'
          : 'from-ai-cyan/10 to-ai-blue/10 border-ai-cyan/20'
      }`}>
        <p className={`text-xs text-center ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          💼 Open to <span className={`font-semibold ${
            theme === 'light' ? 'text-blue-600' : 'text-ai-cyan'
          }`}>AI/ML opportunities</span>, <span className={`font-semibold ${
            theme === 'light' ? 'text-blue-600' : 'text-ai-blue'
          }`}>full-stack projects</span>, and <span className={`font-semibold ${
            theme === 'light' ? 'text-purple-600' : 'text-ai-purple'
          }`}>research collaborations</span>
        </p>
      </div>
    </motion.div>
  );
}
