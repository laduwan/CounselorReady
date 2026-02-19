import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard',      href: '/dashboard' },
  { name: 'Courses',        href: '/courses' },
  { name: 'Credentials',    href: '/credentials' },
  { name: 'CE Certificates',href: '/certificates' },
  { name: 'Messages',       href: '/messages' },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href) =>
    location.pathname === href ||
    (href !== '/dashboard' && location.pathname.startsWith(href));

  const firstName = user?.profile?.firstName || user?.firstName || '';
  const lastName  = user?.profile?.lastName  || user?.lastName  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #8B2542, #6B1D34)' }}
            >
              <span style={{ position: 'relative', display: 'inline-block', width: 22, height: 22 }}>
                <span style={{ color: '#D4A855', position: 'absolute', top: -3, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 18 }}>C</span>
                <span style={{ color: '#4A7C59', position: 'absolute', top: 5, left: 7, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 14 }}>R</span>
              </span>
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">
              <span style={{ color: '#6B1D34' }}>Counselor</span><span style={{ color: '#4A7C59' }}>Ready</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-burgundy-800 bg-burgundy-50 border-b-2 border-burgundy-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                style={isActive(link.href) ? { color: '#6B1D34' } : {}}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side — user menu + mobile hamburger */}
          <div className="flex items-center gap-3">

            {/* Subscription badge */}
            {user?.subscription?.plan === 'free' && (
              <Link
                to="/settings"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
                style={{ color: '#6B1D34', borderColor: '#6B1D34', backgroundColor: '#fdf5f6' }}
              >
                Upgrade
              </Link>
            )}

            {/* User avatar / dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #8B2542, #6B1D34)' }}
                >
                  {initials}
                </div>
                <span className="hidden md:block text-sm font-medium text-stone-700 max-w-[120px] truncate">
                  {firstName || user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-medium text-stone-900 truncate">{firstName} {lastName}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      {user?.subscription?.plan && (
                        <span
                          className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{
                            backgroundColor: user.subscription.plan === 'free' ? '#fdf5f6' : '#f0faf4',
                            color: user.subscription.plan === 'free' ? '#6B1D34' : '#4A7C59'
                          }}
                        >
                          {user.subscription.plan} plan
                        </span>
                      )}
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE NAV ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-burgundy-50 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
                style={isActive(link.href) ? { color: '#6B1D34' } : {}}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
