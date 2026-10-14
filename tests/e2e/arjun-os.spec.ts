import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { registerCaseStudyCoverage } from "./case-study-coverage";

registerCaseStudyCoverage();

test("editorial project covers fit the window and retain their case study chapters", async ({ page }, testInfo) => {
  for (const project of [
    { id: "buildstory", title: "BuildStory" },
    { id: "mune", title: "Mune" },
    { id: "ai-accessibility-analyzer", title: "AI Accessibility Analyzer" },
    { id: "llm-pro-max", title: "LLM Pro Max" },
    { id: "re-plate", title: "Re-Plate" },
  ]) {
    await page.goto("/?app=work&project=" + project.id);
    const content = page.locator(".pf-case");
    await expect(content.getByRole("heading", { name: project.title, exact: true })).toBeVisible();
    await expect.poll(() => content.locator(".pf-case-cover img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await expect.poll(() => content.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await expect.poll(() => content.evaluate(element => {
      const window = element.closest(".os-window");
      return window ? getComputedStyle(window).transform : "none";
    })).toBe("none");
    await page.screenshot({ path: "docs/design/arjun-os/refresh-case-" + project.id + "-" + testInfo.project.name + ".png" });
    if (testInfo.project.name === "mobile") await content.getByRole("link", { name: "Architecture", exact: true }).click();
    else await content.getByRole("button", { name: "Architecture", exact: true }).click();
    await expect(content.getByRole("list", { name: project.title + " architecture flow" })).toBeVisible();
  }
});

test("redesigned reading surfaces fit their window and keep their media visible", async ({ page }, testInfo) => {
  for (const surface of [
    { id: "home", url: "/", selector: ".pf-home" },
    { id: "work", url: "/?app=work", selector: ".pf-work-list, .pf-phone-work" },
    { id: "research", url: "/?app=research", selector: ".pf-research" },
    { id: "experience", url: "/?app=experience&role=copperleaf", selector: ".pf-experience-document" },
    { id: "life", url: "/?app=life", selector: ".os-photos-desktop, .os-photos-screen" },
  ]) {
    await page.goto(surface.url);
    const content = page.locator(surface.selector);
    await expect(content).toBeVisible();
    await expect.poll(() => content.evaluate(element => {
      const window = element.closest(".os-window");
      return window ? getComputedStyle(window).transform : "none";
    })).toBe("none");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: "docs/design/arjun-os/refresh-" + surface.id + "-" + testInfo.project.name + ".png" });
    if (surface.id === "life") {
      await page.getByRole("button", { name: /^Builds/ }).click();
      await expect(page.getByRole("button", { name: "Open LEGO McLaren P1 3D model", exact: true }).last()).toBeVisible();
    }
  }
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("arjun-os-booted", "true"));
});

test("resume actions open the updated, byte-identical uploaded PDF", async ({ page, request }) => {
  await page.addInitScript(() => {
    window.open = (url) => { document.documentElement.dataset.resumeUrl = String(url); return null; };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Resume", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-resume-url", "/Resume.pdf?v=2026-10-14");
  const response = await request.get("/Resume.pdf?v=2026-10-14");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(createHash("sha256").update(await response.body()).digest("hex")).toBe("ec84f61fdb231ebd34fcb478b6d0a7c32fe51eb677f4e6ad8336322d062eb373");
});

for (const project of [
  { id: "buildstory", title: "BuildStory", link: "Open-source scanner", href: "https://github.com/Arjun-Mishra-312/buildstory-scan" },
  { id: "mune", title: "Mune", link: "Get Mune", href: "https://apps.apple.com/app/mune-private-finance-ai/id6777609206" },
]) {
  test(`${project.title} opens from Home, survives reload, and exposes its verified links`, async ({ page }, testInfo) => {
    await page.goto("/");
    await page.locator(".pf-recent-products").getByRole("button", { name: new RegExp(project.title) }).click();
    await expect(page).toHaveURL(new RegExp(`project=${project.id}`));
    await expect(page.getByRole("heading", { name: project.title, exact: true }).last()).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: project.title, exact: true }).last()).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (testInfo.project.name === "mobile") await page.getByRole("link", { name: "Links", exact: true }).click();
    else await page.getByRole("button", { name: "Links", exact: true }).click();
    const links = testInfo.project.name === "mobile" ? page.locator("#chapter-links") : page.locator(".pf-chapter-body");
    await expect(links.getByRole("link", { name: project.link, exact: true })).toHaveAttribute("href", project.href);
    if (testInfo.project.name === "desktop" && project.id === "buildstory") {
      await page.getByRole("button", { name: "Overview", exact: true }).click();
      await expect(page.getByText("330+ automated tests", { exact: true })).toBeVisible();
      await expect.poll(() => page.getByRole("dialog", { name: "Selected Work" }).evaluate(element => getComputedStyle(element).transform)).toBe("none");
      await page.screenshot({ path: "docs/design/arjun-os/resume-buildstory.png" });
    }
  });
}

