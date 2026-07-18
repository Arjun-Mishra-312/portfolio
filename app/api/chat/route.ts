import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/openai-service';
import type { ChatMessage } from '@/lib/arjun-os/types';

export async function POST(req: NextRequest) {
  try {
    const { message, messages, uiContext } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          response: "I'm having trouble connecting to my AI brain right now. Try using the navigation buttons below to explore Arjun's portfolio, or ask me about his projects, skills, or experience!",
          microWidgets: [],
          widgetPlacement: 'after',
        },
        { status: 200 }
      );
    }

    // Get enriched response from OpenAI
    const safeMessages: ChatMessage[] = Array.isArray(messages)
      ? messages.filter(
          (entry: unknown): entry is ChatMessage =>
            Boolean(entry) &&
            typeof entry === 'object' &&
            ((entry as ChatMessage).role === 'user' || (entry as ChatMessage).role === 'assistant') &&
            typeof (entry as ChatMessage).content === 'string',
        ).slice(-10)
      : [];

    const enrichedResponse = await getChatResponse(message, safeMessages, uiContext);

    return NextResponse.json({ 
      response: enrichedResponse.text,
      microWidgets: enrichedResponse.microWidgets,
      widgetPlacement: enrichedResponse.placement,
      widgetType: enrichedResponse.widgetType,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    return NextResponse.json(
      { 
        response: "I'm having a bit of trouble right now. Try using the navigation buttons below to explore different sections of Arjun's portfolio!",
        microWidgets: [],
        widgetPlacement: 'after',
      },
      { status: 200 }
    );
  }
}
