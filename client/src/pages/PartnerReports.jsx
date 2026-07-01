/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, Users, BookOpen, Award, FileText, BarChart3, RefreshCw, X } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

export default function PartnerReports() {
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    loadQuota();
  }, []);

  async function loadQuota() {
    try {
      const { data } = await api.get('/partners/my/quota');
      setQuota(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load quota data');
    }
    setLoading(false);
  }

  async function downloadReport(type) {
    setDownloading(type);
    try {
      const response = await api.get(`/partners/my/reports/${type}?format=csv`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to download ${type} report`);
    }
    setDownloading(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  const reports = [
    {
      id: 'users',
      title: 'User Report',
      description: 'Export all organization members with their roles, plan status, and login activity',
      icon: Users,
      color: BURGUNDY,
      fields: ['Email', 'Name', 'Role', 'Plan', 'Status', 'Last Login', 'Joined']
    },
    {
      id: 'courses',
      title: 'Course Performance Report',
      description: 'Export all courses with enrollment counts, completion rates, and CE hours',
      icon: BookOpen,
      color: '#1D4ED8',
      fields: ['Title', 'CE Hours', 'Status', 'Enrollments', 'Completions', 'Completion Rate']
    },
    {
      id: 'completions',
      title: 'CE Completion Report',
      description: 'Detailed learner progress: who completed what, CE hours earned, and completion dates',
      icon: Award,
      color: HUNTER,
      fields: ['Learner', 'Course', 'CE Hours', 'Progress', 'Completed', 'Date']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Reports & Export
          </h1>
          <p className="text-sm text-stone-500 mt-1">Download data reports for your organization</p>
        </div>
        <button
          onClick={loadQuota}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Usage Summary */}
      {quota && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: '#1D4ED8' }} />
                <p className="text-xs font-medium text-stone-600">Course Usage</p>
              </div>
              <p className="text-xs font-bold text-stone-900">
                {quota.courseQuota.used}
                <span className="text-stone-400 font-normal">
                  /{quota.courseQuota.limit === -1 ? '∞' : quota.courseQuota.limit}
                </span>
              </p>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(quota.courseQuota.percentage, 100)}%`,
                  background: quota.courseQuota.percentage >= 90 ? '#dc2626' : quota.courseQuota.percentage >= 70 ? '#d97706' : '#1D4ED8'
                }}
              />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: BURGUNDY }} />
                <p className="text-xs font-medium text-stone-600">User Usage</p>
              </div>
              <p className="text-xs font-bold text-stone-900">
                {quota.userQuota.used}
                <span className="text-stone-400 font-normal">
                  /{quota.userQuota.limit === -1 ? '∞' : quota.userQuota.limit}
                </span>
              </p>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(quota.userQuota.percentage, 100)}%`,
                  background: quota.userQuota.percentage >= 90 ? '#dc2626' : quota.userQuota.percentage >= 70 ? '#d97706' : BURGUNDY
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="space-y-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: report.color + '12' }}>
                  <Icon className="w-5 h-5" style={{ color: report.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 text-sm">{report.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{report.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {report.fields.map(f => (
                      <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => downloadReport(report.id)}
                  disabled={downloading === report.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50 flex-shrink-0"
                  style={{ background: report.color }}
                >
                  {downloading === report.id ? (
                    <><RefreshCw className="w-3 h-3 animate-spin" /> Exporting...</>
                  ) : (
                    <><Download className="w-3 h-3" /> Export CSV</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="card p-4 flex items-start gap-3" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
        <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
        <div>
          <p className="text-xs text-stone-700 font-medium">About Reports</p>
          <p className="text-xs text-stone-500 mt-0.5">
            Reports are exported as CSV files compatible with Excel, Google Sheets, and other spreadsheet tools.
            Data reflects the current state at the time of export.
          </p>
        </div>
      </div>
    </div>
  );
}
