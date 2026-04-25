/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  FileText, Upload, Plus, Trash2, Download, Edit3, X, Users, ClipboardList,
  Shield, Clock, AlertTriangle, CheckCircle, Star, ChevronDown, Lock, Key,
  Heart, Building2, Scale, Briefcase, Eye, EyeOff, Save
} from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';
const GOLD = '#D4A855';

const CATEGORY_OPTIONS = [
  { value: 'license', label: 'License' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'will', label: 'Will' },
  { value: 'practice-agreement', label: 'Practice Agreement' },
  { value: 'business-entity', label: 'Business Entity' },
  { value: 'tax-document', label: 'Tax Document' },
  { value: 'malpractice', label: 'Malpractice' },
  { value: 'emergency-plan', label: 'Emergency Plan' },
  { value: 'client-records-plan', label: 'Client Records Plan' },
  { value: 'power-of-attorney', label: 'Power of Attorney' },
  { value: 'lease-agreement', label: 'Lease Agreement' },
  { value: 'ehr-credentials', label: 'EHR Credentials' },
  { value: 'other', label: 'Other' },
];

const ROLE_OPTIONS = [
  { value: 'clinical-executor', label: 'Clinical Executor' },
  { value: 'business-executor', label: 'Business Executor' },
  { value: 'emergency-contact', label: 'Emergency Contact' },
  { value: 'attorney', label: 'Attorney' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'ehr-administrator', label: 'EHR Administrator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' },
];

const ACCESS_LEVELS = [
  { value: 'full', label: 'Full Access', desc: 'Can access all vault documents' },
  { value: 'limited', label: 'Limited Access', desc: 'Only specific documents' },
  { value: 'notify-only', label: 'Notify Only', desc: 'Receives alerts only' },
];

const PRACTICE_TYPES = [
  { value: 'solo', label: 'Solo Practice' },
  { value: 'group', label: 'Group Practice' },
  { value: 'agency', label: 'Agency' },
  { value: 'other', label: 'Other' },
];

const CHECKIN_INTERVALS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
];

function formatBytes(bytes) {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function categoryLabel(val) {
  return CATEGORY_OPTIONS.find(c => c.value === val)?.label || val;
}

function roleLabel(val) {
  return ROLE_OPTIONS.find(r => r.value === val)?.label || val;
}

// ════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════

export default function LegacyVault() {
  const [tab, setTab] = useState('documents');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get('/legacy-vault/summary');
      setSummary(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, [fetchSummary]);

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'plan', label: 'Succession Plan', icon: ClipboardList },
    { id: 'checkin', label: 'Check-In & Recovery', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: BURGUNDY }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BURGUNDY }}>
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold" style={{ color: BURGUNDY }}>Legacy Vault</h1>
            <p className="text-stone-500 text-sm">Secure document storage & practice succession planning</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Documents" value={summary.documents} icon={FileText} color="#4A7C59" />
          <StatCard label="Contacts" value={summary.contacts} icon={Users} color={BURGUNDY} />
          <StatCard label="Expiring Soon" value={summary.expiringDocuments} icon={AlertTriangle} color={summary.expiringDocuments > 0 ? '#D97706' : '#4A7C59'} />
          <StatCard label="Plan Status" value={summary.planStatus === 'complete' ? 'Complete' : summary.planStatus === 'in-progress' ? 'In Progress' : 'Not Started'} icon={ClipboardList} color={summary.planStatus === 'complete' ? '#4A7C59' : BURGUNDY} />
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-stone-200 pb-px">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg"
              style={{
                color: active ? BURGUNDY : '#78716c',
                background: active ? '#fdf5f6' : 'transparent',
                borderBottom: active ? `2px solid ${BURGUNDY}` : '2px solid transparent'
              }}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === 'documents' && <DocumentsTab onUpdate={fetchSummary} />}
      {tab === 'contacts' && <ContactsTab onUpdate={fetchSummary} />}
      {tab === 'plan' && <PlanTab />}
      {tab === 'checkin' && <CheckInTab />}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-stone-500 text-xs">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <p className="font-display text-2xl font-semibold" style={{ color: BURGUNDY }}>{value}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  DOCUMENTS TAB
// ════════════════════════════════════════════════════════

