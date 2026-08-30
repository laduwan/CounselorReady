import React from 'react';
import {Audio, staticFile} from 'remotion';
import {TINT, type Layout} from '../brand';
import {CountdownRing} from '../components/CountdownRing';
import {OptionList} from '../components/OptionList';
import {QuestionStage, RING_SIZE} from '../components/QuestionStage';
import {BODY_FONT} from '../fonts';
import type {Question} from '../types';

/** Fixed 5s beat: emerald ring drains, options stay visible. */
export const Countdown: React.FC<{
  question: Question;
  layout: Layout;
  seconds: number;
  tickAudio: string | null;
}> = ({question, layout, seconds, tickAudio}) => (
  <>
    {tickAudio ? <Audio src={staticFile(tickAudio)} volume={0.35} /> : null}
    <QuestionStage
      layout={layout}
      question={question.question}
      options={<OptionList options={question.options} layout={layout} />}
      ringSlot={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: layout === 'short' ? 14 : 10,
          }}
        >
          <CountdownRing seconds={seconds} size={RING_SIZE[layout] * 0.78} />
          <div
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 600,
              fontSize: layout === 'short' ? 28 : 24,
              color: TINT.navyMuted,
              letterSpacing: 0.4,
            }}
          >
            Pause if you need more time
          </div>
        </div>
      }
    />
  </>
);
