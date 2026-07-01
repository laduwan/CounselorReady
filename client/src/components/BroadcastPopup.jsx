/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Info, Wrench, Gift, Megaphone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const TYPE_CONFIG = {
  urgent:      { icon: AlertTriangle, bg: '#FEF2F2', border: '#DC2626', accent: '#991B1B', label: 'Urgent Notice' },
  maintenance: { icon: Wrench,        bg: '#FFFBEB', border: '#D97706', accent: '#92400E', label: 'Maintenance' },
  info:        { icon: Info,          bg: '#F5F0F2', border: '#6B1D34', accent: '#6B1D34', label: 'Announcement' },
  update:      { icon: Megaphone,     bg: '#F0FDF4', border: '#4A7C59', accent: '#4A7C59', label: 'Update' },
  promotion:   { icon: Gift,          bg: '#FAF5FF', border: '#7C3AED', accent: '#5B21B6', label: 'Promotion' },
  ce_change:   { icon: AlertTriangle, bg: '#FFFBEB', border: '#D97706', accent: '#92400E', label: 'CE Requirement Change' },
  new_course:  { icon: Megaphone,     bg: '#F0FDF4', border: '#4A7C59', accent: '#4A7C59', label: 'New Course' },
};

export default function BroadcastPopup() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get('/announcements');
        const items = data.announcements || [];
        // Only show undismissed, unread announcements
        const unread = items.filter(a => !a.isRead);
        if (!cancelled && unread.length > 0) {
          // Check sessionStorage so we don't re-show within same session
          const dismissed = JSON.parse(sessionStorage.getItem('cr_dismissed_broadcasts') || '[]');
          const toShow = unread.filter(a => !dismissed.includes(a._id));
          if (toShow.length > 0) {
            setAnnouncements(toShow);
            setVisible(true);
          }
        }
      } catch {
        // Silently fail — don't block the app
      }
    };
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, []);

  // Focus trap
  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [visible, currentIndex]);

  const handleDismiss = useCallback(async () => {
    if (dismissing) return;
    setDismissing(true);
    const current = announcements[currentIndex];
    try {
      await api.put(`/announcements/${current._id}/dismiss`);
    } catch {
      // Still dismiss locally even if API fails
    }
    // Track in sessionStorage
    const dismissed = JSON.parse(sessionStorage.getItem('cr_dismissed_broadcasts') || '[]');
    dismissed.push(current._id);
    sessionStorage.setItem('cr_dismissed_broadcasts', JSON.stringify(dismissed));

    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setVisible(false);
    }
    setDismissing(false);
  }, [announcements, currentIndex, dismissing]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  }, [handleDismiss]);

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIndex];
  const config = TYPE_CONFIG[current.type] || TYPE_CONFIG.info;
  const Icon = config.icon;
  const hasMultiple = announcements.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={config.label}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', outline: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ backgroundColor: config.accent, color: '#FFFFFF' }}
        >
          <Icon className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium opacity-90">{config.label}</p>
            <h2 className="text-lg font-bold truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {current.title}
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss announcement"
            disabled={dismissing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5" style={{ backgroundColor: config.bg }}>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Lato', sans-serif" }}>
            {current.message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100">
          {hasMultiple ? (
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {announcements.length}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {hasMultiple && currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={handleDismiss}
              disabled={dismissing}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors"
              style={{
                backgroundColor: config.accent,
                color: '#FFFFFF',
                opacity: dismissing ? 0.6 : 1,
              }}
            >
              {currentIndex < announcements.length - 1 ? 'Next' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
