import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import CourseViewer from './components/CourseViewer';

// Layout component
import Layout from './components/Layout';

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
    return <Navigate to="/dashboard" replace />;
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
           <Route path="/learn" element={
        <ProtectedRoute>
          <Layout><InteractiveCourseCatalog /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/learn/:slug" element={
        <ProtectedRoute>
          <CourseViewer />
        </ProtectedRoute>
      } />
          <Layout><Courses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses/:slug" element={
        <ProtectedRoute>
          <Layout><CourseView /></Layout>
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
