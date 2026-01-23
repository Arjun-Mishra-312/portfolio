import { MicroWidgetType } from '@/types/micro-widgets';
import { WidgetType } from './chat-context';

interface KeywordMatch {
  type: 'full' | 'micro';
  widgetType: WidgetType | MicroWidgetType;
  confidence: number;
  matchedKeywords: string[];
}

// Keyword mapping for full widgets
const FULL_WIDGET_KEYWORDS: Record<WidgetType, string[]> = {
  me: ['about', 'who are you', 'yourself', 'introduce', 'bio', 'background'],
  projects: ['project', 'portfolio', 'built', 'created', 'work on', 'developed', 'app'],
  skills: ['skill', 'technology', 'tech stack', 'know', 'programming', 'proficient', 'expertise'],
  experience: ['experience', 'work', 'job', 'role', 'worked at', 'position', 'employment'],
  awards: ['award', 'achievement', 'win', 'won', 'prize', 'recognition', 'honor'],
  fun: ['fun', 'hobby', 'interest', 'personal', 'gallery', 'photo'],
  contact: ['contact', 'reach', 'email', 'get in touch', 'connect', 'message'],
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
 * Get full widget match if confidence is high enough
 */
export function getFullWidgetMatch(
  userMessage: string,
  aiResponse: string,
  threshold: number = 0.4
): WidgetType | null {
  const matches = detectKeywords(userMessage, aiResponse);
  const fullWidgetMatch = matches.find(
    match => match.type === 'full' && match.confidence >= threshold
  );
  return fullWidgetMatch ? (fullWidgetMatch.widgetType as WidgetType) : null;
}
