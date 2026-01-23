import { MicroWidget, MicroWidgetType, EnrichedResponse, WidgetPlacement } from '@/types/micro-widgets';
import { getMicroWidgetMatches, getFullWidgetMatch } from './keyword-detector';

/**
 * Enrich AI response with micro-widgets and full widgets based on detected keywords
 */
export function enrichResponse(
  aiText: string,
  userMessage: string,
  detectedWidgets?: MicroWidgetType[]
): EnrichedResponse {
  // Detect full widget first (takes priority)
  const fullWidgetType = getFullWidgetMatch(userMessage, aiText);
  
  // Use provided widgets or auto-detect micro-widgets
  const widgetTypes = detectedWidgets || getMicroWidgetMatches(userMessage, aiText);
  
  // If no widgets detected, return basic response (but still check for full widget)
  if (widgetTypes.length === 0 && !fullWidgetType) {
    return { text: aiText };
  }

  // Create micro-widgets from detected types
  const microWidgets: MicroWidget[] = [];
  const placement = determinePlacement(userMessage, widgetTypes);

  // Add widgets based on priority and context
  for (const widgetType of widgetTypes.slice(0, 2)) { // Max 2 widgets per response
    microWidgets.push(createMicroWidget(widgetType, userMessage, aiText));
  }

  return {
    text: aiText,
    microWidgets: microWidgets.length > 0 ? microWidgets : undefined,
    placement,
    widgetType: fullWidgetType || undefined,
  };
}

/**
 * Create a micro-widget with appropriate data
 */
function createMicroWidget(
  type: MicroWidgetType,
  userMessage: string,
  aiResponse: string
): MicroWidget {
  switch (type) {
    case 'quickStats':
      return { type, data: null }; // Component has default data
    
    case 'skillBadges':
      return { 
        type, 
        data: {
          focus: detectSkillFocus(userMessage, aiResponse),
        }
      };
    
    case 'quickActions':
      return { 
        type,
        data: {
          primary: detectPrimaryAction(userMessage),
        }
      };
    
    case 'timelinePreview':
      return { type, data: null };
    
    case 'achievementBadge':
      return { 
        type,
        data: {
          featured: 'hack-the-north', // Default to most impressive
        }
      };
    
    case 'techStackPill':
      return { type, data: null };
    
    default:
      return { type };
  }
}

/**
 * Determine optimal placement for widgets
 */
function determinePlacement(
  userMessage: string,
  widgetTypes: MicroWidgetType[]
): WidgetPlacement {
  const msg = userMessage.toLowerCase();
  
  // Quick actions should appear after text
  if (widgetTypes.includes('quickActions')) {
    return 'after';
  }
  
  // Stats work well before explanatory text
  if (widgetTypes.includes('quickStats')) {
    return 'before';
  }
  
  // Timeline and badges work well after
  if (widgetTypes.includes('timelinePreview') || widgetTypes.includes('achievementBadge')) {
    return 'after';
  }
  
  // Default to after
  return 'after';
}

/**
 * Detect which skill category user is asking about
 */
function detectSkillFocus(userMessage: string, aiResponse: string): string | null {
  const combined = `${userMessage} ${aiResponse}`.toLowerCase();
  
  if (combined.includes('ai') || combined.includes('ml') || combined.includes('machine learning')) {
    return 'ai';
  }
  if (combined.includes('frontend') || combined.includes('react') || combined.includes('ui')) {
    return 'frontend';
  }
  if (combined.includes('backend') || combined.includes('api') || combined.includes('server')) {
    return 'backend';
  }
  
  return null;
}

/**
 * Detect primary action user wants to take
 */
function detectPrimaryAction(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('resume') || msg.includes('cv')) {
    return 'resume';
  }
  if (msg.includes('email') || msg.includes('contact')) {
    return 'email';
  }
  if (msg.includes('linkedin')) {
    return 'linkedin';
  }
  
  return 'resume'; // Default
}
