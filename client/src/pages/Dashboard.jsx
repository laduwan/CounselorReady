/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpen,
  CheckCircle,
  FileText,
  ShieldCheck,
  Upload,
  BarChart3,
  Clock,
  ArrowRight,
  MessageCircle,
  ChevronRight,
  Trophy,
  ClipboardList,
  Star,
  Sparkles,
  X,
  Lock,
  Calendar,
  Bell,
  Users,
  Pencil,
  Check
} from 'lucide-react';

const ALL_QUICK_ACTIONS = [
  { id: 'browse-courses',    label: 'Browse Courses',    href: '/courses',           icon: BookOpen,      bg: 'bg-burgundy-50 hover:bg-burgundy-100', iconBg: 'bg-burgundy-700',  text: 'text-burgundy-800' },
  { id: 'upload-cert',       label: 'Upload Certificate',href: '/credentials',       icon: Upload,        bg: 'bg-forest-50 hover:bg-forest-100',     iconBg: '',                 text: 'text-forest-800',   iconStyle: { background: 'linear-gradient(135deg, #8b2542, #6b1d34)' } },
  { id: 'generate-audit',    label: 'Generate Audit',    href: '/audit-kit',         icon: BarChart3,     bg: 'bg-honey-50 hover:bg-honey-100',       iconBg: 'bg-honey-500',     text: 'text-honey-800' },
  { id: 'supervision',       label: 'Supervision',       href: '/supervision',       icon: ClipboardList, bg: 'bg-stone-100 hover:bg-stone-200',      iconBg: 'bg-stone-600',     text: 'text-stone-700' },
  { id: 'insurance',         label: 'Insurance',         href: '/insurance-tracker',  icon: ShieldCheck,   bg: 'bg-burgundy-50 hover:bg-burgundy-100', iconBg: '',                 text: 'text-burgundy-800', iconStyle: { background: '#6B1D34' } },
  { id: 'legacy-vault',      label: 'Legacy Vault',      href: '/legacy-vault',      icon: Lock,          bg: 'bg-forest-50 hover:bg-forest-100',     iconBg: 'bg-forest-600',    text: 'text-forest-800' },
  { id: 'referrals',         label: 'Referrals',         href: '/referrals',         icon: Star,          bg: 'bg-honey-50 hover:bg-honey-100',       iconBg: 'bg-honey-500',     text: 'text-honey-800' },
  { id: 'ce-planner',        label: 'CE Planner',        href: '/ce-planner',        icon: Calendar,      bg: 'bg-stone-100 hover:bg-stone-200',      iconBg: 'bg-stone-600',     text: 'text-stone-700' },
  { id: 'board-alerts',      label: 'Board Alerts',      href: '/board-alerts',      icon: Bell,          bg: 'bg-forest-50 hover:bg-forest-100',     iconBg: 'bg-forest-600',    text: 'text-forest-800' },
  { id: 'recommendations',   label: 'Recommendations',   href: '/recommendations',   icon: Sparkles,      bg: 'bg-burgundy-50 hover:bg-burgundy-100', iconBg: 'bg-burgundy-700',  text: 'text-burgundy-800' },
  { id: 'achievements',      label: 'Achievements',      href: '/achievements',      icon: Trophy,        bg: 'bg-honey-50 hover:bg-honey-100',       iconBg: 'bg-honey-500',     text: 'text-honey-800' },
  { id: 'organization',      label: 'Organization',      href: '/organization',      icon: Users,         bg: 'bg-stone-100 hover:bg-stone-200',      iconBg: 'bg-stone-600',     text: 'text-stone-700' },
  { id: 'group-licenses',    label: 'Group Licenses',    href: '/group-licenses',    icon: Users,         bg: 'bg-forest-50 hover:bg-forest-100',     iconBg: 'bg-forest-600',    text: 'text-forest-800' },
  { id: 'credentials',       label: 'Add Credential',    href: '/credentials',       icon: ShieldCheck,   bg: 'bg-burgundy-50 hover:bg-burgundy-100', iconBg: 'bg-burgundy-700',  text: 'text-burgundy-800' },
];

const DEFAULT_ACTIONS = ['browse-courses', 'upload-cert', 'generate-audit', 'supervision'];

