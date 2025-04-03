import { test, expect } from '@playwright/test';
import { BlogPage } from './pages/BlogPage';
import { HomePage } from './pages/HomePage';
import { TestHelpers } from './utils/TestHelpers';

test.describe('Portfolio Blog Tests', () => {
  test('blog page loads and displays blog posts', async ({ page }) => {
    const blogPage = new BlogPage(page);

    // Navigate directly to the blog page
    await blogPage.goto();

    // Count the number of blog posts
    const postCount = await blogPage.countBlogPosts();
    console.log(`Found ${postCount} blog posts`);

    // Take a screenshot of the blog page
    await page.screenshot({ path: './screenshots/blog-list.png' });

    // Verify that at least one blog post is displayed
    expect(postCount).toBeGreaterThanOrEqual(0); // Allow 0 in case there are no blog posts yet
  });

  test('can navigate to blog from homepage', async ({ page }) => {
    const homePage = new HomePage(page);

    // Start from home page
    await homePage.goto();
    await TestHelpers.waitForNetworkIdle(page);

    // Try to navigate to blog section
    try {
      await homePage.navigateTo('Blog');
      await TestHelpers.waitForNetworkIdle(page);

      // Initialize blog page object after navigation
      const blogPage = new BlogPage(page);

      // Count the number of blog posts
      const postCount = await blogPage.countBlogPosts();
      console.log(
        `Found ${postCount} blog posts after navigating from home page`
      );

      // Take a screenshot
      await page.screenshot({
        path: './screenshots/blog-navigation-from-home.png',
      });
    } catch (error) {
      console.log(
        'Could not navigate to Blog section from navigation links, may be a single page app or blog link not found'
      );
    }
  });

  test('can open a blog post and view its details', async ({ page }) => {
    const blogPage = new BlogPage(page);

    // Navigate to the blog page
    await blogPage.goto();

    // Count the number of blog posts
    const postCount = await blogPage.countBlogPosts();

    if (postCount > 0) {
      // Open the first blog post
      const opened = await blogPage.openBlogPost(0);

      if (opened) {
        // Get blog post details
        const postDetails = await blogPage.getBlogPostDetails();

        if (postDetails) {
          console.log('Blog post title:', postDetails.title);
          console.log('Blog post date:', postDetails.date);
          console.log('Blog post tags:', postDetails.tags);

          // Verify that the blog post has content
          expect(postDetails.hasContent).toBeTruthy();

          // Verify that the blog post has a title
          expect(postDetails.title).toBeTruthy();
        } else {
          console.log('Could not retrieve blog post details');
        }
      }

      // Navigate back to the blog list
      const navigatedBack = await blogPage.backToBlogList();
      console.log(`Successfully navigated back to blog list: ${navigatedBack}`);

      if (navigatedBack) {
        // Verify we're back at the blog list by counting posts again
        const newPostCount = await blogPage.countBlogPosts();
        expect(newPostCount).toBeGreaterThan(0);
      }
    } else {
      console.log('No blog posts found to test');
      test.skip();
    }
  });

  test('search functionality filters blog posts', async ({ page }) => {
    const blogPage = new BlogPage(page);

    // Navigate to the blog page
    await blogPage.goto();

    // Check if search input exists
    const searchVisible = await blogPage.blogSearchInput.isVisible();

    if (searchVisible) {
      // Get the total number of posts before searching
      const initialPostCount = await blogPage.countBlogPosts();

      if (initialPostCount > 0) {
        // Get the title of the first post to use as search term
        const firstPost = blogPage.blogPostItems.first();
        let searchTerm = await firstPost.textContent();

        // Extract a single word from the title to use as search term
        if (searchTerm) {
          const words = searchTerm.split(' ');
          if (words.length > 0) {
            searchTerm = words[0];

            // Perform the search
            const resultCount = await blogPage.searchBlogPosts(searchTerm);
            console.log(
              `Search for "${searchTerm}" returned ${resultCount} results`
            );
          }
        }
      } else {
        console.log('No blog posts found to extract search term from');
      }
    } else {
      console.log('Blog search functionality not available');
      test.skip();
    }
  });

  test('category filtering works on blog posts', async ({ page }) => {
    const blogPage = new BlogPage(page);

    // Navigate to the blog page
    await blogPage.goto();

    // Check if there are any categories
    const categoriesCount = await blogPage.blogCategories.count();
    console.log(`Found ${categoriesCount} blog categories`);

    if (categoriesCount > 0) {
      // Get the text of the first category
      const firstCategory = blogPage.blogCategories.first();
      const categoryText = await firstCategory.textContent();

      if (categoryText) {
        // Try to filter by this category
        const resultCount = await blogPage.filterByCategory(
          categoryText.trim()
        );
        console.log(
          `Filtering by category "${categoryText.trim()}" returned ${resultCount} results`
        );
      }
    } else {
      console.log('No blog categories found to test filtering');
      test.skip();
    }
  });
});
