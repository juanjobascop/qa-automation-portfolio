import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — page object for the SauceDemo cart (/cart.html).
 * Lets tests verify the cart's contents and move on to checkout.
 */
export class CartPage extends BasePage {
  // --- Locators ---
  readonly items: Locator; // all rows in the cart (a list locator)
  readonly checkoutButton: Locator; // the "Checkout" button
  readonly continueShopping: Locator; // the "Continue Shopping" button

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
  }

  /** Assert the cart holds exactly `count` rows (auto-retries until true). */
  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  /** Assert a row for `productName` is present in the cart. */
  async expectHasItem(productName: string): Promise<void> {
    await expect(this.items.filter({ hasText: productName })).toBeVisible();
  }

  /** Proceed to checkout and wait for step one to load. */
  async checkout(): Promise<void> {
    await this.waitForVisible(this.checkoutButton); // dynamic wait
    await this.checkoutButton.click();
    await this.waitForUrl('**/checkout-step-one.html'); // dynamic wait for nav
  }
}
