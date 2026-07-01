/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Shield, Plus, ChevronDown, ChevronUp, Trash2, Edit3, CheckCircle, Clock, XCircle, FileText, ExternalLink, ArrowLeft } from 'lucide-react';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-700', icon: Clock },
  gathering_docs: { label: 'Gathering Documents', color: 'bg-blue-100 text-blue-700', icon: FileText },
  submitted: { label: 'Submitted', color: 'bg-indigo-100 text-indigo-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  denied: { label: 'Denied', color: 'bg-red-100 text-red-700', icon: XCircle },
  recredentialing: { label: 'Recredentialing', color: 'bg-purple-100 text-purple-700', icon: Clock }
};

const DEFAULT_CHECKLIST = [
  { name: 'W-9 Form', required: true, uploaded: false },
  { name: 'State License Copy', required: true, uploaded: false },
  { name: 'Malpractice Insurance Certificate', required: true, uploaded: false },
  { name: 'NPI Verification', required: true, uploaded: false },
  { name: 'CAQH Profile Updated', required: true, uploaded: false },
  { name: 'Diploma / Transcripts', required: false, uploaded: false },
  { name: 'Board Certification', required: false, uploaded: false },
  { name: 'DEA Registration (if applicable)', required: false, uploaded: false }
];

export default function InsuranceTracker() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    insuranceCompany: '', panelType: 'in_network', applicationDate: '',
    applicationStatus: 'not_started', caqhId: '', contactName: '',
    contactPhone: '', contactEmail: '', portalUrl: '',
    nextFollowUpDate: '', notes: '', documentsChecklist: DEFAULT_CHECKLIST
  });

  useEffect(() => { loadCredentials(); }, []);

  const loadCredentials = async () => {
    try {
      const { data } = await api.get('/insurance-credentials');
      setCredentials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      insuranceCompany: '', panelType: 'in_network', applicationDate: '',
      applicationStatus: 'not_started', caqhId: '', contactName: '',
      contactPhone: '', contactEmail: '', portalUrl: '',
      nextFollowUpDate: '', notes: '', documentsChecklist: DEFAULT_CHECKLIST
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/insurance-credentials/${editingId}`, form);
        setMessage({ type: 'success', text: 'Updated successfully' });
      } else {
        await api.post('/insurance-credentials', form);
        setMessage({ type: 'success', text: 'Insurance panel added' });
      }
      resetForm();
      setShowForm(false);
      loadCredentials();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save' });
    }
  };

  const handleEdit = (cred) => {
    setForm({
      insuranceCompany: cred.insuranceCompany,
      panelType: cred.panelType,
      applicationDate: cred.applicationDate ? cred.applicationDate.split('T')[0] : '',
      applicationStatus: cred.applicationStatus,
      caqhId: cred.caqhId || '',
      contactName: cred.contactName || '',
      contactPhone: cred.contactPhone || '',
      contactEmail: cred.contactEmail || '',
      portalUrl: cred.portalUrl || '',
      nextFollowUpDate: cred.nextFollowUpDate ? cred.nextFollowUpDate.split('T')[0] : '',
      notes: cred.notes || '',
      documentsChecklist: cred.documentsChecklist?.length > 0 ? cred.documentsChecklist : DEFAULT_CHECKLIST
    });
    setEditingId(cred._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this insurance panel record?')) return;
    try {
      await api.delete(`/insurance-credentials/${id}`);
      loadCredentials();
      setMessage({ type: 'success', text: 'Deleted' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const toggleChecklist = async (credId, idx) => {
    try {
      await api.patch(`/insurance-credentials/${credId}/checklist/${idx}`);
      loadCredentials();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div></div>;

  // Stats
  const approved = credentials.filter(c => c.applicationStatus === 'approved').length;
  const pending = credentials.filter(c => ['submitted', 'under_review', 'gathering_docs'].includes(c.applicationStatus)).length;
  const needsFollowUp = credentials.filter(c => c.nextFollowUpDate && new Date(c.nextFollowUpDate) <= new Date()).length;

  return (
    <div>
      <Link to="/supervision" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Practice</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Panel Tracker</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">
          <Plus className="w-4 h-4" /> Add Panel
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved}</p>
          <p className="text-xs text-gray-500">Approved Panels</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className={`text-2xl font-bold ${needsFollowUp > 0 ? 'text-red-600' : 'text-gray-400'}`}>{needsFollowUp}</p>
          <p className="text-xs text-gray-500">Needs Follow-Up</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Insurance Panel</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company *</label>
              <input type="text" required value={form.insuranceCompany} onChange={e => setForm({...form, insuranceCompany: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., Aetna, Blue Cross" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Panel Type</label>
              <select value={form.panelType} onChange={e => setForm({...form, panelType: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="in_network">In-Network</option>
                <option value="out_of_network">Out-of-Network</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
              <input type="date" value={form.applicationDate} onChange={e => setForm({...form, applicationDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.applicationStatus} onChange={e => setForm({...form, applicationStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => <option key={val} value={val}>{cfg.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAQH ID</label>
              <input type="text" value={form.caqhId} onChange={e => setForm({...form, caqhId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-Up</label>
              <input type="date" value={form.nextFollowUpDate} onChange={e => setForm({...form, nextFollowUpDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input type="text" value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal URL</label>
              <input type="url" value={form.portalUrl} onChange={e => setForm({...form, portalUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input type="tel" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" rows="2" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">{editingId ? 'Update' : 'Add Panel'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Credentials List */}
      {credentials.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Shield className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Insurance Panels Tracked</h2>
          <p className="text-gray-500 mb-4">Track your insurance credentialing applications and panel status here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {credentials.map(cred => {
            const statusCfg = STATUS_CONFIG[cred.applicationStatus] || STATUS_CONFIG.not_started;
            const StatusIcon = statusCfg.icon;
            const isExpanded = expandedId === cred._id;
            const checkedCount = cred.documentsChecklist?.filter(d => d.uploaded).length || 0;
            const totalChecklist = cred.documentsChecklist?.length || 0;

            return (
              <div key={cred._id} className="bg-white rounded-xl border">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : cred._id)}>
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusCfg.color.split(' ')[1]}`} />
                    <div>
                      <p className="font-medium text-gray-900">{cred.insuranceCompany}</p>
                      <p className="text-xs text-gray-500">
                        {cred.panelType === 'in_network' ? 'In-Network' : cred.panelType === 'out_of_network' ? 'Out-of-Network' : 'Both'}
                        {cred.applicationDate && ` \u2022 Applied: ${new Date(cred.applicationDate).toLocaleDateString()}`}
                        {cred.daysSinceApplication && ` (${cred.daysSinceApplication} days ago)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(cred); }} className="p-1 hover:bg-gray-100 rounded"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(cred._id); }} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t pt-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {cred.providerNumber && <div><p className="text-xs text-gray-500">Provider Number</p><p className="text-sm font-medium">{cred.providerNumber}</p></div>}
                      {cred.caqhId && <div><p className="text-xs text-gray-500">CAQH ID</p><p className="text-sm font-medium">{cred.caqhId}</p></div>}
                      {cred.effectiveDate && <div><p className="text-xs text-gray-500">Effective Date</p><p className="text-sm font-medium">{new Date(cred.effectiveDate).toLocaleDateString()}</p></div>}
                      {cred.recredentialingDate && <div><p className="text-xs text-gray-500">Recredentialing Due</p><p className="text-sm font-medium">{new Date(cred.recredentialingDate).toLocaleDateString()}</p></div>}
                      {cred.contactName && <div><p className="text-xs text-gray-500">Contact</p><p className="text-sm font-medium">{cred.contactName} {cred.contactPhone && `\u2022 ${cred.contactPhone}`}</p></div>}
                      {cred.portalUrl && <div><p className="text-xs text-gray-500">Portal</p><a href={cred.portalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-burgundy-700 hover:underline flex items-center gap-1">Open Portal <ExternalLink className="w-3 h-3" /></a></div>}
                      {cred.nextFollowUpDate && <div><p className="text-xs text-gray-500">Next Follow-Up</p><p className={`text-sm font-medium ${new Date(cred.nextFollowUpDate) <= new Date() ? 'text-red-600' : ''}`}>{new Date(cred.nextFollowUpDate).toLocaleDateString()}</p></div>}
                    </div>

                    {/* Documents Checklist */}
                    {totalChecklist > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Documents Checklist ({checkedCount}/{totalChecklist})</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {cred.documentsChecklist.map((doc, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50">
                              <input type="checkbox" checked={doc.uploaded} onChange={() => toggleChecklist(cred._id, idx)} className="rounded text-burgundy-700" />
                              <span className={doc.uploaded ? 'line-through text-gray-400' : ''}>{doc.name}</span>
                              {doc.required && !doc.uploaded && <span className="text-red-500 text-xs">*</span>}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status History */}
                    {cred.statusHistory?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Status History</h3>
                        <div className="space-y-1">
                          {cred.statusHistory.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              <span>{new Date(h.date).toLocaleDateString()}</span>
                              <span className="font-medium text-gray-700">{STATUS_CONFIG[h.status]?.label || h.status}</span>
                              {h.notes && <span>— {h.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cred.notes && <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{cred.notes}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
