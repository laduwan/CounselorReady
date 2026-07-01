/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// pages/CourseQuickEdit.jsx
// Lightweight admin page for editing course descriptions and metadata

import React, { useState, useEffect } from 'react';
import { BookOpen, Save, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const CourseQuickEdit = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interactive-courses?status=all&limit=100');
      setCourses(response.data.data || response.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (courseId) => {
    setExpandedId(expandedId === courseId ? null : courseId);
  };

  const getEdit = (courseId) => {
    return edits[courseId] || {};
  };

  const updateEdit = (courseId, field, value) => {
    setEdits(prev => ({
      ...prev,
      [courseId]: { ...prev[courseId], [field]: value }
    }));
    // Clear saved status when editing
    setSaved(prev => ({ ...prev, [courseId]: false }));
  };

  const handleSave = async (course) => {
    const edit = getEdit(course._id);
    if (Object.keys(edit).length === 0) return;

    setSaving(prev => ({ ...prev, [course._id]: true }));
    try {
      await api.put(`/interactive-courses/${course._id}`, edit);

      // Update local state
      setCourses(prev => prev.map(c =>
        c._id === course._id ? { ...c, ...edit } : c
      ));
      setSaved(prev => ({ ...prev, [course._id]: true }));
      // Clear edits for this course
      setEdits(prev => {
        const next = { ...prev };
        delete next[course._id];
        return next;
      });
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(prev => ({ ...prev, [course._id]: false }));
    }
  };

  const hasChanges = (courseId) => {
    const edit = edits[courseId];
    return edit && Object.keys(edit).length > 0;
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
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <button onClick={fetchCourses} className="mt-4 px-4 py-2 bg-burgundy-800 text-white rounded-lg hover:bg-burgundy-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-burgundy-900">Quick Edit Courses</h1>
        <p className="text-forest-600">Edit course descriptions and metadata. Changes appear immediately on the catalog.</p>
      </div>

      <h2 className="font-display text-xl font-semibold text-navy-700 mb-3">All Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-forest-300 mx-auto" />
          <p className="mt-4 text-forest-600">No courses found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => {
            const isExpanded = expandedId === course._id;
            const edit = getEdit(course._id);
            const isSaving = saving[course._id];
            const isSaved = saved[course._id];
            const changed = hasChanges(course._id);

            return (
              <div key={course._id} className="bg-white rounded-xl shadow-sm border border-forest-100 overflow-hidden">
                {/* Header row */}
                <button
                  onClick={() => toggleExpand(course._id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-hunter-100 to-burgundy-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-burgundy-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-burgundy-900 truncate">{course.title}</h3>
                    <p className="text-sm text-forest-500 truncate">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'published' ? 'bg-hunter-100 text-hunter-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {course.status || 'draft'}
                    </span>
                    {isSaved && <CheckCircle className="h-5 w-5 text-hunter-600" />}
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-forest-400" /> : <ChevronDown className="h-5 w-5 text-forest-400" />}
                  </div>
                </button>

                {/* Expanded edit form */}
                {isExpanded && (
                  <div className="border-t border-forest-100 p-5 space-y-4">
                    <h3 className="font-display text-lg font-semibold text-navy-700">Edit Details</h3>
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-burgundy-800 mb-1">
                        Description
                        <span className="text-forest-400 font-normal ml-2">
                          ({(edit.description ?? course.description)?.length || 0} chars — aim for 80–150 for best card display)
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        value={edit.description ?? course.description ?? ''}
                        onChange={(e) => updateEdit(course._id, 'description', e.target.value)}
                        className="w-full border border-forest-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-transparent resize-y"
                        placeholder="Course description shown on the catalog card..."
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-burgundy-800 mb-1">Title</label>
                      <input
                        type="text"
                        value={edit.title ?? course.title ?? ''}
                        onChange={(e) => updateEdit(course._id, 'title', e.target.value)}
                        className="w-full border border-forest-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      />
                    </div>

                    {/* CE Hours + Categories row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-burgundy-800 mb-1">CE Hours</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={edit.ceHours ?? course.ceHours ?? ''}
                          onChange={(e) => updateEdit(course._id, 'ceHours', parseFloat(e.target.value) || 0)}
                          className="w-full border border-forest-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-burgundy-800 mb-1">Estimated Time (min)</label>
                        <input
                          type="number"
                          min="0"
                          value={edit.totalEstimatedTime ?? course.totalEstimatedTime ?? ''}
                          onChange={(e) => updateEdit(course._id, 'totalEstimatedTime', parseInt(e.target.value) || 0)}
                          className="w-full border border-forest-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {isSaved && (
                        <span className="text-sm text-hunter-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> Saved
                        </span>
                      )}
                      <button
                        onClick={() => handleSave(course)}
                        disabled={!changed || isSaving}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                          changed && !isSaving
                            ? 'bg-burgundy-800 text-white hover:bg-burgundy-700'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseQuickEdit;
