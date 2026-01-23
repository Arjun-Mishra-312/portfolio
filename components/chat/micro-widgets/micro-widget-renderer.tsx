"use client";
import React from 'react';
import { MicroWidget } from '@/types/micro-widgets';
import { QuickStats } from './quick-stats';
import { SkillBadgeCluster } from './skill-badge-cluster';
import { QuickActions } from './quick-actions';
import { TimelinePreview } from './timeline-preview';
import { AchievementBadge } from './achievement-badge';
import { TechStackPill } from './tech-stack-pill';

interface MicroWidgetRendererProps {
  widget: MicroWidget;
}

export function MicroWidgetRenderer({ widget }: MicroWidgetRendererProps) {
  switch (widget.type) {
    case 'quickStats':
      return <QuickStats />;
    
    case 'skillBadges':
      return <SkillBadgeCluster focus={widget.data?.focus} />;
    
    case 'quickActions':
      return <QuickActions primary={widget.data?.primary} />;
    
    case 'timelinePreview':
      return <TimelinePreview />;
    
    case 'achievementBadge':
      return <AchievementBadge featured={widget.data?.featured} />;
    
    case 'techStackPill':
      return <TechStackPill />;
    
    default:
      return null;
  }
}
