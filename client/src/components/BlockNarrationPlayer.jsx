// components/BlockNarrationPlayer.jsx
// ====================================
// Lightweight audio player that attaches to any content block
// in the learner course view. Shows a small play/pause bar
// above or below the block content.
//
// Usage:
//   <BlockNarrationPlayer src={block.narrationUrl} />
//
// Accessibility features:
//   - Keyboard accessible (Space/Enter to play/pause)
//   - Screen reader labels
//   - Playback speed control (0.75x – 2x)
//   - Visible progress and time
// ====================================

import { useState, useRef, useEffect } from 'react';

const BURGUNDY = '#6B1D34';
const GREEN = '#4A7C59';

export default function BlockNarrationPlayer({ src, label = 'Listen to this section' }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime);
    const onLoad = () => { setDuration(a.duration); setLoaded(true); };
    const onEnd = () => { setPlaying(false); setProgress(0); };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoad);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoad);
      a.removeEventListener('ended', onEnd);
    };
  }, [src]);

  if (!src) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause(); else a.play();
    setPlaying(!playing);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) audioRef.current.currentTime = pct * duration;
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const handleKey = (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', margin: '6px 0',
        background: 'rgba(107,29,52,0.06)', borderRadius: 10,
        border: '1px solid rgba(107,29,52,0.12)',
        fontSize: 13,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause */}
      <button
        onClick={toggle}
        onKeyDown={handleKey}
        aria-label={playing ? 'Pause narration' : 'Play narration'}
        style={{
          width: 34, height: 34, borderRadius: '50%',
          background: BURGUNDY, color: '#fff',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'transform 0.1s',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {playing ? (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <rect x="0" y="0" width="4" height="14" rx="1" />
            <rect x="8" y="0" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <polygon points="0,0 12,7 0,14" />
          </svg>
        )}
      </button>

      {/* Label */}
      <span style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
        🎧
      </span>

      {/* Progress bar */}
      <div
        onClick={seek}
        role="slider"
        aria-label="Narration progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(progress)}
        tabIndex={0}
        style={{
          flex: 1, height: 6, background: 'rgba(107,29,52,0.15)',
          borderRadius: 3, cursor: 'pointer', position: 'relative',
          minWidth: 80,
        }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`, background: BURGUNDY, borderRadius: 3,
          transition: 'width 0.15s',
        }} />
        {/* Thumb */}
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: BURGUNDY, border: '2px solid #fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          opacity: playing || progress > 0 ? 1 : 0,
          transition: 'opacity 0.15s',
        }} />
      </div>

      {/* Time */}
      <span style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(progress)} / {fmt(duration)}
      </span>

      {/* Speed control */}
      <button
        onClick={cycleSpeed}
        aria-label={`Playback speed ${speed}x. Click to change.`}
        title={`Speed: ${speed}x`}
        style={{
          background: speed !== 1 ? GREEN : 'rgba(0,0,0,0.06)',
          color: speed !== 1 ? '#fff' : '#6B7280',
          border: 'none', borderRadius: 6,
          padding: '3px 7px', fontSize: 10, fontWeight: 700,
          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'all 0.15s',
        }}
      >
        {speed}x
      </button>
    </div>
  );
}
