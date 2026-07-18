"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconMail, 
  IconBrandLinkedin, 
  IconBrandGithub, 
  IconDownload,
  IconSend,
  IconMapPin,
  IconPhone,
  IconCalendar,
  IconCheck,
  IconX
} from "@tabler/icons-react";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/-arjun-mishra/",
    icon: IconBrandLinkedin,
    color: "from-blue-500 to-blue-600",
    description: "Professional networking"
  },
  {
    name: "GitHub",
    href: "https://github.com/Arjun-Mishra-312",
    icon: IconBrandGithub,
    color: "from-gray-600 to-gray-700",
    description: "Code repositories"
  },
  {
    name: "Email",
    href: "mailto:arjunmishra31204@gmail.com",
    icon: IconMail,
    color: "from-green-500 to-green-600",
    description: "Direct contact"
  }
];

function EnhancedContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (you'll want to implement actual form handling)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute top-20 left-2 sm:left-5 lg:left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-ai-purple/20 to-ai-cyan/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <IconMail className="w-8 h-8 text-ai-cyan" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to collaborate on AI/LLM projects, discuss research opportunities, 
            or explore full-stack development solutions? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="glass p-3 rounded-xl bg-gradient-to-r from-ai-blue to-ai-cyan">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <p className="text-gray-300">arjunmishra31204@gmail.com</p>
                    <p className="text-gray-400 text-sm">Best for opportunities</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="glass p-3 rounded-xl bg-gradient-to-r from-ai-purple to-ai-pink">
                    <IconMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Location</h4>
                    <p className="text-gray-300">Vancouver, BC, Canada</p>
                    <p className="text-gray-400 text-sm">Remote-friendly</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="glass p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500">
                    <IconCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Availability</h4>
                    <p className="text-gray-300">Currently available</p>
                    <p className="text-gray-400 text-sm">For projects and opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
              <div className="space-y-3 sm:space-y-4">
              <a 
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white font-medium transition-all-smooth hover:scale-105 hover:shadow-lg hover:shadow-ai-blue/25"
              >
                <IconDownload className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
              
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center p-4 rounded-xl glass-card hover:scale-105 transition-all-smooth"
                    title={link.description}
                  >
                    <link.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50 transition-all"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:border-ai-blue focus:ring-2 focus:ring-ai-blue/50 transition-all resize-none"
                    placeholder="Tell me about your project, opportunity, or collaboration idea..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-ai-blue to-ai-purple text-white font-medium transition-all-smooth hover:scale-[1.02] hover:shadow-lg hover:shadow-ai-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <IconCheck className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </>
                  ) : submitStatus === "error" ? (
                    <>
                      <IconX className="w-5 h-5" />
                      <span>Try Again</span>
                    </>
                  ) : (
                    <>
                      <IconSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400"
                >
                  <p className="text-sm">Thanks for reaching out! I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Whether you&apos;re looking for AI/LLM expertise, full-stack development, 
              or research collaboration, I&apos;m excited to discuss how we can work together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-ai-blue/20 text-ai-blue rounded-full text-sm">
                AI/ML Development
              </span>
              <span className="px-4 py-2 bg-ai-purple/20 text-ai-purple rounded-full text-sm">
                Full-Stack Applications
              </span>
              <span className="px-4 py-2 bg-ai-cyan/20 text-ai-cyan rounded-full text-sm">
                Research Collaboration
              </span>
              <span className="px-4 py-2 bg-ai-pink/20 text-ai-pink rounded-full text-sm">
                Technical Consulting
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default EnhancedContact;
