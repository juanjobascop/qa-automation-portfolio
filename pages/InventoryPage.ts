import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The four values SauceDemo's sort dropdown accepts. Using a string-union type
 * means TypeScript rejects a typo like `sortBy('zz')` before the test runs.
 *   az   = Name (A to Z)      za   = Name (Z to A)
 *   lohi = Price (low → high) hilo = Price (high → low)
 */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * InventoryPage — page object for the SauceDemo product list (/inventory.html).
 * Covers reading the catalog, sorting it, adding items, and the cart badge.
 */
export class InventoryPage extends BasePage {
  // --- Locators ---
  readonly title: Locator; // the "Products" page heading
  readonly items: Locator; // ALL product cards (a list locator)
  readonly sortDropdown: Locator; // the sort <select>
  readonly cartBadge: Locator; // the little number on the cart icon
  readonly cartLink: Locator; // the cart icon itself

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /** Assert we actually landed on the inventory page after logging in. */
  async expectLoaded(): Promise<void> {
    // Auto-waiting assertion: retries until the heading reads "Products".
    await expect(this.title).toHaveText('Products');
    // Dynamic wait: confirm the URL too, so later steps can't run too early.
    await this.waitForUrl('**/inventory.html');
  }

  /** How many product cards are currently shown. */
  async itemCount(): Promise<number> {
    return this.items.count();
  }

  /**
   * Add a single product to the cart by its visible name.
   * We narrow the list of items down to the one card containing `productName`,
   * then click its "Add to cart" button.
   */
  async addItemToCart(productName: string): Promise<void> {
    const item = this.items.filter({ hasText: productName });
    const addButton = item.getByRole('button', { name: 'Add to cart' });

    await this.waitForVisible(addButton); // dynamic wait before clicking
    await addButton.click();

    // Dynamic wait: SauceDemo flips the button to "Remove" once the item is in
    // the cart. Waiting for that flip proves the click registered before the
    // test moves on — this is what prevents an add/read race condition.
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  /** Read the cart badge number. Returns 0 when the badge isn't shown yet. */
  async cartCount(): Promise<number> {
    // The badge only exists in the DOM once at least one item is added.
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  /** Open the cart and wait for the cart page to load. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.waitForUrl('**/cart.html'); // dynamic wait for navigation
  }

  /**
   * Sort the product list. After choosing an option SauceDemo re-orders the
   * cards client-side, so we wait for the list to be present again.
   */
  async sortBy(value: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(value);
    await expect(this.items.first()).toBeVisible(); // dynamic wait for re-render
  }

  /** Product names in their current on-screen order. */
  async productNames(): Promise<string[]> {
    return this.items.locator('.inventory_item_name').allInnerTexts();
  }

  /** Product prices as numbers (e.g. "$29.99" → 29.99) in on-screen order. */
  async productPrices(): Promise<number[]> {
    const raw = await this.items.locator('.inventory_item_price').allInnerTexts();
    return raw.map((p) => Number(p.replace('$', '')));
  }
}
