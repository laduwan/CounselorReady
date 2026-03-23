/**
 * ArticleCard — Displays an article search result with word count badge.
 */
import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import WordCountBadge from './WordCountBadge';

export default function ArticleCard({ article, onCreateCE, onSelectForPairing, isPairingMode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
        {article.title}
      </h3>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-burgundy-100 text-burgundy-800">
          {article.year}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Open Access
        </span>
        {article.topic && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {article.topic}
          </span>
        )}
      </div>

      {/* Meta */}
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium text-gray-700">{article.journal}</span>
      </p>
      <p className="text-sm text-gray-500 mb-3 line-clamp-1">
        {article.authors}
      </p>

      {/* Abstract */}
      {article.abstract && (
        <div className="mb-3">
          <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {article.abstract}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-burgundy-600 hover:text-burgundy-800 mt-1 flex items-center gap-1"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        </div>
      )}

      {/* Word count + CE hours */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <WordCountBadge
          wordCount={article.wordCount}
          ceHours={article.ceHours}
          wcStatus={article.wcStatus}
        />
        {article.ceHours > 0 && (
          <span className="text-xs text-gray-500">
            {article.researchHours} research hr{article.researchHours !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isPairingMode ? (
          <button
            onClick={() => onSelectForPairing(article)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-burgundy-700 text-white text-sm font-medium rounded-lg hover:bg-burgundy-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Pair Article
          </button>
        ) : (
          <button
            onClick={() => onCreateCE(article)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-burgundy-700 text-white text-sm font-medium rounded-lg hover:bg-burgundy-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create CE
          </button>
        )}
        {article.oaUrl && (
          <a
            href={article.oaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-burgundy-600 hover:text-burgundy-800"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Article
          </a>
        )}
      </div>
    </div>
  );
}
