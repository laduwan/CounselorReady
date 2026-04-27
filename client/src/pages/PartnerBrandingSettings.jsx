/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Palette, Check, Save, Eye } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';

const COLOR_SCHEMES = {
  // Brand default
  burgundy: { label: 'Burgundy', primary: '#6B1D34', accent: '#D4A855', bg: '#fdf5f6' },

  // Blues
  sky: { label: 'Sky Blue', primary: '#0284C7', accent: '#38BDF8', bg: '#F0F9FF' },
  navy: { label: 'Navy', primary: '#1E3A5F', accent: '#60A5FA', bg: '#EFF6FF' },
  royal: { label: 'Royal Blue', primary: '#1D4ED8', accent: '#93C5FD', bg: '#EFF6FF' },
  steel: { label: 'Steel', primary: '#475569', accent: '#94A3B8', bg: '#F1F5F9' },

  // Greys
  charcoal: { label: 'Charcoal', primary: '#1F2937', accent: '#6B7280', bg: '#F9FAFB' },
  slate: { label: 'Slate', primary: '#334155', accent: '#64748B', bg: '#F8FAFC' },
  graphite: { label: 'Graphite', primary: '#374151', accent: '#9CA3AF', bg: '#F3F4F6' },

  // Khaki / Earth
  khaki: { label: 'Khaki', primary: '#78716C', accent: '#A8A29E', bg: '#F8F7F4' },
  sand: { label: 'Sand', primary: '#92400E', accent: '#D4A855', bg: '#FFFBEB' },
  olive: { label: 'Olive', primary: '#4D7C0F', accent: '#A3E635', bg: '#F7FEE7' },

  // Popular backgrounds
  'clean-white': { label: 'Clean White', primary: '#111827', accent: '#3B82F6', bg: '#FFFFFF' },
  'warm-stone': { label: 'Warm Stone', primary: '#44403C', accent: '#78716C', bg: '#F8F7F4' },
  'cool-gray': { label: 'Cool Gray', primary: '#1F2937', accent: '#6366F1', bg: '#F9FAFB' },
  'soft-blue': { label: 'Soft Blue', primary: '#1E40AF', accent: '#60A5FA', bg: '#F0F9FF' },
  cream: { label: 'Cream', primary: '#78350F', accent: '#D97706', bg: '#FFFBEB' },
};

