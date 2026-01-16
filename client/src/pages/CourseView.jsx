import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Course header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            {course.subtitle && (
              <p className="text-lg text-gray-600 mb-4">{course.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.totalLessons} lessons
              </span>
              {course.totalDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.totalDuration} min
                </span>
              )}
              {course.ceuEligible && (
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {course.ceuHours} CEUs
                </span>
              )}
            </div>
          </div>

          {/* Lesson content viewer */}
          {activeLesson && canAccessLesson(activeLesson) ? (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{activeLesson.title}</h2>
              
              {activeLesson.type === 'video' && activeLesson.videoUrl && (
                <div className="aspect-video bg-gray-900 rounded-lg mb-4">
                  <video 
                    src={activeLesson.videoUrl} 
                    controls 
                    className="w-full h-full rounded-lg"
                  />
                </div>
              )}
              
              {activeLesson.content && (
                <div 
                  className="prose prose-moss max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content }}
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
                <div className="mt-6 flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          ) : activeLesson ? (
            <div className="card mb-6 text-center py-12">
              <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
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

          {/* Course description */}
          {course.description && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">About This Course</h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Enrollment card */}
          {!enrollment?.enrolled && (
            <div className="card mb-6">
              {course.accessType === 'free' ? (
                <>
                  <p className="text-green-600 font-medium mb-3">Free Course</p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll for Free'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-3">
                    {hasSubscription ? 'Included with your subscription' : 'Requires Pro subscription'}
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Progress card */}
          {enrollment?.enrolled && (
            <div className="card mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-moss-600">{enrollment.percentComplete}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-moss-500 rounded-full" 
                  style={{ width: `${enrollment.percentComplete}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Course outline */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.modules?.map((module) => (
                <div key={module._id} className="border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module._id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-left">{module.title}</span>
                    {expandedModules[module._id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedModules[module._id] && (
                    <div className="border-t border-gray-100">
                      {module.lessons?.map((lesson) => {
                        const completed = isLessonCompleted(lesson._id);
                        const canAccess = canAccessLesson(lesson);
                        const isActive = activeLesson?._id === lesson._id;
                        
                        return (
                          <button
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${
                              isActive ? 'bg-moss-50' : ''
                            }`}
                          >
                            {completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : canAccess ? (
                              <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${
                              !canAccess ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              {lesson.title}
                            </span>
                            {lesson.isFree && !enrollment?.enrolled && (
                              <span className="ml-auto text-xs text-green-600 font-medium">Free</span>
                            )}
                            {lesson.duration && (
                              <span className="ml-auto text-xs text-gray-400">{lesson.duration}m</span>
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
