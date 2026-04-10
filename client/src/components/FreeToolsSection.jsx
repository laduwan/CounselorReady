/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

const TOOLS = [
  {
    icon: '📝',
    title: 'AI Note Writer',
    description: 'Generate SOAP, DAP, BIRP & narrative notes from session bullet points.',
    href: '/tools/note-writer.html',
    badge: '3/day free',
  },
  {
    icon: '🧾',
    title: 'Superbill Generator',
    description: 'Create insurance-ready superbills with CPT codes, NPI & diagnosis fields.',
    href: '/tools/superbill.html',
    badge: 'Free',
  },
  {
    icon: '🚨',
    title: 'Crisis Safety Plan Builder',
    description: 'Interactive Stanley-Brown safety plan — complete with clients on-screen.',
    href: '/tools/safety-plan.html',
    badge: 'Free',
  },
  {
    icon: '📋',
    title: 'Treatment Plan Builder',
    description: 'Goals, objectives & interventions auto-populated by presenting problem.',
    href: '/tools/treatment-plan.html',
    badge: 'Free',
  },
  {
    icon: '📄',
    title: 'Informed Consent Generator',
    description: 'Customized consent packets with HIPAA, No Surprises Act & telehealth addenda.',
    href: '/tools/informed-consent.html',
    badge: 'Free',
  },
  {
    icon: '⚖️',
    title: 'Sliding Scale Calculator',
    description: 'Generate a tiered fee schedule based on federal poverty guidelines.',
    href: '/tools/sliding-scale.html',
    badge: 'Free',
  },
  {
    icon: '🔍',
    title: 'Diagnosis Quick Reference',
    description: 'DSM-5-TR lookup with differential prompts and ICD-10 code mapping.',
    href: '/tools/diagnosis-helper.html',
    badge: 'Free',
  },
  {
    icon: '🏥',
    title: 'Involuntary Hold Guide',
    description: 'State-by-state 1013 / Baker Act / 5150 criteria, forms & time limits.',
    href: '/tools/hold-guide.html',
    badge: 'Free',
  },
  {
    icon: '✅',
    title: 'Practice Startup Checklist',
    description: 'Everything a new independent clinician needs to open their doors.',
    href: '/tools/startup-checklist.html',
    badge: 'Free',
  },
];

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.counselorready.com/api';

function trackToolClick(toolHref) {
  const slug = toolHref.split('/').pop().replace('.html', '');
  const sessionId = localStorage.getItem('cr_tool_session')
    || Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('cr_tool_session', sessionId);
  localStorage.setItem('cr_tool_ref', slug);

  fetch(`${API_BASE}/tool-analytics/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolSlug: slug, sessionId, referrer: window.location.pathname }),
    keepalive: true
  }).catch(() => {});
}

export default function FreeToolsSection() {
  return (
    <section style={{ background: '#F5F5DC', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block',
            background: '#4A7C59',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: 99,
            marginBottom: 16,
          }}>
            Free Clinical Tools
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: '#6B1D34',
            margin: '0 0 16px',
            lineHeight: 1.2,
          }}>
            Built for the clinician building from scratch
          </h2>
          <p style={{
            fontSize: 17,
            color: '#4A4A4A',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            No login required. No cost. Just practical tools that save you time
            on the paperwork so you can focus on clients.
          </p>
        </div>

        {/* Tool grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {TOOLS.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              onClick={() => trackToolClick(tool.href)}
              style={{
                display: 'block',
                background: '#fff',
                border: '1px solid #E2E2BE',
                borderRadius: 12,
                padding: '20px 22px',
                textDecoration: 'none',
                transition: 'box-shadow 0.15s, border-color 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,29,52,0.12)';
                e.currentTarget.style.borderColor = '#6B1D34';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#E2E2BE';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{tool.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: '#284157',
                    }}>{tool.title}</span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      background: tool.badge === '3/day free' ? '#FDF5F7' : '#F2F7F4',
                      color: tool.badge === '3/day free' ? '#6B1D34' : '#4A7C59',
                      border: `1px solid ${tool.badge === '3/day free' ? '#F5D0D6' : '#C9D7CD'}`,
                      padding: '2px 7px',
                      borderRadius: 99,
                    }}>{tool.badge}</span>
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: '#5A5A5A',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>{tool.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/tools/index.html"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#6B1D34',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 8,
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            View All Free Tools →
          </a>
          <p style={{ marginTop: 12, fontSize: 13, color: '#888' }}>
            AI Note Writer: 3 free notes/day · Unlimited with a CounselorReady subscription
          </p>
        </div>

      </div>
    </section>
  );
}
