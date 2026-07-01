/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import PoweredByBadge from '../components/PoweredByBadge';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState(null);

  const { login } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      const redirect = new URLSearchParams(location.search).get('redirect');
      window.location.href = redirect || '/dashboard.html';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
            {partner ? `Welcome back to ${partner.branding?.companyName || partner.name}` : 'Welcome back'}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Sign in to continue your learning
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-burgundy-700 focus:ring-burgundy-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-burgundy-700 hover:text-burgundy-800">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-burgundy-700 hover:text-burgundy-800 font-medium">
            Start free trial
          </Link>
        </p>
      </div>
      {partner && <PoweredByBadge />}
    </div>
  );
}
