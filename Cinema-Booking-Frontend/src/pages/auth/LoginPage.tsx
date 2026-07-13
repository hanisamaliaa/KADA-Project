import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Film, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-1">
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-b from-primary-500/20 to-transparent rounded-2xl blur-xl opacity-60" />
              <div className="relative w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <Film className="h-7 w-7 text-primary-500" />
              </div>
            </div>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-6 text-3xl font-display font-bold text-white tracking-tight"
          >
            Welcome Back
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-neutral-400">
            Sign in to your account to continue
          </motion.p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Google Sign-In Button */}
          <motion.div variants={fadeUp}>
            <button
              type="button"
              className="btn-google"
              onClick={() => {
                console.log('Google Sign-In integration is not yet implemented.');
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="auth-divider">
            <span>or</span>
          </motion.div>

          {/* Email & Password Fields */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="auth-input"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input pr-11"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5 text-neutral-500 hover:text-neutral-300 transition-colors" />
                  ) : (
                    <Eye className="h-4.5 w-4.5 text-neutral-500 hover:text-neutral-300 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div variants={fadeUp} className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fadeUp}>
            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div variants={fadeUp}>
            <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 text-sm text-neutral-300">
              Demo user: <span className="font-semibold text-white">user@cinematix.test</span> / <span className="font-semibold text-white">user123</span>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUp} className="text-center space-y-2 pt-2">
            <p className="text-sm text-neutral-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-neutral-400">
              <Link to="/admin/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                Admin Login
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
