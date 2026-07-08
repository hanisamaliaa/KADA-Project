import { useEffect, useState } from 'react';
import { Film, Building, TrendingUp, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { adminService } from '@/services/adminService';
import { movieService } from '@/services/movieService';
import { showtimeService } from '@/services/showtimeService';
import type { IBooking, IHall, IMovie } from '@/types';

export default function AdminReportsPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [halls, setHalls] = useState<IHall[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<{ date: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [stats, moviesData, hallsData, bookingsData] = await Promise.all([
        adminService.getDashboardStats(),
        movieService.getMovies(),
        showtimeService.getHalls(),
        adminService.getAllBookings(),
      ]);
      setMovies(moviesData);
      setHalls(hallsData);
      setBookings(bookingsData);
      setWeeklyRevenue(stats.weeklyRevenue);
    } catch (error) {
      console.error(error);
      toast.error('Error loading report data');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = bookings
    .filter(b => b.status === 'confirmed' && b.booking_date.startsWith(today))
    .reduce((sum, b) => sum + b.total_amount, 0);

  const currentMovies = movies.filter(m => m.is_now_showing);
  const activeHalls = halls.filter(h => h.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Revenue",
      value: `IDR ${todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/15'
    },
    {
      title: 'Now Showing Movies',
      value: currentMovies.length,
      icon: Film,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15'
    },
    {
      title: 'Active Halls',
      value: activeHalls.length,
      icon: Building,
      color: 'text-green-400',
      bgColor: 'bg-green-500/15'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Reports</h1>
          <p className="text-neutral-400">Daily performance overview</p>
        </div>
        <motion.button
          onClick={fetchReportData}
          className="btn btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="card p-6"
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

      <motion.div variants={itemVariants} className="card p-6 mt-6">
        <h2 className="text-xl font-display font-bold text-white mb-4">Weekly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="date" stroke="#737373" tick={{ fill: '#a3a3a3' }} />
            <YAxis stroke="#737373" tick={{ fill: '#a3a3a3' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f1f1f',
                borderColor: '#404040',
                borderRadius: '12px',
                color: '#fafafa',
              }}
              itemStyle={{ color: '#fafafa' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="revenue" fill="#e11d63" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
