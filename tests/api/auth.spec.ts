import { test, expect } from '@playwright/test';
import { BookingClient } from '@utils/booking-client';

/**
 * Authentication endpoint contract tests for restful-booker.
 */
test.describe('API: Auth', () => {
  test('valid credentials return a token', async ({ request }) => {
    const client = new BookingClient(request);
    const token = await client.createToken();
    expect(token).toMatch(/^[a-z0-9]+$/i);
  });

  test('invalid credentials do not return a token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });
    // restful-booker returns 200 with a "Bad credentials" reason (no token).
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
