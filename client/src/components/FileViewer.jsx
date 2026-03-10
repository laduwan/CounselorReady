/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, File, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Loader2, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';

/**
 * Embedded file viewer supporting TXT, PDF, and DOC/DOCX files.
 *
 * Props:
 *  - fileUrl:  string  — URL to the file (remote or blob URL)
 *  - file:     File    — browser File object (from <input> or drag-drop)
 *  - fileName: string  — display name / fallback for type detection
 *  - onClose:  fn      — optional callback to close/dismiss the viewer
 *  - height:   string  — CSS height for the viewer container (default "600px")
 */
export default function FileViewer({ fileUrl, file, fileName, onClose, height = '600px' }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  // PDF-specific state
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const canvasRef = useRef(null);

  // Determine file type from name or URL
  const detectType = useCallback(() => {
    const name = (fileName || fileUrl || file?.name || '').toLowerCase();
    if (name.endsWith('.pdf')) return 'pdf';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'docx';
    if (name.endsWith('.txt') || name.endsWith('.text')) return 'txt';
    // Fallback: check MIME if File object
    if (file) {
      if (file.type === 'application/pdf') return 'pdf';
      if (file.type.includes('word') || file.type.includes('officedocument')) return 'docx';
      if (file.type.startsWith('text/')) return 'txt';
    }
    return 'txt'; // default fallback
  }, [fileName, fileUrl, file]);

  // Get array buffer from either file or URL
  const getArrayBuffer = useCallback(async () => {
    if (file) return await file.arrayBuffer();
    if (fileUrl) {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);
      return await res.arrayBuffer();
    }
    throw new Error('No file source provided');
  }, [file, fileUrl]);

  // Load file content based on type
  useEffect(() => {
    let cancelled = false;
    const type = detectType();
    setFileType(type);
    setLoading(true);
    setError(null);
    setContent(null);
    setPdfDoc(null);

    async function loadFile() {
      try {
        if (type === 'txt') {
          let text;
          if (file) {
            text = await file.text();
          } else if (fileUrl) {
            const res = await fetch(fileUrl);
            if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);
            text = await res.text();
          }
          if (!cancelled) setContent(text);
        } else if (type === 'pdf') {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
          const buffer = await getArrayBuffer();
          const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
          if (!cancelled) {
            setPdfDoc(doc);
            setTotalPages(doc.numPages);
            setCurrentPage(1);
          }
        } else if (type === 'docx') {
          const mammoth = await import('mammoth');
          const buffer = await getArrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
          if (!cancelled) setContent(DOMPurify.sanitize(result.value));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load file');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFile();
    return () => { cancelled = true; };
  }, [file, fileUrl, detectType, getArrayBuffer]);

  // Render PDF page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;

    async function renderPage() {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
    }

    renderPage();
    return () => { cancelled = true; };
  }, [pdfDoc, currentPage, scale]);

  const displayName = fileName || file?.name || fileUrl?.split('/').pop() || 'File';

  const typeIcon = fileType === 'pdf' ? (
    <File className="w-4 h-4" style={{ color: BURGUNDY }} />
  ) : (
    <FileText className="w-4 h-4" style={{ color: BURGUNDY }} />
  );

  const typeLabel = fileType === 'pdf' ? 'PDF' : fileType === 'docx' ? 'DOC' : 'TXT';

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col" style={{ height }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 bg-stone-50 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {typeIcon}
          <span className="text-sm font-medium text-stone-800 truncate">{displayName}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
            {typeLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* PDF controls */}
          {fileType === 'pdf' && pdfDoc && (
            <>
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-stone-600" />
              </button>
              <span className="text-xs text-stone-500 min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(s => Math.min(3, s + 0.2))}
                className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-stone-600" />
              </button>
              <div className="w-px h-5 bg-stone-300 mx-1" />
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-stone-600" />
              </button>
              <span className="text-xs text-stone-600 min-w-[4rem] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 text-stone-600" />
              </button>
              <div className="w-px h-5 bg-stone-300 mx-1" />
            </>
          )}

          {/* Download link */}
          {fileUrl && (
            <a
              href={fileUrl}
              download={displayName}
              className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-stone-600" />
            </a>
          )}

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors ml-1"
              title="Close"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: BURGUNDY }} />
            <p className="text-sm text-stone-500">Loading {typeLabel} file...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* TXT viewer */}
        {!loading && !error && fileType === 'txt' && (
          <pre className="p-6 text-sm text-stone-700 font-body whitespace-pre-wrap leading-relaxed">
            {content}
          </pre>
        )}

        {/* PDF viewer */}
        {!loading && !error && fileType === 'pdf' && pdfDoc && (
          <div className="flex justify-center p-4 bg-stone-100 min-h-full">
            <canvas ref={canvasRef} className="shadow-md" />
          </div>
        )}

        {/* DOCX viewer */}
        {!loading && !error && fileType === 'docx' && (
          <div
            className="p-6 prose prose-stone max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
