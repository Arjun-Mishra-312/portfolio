import { MicroWidgetType } from '@/types/micro-widgets';
import { WidgetType } from './chat-context';

interface KeywordMatch {
  type: 'full' | 'micro';
  widgetType: WidgetType | MicroWidgetType;
  confidence: number;
  matchedKeywords: string[];
}

// High-priority intent patterns that should trigger widgets immediately
// These are explicit user requests to show a section
const EXPLICIT_WIDGET_INTENTS: Record<WidgetType, RegExp[]> = {
  me: [
    /show\s*(me\s*)?(the\s*)?about/i,
    /show\s*(me\s*)?(the\s*)?me\s+section/i,
    /tell\s*me\s*about\s*(yourself|you)/i,
    /who\s*are\s*you/i,
    /introduce\s*yourself/i,
  ],
  projects: [
    /show\s*(me\s*)?(the\s*)?(your\s*)?projects?/i,
    /show\s*(me\s*)?(the\s*)?projects?\s+section/i,
    /what\s*(are\s*)?(your\s*)?projects?/i,
    /tell\s*me\s*about\s*(your\s*)?projects?/i,
  ],
  skills: [
    /show\s*(me\s*)?(the\s*)?(your\s*)?skills?/i,
    /show\s*(me\s*)?(the\s*)?skills?\s+section/i,
    /what\s*(are\s*)?(your\s*)?skills?/i,
    /tell\s*me\s*about\s*(your\s*)?skills?/i,
  ],
  experience: [
    /show\s*(me\s*)?(the\s*)?(your\s*)?experience/i,
    /show\s*(me\s*)?(the\s*)?experience\s+section/i,
    /tell\s*me\s*about\s*(your\s*)?experience/i,
    /what('s|\s*is)\s*(your\s*)?experience/i,
    /work\s*experience/i,
  ],
  awards: [
    /show\s*(me\s*)?(the\s*)?(your\s*)?awards?/i,
    /show\s*(me\s*)?(the\s*)?awards?\s+section/i,
    /tell\s*me\s*about\s*(your\s*)?awards?/i,
    /what\s*(are\s*)?(your\s*)?awards?/i,
    /achievements?/i,
  ],
  fun: [
    /show\s*(me\s*)?(the\s*)?fun/i,
    /show\s*(me\s*)?(the\s*)?fun\s+section/i,
    /what('s|\s*is)\s*(the\s*)?fun\s+section/i,
    /tell\s*me\s*about\s*(the\s*)?fun/i,
    /fun\s+stuff/i,
    /hobbies/i,
    /gallery/i,
    /photos?/i,
  ],
  contact: [
    /show\s*(me\s*)?(the\s*)?(your\s*)?contact/i,
    /show\s*(me\s*)?(the\s*)?contact\s+section/i,
    /how\s*(can\s*i\s*|to\s*)?contact\s*(you)?/i,
    /get\s*in\s*touch/i,
    /reach\s*(out|you)/i,
  ],
};

// Fallback keyword mapping for full widgets (lower priority)
const FULL_WIDGET_KEYWORDS: Record<WidgetType, string[]> = {
  me: ['about', 'who are you', 'yourself', 'introduce', 'bio', 'background'],
  projects: ['project', 'portfolio', 'built', 'created', 'developed'],
  skills: ['skill', 'technology', 'tech stack', 'programming', 'expertise'],
  experience: ['experience', 'job', 'role', 'worked at', 'position', 'employment'],
  awards: ['award', 'achievement', 'win', 'won', 'prize', 'recognition', 'honor'],
  fun: ['fun', 'hobby', 'interest', 'gallery', 'photo'],
  contact: ['contact', 'reach', 'email', 'get in touch', 'connect'],
};

// Keyword mapping for micro widgets
const MICRO_WIDGET_KEYWORDS: Record<MicroWidgetType, string[]> = {
  quickStats: ['stats', 'statistics', 'numbers', 'how many', 'count', 'metrics'],
  quickActions: ['resume', 'cv', 'hire', 'download', 'get resume'],
  skillBadges: ['languages', 'frameworks', 'tools', 'technologies', 'stack'],
  timelinePreview: ['timeline', 'journey', 'career path', 'progression', 'history'],
  achievementBadge: ['latest', 'recent win', 'top achievement', 'hackathon'],
  techStackPill: ['use', 'working with', 'built with', 'tech'],
};

/**
 * Detects keywords in user message and AI response
 * Returns matched widgets with confidence scores
 */
export function detectKeywords(
  userMessage: string,
  aiResponse: string
): KeywordMatch[] {
  const combinedText = `${userMessage.toLowerCase()} ${aiResponse.toLowerCase()}`;
  const matches: KeywordMatch[] = [];

  // Check full widgets
  Object.entries(FULL_WIDGET_KEYWORDS).forEach(([widgetType, keywords]) => {
    const matchedKeywords = keywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length > 0) {
      const confidence = matchedKeywords.length / keywords.length;
      matches.push({
        type: 'full',
        widgetType: widgetType as WidgetType,
        confidence,
        matchedKeywords,
      });
    }
  });

  // Check micro widgets
  Object.entries(MICRO_WIDGET_KEYWORDS).forEach(([widgetType, keywords]) => {
    const matchedKeywords = keywords.filter(keyword =>
      combinedText.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      const confidence = matchedKeywords.length / keywords.length;
      matches.push({
        type: 'micro',
        widgetType: widgetType as MicroWidgetType,
        confidence,
        matchedKeywords,
      });
    }
  });

  // Sort by confidence (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get the best widget match based on context
 */
export function getBestMatch(
  userMessage: string,
  aiResponse: string
): KeywordMatch | null {
  const matches = detectKeywords(userMessage, aiResponse);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Get all micro widget matches above confidence threshold
 */
export function getMicroWidgetMatches(
  userMessage: string,
  aiResponse: string,
  threshold: number = 0.3
): MicroWidgetType[] {
  const matches = detectKeywords(userMessage, aiResponse);
  return matches
    .filter(match => match.type === 'micro' && match.confidence >= threshold)
    .map(match => match.widgetType as MicroWidgetType);
}

/**
 * Get full widget match - first checks explicit intents, then falls back to keyword matching
 */
export function getFullWidgetMatch(
  userMessage: string,
  aiResponse: string,
  threshold: number = 0.2
): WidgetType | null {
  // First, check for explicit intent patterns (high priority)
  for (const [widgetType, patterns] of Object.entries(EXPLICIT_WIDGET_INTENTS)) {
    for (const pattern of patterns) {
      if (pattern.test(userMessage)) {
        return widgetType as WidgetType;
      }
    }
  }
  
  // Fall back to keyword matching with lower threshold
  const matches = detectKeywords(userMessage, aiResponse);
  const fullWidgetMatch = matches.find(
    match => match.type === 'full' && match.confidence >= threshold
  );
  return fullWidgetMatch ? (fullWidgetMatch.widgetType as WidgetType) : null;
}
