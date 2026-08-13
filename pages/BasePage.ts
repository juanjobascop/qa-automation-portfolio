import { Locator, Page } from '@playwright/test';

/**
 * BasePage — the shared parent of every page object.
 *
 * It holds the one thing all pages need (a reference to Playwright's `page`)
 * and a couple of small **dynamic-wait helpers**. Concrete pages (LoginPage,
 * CartPage, ...) extend this class so they inherit these helpers instead of
 * repeating the same waiting logic.
 *
 * Why "dynamic" waits? A dynamic wait pauses until a *condition* is true
 * (an element is visible, the URL changed). It is the opposite of a "hard"
 * wait like `waitForTimeout(3000)`, which blindly sleeps and is the classic
 * cause of flaky, race-prone tests. We never use hard waits in this project.
 */
export abstract class BasePage {
  // `protected` = visible to subclasses (the concrete pages) but not to tests.
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to the project's configured baseURL. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Current page URL — handy for assertions inside tests. */
  url(): string {
    return this.page.url();
  }

  /**
   * Dynamic wait: block until `locator` is actually visible before we touch it.
   * Guards against the race where an element is already in the DOM but not yet
   * rendered/interactive.
   */
  protected async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Dynamic wait: block until the browser URL matches `urlGlob`
   * (e.g. '**\/inventory.html'). Used right after an action that triggers a
   * page navigation, so the next step can't run against the previous page.
   */
  protected async waitForUrl(urlGlob: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlGlob);
  }
}
