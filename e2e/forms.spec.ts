import { test, expect } from "@playwright/test";

// Both API routes simulate success in development when RESEND_API_KEY is
// absent, so these flows are fully testable without credentials.

test.describe("bespoke enquiry", () => {
  test("submits an enquiry and shows the confirmation", async ({ page }) => {
    await page.goto("/bespoke");
    await expect(page.locator("h1")).toContainText("Commission");

    await page.getByLabel("Your name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Where in the world").fill("Sydney, Australia");
    await page.getByLabel("Starting point").selectOption("Iggy Oval Dining Table");
    await page.getByLabel("What are you imagining?").fill("A 240cm oval table in smoked oak.");

    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.getByRole("status")).toContainText("Received");
  });

  test("client-side validation blocks an empty submit", async ({ page }) => {
    await page.goto("/bespoke");
    await page.getByRole("button", { name: "Send enquiry" }).click();

    // Native required validation keeps the form on screen
    await expect(page.getByLabel("Your name")).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
  });
});

test.describe("footer signup", () => {
  test("subscribes an email from the footer", async ({ page }) => {
    await page.goto("/about");

    const email = page.getByLabel("Letters from the workshop");
    await email.scrollIntoViewIfNeeded();
    await email.fill("subscriber@example.com");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByRole("status")).toContainText("Welcome aboard");
  });
});
