import { EnhancedHero } from "@/components/enhanced-hero";
import { ModernNavbar } from "@/components/modern-navbar";
import { InitialLoader } from "@/components/initial-loader";
import { Suspense, lazy } from "react";
import { SectionLoader } from "@/components/performance-optimized-loader";
import { PageTransition, SectionTransition } from "@/components/ui/page-transitions";
import { IconUsers } from "@tabler/icons-react";
import ScrollReset from "@/components/ui/scroll-reset";
import dynamic from "next/dynamic";

// Dynamically import heavy components for better code splitting
const AwardsSection = dynamic(() => import("@/components/awards-section"), {
  loading: () => <SectionLoader title="Awards" />,
  ssr: false
});

const ModernSkills = dynamic(() => import("@/components/modern-skills"), {
  loading: () => <SectionLoader title="Skills" />,
  ssr: false
});

const EnhancedProjects = dynamic(() => import("@/components/enhanced-projects"), {
  loading: () => <SectionLoader title="Projects" />,
  ssr: false
});

const Experiences = dynamic(() => import("@/components/experiences"), {
  loading: () => <SectionLoader title="Experience" />,
  ssr: false
});

const EnhancedContact = dynamic(() => import("@/components/enhanced-contact"), {
  loading: () => <SectionLoader title="Contact" />,
  ssr: false
});

const DomeGalleryServer = dynamic(() => import("@/components/ui/dome-gallery-server"), {
  loading: () => <SectionLoader title="Gallery" />,
  ssr: false
});

export default function Home() {
  return (
    <>
      {/* Initial Loading Screen */}
      <InitialLoader />
      {/* Ensure viewport starts at top on reload/navigation */}
      <ScrollReset />
      
      <PageTransition>
        <main className="w-full relative min-h-screen pt-0">
          {/* Navigation */}
          <ModernNavbar />
        
          {/* Main Content */}
          <div className="w-full">
            {/* Hero Section */}
            <SectionTransition delay={0.1}>
              <EnhancedHero />
            </SectionTransition>
            
            {/* Experience Section */}
            <div id="experience">
              <SectionTransition delay={0.1} direction="right">
                <Experiences />
              </SectionTransition>
            </div>

            {/* 3D Dome Gallery (Personal Experience photos) */}
            <div id="personal">
              <SectionTransition delay={0.1} direction="up">
                <div className="w-full py-10">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <IconUsers className="w-8 h-8 text-ai-cyan" />
                      <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Personal <span className="text-gradient">Experience</span>
                      </h2>
                    </div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                      A glimpse into the moments, projects, and milestones that shaped my journey.
                    </p>
                  </div>
                  <DomeGalleryServer />
                </div>
              </SectionTransition>
            </div>
            
            {/* Skills Section */}
            <div id="skills">
              <SectionTransition delay={0.1} direction="left">
                <ModernSkills />
              </SectionTransition>
            </div>
            
            {/* Projects Section */}
            <div id="projects">
              <SectionTransition delay={0.15} direction="up">
                <EnhancedProjects />
              </SectionTransition>
            </div>
            
            {/* Awards Section */}
            <div id="awards">
              <SectionTransition delay={0.2} direction="up">
                <AwardsSection />
              </SectionTransition>
            </div>
            
            {/* Contact Section */}
            <div id="contact">
              <SectionTransition delay={0.1} direction="up">
                <EnhancedContact />
              </SectionTransition>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
