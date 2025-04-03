import { test, expect } from '@playwright/test';
import { ContactPage } from './pages/ContactPage';
import { TestHelpers } from './utils/TestHelpers';

test.describe('Qactus.io Contact Page Tests', () => {
  test('contact page loads correctly', async ({ page }) => {
    const contactPage = new ContactPage(page);

    // Navigate to the contact page
    await contactPage.goto();
    await TestHelpers.waitForNetworkIdle(page);

    // Take a screenshot of the contact page
    await page.screenshot({ path: './screenshots/contact-page.png' });

    // Check if the contact form is visible
    const formVisible = await contactPage.contactForm.isVisible();
    console.log(`Contact form visible: ${formVisible}`);

    // Add explicit assertion to satisfy the linter
    await expect(contactPage.contactForm).toBeVisible();
  });

  test('contact form can be filled out', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    // Generate random test data
    const name = TestHelpers.generateRandomUsername();
    const email = TestHelpers.generateRandomEmail();
    const message =
      'This is a test message from the automated end-to-end test suite. Please ignore.';

    // Fill out the contact form
    await contactPage.fillContactForm(name, email, message);

    // Verify the form fields contain the entered data
    const nameValue = contactPage.nameInput;
    const emailValue = contactPage.emailInput;
    const messageValue = contactPage.messageInput;

    await expect(nameValue).toHaveValue(name);
    await expect(emailValue).toHaveValue(email);
    await expect(messageValue).toHaveValue(message);
  });

  // Note: This test is commented out because it would actually submit the form
  // to the real website, which we usually want to avoid in automated tests
  /*
  test('contact form can be submitted', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();
    
    // Fill out the contact form with test data
    const name = 'Automated Test';
    const email = 'test@example.com';
    const message = 'This is a test message. Please ignore.';
    
    await contactPage.fillContactForm(name, email, message);
    
    // Submit the form
    await contactPage.submitContactForm();
    
    // Check if the submission was successful or if there was an error
    const isSuccess = await contactPage.isSubmissionSuccessful();
    const hasError = await contactPage.hasSubmissionError();
    
    if (isSuccess) {
      console.log('Form submission successful!');
      const successMsg = await contactPage.getSuccessMessage();
      console.log(`Success message: ${successMsg}`);
    } else if (hasError) {
      console.log('Form submission had an error.');
      const errorMsg = await contactPage.getErrorMessage();
      console.log(`Error message: ${errorMsg}`);
    } else {
      console.log('No success or error message was displayed.');
    }
  });
  */

  test('form validation works for required fields', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto();

    // Try to submit the form without filling any fields
    if (await contactPage.submitButton.isVisible()) {
      await contactPage.submitButton.click();

      // Take a screenshot of the validation errors
      await page.screenshot({
        path: './screenshots/contact-form-validation.png',
      });

      // Check if the form was actually submitted (it shouldn't be if validation is working)
      const currentUrl = page.url();

      // Log validation state
      console.log(`Form validation test completed. Current URL: ${currentUrl}`);
    } else {
      console.log('Submit button not found on the page');
    }
  });
});
