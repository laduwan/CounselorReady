/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Brand colors
const BURGUNDY = '#6B1D34';
const HUNTER  = '#4A7C59';
const GOLD    = '#D4A855';
const NAVY    = '#284157';

export default function QuickEnroll() {
  const { slug } = useParams();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse]     = useState(null);
  const [status, setStatus]     = useState('loading'); // loading | found | enrolling | redirecting | error | needsPayment
  const [errorMsg, setErrorMsg] = useState('');

  // ── 1. Fetch course metadata ──────────────────────────────────────
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res  = await fetch(`${API_BASE}/interactive-courses/slug/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Course not found');
        setCourse(data);
        setStatus('found');
      } catch (err) {
        setErrorMsg(err.message);
        setStatus('error');
      }
    }
    fetchCourse();
  }, [slug]);

  // ── 2. Once course is found + auth is resolved, act ──────────────
  useEffect(() => {
    if (status !== 'found' || authLoading) return;

    if (!isAuthenticated) {
      // Preserve destination → send to login/register
      navigate(`/register?redirect=/enroll/${slug}`, { replace: true });
      return;
    }

    // User is authed — try enrolling
    handleEnroll();
  }, [status, authLoading, isAuthenticated]);

  // ── 3. Enroll or redirect if already enrolled ────────────────────
  async function handleEnroll() {
    if (!course) return;
    setStatus('enrolling');

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      // Check if already enrolled
      const progressRes = await fetch(`${API_BASE}/interactive-courses/${course._id}/progress`, { headers });
      if (progressRes.ok) {
        // Already enrolled — go straight to viewer
        setStatus('redirecting');
        navigate(`/learn/${slug}`, { replace: true });
        return;
      }

      if (progressRes.status === 403) {
        // Subscription / payment required
        const body = await progressRes.json().catch(() => ({}));
        if (body.code === 'SUBSCRIPTION_REQUIRED') {
          setStatus('needsPayment');
          return;
        }
      }

      // Not yet enrolled — enroll now
      const enrollRes  = await fetch(`${API_BASE}/interactive-courses/${course._id}/enroll`, {
        method: 'POST',
        headers,
      });

      if (enrollRes.status === 403) {
        setStatus('needsPayment');
        return;
      }

      if (!enrollRes.ok) {
        const body = await enrollRes.json().catch(() => ({}));
        throw new Error(body.message || 'Enrollment failed');
      }

      setStatus('redirecting');
      navigate(`/learn/${slug}`, { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  // ── Checkout redirect ─────────────────────────────────────────────
  async function goToCheckout() {
    if (!course) return;
    const token = localStorage.getItem('token');

    try {
      const res  = await fetch(`${API_BASE}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId:   course._id,
          successUrl: `${window.location.origin}/enroll/${slug}`,
          cancelUrl:  window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setErrorMsg('Could not start checkout. Please try again.');
      setStatus('error');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  RENDER STATES
  // ─────────────────────────────────────────────────────────────────

  const Spinner = () => (
    <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: BURGUNDY, borderRadius: '50%' }}
         className="animate-spin mx-auto mb-6" />
  );

  const Card = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: '#F8F7F4' }}>
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22, color: BURGUNDY }}>
            Counselor
          </span>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22, color: HUNTER }}>
            Ready™
          </span>
        </div>
        {children}
      </div>
    </div>
  );

  // Loading course
  if (status === 'loading' || (status === 'found' && authLoading)) {
    return (
      <Card>
        <Spinner />
        <p style={{ color: NAVY, fontWeight: 600, fontSize: 16 }}>Loading course…</p>
      </Card>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <Card>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
             style={{ background: '#fef2f2' }}>
          <svg className="w-7 h-7" fill="none" stroke={BURGUNDY} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <h2 style={{ color: BURGUNDY, fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700 }}
            className="mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-6">{errorMsg || 'This course link may be invalid.'}</p>
        <button onClick={() => navigate('/learn')}
                style={{ background: HUNTER, color: '#fff', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 14 }}>
          Browse Courses
        </button>
      </Card>
    );
  }

  // Enrolling / redirecting
  if (status === 'enrolling' || status === 'redirecting') {
    return (
      <Card>
        <Spinner />
        {course && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
               style={{ color: GOLD }}>Enrolling you in</p>
            <p style={{ color: NAVY, fontWeight: 700, fontSize: 18, fontFamily: 'Georgia, serif' }}>
              {course.title}
            </p>
          </div>
        )}
        <p className="text-gray-400 text-sm">
          {status === 'redirecting' ? 'Taking you to your course…' : 'Setting up your access…'}
        </p>
      </Card>
    );
  }

  // Needs payment / subscription
  if (status === 'needsPayment' && course) {
    return (
      <Card>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
             style={{ background: '#fdf6e3' }}>
          <svg className="w-7 h-7" fill="none" stroke={GOLD} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V7m0 0a5 5 0 100 10A5 5 0 0012 7z"/>
          </svg>
        </div>
        <h2 style={{ color: NAVY, fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700 }}
            className="mb-2">Unlock This Course</h2>
        <p className="text-gray-500 text-sm mb-1">{course.title}</p>
        {course.ceHours && (
          <p className="text-xs font-semibold mb-6" style={{ color: HUNTER }}>
            {course.ceHours} CE Hours
          </p>
        )}
        {course.price > 0 ? (
          <>
            <p className="text-3xl font-bold mb-6" style={{ color: BURGUNDY }}>
              ${(course.price / 100).toFixed(2)}
            </p>
            <button onClick={goToCheckout}
                    style={{ background: BURGUNDY, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 15, width: '100%' }}
                    className="mb-3">
              Purchase &amp; Enroll
            </button>
          </>
        ) : (
          <button onClick={goToCheckout}
                  style={{ background: HUNTER, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 15, width: '100%' }}
                  className="mb-3">
            Get Access
          </button>
        )}
        <button onClick={() => navigate('/settings?tab=billing')}
                className="text-sm underline" style={{ color: NAVY }}>
          View subscription plans
        </button>
      </Card>
    );
  }

  return null;
}
