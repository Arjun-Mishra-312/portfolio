import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

const SPOTIFY_FOCUS_PLAYLIST = "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM";

export type SpotifyFocusPayload = {
  title: string;
  provider: "Spotify";
  thumbnailUrl: string | null;
  playlistUrl: string;
  status: "ready" | "fallback";
};

const fallbackPayload: SpotifyFocusPayload = {
  title: "Lofi focus radio",
  provider: "Spotify",
  thumbnailUrl: null,
  playlistUrl: SPOTIFY_FOCUS_PLAYLIST,
  status: "fallback",
};

export async function GET() {
  try {
    const endpoint = new URL("https://open.spotify.com/oembed");
    endpoint.searchParams.set("url", SPOTIFY_FOCUS_PLAYLIST);
    const response = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!response.ok) return NextResponse.json(fallbackPayload);
    const metadata = (await response.json()) as { title?: string; thumbnail_url?: string };
    return NextResponse.json({
      ...fallbackPayload,
      title: metadata.title?.trim() || fallbackPayload.title,
      thumbnailUrl: metadata.thumbnail_url || null,
      status: "ready",
    } satisfies SpotifyFocusPayload, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json(fallbackPayload);
  }
}
