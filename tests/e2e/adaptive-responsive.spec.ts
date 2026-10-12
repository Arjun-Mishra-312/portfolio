import { expect, test } from "@playwright/test";
import { registerCaseStudyCoverage } from "./case-study-coverage";

registerCaseStudyCoverage();

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("arjun-os-booted", "true"));
});

test("recent resume projects have readable case studies and working links across devices", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.locator(".pf-recent-products").getByRole("button", { name: /BuildStory/ }).click();
  await expect(page).toHaveURL(/project=buildstory/);
  await expect(page.getByRole("heading", { name: "BuildStory", exact: true }).last()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "BuildStory", exact: true }).last()).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/?app=work&project=mune");
  await expect(page.getByRole("heading", { name: "Mune", exact: true }).last()).toBeVisible();
  if (testInfo.project.name.startsWith("phone")) await page.getByRole("link", { name: "Links", exact: true }).click();
  else await page.getByRole("button", { name: "Links", exact: true }).click();
  const links = testInfo.project.name.startsWith("phone") ? page.locator("#chapter-links") : page.locator(".pf-chapter-body");
  await expect(links.getByRole("link", { name: "Get Mune", exact: true })).toHaveAttribute("href", "https://apps.apple.com/app/mune-private-finance-ai/id6777609206");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("AI Island stays top-aligned on phones and bottom-aligned on iPad", async ({ page }, testInfo) => {
  await page.goto("/");
  const trigger = page.locator('[data-island-mode="idle"][aria-label="Ask Arjun"]');
  await expect(trigger).toBeVisible();
  const viewportHeight = await page.evaluate(() => innerHeight);
  if (testInfo.project.name.startsWith("phone")) {
    await expect.poll(async () => (await trigger.boundingBox())?.y ?? viewportHeight).toBeLessThan(60);
  } else {
    await expect.poll(async () => {
      const box = await trigger.boundingBox();
      return box ? box.y + box.height : 0;
    }).toBeGreaterThan(viewportHeight - 80);
  }
});

test("adaptive shell presents the correct navigation and readable app content", async ({ page }, testInfo) => {
  await page.goto("/");
  const phone = testInfo.project.name.startsWith("phone");
  const portrait = testInfo.project.name.includes("portrait");

  if (phone) {
    const tabs = page.getByRole("navigation", { name: "Portfolio sections" });
    await expect(tabs).toBeVisible();
    await tabs.getByRole("button", { name: "Work" }).click();
    await expect(page.getByRole("heading", { name: "Work" })).toBeVisible();
    await page.getByRole("button", { name: /AI Accessibility Analyzer/ }).click();
    await expect(page.getByRole("button", { name: /Back/ })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    return;
  }

  if (portrait) {
    const sidebar = page.getByRole("complementary", { name: "Portfolio sections" });
    await expect(sidebar).toBeVisible();
    await sidebar.getByRole("button", { name: "Experience" }).click();
    await expect(page.getByRole("heading", { name: "Experience", exact: true }).first()).toBeVisible();
    await sidebar.getByRole("button", { name: "Work" }).click();
    await expect(page.getByRole("heading", { name: "A few things I’ve put into the world." })).toBeVisible();
    await page.getByRole("button", { name: /AI Accessibility Analyzer/ }).click();
    await expect(page.getByRole("heading", { name: "AI Accessibility Analyzer" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Portfolio sections" })).toHaveCount(0);
    return;
  }

  await expect(page.getByLabel("Arjun OS dock")).toBeVisible();
  await page.getByLabel("Work", { exact: true }).click();
  await page.getByLabel("Experience", { exact: true }).click();
  const visibleWindows = page.locator('.os-window:not([aria-hidden="true"])');
  await expect(visibleWindows).toHaveCount(2);
});

test("phone apps scroll, preserve position, and return through the stable Home tab", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("phone"), "phone interaction");
  await page.goto("/");
  const tabs = page.getByRole("navigation", { name: "Portfolio sections" });
  await tabs.getByRole("button", { name: "Life + Play" }).click();
  await expect(page.getByRole("heading", { name: "Life + Play" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Interests", exact: true })).toHaveCount(0);
  const viewport = page.locator(".os-app-viewport");
  await expect.poll(() => viewport.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  const targetScroll = await viewport.evaluate((element) => {
    const target = Math.min(420, element.scrollHeight - element.clientHeight);
    element.scrollTo({ top: target });
    return target;
  });
  expect(targetScroll).toBeGreaterThan(0);
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeCloseTo(targetScroll, 0);
  const savedScroll = await viewport.evaluate((element) => element.scrollTop);
  await tabs.getByRole("button", { name: "Work" }).click();
  await page.getByRole("navigation", { name: "Portfolio sections" }).getByRole("button", { name: "Life + Play" }).click();
  await expect.poll(() => page.locator(".os-app-viewport").evaluate((element) => element.scrollTop)).toBeGreaterThan(savedScroll - 10);
  await page.getByRole("navigation", { name: "Portfolio sections" }).getByRole("button", { name: "Home" }).click();
  await expect(page.getByRole("region", { name: "Vancouver weather" })).toBeVisible();
});

test("phone AI compose expands into a modal full sheet only after submit", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("phone"), "phone interaction");
  await page.route("**/api/chat", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ response: "Arjun combines applied AI engineering with human-centered research." }) }));
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await expect(page.locator("#os-workspace")).not.toHaveAttribute("inert", "");
  await page.getByPlaceholder(/Ask about my work/).fill("Why Arjun?");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  const sheet = page.getByRole("dialog", { name: "AI Island" });
  await expect(sheet).toHaveClass(/os-island-phone-sheet/);
  await expect(page.locator("#os-workspace")).toHaveAttribute("inert", "");
  await expect(page.getByRole("navigation", { name: "Portfolio sections" })).toHaveCount(0);
  const viewportHeight = await page.evaluate(() => innerHeight);
  await expect.poll(async () => (await sheet.boundingBox())?.height ?? 0).toBeGreaterThan(viewportHeight * 0.8);
});

