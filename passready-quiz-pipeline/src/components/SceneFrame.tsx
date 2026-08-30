import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE, type Layout} from '../brand';

/**
 * Applies the layout's safe margins. For Shorts that is >=120px from the top
 * and >=220px from the bottom, keeping all copy clear of the Shorts UI.
 */
export const SceneFrame: React.FC<{
  layout: Layout;
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
}> = ({layout, children, justify = 'center'}) => {
  const safe = SAFE[layout];
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        paddingLeft: safe.side,
        paddingRight: safe.side,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