test("resume education and current role are readable, with CHI papers marked as submissions", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByText("Technical skills", { exact: true }).click();
  await expect(page.getByText("BSc Computer Science (AI Specialization)", { exact: true })).toBeVisible();
  await expect(page.getByText("Commerce Minor · Expected May 2027", { exact: true })).toBeVisible();
  await expect(page.locator(".pf-skills-grid")).toContainText("Databricks");
  await expect(page.locator(".pf-skills-grid")).toContainText("MLX Swift");
  await page.goto("/?app=experience&role=copperleaf");
  await expect(page.getByText(/estimated 160\+ employee hours annually/)).toBeVisible();
  await expect(page.getByText(/Oct 2025 – Present/).last()).toBeVisible();
  if (testInfo.project.name === "desktop") {
    await expect.poll(() => page.getByRole("dialog", { name: "Experience" }).evaluate(element => getComputedStyle(element).transform)).toBe("none");
    await page.screenshot({ path: "docs/design/arjun-os/resume-experience.png" });
  }
  await page.goto("/?app=research");
  await expect(page.getByRole("heading", { name: "Research submissions", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "WRAP", exact: true })).toBeVisible();
  await expect(page.getByText("Second author · Submitted to ACM CHI 2027", { exact: true })).toBeVisible();
});

