import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FPS} from './brand';
import {Background} from './components/Background';
import {blockDuration, QuestionBlock} from './QuestionBlock';
import {EndCard} from './scenes/EndCard';
import {BrandSting} from './scenes/BrandSting';
import type {CompilationProps} from './types';

export const STING_FRAMES = FPS; // 1s brand sting between questions
export const COMP_ENDCARD_FRAMES = FPS * 5;

/** 1920x1080 horizontal compilation — N questions back to back. */
export const QuizCompilation: React.FC<CompilationProps> = ({items}) => {
  if (!items || items.length === 0) {
    return <AbsoluteFill />;
  }

  let from = 0;
  const parts: React.ReactNode[] = [];

  items.forEach((item, i) => {
    if (i > 0) {
      const at = from;
      parts.push(
        <Sequence
          key={`sting-${i}`}
          from={at}
          durationInFrames={STING_FRAMES}
          name={`sting ${i}`}
          layout="none"
        >
          <BrandSting layout="wide" label={`Question ${i + 1}`} />
        </Sequence>,
      );
      from += STING_FRAMES;
    }

    const dur = blockDuration(item.timing, false);
    const at = from;
    parts.push(
      <Sequence
        key={`q-${item.question.id}`}
        from={at}
        durationInFrames={dur}
        name={item.question.id}
        layout="none"
      >
        <Background>
          <QuestionBlock
            question={item.question}
            timing={item.timing}
            layout="wide"
            includeEndCard={false}
          />
        </Background>
      </Sequence>,
    );
    from += dur;
  });

  parts.push(
    <Sequence
      key="endcard"
      from={from}
      durationInFrames={COMP_ENDCARD_FRAMES}
      name="end card"
      layout="none"
    >
      <Background>
        <EndCard layout="wide" />
      </Background>
    </Sequence>,
  );

  return <AbsoluteFill>{parts}</AbsoluteFill>;
};

export const compilationDuration = (
  timings: {timing: {scenes: {name: string; durationInFrames: number}[]}}[],
): number => {
  const blocks = timings.reduce(
    (sum, t) =>
      sum +
      t.timing.scenes
        .filter((s) => s.name !== 'endcard')
        .reduce((a, s) => a + s.durationInFrames, 0),
    0,
  );
  const stings = Math.max(0, timings.length - 1) * STING_FRAMES;
  return blocks + stings + COMP_ENDCARD_FRAMES;
};
