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
}