test("Roadpack opens with the launch film and plays it on demand", async ({ page }, testInfo) => {
  const movies: string[] = [];
  page.on("request", request => { if (request.url().endsWith(".mp4")) movies.push(request.url()); });
  await page.goto("/?app=work&project=roadpack");
  await expect(page.getByRole("heading", { name: "Separate cars. One shared adventure." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Roadpack", exact: true }).first()).toHaveAttribute("href", "https://apps.apple.com/app/roadpack-travel-together/id6801922780");
  await expect(page.locator("video")).toHaveCount(0);
  expect(movies).toHaveLength(0);
  await expect(page.getByRole("button", { name: "Join the pack" })).toHaveCount(0);
  const film = page.locator(".pf-media-hero .pf-media-frame");
  await expect.poll(() => film.evaluate(element => {
    const window = element.closest(".os-window");
    return window ? getComputedStyle(window).transform : "none";
  })).toBe("none");
  await expect.poll(() => film.evaluate(element => {
    const frame = element.getBoundingClientRect();
    const viewport = element.closest(".os-window") ?? element.closest(".os-app-viewport");
    return frame.top >= 0 && frame.bottom <= (viewport?.getBoundingClientRect().bottom ?? innerHeight);
  })).toBe(true);
  if (testInfo.project.name === "desktop") await page.screenshot({ path: "docs/design/arjun-os/sprint-roadpack-hero.png" });
  await page.getByRole("button", { name: "Play Roadpack launch film" }).press("Enter");
  await expect(page.locator("video")).toHaveAttribute("controls", "");
  await expect(page.locator("video")).toBeFocused();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2);
  expect(await page.locator("video").evaluate((video: HTMLVideoElement) => video.duration)).toBeCloseTo(64.8, 0);
  await expect(page.locator("video track")).toHaveAttribute("src", "/roadpack/launch-captions.vtt");
  await expect.poll(() => page.locator("video track").evaluate((track: HTMLTrackElement) => track.readyState)).toBe(2);
  expect(await page.locator("video track").evaluate((track: HTMLTrackElement) => track.track.cues?.length ?? 0)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Visit the website", exact: true }).focus();
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Apps that ship. Agents that show their work." })).toBeVisible();
});

test("home highlights recent work and the research walkthrough exposes its limits", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Apps that ship. Agents that show their work." })).toBeVisible();
  if (testInfo.project.name === "desktop") {
    await expect.poll(() => page.getByRole("dialog", { name: "About Arjun" }).evaluate(element => getComputedStyle(element).transform)).toBe("none");
    await page.screenshot({ path: "docs/design/arjun-os/sprint-home.png" });
  }
  await page.getByRole("button", { name: /Can an AI audit/ }).click();
  await expect(page.getByRole("heading", { name: "Accessibility audits that show their work." })).toBeVisible();
  await expect(page.locator(".pf-research-metrics").getByText("56%", { exact: true })).toBeVisible();
  await expect(page.getByText(/not a guarantee for every website/)).toBeVisible();
  for (let step = 0; step < 3; step++) await page.getByRole("button", { name: "Next step", exact: true }).press("Enter");
  await expect(page.getByRole("link", { name: "Inspect the source trace" })).toBeFocused();
  await expect(page.getByText(/individual image correctness was not independently adjudicated/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Inspect the source trace" })).toHaveAttribute("href", /worked_trace.json/);
});

for (const surface of [
  { name: "Home", url: "/", selector: ".pf-home" },
  { name: "Roadpack", url: "/?app=work&project=roadpack", selector: ".roadpack-case" },
  { name: "Research", url: "/?app=research", selector: ".pf-research" },
  { name: "Work", url: "/?app=work", selector: ".pf-work-list, .pf-phone-work" },
  { name: "Experience", url: "/?app=experience&role=copperleaf", selector: ".pf-experience-document" },
  { name: "Life", url: "/?app=life", selector: ".os-photos-desktop, .os-photos-screen" },
]) {
  for (const theme of ["dusk", "dawn"]) {
    test(`${surface.name} has no serious automatically detectable accessibility violations in ${theme}`, async ({ page }) => {
      await page.goto(surface.url);
      await expect(page.locator(surface.selector)).toBeVisible();
      if (theme === "dawn") await page.getByRole("button", { name: "Switch to dawn theme" }).click();
      // Wait for the window animation before checking rendered color contrast.
      await expect.poll(() => page.locator(surface.selector).evaluate(element => {
        const window = element.closest(".os-window");
        return window ? getComputedStyle(window).opacity : "1";
      })).toBe("1");
      // Theme colors transition independently of the opening window.
      await expect(page.locator(surface.selector)).toHaveCSS("background-color", theme === "dawn" ? "rgb(245, 245, 247)" : "rgb(28, 28, 30)");
      await expect(page.locator(surface.selector).locator(".pf-eyebrow, .os-phone-eyebrow").first()).toHaveCSS("color", theme === "dawn" ? "rgb(104, 104, 112)" : "rgb(164, 164, 173)");
      if (surface.name === "Home") await page.getByText("Technical skills", { exact: true }).click();
      const results = await new AxeBuilder({ page }).include(surface.selector).analyze();
      const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
      expect(serious.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, reason: node.failureSummary })) }))).toEqual([]);
    });
  }
}

test("navigates canonical app states and restores them with browser history", async ({ page }) => {
  await page.goto("/?app=profile");
  await page.getByLabel("Work", { exact: true }).click();
  await expect(page).toHaveURL(/app=work/);
  await page.getByRole("button", { name: /AI Accessibility Analyzer/i }).click();
  await expect(page).toHaveURL(/project=ai-accessibility-analyzer/);
  await page.goBack();
  await expect(page).toHaveURL(/app=work/);
  await expect(page).not.toHaveURL(/project=/);
  await page.goBack();
  await expect(page).toHaveURL("/");
});

