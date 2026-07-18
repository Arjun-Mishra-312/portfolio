"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconBrain } from "@tabler/icons-react";
import { 
  SkillsSkeleton, 
  ProjectsSkeleton, 
  ExperienceSkeleton, 
  ContactSkeleton,
  GenericSectionSkeleton 
} from "./ui/loading-skeletons";

// Loading component for better UX during lazy loading
export const SectionLoader = ({ title }: { title: string }) => {
  // Return specific skeleton based on section
  switch (title.toLowerCase()) {
    case "skills":
      return <SkillsSkeleton />;
    case "projects":
      return <ProjectsSkeleton />;
    case "experience":
      return <ExperienceSkeleton />;
    case "contact":
      return <ContactSkeleton />;
    case "awards":
      return <GenericSectionSkeleton title={title} items={3} />;
    default:
      return (
        <div className="py-20 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="glass-card p-4 rounded-full mb-4 mx-auto w-fit"
            >
              <IconBrain className="w-8 h-8 text-gradient" />
            </motion.div>
            <p className="text-gray-400">Loading {title}...</p>
          </div>
        </div>
      );
  }
};
