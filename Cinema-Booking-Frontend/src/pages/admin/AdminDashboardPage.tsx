import { useEffect, useState } from 'react'
import { Film, Building, Calendar, Users, TrendingUp, Sparkles, ArrowUpRight, Clock, Star, PlusCircle, CalendarPlus, FileBarChart } from 'lucide-react'
import { motion } from 'framer-motion'

import { Skeleton } from '@/components/LoadingSpinner'
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';

interface DashboardStats {
  totalMovies: number;
  totalHalls: number;
  totalShowtimes: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  recentBookings: any[];
  popularMovies: { title: string; seats: number }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalHalls: 0,
    totalShowtimes: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
    popularMovies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError('');
      setStats(await adminService.getDashboardStats());
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-56 mb-2 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={fetchDashboardStats} />
    );
  }

  const statCards = [
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: Film,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      accent: 'before:bg-blue-500'
    },
    {
      title: 'Total Halls',
      value: stats.totalHalls,
      icon: Building,
      color: 'text-green-400',
      bgColor: 'bg-green-500/15',
      accent: 'before:bg-green-500'
    },
    {
      title: 'Total Showtimes',
      value: stats.totalShowtimes,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      accent: 'before:bg-purple-500'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      accent: 'before:bg-orange-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/15',
      accent: 'before:bg-cyan-500'
    },
    {
      title: 'Total Revenue',
      value: `IDR ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/15',
      accent: 'before:bg-primary-500'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 cinema-badge normal-case tracking-normal text-[11px] bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              Live
            </span>
          </div>
          <p className="text-neutral-400">Overview of your cinema management system</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`card p-6 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-2xl ${stat.accent}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="flex items-center gap-2 text-lg font-display font-semibold text-white mb-4">
            <Sparkles className="h-4 w-4 text-primary-400" />
            Quick Actions
          </h3>
          <div className="space-y-2.5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/admin/movies?openModal=true')}
              className="btn btn-primary w-full justify-start gap-2.5"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Movie
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/admin/showtimes?openModal=true')}
              className="btn btn-secondary w-full justify-start gap-2.5"
            >
              <CalendarPlus className="h-4 w-4" />
              Create Showtime
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/admin/reports?openModal=true')}
              className="btn btn-secondary w-full justify-start gap-2.5"
            >
              <FileBarChart className="h-4 w-4" />
              View Reports
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 text-sm">Database</span>
              <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 text-sm">API Service</span>
              <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 text-sm">Booking System</span>
              <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-display font-semibold text-white">
              <Clock className="h-4 w-4 text-orange-400" />
              Recent Bookings
            </h3>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-neutral-500 hover:text-primary-400 transition-colors duration-200"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentBookings.length > 0 ? stats.recentBookings.map((booking) => (
              <div key={booking._id} className="flex justify-between items-center text-sm border-b border-white/[0.04] last:border-0 pb-3 last:pb-0">
                <span className="text-neutral-300 truncate mr-2">{booking.showtime.movie.title}</span>
                <span className="cinema-badge normal-case tracking-normal text-[11px] py-1 px-2.5 text-primary-400 whitespace-nowrap">#{booking._id.slice(-6)}</span>
              </div>
            )) : <p className="text-neutral-500 text-sm">No recent bookings yet.</p>}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-display font-semibold text-white">
              <Star className="h-4 w-4 text-accent-400" />
              Popular Movies
            </h3>
            <button
              onClick={() => navigate('/admin/movies')}
              className="text-neutral-500 hover:text-primary-400 transition-colors duration-200"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.popularMovies.length > 0 ? stats.popularMovies.map((movie) => (
              <div key={movie.title} className="flex justify-between items-center text-sm border-b border-white/[0.04] last:border-0 pb-3 last:pb-0">
                <span className="text-neutral-300 truncate mr-2">{movie.title}</span>
                <span className="text-accent-500 font-medium whitespace-nowrap">{movie.seats} seats</span>
              </div>
            )) : <p className="text-neutral-500 text-sm">No confirmed bookings yet.</p>}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
