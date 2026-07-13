import api from "./api";
import type { IHall, IShowtime, ShowtimeInput } from "@/types";

interface BackendShowtime {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    genre: string;
    duration: number;
    rating: string;
    poster: string;
    trailerUrl: string;
    description: string;
  };
  date: string;
  time: string;
  studio: string;
  price: number;
  bookedSeats: string[];
}

const DEFAULT_POSTER =
  "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop";
const isUrl = (s: string) => /^https?:\/\//i.test(s);

const toEmbedUrl = (url: string): string => {
  if (!url) return "";
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
};

const mapShowtime = (s: BackendShowtime): IShowtime => {
  const movie = s.movieId;
  return {
    _id: s._id,
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      rating: parseFloat(movie.rating) || 0,
      poster_url: isUrl(movie.poster) ? movie.poster : DEFAULT_POSTER,
      trailer_url: toEmbedUrl(movie.trailerUrl || ""),
      description: movie.description,
      release_date: "",
      status: "now_showing",
      createdAt: "",
      updatedAt: "",
    },
    hall: {
      _id: s._id,
      hall_name: s.studio,
      total_seats: 80,
      layout_rows: 8,
      layout_columns: 10,
      createdAt: "",
      updatedAt: "",
    },
    show_date: s.date,
    start_time: s.time,
    end_time: "",
    ticket_price: s.price,
  };
};

export const showtimeService = {
  async getShowtimes(filters: { movieId?: string; date?: string } = {}) {
    const params: Record<string, string> = {};
    if (filters.movieId) params.movieId = filters.movieId;
    if (filters.date) params.date = filters.date;

    const res = await api.get("/showtimes", { params });
    return (res.data.data || []).map(mapShowtime);
  },

  async getShowtimeById(id: string) {
    const res = await api.get(`/showtimes/${id}`);
    return mapShowtime(res.data.data);
  },

  async getMovieShowtimes(movieId: string): Promise<IShowtime[]> {
    return this.getShowtimes({ movieId });
  },

  async createShowtime(data: ShowtimeInput) {
    const payload = {
      movieId: data.movie,
      date: data.show_date,
      time: data.start_time,
      studio: "CineLux Grand Indonesia",
      price: data.ticket_price,
    };
    const res = await api.post("/showtimes", payload);
    return mapShowtime(res.data.data);
  },

  async updateShowtime(id: string, data: ShowtimeInput) {
    const payload = {
      movieId: data.movie,
      date: data.show_date,
      time: data.start_time,
      studio: "CineLux Grand Indonesia",
      price: data.ticket_price,
    };
    const res = await api.put(`/showtimes/${id}`, payload);
    return mapShowtime(res.data.data);
  },

  async deleteShowtime(id: string) {
    await api.delete(`/showtimes/${id}`);
  },

  async getHalls() {
    return [];
  },

  async createHall(data: Omit<IHall, "_id" | "createdAt" | "updatedAt">) {
    return { ...data, _id: `hall-${Date.now()}`, createdAt: "", updatedAt: "" };
  },

  async updateHall(id: string, data: Partial<IHall>) {
    return { _id: id, ...data, createdAt: "", updatedAt: "" } as IHall;
  },

  async deleteHall(_id: string) {},
};
