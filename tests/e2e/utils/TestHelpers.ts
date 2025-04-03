import { Page } from '@playwright/test';

/**
 * Utility functions for e2e testing
 */
export class TestHelpers {
  /**
   * Wait for page content to load
   * @param page The Playwright page object
   */
  static async waitForNetworkIdle(page: Page) {
    // Use a more reliable approach without timeout
    await page.waitForLoadState('domcontentloaded');
    // Add a specific selector wait instead of timeout
    await page.waitForSelector('body', { state: 'attached' });
  }

  /**
   * Generate a random email address for testing
   * @returns A random email address
   */
  static generateRandomEmail(): string {
    return `test_${Math.floor(Math.random() * 10000)}@example.com`;
  }

  /**
   * Generate a random username for testing
   * @returns A random username
   */
  static generateRandomUsername(): string {
    return `user_${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Take a screenshot with timestamp
   * @param page The Playwright page object
   * @param name The name of the screenshot
   */
  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `./screenshots/${name}_${timestamp}.png` });
  }

  /**
   * Simulate a slow network connection
   * @param page The Playwright page object
   */
  static async simulateSlowNetwork(page: Page) {
    // Add a delay to all network requests
    await page.context().setDefaultTimeout(60000); // Increase timeout for slow connections
    await page.route('**/*', async route => {
      // Wait for a random period before continuing
      await new Promise(resolve =>
        setTimeout(resolve, 100 + Math.floor(Math.random() * 300))
      );
      route.continue();
    });
  }
}
