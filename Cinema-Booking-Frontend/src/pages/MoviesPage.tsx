import { useMovies } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar/SearchBar';
import GenreFilter from '@/components/GenreFilter/GenreFilter';
import Pagination from '@/components/Pagination/Pagination';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import EmptyState from '@/components/EmptyState/EmptyState';
import ErrorState from '@/components/ErrorState/ErrorState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function MoviesPage() {
  const {
    movies,
    loading,
    fetching,
    error,
    search,
    genre,
    page,
    limit,
    totalItems,
    totalPages,
    genres,
    setSearch,
    setGenre,
    setPage,
    retry,
  } = useMovies(8);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel mb-10 p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SearchBar value={search} onChange={setSearch} />
            <GenreFilter genres={genres} value={genre} onChange={setGenre} />
          </div>
        </motion.div>

        {error && <ErrorState message={error} onRetry={retry} />}

        {!error && (
          <>
            {movies.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-2">
                    {totalItems} movies found
                    {fetching && (
                      <LoadingSpinner size="sm" className="opacity-60" />
                    )}
                  </span>
                  <span>{genre || 'All genres'}</span>
                </div>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${
                    fetching ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  limit={limit}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState searchTerm={search} selectedGenre={genre} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
