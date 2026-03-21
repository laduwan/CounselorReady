/**
 * ArticleCard — Displays an article search result with word count badge
 * and full action strip. RNR CE design palette applied.
 */
import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Plus, Printer, Download, Bookmark } from 'lucide-react';
import WordCountBadge from './WordCountBadge';

export default function ArticleCard({ article, onCreateCE, onSelectForPairing, isPairingMode, onSaveArticle }) {
  const [expanded, setExpanded] = useState(false);

  const isSufficient = article.wcStatus === 'sufficient';
  const isThin = article.wcStatus === 'thin';

  const cardClass = isSufficient
    ? 'bg-[#F8EEDC] border-l-[3px] border-l-[#7B2D3E] border-t-0 border-r-0 border-b-0 rounded-r-[6px]'
    : 'bg-[#F5EEE0] border border-[#DDD9D3]';

  function handlePrint() {
    if (article.oaUrl) {
      const w = window.open(article.oaUrl, '_blank');
      if (w) setTimeout(() => w.print(), 1500);
    } else {
      window.print();
    }
  }

  function handleDownload() {
    if (article.oaUrl) {
      const a = document.createElement('a');
      a.href = article.oaUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    }
  }

  function handleSave() {
    if (onSaveArticle) {
      onSaveArticle(article);
    } else {
      const saved = JSON.parse(localStorage.getItem('rnr_saved_articles') || '[]');
      if (!saved.find(s => s.openAlexId === article.openAlexId)) {
        saved.push(article);
        localStorage.setItem('rnr_saved_articles', JSON.stringify(saved));
      }
    }
  }

  return (
    <div className={`${cardClass} p-5 hover:shadow-md transition-shadow`}>
      {/* Title */}
      <h3 className="font-[Georgia,serif] text-[13px] text-[#2A1F0E] font-semibold mb-2 leading-snug">
        {article.title}
      </h3>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F8EEDC] text-[#8B5E2E]">
          {article.year}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F4F1ED] text-[#5C4D3A]">
          Open Access
        </span>
        {article.topic && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#7B2D3E]">
            {article.topic}
          </span>
        )}
      </div>

      {/* Journal */}
      <p className="font-[Georgia,serif] text-[10px] italic text-[#5C4D3A] mb-1">
        {article.journal}
      </p>
      {/* Authors */}
      <p className="text-[10px] text-[#7A6A54] mb-3 line-clamp-1">
        {article.authors}
      </p>

      {/* Abstract */}
      {article.abstract && (
        <div className="mb-3">
          <p className={`text-[11px] italic text-[#7A6A54] font-[Georgia,serif] ${expanded ? '' : 'line-clamp-2'}`}>
            {article.abstract}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-[#7B2D3E] hover:text-[#9B3A4E] mt-1 flex items-center gap-1 font-[Georgia,serif]"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        </div>
      )}

      {/* Word count + CE hours */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <WordCountBadge
          wordCount={article.wordCount}
          ceHours={article.ceHours}
          wcStatus={article.wcStatus}
        />
        {article.ceHours > 0 && (
          <span className="text-[10px] text-[#7A6A54] font-[Georgia,serif]">
            {article.researchHours} research hr{article.researchHours !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Action Strip */}
      <div className="border-t border-[#DDD9D3] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary action */}
          {isPairingMode ? (
            <button
              onClick={() => onSelectForPairing(article)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7B2D3E] text-[#FAF5EC] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:bg-[#9B3A4E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Pair Article
            </button>
          ) : isThin ? (
            <button
              onClick={() => onCreateCE(article)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5E2E] text-[#FAF5EC] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:bg-[#A5712E] transition-colors"
            >
              Pair with another article
            </button>
          ) : (
            <button
              onClick={() => onCreateCE(article)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7B2D3E] text-[#FAF5EC] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:bg-[#9B3A4E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create CE
            </button>
          )}

          {/* Read article */}
          {article.oaUrl && (
            <a
              href={article.oaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F5EEE0] border border-[#DDD9D3] text-[#3D2E18] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:border-[#C49040] hover:text-[#8B5E2E] hover:bg-[#FDF8EE] transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Read article
            </a>
          )}

          {/* Print */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F5EEE0] border border-[#DDD9D3] text-[#3D2E18] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:border-[#C49040] hover:text-[#8B5E2E] hover:bg-[#FDF8EE] transition-colors"
          >
            <Printer className="w-3 h-3" /> Print
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F5EEE0] border border-[#DDD9D3] text-[#3D2E18] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:border-[#C49040] hover:text-[#8B5E2E] hover:bg-[#FDF8EE] transition-colors"
          >
            <Download className="w-3 h-3" /> Download
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F5EEE0] border border-[#DDD9D3] text-[#3D2E18] rounded font-[Georgia,serif] text-[10px] uppercase tracking-[0.05em] hover:border-[#C49040] hover:text-[#8B5E2E] hover:bg-[#FDF8EE] transition-colors"
          >
            <Bookmark className="w-3 h-3" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
