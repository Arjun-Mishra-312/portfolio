import { NextResponse } from "next/server";
import { fetchGithubPulse, type GithubPulsePayload } from "@/lib/github-pulse";

export const runtime = "nodejs";
export const revalidate = 3600;

export type { GithubPulsePayload };

export async function GET() {
  const payload = await fetchGithubPulse();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    status: 200,
  });
}
