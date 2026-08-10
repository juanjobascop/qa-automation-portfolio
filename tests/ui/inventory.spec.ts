import { test, expect } from '@fixtures/pom-fixtures';
import { products } from '@fixtures/test-data';

/**
 * Inventory browsing: catalog rendering, sorting, and cart badge behaviour.
 * Uses the `loggedInInventory` fixture so each test starts authenticated.
 */
test.describe('Inventory', () => {
  test('displays the full product catalog', async ({ loggedInInventory }) => {
    expect(await loggedInInventory.itemCount()).toBe(6);
  });

  test('sorts products by name Z to A', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('za');
    const names = await loggedInInventory.productNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('sorts products by price low to high', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');
    const prices = await loggedInInventory.productPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('adding items updates the cart badge', async ({ loggedInInventory }) => {
    expect(await loggedInInventory.cartCount()).toBe(0);
    await loggedInInventory.addItemToCart(products.backpack);
    await loggedInInventory.addItemToCart(products.bikeLight);
    expect(await loggedInInventory.cartCount()).toBe(2);
  });
});
