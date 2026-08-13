import { test, expect } from '@playwright/test';
import { BookingClient } from '@utils/booking-client';

/**
 * Authentication endpoint contract tests for the restful-booker API.
 *
 * "Contract" testing means: given a request, does the API respond with exactly
 * the shape/values it promises? No browser is involved — these talk HTTP directly.
 */
test.describe('API: Auth', () => {
  test('valid credentials return a token', async ({ request }) => {
    const client = new BookingClient(request);

    await test.step('POST /auth with the demo admin credentials', async () => {
      const token = await client.createToken();
      // A valid token is a non-empty alphanumeric string.
      expect(token).toMatch(/^[a-z0-9]+$/i);
    });
  });

  test('invalid credentials do not return a token', async ({ request }) => {
    await test.step('POST /auth with a wrong password', async () => {
      const res = await request.post('/auth', {
        data: { username: 'admin', password: 'wrong-password' },
      });

      // restful-booker answers 200 but with a "Bad credentials" reason and no token.
      const body = await res.json();
      expect(body.token).toBeUndefined();
      expect(body.reason).toBe('Bad credentials');
    });
  });
});
