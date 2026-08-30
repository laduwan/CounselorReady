import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from './components/Background';
import {QuestionBlock} from './QuestionBlock';
import type {ShortProps} from './types';

/** 1080x1920 vertical Short — one question per video. */
export const QuizShort: React.FC<ShortProps> = ({question, timing}) => {
  if (!question || !timing) {
    return <AbsoluteFill />;
  }
  return (
    <Background>
      <QuestionBlock question={question} timing={timing} layout="short" />
    </Background>
  );
};
