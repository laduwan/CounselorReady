// UPDATED App.jsx — Admin routes wrapped in AdminLayout
// ====================================================
// Replace your existing App.jsx with this.
// Pages marked "TODO" use AdminPlaceholder until you migrate the HTML pages to React.

import { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import Credentials from './pages/Credentials';
import Settings from './pages/Settings';
import InteractiveCourseCatalog from './pages/InteractiveCourseCatalog';

// Components
import Layout from './components/Layout';
import CourseViewer from './components/CourseViewer';
import CourseBuilder from './components/CourseBuilder';
import AdminLayout from './components/AdminLayout';

// ─── Placeholder for admin pages not yet migrated from HTML ───
// Renders the old HTML page in an iframe so nothing breaks.
// Replace each one with a real React component when ready.
function AdminIframe({ page, title }) {
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      const style = doc.createElement('style');
      style.textContent = `
        aside, [class*="sidebar"], [class*="sidenav"], [class*="side-nav"] { display: none !important; }
        body > header, body > nav, [class*="navbar"], [class*="topbar"], [class*="top-bar"], .admin-header { display: none !important; }
        footer, [class*="footer"] { display: none !important; }
        main, [class*="main-content"], [class*="content-area"], [class*="page-content"], .admin-content, [role="main"] {
          margin-left: 0 !important; margin-top: 0 !important;
          width: 100% !important; max-width: 100% !important; padding: 20px !important;
        }
        body { padding: 0 !important; margin: 0 !important; overflow-x: hidden; }
      `;
      doc.head.appendChild(style);

      // JS cleanup for fixed/absolute positioned sidebars and headers
      doc.querySelectorAll('div, aside, nav, header').forEach(el => {
        const rect = el.getBoundingClientRect();
        const cs = doc.defaultView.getComputedStyle(el);
        const pos = cs.position;
        if ((pos === 'fixed' || pos === 'absolute' || pos === 'sticky') &&
            rect.width > 50 && rect.width < 300 && rect.height > 300 && rect.left < 10) {
          el.style.display = 'none';
        }
        if ((pos === 'fixed' || pos === 'sticky') &&
            rect.top < 5 && rect.width > 400 && rect.height < 120) {
          el.style.display = 'none';
        }
      });

      const main = doc.querySelector('main') || doc.querySelector('[role="main"]') ||
                   doc.querySelector('[class*="content"]');
      if (main) {
        main.style.marginLeft = '0';
        main.style.marginTop = '0';
        main.style.width = '100%';
      }
    } catch (e) {
      console.warn('Could not clean up iframe:', e);
    }
  };

  return (
    <AdminLayout title={title}>
      <div style={{ margin: "-24px -28px -40px", height: "calc(100vh - 56px)" }}>
        <iframe
          ref={iframeRef}
          src={`/${page}.html?embedded=1`}
          title={title}
          onLoad={handleIframeLoad}
          style={{ width: "100%", height: "100%", border: "none", background: "#F7F5F2" }}
        />
      </div>
    </AdminLayout>
  );
}

// ─── Admin Dashboard (simple overview — build out later) ──────
function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "—", color: "#4A7C59", icon: "👥" },
    { label: "Active Courses", value: "—", color: "#6B1D34", icon: "📚" },
    { label: "Certificates Issued", value: "—", color: "#D4A855", icon: "🏅" },
    { label: "CE Hours Delivered", value: "—", color: "#34495E", icon: "⏱" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Overview">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2C2C2C", margin: "0 0 4px" }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Welcome back. Here's what's happening on CounselorReady.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "20px 20px",
            border: "1px solid #E8E4DF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "#fff", borderRadius: 12, padding: 24,
        border: "1px solid #E8E4DF", textAlign: "center", color: "#6B7280",
      }}>
        <p style={{ fontSize: 14, margin: "0 0 8px" }}>
          Dashboard stats will populate from your API endpoints.
        </p>
        <p style={{ fontSize: 12, margin: 0, opacity: 0.7 }}>
          Wire up <code>GET /api/admin/stats</code> to see live data here.
        </p>
      </div>
    </AdminLayout>
  );
}

// ─── Route wrappers ───────────────────────────────────────────
function CourseViewerWrapper() {
  const { slug } = useParams();
  return <CourseViewer courseSlug={slug} />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

// ─── App Routes ───────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ── User (protected) ── */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
      <Route path="/courses/:slug" element={<ProtectedRoute><Layout><CourseView /></Layout></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><Layout><InteractiveCourseCatalog /></Layout></ProtectedRoute>} />
      <Route path="/learn/:slug" element={<ProtectedRoute><CourseViewerWrapper /></ProtectedRoute>} />
      <Route path="/credentials" element={<ProtectedRoute><Layout><Credentials /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

      {/* ── Admin ── */}
      {/* Dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Content */}
      <Route path="/admin/courses" element={<AdminRoute><AdminIframe page="admin-courses" title="Courses" /></AdminRoute>} />
      <Route path="/admin/course-builder" element={
        <AdminRoute>
          <AdminLayout title="Course Builder" subtitle="17 Block Types">
            <CourseBuilder />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/course-preview" element={<AdminRoute><AdminIframe page="admin-course-preview" title="Course Preview" /></AdminRoute>} />
      <Route path="/admin/import" element={<AdminRoute><AdminIframe page="admin-import" title="Import Content" /></AdminRoute>} />
      <Route path="/admin/video-upload" element={<AdminRoute><AdminIframe page="admin-video-upload" title="Video Upload" /></AdminRoute>} />

      {/* People */}
      <Route path="/admin/users" element={<AdminRoute><AdminIframe page="admin-users" title="Users" /></AdminRoute>} />
      <Route path="/admin/messages" element={<AdminRoute><AdminIframe page="admin-messages" title="Messages" /></AdminRoute>} />
      <Route path="/admin/hardship" element={<AdminRoute><AdminIframe page="admin-hardship" title="Hardship Applications" /></AdminRoute>} />

      {/* Credentials */}
      <Route path="/admin/credentials" element={<AdminRoute><AdminIframe page="admin-credentials" title="CE Credentials" /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminIframe page="admin-analytics" title="Analytics" /></AdminRoute>} />

      {/* Platform */}
      <Route path="/admin/coupons" element={<AdminRoute><AdminIframe page="admin-coupons" title="Coupons & Billing" /></AdminRoute>} />
      <Route path="/admin/help" element={<AdminRoute><AdminIframe page="admin-help" title="Help Center" /></AdminRoute>} />
      <Route path="/admin/integrations" element={<AdminRoute><AdminIframe page="admin-integrations" title="Integrations" /></AdminRoute>} />
      <Route path="/admin/migration" element={<AdminRoute><AdminIframe page="admin-migration" title="LMS Migration" /></AdminRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
