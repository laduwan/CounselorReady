// DROP INTO: /client/src/components/AdminLayout.jsx
// ================================================
// Unified admin shell with collapsible sidebar, header, and breadcrumbs.
// Wrap any admin page content with <AdminLayout> to get consistent nav.
//
// Usage in App.jsx:
//   <AdminRoute>
//     <AdminLayout>
//       <YourAdminPage />
//     </AdminLayout>
//   </AdminRoute>
//
// Or pass a title prop:
//   <AdminLayout title="Course Builder" subtitle="ACEP #7760">
//     <CourseBuilder />
//   </AdminLayout>

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, MessageSquare,
  Settings, ChevronDown, ChevronRight, Menu, X, LogOut,
  BarChart3, Award, CreditCard, HelpCircle, FileText, Upload,
  Video, Plug, Database, ArrowLeft, Hammer, Eye, Import,
  Heart, Gift, Bell, Search, Shield, Sparkles, ExternalLink,
} from "lucide-react";

// ─── Brand Palette ────────────────────────────────────────────
const B = {
  burgundy:      "#6B1D34",
  burgundyDark:  "#4E1527",
  burgundyLight: "#8B2D4A",
  green:         "#4A7C59",
  greenDark:     "#3A6347",
  greenLight:    "#5A9469",
  gold:          "#D4A855",
  goldMuted:     "#C49A4A",
  navy:          "#34495E",
  navyDark:      "#2C3E50",

  // Sidebar
  sidebarBg:     "#1A1215",
  sidebarHover:  "rgba(107,29,52,0.25)",
  sidebarActive: "rgba(107,29,52,0.45)",
  sidebarBorder: "rgba(107,29,52,0.15)",
  sidebarText:   "rgba(255,255,255,0.55)",
  sidebarTextHi: "rgba(255,255,255,0.92)",

  // Content area
  pageBg:        "#F7F5F2",
  cardBg:        "#FFFFFF",
  border:        "#E8E4DF",
  text:          "#2C2C2C",
  textMuted:     "#6B7280",
};

// ─── Navigation Structure ─────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: null, // ungrouped top items
    items: [
      { id: "dashboard",  label: "Dashboard",      icon: LayoutDashboard, path: "/admin",             badge: null },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "courses",       label: "Courses",        icon: BookOpen,   path: "/admin/courses"        },
      { id: "course-builder",label: "Course Builder",  icon: Hammer,     path: "/admin/course-builder" },
      { id: "course-preview",label: "Course Preview",  icon: Eye,        path: "/admin/course-preview" },
      { id: "import",        label: "Import Content",  icon: Import,     path: "/admin/import"         },
      { id: "video-upload",  label: "Video Upload",    icon: Video,      path: "/admin/video-upload"   },
    ],
  },
  {
    label: "People",
    items: [
      { id: "users",     label: "Users",             icon: Users,        path: "/admin/users"     },
      { id: "messages",  label: "Messages",           icon: MessageSquare,path: "/admin/messages"  },
      { id: "hardship",  label: "Hardship Apps",      icon: Heart,        path: "/admin/hardship"  },
    ],
  },
  {
    label: "Credentials",
    items: [
      { id: "credentials", label: "CE Credentials",  icon: Award,        path: "/admin/credentials" },
      { id: "analytics",   label: "Analytics",        icon: BarChart3,    path: "/admin/analytics"   },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "coupons",      label: "Coupons & Billing", icon: CreditCard,  path: "/admin/coupons"      },
      { id: "help",         label: "Help Center",       icon: HelpCircle,  path: "/admin/help"         },
      { id: "integrations", label: "Integrations",      icon: Plug,        path: "/admin/integrations" },
      { id: "migration",    label: "LMS Migration",     icon: Database,    path: "/admin/migration"    },
    ],
  },
];

// ─── Styles ───────────────────────────────────────────────────
const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 0; // fully hidden on mobile
const HEADER_HEIGHT = 56;

