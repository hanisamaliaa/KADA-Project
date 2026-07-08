import { useEffect, useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { IMovie } from '@/types';
import MovieCard from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/LoadingSpinner';
import { movieService } from '@/services/movieService';
import { motion } from 'framer-motion';

export default function MoviesPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'now_showing' | 'coming_soon'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'release_date' | 'rating'>('title');
  const [genres, setGenres] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const moviesPerPage = 8;

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre, selectedStatus, sortBy]);

  const fetchMovies = async () => {
    try {
      const data = await movieService.getMovies();
      setMovies(data || []);
      const uniqueGenres = [...new Set(data?.map((movie: IMovie) => movie.genre).filter(Boolean) || [])];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Could not load demo movies.');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(movie => movie.status === selectedStatus);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'release_date') {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.title.localeCompare(b.title);
    });

    setFilteredMovies(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / moviesPerPage));
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  if (loading) {
    return (
      <div className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3">
            <div className="skeleton h-4 w-28 rounded-full" />
            <div className="skeleton h-10 w-64 rounded-xl" />
            <div className="skeleton h-4 w-80 rounded-lg" />
          </div>
          <div className="skeleton h-16 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-eyebrow mb-3">Browse tickets</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4">
            Movies & Showtimes
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Filter by status, genre, and rating to find your next cinema plan.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel mb-10 p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4 group-focus-within:text-primary-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 py-2.5"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4 group-focus-within:text-primary-400 transition-colors duration-300" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input pl-10 pr-8 py-2.5 appearance-none cursor-pointer"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'now_showing' | 'coming_soon')}
              className="input py-2.5 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="now_showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'release_date' | 'rating')}
              className="input py-2.5 cursor-pointer"
            >
              <option value="title">Sort by Title</option>
              <option value="release_date">Sort by Release Date</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </motion.div>

        {error && (
          <div className="card p-4 mb-8 text-red-400 border-red-500/20 bg-red-500/5">{error}</div>
        )}

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
              <span>{filteredMovies.length} movies found</span>
              <span>{selectedStatus === 'all' ? 'All titles' : selectedStatus === 'now_showing' ? 'Now playing' : 'Coming soon'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMovies.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-md shadow-primary-950/30'
                          : 'bg-white/[0.04] text-neutral-400 hover:bg-white/[0.07] hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="h-8 w-8 text-neutral-600" />
            </div>
            <p className="text-neutral-400 text-sm mb-1">
              {searchTerm || selectedGenre
                ? 'No movies found matching your criteria.'
                : 'No movies currently available.'
              }
            </p>
            <p className="text-neutral-500 text-xs">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
