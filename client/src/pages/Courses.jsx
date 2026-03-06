/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Clock, CheckCircle, Lock, Award, Play } from 'lucide-react';

export default function Courses() {
  const { hasSubscription } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, enrolled, available

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === 'enrolled') return course.enrollment?.enrolled;
    if (filter === 'available') return !course.enrollment?.enrolled;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Build your clinical skills with practical training</p>
        </div>
        
        {/* Filter tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'all', label: 'All' },
            { id: 'enrolled', label: 'My Courses' },
            { id: 'available', label: 'Available' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} hasSubscription={hasSubscription} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'enrolled' 
              ? "You haven't enrolled in any courses yet"
              : "No courses available"}
          </p>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, hasSubscription }) {
  const isEnrolled = course.enrollment?.enrolled;
  const isFree = course.accessType === 'free';
  const canAccess = isFree || hasSubscription || isEnrolled;

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow">
      {/* Course image/icon */}
      <div className="h-40 bg-hunter-100 rounded-lg mb-4 flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-hunter-500" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
          {isFree && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex-shrink-0">
              Free
            </span>
          )}
        </div>

        {course.subtitle && (
          <p className="text-sm text-gray-500 mb-3">{course.subtitle}</p>
        )}

        {/* Course meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {course.totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.totalLessons} lessons
            </span>
          )}
          {course.ceuEligible && (
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {course.ceuHours} CEUs
            </span>
          )}
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-moss-600 font-medium">{course.enrollment.percentComplete}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-moss-500 rounded-full transition-all" 
                style={{ width: `${course.enrollment.percentComplete}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <Link
        to={`/courses/${course.slug}`}
        className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
          isEnrolled
            ? 'bg-moss-600 text-white hover:bg-moss-700'
            : canAccess
            ? 'bg-moss-100 text-moss-700 hover:bg-moss-200'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {isEnrolled ? (
          <>
            <Play className="w-4 h-4" />
            Continue
          </>
        ) : canAccess ? (
          <>
            <BookOpen className="w-4 h-4" />
            View Course
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Upgrade to Access
          </>
        )}
      </Link>
    </div>
  );
}
