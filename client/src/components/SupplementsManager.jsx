/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// DROP INTO: /client/src/components/SupplementsManager.jsx
//
// Self-contained manager for a course's supplementary materials (the viewer's
// Resources drawer, backed by course.resources[]). Given a courseId it loads the
// course, lets an admin upload files to Cloudinary (auto-foldered by courseCode),
// browse already-uploaded files, add external links, edit titles/types, and save —
// no seed script, no manual Cloudinary, no re-run.
//
// Usage:
//   <SupplementsManager courseId={course._id} />        // standalone or in a tab

import React, { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.counselorready.com';

const C = {
  burgundy: '#6B1D34', green: '#4A7C59', gold: '#D4A855', navy: '#284157',
  bg: '#F8F7F4', card: '#FFFFFF', border: '#E8E4DF', borderLight: '#F0EDE8',
  text: '#2C2C2C', textMuted: '#6B7280', textLight: '#9CA3AF', danger: '#DC2626',
};

// types the viewer recognizes (drives icon + download behavior)
const TYPE_OPTIONS = ['pdf', 'docx', 'doc', 'worksheet', 'template', 'pptx', 'xlsx', 'video', 'website', 'link', 'book'];
const TYPE_ICON = {
  pdf: '📄', docx: '📃', doc: '📃', worksheet: '📝', template: '📝',
  pptx: '📊', xlsx: '📊', video: '🎬', website: '🌐', link: '🔗', book: '📚',
};

const token = () => localStorage.getItem('token');

export default function SupplementsManager({ courseId }) {
  const [loading, setLoading]   = useState(true);
  const [courseCode, setCode]   = useState('');
  const [courseTitle, setTitle] = useState('');
  const [items, setItems]       = useState([]);
  const [uploading, setUp]      = useState(false);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState(null);
  const [msg, setMsg]           = useState(null);
  const [browse, setBrowse]     = useState(null);   // null | array
  const [link, setLink]         = useState({ title: '', url: '', description: '' });
  const fileRef = useRef(null);

  // ── load course ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/interactive-courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const d = await r.json();
        const course = d.data || d.course || d;
        setCode(course.courseCode || '');
        setTitle(course.title || '');
        setItems(Array.isArray(course.resources) ? course.resources : []);
      } catch (e) { setErr('Could not load course'); }
      finally { setLoading(false); }
    })();
  }, [courseId]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };

  // ── upload ───────────────────────────────────────────────────────────────
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { setErr('File must be under 25MB'); return; }
    setUp(true); setErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('courseCode', courseCode || 'general');
      fd.append('context', 'deliverable');
      fd.append('title', file.name.replace(/\.[^.]+$/, ''));
      const r = await fetch(`${API_BASE}/api/files/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd,
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Upload failed');
      setItems((prev) => [...prev, {
        title: d.data.title, url: d.data.url, type: d.data.type || 'document', description: '',
      }]);
      flash('Uploaded — remember to Save');
    } catch (e2) { setErr(e2.message); }
    finally { setUp(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  // ── browse existing ─────────────────────────────────────────────────────
  const openBrowse = async () => {
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/files/browse?courseCode=${encodeURIComponent(courseCode)}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Browse failed');
      setBrowse(d.data || []);
    } catch (e) { setErr(e.message); }
  };
  const addFromBrowse = (f) => {
    setItems((prev) => [...prev, { title: f.title, url: f.url, type: f.type || 'document', description: '' }]);
    setBrowse(null); flash('Added — remember to Save');
  };

  // ── external link ─────────────────────────────────────────────────────────
  const addLink = () => {
    if (!link.title || !link.url) { setErr('Link needs a title and URL'); return; }
    setItems((prev) => [...prev, { title: link.title, url: link.url, type: 'website', description: link.description }]);
    setLink({ title: '', url: '', description: '' }); flash('Added — remember to Save');
  };

  // ── edit / remove / reorder ────────────────────────────────────────────────
  const update = (i, field, val) => setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)));
  const remove = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const move = (i, dir) => setItems((p) => {
    const n = [...p]; const j = i + dir;
    if (j < 0 || j >= n.length) return p;
    [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  // ── save ───────────────────────────────────────────────────────────────────
  const save = async () => {
    setSaving(true); setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/files/resources/${courseId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ resources: items }),
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Save failed');
      setItems(d.data.resources || items);
      flash('Saved to course');
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  // ── render ───────────────────────────────────────────────────────────────
  if (!courseId) return <Note>Save the course first, then supplements can be attached.</Note>;
  if (loading)   return <Note>Loading supplements…</Note>;

  const btn = (bg, color) => ({ background: bg, color, border: 'none', borderRadius: 7, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' });

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, color: C.navy, fontSize: 17, fontWeight: 700 }}>Supplements</h3>
          <p style={{ margin: '2px 0 0', color: C.textMuted, fontSize: 12 }}>
            Files & links shown in the course Resources drawer · folder <code>course-resources/{courseCode || '…'}</code>
          </p>
        </div>
        <button onClick={save} disabled={saving} style={{ ...btn(C.burgundy, '#fff'), opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : '💾 Save'}
        </button>
      </div>

      {err && <p style={{ color: C.danger, fontSize: 13, margin: '0 0 10px' }}>⚠ {err}</p>}
      {msg && <p style={{ color: C.green, fontSize: 13, margin: '0 0 10px' }}>✓ {msg}</p>}

      {/* upload zone */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input type="file" ref={fileRef} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv" onChange={onFile} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...btn(C.green, '#fff'), flex: 1, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '⏳ Uploading…' : '⬆ Upload a file (PDF, DOCX, PPTX, XLSX…)'}
        </button>
        <button onClick={openBrowse} style={btn('transparent', C.navy)} >📁 Browse uploaded</button>
      </div>

      {/* browse panel */}
      {browse && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: C.navy }}>Already uploaded for {courseCode} ({browse.length})</strong>
            <button onClick={() => setBrowse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
          {browse.length === 0 ? <p style={{ color: C.textLight, fontSize: 13, margin: 0 }}>No files yet.</p> :
            browse.map((f) => (
              <div key={f.publicId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: `1px solid ${C.borderLight}` }}>
                <span>{TYPE_ICON[f.type] || '📎'}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{f.title} <em style={{ color: C.textLight }}>({f.fileType})</em></span>
                <button onClick={() => addFromBrowse(f)} style={btn(C.gold, C.navy)}>Add</button>
              </div>
            ))}
        </div>
      )}

      {/* current resources */}
      {items.length === 0 ? (
        <Note>No supplements yet. Upload a file or add a link above.</Note>
      ) : items.map((it, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{TYPE_ICON[it.type] || '📎'}</span>
            <input value={it.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title"
              style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600 }} />
            <select value={TYPE_OPTIONS.includes(it.type) ? it.type : 'link'} onChange={(e) => update(i, 'type', e.target.value)}
              style={{ padding: '7px 8px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12 }}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => move(i, -1)} title="Up" style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', padding: '4px 8px' }}>↑</button>
            <button onClick={() => move(i, 1)} title="Down" style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', padding: '4px 8px' }}>↓</button>
            <button onClick={() => remove(i)} title="Remove" style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', padding: '4px 8px', color: C.danger }}>✕</button>
          </div>
          <input value={it.description || ''} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Short description (optional)"
            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, boxSizing: 'border-box', marginBottom: 6 }} />
          <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.textLight, wordBreak: 'break-all' }}>{it.url}</a>
        </div>
      ))}

      {/* add external link */}
      <div style={{ background: C.bg, border: `1px dashed ${C.border}`, borderRadius: 10, padding: 12, marginTop: 6 }}>
        <strong style={{ fontSize: 12, color: C.navy }}>Add an external link (no file)</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input value={link.title} onChange={(e) => setLink({ ...link, title: e.target.value })} placeholder="Title"
            style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13 }} />
          <input value={link.url} onChange={(e) => setLink({ ...link, url: e.target.value })} placeholder="https://…"
            style={{ flex: 2, padding: '7px 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13 }} />
          <button onClick={addLink} style={btn(C.navy, '#fff')}>Add link</button>
        </div>
      </div>
    </div>
  );
}

function Note({ children }) {
  return <p style={{ color: C.textMuted, fontSize: 13, padding: '16px 0' }}>{children}</p>;
}
