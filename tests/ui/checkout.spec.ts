import { test } from '@fixtures/pom-fixtures';
import { products, checkoutInfo } from '@fixtures/test-data';

/**
 * End-to-end purchase journey: browse → cart → checkout → confirmation.
 *
 * This is the flagship happy-path scenario. The `test.step(...)` blocks make the
 * report read like a user story, so anyone (even non-technical) can follow what
 * the automation did at each stage. A negative form-validation case follows.
 */
test.describe('Checkout', () => {
  test('completes a purchase end to end', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await test.step('Add two products to the cart', async () => {
      await loggedInInventory.addItemToCart(products.backpack);
      await loggedInInventory.addItemToCart(products.boltTshirt);
    });

    await test.step('Open the cart and verify its contents', async () => {
      await loggedInInventory.openCart();
      await cartPage.expectItemCount(2);
      await cartPage.expectHasItem(products.backpack);
      await cartPage.expectHasItem(products.boltTshirt);
    });

    await test.step('Fill the checkout information form', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInformation(checkoutInfo);
    });

    await test.step('Finish the order and confirm success', async () => {
      await checkoutPage.finish();
      await checkoutPage.expectOrderComplete();
    });
  });

  test('checkout form rejects a missing postal code', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await test.step('Reach the checkout information form', async () => {
      await loggedInInventory.addItemToCart(products.backpack);
      await loggedInInventory.openCart();
      await cartPage.checkout();
    });

    await test.step('Submit with an empty postal code', async () => {
      // Spread the valid data but blank out the postal code to trigger validation.
      await checkoutPage.fillInformation({ ...checkoutInfo, postalCode: '' });
    });

    await test.step('See the required-field error', async () => {
      await checkoutPage.expectError('Postal Code is required');
    });
  });
});
