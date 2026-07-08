import { Calendar, Mail, Shield, Ticket, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import type { IBooking } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      try {
        setBookings(await bookingService.getMyBookings(user.id));
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed').length;

  return (
    <div className="min-h-screen py-8 bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-display font-bold mb-8 text-neutral-50"
        >
          Profile
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="glass-panel p-6 lg:col-span-1 text-center">
            <div className="relative inline-block mb-5">
              <div className="absolute -inset-2 bg-gradient-to-b from-primary-500/20 to-transparent rounded-full blur-xl opacity-50" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 mx-auto flex items-center justify-center overflow-hidden ring-2 ring-primary-500/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-primary-400" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-neutral-50">{user.fullName}</h2>
            <p className="text-neutral-400 text-sm">{user.email}</p>
            <span className="status-badge status-confirmed mt-4">{user.role}</span>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-5 text-neutral-50">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Email</p>
                    <p className="font-medium text-neutral-200">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Role</p>
                    <p className="font-medium capitalize text-neutral-200">{user.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-5 text-neutral-50">Booking Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <p className="text-sm text-neutral-400 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-neutral-50">{bookings.length}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <p className="text-sm text-neutral-400 mb-1">Confirmed</p>
                  <p className="text-2xl font-bold text-emerald-400">{confirmedBookings}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <p className="text-sm text-neutral-400 mb-1">Cancelled</p>
                  <p className="text-2xl font-bold text-red-400">
                    {bookings.filter((booking) => booking.status === 'cancelled').length}
                  </p>
                </div>
              </div>
              <Link to="/my-bookings" className="btn btn-primary mt-6 inline-flex items-center space-x-2">
                <Ticket className="h-4 w-4" />
                <span>View My Bookings</span>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="glass-panel p-5">
              <div className="flex items-center space-x-3 text-neutral-300">
                <Calendar className="h-5 w-5 text-primary-400 shrink-0" />
                <p className="text-sm">This profile uses frontend-only demo state for the starter.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
