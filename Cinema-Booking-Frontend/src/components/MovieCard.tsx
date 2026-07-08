import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Ticket } from 'lucide-react';
import type { IMovie } from '@/types';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: IMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isComingSoon = movie.status === 'coming_soon';
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="movie-card group flex flex-col card-glow"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-white/[0.02]">
        <img
          src={movie.poster_url || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent opacity-80" />

        {/* Top badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <span className={`cinema-badge ${isComingSoon ? 'bg-accent-500/20 text-accent-300 border-accent-500/30' : 'bg-primary-500/20 text-primary-300 border-primary-500/30'}`}>
            {isComingSoon ? 'Coming Soon' : 'Now Playing'}
          </span>
          {movie.classification && (
            <span className="rounded-lg bg-dark-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
              {movie.classification}
            </span>
          )}
        </div>

        {/* Rating */}
        {!isComingSoon && movie.rating ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-dark-950/80 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <Star className="h-3.5 w-3.5 fill-current" />
            {movie.rating.toFixed(1)}
          </div>
        ) : null}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-600/0 via-primary-600/0 to-primary-600/0 group-hover:from-primary-600/20 group-hover:via-primary-600/5 group-hover:to-transparent transition-all duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-xl">
              <Ticket className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4.5 flex flex-col flex-grow">
        <h3 className="mb-2.5 line-clamp-2 text-[15px] font-display font-semibold text-white group-hover:text-primary-400 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{movie.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{releaseYear}</span>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-neutral-300 border border-white/[0.06]">{movie.genre}</span>
          {isComingSoon && (
            <span className="rounded-lg bg-accent-500/10 px-2.5 py-1 text-[10px] font-medium text-accent-400 border border-accent-500/20">
              {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2">
          <Link
            to={`/movies/${movie._id}`}
            className="btn btn-secondary btn-sm flex-1"
          >
            Details
          </Link>
          <Link
            to={`/book/${movie._id}`}
            className={`btn btn-sm flex-1 ${isComingSoon ? 'btn-secondary' : 'btn-primary'}`}
          >
            <Ticket className="h-3.5 w-3.5" />
            {isComingSoon ? 'Preview' : 'Buy'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