test("AI Island stays on-screen and restores focus after Escape", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const trigger = page.locator('[data-island-mode="idle"][aria-label="Ask Arjun"]');
  const idleBox = await trigger.boundingBox();
  expect(idleBox).not.toBeNull();
  expect(idleBox!.y).toBeGreaterThanOrEqual(0);
  if (testInfo.project.name === "mobile") await expect.poll(async () => {
    const settled = await trigger.boundingBox();
    return settled ? settled.y + settled.height : Number.POSITIVE_INFINITY;
  }).toBeLessThanOrEqual(54);
  else expect(idleBox!.y + idleBox!.height).toBeGreaterThan((await page.evaluate(() => innerHeight)) - 80);
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "AI Island" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.locator("#os-workspace").evaluate((element) => element.hasAttribute("inert"))).toBe(false);
  await expect.poll(async () => (await dialog.boundingBox())?.y ?? 0).toBeGreaterThanOrEqual(testInfo.project.name === "mobile" ? 54 : 0);
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(testInfo.project.name === "mobile" ? 54 : 0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(await page.evaluate(() => innerHeight));
  await page.keyboard.press("Escape");
  await expect(trigger).toBeVisible({ timeout: 500 });
  await expect(trigger).toBeFocused();
  await expect.poll(async () => {
    const settledBox = await trigger.boundingBox();
    return settledBox ? settledBox.y + settledBox.height : Number.POSITIVE_INFINITY;
  }).toBeLessThanOrEqual(testInfo.project.name === "mobile" ? 54 : await page.evaluate(() => innerHeight));
  const closedBox = await trigger.boundingBox();
  expect(closedBox).not.toBeNull();
  if (testInfo.project.name === "mobile") expect(closedBox!.y + closedBox!.height).toBeLessThanOrEqual(54);
  else expect(closedBox!.y + closedBox!.height).toBeGreaterThan((await page.evaluate(() => innerHeight)) - 80);
  expect(Math.abs(closedBox!.x + closedBox!.width / 2 - (await page.evaluate(() => innerWidth / 2)))).toBeLessThanOrEqual(2);
});

test("AI Island evidence pane opens from chat evidence payload", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Evidence side pane is desktop/tablet layout");
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        response: "Here is my recent GitHub pulse.",
        actions: [{ id: "1", label: "Show GitHub Pulse", type: "focus-widget", widgetId: "github-pulse" }],
        evidence: {
          kind: "github-pulse",
          title: "GitHub Pulse",
          total: 42,
          streak: 3,
          latest: null,
          status: "ready",
        },
      }),
    });
  });
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("Show github activity");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Evidence", exact: true })).toBeVisible();
  await expect(page.getByText(/Here is my recent GitHub pulse/)).toBeVisible();
  await page.getByRole("button", { name: "Close evidence" }).click();
  await expect(page.getByRole("dialog", { name: "AI Island" })).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByLabel("Ask Arjun", { exact: true })).toBeVisible();
});

test("AI Island auto-opens Life + Play for fun questions", async ({ page }, testInfo) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        response: "For fun I build LEGO Technic sets, hike, and take photos around Vancouver.",
        actions: [
          { id: "1", label: "Open Life + Play", type: "open-app", appId: "life" },
          { id: "2", label: "Open Resume", type: "open-resume" },
        ],
      }),
    });
  });
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("What do you like to do for fun?");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText(/For fun I build LEGO/)).toBeVisible();
  await expect.poll(() => page.url()).toMatch(/app=life/);
  if (testInfo.project.name !== "mobile") {
    await page.getByRole("button", { name: "Close AI Island" }).click();
    await expect(page.getByRole("dialog", { name: "Life + Play" })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: /^Interests/ })).toHaveCount(0);
});

test("default desktop has no serious automatically detectable accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "covered by the mobile layout test");
  await page.goto("/");
  // Spotify owns the cross-origin embed document. Its internal ARIA tree is not
  // actionable from this app, so audit the portfolio surface around it.
  const results = await new AxeBuilder({ page })
    .exclude('iframe[title="Focus Radio Spotify player"]')
    .analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});

