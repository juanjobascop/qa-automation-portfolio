import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** SauceDemo sort-dropdown option values. */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page object for the SauceDemo product inventory page.
 */
export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  async itemCount(): Promise<number> {
    return this.items.count();
  }

  /** Add a product to the cart by its visible name. */
  async addItemToCart(productName: string): Promise<void> {
    const item = this.items.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async cartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Sort the product list. `value` maps to SauceDemo's select option values. */
  async sortBy(value: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  /** Returns product names in current display order. */
  async productNames(): Promise<string[]> {
    return this.items.locator('.inventory_item_name').allInnerTexts();
  }

  /** Returns product prices (as numbers) in current display order. */
  async productPrices(): Promise<number[]> {
    const raw = await this.items.locator('.inventory_item_price').allInnerTexts();
    return raw.map((p) => Number(p.replace('$', '')));
  }
}
