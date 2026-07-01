/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Admin Bulk Course Upload Page
 * Allows admins to upload multiple course documents (DOCX, PDF, MD, TXT, ZIP)
 * and have them parsed into courses using AI
 */
export default function AdminBulkUpload() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [previewCourses, setPreviewCourses] = useState([]);
  const [savingCourses, setSavingCourses] = useState(false);
  
  // Upload settings
  const [settings, setSettings] = useState({
    accessType: 'paid',
    accessTier: 'professional',
    price: '',
    pricingTier: 'standard',
    approvingBody: 'NBCC',
    approvalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    autoSave: false
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin access required for bulk course uploads.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setResults(null);
    setPreviewCourses([]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setError(null);
    setResults(null);
    setPreviewCourses([]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setResults(null);
    setPreviewCourses([]);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add settings
      Object.entries(settings).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post('/admin/courses/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000 // 5 minute timeout for large uploads
      });

      setResults(response.data);
      
      // If not auto-saving, store courses for preview/manual save
      if (!settings.autoSave && response.data.courses) {
        setPreviewCourses(response.data.courses);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCourses = async () => {
    if (previewCourses.length === 0) return;

    setSavingCourses(true);
    setError(null);

    try {
      const coursesToSave = previewCourses.map(p => p.course);
      const response = await api.post('/admin/courses/bulk-save', {
        courses: coursesToSave
      });

      setResults(prev => ({
        ...prev,
        message: `Saved ${response.data.saved.length} courses`,
        saved: response.data.saved,
        saveErrors: response.data.errors
      }));
      setPreviewCourses([]);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save courses.');
    } finally {
      setSavingCourses(false);
    }
  };

  const handleRemovePreviewCourse = (index) => {
    setPreviewCourses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Course Upload</h1>
          <p className="mt-2 text-gray-600">
            Upload course documents (DOCX, PDF, TXT, MD) or a ZIP file containing multiple courses.
            AI will parse the content and create course entries.
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Default Course Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
              <select
                value={settings.accessType}
                onChange={(e) => setSettings(s => ({ ...s, accessType: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="subscription">Subscription Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Tier</label>
              <select
                value={settings.accessTier}
                onChange={(e) => setSettings(s => ({ ...s, accessTier: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              >
                <option value="free">Free</option>
                <option value="professional">Professional</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (if paid)</label>
              <input
                type="number"
                step="0.01"
                value={settings.price}
                onChange={(e) => setSettings(s => ({ ...s, price: e.target.value }))}
                placeholder="e.g., 29.99"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Tier</label>
              <select
                value={settings.pricingTier}
                onChange={(e) => setSettings(s => ({ ...s, pricingTier: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approving Body</label>
              <select
                value={settings.approvingBody}
                onChange={(e) => setSettings(s => ({ ...s, approvingBody: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              >
                <option value="NBCC">NBCC</option>
                <option value="ACA">ACA</option>
                <option value="NASW">NASW</option>
                <option value="APA">APA</option>
                <option value="State Board">State Board</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Number</label>
              <input
                type="text"
                value={settings.approvalNumber}
                onChange={(e) => setSettings(s => ({ ...s, approvalNumber: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
              <input
                type="text"
                value={settings.instructor}
                onChange={(e) => setSettings(s => ({ ...s, instructor: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-600 focus:ring-burgundy-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(s => ({ ...s, autoSave: e.target.checked }))}
                  className="rounded border-gray-300 text-burgundy-700 focus:ring-burgundy-600"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Auto-save courses (skip preview)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            bg-white rounded-lg border-2 border-dashed p-8 text-center
            transition-colors cursor-pointer
            ${files.length > 0 ? 'border-burgundy-600 bg-burgundy-100' : 'border-gray-300 hover:border-burgundy-500'}
          `}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept=".docx,.pdf,.txt,.md,.zip"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {files.length > 0 ? (
            <div className="mt-4">
              <p className="text-burgundy-800 font-medium">{files.length} file(s) selected</p>
              <ul className="mt-2 text-sm text-gray-600 max-h-32 overflow-y-auto">
                {files.map((f, i) => (
                  <li key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-medium text-burgundy-700">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                DOCX, PDF, TXT, MD, or ZIP (max 50MB)
              </p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className={`
              px-6 py-3 rounded-lg font-medium text-white
              ${uploading || files.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-burgundy-700 hover:bg-burgundy-800'}
              transition-colors
            `}
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Upload & Parse ${files.length > 0 ? `(${files.length} files)` : ''}`
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Courses (when not auto-saving) */}
        {previewCourses.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Parsed Courses ({previewCourses.length})
              </h2>
              <button
                onClick={handleSaveCourses}
                disabled={savingCourses}
                className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 disabled:bg-gray-400"
              >
                {savingCourses ? 'Saving...' : `Save All (${previewCourses.length})`}
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {previewCourses.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{item.filename}</p>
                      <h3 className="font-medium text-gray-900">{item.course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.course.description?.substring(0, 150)}...</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-burgundy-200 text-burgundy-800">
                          {item.course.ceuHours} CE Hours
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {item.course.modules?.length || 0} Modules
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                          {item.course.objectives?.length || 0} Objectives
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePreviewCourse(index)}
                      className="ml-4 text-gray-400 hover:text-red-500"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{results.summary?.filesUploaded || 0}</div>
                <div className="text-sm text-gray-600">Files Uploaded</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{results.summary?.successfullyParsed || 0}</div>
                <div className="text-sm text-green-600">Successfully Parsed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{results.summary?.saved || 0}</div>
                <div className="text-sm text-blue-600">Courses Saved</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-700">
                  {(results.summary?.failedToParse || 0) + (results.summary?.saveErrors || 0)}
                </div>
                <div className="text-sm text-red-600">Errors</div>
              </div>
            </div>

            {/* Saved courses list */}
            {results.saved && results.saved.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Saved Courses:</h3>
                <ul className="space-y-2">
                  {results.saved.map((course, i) => (
                    <li key={i} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <div>
                        <span className="font-medium text-gray-900">{course.title}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({course.ceuHours} hrs, {course.moduleCount} modules)
                        </span>
                      </div>
                      <a
                        href={`/admin/courses/${course.courseId}`}
                        className="text-burgundy-700 hover:text-burgundy-800 text-sm"
                      >
                        Edit →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Errors */}
            {results.errors && (
              <>
                {results.errors.extraction?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-red-700 mb-2">Extraction Errors:</h3>
                    <ul className="text-sm text-red-600 space-y-1">
                      {results.errors.extraction.map((e, i) => (
                        <li key={i}>{e.filename}: {e.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.errors.parsing?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-red-700 mb-2">Parsing Errors:</h3>
                    <ul className="text-sm text-red-600 space-y-1">
                      {results.errors.parsing.map((e, i) => (
                        <li key={i}>{e.filename}: {e.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.errors.saving?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-red-700 mb-2">Save Errors:</h3>
                    <ul className="text-sm text-red-600 space-y-1">
                      {results.errors.saving.map((e, i) => (
                        <li key={i}>{e.filename || e.title}: {e.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Supported Formats</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Markdown (.md, .txt)</strong> - Best results with structured headers</li>
            <li><strong>Word Documents (.docx)</strong> - Text will be extracted from document</li>
            <li><strong>PDF (.pdf)</strong> - Works best with text-based (not scanned) PDFs</li>
            <li><strong>ZIP (.zip)</strong> - Upload multiple course files in one archive</li>
          </ul>
          <p className="text-sm text-blue-700 mt-3">
            <strong>Tip:</strong> For best results, use the markdown format with clear headers for:
            Course Title, Learning Objectives, Modules, and Post-Test questions.
          </p>
        </div>
      </div>
    </div>
  );
}
