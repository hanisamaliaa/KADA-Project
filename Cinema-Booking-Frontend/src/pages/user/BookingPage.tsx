import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Armchair, CalendarDays, Clock, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMovie, IShowtime } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import toast from 'react-hot-toast';
import BookingProgress from '@/components/BookingProgress';
import { movieService } from '@/services/movieService';
import { showtimeService } from '@/services/showtimeService';
import { bookingService } from '@/services/bookingService';

interface SeatSelectionData {
  movieId: string;
  showtimeId: string;
  selectedSeats: string[];
  totalAmount: number;
}

export default function BookingPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<IShowtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showtimeId) {
      fetchFromShowtime(showtimeId);
    } else if (movieId) {
      fetchMovieAndShowtimes(movieId);
    }
  }, [movieId, showtimeId]);

  useEffect(() => {
    if (selectedShowtime) {
      fetchOccupiedSeats(selectedShowtime._id);
    }
  }, [selectedShowtime]);

  const fetchMovieAndShowtimes = async (id: string) => {
    try {
      setError('');
      const [movieData, showtimesData] = await Promise.all([
        movieService.getMovieById(id),
        showtimeService.getMovieShowtimes(id)
      ]);

      setMovie(movieData);
      setShowtimes(showtimesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFromShowtime = async (id: string) => {
    try {
      setError('');
      const showtime = await showtimeService.getShowtimeById(id);
      const showtimesData = await showtimeService.getMovieShowtimes(showtime.movie._id);
      setMovie(showtime.movie);
      setShowtimes(showtimesData);
      setSelectedShowtime(showtime);
    } catch (error) {
      console.error('Error fetching showtime:', error);
      setError('Unable to load showtime details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOccupiedSeats = async (showtimeId: string) => {
    try {
      const data = await bookingService.getSeatAvailability(showtimeId);
      setOccupiedSeats(data);
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
      toast.error("Could not load seat information.");
    }
  };

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 10;
    const seats = [];
    
    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isOccupied = occupiedSeats.includes(seatId);
        seats.push({
          id: seatId,
          row,
          category: row === 'H' || row === 'I' ? 'premiere' : row === 'J' ? 'couple' : 'regular',
          isOccupied,
        });
      }
    }
    
    return seats;
  };

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleProceedToPayment = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      toast.error('Please select a showtime and at least one seat');
      return;
    }

    const selectionData: SeatSelectionData = {
      movieId: movie?._id || movieId!,
      showtimeId: selectedShowtime._id,
      selectedSeats,
      totalAmount: selectedSeats.length * selectedShowtime.ticket_price
    };

    sessionStorage.setItem('seatSelection', JSON.stringify(selectionData));
    navigate('/payment');
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setLoading(true);
            if (showtimeId) fetchFromShowtime(showtimeId);
            else if (movieId) fetchMovieAndShowtimes(movieId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 font-sans">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-dark-950/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/movies" className="btn btn-secondary flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <BookingProgress currentStep="selection" />
          <div></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8 flex flex-col gap-6 glass-panel p-6 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-b from-primary-500/15 to-transparent rounded-2xl blur-xl opacity-50" />
            <img src={movie.poster_url} alt={movie.title} className="relative w-24 rounded-2xl shadow-poster ring-1 ring-white/[0.1] sm:w-28"/>
          </div>
          <div>
            <p className="section-eyebrow mb-2">Reserve seats</p>
            <h1 className="text-3xl font-bold font-display text-white">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="info-chip">{movie.genre}</span>
              <span className="info-chip"><Clock className="h-3.5 w-3.5" />{movie.duration} min</span>
              {movie.classification && <span className="info-chip">{movie.classification}</span>}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="glass-panel mb-8 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="section-eyebrow mb-2">Schedule</p>
                <h2 className="text-xl font-semibold text-white">Choose Date & Time</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin className="h-4 w-4 text-accent-500" />
                CinemaID Grand Indonesia
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {showtimes.map((showtime) => (
                <button
                    key={showtime._id}
                    className={`min-w-[180px] rounded-xl border p-4 text-left transition-all duration-300 ${
                      selectedShowtime?._id === showtime._id
                        ? 'border-primary-500/50 bg-primary-500/10 text-white shadow-lg shadow-primary-500/10'
                        : 'border-white/[0.06] bg-white/[0.03] text-neutral-300 hover:border-white/[0.1] hover:bg-white/[0.06]'
                    }`}
                    onClick={() => {
                      setSelectedShowtime(showtime);
                      setSelectedSeats([]);
                    }}
                >
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(showtime.show_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="block text-2xl font-black text-white">{showtime.start_time}</span>
                    <span className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                      <Clock className="h-4 w-4" />
                      {showtime.hall.hall_name}
                    </span>
                </button>
            ))}
            </div>
        </motion.div>

        {selectedShowtime && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
              <div className="mx-auto mb-10 max-w-3xl">
                <div className="h-10 rounded-t-full border-t-4 border-accent-500 bg-gradient-to-b from-accent-500/20 to-transparent text-center text-xs font-bold uppercase tracking-[0.35em] text-accent-500">
                  Screen
                </div>
              </div>
              <div className="mx-auto mb-6 max-w-3xl space-y-2 overflow-x-auto pb-2">
                  {['A','B','C','D','E','F','G','H','I','J'].map((row) => (
                    <div key={row} className="grid min-w-[430px] grid-cols-[24px_repeat(10,1fr)_24px] items-center gap-2">
                      <span className="text-center text-xs font-bold text-neutral-600">{row}</span>
                      {generateSeats().filter((seat) => seat.row === row).map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.isOccupied}
                          className={`seat mx-auto ${
                            seat.isOccupied
                              ? 'seat-occupied'
                              : selectedSeats.includes(seat.id)
                              ? 'seat-selected'
                              : seat.category === 'premiere' || seat.category === 'couple'
                              ? 'seat-premiere'
                              : 'seat-available'
                          }`}
                          aria-label={`Seat ${seat.id}`}
                        >
                          {seat.id.replace(row, '')}
                        </button>
                      ))}
                      <span className="text-center text-xs font-bold text-neutral-600">{row}</span>
                    </div>
                  ))}
              </div>
               <div className="flex flex-wrap justify-center gap-5 text-sm text-neutral-400">
                  <div className="flex items-center space-x-2"><div className="seat seat-available h-4 w-4"></div><span>Regular</span></div>
                  <div className="flex items-center space-x-2"><div className="seat seat-premiere h-4 w-4"></div><span>Premiere</span></div>
                  <div className="flex items-center space-x-2"><div className="seat seat-selected h-4 w-4"></div><span>Selected</span></div>
                  <div className="flex items-center space-x-2"><div className="seat seat-occupied h-4 w-4"></div><span>Occupied</span></div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-24 p-6">
                <p className="section-eyebrow mb-2">Order</p>
                <h3 className="text-xl font-semibold mb-4 text-white">Booking Summary</h3>
                <div className="mb-5 rounded-xl bg-white/[0.03] p-4 text-sm border border-white/[0.06]">
                  <div className="mb-2 flex justify-between"><span className="text-neutral-400">Studio</span><span className="font-semibold text-white">{selectedShowtime.hall.hall_name}</span></div>
                  <div className="mb-2 flex justify-between"><span className="text-neutral-400">Date</span><span className="font-semibold text-white">{new Date(selectedShowtime.show_date).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Time</span><span className="font-semibold text-white">{selectedShowtime.start_time}</span></div>
                </div>
                <ul className="mb-4 max-h-44 space-y-2 overflow-y-auto">
                  {selectedSeats.map(seat => (
                    <li key={seat} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                      <span className="inline-flex items-center gap-2 text-white text-sm"><Armchair className="h-4 w-4 text-accent-500" /> Seat {seat}</span>
                      <button
                        onClick={() => handleSeatClick(seat)}
                        className="text-neutral-500 hover:text-white transition-colors"
                        aria-label={`Remove seat ${seat}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                  {selectedSeats.length === 0 && <p className="text-neutral-500 text-sm">No seats selected.</p>}
                </ul>
                <div className="border-t border-white/[0.06] pt-4">
                    <div className="mb-2 flex justify-between text-sm text-neutral-400">
                      <span>{selectedSeats.length} ticket(s)</span>
                      <span>IDR {selectedShowtime.ticket_price.toLocaleString()} each</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span className="text-white">Total</span>
                        <span className="text-accent-500">IDR {(selectedSeats.length * selectedShowtime.ticket_price).toLocaleString()}</span>
                    </div>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="btn btn-primary w-full mt-6 py-3 text-lg"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
