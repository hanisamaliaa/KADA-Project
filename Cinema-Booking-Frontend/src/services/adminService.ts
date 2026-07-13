import api from "./api";
import { IBooking } from "@/types";

interface BackendBooking {
  _id: string;
  userId: { _id: string; name: string; email: string };
  movieId: { _id: string; title: string };
  showtimeId: {
    _id: string;
    date: string;
    time: string;
    studio: string;
    price: number;
  };
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

const mapAdminBooking = (b: BackendBooking): IBooking => ({
  _id: b._id,
  user: {
    id: b.userId._id,
    _id: b.userId._id,
    email: b.userId.email,
    fullName: b.userId.name,
    role: "user",
  },
  showtime: {
    _id: b.showtimeId._id,
    movie: {
      _id: b.movieId._id,
      title: b.movieId.title,
      genre: "",
      duration: 0,
      poster_url: "",
      release_date: "",
      status: "now_showing",
      createdAt: "",
      updatedAt: "",
    },
    hall: {
      _id: b.showtimeId._id,
      hall_name: b.showtimeId.studio,
      total_seats: 80,
      layout_rows: 8,
      layout_columns: 10,
      createdAt: "",
      updatedAt: "",
    },
    show_date: b.showtimeId.date,
    start_time: b.showtimeId.time,
    end_time: "",
    ticket_price: b.showtimeId.price,
  },
  booking_date: b.createdAt,
  total_seats: b.seats.length,
  total_amount: b.totalPrice,
  status: b.status,
  selected_seats: b.seats,
});

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await api.get("/admin/stats");
      const d = res.data.data;
      return {
        totalMovies: d.totalMovies || 0,
        totalHalls: 0,
        totalShowtimes: d.totalShowtimes || 0,
        totalBookings: d.totalBookings || 0,
        totalUsers: d.totalUsers || 0,
        totalRevenue: 0,
        recentBookings: [],
        popularMovies: [],
        weeklyRevenue: [],
      };
    } catch {
      return {
        totalMovies: 0,
        totalHalls: 0,
        totalShowtimes: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentBookings: [],
        popularMovies: [],
        weeklyRevenue: [],
      };
    }
  },

  async getAllBookings(
    filters: {
      status?: string;
      search?: string;
      movieId?: string;
      date?: string;
    } = {},
  ) {
    try {
      const res = await api.get("/admin/bookings");
      let bookings: IBooking[] = (res.data.data || []).map(mapAdminBooking);

      if (filters.status && filters.status !== "all") {
        bookings = bookings.filter((b) => b.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        bookings = bookings.filter(
          (b) =>
            b.user.fullName.toLowerCase().includes(q) ||
            b.user.email.toLowerCase().includes(q) ||
            b.showtime.movie.title.toLowerCase().includes(q),
        );
      }
      return bookings;
    } catch {
      return [];
    }
  },

  async getBookingById(id: string) {
    const res = await api.get(`/bookings/${id}`);
    return mapAdminBooking(res.data.data);
  },

  async updateBookingStatus(
    id: string,
    status: "pending" | "confirmed" | "cancelled",
  ) {
    if (status === "cancelled") {
      await api.delete(`/bookings/${id}`);
    }
    return { _id: id, status };
  },
};
