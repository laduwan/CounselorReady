/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SupervisionTracker() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // 'log' | sessionId | null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newLog, setNewLog] = useState({
    supervisor: { name: '', credentials: '', licenseNumber: '', email: '', state: '' },
    licenseType: 'LPC',
    state: '',
    totalHoursRequired: 100,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: ''
  });

  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 1,
    type: 'individual',
    modality: 'in_person',
    topics: '',
    notes: ''
  });

  useEffect(() => { fetchLogs(); }, []);

  async function fetchLogs() {
    try {
      setLoading(true);
      const { data } = await api.get('/supervision');
      const list = data.logs || (Array.isArray(data) ? data : []);
      setLogs(list);
      if (list.length > 0 && !selectedLog) setSelectedLog(list[0]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load supervision logs');
    } finally {
      setLoading(false);
    }
  }

  async function createLog(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/supervision', newLog);
      setLogs(prev => [data, ...prev]);
      setSelectedLog(data);
      setShowCreateForm(false);
      setNewLog({
        supervisor: { name: '', credentials: '', licenseNumber: '', email: '', state: '' },
        licenseType: 'LPC', state: '', totalHoursRequired: 100,
        startDate: new Date().toISOString().split('T')[0], targetCompletionDate: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create log');
    }
  }

  async function addSession(e) {
    e.preventDefault();
    if (!selectedLog) return;
    try {
      const payload = { ...newSession, topics: newSession.topics.split(',').map(t => t.trim()).filter(Boolean) };
      const { data } = await api.post(`/supervision/${selectedLog._id}/sessions`, payload);
      setSelectedLog(data);
      setLogs(prev => prev.map(l => l._id === data._id ? data : l));
      setShowSessionForm(false);
      setNewSession({ date: new Date().toISOString().split('T')[0], hours: 1, type: 'individual', modality: 'in_person', topics: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add session');
    }
  }

  async function updateLog(e) {
    e.preventDefault();
    if (!selectedLog) return;
    try {
      const { data } = await api.put(`/supervision/${selectedLog._id}`, {
        supervisor: selectedLog.supervisor,
        licenseType: selectedLog.licenseType,
        state: selectedLog.state,
        totalHoursRequired: selectedLog.totalHoursRequired,
        status: selectedLog.status
      });
      setLogs(prev => prev.map(l => l._id === data._id ? data : l));
      setSelectedLog(data);
      setShowEditForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update log');
    }
  }

  async function deleteLog() {
    if (!selectedLog) return;
    try {
      await api.delete(`/supervision/${selectedLog._id}`);
      setLogs(prev => prev.filter(l => l._id !== selectedLog._id));
      setSelectedLog(logs.length > 1 ? logs.find(l => l._id !== selectedLog._id) : null);
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete log');
    }
  }

  async function deleteSession(sessionId) {
    if (!selectedLog) return;
    try {
      const { data } = await api.delete(`/supervision/${selectedLog._id}/sessions/${sessionId}`);
      setSelectedLog(data);
      setLogs(prev => prev.map(l => l._id === data._id ? data : l));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete session');
    }
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div></div>;

  return (
    <div className="max-w-6xl mx-auto" role="main" aria-label="Supervision Tracker">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervision Tracker</h1>
          <p className="text-gray-600 mt-1">Track supervision hours toward licensure</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition">
          + New Supervision Log
        </button>
      </div>

      {error && <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Your Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No supervision logs yet. Create one to get started.</p>
          ) : logs.map(log => (
            <button
              key={log._id}
              onClick={() => setSelectedLog(log)}
              aria-current={selectedLog?._id === log._id ? 'true' : undefined}
              className={`w-full text-left p-4 rounded-lg border transition ${selectedLog?._id === log._id ? 'border-burgundy-600 bg-burgundy-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="font-medium text-gray-900">{log.licenseType} — {log.state}</div>
              <div className="text-sm text-gray-600">Supervisor: {log.supervisor?.name}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{log.progressPercent || 0}% complete</span>
                  <span>{log.totalLoggedHours || 0}/{log.totalHoursRequired}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={log.progressPercent || 0} aria-valuemin="0" aria-valuemax="100">
                  <div className="bg-burgundy-600 h-2 rounded-full transition-all" style={{ width: `${log.progressPercent || 0}%` }}></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Log Detail */}
        <div className="lg:col-span-2">
          {selectedLog ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedLog.licenseType} Supervision — {selectedLog.state}</h2>
                  <p className="text-gray-600">Supervisor: {selectedLog.supervisor?.name} ({selectedLog.supervisor?.credentials})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedLog.status === 'completed' ? 'bg-green-100 text-green-700' : selectedLog.status === 'on_hold' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedLog.status?.replace('_', ' ')}
                  </span>
                  <button onClick={() => setShowEditForm(true)} className="text-xs px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition">Edit</button>
                  <button onClick={() => setConfirmDelete('log')} className="text-xs px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg transition">Delete</button>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-burgundy-700">{selectedLog.totalLoggedHours || 0}</div>
                  <div className="text-xs text-gray-500">Hours Logged</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{selectedLog.totalHoursRequired}</div>
                  <div className="text-xs text-gray-500">Required</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">{Math.max(0, selectedLog.totalHoursRequired - (selectedLog.totalLoggedHours || 0))}</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>

              {/* Sessions */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Sessions</h3>
                <button onClick={() => setShowSessionForm(true)} className="text-sm px-3 py-1 bg-burgundy-200 text-burgundy-800 rounded-lg hover:bg-burgundy-300">
                  + Add Session
                </button>
              </div>

              {selectedLog.sessions?.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[...selectedLog.sessions].reverse().map((s, i) => (
                    <div key={s._id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(s.date).toLocaleDateString()} — {s.hours}h {s.type.replace('_', ' ')}
                        </div>
                        {s.topics?.length > 0 && <div className="text-xs text-gray-500">{s.topics.join(', ')}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${s.modality === 'telehealth' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {s.modality?.replace('_', ' ')}
                        </span>
                        {s._id && (
                          <button
                            onClick={() => setConfirmDelete(s._id)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 transition-opacity"
                            aria-label="Delete session"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No sessions logged yet.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center text-gray-500">
              Select a supervision log or create a new one
            </div>
          )}
        </div>
      </div>

      {/* Create Log Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Create supervision log">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">New Supervision Log</h2>
            <form onSubmit={createLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supervisor Name *</label>
                <input required className="w-full border rounded-lg px-3 py-2" value={newLog.supervisor.name}
                  onChange={e => setNewLog(l => ({ ...l, supervisor: { ...l.supervisor, name: e.target.value } }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Credentials</label>
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="e.g., LPC-S, NCC" value={newLog.supervisor.credentials}
                    onChange={e => setNewLog(l => ({ ...l, supervisor: { ...l.supervisor, credentials: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={newLog.supervisor.licenseNumber}
                    onChange={e => setNewLog(l => ({ ...l, supervisor: { ...l.supervisor, licenseNumber: e.target.value } }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">License Type *</label>
                  <select required className="w-full border rounded-lg px-3 py-2" value={newLog.licenseType}
                    onChange={e => setNewLog(l => ({ ...l, licenseType: e.target.value }))}>
                    <option value="LPC">LPC</option><option value="LMHC">LMHC</option><option value="LCPC">LCPC</option>
                    <option value="LCSW">LCSW</option><option value="LMFT">LMFT</option><option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input required className="w-full border rounded-lg px-3 py-2" maxLength={2} placeholder="GA" value={newLog.state}
                    onChange={e => setNewLog(l => ({ ...l, state: e.target.value.toUpperCase() }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Hours Required *</label>
                  <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2" value={newLog.totalHoursRequired}
                    onChange={e => setNewLog(l => ({ ...l, totalHoursRequired: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" value={newLog.startDate}
                    onChange={e => setNewLog(l => ({ ...l, startDate: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Create Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSessionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Add supervision session">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Log Supervision Session</h2>
            <form onSubmit={addSession} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input required type="date" className="w-full border rounded-lg px-3 py-2" value={newSession.date}
                    onChange={e => setNewSession(s => ({ ...s, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours *</label>
                  <input required type="number" min="0.25" max="8" step="0.25" className="w-full border rounded-lg px-3 py-2" value={newSession.hours}
                    onChange={e => setNewSession(s => ({ ...s, hours: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select required className="w-full border rounded-lg px-3 py-2" value={newSession.type}
                    onChange={e => setNewSession(s => ({ ...s, type: e.target.value }))}>
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                    <option value="live_observation">Live Observation</option>
                    <option value="triadic">Triadic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Modality</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={newSession.modality}
                    onChange={e => setNewSession(s => ({ ...s, modality: e.target.value }))}>
                    <option value="in_person">In Person</option>
                    <option value="telehealth">Telehealth</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Topics (comma-separated)</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="Ethics, Diagnosis, Treatment planning" value={newSession.topics}
                  onChange={e => setNewSession(s => ({ ...s, topics: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={newSession.notes}
                  onChange={e => setNewSession(s => ({ ...s, notes: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowSessionForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Log Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Log Modal */}
      {showEditForm && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Edit supervision log">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Supervision Log</h2>
            <form onSubmit={updateLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supervisor Name *</label>
                <input required className="w-full border rounded-lg px-3 py-2" value={selectedLog.supervisor?.name || ''}
                  onChange={e => setSelectedLog(l => ({ ...l, supervisor: { ...l.supervisor, name: e.target.value } }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Credentials</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={selectedLog.supervisor?.credentials || ''}
                    onChange={e => setSelectedLog(l => ({ ...l, supervisor: { ...l.supervisor, credentials: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={selectedLog.supervisor?.licenseNumber || ''}
                    onChange={e => setSelectedLog(l => ({ ...l, supervisor: { ...l.supervisor, licenseNumber: e.target.value } }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">License Type</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={selectedLog.licenseType}
                    onChange={e => setSelectedLog(l => ({ ...l, licenseType: e.target.value }))}>
                    <option value="LPC">LPC</option><option value="LMHC">LMHC</option><option value="LCPC">LCPC</option>
                    <option value="LCSW">LCSW</option><option value="LMFT">LMFT</option><option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={selectedLog.status}
                    onChange={e => setSelectedLog(l => ({ ...l, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input className="w-full border rounded-lg px-3 py-2" maxLength={2} value={selectedLog.state}
                    onChange={e => setSelectedLog(l => ({ ...l, state: e.target.value.toUpperCase() }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Hours Required</label>
                  <input type="number" min="1" className="w-full border rounded-lg px-3 py-2" value={selectedLog.totalHoursRequired}
                    onChange={e => setSelectedLog(l => ({ ...l, totalHoursRequired: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditForm(false); fetchLogs(); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="alertdialog" aria-label="Confirm deletion">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h2>
            <p className="text-gray-600 text-sm mb-4">
              {confirmDelete === 'log'
                ? 'This will permanently delete this supervision log and all its sessions. This cannot be undone.'
                : 'This will permanently delete this session. This cannot be undone.'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                onClick={() => confirmDelete === 'log' ? deleteLog() : deleteSession(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
