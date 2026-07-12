import { test, expect } from "@playwright/test";

test.describe("shopping flow", () => {
  test("browse collection, open a product, add to cart, see it in the drawer", async ({ page }) => {
    await page.goto("/collection");
    await expect(page.locator("h1")).toContainText("The Collection");

    await page.getByRole("link", { name: /Iggy Oval Dining Table/ }).click();
    await expect(page.locator("h1")).toContainText("Iggy Oval Dining Table");

    // pick a non-default finish and check the price responds
    await page.getByRole("radio", { name: "Smoked Oak" }).click();
    await expect(page.getByRole("radio", { name: "Smoked Oak" })).toHaveAttribute("aria-checked", "true");

    await page.getByRole("button", { name: "Add to cart" }).click();

    const drawer = page.getByRole("dialog", { name: "Shopping cart" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText("Iggy Oval Dining Table");
    await expect(drawer).toContainText("Smoked Oak / 200 cm");
    // 29800 base + 2400 smoked oak
    await expect(drawer).toContainText("32.200");

    // quantity up, subtotal doubles
    await drawer.getByRole("button", { name: /Increase quantity/ }).click();
    await expect(drawer).toContainText("64.400");
  });

  test("cart persists across a reload", async ({ page }) => {
    await page.goto("/product/sam-side-table");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("dialog", { name: "Shopping cart" })).toBeVisible();

    await page.reload();
    const count = page.locator("header").getByRole("button", { name: /Cart/ });
    await expect(count).toContainText("1");
  });

  test("category filter narrows the grid", async ({ page }) => {
    await page.goto("/collection?category=coffee");
    const cards = page.locator('section[aria-label="Products"] a');
    await expect(cards).toHaveCount(3);
    await expect(page.locator("main")).toContainText("Steve Coffee Table");
    await expect(page.locator("main")).not.toContainText("Iggy Oval Dining Table");
  });

  test("landing hero loads with navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("inherited");
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  // test.use({ reducedMotion }) does not apply in Playwright 1.61; emulate per page
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("content is fully visible without animation", async ({ page }) => {
    await page.goto("/");

    // no smooth-scroll hijack
    const lenisActive = await page.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    );
    expect(lenisActive).toBe(false);

    // no transition veil lingering
    await expect(page.locator(".page-veil")).toBeHidden();

    // hero copy is readable immediately
    await expect(page.locator("h1")).toContainText("inherited");

    // deep content (craft chapters) visible when scrolled to
    await page.locator("[data-craft-chapter='2']").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-craft-chapter='2']")).toBeVisible();
    const opacity = await page
      .locator("[data-craft-chapter='2'] h3")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });
});