function DocumentsTab({ onUpdate }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocs = useCallback(async () => {
    try {
      const params = filter ? `?category=${filter}` : '';
      const { data } = await api.get(`/legacy-vault/documents${params}`);
      setDocuments(data.documents || []);
    } catch (e) {
      console.error('Fetch documents error:', e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    try {
      await api.delete(`/legacy-vault/documents/${id}`);
      setDocuments(prev => prev.filter(d => d._id !== id));
      onUpdate();
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  const handleDownload = async (id) => {
    try {
      const { data } = await api.get(`/legacy-vault/documents/${id}/serve`);
      window.open(data.url, '_blank');
    } catch (e) {
      alert('Failed to download: ' + e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: BURGUNDY }}
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 font-medium">No documents yet</p>
          <p className="text-stone-400 text-sm mt-1">Add your first document to the vault</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map(doc => (
            <div key={doc._id} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-900 truncate">{doc.title}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1" style={{ background: '#fdf5f6', color: BURGUNDY }}>
                    {categoryLabel(doc.category)}
                  </span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {doc.fileKey && (
                    <button onClick={() => handleDownload(doc._id)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Download">
                      <Download className="w-4 h-4 text-stone-500" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(doc._id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              {doc.description && <p className="text-stone-500 text-sm mb-2 line-clamp-2">{doc.description}</p>}
              <div className="flex items-center gap-3 text-xs text-stone-400">
                {doc.fileName && <span>{formatBytes(doc.fileSize)}</span>}
                {doc.expirationDate && (
                  <span className={`flex items-center gap-1 ${doc.isExpired ? 'text-red-500' : doc.isExpiringSoon ? 'text-amber-600' : 'text-stone-400'}`}>
                    <Clock className="w-3 h-3" />
                    {doc.isExpired ? 'Expired' : doc.isExpiringSoon ? `Expires in ${doc.daysUntilExpiration}d` : `Exp ${new Date(doc.expirationDate).toLocaleDateString()}`}
                  </span>
                )}
                {doc.isConfidential && (
                  <span className="flex items-center gap-1 text-amber-600"><EyeOff className="w-3 h-3" /> Confidential</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); fetchDocs(); onUpdate(); }}
        />
      )}
    </div>
  );
}

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', category: 'other', description: '', expirationDate: '', notes: '', isConfidential: false });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('description', form.description);
      if (form.expirationDate) fd.append('expirationDate', form.expirationDate);
      fd.append('notes', form.notes);
      fd.append('isConfidential', form.isConfidential);
      fd.append('tags', JSON.stringify([]));
      if (file) fd.append('file', file);

      await api.post('/legacy-vault/documents', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch (e) {
      alert('Failed to upload: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="text-lg font-semibold" style={{ color: BURGUNDY }}>Add Document</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="e.g., Georgia LPC License" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
              {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Expiration Date</label>
            <input type="date" value={form.expirationDate} onChange={e => setForm({ ...form, expirationDate: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">File (PDF, JPG, PNG, WebP — max 10MB)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={2} />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.isConfidential} onChange={e => setForm({ ...form, isConfidential: e.target.checked })}
              className="rounded border-stone-300" />
            Mark as confidential
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: BURGUNDY }}>
              {saving ? 'Uploading...' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  CONTACTS TAB
// ════════════════════════════════════════════════════════

function ContactsTab({ onUpdate }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await api.get('/legacy-vault/contacts');
      setContacts(data.contacts || []);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleDelete = async (id) => {
    if (!confirm('Remove this contact?')) return;
    try {
      await api.delete(`/legacy-vault/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
      onUpdate();
    } catch (e) {
      alert('Failed to remove: ' + e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">People who should be contacted or take over your practice responsibilities</p>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: BURGUNDY }}
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 font-medium">No succession contacts</p>
          <p className="text-stone-400 text-sm mt-1">Add people who should be notified or take action</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contacts.map(c => (
            <div key={c._id} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {c.isPrimary && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  <h3 className="font-medium text-stone-900">{c.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(c); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-stone-100">
                    <Edit3 className="w-4 h-4 text-stone-500" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#fdf5f6', color: BURGUNDY }}>
                  {roleLabel(c.role)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.accessLevel === 'full' ? 'bg-green-50 text-green-700' :
                  c.accessLevel === 'limited' ? 'bg-amber-50 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {c.accessLevel === 'full' ? 'Full Access' : c.accessLevel === 'limited' ? 'Limited' : 'Notify Only'}
                </span>
              </div>
              <div className="text-xs text-stone-400 space-y-0.5">
                {c.email && <p>{c.email}</p>}
                {c.phone && <p>{c.phone}</p>}
                {c.organization && <p>{c.organization}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ContactModal
          contact={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSuccess={() => { setShowForm(false); setEditing(null); fetchContacts(); onUpdate(); }}
        />
      )}
    </div>
  );
}

function ContactModal({ contact, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: contact?.name || '',
    role: contact?.role || 'colleague',
    email: contact?.email || '',
    phone: contact?.phone || '',
    organization: contact?.organization || '',
    licenseNumber: contact?.licenseNumber || '',
    relationship: contact?.relationship || '',
    accessLevel: contact?.accessLevel || 'notify-only',
    responsibilities: contact?.responsibilities || '',
    isPrimary: contact?.isPrimary || false,
    notes: contact?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Name is required');
    setSaving(true);
    try {
      if (contact) {
        await api.put(`/legacy-vault/contacts/${contact._id}`, form);
      } else {
        await api.post('/legacy-vault/contacts', form);
      }
      onSuccess();
    } catch (e) {
      alert('Failed to save: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="text-lg font-semibold" style={{ color: BURGUNDY }}>{contact ? 'Edit Contact' : 'Add Contact'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Access Level</label>
              <select value={form.accessLevel} onChange={e => set('accessLevel', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                {ACCESS_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Organization</label>
              <input type="text" value={form.organization} onChange={e => set('organization', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">License #</label>
              <input type="text" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Responsibilities</label>
            <textarea value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={2}
              placeholder="What this person should do if needed..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={2} />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.isPrimary} onChange={e => set('isPrimary', e.target.checked)}
              className="rounded border-stone-300" />
            Primary contact
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: BURGUNDY }}>
              {saving ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  PLAN TAB
// ════════════════════════════════════════════════════════

function PlanTab() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api.get('/legacy-vault/plan')
      .then(({ data }) => setPlan(data.plan))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => {
    setPlan(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/legacy-vault/plan', plan);
      setPlan(data.plan);
      setDirty(false);
    } catch (e) {
      alert('Failed to save: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-stone-400">Loading...</div>;

  const statusColors = {
    'not-started': { bg: '#EDEDD0', text: '#78716c' },
    'in-progress': { bg: '#fef3c7', text: '#92400e' },
    'complete': { bg: '#d1fae5', text: '#065f46' },
  };
  const sc = statusColors[plan?.status] || statusColors['not-started'];

  return (
    <div className="space-y-6">
      {/* Status & Save */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: sc.bg, color: sc.text }}>
            {plan?.status === 'complete' ? 'Complete' : plan?.status === 'in-progress' ? 'In Progress' : 'Not Started'}
          </span>
          {plan?.lastReviewedAt && (
            <span className="text-xs text-stone-400">Last reviewed {new Date(plan.lastReviewedAt).toLocaleDateString()}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select value={plan?.status || 'not-started'} onChange={e => update('status', e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          <button onClick={save} disabled={saving || !dirty}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: dirty ? BURGUNDY : '#a8a29e' }}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </div>

      {/* Practice Details */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" style={{ color: BURGUNDY }} /> Practice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Practice Name</label>
            <input type="text" value={plan?.practiceName || ''} onChange={e => update('practiceName', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Practice Type</label>
            <select value={plan?.practiceType || 'solo'} onChange={e => update('practiceType', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
              {PRACTICE_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Estimated Active Clients</label>
            <input type="number" value={plan?.estimatedActiveClients || ''} onChange={e => update('estimatedActiveClients', parseInt(e.target.value) || '')}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">EHR System</label>
            <input type="text" value={plan?.ehrSystem || ''} onChange={e => update('ehrSystem', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" placeholder="e.g., SimplePractice, TherapyNotes" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" style={{ color: BURGUNDY }} /> Continuity Instructions
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Client Notification Plan</label>
            <textarea value={plan?.clientNotificationPlan || ''} onChange={e => update('clientNotificationPlan', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={3}
              placeholder="How should clients be notified? Who should contact them?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Records Transfer Plan</label>
            <textarea value={plan?.recordsTransferPlan || ''} onChange={e => update('recordsTransferPlan', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={3}
              placeholder="How should client records be transferred? Where are they stored?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Financial Instructions</label>
            <textarea value={plan?.financialInstructions || ''} onChange={e => update('financialInstructions', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={3}
              placeholder="Outstanding invoices, insurance billing, bank accounts..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Additional Instructions</label>
            <textarea value={plan?.additionalInstructions || ''} onChange={e => update('additionalInstructions', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" rows={3}
              placeholder="Any other important information..." />
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  CHECK-IN & RECOVERY TAB
// ════════════════════════════════════════════════════════

function CheckInTab() {
  const [checkin, setCheckin] = useState(null);
  const [recovery, setRecovery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/legacy-vault/checkin/status').catch(() => ({ data: null })),
      api.get('/legacy-vault/recovery/token').catch(() => ({ data: null }))
    ]).then(([ci, rt]) => {
      setCheckin(ci.data);
      setRecovery(rt.data);
    }).finally(() => setLoading(false));
  }, []);

  const doCheckIn = async () => {
    setChecking(true);
    try {
      const { data } = await api.post('/legacy-vault/checkin', {
        isActive: checkin?.isActive ?? true
      });
      setCheckin(prev => ({
        ...prev,
        lastCheckIn: data.lastCheckIn,
        nextCheckInDue: data.nextCheckInDue,
        isActive: data.isActive,
        missedCheckIns: 0,
        isOverdue: false
      }));
    } catch (e) {
      alert('Check-in failed: ' + e.message);
    } finally {
      setChecking(false);
    }
  };

  const toggleActive = async (active) => {
    try {
      const { data } = await api.post('/legacy-vault/checkin', {
        isActive: active,
        checkInIntervalDays: checkin?.checkInIntervalDays || 30
      });
      setCheckin(prev => ({ ...prev, isActive: data.isActive, lastCheckIn: data.lastCheckIn, nextCheckInDue: data.nextCheckInDue }));
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  };

  const updateInterval = async (days) => {
    try {
      const { data } = await api.post('/legacy-vault/checkin', {
        isActive: checkin?.isActive,
        checkInIntervalDays: days
      });
      setCheckin(prev => ({ ...prev, checkInIntervalDays: days, lastCheckIn: data.lastCheckIn, nextCheckInDue: data.nextCheckInDue }));
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  };

  const generateRecoveryToken = async () => {
    // Generate a simple recovery token (in a real zero-knowledge system,
    // this would be encrypted client-side with a passphrase)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    const hashArray = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)));
    const hash = Array.from(hashArray, b => b.toString(16).padStart(2, '0')).join('');

    try {
      await api.post('/legacy-vault/recovery/create', {
        encryptedToken: token,
        tokenHash: hash
      });

      // Download as file
      const blob = new Blob([
        `Legacy Vault Recovery Token\n`,
        `Generated: ${new Date().toISOString()}\n`,
        `─────────────────────────────\n\n`,
        `Recovery Token:\n${token}\n\n`,
        `IMPORTANT: Store this file in a safe place.\n`,
        `You will need this token to recover your vault access.\n`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `legacy-vault-recovery-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setRecovery({ hasToken: true, createdAt: new Date().toISOString() });
    } catch (e) {
      alert('Failed to create recovery token: ' + e.message);
    }
  };

  if (loading) return <div className="text-center py-12 text-stone-400">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Dead Man's Switch */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
          <Heart className="w-5 h-5" style={{ color: BURGUNDY }} /> Dead Man's Switch
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Periodic check-in to confirm you're active. If you miss check-ins, your succession contacts will be notified.
        </p>

        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-stone-50">
          <span className="text-sm font-medium text-stone-700">Enable Check-In</span>
          <button
            onClick={() => toggleActive(!checkin?.isActive)}
            className={`relative w-11 h-6 rounded-full transition-colors ${checkin?.isActive ? '' : 'bg-stone-300'}`}
            style={checkin?.isActive ? { background: HUNTER } : {}}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checkin?.isActive ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`}
              style={{ transform: checkin?.isActive ? 'translateX(22px)' : 'translateX(0)' }} />
          </button>
        </div>

        {checkin?.isActive && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">Check-In Interval</label>
              <select value={checkin?.checkInIntervalDays || 30} onChange={e => updateInterval(parseInt(e.target.value))}
                className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white">
                {CHECKIN_INTERVALS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-stone-50">
                <p className="text-xs text-stone-500">Last Check-In</p>
                <p className="text-sm font-medium text-stone-900">
                  {checkin?.lastCheckIn ? new Date(checkin.lastCheckIn).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${checkin?.isOverdue ? 'bg-red-50' : 'bg-stone-50'}`}>
                <p className="text-xs text-stone-500">Next Due</p>
                <p className={`text-sm font-medium ${checkin?.isOverdue ? 'text-red-600' : 'text-stone-900'}`}>
                  {checkin?.nextCheckInDue ? new Date(checkin.nextCheckInDue).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <p className="text-xs text-stone-500">Status</p>
                <p className={`text-sm font-medium ${checkin?.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                  {checkin?.isOverdue ? `Overdue (${Math.abs(checkin.daysUntilDue)}d)` : checkin?.daysUntilDue != null ? `${checkin.daysUntilDue}d remaining` : 'Active'}
                </p>
              </div>
            </div>

            <button onClick={doCheckIn} disabled={checking}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ background: HUNTER }}>
              <CheckCircle className="w-5 h-5" />
              {checking ? 'Checking in...' : 'Check In Now'}
            </button>
          </>
        )}
      </div>

      {/* Recovery Token */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
          <Key className="w-5 h-5" style={{ color: BURGUNDY }} /> Recovery Token
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Generate and download a recovery token to restore vault access. Store it in a safe place.
        </p>

        {recovery?.hasToken && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Recovery token active</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Created {new Date(recovery.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <button onClick={generateRecoveryToken}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: BURGUNDY }}>
          <Key className="w-4 h-4" />
          {recovery?.hasToken ? 'Regenerate Token' : 'Generate Recovery Token'}
        </button>
        {recovery?.hasToken && (
          <p className="text-xs text-stone-400 mt-2">Regenerating will invalidate your previous token.</p>
        )}
      </div>
    </div>
  );
}
