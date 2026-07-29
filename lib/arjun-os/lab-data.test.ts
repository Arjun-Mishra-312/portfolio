import { describe, expect, it } from "vitest";
import { analyzeJobDescription, resolvePortalAddress } from "./lab-data";

describe("Experience Lab portal routing", () => {
  it("resolves aliases into safe local OS routes", () => {
    const work = resolvePortalAddress("work");
    expect(work).toMatchObject({
      status: "local",
      canonical: "arjun://work",
      appId: "work",
    });
  });

  it("allows verified external hosts without allowing deceptive suffixes", () => {
    const github = resolvePortalAddress("github.com/Arjun-Mishra-312");
    expect(github).toMatchObject({
      status: "external",
      hostname: "github.com",
    });

    const deceptive = resolvePortalAddress("https://github.com.evil.example/profile");
    expect(deceptive.status).toBe("blocked");
  });

  it("blocks non-web protocols and unknown destinations", () => {
    expect(resolvePortalAddress("javascript:alert(1)").status).toBe("blocked");
    expect(resolvePortalAddress("https://example.com").status).toBe("blocked");
  });
});

describe("Experience Lab recruiter matching", () => {
  it("ranks verified evidence from role language without inventing entries", () => {
    const analysis = analyzeJobDescription(
      "AI engineer building reliable full-stack LLM and retrieval products with Python, Next.js, accessibility, and HCI research.",
    );

    expect(analysis.score).toBeGreaterThan(70);
    expect(analysis.matchedTerms).toContain("accessibility");
    expect(analysis.evidence.some((item) => item.id === "evidence-accessibility")).toBe(true);
    expect(analysis.evidence).toHaveLength(4);
  });

  it("still returns a useful general tour for sparse descriptions", () => {
    const analysis = analyzeJobDescription("Software engineer");
    expect(analysis.score).toBeGreaterThan(0);
    expect(analysis.evidence).toHaveLength(4);
  });
});

