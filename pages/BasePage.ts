import { Page } from '@playwright/test';

/**
 * BasePage holds behaviour common to every page object: a reference to the
 * Playwright `Page` and small navigation helpers. Concrete pages extend this
 * class and expose their own locators and domain-specific actions.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to the project's configured baseURL. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Current page URL — handy for assertions in tests. */
  url(): string {
    return this.page.url();
  }
}
