/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Link } from 'react-router-dom';
import FreeToolsSection from '../components/FreeToolsSection';

export default function Landing() {
  return (
    <div className="bg-stone-50 text-gray-900 antialiased" style={{ fontFamily: "'Lato', system-ui, sans-serif" }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); }
        .bg-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: '1px solid #d5e1d7', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#6B1D34', boxShadow: '0 4px 12px rgba(107,29,52,0.3)' }}>
              <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 28 }}>
                <span style={{ color: '#D4A855', position: 'absolute', top: -4, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 20 }}>C</span>
                <span style={{ color: '#4A7C59', position: 'absolute', top: 6, left: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 16 }}>R</span>
              </span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.5rem', letterSpacing: '0.025em' }}>
              <span style={{ color: '#6b1d34' }}>Counselor</span><span style={{ color: '#4A7C59' }}>Ready</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" style={{ color: '#355E3B' }} className="text-sm font-medium tracking-wide hover:opacity-70 transition-opacity">Features</a>
            <a href="#pricing" style={{ color: '#355E3B' }} className="text-sm font-medium tracking-wide hover:opacity-70 transition-opacity">Pricing</a>
            <a href="/about.html" style={{ color: '#355E3B' }} className="text-sm font-medium tracking-wide hover:opacity-70 transition-opacity">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" style={{ color: '#355E3B' }} className="text-sm font-medium hover:opacity-70 transition-opacity">Sign in</Link>
            <Link to="/register" className="text-white text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#4A7C59' }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#F8F7F4' }}></div>
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl" style={{ background: 'rgba(212,168,85,0.15)' }}></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(56,170,246,0.1)' }}></div>
        <div className="absolute top-32 left-20 w-2 h-2 rounded-full float-animation" style={{ background: '#D4A855' }}></div>
        <div className="absolute top-48 right-32 w-3 h-3 rounded-full float-animation" style={{ background: '#38aaf6', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 rounded-full float-animation" style={{ background: '#c94d65', animationDelay: '2s' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full mb-8 shadow-lg tracking-widest" style={{ background: '#2D4F33', color: '#D4A855' }}>
            Learn. License. Lead.
          </div>

          <h1 className="mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#2d0a14' }}>
            Your CE Credits.<br />
            <span style={{ color: '#4A7C59' }}>
              Finally Organized.
            </span>
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed" style={{ color: 'rgba(53,94,59,0.8)' }}>
            Track credentials, complete courses, and stay audit-ready — all in one elegant platform designed for mental health professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="group text-white text-lg font-medium px-8 py-4 rounded-xl flex items-center gap-3 transition-all" style={{ background: '#6B1D34', boxShadow: '0 20px 40px rgba(107,29,52,0.25)' }}>
              Start 7-Day Free Trial
              <svg className="w-5 h-5" style={{ transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#features" className="font-medium flex items-center gap-2 transition-colors" style={{ color: '#355E3B' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              Learn more
            </a>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <a href="/tools/index.html" className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border-2 transition-all hover:opacity-80" style={{ borderColor: '#4A7C59', color: '#355E3B', background: 'rgba(74,124,89,0.07)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Free Clinical Tools — No account needed
            </a>
            <p className="text-sm" style={{ color: 'rgba(53,94,59,0.6)' }}>No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-medium text-sm tracking-widest uppercase" style={{ color: '#a67936' }}>Features</span>
            <h2 className="mt-3 mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, color: '#2d0a14' }}>
              Everything you need to stay compliant
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-light" style={{ color: 'rgba(53,94,59,0.8)' }}>
              Stop juggling spreadsheets and email folders. CounselorReady keeps everything in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Courses', sub: 'ACEP #7760', bg: '#6B1D34', textColor: '#fae8eb', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
              { label: 'Tracker', sub: 'Multi-state tracking', bg: '#355E3B', textColor: '#d5e1d7', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
              { label: 'Storage', sub: 'Certificate vault', bg: '#284157', textColor: '#cbd5e1', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
              { label: 'Audit Ready', sub: 'One-click packages', bg: '#D4A855', textColor: '#4a1524', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
            ].map((item) => (
              <div key={item.label} className="card-hover" style={{ background: item.bg, borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', aspectRatio: '1', cursor: 'pointer' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg className="w-8 h-8" style={{ color: '#D4A855' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{item.label}</h3>
                <p style={{ fontSize: '0.875rem', color: item.textColor }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: '#6B1D34' }}>
        <div className="bg-texture absolute inset-0 opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#D4A855' }}></div>
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['50', 'States Supported'], ['24/7', 'Access Anytime'], ['100%', 'Online Courses'], ['Free', '7-Day Trial']].map(([num, label]) => (
            <div key={label} className="p-6">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 600, color: '#D4A855', marginBottom: '0.5rem' }}>{num}</div>
              <div style={{ color: '#f5d0d6', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FREE TOOLS ── */}
      <FreeToolsSection />

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-medium text-sm tracking-widest uppercase" style={{ color: '#a67936' }}>Pricing</span>
            <h2 className="mt-3 mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, color: '#2d0a14' }}>
              Simple, transparent pricing
            </h2>
            <p className="text-lg font-light" style={{ color: 'rgba(53,94,59,0.8)' }}>Choose the plan that works best for your practice</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm card-hover hover:shadow-xl" style={{ borderColor: '#d5e1d7' }}>
              <div className="font-medium uppercase text-sm tracking-wide mb-3" style={{ color: '#4A7C59' }}>Free</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 600, color: '#6b1d34' }}>$0</span>
                <span className="font-light" style={{ color: '#6a9472' }}>/forever</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                {['4 CE hours', 'Unlimited certificate uploads', 'Secure document vault'].map(f => (
                  <li key={f} className="flex items-start gap-2" style={{ color: '#355E3B' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4A7C59' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center w-full py-3 font-semibold rounded-xl transition-all text-sm border-2 hover:opacity-80" style={{ borderColor: '#4A7C59', color: '#355E3B' }}>
                Get Started Free
              </Link>
            </div>

            {/* Starter */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm card-hover hover:shadow-xl" style={{ borderColor: '#d5e1d7' }}>
              <div className="font-medium uppercase text-sm tracking-wide mb-3" style={{ color: '#4A7C59' }}>Starter</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 600, color: '#6b1d34' }}>$19.99</span>
                <span className="font-light" style={{ color: '#6a9472' }}>/mo</span>
              </div>
              <p className="text-xs mb-4" style={{ color: '#6a9472' }}>Everything in Free, plus:</p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Unlimited CE hours', 'CE tracking', 'AI credential scanning', 'Audit-ready reports'].map(f => (
                  <li key={f} className="flex items-start gap-2" style={{ color: '#355E3B' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4A7C59' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register?plan=starter" className="block text-center w-full py-3 text-white font-semibold rounded-xl transition-all text-sm hover:opacity-90" style={{ background: '#4A7C59' }}>
                Start Starter
              </Link>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-2xl p-6 shadow-lg card-hover hover:shadow-xl relative border-2" style={{ borderColor: '#D4A855' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#D4A855', color: '#4a1524' }}>POPULAR</div>
              <div className="font-medium uppercase text-sm tracking-wide mb-3" style={{ color: '#a67936' }}>Professional</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 600, color: '#6b1d34' }}>$29.99</span>
                <span className="font-light" style={{ color: '#6a9472' }}>/mo</span>
              </div>
              <p className="text-xs mb-4" style={{ color: '#6a9472' }}>Everything in Starter, plus:</p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Specialty credential tracking (BC-TMH, CPCS, etc.)', 'Access to certification courses (Grief, Anger Mgmt, Business Coaching)'].map(f => (
                  <li key={f} className="flex items-start gap-2" style={{ color: '#355E3B' }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#D4A855' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register?plan=professional" className="block text-center w-full py-3 font-semibold rounded-xl transition-all text-sm hover:opacity-90" style={{ background: '#D4A855', color: '#4a1524' }}>
                Go Professional
              </Link>
            </div>

            {/* VIP */}
            <div className="relative rounded-2xl p-6 text-white shadow-2xl card-hover overflow-hidden" style={{ background: '#6B1D34' }}>
              <div className="bg-texture absolute inset-0 opacity-5"></div>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#D4A855' }}></div>
              <div className="relative z-10">
                <div className="font-medium uppercase text-sm tracking-wide mb-3" style={{ color: '#D4A855' }}>VIP</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 600 }}>$49.99</span>
                  <span className="font-light" style={{ color: '#f5d0d6' }}>/mo</span>
                </div>
                <p className="text-xs mb-4" style={{ color: '#f5d0d6' }}>Everything in Professional, plus:</p>
                <ul className="space-y-3 mb-8 text-sm">
                  {['Multi-state license tracking', 'Renewal reminders (text & calendar)', '1 hardship month/year (rolls over)', 'Quarterly 1:1 strategy session', 'Early access to live webinars'].map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#D4A855' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register?plan=vip" className="block text-center w-full py-3 font-bold rounded-xl transition-all text-sm hover:opacity-90" style={{ background: '#D4A855', color: '#4a1524' }}>
                  Go VIP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 px-4 bg-white border-t" style={{ borderColor: '#d5e1d7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6" style={{ color: '#D4A855' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="mb-6 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 500, fontStyle: 'italic', color: '#6b1d34' }}>
            "Finally, a CE platform that understands what counselors actually need. I went from dreading renewal time to feeling completely organized."
          </blockquote>
          <div style={{ color: '#4A7C59' }}>
            <span className="font-semibold">Dr. Sarah Mitchell</span> · Licensed Professional Counselor, Georgia
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: '#355E3B' }}>
        <div className="bg-texture absolute inset-0 opacity-5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: '#D4A855' }}></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, color: 'white' }}>
            Ready to simplify your CE tracking?
          </h2>
          <p className="mb-10 text-lg font-light" style={{ color: '#b5ccb9' }}>
            Join counselors across the country who trust CounselorReady to keep their credentials organized.
          </p>
          <Link to="/register" className="group inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all shadow-2xl hover:opacity-90" style={{ background: 'white', color: '#6b1d34' }}>
            Start Your Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-4" style={{ background: '#1F3825' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#6B1D34' }}>
                <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 28 }}>
                  <span style={{ color: '#D4A855', position: 'absolute', top: -4, left: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 20 }}>C</span>
                  <span style={{ color: '#4A7C59', position: 'absolute', top: 6, left: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 16 }}>R</span>
                </span>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.5rem' }}>
                <span style={{ color: 'white' }}>Counselor</span><span style={{ color: '#D4A855' }}>Ready</span>
              </span>
            </div>
            <nav className="flex items-center gap-8">
              {[['#features', 'Features'], ['#pricing', 'Pricing'], ['/about.html', 'About'], ['/help.html', 'Help'], ['mailto:support@counselorready.com', 'Contact']].map(([href, label]) => (
                <a key={label} href={href} className="text-sm transition-colors hover:text-white" style={{ color: '#b5ccb9' }}>{label}</a>
              ))}
            </nav>
          </div>

          <div className="py-8 mb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <img src="/images/nbcc-acep-logo.jpg" alt="NBCC Approved Continuing Education Provider" className="h-20 w-auto" />
              <div className="text-center md:text-left">
                <p className="text-white font-semibold text-sm">NBCC Approved Provider</p>
                <p className="text-sm" style={{ color: '#f5d0d6' }}>ACEP #7760</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-center max-w-4xl mx-auto" style={{ color: 'rgba(212,168,85,0.6)' }}>
              CounselorReady is operated by Ga Integrated Therapeutic Perspectives LLC, an NBCC Approved Continuing Education Provider (ACEP #7760). Programs that do not qualify for NBCC credit are clearly identified. Ga Integrated Therapeutic Perspectives LLC is solely responsible for all aspects of the programs. NCMHCE® is a registered trademark of the National Board for Certified Counselors, Inc. (NBCC). CounselorReady is not affiliated with, endorsed by, or sponsored by NBCC.
            </p>
          </div>

          <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(107,29,52,0.4)' }}>
            <p className="text-sm" style={{ color: 'rgba(212,168,85,0.5)' }}>© 2025 CounselorReady. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {[['privacy.html', 'Privacy Policy'], ['terms.html', 'Terms of Service'], ['refund-policy.html', 'Refund Policy']].map(([href, label]) => (
                <a key={label} href={`/${href}`} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(212,168,85,0.5)' }}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
