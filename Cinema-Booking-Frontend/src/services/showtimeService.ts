import type { IHall, IShowtime, ShowtimeInput } from '@/types';
import { delay, mockStore } from './mockStore';

const populateShowtime = (input: IShowtime | ShowtimeInput & { _id: string }): IShowtime => {
  if (typeof input.movie !== 'string' && typeof input.hall !== 'string') {
    return input as IShowtime;
  }
  const movie = mockStore.getMovies().find((item) => item._id === input.movie);
  const hall = mockStore.getHalls().find((item) => item._id === input.hall);
  if (!movie || !hall) throw new Error('Movie or hall not found');
  return { ...input, movie, hall } as IShowtime;
};

// TODO STUDENT BACKEND INTEGRATION
//
// Replace with endpoints such as GET /api/showtimes,
// GET /api/showtimes/:id, GET /api/showtimes/movie/:movieId,
// POST /api/showtimes, PUT /api/showtimes/:id, DELETE /api/showtimes/:id.
export const showtimeService = {
  async getShowtimes(filters: { movieId?: string; date?: string } = {}) {
    await delay();
    let showtimes = mockStore.getShowtimes();
    if (filters.movieId) {
      showtimes = showtimes.filter((showtime) => showtime.movie._id === filters.movieId);
    }
    if (filters.date) {
      showtimes = showtimes.filter((showtime) => showtime.show_date.startsWith(filters.date!));
    }
    return showtimes.sort(
      (a, b) =>
        new Date(a.show_date).getTime() - new Date(b.show_date).getTime() ||
        a.start_time.localeCompare(b.start_time),
    );
  },

  async getShowtimeById(id: string) {
    await delay();
    const showtime = mockStore.getShowtimes().find((item) => item._id === id);
    if (!showtime) throw new Error('Showtime not found');
    return showtime;
  },

  async getMovieShowtimes(movieId: string) {
    return this.getShowtimes({ movieId });
  },

  async createShowtime(data: ShowtimeInput) {
    await delay();
    const showtime = populateShowtime({ ...data, _id: `showtime-${Date.now()}` });
    mockStore.setShowtimes([showtime, ...mockStore.getShowtimes()]);
    return showtime;
  },

  async updateShowtime(id: string, data: ShowtimeInput) {
    await delay();
    const showtimes = mockStore.getShowtimes();
    const index = showtimes.findIndex((showtime) => showtime._id === id);
    if (index === -1) throw new Error('Showtime not found');
    showtimes[index] = populateShowtime({ ...data, _id: id });
    mockStore.setShowtimes(showtimes);
    return showtimes[index];
  },

  async deleteShowtime(id: string) {
    await delay();
    mockStore.setShowtimes(mockStore.getShowtimes().filter((showtime) => showtime._id !== id));
  },

  async getHalls() {
    await delay();
    return mockStore.getHalls();
  },

  async createHall(data: Omit<IHall, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const timestamp = new Date().toISOString();
    const hall: IHall = {
      ...data,
      _id: `hall-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    mockStore.setHalls([hall, ...mockStore.getHalls()]);
    return hall;
  },

  async updateHall(id: string, data: Partial<IHall>) {
    await delay();
    const halls = mockStore.getHalls();
    const index = halls.findIndex((hall) => hall._id === id);
    if (index === -1) throw new Error('Hall not found');
    halls[index] = { ...halls[index], ...data, updatedAt: new Date().toISOString() };
    mockStore.setHalls(halls);
    return halls[index];
  },

  async deleteHall(id: string) {
    await delay();
    mockStore.setHalls(mockStore.getHalls().filter((hall) => hall._id !== id));
  },
};
