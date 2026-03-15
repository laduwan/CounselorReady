/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState } from 'react';
import api from '../services/api';
import { Upload, Check, AlertCircle, Download, X, FileText } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

const TEMPLATE = [
  {
    title: "Ethics in Counseling Practice",
    description: "An overview of ethical decision-making frameworks for counselors.",
    ceHours: 3,
    categories: ["Ethics"],
    objectives: ["Identify key ethical principles", "Apply ethical decision-making models"],
    status: "draft"
  }
];

export default function PartnerBulkUpload() {
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('paste'); // 'paste', 'file', or 'csv'

  function downloadTemplate(format = 'json') {
    let blob, filename;
    if (format === 'csv') {
      const header = 'title,description,ceHours,categories,objectives,status';
      const row = '"Ethics in Counseling Practice","An overview of ethical decision-making frameworks for counselors.",3,"Ethics","Identify key ethical principles|Apply ethical decision-making models",draft';
      blob = new Blob([header + '\n' + row], { type: 'text/csv' });
      filename = 'course-upload-template.csv';
    } else {
      blob = new Blob([JSON.stringify({ courses: TEMPLATE }, null, 2)], { type: 'application/json' });
      filename = 'course-upload-template.json';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function parseCsv(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
        current += char;
      }
      values.push(current.trim());
      const obj = {};
      headers.forEach((h, i) => {
        const val = values[i] || '';
        if (h === 'ceHours') obj[h] = parseFloat(val) || 0;
        else if (h === 'categories' || h === 'objectives' || h === 'tags') obj[h] = val ? val.split('|').map(s => s.trim()) : [];
        else obj[h] = val;
      });
      return obj;
    });
  }

  async function handleFileLoad(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const text = await f.text();
    setJsonInput(text);
  }

  async function handleUpload() {
    setError('');
    setResults(null);

    let courses;

    if (mode === 'csv' || (file && file.name.endsWith('.csv'))) {
      courses = parseCsv(jsonInput);
      if (courses.length === 0) {
        setError('No valid rows found in CSV. Ensure you have a header row and at least one data row.');
        return;
      }
    } else {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch {
        setError('Invalid JSON. Please check your input format.');
        return;
      }
      courses = parsed.courses || parsed;
    }
    if (!Array.isArray(courses)) {
      setError('Expected a JSON object with a "courses" array, or a direct array of course objects.');
      return;
    }

    if (courses.length === 0) {
      setError('No courses found in the input.');
      return;
    }

    if (courses.length > 50) {
      setError('Maximum 50 courses per upload.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/partners/my/courses/bulk', { courses });
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Bulk Course Upload
          </h1>
          <p className="text-sm text-stone-500 mt-1">Import multiple courses at once via JSON or CSV</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadTemplate('json')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <Download className="w-3 h-3" /> JSON Template
          </button>
          <button
            onClick={() => downloadTemplate('csv')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <Download className="w-3 h-3" /> CSV Template
          </button>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('paste')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: mode === 'paste' ? BURGUNDY : 'transparent', color: mode === 'paste' ? 'white' : '#78716c' }}
        >
          Paste JSON
        </button>
        <button
          onClick={() => setMode('file')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: mode === 'file' ? BURGUNDY : 'transparent', color: mode === 'file' ? 'white' : '#78716c' }}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode('csv')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: mode === 'csv' ? BURGUNDY : 'transparent', color: mode === 'csv' ? 'white' : '#78716c' }}
        >
          Paste CSV
        </button>
      </div>

      {/* Input */}
      <div className="card p-5">
        {mode === 'file' ? (
          <div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-xl p-8 cursor-pointer hover:border-stone-400 transition-colors">
              <Upload className="w-8 h-8 text-stone-400 mb-2" />
              <p className="text-sm text-stone-600 font-medium">{file ? file.name : 'Click to select JSON or CSV file'}</p>
              <p className="text-xs text-stone-400 mt-1">Max 50 courses per file</p>
              <input type="file" accept=".json,.csv" onChange={handleFileLoad} className="hidden" />
            </label>
          </div>
        ) : mode === 'csv' ? (
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              CSV Input <span className="text-stone-400">(header row + data rows, use | to separate multiple values in a field)</span>
            </label>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="w-full font-mono text-sm border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': BURGUNDY }}
              rows={12}
              placeholder={'title,description,ceHours,categories,objectives,status\n"Ethics in Counseling","Overview of ethics frameworks",3,"Ethics","Identify principles|Apply models",draft'}
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              JSON Input <span className="text-stone-400">(paste your courses array)</span>
            </label>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="w-full font-mono text-sm border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': BURGUNDY }}
              rows={12}
              placeholder={JSON.stringify({ courses: TEMPLATE }, null, 2)}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading || !jsonInput.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: BURGUNDY }}
          >
            <Upload className="w-4 h-4" /> {loading ? 'Uploading...' : 'Upload Courses'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-3">Upload Results</h2>
          <p className="text-sm mb-4" style={{ color: results.created.length > 0 ? HUNTER : '#dc2626' }}>
            {results.message}
          </p>

          {results.created.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Created</p>
              <div className="space-y-1">
                {results.created.map(c => (
                  <div key={c._id} className="flex items-center gap-2 text-sm text-stone-700 p-2 bg-green-50 rounded">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium">{c.title}</span>
                    <span className="text-xs text-stone-400 font-mono">/{c.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.errors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Errors</p>
              <div className="space-y-1">
                {results.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm p-2 bg-red-50 rounded">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-stone-700">{e.title}</span>
                      <p className="text-xs text-red-600 mt-0.5">{e.error}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format Guide */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-2">Format Guide</h2>
        <div className="text-xs text-stone-500 space-y-2">
          <p><strong>Required fields:</strong> <code className="bg-stone-100 px-1 rounded">title</code>, <code className="bg-stone-100 px-1 rounded">description</code>, <code className="bg-stone-100 px-1 rounded">ceHours</code></p>
          <p><strong>Optional:</strong> <code className="bg-stone-100 px-1 rounded">slug</code> (auto-generated from title), <code className="bg-stone-100 px-1 rounded">categories</code>, <code className="bg-stone-100 px-1 rounded">tags</code>, <code className="bg-stone-100 px-1 rounded">objectives</code>, <code className="bg-stone-100 px-1 rounded">presenter</code>, <code className="bg-stone-100 px-1 rounded">status</code> (draft/published)</p>
          <p><strong>CSV format:</strong> Use <code className="bg-stone-100 px-1 rounded">|</code> (pipe) to separate multiple values within array fields (categories, objectives, tags). Wrap fields containing commas in double quotes.</p>
        </div>
      </div>
    </div>
  );
}
