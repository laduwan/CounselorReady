import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, type Layout} from '../brand';
import {Background} from '../components/Background';
import {Monogram} from '../components/Monogram';
import {SceneFrame} from '../components/SceneFrame';
import {DISPLAY_FONT} from '../fonts';

/** 1s sting inserted between questions in a compilation. */
export const BrandSting: React.FC<{layout: Layout; label: string}> = ({
  layout,
  label,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 10});
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <Background>
      <SceneFrame layout={layout}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            opacity: Math.min(enter, exit),
            transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
          }}
        >
          <Monogram size={layout === 'short' ? 150 : 130} />
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: layout === 'short' ? 54 : 48,
              color: BRAND.navy,
            }}
          >
            {label}
          </div>
        </div>
      </SceneFrame>
    </Background>
  );
};