const styles = {
  // Sidebar
  sidebar: (open) => ({
    position: "fixed", top: 0, left: 0, bottom: 0,
    width: SIDEBAR_WIDTH,
    background: B.sidebarBg,
    borderRight: `1px solid ${B.sidebarBorder}`,
    display: "flex", flexDirection: "column",
    transform: open ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 50,
    overflowY: "auto",
    overflowX: "hidden",
  }),
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    zIndex: 49, transition: "opacity 0.25s",
  },

  // Logo area
  logoArea: {
    padding: "20px 20px 16px",
    borderBottom: `1px solid ${B.sidebarBorder}`,
    flexShrink: 0,
  },
  logoText: {
    fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
  },
  logoSub: {
    fontSize: 11, color: B.sidebarText, marginTop: 4,
    display: "flex", alignItems: "center", gap: 6,
  },

  // Nav groups
  navGroup: {
    padding: "12px 12px 4px",
  },
  navGroupLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
    padding: "0 8px 6px", userSelect: "none",
  },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 12px", borderRadius: 8,
    fontSize: 13, fontWeight: active ? 600 : 400,
    color: active ? B.sidebarTextHi : B.sidebarText,
    background: active ? B.sidebarActive : "transparent",
    cursor: "pointer", transition: "all 0.15s",
    textDecoration: "none", border: "none", width: "100%",
    textAlign: "left", position: "relative",
  }),
  navItemHover: {
    background: B.sidebarHover, color: B.sidebarTextHi,
  },
  activeIndicator: {
    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
    width: 3, height: 20, borderRadius: "0 3px 3px 0",
    background: B.gold,
  },

  // Badge
  badge: {
    marginLeft: "auto", fontSize: 10, fontWeight: 700,
    background: B.burgundyLight, color: "#fff",
    padding: "2px 7px", borderRadius: 10, minWidth: 18, textAlign: "center",
  },

  // Header
  header: {
    position: "sticky", top: 0, zIndex: 40,
    height: HEADER_HEIGHT,
    background: B.cardBg,
    borderBottom: `1px solid ${B.border}`,
    display: "flex", alignItems: "center",
    padding: "0 24px", gap: 16,
  },
  hamburger: {
    background: "none", border: "none", cursor: "pointer", padding: 6,
    display: "flex", alignItems: "center", color: B.navy,
  },
  breadcrumb: {
    fontSize: 13, color: B.textMuted, display: "flex", alignItems: "center", gap: 6,
  },
  breadcrumbActive: {
    fontWeight: 600, color: B.text,
  },

  // Page area
  pageWrapper: (sidebarOpen, isMobile) => ({
    marginLeft: isMobile ? 0 : (sidebarOpen ? SIDEBAR_WIDTH : 0),
    transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
    minHeight: "100vh",
    background: B.pageBg,
    display: "flex", flexDirection: "column",
  }),
  content: {
    flex: 1, padding: "24px 28px 40px",
    maxWidth: 1400, width: "100%", margin: "0 auto",
  },

  // Back-to-site
  backLink: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 20px",
    borderTop: `1px solid ${B.sidebarBorder}`,
    color: B.sidebarText, fontSize: 12, fontWeight: 500,
    cursor: "pointer", textDecoration: "none",
    transition: "color 0.15s",
    flexShrink: 0,
  },

  // User info
  userArea: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 16px", margin: "0 12px 12px",
    borderRadius: 10, background: "rgba(255,255,255,0.04)",
    border: `1px solid rgba(255,255,255,0.06)`,
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: `linear-gradient(135deg, ${B.burgundy}, ${B.burgundyLight})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
};


// ─── Component ────────────────────────────────────────────────
export default function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Responsive check
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on mobile nav
  const handleNav = (path) => {
    if (isMobile) setSidebarOpen(false);
    navigate(path);
  };

  // Current active item
  const currentPath = location.pathname;
  const activeItem = NAV_SECTIONS
    .flatMap(s => s.items)
    .find(item => currentPath === item.path || currentPath.startsWith(item.path + "/"));

  // Breadcrumb
  const pageTitle = title || activeItem?.label || "Admin";
  const sectionLabel = NAV_SECTIONS.find(s => s.items.some(i => i === activeItem))?.label;

  // User initials
  const initials = user
    ? (user.firstName?.[0] || "").toUpperCase() + (user.lastName?.[0] || "").toUpperCase()
    : "A";

  return (
    <div style={{ fontFamily: "'Inter', 'Lato', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar ─── */}
      <aside style={styles.sidebar(sidebarOpen || !isMobile && sidebarOpen)}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoText}>
            <span style={{ color: B.burgundyLight }}>COUNSELOR</span>
            <span style={{ color: B.greenLight }}>READY</span>
          </div>
          <div style={styles.logoSub}>
            <Shield size={11} />
            Admin Console
          </div>
          {/* Close button on mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ position: "absolute", top: 16, right: 12, background: "none", border: "none", color: B.sidebarText, cursor: "pointer", padding: 4 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={styles.navGroup}>
              {section.label && (
                <div style={styles.navGroupLabel}>{section.label}</div>
              )}
              {section.items.map((item) => {
                const active = activeItem?.id === item.id;
                const hovered = hoveredItem === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.path)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      ...styles.navItem(active),
                      ...(hovered && !active ? styles.navItemHover : {}),
                    }}
                  >
                    {active && <div style={styles.activeIndicator} />}
                    <Icon size={16} style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }} />
                    <span>{item.label}</span>
                    {item.badge && <span style={styles.badge}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User area */}
        <div style={{ flexShrink: 0 }}>
          <div style={styles.userArea}>
            <div style={styles.avatar}>{initials || "A"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: B.sidebarTextHi, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.firstName || "Admin"} {user?.lastName || ""}
              </div>
              <div style={{ fontSize: 11, color: B.sidebarText }}>Administrator</div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              style={{ background: "none", border: "none", color: B.sidebarText, cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = B.sidebarText}
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Back to site */}
          <a
            href="/dashboard"
            style={styles.backLink}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = B.sidebarText}
          >
            <ArrowLeft size={14} />
            Back to CounselorReady
            <ExternalLink size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />
          </a>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div style={styles.pageWrapper(sidebarOpen, isMobile)}>
        {/* Header */}
        <header style={styles.header}>
          <button
            style={styles.hamburger}
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <span>Admin</span>
            {sectionLabel && (
              <>
                <ChevronRight size={12} style={{ opacity: 0.4 }} />
                <span>{sectionLabel}</span>
              </>
            )}
            <ChevronRight size={12} style={{ opacity: 0.4 }} />
            <span style={styles.breadcrumbActive}>{pageTitle}</span>
          </div>

          {/* Right side */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            {subtitle && (
              <span style={{ fontSize: 11, color: B.textMuted, background: "rgba(74,124,89,0.08)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                {subtitle}
              </span>
            )}
            <span style={{ fontSize: 11, color: B.textMuted }}>NBCC ACEP #7760</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
