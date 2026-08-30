import React from 'react';
import {Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, TINT, type Layout} from '../brand';
import {Chip} from '../components/Chip';
import {SceneFrame} from '../components/SceneFrame';
import {BODY_FONT, DISPLAY_FONT} from '../fonts';
import type {SceneTiming} from '../types';

/**
 * Vignette read aloud, revealed line by line. Line start frames come from
 * timing.json (character share of the measured narration duration).
 */
export const Vignette: React.FC<{
  family: string;
  scene: SceneTiming;
  layout: Layout;
}> = ({family, scene, layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = scene.cues.lines ?? [];
  const fontSize = layout === 'short' ? 46 : 40;

  return (
    <SceneFrame layout={layout} justify="center">
      {scene.audio ? (
        <Audio src={staticFile(scene.audio)} startFrom={0} />
      ) : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: layout === 'short' ? 34 : 26,
        }}
      >
        <Chip label={family} fontSize={layout === 'short' ? 28 : 24} />
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 700,
            fontSize: fontSize * 0.62,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: TINT.navyMuted,
          }}
        >
          The Case
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: fontSize * 0.42,
            borderLeft: `6px solid ${BRAND.emerald}`,
            paddingLeft: layout === 'short' ? 32 : 28,
          }}
        >
          {lines.map((line, i) => {
            const enter = spring({
              frame: frame - line.startInFrames,
              fps,
              config: {damping: 200, mass: 0.7},
              durationInFrames: 16,
            });
            return (
              <div
                key={i}
                style={{
                  fontFamily: BODY_FONT,
                  fontWeight: 500,
                  fontSize,
                  lineHeight: 1.42,
                  color: BRAND.navy,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
