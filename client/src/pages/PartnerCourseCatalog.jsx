/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Clock, Search, Award } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

export default function PartnerCourseCatalog() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollError, setEnrollError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState({});

  useEffect(() => {
    loadCourses();
    loadProgress();
  }, []);

  async function loadCourses() {
    try {
      const slug = localStorage.getItem('cr_partner_slug');
      if (!slug) { setLoading(false); return; }

      const { data } = await api.get(`/partners/slug/${slug}/courses`);
      setCourses(data.courses || []);
      setPartnerInfo(data.partner || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load courses');
    }
    setLoading(false);
  }

  async function loadProgress() {
    try {
      const { data } = await api.get('/interactive-courses/user/my-courses');
      const map = {};
      (data.data || []).forEach(p => { map[p.courseId] = p; });
      setEnrolledCourses(map);
    } catch { /* progress load is non-critical */ }
  }

  async function handleEnroll(courseId) {
    try {
      await api.post(`/interactive-courses/${courseId}/enroll`);
      setEnrollError(null);
      loadProgress();
    } catch (err) {
      setEnrollError(err.response?.data?.error || 'Failed to enroll. Please try again.');
    }
  }

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const primaryColor = partnerInfo?.branding?.primaryColor || BURGUNDY;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium text-red-700">Something went wrong</p>
        <p className="text-sm text-stone-500 mt-1">{error}</p>
        <button onClick={() => { setError(null); loadCourses(); }} className="mt-4 px-4 py-2 text-sm rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50">
          Try Again
        </button>
      </div>
    );
  }

  if (!partnerInfo) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p className="text-lg font-medium">No partner courses available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: primaryColor, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {partnerInfo.branding?.companyName || partnerInfo.name} Courses
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': primaryColor }}
        />
      </div>

      {enrollError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {enrollError}
        </div>
      )}

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-stone-600 font-medium">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => {
            const progress = enrolledCourses[course._id];
            const isEnrolled = !!progress;
            const isCompleted = progress?.status === 'completed' || progress?.status === 'certified';
            const progressPct = progress?.overallProgress || 0;

            return (
              <div key={course._id} className="card overflow-hidden group">
                {/* Thumbnail */}
                <div className="h-36 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
                  <BookOpen className="w-10 h-10 text-white/30" />
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 mb-1">{course.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">{course.description}</p>

                  <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {course.ceHours} CE hrs
                    </span>
                    {course.totalEstimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {Math.round(course.totalEstimatedTime / 60)}h
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {isEnrolled && !isCompleted && (
                    <div className="mb-3">
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: HUNTER }} />
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1">{Math.round(progressPct)}% complete</p>
                    </div>
                  )}

                  {isCompleted ? (
                    <a
                      href={`/interactive-course.html?slug=${course.slug}`}
                      className="block text-center text-xs font-medium py-2 rounded-lg transition-colors"
                      style={{ background: HUNTER + '15', color: HUNTER }}
                    >
                      Completed — View Certificate
                    </a>
                  ) : isEnrolled ? (
                    <a
                      href={`/interactive-course.html?slug=${course.slug}`}
                      className="block text-center text-xs font-medium py-2 rounded-lg text-white transition-colors"
                      style={{ background: primaryColor }}
                    >
                      Continue Learning
                    </a>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full text-center text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-stone-50"
                      style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
