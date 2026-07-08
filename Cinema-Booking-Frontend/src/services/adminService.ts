import { mockUsers } from '@/data/mockUsers';
import { mockWeeklyRevenue } from '@/data/mockAdminStats';
import { delay, mockStore } from './mockStore';

// TODO STUDENT BACKEND INTEGRATION
//
// Students may later connect this dashboard to endpoints such as
// GET /api/admin/stats and GET /api/admin/bookings, or their own API design.
export const adminService = {
  async getDashboardStats() {
    await delay();
    const movies = mockStore.getMovies();
    const halls = mockStore.getHalls();
    const showtimes = mockStore.getShowtimes();
    const bookings = mockStore.getBookings();
    const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
    const movieCounts = confirmedBookings.reduce<Record<string, number>>((counts, booking) => {
      const title = booking.showtime.movie.title;
      counts[title] = (counts[title] || 0) + booking.total_seats;
      return counts;
    }, {});

    return {
      totalMovies: movies.length,
      totalHalls: halls.length,
      totalShowtimes: showtimes.length,
      totalBookings: bookings.length,
      totalUsers: mockUsers.filter((user) => user.role === 'user').length,
      totalRevenue,
      recentBookings: bookings.slice(0, 5),
      popularMovies: Object.entries(movieCounts)
        .map(([title, seats]) => ({ title, seats }))
        .sort((a, b) => b.seats - a.seats)
        .slice(0, 5),
      weeklyRevenue: mockWeeklyRevenue,
    };
  },

  async getAllBookings(filters: { status?: string; search?: string; movieId?: string; date?: string } = {}) {
    await delay();
    let bookings = mockStore.getBookings();
    if (filters.status && filters.status !== 'all') {
      bookings = bookings.filter((booking) => booking.status === filters.status);
    }
    if (filters.movieId) {
      bookings = bookings.filter((booking) => booking.showtime.movie._id === filters.movieId);
    }
    if (filters.date) {
      bookings = bookings.filter((booking) => booking.showtime.show_date.startsWith(filters.date!));
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      bookings = bookings.filter(
        (booking) =>
          booking._id.toLowerCase().includes(query) ||
          booking.user.fullName.toLowerCase().includes(query) ||
          booking.user.email.toLowerCase().includes(query) ||
          booking.showtime.movie.title.toLowerCase().includes(query),
      );
    }
    return bookings;
  },

  async getBookingById(id: string) {
    await delay();
    const booking = mockStore.getBookings().find((item) => item._id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    await delay();
    const bookings = mockStore.getBookings();
    const index = bookings.findIndex((booking) => booking._id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index] = { ...bookings[index], status };
    mockStore.setBookings(bookings);
    return bookings[index];
  },
};
