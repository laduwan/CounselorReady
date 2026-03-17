/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Save, RotateCcw, Eye, ChevronDown, ChevronUp, Check } from 'lucide-react';

const BURGUNDY = '#6B1D34';

export default function PartnerEmailTemplates() {
  const [templates, setTemplates] = useState(null);
  const [brandColor, setBrandColor] = useState(BURGUNDY);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewType, setPreviewType] = useState(null);
  const [expandedSection, setExpandedSection] = useState('welcome');

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const { data } = await api.get('/partners/my/email-templates');
      setTemplates(data.templates);
      setBrandColor(data.brandColor);
      setCompanyName(data.companyName);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load email templates');
    }
    setLoading(false);
  }

  function updateTemplate(type, field, value) {
    setTemplates(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/partners/my/email-templates', templates);
      setSaved(true);
      setSaveError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save templates');
    }
    setSaving(false);
  }

  function resetToDefaults() {
    setTemplates({
      welcome: {
        subject: `Welcome to ${companyName}!`,
        heading: `Welcome, {{firstName}}!`,
        body: `Your account has been created on ${companyName}'s learning platform. You're all set to start exploring courses and earning CE credits.`,
        buttonText: 'Start Learning',
        footerText: 'If you need help, contact your administrator or reach out to us.'
      },
      invitation: {
        subject: `You're invited to ${companyName}`,
        heading: `You're Invited!`,
        body: `{{inviterName}} has invited you to join ${companyName} on CounselorReady, where you can access continuing education courses and earn CE credits.`,
        buttonText: 'Create Your Account',
        footerText: `This invitation was sent from ${companyName}. If you don't recognize this, you can safely ignore this email.`
      }
    });
    setSaved(false);
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
        <button onClick={() => { setError(null); loadTemplates(); }} className="mt-4 px-4 py-2 text-sm rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50">
          Try Again
        </button>
      </div>
    );
  }

  if (!templates) {
    return (
      <div className="text-center py-20 text-stone-500">Could not load email templates.</div>
    );
  }

  function renderPreview(type) {
    const tpl = templates[type];
    const previewHeading = (tpl.heading || '')
      .replace(/\{\{firstName\}\}/g, 'Jane')
      .replace(/\{\{inviterName\}\}/g, 'Admin')
      .replace(/\{\{companyName\}\}/g, companyName);
    const previewBody = (tpl.body || '')
      .replace(/\{\{firstName\}\}/g, 'Jane')
      .replace(/\{\{inviterName\}\}/g, 'Admin')
      .replace(/\{\{companyName\}\}/g, companyName);

    return (
      <div className="border border-stone-200 rounded-lg overflow-hidden mt-3" style={{ maxWidth: 480, margin: '12px auto 0' }}>
        <div style={{ background: brandColor, padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{companyName}</p>
        </div>
        <div style={{ padding: '24px', background: '#fff' }}>
          <h3 style={{ color: brandColor, margin: '0 0 12px 0', fontSize: '16px' }}>{previewHeading}</h3>
          <p style={{ color: '#333', lineHeight: '1.6', fontSize: '13px', margin: '0 0 20px 0' }}>{previewBody}</p>
          <div style={{ textAlign: 'center' }}>
            <span style={{ background: brandColor, color: '#fff', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', display: 'inline-block' }}>
              {tpl.buttonText}
            </span>
          </div>
          <p style={{ color: '#666', fontSize: '11px', marginTop: '20px' }}>{tpl.footerText}</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '12px', textAlign: 'center', fontSize: '10px', color: '#999' }}>
          Powered by CounselorReady
        </div>
      </div>
    );
  }

  function renderSection(type, title) {
    const isExpanded = expandedSection === type;
    const tpl = templates[type];

    return (
      <div className="card overflow-hidden">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : type)}
          className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" style={{ color: BURGUNDY }} />
            <div className="text-left">
              <p className="font-semibold text-stone-900 text-sm">{title}</p>
              <p className="text-xs text-stone-400">{tpl.subject}</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {isExpanded && (
          <div className="border-t border-stone-200 p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Subject Line</label>
              <input
                type="text"
                value={tpl.subject}
                onChange={(e) => updateTemplate(type, 'subject', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ focusRingColor: BURGUNDY }}
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Heading</label>
              <input
                type="text"
                value={tpl.heading}
                onChange={(e) => updateTemplate(type, 'heading', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:outline-none"
                maxLength={200}
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Variables: {'{{firstName}}'}, {'{{companyName}}'}{type === 'invitation' ? ', {{inviterName}}' : ''}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Body Text</label>
              <textarea
                value={tpl.body}
                onChange={(e) => updateTemplate(type, 'body', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:outline-none resize-none"
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Button Text</label>
                <input
                  type="text"
                  value={tpl.buttonText}
                  onChange={(e) => updateTemplate(type, 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:outline-none"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">
                  <button
                    type="button"
                    onClick={() => setPreviewType(previewType === type ? null : type)}
                    className="flex items-center gap-1 text-xs font-medium hover:underline"
                    style={{ color: BURGUNDY }}
                  >
                    <Eye className="w-3 h-3" /> {previewType === type ? 'Hide' : 'Show'} Preview
                  </button>
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Footer Text</label>
              <textarea
                value={tpl.footerText}
                onChange={(e) => updateTemplate(type, 'footerText', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:outline-none resize-none"
                maxLength={500}
              />
            </div>

            {previewType === type && renderPreview(type)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Email Templates
          </h1>
          <p className="text-sm text-stone-500 mt-1">Customize the emails sent to your team members</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-white transition-colors disabled:opacity-50"
            style={{ background: saved ? '#16a34a' : BURGUNDY }}
          >
            {saved ? <><Check className="w-3 h-3" /> Saved</> : <><Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {saveError}
        </div>
      )}

      {renderSection('welcome', 'Welcome Email')}
      {renderSection('invitation', 'Invitation Email')}
    </div>
  );
}
