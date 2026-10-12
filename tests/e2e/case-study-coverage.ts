import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export function registerCaseStudyCoverage() {
  test("rich case studies load original media and explain decisions and architecture", async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const phone = testInfo.project.name === "mobile" || testInfo.project.name.startsWith("phone");
    for (const project of [
      { id: "buildstory", title: "BuildStory", images: 3, decisions: 4 },
      { id: "mune", title: "Mune", images: 4, decisions: 4 },
      { id: "ai-accessibility-analyzer", title: "AI Accessibility Analyzer", images: 1, decisions: 4 },
      { id: "llm-pro-max", title: "LLM Pro Max", images: 2, decisions: 3 },
      { id: "re-plate", title: "Re-Plate", images: 2, decisions: 3 },
    ]) {
      await page.goto("/?app=work&project=" + project.id);
      const study = page.locator(".pf-case");
      const images = study.locator(".pf-feature-stories img");
      await expect(images).toHaveCount(project.images);
      for (const img of await images.all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
        expect((await img.getAttribute("alt"))!.length).toBeGreaterThan(30);
      }
      const chapter = (name: string) => phone ? study.getByRole("link", { name, exact: true }) : study.getByRole("button", { name, exact: true });
      await chapter("Process").click();
      await expect(study.getByRole("list", { name: project.title + " design decisions" }).locator(":scope > li")).toHaveCount(project.decisions);
      await chapter("Architecture").click();
      const architecture = phone ? study.locator("#chapter-architecture") : study.locator(".pf-rich-chapter");
      await expect(architecture.locator(".pf-system-groups > section")).toHaveCount(3);
      await expect(architecture.getByRole("list", { name: project.title + " architecture flow" }).locator(":scope > li")).toHaveCount(5);
      await expect(architecture.getByText("The boundary", { exact: true })).toBeVisible();
      await expect.poll(() => study.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      if (testInfo.project.name === "desktop" && project.id === "buildstory") await page.screenshot({ path: "docs/design/arjun-os/depth-buildstory-architecture.png" });
    }
  });

  test("case study glass remains readable and respects accessibility preferences", async ({ page }, testInfo) => {
    const phone = testInfo.project.name === "mobile" || testInfo.project.name.startsWith("phone");
    await page.goto("/?app=work&project=buildstory");
    const study = page.locator(".pf-case");
    await (phone ? study.getByRole("link", { name: "Architecture", exact: true }) : study.getByRole("button", { name: "Architecture", exact: true })).click();
    const widget = study.locator(".pf-system-groups > section").first();
    await widget.scrollIntoViewIfNeeded();
    await expect.poll(() => widget.evaluate(el => getComputedStyle(el).backdropFilter)).toContain("blur");
    for (const theme of ["dusk", "dawn"]) {
      if (theme === "dawn") await page.getByRole("button", { name: "Switch to dawn theme", exact: true }).click();
      await expect.poll(() => study.locator(".pf-chapter-nav").locator("a,button").first().evaluate(el => getComputedStyle(el).color)).toBe(theme === "dawn" ? "rgb(81, 81, 87)" : "rgb(185, 185, 193)");
      // Descendants inherit animated theme colors; wait for the visible heading too.
      const architecture = phone ? study.locator("#chapter-architecture") : study.locator(".pf-rich-chapter");
      await expect.poll(() => architecture.locator(".pf-chapter-intro h4").evaluate(el => getComputedStyle(el).color)).toBe(theme === "dawn" ? "rgb(29, 29, 31)" : "rgb(245, 245, 247)");
      const result = await new AxeBuilder({ page }).include(".pf-case").analyze();
      expect(result.violations, theme + " case study accessibility").toEqual([]);
    }
    await page.getByRole("button", { name: "Open accessibility settings", exact: true }).click();
    await page.getByRole("switch", { name: "Reduce transparency", exact: true }).click();
    await expect.poll(() => widget.evaluate(el => getComputedStyle(el).backdropFilter)).toBe("none");
    await expect.poll(() => widget.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(255, 255, 255)");
    await page.getByRole("switch", { name: "High contrast", exact: true }).click();
    await expect.poll(() => widget.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(0, 0, 0)");
    await expect.poll(() => widget.evaluate(el => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
  });

  test("Roadpack goes directly from shared state to the iPad capture", async ({ page }) => {
    await page.goto("/?app=work&project=roadpack");
    await expect(page.locator(".pf-case-writing + .pf-ipad-shot img")).toHaveAttribute("src", /ipad/);
    await expect(page.locator(".roadpack-case .pf-roadpack-lifestyle")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Play Roadpack launch film", exact: true })).toBeVisible();
  });
}
