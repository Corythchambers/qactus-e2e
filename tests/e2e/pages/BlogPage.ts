import { Page, Locator } from '@playwright/test';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * Blog Page Object Model for Qactus SDET/QAAE Portfolio Website
 *
 * This class encapsulates the interactions with the blog section
 * and provides methods to perform actions and assertions.
 */
export class BlogPage {
  readonly page: Page;
  readonly blogPostItems: Locator;
  readonly blogSearchInput: Locator;
  readonly blogCategories: Locator;
  readonly blogPostTitle: Locator;
  readonly blogPostContent: Locator;
  readonly blogPostDate: Locator;
  readonly blogPostTags: Locator;
  readonly backToListLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.blogPostItems = page.locator(
      '.blog-post, [data-testid="blog-item"], article'
    );
    this.blogSearchInput = page.locator(
      'input[placeholder*="search" i], input[aria-label*="search" i]'
    );
    this.blogCategories = page.locator(
      '.blog-category, [data-testid="blog-category"]'
    );
    this.blogPostTitle = page.locator(
      'h1.blog-title, [data-testid="blog-title"], article h1'
    );
    this.blogPostContent = page.locator(
      '.blog-content, [data-testid="blog-content"], article main'
    );
    this.blogPostDate = page.locator(
      '.blog-date, [data-testid="blog-date"], time'
    );
    this.blogPostTags = page.locator('.blog-tag, [data-testid="blog-tag"]');
    this.backToListLink = page.locator(
      'a:has-text("Back"), a:has-text("Blog"), a[href*="/blog"]'
    );
  }

  /**
   * Navigate to the blog section/page
   */
  async goto() {
    await this.page.goto('/blog');
    await TestHelpers.waitForNetworkIdle(this.page);
  }

  /**
   * Count the number of blog posts displayed
   */
  async countBlogPosts() {
    return await this.blogPostItems.count();
  }

  /**
   * Open a specific blog post by index (0-based)
   * @param index The index of the blog post to open
   */
  async openBlogPost(index: number) {
    const count = await this.countBlogPosts();

    if (count <= 0) {
      console.log('No blog posts found');
      return false;
    }

    if (index >= count) {
      console.log(
        `Index ${index} is out of range. There are only ${count} blog posts`
      );
      return false;
    }

    await this.blogPostItems.nth(index).click();
    await TestHelpers.waitForNetworkIdle(this.page);

    // Take a screenshot
    await this.page.screenshot({
      path: `./screenshots/blog-post-${index}.png`,
    });
    return true;
  }

  /**
   * Search for blog posts using the search input
   * @param searchTerm The term to search for
   */
  async searchBlogPosts(searchTerm: string) {
    if (await this.blogSearchInput.isVisible()) {
      await this.blogSearchInput.fill(searchTerm);
      await this.blogSearchInput.press('Enter');
      await TestHelpers.waitForNetworkIdle(this.page);

      // Take a screenshot of search results
      await this.page.screenshot({
        path: './screenshots/blog-search-results.png',
      });

      // Return the count of visible blog posts after search
      return await this.countBlogPosts();
    } else {
      console.log('Blog search input not found');
      return -1;
    }
  }

  /**
   * Filter blog posts by category
   * @param categoryName The name of the category to filter by
   */
  async filterByCategory(categoryName: string) {
    const categories = await this.blogCategories.all();

    for (const category of categories) {
      const text = await category.textContent();

      if (text && text.trim().toLowerCase() === categoryName.toLowerCase()) {
        await category.click();
        await TestHelpers.waitForNetworkIdle(this.page);

        // Take a screenshot of filtered results
        await this.page.screenshot({
          path: './screenshots/blog-category-filter.png',
        });

        // Return the count of visible blog posts after filtering
        return await this.countBlogPosts();
      }
    }

    console.log(`Category "${categoryName}" not found`);
    return -1;
  }

  /**
   * Get the blog post details when viewing a single post
   */
  async getBlogPostDetails() {
    if (await this.blogPostTitle.isVisible()) {
      const title = await this.blogPostTitle.textContent();
      const date = (await this.blogPostDate.isVisible())
        ? await this.blogPostDate.textContent()
        : null;

      // Get all tags
      const tagElements = await this.blogPostTags.all();
      const tags = [];

      for (const tag of tagElements) {
        const tagText = await tag.textContent();
        if (tagText) {
          tags.push(tagText.trim());
        }
      }

      return {
        title,
        date,
        tags,
        hasContent: await this.blogPostContent.isVisible(),
      };
    }

    return null;
  }

  /**
   * Navigate back to the blog list from a single post
   */
  async backToBlogList() {
    if (await this.backToListLink.isVisible()) {
      await this.backToListLink.click();
      await TestHelpers.waitForNetworkIdle(this.page);
      return true;
    }
    return false;
  }
}
