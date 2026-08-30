import React from 'react';
import {type Layout} from '../brand';
import {BRAND} from '../brand';
import {SceneFrame} from './SceneFrame';
import {DISPLAY_FONT} from '../fonts';

/** Ring box height reserved in BOTH the question and countdown scenes so the
 * option list never shifts and never collides with the countdown ring. */
export const RING_SIZE = {short: 210, wide: 170} as const;
const RING_GAP = {short: 34, wide: 24} as const;

/**
 * Shared stage for the question, countdown and reveal scenes: question
 * headline on top, options in the middle, a reserved ring slot at the bottom.
 */
export const QuestionStage: React.FC<{
  layout: Layout;
  question: string;
  options: React.ReactNode;
  /** Rendered inside the reserved bottom slot. Slot is reserved either way. */
  ringSlot?: React.ReactNode;
  headerScale?: number;
}> = ({layout, question, options, ringSlot, headerScale = 1}) => {
  const qFont = (layout === 'short' ? 56 : 46) * headerScale;
  return (
    <SceneFrame layout={layout} justify="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: layout === 'short' ? 36 : 26,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 800,
            fontSize: qFont,
            lineHeight: 1.18,
            color: BRAND.navy,
          }}
        >
          {question}
        </div>
        {options}
        <div
          style={{
            minHeight: RING_SIZE[layout] + RING_GAP[layout],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: RING_GAP[layout],
          }}
        >
          {ringSlot ?? null}
        </div>
      </div>
    </SceneFrame>
  );
};
