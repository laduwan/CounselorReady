/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Referrals() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchReferral(); }, []);

  async function fetchReferral() {
    try {
      setLoading(true);
      const { data } = await api.get('/referrals/my');
      setData(data);
    } catch (err) {
      console.error('Failed to load referral data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!data?.referralLink) return;
    try {
      await navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = data.referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div></div>;

  return (
    <div className="max-w-3xl mx-auto" role="main" aria-label="Referral Program">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Referral Program</h1>
      <p className="text-gray-600 mb-6">Earn $10 credit for every colleague who subscribes</p>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-xl p-6 text-white mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={data?.referralLink || ''}
            className="flex-1 bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white placeholder-burgundy-300 text-sm"
            aria-label="Your referral link"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-white text-burgundy-800 rounded-lg font-medium hover:bg-burgundy-100 transition text-sm"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-burgundy-300 text-sm mt-2">Code: <span className="font-mono font-bold">{data?.referralCode}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{data?.stats?.totalClicks || 0}</div>
          <div className="text-xs text-gray-500">Link Clicks</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{data?.stats?.totalSignups || 0}</div>
          <div className="text-xs text-gray-500">Sign Ups</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-burgundy-700">{data?.stats?.totalConversions || 0}</div>
          <div className="text-xs text-gray-500">Subscribed</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">${data?.stats?.creditsBalance || 0}</div>
          <div className="text-xs text-gray-500">Credit Balance</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">1.</div>
            <div className="font-medium text-gray-900">Share Your Link</div>
            <div className="text-sm text-gray-600">Send your unique referral link to colleagues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">2.</div>
            <div className="font-medium text-gray-900">They Sign Up</div>
            <div className="text-sm text-gray-600">Your colleague creates an account and subscribes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">3.</div>
            <div className="font-medium text-gray-900">You Earn Credit</div>
            <div className="text-sm text-gray-600">Get $10 account credit for each subscription</div>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Referral History</h3>
        {data?.referrals?.length > 0 ? (
          <div className="space-y-3">
            {data.referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{r.email}</div>
                  <div className="text-xs text-gray-500">
                    {r.registeredAt ? `Joined ${new Date(r.registeredAt).toLocaleDateString()}` : 'Pending'}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  r.status === 'rewarded' ? 'bg-green-100 text-green-700' :
                  r.status === 'subscribed' ? 'bg-blue-100 text-blue-700' :
                  r.status === 'registered' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No referrals yet. Share your link to get started!</p>
        )}
      </div>
    </div>
  );
}
