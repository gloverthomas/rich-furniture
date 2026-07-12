import { test } from "@playwright/test";

const BREAKPOINTS = [
  { name: "320", width: 320, height: 700 },
  { name: "768", width: 768, height: 900 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1440", width: 1440, height: 900 },
] as const;

const PAGES = [
  { name: "home", path: "/" },
  { name: "collection", path: "/collection" },
  { name: "pdp", path: "/product/iggy-dining-table" },
  { name: "about", path: "/about" },
] as const;

for (const bp of BREAKPOINTS) {
  for (const pageDef of PAGES) {
    test(`${pageDef.name} @ ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(pageDef.path, { waitUntil: "domcontentloaded" });
      // let images decode and entrance animations settle (dev-server image
      // optimization makes networkidle unreliable here)
      await page.waitForTimeout(3500);

      // walk the page so every scroll-triggered reveal has fired
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.7;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(1400);
      await page.screenshot({
        path: `screenshots/${pageDef.name}-${bp.name}.png`,
        fullPage: pageDef.name !== "home",
      });

      // horizontal overflow check
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      test.expect(overflow, `horizontal overflow of ${overflow}px`).toBeLessThanOrEqual(1);
    });
  }
}
