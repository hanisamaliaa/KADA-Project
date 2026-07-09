import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { IMovie } from '@/types';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { movieService } from '@/services/movieService';

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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="section-eyebrow mb-3">Browse tickets</p>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Movies & Showtimes
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Filter by status, genre, and rating to find your next cinema plan.
          </p>
        </div>

        {/* Filters */}
        <div className="cinema-panel mb-8 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="input pl-10 pr-8 appearance-none bg-dark-800"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'now_showing' | 'coming_soon')}
            className="input bg-dark-800"
          >
            <option value="all">All Status</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'release_date' | 'rating')}
            className="input bg-dark-800"
          >
            <option value="title">Sort by Title</option>
            <option value="release_date">Sort by Release Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} onRetry={fetchMovies} />
          </div>
        )}

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between text-sm text-slate-400">
              <span>{filteredMovies.length} movies found</span>
              <span>{selectedStatus === 'all' ? 'All titles' : selectedStatus === 'now_showing' ? 'Now playing' : 'Coming soon'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {searchTerm || selectedGenre 
                ? 'No movies found matching your criteria.' 
                : 'No movies currently available.'
              }
            </p>
          </div>
        )}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-white text-sm flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
