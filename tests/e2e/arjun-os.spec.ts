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

test("AI Island stays on-screen and restores focus after Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByLabel("Ask Arjun", { exact: true });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "AI Island" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.locator('[aria-label="Arjun OS dock"]').evaluate((element) => Boolean(element.closest("[inert]")))).toBe(true);
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(54);
  expect(box!.y + box!.height).toBeLessThanOrEqual(await page.evaluate(() => innerHeight));
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  const closedBox = await trigger.boundingBox();
  expect(closedBox).not.toBeNull();
  expect(Math.abs(closedBox!.x + closedBox!.width / 2 - (await page.evaluate(() => innerWidth / 2)))).toBeLessThanOrEqual(2);
});

test("AI Island artifact pane opens from chat widgetType", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        response: "Here is a look at my projects.",
        microWidgets: [{ type: "quickStats" }],
        widgetPlacement: "after",
        widgetType: "projects",
      }),
    });
  });
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("Show projects");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Artifact", exact: true })).toBeVisible();
  await expect(page.getByText(/Here is a look at my projects/)).toBeVisible();
  await page.getByRole("button", { name: "Close artifact" }).click();
  await expect(page.getByRole("dialog", { name: "AI Island" })).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByLabel("Ask Arjun", { exact: true })).toBeVisible();
});

test("default desktop has no serious automatically detectable accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "covered by the mobile layout test");
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
});

test("mobile exposes its app header below the system rail", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only assertion");
  await page.goto("/?app=work");
  const header = page.getByRole("heading", { name: "Selected Work" }).first();
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(54);
  await expect(page.getByRole("button", { name: "Minimize" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Maximize" })).toHaveCount(0);
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

test("recruiter tour exits back to the previous workspace", async ({ page }) => {
  await page.goto("/?app=research");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByRole("button", { name: "Recruiter tour" }).click();
  await expect(page.getByText(/Recruiter tour 01/)).toBeVisible();
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Research" })).toBeVisible();
  await expect(page).toHaveURL(/app=research/);
});

test("AI failure preserves ordinary navigation", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 500, body: "failed" }));
  await page.goto("/");
  await page.getByLabel("Ask Arjun", { exact: true }).click();
  await page.getByPlaceholder(/Ask about my work/).fill("Tell me about your work");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText(/temporarily unavailable/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Ask Arjun" })).toHaveCount(0);
  await page.getByLabel("Experience", { exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Experience" })).toBeVisible();
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
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByLabel("Calendar")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("arjun-os-widgets-collapsed"))).toBe("true");
  await page.reload();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("arjun-os-widgets-collapsed"))).toBe("true");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("matches the curated shell regression baseline", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) =>
        image.complete ? image.decode().catch(() => undefined) : new Promise<void>((resolve) => image.addEventListener("load", () => resolve(), { once: true })),
      ),
    );
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

  await page.getByRole("button", { name: "Switch to dawn theme" }).click();
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
    await page.goto("/?app=research", { waitUntil: "networkidle" });
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
