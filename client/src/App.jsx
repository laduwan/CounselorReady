/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CRFooter } from './utils/copyright.jsx';

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

// Components
import Layout from './components/Layout';
import CourseViewer from './components/CourseViewer';
import CourseBuilder from './components/CourseBuilder';

// Wrapper to pass slug param to CourseViewer
function CourseViewerWrapper() {
  const { slug } = useParams();
  return <CourseViewer courseSlug={slug} />;
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Admin Route wrapper (must be logged in + admin role)
function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/courses" replace />;
  }
  
  return children;
}

// Public Route wrapper (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/courses" replace />;
  }
  
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

      {/* Admin routes */}
      <Route path="/admin/course-builder" element={
        <AdminRoute>
          <CourseBuilder />
        </AdminRoute>
      } />
      
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
      <CRFooter />
    </BrowserRouter>
  );
}

export default App;
