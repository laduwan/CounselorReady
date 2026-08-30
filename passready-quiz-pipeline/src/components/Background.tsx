import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {BRAND} from '../brand';
import {NetworkMotif} from './NetworkMotif';

export const Background: React.FC<{children?: React.ReactNode}> = ({
  children,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${BRAND.mintTop} 0%, ${BRAND.mintBottom} 100%)`,
      }}
    >
      <NetworkMotif
        width={width}
        height={height}
        size={height > width ? 300 : 240}
      />
      {children}
    </AbsoluteFill>
  );
};
