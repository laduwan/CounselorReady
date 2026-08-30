import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, BRAND, OPTION_LETTERS, TINT, type Layout} from '../brand';
import {BODY_FONT, DISPLAY_FONT} from '../fonts';
import type {QuestionOption} from '../types';

const SIZES = {
  short: {font: 36, letter: 44, padY: 22, padX: 26, gap: 18, radius: 22},
  wide: {font: 30, letter: 38, padY: 16, padX: 22, gap: 13, radius: 18},
} as const;

export const OptionList: React.FC<{
  options: QuestionOption[];
  layout: Layout;
  /** Frame (relative to the current Sequence) at which each row appears. */
  appearAt?: number[];
  /** When true the correct row goes emerald and the rest dim. */
  revealed?: boolean;
  /** Frame at which the reveal styling starts animating. */
  revealAt?: number;
}> = ({options, layout, appearAt, revealed = false, revealAt = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = SIZES[layout];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: s.gap}}>
      {options.map((opt, i) => {
        const start = appearAt?.[i] ?? 0;
        const enter = spring({
          frame: frame - start,
          fps,
          config: {damping: 200, mass: 0.6},
          durationInFrames: 14,
        });
        const revealProgress = revealed
          ? spring({
              frame: frame - revealAt,
              fps,
              config: {damping: 200},
              durationInFrames: 12,
            })
          : 0;

        // Nothing is highlighted until the reveal scene — the countdown must
        // not give the answer away.
        const isCorrect = revealed && opt.isCorrect;
        const isWrong = revealed && !opt.isCorrect;

        // Brief muted-red flash on the distractors as the answer lands, then
        // they settle back and dim. Used sparingly, per the brand tokens.
        const flash = isWrong
          ? interpolate(
              frame - revealAt,
              [0, 4, 14, 24],
              [0, 1, 1, 0],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            )
          : 0;

        const bg = isCorrect
          ? alpha(BRAND.emerald, 0.1 + 0.06 * revealProgress)
          : flash > 0
            ? alpha(BRAND.wrong, 0.12 * flash)
            : '#FFFFFF';
        const border = isCorrect
          ? BRAND.emerald
          : flash > 0
            ? alpha(BRAND.wrong, 0.55 * flash)
            : alpha(BRAND.navy, interpolate(revealProgress, [0, 1], [0.16, 0.06]));
        const borderWidth = isCorrect
          ? interpolate(revealProgress, [0, 1], [2, 4])
          : 2;
        const dim = opt.isCorrect
          ? 1
          : interpolate(revealProgress, [0, 1], [1, 0.34]);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: s.padX * 0.7,
              padding: `${s.padY}px ${s.padX}px`,
              borderRadius: s.radius,
              background: bg,
              border: `${borderWidth}px solid ${border}`,
              boxShadow:
                isCorrect && revealProgress > 0.2
                  ? `0 10px 30px ${alpha(BRAND.emerald, 0.22 * revealProgress)}`
                  : `0 6px 18px ${alpha(BRAND.navy, 0.06)}`,
              opacity: enter * dim,
              transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
            }}
          >
            <div
              style={{
                flex: '0 0 auto',
                width: s.letter * 1.35,
                height: s.letter * 1.35,
                borderRadius: 999,
                background: isCorrect
                  ? alpha(BRAND.emerald, 0.14 + 0.86 * revealProgress)
                  : TINT.navySoft,
                color: isCorrect && revealProgress > 0.5 ? '#FFFFFF' : BRAND.navy,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: DISPLAY_FONT,
                fontWeight: 800,
                fontSize: s.letter * 0.72,
              }}
            >
              {OPTION_LETTERS[i]}
            </div>
            <div
              style={{
                fontFamily: BODY_FONT,
                fontWeight: isCorrect && revealProgress > 0.5 ? 700 : 500,
                fontSize: s.font,
                lineHeight: 1.3,
                color: BRAND.navy,
              }}
            >
              {opt.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
