/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Globe, Check, X, RefreshCw, Copy, Shield } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

export default function PartnerDomainSettings() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [copied, setCopied] = useState(null);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const { data } = await api.get('/partners/my');
      setPartner(data.partner);
      setDomain(data.partner?.branding?.customDomain || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load domain settings');
    }
    setLoading(false);
  }

  async function saveDomain() {
    if (!domain.trim()) return;
    setSaving(true);
    try {
      await api.put('/partners/my-branding', { customDomain: domain.toLowerCase().trim() });
      setError(null);
      await loadPartner();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save domain');
    }
    setSaving(false);
  }

  async function initVerification() {
    setInitLoading(true);
    setVerifyResult(null);
    try {
      const { data } = await api.post('/partners/my/domain/verify-init');
      setInstructions(data);
    } catch (err) {
      setVerifyResult({ verified: false, message: err.response?.data?.error || 'Failed to initiate verification' });
    }
    setInitLoading(false);
  }

  async function checkVerification() {
    setVerifying(true);
    try {
      const { data } = await api.post('/partners/my/domain/verify-check');
      setVerifyResult(data);
      if (data.verified) {
        loadPartner();
      }
    } catch (err) {
      setVerifyResult({ verified: false, message: err.response?.data?.error || 'Verification check failed' });
    }
    setVerifying(false);
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: BURGUNDY }} />
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium text-red-700">Something went wrong</p>
        <p className="text-sm text-stone-500 mt-1">{error}</p>
        <button onClick={() => { setError(null); loadPartner(); }} className="mt-4 px-4 py-2 text-sm rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50">
          Try Again
        </button>
      </div>
    );
  }

  if (!partner) {
    return <div className="text-center py-20 text-stone-500">No partner account found</div>;
  }

  const isVerified = partner.domainVerification?.verified;
  const currentDomain = partner.branding?.customDomain;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Custom Domain
        </h1>
        <p className="text-sm text-stone-500 mt-1">Set up a custom domain for your partner platform</p>
      </div>

      {/* Domain Setup */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Domain Configuration</h2>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-600 mb-1">Custom Domain</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              placeholder="ce.yourcompany.com"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={saveDomain}
              disabled={saving || !domain.trim() || domain === currentDomain}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: BURGUNDY }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {error && partner && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        {currentDomain && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-stone-400" />
            <span className="text-stone-600 font-mono">{currentDomain}</span>
            {isVerified ? (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                <Check className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                Not verified
              </span>
            )}
          </div>
        )}
      </div>

      {/* DNS Setup Instructions */}
      {currentDomain && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-4">DNS Configuration</h2>

          <div className="space-y-4">
            {/* Step 1: CNAME */}
            <div className="p-4 bg-stone-50 rounded-lg">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Step 1: Add CNAME Record</p>
              <p className="text-sm text-stone-600 mb-2">Point your domain to CounselorReady:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-stone-400">Name/Host</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-white px-2 py-1 rounded border border-stone-200 text-xs font-mono">{currentDomain.split('.')[0]}</code>
                    <button onClick={() => copyToClipboard(currentDomain.split('.')[0], 'cname-name')} className="p-1 hover:bg-stone-100 rounded">
                      {copied === 'cname-name' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Target/Value</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-white px-2 py-1 rounded border border-stone-200 text-xs font-mono">counselorready.com</code>
                    <button onClick={() => copyToClipboard('counselorready.com', 'cname-val')} className="p-1 hover:bg-stone-100 rounded">
                      {copied === 'cname-val' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="p-4 bg-stone-50 rounded-lg">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Step 2: Verify Ownership</p>

              {!instructions && !isVerified && (
                <button
                  onClick={initVerification}
                  disabled={initLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                  style={{ background: BURGUNDY }}
                >
                  <Shield className="w-4 h-4" /> {initLoading ? 'Generating...' : 'Generate Verification Record'}
                </button>
              )}

              {instructions && !isVerified && (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600">Add this TXT record to your DNS:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-stone-400">Name</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-white px-2 py-1 rounded border border-stone-200 text-xs font-mono break-all">{instructions.recordName}</code>
                        <button onClick={() => copyToClipboard(instructions.recordName, 'txt-name')} className="p-1 hover:bg-stone-100 rounded flex-shrink-0">
                          {copied === 'txt-name' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Value</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-white px-2 py-1 rounded border border-stone-200 text-xs font-mono break-all">{instructions.recordValue}</code>
                        <button onClick={() => copyToClipboard(instructions.recordValue, 'txt-val')} className="p-1 hover:bg-stone-100 rounded flex-shrink-0">
                          {copied === 'txt-val' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={checkVerification}
                    disabled={verifying}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 mt-3"
                    style={{ background: HUNTER }}
                  >
                    <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                    {verifying ? 'Checking...' : 'Check Verification'}
                  </button>
                </div>
              )}

              {isVerified && (
                <div className="flex items-center gap-2 text-sm" style={{ color: HUNTER }}>
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Domain ownership verified on {new Date(partner.domainVerification.verifiedAt).toLocaleDateString()}</span>
                </div>
              )}

              {verifyResult && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${verifyResult.verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {verifyResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
