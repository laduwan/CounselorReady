/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Mail, Search, X, Check, UserMinus, Send } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

export default function PartnerUserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Invite state
  const [showInvite, setShowInvite] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);

  // Remove state
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  async function loadUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (search) params.append('search', search);
      const { data } = await api.get(`/partners/my/users?${params}`);
      setUsers(data.users || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    }
    setLoading(false);
  }

  async function handleInvite() {
    const emails = emailInput.split(/[,\n]+/).map(e => e.trim()).filter(Boolean);
    if (emails.length === 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter(e => !emailRegex.test(e));
    if (invalid.length > 0) {
      setInviteResult({
        message: `Invalid email format: ${invalid.join(', ')}`,
        sent: [],
        errors: invalid.map(e => ({ email: e, error: 'Invalid email format' }))
      });
      return;
    }

    setInviteLoading(true);
    setInviteResult(null);
    try {
      const { data } = await api.post('/partners/my/users/invite', { emails });
      setInviteResult(data);
      if (data.sent?.length > 0) {
        setEmailInput('');
      }
    } catch (err) {
      setInviteResult({ message: err.response?.data?.error || 'Failed to send invitations', sent: [], errors: [] });
    }
    setInviteLoading(false);
  }

  async function handleRemove(userId) {
    if (!confirm('Remove this user from your organization? They will lose access to organization courses.')) return;
    setRemoving(userId);
    try {
      await api.delete(`/partners/my/users/${userId}`);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove user');
    }
    setRemoving(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            User Management
          </h1>
          <p className="text-sm text-stone-500 mt-1">{total} member{total !== 1 ? 's' : ''} in your organization</p>
        </div>
        <button
          onClick={() => { setShowInvite(!showInvite); setInviteResult(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ background: BURGUNDY }}
        >
          <Mail className="w-4 h-4" /> Invite Users
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Invite Panel */}
      {showInvite && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-3">Send Invitations</h2>
          <textarea
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            className="w-full border border-stone-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': BURGUNDY }}
            rows={3}
            placeholder="Enter email addresses, separated by commas or new lines"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-stone-400">Max 50 emails per batch</p>
            <button
              onClick={handleInvite}
              disabled={inviteLoading || !emailInput.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: HUNTER }}
            >
              <Send className="w-4 h-4" /> {inviteLoading ? 'Sending...' : 'Send Invitations'}
            </button>
          </div>

          {inviteResult && (
            <div className="mt-3 text-sm">
              <p className="font-medium text-stone-700 mb-2">{inviteResult.message}</p>
              {inviteResult.sent?.length > 0 && (
                <div className="space-y-1 mb-2">
                  {inviteResult.sent.map(e => (
                    <div key={e} className="flex items-center gap-2 text-green-700 bg-green-50 rounded p-1.5 text-xs">
                      <Check className="w-3 h-3" /> {e}
                    </div>
                  ))}
                </div>
              )}
              {inviteResult.errors?.length > 0 && (
                <div className="space-y-1">
                  {inviteResult.errors.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-red-700 bg-red-50 rounded p-1.5 text-xs">
                      <X className="w-3 h-3" /> {e.email}: {e.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': BURGUNDY }}
        />
      </div>

      {/* User Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: BURGUNDY }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <Users className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <p className="font-medium">No users found</p>
            <p className="text-xs mt-1">Invite team members to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500">User</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500">Plan</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500">Last Login</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-900">
                        {u.profile?.firstName} {u.profile?.lastName}
                      </p>
                      <p className="text-xs text-stone-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
                        {u.subscription?.plan || 'free'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.emailVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {u.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemove(u._id)}
                        disabled={removing === u._id}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove from organization"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-stone-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm text-stone-500">
            Page {page} of {Math.ceil(total / 50)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 50)}
            className="px-3 py-1.5 rounded-lg text-sm border border-stone-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
