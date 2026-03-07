/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, Settings, ShieldCheck, Trophy, Users, Star, ClipboardList, MoreHorizontal } from 'lucide-react';

// React routes use Link; external static HTML pages use <a>
const navLinks = [
  { name: 'Dashboard',       href: '/dashboard',          static: false },
  { name: 'Courses',         href: '/courses',            static: false },
  { name: 'Credentials',     href: '/credentials',        static: false },
  { name: 'CE Planner',      href: '/ce-planner',         static: false },
  { name: 'Audit Kit',       href: '/audit-kit',          static: false },
  { name: 'Alerts',          href: '/board-alerts',       static: false },
];

const moreLinks = [
  { name: 'Supervision',      href: '/supervision',        icon: ClipboardList },
  { name: 'Insurance',        href: '/insurance-tracker',   icon: ShieldCheck },
  { name: 'Achievements',     href: '/achievements',        icon: Trophy },
  { name: 'Referrals',        href: '/referrals',           icon: Star },
  { name: 'Recommendations',  href: '/recommendations',     icon: Star },
  { name: 'Team',             href: '/organization',        icon: Users },
  { name: 'Group Licenses',   href: '/group-licenses',      icon: Users },
];

const BURGUNDY      = '#6B1D34';
const BURGUNDY_DARK = '#4a1524';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER        = '#4A7C59';
const GOLD          = '#D4A855';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (href) =>
    location.pathname === href ||
    (href !== '/dashboard' && location.pathname.startsWith(href));

  const firstName = user?.profile?.firstName || user?.firstName || '';
  const lastName  = user?.profile?.lastName  || user?.lastName  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  const isAdmin   = user?.role === 'admin' || user?.isAdmin;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── HEADER ── */}
      <header style={{ background: 'white', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(107,29,52,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: '#6B1D34', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(107,29,52,0.25)' }}>
              <span style={{ position: 'relative', display: 'inline-block', width: 22, height: 22 }}>
                <span style={{ color: GOLD, position: 'absolute', top: -3, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 17 }}>C</span>
                <span style={{ color: '#7A9E84', position: 'absolute', top: 4, left: 6, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 14 }}>R</span>
              </span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.35rem', letterSpacing: '0.015em' }}>
              <span style={{ color: BURGUNDY }}>Counselor</span><span style={{ color: HUNTER }}>Ready</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = !link.static && isActive(link.href);
              const style = {
                padding: '0.5rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
                color: active ? BURGUNDY : '#78716c',
                background: active ? BURGUNDY_LIGHT : 'transparent',
              };
              return link.static ? (
                <a key={link.href} href={link.href} style={style}
                  onMouseEnter={e => { if (!active) e.target.style.background = '#f5f5f4'; }}
                  onMouseLeave={e => { if (!active) e.target.style.background = 'transparent'; }}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.href} to={link.href} style={style}
                  onMouseEnter={e => { if (!active) e.target.style.background = '#f5f5f4'; }}
                  onMouseLeave={e => { if (!active) e.target.style.background = 'transparent'; }}>
                  {link.name}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  color: moreLinks.some(l => isActive(l.href)) ? BURGUNDY : '#78716c',
                  background: moreLinks.some(l => isActive(l.href)) ? BURGUNDY_LIGHT : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                onMouseEnter={e => { if (!moreLinks.some(l => isActive(l.href))) e.target.style.background = '#f5f5f4'; }}
                onMouseLeave={e => { if (!moreLinks.some(l => isActive(l.href))) e.target.style.background = moreLinks.some(l => isActive(l.href)) ? BURGUNDY_LIGHT : 'transparent'; }}
              >
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoreMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                    {moreLinks.map((link) => {
                      const active = isActive(link.href);
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
                          style={{ color: active ? BURGUNDY : '#57534e', fontWeight: active ? 600 : 400 }}
                        >
                          <Icon className="w-4 h-4" style={{ color: active ? BURGUNDY : '#a8a29e' }} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Admin badge */}
            {isAdmin && (
              <a href="/admin.html"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </a>
            )}

            {/* User menu */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg transition-colors hover:bg-stone-100">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: BURGUNDY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
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
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
                          {user.subscription.plan} plan
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <a href="/admin.html"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                        style={{ color: BURGUNDY }}>
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </a>
                    )}
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-stone-100"
              style={{ color: '#78716c' }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
            {navLinks.map((link) => {
              const active = !link.static && isActive(link.href);
              const style = { display: 'block', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: active ? BURGUNDY : '#57534e', background: active ? BURGUNDY_LIGHT : 'transparent' };
              return link.static ? (
                <a key={link.href} href={link.href} style={style}>{link.name}</a>
              ) : (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} style={style}>{link.name}</Link>
              );
            })}
            <div className="border-t border-stone-100 my-2 pt-2">
              <p className="px-3 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wider">More</p>
              {moreLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5"
                    style={{ display: 'flex', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: active ? BURGUNDY : '#57534e', background: active ? BURGUNDY_LIGHT : 'transparent' }}>
                    <Icon className="w-4 h-4" style={{ color: active ? BURGUNDY : '#a8a29e' }} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
            {isAdmin && (
              <a href="/admin.html" style={{ display: 'block', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: BURGUNDY, background: BURGUNDY_LIGHT }}>
                Admin Panel
              </a>
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
