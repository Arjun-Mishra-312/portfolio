import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("arjun-os-booted", "true"));
});

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
    await expect(page.getByRole("dialog", { name: "Life + Play" })).toBeVisible();
  }
});

test("default desktop has no serious automatically detectable accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "covered by the mobile layout test");
  await page.goto("/");
  // Spotify owns the cross-origin embed document. Its internal ARIA tree is not
  // actionable from this app, so audit the portfolio surface around it.
  const results = await new AxeBuilder({ page })
    .exclude('iframe[title="Lofi Girl focus playlist on Spotify"]')
    .analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});

test("desktop activity stack switches while social and weather cards stay independent", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop widget deck coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
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
  await expect(mediumSlots).toHaveCount(3);
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
  const skipIntro = page.getByRole("button", { name: "Skip intro" });
  if (await skipIntro.isVisible()) await skipIntro.click();
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

  await expect.poll(() => window.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(13, 21, 32)");
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
  await titleRail.focus();
  await page.keyboard.press("Alt+ArrowRight");
  const snapped = await workWindow.boundingBox();
  expect(snapped!.x).toBeGreaterThan(700);
  await page.keyboard.press("Alt+Enter");
  await expect(workWindow.getByRole("button", { name: "Restore" })).toBeVisible();
  await page.keyboard.press("Alt+m");
  await expect(workWindow).toBeHidden();
  await page.getByLabel("Work", { exact: true }).click();
  await expect(workWindow).toBeVisible();
  await workWindow.getByRole("button", { name: "Close" }).click();
  await expect(workWindow).toBeHidden();
});

test("Experience Lab exposes both approved experience bundles", async ({ page }, testInfo) => {
  await page.goto("/?app=lab");
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("region", { name: "Experience Lab" })).toBeVisible();
  } else {
    await expect(page.getByRole("dialog", { name: "Experience Lab" })).toBeVisible();
  }

  await expect(page.getByTestId("lab-finder")).toBeVisible();
  await page.getByRole("button", { name: /^Portal/ }).click();
  await expect(page.getByTestId("lab-portal")).toBeVisible();
  await page.getByLabel("Portal address").fill("https://github.com.evil.example/profile");
  await page.getByLabel("Go to address").click();
  await expect(page.getByRole("heading", { name: "Destination not allowlisted" })).toBeVisible();

  await page.getByRole("button", { name: /^Systems Lab/ }).click();
  await expect(page.getByTestId("lab-systems")).toBeVisible();
  await page.getByRole("button", { name: "Inject safe failure" }).click();
  await expect(page.getByText("DEGRADED", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /^Recruiter Mode/ }).click();
  await expect(page.getByTestId("lab-recruiter")).toBeVisible();
  await expect(page.getByText("Runs locally")).toBeVisible();

  await page.getByRole("button", { name: /^A11y Lab/ }).click();
  await expect(page.getByTestId("lab-a11y")).toBeVisible();
  await page.getByRole("button", { name: "Apply all fixes" }).click();
  await expect(page.getByText("AA ready")).toBeVisible();

  await page.getByRole("button", { name: /^Memory Graph/ }).click();
  await expect(page.getByTestId("lab-memory")).toBeVisible();
  await expect(page.getByText("Arjun’s memory graph")).toBeVisible();
});

test("recruiter tour exits back to the previous workspace", async ({ page }, testInfo) => {
  await page.goto("/?app=research");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByRole("button", { name: "Recruiter tour" }).click();
  await expect(page.getByText(/Recruiter tour 01/)).toBeVisible();
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  if (testInfo.project.name === "mobile") await expect(page.getByRole("region", { name: "Research" })).toBeVisible();
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

test("reduced motion skips boot and continuous model animation", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "covered once at desktop size");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/?app=life");
  await expect(page.locator(".os-boot")).toBeHidden();
  await expect(page.locator("[data-model-animated]")).toHaveAttribute("data-model-animated", "false");
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
  await expect(mediumSlots).toHaveCount(3);
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
