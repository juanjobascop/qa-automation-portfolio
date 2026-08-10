import { test, expect } from '@playwright/test';
import { BookingClient, sampleBooking, Booking } from '@utils/booking-client';

/**
 * Full CRUD lifecycle against the restful-booker API:
 * create -> read -> update -> delete, plus a not-found negative case.
 */
test.describe('API: Booking CRUD', () => {
  let client: BookingClient;
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    // A dedicated request context lets beforeAll authenticate once and share it.
    const request = await playwright.request.newContext({
      baseURL:
        process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    });
    client = new BookingClient(request);
    token = await client.createToken();
  });

  test('creates a booking and returns an id', async () => {
    const created = await client.createBooking(sampleBooking);
    expect(created.bookingid).toEqual(expect.any(Number));
    expect(created.booking.firstname).toBe(sampleBooking.firstname);
  });

  test('reads back a created booking', async () => {
    const created = await client.createBooking(sampleBooking);
    const res = await client.getBooking(created.bookingid);
    expect(res.status()).toBe(200);
    const body = (await res.json()) as Booking;
    expect(body.lastname).toBe(sampleBooking.lastname);
    expect(body.totalprice).toBe(sampleBooking.totalprice);
  });

  test('updates an existing booking', async () => {
    const created = await client.createBooking(sampleBooking);
    const updated: Booking = { ...sampleBooking, firstname: 'Margaret', totalprice: 999 };

    const res = await client.updateBooking(created.bookingid, token, updated);
    expect(res.status()).toBe(200);
    const body = (await res.json()) as Booking;
    expect(body.firstname).toBe('Margaret');
    expect(body.totalprice).toBe(999);
  });

  test('deletes a booking', async () => {
    const created = await client.createBooking(sampleBooking);

    const del = await client.deleteBooking(created.bookingid, token);
    expect(del.status()).toBe(201); // restful-booker returns 201 on delete.

    const res = await client.getBooking(created.bookingid);
    expect(res.status()).toBe(404);
  });

  test('returns 404 for a non-existent booking', async () => {
    const res = await client.getBooking(99999999);
    expect(res.status()).toBe(404);
  });
});
