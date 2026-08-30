import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, TINT} from '../brand';
import {DISPLAY_FONT} from '../fonts';

/**
 * Emerald progress ring that drains over `seconds`, with a per-second tick pulse.
 * Sized by `size`; the caller reserves this box so nothing overlaps it.
 */
export const CountdownRing: React.FC<{
  seconds: number;
  size: number;
}> = ({seconds, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const total = seconds * fps;
  const progress = Math.min(Math.max(frame / total, 0), 1);
  const remaining = Math.max(0, Math.ceil(seconds - frame / fps));

  const stroke = size * 0.075;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Tick pulse: a short bump at the top of every second.
  const intoSecond = frame % fps;
  const tick = interpolate(intoSecond, [0, 3, 8], [1.06, 1.02, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `scale(${tick})`,
      }}
    >
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TINT.emeraldSoft}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={BRAND.emerald}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * progress}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: size * 0.42,
          color: BRAND.navy,
        }}
      >
        {remaining}
      </div>
    </div>
  );
};
