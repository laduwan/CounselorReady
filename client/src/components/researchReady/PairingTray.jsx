/**
 * PairingTray — Shows when a thin article needs pairing with a second article.
 * RNR CE design palette applied.
 */
import { X, BookOpen } from 'lucide-react';

export default function PairingTray({ thinArticle, pairedArticle, onCancel, onConfirm }) {
  const combinedHours = 3.0;
  const format = thinArticle && pairedArticle
    ? (Math.abs(thinArticle.year - pairedArticle.year) > 3 ? 'Then and Now' : 'Comparative')
    : 'Integrative';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FAF5EC] border-t-2 border-[#7B2D3E] shadow-2xl p-4 z-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7B2D3E]" />
            <h3 className="font-[Georgia,serif] font-semibold text-[#2A1F0E]">Article Pairing Required</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium font-[Georgia,serif] bg-[#F8EEDC] text-[#8B5E2E]">
              {format} Format
            </span>
          </div>
          <button onClick={onCancel} className="text-[#7A6A54] hover:text-[#5C4D3A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary (thin) article */}
          <div className="bg-[#F5EEE0] rounded-lg p-3 border border-[#DDD9D3]">
            <p className="text-xs font-medium font-[Georgia,serif] text-[#8B5E2E] mb-1">Primary Article (Thin)</p>
            <p className="text-sm font-medium font-[Georgia,serif] text-[#2A1F0E] line-clamp-2">{thinArticle?.title}</p>
            <p className="text-xs font-[Georgia,serif] text-[#7A6A54] mt-1">{thinArticle?.wordCount} words &middot; {thinArticle?.ceHours} CE hrs</p>
          </div>

          {/* Second article slot */}
          {pairedArticle ? (
            <div className="bg-[#FDF8EE] rounded-lg p-3 border-[1.5px] border-[#7B2D3E]">
              <p className="text-xs font-medium font-[Georgia,serif] text-[#7B2D3E] mb-1">Paired Article</p>
              <p className="text-sm font-medium font-[Georgia,serif] text-[#2A1F0E] line-clamp-2">{pairedArticle.title}</p>
              <p className="text-xs font-[Georgia,serif] text-[#7A6A54] mt-1">{pairedArticle.wordCount} words &middot; {pairedArticle.ceHours} CE hrs</p>
            </div>
          ) : (
            <div className="bg-[#F5EEE0] rounded-lg p-3 border border-dashed border-[#C8C3BC] flex items-center justify-center">
              <p className="text-sm font-[Georgia,serif] text-[#7A6A54]">Select a second article from the results above</p>
            </div>
          )}
        </div>

        {pairedArticle && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-[Georgia,serif] text-[#5C4D3A]">
              Combined: <span className="font-semibold text-[#7B2D3E]">{combinedHours} CE hours</span>
            </p>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#7B2D3E] text-[#FAF5EC] text-sm font-medium font-[Georgia,serif] rounded-lg hover:bg-[#9B3A4E] transition-colors"
            >
              Create Paired CE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
