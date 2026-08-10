import { test, expect } from '@fixtures/pom-fixtures';
import { users } from '@fixtures/test-data';

/**
 * Authentication scenarios for SauceDemo.
 * Demonstrates positive, negative, and edge-case coverage of a login flow.
 */
test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in and reach the inventory', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    expect(inventoryPage.url()).toContain('/inventory.html');
  });

  test('invalid credentials are rejected with an error', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectError('Username and password do not match');
  });

  test('locked-out user is blocked with a clear message', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('login requires a username', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await loginPage.expectError('Username is required');
  });
});
