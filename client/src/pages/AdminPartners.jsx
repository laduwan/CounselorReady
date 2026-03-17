/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useImpersonate } from '../context/ImpersonateContext';
import api from '../services/api';
import { Plus, Edit2, Trash2, Users, ExternalLink, Eye, EyeOff, Copy, Check, X, BookOpen, UserPlus, MonitorPlay, HeartPulse } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

export default function AdminPartners() {
  const { user } = useAuth();
  const { startImpersonating } = useImpersonate();
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', slug: '', active: true, defaultPlan: 'free',
    branding: { logoUrl: '', primaryColor: '#6B1D34', companyName: '', tagline: '', customDomain: '' },
    contact: { email: '', website: '', phone: '' }
  });

  const [viewingUsers, setViewingUsers] = useState(null); // partner id
  const [partnerUsers, setPartnerUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [viewingCourses, setViewingCourses] = useState(null);
  const [partnerCourses, setPartnerCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [showSetAdmin, setShowSetAdmin] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  useEffect(() => { fetchPartners(); }, []);

  async function fetchPartners() {
    try {
      const { data } = await api.get('/partners');
      setPartners(data.partners || []);
    } catch (err) {
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      name: '', slug: '', active: true, defaultPlan: 'free',
      branding: { logoUrl: '', primaryColor: '#6B1D34', companyName: '', tagline: '', customDomain: '' },
      contact: { email: '', website: '', phone: '' }
    });
    setEditing(null);
    setShowForm(false);
    setError('');
  }

  function startEdit(partner) {
    setForm({
      name: partner.name,
      slug: partner.slug,
      active: partner.active,
      defaultPlan: partner.defaultPlan || 'free',
      branding: { logoUrl: '', primaryColor: '#6B1D34', companyName: '', tagline: '', customDomain: '', ...partner.branding },
      contact: { email: '', website: '', phone: '', ...partner.contact }
    });
    setEditing(partner._id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.slug) {
      setError('Name and slug are required');
      return;
    }

    try {
      if (editing) {
        await api.put(`/partners/${editing}`, form);
      } else {
        await api.post('/partners', form);
      }
      resetForm();
      fetchPartners();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save partner');
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete partner "${name}"? This will unlink all associated users.`)) return;
    try {
      await api.delete(`/partners/${id}`);
      fetchPartners();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  }

  async function toggleActive(partner) {
    try {
      await api.put(`/partners/${partner._id}`, { active: !partner.active });
      fetchPartners();
    } catch { /* silent */ }
  }

  async function fetchPartnerUsers(partnerId) {
    setViewingUsers(partnerId);
    setUsersLoading(true);
    try {
      const { data } = await api.get(`/partners/${partnerId}/users`);
      setPartnerUsers(data.users || []);
    } catch { setPartnerUsers([]); }
    finally { setUsersLoading(false); }
  }

  function copyLink(slug) {
    const url = `${window.location.origin}/register?partner=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  async function fetchPartnerCourses(partnerId) {
    setViewingCourses(partnerId);
    setCoursesLoading(true);
    try {
      const { data } = await api.get(`/partners/${partnerId}/courses`);
      setPartnerCourses(data.courses || []);
    } catch { setPartnerCourses([]); }
    finally { setCoursesLoading(false); }
  }

  async function handleSetAdmin(partnerId) {
    if (!adminEmail) return;
    setAdminMsg('');
    try {
      const { data } = await api.post(`/partners/${partnerId}/set-admin`, { email: adminEmail });
      setAdminMsg(data.message);
      setAdminEmail('');
    } catch (err) {
      setAdminMsg(err.response?.data?.error || 'Failed to set admin');
    }
  }

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-stone-500">Admin access required.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Partner Management
          </h1>
          <p className="text-sm text-stone-500 mt-1">Create and manage whitelabel distribution partners</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/partner-analytics"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ color: HUNTER, borderColor: HUNTER }}
          >
            <Eye className="w-4 h-4" /> Analytics
          </a>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ background: BURGUNDY }}
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={resetForm} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <h2 className="text-lg font-bold" style={{ color: BURGUNDY }}>
                {editing ? 'Edit Partner' : 'New Partner'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Partner Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">URL Slug *</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="e.g. therapy-solutions"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Branding</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Display Name</label>
                    <input value={form.branding.companyName} onChange={e => setForm({ ...form, branding: { ...form.branding, companyName: e.target.value } })}
                      placeholder="Name shown in header"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Logo URL</label>
                    <input value={form.branding.logoUrl} onChange={e => setForm({ ...form, branding: { ...form.branding, logoUrl: e.target.value } })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Custom Domain</label>
                    <input value={form.branding.customDomain} onChange={e => setForm({ ...form, branding: { ...form.branding, customDomain: e.target.value.toLowerCase().replace(/\s/g, '') } })}
                      placeholder="ce.theirsite.com"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                    <p className="text-xs text-stone-400 mt-1">Partner points CNAME here for custom domain access</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Brand Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={form.branding.primaryColor}
                          onChange={e => setForm({ ...form, branding: { ...form.branding, primaryColor: e.target.value } })}
                          className="w-8 h-8 rounded border border-stone-300 cursor-pointer" />
                        <input value={form.branding.primaryColor} onChange={e => setForm({ ...form, branding: { ...form.branding, primaryColor: e.target.value } })}
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Tagline</label>
                      <input value={form.branding.tagline} onChange={e => setForm({ ...form, branding: { ...form.branding, tagline: e.target.value } })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
                    <input type="email" value={form.contact.email} onChange={e => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Website</label>
                    <input value={form.contact.website} onChange={e => setForm({ ...form, contact: { ...form.contact, website: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Default Plan</label>
                  <select value={form.defaultPlan} onChange={e => setForm({ ...form, defaultPlan: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300">
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-300" />
                    <span className="text-sm text-stone-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2 text-sm text-white rounded-lg font-medium transition-colors"
                  style={{ background: BURGUNDY }}>
                  {editing ? 'Save Changes' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Partner List */}
      {loading ? (
        <div className="text-center py-12 text-stone-400">Loading partners...</div>
      ) : partners.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-stone-500 mb-2">No partners yet</p>
          <p className="text-sm text-stone-400">Create your first whitelabel partner to start distributing.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {partners.map(p => (
            <div key={p._id} className="card flex items-center gap-4 p-4">
              {/* Logo preview */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ background: p.branding?.primaryColor || BURGUNDY }}>
                {p.branding?.logoUrl ? (
                  <img src={p.branding.logoUrl} alt="" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  p.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900 truncate">{p.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-500">
                  <span className="font-mono">/{p.slug}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.userCount || 0} users</span>
                  <span className="capitalize">{p.defaultPlan} plan</span>
                  {p.branding?.customDomain && <span className="font-mono text-stone-400">{p.branding.customDomain}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link to={`/admin/partner-support/${p._id}`}
                  title="Partner Support"
                  className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-rose-400">
                  <HeartPulse className="w-4 h-4" />
                </Link>
                <button onClick={() => { startImpersonating(p._id, p.name); navigate('/partner/onboarding'); }}
                  title="View as Partner"
                  className="p-2 rounded-lg hover:bg-indigo-50 transition-colors text-indigo-500">
                  <MonitorPlay className="w-4 h-4" />
                </button>
                <button onClick={() => fetchPartnerUsers(p._id)} title="View users"
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  <Users className="w-4 h-4" />
                </button>
                <button onClick={() => fetchPartnerCourses(p._id)} title="View courses"
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  <BookOpen className="w-4 h-4" />
                </button>
                <button onClick={() => { setShowSetAdmin(p._id); setAdminEmail(''); setAdminMsg(''); }} title="Set partner admin"
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  <UserPlus className="w-4 h-4" />
                </button>
                <button onClick={() => copyLink(p.slug)} title="Copy partner link"
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  {copiedSlug === p.slug ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => toggleActive(p)} title={p.active ? 'Deactivate' : 'Activate'}
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  {p.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(p)} title="Edit"
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p._id, p.name)} title="Delete"
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Courses Modal */}
      {viewingCourses && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewingCourses(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <h2 className="text-lg font-bold" style={{ color: BURGUNDY }}>
                  Partner Courses ({partnerCourses.length})
                </h2>
                <button onClick={() => setViewingCourses(null)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {coursesLoading ? (
                  <div className="text-center py-8 text-stone-400">Loading courses...</div>
                ) : partnerCourses.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">No courses yet</div>
                ) : (
                  <div className="space-y-2">
                    {partnerCourses.map(c => (
                      <div key={c._id} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50">
                        <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: BURGUNDY }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">{c.title}</p>
                          <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                            <span>{c.ceHours} CE hrs</span>
                            <span className={c.status === 'published' ? 'text-green-600' : 'text-amber-600'}>{c.status}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 text-xs text-stone-500">
                          <p>{c.enrollments || 0} enrolled</p>
                          <p>{c.completions || 0} completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Set Admin Modal */}
      {showSetAdmin && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowSetAdmin(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
              <h2 className="text-lg font-bold" style={{ color: BURGUNDY }}>Set Partner Admin</h2>
              <p className="text-sm text-stone-500">Enter the email of an existing user to promote them to partner admin.</p>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300"
                placeholder="user@example.com"
              />
              {adminMsg && (
                <p className={`text-sm ${adminMsg.includes('Failed') || adminMsg.includes('not found') ? 'text-red-600' : 'text-green-600'}`}>
                  {adminMsg}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSetAdmin(null)}
                  className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                  Close
                </button>
                <button onClick={() => handleSetAdmin(showSetAdmin)}
                  className="px-4 py-2 text-sm text-white rounded-lg font-medium transition-colors"
                  style={{ background: BURGUNDY }}>
                  Promote
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Modal */}
      {viewingUsers && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewingUsers(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-stone-100">
                <h2 className="text-lg font-bold" style={{ color: BURGUNDY }}>
                  Partner Users ({partnerUsers.length})
                </h2>
                <button onClick={() => setViewingUsers(null)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {usersLoading ? (
                  <div className="text-center py-8 text-stone-400">Loading users...</div>
                ) : partnerUsers.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">No users yet</div>
                ) : (
                  <div className="space-y-2">
                    {partnerUsers.map(u => (
                      <div key={u._id} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: BURGUNDY }}>
                          {(u.profile?.firstName || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">
                            {u.profile?.firstName} {u.profile?.lastName}
                          </p>
                          <p className="text-xs text-stone-500 truncate">{u.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium capitalize" style={{ color: BURGUNDY }}>
                            {u.subscription?.plan || 'free'}
                          </p>
                          <p className="text-xs text-stone-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
