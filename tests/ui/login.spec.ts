import { test, expect } from '@fixtures/pom-fixtures';
import { users } from '@fixtures/test-data';

/**
 * Authentication scenarios for SauceDemo.
 *
 * `test.describe` groups related tests under one heading in the report.
 * Inside each test, `test.step(...)` names a phase of the scenario so the HTML
 * report and trace viewer show a readable, collapsible breakdown of execution
 * (e.g. "Submit valid credentials" → "Land on the inventory page").
 */
test.describe('Login', () => {
  // Runs before every test in this block: start each one on a fresh login page.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in and reach the inventory', async ({
    loginPage,
    inventoryPage,
  }) => {
    await test.step('Submit valid credentials', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Land on the inventory page', async () => {
      await inventoryPage.expectLoaded();
      expect(inventoryPage.url()).toContain('/inventory.html');
    });
  });

  test('invalid credentials are rejected with an error', async ({ loginPage }) => {
    await test.step('Submit a wrong username/password', async () => {
      await loginPage.login(users.invalid.username, users.invalid.password);
    });

    await test.step('See the mismatch error', async () => {
      await loginPage.expectError('Username and password do not match');
    });
  });

  test('locked-out user is blocked with a clear message', async ({ loginPage }) => {
    await test.step('Submit the locked-out account', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await test.step('See the locked-out error', async () => {
      await loginPage.expectError('Sorry, this user has been locked out');
    });
  });

  test('login requires a username', async ({ loginPage }) => {
    await test.step('Submit with an empty username', async () => {
      await loginPage.login('', users.standard.password);
    });

    await test.step('See the required-field error', async () => {
      await loginPage.expectError('Username is required');
    });
  });
});
