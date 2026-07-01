/**
 * CEBuildPreview — Admin modal for previewing generated CE content.
 * RNR CE design palette applied.
 */
import { X, CheckCircle } from 'lucide-react';

export default function CEBuildPreview({ course, onClose }) {
  if (!course) return null;

  const optionLetter = (idx) => ['A', 'B', 'C', 'D'][idx] || '?';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF5EC] rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DDD9D3]">
          <div>
            <h2 className="text-lg font-semibold font-[Georgia,serif] text-[#2A1F0E]">CE Build Preview</h2>
            <p className="text-sm font-[Georgia,serif] text-[#7A6A54] mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-[#7A6A54] hover:text-[#5C4D3A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#F5EEE0] rounded-lg p-3">
              <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">CE Hours</p>
              <p className="text-lg font-semibold font-[Georgia,serif] text-[#7B2D3E]">{course.ceHours}</p>
            </div>
            <div className="bg-[#F5EEE0] rounded-lg p-3">
              <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">Word Count</p>
              <p className="text-lg font-semibold font-[Georgia,serif] text-[#2A1F0E]">{course.wordCount?.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5EEE0] rounded-lg p-3">
              <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">Format</p>
              <p className="text-lg font-semibold font-[Georgia,serif] text-[#2A1F0E] capitalize">{course.format}</p>
            </div>
            <div className="bg-[#F5EEE0] rounded-lg p-3">
              <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">Questions</p>
              <p className="text-lg font-semibold font-[Georgia,serif] text-[#2A1F0E]">{course.questions?.length || 0}</p>
            </div>
          </div>

          {/* Content Areas */}
          {course.contentAreas && course.contentAreas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-[Georgia,serif] text-[#5C4D3A] mb-2">Content Areas</h3>
              <div className="flex flex-wrap gap-2">
                {course.contentAreas.map((area, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium font-[Georgia,serif] bg-[#F8EEDC] text-[#8B5E2E]">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-[Georgia,serif] text-[#5C4D3A] mb-2">Learning Objectives</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {course.objectives.map((obj, i) => (
                  <li key={i} className="text-sm font-[Georgia,serif] text-[#2A1F0E]">{obj}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Questions */}
          {course.questions && course.questions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-[Georgia,serif] text-[#5C4D3A] mb-3">Posttest Questions</h3>
              <div className="space-y-4">
                {course.questions.map((q, i) => (
                  <div key={i} className="bg-[#F5EEE0] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium font-[Georgia,serif] text-[#7B2D3E] bg-[#FDF8EE] border border-[#DDD9D3] px-2 py-0.5 rounded">
                        Q{i + 1}
                      </span>
                      <span className="text-xs font-[Georgia,serif] text-[#7A6A54]">{q.tag}</span>
                    </div>
                    <p className="text-sm font-medium font-[Georgia,serif] text-[#2A1F0E] mb-2">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 text-sm font-[Georgia,serif] px-3 py-1.5 rounded ${
                            oi === q.correct
                              ? 'bg-green-100 text-green-800 font-medium'
                              : 'text-[#5C4D3A]'
                          }`}
                        >
                          {oi === q.correct && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                    {q.rationale && (
                      <p className="text-xs font-[Georgia,serif] text-[#7A6A54] mt-2 italic">Rationale: {q.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t border-[#DDD9D3]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-[Georgia,serif] text-[#5C4D3A] hover:text-[#2A1F0E] border border-[#DDD9D3] rounded-lg bg-[#F5EEE0] hover:bg-[#FDF8EE] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