test("desktop activity stack switches while social and weather cards stay independent", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop widget deck coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // The foreground Home window can cover the widget rail. Minimize it before
  // interacting with the background desktop, as a visitor would.
  await page.getByRole("dialog", { name: "About Arjun" }).getByRole("button", { name: "Minimize", exact: true }).click();
  await expect(page.getByRole("region", { name: "Vancouver weather and today's date" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Focus Radio" })).toBeVisible();
  const spotify = page.locator('iframe[title="Focus Radio Spotify player"]');
  await expect(spotify).toHaveAttribute("src", /embed\/playlist/);
  await expect(spotify).toHaveAttribute("height", "352");
  await expect(page.getByLabel("GitHub Pulse", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "LinkedIn Connect" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Coffee Chat" })).toHaveCount(0);
  await expect(page.getByLabel("Calendar")).toHaveCount(0);
  await expect(page.getByLabel("Arjun Pass")).toHaveCount(0);
  await expect(page.getByLabel("Leave Arjun a private note")).toHaveCount(0);
  await page.getByRole("tab", { name: "Show Devpost Launchpad" }).click();
  await expect(page.getByLabel("Devpost Launchpad")).toBeVisible();
  await page.getByRole("tab", { name: "Show GitHub Pulse" }).click();
  await expect(page.getByLabel("GitHub Pulse", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Show Coffee Chat" }).click();
  await expect(page.getByRole("region", { name: "Coffee Chat" })).toBeVisible();
  await page.getByRole("tab", { name: "Show LinkedIn Connect" }).click();
  await expect(page.getByRole("region", { name: "LinkedIn Connect" })).toBeVisible();
});

test("desktop widgets use a responsive single-column rail with natural card sizes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop widget sizing coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const panel = page.locator("#desktop-widget-stack");
  await expect(panel).toBeVisible();
  const mediumSlots = panel.locator(":scope > .os-widget-medium-slot");
  await expect(mediumSlots).toHaveCount(4);
  const boxes = await mediumSlots.evaluateAll((items) => items.map((item) => ({
    width: item.clientWidth,
    height: item.clientHeight,
    x: item.getBoundingClientRect().x,
  })));
  // Medium family: content-height, not forced 1:1 squares
  expect(boxes.every((box) => box.width > 0 && box.height > 0)).toBe(true);
  expect(boxes.every((box) => Math.abs(box.width - box.height) > 1)).toBe(true);
  expect(new Set(boxes.map((box) => Math.round(box.x))).size).toBe(1);
  await expect(panel.locator(":scope > .os-widget-compact-slot")).toHaveCount(0);
  await expect(panel.locator(":scope > .os-widget-player-slot")).toHaveCount(1);
  expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  const roomyWidth = await page.locator(".os-widget-deck").evaluate((element) => element.getBoundingClientRect().width);
  await page.setViewportSize({ width: 1280, height: 720 });
  const constrainedWidth = await page.locator(".os-widget-deck").evaluate((element) => element.getBoundingClientRect().width);
  expect(constrainedWidth).toBeLessThan(roomyWidth);
});

test("desktop removes the system rail and places controls in the right dock", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop shell coverage");
  await page.goto("/");
  await expect(page.locator("header.os-top-rail")).toHaveCount(0);
  const dock = page.getByLabel("Arjun OS dock");
  await expect(dock.getByLabel(/Switch to .* theme/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
  await dock.getByLabel("Open accessibility settings").click();
  await expect(page.getByRole("region", { name: "Accessibility" })).toBeVisible();
});

test("mobile home exposes the connected swipe carousel", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only coverage");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Around the web" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Focus Radio" })).toBeVisible();
  await expect(page.getByRole("region", { name: "GitHub Pulse" })).toBeAttached();
  await expect(page.getByLabel("Calendar")).toHaveCount(0);
  await expect(page.locator(".os-phone-home-shortcuts")).toHaveCount(0);
});

test("reduce transparency keeps the window blur layer stable while its background animates", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop window surface coverage");
  await page.goto("/");
  const window = page.getByRole("dialog", { name: "About Arjun" });
  const filterBefore = await window.evaluate((element) => getComputedStyle(element).backdropFilter);

  await page.getByRole("button", { name: "Open accessibility settings" }).click();
  await page.getByRole("switch", { name: "Reduce transparency" }).click();

  await expect.poll(() => window.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(28, 28, 30)");
  await expect.poll(() => window.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe(filterBefore);
});

test("high contrast and reduce transparency use a coherent palette together", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop surface palette coverage");
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dawn theme" }).click();
  await page.getByRole("button", { name: "Open accessibility settings" }).click();
  await page.getByRole("switch", { name: "Reduce transparency" }).click();
  await page.getByRole("switch", { name: "High contrast" }).click();

  const window = page.getByRole("dialog", { name: "About Arjun" });
  await expect.poll(() => window.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(0, 0, 0)");
  await expect.poll(() => window.evaluate((element) => getComputedStyle(element).color)).toBe("rgb(255, 255, 255)");
  await expect.poll(() => page.getByLabel("Arjun OS dock").evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(0, 0, 0)");
});

test("mobile exposes its app screen and native tab bar below the system rail", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only assertion");
  await page.goto("/?app=work");
  const header = page.getByRole("heading", { name: "Work", exact: true }).first();
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(54);
  await expect(page.getByRole("button", { name: "Minimize" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Maximize" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Portfolio sections" })).toBeVisible();
});

test("desktop window keyboard and dock lifecycle remains usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop window mechanics");
  await page.goto("/");
  await page.getByLabel("Work", { exact: true }).click();
  const workWindow = page.getByRole("dialog", { name: "Selected Work" });
  await expect(workWindow).toBeVisible();
  const titleRail = workWindow.getByLabel(/Selected Work window controls/);
  await expect.poll(() => workWindow.evaluate(element => getComputedStyle(element).transform)).toBe("none");
  const original = await workWindow.boundingBox();
  const rail = await titleRail.boundingBox();
  await page.mouse.move(rail!.x + 220, rail!.y + rail!.height / 2);
  await page.mouse.down();
  await page.mouse.move(rail!.x + 250, rail!.y + rail!.height / 2 + 20, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => (await workWindow.boundingBox())!.x).toBeCloseTo(original!.x + 30, 0);
  await expect.poll(async () => (await workWindow.boundingBox())!.y).toBeCloseTo(original!.y + 20, 0);
  await titleRail.focus();
  await page.keyboard.press("Alt+ArrowRight");
  // The right dock reserves part of the viewport. Assert right-side placement
  // and half-width sizing after the opening animation, not an old pixel offset.
  const viewportWidth = page.viewportSize()!.width;
  await expect.poll(async () => (await workWindow.boundingBox())?.x ?? 0).toBeGreaterThan(viewportWidth * 0.45);
  await expect.poll(async () => (await workWindow.boundingBox())?.width ?? viewportWidth).toBeLessThan(viewportWidth / 2);
  await page.keyboard.press("Alt+Enter");
  await expect(workWindow.getByRole("button", { name: "Restore" })).toBeVisible();
  await page.keyboard.press("Alt+m");
  const minimized = page.locator('.os-window[aria-hidden="true"]').filter({ has: page.locator('#window-title-work') });
  await expect(minimized).toHaveAttribute("inert", "");
  await expect.poll(() => minimized.evaluate(element => getComputedStyle(element).opacity)).toBe("0");
  const target = await page.locator("#dock-work").boundingBox();
  const tuckedAway = await minimized.boundingBox();
  expect(Math.abs(tuckedAway!.x + tuckedAway!.width / 2 - target!.x - target!.width / 2)).toBeLessThan(8);
  expect(Math.abs(tuckedAway!.y + tuckedAway!.height / 2 - target!.y - target!.height / 2)).toBeLessThan(8);
  await page.getByLabel("Work", { exact: true }).click();
  await expect(workWindow).toBeVisible();
  await expect.poll(() => workWindow.evaluate(element => getComputedStyle(element).transform)).toBe("none");
  const beforeMinimize = await workWindow.boundingBox();
  await workWindow.getByRole("button", { name: "Minimize", exact: true }).click();
  await expect.poll(() => minimized.evaluate(element => getComputedStyle(element).opacity)).toBe("0");
  await page.getByLabel("Work", { exact: true }).click();
  await expect.poll(() => workWindow.evaluate(element => getComputedStyle(element).transform)).toBe("none");
  const restored = await workWindow.boundingBox();
  expect(restored!.x).toBeCloseTo(beforeMinimize!.x, 0);
  expect(restored!.y).toBeCloseTo(beforeMinimize!.y, 0);
  expect(restored!.width).toBeCloseTo(beforeMinimize!.width, 0);
  await workWindow.getByRole("button", { name: "Close" }).click();
  await expect(workWindow).toBeHidden();
});

test("recruiter tour exits back to the previous workspace", async ({ page }, testInfo) => {
  await page.goto("/?app=research");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByRole("button", { name: "Recruiter tour" }).click();
  await expect(page.getByText(/Recruiter tour 01/)).toBeVisible();
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  if (testInfo.project.name === "mobile") await expect(page.getByRole("region", { name: "Research", exact: true })).toBeVisible();
  else await expect(page.getByRole("dialog", { name: "Research" })).toBeVisible();
  await expect(page).toHaveURL(/app=research/);
});

test("AI failure preserves ordinary navigation", async ({ page }, testInfo) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 500, body: "failed" }));
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("Tell me about your work");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText(/temporarily unavailable/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Ask Arjun" })).toHaveCount(0);
  await page.getByLabel("Experience", { exact: true }).click();
  if (testInfo.project.name === "mobile") await expect(page.getByRole("region", { name: "Experience" })).toBeVisible();
  else await expect(page.getByRole("dialog", { name: "Experience" })).toBeVisible();
});

test("dawn semantic colors retain readable contrast", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "token coverage is viewport-independent");
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dawn theme" }).click();
  const ratios = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const parse = (value: string) => {
      const hex = value.trim().replace("#", "");
      return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
    };
    const luminance = ([r, g, b]: number[]) => {
      const linear = [r, g, b].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const contrast = (foreground: string) => {
      const light = luminance([255, 255, 255]);
      const dark = luminance(parse(foreground));
      return (light + 0.05) / (dark + 0.05);
    };
    return [
      "--os-text-secondary",
      "--os-text-muted",
      "--os-accent-cyan-text",
      "--os-accent-mint-text",
      "--os-accent-amber-text",
    ].map((token) => ({ token, ratio: contrast(root.getPropertyValue(token)) }));
  });
  expect(ratios.every(({ ratio }) => ratio >= 4.5)).toBe(true);
});

