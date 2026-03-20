/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const { data } = await api.get('/recommendations');
        setData(data);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div></div>;

  return (
    <div className="max-w-4xl mx-auto" role="main" aria-label="Smart CE Recommendations">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Courses</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Smart CE Recommendations</h1>
      <p className="text-gray-600 mb-6">Personalized course suggestions based on your credentials and requirements</p>

      {/* Summary Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-xl border border-burgundy-300 p-5">
            <div className="text-3xl font-bold text-burgundy-800">{data.summary.totalHoursNeeded}</div>
            <div className="text-sm text-burgundy-700">CE Hours Needed</div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="text-3xl font-bold text-gray-900">{data.summary.coursesCompleted}</div>
            <div className="text-sm text-gray-500">Courses Completed</div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="text-3xl font-bold text-gray-900">{data.summary.coursesAvailable}</div>
            <div className="text-sm text-gray-500">Courses Available</div>
          </div>
        </div>
      )}

      {/* Upcoming Expirations */}
      {data?.summary?.upcomingExpirations?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-amber-800 mb-3">Upcoming Credential Expirations</h2>
          <div className="space-y-2">
            {data.summary.upcomingExpirations.map((exp, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-amber-900 font-medium">{exp.credential}</span>
                <div className="text-right">
                  <div className="text-sm text-amber-700">Expires {new Date(exp.expirationDate).toLocaleDateString()}</div>
                  <div className="text-xs text-amber-600">{exp.hoursNeeded} hours needed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended For You</h2>
      {data?.recommendations?.length > 0 ? (
        <div className="space-y-4">
          {data.recommendations.map(course => (
            <div key={course._id} className="bg-white rounded-xl border p-5 hover:border-burgundy-400 transition cursor-pointer"
              onClick={() => window.location.href = `/course-details.html?slug=${course.slug}`} role="article">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    {course.ceHours && <span>{course.ceHours} CE Hours</span>}
                    {course.category && <span className="capitalize">{course.category}</span>}
                    {course.accessTier && <span className="capitalize">{course.accessTier}</span>}
                  </div>
                  {course.reasons?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.reasons.map((reason, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-burgundy-100 text-burgundy-800 rounded-full">{reason}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className="bg-burgundy-200 text-burgundy-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm" title="Relevance score">
                    {course.relevanceScore}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
          <p>No recommendations available right now. Complete your credential profile to get personalized suggestions.</p>
        </div>
      )}
    </div>
  );
}
