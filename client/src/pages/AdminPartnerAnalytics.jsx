/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Users, BookOpen, Award, Clock, TrendingUp, Download, ChevronDown, ChevronUp, FileText, Share2 } from 'lucide-react';

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
  const [sortField, setSortField] = useState('enrollments');
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
    const headers = [
      'Partner', 'Slug', 'Plan', 'Status', 'Users', 'Active (30d)',
      'Courses Created', 'Published', 'Draft', 'CE Hours Offered',
      'Enrollments', 'Completions', 'Completion Rate', 'CE Hours Earned', 'Created'
    ];
    const rows = data.partners.map(p => [
      p.companyName, p.slug, p.plan, p.active ? 'Active' : 'Inactive',
      p.totalUsers, p.activeUsers,
      p.coursesCreated, p.coursesPublished, p.coursesDraft, p.ceHoursOffered,
      p.enrollments, p.completions, p.completionRate + '%', p.ceHoursEarned,
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
    if (typeof av === 'string') return sortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
    return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
  });

  const SortHeader = ({ field, children }) => (
    <th
      className="px-3 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer select-none hover:text-stone-700 whitespace-nowrap"
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
          <p className="text-sm text-stone-500 ml-8">How partners are building and selling their courses</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Partners" value={summary.totalPartners} sub={`${summary.activePartners} active`} />
        <StatCard icon={BookOpen} label="Courses Created" value={summary.totalCoursesCreated} sub={`${summary.totalCoursesPublished} published`} color={HUNTER} />
        <StatCard icon={Users} label="Enrollments" value={summary.totalEnrollments.toLocaleString()} sub="across all partner courses" />
        <StatCard icon={Award} label="Completions" value={summary.totalCompletions.toLocaleString()} sub={`${summary.totalCEHoursEarned} CE hours earned`} color={HUNTER} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Partner Users" value={summary.totalPartnerUsers.toLocaleString()} sub={`${summary.totalActiveUsers} active (30d)`} />
        <StatCard icon={Clock} label="CE Hours Earned" value={summary.totalCEHoursEarned.toLocaleString()} />
        <StatCard icon={Share2} label="Your Shared Courses" value={summary.platformCoursesShared} sub="available to all partners" />
        <StatCard
          icon={Award}
          label="Avg Completion Rate"
          value={summary.totalEnrollments > 0 ? Math.round((summary.totalCompletions / summary.totalEnrollments) * 100) + '%' : '—'}
          color={HUNTER}
        />
      </div>

      {/* Partner Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Partner Course Performance</h2>
          <p className="text-xs text-stone-400 mt-0.5">Enrollments and completions on each partner's own courses</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200" style={{ background: BURGUNDY_LIGHT }}>
              <tr>
                <SortHeader field="companyName">Partner</SortHeader>
                <SortHeader field="plan">Plan</SortHeader>
                <SortHeader field="coursesCreated">Courses</SortHeader>
                <SortHeader field="ceHoursOffered">CE Offered</SortHeader>
                <SortHeader field="enrollments">Enrollments</SortHeader>
                <SortHeader field="completions">Completions</SortHeader>
                <SortHeader field="completionRate">Comp. Rate</SortHeader>
                <SortHeader field="ceHoursEarned">CE Earned</SortHeader>
                <SortHeader field="totalUsers">Users</SortHeader>
                <SortHeader field="createdAt">Joined</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-stone-400">No partners yet</td></tr>
              ) : sorted.map(p => (
                <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-3 py-3">
                    <div>
                      <span className="font-medium text-stone-800">{p.companyName}</span>
                      <span className="block text-xs text-stone-400">/{p.slug}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                      p.plan === 'professional' ? 'bg-blue-100 text-blue-700' :
                      p.plan === 'growth' ? 'bg-green-100 text-green-700' :
                      p.plan === 'starter' ? 'bg-amber-100 text-amber-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {p.plan}
                    </span>
                    {!p.active && <span className="ml-1 text-xs text-red-400">(off)</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-stone-700">{p.coursesPublished}</span>
                    {p.coursesDraft > 0 && <span className="text-xs text-stone-400 ml-1">+{p.coursesDraft} draft</span>}
                  </td>
                  <td className="px-3 py-3 text-stone-600">{p.ceHoursOffered}</td>
                  <td className="px-3 py-3 font-medium text-stone-700">{p.enrollments}</td>
                  <td className="px-3 py-3 text-stone-600">{p.completions}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${p.completionRate}%`,
                            background: p.completionRate >= 60 ? HUNTER : p.completionRate >= 30 ? '#d97706' : p.enrollments === 0 ? '#d1d5db' : '#dc2626'
                          }}
                        />
                      </div>
                      <span className="text-xs text-stone-500">{p.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-stone-600">{p.ceHoursEarned}</td>
                  <td className="px-3 py-3 text-stone-500">
                    {p.totalUsers}
                    <span className="text-xs text-stone-400 ml-1">({p.activeUsers} active)</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-stone-400">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