test("reduced motion skips boot and window travel", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "covered once at desktop size");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/?app=work&project=roadpack");
  await expect(page.locator(".os-boot")).toBeHidden();
  await expect(page.getByRole("button", { name: "Play Roadpack launch film" })).toBeVisible();
  const window = page.getByRole("dialog", { name: "Selected Work" });
  await expect.poll(() => window.evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  const before = await window.boundingBox();
  await window.getByRole("button", { name: "Minimize", exact: true }).click();
  const minimized = page.locator('.os-window[aria-hidden="true"]').filter({ has: page.locator('#window-title-work') });
  await expect.poll(() => minimized.evaluate(element => getComputedStyle(element).opacity)).toBe("0");
  const after = await minimized.boundingBox();
  expect(after!.x).toBeCloseTo(before!.x, 0);
  expect(after!.y).toBeCloseTo(before!.y, 0);
  expect(after!.width).toBeCloseTo(before!.width, 0);
  await context.close();
});

test("boot plays once per session on ordinary visits", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "session behavior is viewport-independent");
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".os-boot")).toBeVisible();
  await expect(page.locator(".os-boot")).toBeHidden({ timeout: 5000 });
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("arjun-os-booted"))).toBe("true");
  await page.reload();
  await expect(page.locator(".os-boot")).toBeHidden();
  await context.close();
});

