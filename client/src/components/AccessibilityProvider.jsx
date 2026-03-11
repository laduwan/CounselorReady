/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccessibilityContext = createContext();

const DEFAULT_SETTINGS = {
  fontSize: 'normal',        // 'small', 'normal', 'large', 'x-large'
  highContrast: false,
  reducedMotion: false,
  focusIndicators: true,
  screenReaderMode: false,
  lineSpacing: 'normal',     // 'normal', 'relaxed', 'loose'
  dyslexiaFont: false,
};

const FONT_SIZES = {
  small: '14px',
  normal: '16px',
  large: '18px',
  'x-large': '20px',
};

const LINE_SPACINGS = {
  normal: '1.5',
  relaxed: '1.75',
  loose: '2',
};

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cr-accessibility');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    root.style.fontSize = FONT_SIZES[settings.fontSize] || '16px';
    root.style.lineHeight = LINE_SPACINGS[settings.lineSpacing] || '1.5';

    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('focus-visible-enhanced', settings.focusIndicators);
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont);

    // Set prefers-reduced-motion override
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Persist
    localStorage.setItem('cr-accessibility', JSON.stringify(settings));
  }, [settings]);

  // Detect system preferences on mount
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    if (motionQuery.matches && !settings.reducedMotion) {
      setSettings(s => ({ ...s, reducedMotion: true }));
    }
    if (contrastQuery.matches && !settings.highContrast) {
      setSettings(s => ({ ...s, highContrast: true }));
    }
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(s => ({ ...s, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

// ── Skip-to-content link (WCAG 2.4.1) ──
export function SkipToContent({ targetId = 'main-content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-burgundy-700 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
    >
      Skip to main content
    </a>
  );
}

// ── Accessibility Settings Panel ──
export function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
        className="fixed bottom-4 right-4 z-50 p-3 bg-burgundy-700 text-white rounded-full shadow-lg hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
        title="Accessibility Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Accessibility Settings"
      aria-modal="true"
      className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-5"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Accessibility</h2>
        <button onClick={() => setIsOpen(false)} aria-label="Close accessibility settings" className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Size</label>
          <select
            value={settings.fontSize}
            onChange={e => updateSetting('fontSize', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            aria-label="Text size"
          >
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="x-large">Extra Large</option>
          </select>
        </div>

        {/* Line Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Line Spacing</label>
          <select
            value={settings.lineSpacing}
            onChange={e => updateSetting('lineSpacing', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            aria-label="Line spacing"
          >
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
            <option value="loose">Loose</option>
          </select>
        </div>

        {/* Toggles */}
        {[
          { key: 'highContrast', label: 'High Contrast' },
          { key: 'reducedMotion', label: 'Reduce Motion' },
          { key: 'focusIndicators', label: 'Enhanced Focus Indicators' },
          { key: 'dyslexiaFont', label: 'Dyslexia-Friendly Font' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">{label}</span>
            <button
              role="switch"
              aria-checked={settings[key]}
              onClick={() => updateSetting(key, !settings[key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[key] ? 'bg-burgundy-700' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        ))}

        <button
          onClick={resetSettings}
          className="w-full mt-2 text-sm text-burgundy-700 hover:text-burgundy-900 underline"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

export default AccessibilityProvider;
