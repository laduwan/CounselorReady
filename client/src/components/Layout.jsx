/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useImpersonate } from '../context/ImpersonateContext';
import api from '../services/api';
import { Menu, X, ChevronDown, LogOut, Settings, ShieldCheck, Trophy, Users, Star, ClipboardList, MoreHorizontal, Bell, Lock, Palette, BookOpen, Globe, CreditCard, Upload, Rocket, Mail, BarChart3, HelpCircle, MonitorPlay } from 'lucide-react';
import PoweredByBadge from './PoweredByBadge';
import CRPromoCard from './CRPromoCard';
import BroadcastPopup from './BroadcastPopup';

// React routes use Link; external static HTML pages use <a>
const navLinks = [
  { name: 'Dashboard', href: '/dashboard.html', static: true },
  { name: 'Courses', href: '/courses.html', static: true, children: [
    { name: 'Browse Courses',    href: '/courses.html',        static: true },
    { name: 'Researched-N-Ready', href: '/research-ready.html', static: true },
  ]},
  { name: 'Credentials', href: '/credentials.html', static: true, children: [
    { name: 'My Credentials', href: '/credentials.html', static: true },
    { name: 'Audit Report',   href: '/audit.html',       static: true },
  ]},
  { name: 'Free Tools', href: '/tools/index.html', static: true },
];

