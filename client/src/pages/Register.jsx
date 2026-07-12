/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import PoweredByBadge from '../components/PoweredByBadge';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    state: '',
    website: '' // honeypot: hidden from real users, catches bots that auto-fill every field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect partner from URL ?partner=slug
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('partner');
    if (slug) {
      localStorage.setItem('cr_partner_slug', slug);
      api.get(`/partners/slug/${slug}`)
        .then(({ data }) => setPartner(data.partner))
        .catch(() => setPartner(null));
    }
  }, [location.search]);

  useEffect(() => {
    if (document.getElementById('cf-turnstile-script')) return;
    const s = document.createElement('script');
    s.id = 'cf-turnstile-script';
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = { ...formData };
      payload.turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value || '';
      const slug = new URLSearchParams(location.search).get('partner') || localStorage.getItem('cr_partner_slug');
      if (slug) payload.partnerSlug = slug;
      await register(payload);

      // Tool conversion tracking (fire-and-forget)
      const toolRef = localStorage.getItem('cr_tool_ref');
      const toolSession = localStorage.getItem('cr_tool_session');
      if (toolRef) {
        const apiBase = import.meta.env.VITE_API_URL || 'https://api.counselorready.com/api';
        fetch(`${apiBase}/tool-analytics/conversion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ toolSlug: toolRef, sessionId: toolSession || '' })
        }).catch(() => {});
        localStorage.removeItem('cr_tool_ref');
        localStorage.removeItem('cr_tool_session');
      }

      const redirect = new URLSearchParams(location.search).get('redirect');
      window.location.href = redirect || '/dashboard.html';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          {partner?.branding?.logoUrl ? (
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={partner.branding.logoUrl} alt={partner.branding.companyName || partner.name} className="h-10 w-auto rounded-lg" />
              <span className="font-semibold text-xl" style={{ color: partner.branding.primaryColor || '#6B1D34' }}>
                {partner.branding.companyName || partner.name}
              </span>
            </Link>
          ) : partner ? (
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ background: partner.branding?.primaryColor || '#6B1D34' }}>
                {(partner.branding?.companyName || partner.name || 'P').charAt(0)}
              </div>
              <span className="font-semibold text-xl" style={{ color: partner.branding?.primaryColor || '#6B1D34' }}>
                {partner.branding?.companyName || partner.name}
              </span>
            </Link>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-burgundy-700 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12M8 9l4-6 4 6M6 21h12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-burgundy-700 text-xl">CounselorReady</span>
            </Link>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {partner ? `Join via ${partner.branding?.companyName || partner.name}` : 'Start your free trial'}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            7 days free, no credit card required
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field: hidden from real users, bots that auto-fill forms will populate it */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
              <label htmlFor="website">Leave this field blank</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-gray-400">(for CE requirements)</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select your state</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="cf-turnstile" data-sitekey="0x4AAAAAAD0NAWFFy22Hlr7f"></div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Trial benefits */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Your trial includes:</p>
            <ul className="space-y-2">
              {[
                'Full access to all courses',
                'Credential tracking for 1 license',
                'Progress tracking & reminders'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-burgundy-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-burgundy-700 hover:text-burgundy-800 font-medium">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
      {partner && <PoweredByBadge />}
    </div>
  );
}
