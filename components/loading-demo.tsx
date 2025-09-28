"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HeroSkeleton,
  SkillsSkeleton,
  ProjectsSkeleton,
  ExperienceSkeleton,
  ContactSkeleton,
  GenericSectionSkeleton 
} from "./ui/loading-skeletons";
import { AnimatedButton } from "./ui/page-transitions";

export const LoadingDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demoSections = [
    { id: "hero", name: "Hero Section", component: <HeroSkeleton /> },
    { id: "skills", name: "Skills Section", component: <SkillsSkeleton /> },
    { id: "projects", name: "Projects Section", component: <ProjectsSkeleton /> },
    { id: "experience", name: "Experience Section", component: <ExperienceSkeleton /> },
    { id: "contact", name: "Contact Section", component: <ContactSkeleton /> },
    { id: "generic", name: "Generic Section", component: <GenericSectionSkeleton title="Research" items={4} /> },
  ];

  return (
    <div className="min-h-screen bg-dark-300 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Loading Skeletons <span className="text-gradient">Demo</span>
          </h1>
          <p className="text-gray-300 mb-8">
            Click any button below to preview the loading skeleton for that section
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {demoSections.map((section) => (
              <AnimatedButton
                key={section.id}
                onClick={() => setActiveDemo(activeDemo === section.id ? null : section.id)}
                variant={activeDemo === section.id ? "primary" : "secondary"}
                className="text-sm"
              >
                {section.name}
              </AnimatedButton>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="min-h-[600px]">
          {activeDemo ? (
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {demoSections.find(s => s.id === activeDemo)?.component}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="glass-card p-6 rounded-full mb-6 mx-auto w-fit"
                >
                  <svg className="w-12 h-12 text-gradient" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/>
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a Section</h3>
                <p className="text-gray-400">Choose any section above to see its loading skeleton</p>
              </div>
            </div>
          )}
        </div>

        {/* Implementation Code Preview */}
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Usage Example:</h3>
            <pre className="bg-dark-300 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
              <code>{`import { ${activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1)}Skeleton } from './ui/loading-skeletons';

// In your component
<Suspense fallback={<${activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1)}Skeleton />}>
  <${activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1)}Section />
</Suspense>`}</code>
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};
















