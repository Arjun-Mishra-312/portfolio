import OpenAI from "openai";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import type { ChatMessage } from "@/lib/arjun-os/types";
import { enrichResponse } from "./response-enricher";
import type { EnrichedResponse } from "@/types/micro-widgets";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PortfolioUIContext {
  activeAppId?: string;
  activeProjectId?: string;
  tourStep?: number;
}

function portfolioContext(uiContext?: PortfolioUIContext) {
  const facts = {
    profile: portfolioData.profile,
    projects: portfolioData.projects.map(({ image, ...project }) => project),
    experience: portfolioData.experience.map(({ logo, ...experience }) => experience),
    research: portfolioData.research,
    life: portfolioData.life,
  };

  return `You are the AI guide inside Arjun OS, Arjun Mishra's portfolio. Answer in Arjun's first person, using only the verified portfolio facts below. Never invent metrics, employers, dates, publications, links, or projects. If a fact is unavailable, say so briefly. Recommend only these destinations: Profile, Work, Experience, Research, Life + Play, Resume, and the listed project case studies. Keep answers concise, conversational, and recruiter-friendly, usually 3 to 6 sentences. Do not use markdown tables.

Current interface context: ${JSON.stringify(uiContext ?? {})}
Verified portfolio facts: ${JSON.stringify(facts)}`;
}

export async function getChatResponse(
  userMessage: string,
  history: ChatMessage[] = [],
  uiContext?: PortfolioUIContext,
): Promise<EnrichedResponse> {
  try {
    const safeHistory = history
      .filter(
        (message): message is ChatMessage =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .slice(-10);
    const conversation =
      safeHistory.at(-1)?.role === "user" && safeHistory.at(-1)?.content === userMessage
        ? safeHistory
        : [...safeHistory, { role: "user" as const, content: userMessage }];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: portfolioContext(uiContext) },
        ...conversation.map((message) => ({ role: message.role, content: message.content })),
      ],
      max_completion_tokens: 4000,
    });

    const response = completion.choices[0]?.message.content?.trim();
    if (!response) {
      return {
        text: "I can help you explore my verified projects, experience, research, or resume. What would you like to see first?",
      };
    }

    return enrichResponse(response, userMessage);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
