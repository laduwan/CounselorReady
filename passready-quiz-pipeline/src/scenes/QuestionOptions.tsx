import React from 'react';
import {Audio, staticFile} from 'remotion';
import {type Layout} from '../brand';
import {OptionList} from '../components/OptionList';
import {QuestionStage} from '../components/QuestionStage';
import type {Question, SceneTiming} from '../types';

/** Question headline plus A-D options, staggered to the narration. */
export const QuestionOptions: React.FC<{
  question: Question;
  scene: SceneTiming;
  layout: Layout;
}> = ({question, scene, layout}) => (
  <>
    {scene.audio ? <Audio src={staticFile(scene.audio)} startFrom={0} /> : null}
    <QuestionStage
      layout={layout}
      question={question.question}
      options={
        <OptionList
          options={question.options}
          layout={layout}
          appearAt={scene.cues.options}
        />
      }
    />
  </>
);
