import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import Credentials from './pages/Credentials';
import Settings from './pages/Settings';
import InteractiveCourseCatalog from './pages/InteractiveCourseCatalog';

// Components
import Layout from './components/Layout';
import CourseViewer from './components/CourseViewer';
import CourseBuilder from './components/course-builder/index.jsx';
import ResearchReadyCE from './pages/ResearchReadyCE';
import CEPlanner from './pages/CEPlanner';
import AdminResearchReady from './pages/AdminResearchReady';

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
    return <HardRedirect to="/dashboard.html" />;
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
    return <HardRedirect to="/dashboard.html" />;
  }

  return children;
}

// Hard redirect — forces browser navigation to static files, bypassing React Router
function HardRedirect({ to }) {
  React.useEffect(() => { window.location.replace(to); }, [to]);
  return null;
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

      {/* Dashboard is served by client/public/dashboard.html — not a React route */}

      {/* Protected routes */}
      <Route path="/courses" element={
        <ProtectedRoute>
          <Layout><Courses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses/:slug" element={
        <ProtectedRoute>
          <Layout><CourseView /></Layout>
        </ProtectedRoute>
      } />

      {/* Interactive Courses */}
      <Route path="/learn" element={
        <ProtectedRoute>
          <Layout><InteractiveCourseCatalog /></Layout>
        </ProtectedRoute>
      } />
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

      {/* RNR CE — learner page */}
      <Route path="/research-ready" element={
        <ProtectedRoute><Layout><ResearchReadyCE /></Layout></ProtectedRoute>
      } />
      <Route path="/ce-planner" element={
        <ProtectedRoute><Layout><CEPlanner /></Layout></ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/course-builder" element={
        <AdminRoute>
          <CourseBuilder />
        </AdminRoute>
      } />
      <Route path="/admin/research-ready" element={
        <AdminRoute><Layout><AdminResearchReady /></Layout></AdminRoute>
      } />

      {/* Free Tools — hard redirect to static HTML (bypasses SPA rewrite) */}
      <Route path="/tools" element={<HardRedirect to="/tools/index.html" />} />
      <Route path="/tools/*" element={<HardRedirect to="/tools/index.html" />} />

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
