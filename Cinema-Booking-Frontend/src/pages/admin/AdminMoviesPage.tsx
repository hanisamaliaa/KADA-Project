import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '@/services/movieService';
import type { IMovie } from '@/types';

type MovieFormData = Omit<IMovie, '_id' | 'createdAt' | 'updatedAt'>;

interface MovieFormProps {
  movieToEdit: IMovie | null;
  onClose: () => void;
  onSave: () => void;
}

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  exit: { opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.15 } },
}

const MovieForm: React.FC<MovieFormProps> = ({ movieToEdit, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormData>();

  useEffect(() => {
    if (movieToEdit) {
      reset({
        ...movieToEdit,
        release_date: new Date(movieToEdit.release_date).toISOString().split('T')[0],
      });
    } else {
      reset();
    }
  }, [movieToEdit, reset]);

  const onSubmit: SubmitHandler<MovieFormData> = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        duration: Number(formData.duration),
      };

      if (movieToEdit) {
        await movieService.updateMovie(movieToEdit._id, dataToSubmit);
      } else {
        await movieService.createMovie({
          ...dataToSubmit,
          status: dataToSubmit.status || 'now_showing',
          is_now_showing: dataToSubmit.status !== 'coming_soon',
        });
      }

      toast.success(`Movie ${movieToEdit ? 'updated' : 'added'} successfully!`);
      onSave();
    } catch (error: any) {
      toast.error(error.message);
      console.error('Error saving movie:', error);
    }
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="card w-full max-w-2xl p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-dark-800/60 transition-all duration-200">&times;</button>
        <h2 className="text-2xl font-display font-bold text-white mb-6">{movieToEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="input" />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
            <textarea {...register('description')} className="input" rows={4}></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Genre</label>
              <input {...register('genre', { required: 'Genre is required' })} className="input" />
              {errors.genre && <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Duration (minutes)</label>
              <input type="number" {...register('duration', { required: 'Duration is required' })} className="input" />
              {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Release Date</label>
              <input type="date" {...register('release_date', { required: 'Release date is required' })} className="input" />
              {errors.release_date && <p className="text-red-400 text-sm mt-1">{errors.release_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Poster URL</label>
              <input {...register('poster_url')} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Trailer URL (Embed)</label>
            <input {...register('trailer_url')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Status</label>
            <select {...register('status')} className="input">
              <option value="now_showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Save Movie'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface DeleteModalProps {
  movie: IMovie;
  onClose: () => void;
  onConfirm: (movieId: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ movie, onClose, onConfirm }) => {
  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="card p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-display font-bold text-white mb-4">Confirm Deletion</h2>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to delete the movie "<strong className="text-white">{movie.title}</strong>"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <motion.button
            onClick={() => onConfirm(movie._id)}
            className="btn btn-danger"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Delete Movie
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<IMovie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<IMovie | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getMovies();
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (movie: IMovie | null) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('openModal') === 'true') {
      handleOpenModal(null);
      searchParams.delete('openModal');
      setSearchParams(searchParams);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
  };

  const handleSave = () => {
    fetchMovies();
    handleCloseModal();
  };

  const handleDeleteClick = (movie: IMovie) => {
    setMovieToDelete(movie);
  };

  const handleConfirmDelete = async (movieId: string) => {
    try {
      await movieService.deleteMovie(movieId);

      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error: any) {
      console.error('Error deleting movie:', error);
      toast.error(error.message);
    } finally {
      setMovieToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const genres = [...new Set(movies.map((movie) => movie.genre))];
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = !searchTerm || movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || movie.genre === genreFilter;
    const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {isModalOpen && (
          <MovieForm
            movieToEdit={editingMovie}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
        {movieToDelete && (
          <DeleteConfirmationModal
            movie={movieToDelete}
            onClose={() => setMovieToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Movies</h1>
          <p className="text-neutral-400">Manage your movie catalog</p>
        </div>
        <motion.button
          onClick={() => handleOpenModal(null)}
          className="btn btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Movie</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="input"
          placeholder="Search movies..."
        />
        <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)} className="input">
          <option value="">All Genres</option>
          {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input">
          <option value="all">All Status</option>
          <option value="now_showing">Now Showing</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
      </motion.div>

      {filteredMovies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 card"
        >
          <p className="text-neutral-400 text-lg mb-4">No movies found</p>
          <motion.button
            onClick={() => handleOpenModal(null)}
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Your First Movie
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800/60">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {filteredMovies.map((movie) => (
                  <motion.tr
                    key={movie._id}
                    variants={rowVariants}
                    className="hover:bg-dark-800/40 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={movie.poster_url || 'https://placehold.co/100x150/171717/525252?text=No+Image'}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded-xl"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white max-w-xs truncate">
                            {movie.title}
                          </div>
                          <div className="text-sm text-neutral-500 line-clamp-2 max-w-xs">
                            {movie.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="cinema-badge">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {movie.duration} mins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleOpenModal(movie)}
                          className="text-green-400 hover:text-green-300 p-2 rounded-xl hover:bg-dark-700/60 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteClick(movie)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-dark-700/60 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
