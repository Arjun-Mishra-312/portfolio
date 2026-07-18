"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { 
  IconHome, 
  IconUser, 
  IconCode,
  IconMail,
  IconAward,
  IconBriefcase,
  IconMenu2,
  IconX
} from "@tabler/icons-react";

interface NavItem {
  name: string;
  link: string;
  icon: JSX.Element;
  section: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    link: "#home",
    section: "home",
    icon: <IconHome className="w-4 h-4" />,
  },
  {
    name: "Experience",
    link: "#experience",
    section: "experience",
    icon: <IconBriefcase className="w-4 h-4" />,
  },
  {
    name: "Personal",
    link: "#personal",
    section: "personal",
    icon: <IconUser className="w-4 h-4" />,
  },
  {
    name: "Skills",
    link: "#skills",
    section: "skills",
    icon: <IconCode className="w-4 h-4" />,
  },
  {
    name: "Projects",
    link: "#projects",
    section: "projects",
    icon: <IconCode className="w-4 h-4" />,
  },
  {
    name: "Awards",
    link: "#awards",
    section: "awards",
    icon: <IconAward className="w-4 h-4" />,
  },
  {
    name: "Contact",
    link: "#contact",
    section: "contact",
    icon: <IconMail className="w-4 h-4" />,
  },
];

export const ModernNavbar = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Handle navbar visibility on scroll
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          setVisible(scrolled > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial navbar visibility
    setVisible(window.scrollY > 100);
    
    // Add scroll listener for navbar visibility
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for accurate section detection
  useEffect(() => {
    const sections = [
      { id: "home", element: document.getElementById("home") },
      { id: "experience", element: document.getElementById("experience") },
      { id: "personal", element: document.getElementById("personal") },
      { id: "skills", element: document.getElementById("skills") },
      { id: "projects", element: document.getElementById("projects") },
      { id: "awards", element: document.getElementById("awards") },
      { id: "contact", element: document.getElementById("contact") }
    ].filter(section => section.element); // Only include sections that exist

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeId = "home";
        
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = entry.target.id;
          }
        });
        
        // Only update if we have a significant intersection
        if (maxRatio > 0.1) {
          setActiveSection(activeId);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-20% 0px -20% 0px" // Only consider center 60% of viewport
      }
    );

    // Observe all sections
    sections.forEach(section => {
      if (section.element) {
        observer.observe(section.element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: "auto",
        block: "start" 
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ 
            opacity: visible ? 1 : 0, 
            y: visible ? 0 : -100 
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed top-2 sm:top-4 left-0 right-0 z-50",
            "hidden md:block"
          )}
        >
          <div className="flex justify-center">
            <nav className="glass-card rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className={cn(
                    "relative px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all-smooth",
                    "flex items-center justify-center space-x-1 sm:space-x-1.5 min-w-0",
                    activeSection === item.section
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {activeSection === item.section && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 ai-gradient rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10 hidden lg:block">{item.icon}</span>
                  <span className="relative z-10 whitespace-nowrap text-xs sm:text-sm">{item.name}</span>
                </button>
              ))}
              </div>
            </nav>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden fixed top-3 sm:top-4 right-3 sm:right-4 z-50"
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="glass-card p-2 sm:p-3 rounded-full"
        >
          {mobileMenuOpen ? (
            <IconX className="w-6 h-6 text-white" />
          ) : (
            <IconMenu2 className="w-6 h-6 text-white" />
          )}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-3 sm:inset-x-4 top-16 sm:top-20 z-40"
          >
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="grid gap-2 sm:gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => scrollToSection(item.section)}
                    className={cn(
                      "flex items-center space-x-3 p-2 sm:p-3 rounded-xl transition-all-smooth text-left",
                      activeSection === item.section
                        ? "ai-gradient text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium text-sm sm:text-base">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
};
