"use client";
import React from "react";
import { motion } from "framer-motion";

// Base skeleton component
const SkeletonBox = ({ 
  className = "", 
  delay = 0 
}: { 
  className?: string; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0.3 }}
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={`bg-gradient-to-r from-gray-200/10 to-gray-300/20 rounded-lg ${className}`}
  />
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <div className="relative min-h-screen flex items-start sm:items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-8">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content Skeleton */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left order-last lg:order-first">
          {/* Greeting */}
          <div className="space-y-2">
            <SkeletonBox className="h-6 w-32 mx-auto lg:mx-0" delay={0} />
            <SkeletonBox className="h-12 sm:h-16 w-80 mx-auto lg:mx-0" delay={0.1} />
          </div>
          
          {/* Role */}
          <SkeletonBox className="h-8 w-64 mx-auto lg:mx-0" delay={0.2} />
          
          {/* Description */}
          <div className="space-y-3">
            <SkeletonBox className="h-4 w-full max-w-xl mx-auto lg:mx-0" delay={0.3} />
            <SkeletonBox className="h-4 w-3/4 max-w-xl mx-auto lg:mx-0" delay={0.4} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-20 w-full" delay={0.5 + i * 0.1} />
            ))}
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <SkeletonBox className="h-12 w-full sm:w-40" delay={0.9} />
            <SkeletonBox className="h-12 w-full sm:w-40" delay={1.0} />
          </div>
        </div>
        
        {/* Right Content Skeleton */}
        <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
          <SkeletonBox className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full" delay={0.3} />
        </div>
      </div>
    </div>
  </div>
);

// Section Header Skeleton
export const SectionHeaderSkeleton = () => (
  <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4">
    <div className="flex items-center justify-center space-x-3 mb-4">
      <SkeletonBox className="w-8 h-8 rounded-full" />
      <SkeletonBox className="h-10 w-64" />
    </div>
    <SkeletonBox className="h-6 w-96 max-w-full mx-auto" delay={0.1} />
  </div>
);

