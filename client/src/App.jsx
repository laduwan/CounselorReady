import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Credentials from './pages/Credentials';
import Settings from './pages/Settings';
import InteractiveCourseCatalog from './pages/InteractiveCourseCatalog';

// Components
import Layout from './components/Layout';
import CourseViewer from './components/CourseViewer';
import CourseBuilder from './components/CourseBuilder';
import ResearchReadyCE from './pages/ResearchReadyCE';
import AdminResearchReady from './pages/AdminResearchReady';

// FIX: Courses and CourseView pages did not exist — caused broken import/build.
// /courses and /courses/:slug now redirect to the real catalog at /learn and /learn/:slug.

function CourseViewerWrapper() {
  const { slug } = useParams();
  return <CourseViewer courseSlug={slug} />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2"
        style={{ borderColor: '#4A7C59' }}
      />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* /courses redirects to /learn — Courses.jsx never existed */}
      <Route path="/courses" element={<Navigate to="/learn" replace />} />
      <Route path="/courses/:slug" element={<RedirectToLearn />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />

      <Route path="/learn" element={
        <ProtectedRoute><Layout><InteractiveCourseCatalog /></Layout></ProtectedRoute>
      } />
      <Route path="/learn/:slug" element={
        <ProtectedRoute><CourseViewerWrapper /></ProtectedRoute>
      } />

      <Route path="/credentials" element={
        <ProtectedRoute><Layout><Credentials /></Layout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>
      } />

      {/* RNR CE — learner page */}
      <Route path="/research-ready" element={
        <ProtectedRoute><Layout><ResearchReadyCE /></Layout></ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/course-builder" element={
        <AdminRoute><CourseBuilder /></AdminRoute>
      } />
      <Route path="/admin/research-ready" element={
        <AdminRoute><Layout><AdminResearchReady /></Layout></AdminRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Redirect /courses/:slug → /learn/:slug
function RedirectToLearn() {
  const { slug } = useParams();
  return <Navigate to={`/learn/${slug}`} replace />;
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
