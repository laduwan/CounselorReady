/**
 * PairingTray — Shows when a thin article needs pairing with a second article.
 */
import { X, BookOpen } from 'lucide-react';

export default function PairingTray({ thinArticle, pairedArticle, onCancel, onConfirm }) {
  const combinedHours = 3.0;
  const format = thinArticle && pairedArticle
    ? (Math.abs(thinArticle.year - pairedArticle.year) > 3 ? 'Then and Now' : 'Comparative')
    : 'Integrative';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-burgundy-300 shadow-2xl p-4 z-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-burgundy-700" />
            <h3 className="font-semibold text-gray-900">Article Pairing Required</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-burgundy-100 text-burgundy-800">
              {format} Format
            </span>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary (thin) article */}
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-xs font-medium text-red-600 mb-1">Primary Article (Thin)</p>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{thinArticle?.title}</p>
            <p className="text-xs text-gray-500 mt-1">{thinArticle?.wordCount} words &middot; {thinArticle?.ceHours} CE hrs</p>
          </div>

          {/* Second article slot */}
          {pairedArticle ? (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-1">Paired Article</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{pairedArticle.title}</p>
              <p className="text-xs text-gray-500 mt-1">{pairedArticle.wordCount} words &middot; {pairedArticle.ceHours} CE hrs</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-sm text-gray-400">Select a second article from the results above</p>
            </div>
          )}
        </div>

        {pairedArticle && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-600">
              Combined: <span className="font-semibold text-burgundy-700">{combinedHours} CE hours</span>
            </p>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-burgundy-700 text-white text-sm font-medium rounded-lg hover:bg-burgundy-800 transition-colors"
            >
              Create Paired CE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
