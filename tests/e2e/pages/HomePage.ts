import { Page, Locator, expect } from '@playwright/test';

/**
 * Home Page Object Model for Qactus SDET/QAAE Portfolio Website
 *
 * This class encapsulates the interactions with the portfolio website home page
 * and provides methods to perform actions and assertions.
 */
export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly navigationBar: Locator;
  readonly navigationLinks: Locator;
  readonly mainContent: Locator;
  readonly themeToggle: Locator;
  readonly heroSection: Locator;
  readonly aboutSection: Locator;
  readonly projectsSection: Locator;
  readonly blogSection: Locator;
  readonly contactSection: Locator;
  readonly logoImage: Locator;
  readonly footerLinks: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1, h2').first();
    this.navigationBar = page.locator('header, nav');
    this.navigationLinks = page.locator('nav a, header a');
    this.mainContent = page.locator('main, [role="main"], .chakra-container');
    this.themeToggle = page.locator(
      'button[aria-label*="theme" i], button[aria-label*="mode" i], button.chakra-button:has(svg)'
    );

    // Mobile menu button locator
    this.mobileMenuButton = page.locator(
      'button[aria-label*="menu" i], .hamburger-menu, .mobile-menu-button, button.chakra-button:has(svg)'
    );

    // Sections based on the actual portfolio structure
    this.heroSection = page.locator(
      '#home, [data-testid="hero-section"], section:first-of-type'
    );
    this.aboutSection = page.locator(
      '#about, [data-testid="about-section"], section:has-text("About")'
    );
    this.projectsSection = page.locator(
      '#projects, [data-testid="projects-section"], section:has-text("Projects")'
    );
    this.blogSection = page.locator(
      '#blog, [data-testid="blog-section"], section:has-text("Blog")'
    );
    this.contactSection = page.locator(
      '#contact, [data-testid="contact-section"], section:has-text("Contact")'
    );

    this.logoImage = page.locator(
      'img[alt*="logo" i], a > img, img[alt*="profile" i]'
    );
    this.footerLinks = page.locator('footer a');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Verify the page has loaded correctly
   */
  async expectLoaded() {
    await expect(this.page).toHaveTitle(/Cory|Portfolio|SDET|QA|Automation/i);
    await this.takeScreenshot('homepage-loaded');
  }

  /**
   * Navigate to a specific section using top navigation
   * @param linkText The text of the navigation link to click
   */
  async navigateTo(linkText: string) {
    await this.navigationLinks
      .getByText(linkText, { exact: false })
      .first()
      .click();
  }

  /**
   * Toggle between light and dark theme
   */
  async toggleTheme() {
    const themeToggle = this.themeToggle;
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await this.takeScreenshot('theme-toggled');
    }
  }

  /**
   * Get the title text of the page
   */
  async getTitle() {
    if (await this.title.isVisible()) {
      return await this.title.textContent();
    }
    return null;
  }

  /**
   * Take a screenshot with a given name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks() {
    const links = await this.navigationLinks.all();
    const linkTexts = [];

    for (const link of links) {
      const text = await link.textContent();
      if (text && text.trim()) {
        linkTexts.push(text.trim());
      }
    }

    return linkTexts;
  }

  /**
   * Check if the section exists on the page
   * @param sectionName The name of the section to check
   */
  async hasSection(sectionName: string) {
    switch (sectionName.toLowerCase()) {
      case 'intro':
      case 'home':
      case 'hero':
        return await this.heroSection.isVisible();
      case 'about':
        return await this.aboutSection.isVisible();
      case 'projects':
        return await this.projectsSection.isVisible();
      case 'blog':
        return await this.blogSection.isVisible();
      case 'contact':
        return await this.contactSection.isVisible();
      default:
        return false;
    }
  }

  /**
   * Get section by name
   */
  getSection(sectionName: string): Locator {
    switch (sectionName.toLowerCase()) {
      case 'intro':
      case 'home':
      case 'hero':
        return this.heroSection;
      case 'about':
        return this.aboutSection;
      case 'projects':
        return this.projectsSection;
      case 'blog':
        return this.blogSection;
      case 'contact':
        return this.contactSection;
      default:
        return this.mainContent;
    }
  }

  /**
   * Check if mobile menu button is visible
   */
  async isMobileMenuVisible() {
    return await this.mobileMenuButton.isVisible();
  }

  /**
   * Toggle mobile menu
   */
  async toggleMobileMenu() {
    if (await this.isMobileMenuVisible()) {
      await this.mobileMenuButton.click();
      // Wait for navigation links to be visible instead of using a timeout
      await this.navigationLinks
        .first()
        .waitFor({ state: 'visible', timeout: 2000 })
        .catch(() => {
          // If links don't become visible, that's ok - continue anyway
        });
    }
  }
}
