import knowledgeBase from './knowledge-base.json';

export interface KnowledgeEntry {
  question: string;
  answer: string;
}

export interface KnowledgeBase {
  [category: string]: {
    [questionId: string]: KnowledgeEntry;
  };
}

export function loadKnowledgeBase(): KnowledgeBase {
  return knowledgeBase as KnowledgeBase;
}

export function getAnswerForQuestion(questionId: string, category?: string): string | null {
  const kb = loadKnowledgeBase();
  
  // Try category-specific lookup
  if (category && kb[category]?.[questionId]) {
    return kb[category][questionId].answer;
  }
  
  // Search all categories
  for (const cat in kb) {
    if (kb[cat][questionId]) {
      return kb[cat][questionId].answer;
    }
  }
  
  return null;
}

export function formatKnowledgeBaseForContext(): string {
  try {
    const kb = loadKnowledgeBase();
    let context = "KNOWLEDGE BASE - Personal Answers to Common Questions:\n\n";
    
    for (const [category, questions] of Object.entries(kb)) {
      if (category === 'special') continue; // Handle special cases separately
      
      context += `## ${category.toUpperCase()}\n\n`;
      for (const [id, entry] of Object.entries(questions)) {
        // Skip template placeholders
        if (entry.answer && !entry.answer.includes('[Your answer here')) {
          context += `Q: ${entry.question}\nA: ${entry.answer}\n\n`;
        }
      }
    }
    
    // Add special cases
    if (kb.special) {
      context += `## SPECIAL PROMPTS\n\n`;
      for (const [id, entry] of Object.entries(kb.special)) {
        if (entry.answer && !entry.answer.includes('[Your answer here')) {
          context += `Q: ${entry.question}\nA: ${entry.answer}\n\n`;
        }
      }
    }
    
    return context;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return ''; // Return empty string if knowledge base fails to load
  }
}
