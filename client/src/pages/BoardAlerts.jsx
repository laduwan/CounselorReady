/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, AlertTriangle, Info, AlertCircle, Check, ExternalLink, Filter } from 'lucide-react';

const severityConfig = {
  urgent: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
  important: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' }
};

const categoryLabels = {
  ce_requirement_change: 'CE Requirement Change',
  renewal_process: 'Renewal Process',
  fee_change: 'Fee Change',
  scope_of_practice: 'Scope of Practice',
  new_regulation: 'New Regulation',
  deadline: 'Deadline',
  supervision: 'Supervision',
  other: 'Other'
};

export default function BoardAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, urgent
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const { data } = await api.get('/board-alerts');
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acknowledge = async (alertId) => {
    try {
      await api.post(`/board-alerts/${alertId}/acknowledge`);
      setAlerts(alerts.map(a => a._id === alertId ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moss-600"></div></div>;

  // Get unique states for filter
  const states = [...new Set(alerts.map(a => a.state))].sort();

  // Apply filters
  let filtered = alerts;
  if (filter === 'unread') filtered = filtered.filter(a => !a.acknowledged);
  if (filter === 'urgent') filtered = filtered.filter(a => a.severity === 'urgent');
  if (stateFilter !== 'all') filtered = filtered.filter(a => a.state === stateFilter);

  const unreadCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Board Alerts</h1>
          <p className="text-gray-500 text-sm">Licensing board changes relevant to your credentials</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex rounded-lg border overflow-hidden text-sm">
          {[['all', 'All'], ['unread', 'Unread'], ['urgent', 'Urgent']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-3 py-1.5 ${filter === val ? 'bg-moss-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
        {states.length > 1 && (
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm">
            <option value="all">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {alerts.length === 0 ? 'No Alerts Yet' : 'No Matching Alerts'}
          </h2>
          <p className="text-gray-500">
            {alerts.length === 0
              ? 'Board alerts for your state will appear here when licensing rules change.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const severity = severityConfig[alert.severity] || severityConfig.info;
            const SeverityIcon = severity.icon;

            return (
              <div key={alert._id} className={`rounded-xl border ${alert.acknowledged ? 'bg-white border-gray-200' : `${severity.bg} ${severity.border}`}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <SeverityIcon className={`w-5 h-5 mt-0.5 ${alert.acknowledged ? 'text-gray-400' : severity.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-medium ${alert.acknowledged ? 'text-gray-600' : 'text-gray-900'}`}>{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severity.badge}`}>{alert.severity}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{alert.state}</span>
                        {alert.credentialTypes?.length > 0 && (
                          <span className="text-xs text-gray-500">{alert.credentialTypes.join(', ')}</span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${alert.acknowledged ? 'text-gray-500' : 'text-gray-700'}`}>{alert.summary}</p>
                      {alert.details && (
                        <p className="text-sm text-gray-500 mb-2">{alert.details}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{categoryLabels[alert.category] || alert.category}</span>
                        {alert.effectiveDate && <span>Effective: {new Date(alert.effectiveDate).toLocaleDateString()}</span>}
                        <span>Posted: {new Date(alert.createdAt).toLocaleDateString()}</span>
                        {alert.sourceUrl && (
                          <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer"
                            className="text-moss-600 hover:underline flex items-center gap-1">
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <button onClick={() => acknowledge(alert._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-50 shrink-0">
                        <Check className="w-3 h-3" /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
