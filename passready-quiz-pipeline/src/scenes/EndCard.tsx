import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, TINT, type Layout} from '../brand';
import {Monogram} from '../components/Monogram';
import {SceneFrame} from '../components/SceneFrame';
import {BODY_FONT, DISPLAY_FONT} from '../fonts';

export const EndCard: React.FC<{layout: Layout}> = ({layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const lines = spring({
    frame: frame - 12,
    fps,
    config: {damping: 200},
    durationInFrames: 20,
  });
  const short = layout === 'short';

  return (
    <SceneFrame layout={layout}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: short ? 34 : 26,
        }}
      >
        <div
          style={{
            opacity: enter,
            transform: `scale(${interpolate(enter, [0, 1], [0.86, 1])})`,
          }}
        >
          <Monogram size={short ? 220 : 180} />
        </div>
        <div
          style={{
            opacity: lines,
            transform: `translateY(${interpolate(lines, [0, 1], [26, 0])}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: short ? 26 : 20,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: short ? 56 : 48,
              lineHeight: 1.15,
              color: BRAND.navy,
            }}
          >
            Full practice exams
            <br />+ <span style={{color: BRAND.emerald}}>429 scored questions</span>
          </div>
          <div
            style={{
              height: 3,
              width: short ? 220 : 260,
              background: TINT.emeraldLine,
              borderRadius: 999,
            }}
          />
          <div
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 600,
              fontSize: short ? 34 : 30,
              lineHeight: 1.4,
              color: BRAND.navy,
            }}
          >
            The Complete NCMHCE Study Guide — link in description
          </div>
          <div
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 600,
              fontSize: short ? 32 : 28,
              lineHeight: 1.4,
              color: BRAND.emerald,
            }}
          >
            PassReady Prep app · code PASSREADY10
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
