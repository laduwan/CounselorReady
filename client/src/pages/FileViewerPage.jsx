/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useRef } from 'react';
import { Upload, FileText, File, X } from 'lucide-react';
import FileViewer from '../components/FileViewer';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';

const ACCEPTED_TYPES = '.txt,.text,.pdf,.doc,.docx';
const ACCEPTED_MIMES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function isAccepted(file) {
  if (ACCEPTED_MIMES.includes(file.type)) return true;
  const ext = file.name.split('.').pop().toLowerCase();
  return ['txt', 'text', 'pdf', 'doc', 'docx'].includes(ext);
}

export default function FileViewerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    if (!isAccepted(file)) {
      alert('Unsupported file type. Please use TXT, PDF, or DOC/DOCX files.');
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleInputChange(e) {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold" style={{ color: BURGUNDY }}>
          Document Viewer
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Open and read TXT, PDF, and DOC/DOCX files directly in your browser.
        </p>
      </div>

      {!selectedFile ? (
        /* Upload / Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors"
          style={{
            borderColor: dragActive ? BURGUNDY : '#d6d3d1',
            background: dragActive ? BURGUNDY_LIGHT : 'white',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload className="w-10 h-10 mx-auto mb-4" style={{ color: dragActive ? BURGUNDY : '#a8a29e' }} />
          <p className="text-stone-700 font-medium">
            Drop a file here or <span style={{ color: BURGUNDY }} className="underline">browse</span>
          </p>
          <p className="text-xs text-stone-400 mt-2">Supports TXT, PDF, DOC, and DOCX</p>

          {/* Quick format cards */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[
              { label: 'TXT', icon: FileText, desc: 'Plain text' },
              { label: 'PDF', icon: File, desc: 'PDF documents' },
              { label: 'DOC', icon: FileText, desc: 'Word files' },
            ].map(({ label, icon: Icon, desc }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 w-28">
                <Icon className="w-5 h-5" style={{ color: BURGUNDY }} />
                <span className="text-xs font-semibold text-stone-700">{label}</span>
                <span className="text-[10px] text-stone-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Viewer */
        <div>
          <FileViewer
            file={selectedFile}
            fileName={selectedFile.name}
            onClose={() => setSelectedFile(null)}
            height="calc(100vh - 240px)"
          />
          <div className="mt-3 text-center">
            <button
              onClick={() => setSelectedFile(null)}
              className="text-sm font-medium hover:underline"
              style={{ color: BURGUNDY }}
            >
              Open a different file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
