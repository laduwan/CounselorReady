import React from 'react';
import {alpha, BRAND} from '../brand';
import {DISPLAY_FONT} from '../fonts';

/** PRP monogram: emerald ring, navy letterforms. */
export const Monogram: React.FC<{size: number}> = ({size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      border: `${Math.round(size * 0.055)}px solid ${BRAND.emerald}`,
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: DISPLAY_FONT,
      fontWeight: 800,
      fontSize: size * 0.3,
      letterSpacing: size * 0.01,
      color: BRAND.navy,
      boxShadow: `0 14px 36px ${alpha(BRAND.emerald, 0.2)}`,
    }}
  >
    PRP
  </div>
);
