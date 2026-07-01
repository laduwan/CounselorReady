/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ArrowLeft, Activity, Heart, StickyNote, Bell, Wrench,
  Check, X, Circle, Clock, Send, Trash2, RefreshCw,
  Globe, CreditCard, Mail, AlertTriangle, ChevronDown
} from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

const TABS = [
  { key: 'health', label: 'Health', icon: Heart },
  { key: 'audit', label: 'Audit Log', icon: Activity },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'notify', label: 'Notify', icon: Bell },
  { key: 'actions', label: 'Quick Actions', icon: Wrench },
];

const STATUS_COLORS = {
  green: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  yellow: { bg: '#fef9c3', text: '#a16207', dot: '#eab308' },
  red: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
  gray: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
};

export default function AdminPartnerSupport() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState('health');
  const [partnerName, setPartnerName] = useState('');

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-stone-500">Admin access required.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/partners" className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Partner Support {partnerName && <span className="text-stone-400 font-normal text-lg">— {partnerName}</span>}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">Health monitoring, audit trail, notes, and quick-fix tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? 'border-current text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
              style={tab === t.key ? { color: BURGUNDY } : undefined}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'health' && <HealthTab partnerId={id} onName={setPartnerName} />}
      {tab === 'audit' && <AuditTab partnerId={id} />}
      {tab === 'notes' && <NotesTab partnerId={id} />}
      {tab === 'notify' && <NotifyTab partnerId={id} />}
      {tab === 'actions' && <ActionsTab partnerId={id} />}
    </div>
  );
}

