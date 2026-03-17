/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, TrendingUp, BookOpen, Award, ExternalLink, Copy, Check, UserPlus, Rocket, ArrowRight, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let partnerData = null;

        // Get partner info from localStorage slug or user association
        const slug = localStorage.getItem('cr_partner_slug');
        if (slug) {
          const { data } = await api.get(`/partners/slug/${slug}`);
          partnerData = data.partner;
        }

        // Fetch partner stats if admin or partner_admin
        if (user?.role === 'partner_admin') {
          const { data } = await api.get('/partners/my');
          partnerData = data.partner;
        } else if (user?.role === 'admin' && user?.partnerId) {
          const { data } = await api.get(`/partners/${user.partnerId}`);
          partnerData = data.partner;
        }

        if (partnerData) {
          setPartner(partnerData);

          // Fetch analytics — use /my/stats for partner admins, /:id/stats for platform admins
          if (partnerData._id && (user?.role === 'admin' || user?.role === 'partner_admin')) {
            try {
              const endpoint = user?.role === 'admin'
                ? `/partners/${partnerData._id}/stats`
                : '/partners/my/stats';
              const [statsRes, onboardingRes] = await Promise.all([
                api.get(endpoint),
                user?.role === 'partner_admin' ? api.get('/partners/my/onboarding').catch(() => null) : Promise.resolve(null)
              ]);
              setStats(statsRes.data);
              if (onboardingRes?.data) setOnboarding(onboardingRes.data);
            } catch { /* stats fetch is non-critical */ }
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load partner data');
      }
      setLoading(false);
    }
    load();
  }, [user]);

  function copyLink() {
    if (!partner) return;
    const url = `${window.location.origin}/register?partner=${partner.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium text-red-700">Something went wrong</p>
        <p className="text-sm text-stone-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50">
          Try Again
        </button>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p className="text-lg font-medium">No partner account found</p>
        <p className="text-sm mt-1">This page is available to whitelabel distribution partners.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {partner.branding?.logoUrl ? (
            <img src={partner.branding.logoUrl} alt={partner.name} className="h-12 w-auto rounded-lg" />
          ) : (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ background: partner.branding?.primaryColor || BURGUNDY }}>
              {partner.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {partner.branding?.companyName || partner.name}
            </h1>
            <p className="text-sm text-stone-500">{partner.branding?.tagline || 'Whitelabel Partner Dashboard'}</p>
          </div>
        </div>
      </div>

      {/* Onboarding Banner (only if setup is incomplete) */}
      {onboarding && !onboarding.progress.allRequiredDone && (
        <Link to="/partner/onboarding" className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#fef3c7' }}>
            <Rocket className="w-5 h-5" style={{ color: '#d97706' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-900">Finish setting up your account</p>
            <p className="text-xs text-stone-500 mt-0.5">{onboarding.progress.requiredCompleted} of {onboarding.progress.requiredTotal} steps completed</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-stone-200 rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: `${onboarding.progress.percentage}%`, background: '#d97706' }} />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </div>
        </Link>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: BURGUNDY_LIGHT }}>
              <Users className="w-5 h-5" style={{ color: BURGUNDY }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats?.totalUsers ?? partner.userCount ?? 0}</p>
              <p className="text-xs text-stone-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f0fdf4' }}>
              <TrendingUp className="w-5 h-5" style={{ color: HUNTER }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats?.activeUsers ?? (partner.active ? 'Active' : 'Paused')}</p>
              <p className="text-xs text-stone-500">{stats ? 'Active (30d)' : 'Partner Status'}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats?.coursesCompleted ?? '--'}</p>
              <p className="text-xs text-stone-500">Courses Completed</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7' }}>
              <Award className="w-5 h-5" style={{ color: '#d97706' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats?.ceHoursEarned ?? '--'}</p>
              <p className="text-xs text-stone-500">CE Hours Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(user?.role === 'admin' || user?.role === 'partner_admin') && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <Link to="/partner/courses" className="card p-3 text-center hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 mx-auto mb-1" style={{ color: BURGUNDY }} />
            <p className="text-xs font-medium text-stone-700">Manage Courses</p>
          </Link>
          <Link to="/partner/users" className="card p-3 text-center hover:shadow-md transition-shadow">
            <UserPlus className="w-5 h-5 mx-auto mb-1" style={{ color: HUNTER }} />
            <p className="text-xs font-medium text-stone-700">Manage Users</p>
          </Link>
          <Link to="/partner/bulk-upload" className="card p-3 text-center hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 mx-auto mb-1" style={{ color: '#2563eb' }} />
            <p className="text-xs font-medium text-stone-700">Bulk Upload</p>
          </Link>
          <Link to="/partner/billing" className="card p-3 text-center hover:shadow-md transition-shadow">
            <Award className="w-5 h-5 mx-auto mb-1" style={{ color: '#d97706' }} />
            <p className="text-xs font-medium text-stone-700">Billing</p>
          </Link>
          <Link to="/partner/reports" className="card p-3 text-center hover:shadow-md transition-shadow">
            <Download className="w-5 h-5 mx-auto mb-1" style={{ color: '#7c3aed' }} />
            <p className="text-xs font-medium text-stone-700">Reports</p>
          </Link>
          <Link to="/partner/email-templates" className="card p-3 text-center hover:shadow-md transition-shadow">
            <Mail className="w-5 h-5 mx-auto mb-1" style={{ color: '#dc2626' }} />
            <p className="text-xs font-medium text-stone-700">Email Templates</p>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {stats?.recentEnrollments > 0 && (
        <div className="card p-4 flex items-center gap-3" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <TrendingUp className="w-5 h-5" style={{ color: HUNTER }} />
          <p className="text-sm text-stone-700">
            <span className="font-bold" style={{ color: HUNTER }}>{stats.recentEnrollments}</span> new enrollment{stats.recentEnrollments !== 1 ? 's' : ''} in the last 7 days
          </p>
        </div>
      )}

      {/* Distribution Link */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-3">Your Distribution Links</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-20">Register:</span>
            <code className="flex-1 text-xs bg-stone-50 px-3 py-2 rounded-lg text-stone-700 border border-stone-200 truncate">
              {window.location.origin}/register?partner={partner.slug}
            </code>
            <button onClick={copyLink}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
              style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
              {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-20">Login:</span>
            <code className="flex-1 text-xs bg-stone-50 px-3 py-2 rounded-lg text-stone-700 border border-stone-200 truncate">
              {window.location.origin}/login?partner={partner.slug}
            </code>
          </div>
        </div>
      </div>

      {/* Course Performance */}
      {stats?.courseBreakdown?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-3">Course Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-stone-500">Course</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-stone-500">Enrollments</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-stone-500">Completions</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-stone-500">Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.courseBreakdown.map(course => (
                  <tr key={course.courseId} className="border-b border-stone-100 last:border-0">
                    <td className="py-2.5 px-3 text-stone-900 font-medium">{course.title}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{course.enrollments}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{course.completions}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: course.completionRate >= 70 ? '#f0fdf4' : course.completionRate >= 40 ? '#fef3c7' : '#fef2f2',
                          color: course.completionRate >= 70 ? HUNTER : course.completionRate >= 40 ? '#d97706' : '#dc2626'
                        }}>
                        {course.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner Details */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-3">Partner Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-stone-500 text-xs">Slug</dt>
            <dd className="text-stone-900 font-mono">{partner.slug}</dd>
          </div>
          {partner.contact?.email && (
            <div>
              <dt className="text-stone-500 text-xs">Email</dt>
              <dd className="text-stone-900">{partner.contact.email}</dd>
            </div>
          )}
          {partner.contact?.website && (
            <div>
              <dt className="text-stone-500 text-xs">Website</dt>
              <dd>
                <a href={partner.contact.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1" style={{ color: BURGUNDY }}>
                  {partner.contact.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-stone-500 text-xs">Created</dt>
            <dd className="text-stone-900">{new Date(partner.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
