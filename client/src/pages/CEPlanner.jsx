/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, Clock, Target, AlertTriangle, CheckCircle, BookOpen, ArrowLeft, ArrowRight, TrendingUp, FileText, Award, Beaker, Plus } from 'lucide-react';

const urgencyColors = {
  expired: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
  urgent: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
  upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  on_track: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-800' }
};

const urgencyLabels = {
  expired: 'Expired', critical: 'Critical — Under 30 days', urgent: 'Urgent — Under 90 days',
  upcoming: 'Upcoming — Under 6 months', on_track: 'On Track'
};

function ResearchReadyRecs({ deficits }) {
  const [articles, setArticles] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (deficits.length === 0) return;
    const fetchAll = async () => {
      const results = {};
      try {
        const { data: recData } = await api.get('/research-ready/recommendations');
        const recs = recData.recommendations || [];
        for (const rec of recs.slice(0, 3)) {
          try {
            const { data } = await api.get('/research-ready/search', {
              params: { q: rec.suggestedSearch || rec.category, per_page: 3, desired_hours: rec.suggestedHours }
            });
            if (data.results?.length > 0) {
              results[rec.category] = {
                articles: data.results,
                deficit: { category: rec.category, remaining: rec.hoursNeeded }
              };
            }
          } catch { /* non-fatal */ }
        }
      } catch {
        // Fallback: use deficits directly if recommendations endpoint fails
        for (const d of deficits.slice(0, 3)) {
          try {
            const { data } = await api.get('/research-ready/search', {
              params: { q: d.category, per_page: 3, desired_hours: d.remaining }
            });
            if (data.results?.length > 0) results[d.category] = { articles: data.results, deficit: d };
          } catch { /* non-fatal */ }
        }
      }
      setArticles(results);
      setLoaded(true);
    };
    fetchAll();
  }, [deficits]);

  if (!loaded) return null;

  // If no results at all, show fallback
  if (Object.keys(articles).length === 0) {
    return (
      <div className="p-4 border-t border-[#DDD9D3]">
        <div className="bg-[#FDF8EE] border-l-[3px] border-l-[#7B2D3E] rounded-r-lg p-4">
          <p className="font-[Georgia,serif] text-[11px] italic text-[#5C4D3A]">
            No open-access articles currently matched.{' '}
            <Link to="/research-ready" className="text-[#7B2D3E] underline hover:text-[#9B3A4E]">
              Search manually &rarr;
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-[#DDD9D3]">
      <section
        className="bg-[#FAF5EC] border border-[#DDD9D3] rounded-[10px] p-6 mb-4"
        aria-label="RNR CE recommendations for your deficit content areas"
      >
        <h3 className="font-[Georgia,serif] text-[16px] font-semibold text-[#8B5E2E] mb-4">
          Researched-N-Ready: Fill Your Gap
        </h3>
      {Object.entries(articles).map(([category, { articles: arts, deficit }]) => (
        <div key={category} className="mb-4 bg-[#FDF8EE] border-l-[3px] border-l-[#7B2D3E] rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Beaker className="w-4 h-4 text-[#7B2D3E]" />
            <h4 className="font-[Georgia,serif] text-sm font-semibold text-[#8B5E2E]">
              Fill your {category} deficit
            </h4>
          </div>
          <p className="font-[Georgia,serif] text-[10px] italic text-[#5C4D3A] mb-3">
            {deficit.remaining} hours needed &middot; matched articles below
          </p>
          <div className="space-y-2">
            {arts.slice(0, 3).map((article, i) => (
              <Link key={i} to={`/research-ready?q=${encodeURIComponent(category)}&desired_hours=${deficit.remaining}`}
                className="flex items-center justify-between p-3 bg-[#F8EEDC] rounded-lg hover:bg-[#F5EEE0] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="w-4 h-4 text-[#7B2D3E] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-[Georgia,serif] text-[12px] font-medium text-[#2A1F0E] line-clamp-1">{article.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#7B2D3E] text-[#FAF5EC]">{article.ceHours} CE hrs</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#F4F1ED] text-[#5C4D3A]">{category}</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#7B2D3E] text-[#FAF5EC] rounded text-[9px] font-[Georgia,serif] uppercase tracking-[0.05em] hover:bg-[#9B3A4E] flex-shrink-0 ml-2">
                  <Plus className="w-3 h-3" /> Create CE
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      </section>
    </div>
  );
}

export default function CEPlanner() {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const { data } = await api.get('/ce-planner/plan');
        setPlanData(data);
      } catch (err) {
        console.error('Failed to load CE plan:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load CE plan');
      } finally {
        setLoading(false);
      }
    };
    loadPlan();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700"></div></div>;

  if (error) {
    return (
      <div>
        <Link to="/credentials" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Credentials</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CE Planner</h1>
        <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Unable to Load CE Plan</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); api.get('/ce-planner/plan').then(({ data }) => setPlanData(data)).catch(e => setError(e.response?.data?.error || e.message)).finally(() => setLoading(false)); }} className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!planData || planData.plan?.length === 0) {
    return (
      <div>
        <Link to="/credentials" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Credentials</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CE Planner</h1>
        <div className="bg-white rounded-xl border p-12 text-center">
          <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Credentials Found</h2>
          <p className="text-gray-500 mb-4">{planData?.message || 'Add your credentials first to get a personalized CE plan.'}</p>
          <p className="text-gray-400 text-sm mb-6">Your CE plan automatically pulls data from your credentials and certificates.</p>
          <a href="/credentials" className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm">
            Add Credentials <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const { summary, plan } = planData;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">CE Planner</h1>

      {/* Data Source Banner */}
      {summary.totalCertificates > 0 && (
        <div className="bg-burgundy-50 border border-burgundy-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-burgundy-600 flex-shrink-0" />
          <p className="text-sm text-burgundy-800">
            Your plan includes data from <strong>{summary.totalCredentials} credential{summary.totalCredentials !== 1 ? 's' : ''}</strong> and <strong>{summary.totalCertificates} certificate{summary.totalCertificates !== 1 ? 's' : ''}</strong> ({summary.totalCertificateHours} CE hours logged).
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-burgundy-100 rounded-lg"><Target className="w-5 h-5 text-burgundy-700" /></div>
            <div>
              <p className="text-2xl font-bold">{summary.totalCredentials}</p>
              <p className="text-xs text-gray-500">Active Credentials</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{summary.totalHoursRemaining}</p>
              <p className="text-xs text-gray-500">Hours Remaining</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{summary.credentialsByUrgency.critical + summary.credentialsByUrgency.urgent}</p>
              <p className="text-xs text-gray-500">Need Attention</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.credentialsByUrgency.onTrack}</p>
              <p className="text-xs text-gray-500">On Track</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Credential Plans */}
      <div className="space-y-6">
        {plan.map((item) => {
          const colors = urgencyColors[item.urgency] || urgencyColors.on_track;
          const progressPct = item.totalHoursRequired > 0
            ? Math.round((item.totalHoursCompleted / item.totalHoursRequired) * 100) : 0;

          return (
            <div key={item.credentialId} className={`bg-white rounded-xl border ${colors.border}`}>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">{item.credentialName}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                      {urgencyLabels[item.urgency]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.state && `${item.state} \u2022 `}
                    Expires: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}
                    {item.daysUntilExpiration !== null && ` (${item.daysUntilExpiration} days)`}
                    {' \u2022 '}
                    <span className="text-burgundy-600">Auto-synced from your credentials & certificates</span>
                  </p>
                </div>
                {item.suggestedHoursPerWeek && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium text-burgundy-800">
                      <TrendingUp className="w-4 h-4" /> {item.suggestedHoursPerWeek} hrs/week
                    </div>
                    <p className="text-xs text-gray-500">suggested pace</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="px-4 pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.totalHoursCompleted} / {item.totalHoursRequired} hours</span>
                  <span className="font-medium">{progressPct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-burgundy-600 h-2.5 rounded-full transition-all" style={{ width: `${Math.min(100, progressPct)}%` }} />
                </div>
              </div>

              {/* Category Breakdown */}
              {item.categoryBreakdown.length > 0 && (
                <div className="px-4 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {item.categoryBreakdown.map((cat, i) => (
                      <div key={i} className={`rounded-lg p-2 text-sm ${cat.remaining === 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <p className="text-xs text-gray-500">{cat.category}</p>
                        <p className="font-medium">{cat.completed}/{cat.required} hrs
                          {cat.remaining > 0 && <span className="text-red-600 ml-1">({cat.remaining} left)</span>}
                          {cat.remaining === 0 && <span className="text-green-600 ml-1">Done</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Recommendations */}
              {item.recommendations.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recommended Courses</h3>
                  <div className="space-y-2">
                    {item.recommendations.map((rec, i) => (
                      <div key={i}>
                        {rec.suggestedCourses.length > 0 ? (
                          rec.suggestedCourses.map(course => (
                            <a key={course.id} href={`/learn/${course.slug}`}
                              className="flex items-center justify-between p-3 bg-burgundy-100 rounded-lg hover:bg-burgundy-200 transition-colors mb-2">
                              <div className="flex items-center gap-3">
                                <BookOpen className="w-4 h-4 text-burgundy-700" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                  <p className="text-xs text-gray-500">{course.ceHours} CE hours \u2022 {rec.category}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-burgundy-700" />
                            </a>
                          ))
                        ) : rec.note ? (
                          <p className="text-sm text-gray-500 italic">{rec.note}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Researched-N-Ready CE Recommendations */}
              {item.categoryBreakdown.filter(c => c.remaining > 0).length > 0 && (
                <ResearchReadyRecs deficits={item.categoryBreakdown.filter(c => c.remaining > 0)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
