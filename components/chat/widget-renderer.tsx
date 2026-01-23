"use client";
import React from 'react';
import { WidgetType } from '@/lib/chat-context';
import dynamic from 'next/dynamic';

// Dynamically import widgets for code splitting
const MeWidget = dynamic(() => import('./widgets/me-widget'), {
  loading: () => <WidgetSkeleton />,
});

const ProjectsWidget = dynamic(() => import('./widgets/projects-widget'), {
  loading: () => <WidgetSkeleton />,
});

const SkillsWidget = dynamic(() => import('./widgets/skills-widget'), {
  loading: () => <WidgetSkeleton />,
});

const ExperienceWidget = dynamic(() => import('./widgets/experience-widget'), {
  loading: () => <WidgetSkeleton />,
});

const AwardsWidget = dynamic(() => import('./widgets/awards-widget'), {
  loading: () => <WidgetSkeleton />,
});

const FunWidget = dynamic(() => import('./widgets/fun-widget'), {
  loading: () => <WidgetSkeleton />,
});

const ContactWidget = dynamic(() => import('./widgets/contact-widget'), {
  loading: () => <WidgetSkeleton />,
});

function WidgetSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="h-40 bg-white/5 rounded-xl" />
    </div>
  );
}

interface WidgetRendererProps {
  widgetType: WidgetType;
}

export function WidgetRenderer({ widgetType }: WidgetRendererProps) {
  switch (widgetType) {
    case 'me':
      return <MeWidget />;
    case 'projects':
      return <ProjectsWidget />;
    case 'skills':
      return <SkillsWidget />;
    case 'experience':
      return <ExperienceWidget />;
    case 'awards':
      return <AwardsWidget />;
    case 'fun':
      return <FunWidget />;
    case 'contact':
      return <ContactWidget />;
    default:
      return null;
  }
}
