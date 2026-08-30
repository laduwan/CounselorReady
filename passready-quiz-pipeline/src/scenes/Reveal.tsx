import React from 'react';
import {
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, OPTION_LETTERS, TINT, type Layout} from '../brand';
import {Chip} from '../components/Chip';
import {OptionList} from '../components/OptionList';
import {QuestionStage} from '../components/QuestionStage';
import {BODY_FONT, DISPLAY_FONT} from '../fonts';
import type {Question, SceneTiming} from '../types';

/** Correct option highlights emerald, others dim, rationale card slides up. */
export const Reveal: React.FC<{
  question: Question;
  scene: SceneTiming;
  layout: Layout;
}> = ({question, scene, layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const correctIndex = Math.max(
    0,
    question.options.findIndex((o) => o.isCorrect),
  );
  const rationaleStart = scene.cues.rationaleStartInFrames ?? 0;
  const slide = spring({
    frame: frame - rationaleStart,
    fps,
    config: {damping: 200, mass: 0.8},
    durationInFrames: 20,
  });

  return (
    <>
      {scene.audio ? <Audio src={staticFile(scene.audio)} startFrom={0} /> : null}
      <QuestionStage
        layout={layout}
        question={question.question}
        headerScale={0.78}
        options={
          <OptionList
            options={question.options}
            layout={layout}
            revealed
            revealAt={scene.audioStartInFrames}
          />
        }
        ringSlot={
          <div
            style={{
              width: '100%',
              opacity: slide,
              transform: `translateY(${interpolate(slide, [0, 1], [70, 0])}px)`,
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: layout === 'short' ? 28 : 22,
                border: `2px solid ${TINT.emeraldLine}`,
                boxShadow: TINT.cardShadow,
                padding: layout === 'short' ? '30px 34px' : '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: layout === 'short' ? 16 : 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 800,
                    fontSize: layout === 'short' ? 32 : 27,
                    color: BRAND.emerald,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}
                >
                  Answer: {OPTION_LETTERS[correctIndex]}
                </div>
                {question.rung ? (
                  <Chip
                    label={`Priority Ladder — Rung ${question.rung}`}
                    tone="navy"
                    fontSize={layout === 'short' ? 22 : 19}
                  />
                ) : null}
              </div>
              <div
                style={{
                  fontFamily: BODY_FONT,
                  fontWeight: 500,
                  fontSize: layout === 'short' ? 34 : 28,
                  lineHeight: 1.4,
                  color: BRAND.navy,
                }}
              >
                {question.rationale}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
