import { test, expect } from '@playwright/test';
import { BookingClient, sampleBooking, Booking } from '@utils/booking-client';

/**
 * Full CRUD lifecycle against the restful-booker API:
 * Create → Read → Update → Delete, plus a "not found" negative case.
 *
 * The `test.step(...)` blocks split each test into labelled phases so the report
 * shows, for example, exactly which part of an Update failed if one ever does.
 */
test.describe('API: Booking CRUD', () => {
  // Shared across the tests in this block.
  let client: BookingClient;
  let token: string; // auth token, needed for update/delete

  // Authenticate ONCE before all tests, using a dedicated request context.
  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    });
    client = new BookingClient(request);
    token = await client.createToken();
  });

  test('creates a booking and returns an id', async () => {
    await test.step('POST /booking with a sample payload', async () => {
      const created = await client.createBooking(sampleBooking);
      // The API must return a numeric id and echo back the data we sent.
      expect(created.bookingid).toEqual(expect.any(Number));
      expect(created.booking.firstname).toBe(sampleBooking.firstname);
    });
  });

  test('reads back a created booking', async () => {
    // A test-scoped variable so later steps can use the id from the first step.
    let id: number;

    await test.step('Create a booking to read', async () => {
      const created = await client.createBooking(sampleBooking);
      id = created.bookingid;
    });

    await test.step('GET /booking/:id and verify the fields', async () => {
      const res = await client.getBooking(id);
      expect(res.status()).toBe(200);
      const body = (await res.json()) as Booking;
      expect(body.lastname).toBe(sampleBooking.lastname);
      expect(body.totalprice).toBe(sampleBooking.totalprice);
    });
  });

  test('updates an existing booking', async () => {
    let id: number;

    await test.step('Create a booking to update', async () => {
      const created = await client.createBooking(sampleBooking);
      id = created.bookingid;
    });

    await test.step('PUT /booking/:id with new values', async () => {
      const updated: Booking = { ...sampleBooking, firstname: 'Margaret', totalprice: 999 };
      const res = await client.updateBooking(id, token, updated);
      expect(res.status()).toBe(200);

      // Confirm the response reflects the change we requested.
      const body = (await res.json()) as Booking;
      expect(body.firstname).toBe('Margaret');
      expect(body.totalprice).toBe(999);
    });
  });

  test('deletes a booking', async () => {
    let id: number;

    await test.step('Create a booking to delete', async () => {
      const created = await client.createBooking(sampleBooking);
      id = created.bookingid;
    });

    await test.step('DELETE /booking/:id', async () => {
      const del = await client.deleteBooking(id, token);
      expect(del.status()).toBe(201); // restful-booker returns 201 on delete.
    });

    await test.step('Confirm it is gone (GET now 404)', async () => {
      const res = await client.getBooking(id);
      expect(res.status()).toBe(404);
    });
  });

  test('returns 404 for a non-existent booking', async () => {
    await test.step('GET an id that cannot exist', async () => {
      const res = await client.getBooking(99999999);
      expect(res.status()).toBe(404);
    });
  });
});
