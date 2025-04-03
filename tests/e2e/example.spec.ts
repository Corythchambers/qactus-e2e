import { test, expect } from '@playwright/test';

// Example test that verifies the home page loads correctly
test('homepage has correct title and content', async ({ page }) => {
  // Navigate to the root of the application
  await page.goto('/');

  // Expect the page title to contain the app name
  await expect(page).toHaveTitle(/React App/);

  // Expect the page to contain specific content
  await expect(page.locator('main')).toContainText(/Welcome/);
});

// Example test for a login flow
test('user can login', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');

  // Fill in the login form
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'password123');

  // Submit the form
  await page.click('button[type="submit"]');

  // Assert that login was successful
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});

// Example test for checking responsive behavior
test('responsive design works on mobile', async ({ page }) => {
  // Set the viewport size to mobile dimensions
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to the home page
  await page.goto('/');

  // Check that the mobile menu button is visible
  await expect(page.locator('.mobile-menu-button')).toBeVisible();
});
