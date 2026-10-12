import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from "openai/resources/chat/completions";
import { AI_OS_TOOLS, executeAiTool, type ToolLoopState } from "@/lib/arjun-os/ai-tools";
import type { ChatMessage, IslandAction, IslandEvidence } from "@/lib/arjun-os/types";
import type { EnrichedResponse } from "@/types/micro-widgets";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_TOOL_ROUNDS = 4;

interface PortfolioUIContext {
  activeAppId?: string;
  activeProjectId?: string;
  tourStep?: number;
}

function portfolioContext(uiContext?: PortfolioUIContext) {
  return `You are the AI guide inside Arjun OS, Arjun Mishra's portfolio. Answer in Arjun's first person.

Grounding rules:
- Use only verified facts from get_portfolio_slice and get_github_pulse tool results, plus the current interface context below.
- Never invent metrics, employers, dates, publications, links, or projects. If a fact is unavailable, say so briefly.
- Keep answers concise, conversational, and recruiter-friendly (usually 3 to 6 sentences). Do not use markdown tables.

OS control rules:
- When the visitor should see something in the desktop, call control_os (do not only recommend destinations in text).
- Fun / hobbies / life outside work → open-app life.
- Projects / case studies → open-project or open-app work.
- Roadpack / my shipped iPhone app / launch film → get_portfolio_slice projects, then open-project roadpack. Its launch film is the opening feature, followed by real app captures and recordings.
- BuildStory / developer tooling → get_portfolio_slice projects, then open-project buildstory.
- Mune / personal finance / on-device AI → get_portfolio_slice projects, then open-project mune.
- My paper / publications / WRAP / research evidence → get_portfolio_slice research, then open-app research. Agentic Web Accessibility Auditing is a first-author public preprint; WRAP is second-author work. Both are submitted to ACM CHI 2027, not accepted publications. Report recall and precision together and keep the dataset scope.
- Education / graduation / skills → get_portfolio_slice profile. Use the recorded specialization, minor, expected graduation, and skills; do not invent a GPA.
- Roles / jobs → open-experience or open-app experience.
- What have I shipped / recent products → get_portfolio_slice projects, then open-app work. Roadpack and Mune are on the App Store; BuildStory's scanner is open source.
- Recent GitHub commits / contribution activity → get_github_pulse, then focus-widget github-pulse; optionally show-evidence github-pulse.
- Focus music / play a song / focus radio → focus-widget focus-radio. Do not claim a track is playing; the Spotify embed needs visitor interaction.
- Portfolio walkthrough → start-tour.
- Resume → open-resume.

Current interface context: ${JSON.stringify(uiContext ?? {})}`;
}

function fallbackText() {
  return "I can help you explore my verified projects, experience, research, or resume. What would you like to see first?";
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

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: portfolioContext(uiContext) },
      ...conversation.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];

    let toolState: ToolLoopState = { actions: [] };
    let finalText = "";

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages,
        tools: AI_OS_TOOLS,
        tool_choice: "auto",
        max_completion_tokens: 4000,
      });

      const choice = completion.choices[0]?.message;
      if (!choice) break;

      const toolCalls = choice.tool_calls ?? [];
      if (toolCalls.length === 0) {
        finalText = choice.content?.trim() ?? "";
        break;
      }

      messages.push({
        role: "assistant",
        content: choice.content ?? null,
        tool_calls: toolCalls,
      });

      for (const call of toolCalls) {
        const executed = await executeAiTool(call.function.name, call.function.arguments ?? "{}", toolState);
        toolState = executed.state;
        const toolMessage: ChatCompletionToolMessageParam = {
          role: "tool",
          tool_call_id: call.id,
          content: executed.result,
        };
        messages.push(toolMessage);
      }
    }

    if (!finalText) {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages,
        max_completion_tokens: 4000,
      });
      finalText = completion.choices[0]?.message?.content?.trim() ?? "";
    }

    const actions: IslandAction[] = toolState.actions;
    const evidence: IslandEvidence | undefined = toolState.evidence;

    return {
      text: finalText || fallbackText(),
      actions: actions.length > 0 ? actions : undefined,
      evidence,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
