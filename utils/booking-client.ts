import { APIRequestContext, expect } from '@playwright/test';

/**
 * Thin, typed wrapper around the restful-booker API. Encapsulating the HTTP
 * details here keeps the API specs readable and makes endpoint changes a
 * one-file edit.
 *
 * API docs: https://restful-booker.herokuapp.com/apidoc/index.html
 */

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  /** Authenticate and return a session token used for PUT/DELETE calls. */
  async createToken(
    username = 'admin',
    password = 'password123',
  ): Promise<string> {
    const res = await this.request.post('/auth', {
      data: { username, password },
    });
    expect(res.ok(), 'auth request should succeed').toBeTruthy();
    const body = await res.json();
    expect(body.token, 'auth response should contain a token').toBeTruthy();
    return body.token as string;
  }

  async createBooking(booking: Booking): Promise<CreateBookingResponse> {
    const res = await this.request.post('/booking', { data: booking });
    expect(res.status(), 'create booking status').toBe(200);
    return (await res.json()) as CreateBookingResponse;
  }

  async getBooking(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, token: string, booking: Booking) {
    return this.request.put(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: booking,
    });
  }

  async deleteBooking(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}

/** A realistic default booking payload for tests to clone and tweak. */
export const sampleBooking: Booking = {
  firstname: 'Grace',
  lastname: 'Hopper',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-09-01', checkout: '2026-09-05' },
  additionalneeds: 'Late checkout',
};
