/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Users, BookOpen, Award, Clock, TrendingUp, Download, ChevronDown, ChevronUp } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

function StatCard({ icon: Icon, label, value, sub, color = BURGUNDY }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPartnerAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('totalUsers');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    api.get('/partners/admin/analytics')
      .then(({ data }) => setData(data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function exportCSV() {
    if (!data?.partners) return;
    const headers = ['Partner', 'Slug', 'Plan', 'Status', 'Users', 'Active (30d)', 'Courses', 'Completions', 'CE Hours', 'Created'];
    const rows = data.partners.map(p => [
      p.companyName, p.slug, p.plan, p.active ? 'Active' : 'Inactive',
      p.totalUsers, p.activeUsers, p.courseCount, p.completions, p.ceHoursEarned,
      new Date(p.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partner-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-stone-500">Admin access required.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-stone-300 border-t-burgundy-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-sm underline" style={{ color: BURGUNDY }}>Retry</button>
      </div>
    );
  }

  const { partners, summary } = data;
  const sorted = [...partners].sort((a, b) => {
    const av = a[sortField] ?? 0;
    const bv = b[sortField] ?? 0;
    return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
  });

  const SortHeader = ({ field, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:text-stone-700"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortField === field && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <a href="/admin/partners" className="text-stone-400 hover:text-stone-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Partner Analytics
            </h1>
          </div>
          <p className="text-sm text-stone-500 ml-8">Performance overview across all distribution partners</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
          style={{ background: HUNTER }}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard icon={TrendingUp} label="Partners" value={summary.totalPartners} sub={`${summary.activePartners} active`} />
        <StatCard icon={Users} label="Total Users" value={summary.totalPartnerUsers.toLocaleString()} sub={`${summary.totalActiveUsers} active (30d)`} color={HUNTER} />
        <StatCard icon={BookOpen} label="Courses" value={summary.totalCourses} />
        <StatCard icon={Award} label="Completions" value={summary.totalCompletions.toLocaleString()} color={HUNTER} />
        <StatCard icon={Clock} label="CE Hours" value={summary.totalCEHours.toLocaleString()} />
        <StatCard icon={Users} label="Avg Users/Partner" value={summary.totalPartners > 0 ? Math.round(summary.totalPartnerUsers / summary.totalPartners) : 0} color={HUNTER} />
        <StatCard icon={Award} label="Avg Completions" value={summary.totalPartners > 0 ? Math.round(summary.totalCompletions / summary.totalPartners) : 0} />
      </div>

      {/* Partner Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200" style={{ background: BURGUNDY_LIGHT }}>
              <tr>
                <SortHeader field="companyName">Partner</SortHeader>
                <SortHeader field="plan">Plan</SortHeader>
                <SortHeader field="totalUsers">Users</SortHeader>
                <SortHeader field="activeUsers">Active (30d)</SortHeader>
                <SortHeader field="courseCount">Courses</SortHeader>
                <SortHeader field="completions">Completions</SortHeader>
                <SortHeader field="ceHoursEarned">CE Hours</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Engagement</th>
                <SortHeader field="createdAt">Joined</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-stone-400">No partners yet</td></tr>
              ) : sorted.map(p => {
                const engagementRate = p.totalUsers > 0 ? Math.round((p.activeUsers / p.totalUsers) * 100) : 0;
                return (
                  <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-stone-800">{p.companyName}</span>
                        <span className="block text-xs text-stone-400">/{p.slug}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                        p.plan === 'professional' ? 'bg-blue-100 text-blue-700' :
                        p.plan === 'growth' ? 'bg-green-100 text-green-700' :
                        p.plan === 'starter' ? 'bg-amber-100 text-amber-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {p.plan}
                      </span>
                      {!p.active && <span className="ml-1 text-xs text-red-400">(inactive)</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-700">{p.totalUsers}</td>
                    <td className="px-4 py-3 text-stone-600">{p.activeUsers}</td>
                    <td className="px-4 py-3 text-stone-600">{p.courseCount}</td>
                    <td className="px-4 py-3 text-stone-600">{p.completions}</td>
                    <td className="px-4 py-3 text-stone-600">{p.ceHoursEarned}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${engagementRate}%`,
                              background: engagementRate >= 60 ? HUNTER : engagementRate >= 30 ? '#d97706' : '#dc2626'
                            }}
                          />
                        </div>
                        <span className="text-xs text-stone-500">{engagementRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
