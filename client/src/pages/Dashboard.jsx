/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  BookOpen, 
  Award, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [credentials, setCredentials] = useState({ summary: null, credentials: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (retries = 2) => {
      try {
        const [coursesRes, credentialsRes] = await Promise.all([
          api.get('/courses/user/enrolled'),
          api.get('/credentials/user/dashboard')
        ]);
        setCourses(coursesRes.data.enrolledCourses || []);
        setCredentials(credentialsRes.data);
      } catch (error) {
        // Retry on network/timeout errors (server may still be waking up)
        if (retries > 0 && !error.response) {
          await new Promise(r => setTimeout(r, 3000));
          return fetchData(retries - 1);
        }
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.profile?.firstName}!
        </h1>
        <p className="text-gray-600">Here's your learning and credential overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-moss-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-moss-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-sm text-gray-500">Courses enrolled</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dustyrose-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-dustyrose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.summary?.totalCredentials || 0}
              </p>
              <p className="text-sm text-gray-500">Credentials</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.summary?.overallProgress?.totalCompleted || 0}
              </p>
              <p className="text-sm text-gray-500">CEUs completed</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              credentials.summary?.expiringSoon > 0 ? 'bg-amber-100' : 'bg-gray-100'
            }`}>
              <Clock className={`w-5 h-5 ${
                credentials.summary?.expiringSoon > 0 ? 'text-amber-600' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {credentials.summary?.expiringSoon || 0}
              </p>
              <p className="text-sm text-gray-500">Expiring soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Continue learning */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
            <Link to="/courses" className="text-moss-600 hover:text-moss-700 text-sm font-medium flex items-center gap-1">
              All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="space-y-3">
              {courses.slice(0, 3).map((item) => (
                <Link
                  key={item.course._id}
                  to={`/learn/${item.course.slug}`}
                  className="card block hover:border-moss-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-moss-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-moss-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.course.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-moss-500 rounded-full" 
                            style={{ width: `${item.percentComplete}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{item.percentComplete}%</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
              <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Credentials overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Credentials</h2>
            <Link to="/credentials" className="text-moss-600 hover:text-moss-700 text-sm font-medium flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {credentials.credentials.length > 0 ? (
            <div className="space-y-3">
              {credentials.credentials.slice(0, 3).map((cred) => (
                <div key={cred._id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{cred.name}</h3>
                      <p className="text-sm text-gray-500">
                        Expires: {formatDate(cred.expirationDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cred.status === 'expired' 
                        ? 'bg-red-100 text-red-700'
                        : cred.status === 'expiring_soon'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {cred.status === 'expired' ? 'Expired' : 
                       cred.status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">CEU Progress</span>
                      <span className="text-moss-600 font-medium">
                        {cred.totalCEUsCompleted}/{cred.totalCEUsRequired}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-moss-500 rounded-full" 
                        style={{ width: `${cred.percentComplete}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Track your licenses and certifications</p>
              <Link to="/credentials" className="btn-primary inline-flex items-center gap-2">
                Add Credential <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming deadlines */}
      {credentials.summary?.upcomingDeadlines?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="card bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                {credentials.summary.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.credentialId} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{deadline.name}</span>
                      <span className="text-amber-700 text-sm ml-2">
                        {deadline.daysRemaining} days remaining
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Need {deadline.ceusRemaining} more CEUs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
