import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home Page Tests', () => {
  test('home page loads correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectLoaded();

    // Add explicit assertion to satisfy the linter
    await expect(homePage.mainContent).toBeVisible();
  });

  test('navigation links work correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to about page
    await homePage.navigateTo('About');
    await expect(page).toHaveURL('/about');

    // Navigate to contact page
    await homePage.navigateTo('Contact');
    await expect(page).toHaveURL('/contact');
  });

  test('mobile menu functions properly', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    await homePage.goto();

    // Check that mobile menu button is visible
    expect(await homePage.isMobileMenuVisible()).toBeTruthy();

    // Toggle mobile menu
    await homePage.toggleMobileMenu();

    // Check that navigation links are now visible
    await expect(homePage.navigationLinks.first()).toBeVisible();
  });
});
