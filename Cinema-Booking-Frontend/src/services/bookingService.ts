import type { BookingInput } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { delay, mockStore } from './mockStore';

const DEMO_CONFIRMED_BOOKING_KEY = 'cinematix_demo_confirmed_booking';

const getUser = (id: string) => {
  const user = mockUsers.find((item) => item.id === id || item._id === id);
  if (!user) throw new Error('Demo user not found');
  return user;
};

// Frontend seat state is only for UI demonstration.
// Real availability and double-booking prevention must be enforced by the
// student's backend and database.
//
// TODO STUDENT BACKEND INTEGRATION
// Replace with booking endpoints such as GET /api/bookings/showtime/:id,
// POST /api/bookings, GET /api/bookings/user/:userId, PATCH /api/bookings/:id.
export const bookingService = {
  async getSeatAvailability(showtimeId: string) {
    await delay();
    return mockStore
      .getBookings()
      .filter((booking) => booking.showtime._id === showtimeId && booking.status !== 'cancelled')
      .flatMap((booking) => booking.selected_seats);
  },

  async createBooking(input: BookingInput) {
    await delay();
    const showtime = mockStore.getShowtimes().find((item) => item._id === input.showtime);
    if (!showtime) throw new Error('Showtime not found');
    const user = getUser(input.user);

    // The frontend total is presentational. The student's backend must
    // calculate authoritative totalPrice from trusted Showtime data.
    const booking = {
      _id: `booking-${Date.now()}`,
      user,
      showtime,
      booking_date: new Date().toISOString(),
      total_seats: input.total_seats,
      total_amount: input.total_amount,
      status: input.status || 'confirmed',
      selected_seats: input.selected_seats,
    };
    mockStore.setBookings([booking, ...mockStore.getBookings()]);
    sessionStorage.setItem(DEMO_CONFIRMED_BOOKING_KEY, booking._id);
    return booking;
  },

  async getMyBookings(userId: string) {
    await delay();
    return mockStore.getBookings().filter((booking) => booking.user.id === userId || booking.user._id === userId);
  },

  async getBookingById(id: string) {
    await delay();
    const booking = mockStore.getBookings().find((item) => item._id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  async cancelBooking(id: string) {
    await delay();
    const bookings = mockStore.getBookings();
    const index = bookings.findIndex((booking) => booking._id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index] = { ...bookings[index], status: 'cancelled' };
    mockStore.setBookings(bookings);
    return bookings[index];
  },

  getConfirmedBookingId() {
    return sessionStorage.getItem(DEMO_CONFIRMED_BOOKING_KEY);
  },

  clearConfirmedBookingId() {
    sessionStorage.removeItem(DEMO_CONFIRMED_BOOKING_KEY);
  },
};
