import { EnhancedHero } from "@/components/enhanced-hero";
import { ModernNavbar } from "@/components/modern-navbar";
import { InitialLoader } from "@/components/initial-loader";
import { Suspense } from "react";
import { SectionLoader } from "@/components/performance-optimized-loader";
import { PageTransition, SectionTransition } from "@/components/ui/page-transitions";
import AwardsSection from "@/components/awards-section";
import ModernSkills from "@/components/modern-skills";
import EnhancedProjects from "@/components/enhanced-projects";
import Experiences from "@/components/experiences";
import EnhancedContact from "@/components/enhanced-contact";
import DomeGalleryServer from "@/components/ui/dome-gallery-server";
import { IconUsers } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      {/* Initial Loading Screen */}
      <InitialLoader />
      
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
                <Suspense fallback={<SectionLoader title="Experience" />}>
                  <Experiences />
                </Suspense>
              </SectionTransition>
            </div>

            {/* 3D Dome Gallery (Experiences photos) */}
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
                <Suspense fallback={<SectionLoader title="Gallery" />}>
                  <DomeGalleryServer />
                </Suspense>
              </div>
            </SectionTransition>
            
            {/* Skills Section */}
            <div id="skills">
              <SectionTransition delay={0.1} direction="left">
                <Suspense fallback={<SectionLoader title="Skills" />}>
                  <ModernSkills />
                </Suspense>
              </SectionTransition>
            </div>
            
            {/* Projects Section */}
            <div id="projects">
              <SectionTransition delay={0.15} direction="up">
                <Suspense fallback={<SectionLoader title="Projects" />}>
                  <EnhancedProjects />
                </Suspense>
              </SectionTransition>
            </div>
            
            {/* Awards Section */}
            <div id="awards">
              <SectionTransition delay={0.2} direction="up">
                <Suspense fallback={<SectionLoader title="Awards" />}>
                  <AwardsSection />
                </Suspense>
              </SectionTransition>
            </div>
            
            {/* Contact Section */}
            <div id="contact">
              <SectionTransition delay={0.1} direction="up">
                <Suspense fallback={<SectionLoader title="Contact" />}>
                  <EnhancedContact />
                </Suspense>
              </SectionTransition>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
