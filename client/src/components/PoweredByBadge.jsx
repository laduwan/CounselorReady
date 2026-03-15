/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';
const GOLD = '#D4A855';

/**
 * "Powered by CounselorReady" badge shown when a whitelabel partner is active.
 * Sits in the bottom-right corner of the page.
 */
export default function PoweredByBadge() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'white',
        border: '1px solid #e7e5e4',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        fontSize: '0.7rem',
        color: '#78716c',
        userSelect: 'none',
      }}
    >
      <span>Powered by</span>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.8rem' }}>
        <span style={{ color: BURGUNDY }}>Counselor</span>
        <span style={{ color: HUNTER }}>Ready</span>
      </span>
    </div>
  );
}
