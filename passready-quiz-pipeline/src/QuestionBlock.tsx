import React from 'react';
import {Sequence} from 'remotion';
import {type Layout} from './brand';
import {Countdown} from './scenes/Countdown';
import {EndCard} from './scenes/EndCard';
import {Hook} from './scenes/Hook';
import {QuestionOptions} from './scenes/QuestionOptions';
import {Reveal} from './scenes/Reveal';
import {Vignette} from './scenes/Vignette';
import type {Question, QuestionTiming, SceneTiming} from './types';

export const blockScenes = (
  timing: QuestionTiming,
  includeEndCard: boolean,
): SceneTiming[] =>
  timing.scenes.filter((s) => includeEndCard || s.name !== 'endcard');

export const blockDuration = (
  timing: QuestionTiming,
  includeEndCard: boolean,
): number =>
  blockScenes(timing, includeEndCard).reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );

/**
 * One question, scene by scene. Sequence durations come straight from
 * timing.json so the visuals track the measured narration length.
 */
export const QuestionBlock: React.FC<{
  question: Question;
  timing: QuestionTiming;
  layout: Layout;
  includeEndCard?: boolean;
}> = ({question, timing, layout, includeEndCard = true}) => {
  let from = 0;
  return (
    <>
      {blockScenes(timing, includeEndCard).map((scene) => {
        const at = from;
        from += scene.durationInFrames;
        return (
          <Sequence
            key={`${timing.id}-${scene.name}`}
            from={at}
            durationInFrames={scene.durationInFrames}
            name={`${timing.id} · ${scene.name}`}
            layout="none"
          >
            {scene.name === 'hook' ? (
              <Hook family={question.family} layout={layout} />
            ) : null}
            {scene.name === 'vignette' ? (
              <Vignette
                family={question.family}
                scene={scene}
                layout={layout}
              />
            ) : null}
            {scene.name === 'question' ? (
              <QuestionOptions
                question={question}
                scene={scene}
                layout={layout}
              />
            ) : null}
            {scene.name === 'countdown' ? (
              <Countdown
                question={question}
                layout={layout}
                seconds={scene.durationInFrames / timing.fps}
                tickAudio={timing.tickAudio}
              />
            ) : null}
            {scene.name === 'reveal' ? (
              <Reveal question={question} scene={scene} layout={layout} />
            ) : null}
            {scene.name === 'endcard' ? <EndCard layout={layout} /> : null}
          </Sequence>
        );
      })}
    </>
  );
};
