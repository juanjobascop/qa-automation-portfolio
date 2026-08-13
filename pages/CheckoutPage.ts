import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The shape of the data the checkout form needs. Defining it as an interface
 * means a test can't accidentally forget a field or pass the wrong type.
 */
export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * CheckoutPage — page object covering the whole SauceDemo checkout journey:
 *   step one  = "Your Information" form   (/checkout-step-one.html)
 *   step two  = "Overview" summary        (/checkout-step-two.html)
 *   complete  = "Thank you" confirmation  (/checkout-complete.html)
 *
 * These three screens share one flow, so we model them in a single page object.
 * (If they grew more complex, splitting them into their own pages would be the
 * natural next refactor — the constructor pattern here makes that easy.)
 */
export class CheckoutPage extends BasePage {
  // --- Locators ---
  readonly firstName: Locator; // step one: first-name field
  readonly lastName: Locator; // step one: last-name field
  readonly postalCode: Locator; // step one: postal-code field
  readonly continueButton: Locator; // step one: "Continue" button
  readonly finishButton: Locator; // step two: "Finish" button
  readonly errorMessage: Locator; // step one: validation error banner
  readonly summaryTotal: Locator; // step two: the total price label
  readonly completeHeader: Locator; // complete: the "Thank you" heading

  constructor(page: Page) {
    super(page);
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  /**
   * Fill the step-one form and press Continue.
   *
   * Note we do NOT wait for navigation here: with valid data this advances to
   * step two, but with invalid data (e.g. a blank postal code) it stays on the
   * same page and shows an error. The calling test asserts whichever it expects.
   */
  async fillInformation(details: CheckoutDetails): Promise<void> {
    await this.waitForVisible(this.firstName); // dynamic wait before typing
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.postalCode.fill(details.postalCode);
    await this.continueButton.click();
  }

  /** Assert a step-one validation error contains the expected text. */
  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  /** On the overview step, press Finish and wait for the confirmation page. */
  async finish(): Promise<void> {
    // Dynamic wait: only finish once we've truly reached the overview step.
    await this.waitForVisible(this.finishButton);
    await this.finishButton.click();
    await this.waitForUrl('**/checkout-complete.html'); // dynamic wait for nav
  }

  /** Assert the order-complete confirmation is shown. */
  async expectOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
