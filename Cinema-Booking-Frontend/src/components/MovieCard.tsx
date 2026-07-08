import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Ticket } from 'lucide-react';
import type { IMovie } from '@/types';

interface MovieCardProps {
  movie: IMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isComingSoon = movie.status === 'coming_soon';
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="movie-card group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/10 to-transparent opacity-80" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <span className={`cinema-badge ${isComingSoon ? 'text-accent-200' : 'text-white'}`}>
            {isComingSoon ? 'Coming Soon' : 'Now Playing'}
          </span>
          {movie.classification && (
            <span className="rounded bg-dark-950/80 px-2 py-1 text-xs font-bold text-white">
              {movie.classification}
            </span>
          )}
        </div>
        {!isComingSoon && movie.rating ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-dark-950/85 px-3 py-1 text-sm font-semibold text-accent-300">
            <Star className="h-4 w-4 fill-current" />
            {movie.rating.toFixed(1)}
          </div>
        ) : null}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold group-hover:text-accent-300 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{movie.duration} mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{releaseYear}</span>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{movie.genre}</span>
          {isComingSoon && (
            <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-300">
              {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2">
            <Link
              to={`/movies/${movie._id}`}
              className="btn btn-secondary flex-1"
            >
              Details
            </Link>
            <Link
              to={`/book/${movie._id}`}
              className={`btn flex-1 ${isComingSoon ? 'btn-secondary' : 'btn-primary'}`}
            >
              <Ticket className="h-4 w-4" />
              {isComingSoon ? 'Preview' : 'Buy'}
            </Link>
        </div>
      </div>
    </div>
  );
}
