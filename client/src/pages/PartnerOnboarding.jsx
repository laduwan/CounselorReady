/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, Circle, Palette, BookOpen, Users, CreditCard, Globe, ArrowRight, Rocket } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

const STEP_ICONS = {
  branding: Palette,
  course: BookOpen,
  users: Users,
  billing: CreditCard,
  domain: Globe
};

export default function PartnerOnboarding() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: result } = await api.get('/partners/my/onboarding');
        setData(result);
      } catch { /* onboarding status shown as fallback below */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p>Could not load onboarding status.</p>
      </div>
    );
  }

  const { steps, progress } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Getting Started
        </h1>
        <p className="text-sm text-stone-500 mt-1">Complete these steps to set up your partner account</p>
      </div>

      {/* Progress Bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-stone-900">Setup Progress</p>
          <p className="text-sm font-bold" style={{ color: progress.percentage === 100 ? HUNTER : BURGUNDY }}>
            {progress.percentage}%
          </p>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${progress.percentage}%`,
              background: progress.percentage === 100
                ? HUNTER
                : `linear-gradient(135deg, ${BURGUNDY}, #8B2542)`
            }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-2">
          {progress.requiredCompleted} of {progress.requiredTotal} required steps completed
        </p>
      </div>

      {/* All Done Banner */}
      {progress.allRequiredDone && (
        <div className="card p-5 flex items-center gap-4" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
            <Rocket className="w-6 h-6" style={{ color: HUNTER }} />
          </div>
          <div>
            <p className="font-semibold text-stone-900">You're all set!</p>
            <p className="text-sm text-stone-600 mt-0.5">
              All required setup steps are complete. Your partner account is ready to go.
            </p>
          </div>
          <Link to="/partner-dashboard" className="ml-auto flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: HUNTER }}>
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = STEP_ICONS[step.id] || Circle;
          return (
            <Link
              key={step.id}
              to={step.link}
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
              style={{
                borderColor: step.completed ? '#bbf7d0' : undefined,
                background: step.completed ? '#fafff9' : undefined
              }}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-8 h-8" style={{ color: HUNTER }} />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-stone-300 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-stone-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900">{step.title}</p>
                  {step.optional && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 px-2 py-0.5 rounded-full bg-stone-100">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{step.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