test("phone AI artifacts use a child screen with Back navigation", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("phone"), "phone interaction");
  await page.route("**/api/chat", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ response: "Here is Arjun's GitHub activity.", evidence: { kind: "github-pulse", title: "GitHub Pulse", total: 42, streak: 3, latest: null, status: "ready" } }) }));
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("Show projects");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Evidence", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to answer" }).click();
  await expect(page.getByText("Here is Arjun's GitHub activity.")).toBeVisible();
  await expect(page.getByRole("button", { name: "View evidence" })).toBeVisible();
});

test("phone apps use Files, Notes, Journal, and Photos interaction models", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("phone"), "phone interaction");
  await page.addInitScript(() => sessionStorage.setItem("arjun-os-phone-life-album", JSON.stringify("Interests")));
  await page.goto("/");
  const tabs = page.getByRole("navigation", { name: "Portfolio sections" });
  await tabs.getByRole("button", { name: "Work" }).click();
  await expect(page.getByPlaceholder("Search projects")).toBeVisible();
  await page.getByPlaceholder("Search projects").fill("LLM");
  await expect(page.getByRole("button", { name: /LLM Pro Max/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /AI Accessibility Analyzer/ })).toHaveCount(0);

  await tabs.getByRole("button", { name: "Experience" }).click();
  await expect(page.getByText("Arjun OS · Notes")).toBeVisible();
  await tabs.getByRole("button", { name: "Research" }).click();
  await expect(page.getByText(/Public preprint · September 2026/)).toBeVisible();
  await tabs.getByRole("button", { name: "Life + Play" }).click();
  await expect(page.getByRole("button", { name: "Library", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /^Interests/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Open photograph 1" }).click();
  await expect(page.getByRole("dialog", { name: /Photo 1 of/ })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Life + Play" })).toBeVisible();
});

test("phone dock icons are centered within every tab", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("phone"), "phone layout");
  await page.goto("/");
  const offsets = await page.locator(".os-phone-tab").evaluateAll((tabs) => tabs.map((tab) => {
    const icon = tab.querySelector(".os-dock-tile")!.getBoundingClientRect();
    const button = tab.getBoundingClientRect();
    return Math.abs((icon.left + icon.width / 2) - (button.left + button.width / 2));
  }));
  expect(Math.max(...offsets)).toBeLessThanOrEqual(1);
});

test("Roadpack's film hero and real captures work across adaptive layouts", async ({ page }, testInfo) => {
  await page.goto("/?app=work&project=roadpack");
  await expect(page.getByRole("heading", { name: "Separate cars. One shared adventure." })).toBeVisible();
  const film = page.locator(".pf-media-hero .pf-media-frame");
  await expect.poll(() => film.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const viewport = element.closest(".os-window") ?? element.closest(".os-app-viewport");
    return rect.top >= 0 && rect.bottom <= (viewport?.getBoundingClientRect().bottom ?? innerHeight);
  })).toBe(true);
  if (testInfo.project.name === "phone-large") await page.screenshot({ path: "docs/design/arjun-os/sprint-roadpack-phone.png" });
  await page.getByRole("button", { name: "Pack votes", exact: true }).click();
  await expect(page.getByRole("img", { name: /Roadpack — Pack votes/ })).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByRole("button", { name: "Play Roadpack launch film", exact: true }).click();
  await expect(page.locator("video")).toHaveAttribute("controls", "");
  await expect(page.locator("video")).toBeFocused();
  await expect(page.locator("video source")).toHaveAttribute("src", "/roadpack/launch.mp4");
  await expect.poll(() => page.locator(".roadpack-case").evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Apps that ship. Agents that show their work." })).toBeVisible();
});

test("matches the adaptive shell baseline", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveScreenshot(`adaptive-${testInfo.project.name}.png`, {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: 0.02,
    mask: [page.getByLabel("Vancouver weather"), page.getByLabel("Calendar"), page.locator("time"), page.locator(".os-mobile-widget-carousel")],
  });
});
