import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Play, Search, Star, Ticket } from 'lucide-react';
import { IMovie } from '@/types';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { movieService } from '@/services/movieService';

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
      if (data && data.length > 0) {
        // Use a random movie for the hero section for variety
        const randomIndex = Math.floor(Math.random() * data.length);
        setFeaturedMovie(data[randomIndex]);
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative min-h-[76vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backdrop})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/75 to-dark-950/20" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-dark-950 to-transparent" />
          </div>
          
          <div className="relative z-10 flex min-h-[76vh] max-w-7xl items-center px-4 pb-28 pt-16 sm:px-6 lg:mx-auto lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="cinema-badge bg-primary-600/90">Now Playing</span>
                {featuredMovie.classification && <span className="cinema-badge">{featuredMovie.classification}</span>}
                {featuredMovie.rating ? (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-300">
                    <Star className="h-4 w-4 fill-current" />
                    {featuredMovie.rating.toFixed(1)}
                  </span>
                ) : null}
              </div>
              <h1 className="mb-5 max-w-3xl text-5xl font-black text-white md:text-7xl">
                {featuredMovie.title}
            </h1>
              <p className="mb-6 max-w-2xl text-lg leading-8 text-slate-200">
                {featuredMovie.description}
            </p>
              <div className="mb-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <span>{featuredMovie.genre}</span>
                <span>•</span>
                <span>{featuredMovie.duration} minutes</span>
                <span>•</span>
                <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={`/book/${featuredMovie._id}`} className="btn btn-primary text-lg px-8 py-3">
                <Ticket className="h-5 w-5 mr-2" />
                Buy Tickets
              </Link>
              <Link to={`/movies/${featuredMovie._id}`} className="btn btn-secondary text-lg px-8 py-3">
                <Play className="h-5 w-5 mr-2" />
                View Details
              </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="cinema-panel mx-auto max-w-7xl p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="group">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">City</span>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-dark-950 px-4 py-3">
                <MapPin className="h-5 w-5 text-accent-400" />
                <select className="w-full bg-transparent text-sm font-semibold text-white outline-none">
                  <option>Jakarta</option>
                  <option>Bandung</option>
                  <option>Surabaya</option>
                </select>
              </div>
            </label>
            <label>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Cinema</span>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-dark-950 px-4 py-3">
                <Ticket className="h-5 w-5 text-accent-400" />
                <select className="w-full bg-transparent text-sm font-semibold text-white outline-none">
                  <option>Grand Indonesia</option>
                  <option>Central Park</option>
                  <option>Senayan City</option>
                </select>
              </div>
            </label>
            <label>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Date</span>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-dark-950 px-4 py-3">
                <CalendarDays className="h-5 w-5 text-accent-400" />
                <select className="w-full bg-transparent text-sm font-semibold text-white outline-none">
                  <option>Today, Jul 7</option>
                  <option>Tomorrow, Jul 8</option>
                  <option>Weekend</option>
                </select>
              </div>
            </label>
            <Link to="/movies" className="btn btn-accent self-end px-6 py-3">
              <Search className="h-5 w-5" />
              Find Showtimes
            </Link>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-eyebrow mb-3">In theaters</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Now Playing
            </h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                Pick a film, choose your studio, and reserve seats in a few taps.
            </p>
            </div>
            <Link to="/movies" className="btn btn-secondary">
              View All Movies
            </Link>
          </div>

          {error && (
            <div className="card p-4 mb-8 text-red-300 border-red-500/40">
              {error}
            </div>
          )}

          {nowShowing.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {nowShowing.slice(0, 4).map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No movies currently showing.</p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-eyebrow mb-3">Plan ahead</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Coming Soon
            </h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                Upcoming releases ready for trailers, reminders, and presale tickets.
            </p>
            </div>
          </div>
          {comingSoon.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.slice(0, 4).map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No coming soon movies in demo data.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
