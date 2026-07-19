import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/lib/openai-service";
import type { ChatMessage } from "@/lib/arjun-os/types";

export async function POST(req: NextRequest) {
  try {
    const { message, messages, uiContext } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          response:
            "I'm having trouble connecting to my AI brain right now. Try using the dock to explore Arjun OS — Work, Experience, Research, or Life + Play.",
          actions: [
            { id: "open-work", label: "Open Work", type: "open-app", appId: "work" },
            { id: "open-life", label: "Open Life + Play", type: "open-app", appId: "life" },
          ],
        },
        { status: 200 },
      );
    }

    const safeMessages: ChatMessage[] = Array.isArray(messages)
      ? messages
          .filter(
            (entry: unknown): entry is ChatMessage =>
              Boolean(entry) &&
              typeof entry === "object" &&
              ((entry as ChatMessage).role === "user" || (entry as ChatMessage).role === "assistant") &&
              typeof (entry as ChatMessage).content === "string",
          )
          .slice(-10)
      : [];

    const enrichedResponse = await getChatResponse(message, safeMessages, uiContext);

    return NextResponse.json({
      response: enrichedResponse.text,
      actions: enrichedResponse.actions ?? [],
      evidence: enrichedResponse.evidence,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        response:
          "I'm having a bit of trouble right now. You can still explore Arjun OS with the dock — Work, Experience, Research, or Life + Play.",
        actions: [
          { id: "open-work", label: "Open Work", type: "open-app", appId: "work" },
          { id: "open-life", label: "Open Life + Play", type: "open-app", appId: "life" },
        ],
      },
      { status: 200 },
    );
  }
}
