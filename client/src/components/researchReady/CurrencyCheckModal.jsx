/**
 * CurrencyCheckModal — Shows currency verdict from AI review.
 * RNR CE design palette applied.
 */
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const verdictStyles = {
  approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
  approved_with_note: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle, label: 'Approved with Note' },
  replace_suggested: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Replace Suggested' },
  hold_for_review: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle, label: 'Hold for Review' }
};

const checkStatusIcons = {
  pass: { color: 'text-green-600', icon: CheckCircle },
  warn: { color: 'text-yellow-600', icon: AlertTriangle },
  fail: { color: 'text-red-600', icon: XCircle }
};

export default function CurrencyCheckModal({ verdict, newerArticles, onClose, onProceed }) {
  if (!verdict) return null;

  const style = verdictStyles[verdict.verdict] || verdictStyles.hold_for_review;
  const VerdictIcon = style.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAF5EC] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DDD9D3]">
          <h2 className="text-lg font-semibold font-[Georgia,serif] text-[#2A1F0E]">Currency Check Results</h2>
          <button onClick={onClose} className="text-[#7A6A54] hover:text-[#5C4D3A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Verdict badge */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${style.bg}`}>
            <VerdictIcon className={`w-6 h-6 ${style.text}`} />
            <div>
              <p className={`font-semibold font-[Georgia,serif] ${style.text}`}>{style.label}</p>
              <p className="text-sm font-[Georgia,serif] text-[#2A1F0E] mt-1">{verdict.summary}</p>
            </div>
          </div>

          {/* Checks table */}
          {verdict.checks && verdict.checks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-[Georgia,serif] text-[#5C4D3A] mb-2">Quality Checks</h3>
              <div className="space-y-2">
                {verdict.checks.map((check, i) => {
                  const cs = checkStatusIcons[check.status] || checkStatusIcons.warn;
                  const StatusIcon = cs.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#F5EEE0] rounded-lg">
                      <StatusIcon className={`w-4 h-4 mt-0.5 ${cs.color}`} />
                      <div>
                        <p className="text-sm font-medium font-[Georgia,serif] text-[#2A1F0E]">{check.label}</p>
                        <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">{check.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bundle opportunity */}
          {verdict.bundle_opportunity && verdict.bundle_note && (
            <div className="p-3 bg-[#FDF8EE] border border-[#DDD9D3] rounded-lg">
              <p className="text-sm font-[Georgia,serif] text-[#8B5E2E]">
                <span className="font-medium">Bundle Opportunity:</span> {verdict.bundle_note}
              </p>
            </div>
          )}

          {/* Newer articles */}
          {newerArticles && newerArticles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-[Georgia,serif] text-[#5C4D3A] mb-2">Newer Articles Found</h3>
              <div className="space-y-2">
                {newerArticles.map((a, i) => (
                  <div key={i} className="p-3 bg-[#F5EEE0] rounded-lg">
                    <p className="text-sm font-medium font-[Georgia,serif] text-[#2A1F0E]">{a.title}</p>
                    <p className="text-xs font-[Georgia,serif] text-[#7A6A54]">{a.authors} &middot; {a.year} &middot; {a.journal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#DDD9D3]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-[Georgia,serif] text-[#5C4D3A] hover:text-[#2A1F0E]">
            Cancel
          </button>
          {(verdict.verdict === 'approved' || verdict.verdict === 'approved_with_note') && (
            <button
              onClick={onProceed}
              className="px-4 py-2 bg-[#7B2D3E] text-[#FAF5EC] text-sm font-medium font-[Georgia,serif] rounded-lg hover:bg-[#9B3A4E] transition-colors"
            >
              Proceed to Build CE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
