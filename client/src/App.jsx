/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CRFooter } from './utils/copyright.jsx';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import Credentials from './pages/Credentials';
import Settings from './pages/Settings';
import InteractiveCourseCatalog from './pages/InteractiveCourseCatalog';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CEPlanner from './pages/CEPlanner';
import InsuranceTracker from './pages/InsuranceTracker';
import AuditKit from './pages/AuditKit';
import BoardAlerts from './pages/BoardAlerts';
import SupervisionTracker from './pages/SupervisionTracker';
import GamificationPage from './pages/Gamification';
import Referrals from './pages/Referrals';
import GroupLicenseDashboard from './pages/GroupLicenseDashboard';
import Recommendations from './pages/Recommendations';
import LegacyVault from './pages/LegacyVault';
import CourseQuickEdit from './pages/CourseQuickEdit';
import AdminPartners from './pages/AdminPartners';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerBrandingSettings from './pages/PartnerBrandingSettings';
import PartnerCourseAdmin from './pages/PartnerCourseAdmin';
import PartnerCourseCatalog from './pages/PartnerCourseCatalog';
import PartnerBulkUpload from './pages/PartnerBulkUpload';
import PartnerBilling from './pages/PartnerBilling';
import PartnerDomainSettings from './pages/PartnerDomainSettings';
import PartnerUserManagement from './pages/PartnerUserManagement';
import ThumbnailManager from './pages/ThumbnailManager';
import AdminBulkUpload from './pages/AdminBulkUpload';

// Components
import Layout from './components/Layout';
import CourseViewer from './components/CourseViewer';
import CourseBuilder from './components/CourseBuilder';
import { AccessibilityProvider, SkipToContent, AccessibilityPanel } from './components/AccessibilityProvider';

// Wrapper to pass slug param to CourseViewer
function CourseViewerWrapper() {
  const { slug } = useParams();
  return <CourseViewer courseSlug={slug} />;
}

// Loading screen with server wake-up awareness
function LoadingScreen() {
  const { serverWaking } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div>
      {serverWaking && (
        <div className="text-center animate-fade-in">
          <p className="text-gray-600 text-sm font-medium">Server is waking up...</p>
          <p className="text-gray-400 text-xs mt-1">This may take up to 30 seconds on first visit</p>
        </div>
      )}
    </div>
  );
}

/**
 * StaticPageFallback — handles URLs for static HTML pages that React Router
 * should NOT control (e.g. /tools/*, *.html admin pages).
 *
 * If Render incorrectly serves index.html for a static file path, React Router
 * catches it here instead of the catch-all redirect to "/". This component
 * attempts ONE hard navigation to force the browser to request the file directly.
 * If that fails (infinite loop protection), it shows a clickable fallback link.
 */
function StaticPageFallback() {
  const location = useLocation();
  const url = location.pathname + location.search + location.hash;

  useEffect(() => {
    // One-time redirect attempt — prevents infinite loop
    const key = '__cr_static_retry__' + location.pathname;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      // Clean up after 10 seconds so user can retry later
      setTimeout(() => sessionStorage.removeItem(key), 10000);
      window.location.replace(url);
      return;
    }
    // If we're here, the hard navigation already failed once — remove flag
    sessionStorage.removeItem(key);
  }, [location.pathname, url]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50" style={{ fontFamily: "'Lato', system-ui, sans-serif" }}>
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: '#6B1D34' }}>
          <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 28 }}>
            <span style={{ color: '#D4A855', position: 'absolute', top: -4, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 20 }}>C</span>
            <span style={{ color: '#4A7C59', position: 'absolute', top: 6, left: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 16 }}>R</span>
          </span>
        </div>
        <h1 className="text-xl font-semibold mb-3" style={{ color: '#44403c', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Loading page...
        </h1>
        <p className="text-sm mb-6" style={{ color: '#78716c' }}>
          If this page doesn't load automatically,{' '}
          <a href={url} style={{ color: '#6B1D34', fontWeight: 600, textDecoration: 'underline' }}>
            click here to open it directly
          </a>.
        </p>
        <a href="/" className="text-sm" style={{ color: '#4A7C59' }}>← Back to CounselorReady</a>
      </div>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Admin Route wrapper (must be logged in + admin role)
function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/courses" replace />;
  return children;
}

// Partner Admin Route wrapper (admin or partner_admin)
function PartnerAdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin' && user?.role !== 'partner_admin') return <Navigate to="/courses" replace />;
  return children;
}

