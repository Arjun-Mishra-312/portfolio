import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("spotify focus metadata", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("normalizes Spotify oEmbed metadata", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      title: "Lofi Girl focus playlist",
      thumbnail_url: "https://i.scdn.co/image/example",
    }), { status: 200 })));
    const response = await GET();
    await expect(response.json()).resolves.toMatchObject({
      title: "Lofi Girl focus playlist",
      provider: "Spotify",
      thumbnailUrl: "https://i.scdn.co/image/example",
      status: "ready",
    });
  });

  it("returns a deterministic fallback when Spotify is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await GET();
    await expect(response.json()).resolves.toMatchObject({
      title: "Lofi focus radio",
      provider: "Spotify",
      thumbnailUrl: null,
      status: "fallback",
    });
  });
});