// ── Health Tab ──
function HealthTab({ partnerId, onName }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/partners/${partnerId}/health`)
      .then(({ data }) => {
        setHealth(data);
        if (data.partner?.name) onName(data.partner.name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [partnerId]);

  if (loading) return <Spinner />;
  if (!health) return <ErrorMsg msg="Failed to load health data" />;

  return (
    <div className="space-y-6">
      {/* Signal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {health.signals.map(s => {
          const c = STATUS_COLORS[s.status] || STATUS_COLORS.gray;
          return (
            <div key={s.key} className="rounded-xl border border-stone-200 p-4" style={{ background: c.bg }}>
              <div className="flex items-center gap-2 mb-2">
                <Circle className="w-3 h-3" style={{ fill: c.dot, color: c.dot }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.text }}>{s.label}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: c.text }}>{s.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={health.stats.totalUsers} color={BURGUNDY} />
        <StatCard label="Active (30d)" value={health.stats.activeUsers} color={HUNTER} />
        <StatCard label="Courses" value={health.stats.courses} color={BURGUNDY} />
        <StatCard label="Published" value={health.stats.publishedCourses} color={HUNTER} />
      </div>

      <p className="text-xs text-stone-400">
        Partner created {new Date(health.partner.createdAt).toLocaleDateString()} &middot; slug: /{health.partner.slug}
      </p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

// ── Audit Log Tab ──
function AuditTab({ partnerId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/partners/${partnerId}/audit-log`)
      .then(({ data }) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [partnerId]);

  if (loading) return <Spinner />;

  const actionLabels = {
    branding_updated: 'Branding updated',
    domain_updated: 'Domain changed',
    domain_verified: 'Domain verified',
    domain_reset: 'Domain verification reset',
    course_created: 'Course created',
    course_updated: 'Course updated',
    course_deleted: 'Course deleted',
    courses_bulk_uploaded: 'Courses bulk uploaded',
    user_invited: 'User invited',
    user_removed: 'User removed',
    admin_set: 'Partner admin set',
    billing_plan_changed: 'Billing plan changed',
    billing_status_changed: 'Billing status changed',
    email_template_updated: 'Email template updated',
    partner_activated: 'Partner activated',
    partner_deactivated: 'Partner deactivated',
    welcome_email_resent: 'Welcome email resent',
    admin_note_added: 'Admin note added',
    notification_sent: 'Notification sent',
    partner_created: 'Partner created',
    partner_updated: 'Partner updated',
  };

  return (
    <div className="space-y-2">
      {logs.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No audit log entries yet</p>
          <p className="text-xs mt-1">Actions will be recorded as changes are made</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {logs.map(log => (
            <div key={log._id} className="flex items-start gap-3 p-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: BURGUNDY, opacity: 0.5 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-900">
                  <span className="font-medium">{actionLabels[log.action] || log.action}</span>
                  {log.details && <span className="text-stone-500"> — {log.details}</span>}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {log.performedBy
                    ? `${log.performedBy.profile?.firstName || ''} ${log.performedBy.profile?.lastName || ''} (${log.performedBy.email})`.trim()
                    : 'System'}
                  {' '}&middot;{' '}
                  {new Date(log.createdAt).toLocaleString()}
                  {log.performedByRole && <span className="ml-1 text-stone-300">({log.performedByRole})</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Notes Tab ──
function NotesTab({ partnerId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/partners/${partnerId}/notes`)
      .then(({ data }) => setNotes(data.notes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [partnerId]);

  async function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post(`/partners/${partnerId}/notes`, { text });
      setNotes(data.notes || []);
      setText('');
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function deleteNote(noteId) {
    try {
      await api.delete(`/partners/${partnerId}/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n._id !== noteId));
    } catch { /* silent */ }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={addNote} className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add an internal note (e.g. 'Called 3/15, DNS issue with GoDaddy')..."
          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': BURGUNDY }}
        />
        <button
          type="submit"
          disabled={saving || !text.trim()}
          className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: BURGUNDY }}
        >
          {saving ? '...' : 'Add Note'}
        </button>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No internal notes yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...notes].reverse().map(note => (
            <div key={note._id} className="bg-white rounded-xl border border-stone-200 p-4 flex gap-3">
              <div className="flex-1">
                <p className="text-sm text-stone-900 whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-stone-400 mt-2">
                  {note.createdBy
                    ? `${note.createdBy.profile?.firstName || ''} ${note.createdBy.profile?.lastName || ''} (${note.createdBy.email})`.trim()
                    : 'Admin'}
                  {' '}&middot;{' '}
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => deleteNote(note._id)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-stone-300 hover:text-red-400 flex-shrink-0 self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Notify Tab ──
function NotifyTab({ partnerId }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const { data } = await api.post(`/partners/${partnerId}/notify`, { title, message });
      setResult({ success: true, msg: data.message });
      setTitle('');
      setMessage('');
    } catch (err) {
      setResult({ success: false, msg: err.response?.data?.error || 'Failed to send' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-stone-500">
        Send an in-app notification to all users under this partner. They will see it in their notification bell.
      </p>

      <form onSubmit={handleSend} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Platform Maintenance Notice"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. We'll be performing scheduled maintenance on March 20th from 2-4 AM EST."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
          />
        </div>

        {result && (
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {result.success ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {result.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !title.trim() || !message.trim()}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: BURGUNDY }}
        >
          <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
}

// ── Quick Actions Tab ──
function ActionsTab({ partnerId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState('');
  const [billingStatus, setBillingStatus] = useState('active');
  const [showBillingDropdown, setShowBillingDropdown] = useState(false);

  async function doAction(endpoint, body, label) {
    setLoading(label);
    setResult(null);
    try {
      const { data } = await api.post(`/partners/${partnerId}/quick-fix/${endpoint}`, body);
      setResult({ success: true, msg: data.message });
    } catch (err) {
      setResult({ success: false, msg: err.response?.data?.error || `Failed: ${label}` });
    } finally {
      setLoading('');
    }
  }

  const actions = [
    {
      key: 'reset-domain',
      icon: Globe,
      label: 'Reset Domain Verification',
      desc: 'Clear verification status so the partner can re-verify their custom domain',
      color: '#4f46e5',
      onClick: () => doAction('reset-domain', {}, 'reset-domain'),
      confirm: 'Reset domain verification? The partner will need to re-verify their DNS.'
    },
    {
      key: 'resend-welcome',
      icon: Mail,
      label: 'Resend Welcome Email',
      desc: 'Re-send the welcome email to the partner admin',
      color: HUNTER,
      onClick: () => doAction('resend-welcome', {}, 'resend-welcome'),
    },
  ];

  return (
    <div className="space-y-4">
      {result && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
          result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {result.success ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {result.msg}
          <button onClick={() => setResult(null)} className="ml-auto text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.key} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: a.color + '15' }}>
                <Icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">{a.label}</p>
                <p className="text-xs text-stone-500 mt-0.5">{a.desc}</p>
              </div>
              <button
                onClick={() => {
                  if (a.confirm && !window.confirm(a.confirm)) return;
                  a.onClick();
                }}
                disabled={loading === a.key}
                className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: a.color }}
              >
                {loading === a.key ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run'}
              </button>
            </div>
          );
        })}

        {/* Billing status action — has dropdown */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: BURGUNDY + '15' }}>
            <CreditCard className="w-5 h-5" style={{ color: BURGUNDY }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-900">Update Billing Status</p>
            <p className="text-xs text-stone-500 mt-0.5">Manually change this partner's billing status</p>
          </div>
          <select
            value={billingStatus}
            onChange={e => setBillingStatus(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2"
          >
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => doAction('billing-status', { status: billingStatus }, 'billing')}
            disabled={loading === 'billing'}
            className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: BURGUNDY }}
          >
            {loading === 'billing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared components ──
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div className="text-center py-12 text-stone-400">
      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
      <p>{msg}</p>
    </div>
  );
}
