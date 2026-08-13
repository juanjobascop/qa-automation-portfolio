import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — page object for the SauceDemo login screen (the "/" page).
 *
 * Everything the tests need to know about this screen lives here: the locators
 * (where the elements are) and the actions (what you can do). If SauceDemo ever
 * changes its login markup, this is the ONLY file that needs updating.
 */
export class LoginPage extends BasePage {
  // --- Locators: one readonly property per element on this screen ---
  readonly username: Locator; // the username input box
  readonly password: Locator; // the password input box
  readonly loginButton: Locator; // the "Login" submit button
  readonly errorMessage: Locator; // the red error banner shown on bad input

  /**
   * The constructor wires each locator exactly once, when the page object is
   * created. Tests then reuse these locators instead of re-declaring selectors.
   * We prefer SauceDemo's stable `data-test` attributes over CSS classes,
   * because they are far less likely to change than styling.
   */
  constructor(page: Page) {
    super(page); // hand the `page` up to BasePage
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Open the login page and wait until the form is ready to use. */
  async open(): Promise<void> {
    await this.goto('/');
    // Dynamic wait: don't hand control back until the form is interactive.
    await this.waitForVisible(this.loginButton);
  }

  /**
   * Fill the form and submit. This is the raw action only — it does NOT assert
   * the outcome, because a login can legitimately succeed (navigates away) OR
   * fail (shows an error). The calling test decides which it expects.
   */
  async login(username: string, password: string): Promise<void> {
    // Dynamic wait: make sure the fields exist before typing into them.
    await this.waitForVisible(this.username);
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  /**
   * Assert that a login error is shown and contains the expected text.
   * `expect().toBeVisible()` and `toContainText()` auto-retry until true or the
   * timeout is hit — that retry loop is itself a dynamic wait.
   */
  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
