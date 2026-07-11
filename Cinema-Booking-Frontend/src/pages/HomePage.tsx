import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Play, Search, Star, Ticket } from 'lucide-react';
import { IMovie } from '@/types';
import MovieCard from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/LoadingSpinner';
import { movieService } from '@/services/movieService';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<IMovie | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await movieService.getMovies();
      setMovies(data || []);
      const nowShowingMovies = (data || []).filter((movie) => movie.status === 'now_showing');
      const featuredPool = nowShowingMovies.length > 0 ? nowShowingMovies : (data || []);
      if (featuredPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * featuredPool.length);
        setFeaturedMovie(featuredPool[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Could not load demo movies.');
    } finally {
      setLoading(false);
    }
  };

  const nowShowing = movies.filter((movie) => movie.status === 'now_showing');
  const comingSoon = movies.filter((movie) => movie.status === 'coming_soon');
  const backdrop = featuredMovie?.backdrop_url || featuredMovie?.poster_url || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero skeleton */}
        <div className="relative min-h-[85vh] bg-dark-900">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-dark-950/30" />
          <div className="relative z-10 flex min-h-[85vh] max-w-7xl items-center px-4 pb-32 pt-20 sm:px-6 lg:mx-auto lg:px-8">
            <div className="max-w-2xl space-y-6">
              <div className="skeleton h-7 w-36 rounded-full" />
              <div className="skeleton h-20 w-full rounded-2xl" />
              <div className="skeleton h-5 w-3/4 rounded-lg" />
              <div className="skeleton h-5 w-1/2 rounded-lg" />
              <div className="flex gap-3 pt-2">
                <div className="skeleton h-14 w-44 rounded-2xl" />
                <div className="skeleton h-14 w-44 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
        {/* Cards skeleton */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative min-h-[85vh] overflow-hidden">
          {/* Background backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-105"
            style={{ backgroundImage: `url(${backdrop})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/[0.85] to-dark-950/40" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-950/50 to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[85vh] max-w-7xl items-center px-4 pb-32 pt-20 sm:px-6 lg:mx-auto lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                className="hidden lg:block shrink-0"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary-500/20 via-primary-500/5 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                  <img
                    src={featuredMovie.poster_url || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'}
                    alt={featuredMovie.title}
                    className="relative w-[280px] h-[420px] object-cover rounded-3xl shadow-poster ring-1 ring-white/[0.1] animate-float-slow transition-transform duration-500"
                  />
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.05]" />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
                className="max-w-2xl"
              >
                <div className="mb-6 flex flex-wrap items-center gap-2.5">
                  <span className="cinema-badge bg-primary-500/20 text-primary-300 border-primary-500/30">
                    Now Playing
                  </span>
                  {featuredMovie.classification && (
                    <span className="cinema-badge">{featuredMovie.classification}</span>
                  )}
                  {featuredMovie.rating && (
                    <span className="cinema-badge bg-amber-500/15 text-amber-300 border-amber-500/25">
                      <Star className="h-3 w-3 fill-current" />
                      {featuredMovie.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <h1 className="mb-6 max-w-3xl text-4xl font-display font-extrabold text-white md:text-6xl lg:text-[4.25rem] tracking-tight leading-[1.05]">
                  {featuredMovie.title}
                </h1>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-neutral-300/90">
                  {featuredMovie.description}
                </p>

                <div className="mb-10 flex flex-wrap gap-2.5">
                  <span className="info-chip">
                    <CalendarDays className="h-3.5 w-3.5 text-primary-400" />
                    {new Date(featuredMovie.release_date).getFullYear()}
                  </span>
                  <span className="info-chip">
                    <Clock className="h-3.5 w-3.5 text-primary-400" />
                    {featuredMovie.duration} min
                  </span>
                  <span className="info-chip">
                    {featuredMovie.genre}
                  </span>
                  {featuredMovie.classification && (
                    <span className="info-chip">
                      {featuredMovie.classification}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to={`/book/${featuredMovie._id}`} className="btn btn-primary btn-lg group">
                    <Ticket className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                    Buy Tickets
                  </Link>
                  <Link to={`/movies/${featuredMovie._id}`} className="btn btn-secondary btn-lg group">
                    <Play className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    View Details
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Search Panel */}
      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-panel mx-auto max-w-5xl p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="group">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">City</span>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-all duration-300 group-focus-within:border-primary-500/40 group-focus-within:bg-white/[0.05] group-focus-within:shadow-lg group-focus-within:shadow-primary-500/5">
                <MapPin className="h-4 w-4 text-primary-400" />
                <select className="w-full bg-transparent text-sm font-medium text-white outline-none cursor-pointer">
                  <option>Jakarta</option>
                  <option>Bandung</option>
                  <option>Surabaya</option>
                </select>
              </div>
            </label>
            <label className="group">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Cinema</span>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-all duration-300 group-focus-within:border-primary-500/40 group-focus-within:bg-white/[0.05] group-focus-within:shadow-lg group-focus-within:shadow-primary-500/5">
                <Ticket className="h-4 w-4 text-primary-400" />
                <select className="w-full bg-transparent text-sm font-medium text-white outline-none cursor-pointer">
                  <option>Grand Indonesia</option>
                  <option>Central Park</option>
                  <option>Senayan City</option>
                </select>
              </div>
            </label>
            <label className="group">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Date</span>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-all duration-300 group-focus-within:border-primary-500/40 group-focus-within:bg-white/[0.05] group-focus-within:shadow-lg group-focus-within:shadow-primary-500/5">
                <CalendarDays className="h-4 w-4 text-primary-400" />
                <select className="w-full bg-transparent text-sm font-medium text-white outline-none cursor-pointer">
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Weekend</option>
                </select>
              </div>
            </label>
            <Link to="/movies" className="btn btn-accent self-end px-6 py-3.5">
              <Search className="h-4 w-4" />
              Find
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Now Showing Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-eyebrow mb-3"
              >
                In theaters
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight"
              >
                Now Playing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-3 max-w-lg text-sm text-neutral-400 leading-relaxed"
              >
                Pick a film, choose your studio, and reserve seats in a few taps.
              </motion.p>
            </div>
            <Link to="/movies" className="btn btn-secondary btn-sm">
              View All Movies
            </Link>
          </div>

          {error && (
            <div className="card p-4 mb-8 text-red-400 border-red-500/20 bg-red-500/5">
              {error}
            </div>
          )}

          {nowShowing.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nowShowing.slice(0, 4).map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-neutral-600" />
              </div>
              <p className="text-neutral-400 text-sm">No movies currently showing.</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-eyebrow mb-3"
              >
                Plan ahead
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight"
              >
                Coming Soon
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-3 max-w-lg text-sm text-neutral-400 leading-relaxed"
              >
                Upcoming releases ready for trailers, reminders, and presale tickets.
              </motion.p>
            </div>
          </div>
          {comingSoon.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.slice(0, 4).map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-neutral-600" />
              </div>
              <p className="text-neutral-400 text-sm">No coming soon movies in demo data.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
