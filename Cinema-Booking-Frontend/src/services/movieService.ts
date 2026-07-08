import type { IMovie, MovieFilters } from '@/types';
import { delay, mockStore } from './mockStore';

const sortMovies = (movies: IMovie[], sort?: MovieFilters['sort']) => {
  if (sort === 'release_date') {
    return [...movies].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  }
  if (sort === 'rating') {
    return [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  return [...movies].sort((a, b) => a.title.localeCompare(b.title));
};

// TODO STUDENT BACKEND INTEGRATION
//
// Replace mock reads/writes with the student's Express REST API.
// Expected endpoints may include GET /api/movies, GET /api/movies/:id,
// POST /api/movies, PUT /api/movies/:id, DELETE /api/movies/:id.
export const movieService = {
  async getMovies(filters: MovieFilters = {}) {
    await delay();
    let movies = mockStore.getMovies();
    if (filters.search) {
      const query = filters.search.toLowerCase();
      movies = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.description.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query),
      );
    }
    if (filters.genre) {
      movies = movies.filter((movie) => movie.genre === filters.genre);
    }
    if (filters.status && filters.status !== 'all') {
      movies = movies.filter((movie) => movie.status === filters.status);
    }
    return sortMovies(movies, filters.sort);
  },

  async getMovieById(id: string) {
    await delay();
    const movie = mockStore.getMovies().find((item) => item._id === id);
    if (!movie) throw new Error('Movie not found');
    return movie;
  },

  async createMovie(data: Omit<IMovie, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const timestamp = new Date().toISOString();
    const movie: IMovie = {
      ...data,
      _id: `movie-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    mockStore.setMovies([movie, ...mockStore.getMovies()]);
    return movie;
  },

  async updateMovie(id: string, data: Partial<IMovie>) {
    await delay();
    const movies = mockStore.getMovies();
    const index = movies.findIndex((movie) => movie._id === id);
    if (index === -1) throw new Error('Movie not found');
    movies[index] = { ...movies[index], ...data, updatedAt: new Date().toISOString() };
    mockStore.setMovies(movies);
    return movies[index];
  },

  async deleteMovie(id: string) {
    await delay();
    mockStore.setMovies(mockStore.getMovies().filter((movie) => movie._id !== id));
  },
};
