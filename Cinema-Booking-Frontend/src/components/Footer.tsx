import {
  Film,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Home,
  Clapperboard,
  Popcorn,
  Sparkles,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Clapperboard },
  { href: '#', label: 'Cinemas', icon: Popcorn },
  { href: '#', label: 'Promotions', icon: Sparkles },
]

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
]

const bottomLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="bg-dark-950">
        {/* Subtle radial glow at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-500/[0.04] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand — spans 5 cols on desktop */}
            <div className="lg:col-span-5">
              <Link to="/" className="inline-flex items-center gap-3 mb-6 group" aria-label="CinemaID Home">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary-500/40">
                  <Film className="h-5 w-5 text-white" />
                  <span className="absolute inset-0 rounded-xl bg-primary-500/30 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <span className="text-xl font-display font-bold text-white tracking-tight">
                  Cinema<span className="text-primary-400">ID</span>
                </span>
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mb-8">
                Premium moviegoing with curated showtimes, comfortable halls, quick checkout, and e-tickets ready before the lights go down.
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-400 transition-all duration-250 hover:text-white hover:border-primary-500/40 hover:bg-primary-500/10 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/10 active:scale-95"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links — spans 3 cols */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-1">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-all duration-250 hover:text-white hover:translate-x-1.5 hover:bg-white/[0.04]"
                    >
                      <Icon className="h-4 w-4 text-neutral-500 transition-colors duration-250 group-hover:text-primary-400" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact — spans 4 cols */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest">Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-primary-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-neutral-300">BPPTIK Cikarang</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-primary-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-neutral-300">+62 21 555 0199</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-primary-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-neutral-300">care@platoscloud.id</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-primary-400">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-neutral-300">Monday – Sunday</p>
                    <p className="text-neutral-500 text-xs mt-0.5">08:00 – 22:00</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Footer bottom */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              &copy; 2026 Plato&apos;s Cloud. All rights reserved.
            </p>
            <nav className="flex items-center gap-1" aria-label="Footer legal links">
              {bottomLinks.map(({ label, href }, i) => (
                <span key={label} className="flex items-center">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-neutral-600 mx-1" />}
                  <a
                    href={href}
                    className="text-xs text-neutral-500 transition-colors duration-250 hover:text-neutral-300"
                  >
                    {label}
                  </a>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
