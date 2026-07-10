import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, MapPin, Settings, Ticket, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo.png";

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
  ];

  if (user) {
    navItems.push({ href: '/my-bookings', label: 'My Bookings' });
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-dark-950/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-dark-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
          <img
          src={logo}
          alt="CineLux Logo"
          className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-lg font-display font-bold text-white tracking-tight">
            CINE<span className="text-primary-400">LUX</span>
          </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                  isActive(item.href)
                    ? 'text-white bg-white/[0.08]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
              <MapPin className="h-3.5 w-3.5 text-primary-400" />
              Jakarta
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex btn btn-secondary btn-sm"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <Link to="/my-bookings" className="hidden sm:inline-flex btn btn-accent btn-sm">
                  <Ticket className="h-3.5 w-3.5" />
                  Tickets
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 hover:border-white/[0.1] hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center ring-1 ring-primary-500/20">
                      <User className="h-3.5 w-3.5 text-primary-400" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-neutral-200 max-w-[100px] truncate">
                      {user.fullName || user.email}
                    </span>
                    <ChevronDown className={clsx("h-3.5 w-3.5 text-neutral-500 transition-transform duration-200", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.08] bg-dark-900/95 shadow-premium backdrop-blur-2xl py-1.5 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                          <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-1.5">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            to="/my-bookings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                          >
                            <Ticket className="h-4 w-4" />
                            My Bookings
                          </Link>
                        </div>
                        <div className="border-t border-white/[0.06] pt-1.5 px-1.5">
                          <button
                            onClick={() => { handleSignOut(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? 'text-white bg-white/[0.08]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-3 flex gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary flex-1">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary flex-1">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