test("theme and accessibility overrides are explicit and persistent", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Switch to dawn theme/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-arjun-theme", "dawn");
  await page.getByRole("button", { name: "Open accessibility settings" }).click();
  await page.getByRole("switch", { name: "Reduce transparency" }).click();
  await page.getByRole("switch", { name: "High contrast" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-reduce-transparency", "true");
  await expect(page.locator("html")).toHaveAttribute("data-high-contrast", "true");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--os-text-secondary").trim())).toBe("#ffffff");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-arjun-theme", "dawn");
  await expect(page.locator("html")).toHaveAttribute("data-high-contrast", "true");
});

test("widget stack collapse is animated, accessible, and session-scoped", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop widgets are represented inside Mobile Home");
  await page.goto("/?app=profile");
  const toggle = page.getByRole("button", { name: "Widgets", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const rail = page.locator("#desktop-widget-stack");
  const mediumSlots = rail.locator(":scope > .os-widget-medium-slot");
  await expect(mediumSlots).toHaveCount(4);
  await expect(rail.locator(":scope > .os-widget-compact-slot")).toHaveCount(0);
  await expect(rail.locator(":scope > .os-widget-player-slot")).toHaveCount(1);
  const geometry = await mediumSlots.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
  }));
  expect(new Set(geometry.map(({ width }) => width)).size).toBe(1);
  expect(geometry.every(({ width, height }) => Math.abs(width - height) > 1)).toBe(true);
  expect(new Set(geometry.map(({ x }) => x)).size).toBe(1);
  await expect.poll(() => rail.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 520 });
  await expect(rail).toHaveClass(/os-widget-scroll-masked/);
  await rail.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect(rail).not.toHaveClass(/os-widget-scroll-masked/);
  await expect(page.getByRole("tab", { name: "Show Devpost Launchpad" })).toHaveAttribute("aria-selected", "false");
  await page.getByRole("tab", { name: "Show Devpost Launchpad" }).click();
  await expect(page.getByRole("tabpanel", { name: "Show Devpost Launchpad" })).toBeVisible();
  await page.getByRole("tab", { name: "Show GitHub Pulse" }).click();
  await expect(page.getByRole("tabpanel", { name: "Show GitHub Pulse" })).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByLabel("Calendar")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("arjun-os-widgets-collapsed"))).toBe("true");
  await page.reload();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("arjun-os-widgets-collapsed"))).toBe("true");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("mobile connected widgets retain the four-card deck without forced squares", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile carousel coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const slots = page.locator(".os-mobile-widget-carousel > div");
  await expect(slots).toHaveCount(4);
  await expect(page.locator(".os-mobile-widget-carousel > div.aspect-square")).toHaveCount(0);
  await expect(page.getByRole("tablist", { name: "Choose activity widget" })).toBeAttached();
  await expect(page.getByRole("tablist", { name: "Choose social widget" })).toBeAttached();
  const carousel = page.locator(".os-mobile-widget-carousel");
  await expect(carousel.getByRole("region", { name: "Vancouver weather and today's date" })).toBeAttached();
  await expect(carousel.getByRole("region", { name: "LinkedIn Connect" })).toBeAttached();
  await expect(carousel.getByRole("region", { name: "Focus Radio" })).toHaveCount(0);
  await expect(page.locator(".os-mobile-focus-slot").getByRole("region", { name: "Focus Radio" })).toBeVisible();
});