export default function PartnerBrandingSettings() {
  const { user } = useAuth();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    tagline: '',
    logoUrl: '',
    colorScheme: 'burgundy',
    primaryColor: '#6B1D34',
    accentColor: '#D4A855',
  });
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [useCustomColors, setUseCustomColors] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let partnerData = null;

        try {
          const { data } = await api.get('/partners/my');
          partnerData = data.partner;
        } catch {
          // Fallback to slug-based lookup for non-admin contexts
          const slug = localStorage.getItem('cr_partner_slug');
          if (slug) {
            const { data } = await api.get(`/partners/slug/${slug}`);
            partnerData = data.partner;
          }
        }

        if (partnerData) {
          setPartner(partnerData);
          const b = partnerData.branding || {};
          const scheme = b.colorScheme || 'burgundy';
          const isCustom = !COLOR_SCHEMES[scheme] || (b.primaryColor && COLOR_SCHEMES[scheme]?.primary !== b.primaryColor);
          setUseCustomColors(isCustom);
          setForm({
            companyName: b.companyName || partnerData.name || '',
            tagline: b.tagline || '',
            logoUrl: b.logoUrl || '',
            colorScheme: scheme,
            primaryColor: b.primaryColor || '#6B1D34',
            accentColor: b.accentColor || '#D4A855',
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load branding settings');
      }
      setLoading(false);
    }
    load();
  }, [user]);

  function selectScheme(key) {
    const scheme = COLOR_SCHEMES[key];
    setForm(prev => ({
      ...prev,
      colorScheme: key,
      primaryColor: scheme.primary,
      accentColor: scheme.accent,
    }));
    setUseCustomColors(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { data } = await api.put('/partners/my-branding', {
        companyName: form.companyName,
        tagline: form.tagline,
        logoUrl: form.logoUrl,
        colorScheme: useCustomColors ? 'custom' : form.colorScheme,
        primaryColor: form.primaryColor,
        accentColor: form.accentColor,
      });
      setPartner(data.partner);
      setSaved(true);
      setSaveError(null);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save branding settings');
    }
    setSaving(false);
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
      </div>
    );
  }

  const previewPrimary = form.primaryColor;
  const previewAccent = form.accentColor;
  const previewBg = useCustomColors ? '#F8F7F4' : (COLOR_SCHEMES[form.colorScheme]?.bg || '#fdf5f6');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Branding Settings
          </h1>
          <p className="text-sm text-stone-500 mt-1">Customize how your platform looks to your users</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: BURGUNDY }}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</>}
        </button>
      </div>

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {saveError}
        </div>
      )}

      {/* Company Info */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={e => setForm(prev => ({ ...prev, companyName: e.target.value }))}
              className="input-field"
              placeholder="Your Company"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))}
              className="input-field"
              placeholder="Your learning platform"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-1">Logo URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={e => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
              className="input-field"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
      </div>

      {/* Color Scheme Picker */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Color Scheme</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => {
            const selected = !useCustomColors && form.colorScheme === key;
            return (
              <button
                key={key}
                onClick={() => selectScheme(key)}
                className="relative p-3 rounded-xl border-2 text-left transition-all hover:shadow-md"
                style={{
                  borderColor: selected ? scheme.primary : '#e7e5e4',
                  background: scheme.bg,
                }}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: scheme.primary }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ background: scheme.primary }} />
                  <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: scheme.accent }} />
                </div>
                <p className="text-xs font-medium" style={{ color: scheme.primary }}>{scheme.label}</p>
              </button>
            );
          })}

          {/* Custom option */}
          <button
            onClick={() => setUseCustomColors(true)}
            className="relative p-3 rounded-xl border-2 text-left transition-all hover:shadow-md"
            style={{
              borderColor: useCustomColors ? form.primaryColor : '#e7e5e4',
              background: '#F8F7F4',
            }}
          >
            {useCustomColors && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: form.primaryColor }}>
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-6 h-6 text-stone-400" />
            </div>
            <p className="text-xs font-medium text-stone-600">Custom</p>
          </button>
        </div>

        {/* Custom color pickers */}
        {useCustomColors && (
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="input-field font-mono text-sm flex-1"
                  placeholder="#6B1D34"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="input-field font-mono text-sm flex-1"
                  placeholder="#D4A855"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-stone-400" />
          <h2 className="text-sm font-semibold text-stone-900">Preview</h2>
        </div>
        <div className="rounded-xl overflow-hidden border border-stone-200">
          {/* Header preview */}
          <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'white', borderBottom: '1px solid #e7e5e4' }}>
            <div className="flex items-center gap-3">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Logo" className="h-8 w-auto rounded-lg"
                  onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: previewPrimary }}>
                  {(form.companyName || 'P').charAt(0)}
                </div>
              )}
              <span className="font-semibold text-lg" style={{ color: previewPrimary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {form.companyName || partner.name}
              </span>
            </div>
            <div className="flex gap-4 text-sm" style={{ color: '#78716c' }}>
              <span className="font-medium" style={{ color: previewPrimary }}>Dashboard</span>
              <span>Courses</span>
              <span>Settings</span>
            </div>
          </div>

          {/* Content preview */}
          <div className="p-6" style={{ background: previewBg }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: previewPrimary + '15' }}>
                <Palette className="w-5 h-5" style={{ color: previewPrimary }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">Welcome back</p>
                <p className="text-xs text-stone-500">{form.tagline || 'Your learning platform'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: previewPrimary }}>
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: previewAccent, color: previewPrimary }}>
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
