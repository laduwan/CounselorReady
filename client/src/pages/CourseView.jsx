/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { safeHTML } from '../utils/sanitize';
import {
  BookOpen,
  CheckCircle,
  Lock,
  Play,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  ArrowLeft
} from 'lucide-react';

export default function CourseView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasSubscription } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [viewingContent, setViewingContent] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${slug}`);
      setCourse(data.course);
      setEnrollment(data.enrollment);

      // Expand first module by default
      if (data.course.modules?.length > 0) {
        setExpandedModules({ [data.course.modules[0]._id]: true });

        // Set active lesson to first uncompleted or first lesson
        const firstLesson = data.course.modules[0].lessons[0];
        if (firstLesson) setActiveLesson(firstLesson);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${course._id}/enroll`);
      await fetchCourse();
    } catch (error) {
      console.error('Error enrolling:', error);
      if (error.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
        navigate('/settings?upgrade=true');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await api.post(`/courses/${course._id}/lessons/${lessonId}/complete`);
      await fetchCourse();
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleStartCourse = () => {
    setViewingContent(true);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.lessonsCompleted?.includes(lessonId);
  };

  const canAccessLesson = (lesson) => {
    if (lesson.isFree) return true;
    if (!enrollment?.enrolled) return false;
    if (course.accessType === 'free') return true;
    return hasSubscription;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-forest-500">Course not found</p>
      </div>
    );
  }

  // If viewing content (after clicking Start), show the lesson viewer
  if (viewingContent) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Back to overview */}
        <button
          onClick={() => setViewingContent(false)}
          className="flex items-center gap-2 text-forest-600 hover:text-navy-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-burgundy-800 mb-1">{course.title}</h1>
            </div>

            {/* Lesson content viewer */}
            {activeLesson && canAccessLesson(activeLesson) ? (
              <div className="card mb-6">
                <h2 className="font-display text-xl font-semibold text-navy-700 mb-4">{activeLesson.title}</h2>

                {activeLesson.type === 'video' && activeLesson.videoUrl && (
                  <div className="aspect-video bg-navy-800 rounded-lg mb-4">
                    <video
                      src={activeLesson.videoUrl}
                      controls
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}

                {activeLesson.content && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: safeHTML(activeLesson.content) }}
                  />
                )}

                {/* Complete lesson button */}
                {enrollment?.enrolled && !isLessonCompleted(activeLesson._id) && (
                  <button
                    onClick={() => handleCompleteLesson(activeLesson._id)}
                    className="mt-6 btn-primary flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Complete
                  </button>
                )}

                {isLessonCompleted(activeLesson._id) && (
                  <div className="mt-6 flex items-center gap-2 text-hunter-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            ) : activeLesson ? (
              <div className="card mb-6 text-center py-12">
                <Lock className="w-12 h-12 text-forest-200 mx-auto mb-4" />
                <p className="text-forest-600 mb-4">
                  {enrollment?.enrolled
                    ? 'Upgrade to Pro to access this lesson'
                    : 'Enroll in this course to access this lesson'}
                </p>
                {!enrollment?.enrolled ? (
                  <button onClick={handleEnroll} disabled={enrolling} className="btn-primary">
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                ) : (
                  <button onClick={() => navigate('/settings?upgrade=true')} className="btn-primary">
                    Upgrade to Pro
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {/* Sidebar - Course outline */}
          <div className="lg:col-span-1">
            {/* Progress card */}
            {enrollment?.enrolled && (
              <div className="card mb-6">
                <h3 className="font-display text-lg font-semibold text-navy-700 mb-3">Your Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-forest-600">Completed</span>
                  <span className="font-medium text-burgundy-700">{enrollment.percentComplete}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-honey-400 rounded-full"
                    style={{ width: `${enrollment.percentComplete}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Course outline */}
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-navy-700 mb-4">Course Content</h3>
              <div className="space-y-2">
                {course.modules?.map((module) => (
                  <div key={module._id} className="border border-forest-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-stone-50 transition-colors"
                    >
                      <span className="font-medium text-navy-700 text-left">{module.title}</span>
                      {expandedModules[module._id] ? (
                        <ChevronDown className="w-4 h-4 text-forest-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-forest-400" />
                      )}
                    </button>

                    {expandedModules[module._id] && (
                      <div className="border-t border-forest-100">
                        {module.lessons?.map((lesson) => {
                          const completed = isLessonCompleted(lesson._id);
                          const canAccess = canAccessLesson(lesson);
                          const isActive = activeLesson?._id === lesson._id;

                          return (
                            <button
                              key={lesson._id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full flex items-center gap-3 p-3 text-left hover:bg-stone-50 transition-colors ${
                                isActive ? 'bg-hunter-50' : ''
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="w-4 h-4 text-hunter-600 flex-shrink-0" />
                              ) : canAccess ? (
                                <Play className="w-4 h-4 text-forest-400 flex-shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-forest-200 flex-shrink-0" />
                              )}
                              <span className={`text-sm ${
                                !canAccess ? 'text-forest-300' : 'text-forest-700'
                              }`}>
                                {lesson.title}
                              </span>
                              {lesson.isFree && !enrollment?.enrolled && (
                                <span className="ml-auto text-xs text-hunter-600 font-medium">Free</span>
                              )}
                              {lesson.duration && (
                                <span className="ml-auto text-xs text-forest-400">{lesson.duration}m</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Overview Page (default view)
  const isFree = course.accessType === 'free';
  const isEnrolled = enrollment?.enrolled;
  const canAccess = isFree || hasSubscription || isEnrolled;
  const totalModules = course.modules?.length || 0;
  const totalLessons = course.totalLessons || 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-forest-600 hover:text-navy-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      {/* Course overview card */}
      <div className="card">
        {/* Course icon area */}
        <div className="h-48 bg-hunter-100 rounded-lg mb-6 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-hunter-500" />
        </div>

        {/* Course title and meta */}
        <h1 className="text-3xl font-bold text-burgundy-800 mb-2">{course.title}</h1>
        {course.subtitle && (
          <p className="text-lg text-forest-600 mb-4">{course.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-forest-500 mb-6">
          {totalModules > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-hunter-500" />
              {totalModules} modules
            </span>
          )}
          {totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-hunter-500" />
              {totalLessons} lessons
            </span>
          )}
          {course.totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-forest-400" />
              {course.totalDuration} min
            </span>
          )}
          {course.ceuEligible && (
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-honey-400" />
              {course.ceuHours} CEUs
            </span>
          )}
          {isFree && (
            <span className="px-2 py-0.5 bg-hunter-100 text-hunter-700 text-xs font-medium rounded-full">
              Free
            </span>
          )}
        </div>

        {/* Course description */}
        {course.description && (
          <div className="mb-8">
            <h3 className="font-display text-lg font-semibold text-navy-700 mb-2">About This Course</h3>
            <p className="text-forest-600 leading-relaxed">{course.description}</p>
          </div>
        )}

        {/* Progress if enrolled */}
        {isEnrolled && (
          <div className="mb-8 p-4 bg-stone-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-forest-700">Your Progress</span>
              <span className="text-sm font-medium text-burgundy-700">{enrollment.percentComplete}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-honey-400 rounded-full transition-all"
                style={{ width: `${enrollment.percentComplete}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Course outline preview */}
        {course.modules?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-lg font-semibold text-navy-700 mb-3">Course Content</h3>
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <div key={module._id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <span className="w-7 h-7 flex items-center justify-center bg-burgundy-800 text-white text-xs font-bold rounded-full flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-700 truncate">{module.title}</p>
                    <p className="text-xs text-forest-500">{module.lessons?.length || 0} lessons</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isEnrolled ? (
            <button
              onClick={handleStartCourse}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-hunter-600 text-white font-semibold rounded-lg hover:bg-hunter-700 transition-colors"
            >
              <Play className="w-5 h-5" />
              {enrollment.percentComplete > 0 ? 'Continue Course' : 'Start Course'}
            </button>
          ) : canAccess ? (
            <>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-burgundy-800 text-white font-semibold rounded-lg hover:bg-burgundy-700 transition-colors"
              >
                {enrolling ? 'Enrolling...' : isFree ? 'Enroll for Free' : 'Enroll Now'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/settings?upgrade=true')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-stone-100 text-forest-500 font-semibold rounded-lg hover:bg-stone-200 transition-colors"
            >
              <Lock className="w-5 h-5" />
              Upgrade to Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
