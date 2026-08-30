import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, type Layout} from '../brand';
import {Chip} from '../components/Chip';
import {SceneFrame} from '../components/SceneFrame';
import {DISPLAY_FONT} from '../fonts';

export const Hook: React.FC<{family: string; layout: Layout}> = ({
  family,
  layout,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 18});
  const chip = spring({
    frame: frame - 8,
    fps,
    config: {damping: 200},
    durationInFrames: 16,
  });
  const big = layout === 'short' ? 96 : 92;

  return (
    <SceneFrame layout={layout}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: layout === 'short' ? 44 : 34,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              fontSize: big * 0.4,
              letterSpacing: 6,
              color: BRAND.emerald,
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            NCMHCE
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: big,
              lineHeight: 1.08,
              color: BRAND.navy,
            }}
          >
            What do you do
            <br />
            <span style={{color: BRAND.emerald}}>FIRST?</span>
          </div>
        </div>
        <div style={{opacity: chip, transform: `scale(${0.9 + 0.1 * chip})`}}>
          <Chip label={family} fontSize={layout === 'short' ? 30 : 26} />
        </div>
      </div>
    </SceneFrame>
  );
};
