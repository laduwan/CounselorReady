import React from 'react';
import {Composition} from 'remotion';
import {FPS, SHORT, WIDE} from './brand';
import {waitForFonts} from './fonts';
import {loadPair} from './load';
import {compilationDuration, QuizCompilation} from './QuizCompilation';
import {QuizShort} from './QuizShort';


export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuizShort"
        component={QuizShort}
        fps={FPS}
        width={SHORT.width}
        height={SHORT.height}
        durationInFrames={FPS * 40}
        defaultProps={{
          questionId: 'PRP-Q-0001',
          question: null,
          timing: null,
        }}
        calculateMetadata={async ({props, abortSignal}) => {
          await waitForFonts();
          const {question, timing} = await loadPair(
            props.questionId,
            abortSignal,
          );
          return {
            durationInFrames: timing.durationInFrames,
            fps: timing.fps,
            props: {...props, question, timing},
          };
        }}
      />

      <Composition
        id="QuizCompilation"
        component={QuizCompilation}
        fps={FPS}
        width={WIDE.width}
        height={WIDE.height}
        durationInFrames={FPS * 120}
        defaultProps={{
          questionIds: ['PRP-Q-0001', 'PRP-Q-0002', 'PRP-Q-0003'],
          items: null,
        }}
        calculateMetadata={async ({props, abortSignal}) => {
          await waitForFonts();
          const items = [];
          for (const id of props.questionIds) {
            items.push(await loadPair(id, abortSignal));
          }
          return {
            durationInFrames: compilationDuration(items),
            props: {...props, items},
          };
        }}
      />
    </>
  );
};
