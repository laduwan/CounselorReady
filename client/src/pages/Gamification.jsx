/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ICON_MAP = {
  trophy: '🏆', star: '⭐', crown: '👑', gem: '💎', flame: '🔥',
  fire: '🔥', medal: '🏅', award: '🎖️', clock: '⏰', zap: '⚡',
  'check-circle': '✅'
};

export default function GamificationPage() {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [profileRes, leaderRes] = await Promise.all([
        api.get('/gamification/my'),
        api.get('/gamification/leaderboard')
      ]);
      setProfile(profileRes.data);
      setLeaderboard(leaderRes.data);
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateWeeklyGoal(hours) {
    try {
      await api.put('/gamification/weekly-goal', { hours });
      setProfile(p => ({ ...p, weeklyGoalHours: hours }));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div></div>;
  if (!profile) return <div className="text-center p-12 text-gray-500">Unable to load gamification data</div>;

  const xpProgress = ((profile.xp % 500) / 500) * 100;

  return (
    <div className="max-w-5xl mx-auto" role="main" aria-label="Achievements & Progress">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Courses</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Achievements & Progress</h1>
      <p className="text-gray-600 mb-6">Track your learning journey and earn badges</p>

      {/* Tab Nav */}
      <div className="flex gap-1 mb-6 border-b" role="tablist">
        {['overview', 'badges', 'leaderboard'].map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'text-burgundy-700 border-b-2 border-burgundy-700' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Level & XP */}
          <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-3xl font-bold">Level {profile.level}</div>
                <div className="text-burgundy-300">{profile.xp} XP total</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-burgundy-300">{profile.xpToNextLevel} XP to next level</div>
              </div>
            </div>
            <div className="w-full bg-burgundy-900 bg-opacity-40 rounded-full h-3" role="progressbar" aria-valuenow={xpProgress} aria-label="XP progress">
              <div className="bg-white bg-opacity-90 h-3 rounded-full transition-all" style={{ width: `${xpProgress}%` }}></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Current Streak" value={`${profile.currentStreak} days`} icon="🔥" />
            <StatCard label="Longest Streak" value={`${profile.longestStreak} days`} icon="🏆" />
            <StatCard label="Courses Completed" value={profile.totalCoursesCompleted} icon="📚" />
            <StatCard label="CE Hours Earned" value={profile.totalCEHoursEarned} icon="⏰" />
          </div>

          {/* Weekly Goal */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Weekly CE Goal</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>{profile.weeklyHoursCompleted}h completed</span>
                  <span>{profile.weeklyGoalHours}h goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar">
                  <div className="bg-amber-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(100, (profile.weeklyHoursCompleted / profile.weeklyGoalHours) * 100)}%` }}></div>
                </div>
              </div>
              <select value={profile.weeklyGoalHours} onChange={e => updateWeeklyGoal(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm" aria-label="Set weekly goal">
                {[1, 2, 3, 5, 8, 10].map(h => <option key={h} value={h}>{h}h/week</option>)}
              </select>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Earned Badges ({profile.badges?.length || 0})</h3>
            {profile.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" title={b.description}>
                    <span className="text-xl">{ICON_MAP[b.icon] || '🎖️'}</span>
                    <span className="text-sm font-medium text-amber-800">{b.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Complete courses and maintain streaks to earn badges!</p>
            )}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {tab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.availableBadges?.map(badge => (
            <div key={badge.key} className={`rounded-xl border p-4 transition ${badge.earned ? 'bg-white border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ICON_MAP[badge.icon] || '🎖️'}</span>
                <div>
                  <div className="font-semibold text-gray-900">{badge.name}</div>
                  <div className="text-sm text-gray-600">{badge.description}</div>
                </div>
              </div>
              {badge.earned && (
                <div className="mt-2 text-xs text-green-600 font-medium">Earned!</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {tab === 'leaderboard' && leaderboard && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="text-sm text-gray-600">Your Rank: <span className="font-bold text-burgundy-700">#{leaderboard.myRank || '—'}</span> ({leaderboard.myXp} XP)</div>
          </div>
          <table className="w-full" role="table">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-4 py-3 w-16">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">XP</th>
                <th className="px-4 py-3 text-right">Level</th>
                <th className="px-4 py-3 text-right">Streak</th>
                <th className="px-4 py-3 text-right">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.leaderboard?.map(entry => (
                <tr key={entry.rank} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-600">
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{entry.name}</td>
                  <td className="px-4 py-3 text-right text-burgundy-700 font-semibold">{entry.xp.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{entry.level}</td>
                  <td className="px-4 py-3 text-right">{entry.streak}d</td>
                  <td className="px-4 py-3 text-right">{entry.badges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
