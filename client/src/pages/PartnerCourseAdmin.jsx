/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Plus, Pencil, Trash2, X, Check, BarChart3, Upload } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

export default function PartnerCourseAdmin() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', ceHours: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const { data } = await api.get('/partners/my/courses');
      setCourses(data.courses || []);
    } catch { /* silent */ }
    setLoading(false);
  }

  async function handleCreate() {
    if (!form.title || !form.description || !form.ceHours) {
      setError('Title, description, and CE hours are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/partners/my/courses', form);
      setShowCreate(false);
      setForm({ title: '', description: '', ceHours: 1 });
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
    setSaving(false);
  }

  async function handleUpdate(courseId) {
    setSaving(true);
    setError('');
    try {
      await api.put(`/partners/my/courses/${courseId}`, form);
      setEditingId(null);
      setForm({ title: '', description: '', ceHours: 1 });
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update course');
    }
    setSaving(false);
  }

  async function handleDelete(courseId) {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/partners/my/courses/${courseId}`);
      loadCourses();
    } catch { /* silent */ }
  }

  async function handleStatusToggle(course) {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/partners/my/courses/${course._id}`, { status: newStatus });
      loadCourses();
    } catch { /* silent */ }
  }

  function startEdit(course) {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description || '',
      ceHours: course.ceHours,
    });
    setShowCreate(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Course Management
          </h1>
          <p className="text-sm text-stone-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setEditingId(null); setForm({ title: '', description: '', ceHours: 1 }); setError(''); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ background: BURGUNDY }}
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {/* Create / Edit Form */}
      {(showCreate || editingId) && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">
              {editingId ? 'Edit Course' : 'New Course'}
            </h2>
            <button onClick={() => { setShowCreate(false); setEditingId(null); setError(''); }}
              className="p-1 hover:bg-stone-100 rounded">
              <X className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-600 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Course title"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Course description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">CE Hours</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.ceHours}
                onChange={e => setForm(prev => ({ ...prev, ceHours: parseFloat(e.target.value) || 0 }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => { setShowCreate(false); setEditingId(null); setError(''); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: BURGUNDY }}
            >
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      )}

      {/* Course List */}
      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-stone-600 font-medium">No courses yet</p>
          <p className="text-sm text-stone-400 mt-1">Create your first course to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: BURGUNDY_LIGHT }}>
                    <BookOpen className="w-5 h-5" style={{ color: BURGUNDY }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-stone-900 truncate">{course.title}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        course.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : course.status === 'archived'
                          ? 'bg-stone-100 text-stone-500'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    {course.description && (
                      <p className="text-xs text-stone-500 line-clamp-1">{course.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                      <span>{course.ceHours} CE hrs</span>
                      <span>{course.enrollments || 0} enrolled</span>
                      <span>{course.completions || 0} completed</span>
                      {(course.enrollments || 0) > 0 && (
                        <span style={{ color: HUNTER }}>
                          {Math.round(((course.completions || 0) / course.enrollments) * 100)}% rate
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleStatusToggle(course)}
                    className="p-2 rounded-lg text-xs font-medium transition-colors hover:bg-stone-100"
                    style={{ color: course.status === 'published' ? '#d97706' : HUNTER }}
                    title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => startEdit(course)}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-stone-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
