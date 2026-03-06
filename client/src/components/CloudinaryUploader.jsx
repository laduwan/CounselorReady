/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// DROP INTO: /client/src/components/CloudinaryUploader.jsx

import React, { useState, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.counselorready.com';

export default function CloudinaryUploader({
  onUpload, context = 'general', folder = 'counselorready/course-content',
  label = 'Upload Image', currentImage = null, compact = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const [alt, setAlt] = useState('');
  const [showBrowser, setShowBrowser] = useState(false);
  const [browseImages, setBrowseImages] = useState([]);
  const fileRef = useRef(null);
  const getToken = () => localStorage.getItem('token');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); return; }
    setUploading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file); formData.append('context', context);
      formData.append('folder', folder); formData.append('alt', alt);
      const res = await fetch(`${API_BASE}/api/images/upload`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${getToken()}` }, body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Upload failed');
      setPreview(data.data.thumbnailUrl || data.data.url);
      onUpload(data.data);
    } catch (err) { setError(err.message); } finally { setUploading(false); }
  };

  const handleBrowse = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/images/browse?folder=${folder}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) { setBrowseImages(data.data.images); setShowBrowser(true); }
    } catch (err) { setError('Failed to load images'); }
  };

  const selectExisting = (img) => {
    setPreview(img.url); setShowBrowser(false);
    onUpload({
      url: img.url, publicId: img.publicId, width: img.width, height: img.height, alt: img.alt || alt,
      thumbnailUrl: img.url.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
      mediumUrl: img.url.replace('/upload/', '/upload/w_800,q_auto/'),
      largeUrl: img.url.replace('/upload/', '/upload/w_1200,q_auto/'),
    });
  };

  if (compact) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <input type="file" ref={fileRef} accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ background: '#4A7C59', color: '#fff', border: 'none', borderRadius: 6,
            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '⏳ Uploading...' : '📷 ' + label}
        </button>
        {preview && <img src={preview} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />}
        {error && <span style={{ color: '#DC2626', fontSize: 11 }}>{error}</span>}
      </span>
    );
  }

  return (
    <div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      <div onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#4A7C59'; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = '#E8E4DF'; }}
        onDrop={(e) => {
          e.preventDefault(); e.currentTarget.style.borderColor = '#E8E4DF';
          const file = e.dataTransfer.files[0];
          if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFileSelect({ target: { files: dt.files } }); }
        }}
        style={{ border: '2px dashed #E8E4DF', borderRadius: 10, padding: preview ? 8 : 32,
          textAlign: 'center', cursor: 'pointer', background: preview ? '#F5F5DC' : '#fff', position: 'relative' }}>
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt={alt} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, display: 'block', margin: '0 auto' }} />
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>Click to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, color: '#284157', fontSize: 14 }}>{label}</div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Drag & drop or click · Max 10MB</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text for accessibility"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #E8E4DF', fontSize: 13, outline: 'none' }} />
        <button onClick={handleBrowse} style={{ background: 'none', border: '1px solid #E8E4DF', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600, color: '#284157' }}>📁 Browse</button>
      </div>
      {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 6 }}>⚠ {error}</p>}
      {showBrowser && (
        <div style={{ marginTop: 10, background: '#fff', border: '1px solid #E8E4DF', borderRadius: 10, padding: 16, maxHeight: 300, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Previously Uploaded ({browseImages.length})</span>
            <button onClick={() => setShowBrowser(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {browseImages.map(img => (
              <div key={img.publicId} onClick={() => selectExisting(img)}
                style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: '2px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4A7C59'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <img src={img.url.replace('/upload/', '/upload/w_100,h_100,c_fill/')} alt={img.alt}
                  style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
