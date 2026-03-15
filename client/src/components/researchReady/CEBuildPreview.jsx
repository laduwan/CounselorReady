/**
 * CEBuildPreview — Admin modal for previewing generated CE content.
 */
import { X, CheckCircle } from 'lucide-react';

export default function CEBuildPreview({ course, onClose }) {
  if (!course) return null;

  const optionLetter = (idx) => ['A', 'B', 'C', 'D'][idx] || '?';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CE Build Preview</h2>
            <p className="text-sm text-gray-500 mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">CE Hours</p>
              <p className="text-lg font-semibold text-burgundy-700">{course.ceHours}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Word Count</p>
              <p className="text-lg font-semibold text-gray-800">{course.wordCount?.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Format</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{course.format}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Questions</p>
              <p className="text-lg font-semibold text-gray-800">{course.questions?.length || 0}</p>
            </div>
          </div>

          {/* Content Areas */}
          {course.contentAreas && course.contentAreas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Content Areas</h3>
              <div className="flex flex-wrap gap-2">
                {course.contentAreas.map((area, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-burgundy-100 text-burgundy-800">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {course.objectives.map((obj, i) => (
                  <li key={i} className="text-sm text-gray-700">{obj}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Questions */}
          {course.questions && course.questions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Posttest Questions</h3>
              <div className="space-y-4">
                {course.questions.map((q, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-burgundy-600 bg-burgundy-50 px-2 py-0.5 rounded">
                        Q{i + 1}
                      </span>
                      <span className="text-xs text-gray-400">{q.tag}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded ${
                            oi === q.correct
                              ? 'bg-green-100 text-green-800 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {oi === q.correct && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                    {q.rationale && (
                      <p className="text-xs text-gray-500 mt-2 italic">Rationale: {q.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
