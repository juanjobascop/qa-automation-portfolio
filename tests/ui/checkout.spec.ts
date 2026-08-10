import { test } from '@fixtures/pom-fixtures';
import { products, checkoutInfo } from '@fixtures/test-data';

/**
 * End-to-end purchase journey: browse -> cart -> checkout -> confirmation.
 * This is the flagship happy-path scenario, plus a negative form-validation case.
 */
test.describe('Checkout', () => {
  test('completes a purchase end to end', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    // Add two products and open the cart.
    await loggedInInventory.addItemToCart(products.backpack);
    await loggedInInventory.addItemToCart(products.boltTshirt);
    await loggedInInventory.openCart();

    // Verify the cart contents.
    await cartPage.expectItemCount(2);
    await cartPage.expectHasItem(products.backpack);
    await cartPage.expectHasItem(products.boltTshirt);

    // Checkout and confirm.
    await cartPage.checkout();
    await checkoutPage.fillInformation(checkoutInfo);
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('checkout form rejects a missing postal code', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addItemToCart(products.backpack);
    await loggedInInventory.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation({
      ...checkoutInfo,
      postalCode: '',
    });
    await checkoutPage.expectError('Postal Code is required');
  });
});
