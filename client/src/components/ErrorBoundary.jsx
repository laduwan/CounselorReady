/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CounselorReady] React render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lato', system-ui, sans-serif", background: '#F8F7F4', padding: '2rem' }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: '#6B1D34', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <span style={{ color: '#D4A855', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 28 }}>!</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#6B1D34', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#78716c', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <pre style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.75rem', color: '#991b1b', textAlign: 'left', overflow: 'auto', maxHeight: 200, marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#4A7C59', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
