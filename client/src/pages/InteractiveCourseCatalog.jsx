/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// pages/InteractiveCourseCatalog.jsx
// Displays available interactive courses for enrollment
// =====================================================
// @lock-file: Layout structure, color scheme, and visual design of this page are LOCKED.
// Do NOT change classNames, color values, gradients, spacing, grid layout, or component hierarchy.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BookOpen, Clock, ChevronRight, Search,
  Filter, Grid, List, Star, Users, CheckCircle
} from 'lucide-react';
import api from '../services/api';

const InteractiveCourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interactive-courses?limit=100');
      setCourses(response.data.data || response.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await api.get('/interactive-courses/user/my-courses');
      const progressMap = {};
      const items = response.data.data || response.data || [];
      items.forEach(item => {
        if (item.course) {
          progressMap[item.course._id] = item;
        }
      });
      setUserProgress(progressMap);
    } catch (err) {
      // User might not be logged in - that's ok
      console.log('Could not fetch user progress');
    }
  };

  const categories = ['all', ...new Set(courses.flatMap(c => c.categories || []))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           (course.categories && course.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const getProgressForCourse = (courseId) => {
    return userProgress[courseId];
  };

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 px-4 py-2 bg-burgundy-800 text-white rounded-lg hover:bg-burgundy-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // @lock-start: Page layout, heading, filter bar, and grid structure
  return (
    <div>
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-burgundy-900 mb-2">CE Course Library</h1>
        <p className="text-forest-800">
          Earn continuing education credits with our professionally designed courses.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap gap-4 items-center border border-burgundy-100">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-forest-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-forest-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-burgundy-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-forest-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-burgundy-800 text-white' : 'bg-white text-forest-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-burgundy-800 text-white' : 'bg-white text-forest-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      <div>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-forest-300 mx-auto" />
            <p className="mt-4 text-forest-600">No courses found matching your criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                progress={getProgressForCourse(course._id)}
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map(course => (
              <CourseListItem
                key={course._id}
                course={course}
                progress={getProgressForCourse(course._id)}
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
  // @lock-end
};

// @lock-start: CourseCard — colors, gradient, pills, spacing, and visual hierarchy
// Course Card Component (Grid View)
const CourseCard = ({ course, progress, onClick }) => {
  const isEnrolled = !!progress;
  const isCompleted = progress?.status === 'completed' || progress?.status === 'certified';
  const primaryCategory = course.categories?.[0] ? { hours: course.ceHours, category: course.categories[0] } : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-burgundy-100 group"
    >
      {/* Thumbnail — course image or gradient fallback */}
      <div className="h-48 bg-gradient-to-br from-forest-50 to-burgundy-50 relative flex items-center justify-center overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="h-16 w-16 text-burgundy-500" />
        )}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-hunter-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </div>
        )}
        {isEnrolled && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200">
            <div
              className="h-full bg-hunter-500 transition-all"
              style={{ width: `${progress.progress || 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-burgundy-900 group-hover:text-burgundy-700 transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>

        <p className="text-sm text-forest-800 line-clamp-2 mb-4">
          {course.description}
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(course.ceHours || course.ceuHours) && (
            <span className="bg-honey-100 text-honey-700 px-2 py-1 rounded-full text-xs font-medium">
              {course.ceHours || course.ceuHours} CE Hours
            </span>
          )}
          {primaryCategory && (
            <span className="bg-forest-100 text-forest-800 px-2 py-1 rounded-full text-xs font-medium">
              {primaryCategory.category}
            </span>
          )}
          {course.categories && course.categories.length > 0 && !primaryCategory && (
            <span className="bg-forest-100 text-forest-800 px-2 py-1 rounded-full text-xs font-medium">
              {course.categories[0]}
            </span>
          )}
          {(course.acepNumber || course.ceHours) && (
            <span className="bg-burgundy-100 text-burgundy-700 px-2 py-1 rounded-full text-xs font-medium">
              CE #{course.acepNumber || '7760'}
            </span>
          )}
        </div>

        {/* Duration with clock icon */}
        <div className="flex items-center gap-1 text-sm text-forest-800 mb-4">
          <Clock className="h-4 w-4 text-forest-400" />
          <span>{course.totalEstimatedTime || 60} min</span>
        </div>

        {/* Action — full-width burgundy button bar */}
        <div className="mt-auto">
          <button className="w-full bg-burgundy-800 hover:bg-burgundy-900 text-white font-semibold px-4 py-2 rounded-xl transition-colors">
            {isCompleted ? 'Review Course' : isEnrolled ? 'Continue Learning' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};
// @lock-end

// @lock-start: CourseListItem — colors, icon, pills, progress bar, and visual hierarchy
// Course List Item Component (List View)
const CourseListItem = ({ course, progress, onClick }) => {
  const isEnrolled = !!progress;
  const isCompleted = progress?.status === 'completed' || progress?.status === 'certified';
  const primaryCategory = course.categories?.[0] ? { hours: course.ceHours, category: course.categories[0] } : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-5 border border-burgundy-100 group"
    >
      <div className="flex items-center gap-5">
        {/* Icon — course thumbnail or gradient fallback */}
        <div className="h-16 w-16 bg-gradient-to-br from-hunter-50 to-burgundy-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover object-top rounded-lg" />
          ) : (
            <BookOpen className="h-8 w-8 text-burgundy-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
              {course.title}
            </h3>
            {isCompleted && (
              <span className="bg-hunter-100 text-hunter-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </span>
            )}
          </div>
          <p className="text-sm text-forest-800 line-clamp-1 mt-1">
            {course.description}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {(course.ceHours || course.ceuHours) && (
              <span className="bg-honey-100 text-honey-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {course.ceHours || course.ceuHours} CE Hours
              </span>
            )}
            {primaryCategory && (
              <span className="bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {primaryCategory.category}
              </span>
            )}
            {(course.acepNumber || course.ceHours) && (
              <span className="bg-burgundy-100 text-burgundy-700 px-2 py-0.5 rounded-full text-xs font-medium">
                CE #{course.acepNumber || '7760'}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-forest-800">
              <Clock className="h-3.5 w-3.5 text-forest-400" />
              {course.totalEstimatedTime || 60} min
            </span>
          </div>
        </div>

        {/* Progress / Action */}
        <div className="flex items-center gap-4">
          {isEnrolled && !isCompleted && (
            <div className="text-right">
              <div className="text-sm font-medium text-burgundy-700">{progress.progress || 0}%</div>
              <div className="w-24 h-2 bg-stone-200 rounded-full mt-1">
                <div
                  className="h-full bg-burgundy-600 rounded-full"
                  style={{ width: `${progress.progress || 0}%` }}
                />
              </div>
            </div>
          )}
          <ChevronRight className="h-5 w-5 text-burgundy-400 group-hover:text-burgundy-700 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
// @lock-end

export default InteractiveCourseCatalog;
