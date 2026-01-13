import { test, expect } from "@playwright/test";

test("frontend loads without backend", async ({ page }) => {
  // Navigate to the frontend
  await page.goto("http://localhost:3000");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Check that the main title is present
  await expect(
    page.locator("text=way to distribute enterprise software"),
  ).toBeVisible();

  // Check that the "Backend unavailable" message is shown
  await expect(page.locator("text=Backend unavailable")).toBeVisible();

  // Check that the status section is present
  await expect(page.locator("text=System Status")).toBeVisible();

  // Verify the page title
  expect(await page.title()).toBeTruthy();

  console.log("✓ Frontend loaded successfully without backend!");
});