const BURGUNDY      = '#6B1D34';
const BURGUNDY_DARK = '#4a1524';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER        = '#4A7C59';
const GOLD          = '#D4A855';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [partner, setPartner]           = useState(null);
  const { user, logout } = useAuth();
  const { impersonating, stopImpersonating } = useImpersonate();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); stopImpersonating(); navigate('/'); };

  // Detect whitelabel partner from URL ?partner=slug
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('partner');
    if (slug) {
      localStorage.setItem('cr_partner_slug', slug);
    }
    const storedSlug = slug || localStorage.getItem('cr_partner_slug');
    if (storedSlug) {
      api.get(`/partners/slug/${storedSlug}`)
        .then(({ data }) => setPartner(data.partner))
        .catch(() => { setPartner(null); localStorage.removeItem('cr_partner_slug'); });
    }
  }, [location.search]);

  // Fetch unread notifications
  useEffect(() => {
    let mounted = true;
    async function fetchNotifs() {
      try {
        const { data } = await api.get('/notifications?limit=8');
        if (mounted) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch { /* silent */ }
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  async function markAllRead() {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  }

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  }

  const isActive = (href) =>
    location.pathname === href ||
    (href !== '/dashboard' && location.pathname.startsWith(href));

  const isGroupActive = (link) => {
    if (isActive(link.href)) return true;
    if (link.children) return link.children.some(child => isActive(child.href));
    return false;
  };

  const firstName = user?.profile?.firstName || user?.firstName || '';
  const lastName  = user?.profile?.lastName  || user?.lastName  || '';
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  const isAdmin   = user?.role === 'admin' || user?.isAdmin;
  const isPartnerAdmin = user?.role === 'partner_admin' || isAdmin || !!impersonating;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── HEADER ── */}
      <header style={{ background: 'white', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(107,29,52,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo — shows partner branding when whitelabel is active */}
          <a href="/dashboard.html" className="flex items-center gap-3 flex-shrink-0" style={{ textDecoration: 'none' }}>
            {partner?.branding?.logoUrl ? (
              <>
                <img src={partner.branding.logoUrl} alt={partner.branding.companyName || partner.name} style={{ height: 36, width: 'auto', borderRadius: '0.5rem' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.35rem', letterSpacing: '0.015em', color: partner.branding.primaryColor || BURGUNDY }}>
                  {partner.branding.companyName || partner.name}
                </span>
              </>
            ) : (
              <>
                <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: '#6B1D34', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(107,29,52,0.25)' }}>
                  <span style={{ position: 'relative', display: 'inline-block', width: 24, height: 24 }}>
                    <span style={{ color: GOLD, position: 'absolute', top: -3, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 19 }}>C</span>
                    <span style={{ color: '#7A9E84', position: 'absolute', top: 4, left: 6, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 16 }}>R</span>
                  </span>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 800, fontSize: '1.625rem', letterSpacing: '0.015em' }}>
                  <span style={{ color: '#43121E' }}>Counselor</span><span style={{ color: '#2D4C37' }}>Ready</span>
                </span>
              </>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isGroupActive(link);
              const hasChildren = link.children && link.children.length > 0;
              const style = {
                padding: '0.5rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
                color: active ? BURGUNDY : '#78716c',
                background: active ? BURGUNDY_LIGHT : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              };

              if (!hasChildren) {
                if (link.static) {
                  return (
                    <a key={link.href} href={link.href} style={style}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#EDEDD0'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      {link.name}
                    </a>
                  );
                }
                return (
                  <Link key={link.href} to={link.href} style={style}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#EDEDD0'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                    {link.name}
                  </Link>
                );
              }

              return (
                <div key={link.name} className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  {link.static ? (
                    <a href={link.href} style={style}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#EDEDD0'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      {link.name}
                      <ChevronDown style={{ width: 14, height: 14, opacity: 0.5, transition: 'transform 0.15s', transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </a>
                  ) : (
                    <Link to={link.href} style={style}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#EDEDD0'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      {link.name}
                      <ChevronDown style={{ width: 14, height: 14, opacity: 0.5, transition: 'transform 0.15s', transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </Link>
                  )}
                  {openDropdown === link.name && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 50 }}>
                      <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '0.25rem 0', minWidth: 180 }}>
                        {link.children.map(child => {
                          const childActive = isActive(child.href);
                          const childStyle = {
                            display: 'block',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem',
                            fontWeight: childActive ? 600 : 400,
                            color: childActive ? BURGUNDY : '#57534e',
                            background: childActive ? BURGUNDY_LIGHT : 'transparent',
                            textDecoration: 'none',
                            transition: 'background 0.1s',
                          };
                          if (child.static) {
                            return (
                              <a key={child.href} href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                style={childStyle}
                                onMouseEnter={e => { if (!childActive) e.target.style.background = '#EDEDD0'; }}
                                onMouseLeave={e => { if (!childActive) e.target.style.background = 'transparent'; }}>
                                {child.name}
                              </a>
                            );
                          }
                          return (
                            <Link key={child.href} to={child.href}
                              onClick={() => setOpenDropdown(null)}
                              style={childStyle}
                              onMouseEnter={e => { if (!childActive) e.target.style.background = '#EDEDD0'; }}
                              onMouseLeave={e => { if (!childActive) e.target.style.background = 'transparent'; }}>
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                className="relative p-2 rounded-lg transition-colors hover:bg-stone-100"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <Bell className="w-5 h-5" style={{ color: '#78716c' }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold text-white rounded-full"
                    style={{ background: BURGUNDY, minWidth: 18, height: 18, padding: '0 4px' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 z-20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                      <span className="text-sm font-semibold text-stone-900">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-medium hover:underline" style={{ color: BURGUNDY }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => (
                        <button
                          key={n._id}
                          onClick={() => { if (!n.read) markRead(n._id); if (n.link) { navigate(n.link); setNotifOpen(false); } }}
                          className={`w-full text-left px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${!n.read ? 'bg-burgundy-50/40' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: BURGUNDY }} />}
                            <div className={!n.read ? '' : 'ml-4'}>
                              <p className="text-sm font-medium text-stone-900 line-clamp-1">{n.title}</p>
                              <p className="text-xs text-stone-500 line-clamp-2">{n.message}</p>
                              <p className="text-xs text-stone-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </button>
                      )) : (
                        <div className="px-4 py-8 text-center text-sm text-stone-400">No notifications yet</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

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
                    {isPartnerAdmin && (
                      <>
                        <Link to="/partner/courses" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <BookOpen className="w-4 h-4" /> Course Admin
                        </Link>
                        <Link to="/partner/bulk-upload" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <Upload className="w-4 h-4" /> Bulk Upload
                        </Link>
                        <Link to="/partner/branding" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <Palette className="w-4 h-4" /> Branding
                        </Link>
                        <Link to="/partner/domain" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <Globe className="w-4 h-4" /> Custom Domain
                        </Link>
                        <Link to="/partner/billing" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <CreditCard className="w-4 h-4" /> Billing
                        </Link>
                        <Link to="/partner/users" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                          style={{ color: BURGUNDY }}>
                          <Users className="w-4 h-4" /> Users
                        </Link>
                      </>
                    )}
                    {!isPartnerAdmin && user?.partnerId && (
                      <Link to="/partner/courses/catalog" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                        style={{ color: HUNTER }}>
                        <BookOpen className="w-4 h-4" /> Organization Courses
                      </Link>
                    )}
                    {isAdmin && (
                      <a href="/admin.html"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                        style={{ color: BURGUNDY }}>
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </a>
                    )}
                    <a href="/settings.html" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </a>
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
              const active = isGroupActive(link);
              const linkStyle = { display: 'block', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: active ? BURGUNDY : '#57534e', background: active ? BURGUNDY_LIGHT : 'transparent' };

              if (!link.children) {
                if (link.static) {
                  return <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={linkStyle}>{link.name}</a>;
                }
                return <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} style={linkStyle}>{link.name}</Link>;
              }

              return (
                <div key={link.name}>
                  {link.static ? (
                    <a href={link.href} onClick={() => setMobileOpen(false)} style={linkStyle}>{link.name}</a>
                  ) : (
                    <Link to={link.href} onClick={() => setMobileOpen(false)} style={linkStyle}>{link.name}</Link>
                  )}
                  <div style={{ paddingLeft: '1rem' }}>
                    {link.children.filter(child => child.href !== link.href).map(child => {
                      const childActive = isActive(child.href);
                      const childMobileStyle = { display: 'block', padding: '0.375rem 1rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: childActive ? 600 : 400, textDecoration: 'none', color: childActive ? BURGUNDY : '#78716c', background: childActive ? BURGUNDY_LIGHT : 'transparent' };
                      if (child.static) {
                        return (
                          <a key={child.href} href={child.href} onClick={() => setMobileOpen(false)} style={childMobileStyle}>
                            {child.name}
                          </a>
                        );
                      }
                      return (
                        <Link key={child.href} to={child.href} onClick={() => setMobileOpen(false)} style={childMobileStyle}>
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {isPartnerAdmin && (
              <div className="border-t border-stone-100 my-2 pt-2">
                <p className="px-3 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wider">Partner Admin</p>
                {[
                  { to: '/partner/onboarding', icon: Rocket, label: 'Getting Started' },
                  { to: '/partner/courses', icon: BookOpen, label: 'Course Admin' },
                  { to: '/partner/bulk-upload', icon: Upload, label: 'Bulk Upload' },
                  { to: '/partner/branding', icon: Palette, label: 'Branding' },
                  { to: '/partner/email-templates', icon: Mail, label: 'Email Templates' },
                  { to: '/partner/domain', icon: Globe, label: 'Custom Domain' },
                  { to: '/partner/billing', icon: CreditCard, label: 'Billing' },
                  { to: '/partner/users', icon: Users, label: 'Users' },
                  { to: '/partner/reports', icon: BarChart3, label: 'Reports' },
                  { to: '/partner/manual', icon: HelpCircle, label: 'Partner Manual' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5"
                    style={{ display: 'flex', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: isActive(to) ? BURGUNDY : '#57534e', background: isActive(to) ? BURGUNDY_LIGHT : 'transparent' }}>
                    <Icon className="w-4 h-4" style={{ color: isActive(to) ? BURGUNDY : '#a8a29e' }} />
                    {label}
                  </Link>
                ))}
              </div>
            )}
            {!isPartnerAdmin && user?.partnerId && (
              <div className="border-t border-stone-100 my-2 pt-2">
                <Link to="/partner/courses/catalog" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5"
                  style={{ display: 'flex', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: isActive('/partner/courses/catalog') ? HUNTER : '#57534e', background: isActive('/partner/courses/catalog') ? '#f0fdf4' : 'transparent' }}>
                  <BookOpen className="w-4 h-4" style={{ color: isActive('/partner/courses/catalog') ? HUNTER : '#a8a29e' }} />
                  Organization Courses
                </Link>
              </div>
            )}
            {isAdmin && (
              <a href="/admin.html" style={{ display: 'block', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: BURGUNDY, background: BURGUNDY_LIGHT }}>
                Admin Panel
              </a>
            )}
          </div>
        )}
      </header>

      {/* Impersonation Banner */}
      {impersonating && (
        <div style={{ background: '#4338ca', color: 'white', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: '0.875rem', fontWeight: 500 }}>
          <MonitorPlay style={{ width: 16, height: 16 }} />
          <span>Viewing as partner: <strong>{impersonating.name}</strong></span>
          <button
            onClick={() => { stopImpersonating(); navigate('/admin/partners'); }}
            style={{ marginLeft: 8, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}
          >
            Exit
          </button>
        </div>
      )}

      {/* Broadcast announcements popup */}
      <BroadcastPopup />

      {/* Page content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
        {partner && (
          <div className="mt-8">
            <CRPromoCard />
          </div>
        )}
      </main>

      {/* Powered-by badge for whitelabel partners */}
      {partner && <PoweredByBadge />}
    </div>
  );
}
