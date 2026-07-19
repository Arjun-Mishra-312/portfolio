export type MicroWidgetType = 
  | 'quickStats'
  | 'skillBadges'
  | 'quickActions'
  | 'timelinePreview'
  | 'achievementBadge'
  | 'techStackPill';

export interface MicroWidget {
  type: MicroWidgetType;
  data?: any;
}

export type WidgetPlacement = 'before' | 'after' | 'inline';

export interface EnrichedResponse {
  text: string;
  microWidgets?: MicroWidget[];
  placement?: WidgetPlacement;
  widgetType?: import('@/lib/chat-context').WidgetType;
  actions?: import('@/lib/arjun-os/types').IslandAction[];
  evidence?: import('@/lib/arjun-os/types').IslandEvidence;
}