// Public Route wrapper (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/courses" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute>
          <Layout><InteractiveCourseCatalog /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses/:slug" element={
        <ProtectedRoute>
          <Layout><CourseView /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Redirect old /learn path to /courses */}
      <Route path="/learn" element={<Navigate to="/courses" replace />} />
      <Route path="/learn/:slug" element={
        <ProtectedRoute>
          <CourseViewerWrapper />
        </ProtectedRoute>
      } />
      
      <Route path="/credentials" element={
        <ProtectedRoute>
          <Layout><Credentials /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />

      {/* New feature routes */}
      <Route path="/organization" element={
        <ProtectedRoute>
          <Layout><OrganizationDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/ce-planner" element={
        <ProtectedRoute>
          <Layout><CEPlanner /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/insurance-tracker" element={
        <ProtectedRoute>
          <Layout><InsuranceTracker /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/audit-kit" element={
        <ProtectedRoute>
          <Layout><AuditKit /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/board-alerts" element={
        <ProtectedRoute>
          <Layout><BoardAlerts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/supervision" element={
        <ProtectedRoute>
          <Layout><SupervisionTracker /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/achievements" element={
        <ProtectedRoute>
          <Layout><GamificationPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/referrals" element={
        <ProtectedRoute>
          <Layout><Referrals /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/group-licenses" element={
        <ProtectedRoute>
          <Layout><GroupLicenseDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <Layout><Recommendations /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/legacy-vault" element={
        <ProtectedRoute>
          <Layout><LegacyVault /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/course-builder" element={
        <AdminRoute>
          <CourseBuilder />
        </AdminRoute>
      } />
      <Route path="/admin/course-quick-edit" element={
        <AdminRoute>
          <Layout><CourseQuickEdit /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/partners" element={
        <AdminRoute>
          <Layout><AdminPartners /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/thumbnails" element={
        <AdminRoute>
          <Layout><ThumbnailManager /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/bulk-upload" element={
        <AdminRoute>
          <Layout><AdminBulkUpload /></Layout>
        </AdminRoute>
      } />
      <Route path="/partner-dashboard" element={
        <ProtectedRoute>
          <Layout><PartnerDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/partner/branding" element={
        <PartnerAdminRoute>
          <Layout><PartnerBrandingSettings /></Layout>
        </PartnerAdminRoute>
      } />
      <Route path="/partner/courses" element={
        <PartnerAdminRoute>
          <Layout><PartnerCourseAdmin /></Layout>
        </PartnerAdminRoute>
      } />
      <Route path="/partner/courses/catalog" element={
        <ProtectedRoute>
          <Layout><PartnerCourseCatalog /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/partner/bulk-upload" element={
        <PartnerAdminRoute>
          <Layout><PartnerBulkUpload /></Layout>
        </PartnerAdminRoute>
      } />
      <Route path="/partner/billing" element={
        <PartnerAdminRoute>
          <Layout><PartnerBilling /></Layout>
        </PartnerAdminRoute>
      } />
      <Route path="/partner/domain" element={
        <PartnerAdminRoute>
          <Layout><PartnerDomainSettings /></Layout>
        </PartnerAdminRoute>
      } />
      <Route path="/partner/users" element={
        <PartnerAdminRoute>
          <Layout><PartnerUserManagement /></Layout>
        </PartnerAdminRoute>
      } />

      {/*
        ═══════════════════════════════════════════════════════
        STATIC PAGE SAFETY NET
        These routes catch URLs for static HTML files that
        Render should serve directly. If Render's SPA catch-all
        incorrectly serves index.html, these prevent a silent
        redirect to "/" (the white page bug).
        ═══════════════════════════════════════════════════════
      */}
      <Route path="/tools/*" element={<StaticPageFallback />} />
      <Route path="/interactive-course.html" element={<StaticPageFallback />} />
      <Route path="/interactive-courses.html" element={<StaticPageFallback />} />

      {/* Catch all — unknown routes go home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <BrowserRouter>
          <SkipToContent />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <AccessibilityPanel />
          <CRFooter />
        </BrowserRouter>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
