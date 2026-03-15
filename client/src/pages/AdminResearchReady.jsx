/**
 * AdminResearchReady — Admin queue page for Researched-N-Ready CE courses.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import CEBuildPreview from '../components/researchReady/CEBuildPreview';

const statusStyles = {
  pending_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
  live: { bg: 'bg-green-100', text: 'text-green-800', label: 'Live' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
};

const verdictStyles = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  approved_with_note: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Note' },
  hold_for_review: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Hold' },
  replace_suggested: { bg: 'bg-red-100', text: 'text-red-700', label: 'Replace' }
};

export default function AdminResearchReady() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      const { data } = await api.get('/research-ready/queue');
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await api.patch(`/research-ready/queue/${id}/approve`);
      loadQueue();
    } catch (err) {
      alert('Approve failed: ' + (err.response?.data?.error || err.message));
    }
  }

  async function handleReject(id) {
    try {
      await api.patch(`/research-ready/queue/${id}/reject`, { rejectionNote: rejectNote });
      setRejectingId(null);
      setRejectNote('');
      loadQueue();
    } catch (err) {
      alert('Reject failed: ' + (err.response?.data?.error || err.message));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-burgundy-700" />
        <h1 className="text-2xl font-bold text-gray-900">Researched-N-Ready CE Queue</h1>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-burgundy-100 text-burgundy-800">
          {courses.filter(c => c.status === 'pending_review').length} pending
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">No courses in queue</h2>
          <p className="text-sm text-gray-400">Researched-N-Ready CE courses will appear here after generation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Article</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Authors / Year</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">CE Hrs</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Content Areas</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Currency</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Words</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => {
                  const ss = statusStyles[course.status] || statusStyles.pending_review;
                  const cv = course.currencyVerdict?.verdict;
                  const vs = cv ? (verdictStyles[cv] || verdictStyles.hold_for_review) : null;

                  return (
                    <tr key={course._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-xs truncate" title={course.title}>
                          {course.title.length > 60 ? course.title.substring(0, 60) + '...' : course.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <p className="max-w-[150px] truncate">{course.authors}</p>
                        <p className="text-xs text-gray-400">{course.year}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-burgundy-700">{course.ceHours}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(course.contentAreas || []).slice(0, 2).map((area, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                              {area}
                            </span>
                          ))}
                          {course.contentAreas?.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{course.contentAreas.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {vs ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${vs.bg} ${vs.text}`}>
                            {vs.label}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">
                        {course.wordCount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ss.bg} ${ss.text}`}>
                          {ss.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewCourse(course)}
                            className="p-1.5 text-gray-400 hover:text-burgundy-700 rounded-lg hover:bg-burgundy-50"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(course.status === 'pending_review' || course.status === 'approved') && (
                            <>
                              <button
                                onClick={() => handleApprove(course._id)}
                                className="p-1.5 text-green-500 hover:text-green-700 rounded-lg hover:bg-green-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              {rejectingId === course._id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={rejectNote}
                                    onChange={e => setRejectNote(e.target.value)}
                                    placeholder="Reason..."
                                    className="text-xs border rounded px-2 py-1 w-32"
                                  />
                                  <button
                                    onClick={() => handleReject(course._id)}
                                    className="text-xs text-red-600 font-medium"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => { setRejectingId(null); setRejectNote(''); }}
                                    className="text-xs text-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setRejectingId(course._id)}
                                  className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewCourse && (
        <CEBuildPreview
          course={previewCourse}
          onClose={() => setPreviewCourse(null)}
        />
      )}
    </div>
  );
}