// Skills Section Skeleton
export const SkillsSkeleton = () => (
  <section className="py-16 sm:py-20 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeaderSkeleton />
      
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {[...Array(4)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl">
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <SkeletonBox className="w-12 h-12 rounded-xl" delay={categoryIndex * 0.1} />
              <SkeletonBox className="h-6 w-40" delay={categoryIndex * 0.1 + 0.05} />
            </div>
            
            {/* Skills List */}
            <div className="space-y-3 sm:space-y-4">
              {[...Array(6)].map((_, skillIndex) => (
                <div key={skillIndex}>
                  <div className="flex justify-between items-center mb-2">
                    <SkeletonBox className="h-4 w-32" delay={categoryIndex * 0.1 + skillIndex * 0.05} />
                    <SkeletonBox className="h-4 w-16" delay={categoryIndex * 0.1 + skillIndex * 0.05 + 0.02} />
                  </div>
                  <SkeletonBox className="h-2 w-full rounded-full" delay={categoryIndex * 0.1 + skillIndex * 0.05 + 0.03} />
                  <div className="flex justify-between mt-1">
                    {[...Array(5)].map((_, dotIndex) => (
                      <SkeletonBox key={dotIndex} className="w-2 h-2 rounded-full" delay={categoryIndex * 0.1 + skillIndex * 0.05 + dotIndex * 0.01} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Projects Section Skeleton
export const ProjectsSkeleton = () => (
  <section className="py-16 sm:py-20 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeaderSkeleton />
      
      {/* Filter Buttons */}
      <div className="flex justify-center mb-8 sm:mb-12 px-4">
        <div className="glass-card p-1 sm:p-2 rounded-full">
          <div className="flex space-x-0.5 sm:space-x-1">
            {[...Array(3)].map((_, i) => (
              <SkeletonBox key={i} className="h-8 w-20 rounded-full" delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Projects */}
      <div className="mb-16">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card p-4 sm:p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <SkeletonBox className="w-12 h-12 rounded-xl" delay={i * 0.1} />
                <div className="flex-1">
                  <SkeletonBox className="h-6 w-3/4 mb-2" delay={i * 0.1 + 0.05} />
                  <SkeletonBox className="h-4 w-20 rounded-full" delay={i * 0.1 + 0.1} />
                </div>
              </div>
              <SkeletonBox className="h-4 w-full mb-2" delay={i * 0.1 + 0.15} />
              <SkeletonBox className="h-4 w-5/6 mb-4" delay={i * 0.1 + 0.2} />
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(5)].map((_, techIndex) => (
                  <SkeletonBox key={techIndex} className="h-6 w-16 rounded-full" delay={i * 0.1 + techIndex * 0.02} />
                ))}
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-3">
                <SkeletonBox className="h-10 w-24 rounded-lg" delay={i * 0.1 + 0.3} />
                <SkeletonBox className="h-10 w-24 rounded-lg" delay={i * 0.1 + 0.35} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <SkeletonBox className="w-10 h-10 rounded-lg" delay={i * 0.05} />
              <SkeletonBox className="h-5 w-32" delay={i * 0.05 + 0.02} />
            </div>
            <SkeletonBox className="h-4 w-full mb-2" delay={i * 0.05 + 0.05} />
            <SkeletonBox className="h-4 w-4/5 mb-3" delay={i * 0.05 + 0.07} />
            
            <div className="flex flex-wrap gap-1 mb-3">
              {[...Array(3)].map((_, techIndex) => (
                <SkeletonBox key={techIndex} className="h-5 w-14 rounded" delay={i * 0.05 + techIndex * 0.01} />
              ))}
            </div>
            
            <SkeletonBox className="h-8 w-20 rounded-lg" delay={i * 0.05 + 0.1} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Experience Section Skeleton
export const ExperienceSkeleton = () => (
  <section className="py-16 sm:py-20 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeaderSkeleton />
      
      <div className="max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 sm:p-8 rounded-2xl mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <SkeletonBox className="w-16 h-16 rounded-xl flex-shrink-0" delay={i * 0.1} />
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <SkeletonBox className="h-6 w-48 mb-2 sm:mb-0" delay={i * 0.1 + 0.05} />
                  <SkeletonBox className="h-4 w-32 rounded-full" delay={i * 0.1 + 0.1} />
                </div>
                
                <SkeletonBox className="h-5 w-40 mb-3" delay={i * 0.1 + 0.15} />
                <SkeletonBox className="h-4 w-full mb-2" delay={i * 0.1 + 0.2} />
                <SkeletonBox className="h-4 w-5/6 mb-4" delay={i * 0.1 + 0.25} />
                
                {/* Achievements */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, achIndex) => (
                    <div key={achIndex} className="flex items-start space-x-2">
                      <SkeletonBox className="w-2 h-2 rounded-full mt-2 flex-shrink-0" delay={i * 0.1 + achIndex * 0.02} />
                      <SkeletonBox className="h-4 w-full" delay={i * 0.1 + achIndex * 0.02 + 0.01} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Contact Section Skeleton
export const ContactSkeleton = () => (
  <section className="py-16 sm:py-20 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeaderSkeleton />
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Contact Info */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl">
          <SkeletonBox className="h-7 w-32 mb-4 sm:mb-6" />
          <SkeletonBox className="h-4 w-full mb-6 sm:mb-8" delay={0.05} />
          
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 glass rounded-xl">
                <SkeletonBox className="w-6 h-6 rounded-full flex-shrink-0" delay={i * 0.1} />
                <div className="flex-1">
                  <SkeletonBox className="h-4 w-24 mb-1" delay={i * 0.1 + 0.02} />
                  <SkeletonBox className="h-4 w-32" delay={i * 0.1 + 0.04} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl mt-8 lg:mt-0">
          <SkeletonBox className="h-7 w-36 mb-4 sm:mb-6" />
          
          <div className="space-y-4 sm:space-y-6">
            <SkeletonBox className="h-12 w-full rounded-xl" delay={0.1} />
            <SkeletonBox className="h-12 w-full rounded-xl" delay={0.15} />
            <SkeletonBox className="h-32 w-full rounded-xl" delay={0.2} />
            <SkeletonBox className="h-12 w-full rounded-xl" delay={0.25} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Generic Section Skeleton
export const GenericSectionSkeleton = ({ 
  title = "Loading Section...",
  items = 4 
}: { 
  title?: string;
  items?: number;
}) => (
  <section className="py-16 sm:py-20 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeaderSkeleton />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(items)].map((_, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl">
            <SkeletonBox className="w-12 h-12 rounded-xl mb-4" delay={i * 0.1} />
            <SkeletonBox className="h-6 w-3/4 mb-3" delay={i * 0.1 + 0.05} />
            <SkeletonBox className="h-4 w-full mb-2" delay={i * 0.1 + 0.1} />
            <SkeletonBox className="h-4 w-5/6" delay={i * 0.1 + 0.15} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

