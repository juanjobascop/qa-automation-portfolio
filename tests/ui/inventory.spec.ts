import { test, expect } from '@fixtures/pom-fixtures';
import { products } from '@fixtures/test-data';

/**
 * Inventory browsing: catalog rendering, sorting, and cart-badge behaviour.
 *
 * Every test here uses the `loggedInInventory` fixture, which logs in as the
 * standard user and hands back a ready InventoryPage — so each test starts
 * already authenticated on the product list and stays focused on one behaviour.
 */
test.describe('Inventory', () => {
  test('displays the full product catalog', async ({ loggedInInventory }) => {
    await test.step('Count the products on the page', async () => {
      // SauceDemo ships with exactly 6 demo products.
      expect(await loggedInInventory.itemCount()).toBe(6);
    });
  });

  test('sorts products by name Z to A', async ({ loggedInInventory }) => {
    await test.step('Choose "Name (Z to A)"', async () => {
      await loggedInInventory.sortBy('za');
    });

    await test.step('Verify names are in reverse-alphabetical order', async () => {
      const names = await loggedInInventory.productNames();
      // Build the expected order ourselves, then compare — never trust the UI blindly.
      const expected = [...names].sort().reverse();
      expect(names).toEqual(expected);
    });
  });

  test('sorts products by price low to high', async ({ loggedInInventory }) => {
    await test.step('Choose "Price (low to high)"', async () => {
      await loggedInInventory.sortBy('lohi');
    });

    await test.step('Verify prices ascend', async () => {
      const prices = await loggedInInventory.productPrices();
      const expected = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(expected);
    });
  });

  test('adding items updates the cart badge', async ({ loggedInInventory }) => {
    await test.step('Cart starts empty', async () => {
      expect(await loggedInInventory.cartCount()).toBe(0);
    });

    await test.step('Add two products', async () => {
      await loggedInInventory.addItemToCart(products.backpack);
      await loggedInInventory.addItemToCart(products.bikeLight);
    });

    await test.step('Badge shows 2', async () => {
      expect(await loggedInInventory.cartCount()).toBe(2);
    });
  });
});
