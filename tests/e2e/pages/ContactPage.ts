import { Page, Locator, expect } from '@playwright/test';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * Contact Page Object Model for Qactus.io
 *
 * This class encapsulates the interactions with the contact page
 * and provides methods to perform actions and assertions.
 */
export class ContactPage {
  readonly page: Page;
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactForm = page.locator('form');
    this.nameInput = page.locator('input[name="name"], input#name');
    this.emailInput = page.locator(
      'input[name="email"], input#email, input[type="email"]'
    );
    this.messageInput = page.locator(
      'textarea[name="message"], textarea#message'
    );
    this.submitButton = page.locator(
      'button[type="submit"], input[type="submit"]'
    );
    this.successMessage = page.locator(
      '.success-message, .alert-success, [data-success]'
    );
    this.errorMessage = page.locator(
      '.error-message, .alert-danger, [data-error]'
    );
  }

  /**
   * Navigate to the contact page
   */
  async goto() {
    await this.page.goto('/contact');
    await TestHelpers.waitForNetworkIdle(this.page);
  }

  /**
   * Fill the contact form with the provided information
   * @param name Name to enter in the form
   * @param email Email to enter in the form
   * @param message Message to enter in the form
   */
  async fillContactForm(name: string, email: string, message: string) {
    if (await this.contactForm.isVisible()) {
      await this.nameInput.fill(name);
      await this.emailInput.fill(email);
      await this.messageInput.fill(message);

      // Take a screenshot of the filled form
      await this.page.screenshot({
        path: './screenshots/contact-form-filled.png',
      });
    } else {
      console.log('Contact form not found on the page');
    }
  }

  /**
   * Submit the contact form
   */
  async submitContactForm() {
    await this.submitButton.click();
    await TestHelpers.waitForNetworkIdle(this.page);

    // Wait for either success or error message
    await Promise.race([
      this.successMessage.waitFor({ timeout: 5000 }).catch(() => {}),
      this.errorMessage.waitFor({ timeout: 5000 }).catch(() => {}),
    ]);

    // Take screenshot after submission
    await this.page.screenshot({
      path: './screenshots/contact-form-submitted.png',
    });
  }

  /**
   * Check if the form submission was successful
   */
  async isSubmissionSuccessful() {
    return await this.successMessage.isVisible();
  }

  /**
   * Check if there was an error during form submission
   */
  async hasSubmissionError() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get the text of the success message
   */
  async getSuccessMessage() {
    if (await this.successMessage.isVisible()) {
      return await this.successMessage.textContent();
    }
    return null;
  }

  /**
   * Get the text of the error message
   */
  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}