test("matches the curated shell regression baseline", async ({ page }, testInfo) => {
  // Keep paired-widget auto-rotation and decorative motion from changing the
  // captured state while the visual suite moves between themes.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await Promise.race([
      Promise.all(Array.from(document.images).map((image) =>
        image.complete
          ? image.decode().catch(() => undefined)
          : new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
      )),
      new Promise<void>((resolve) => window.setTimeout(resolve, 3000)),
    ]);
  });
  await expect(page).toHaveScreenshot("default-shell.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: testInfo.project.name === "mobile" ? 0.05 : 0.015,
    mask: [
      page.getByLabel("Calendar"),
      page.getByLabel("Vancouver weather"),
      page.locator("time"),
    ],
  });

  const themeToggle = page.getByRole("button", { name: "Switch to dawn theme" });
  await themeToggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-arjun-theme", "dawn");
  await expect(page).toHaveScreenshot("dawn-shell.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: testInfo.project.name === "mobile" ? 0.05 : 0.015,
    mask: [
      page.getByLabel("Calendar"),
      page.getByLabel("Vancouver weather"),
      page.locator("time"),
    ],
  });

  if (testInfo.project.name === "desktop") {
    await page.goto("/?app=research", { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => undefined)));
    });
    await expect(page).toHaveScreenshot("dawn-research.png", {
      animations: "disabled",
      fullPage: true,
      maxDiffPixelRatio: 0.015,
      mask: [page.getByLabel("Calendar"), page.getByLabel("Vancouver weather"), page.locator("time")],
    });
  }
});
