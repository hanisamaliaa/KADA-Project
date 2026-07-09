import { useEffect, useState } from 'react'
import { Film, Building, Calendar, Users, TrendingUp } from 'lucide-react'

import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
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
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Total Halls',
      value: stats.totalHalls,
      icon: Building,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Total Showtimes',
      value: stats.totalShowtimes,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      title: 'Total Revenue',
      value: `IDR ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your cinema management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/movies?openModal=true')} className="btn btn-primary w-full text-left">
              Add New Movie
            </button>
            <button onClick={() => navigate('/admin/showtimes?openModal=true')} className="btn btn-secondary w-full text-left">
              Create Showtime
            </button>
            <button onClick={() => navigate('/admin/reports?openModal=true')} className="btn btn-secondary w-full text-left">
              View Reports
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Service</span>
              <span className="text-green-400">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Booking System</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {stats.recentBookings.map((booking) => (
              <div key={booking._id} className="flex justify-between text-sm">
                <span className="text-slate-300">{booking.showtime.movie.title}</span>
                <span className="text-primary-400">#{booking._id.slice(-6)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Movies</h3>
          <div className="space-y-3">
            {stats.popularMovies.length > 0 ? stats.popularMovies.map((movie) => (
              <div key={movie.title} className="flex justify-between text-sm">
                <span className="text-slate-300">{movie.title}</span>
                <span className="text-accent-400">{movie.seats} seats</span>
              </div>
            )) : <p className="text-slate-400 text-sm">No confirmed bookings yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
