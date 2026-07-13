import api from "./api";
import type { IMovie, MovieFilters } from "@/types";

interface BackendMovie {
  _id: string;
  title: string;
  genre: string;
  duration: number;
  rating: string;
  poster: string;
  trailerUrl: string;
  description: string;
}

const DEFAULT_POSTER =
  "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop";

const isUrl = (s: string) => /^https?:\/\//i.test(s);

const parseRating = (r: string): number => {
  const n = parseFloat(r);
  return isNaN(n) ? 0 : n;
};

const toEmbedUrl = (url: string): string => {
  if (!url) return "";
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
};

const mapMovie = (m: BackendMovie): IMovie => ({
  _id: m._id,
  title: m.title,
  description: m.description,
  genre: m.genre,
  duration: m.duration,
  rating: parseRating(m.rating),
  poster_url: isUrl(m.poster) ? m.poster : DEFAULT_POSTER,
  trailer_url: toEmbedUrl(m.trailerUrl || ""),
  release_date: "",
  status: "now_showing",
  createdAt: "",
  updatedAt: "",
});

export const movieService = {
  async getMovies(filters: MovieFilters = {}) {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.genre) params.genre = filters.genre;

    const res = await api.get("/movies", { params });
    let movies: IMovie[] = (res.data.data || []).map(mapMovie);

    if (filters.status && filters.status !== "all") {
      movies = movies.filter((m) => m.status === filters.status);
    }
    if (filters.sort) {
      if (filters.sort === "release_date") {
        movies.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.sort === "rating") {
        movies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        movies.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return movies;
  },

  async getMovieById(id: string) {
    const res = await api.get(`/movies/${id}`);
    return mapMovie(res.data.data);
  },

  async createMovie(data: Omit<IMovie, "_id" | "createdAt" | "updatedAt">) {
    const payload = {
      title: data.title,
      genre: data.genre,
      duration: data.duration,
      rating: String(data.rating || 0),
      poster: data.poster_url,
      trailerUrl: data.trailer_url || "",
      description: data.description,
    };
    const res = await api.post("/movies", payload);
    return mapMovie(res.data.data);
  },

  async updateMovie(id: string, data: Partial<IMovie>) {
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.genre !== undefined) payload.genre = data.genre;
    if (data.duration !== undefined) payload.duration = data.duration;
    if (data.rating !== undefined) payload.rating = String(data.rating);
    if (data.poster_url !== undefined) payload.poster = data.poster_url;
    if (data.trailer_url !== undefined) payload.trailerUrl = data.trailer_url;
    if (data.description !== undefined) payload.description = data.description;
    const res = await api.put(`/movies/${id}`, payload);
    return mapMovie(res.data.data);
  },

  async deleteMovie(id: string) {
    await api.delete(`/movies/${id}`);
  },

  getBackendError,
};
