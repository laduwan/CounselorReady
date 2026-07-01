/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Users, ShieldCheck, AlertTriangle, XCircle, Plus, Trash2, Mail, ChevronDown, ChevronUp, Settings } from 'lucide-react';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [expandedMember, setExpandedMember] = useState(null);
  const [message, setMessage] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: '', type: 'group_practice', phone: '', website: '',
    address: { street: '', city: '', state: '', zip: '' }
  });

  useEffect(() => { loadOrgs(); }, []);

  const loadOrgs = async () => {
    try {
      const { data } = await api.get('/organizations/mine');
      setOrgs(data);
      if (data.length > 0) {
        setSelectedOrg(data[0]);
        loadDashboard(data[0]._id);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const loadDashboard = async (orgId) => {
    try {
      const { data } = await api.get(`/organizations/${orgId}/dashboard`);
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/organizations', createForm);
      setOrgs([...orgs, data]);
      setSelectedOrg(data);
      loadDashboard(data._id);
      setShowCreateForm(false);
      setMessage({ type: 'success', text: 'Organization created successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create organization' });
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizations/${selectedOrg._id}/invite`, { email: inviteEmail, role: inviteRole });
      setInviteEmail('');
      setShowInviteForm(false);
      loadDashboard(selectedOrg._id);
      loadOrgs();
      setMessage({ type: 'success', text: 'Invitation sent' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to invite' });
    }
  };

  const handleRemoveMember = async (seatId) => {
    if (!confirm('Remove this member from the organization?')) return;
    try {
      await api.delete(`/organizations/${selectedOrg._id}/members/${seatId}`);
      loadDashboard(selectedOrg._id);
      loadOrgs();
      setMessage({ type: 'success', text: 'Member removed' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to remove' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div></div>;

  const orgTypes = {
    group_practice: 'Group Practice', agency: 'Agency', clinic: 'Clinic',
    hospital: 'Hospital', university: 'University', other: 'Other'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">
          <Plus className="w-4 h-4" /> New Organization
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Organization</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
              <input type="text" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={createForm.type} onChange={e => setCreateForm({...createForm, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                {Object.entries(orgTypes).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={createForm.phone} onChange={e => setCreateForm({...createForm, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={createForm.website} onChange={e => setCreateForm({...createForm, website: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* Org Selector (if multiple) */}
      {orgs.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {orgs.map(org => (
            <button key={org._id} onClick={() => { setSelectedOrg(org); loadDashboard(org._id); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrg?._id === org._id ? 'bg-burgundy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Building2 className="w-4 h-4 inline mr-1" /> {org.name}
            </button>
          ))}
        </div>
      )}

      {orgs.length === 0 && !showCreateForm && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Organization Yet</h2>
          <p className="text-gray-500 mb-4">Create an organization to manage your team's CE compliance in one place.</p>
          <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">Create Organization</button>
        </div>
      )}

      {/* Dashboard */}
      {dashboard && selectedOrg && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard.stats.totalMembers}</p>
                  <p className="text-xs text-gray-500">Team Members</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><ShieldCheck className="w-5 h-5 text-green-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{dashboard.stats.compliant}</p>
                  <p className="text-xs text-gray-500">Compliant</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{dashboard.stats.atRisk}</p>
                  <p className="text-xs text-gray-500">At Risk</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg"><XCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{dashboard.stats.nonCompliant}</p>
                  <p className="text-xs text-gray-500">Non-Compliant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Summary Row */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-gray-500 mb-1">Total CE Hours Earned (Team)</p>
              <p className="text-3xl font-bold text-burgundy-700">{dashboard.stats.totalCEHoursEarned}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-gray-500 mb-1">Total Courses Completed (Team)</p>
              <p className="text-3xl font-bold text-burgundy-700">{dashboard.stats.totalCoursesCompleted}</p>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <button onClick={() => setShowInviteForm(!showInviteForm)} className="flex items-center gap-2 px-3 py-1.5 bg-burgundy-100 text-burgundy-800 rounded-lg hover:bg-burgundy-200 text-sm">
                <Mail className="w-4 h-4" /> Invite
              </button>
            </div>

            {showInviteForm && (
              <div className="p-4 border-b bg-gray-50">
                <form onSubmit={handleInvite} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="colleague@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">Send Invite</button>
                </form>
              </div>
            )}

            <div className="divide-y">
              {dashboard.members.map((member) => (
                <div key={member.userId} className="p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedMember(expandedMember === member.userId ? null : member.userId)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${member.complianceStatus === 'compliant' ? 'bg-green-500' : member.complianceStatus === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email} {member.state && `\u2022 ${member.state}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">{member.totalCEHours} CE hrs</p>
                        <p className="text-xs text-gray-500">{member.coursesCompleted} courses</p>
                      </div>
                      {expandedMember === member.userId ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  {expandedMember === member.userId && (
                    <div className="mt-3 pl-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Credentials</p>
                        <p className="font-semibold">{member.totalCredentials}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Expiring Soon</p>
                        <p className="font-semibold text-yellow-700">{member.expiringCredentials}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Expired</p>
                        <p className="font-semibold text-red-700">{member.expiredCredentials}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">In Progress</p>
                        <p className="font-semibold text-blue-700">{member.coursesInProgress}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {dashboard.members.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">No team members yet. Invite your first team member above.</div>
              )}
            </div>
          </div>

          {/* Seat Info */}
          <div className="mt-4 text-sm text-gray-500 text-right">
            {selectedOrg.seats.filter(s => s.status !== 'removed').length} / {selectedOrg.maxSeats} seats used
          </div>
        </>
      )}
    </div>
  );
}
