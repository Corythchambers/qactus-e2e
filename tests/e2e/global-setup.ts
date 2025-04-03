import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');

  // Create the screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, '../../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log(`Created screenshots directory: ${screenshotsDir}`);
  }

  // Example of pre-authentication if needed
  // This would allow tests to start in an authenticated state
  if (process.env.AUTHENTICATE_TESTS === 'true') {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto(`${config.projects[0]?.use?.baseURL}/login`);

    // Login with test credentials
    await page.fill(
      'input[name="username"]',
      process.env.TEST_USERNAME || 'testuser'
    );
    await page.fill(
      'input[name="password"]',
      process.env.TEST_PASSWORD || 'password123'
    );
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForURL('**/dashboard');

    // Save the authentication state to a file
    await page
      .context()
      .storageState({ path: path.join(__dirname, 'auth-state.json') });

    await browser.close();
    console.log('Authentication completed successfully');
  }

  console.log('Global setup completed');
}

export default globalSetup;