function loadSavedActions() {
  try {
    const saved = JSON.parse(localStorage.getItem('cr_quick_actions'));
    if (Array.isArray(saved) && saved.length === 4 && saved.every(id => ALL_QUICK_ACTIONS.some(a => a.id === id))) {
      return saved;
    }
  } catch {}
  return DEFAULT_ACTIONS;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [credentials, setCredentials] = useState({ summary: null, credentials: [] });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsNewDismissed, setWhatsNewDismissed] = useState(() => localStorage.getItem('cr_whats_new_v1') === 'dismissed');
  const [savedActionIds, setSavedActionIds] = useState(loadSavedActions);
  const [editingActions, setEditingActions] = useState(false);
  const [draftActionIds, setDraftActionIds] = useState([]);

  useEffect(() => {
    const fetchData = async (retries = 2) => {
      try {
        const [coursesRes, credentialsRes, certsRes] = await Promise.all([
          api.get('/courses/user/enrolled'),
          api.get('/credentials/user/dashboard'),
          api.get('/certificates/my').catch(() => ({ data: { certificates: [] } }))
        ]);
        setCourses(coursesRes.data.enrolledCourses || []);
        setCredentials(credentialsRes.data);
        setCertificates(certsRes.data.certificates || certsRes.data || []);
      } catch (error) {
        if (retries > 0 && !error.response) {
          await new Promise(r => setTimeout(r, 3000));
          return fetchData(retries - 1);
        }
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isVip = user?.subscription?.plan === 'vip' || user?.subscription?.plan === 'annual_vip';
  const completedCourses = courses.filter(c => c.percentComplete === 100).length;
  const totalCEHours = credentials.summary?.overallProgress?.totalCompleted || 0;
  const totalCredentials = credentials.summary?.totalCredentials || 0;
  const certCount = Array.isArray(certificates) ? certificates.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-burgundy-900 mb-2">
            Welcome back, {user?.profile?.firstName || 'there'}!
          </h1>
          <p className="text-forest-600">Track your continuing education and stay audit-ready.</p>
        </div>
        {isVip && (
          <button className="inline-flex items-center gap-2 bg-honey-500 hover:bg-honey-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors shadow-md">
            <MessageCircle className="w-5 h-5" />
            Request Consult
          </button>
        )}
      </div>

      {/* What's New Banner */}
      {!whatsNewDismissed && (
        <div className="mb-8 bg-gradient-to-r from-burgundy-50 to-honey-50 border border-burgundy-200 rounded-xl p-5 relative">
          <button
            onClick={() => { setWhatsNewDismissed(true); localStorage.setItem('cr_whats_new_v1', 'dismissed'); }}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/60 transition-colors text-stone-400"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-burgundy-700" />
            <h3 className="font-semibold text-burgundy-900">New Features Available</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/supervision" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
              <ClipboardList className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-burgundy-900">Supervision Tracker</div>
                <div className="text-xs text-stone-500">Log hours toward licensure</div>
              </div>
            </Link>
            <Link to="/achievements" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
              <Trophy className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-burgundy-900">Achievements</div>
                <div className="text-xs text-stone-500">Earn badges & track streaks</div>
              </div>
            </Link>
            <Link to="/referrals" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
              <Star className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-burgundy-900">Referral Program</div>
                <div className="text-xs text-stone-500">Earn $10 per referral</div>
              </div>
            </Link>
            <Link to="/recommendations" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
              <Sparkles className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-burgundy-900">Smart Recommendations</div>
                <div className="text-xs text-stone-500">Personalized CE suggestions</div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* CE Hours */}
        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-forest-600 text-xs">CE Hours Earned</span>
            <div className="w-7 h-7 bg-forest-100 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-forest-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold text-burgundy-900">{totalCEHours}</p>
          <p className="text-forest-500 text-xs">This cycle</p>
        </div>

        {/* Courses Completed */}
        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-forest-600 text-xs">Courses Completed</span>
            <div className="w-7 h-7 bg-burgundy-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-burgundy-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold text-burgundy-900">{completedCourses}</p>
          <p className="text-forest-500 text-xs">All time</p>
        </div>

        {/* Certificates Stored */}
        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-forest-600 text-xs">Certificates Stored</span>
            <div className="w-7 h-7 bg-honey-100 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-honey-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold text-burgundy-900">{certCount}</p>
          <p className="text-forest-500 text-xs">Uploaded</p>
        </div>

        {/* Active Credentials */}
        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-forest-600 text-xs">Active Credentials</span>
            <div className="w-7 h-7 bg-forest-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            </div>
          </div>
          <p className="font-display text-2xl font-semibold text-burgundy-900">{totalCredentials}</p>
          <p className="text-forest-500 text-xs">Tracked</p>
        </div>
      </div>

      {/* Main Grid: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-burgundy-900">Quick Actions</h2>
              {!editingActions ? (
                <button
                  onClick={() => { setDraftActionIds([...savedActionIds]); setEditingActions(true); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-burgundy-700 transition-colors px-2 py-1 rounded-lg hover:bg-stone-50"
                >
                  <Pencil className="w-3.5 h-3.5" /> Customize
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">{draftActionIds.length}/4 selected</span>
                  <button
                    onClick={() => setEditingActions(false)}
                    className="text-xs font-medium text-stone-500 hover:text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (draftActionIds.length === 4) {
                        setSavedActionIds(draftActionIds);
                        localStorage.setItem('cr_quick_actions', JSON.stringify(draftActionIds));
                        setEditingActions(false);
                      }
                    }}
                    disabled={draftActionIds.length !== 4}
                    className="flex items-center gap-1 text-xs font-medium text-white bg-burgundy-700 hover:bg-burgundy-800 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1 rounded-lg transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              )}
            </div>

            {!editingActions ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {savedActionIds.map(id => {
                  const action = ALL_QUICK_ACTIONS.find(a => a.id === id);
                  if (!action) return null;
                  const Icon = action.icon;
                  return (
                    <Link key={action.id} to={action.href} className={`flex flex-col items-center p-4 rounded-xl ${action.bg} transition-colors group`}>
                      <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`} style={action.iconStyle || {}}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`${action.text} font-medium text-sm`}>{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALL_QUICK_ACTIONS.map(action => {
                  const Icon = action.icon;
                  const isSelected = draftActionIds.includes(action.id);
                  const canSelect = draftActionIds.length < 4;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        setDraftActionIds(prev =>
                          isSelected
                            ? prev.filter(id => id !== action.id)
                            : canSelect ? [...prev, action.id] : prev
                        );
                      }}
                      className={`relative flex flex-col items-center p-4 rounded-xl transition-all ${
                        isSelected
                          ? 'ring-2 ring-burgundy-600 bg-burgundy-50'
                          : canSelect
                            ? 'bg-stone-50 hover:bg-stone-100 cursor-pointer'
                            : 'bg-stone-50 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-burgundy-700 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <div className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center mb-2`} style={action.iconStyle || {}}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-stone-700 font-medium text-xs">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-burgundy-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.slice(0, 5).map((item) => (
                  <Link
                    key={item.course._id}
                    to={`/learn/${item.course.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-stone-50 hover:bg-forest-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-forest-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-forest-700 font-medium truncate">{item.course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-burgundy-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-burgundy-600 rounded-full transition-all"
                            style={{ width: `${item.percentComplete}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-forest-500 flex-shrink-0">{item.percentComplete}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-forest-400 flex-shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-4 p-3 rounded-lg bg-stone-50">
                  <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-forest-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-forest-700">Welcome to CounselorReady!</p>
                    <p className="text-forest-500 text-sm">Get started by browsing courses or uploading certificates.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">

          {/* CE Progress */}
          <div className="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-burgundy-900 mb-4">CE Progress</h2>
            {credentials.credentials.length > 0 ? (
              <div className="space-y-4">
                {credentials.credentials.map((cred) => (
                  <div key={cred._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-forest-800 font-medium text-sm">{cred.name}</span>
                      <span className="text-burgundy-600 text-sm font-semibold">
                        {cred.totalCEUsCompleted}/{cred.totalCEUsRequired} hrs
                      </span>
                    </div>
                    <div className="h-2 bg-burgundy-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-burgundy-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, cred.percentComplete || 0)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-8 h-8 text-forest-500" />
                </div>
                <p className="text-forest-600 text-sm">Add a credential to track CE progress</p>
                <Link to="/credentials" className="text-burgundy-700 text-sm font-medium hover:text-burgundy-800">
                  Add Credential <ArrowRight className="w-3 h-3 inline" />
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white rounded-xl border border-burgundy-100 shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-burgundy-900 mb-4">Upcoming Renewals</h2>
            {credentials.summary?.upcomingDeadlines?.length > 0 ? (
              <div className="space-y-3">
                {credentials.summary.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.credentialId} className="flex items-center gap-3 p-3 rounded-lg bg-honey-50 border border-honey-200">
                    <div className="w-8 h-8 bg-honey-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-honey-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-forest-800 font-medium text-sm truncate">{deadline.name}</p>
                      <p className="text-honey-700 text-xs">{deadline.daysRemaining} days remaining</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-forest-500 text-sm">No upcoming renewals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
