/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Check, Zap, Star, Crown, ExternalLink, X } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

const PLAN_ICONS = {
  starter: Zap,
  growth: Star,
  professional: Crown,
  enterprise: Crown
};

const PLAN_COLORS = {
  starter: '#1D4ED8',
  growth: HUNTER,
  professional: BURGUNDY,
  enterprise: '#7C3AED'
};

export default function PartnerBilling() {
  const [searchParams] = useSearchParams();
  const [billing, setBilling] = useState(null);
  const [plans, setPlans] = useState({});
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('success')) setSuccessMsg('Subscription activated successfully!');
    loadBilling();
  }, []);

  async function loadBilling() {
    try {
      const { data } = await api.get('/partners/my/billing');
      setBilling(data.billing);
      setPlans(data.plans);
      setUsage(data.usage);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load billing information');
    }
    setLoading(false);
  }

  async function handleCheckout(plan) {
    setCheckoutLoading(plan);
    try {
      const { data } = await api.post('/partners/my/billing/checkout', { plan });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    }
    setCheckoutLoading(null);
  }

  async function handlePortal() {
    try {
      const { data } = await api.post('/partners/my/billing/portal');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Could not open billing portal');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  const currentPlan = billing?.plan || 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Billing & Plans
        </h1>
        <p className="text-sm text-stone-500 mt-1">Manage your partner subscription</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Plan */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Current Plan</h2>
            <p className="text-lg font-bold capitalize mt-1" style={{ color: PLAN_COLORS[currentPlan] || BURGUNDY }}>
              {plans[currentPlan]?.name || currentPlan}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Status: <span className="capitalize font-medium">{billing?.status || 'trial'}</span>
              {billing?.currentPeriodEnd && (
                <> · Renews {new Date(billing.currentPeriodEnd).toLocaleDateString()}</>
              )}
            </p>
          </div>
          {billing?.stripeCustomerId && (
            <button
              onClick={handlePortal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Manage Billing
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Usage */}
      {usage && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs text-stone-400 font-medium">Courses</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {usage.courses}
              <span className="text-sm font-normal text-stone-400">
                /{usage.maxCourses === -1 ? '∞' : usage.maxCourses}
              </span>
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-stone-400 font-medium">Users</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {usage.users}
              <span className="text-sm font-normal text-stone-400">
                /{usage.maxUsers === -1 ? '∞' : usage.maxUsers}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(plans).map(([key, plan]) => {
          const isCurrent = key === currentPlan;
          const Icon = PLAN_ICONS[key] || Star;
          const color = PLAN_COLORS[key] || BURGUNDY;

          return (
            <div
              key={key}
              className="card p-5 relative"
              style={{ borderColor: isCurrent ? color : undefined, borderWidth: isCurrent ? 2 : undefined }}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: color }}>
                  Current
                </div>
              )}

              <div className="text-center mb-4 pt-2">
                <Icon className="w-8 h-8 mx-auto mb-2" style={{ color }} />
                <h3 className="font-bold text-stone-900">{plan.name}</h3>
                {plan.introPrice ? (
                  <div className="mt-1">
                    <p className="text-2xl font-bold" style={{ color }}>
                      ${plan.introPrice}<span className="text-xs font-normal text-stone-400">/mo</span>
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      for first {plan.introMonths} months, then ${plan.price}/mo
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold mt-1" style={{ color }}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {plan.price > 0 && <span className="text-xs font-normal text-stone-400">/mo</span>}
                  </p>
                )}
              </div>

              <ul className="space-y-2 text-xs text-stone-600 mb-5">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  {plan.maxCourses === -1 ? 'Unlimited' : `Up to ${plan.maxCourses}`} courses
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  {plan.maxUsers === -1 ? 'Unlimited' : `Up to ${plan.maxUsers.toLocaleString()}`} users
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  Custom branding
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  Analytics dashboard
                </li>
                {(key === 'growth' || key === 'professional' || key === 'enterprise') && (
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                    Bulk course upload
                  </li>
                )}
                {(key === 'professional' || key === 'enterprise') && (
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                    Custom domain
                  </li>
                )}
                {key === 'enterprise' && (
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color }} />
                    Priority support
                  </li>
                )}
              </ul>

              {isCurrent ? (
                <div className="text-center text-xs font-medium py-2 rounded-lg" style={{ background: color + '10', color }}>
                  Active Plan
                </div>
              ) : (
                <button
                  onClick={() => handleCheckout(key)}
                  disabled={checkoutLoading === key}
                  className="w-full text-center text-xs font-medium py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                  style={{ background: color }}
                >
                  {checkoutLoading === key ? 'Loading...' : 'Upgrade'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
