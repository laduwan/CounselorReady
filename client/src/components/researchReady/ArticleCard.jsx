/**
 * ArticleCard — Displays an article search result with full action strip,
 * inline Read viewer, download proxy, and save/unsave.
 * RNR CE design palette + ADA WCAG 2.1 AA compliance.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Plus, Printer, Download, Bookmark, BookmarkCheck, X, FileText, File } from 'lucide-react';
import WordCountBadge from './WordCountBadge';
import api from '../../services/api';

export default function ArticleCard({ article, onCreateCE, onSelectForPairing, isPairingMode, savedArticles = [], onSaveChange }) {
  const [expanded, setExpanded] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerTab, setReaderTab] = useState('fulltext');
  const [saved, setSaved] = useState(savedArticles.includes(article.openAlexId));
  const [saveAnnouncement, setSaveAnnouncement] = useState('');
  const readBtnRef = useRef(null);
  const readerRef = useRef(null);

  const isThin = article.wcStatus === 'thin';
  const isAbstractOnly = article.abstractOnlyFlag;

  // Close reader on Escape
  useEffect(() => {
    if (!readerOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') {
        setReaderOpen(false);
        readBtnRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [readerOpen]);

  // Focus trap for reader when open
  useEffect(() => {
    if (readerOpen && readerRef.current) {
      readerRef.current.focus();
    }
  }, [readerOpen]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await api.get(`/research-ready/download/${article.openAlexId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(article.title || 'article').substring(0, 60).replace(/[^a-zA-Z0-9]+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open OA URL
      if (article.oaUrl) window.open(article.oaUrl, '_blank');
    }
  }, [article]);

  const handleSave = useCallback(async () => {
    try {
      if (saved) {
        await api.delete(`/research-ready/saved/${article.openAlexId}`);
        setSaved(false);
        setSaveAnnouncement('Article removed');
      } else {
        await api.post(`/research-ready/saved/${article.openAlexId}`);
        setSaved(true);
        setSaveAnnouncement('Article saved');
      }
      onSaveChange?.();
    } catch {
      // Fallback to localStorage
      const items = JSON.parse(localStorage.getItem('rnr_saved_articles') || '[]');
      if (saved) {
        localStorage.setItem('rnr_saved_articles', JSON.stringify(items.filter(s => s.openAlexId !== article.openAlexId)));
        setSaved(false);
        setSaveAnnouncement('Article removed');
      } else {
        items.push(article);
        localStorage.setItem('rnr_saved_articles', JSON.stringify(items));
        setSaved(true);
        setSaveAnnouncement('Article saved');
      }
    }
    setTimeout(() => setSaveAnnouncement(''), 3000);
  }, [saved, article, onSaveChange]);

  function handlePrint() {
    if (readerOpen) {
      window.print();
    } else if (article.oaUrl) {
      const w = window.open(article.oaUrl, '_blank');
      if (w) setTimeout(() => w.print(), 1500);
    }
  }

  const actionBtnClass = "inline-flex items-center gap-1 px-3 py-1.5 text-[#8B5E2E] font-[Georgia,serif] text-[12px] hover:underline hover:text-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 rounded";

  return (
    <article
      className="bg-[#FAF5EC] border border-[#DDD9D3] rounded-[10px] hover:shadow-md transition-shadow"
      aria-label={`Article: ${article.title}`}
    >
      <div className="p-5">
        {/* Abstract only badge */}
        {isAbstractOnly && (
          <div className="mb-2 px-2 py-1 rounded text-[11px] font-medium font-[Georgia,serif] bg-amber-100 text-amber-800 inline-block">
            Abstract only — CE hours pending full text
          </div>
        )}

        {/* Title */}
        <h3 className="font-[Georgia,serif] text-[14px] text-[#2A1F0E] font-bold leading-snug mb-2">
          {article.title}
        </h3>

        {/* Authors / Journal / Year */}
        <p className="font-[Georgia,serif] text-[13px] text-[#5C4D3A] mb-1">
          {article.authors}
        </p>
        <p className="font-[Georgia,serif] text-[13px] italic text-[#5C4D3A] mb-3">
          {article.journal} {article.year && `(${article.year})`}
        </p>

        {/* Abstract */}
        {article.abstract && (
          <div className="mb-3">
            <p className={`text-[12px] italic text-[#5C4D3A] font-[Georgia,serif] leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
              {article.abstract}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-[#7B2D3E] hover:text-[#9B3A4E] mt-1 flex items-center gap-1 font-[Georgia,serif] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
              aria-expanded={expanded}
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
            </button>
          </div>
        )}

        {/* Word count + CE hours */}
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <WordCountBadge
            wordCount={article.wordCount}
            ceHours={article.ceHours}
            wcStatus={article.wcStatus}
          />
          {article.ceHours > 0 && (
            <span className="text-[11px] text-[#5C4D3A] font-[Georgia,serif]">
              {article.researchHours} research hr{article.researchHours !== 1 ? 's' : ''}
            </span>
          )}
          {article.citedByCount > 0 && (
            <span className="text-[11px] text-[#5C4D3A] font-[Georgia,serif]">
              {article.citedByCount} citation{article.citedByCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Action Strip */}
      <div className="bg-[#F5EEE0] border-t border-[#EAE7E2] px-5 py-3 rounded-b-[10px]">
        <div className="flex flex-wrap items-center gap-1">
          {/* Create CE — hidden for abstract-only */}
          {!isAbstractOnly && (
            isPairingMode ? (
              <button
                onClick={() => onSelectForPairing(article)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8B5E2E] text-[#FDF8EE] rounded font-[Georgia,serif] text-[12px] font-semibold hover:bg-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
                aria-label={`Pair article: ${article.title}`}
              >
                <Plus className="w-3.5 h-3.5" /> Pair
              </button>
            ) : isThin ? (
              <button
                onClick={() => onCreateCE(article)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8B5E2E] text-[#FDF8EE] rounded font-[Georgia,serif] text-[12px] font-bold hover:bg-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
                aria-label={`Pair with another article: ${article.title}`}
              >
                Pair with another
              </button>
            ) : (
              <button
                onClick={() => onCreateCE(article)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8B5E2E] text-[#FDF8EE] rounded font-[Georgia,serif] text-[12px] font-bold hover:bg-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
                aria-label={`Create CE from: ${article.title}`}
              >
                Create CE
              </button>
            )
          )}

          {/* Read */}
          <button
            ref={readBtnRef}
            onClick={() => setReaderOpen(!readerOpen)}
            className={actionBtnClass}
            aria-label={`Read full article: ${article.title}`}
            aria-expanded={readerOpen}
          >
            <FileText className="w-3.5 h-3.5" /> Read
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className={actionBtnClass}
            aria-label={`Print article: ${article.title}`}
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className={actionBtnClass}
            aria-label={`Download PDF: ${article.title}`}
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className={actionBtnClass}
            aria-label={saved ? `Unsave article: ${article.title}` : `Save article: ${article.title}`}
            aria-pressed={saved}
          >
            {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Screen reader save announcement */}
        <div aria-live="polite" className="sr-only">{saveAnnouncement}</div>
      </div>

      {/* Inline Read Viewer */}
      {readerOpen && (
        <div
          ref={readerRef}
          className="border-t border-[#DDD9D3] bg-[#FDF8EE] p-5 rounded-b-[10px] print:block"
          role="region"
          aria-label="Article viewer"
          tabIndex={-1}
        >
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-4 border-b border-[#EAE7E2] pb-2">
            <button
              onClick={() => setReaderTab('fulltext')}
              className={`font-[Georgia,serif] text-[13px] pb-1 focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 ${
                readerTab === 'fulltext' ? 'text-[#7B2D3E] border-b-2 border-[#7B2D3E] font-semibold' : 'text-[#5C4D3A]'
              }`}
              aria-selected={readerTab === 'fulltext'}
              role="tab"
            >
              Full Text
            </button>
            {article.oaUrl && (
              <button
                onClick={() => setReaderTab('pdf')}
                className={`font-[Georgia,serif] text-[13px] pb-1 focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 ${
                  readerTab === 'pdf' ? 'text-[#7B2D3E] border-b-2 border-[#7B2D3E] font-semibold' : 'text-[#5C4D3A]'
                }`}
                aria-selected={readerTab === 'pdf'}
                role="tab"
              >
                <File className="w-3.5 h-3.5 inline mr-1" /> PDF
              </button>
            )}
            <button
              onClick={() => { setReaderOpen(false); readBtnRef.current?.focus(); }}
              className="ml-auto p-1.5 text-[#5C4D3A] hover:text-[#7B2D3E] focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2 rounded"
              aria-label="Close article viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab content */}
          {readerTab === 'fulltext' ? (
            <div className="font-[Georgia,serif] text-[13px] text-[#2A1F0E] leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap print:max-h-none print:overflow-visible">
              <div className="mb-3 print:block">
                <h4 className="font-bold text-[15px] mb-1">{article.title}</h4>
                <p className="text-[12px] text-[#5C4D3A]">{article.authors}</p>
                <p className="text-[12px] text-[#5C4D3A] italic">{article.journal} ({article.year}){article.doi ? ` · DOI: ${article.doi}` : ''}</p>
              </div>
              {article.fullText ? (
                <p>{article.fullText}</p>
              ) : article.abstract ? (
                <>
                  <p className="italic text-[#5C4D3A] mb-2">Full text not available. Showing abstract:</p>
                  <p>{article.abstract}</p>
                </>
              ) : (
                <p className="italic text-[#5C4D3A]">No text content available for this article.</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[11px] text-[#5C4D3A] font-[Georgia,serif] mb-2 italic">
                Screen reader users: use the Full Text tab for accessible content.
              </p>
              <iframe
                src={article.oaUrl}
                title={`PDF viewer: ${article.title}`}
                className="w-full h-[500px] border border-[#DDD9D3] rounded"
                aria-label={`PDF of ${article.title}`}
              />
            </div>
          )}

          {/* Print button inside viewer */}
          <div className="mt-4 flex justify-end print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8B5E2E] text-[#FDF8EE] rounded font-[Georgia,serif] text-[12px] hover:bg-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
              aria-label="Print article"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>
      )}

      {/* Print stylesheet scoped styles */}
      <style>{`
        @media print {
          nav, .action-strip, [role="navigation"], header:not([role="region"]) { display: none !important; }
          article { break-inside: avoid; }
        }
      `}</style>
    </article>
  );
}
