/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function GroupLicenseDashboard() {
  const [licenses, setLicenses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [error, setError] = useState('');

  const [newLicense, setNewLicense] = useState({
    organizationName: '', totalSeats: 10, plan: 'team', billingCycle: 'annual', contactEmail: ''
  });

  useEffect(() => { fetchLicenses(); }, []);

  async function fetchLicenses() {
    try {
      setLoading(true);
      const { data } = await api.get('/group-licenses/my');
      setLicenses(data);
      if (data.length > 0) {
        setSelected(data[0]);
        fetchCompliance(data[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompliance(id) {
    try {
      const { data } = await api.get(`/group-licenses/${id}/compliance`);
      setCompliance(data);
    } catch { /* ignore */ }
  }

  async function createLicense(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/group-licenses', newLicense);
      setLicenses(prev => [data, ...prev]);
      setSelected(data);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create license');
    }
  }

  async function inviteMembers(e) {
    e.preventDefault();
    if (!selected) return;
    try {
      const emails = inviteEmails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);
      const { data } = await api.post(`/group-licenses/${selected._id}/invite`, { emails });
      setInviteEmails('');
      setShowInviteForm(false);
      fetchLicenses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to invite members');
    }
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div></div>;

  return (
    <div className="max-w-6xl mx-auto" role="main" aria-label="Group Licensing">
      <Link to="/organization" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Team</Link>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Licensing</h1>
          <p className="text-gray-600 mt-1">Manage team CE subscriptions and compliance</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition">
          + New Group License
        </button>
      </div>

      {error && <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {licenses.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Group Licenses Yet</h3>
          <p className="text-gray-600 mb-4">Create a group license to manage CE subscriptions for your team, clinic, or organization.</p>
          <button onClick={() => setShowCreateForm(true)} className="px-6 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Get Started</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* License Selector */}
          <div className="space-y-3">
            {licenses.map(lic => (
              <button key={lic._id} onClick={() => { setSelected(lic); fetchCompliance(lic._id); }}
                className={`w-full text-left p-4 rounded-lg border transition ${selected?._id === lic._id ? 'border-burgundy-600 bg-burgundy-100' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="font-semibold text-gray-900">{lic.organizationName}</div>
                <div className="text-sm text-gray-600">{lic.usedSeats}/{lic.totalSeats} seats used</div>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${lic.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {lic.plan}
                </span>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selected.organizationName}</h2>
                  <button onClick={() => setShowInviteForm(true)} className="text-sm px-3 py-1 bg-burgundy-200 text-burgundy-800 rounded-lg hover:bg-burgundy-300">
                    + Invite Members
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-burgundy-700">{selected.usedSeats}</div>
                    <div className="text-xs text-gray-500">Active Seats</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-700">{selected.totalSeats}</div>
                    <div className="text-xs text-gray-500">Total Seats</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{selected.availableSeats}</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </div>

                {/* Members List */}
                <h3 className="font-semibold text-gray-900 mb-2">Members</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selected.seats?.filter(s => s.status !== 'revoked').map(seat => (
                    <div key={seat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {seat.userId?.profile?.firstName || seat.email}
                        </div>
                        <div className="text-xs text-gray-500">{seat.email}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${seat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {seat.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Report */}
              {compliance && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Compliance Overview</h3>
                  <div className="space-y-3">
                    {compliance.memberProgress?.map(member => (
                      <div key={member.userId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-900">{member.email}</span>
                          <span className={`text-xs font-medium ${member.overallCompliance === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                            {Math.round(member.overallCompliance)}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar">
                          <div className={`h-2 rounded-full transition-all ${member.overallCompliance === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                            style={{ width: `${member.overallCompliance}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create License Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Create group license">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">New Group License</h2>
            <form onSubmit={createLicense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization Name *</label>
                <input required className="w-full border rounded-lg px-3 py-2" value={newLicense.organizationName}
                  onChange={e => setNewLicense(l => ({ ...l, organizationName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Plan</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={newLicense.plan}
                    onChange={e => setNewLicense(l => ({ ...l, plan: e.target.value }))}>
                    <option value="team">Team ($15.99/seat)</option>
                    <option value="enterprise">Enterprise (Custom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Seats *</label>
                  <input required type="number" min="5" className="w-full border rounded-lg px-3 py-2" value={newLicense.totalSeats}
                    onChange={e => setNewLicense(l => ({ ...l, totalSeats: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" value={newLicense.contactEmail}
                  onChange={e => setNewLicense(l => ({ ...l, contactEmail: e.target.value }))} placeholder="Defaults to your email" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Create License</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Invite team members">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Invite Team Members</h2>
            <form onSubmit={inviteMembers} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Addresses (one per line or comma-separated)</label>
                <textarea className="w-full border rounded-lg px-3 py-2" rows={4} value={inviteEmails}
                  onChange={e => setInviteEmails(e.target.value)} placeholder="colleague@clinic.com&#10;another@practice.com" />
              </div>
              <div className="text-sm text-gray-500">{selected?.availableSeats} seats available</div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowInviteForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Send Invites</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
